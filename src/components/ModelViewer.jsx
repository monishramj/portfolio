/* eslint-disable react-hooks/immutability -- Three.js owns mutable camera and scene objects. */
import { Suspense, useRef, useState, useLayoutEffect, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { OrbitControls, useGLTF, useProgress, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const deg2rad = d => (d * Math.PI) / 180;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const DECIDE = 8;
const PARALLAX_MAG = 0.05;
const PARALLAX_EASE = 0.12;
const HOVER_MAG = deg2rad(6);
const HOVER_EASE = 0.15;

const Loader = ({ placeholderSrc }) => {
  const { progress, active } = useProgress();
  if (!active && placeholderSrc) return null;
  return (
    <Html center>
      {placeholderSrc ? (
        <img src={placeholderSrc} width={128} height={128} style={{ filter: 'blur(8px)', borderRadius: 8 }} />
      ) : (
        `${Math.round(progress)} %`
      )}
    </Html>
  );
};

const DesktopControls = ({ target, min, max, zoomEnabled }) => {
  const ref = useRef(null);
  useFrame(() => { if (ref.current) ref.current.target.copy(target); });
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom={zoomEnabled}
      minDistance={min}
      maxDistance={max}
    />
  );
};

// useGLTF at top level of ModelInner so the component itself suspends — same as original
// design but without the hooks-in-useMemo React 19 violation.
// When ModelInner suspends, the entire subtree (including groups) mounts atomically once
// the model is ready, so refs are always fresh and there are no stale transform issues.
const SCREEN_MESHES = ['screennoise', 'screennosignal', 'screenchannel', 'standby', 'screennoise'];
// channel change: the picture dims, swaps while dark, then comes back up
const DIP_OUT = 0.06, DIP_IN = 0.11, DIP_LOW = 0.12;
const DOILY_SCALE = 1.22; // the white pixel-art doily draped over the TV's front-top, scaled up about its own centre
const PIXEL = 3; // screen images are drawn at 1/PIXEL of the texture's resolution, so they look slightly pixelated
const FRAME_DROP = 0.06; // frames a little above the subject, which sits the TV lower in its stage (share of the visible height)
const SCREEN_FORWARD = 0.8; // how far the image moves from its recess towards the glass (0 = original, 1 = touching)

const ModelInner = ({
  url, pivot, initYaw, initPitch, defaultZoom, minZoom, maxZoom,
  enableMouseParallax, enableManualRotation, enableHoverRotation, enableManualZoom,
  autoFrame, focusScreen, fadeIn, autoRotate, autoRotateSpeed, onLoaded,
  modelXOffset, modelYOffset, screenTextureSrc, screenTextureFit, screenTextureFocus, screenDip,
  focus, instantFocus, children,
}) => {
  const { scene } = useGLTF(url);
  const content = useMemo(() => scene.clone(), [scene]);

  const root = useRef(null);
  const tv = useRef(null);
  const [bounds, setBounds] = useState(null);
  const boundsRef = useRef(null);
  const focusTarget = useRef(null);
  const focusCur = useRef(null);
  const screenMeshRef = useRef(null);
  const screenMat = useRef(null); // one material for the screen; only its map changes between channels
  const dip = useRef(null);
  const screenAspectRef = useRef(1);
  const { camera, gl, size: viewport } = useThree();

  const vel  = useRef({ x: 0, y: 0 });
  const tPar = useRef({ x: 0, y: 0 });
  const cPar = useRef({ x: 0, y: 0 });
  const tHov = useRef({ x: 0, y: 0 });
  const cHov = useRef({ x: 0, y: 0 });
  const ready = useRef(false);
  const _ndcTmp = useRef(new THREE.Vector3()); // pre-allocated — avoids GC in useFrame

  useLayoutEffect(() => {
    if (!root.current || !content) return;

    // Enlarge the doily. Its vertices are the ones that map to its patch of the texture atlas
    // (u > .40, v > .85) and sit on the front of the TV; the geometry is shared, so only do it once.
    const tvGeo = content.getObjectByName('TV_Tv_0')?.geometry;
    if (tvGeo && !tvGeo.userData.doilyScaled) {
      tvGeo.userData.doilyScaled = true;
      const pos = tvGeo.attributes.position, uv = tvGeo.attributes.uv, ids = [];
      for (let i = 0; i < pos.count; i++) if (uv.getX(i) > 0.4 && uv.getY(i) > 0.85 && pos.getZ(i) > 3.8) ids.push(i);
      if (ids.length) {
        const c = new THREE.Vector3();
        ids.forEach(i => c.add(new THREE.Vector3().fromBufferAttribute(pos, i)));
        c.divideScalar(ids.length);
        ids.forEach(i => pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * DOILY_SCALE, c.y + (pos.getY(i) - c.y) * DOILY_SCALE, pos.getZ(i)));
        pos.needsUpdate = true;
        tvGeo.computeBoundingBox(); tvGeo.computeBoundingSphere();
      }
    }

    const box = new THREE.Box3().setFromObject(content);
    if (box.isEmpty()) return;

    const center  = new THREE.Vector3();
    const size    = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) return;

    const s = 1 / maxDim;
    content.position.sub(center);
    tv.current.scale.setScalar(s);
    tv.current.rotation.set(initPitch, initYaw, 0);
    pivot.set(0, 0, 0);
    // TV extents in normalised world units, so children (e.g. the shelf) can sit flush under it
    // named parts in the same normalised space (table, VCR/tape meshes), so the shelf can sit inside the table
    root.current.updateMatrixWorld(true);
    const part = match => {
      const b = new THREE.Box3();
      content.traverse(o => { if (o.isMesh && o.name.toLowerCase().includes(match)) b.expandByObject(o); });
      return b.isEmpty() ? null : { min: b.min.toArray(), max: b.max.toArray() };
    };
    let tableMaterial = null;
    content.traverse(o => { if (o.isMesh && o.name.toLowerCase().includes('table')) tableMaterial = o.material; });
    const parts = { table: part('table'), midShelf: part('vhs_reader001'), tableMaterial };
    boundsRef.current = { width: size.x * s, height: size.y * s, depth: size.z * s, bottomY: -size.y * s / 2, ...parts };
    setBounds(boundsRef.current);

    if (autoFrame && camera.isPerspectiveCamera) {
      // defaultZoom scales the fit distance: 1.5 (default) = comfortable padding, 1 = tight fit
      const d = (0.5 * defaultZoom) / Math.sin((camera.fov * Math.PI) / 180 / 2);
      camera.position.set(modelXOffset ?? 0, modelYOffset ?? 0, d);
      camera.near = d / 20;
      camera.far  = d * 20;
      camera.updateProjectionMatrix();
    }

    content.traverse(o => {
      if (o.isMesh) {
        o.castShadow    = true;
        o.receiveShadow = true;

        if (screenTextureSrc) {
          const n = o.name.toLowerCase();
          if (n.includes('screenempty')) {
            // Remap UVs from atlas space to 0-1 so the full texture covers the screen
            const uvAttr = o.geometry.attributes.uv;
            if (uvAttr) {
              let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
              for (let i = 0; i < uvAttr.count; i++) {
                minU = Math.min(minU, uvAttr.getX(i));
                maxU = Math.max(maxU, uvAttr.getX(i));
                minV = Math.min(minV, uvAttr.getY(i));
                maxV = Math.max(maxV, uvAttr.getY(i));
              }
              const uRange = maxU - minU || 1;
              const vRange = maxV - minV || 1;
              for (let i = 0; i < uvAttr.count; i++) {
                uvAttr.setXY(i,
                  (uvAttr.getX(i) - minU) / uRange,
                  (uvAttr.getY(i) - minV) / vRange,
                );
              }
              uvAttr.needsUpdate = true;
            }
            const bb = new THREE.Box3().setFromObject(o);
            const sz = new THREE.Vector3();
            bb.getSize(sz);
            screenAspectRef.current = sz.x / (sz.y || sz.z || 1);
            screenMeshRef.current = o;
            o.visible = true;
          } else if (SCREEN_MESHES.some(s => n.includes(s))) {
            o.visible = false;
          }
        }

        if (fadeIn) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => { m.transparent = true; m.opacity = 0; });
        }
      }
    });

    // The screen sits ~4 units behind the glass, so at an angle you can see past the image's edges.
    // Pull it forward towards the glass.
    const glass = content.getObjectByName('TV_glass'), screenNode = screenMeshRef.current?.parent;
    if (glass && screenNode) {
      screenNode.userData.z0 ??= screenNode.position.z; // original depth, so a repeated effect run doesn't shift twice
      const delta = (glass.position.z - screenNode.userData.z0) * SCREEN_FORWARD - (screenNode.position.z - screenNode.userData.z0);
      screenNode.position.z += delta;
    }

    ready.current = true;
    invalidate();

    if (fadeIn) {
      let t = 0;
      const id = setInterval(() => {
        t += 0.05;
        const v = Math.min(t, 1);
        content.traverse(o => {
          if (o.isMesh) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach(m => { m.opacity = v; });
          }
        });
        invalidate();
        if (v === 1) { clearInterval(id); onLoaded?.(); }
      }, 16);
      return () => clearInterval(id);
    } else {
      onLoaded?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useLayoutEffect(() => {
    if (!focusScreen || !screenMeshRef.current || !boundsRef.current) return;
    const tanHalf = Math.tan(deg2rad(camera.fov / 2));
    let center, dist, lift = 0;
    if (typeof focus === 'function') {
      // shelf framing: { top, bottom, width } in the same normalised units as bounds
      const f = focus(boundsRef.current);
      center = new THREE.Vector3(0, (f.top + f.bottom) / 2, 0);
      lift = f.lift || 0;
      dist = Math.max(f.top - f.bottom, f.width / camera.aspect) * 1.4 / (2 * tanHalf);
    } else {
      tv.current.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(screenMeshRef.current);
      const size = box.getSize(new THREE.Vector3());
      center = box.getCenter(new THREE.Vector3());
      dist = Math.max(size.y, size.x / camera.aspect) * defaultZoom / (2 * tanHalf);
    }
    center.y += 2 * dist * tanHalf * FRAME_DROP;
    focusTarget.current = { center, dist, lift };
    camera.near = dist / 100;
    camera.far = dist * 100;
    camera.updateProjectionMatrix();
    if (!focusCur.current || instantFocus) {
      focusCur.current = { dist, lift };
      pivot.copy(center);
      camera.position.set(center.x, center.y + dist * lift, center.z + dist);
      camera.lookAt(pivot);
    }
    invalidate();
  }, [camera, content, bounds, defaultZoom, focus, focusScreen, instantFocus, pivot, viewport.width, viewport.height]);

  const hasScreen = !!screenTextureSrc;
  useEffect(() => {
    const mesh = screenMeshRef.current;
    if (!hasScreen || !mesh) return;
    const original = mesh.material;
    const m = new THREE.MeshBasicMaterial({
      color: 0x000000, toneMapped: false, side: original.side,
      transparent: original.transparent, opacity: original.opacity,
    });
    screenMat.current = m;
    mesh.material = m;
    return () => {
      screenMat.current = null; dip.current = null;
      mesh.material = original;
      m.map?.dispose();
      m.dispose();
    };
  }, [content, hasScreen]);

  // a new image starts the dim straight away, without waiting for it to load
  useEffect(() => {
    const m = screenMat.current;
    if (screenDip && m?.map) dip.current = { phase: 'out', t: 0, start: m.color.r, pending: null };
  }, [screenTextureSrc, screenDip]);

  useEffect(() => {
    if (!screenTextureSrc || !screenMeshRef.current) return;
    let tex, apply;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const aspect = screenAspectRef.current || 1;
      const W = 1024;
      const H = Math.round(W / aspect);
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');
      const [fx, fy] = screenTextureFocus || [0.5, 0.5];
      const draw = (fit, filter) => {
        const scale = (fit === 'contain' ? Math.min : Math.max)(W / img.width, H / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.filter = filter;
        ctx.drawImage(img, (W - w) * (fit === 'contain' ? 0.5 : fx), (H - h) * (fit === 'contain' ? 0.5 : fy), w, h);
      };
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, W, H);
      // contain: sit the whole image over a blurred, dimmed copy of itself instead of black bars
      if (screenTextureFit === 'contain') draw('cover', 'blur(28px) brightness(.45)');
      draw(screenTextureFit === 'contain' ? 'contain' : 'cover', 'contrast(1.12) saturate(.84) brightness(.97)');
      ctx.filter = 'none';
      // slight pixelation: redraw at 1/PIXEL resolution, then scale back up without smoothing
      const small = document.createElement('canvas');
      small.width = Math.round(W / PIXEL); small.height = Math.round(H / PIXEL);
      small.getContext('2d').drawImage(canvas, 0, 0, small.width, small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, W, H);
      ctx.imageSmoothingEnabled = true;
      // CRT look, applied in the order light would pass through a tube:
      // colour fringing, bloom, lifted blacks, phosphor tint, grain, scanlines, vignette, glare
      const frame = ctx.getImageData(0, 0, W, H), px = frame.data, src = new Uint8ClampedArray(px), fringe = 2;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        px[i] = src[(y * W + Math.min(W - 1, x + fringe)) * 4];
        px[i + 2] = src[(y * W + Math.max(0, x - fringe)) * 4 + 2];
      }
      ctx.putImageData(frame, 0, 0);
      const glow = document.createElement('canvas');
      glow.width = W >> 2; glow.height = H >> 2;
      glow.getContext('2d').drawImage(canvas, 0, 0, glow.width, glow.height);
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.3;
      ctx.drawImage(glow, 0, 0, W, H);
      ctx.globalCompositeOperation = 'lighten'; ctx.globalAlpha = 1;
      ctx.fillStyle = '#17141f';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.16;
      ctx.fillStyle = '#d6c8ec';
      ctx.fillRect(0, 0, W, H);
      const grain = document.createElement('canvas');
      grain.width = grain.height = 128;
      const gg = grain.getContext('2d'), gd = gg.createImageData(128, 128);
      for (let i = 0; i < gd.data.length; i += 4) { gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = Math.random() * 255; gd.data[i + 3] = 255; }
      gg.putImageData(gd, 0, 0);
      ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.09;
      ctx.fillStyle = ctx.createPattern(grain, 'repeat');
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,.26)';
      for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, Math.hypot(W, H) / 2);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,.72)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
      const glare = ctx.createLinearGradient(0, 0, W * 0.6, H * 0.6);
      glare.addColorStop(0, 'rgba(255,255,255,.09)');
      glare.addColorStop(0.45, 'rgba(255,255,255,0)');
      ctx.fillStyle = glare;
      ctx.fillRect(0, 0, W, H);
      tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      tex.flipY = true;
      const m = screenMat.current;
      if (!m) return;
      apply = () => { const old = m.map; m.map = tex; m.needsUpdate = true; old?.dispose(); tex = null; }; // the material owns it now
      if (!screenDip) { apply(); m.color.setScalar(1); }
      else if (!m.map) { apply(); dip.current = { phase: 'in', t: 0, start: 0 }; } // first picture fades up from black
      else if (dip.current) dip.current.pending = apply;
      else dip.current = { phase: 'out', t: 0, start: 1, pending: apply };
      invalidate();
    };
    img.src = screenTextureSrc;
    return () => {
      cancelled = true;
      if (dip.current?.pending === apply) dip.current.pending = null;
      tex?.dispose();
    };
  }, [screenTextureSrc, screenTextureFit, screenTextureFocus, screenDip, content]);

  useEffect(() => {
    if (!enableManualRotation || isTouch) return;
    const el = gl.domElement;
    let drag = false, lx = 0, ly = 0;
    const down = e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      drag = true; lx = e.clientX; ly = e.clientY;
      window.addEventListener('pointerup', up);
    };
    const move = e => {
      if (!drag || !root.current) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      root.current.rotation.y += dx * ROTATE_SPEED;
      root.current.rotation.x += dy * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
      invalidate();
    };
    const up = () => (drag = false);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, enableManualRotation]);

  useEffect(() => {
    if (!isTouch) return;
    const el = gl.domElement;
    const pts = new Map();
    let mode = 'idle', sx = 0, sy = 0, lx = 0, ly = 0, startDist = 0, startZ = 0;
    const down = e => {
      if (e.pointerType !== 'touch') return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { mode = 'decide'; sx = lx = e.clientX; sy = ly = e.clientY; }
      else if (pts.size === 2 && enableManualZoom) {
        mode = 'pinch';
        const [p1, p2] = [...pts.values()];
        startDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        startZ = camera.position.z;
        e.preventDefault();
      }
      invalidate();
    };
    const move = e => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      p.x = e.clientX; p.y = e.clientY;
      if (mode === 'decide') {
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > DECIDE || Math.abs(dy) > DECIDE) {
          if (enableManualRotation && Math.abs(dx) > Math.abs(dy)) { mode = 'rotate'; el.setPointerCapture(e.pointerId); }
          else { mode = 'idle'; pts.clear(); }
        }
      }
      if (mode === 'rotate' && root.current) {
        e.preventDefault();
        const dx = e.clientX - lx, dy = e.clientY - ly;
        lx = e.clientX; ly = e.clientY;
        root.current.rotation.y += dx * ROTATE_SPEED;
        root.current.rotation.x += dy * ROTATE_SPEED;
        vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
        invalidate();
      } else if (mode === 'pinch' && pts.size === 2) {
        e.preventDefault();
        const [p1, p2] = [...pts.values()];
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        camera.position.z = THREE.MathUtils.clamp(startZ * (startDist / d), minZoom, maxZoom);
        invalidate();
      }
    };
    const up = e => {
      pts.delete(e.pointerId);
      if (mode === 'rotate' && pts.size === 0) mode = 'idle';
      if (mode === 'pinch' && pts.size < 2) mode = 'idle';
    };
    el.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, enableManualRotation, enableManualZoom, minZoom, maxZoom]);

  useEffect(() => {
    if (isTouch) return;
    const mm = e => {
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (enableMouseParallax) tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG };
      if (enableHoverRotation) tHov.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG };
      invalidate();
    };
    window.addEventListener('pointermove', mm);
    return () => window.removeEventListener('pointermove', mm);
  }, [enableMouseParallax, enableHoverRotation]);

  useFrame((_, dt) => {
    if (!ready.current || !root.current) return;

    const d = dip.current, sm = screenMat.current;
    if (d && sm) {
      d.t += dt;
      const ease = k => k * k * (3 - 2 * k);
      if (d.phase === 'out') {
        const k = Math.min(1, d.t / DIP_OUT);
        sm.color.setScalar(d.start + (DIP_LOW - d.start) * ease(k));
        if (k >= 1 && d.pending) { d.pending(); dip.current = { phase: 'in', t: 0, start: DIP_LOW }; }
      } else {
        const k = Math.min(1, d.t / DIP_IN);
        sm.color.setScalar(d.start + (1 - d.start) * ease(k));
        if (k >= 1) dip.current = null;
      }
    }

    const ft = focusTarget.current, fc = focusCur.current;
    if (ft && fc) {
      const k = 1 - Math.exp(-dt * 4.5);
      pivot.lerp(ft.center, k);
      fc.dist += (ft.dist - fc.dist) * k;
      fc.lift += (ft.lift - fc.lift) * k;
      camera.position.set(pivot.x, pivot.y + fc.dist * fc.lift, pivot.z + fc.dist);
      camera.lookAt(pivot);
    }

    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE;
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE;
    const phx = cHov.current.x, phy = cHov.current.y;
    cHov.current.x += (tHov.current.x - cHov.current.x) * HOVER_EASE;
    cHov.current.y += (tHov.current.y - cHov.current.y) * HOVER_EASE;

    // Project world origin to NDC, nudge by parallax offset, unproject back — zero allocations
    _ndcTmp.current.set(0, 0, 0).project(camera);
    _ndcTmp.current.x += cPar.current.x;
    _ndcTmp.current.y += cPar.current.y;
    root.current.position.copy(_ndcTmp.current.unproject(camera));

    root.current.rotation.x += cHov.current.x - phx;
    root.current.rotation.y += cHov.current.y - phy;

    if (autoRotate) root.current.rotation.y += autoRotateSpeed * dt;

    root.current.rotation.y += vel.current.x;
    root.current.rotation.x += vel.current.y;
    vel.current.x *= INERTIA;
    vel.current.y *= INERTIA;
  });

  return (
    <group ref={root}>
      <group ref={tv}>
        <primitive object={content} />
      </group>
      {bounds && children?.(bounds)}
    </group>
  );
};

