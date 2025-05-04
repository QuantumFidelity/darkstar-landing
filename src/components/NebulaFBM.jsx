import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// GLSL FBM (Fractal Brownian Motion) and color ramp
const fbmShader = `
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 0.0;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
vec3 nebulaColor(float t) {
  // Color ramp: blue -> purple -> pink -> orange -> yellow
  vec3 c1 = vec3(0.2, 0.3, 0.7);
  vec3 c2 = vec3(0.5, 0.2, 0.7);
  vec3 c3 = vec3(0.8, 0.3, 0.6);
  vec3 c4 = vec3(1.0, 0.6, 0.2);
  vec3 c5 = vec3(1.0, 0.9, 0.5);
  if (t < 0.25) return mix(c1, c2, t / 0.25);
  else if (t < 0.5) return mix(c2, c3, (t - 0.25) / 0.25);
  else if (t < 0.75) return mix(c3, c4, (t - 0.5) / 0.25);
  else return mix(c4, c5, (t - 0.75) / 0.25);
}
`;

const NebulaFBMMaterial = shaderMaterial(
  { time: 0 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    varying vec2 vUv;
    ${fbmShader}
    void main() {
      float t = time * 0.03;
      float n = fbm(vUv * 4.0 + t);
      float n2 = fbm(vUv * 8.0 - t * 0.7);
      float n3 = fbm(vUv * 2.0 + t * 0.5);
      float nebula = smoothstep(0.3, 0.8, n * 0.5 + n2 * 0.3 + n3 * 0.2);
      vec3 color = nebulaColor(nebula);
      float alpha = nebula * 0.45;
      gl_FragColor = vec4(color, alpha);
    }
  `
);
extend({ NebulaFBMMaterial });

export default function NebulaFBM({ radius = 200 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <nebulaFBMMaterial ref={ref} attach="material" side={3} transparent />
    </mesh>
  );
} 