import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// GLSL 2D Simplex Noise (by Ian McEwan, Ashima Arts)
const simplexNoise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  vec3 p = permute( permute(
             vec3(i.y + vec3(0.0, i1.y, 1.0 ))
           + i.x + vec3(0.0, i1.x, 1.0 )));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const NebulaMaterial = shaderMaterial(
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
    ${simplexNoise}
    void main() {
      float n = snoise(vUv * 4.0 + time * 0.03);
      float n2 = snoise(vUv * 8.0 - time * 0.02);
      float n3 = snoise(vUv * 2.0 + time * 0.01);
      float nebula = smoothstep(0.2, 0.8, n * 0.5 + n2 * 0.3 + n3 * 0.2);

      // Color blend: purple, blue, pink, orange
      vec3 color1 = vec3(0.6, 0.2, 0.8);
      vec3 color2 = vec3(0.2, 0.4, 0.8);
      vec3 color3 = vec3(0.9, 0.3, 0.6);
      vec3 color4 = vec3(1.0, 0.6, 0.2);
      vec3 color = mix(color1, color2, vUv.y);
      color = mix(color, color3, vUv.x);
      color = mix(color, color4, nebula);

      float alpha = nebula * 0.35;
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ NebulaMaterial });

export default function Nebula() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[60, 30, 1, 1]} />
      <nebulaMaterial ref={ref} attach="material" transparent />
    </mesh>
  );
}
