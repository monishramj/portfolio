/* eslint-disable react/no-unknown-property */
import { Suspense, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
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
const ModelInner = ({
  url, pivot, initYaw, initPitch, defaultZoom, minZoom, maxZoom,
  enableMouseParallax, enableManualRotation, enableHoverRotation, enableManualZoom,
  autoFrame, fadeIn, autoRotate, autoRotateSpeed, onLoaded, placeholderSrc,
  modelXOffset, modelYOffset,
}) => {
  const { scene } = useGLTF(url);
  const content = useMemo(() => scene.clone(), [scene]);

  const root = useRef(null);
  const { camera, gl } = useThree();

  const vel  = useRef({ x: 0, y: 0 });
  const tPar = useRef({ x: 0, y: 0 });
  const cPar = useRef({ x: 0, y: 0 });
  const tHov = useRef({ x: 0, y: 0 });
  const cHov = useRef({ x: 0, y: 0 });
  const ready = useRef(false);
  const _ndcTmp = useRef(new THREE.Vector3()); // pre-allocated — avoids GC in useFrame

  useLayoutEffect(() => {
    if (!root.current || !content) return;

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
    root.current.scale.setScalar(s);
    root.current.rotation.set(initPitch, initYaw, 0);
    pivot.set(0, 0, 0);

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
        if (fadeIn) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => { m.transparent = true; m.opacity = 0; });
        }
      }
    });

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
      <primitive object={content} />
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
  placeholderSrc,
  showScreenshotButton = true,
  fadeIn = false,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  onModelLoaded,
}) => {
  useEffect(() => void useGLTF.preload(url), [url]);
  const pivot = useRef(new THREE.Vector3()).current;
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
    <div style={{ width, height, touchAction: 'pan-y pinch-zoom', position: 'relative', cursor: 'grab' }}>
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
        <directionalLight position={[5, 5, 5]}  intensity={keyLightIntensity} castShadow />
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
            fadeIn={fadeIn}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            onLoaded={onModelLoaded}
            placeholderSrc={placeholderSrc}
            modelXOffset={modelXOffset}
            modelYOffset={modelYOffset}
          />
        </Suspense>
        {!isTouch && (
          <DesktopControls target={pivot} min={minZoomDistance} max={maxZoomDistance} zoomEnabled={enableManualZoom} />
        )}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
