import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { layout } from './shelfLayout';

// Palette sampled from the model's own texture atlas (grey plastic, cream labels).
const PLASTIC = ['#1a1a1c', '#232122', '#2c2829', '#373031'];
const CREAM = '#b3bba2', RIM = '#514847', INK = '#1a1a1c';
const SPINE_W = 24, SPINE_H = 150; // ~1:6.2, drawn at this size and never smoothed
const DIM = 0.78; // the cubby is a bit darker than the open table: scales colour and sky reflection

const mix = (hex, other, t) => {
  const c = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [c(hex), c(other)];
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

// Text rasterised big, then reduced to a 1-bit mask so it stays crisp at pixel size.
function textMask(text, len, thick) {
  const k = 6;
  const c = document.createElement('canvas');
  c.width = len * k; c.height = thick * k;
  const g = c.getContext('2d');
  g.font = `700 ${thick * k * 0.9}px "Bricolage Grotesque", sans-serif`;
  g.textBaseline = 'middle';
  g.fillText(text, 0, c.height / 2 + k, c.width);
  const { data } = g.getImageData(0, 0, c.width, c.height);
  const mask = [];
  for (let y = 0; y < thick; y++) for (let x = 0; x < len; x++) {
    let a = 0;
    for (let dy = 0; dy < k; dy++) for (let dx = 0; dx < k; dx++) a += data[((y * k + dy) * c.width + x * k + dx) * 4 + 3];
    mask.push(a / (k * k * 255) > 0.42);
  }
  return { mask, len };
}

function drawSpine(canvas, skill) {
  const g = canvas.getContext('2d');
  const px = (x, y, color) => { g.fillStyle = color; g.fillRect(x, y, 1, 1); };
  for (let y = 0; y < SPINE_H; y++) for (let x = 0; x < SPINE_W; x++) px(x, y, PLASTIC[(x * 7 + y * 13 + x * y) % 4 === 0 ? 2 : (x + y) % 5 === 0 ? 1 : 0]);
  const x0 = 3, x1 = SPINE_W - 4, y0 = 6, y1 = SPINE_H - 7;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px(x, y, x === x0 || x === x1 || y === y0 || y === y1 ? RIM : CREAM);
  for (let y = y0 + 1; y < y0 + 11; y++) for (let x = x0 + 1; x < x1; x++) px(x, y, mix(skill.color, RIM, 0.45));
  // brand logo, reduced to a 1-bit 16px mask just under the colour band
  const IC = 16;
  const ic = document.createElement('canvas');
  ic.width = ic.height = IC;
  const ig = ic.getContext('2d');
  ig.scale(IC / 24, IC / 24);
  ig.fill(new Path2D(skill.icon.path));
  const { data } = ig.getImageData(0, 0, IC, IC);
  for (let y = 0; y < IC; y++) for (let x = 0; x < IC; x++) if (data[(y * IC + x) * 4 + 3] > 110) px(x0 + 1 + x, y0 + 13 + y, INK);
  const thick = 12, top = y0 + 13 + IC + 4, len = y1 - top - 1;
  const { mask } = textMask(skill.name.toLowerCase(), len, thick);
  for (let ty = 0; ty < thick; ty++) for (let tx = 0; tx < len; tx++) {
    if (mask[ty * len + tx]) px(x0 + 3 + (thick - 1 - ty), top + tx, INK);
  }
}

function pixelTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

// Boxes for the shelf use the model's own wood region of its texture atlas (u .44-.66, v .04-.42).
function woodGeometry(w, h, d, grainAlongX) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const [u, v] = [uv.getX(i), uv.getY(i)];
    uv.setXY(i, 0.44 + (grainAlongX ? v : u) * 0.22, 0.04 + (grainAlongX ? u : v) * 0.38);
  }
  return g;
}

