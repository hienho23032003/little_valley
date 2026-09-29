import { create } from 'zustand';
import { BUILDINGS, getBuildingDefinition } from '../data/buildingData';
import { useInventoryStore } from './inventoryStore';
import { validateBuildingPlacement } from '../systems/buildingValidation';

export interface PlacedBuilding {
  id: string;
  buildingTypeId: string;
  position: [number, number, number];
  rotation: number;
  size: [number, number];
  placedAt: number;
}

export interface BuildState {
  isBuildMenuOpen: boolean;
  selectedBuildingId: string | null;
  previewPosition: [number, number, number];
  previewRotation: number; // 0, PI/2, PI, 3PI/2
  isValidPlacement: boolean;
  validationError: string | null;

  placedBuildings: PlacedBuilding[];

  // Toast / notification feedback
  lastNotification: string | null;

  // Actions
  openBuildMenu: () => void;
  closeBuildMenu: () => void;
  toggleBuildMenu: () => void;
  selectBuilding: (buildingTypeId: string) => void;
  cancelPlacement: () => void;
  setPreviewPosition: (pos: [number, number, number]) => void;
  rotatePreview: () => void;
  canAffordBuilding: (buildingTypeId: string) => boolean;
  placeBuilding: () => boolean;
  removeBuilding: (id: string) => void;
  clearNotification: () => void;
}

export const useBuildStore = create<BuildState>((set, get) => ({
  isBuildMenuOpen: false,
  selectedBuildingId: null,
  previewPosition: [0, 0, 0],
  previewRotation: 0,
  isValidPlacement: false,
  validationError: null,
  placedBuildings: [],
  lastNotification: null,

  openBuildMenu: () => {
    set({ isBuildMenuOpen: true });
  },

  closeBuildMenu: () => {
    set({ isBuildMenuOpen: false });
  },

  toggleBuildMenu: () => {
    const { isBuildMenuOpen, selectedBuildingId } = get();
    // If currently placing, pressing B closes placement or opens menu
    if (selectedBuildingId) {
      set({ selectedBuildingId: null, isBuildMenuOpen: false });
    } else {
      set({ isBuildMenuOpen: !isBuildMenuOpen });
    }
  },

  selectBuilding: (buildingTypeId: string) => {
    const def = BUILDINGS[buildingTypeId];
    if (!def) return;

    // Check affordability before selecting
    const canAfford = get().canAffordBuilding(buildingTypeId);
    if (!canAfford) {
      set({
        lastNotification: `Not enough resources for ${def.name}!`,
      });
      return;
    }

    const { previewPosition, previewRotation, placedBuildings } = get();
    const validation = validateBuildingPlacement(
      previewPosition,
      def.size,
      previewRotation,
      placedBuildings
    );

    set({
      selectedBuildingId: buildingTypeId,
      isBuildMenuOpen: false, // Close modal to enter 3D placement mode
      isValidPlacement: validation.isValid,
      validationError: validation.reason,
      lastNotification: `Entered Build Mode: Placing ${def.name}`,
    });
  },

  cancelPlacement: () => {
    set({
      selectedBuildingId: null,
      validationError: null,
      lastNotification: 'Cancelled building placement',
    });
  },

  setPreviewPosition: (pos: [number, number, number]) => {
    const { selectedBuildingId, previewRotation, placedBuildings } = get();
    if (!selectedBuildingId) {
      set({ previewPosition: pos });
      return;
    }

    const def = getBuildingDefinition(selectedBuildingId);
    if (!def) return;

    const validation = validateBuildingPlacement(pos, def.size, previewRotation, placedBuildings);
    set({
      previewPosition: pos,
      isValidPlacement: validation.isValid,
      validationError: validation.reason,
    });
  },

  rotatePreview: () => {
    const { selectedBuildingId, previewPosition, previewRotation, placedBuildings } = get();
    const nextRotation = (previewRotation + Math.PI / 2) % (Math.PI * 2);

    if (selectedBuildingId) {
      const def = getBuildingDefinition(selectedBuildingId);
      if (def) {
        const validation = validateBuildingPlacement(
          previewPosition,
          def.size,
          nextRotation,
          placedBuildings
        );
        set({
          previewRotation: nextRotation,
          isValidPlacement: validation.isValid,
          validationError: validation.reason,
        });
        return;
      }
    }

    set({ previewRotation: nextRotation });
  },

  canAffordBuilding: (buildingTypeId: string): boolean => {
    const def = getBuildingDefinition(buildingTypeId);
    if (!def) return false;

    const inv = useInventoryStore.getState();
    const hasWood = inv.getItemCount('wood') >= def.cost.wood;
    const hasStone = inv.getItemCount('stone') >= def.cost.stone;
    const hasCoins = inv.coins >= def.cost.coins;

    return hasWood && hasStone && hasCoins;
  },

  placeBuilding: (): boolean => {
    const {
      selectedBuildingId,
      previewPosition,
      previewRotation,
      placedBuildings,
    } = get();

    if (!selectedBuildingId) return false;

    const def = getBuildingDefinition(selectedBuildingId);
    if (!def) return false;

    // Check validation
    const validation = validateBuildingPlacement(
      previewPosition,
      def.size,
      previewRotation,
      placedBuildings
    );
    if (!validation.isValid) {
      set({
        isValidPlacement: false,
        validationError: validation.reason,
        lastNotification: `Cannot place here: ${validation.reason}`,
      });
      return false;
    }

    // Check affordability
    const canAfford = get().canAffordBuilding(selectedBuildingId);
    if (!canAfford) {
      set({
        isValidPlacement: false,
        validationError: 'Not enough resources to construct!',
        lastNotification: 'Missing wood, stone, or coins!',
      });
      return false;
    }

    // Deduct resources from inventory
    const inv = useInventoryStore.getState();
    inv.removeItem('wood', def.cost.wood);
    inv.removeItem('stone', def.cost.stone);
    inv.removeCoins(def.cost.coins);

    // Create placed building
    const newBuilding: PlacedBuilding = {
      id: `placed-${def.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      buildingTypeId: def.id,
      position: [previewPosition[0], previewPosition[1], previewPosition[2]],
      rotation: previewRotation,
      size: def.size,
      placedAt: Date.now(),
    };

    const updatedPlaced = [...placedBuildings, newBuilding];

    // Re-check validation for continuing in placement mode (now overlapping current)
    const nextValidation = validateBuildingPlacement(
      previewPosition,
      def.size,
      previewRotation,
      updatedPlaced
    );

    set({
      placedBuildings: updatedPlaced,
      isValidPlacement: nextValidation.isValid,
      validationError: nextValidation.reason,
      lastNotification: `Successfully constructed ${def.name}! 🎉`,
    });

    return true;
  },

  removeBuilding: (id: string) => {
    set((state) => ({
      placedBuildings: state.placedBuildings.filter((b) => b.id !== id),
    }));
  },

  clearNotification: () => {
    set({ lastNotification: null });
  },
}));
