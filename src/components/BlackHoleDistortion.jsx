import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Define the custom shader material
const DistortionMaterial = shaderMaterial(
  { time: 0 },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    varying vec2 vUv;
    void main() {
      float dist = distance(vUv, vec2(0.5));
      float strength = smoothstep(0.3, 0.5, dist);
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float ripple = 0.03 * sin(10.0 * dist - time * 2.0 + angle * 2.0);
      vec2 uv = vUv + (vUv - 0.5) * ripple * strength;
      float alpha = 0.4 * (1.0 - strength);
      gl_FragColor = vec4(0.5, 0.2, 0.8, alpha);
    }
  `
);

// Register the material with Three.js
extend({ DistortionMaterial });

export default function BlackHoleDistortion() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[4, 4, 64, 64]} />
      {/* Use the custom material as a JSX tag (lowercase) */}
      <distortionMaterial ref={ref} attach="material" />
    </mesh>
  );
}