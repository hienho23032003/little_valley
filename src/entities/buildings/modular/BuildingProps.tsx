import React from 'react';
import { PALETTE } from '../../../utils/colors';
import { SignType } from '../../../data/buildingConfigs';

// 1. Hanging Wooden Shop Sign
export const BuildingSign: React.FC<{
  position: [number, number, number];
  rotation?: number;
  type: SignType;
}> = ({ position, rotation = 0, type }) => {
  if (type === 'none') return null;

  let bannerColor = '#d4a373';

  switch (type) {
    case 'town_hall':
      bannerColor = '#2b2d42';
      break;
    case 'general_store':
      bannerColor = '#588157';
      break;
    case 'blacksmith':
      bannerColor = '#495057';
      break;
    case 'bakery':
      bannerColor = '#d96b43';
      break;
    case 'herbalist':
      bannerColor = '#386641';
      break;
    case 'farm':
      bannerColor = '#bc6c25';
      break;
    case 'workshop':
      bannerColor = '#8c5e34';
      break;
    case 'cottage':
      bannerColor = '#4a827e';
      break;
  }

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Iron bracket arm extending out */}
      <mesh position={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.7]} />
        <meshStandardMaterial color="#212529" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Diagonal brace */}
      <mesh position={[0, -0.15, 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial color="#212529" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 2 Iron Hanging Chains */}
      {[-0.15, 0.15].map((z, idx) => (
        <mesh key={`chain-${idx}`} position={[0, -0.1, 0.45 + z]}>
          <cylinderGeometry args={[0.015, 0.015, 0.16, 4]} />
          <meshStandardMaterial color="#212529" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Wooden Signboard */}
      <mesh position={[0, -0.32, 0.45]} castShadow>
        <boxGeometry args={[0.08, 0.38, 0.52]} />
        <meshStandardMaterial color={bannerColor} roughness={0.8} flatShading />
      </mesh>
      {/* Sign Rim Frame */}
      <mesh position={[0, -0.32, 0.45]}>
        <boxGeometry args={[0.09, 0.4, 0.54]} />
        <meshStandardMaterial color="#3a2e2b" roughness={0.9} wireframe={false} />
      </mesh>
    </group>
  );
};

// 2. Oak Wooden Barrel with Metal Hoops
export const ModularBarrel: React.FC<{
  position: [number, number, number];
  rotation?: number;
  scale?: number;
}> = ({ position, rotation = 0, scale = 1.0 }) => (
  <group position={position} rotation={[0, rotation, 0]} scale={[scale, scale, scale]}>
    {/* Staves Body */}
    <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.3, 0.34, 0.84, 8]} />
      <meshStandardMaterial color={PALETTE.woodDark} roughness={0.85} flatShading />
    </mesh>
    {/* Metal Hoops Top and Bottom */}
    <mesh position={[0, 0.65, 0]}>
      <cylinderGeometry args={[0.32, 0.32, 0.05, 8]} />
      <meshStandardMaterial color="#495057" metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.33, 0.33, 0.05, 8]} />
      <meshStandardMaterial color="#495057" metalness={0.7} roughness={0.3} />
    </mesh>
    {/* Top Wooden Lid */}
    <mesh position={[0, 0.84, 0]}>
      <cylinderGeometry args={[0.29, 0.29, 0.02, 8]} />
      <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.9} />
    </mesh>
  </group>
);

// 3. Wooden Produce Crate
export const ModularCrate: React.FC<{
  position: [number, number, number];
  rotation?: number;
  scale?: number;
}> = ({ position, rotation = 0, scale = 1.0 }) => (
  <group position={position} rotation={[0, rotation, 0]} scale={[scale, scale, scale]}>
    <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.62, 0.56, 0.62]} />
      <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.85} flatShading />
    </mesh>
    {/* Corner Reinforcements */}
    {[-0.29, 0.29].map((x) =>
      [-0.29, 0.29].map((z) => (
        <mesh key={`crate-c-${x}-${z}`} position={[x, 0.28, z]}>
          <boxGeometry args={[0.06, 0.58, 0.06]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
        </mesh>
      ))
    )}
  </group>
);

// 4. Firewood Stack Cord
export const FirewoodCord: React.FC<{
  position: [number, number, number];
  rotation?: number;
}> = ({ position, rotation = 0 }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    {/* End Frame Posts */}
    {[-0.7, 0.7].map((x) => (
      <mesh key={`post-${x}`} position={[x, 0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.45]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>
    ))}
    {/* Stacked Logs */}
    {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
      <React.Fragment key={`log-col-${i}`}>
        <mesh position={[x, 0.14, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.4, 6]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[x, 0.38, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 6]} />
          <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[x, 0.61, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.4, 6]} />
          <meshStandardMaterial color={PALETTE.woodLight} roughness={0.9} flatShading />
        </mesh>
      </React.Fragment>
    ))}
  </group>
);

