import React from 'react';
import { getBuildingMaterialProps } from './BuildingMaterials';

interface BuildingModelProps {
  isGhost?: boolean;
  isValid?: boolean;
}

export const ChickenCoopBuilding: React.FC<BuildingModelProps> = ({
  isGhost = false,
  isValid = true,
}) => {
  const honeyWood = '#c08552';
  const darkTimber = '#4a2810';
  const warmPine = '#ddb892';
  const terracottaRoof = '#d96b43';
  const strawColor = '#f4e285';
  const metalColor = '#495057';
  const waterBlue = '#0077b6';

  return (
    <group>
      {/* 1. Ground Straw Bedding & Stone Footings */}
      <mesh position={[0, 0.04, 0]} receiveShadow={!isGhost}>
        <cylinderGeometry args={[1.3, 1.4, 0.08, 8]} />
        <meshStandardMaterial {...getBuildingMaterialProps(strawColor, isGhost, isValid)} roughness={0.95} />
      </mesh>

      {/* 4 Stone Pad Footings */}
      {[
        [-0.85, -0.75],
        [0.85, -0.75],
        [-0.85, 0.75],
        [0.85, 0.75],
      ].map(([x, z], idx) => (
        <mesh key={`pad-${idx}`} position={[x, 0.08, z]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.28, 0.16, 0.28]} />
          <meshStandardMaterial {...getBuildingMaterialProps('#6c757d', isGhost, isValid)} />
        </mesh>
      ))}

      {/* 2. Four Chunky Sturdy Timber Stilts / Legs */}
      {[
        [-0.85, -0.75],
        [0.85, -0.75],
        [-0.85, 0.75],
        [0.85, 0.75],
      ].map(([x, z], idx) => (
        <mesh key={`stilt-${idx}`} position={[x, 0.45, z]} castShadow={!isGhost}>
          <boxGeometry args={[0.16, 0.75, 0.16]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
        </mesh>
      ))}

      {/* Stilt Cross Bracing (Underfloor reinforcement) */}
      <mesh position={[0, 0.38, -0.75]} castShadow={!isGhost}>
        <boxGeometry args={[1.7, 0.08, 0.08]} />
        <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
      </mesh>
      <mesh position={[0, 0.38, 0.75]} castShadow={!isGhost}>
        <boxGeometry args={[1.7, 0.08, 0.08]} />
        <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
      </mesh>

      {/* 3. Main Hen House Elevated Body */}
      <mesh position={[0, 1.45, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[2.0, 1.35, 1.7]} />
        <meshStandardMaterial {...getBuildingMaterialProps(honeyWood, isGhost, isValid)} />
      </mesh>

      {/* Chunky Dark Timber Corner Posts & Wall Belts */}
      {[
        [-1.02, -0.87],
        [1.02, -0.87],
        [-1.02, 0.87],
        [1.02, 0.87],
      ].map(([x, z], idx) => (
        <mesh key={`post-${idx}`} position={[x, 1.45, z]} castShadow={!isGhost}>
          <boxGeometry args={[0.14, 1.4, 0.14]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
        </mesh>
      ))}

      {/* Base Floor Plate Rim */}
      <mesh position={[0, 0.82, 0]} castShadow={!isGhost}>
        <boxGeometry args={[2.14, 0.12, 1.84]} />
        <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
      </mesh>

      {/* 4. Chunky Terracotta Shingle Roof with Fascia Trim */}
      <group position={[0, 2.22, 0]}>
        {/* Left Roof Slab */}
        <mesh position={[-0.6, 0.32, 0]} rotation={[0, 0, Math.PI / 5.2]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[1.4, 0.16, 2.0]} />
          <meshStandardMaterial {...getBuildingMaterialProps(terracottaRoof, isGhost, isValid)} />
        </mesh>
        {/* Right Roof Slab */}
        <mesh position={[0.6, 0.32, 0]} rotation={[0, 0, -Math.PI / 5.2]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[1.4, 0.16, 2.0]} />
          <meshStandardMaterial {...getBuildingMaterialProps(terracottaRoof, isGhost, isValid)} />
        </mesh>
        {/* Heavy Ridge Cap Beam */}
        <mesh position={[0, 0.72, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.22, 0.18, 2.08]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
        </mesh>
        {/* Gable End Infill Walls Front & Back */}
        {[-0.86, 0.86].map((z, idx) => (
          <mesh key={`gable-${idx}`} position={[0, 0.28, z]}>
            <boxGeometry args={[1.7, 0.55, 0.05]} />
            <meshStandardMaterial {...getBuildingMaterialProps(warmPine, isGhost, isValid)} />
          </mesh>
        ))}
      </group>

      {/* 5. Side Nesting Box Extension (Right Side: X = 1.25) */}
      <group position={[1.25, 1.15, 0]}>
        {/* Nesting Compartment Body */}
        <mesh castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.6, 0.65, 1.15]} />
          <meshStandardMaterial {...getBuildingMaterialProps(warmPine, isGhost, isValid)} />
        </mesh>
        {/* Slanted Hinged Lid Roof */}
        <mesh position={[0.02, 0.38, 0]} rotation={[0, 0, -0.32]} castShadow={!isGhost}>
          <boxGeometry args={[0.72, 0.1, 1.28]} />
          <meshStandardMaterial {...getBuildingMaterialProps(terracottaRoof, isGhost, isValid)} />
        </mesh>
        {/* Timber Support Bracket underneath */}
        <mesh position={[-0.1, -0.4, 0]} rotation={[0, 0, Math.PI / 4]} castShadow={!isGhost}>
          <boxGeometry args={[0.1, 0.35, 0.8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
        </mesh>
      </group>

      {/* 6. Front Pop-Hole Hatch Doorway & Notched Ramp */}
      <group position={[0, 1.05, 0.87]}>
        {/* Door Frame */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.55, 0.65, 0.06]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
        </mesh>
        {/* Open Door Interior Dark */}
        <mesh position={[0, 0.05, 0.02]}>
          <boxGeometry args={[0.42, 0.52, 0.04]} />
          <meshStandardMaterial {...getBuildingMaterialProps('#1a1412', isGhost, isValid)} />
        </mesh>
      </group>

      {/* Sturdy Wooden Chicken Ramp with Climbing Slats */}
      <group position={[0, 0.42, 1.42]} rotation={[0.48, 0, 0]}>
        {/* Main Ramp Plank */}
        <mesh castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.44, 0.08, 1.25]} />
          <meshStandardMaterial {...getBuildingMaterialProps(warmPine, isGhost, isValid)} />
        </mesh>
        {/* Climbing Foot Slats */}
        {[-0.45, -0.22, 0, 0.22, 0.45].map((z, idx) => (
          <mesh key={`step-${idx}`} position={[0, 0.05, z]}>
            <boxGeometry args={[0.46, 0.04, 0.06]} />
            <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
          </mesh>
        ))}
      </group>

      {/* 7. Front Wire-Mesh Roosting Window */}
      <group position={[-0.55, 1.6, 0.87]}>
        <mesh position={[0, 0, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.46, 0.42, 0.04]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.36, 0.32, 0.02]} />
          <meshStandardMaterial {...getBuildingMaterialProps('#f8f9fa', isGhost, isValid)} />
        </mesh>
      </group>

      {/* 8. Farm Props: Grain Feed Trough & Water Dish */}
      <group position={[-1.2, 0, 0.6]}>
        {/* Carved Wooden Feed Trough */}
        <mesh position={[0, 0.12, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.36, 0.24, 0.7]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkTimber, isGhost, isValid)} />
        </mesh>
        {/* Yellow Grain inside */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.26, 0.06, 0.58]} />
          <meshStandardMaterial {...getBuildingMaterialProps(strawColor, isGhost, isValid)} />
        </mesh>
      </group>

      {/* Fresh Water Pan */}
      <group position={[-1.2, 0, -0.3]}>
        <mesh position={[0, 0.08, 0]} castShadow={!isGhost}>
          <cylinderGeometry args={[0.18, 0.22, 0.16, 8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(waterBlue, isGhost, isValid)} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};
