import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBuildingMaterialProps } from './BuildingMaterials';

interface BuildingModelProps {
  isGhost?: boolean;
  isValid?: boolean;
}

export const BakeryBuilding: React.FC<BuildingModelProps> = ({
  isGhost = false,
  isValid = true,
}) => {
  const wallColor = '#fefae0';
  const stoneBase = '#6c757d';
  const roofTerracotta = '#bc4749';
  const timberTrim = '#603813';
  const awningStripe1 = '#bc4749';
  const awningStripe2 = '#ffffff';
  const breadColor = '#dda15e';
  const flourBag = '#e9ecef';

  const smokeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (smokeRef.current && !isGhost) {
      const t = state.clock.getElapsedTime();
      smokeRef.current.children.forEach((puff, idx) => {
        puff.position.y = 3.6 + ((t * 0.9 + idx * 0.5) % 1.4);
        const s = 0.16 + (((t * 0.9 + idx * 0.5) % 1.4) / 1.4) * 0.22;
        puff.scale.set(s, s, s);
        puff.position.x = -1.1 + Math.sin(t * 1.5 + idx) * 0.08;
      });
    }
  });

  return (
    <group>
      {/* Stone Foundation */}
      <mesh position={[0, 0.15, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[3.2, 0.3, 3.2]} />
        <meshStandardMaterial {...getBuildingMaterialProps(stoneBase, isGhost, isValid)} />
      </mesh>

      {/* Main Plaster Walls */}
      <mesh position={[0, 1.35, 0]} castShadow={!isGhost} receiveShadow={!isGhost}>
        <boxGeometry args={[3.0, 2.1, 3.0]} />
        <meshStandardMaterial {...getBuildingMaterialProps(wallColor, isGhost, isValid)} />
      </mesh>

      {/* Timber Corner Columns */}
      {[
        [-1.5, -1.5],
        [1.5, -1.5],
        [-1.5, 1.5],
        [1.5, 1.5],
      ].map(([x, z], idx) => (
        <mesh key={`post-${idx}`} position={[x, 1.35, z]} castShadow={!isGhost}>
          <boxGeometry args={[0.14, 2.15, 0.14]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberTrim, isGhost, isValid)} />
        </mesh>
      ))}

      {/* Terracotta Pitched Roof with Ridge along X Axis (Horizontal front eaves, no front triangular projection) */}
      <group position={[0, 2.45, 0]}>
        {/* Front Roof Slab (Sloping down towards +Z front) */}
        <mesh position={[0, 0.45, 0.82]} rotation={[-Math.PI / 5, 0, 0]} castShadow={!isGhost}>
          <boxGeometry args={[3.4, 0.14, 1.95]} />
          <meshStandardMaterial {...getBuildingMaterialProps(roofTerracotta, isGhost, isValid)} />
        </mesh>
        {/* Back Roof Slab (Sloping down towards -Z back) */}
        <mesh position={[0, 0.45, -0.82]} rotation={[Math.PI / 5, 0, 0]} castShadow={!isGhost}>
          <boxGeometry args={[3.4, 0.14, 1.95]} />
          <meshStandardMaterial {...getBuildingMaterialProps(roofTerracotta, isGhost, isValid)} />
        </mesh>
        {/* Top Ridge Cap Board */}
        <mesh position={[0, 0.98, 0]} castShadow={!isGhost}>
          <boxGeometry args={[3.44, 0.1, 0.14]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberTrim, isGhost, isValid)} />
        </mesh>
        {/* Front Eaves Fascia Board */}
        <mesh position={[0, -0.05, 1.62]} castShadow={!isGhost}>
          <boxGeometry args={[3.42, 0.08, 0.08]} />
          <meshStandardMaterial {...getBuildingMaterialProps(timberTrim, isGhost, isValid)} />
        </mesh>
        {/* Side Gable Wall Infills (Facing West & East) */}
        {[-1.51, 1.51].map((x, idx) => (
          <mesh key={`gable-${idx}`} position={[x, 0.38, 0]}>
            <boxGeometry args={[0.04, 0.75, 2.5]} />
            <meshStandardMaterial {...getBuildingMaterialProps(wallColor, isGhost, isValid)} />
          </mesh>
        ))}
      </group>

      {/* Brick Masonry Chimney on the side */}
      <mesh position={[-1.1, 2.4, -0.6]} castShadow={!isGhost}>
        <boxGeometry args={[0.55, 2.8, 0.55]} />
        <meshStandardMaterial {...getBuildingMaterialProps('#9c4a3b', isGhost, isValid)} />
      </mesh>

      {/* Chimney Cap */}
      <mesh position={[-1.1, 3.85, -0.6]} castShadow={!isGhost}>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshStandardMaterial {...getBuildingMaterialProps(stoneBase, isGhost, isValid)} />
      </mesh>

      {/* Animated Smoke Puffs */}
      <group ref={smokeRef}>
        {[0, 1, 2].map((idx) => (
          <mesh key={`smoke-${idx}`} position={[-1.1, 4.0, -0.6]}>
            <sphereGeometry args={[0.2, 6, 6]} />
            <meshStandardMaterial
              {...getBuildingMaterialProps('#f8f9fa', isGhost, isValid)}
              transparent
              opacity={0.65}
            />
          </mesh>
        ))}
      </group>

      {/* Front Entrance Door */}
      <mesh position={[-0.7, 0.95, 1.51]}>
        <boxGeometry args={[0.75, 1.5, 0.04]} />
        <meshStandardMaterial {...getBuildingMaterialProps(timberTrim, isGhost, isValid)} />
      </mesh>

      {/* Bakery Display Window */}
      <mesh position={[0.65, 1.1, 1.51]}>
        <boxGeometry args={[1.1, 0.9, 0.04]} />
        <meshStandardMaterial {...getBuildingMaterialProps('#a8dadc', isGhost, isValid)} />
      </mesh>

      {/* Striped Bakery Awning over Window */}
      <group position={[0.65, 1.7, 1.75]} rotation={[Math.PI / 6, 0, 0]}>
        {[-0.45, -0.15, 0.15, 0.45].map((x, idx) => (
          <mesh key={`stripe-${idx}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.28, 0.05, 0.65]} />
            <meshStandardMaterial
              {...getBuildingMaterialProps(
                idx % 2 === 0 ? awningStripe1 : awningStripe2,
                isGhost,
                isValid
              )}
            />
          </mesh>
        ))}
      </group>

      {/* Golden Bread Sign above door */}
      <group position={[-0.7, 1.9, 1.65]}>
        {/* Signpost arm */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.04, 0.04, 0.25]} />
          <meshStandardMaterial {...getBuildingMaterialProps(stoneBase, isGhost, isValid)} />
        </mesh>
        {/* Golden Bread Loaf */}
        <mesh scale={[1.4, 0.8, 0.8]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial {...getBuildingMaterialProps(breadColor, isGhost, isValid)} />
        </mesh>
      </group>

      {/* Stacked Flour Sacks Outside */}
      <group position={[1.65, 0.25, 0.6]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.3, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.55, 0.3, 0.7]} />
          <meshStandardMaterial {...getBuildingMaterialProps(flourBag, isGhost, isValid)} />
        </mesh>
        <mesh position={[0, 0.28, 0]} rotation={[0, -0.2, 0]} castShadow={!isGhost}>
          <boxGeometry args={[0.5, 0.26, 0.65]} />
          <meshStandardMaterial {...getBuildingMaterialProps(flourBag, isGhost, isValid)} />
        </mesh>
      </group>
    </group>
  );
};
