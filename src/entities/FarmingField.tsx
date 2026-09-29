import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFarmStore, FarmTile } from '../stores/farmStore';
import { useGameStore } from '../stores/gameStore';
import { CropModel } from './CropModel';
import { PALETTE } from '../utils/colors';
import { performInteract } from '../systems/actionManager';

interface FarmingFieldProps {
  origin?: [number, number, number];
}

const INTERACTION_DISTANCE = 2.0;

export const FarmingField: React.FC<FarmingFieldProps> = React.memo(() => {
  const tiles = useFarmStore((state) => state.tiles);
  const activeTileId = useFarmStore((state) => state.activeTileId);
  const setActiveTileId = useFarmStore((state) => state.setActiveTileId);
  const tickGrowth = useFarmStore((state) => state.tickGrowth);
  const waterTile = useFarmStore((state) => state.waterTile);
  const setSelectedSeed = useFarmStore((state) => state.setSelectedSeed);

  // Growth loop & Proximity detection on each frame
  useFrame((_, delta) => {
    // 1. Advance crop growth
    tickGrowth(delta);

    // 2. Proximity check for closest farm tile (read directly from store to avoid 60fps React re-renders)
    const [px, , pz] = useGameStore.getState().playerPosition;
    let closestId: string | null = null;
    const maxDistSq = INTERACTION_DISTANCE * INTERACTION_DISTANCE;
    let minDistSq = maxDistSq;

    for (const tile of tiles) {
      const [tx, , tz] = tile.worldPosition;
      const dx = px - tx;
      const dz = pz - tz;
      const distSq = dx * dx + dz * dz;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        closestId = tile.id;
      }
    }

    if (closestId !== activeTileId) {
      setActiveTileId(closestId);
    }
  });

  // Global keydown listener for E, Q, and 1-4 hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      // Seed hotkeys 1-4
      if (e.code === 'Digit1') setSelectedSeed('wheat');
      if (e.code === 'Digit2') setSelectedSeed('corn');
      if (e.code === 'Digit3') setSelectedSeed('carrot');
      if (e.code === 'Digit4') setSelectedSeed('tomato');

      // Key E: Primary Context Action (shared with mobile touch action)
      if (e.code === 'KeyE') {
        performInteract();
        return;
      }

      const currentActiveId = useFarmStore.getState().activeTileId;
      if (!currentActiveId) return;

      const currentTile = useFarmStore
        .getState()
        .tiles.find((t) => t.id === currentActiveId);
      if (!currentTile) return;

      // Key Q: Dedicated Water Tool
      if (e.code === 'KeyQ') {
        if (currentTile.crop || currentTile.state === 'PLOWED') {
          waterTile(currentTile.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [waterTile, setSelectedSeed]);

  return (
    <group>
      {/* Wooden Enclosure Perimeter Border for the 4x4 Field (Top Y = 0.20) */}
      <mesh position={[-9.5, 0.1, 13.5]} receiveShadow>
        <boxGeometry args={[6.6, 0.2, 6.6]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>
      {/* Field Foundation Soil Base (Top Y = 0.12) */}
      <mesh position={[-9.5, 0.06, 13.5]} receiveShadow>
        <boxGeometry args={[6.2, 0.12, 6.2]} />
        <meshStandardMaterial color="#6a4a2b" roughness={0.95} flatShading />
      </mesh>

      {/* Render Each 4x4 Grid Farm Tile */}
      {tiles.map((tile) => (
        <FarmTileItem
          key={tile.id}
          tile={tile}
          isActive={tile.id === activeTileId}
        />
      ))}
    </group>
  );
});

const ActiveTilePulse: React.FC<{ isReady: boolean }> = ({ isReady }) => {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = state.clock.getElapsedTime();
      const s = 1.0 + Math.sin(t * 5.0) * 0.03;
      pulseRef.current.scale.set(s, 1, s);
    }
  });

  return (
    <group position={[0, 0.28, 0]}>
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.72, 8]} />
        <meshBasicMaterial
          color={isReady ? '#ffd166' : '#a7c957'}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

interface FarmTileItemProps {
  tile: FarmTile;
  isActive: boolean;
}

const FarmTileItem: React.FC<FarmTileItemProps> = React.memo(({ tile, isActive }) => {
  const isWatered = tile.crop?.wateredToday ?? false;
  const isPlowedOrPlanted = tile.state !== 'EMPTY';

  // Dynamic soil color based on state:
  // Watered: deep rich moist brown with subtle specular sheen
  // Dry plowed: warm earthy brown
  // Empty: untilled soil patch
  let soilColor = '#a88358';
  let roughness = 0.95;
  let metalness = 0.0;

  if (isPlowedOrPlanted) {
    if (isWatered) {
      soilColor = '#422814'; // Dark damp soil
      roughness = 0.35; // Wet sheen
      metalness = 0.15;
    } else {
      soilColor = PALETTE.tilledSoil; // Dry tilled brown
      roughness = 0.9;
    }
  }

  return (
    <group position={tile.worldPosition}>
      {/* Tile Soil Bed (Top Y = 0.16) */}
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[1.22, 0.10, 1.22]} />
        <meshStandardMaterial
          color={soilColor}
          roughness={roughness}
          metalness={metalness}
          flatShading
        />
      </mesh>

      {/* Furrow ridges if plowed (Top Y = 0.23) */}
      {isPlowedOrPlanted && (
        <group position={[0, 0.19, 0]}>
          {[-0.32, 0, 0.32].map((z, idx) => (
            <mesh key={`ridge-${idx}`} position={[0, 0, z]} receiveShadow>
              <cylinderGeometry args={[0.08, 0.14, 1.1, 4]} />
              <meshStandardMaterial
                color={soilColor}
                roughness={roughness}
                metalness={metalness}
                flatShading
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Watered Damp Sheen & Little Droplet Indicator */}
      {isWatered && (
        <group position={[0.42, 0.35, 0.42]}>
          <mesh>
            <sphereGeometry args={[0.06, 5, 5]} />
            <meshStandardMaterial
              color="#64b5f6"
              emissive="#2196f3"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}

      {/* Crop 3D Model */}
      {tile.crop && (
        <CropModel
          cropType={tile.crop.cropType}
          stage={tile.crop.stage}
          growthProgress={tile.crop.growthProgress}
          isReady={tile.state === 'READY'}
        />
      )}

      {/* Selection Highlight Ring when Player is Nearby */}
      {isActive && <ActiveTilePulse isReady={tile.state === 'READY'} />}
    </group>
  );
});
