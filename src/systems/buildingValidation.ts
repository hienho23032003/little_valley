import { HOUSES, RIVER_BOUNDS } from '../data/worldData';

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  label: string;
}

export interface PlacedBuildingRef {
  id: string;
  position: [number, number, number];
  size: [number, number];
  rotation: number;
}

export interface ValidationResult {
  isValid: boolean;
  reason: string | null;
}

// World edge boundaries where ground ends
export const WORLD_BUILD_LIMITS = {
  minX: -80.0,
  maxX: 80.0,
  minZ: -80.0,
  maxZ: 80.0,
};

// Static obstacles in the world that buildings cannot overlap
export const STATIC_OBSTACLES: BoundingBox2D[] = [
  // 1. River Corridor & Banks
  {
    minX: -84.0,
    maxX: 14.5,
    minZ: RIVER_BOUNDS.minZ - 0.8,
    maxZ: RIVER_BOUNDS.maxZ + 0.8,
    label: 'Clearwater River',
  },

  // Azure Lake
  {
    minX: 13.5,
    maxX: 75.0,
    minZ: 20.0,
    maxZ: 67.0,
    label: 'Azure Lake',
  },

  // Northern Mountain Cliffs
  {
    minX: -70.0,
    maxX: 70.0,
    minZ: -84.0,
    maxZ: -61.0,
    label: 'Northern Mountain & Mine Crags',
  },

  // Ancient Shrine Sanctuary
  {
    minX: 47.0,
    maxX: 69.0,
    minZ: 47.0,
    maxZ: 69.0,
    label: 'Ancient Shrine Sanctuary',
  },

  // 2. Bridge & crossing approach
  {
    minX: -3.2,
    maxX: 3.2,
    minZ: 17.0,
    maxZ: 25.5,
    label: 'Wooden Bridge',
  },

  // 3. Roads & Dirt Paths
  // Main North-South thoroughfare (Z: -32 to 32)
  {
    minX: -2.5,
    maxX: 2.5,
    minZ: -32.0,
    maxZ: 32.0,
    label: 'Main Road',
  },
  // Village East-West roads
  {
    minX: -16.0,
    maxX: 16.0,
    minZ: -13.0,
    maxZ: -10.0,
    label: 'Village High Street',
  },
  {
    minX: -16.0,
    maxX: 16.0,
    minZ: -4.0,
    maxZ: -1.0,
    label: 'Village Artisan Lane',
  },
  // Farm East-West road
  {
    minX: -14.0,
    maxX: 14.0,
    minZ: 4.0,
    maxZ: 8.0,
    label: 'Farm Road',
  },

  // 4. Village Center Square & Well
  {
    minX: -5.0,
    maxX: 5.0,
    minZ: -15.5,
    maxZ: -5.5,
    label: 'Village Square & Well',
  },

  // 5. Existing Village & Farm Houses (with exact footprint buffers)
  ...HOUSES.map((h) => {
    const w = (h.config?.width || 5.0) * (h.scale?.[0] || 1);
    const d = (h.config?.depth || 4.2) * (h.scale?.[2] || 1);
    return {
      minX: h.position[0] - w / 2 - 0.5,
      maxX: h.position[0] + w / 2 + 0.5,
      minZ: h.position[2] - d / 2 - 0.5,
      maxZ: h.position[2] + d / 2 + 0.5,
      label: h.name,
    };
  }),

  // 6. Interactive 4x4 Farming Field
  {
    minX: -13.2,
    maxX: -5.8,
    minZ: 10.0,
    maxZ: 17.0,
    label: 'Active Farm Crops Field',
  },

  // 7. Animal Pens (Chicken coop, Cow pasture, Sheep pen)
  {
    minX: -17.5,
    maxX: -12.5,
    minZ: 3.2,
    maxZ: 7.8,
    label: 'Existing Chicken Coop Pen',
  },
  {
    minX: 5.2,
    maxX: 12.8,
    minZ: 5.8,
    maxZ: 11.2,
    label: 'Existing Cow Pasture',
  },
  {
    minX: 5.2,
    maxX: 12.8,
    minZ: 11.2,
    maxZ: 16.5,
    label: 'Existing Sheep Pen',
  },
];

export function getRotatedAABB(
  position: [number, number, number],
  size: [number, number],
  rotation: number
): BoundingBox2D {
  const cos = Math.abs(Math.cos(rotation));
  const sin = Math.abs(Math.sin(rotation));
  const effW = cos * size[0] + sin * size[1];
  const effD = sin * size[0] + cos * size[1];

  return {
    minX: position[0] - effW / 2,
    maxX: position[0] + effW / 2,
    minZ: position[2] - effD / 2,
    maxZ: position[2] + effD / 2,
    label: 'Candidate Building',
  };
}

export function doBoxesOverlap(a: BoundingBox2D, b: BoundingBox2D, buffer = 0.2): boolean {
  return (
    a.minX < b.maxX + buffer &&
    a.maxX > b.minX - buffer &&
    a.minZ < b.maxZ + buffer &&
    a.maxZ > b.minZ - buffer
  );
}

export function validateBuildingPlacement(
  position: [number, number, number],
  size: [number, number],
  rotation: number,
  placedBuildings: PlacedBuildingRef[]
): ValidationResult {
  const candidate = getRotatedAABB(position, size, rotation);

  // 1. Check World Bounds
  if (
    candidate.minX < WORLD_BUILD_LIMITS.minX ||
    candidate.maxX > WORLD_BUILD_LIMITS.maxX ||
    candidate.minZ < WORLD_BUILD_LIMITS.minZ ||
    candidate.maxZ > WORLD_BUILD_LIMITS.maxZ
  ) {
    return {
      isValid: false,
      reason: 'Outside buildable valley territory',
    };
  }

  // 2. Check Static Obstacles (River, Paths, Existing Houses, Active Farm)
  for (const obstacle of STATIC_OBSTACLES) {
    if (doBoxesOverlap(candidate, obstacle)) {
      return {
        isValid: false,
        reason: `Cannot overlap ${obstacle.label}`,
      };
    }
  }

  // 3. Check Collision with other Placed Player Buildings
  for (const placed of placedBuildings) {
    const placedBox = getRotatedAABB(placed.position, placed.size, placed.rotation);
    if (doBoxesOverlap(candidate, placedBox)) {
      return {
        isValid: false,
        reason: 'Cannot overlap another constructed building',
      };
    }
  }

  return {
    isValid: true,
    reason: null,
  };
}
