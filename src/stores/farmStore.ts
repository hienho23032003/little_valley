import { create } from 'zustand';
import { CropType, CROPS } from '../data/cropData';
import { useInventoryStore } from './inventoryStore';

export type TileState = 'EMPTY' | 'PLOWED' | 'PLANTED' | 'GROWING' | 'READY';
export type GrowthStage = 0 | 1 | 2 | 3;

export interface CropObject {
  id: string;
  cropType: CropType;
  growthProgress: number; // 0.0 to 1.0
  growthTime: number; // in seconds
  stage: GrowthStage;
  wateredToday: boolean;
  plantedAt: number;
}

export interface FarmTile {
  id: string;
  col: number; // 0..cols-1
  row: number; // 0..rows-1
  worldPosition: [number, number, number];
  state: TileState;
  crop?: CropObject;
}

export interface NotificationItem {
  id: string;
  text: string;
  icon?: string;
  color?: string;
  timestamp: number;
}

export interface FarmStoreState {
  tiles: FarmTile[];
  selectedSeed: CropType;
  inventory: Record<string, number>;
  activeTileId: string | null;
  notifications: NotificationItem[];

  // Actions
  initTiles: (origin: [number, number, number], cols?: number, rows?: number, spacing?: number) => void;
  plowTile: (tileId: string) => boolean;
  plantTile: (tileId: string, cropType?: CropType) => boolean;
  waterTile: (tileId: string) => boolean;
  harvestTile: (tileId: string) => boolean;
  tickGrowth: (deltaSeconds: number) => void;
  setSelectedSeed: (crop: CropType) => void;
  setActiveTileId: (tileId: string | null) => void;
  addNotification: (text: string, icon?: string, color?: string) => void;
  removeNotification: (id: string) => void;
  refillSeeds: () => void;
}

// Default field location near the farmhouse (X: -9.5, Z: 13.5)
const DEFAULT_ORIGIN: [number, number, number] = [-9.5, 0, 13.5];

function createDefaultTiles(
  origin: [number, number, number] = DEFAULT_ORIGIN,
  cols = 4,
  rows = 4,
  spacing = 1.4
): FarmTile[] {
  const tiles: FarmTile[] = [];
  const startX = origin[0] - ((cols - 1) * spacing) / 2;
  const startZ = origin[2] - ((rows - 1) * spacing) / 2;

  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileId = `tile-${c}-${r}`;
      const posX = startX + c * spacing;
      const posZ = startZ + r * spacing;

      tiles.push({
        id: tileId,
        col: c,
        row: r,
        worldPosition: [posX, origin[1], posZ],
        state: 'EMPTY',
      });
      index++;
    }
  }

  // Pre-seed a couple of tiles so the world immediately looks alive with visible growth stages
  // Tile 0: plowed
  tiles[0].state = 'PLOWED';
  // Tile 1: planted carrot seedling (stage 1)
  tiles[1].state = 'GROWING';
  tiles[1].crop = {
    id: 'pre-crop-1',
    cropType: 'carrot',
    growthProgress: 0.35,
    growthTime: CROPS.carrot.growthTime,
    stage: 1,
    wateredToday: true,
    plantedAt: Date.now(),
  };
  // Tile 2: golden ready wheat (stage 3)
  tiles[2].state = 'READY';
  tiles[2].crop = {
    id: 'pre-crop-2',
    cropType: 'wheat',
    growthProgress: 1.0,
    growthTime: CROPS.wheat.growthTime,
    stage: 3,
    wateredToday: true,
    plantedAt: Date.now(),
  };
  // Tile 3: fresh green pumpkin sprout (stage 0)
  tiles[3].state = 'PLANTED';
  tiles[3].crop = {
    id: 'pre-crop-3',
    cropType: 'pumpkin',
    growthProgress: 0.1,
    growthTime: CROPS.pumpkin.growthTime,
    stage: 0,
    wateredToday: true,
    plantedAt: Date.now(),
  };
  // Tile 4: growing lush tomato bush (stage 2)
  tiles[4].state = 'GROWING';
  tiles[4].crop = {
    id: 'pre-crop-4',
    cropType: 'tomato',
    growthProgress: 0.7,
    growthTime: CROPS.tomato.growthTime,
    stage: 2,
    wateredToday: true,
    plantedAt: Date.now(),
  };

  return tiles;
}

