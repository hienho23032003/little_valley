import React from 'react';
import { PALETTE } from '../utils/colors';

interface BridgeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Bridge: React.FC<BridgeProps> = React.memo(({
  position = [0, 0, 21.2] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}: BridgeProps) => {
  const plankCount = 14;
  const bridgeLength = 7.0;
  const bridgeWidth = 3.2;

  return (
    <group position={position} rotation={rotation}>
      {/* Stone Bank Abutments North & South */}
      {[-bridgeLength / 2 - 0.25, bridgeLength / 2 + 0.25].map((z, idx) => (
        <group key={`abutment-${idx}`} position={[0, 0.05, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[bridgeWidth + 0.6, 0.35, 0.7]} />
            <meshStandardMaterial color={PALETTE.rockBase} roughness={0.92} flatShading />
          </mesh>
          <mesh position={[0, -0.05, idx === 0 ? -0.45 : 0.45]} receiveShadow>
            <boxGeometry args={[bridgeWidth + 0.4, 0.15, 0.4]} />
            <meshStandardMaterial color={PALETTE.rockLight} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}

      {/* Heavy Timber Support Stringers (Under bridge) */}
      <mesh position={[-bridgeWidth / 2 + 0.3, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.4, bridgeLength + 0.6]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[bridgeWidth / 2 - 0.3, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.4, bridgeLength + 0.6]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, bridgeLength + 0.6]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>

      {/* River Bed Pillars / Piles */}
      {[-1.2, 1.2].map((x) =>
        [-2.0, 2.0].map((z) => (
          <mesh key={`pillar-${x}-${z}`} position={[x, -0.5, z]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 1.6, 6]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.95} flatShading />
          </mesh>
        ))
      )}

      {/* Wooden Deck Planks */}
      {Array.from({ length: plankCount }).map((_, i) => {
        const z = -bridgeLength / 2 + (i / (plankCount - 1)) * bridgeLength;
        // Subtle height arc for a cozy arched wooden bridge feel
        const normZ = (z / (bridgeLength / 2));
        const archY = (1 - normZ * normZ) * 0.22;
        const widthVariation = bridgeWidth + ((i % 3) - 1) * 0.1;

        return (
          <mesh
            key={`plank-${i}`}
            position={[0, 0.4 + archY, z]}
            rotation={[0.02 * ((i % 2) - 0.5), 0, 0.01]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[widthVariation, 0.12, 0.42]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? PALETTE.woodLight : PALETTE.woodPlank}
              roughness={0.8}
              flatShading
            />
          </mesh>
        );
      })}

      {/* Handrails & Balusters */}
      {[-bridgeWidth / 2 + 0.15, bridgeWidth / 2 - 0.15].map((x, sideIdx) => (
        <group key={`railing-${sideIdx}`}>
          {/* Top Rail */}
          <mesh position={[x, 1.15, 0]} castShadow>
            <boxGeometry args={[0.14, 0.14, bridgeLength + 0.4]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.85} flatShading />
          </mesh>
          {/* Mid Rail */}
          <mesh position={[x, 0.8, 0]} castShadow>
            <boxGeometry args={[0.08, 0.08, bridgeLength + 0.4]} />
            <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.85} flatShading />
          </mesh>

          {/* Vertical Baluster Posts along the span */}
          {[-3.2, -1.6, 0, 1.6, 3.2].map((z, postIdx) => (
            <mesh key={`post-${sideIdx}-${postIdx}`} position={[x, 0.85, z]} castShadow>
              <boxGeometry args={[0.16, 0.9, 0.16]} />
              <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4 Cozy Bridge Lanterns on Corner Posts */}
      {[-bridgeWidth / 2 + 0.15, bridgeWidth / 2 - 0.15].map((x) =>
        [-bridgeLength / 2, bridgeLength / 2].map((z) => (
          <group key={`lantern-${x}-${z}`} position={[x, 1.35, z]}>
            {/* Lantern Cap */}
            <mesh position={[0, 0.18, 0]} castShadow>
              <coneGeometry args={[0.16, 0.12, 4]} />
              <meshStandardMaterial color={PALETTE.rockDark} roughness={0.7} flatShading />
            </mesh>
            {/* Glowing Lantern Glass */}
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.14, 0.16, 0.14]} />
              <meshStandardMaterial
                color="#ffe066"
                emissive="#ffcc00"
                emissiveIntensity={0.6}
                roughness={0.3}
              />
            </mesh>
            {/* Lantern Base */}
            <mesh position={[0, -0.04, 0]} castShadow>
              <boxGeometry args={[0.16, 0.06, 0.16]} />
              <meshStandardMaterial color={PALETTE.rockDark} roughness={0.8} flatShading />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
});
