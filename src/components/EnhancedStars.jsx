// src/components/EnhancedStars.jsx
import { Stars } from '@react-three/drei';

export default function EnhancedStars({
  color = 'white',
  count = 8000,
  factor = 4,
  radius = 120,
  depth = 60,
  speed = 2,
}) {
  return (
    <Stars
      radius={radius}
      depth={depth}
      count={count}
      factor={factor}
      saturation={0}
      fade
      speed={speed}
      color={color}
    />
  );
}