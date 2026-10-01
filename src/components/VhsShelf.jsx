import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { COUNT, layout } from './shelfLayout';

function drawSpine(canvas, skill) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  ctx.fillStyle = '#17151b';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = skill.color;
  ctx.fillRect(w * 0.1, h * 0.04, w * 0.8, h * 0.92);
  ctx.fillStyle = 'rgba(0,0,0,.14)';
  ctx.fillRect(w * 0.1, h * 0.04, w * 0.8, h * 0.012);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#16151b';
  ctx.font = '600 46px "Bricolage Grotesque", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(skill.name.toLowerCase(), 0, 3, h * 0.84);
  ctx.restore();
}

function Tape({ skill, index, selected, active, onSelect, l, plastic }) {
  const group = useRef(null);
  const hover = useRef(false);
  const spine = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 96; canvas.height = 640;
    drawSpine(canvas, skill);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [skill]);

  // the spine font may still be loading on first paint
  useEffect(() => {
    let live = true;
    document.fonts?.load('600 46px "Bricolage Grotesque"').then(() => {
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
        <meshStandardMaterial attach="material-4" map={spine} color="#8c8c8c" roughness={0.75} envMapIntensity={0.5} />
        <primitive object={plastic} attach="material-5" />
      </mesh>
    </group>
  );
}

export default function VhsShelf({ bounds, skills, selected, active, onSelect }) {
  const l = layout(bounds);
  const plastic = useMemo(() => new THREE.MeshStandardMaterial({ color: '#141317', roughness: 0.6 }), []);
  return (
    <group>
      {skills.map((skill, i) => (
        <Tape key={skill.name} skill={skill} index={i} selected={selected === i} active={active} onSelect={onSelect} l={l} plastic={plastic} />
      ))}
    </group>
  );
}
