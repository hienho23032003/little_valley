import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MedievalChimney, MedievalVine, MedievalCratesStack, MedievalCrate } from '../../environment/MedievalProps';

// Shared GLTF cloning helper that preserves geometry/materials while enabling shadows
export interface MedievalPartProps {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const MedievalPart = React.memo<MedievalPartProps>(({ path, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return <primitive object={clone} position={position} rotation={rotation} scale={scale} />;
});

// ============================================================================
// 1. MEDIEVAL 4x4 COTTAGE (Standard Village Cottage, Homestead, Boathouse)
// ============================================================================
export interface MedievalCottageProps {
  position?: [number, number, number];
  rotation?: number;
  scale?: [number, number, number];
  wallType?: 'plaster' | 'woodgrid' | 'brick';
  doorType?: 'flat' | 'round';
  hasChimney?: boolean;
  chimneyPosition?: [number, number, number];
  hasPorch?: boolean;
  hasVines?: boolean;
}

export const MedievalCottage4x4 = React.memo<MedievalCottageProps>(({
  position = [0, 0, 0],
  rotation = 0,
  scale = [1, 1, 1],
  wallType = 'woodgrid',
  doorType = 'flat',
  hasChimney = true,
  chimneyPosition = [1.4, 0, -1.2],
  hasPorch = true,
  hasVines = true,
}) => {
  const straightWall = wallType === 'brick'
    ? '/models/medieval/Wall_UnevenBrick_Straight.gltf'
    : wallType === 'woodgrid'
    ? '/models/medieval/Wall_Plaster_WoodGrid.gltf'
    : '/models/medieval/Wall_Plaster_Straight.gltf';

  const windowWall = wallType === 'brick'
    ? '/models/medieval/Wall_UnevenBrick_Window_Wide_Flat.gltf'
    : '/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf';

  const doorWall = doorType === 'round'
    ? '/models/medieval/Wall_Plaster_Door_Round.gltf'
    : '/models/medieval/Wall_Plaster_Door_Flat.gltf';

  const doorModel = doorType === 'round'
    ? '/models/medieval/Door_1_Round.gltf'
    : '/models/medieval/Door_1_Flat.gltf';

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Stone Foundation Base */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.3, 4.4]} />
        <meshStandardMaterial color="#6c757d" roughness={0.92} flatShading />
      </mesh>

      {/* Front Entrance Stone Step */}
      <mesh position={[1.0, 0.08, 2.3]} receiveShadow>
        <boxGeometry args={[1.4, 0.16, 0.5]} />
        <meshStandardMaterial color="#5a6268" roughness={0.95} flatShading />
      </mesh>

      {/* --- FRONT WALL (Z = 2.0) --- */}
      {/* Window Wall Left */}
      <MedievalPart path={windowWall} position={[-1.0, 0.3, 2.0]} />
      <MedievalPart path="/models/medieval/WindowShutters_Wide_Flat_Open.gltf" position={[-1.0, 0.3, 2.02]} />

      {/* Door Wall Right */}
      <MedievalPart path={doorWall} position={[1.0, 0.3, 2.0]} />
      <MedievalPart path={doorModel} position={[0.55, 0.3, 2.0]} />

      {/* --- BACK WALL (Z = -2.0, Rotation PI) --- */}
      <MedievalPart path={straightWall} position={[-1.0, 0.3, -2.0]} rotation={[0, Math.PI, 0]} />
      <MedievalPart path={windowWall} position={[1.0, 0.3, -2.0]} rotation={[0, Math.PI, 0]} />

      {/* --- LEFT WALL (X = -2.0, Rotation -PI/2) --- */}
      <MedievalPart path={straightWall} position={[-2.0, 0.3, 1.0]} rotation={[0, -Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Thin_Round.gltf" position={[-2.0, 0.3, -1.0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* --- RIGHT WALL (X = 2.0, Rotation PI/2) --- */}
      <MedievalPart path={straightWall} position={[2.0, 0.3, -1.0]} rotation={[0, Math.PI / 2, 0]} />
      <MedievalPart path={straightWall} position={[2.0, 0.3, 1.0]} rotation={[0, Math.PI / 2, 0]} />

      {/* --- ROOF (4x4 Round Terracotta Tiles sitting at Y = 3.3m) --- */}
      <MedievalPart path="/models/medieval/Roof_RoundTiles_4x4.gltf" position={[0, 3.3, 0]} />

      {/* --- CHIMNEY WITH SMOKE --- */}
      {hasChimney && (
        <MedievalChimney position={chimneyPosition} scale={0.9} hasSmoke={true} />
      )}

      {/* --- OPTIONAL PORCH AWNING & SUPPORTS --- */}
      {hasPorch && (
        <group position={[1.0, 0.3, 2.7]}>
          {/* Porch Wooden Deck */}
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[1.8, 0.1, 1.2]} />
            <meshStandardMaterial color="#8d5b4c" roughness={0.85} flatShading />
          </mesh>
          {/* 2 Support Posts */}
          <MedievalPart path="/models/medieval/Prop_Support.gltf" position={[-0.8, 0, 0.5]} />
          <MedievalPart path="/models/medieval/Prop_Support.gltf" position={[0.8, 0, 0.5]} />
        </group>
      )}

      {/* --- CLIMBING VINES --- */}
      {hasVines && (
        <>
          <MedievalVine position={[-2.02, 2.4, 0.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.95} variant={1} />
          <MedievalVine position={[2.02, 2.3, -0.4]} rotation={[0, Math.PI / 2, 0]} scale={0.9} variant={4} />
        </>
      )}
    </group>
  );
});

// ============================================================================
// 2. MEDIEVAL 6x4 SHOP / GENERAL STORE (Double wide with display windows & veranda)
// ============================================================================
export interface MedievalShopProps {
  position?: [number, number, number];
  rotation?: number;
  scale?: [number, number, number];
  hasChimney?: boolean;
}

export const MedievalShop6x4 = React.memo<MedievalShopProps>(({
  position = [0, 0, 0],
  rotation = 0,
  scale = [1, 1, 1],
  hasChimney = true,
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Stone Foundation */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.3, 4.4]} />
        <meshStandardMaterial color="#6c757d" roughness={0.92} flatShading />
      </mesh>

      {/* --- FRONT WALL (Z = 2.0, 3 modules: X = -2, 0, +2) --- */}
      {/* Left: Wide Display Window */}
      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf" position={[-2.0, 0.3, 2.0]} />
      <MedievalPart path="/models/medieval/WindowShutters_Wide_Flat_Open.gltf" position={[-2.0, 0.3, 2.02]} />

      {/* Center: Shop Entrance Door */}
      <MedievalPart path="/models/medieval/Wall_Plaster_Door_Round.gltf" position={[0, 0.3, 2.0]} />
      <MedievalPart path="/models/medieval/Door_1_Round.gltf" position={[-0.45, 0.3, 2.0]} />

      {/* Right: Second Window */}
      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf" position={[2.0, 0.3, 2.0]} />
      <MedievalPart path="/models/medieval/WindowShutters_Wide_Flat_Open.gltf" position={[2.0, 0.3, 2.02]} />

      {/* --- BACK WALL (Z = -2.0, Rotation PI) --- */}
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[-2.0, 0.3, -2.0]} rotation={[0, Math.PI, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Straight.gltf" position={[0, 0.3, -2.0]} rotation={[0, Math.PI, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf" position={[2.0, 0.3, -2.0]} rotation={[0, Math.PI, 0]} />

      {/* --- LEFT & RIGHT WALLS (Depth = 4, 2 modules each) --- */}
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[-3.0, 0.3, 1.0]} rotation={[0, -Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Straight.gltf" position={[-3.0, 0.3, -1.0]} rotation={[0, -Math.PI / 2, 0]} />

      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[3.0, 0.3, 1.0]} rotation={[0, Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Straight.gltf" position={[3.0, 0.3, -1.0]} rotation={[0, Math.PI / 2, 0]} />

      {/* --- ROOF (4x6 Round Tile Roof rotated 90 deg to cover 6x4) --- */}
      <MedievalPart
        path="/models/medieval/Roof_RoundTiles_4x6.gltf"
        position={[0, 3.3, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* --- FRONT PORCH VERANDA WITH WOODEN BALCONY --- */}
      <group position={[0, 0.3, 2.8]}>
        {/* Wooden Porch Floor */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[5.6, 0.1, 1.4]} />
          <meshStandardMaterial color="#8d5b4c" roughness={0.88} flatShading />
        </mesh>
        {/* Railings & Posts */}
        <MedievalPart path="/models/medieval/Balcony_Cross_Straight.gltf" position={[-1.8, 0.1, 0.6]} scale={[0.9, 0.9, 0.9]} />
        <MedievalPart path="/models/medieval/Balcony_Cross_Straight.gltf" position={[1.8, 0.1, 0.6]} scale={[0.9, 0.9, 0.9]} />
        <MedievalPart path="/models/medieval/Prop_Support.gltf" position={[-2.7, 0, 0.6]} />
        <MedievalPart path="/models/medieval/Prop_Support.gltf" position={[2.7, 0, 0.6]} />
      </group>

      {/* Chimney */}
      {hasChimney && (
        <MedievalChimney position={[2.2, 0, -1.4]} scale={0.95} hasSmoke={true} />
      )}

      {/* Cargo crates and vines */}
      <MedievalCratesStack position={[-2.4, 0.3, 3.2]} scale={0.85} />
      <MedievalCrate position={[2.5, 0.3, 3.0]} rotation={0.2} scale={0.8} />
      <MedievalVine position={[-3.02, 2.4, 0.4]} rotation={[0, -Math.PI / 2, 0]} scale={1.0} variant={1} />
    </group>
  );
});

// ============================================================================
// 3. MEDIEVAL 6x6 GRAND TOWN HALL (Majestic civic centerpiece)
// ============================================================================
export interface MedievalTownHallProps {
  position?: [number, number, number];
  rotation?: number;
  scale?: [number, number, number];
}

export const MedievalTownHall6x6 = React.memo<MedievalTownHallProps>(({
  position = [0, 0, 0],
  rotation = 0,
  scale = [1, 1, 1],
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Raised Heavy Stone Foundation */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.5, 6.8]} />
        <meshStandardMaterial color="#495057" roughness={0.95} flatShading />
      </mesh>

      {/* Grand Front Entrance Stone Steps */}
      <MedievalPart path="/models/medieval/Stairs_Exterior_Straight.gltf" position={[0, 0, 3.8]} />

      {/* --- FRONT WALL (Z = 3.0, 3 modules: X = -2, 0, +2) --- */}
      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf" position={[-2.0, 0.5, 3.0]} />
      <MedievalPart path="/models/medieval/WindowShutters_Wide_Flat_Open.gltf" position={[-2.0, 0.5, 3.02]} />

      {/* Grand Arched Double Doorway */}
      <MedievalPart path="/models/medieval/Wall_Plaster_Door_Round.gltf" position={[0, 0.5, 3.0]} />
      <MedievalPart path="/models/medieval/Door_2_Round.gltf" position={[0, 0.5, 3.0]} />

      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf" position={[2.0, 0.5, 3.0]} />
      <MedievalPart path="/models/medieval/WindowShutters_Wide_Flat_Open.gltf" position={[2.0, 0.5, 3.02]} />

      {/* --- BACK WALL (Z = -3.0, Rotation PI) --- */}
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[-2.0, 0.5, -3.0]} rotation={[0, Math.PI, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Straight.gltf" position={[0, 0.5, -3.0]} rotation={[0, Math.PI, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[2.0, 0.5, -3.0]} rotation={[0, Math.PI, 0]} />

      {/* --- LEFT WALL (X = -3.0, 3 modules) --- */}
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[-3.0, 0.5, 2.0]} rotation={[0, -Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf" position={[-3.0, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[-3.0, 0.5, -2.0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* --- RIGHT WALL (X = 3.0, 3 modules) --- */}
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[3.0, 0.5, 2.0]} rotation={[0, Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf" position={[3.0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_Plaster_WoodGrid.gltf" position={[3.0, 0.5, -2.0]} rotation={[0, Math.PI / 2, 0]} />

      {/* --- GRAND 6x6 ROUND TILE ROOF --- */}
      <MedievalPart path="/models/medieval/Roof_RoundTiles_6x6.gltf" position={[0, 3.5, 0]} />

      {/* --- BELFRY SPIRE & CLOCK TOWER ON TOP --- */}
      <group position={[0, 7.8, 0]}>
        {/* Belfry Timber Base */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.4, 1.0, 1.4]} />
          <meshStandardMaterial color="#2b2d42" roughness={0.88} flatShading />
        </mesh>
        {/* Clock Faces */}
        {[-0.71, 0.71].map((cx, idx) => (
          <mesh key={`clk-${idx}`} position={[cx, 0.5, 0]} rotation={[0, idx === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <circleGeometry args={[0.3, 16]} />
            <meshStandardMaterial color="#fffbe6" roughness={0.5} />
          </mesh>
        ))}
        {/* Belfry Roof Spire */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <coneGeometry args={[1.1, 1.4, 4]} />
          <meshStandardMaterial color="#d96b43" roughness={0.7} flatShading />
        </mesh>
        {/* Brass Finial */}
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#e9c46a" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Chimney & Vines */}
      <MedievalChimney position={[2.4, 0, -2.0]} scale={1.1} hasSmoke={true} />
      <MedievalVine position={[-3.02, 2.6, -1.0]} rotation={[0, -Math.PI / 2, 0]} scale={1.1} variant={1} />
      <MedievalVine position={[3.02, 2.6, -1.0]} rotation={[0, Math.PI / 2, 0]} scale={1.1} variant={2} />
    </group>
  );
});

// ============================================================================
// 4. MEDIEVAL BLACKSMITH FORGE (Uneven stone, heavy chimney, open workshop)
// ============================================================================
export interface MedievalBlacksmithProps {
  position?: [number, number, number];
  rotation?: number;
  scale?: [number, number, number];
}

export const MedievalBlacksmith6x4 = React.memo<MedievalBlacksmithProps>(({
  position = [0, 0, 0],
  rotation = 0,
  scale = [1, 1, 1],
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Stone Foundation */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.4, 4.4]} />
        <meshStandardMaterial color="#3a3d40" roughness={0.96} flatShading />
      </mesh>

      {/* --- WALLS (Uneven Stone Brick) --- */}
      {/* Front */}
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Window_Wide_Flat.gltf" position={[-2.0, 0.4, 2.0]} />
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Door_Flat.gltf" position={[0, 0.4, 2.0]} />
      <MedievalPart path="/models/medieval/Door_1_Flat.gltf" position={[-0.45, 0.4, 2.0]} />
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Straight.gltf" position={[2.0, 0.4, 2.0]} />

      {/* Back */}
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Straight.gltf" position={[-2.0, 0.4, -2.0]} rotation={[0, Math.PI, 0]} />
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Straight.gltf" position={[0, 0.4, -2.0]} rotation={[0, Math.PI, 0]} />
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Window_Wide_Flat.gltf" position={[2.0, 0.4, -2.0]} rotation={[0, Math.PI, 0]} />

      {/* Sides */}
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Straight.gltf" position={[-3.0, 0.4, 1.0]} rotation={[0, -Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Straight.gltf" position={[-3.0, 0.4, -1.0]} rotation={[0, -Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Straight.gltf" position={[3.0, 0.4, 1.0]} rotation={[0, Math.PI / 2, 0]} />
      <MedievalPart path="/models/medieval/Wall_UnevenBrick_Straight.gltf" position={[3.0, 0.4, -1.0]} rotation={[0, Math.PI / 2, 0]} />

      {/* --- ROOF --- */}
      <MedievalPart
        path="/models/medieval/Roof_RoundTiles_4x6.gltf"
        position={[0, 3.4, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Heavy Stone Chimney with Billowing Smoke */}
      <MedievalChimney position={[-2.4, 0, 0.2]} scale={1.15} variant={2} hasSmoke={true} />

      {/* Forge Props: Firewood, Crates, Vine */}
      <MedievalCratesStack position={[-2.6, 0.4, 2.8]} scale={0.88} />
      <MedievalVine position={[-3.02, 2.4, -0.6]} rotation={[0, -Math.PI / 2, 0]} scale={1.0} variant={5} />
    </group>
  );
});

// Preload models for instantaneous rendering
useGLTF.preload('/models/medieval/Wall_Plaster_Straight.gltf');
useGLTF.preload('/models/medieval/Wall_Plaster_Window_Wide_Flat.gltf');
useGLTF.preload('/models/medieval/Wall_Plaster_Window_Thin_Round.gltf');
useGLTF.preload('/models/medieval/Wall_Plaster_Door_Flat.gltf');
useGLTF.preload('/models/medieval/Wall_Plaster_Door_Round.gltf');
useGLTF.preload('/models/medieval/Wall_Plaster_WoodGrid.gltf');
useGLTF.preload('/models/medieval/Wall_UnevenBrick_Straight.gltf');
useGLTF.preload('/models/medieval/Wall_UnevenBrick_Door_Flat.gltf');
useGLTF.preload('/models/medieval/Wall_UnevenBrick_Window_Wide_Flat.gltf');
useGLTF.preload('/models/medieval/Roof_RoundTiles_4x4.gltf');
useGLTF.preload('/models/medieval/Roof_RoundTiles_4x6.gltf');
useGLTF.preload('/models/medieval/Roof_RoundTiles_6x6.gltf');
useGLTF.preload('/models/medieval/Door_1_Flat.gltf');
useGLTF.preload('/models/medieval/Door_1_Round.gltf');
useGLTF.preload('/models/medieval/Door_2_Round.gltf');
useGLTF.preload('/models/medieval/WindowShutters_Wide_Flat_Open.gltf');
useGLTF.preload('/models/medieval/Balcony_Cross_Straight.gltf');
useGLTF.preload('/models/medieval/Stairs_Exterior_Straight.gltf');
useGLTF.preload('/models/medieval/Prop_Support.gltf');
