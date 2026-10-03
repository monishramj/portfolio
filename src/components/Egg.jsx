import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Quaternius' low-poly egg (CC0, poly.pizza/m/ngjyRi84lk), reskinned with the same never-smoothed
// pixel-art treatment as the VHS spines: a tiny canvas of shell tones with a few brown speckles.
const SHELL = ['#d9c9a8', '#cdbb97', '#e2d5b8', '#c4ae88'];
const SPECK = '#8a6f4d';
const TEX = 8;
const url = `${import.meta.env.BASE_URL}egg.glb`;

function shellTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TEX;
  const g = canvas.getContext('2d');
  for (let y = 0; y < TEX; y++) for (let x = 0; x < TEX; x++) {
    const n = (x * 7 + y * 13 + x * y) % 11;
    g.fillStyle = n === 0 ? SPECK : SHELL[(x * 3 + y * 5 + n) % 4];
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
    copy.traverse(o => { if (o.isMesh) o.material = material; });
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
