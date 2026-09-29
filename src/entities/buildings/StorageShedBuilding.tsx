import React from 'react';
import { getBuildingMaterialProps } from './BuildingMaterials';

interface BuildingModelProps {
  isGhost?: boolean;
  isValid?: boolean;
}

export const StorageShedBuilding: React.FC<BuildingModelProps> = ({
  isGhost = false,
  isValid = true,
}) => {
  const woodPlanks = '#8d6e63';
  const darkWood = '#4e342e';
  const roofColor = '#3e5c76';
  const ironColor = '#212529';
  const firewoodColor = '#b08968';

  return (
    <group>
      {/* Stone Foundation Slab */}
      <mesh position={[0, 0.1, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[2.5, 0.2, 2.5]} />
        <meshStandardMaterial {...getBuildingMaterialProps('#78909c', isGhost, isValid)} />
      </mesh>

      {/* Main Wooden Shed Body */}
      <mesh position={[0, 1.1, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[2.3, 1.8, 2.3]} />
        <meshStandardMaterial {...getBuildingMaterialProps(woodPlanks, isGhost, isValid)} />
      </mesh>

      {/* Timber Corner Posts */}
      {[
        [-1.15, -1.15],
        [1.15, -1.15],
        [-1.15, 1.15],
        [1.15, 1.15],
      ].map(([x, z], idx) => (
        <mesh key={`post-${idx}`} position={[x, 1.1, z]} castShadow={!isGhost}>
          <boxGeometry args={[0.12, 1.85, 0.12]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkWood, isGhost, isValid)} />
        </mesh>
      ))}

      {/* Slanted Saltbox Shed Roof */}
      <mesh
        position={[0, 2.15, -0.05]}
        rotation={[Math.PI / 10, 0, 0]}
        castShadow={!isGhost}
      >
        <boxGeometry args={[2.6, 0.14, 2.65]} />
        <meshStandardMaterial {...getBuildingMaterialProps(roofColor, isGhost, isValid)} />
      </mesh>

      {/* Double Wooden Doors in Front */}
      <group position={[0, 0.9, 1.16]}>
        {/* Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.45, 0.04]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkWood, isGhost, isValid)} />
        </mesh>
        {/* Left door */}
        <mesh position={[-0.27, 0, 0.02]}>
          <boxGeometry args={[0.5, 1.35, 0.02]} />
          <meshStandardMaterial {...getBuildingMaterialProps(woodPlanks, isGhost, isValid)} />
        </mesh>
        {/* Right door */}
        <mesh position={[0.27, 0, 0.02]}>
          <boxGeometry args={[0.5, 1.35, 0.02]} />
          <meshStandardMaterial {...getBuildingMaterialProps(woodPlanks, isGhost, isValid)} />
        </mesh>
        {/* Iron Strap Hinges */}
        {[-0.4, 0.35].map((y, idx) => (
          <React.Fragment key={`hinge-${idx}`}>
            <mesh position={[-0.42, y, 0.04]}>
              <boxGeometry args={[0.25, 0.04, 0.01]} />
              <meshStandardMaterial {...getBuildingMaterialProps(ironColor, isGhost, isValid)} />
            </mesh>
            <mesh position={[0.42, y, 0.04]}>
              <boxGeometry args={[0.25, 0.04, 0.01]} />
              <meshStandardMaterial {...getBuildingMaterialProps(ironColor, isGhost, isValid)} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Side Firewood Log Stack */}
      <group position={[1.3, 0.3, 0]}>
        {[
          [-0.3, 0.1],
          [0.0, 0.1],
          [0.3, 0.1],
          [-0.15, 0.25],
          [0.15, 0.25],
        ].map(([z, y], idx) => (
          <mesh
            key={`log-${idx}`}
            position={[0, y, z]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow={!isGhost}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.65, 8]} />
            <meshStandardMaterial {...getBuildingMaterialProps(firewoodColor, isGhost, isValid)} />
          </mesh>
        ))}
      </group>

      {/* Wall Lantern on Front */}
      <group position={[-0.8, 1.4, 1.18]}>
        <mesh>
          <boxGeometry args={[0.1, 0.16, 0.1]} />
          <meshStandardMaterial {...getBuildingMaterialProps('#ffb703', isGhost, isValid)} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.14]} />
          <meshStandardMaterial {...getBuildingMaterialProps(ironColor, isGhost, isValid)} />
        </mesh>
      </group>
    </group>
  );
};
