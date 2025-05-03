import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function BlackHole() {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={mesh}>
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial color="black" emissive="purple" emissiveIntensity={1} />
    </mesh>
  );
}

function GalaxyCanvas() {
  const { camera, gl } = useThree();
  gl.setSize(window.innerWidth, window.innerHeight);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ height: '100vh', width: '100vw' }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={2}
      />
      <BlackHole />
      <OrbitControls enableZoom={true} zoomSpeed={0.8} />
    </Canvas>
  );
}

export default GalaxyCanvas;
