import React, { useMemo } from 'react';
import { PALETTE } from '../utils/colors';

interface TreeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  type?: 'pine' | 'oak' | 'fruit' | string;
}

export const Tree: React.FC<TreeProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  type = 'pine',
}) => {
  // Deterministic jitter based on position
  const jitter = useMemo(() => {
    const seed = Math.abs(Math.sin(position[0] * 12.9898 + position[2] * 78.233));
    return seed;
  }, [position]);

  if (type === 'pine') {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Trunk */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.35, 1.5, 6]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
        </mesh>

        {/* Lower foliage tier */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.5, 1.6, 6]} />
          <meshStandardMaterial color={PALETTE.pineDark} roughness={0.8} flatShading />
        </mesh>

        {/* Middle foliage tier */}
        <mesh position={[0, 2.7, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.2, 1.4, 6]} />
          <meshStandardMaterial color={PALETTE.pineMedium} roughness={0.8} flatShading />
        </mesh>

        {/* Top foliage tier */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.8, 1.2, 6]} />
          <meshStandardMaterial color={PALETTE.pineLight} roughness={0.8} flatShading />
        </mesh>
      </group>
    );
  }

  // Oak or Fruit Tree
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.45, 2.0, 7]} />
        <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} flatShading />
      </mesh>

      {/* Main Foliage Canopy (stylized low-poly cluster) */}
      <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          color={type === 'fruit' ? PALETTE.oakLight : jitter > 0.5 ? PALETTE.oakGreen : PALETTE.oakLight}
          roughness={0.7}
          flatShading
        />
      </mesh>

      {/* Sub-canopy puff left */}
      <mesh position={[-0.7, 2.3, 0.4]} scale={0.75} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial color={PALETTE.oakGreen} roughness={0.7} flatShading />
      </mesh>

      {/* Sub-canopy puff right */}
      <mesh position={[0.6, 2.4, -0.3]} scale={0.8} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial color={PALETTE.oakLight} roughness={0.7} flatShading />
      </mesh>

      {/* Little fruits if fruit tree */}
      {type === 'fruit' && (
        <group>
          <mesh position={[-0.6, 2.1, 0.8]} castShadow>
            <sphereGeometry args={[0.14, 5, 5]} />
            <meshStandardMaterial color="#e63946" roughness={0.5} flatShading />
          </mesh>
          <mesh position={[0.7, 2.5, 0.6]} castShadow>
            <sphereGeometry args={[0.14, 5, 5]} />
            <meshStandardMaterial color="#e63946" roughness={0.5} flatShading />
          </mesh>
          <mesh position={[0.3, 1.9, -0.8]} castShadow>
            <sphereGeometry args={[0.14, 5, 5]} />
            <meshStandardMaterial color="#e63946" roughness={0.5} flatShading />
          </mesh>
          <mesh position={[-0.8, 2.6, -0.4]} castShadow>
            <sphereGeometry args={[0.14, 5, 5]} />
            <meshStandardMaterial color="#e63946" roughness={0.5} flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
};
