import React, { useMemo } from 'react';
import { PALETTE } from '../utils/colors';

interface RockProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const Rock: React.FC<RockProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}) => {
  const rockColor = useMemo(() => {
    const seed = Math.abs(Math.sin(position[0] * 37.1 + position[2] * 91.7));
    if (seed < 0.33) return PALETTE.rockLight;
    if (seed < 0.66) return PALETTE.rockBase;
    return PALETTE.rockDark;
  }, [position]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
};
