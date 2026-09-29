import React from 'react';
import { getBuildingMaterialProps } from './BuildingMaterials';

interface BuildingModelProps {
  isGhost?: boolean;
  isValid?: boolean;
}

export const SiloBuilding: React.FC<BuildingModelProps> = ({
  isGhost = false,
  isValid = true,
}) => {
  const metalBody = '#90a4ae';
  const metalBands = '#546e7a';
  const roofCap = '#cfd8dc';
  const foundationColor = '#78909c';
  const ladderColor = '#37474f';
  const darkDetail = '#263238';

  return (
    <group>
      {/* Stone / Concrete Base */}
      <mesh position={[0, 0.2, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <cylinderGeometry args={[1.15, 1.25, 0.4, 14]} />
        <meshStandardMaterial {...getBuildingMaterialProps(foundationColor, isGhost, isValid)} />
      </mesh>

      {/* Main Cylindrical Silo Tower */}
      <mesh position={[0, 2.4, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <cylinderGeometry args={[1.05, 1.05, 4.0, 14]} />
        <meshStandardMaterial {...getBuildingMaterialProps(metalBody, isGhost, isValid)} />
      </mesh>

      {/* Corrugated Horizontal Reinforcement Rings */}
      {[1.2, 2.2, 3.2, 4.1].map((y, idx) => (
        <mesh key={`ring-${idx}`} position={[0, y, 0]} castShadow={!isGhost}>
          <cylinderGeometry args={[1.09, 1.09, 0.1, 14]} />
          <meshStandardMaterial {...getBuildingMaterialProps(metalBands, isGhost, isValid)} />
        </mesh>
      ))}

      {/* Conical / Domed Top Cap */}
      <mesh position={[0, 4.85, 0]} castShadow={!isGhost}>
        <cylinderGeometry args={[0.08, 1.15, 0.9, 14]} />
        <meshStandardMaterial {...getBuildingMaterialProps(roofCap, isGhost, isValid)} />
      </mesh>

      {/* Top Roof Finial / Cap vent */}
      <mesh position={[0, 5.35, 0]} castShadow={!isGhost}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 8]} />
        <meshStandardMaterial {...getBuildingMaterialProps(metalBands, isGhost, isValid)} />
      </mesh>

      {/* External Access Ladder along the side */}
      <group position={[0, 2.4, 1.12]}>
        {/* Left side rail */}
        <mesh position={[-0.2, 0, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.04, 4.2, 0.04]} />
          <meshStandardMaterial {...getBuildingMaterialProps(ladderColor, isGhost, isValid)} />
        </mesh>
        {/* Right side rail */}
        <mesh position={[0.2, 0, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.04, 4.2, 0.04]} />
          <meshStandardMaterial {...getBuildingMaterialProps(ladderColor, isGhost, isValid)} />
        </mesh>
        {/* Rungs */}
        {Array.from({ length: 11 }).map((_, i) => (
          <mesh key={`rung-${i}`} position={[0, -1.8 + i * 0.36, 0]}>
            <boxGeometry args={[0.4, 0.03, 0.03]} />
            <meshStandardMaterial {...getBuildingMaterialProps(ladderColor, isGhost, isValid)} />
          </mesh>
        ))}
      </group>

      {/* Grain Discharge Hopper Chute at Bottom */}
      <group position={[0.85, 0.65, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh castShadow={!isGhost}>
          <boxGeometry args={[0.4, 0.25, 0.35]} />
          <meshStandardMaterial {...getBuildingMaterialProps(darkDetail, isGhost, isValid)} />
        </mesh>
      </group>
    </group>
  );
};
