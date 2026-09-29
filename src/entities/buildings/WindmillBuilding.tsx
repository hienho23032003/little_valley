import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBuildingMaterialProps } from './BuildingMaterials';

interface BuildingModelProps {
  isGhost?: boolean;
  isValid?: boolean;
}

export const WindmillBuilding: React.FC<BuildingModelProps> = ({
  isGhost = false,
  isValid = true,
}) => {
  const stoneTower = '#d5bdaf';
  const foundationColor = '#6c757d';
  const roofDark = '#4a4e69';
  const timberColor = '#582f0e';
  const sailCloth = '#f8f9fa';
  const sailLattice = '#7f5539';

  const sailsRef = useRef<THREE.Group>(null);

  // Spin the 4 windmill blades slowly
  useFrame((_, delta) => {
    if (sailsRef.current && !isGhost) {
      sailsRef.current.rotation.z -= delta * 0.8;
    }
  });

  return (
    <group>
      {/* Stone Foundation Base */}
      <mesh position={[0, 0.2, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <cylinderGeometry args={[1.45, 1.6, 0.4, 8]} />
        <meshStandardMaterial {...getBuildingMaterialProps(foundationColor, isGhost, isValid)} />
      </mesh>

      {/* Main Tapered Stone Windmill Tower */}
      <mesh position={[0, 2.3, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <cylinderGeometry args={[1.05, 1.4, 3.8, 8]} />
        <meshStandardMaterial {...getBuildingMaterialProps(stoneTower, isGhost, isValid)} />
      </mesh>

      {/* Mid-level Wooden Balcony / Walkway */}
      <group position={[0, 2.4, 0]}>
        <mesh castShadow={!isGhost}>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberColor, isGhost, isValid)} />
        </mesh>
        {/* Balcony Railing Posts */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const rx = Math.cos(angle) * 1.45;
          const rz = Math.sin(angle) * 1.45;
          return (
            <mesh key={`rail-${i}`} position={[rx, 0.35, rz]} castShadow={!isGhost}>
              <boxGeometry args={[0.06, 0.6, 0.06]} />
              <meshStandardMaterial {...getBuildingMaterialProps(timberColor, isGhost, isValid)} />
            </mesh>
          );
        })}
      </group>

      {/* Conical Roof Cap */}
      <mesh position={[0, 4.8, 0]} castShadow={!isGhost}>
        <cylinderGeometry args={[0.1, 1.25, 1.3, 8]} />
        <meshStandardMaterial {...getBuildingMaterialProps(roofDark, isGhost, isValid)} />
      </mesh>

      {/* Front Sail Axle / Hub Housing */}
      <mesh position={[0, 4.3, 1.15]} rotation={[Math.PI / 2, 0, 0]} castShadow={!isGhost}>
        <cylinderGeometry args={[0.2, 0.25, 0.45, 8]} />
        <meshStandardMaterial {...getBuildingMaterialProps(timberColor, isGhost, isValid)} />
      </mesh>

      {/* 4 Rotating Windmill Sails */}
      <group ref={sailsRef} position={[0, 4.3, 1.4]}>
        {/* Center hub cap */}
        <mesh>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberColor, isGhost, isValid)} />
        </mesh>

        {/* 4 Sails at 90-degree angles */}
        {[0, 1, 2, 3].map((idx) => {
          const rotAngle = (idx * Math.PI) / 2;
          return (
            <group key={`sail-${idx}`} rotation={[0, 0, rotAngle]}>
              {/* Wooden Spar Arm */}
              <mesh position={[0, 1.4, 0]} castShadow={!isGhost}>
                <boxGeometry args={[0.08, 2.7, 0.08]} />
                <meshStandardMaterial {...getBuildingMaterialProps(sailLattice, isGhost, isValid)} />
              </mesh>
              {/* White Cloth Sail Canvas */}
              <mesh position={[0.28, 1.5, 0.02]} castShadow={!isGhost}>
                <boxGeometry args={[0.5, 2.1, 0.02]} />
                <meshStandardMaterial {...getBuildingMaterialProps(sailCloth, isGhost, isValid)} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Arched Entrance Door at Ground */}
      <mesh position={[0, 0.85, 1.41]}>
        <boxGeometry args={[0.65, 1.2, 0.04]} />
        <meshStandardMaterial {...getBuildingMaterialProps(timberColor, isGhost, isValid)} />
      </mesh>
    </group>
  );
};
