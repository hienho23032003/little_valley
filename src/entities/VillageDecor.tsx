import React from 'react';
import { PALETTE } from '../utils/colors';

export const VillageWell: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Circular Stone Wall */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.1, 0.9, 8]} />
        <meshStandardMaterial color={PALETTE.rockBase} roughness={0.9} flatShading />
      </mesh>
      {/* Stone Rim */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <torusGeometry args={[1.0, 0.12, 5, 8]} />
        <meshStandardMaterial color={PALETTE.rockDark} roughness={0.9} flatShading />
      </mesh>
      {/* Well water interior */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.1, 8]} />
        <meshStandardMaterial color={PALETTE.water} roughness={0.2} transparent opacity={0.8} />
      </mesh>

      {/* Wooden Support Posts */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={`well-post-${x}`} position={[x, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.8, 5]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.85} flatShading />
        </mesh>
      ))}

      {/* Horizontal Crossbeam & Axle */}
      <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.9, 5]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.85} flatShading />
      </mesh>

      {/* Little Bucket hanging */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.25, 6]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} flatShading />
      </mesh>

      {/* Well Roof Canopy (Pitched shingle roof) */}
      <group position={[0, 2.45, 0]}>
        <mesh position={[-0.55, 0.25, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[1.0, 0.08, 2.2]} />
          <meshStandardMaterial color={PALETTE.roofTerracotta} roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0.55, 0.25, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[1.0, 0.08, 2.2]} />
          <meshStandardMaterial color={PALETTE.roofTerracotta} roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[0.12, 0.12, 2.3]} />
          <meshStandardMaterial color={PALETTE.woodDark} flatShading />
        </mesh>
      </group>
    </group>
  );
};

export const Signpost: React.FC<{
  position: [number, number, number];
  rotation?: number;
}> = ({ position, rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Post */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 1.8, 5]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>

      {/* Sign pointing North to Forest */}
      <mesh position={[0, 1.5, 0.25]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.65]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} flatShading />
      </mesh>

      {/* Sign pointing South to Farm & River */}
      <mesh position={[0, 1.25, -0.25]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.65]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} flatShading />
      </mesh>

      {/* Sign pointing West to Village */}
      <mesh position={[-0.25, 1.0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.6]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} flatShading />
      </mesh>
    </group>
  );
};

export const VillageBench: React.FC<{
  position: [number, number, number];
  rotation?: number;
}> = ({ position, rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Bench Seat */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.08, 0.5]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} flatShading />
      </mesh>
      {/* Bench Backrest */}
      <mesh position={[0, 0.8, -0.22]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.35, 0.06]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} flatShading />
      </mesh>
      {/* Legs */}
      {[-0.6, 0.6].map((x) =>
        [-0.18, 0.18].map((z) => (
          <mesh key={`leg-${x}-${z}`} position={[x, 0.22, z]} castShadow>
            <boxGeometry args={[0.08, 0.44, 0.08]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </mesh>
        ))
      )}
    </group>
  );
};

export const LanternPost: React.FC<{
  position: [number, number, number];
}> = ({ position }) => {
  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 2.5, 5]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.85} flatShading />
      </mesh>
      {/* Arm */}
      <mesh position={[0.2, 2.3, 0]} castShadow>
        <boxGeometry args={[0.45, 0.07, 0.07]} />
        <meshStandardMaterial color={PALETTE.woodDark} flatShading />
      </mesh>
      {/* Lantern Lamp */}
      <group position={[0.4, 2.1, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <coneGeometry args={[0.14, 0.1, 4]} />
          <meshStandardMaterial color={PALETTE.rockDark} flatShading />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.14, 0.16, 0.14]} />
          <meshStandardMaterial
            color="#ffeaa7"
            emissive="#ffcc00"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#ffeaa7" intensity={0.5} distance={5} />
      </group>
    </group>
  );
};
