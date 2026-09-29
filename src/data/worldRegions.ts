export interface RegionDef {
  id: string;
  name: string;
  badge: string;
  description: string;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  ambientColor?: string;
}

export const WORLD_REGIONS: Record<string, RegionDef> = {
  farm: {
    id: 'farm',
    name: 'Sunlit Farmstead',
    badge: '🌾',
    description: 'Fertile tilled soil, cozy homestead, and bustling animal pastures.',
    bounds: { minX: -32, maxX: 20, minZ: 0, maxZ: 22 },
  },
  village: {
    id: 'village',
    name: 'Valley Village',
    badge: '🏡',
    description: 'Charming village square with market stalls, artisan cottages, and stone well.',
    bounds: { minX: -34, maxX: 24, minZ: -28, maxZ: 0 },
  },
  forest: {
    id: 'forest',
    name: 'Whispering Forest',
    badge: '🌲',
    description: 'Dense canopy of towering pine and ancient oak trees with hidden clearings.',
    bounds: { minX: -82, maxX: 20, minZ: -82, maxZ: -28 },
  },
  mountain: {
    id: 'mountain',
    name: 'Granite Mountain & Mine',
    badge: '🏔️',
    description: 'Steep rocky crags, ore-rich stone cliffs, and the old valley mine entrance.',
    bounds: { minX: -60, maxX: 60, minZ: -84, maxZ: -62 },
  },
  meadow: {
    id: 'meadow',
    name: 'Sunlit Meadow & Hills',
    badge: '🌻',
    description: 'Rolling grassy knolls adorned with blooming wildflowers and fruit groves.',
    bounds: { minX: 20, maxX: 82, minZ: -35, maxZ: 35 },
  },
  river: {
    id: 'river',
    name: 'Clearwater River & Bridge',
    badge: '🌊',
    description: 'Crystal-clear river winding under the wooden bridge into the southern lake.',
    bounds: { minX: -82, maxX: 15, minZ: 18, maxZ: 28 },
  },
  lake: {
    id: 'lake',
    name: 'Azure Lake & Fishing Pier',
    badge: '⛵',
    description: 'Tranquil freshwater lake with a wooden fishing dock, rowboat, and water lilies.',
    bounds: { minX: 12, maxX: 82, minZ: 25, maxZ: 82 },
  },
  shrine: {
    id: 'shrine',
    name: 'Ancient Shrine',
    badge: '⛩️',
    description: 'Mysterious stone pillars from a forgotten age, shrouded in quiet reverie.',
    bounds: { minX: 45, maxX: 82, minZ: 45, maxZ: 82 },
  },
};

export function getRegionAtPosition(x: number, z: number): RegionDef {
  // Check specific POI regions first
  if (x >= 45 && z >= 45) return WORLD_REGIONS.shrine;
  if (z >= -84 && z <= -62) return WORLD_REGIONS.mountain;
  if (x >= 12 && z >= 25) return WORLD_REGIONS.lake;
  if (z >= 18 && z <= 28 && x < 15) return WORLD_REGIONS.river;
  if (z <= -28) return WORLD_REGIONS.forest;
  if (x >= 20) return WORLD_REGIONS.meadow;
  if (z >= 0 && z <= 22) return WORLD_REGIONS.farm;
  return WORLD_REGIONS.village;
}
