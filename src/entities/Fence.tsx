import React from 'react';
import { PALETTE } from '../utils/colors';

interface FenceProps {
  start: [number, number]; // [x, z]
  end: [number, number]; // [x, z]
  postInterval?: number;
}

export const FenceLine: React.FC<FenceProps> = ({ start, end, postInterval = 2.0 }) => {
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const totalLength = Math.hypot(dx, dz);
  const angle = Math.atan2(dx, dz);
  const numPosts = Math.max(2, Math.round(totalLength / postInterval) + 1);

  return (
    <group position={[start[0], 0, start[1]]} rotation={[0, angle, 0]}>
      {/* Horizontal Rails */}
      {/* Top Rail */}
      <mesh position={[0, 0.65, totalLength / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.08, totalLength]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.85} flatShading />
      </mesh>
      {/* Bottom Rail */}
      <mesh position={[0, 0.35, totalLength / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.08, totalLength]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.85} flatShading />
      </mesh>

      {/* Vertical Posts */}
      {Array.from({ length: numPosts }).map((_, i) => {
        const postZ = (i / (numPosts - 1)) * totalLength;
        return (
          <mesh key={`post-${i}`} position={[0, 0.45, postZ]} castShadow receiveShadow>
            <boxGeometry args={[0.12, 0.9, 0.12]} />
            <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};
