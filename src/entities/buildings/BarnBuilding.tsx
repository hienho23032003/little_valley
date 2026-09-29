import React from 'react';
import { getBuildingMaterialProps } from './BuildingMaterials';

interface BuildingModelProps {
  isGhost?: boolean;
  isValid?: boolean;
}

export const BarnBuilding: React.FC<BuildingModelProps> = ({
  isGhost = false,
  isValid = true,
}) => {
  const barnRed = '#a31621';
  const stoneBase = '#495057';
  const roofSlate = '#2b2d42';
  const whiteTrim = '#f8f9fa';
  const timberDark = '#3d2616';
  const hayColor = '#e9c46a';
  const metalColor = '#495057';

  return (
    <group>
      {/* 1. Heavy Stone Foundation Base */}
      <mesh position={[0, 0.18, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[4.2, 0.36, 4.0]} />
        <meshStandardMaterial {...getBuildingMaterialProps(stoneBase, isGhost, isValid)} />
      </mesh>
      {/* Front Stone Entrance Ramp / Steps */}
      <mesh position={[0, 0.1, 2.1]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[2.2, 0.2, 0.6]} />
        <meshStandardMaterial {...getBuildingMaterialProps('#6c757d', isGhost, isValid)} />
      </mesh>

      {/* 2. Main Crimson Barn Body */}
      <mesh position={[0, 1.55, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[3.8, 2.4, 3.6]} />
        <meshStandardMaterial {...getBuildingMaterialProps(barnRed, isGhost, isValid)} />
      </mesh>

      {/* 3. Chunky White Corner Timber Posts */}
      {[
        [-1.9, -1.8],
        [1.9, -1.8],
        [-1.9, 1.8],
        [1.9, 1.8],
      ].map(([x, z], idx) => (
        <mesh key={`post-${idx}`} position={[x, 1.55, z]} castShadow={!isGhost}>
          <boxGeometry args={[0.2, 2.44, 0.2]} />
          <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
        </mesh>
      ))}

      {/* Horizontal White Timber Waistband */}
      <mesh position={[0, 1.55, 0]} castShadow={!isGhost}>
        <boxGeometry args={[3.88, 0.14, 3.68]} />
        <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
      </mesh>

      {/* Side Wall Diagonal Braces (White Barn Crosses) */}
      {[-1.92, 1.92].map((x, idx) => (
        <group key={`side-cross-${idx}`} position={[x, 1.55, 0]}>
          <mesh rotation={[0, 0, 0.45]} castShadow={!isGhost}>
            <boxGeometry args={[0.08, 2.2, 0.12]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          <mesh rotation={[0, 0, -0.45]} castShadow={!isGhost}>
            <boxGeometry args={[0.08, 2.2, 0.12]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
        </group>
      ))}

      {/* 4. Classic Gambrel (Dutch Barn) Roof */}
      <group position={[0, 2.75, 0]}>
        {/* Lower Steep Pitch Slabs */}
        <mesh position={[-1.4, 0.55, 0]} rotation={[0, 0, Math.PI / 3.4]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[1.5, 0.18, 4.0]} />
          <meshStandardMaterial {...getBuildingMaterialProps(roofSlate, isGhost, isValid)} />
        </mesh>
        <mesh position={[1.4, 0.55, 0]} rotation={[0, 0, -Math.PI / 3.4]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[1.5, 0.18, 4.0]} />
          <meshStandardMaterial {...getBuildingMaterialProps(roofSlate, isGhost, isValid)} />
        </mesh>

        {/* Upper Gentle Pitch Slabs */}
        <mesh position={[-0.55, 1.35, 0]} rotation={[0, 0, Math.PI / 7.5]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[1.35, 0.18, 4.0]} />
          <meshStandardMaterial {...getBuildingMaterialProps(roofSlate, isGhost, isValid)} />
        </mesh>
        <mesh position={[0.55, 1.35, 0]} rotation={[0, 0, -Math.PI / 7.5]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[1.35, 0.18, 4.0]} />
          <meshStandardMaterial {...getBuildingMaterialProps(roofSlate, isGhost, isValid)} />
        </mesh>

        {/* Ridge Cap Beam with Rooster Weathervane */}
        <mesh position={[0, 1.6, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.28, 0.22, 4.1]} />
          <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
        </mesh>

        {/* Weathervane Finial */}
        <group position={[0, 1.75, 1.2]}>
          <mesh castShadow={!isGhost}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
            <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[0, 0.5, 0]} castShadow={!isGhost}>
            <boxGeometry args={[0.32, 0.16, 0.03]} />
            <meshStandardMaterial {...getBuildingMaterialProps('#d90429', isGhost, isValid)} />
          </mesh>
        </group>

        {/* Gable End Walls Front & Back */}
        {[-1.81, 1.81].map((z, idx) => (
          <group key={`gable-${idx}`} position={[0, 0.7, z]}>
            <mesh>
              <boxGeometry args={[3.2, 1.4, 0.06]} />
              <meshStandardMaterial {...getBuildingMaterialProps(barnRed, isGhost, isValid)} />
            </mesh>
            {/* White Gable Trim Outline */}
            <mesh position={[0, 0.65, 0]}>
              <boxGeometry args={[2.4, 0.1, 0.08]} />
              <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
            </mesh>
          </group>
        ))}

        {/* Upper Hayloft Loading Door & Protruding Hoist Crane */}
        <group position={[0, 0.65, 1.86]}>
          <mesh castShadow={!isGhost}>
            <boxGeometry args={[0.85, 0.95, 0.06]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.7, 0.8, 0.06]} />
            <meshStandardMaterial {...getBuildingMaterialProps(barnRed, isGhost, isValid)} />
          </mesh>
          {/* Protruding Timber Hoist Crane Beam */}
          <mesh position={[0, 0.7, 0.45]} castShadow={!isGhost}>
            <boxGeometry args={[0.14, 0.14, 0.9]} />
            <meshStandardMaterial {...getBuildingMaterialProps(timberDark, isGhost, isValid)} />
          </mesh>
          {/* Hanging Pulley Wheel & Lantern */}
          <mesh position={[0, 0.45, 0.75]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 6]} />
            <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} />
          </mesh>
          <mesh position={[0, 0.28, 0.75]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 4]} />
            <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} />
          </mesh>
          <mesh position={[0, 0.12, 0.75]}>
            <boxGeometry args={[0.1, 0.12, 0.1]} />
            <meshStandardMaterial {...getBuildingMaterialProps('#ffb703', isGhost, isValid)} emissive="#ffb703" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* 5. Front Double Sliding Barn Doors with Prominent White X Braces */}
      <group position={[0, 1.05, 1.82]}>
        {/* Recessed Dark Interior Doorway */}
        <mesh>
          <boxGeometry args={[1.9, 1.7, 0.05]} />
          <meshStandardMaterial {...getBuildingMaterialProps('#212529', isGhost, isValid)} />
        </mesh>

        {/* Left Barn Door */}
        <group position={[-0.48, 0, 0.04]}>
          <mesh castShadow={!isGhost}>
            <boxGeometry args={[0.88, 1.62, 0.05]} />
            <meshStandardMaterial {...getBuildingMaterialProps(barnRed, isGhost, isValid)} />
          </mesh>
          {/* White Outer Frame */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.84, 1.58, 0.02]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          {/* White X Crosses */}
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, 0.58]}>
            <boxGeometry args={[0.08, 1.65, 0.02]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, -0.58]}>
            <boxGeometry args={[0.08, 1.65, 0.02]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          {/* Cast Iron Door Handle */}
          <mesh position={[0.34, 0, 0.05]}>
            <boxGeometry args={[0.04, 0.22, 0.03]} />
            <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} />
          </mesh>
        </group>

        {/* Right Barn Door */}
        <group position={[0.48, 0, 0.04]}>
          <mesh castShadow={!isGhost}>
            <boxGeometry args={[0.88, 1.62, 0.05]} />
            <meshStandardMaterial {...getBuildingMaterialProps(barnRed, isGhost, isValid)} />
          </mesh>
          {/* White Outer Frame */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.84, 1.58, 0.02]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          {/* White X Crosses */}
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, 0.58]}>
            <boxGeometry args={[0.08, 1.65, 0.02]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, -0.58]}>
            <boxGeometry args={[0.08, 1.65, 0.02]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
          {/* Cast Iron Door Handle */}
          <mesh position={[-0.34, 0, 0.05]}>
            <boxGeometry args={[0.04, 0.22, 0.03]} />
            <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} />
          </mesh>
        </group>

        {/* Top Heavy Iron Sliding Door Track */}
        <mesh position={[0, 0.9, 0.08]} castShadow={!isGhost}>
          <boxGeometry args={[2.2, 0.08, 0.06]} />
          <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} />
        </mesh>
      </group>

      {/* 6. Attached Side Lean-To Tool & Hay Annex (Left Side: X = -2.5) */}
      <group position={[-2.4, 0, 0]}>
        {/* Low Side Wall */}
        <mesh position={[-0.45, 0.9, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.16, 1.8, 2.8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(barnRed, isGhost, isValid)} />
        </mesh>
        {/* Side Lean-to Sloped Roof */}
        <mesh position={[-0.25, 1.85, 0]} rotation={[0, 0, -0.35]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[1.3, 0.12, 3.2]} />
          <meshStandardMaterial {...getBuildingMaterialProps(roofSlate, isGhost, isValid)} />
        </mesh>
        {/* Support Timber Posts */}
        {[-1.2, 1.2].map((z, idx) => (
          <mesh key={`shed-post-${idx}`} position={[-0.45, 0.9, z]} castShadow={!isGhost}>
            <boxGeometry args={[0.16, 1.8, 0.16]} />
            <meshStandardMaterial {...getBuildingMaterialProps(whiteTrim, isGhost, isValid)} />
          </mesh>
        ))}
        {/* Firewood / Tool props inside side lean-to */}
        <mesh position={[-0.1, 0.35, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow={!isGhost}>
          <cylinderGeometry args={[0.16, 0.16, 0.6, 6]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberDark, isGhost, isValid)} />
        </mesh>
        <mesh position={[-0.1, 0.35, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow={!isGhost}>
          <cylinderGeometry args={[0.14, 0.14, 0.6, 6]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberDark, isGhost, isValid)} />
        </mesh>
      </group>

      {/* 7. Farm Props on Right Side (Hay Bales & Feeding Trough) */}
      {/* 3 Stacked Chunky Hay Bales */}
      <group position={[2.5, 0, 0.4]}>
        <mesh position={[0, 0.3, 0]} rotation={[0, 0.15, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.75, 0.6, 0.95]} />
          <meshStandardMaterial {...getBuildingMaterialProps(hayColor, isGhost, isValid)} />
        </mesh>
        <mesh position={[0.05, 0.3, -0.9]} rotation={[0, -0.2, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.7, 0.6, 0.9]} />
          <meshStandardMaterial {...getBuildingMaterialProps(hayColor, isGhost, isValid)} />
        </mesh>
        <mesh position={[0, 0.85, -0.4]} rotation={[0, 0.08, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.7, 0.55, 0.9]} />
          <meshStandardMaterial {...getBuildingMaterialProps(hayColor, isGhost, isValid)} />
        </mesh>
      </group>

      {/* Large Carved Wooden Hay Trough */}
      <group position={[2.4, 0, 1.7]}>
        <mesh position={[0, 0.25, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
          <boxGeometry args={[0.55, 0.5, 1.2]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberDark, isGhost, isValid)} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.42, 0.18, 1.05]} />
          <meshStandardMaterial {...getBuildingMaterialProps(hayColor, isGhost, isValid)} />
        </mesh>
      </group>

      {/* Vintage Milk Churn / Metal Pail */}
      <group position={[1.4, 0, 2.1]}>
        <mesh position={[0, 0.28, 0]} castShadow={!isGhost}>
          <cylinderGeometry args={[0.15, 0.2, 0.56, 8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(metalColor, isGhost, isValid)} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
