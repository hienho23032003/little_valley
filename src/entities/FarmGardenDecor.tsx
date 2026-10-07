import React from 'react';
import { PALETTE } from '../utils/colors';
import { MedievalVine, MedievalCratesStack } from './environment/MedievalProps';

export interface GardenDecorProps {
  position?: [number, number, number];
  rotation?: number;
}

// ============================================================================
// 1. PUMPKIN PATCH (Rich autumnal vegetable garden)
// ============================================================================
export const PumpkinPatch = React.memo<GardenDecorProps>(({ position = [0, 0, 0], rotation = 0 }) => {
  const pumpkins: [number, number, number, number][] = [
    [-1.2, 0.22, -0.6, 0.35],
    [-0.4, 0.26, -0.8, 0.42],
    [0.5, 0.24, -0.5, 0.38],
    [1.3, 0.20, -0.7, 0.32],
    [-0.8, 0.28, 0.4, 0.45],
    [0.1, 0.22, 0.6, 0.36],
    [0.9, 0.25, 0.3, 0.40],
    [-0.2, 0.20, 0.0, 0.30],
  ];

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Tilled Raised Soil Mound */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[3.8, 0.16, 2.4]} />
        <meshStandardMaterial color="#3d2616" roughness={0.96} flatShading />
      </mesh>

      {/* Foliage Vine Runners */}
      {[-1.0, 0, 1.0].map((vx, idx) => (
        <mesh key={`vine-${idx}`} position={[vx, 0.17, 0]} rotation={[-Math.PI / 2, 0, idx * 0.4]}>
          <planeGeometry args={[1.2, 0.8]} />
          <meshStandardMaterial color="#40916c" roughness={0.8} flatShading />
        </mesh>
      ))}

      {/* Individual Plump 3D Pumpkins */}
      {pumpkins.map(([px, py, pz, r], idx) => (
        <group key={`pumpkin-${idx}`} position={[px, py, pz]} rotation={[0, idx * 0.7, 0]}>
          {/* Ribbed Pumpkin Body */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[r, 8, 8]} />
            <meshStandardMaterial color="#e76f51" roughness={0.5} flatShading />
          </mesh>
          {/* Green Stem */}
          <mesh position={[0, r + 0.05, 0]} rotation={[0.2, 0, 0.1]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.12, 4]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
});

// ============================================================================
// 2. CABBAGE & LETTUCE ROWS
// ============================================================================
export const CabbageRow = React.memo<GardenDecorProps>(({ position = [0, 0, 0], rotation = 0 }) => {
  const heads = [-1.4, -0.7, 0, 0.7, 1.4];

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Tilled Furrow Mound */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[3.8, 0.16, 1.4]} />
        <meshStandardMaterial color="#43281c" roughness={0.95} flatShading />
      </mesh>

      {[-0.35, 0.35].map((rowZ, rowIdx) => (
        <group key={`cabbage-row-${rowIdx}`} position={[0, 0.16, rowZ]}>
          {heads.map((hx, idx) => (
            <group key={`cabbage-${rowIdx}-${idx}`} position={[hx, 0.12, 0]} rotation={[0, idx + rowIdx, 0]}>
              {/* Outer Leaves */}
              <mesh castShadow>
                <sphereGeometry args={[0.22, 6, 6]} />
                <meshStandardMaterial color="#52b788" roughness={0.75} flatShading />
              </mesh>
              {/* Inner Core Heart */}
              <mesh position={[0, 0.05, 0]}>
                <sphereGeometry args={[0.16, 6, 6]} />
                <meshStandardMaterial color="#95d5b2" roughness={0.7} flatShading />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
});

// ============================================================================
// 3. GARDEN SCARECROW (Charming farm centerpiece)
// ============================================================================
export const GardenScarecrow = React.memo<GardenDecorProps>(({ position = [0, 0, 0], rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Vertical Timber Post */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 2.2, 5]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>

      {/* Horizontal Crossbeam Arms */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 5]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
      </mesh>

      {/* Tunic / Coat Body */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[0.35, 0.75, 5]} />
        <meshStandardMaterial color="#1d3557" roughness={0.85} flatShading />
      </mesh>

      {/* Straw Sleeves */}
      {[-0.6, 0.6].map((sx, idx) => (
        <mesh key={`sleeve-${idx}`} position={[sx, 1.48, 0]} rotation={[0, 0, idx === 0 ? 0.3 : -0.3]}>
          <cylinderGeometry args={[0.08, 0.12, 0.45, 5]} />
          <meshStandardMaterial color="#e9c46a" roughness={0.9} flatShading />
        </mesh>
      ))}

      {/* Burlap Sack Head */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.22, 6, 6]} />
        <meshStandardMaterial color="#e0c097" roughness={0.95} flatShading />
      </mesh>

      {/* Straw Hat */}
      <group position={[0, 2.05, 0]} rotation={[0.1, 0, -0.15]}>
        {/* Brim */}
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 8]} />
          <meshStandardMaterial color="#cb997e" roughness={0.9} flatShading />
        </mesh>
        {/* Crown */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.25, 0.22, 7]} />
          <meshStandardMaterial color="#cb997e" roughness={0.9} flatShading />
        </mesh>
      </group>
    </group>
  );
});

// ============================================================================
// 4. GARDEN TRELLIS WITH CLIMBING VINES
// ============================================================================
export const GardenTrellis = React.memo<GardenDecorProps>(({ position = [0, 0, 0], rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* 2 Vertical Wooden Posts */}
      {[-1.2, 1.2].map((tx) => (
        <mesh key={`trellis-post-${tx}`} position={[tx, 1.3, 0]} castShadow>
          <boxGeometry args={[0.12, 2.6, 0.12]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
        </mesh>
      ))}

      {/* Top Header Beam */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <boxGeometry args={[2.7, 0.14, 0.14]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>

      {/* Cross Lattice Slats */}
      {[-0.6, 0, 0.6].map((tx, idx) => (
        <mesh key={`slat-v-${idx}`} position={[tx, 1.3, 0]}>
          <boxGeometry args={[0.04, 2.4, 0.04]} />
          <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.85} />
        </mesh>
      ))}
      {[0.7, 1.3, 1.9].map((ty, idx) => (
        <mesh key={`slat-h-${idx}`} position={[0, ty, 0]}>
          <boxGeometry args={[2.4, 0.04, 0.04]} />
          <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.85} />
        </mesh>
      ))}

      {/* Lush Climbing Vines on the trellis */}
      <MedievalVine position={[-0.8, 2.4, 0.05]} scale={0.9} variant={1} />
      <MedievalVine position={[0.8, 2.4, 0.05]} scale={0.9} variant={4} />
    </group>
  );
});

// ============================================================================
// 5. COMPLETE ACTIVE FARMSTEAD GARDEN AREA
// ============================================================================
export const FarmGardenCompound: React.FC = React.memo(() => {
  return (
    <group>
      {/* Pumpkin Patch beside the animal pasture (X: 9.0, Z: 7.5) */}
      <PumpkinPatch position={[8.5, 0, 7.5]} rotation={-0.1} />

      {/* Cabbage & Lettuce Garden Bed (X: 8.5, Z: 10.8) */}
      <CabbageRow position={[8.5, 0, 10.8]} rotation={0.05} />

      {/* Garden Scarecrow overseeing the harvest (X: 12.0, Z: 9.0) */}
      <GardenScarecrow position={[12.0, 0, 9.0]} rotation={-0.6} />

      {/* Wooden Trellis with climbing vines (X: 5.5, Z: 14.5) */}
      <GardenTrellis position={[8.5, 0, 14.0]} rotation={0} />

      {/* Harvest Crates with Fresh Vegetables */}
      <MedievalCratesStack position={[5.5, 0, 7.0]} rotation={0.25} scale={0.9} />
    </group>
  );
});
