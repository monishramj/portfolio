import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { COUNT, layout } from './shelfLayout';

// Palette sampled from the model's own texture atlas (grey plastic, cream labels).
const PLASTIC = ['#1a1a1c', '#232122', '#2c2829', '#373031'];
const CREAM = '#b3bba2', RIM = '#514847', INK = '#1a1a1c';
const SPINE_W = 24, SPINE_H = 150; // ~1:6.2, drawn at this size and never smoothed

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

function Tape({ skill, index, selected, active, onSelect, l, plastic }) {
  const group = useRef(null);
  const hover = useRef(false);
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

  const baseX = l.cx + (index - (COUNT - 1) / 2) * l.pitch;
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const pull = selected ? l.tapeD * 0.42 : active && hover.current ? l.tapeD * 0.2 : 0;
    const k = 1 - Math.exp(-dt * 10);
    g.position.z += (pull - g.position.z) * k;
  });

  const handlers = active ? {
    onPointerOver: e => { e.stopPropagation(); hover.current = true; document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { hover.current = false; document.body.style.cursor = ''; },
    onClick: e => { e.stopPropagation(); onSelect(index); },
  } : {};

  return (
    <group ref={group} position={[baseX, l.floorTop + l.tapeH / 2, l.cz]} {...handlers}>
      <mesh castShadow>
        <boxGeometry args={[l.tapeW, l.tapeH, l.tapeD]} />
        {[plastic, plastic, plastic, plastic].map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
        <meshStandardMaterial attach="material-4" map={spine} roughness={0.8} envMapIntensity={0.5} />
        <primitive object={plastic} attach="material-5" />
      </mesh>
    </group>
  );
}

export default function VhsShelf({ bounds, skills, selected, active, onSelect }) {
  const l = layout(bounds);
  const plastic = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const g = canvas.getContext('2d');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { g.fillStyle = PLASTIC[(x * 5 + y * 11 + x * y) % 7 === 0 ? 3 : (x + y * 3) % 4 === 0 ? 2 : (x * y) % 3 === 0 ? 1 : 0]; g.fillRect(x, y, 1, 1); }
    return new THREE.MeshStandardMaterial({ map: pixelTexture(canvas), roughness: 0.85 });
  }, []);
  return (
    <group>
      {skills.map((skill, i) => (
        <Tape key={skill.name} skill={skill} index={i} selected={selected === i} active={active} onSelect={onSelect} l={l} plastic={plastic} />
      ))}
    </group>
  );
}