// 5. Flower Pot Planter
export const FlowerPotPlanter: React.FC<{
  position: [number, number, number];
  color?: string;
}> = ({ position, color = '#e76f51' }) => (
  <group position={position}>
    {/* Terracotta Clay Pot */}
    <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.22, 0.16, 0.44, 7]} />
      <meshStandardMaterial color={color} roughness={0.8} flatShading />
    </mesh>
    {/* Pot Rim */}
    <mesh position={[0, 0.42, 0]}>
      <cylinderGeometry args={[0.24, 0.24, 0.08, 7]} />
      <meshStandardMaterial color={color} roughness={0.8} flatShading />
    </mesh>
    {/* Potting Soil */}
    <mesh position={[0, 0.42, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.04, 7]} />
      <meshStandardMaterial color="#3d2b1f" roughness={0.95} />
    </mesh>
    {/* Blooming Flower Cluster */}
    <mesh position={[-0.06, 0.52, 0.04]}>
      <sphereGeometry args={[0.09, 4, 4]} />
      <meshStandardMaterial color={PALETTE.flowerPink} flatShading />
    </mesh>
    <mesh position={[0.07, 0.55, -0.05]}>
      <sphereGeometry args={[0.1, 4, 4]} />
      <meshStandardMaterial color={PALETTE.flowerYellow} flatShading />
    </mesh>
    <mesh position={[0, 0.58, 0.02]}>
      <sphereGeometry args={[0.09, 4, 4]} />
      <meshStandardMaterial color={PALETTE.flowerLavender} flatShading />
    </mesh>
  </group>
);

// 6. Town Hall Belfry Spire (Clock & Bell Tower)
export const BelfryTower: React.FC<{
  roofHeight: number;
  roofColor: string;
}> = ({ roofHeight, roofColor }) => (
  <group position={[0, roofHeight + 0.1, 0]}>
    {/* Tower Base Plinth */}
    <mesh position={[0, 0.4, 0]} castShadow>
      <boxGeometry args={[1.5, 0.8, 1.5]} />
      <meshStandardMaterial color="#fdfbf7" roughness={0.85} flatShading />
    </mesh>
    {/* Timber Corner Pillars */}
    {[-0.65, 0.65].map((x) =>
      [-0.65, 0.65].map((z) => (
        <mesh key={`belfry-post-${x}-${z}`} position={[x, 0.4, z]} castShadow>
          <boxGeometry args={[0.14, 0.85, 0.14]} />
          <meshStandardMaterial color="#2b2d42" roughness={0.9} />
        </mesh>
      ))
    )}
    {/* Clock Face on Front */}
    <group position={[0, 0.45, 0.76]}>
      <mesh>
        <circleGeometry args={[0.3, 10]} />
        <meshStandardMaterial color="#f7edd0" roughness={0.5} />
      </mesh>
      {/* Clock Hands */}
      <mesh position={[0, 0.07, 0.01]}>
        <boxGeometry args={[0.03, 0.16, 0.01]} />
        <meshStandardMaterial color="#212529" />
      </mesh>
      <mesh position={[0.06, 0, 0.01]} rotation={[0, 0, -Math.PI / 3]}>
        <boxGeometry args={[0.03, 0.14, 0.01]} />
        <meshStandardMaterial color="#212529" />
      </mesh>
    </group>
    {/* Open Arched Belfry Chamber */}
    <group position={[0, 1.15, 0]}>
      {/* 4 Open Corner Posts */}
      {[-0.6, 0.6].map((x) =>
        [-0.6, 0.6].map((z) => (
          <mesh key={`belfry-top-post-${x}-${z}`} position={[x, 0.35, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.7, 5]} />
            <meshStandardMaterial color="#2b2d42" roughness={0.9} />
          </mesh>
        ))
      )}
      {/* Golden Brass Bell */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <coneGeometry args={[0.26, 0.36, 8]} />
        <meshStandardMaterial color="#ffb703" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
    {/* Pyramid Spire Roof */}
    <mesh position={[0, 2.05, 0]} castShadow>
      <coneGeometry args={[1.2, 1.4, 4]} />
      <meshStandardMaterial color={roofColor} roughness={0.7} flatShading />
    </mesh>
    {/* Spire Weather Vane Finial */}
    <mesh position={[0, 2.85, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
      <meshStandardMaterial color="#ffb703" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0, 3.05, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.18, 0.18, 0.02]} />
      <meshStandardMaterial color="#ffb703" metalness={0.8} roughness={0.2} />
    </mesh>
  </group>
);

// 7. Weathervane (Barn & Workshop roof detail)
export const WeathervaneFinial: React.FC<{
  position: [number, number, number];
}> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
      <meshStandardMaterial color="#2b2d42" metalness={0.7} roughness={0.3} />
    </mesh>
    {/* Compass Cross */}
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[0.4, 0.02, 0.02]} />
      <meshStandardMaterial color="#2b2d42" />
    </mesh>
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[0.02, 0.02, 0.4]} />
      <meshStandardMaterial color="#2b2d42" />
    </mesh>
    {/* Rooster / Arrow */}
    <mesh position={[0, 0.48, 0]} rotation={[0, 0.4, 0]}>
      <boxGeometry args={[0.3, 0.16, 0.02]} />
      <meshStandardMaterial color="#d90429" metalness={0.4} roughness={0.4} />
    </mesh>
  </group>
);