const NullBackground = () => {
  const { scene } = useThree();
  useLayoutEffect(() => {
    Object.defineProperty(scene, 'background', {
      get: () => null,
      set: () => {},
      configurable: true,
    });
    return () => {
      // Atomically swap back to a plain null value — avoids a 1-frame window
      // where background is `undefined`, which makes THREE skip the clear call
      // and lets the previous HDRI frame bleed through.
      Object.defineProperty(scene, 'background', {
        value: null,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    };
  }, [scene]);
  return null;
};

const ModelViewer = ({
  url,
  width = 400,
  height = 400,
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -50,
  defaultRotationY = 20,
  defaultZoom = 1.5,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.3,
  keyLightIntensity = 1,
  fillLightIntensity = 0.5,
  rimLightIntensity = 0.8,
  environmentPreset = 'forest',
  autoFrame = false,
  focusScreen = false,
  placeholderSrc,
  showScreenshotButton = true,
  fadeIn = false,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  onModelLoaded,
  screenTextureSrc,
  screenTextureFit = 'cover',
  screenTextureFocus,
  screenDip = false,
  focus,
  instantFocus = false,
  children,
}) => {
  useEffect(() => void useGLTF.preload(url), [url]);
  const pivot = useMemo(() => new THREE.Vector3(), []);
  const contactRef  = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef    = useRef(null);
  const cameraRef   = useRef(null);

  const initYaw   = deg2rad(defaultRotationX);
  const initPitch = deg2rad(defaultRotationY);
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance);

  const capture = () => {
    const g = rendererRef.current, s = sceneRef.current, c = cameraRef.current;
    if (!g || !s || !c) return;
    g.shadowMap.enabled = false;
    const tmp = [];
    s.traverse(o => {
      if (o.isLight && 'castShadow' in o) { tmp.push({ l: o, cast: o.castShadow }); o.castShadow = false; }
    });
    if (contactRef.current) contactRef.current.visible = false;
    g.render(s, c);
    const png = g.domElement.toDataURL('image/png');
    Object.assign(document.createElement('a'), { download: 'model.png', href: png }).click();
    g.shadowMap.enabled = true;
    tmp.forEach(({ l, cast }) => (l.castShadow = cast));
    if (contactRef.current) contactRef.current.visible = true;
    invalidate();
  };

  return (
    <div style={{ width, height, touchAction: 'pan-y pinch-zoom', position: 'relative', cursor: enableManualRotation ? 'grab' : 'default' }}>
      {showScreenshotButton && (
        <button
          onClick={capture}
          style={{ position: 'absolute', border: '1px solid #fff', right: 16, top: 16, zIndex: 10, cursor: 'pointer', padding: '8px 16px', borderRadius: 10 }}
        >
          Take Screenshot
        </button>
      )}
      <Canvas
        shadows
        frameloop="always"
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl, scene, camera }) => {
          rendererRef.current = gl;
          sceneRef.current    = scene;
          cameraRef.current   = camera;
          gl.toneMapping      = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{ fov: 50, position: [0, 0, camZ], near: 0.01, far: 100 }}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        <NullBackground />
        {environmentPreset !== 'none' && <Environment preset={environmentPreset} background={false} />}
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 5, 5]}  intensity={keyLightIntensity} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-1} shadow-camera-right={1} shadow-camera-top={1} shadow-camera-bottom={-1} shadow-camera-near={0.5} shadow-camera-far={15} shadow-bias={-0.0005} />
        <directionalLight position={[-5, 2, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />
        <ContactShadows ref={contactRef} position={[0, -0.5, 0]} opacity={0.35} scale={10} blur={2} />
        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <ModelInner
            url={url}
            pivot={pivot}
            initYaw={initYaw}
            initPitch={initPitch}
            defaultZoom={defaultZoom}
            minZoom={minZoomDistance}
            maxZoom={maxZoomDistance}
            enableMouseParallax={enableMouseParallax}
            enableManualRotation={enableManualRotation}
            enableHoverRotation={enableHoverRotation}
            enableManualZoom={enableManualZoom}
            autoFrame={autoFrame}
            focusScreen={focusScreen}
            fadeIn={fadeIn}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            onLoaded={onModelLoaded}
            placeholderSrc={placeholderSrc}
            modelXOffset={modelXOffset}
            modelYOffset={modelYOffset}
            screenTextureSrc={screenTextureSrc}
            screenTextureFit={screenTextureFit}
            screenTextureFocus={screenTextureFocus}
            screenDip={screenDip}
            focus={focus}
            instantFocus={instantFocus}
          >
            {children}
          </ModelInner>
        </Suspense>
        {!isTouch && (
          <DesktopControls target={pivot} min={minZoomDistance} max={maxZoomDistance} zoomEnabled={enableManualZoom} />
        )}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
