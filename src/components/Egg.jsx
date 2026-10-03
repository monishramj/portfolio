import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Quaternius' low-poly egg (CC0, poly.pizza/m/ngjyRi84lk), reskinned with the same never-smoothed
// pixel-art treatment as the VHS spines: a tiny canvas of shell tones with a few brown speckles.
const SHELL = ['#dcc8a3', '#d2bc95', '#c8b088', '#e3d3b2', '#bea47c', '#d7c29b'];
const SPECK = '#8a6f4d';
const TEX_W = 16, TEX_H = 12; // texels around and up the shell; each lands a few screen pixels wide
const url = `${import.meta.env.BASE_URL}egg.glb`;

function shellTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W; canvas.height = TEX_H;
  const g = canvas.getContext('2d');
  for (let y = 0; y < TEX_H; y++) for (let x = 0; x < TEX_W; x++) {
    const n = (x * 73 + y * 151 + x * y * 7) % 97; // cheap fixed hash, so the pattern doesn't read as stripes
    g.fillStyle = n < 5 ? SPECK : SHELL[n % SHELL.length];
    g.fillRect(x, y, 1, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

function Model() {
  const { scene } = useGLTF(url);
  const egg = useMemo(() => {
    const copy = scene.clone();
    const material = new THREE.MeshStandardMaterial({ map: shellTexture(), roughness: 0.8, flatShading: true });
    copy.traverse(o => {
      if (!o.isMesh) return;
      // the model's own UVs cover a sliver of its atlas, so wrap ours around the long (local z) axis instead
      o.geometry = o.geometry.clone();
      const pos = o.geometry.attributes.position, uv = o.geometry.attributes.uv;
      o.geometry.computeBoundingBox();
      const { min, max } = o.geometry.boundingBox;
      for (let i = 0; i < pos.count; i++) uv.setXY(i, Math.atan2(pos.getY(i), pos.getX(i)) / (2 * Math.PI) + 0.5, (pos.getZ(i) - min.z) / (max.z - min.z));
      o.material = material;
    });
    return copy;
  }, [scene]);
  return <Center><primitive object={egg} /></Center>;
}

// Drag to spin it; it turns slowly on its own unless the visitor prefers reduced motion.
export default function Egg({ reducedMotion }) {
  return <div className="egg" title="egg">
    <Canvas dpr={1} camera={{ position: [0, 0.1, 1.15], fov: 30 }} gl={{ antialias: false }}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[1, 2, 2]} intensity={2.2} />
      <Model />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reducedMotion} autoRotateSpeed={3} />
    </Canvas>
  </div>;
}
