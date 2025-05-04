import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AccretionDisk({ innerRadius = 1.1, outerRadius = 2.2 }) {
  const mesh = useRef();

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = clock.getElapsedTime() * 0.3; // slow rotation
    }
  });

  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 128]} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.7}
        color="#a020f0"
        // Add a radial gradient using a texture or custom shader for more realism later
      />
    </mesh>
  );
}