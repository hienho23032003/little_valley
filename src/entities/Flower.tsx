import React from 'react';
import { PALETTE } from '../utils/colors';

interface FlowerProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

export const Flower: React.FC<FlowerProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = PALETTE.flowerYellow,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshStandardMaterial color={PALETTE.flowerStem} roughness={0.8} />
      </mesh>

      {/* Flower Blossom Head */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.05, 0.08, 6]} />
        <meshStandardMaterial color={color} roughness={0.5} flatShading />
      </mesh>

      {/* Center Pistil */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.045, 5, 5]} />
        <meshStandardMaterial color="#fff3b0" roughness={0.4} />
      </mesh>

      {/* Little leaf */}
      <mesh position={[0.06, 0.12, 0]} rotation={[0, 0, -0.6]} castShadow>
        <boxGeometry args={[0.08, 0.02, 0.04]} />
        <meshStandardMaterial color={PALETTE.flowerStem} roughness={0.8} />
      </mesh>
    </group>
  );
};
