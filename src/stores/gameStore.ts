import { create } from 'zustand';
import { PLAYABLE_WORLD_BOUNDS } from '../data/worldData';

export interface WorldBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface GameState {
  // Player state
  playerPosition: [number, number, number];
  playerRotation: number;
  isMoving: boolean;

  // World bounds
  worldBounds: WorldBounds;
  spawnPosition: [number, number, number];

  // Camera state
  cameraAngle: number; // Horizontal azimuth angle (in radians)

  // Actions
  setPlayerPosition: (position: [number, number, number]) => void;
  setPlayerRotation: (rotation: number) => void;
  setIsMoving: (isMoving: boolean) => void;
  setCameraAngle: (angle: number) => void;
  resetToSpawn: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerPosition: [0, 0, 4], // Spawn near the farmhouse / path on ground Y=0
  playerRotation: 0,
  isMoving: false,

  worldBounds: PLAYABLE_WORLD_BOUNDS,
  spawnPosition: [0, 0, 4],
  cameraAngle: 0,

  setPlayerPosition: (position) => {
    const cur = get().playerPosition;
    if (cur[0] !== position[0] || cur[1] !== position[1] || cur[2] !== position[2]) {
      set({ playerPosition: position });
    }
  },
  setPlayerRotation: (rotation) => {
    if (Math.abs(get().playerRotation - rotation) > 0.01) {
      set({ playerRotation: rotation });
    }
  },
  setIsMoving: (isMoving) => {
    if (get().isMoving !== isMoving) {
      set({ isMoving });
    }
  },
  setCameraAngle: (angle) => {
    if (Math.abs(get().cameraAngle - angle) > 0.005) {
      set({ cameraAngle: angle });
    }
  },
  resetToSpawn: () =>
    set((state) => ({
      playerPosition: [...state.spawnPosition],
      playerRotation: 0,
      isMoving: false,
    })),
}));
