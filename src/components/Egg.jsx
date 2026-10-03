import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Quaternius' low-poly egg (CC0, poly.pizza/m/ngjyRi84lk), skinned with the TV model's own wood
// (the same atlas patch the VHS cubby uses, u .44-.66 v .04-.42), shifted from brown to tan and never smoothed.
const url = `${import.meta.env.BASE_URL}egg.glb`;
const TV_URL = `${import.meta.env.BASE_URL}grandmas_tv.glb`;
const DARK = [168, 138, 95], LIGHT = [227, 209, 173]; // tan ramp the wood's light/dark grain is mapped onto

function tanWood(image) {
  const [x, y, w, h] = [0.44 * image.width, 0.04 * image.height, 0.22 * image.width, 0.38 * image.height].map(Math.round);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const g = canvas.getContext('2d');
  g.drawImage(image, x, y, w, h, 0, 0, w, h);
  const img = g.getImageData(0, 0, w, h), d = img.data;
  const lum = i => 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
  // stretch the middle 90% of the grain over the ramp, so a few stray pixels don't flatten the rest
  const sorted = [];
  for (let i = 0; i < d.length; i += 4) sorted.push(lum(i));
  sorted.sort((p, q) => p - q);
  const lo = sorted[Math.floor(sorted.length * 0.05)], hi = sorted[Math.floor(sorted.length * 0.95)];
  for (let i = 0; i < d.length; i += 4) {
    const t = Math.min(1, Math.max(0, (lum(i) - lo) / (hi - lo || 1)));
    for (let c = 0; c < 3; c++) d[i + c] = DARK[c] + (LIGHT[c] - DARK[c]) * t;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

function Model() {
  const { scene } = useGLTF(url);
  const tv = useGLTF(TV_URL); // already loaded (and cached) by the TV itself
  const egg = useMemo(() => {
    const copy = scene.clone();
    const material = new THREE.MeshStandardMaterial({ map: tanWood(tv.materials.material.map.image), roughness: 0.8, flatShading: true });
    copy.traverse(o => {
      if (!o.isMesh) return;
      // the egg's own UVs cover a sliver of its atlas, so wrap ours around the long (local z) axis instead
      o.geometry = o.geometry.clone();
      const pos = o.geometry.attributes.position, uv = o.geometry.attributes.uv;
      o.geometry.computeBoundingBox();
      const { min, max } = o.geometry.boundingBox;
      for (let i = 0; i < pos.count; i++) uv.setXY(i, Math.atan2(pos.getY(i), pos.getX(i)) / (2 * Math.PI) + 0.5, (pos.getZ(i) - min.z) / (max.z - min.z));
      o.material = material;
    });
    return copy;
  }, [scene, tv]);
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
