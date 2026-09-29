import React from 'react';
import { PALETTE } from '../utils/colors';

interface BushProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const Bush: React.FC<BushProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Central puff */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={PALETTE.bushGreen} roughness={0.8} flatShading />
      </mesh>
      {/* Side puff 1 */}
      <mesh position={[-0.35, 0.35, 0.1]} scale={0.7} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={PALETTE.bushLight} roughness={0.8} flatShading />
      </mesh>
      {/* Side puff 2 */}
      <mesh position={[0.3, 0.38, -0.1]} scale={0.75} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={PALETTE.bushGreen} roughness={0.8} flatShading />
      </mesh>
    </group>
  );
};
