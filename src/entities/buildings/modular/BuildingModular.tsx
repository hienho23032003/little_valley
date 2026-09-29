import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../../../utils/colors';
import {
  ModularBuildingConfig,
  RoofStyle,
  WallStyle,
  DoorStyle,
  WindowPlacement,
} from '../../../data/buildingConfigs';
import {
  BuildingSign,
  ModularBarrel,
  ModularCrate,
  FirewoodCord,
  FlowerPotPlanter,
  BelfryTower,
  WeathervaneFinial,
} from './BuildingProps';

// ----------------------------------------------------------------------
// 1. FOUNDATION COMPONENT WITH STONE STEP
// ----------------------------------------------------------------------
export const BuildingFoundation: React.FC<{
  width: number;
  depth: number;
  height?: number;
  color?: string;
}> = ({ width, depth, height = 0.35, color = PALETTE.rockBase }) => (
  <group position={[0, height / 2, 0]}>
    {/* Main Stone Foundation Slab */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.92} flatShading />
    </mesh>

    {/* Front Entrance Stone Step */}
    <mesh position={[0, -height / 4, depth / 2 + 0.2]} castShadow receiveShadow>
      <boxGeometry args={[1.5, height / 2, 0.45]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  </group>
);

// ----------------------------------------------------------------------
// 2. MODULAR WALLS WITH CHUNKY TIMBER FRAMING
// ----------------------------------------------------------------------
export const ModularWalls: React.FC<{
  width: number;
  depth: number;
  height: number;
  wallStyle: WallStyle;
  wallColor: string;
  timberColor?: string;
}> = ({
  width,
  depth,
  height,
  wallStyle,
  wallColor,
  timberColor = PALETTE.woodDark,
}) => {
  const isHalfTimbered = wallStyle === 'timber_frame_plaster';
  const isRedBarn = wallStyle === 'red_barn';
  const isStone = wallStyle === 'fieldstone' || wallStyle === 'blacksmith_stone';

  return (
    <group position={[0, height / 2, 0]}>
      {/* Main Core Wall Block */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width - 0.08, height, depth - 0.08]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={isStone ? 0.95 : 0.85}
          flatShading
        />
      </mesh>

      {/* 4 Chunky Corner Timber / Stone Pillars */}
      {[-width / 2 + 0.09, width / 2 - 0.09].map((x) =>
        [-depth / 2 + 0.09, depth / 2 - 0.09].map((z) => (
          <mesh key={`post-${x}-${z}`} position={[x, 0, z]} castShadow>
            <boxGeometry args={[0.22, height + 0.04, 0.22]} />
            <meshStandardMaterial
              color={isRedBarn ? '#ffffff' : timberColor}
              roughness={0.9}
              flatShading
            />
          </mesh>
        ))
      )}

      {/* Top Eaves Wall Trim Header Beam */}
      <mesh position={[0, height / 2 - 0.04, 0]} castShadow>
        <boxGeometry args={[width + 0.06, 0.16, depth + 0.06]} />
        <meshStandardMaterial
          color={isRedBarn ? '#ffffff' : timberColor}
          roughness={0.88}
          flatShading
        />
      </mesh>

      {/* Bottom Sill Timber Beam */}
      <mesh position={[0, -height / 2 + 0.05, 0]} castShadow>
        <boxGeometry args={[width + 0.04, 0.12, depth + 0.04]} />
        <meshStandardMaterial
          color={isRedBarn ? '#ffffff' : timberColor}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* Half-Timbered Tudor Bracing */}
      {isHalfTimbered && (
        <>
          {/* Front Wall Diagonal Braces */}
          <mesh
            position={[-width / 3.8, 0, depth / 2 - 0.02]}
            rotation={[0, 0, Math.PI / 4.2]}
            castShadow
          >
            <boxGeometry args={[0.12, height * 0.78, 0.04]} />
            <meshStandardMaterial color={timberColor} roughness={0.9} />
          </mesh>
          <mesh
            position={[width / 3.8, 0, depth / 2 - 0.02]}
            rotation={[0, 0, -Math.PI / 4.2]}
            castShadow
          >
            <boxGeometry args={[0.12, height * 0.78, 0.04]} />
            <meshStandardMaterial color={timberColor} roughness={0.9} />
          </mesh>
          {/* Mid Horizontal Wall Stringer */}
          <mesh position={[0, 0, depth / 2 - 0.02]}>
            <boxGeometry args={[width - 0.2, 0.12, 0.04]} />
            <meshStandardMaterial color={timberColor} roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Red Barn White Crossbeam Decors */}
      {isRedBarn && (
        <>
          <mesh position={[0, 0, depth / 2 - 0.02]}>
            <boxGeometry args={[width - 0.2, 0.12, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[-width / 3.8, 0, depth / 2 - 0.02]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.1, height * 0.7, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[width / 3.8, 0, depth / 2 - 0.02]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.1, height * 0.7, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
};

// ----------------------------------------------------------------------
// 3. CHUNKY ARCHITECTURAL ROOF SYSTEM (NO FRONT TRIANGULAR PROJECTION)
// Ridge runs along the X-AXIS (width), producing a wide horizontal eaves
// profile on front facade with chunky sloped planes:
//         _________
//        /         \
//       /   ROOF    \
//      /_____________\
// ----------------------------------------------------------------------
export const ModularRoof: React.FC<{
  width: number;
  depth: number;
  roofHeight: number;
  roofStyle: RoofStyle;
  roofColor: string;
  roofOverhang?: number;
  ridgeColor?: string;
  wallColor: string;
}> = ({
  width,
  depth,
  roofHeight,
  roofStyle,
  roofColor,
  roofOverhang = 0.38,
  ridgeColor = PALETTE.woodDark,
  wallColor,
}) => {
  const roofW = width + roofOverhang * 2;
  const roofD = depth + roofOverhang * 2;
  const halfD = roofD / 2;

  // 1. Gambrel Roof (Classic Barn Style, ridge along X)
  if (roofStyle === 'gambrel') {
    const lowerH = roofHeight * 0.55;
    const upperH = roofHeight * 0.45;
    const breakZ = halfD * 0.6;

    return (
      <group position={[0, 0, 0]}>
        {/* Front Lower Steep Pitch Slab */}
        <mesh
          position={[0, lowerH / 2, halfD - breakZ / 2]}
          rotation={[Math.PI / 3.2, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roofW, 0.18, lowerH * 1.35]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>
        {/* Back Lower Steep Pitch Slab */}
        <mesh
          position={[0, lowerH / 2, -halfD + breakZ / 2]}
          rotation={[-Math.PI / 3.2, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roofW, 0.18, lowerH * 1.35]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>

        {/* Front Upper Gentle Pitch Slab */}
        <mesh
          position={[0, lowerH + upperH / 2, breakZ / 2]}
          rotation={[Math.PI / 7.2, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roofW, 0.18, breakZ * 1.15]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>
        {/* Back Upper Gentle Pitch Slab */}
        <mesh
          position={[0, lowerH + upperH / 2, -breakZ / 2]}
          rotation={[-Math.PI / 7.2, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roofW, 0.18, breakZ * 1.15]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>

        {/* Horizontal Ridge Cap Beam */}
        <mesh position={[0, roofHeight + 0.08, 0]} castShadow>
          <boxGeometry args={[roofW + 0.1, 0.22, 0.28]} />
          <meshStandardMaterial color={ridgeColor} roughness={0.85} flatShading />
        </mesh>

        {/* Side Gambrel Gable Infill Walls (Left & Right Ends) */}
        {[-width / 2 + 0.02, width / 2 - 0.02].map((x, idx) => (
          <mesh key={`gambrel-end-${idx}`} position={[x, roofHeight * 0.48, 0]} castShadow>
            <boxGeometry args={[0.06, roofHeight * 0.95, depth * 0.92]} />
            <meshStandardMaterial color={wallColor} roughness={0.88} flatShading />
          </mesh>
        ))}
      </group>
    );
  }

  // 2. Shed / Sloped Lean-to Roof (Single Pitch, clean horizontal eave on front)
  if (roofStyle === 'shed_sloped') {
    const slopeL = Math.hypot(roofD, roofHeight) + 0.2;
    const angle = Math.atan2(roofHeight, roofD);

    return (
      <group position={[0, roofHeight / 2, 0]}>
        {/* Single Main Sloped Roof Slab */}
        <mesh
          position={[0, 0, 0]}
          rotation={[-angle, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roofW, 0.2, slopeL]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>
        {/* High Eave Header Beam (Back) */}
        <mesh position={[0, roofHeight / 2 + 0.06, -roofD / 2]} castShadow>
          <boxGeometry args={[roofW + 0.05, 0.24, 0.24]} />
          <meshStandardMaterial color={ridgeColor} roughness={0.85} />
        </mesh>
        {/* Low Eave Fascia Trim (Front) */}
        <mesh position={[0, -roofHeight / 2 + 0.06, roofD / 2]} castShadow>
          <boxGeometry args={[roofW + 0.05, 0.16, 0.16]} />
          <meshStandardMaterial color={ridgeColor} roughness={0.85} />
        </mesh>
        {/* Side Gable Wall Wedges */}
        {[-width / 2 + 0.02, width / 2 - 0.02].map((x, idx) => (
          <mesh key={`shed-side-${idx}`} position={[x, -0.05, 0]} castShadow>
            <boxGeometry args={[0.05, roofHeight * 0.9, depth * 0.94]} />
            <meshStandardMaterial color={wallColor} roughness={0.88} flatShading />
          </mesh>
        ))}
      </group>
    );
  }

  // 3. Thatched Curved / Hipped Cottage Roof
  if (roofStyle === 'thatched') {
    const slopeL = Math.hypot(halfD, roofHeight) + 0.35;
    const angle = Math.atan2(roofHeight, halfD);

    return (
      <group position={[0, roofHeight / 2, 0]}>
        {/* Front Thatched Slope */}
        <mesh
          position={[0, 0.05, halfD / 2]}
          rotation={[angle * 0.95, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roofW, 0.3, slopeL]} />
          <meshStandardMaterial color={roofColor} roughness={0.95} flatShading />
        </mesh>
        {/* Back Thatched Slope */}
        <mesh
          position={[0, 0.05, -halfD / 2]}
          rotation={[-angle * 0.95, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roofW, 0.3, slopeL]} />
          <meshStandardMaterial color={roofColor} roughness={0.95} flatShading />
        </mesh>
        {/* Left Thatched Hip Slope */}
        <mesh
          position={[-roofW / 2 + 0.25, 0.05, 0]}
          rotation={[0, 0, -angle * 0.9]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[slopeL * 0.8, 0.28, roofD - 0.2]} />
          <meshStandardMaterial color={roofColor} roughness={0.95} flatShading />
        </mesh>
        {/* Right Thatched Hip Slope */}
        <mesh
          position={[roofW / 2 - 0.25, 0.05, 0]}
          rotation={[0, 0, angle * 0.9]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[slopeL * 0.8, 0.28, roofD - 0.2]} />
          <meshStandardMaterial color={roofColor} roughness={0.95} flatShading />
        </mesh>
        {/* Rounded Golden Straw Ridge Cap */}
        <mesh position={[0, roofHeight / 2 + 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, roofW + 0.1, 6]} />
          <meshStandardMaterial color="#c29b38" roughness={0.95} flatShading />
        </mesh>
      </group>
    );
  }

  // 4. Stately Hipped / Tower Bell Roof (Town Hall)
  if (roofStyle === 'tower_bell') {
    const slopeL = Math.hypot(halfD, roofHeight) + 0.25;
    const angle = Math.atan2(roofHeight, halfD);

    return (
      <group position={[0, roofHeight / 2, 0]}>
        {/* Front Slope */}
        <mesh position={[0, 0, halfD / 2]} rotation={[angle, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[roofW, 0.2, slopeL]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>
        {/* Back Slope */}
        <mesh position={[0, 0, -halfD / 2]} rotation={[-angle, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[roofW, 0.2, slopeL]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>
        {/* Left Slope */}
        <mesh position={[-roofW / 2 + 0.3, 0, 0]} rotation={[0, 0, -angle]} castShadow receiveShadow>
          <boxGeometry args={[slopeL * 0.85, 0.2, roofD - 0.2]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>
        {/* Right Slope */}
        <mesh position={[roofW / 2 - 0.3, 0, 0]} rotation={[0, 0, angle]} castShadow receiveShadow>
          <boxGeometry args={[slopeL * 0.85, 0.2, roofD - 0.2]} />
          <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
        </mesh>
        {/* Center Plinth Platform for Belfry Tower */}
        <mesh position={[0, roofHeight / 2 + 0.05, 0]} castShadow>
          <boxGeometry args={[roofW * 0.45, 0.16, roofD * 0.45]} />
          <meshStandardMaterial color={ridgeColor} roughness={0.85} flatShading />
        </mesh>
      </group>
    );
  }

  // 5. Standard Gable & Extended Gable (Horizontal Ridge along X, Slopes along Z)
  // Front facade (+Z) displays a wide, chunky horizontal eaves profile:
  //         _________
  //        /         \
  //       /   ROOF    \
  //      /_____________\
  const slopeL = Math.hypot(halfD, roofHeight) + 0.25;
  const angle = Math.atan2(roofHeight, halfD);

  return (
    <group position={[0, roofHeight / 2, 0]}>
      {/* Front Roof Slab (Slopes down toward front eave at +Z) */}
      <mesh
        position={[0, 0, halfD / 2]}
        rotation={[angle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[roofW, 0.2, slopeL]} />
        <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
      </mesh>

      {/* Back Roof Slab (Slopes down toward back eave at -Z) */}
      <mesh
        position={[0, 0, -halfD / 2]}
        rotation={[-angle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[roofW, 0.2, slopeL]} />
        <meshStandardMaterial color={roofColor} roughness={0.75} flatShading />
      </mesh>

      {/* Chunky Horizontal Ridge Cap Beam along X */}
      <mesh position={[0, roofHeight / 2 + 0.08, 0]} castShadow>
        <boxGeometry args={[roofW + 0.1, 0.24, 0.26]} />
        <meshStandardMaterial color={ridgeColor} roughness={0.85} flatShading />
      </mesh>

      {/* Front Eaves Fascia Board (runs horizontally along width) */}
      <mesh position={[0, -roofHeight / 2 + 0.08, halfD + 0.04]} castShadow>
        <boxGeometry args={[roofW + 0.06, 0.16, 0.14]} />
        <meshStandardMaterial color={ridgeColor} roughness={0.85} />
      </mesh>
      {/* Back Eaves Fascia Board */}
      <mesh position={[0, -roofHeight / 2 + 0.08, -halfD - 0.04]} castShadow>
        <boxGeometry args={[roofW + 0.06, 0.16, 0.14]} />
        <meshStandardMaterial color={ridgeColor} roughness={0.85} />
      </mesh>

      {/* Side Gable Wall Infill Triangles (Left & Right Ends: -X and +X) */}
      {[-width / 2 + 0.02, width / 2 - 0.02].map((x, idx) => (
        <group key={`gable-side-${idx}`} position={[x, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, roofHeight * 0.92, depth * 0.94]} />
            <meshStandardMaterial color={wallColor} roughness={0.88} flatShading />
          </mesh>
          {/* Side Gable Sloped Bargeboard Trims */}
          <mesh position={[0, 0, halfD / 2]} rotation={[angle, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.22, slopeL + 0.05]} />
            <meshStandardMaterial color={ridgeColor} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0, -halfD / 2]} rotation={[-angle, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.22, slopeL + 0.05]} />
            <meshStandardMaterial color={ridgeColor} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------
// 4. DETAILED DOORS
// ----------------------------------------------------------------------
export const ModularDoor: React.FC<{
  position: [number, number, number];
  doorStyle: DoorStyle;
  doorColor?: string;
  width?: number;
  height?: number;
}> = ({
  position,
  doorStyle,
  doorColor = PALETTE.doorWood,
  width = 1.05,
  height = 1.7,
}) => {
  const isBarn = doorStyle === 'double_barn';
  const isShop = doorStyle === 'shop_transom';
  const doorW = isBarn ? width * 1.6 : width;

  return (
    <group position={position}>
      {/* Outer Door Frame Timber */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[doorW + 0.18, height + 0.1, 0.08]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>

      {/* Door Leaf Body */}
      <mesh position={[0, height / 2, 0.03]} castShadow>
        <boxGeometry args={[doorW, height, 0.06]} />
        <meshStandardMaterial color={doorColor} roughness={0.8} flatShading />
      </mesh>

      {/* Barn Double Door Details & White X Crosses */}
      {isBarn && (
        <>
          <mesh position={[0, height / 2, 0.07]}>
            <boxGeometry args={[0.04, height, 0.02]} />
            <meshStandardMaterial color="#212529" />
          </mesh>
          {/* Left X brace */}
          <mesh position={[-doorW / 4, height / 2, 0.07]} rotation={[0, 0, 0.58]}>
            <boxGeometry args={[0.08, height * 0.8, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.85} />
          </mesh>
          <mesh position={[-doorW / 4, height / 2, 0.07]} rotation={[0, 0, -0.58]}>
            <boxGeometry args={[0.08, height * 0.8, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.85} />
          </mesh>
          {/* Right X brace */}
          <mesh position={[doorW / 4, height / 2, 0.07]} rotation={[0, 0, 0.58]}>
            <boxGeometry args={[0.08, height * 0.8, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.85} />
          </mesh>
          <mesh position={[doorW / 4, height / 2, 0.07]} rotation={[0, 0, -0.58]}>
            <boxGeometry args={[0.08, height * 0.8, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.85} />
          </mesh>
        </>
      )}

      {/* Shop Transom Window */}
      {isShop && (
        <group position={[0, height * 0.75, 0.06]}>
          <mesh>
            <boxGeometry args={[doorW * 0.75, height * 0.35, 0.02]} />
            <meshStandardMaterial
              color={PALETTE.windowGlow}
              emissive={PALETTE.windowGlow}
              emissiveIntensity={0.4}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[doorW * 0.75, 0.04, 0.02]} />
            <meshStandardMaterial color={PALETTE.woodDark} />
          </mesh>
        </group>
      )}

      {/* Brass Door Knob */}
      {!isBarn && (
        <mesh position={[doorW * 0.36, height * 0.48, 0.08]} castShadow>
          <sphereGeometry args={[0.045, 6, 6]} />
          <meshStandardMaterial color="#f4a261" metalness={0.7} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
};

// ----------------------------------------------------------------------
// 5. DETAILED WINDOWS (Cross Mullions, Shutters, Flower Boxes)
// ----------------------------------------------------------------------
export const ModularWindow: React.FC<WindowPlacement> = ({
  position,
  rotation = [0, 0, 0],
  size = 0.72,
  hasFlowerBox = false,
  hasShutters = false,
  style = 'cross_mullion',
}) => {
  const isArched = style === 'arched_glass';

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Window Frame */}
      <mesh position={[0, 0, 0.01]} castShadow>
        <boxGeometry args={[size + 0.14, size + 0.14, 0.06]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>

      {/* Glowing Warm Window Pane */}
      <mesh position={[0, 0, 0.03]} castShadow>
        {isArched ? (
          <cylinderGeometry args={[size / 2, size / 2, 0.04, 8]} />
        ) : (
          <boxGeometry args={[size, size, 0.04]} />
        )}
        <meshStandardMaterial
          color={PALETTE.windowGlow}
          emissive={PALETTE.windowGlow}
          emissiveIntensity={0.38}
          roughness={0.25}
        />
      </mesh>

      {/* Wooden Mullion Cross Bars */}
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[size, 0.05, 0.02]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[0.05, size, 0.02]} />
        <meshStandardMaterial color={PALETTE.woodDark} />
      </mesh>

      {/* Colorful Wooden Shutters */}
      {hasShutters && (
        <>
          <mesh position={[-size * 0.65, 0, 0.04]} castShadow>
            <boxGeometry args={[size * 0.36, size + 0.08, 0.04]} />
            <meshStandardMaterial color="#4a7c59" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[size * 0.65, 0, 0.04]} castShadow>
            <boxGeometry args={[size * 0.36, size + 0.08, 0.04]} />
            <meshStandardMaterial color="#4a7c59" roughness={0.8} flatShading />
          </mesh>
        </>
      )}

      {/* Window Flower Box with Blooming Flowers */}
      {hasFlowerBox && (
        <group position={[0, -size / 2 - 0.11, 0.13]}>
          <mesh castShadow>
            <boxGeometry args={[size + 0.18, 0.16, 0.22]} />
            <meshStandardMaterial color={PALETTE.woodMedium} flatShading />
          </mesh>
          {/* Blossoms */}
          <mesh position={[-size * 0.28, 0.12, 0]}>
            <sphereGeometry args={[0.08, 4, 4]} />
            <meshStandardMaterial color={PALETTE.flowerPink} flatShading />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.09, 4, 4]} />
            <meshStandardMaterial color={PALETTE.flowerYellow} flatShading />
          </mesh>
          <mesh position={[size * 0.28, 0.12, 0]}>
            <sphereGeometry args={[0.08, 4, 4]} />
            <meshStandardMaterial color={PALETTE.flowerLavender} flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ----------------------------------------------------------------------
// 6. CHIMNEY WITH REAL-TIME LOW-POLY SMOKE
// ----------------------------------------------------------------------
export const ModularChimney: React.FC<{
  position: [number, number, number];
  height?: number;
  material?: 'brick' | 'stone';
}> = ({ position, height = 2.0, material = 'brick' }) => {
  const smokeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!smokeRef.current) return;
    const t = state.clock.getElapsedTime();
    smokeRef.current.children.forEach((puff, idx) => {
      puff.position.y = height + 0.3 + ((t * 0.75 + idx * 0.55) % 1.3);
      const sc = 0.16 + (((t * 0.75 + idx * 0.55) % 1.3) / 1.3) * 0.24;
      puff.scale.set(sc, sc, sc);
      puff.position.x = Math.sin(t * 1.4 + idx) * 0.09;
    });
  });

  const isStone = material === 'stone';

  return (
    <group position={position}>
      {/* Chimney Shaft */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[0.62, height, 0.62]} />
        <meshStandardMaterial
          color={isStone ? PALETTE.rockDark : PALETTE.chimneyBrick}
          roughness={0.92}
          flatShading
        />
      </mesh>
      {/* Stone Cap Rim */}
      <mesh position={[0, height + 0.06, 0]} castShadow>
        <boxGeometry args={[0.74, 0.12, 0.74]} />
        <meshStandardMaterial color={PALETTE.rockDark} roughness={0.9} flatShading />
      </mesh>

      {/* Low-Poly Smoke Puffs */}
      <group ref={smokeRef}>
        {[0, 1, 2].map((idx) => (
          <mesh key={`smoke-${idx}`} position={[0, height + 0.3, 0]}>
            <dodecahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color={PALETTE.chimneySmoke}
              roughness={0.5}
              transparent
              opacity={0.65 - idx * 0.15}
              flatShading
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ----------------------------------------------------------------------
// 7. CLEAN ARCHITECTURAL PORCH (WOODEN VERANDA WITH HORIZONTAL EAVES)
// No awkward sharp triangular canopy! Clean, cozy, and architectural.
// ----------------------------------------------------------------------
export const ModularPorch: React.FC<{
  width: number;
  depth: number;
  hasAwning?: boolean;
  awningColor?: string;
  hasRailings?: boolean;
  wallDepth: number;
}> = ({
  width,
  depth,
  hasAwning = true,
  awningColor = PALETTE.roofTerracotta,
  hasRailings = true,
  wallDepth,
}) => {
  const porchZ = wallDepth / 2 + depth / 2;

  return (
    <group position={[0, 0, porchZ]}>
      {/* 1. Wooden Deck Floor */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <boxGeometry args={[width, 0.14, depth]} />
        <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} flatShading />
      </mesh>

      {/* 2. Front Corner Timber Support Posts */}
      {[-width / 2 + 0.14, width / 2 - 0.14].map((x) => (
        <group key={`porch-post-${x}`} position={[x, 1.2, depth / 2 - 0.14]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 2.0, 0.16]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </mesh>
          {/* Decorative Post Base Capital */}
          <mesh position={[0, -0.92, 0]}>
            <boxGeometry args={[0.22, 0.16, 0.22]} />
            <meshStandardMaterial color={PALETTE.woodDark} />
          </mesh>
        </group>
      ))}

      {/* 3. Horizontal Timber Lintel Header resting on posts */}
      <mesh position={[0, 2.15, depth / 2 - 0.14]} castShadow>
        <boxGeometry args={[width + 0.1, 0.16, 0.18]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
      </mesh>

      {/* 4. Optional Porch Handrails */}
      {hasRailings && (
        <>
          {/* Left Railing */}
          <mesh position={[-width / 2 + 0.1, 0.7, 0]} castShadow>
            <boxGeometry args={[0.08, 0.1, depth - 0.2]} />
            <meshStandardMaterial color={PALETTE.woodDark} />
          </mesh>
          {/* Right Railing */}
          <mesh position={[width / 2 - 0.1, 0.7, 0]} castShadow>
            <boxGeometry args={[0.08, 0.1, depth - 0.2]} />
            <meshStandardMaterial color={PALETTE.woodDark} />
          </mesh>
        </>
      )}

      {/* 5. Clean Horizontal Sloped Veranda Roof (slopes gently forward, NO triangle) */}
      {hasAwning && (
        <group position={[0, 2.3, 0]}>
          <mesh rotation={[0.2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.24, 0.12, depth + 0.28]} />
            <meshStandardMaterial color={awningColor} roughness={0.78} flatShading />
          </mesh>
          {/* Front Eave Fascia Board */}
          <mesh position={[0, -0.06, depth / 2 + 0.14]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[width + 0.28, 0.1, 0.08]} />
            <meshStandardMaterial color={PALETTE.woodDark} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ----------------------------------------------------------------------
// 8. MASTER MODULAR BUILDING COMPONENT (Supports Multi-Volume Blocks)
// ----------------------------------------------------------------------
export const ModularBuilding: React.FC<{
  config: ModularBuildingConfig;
}> = React.memo(({ config }) => {
  const {
    position,
    rotation,
    scale = [1, 1, 1],
    width,
    depth,
    height,
    foundationHeight = 0.35,
    foundationColor,
    wallStyle,
    wallColor,
    timberColor,
    roofStyle,
    roofHeight,
    roofColor,
    roofOverhang,
    ridgeColor,
    doorStyle,
    doorPosition,
    doorColor,
    windows,
    hasChimney,
    chimneyPosition,
    chimneyHeight,
    chimneyMaterial,
    hasPorch,
    porchConfig,
    signType = 'none',
    decorations = {},
  } = config;

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* 1. Stone Foundation with Steps */}
      <BuildingFoundation
        width={width + 0.35}
        depth={depth + 0.35}
        height={foundationHeight}
        color={foundationColor}
      />

      {/* 2. Main Building Structure */}
      <group position={[0, foundationHeight, 0]}>
        {/* Main Walls Block */}
        <ModularWalls
          width={width}
          depth={depth}
          height={height}
          wallStyle={wallStyle}
          wallColor={wallColor}
          timberColor={timberColor}
        />

        {/* 3. Chunky Roof System (Ridge along width, clean horizontal eaves) */}
        <group position={[0, height, 0]}>
          <ModularRoof
            width={width}
            depth={depth}
            roofHeight={roofHeight}
            roofStyle={roofStyle}
            roofColor={roofColor}
            roofOverhang={roofOverhang}
            ridgeColor={ridgeColor}
            wallColor={wallColor}
          />

          {/* Belfry Tower (Town Hall) */}
          {decorations.hasBelfry && (
            <BelfryTower roofHeight={roofHeight} roofColor={roofColor} />
          )}

          {/* Weathervane Finial */}
          {decorations.hasWeathervane && (
            <WeathervaneFinial position={[0, roofHeight + 0.1, 0]} />
          )}
        </group>

        {/* 4. Front Door */}
        <ModularDoor
          position={doorPosition || [0, 0, depth / 2 + 0.01]}
          doorStyle={doorStyle}
          doorColor={doorColor}
        />

        {/* 5. Windows */}
        {windows.map((win, idx) => (
          <ModularWindow key={`win-${idx}`} {...win} />
        ))}

        {/* 6. Porch (Veranda) */}
        {hasPorch && porchConfig && (
          <ModularPorch
            width={porchConfig.width}
            depth={porchConfig.depth}
            hasAwning={porchConfig.hasAwning}
            awningColor={porchConfig.awningColor || roofColor}
            hasRailings={porchConfig.hasRailings}
            wallDepth={depth}
          />
        )}

        {/* 7. Chimney with Animated Smoke */}
        {hasChimney && (
          <ModularChimney
            position={chimneyPosition || [width * 0.3, 0, -depth * 0.2]}
            height={chimneyHeight || height + 0.8}
            material={chimneyMaterial}
          />
        )}

        {/* 8. Hanging Shop Sign */}
        {signType !== 'none' && (
          <BuildingSign
            position={[width / 2 + 0.02, height * 0.7, depth * 0.35]}
            rotation={Math.PI / 2}
            type={signType}
          />
        )}

        {/* 9. Outdoor Props & Details */}
        {/* Barrels */}
        {decorations.hasBarrels &&
          decorations.barrelPositions?.map((pos, idx) => (
            <ModularBarrel key={`barrel-${idx}`} position={pos} />
          ))}

        {/* Crates */}
        {decorations.hasCrates &&
          decorations.cratePositions?.map((pos, idx) => (
            <ModularCrate key={`crate-${idx}`} position={pos} />
          ))}

        {/* Firewood */}
        {decorations.hasFirewood && decorations.firewoodPosition && (
          <FirewoodCord position={decorations.firewoodPosition} />
        )}

        {/* Flower Pots */}
        {decorations.hasFlowerPots &&
          decorations.flowerPotPositions?.map((pos, idx) => (
            <FlowerPotPlanter key={`pot-${idx}`} position={pos} />
          ))}

        {/* Benches */}
        {decorations.hasBenches &&
          decorations.benchPositions?.map((bench, idx) => (
            <group
              key={`bench-${idx}`}
              position={bench.position}
              rotation={[0, bench.rotation || 0, 0]}
            >
              <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.5, 0.08, 0.45]} />
                <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.75, -0.18]} castShadow>
                <boxGeometry args={[1.5, 0.32, 0.06]} />
                <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} />
              </mesh>
              {[-0.6, 0.6].map((bx) => (
                <mesh key={`b-leg-${bx}`} position={[bx, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.08, 0.4, 0.38]} />
                  <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
                </mesh>
              ))}
            </group>
          ))}

        {/* Lanterns */}
        {decorations.hasLanterns &&
          decorations.lanternPositions?.map((pos, idx) => (
            <group key={`bldg-lantern-${idx}`} position={pos}>
              <mesh position={[0, 0.1, 0]} castShadow>
                <coneGeometry args={[0.12, 0.08, 4]} />
                <meshStandardMaterial color={PALETTE.rockDark} flatShading />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.12, 0.14, 0.12]} />
                <meshStandardMaterial
                  color="#ffeaa7"
                  emissive="#ffcc00"
                  emissiveIntensity={0.65}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))}
      </group>
    </group>
  );
});