function Tape({ skill, index, selected, active, onSelect, l, plastic, gloss }) {
  const group = useRef(null);
  const hover = useRef(false);
  const slot = l.slots[index];
  const spine = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = SPINE_W; canvas.height = SPINE_H;
    drawSpine(canvas, skill);
    return pixelTexture(canvas);
  }, [skill]);

  // the spine font may still be loading on first paint
  useEffect(() => {
    let live = true;
    document.fonts?.load('700 40px "Bricolage Grotesque"').then(() => {
      if (!live) return;
      drawSpine(spine.image, skill);
      spine.needsUpdate = true;
    });
    return () => { live = false; spine.dispose(); };
  }, [spine, skill]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const pull = selected ? l.tapeD * 0.42 : active && hover.current ? l.tapeD * 0.2 : 0;
    const k = 1 - Math.exp(-dt * 10);
    g.position.z += (slot.z + pull - g.position.z) * k;
  });

  const handlers = active ? {
    onPointerOver: e => { e.stopPropagation(); hover.current = true; document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { hover.current = false; document.body.style.cursor = ''; },
    onClick: e => { e.stopPropagation(); onSelect(index); },
  } : {};

  // leaning tapes pivot on their bottom-left corner, upright ones on their bottom centre
  return (
    <group ref={group} position={[slot.x, l.floorTop, slot.z]} rotation={[slot.pitch, slot.yaw, slot.tilt]} {...handlers}>
      <mesh castShadow receiveShadow position={[slot.lean ? l.tapeW / 2 : 0, l.tapeH / 2, 0]}>
        <boxGeometry args={[l.tapeW, l.tapeH, l.tapeD]} />
        {[plastic, plastic, plastic, plastic].map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
        <meshStandardMaterial attach="material-4" map={spine} {...gloss} />
        <primitive object={plastic} attach="material-5" />
      </mesh>
    </group>
  );
}

function Cubby({ l, material }) {
  const floor = useMemo(() => woodGeometry(l.innerW, l.board, l.depth, true), [l]);
  const back = useMemo(() => woodGeometry(l.innerW, l.ceiling - l.floorTop + l.board, 0.012, true), [l]);
  const side = useMemo(() => woodGeometry(0.014, l.ceiling - l.floorTop + l.board, l.depth, false), [l]);
  // the model's own atlas material, so the shelf is lit exactly like the table around it
  const wood = useMemo(() => {
    if (!material) return <meshStandardMaterial color="#3a2f2c" roughness={0.9} />;
    const m = material.clone(); // copy, so dimming the cubby doesn't change the TV or the table
    m.color.setScalar(DIM); m.envMapIntensity = material.envMapIntensity * DIM;
    return <primitive object={m} attach="material" />;
  }, [material]);
  const midY = (l.ceiling + l.floorTop - l.board) / 2;
  return (
    <group>
      <mesh geometry={floor} position={[l.cx, l.floorTop - l.board / 2, l.cz]} castShadow receiveShadow>{wood}</mesh>
      <mesh geometry={back} position={[l.cx, midY, l.cz - l.depth / 2 + 0.006]} receiveShadow>{wood}</mesh>
      <mesh geometry={side} position={[l.cx - l.innerW / 2 + 0.007, midY, l.cz]} receiveShadow>{wood}</mesh>
      <mesh geometry={side} position={[l.cx + l.innerW / 2 - 0.007, midY, l.cz]} receiveShadow>{wood}</mesh>
    </group>
  );
}

export default function VhsShelf({ bounds, skills, selected, active, onSelect }) {
  const l = layout(bounds);
  // same surface response as the model's own material (it is glossy, not matte), so the tapes are lit like the table
  const m = bounds.tableMaterial;
  const gloss = useMemo(() => ({ roughness: m?.roughness ?? 0, metalness: m?.metalness ?? 0, envMapIntensity: (m?.envMapIntensity ?? 1) * DIM, color: new THREE.Color().setScalar(DIM) }), [m]);
  const plastic = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const g = canvas.getContext('2d');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { g.fillStyle = PLASTIC[(x * 5 + y * 11 + x * y) % 7 === 0 ? 3 : (x + y * 3) % 4 === 0 ? 2 : (x * y) % 3 === 0 ? 1 : 0]; g.fillRect(x, y, 1, 1); }
    return new THREE.MeshStandardMaterial({ map: pixelTexture(canvas), ...gloss });
  }, [gloss]);
  return (
    <group>
      <Cubby l={l} material={m} />
      {skills.map((skill, i) => (
        <Tape key={skill.name} skill={skill} index={i} selected={selected === i} active={active} onSelect={onSelect} l={l} plastic={plastic} gloss={gloss} />
      ))}
    </group>
  );
}