export const useFarmStore = create<FarmStoreState>((set, get) => ({
  tiles: createDefaultTiles(),
  selectedSeed: 'wheat',
  inventory: {
    wheat_seed: 8,
    corn_seed: 8,
    carrot_seed: 8,
    tomato_seed: 8,
    wheat: 0,
    corn: 0,
    carrot: 0,
    tomato: 0,
  },
  activeTileId: null,
  notifications: [],

  initTiles: (origin, cols = 4, rows = 4, spacing = 1.4) => {
    set({ tiles: createDefaultTiles(origin, cols, rows, spacing) });
  },

  setSelectedSeed: (crop) => set({ selectedSeed: crop }),

  setActiveTileId: (tileId) => set({ activeTileId: tileId }),

  plowTile: (tileId) => {
    const { tiles, addNotification } = get();
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || tile.state !== 'EMPTY') return false;

    set({
      tiles: tiles.map((t) => (t.id === tileId ? { ...t, state: 'PLOWED' } : t)),
    });

    addNotification('Soil plowed!', '⛏️', '#b37d4c');
    return true;
  },

  plantTile: (tileId, explicitCropType) => {
    const { tiles, selectedSeed, inventory, addNotification } = get();

    // Check if player has selected a seed item in hotbar
    const heldItem = useInventoryStore.getState().getSelectedItem();
    let cropType = explicitCropType;
    if (!cropType) {
      if (heldItem && heldItem.category === 'Seed' && heldItem.cropType) {
        cropType = heldItem.cropType;
      } else {
        cropType = selectedSeed;
      }
    }

    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || tile.state !== 'PLOWED') return false;

    const cropDef = CROPS[cropType];
    const seedKey = cropDef.seedItem;

    // Check useInventoryStore first
    const hasInInvStore = useInventoryStore.getState().hasItem(seedKey, 1);
    const hasInLocal = (inventory[seedKey] ?? 0) > 0;

    if (!hasInInvStore && !hasInLocal) {
      addNotification(`No ${cropDef.seedName} left!`, '⚠️', '#e63946');
      return false;
    }

    // Deduct from useInventoryStore
    if (hasInInvStore) {
      useInventoryStore.getState().removeItem(seedKey, 1);
    }

    // Deduct 1 seed from local mirror
    const newInventory = {
      ...inventory,
      [seedKey]: Math.max(0, (inventory[seedKey] ?? 1) - 1),
    };

    const newCrop: CropObject = {
      id: `crop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cropType,
      growthProgress: 0.0,
      growthTime: cropDef.growthTime,
      stage: 0,
      wateredToday: false,
      plantedAt: Date.now(),
    };

    set({
      inventory: newInventory,
      tiles: tiles.map((t) =>
        t.id === tileId
          ? {
              ...t,
              state: 'PLANTED',
              crop: newCrop,
            }
          : t
      ),
    });

    addNotification(`Planted ${cropDef.name}!`, cropDef.icon, cropDef.color);
    return true;
  },

  waterTile: (tileId) => {
    const { tiles, addNotification } = get();
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || (!tile.crop && tile.state !== 'PLOWED')) return false;

    if (tile.crop) {
      if (tile.crop.wateredToday) {
        addNotification('Already watered today!', '💧', '#64b5f6');
        return false;
      }

      set({
        tiles: tiles.map((t) =>
          t.id === tileId && t.crop
            ? {
                ...t,
                crop: { ...t.crop, wateredToday: true },
              }
            : t
        ),
      });

      addNotification('Crops watered! 💧', '💧', '#3a86ff');
      return true;
    }

    return false;
  },

  harvestTile: (tileId) => {
    const { tiles, inventory, addNotification } = get();
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || tile.state !== 'READY' || !tile.crop) return false;

    const cropDef = CROPS[tile.crop.cropType];
    const harvestItem = cropDef.harvestItem;
    const seedItem = cropDef.seedItem;

    // Add harvest item + 1 seed to useInventoryStore
    useInventoryStore.getState().addItem(harvestItem, 1);
    useInventoryStore.getState().addItem(seedItem, 1);

    const currentCount = inventory[harvestItem] || 0;
    const currentSeedCount = inventory[seedItem] || 0;

    // Give 1 harvest item + return 1 seed so player has sustained crops
    const newInventory = {
      ...inventory,
      [harvestItem]: currentCount + 1,
      [seedItem]: currentSeedCount + 1,
    };

    // Remove crop from field; returns to EMPTY as specified
    set({
      inventory: newInventory,
      tiles: tiles.map((t) =>
        t.id === tileId
          ? {
              ...t,
              state: 'EMPTY',
              crop: undefined,
            }
          : t
      ),
    });

    // Mandatory floating notification: "+1 Wheat"
    addNotification(`+1 ${cropDef.name}`, cropDef.icon, cropDef.color);
    return true;
  },

  tickGrowth: (deltaSeconds) => {
    const { tiles } = get();
    let hasChanges = false;

    const updatedTiles = tiles.map((tile) => {
      if (!tile.crop || tile.state === 'READY' || tile.state === 'EMPTY' || tile.state === 'PLOWED') {
        return tile;
      }

      const crop = tile.crop;
      // Watered crops grow normally (1.0x); unwatered crops grow slower (0.35x)
      const speedMult = crop.wateredToday ? 1.0 : 0.35;
      const progressDelta = (deltaSeconds / crop.growthTime) * speedMult;
      const newProgress = Math.min(1.0, crop.growthProgress + progressDelta);

      // Determine stage and tile state
      let newStage: GrowthStage = 0;
      let newState: TileState = tile.state;

      if (newProgress >= 1.0) {
        newStage = 3;
        newState = 'READY';
      } else if (newProgress >= 0.65) {
        newStage = 2;
        newState = 'GROWING';
      } else if (newProgress >= 0.25) {
        newStage = 1;
        newState = 'GROWING';
      } else {
        newStage = 0;
        newState = 'PLANTED';
      }

      // Update continuous growthProgress in place without triggering React re-render churn
      crop.growthProgress = newProgress;

      // Only trigger React state updates when the visual growth stage or tile state actually transitions!
      if (newStage !== crop.stage || newState !== tile.state) {
        hasChanges = true;
        return {
          ...tile,
          state: newState,
          crop: {
            ...crop,
            growthProgress: newProgress,
            stage: newStage,
          },
        };
      }

      return tile;
    });

    if (hasChanges) {
      set({ tiles: [...updatedTiles] });
    }
  },

  addNotification: (text, icon, color = '#344e41') => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: NotificationItem = {
      id,
      text,
      icon,
      color,
      timestamp: Date.now(),
    };

    set((state) => ({
      notifications: [...state.notifications.slice(-4), newNotif],
    }));

    // Auto dismiss after 2.5s
    setTimeout(() => {
      get().removeNotification(id);
    }, 2500);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  refillSeeds: () => {
    useInventoryStore.getState().addItem('wheat_seed', 5);
    useInventoryStore.getState().addItem('corn_seed', 5);
    useInventoryStore.getState().addItem('carrot_seed', 5);
    useInventoryStore.getState().addItem('tomato_seed', 5);

    set((state) => ({
      inventory: {
        ...state.inventory,
        wheat_seed: (state.inventory.wheat_seed || 0) + 5,
        corn_seed: (state.inventory.corn_seed || 0) + 5,
        carrot_seed: (state.inventory.carrot_seed || 0) + 5,
        tomato_seed: (state.inventory.tomato_seed || 0) + 5,
      },
    }));
    get().addNotification('Refilled 5 seeds of each crop! 🌱', '🌱', '#52b788');
  },
}));
