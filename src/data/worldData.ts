import { createSeededRandom } from '../utils/math';
import { VILLAGE_BUILDINGS, ModularBuildingConfig } from './buildingConfigs';

// Expanded terrain/table dimensions (170x170m diorama)
export const TERRAIN_SIZE = 170;
export const TERRAIN_HALF_SIZE = TERRAIN_SIZE / 2; // 85
export const TERRAIN_MARGIN = 2.5; // Margin from table edge

export const PLAYABLE_WORLD_BOUNDS = {
  minX: -TERRAIN_HALF_SIZE + TERRAIN_MARGIN, // -82.5
  maxX: TERRAIN_HALF_SIZE - TERRAIN_MARGIN,  // 82.5
  minZ: -TERRAIN_HALF_SIZE + TERRAIN_MARGIN, // -82.5
  maxZ: TERRAIN_HALF_SIZE - TERRAIN_MARGIN,  // 82.5
};

export interface HouseConfig {
  id: string;
  position: [number, number, number];
  rotation: number;
  scale?: [number, number, number];
  roofColor: string;
  wallColor: string;
  hasChimney?: boolean;
  hasPorch?: boolean;
  name: string;
  config?: ModularBuildingConfig;
}

export interface ExclusionZone {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface TransformItem {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  type?: string;
  color?: string;
}

// Backwards-compatible HOUSES mapping backed by the modular building configs
export const HOUSES: HouseConfig[] = VILLAGE_BUILDINGS.map((b) => ({
  id: b.id,
  position: b.position,
  rotation: b.rotation,
  scale: b.scale,
  roofColor: b.roofColor,
  wallColor: b.wallColor,
  hasChimney: b.hasChimney,
  hasPorch: b.hasPorch,
  name: b.name,
  config: b,
}));

// River bounds
export const RIVER_BOUNDS = {
  minZ: 19.0,
  maxZ: 23.5,
  minX: -38,
  maxX: 38,
  depth: 0.5,
};

// Bridge bounds (where crossing the river is safe)
export const BRIDGE_BOUNDS = {
  minX: -2.5,
  maxX: 2.5,
  minZ: 17.5,
  maxZ: 25.0,
};

// Rectangular exclusion zones where nature objects (trees, large rocks) must NOT spawn
export const EXCLUSION_ZONES: ExclusionZone[] = [
  // Player spawn buffer
  { minX: -3.5, maxX: 3.5, minZ: 1.5, maxZ: 6.5 },

  // Village center square & piazza (X: -7.5 to 7.5, Z: -23.0 to -5.5)
  { minX: -7.5, maxX: 7.5, minZ: -23.0, maxZ: -5.5 },

  // All Village & World Buildings footprints (+2m safety perimeter)
  ...VILLAGE_BUILDINGS.map((b) => {
    const halfW = (b.width * (b.scale?.[0] || 1)) / 2 + 1.6;
    const halfD = (b.depth * (b.scale?.[2] || 1)) / 2 + 1.6;
    return {
      minX: b.position[0] - halfW,
      maxX: b.position[0] + halfW,
      minZ: b.position[2] - halfD,
      maxZ: b.position[2] + halfD,
    };
  }),

  // Farm tilled plots & active field
  { minX: 3.5, maxX: 14.5, minZ: 3.5, maxZ: 14.5 },
  { minX: -14.5, maxX: -4.5, minZ: 9.5, maxZ: 17.5 },

  // Animal Pastures & Pens
  { minX: -17.5, maxX: -12.5, minZ: 3.2, maxZ: 7.8 },
  { minX: 5.2, maxX: 13.5, minZ: 5.5, maxZ: 17.0 },

  // Clearwater River corridor (west border to lake inlet)
  { minX: -85, maxX: 15, minZ: RIVER_BOUNDS.minZ - 0.8, maxZ: RIVER_BOUNDS.maxZ + 0.8 },

  // Azure Lake basin
  { minX: 13, maxX: 75, minZ: 19.5, maxZ: 67.5 },

  // Bridge corridor
  { minX: -3.5, maxX: 3.5, minZ: 16.5, maxZ: 26.0 },

  // Fishing Pier & Rowboat
  { minX: 13, maxX: 27, minZ: 29, maxZ: 35 },

  // Northern Mountain High Summits
  { minX: -65, maxX: 65, minZ: -84, maxZ: -65 },

  // Ancient Shrine Dais Sanctuary
  { minX: 47, maxX: 69, minZ: 47, maxZ: 69 },

  // Main North-South thoroughfare (X: -2.8 to 2.8, Z: -62 to 32)
  { minX: -2.8, maxX: 2.8, minZ: -62, maxZ: 32 },

  // Village East-West roads & plazas (Z: -13.5 to -8.0, X: -18 to 18)
  { minX: -18, maxX: 18, minZ: -13.5, maxZ: -8.0 },
  { minX: -17, maxX: 17, minZ: -4.0, maxZ: -1.0 },

  // Farm East-West road (Z: 4.0 to 8.0, X: -15 to 15)
  { minX: -15, maxX: 15, minZ: 4.0, maxZ: 8.0 },

  // Trail to Lake Pier
  { minX: 5, maxX: 18, minZ: 28, maxZ: 33 },

  // Trail to Ancient Shrine
  { minX: 15, maxX: 52, minZ: 48, maxZ: 58 },
];

export function isPositionInExclusionZone(x: number, z: number, extraBuffer = 0.5): boolean {
  for (const zone of EXCLUSION_ZONES) {
    if (
      x >= zone.minX - extraBuffer &&
      x <= zone.maxX + extraBuffer &&
      z >= zone.minZ - extraBuffer &&
      z <= zone.maxZ + extraBuffer
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Authoritative single terrain height calculation.
 * Computes exact ground surface elevation across the base diorama, bridge,
 * raised farm beds, rolling hills, forest ridges, and ancient shrine dais.
 */
export function getTerrainHeight(x: number, z: number): number {
  // 1. Clearwater River Wooden Arched Bridge Deck
  if (Math.abs(x) <= 2.4 && z >= 17.2 && z <= 25.2) {
    const normZ = (z - 21.2) / 3.8;
    const clampedNormZ = Math.min(Math.abs(normZ), 1.0);
    return 0.46 + (1 - clampedNormZ * clampedNormZ) * 0.22;
  }

  // 2. Active 4x4 Farming Field Raised Bed
  if (x >= -12.8 && x <= -6.2 && z >= 10.2 && z <= 16.8) {
    return 0.22;
  }

  // 3. Ancient Shrine Raised Dais (X: 58, Z: 58)
  const shrineDx = Math.abs(x - 58);
  const shrineDz = Math.abs(z - 58);
  if (shrineDx <= 9.0 && shrineDz <= 9.0) {
    if (shrineDx <= 2.2 && shrineDz <= 2.2) return 1.20; // Altar Pedestal
    if (shrineDx <= 6.2 && shrineDz <= 6.2) return 0.60; // Upper Dais
    return 0.30; // Lower Dais
  }

  // 4. Northern Mountain Foothills & Talus Slopes (Z: -68 to -58)
  if (z <= -58.0 && z >= -70.0 && Math.abs(x) <= 65.0) {
    const slopeFactor = THREE_MATH_CLAMP((-58.0 - z) / 12.0, 0, 1.0);
    return slopeFactor * 1.5;
  }

  // 5. Eastern Sunlit Meadow Rolling Hills
  // Hill 1: Northeast knoll (X: 32 to 64, Z: -28 to -2)
  if (x >= 32.0 && x <= 64.0 && z >= -28.0 && z <= -2.0) {
    const isPeak = x >= 42.0 && x <= 62.0 && z >= -22.0 && z <= -6.0;
    return isPeak ? 1.05 : 0.60;
  }
  // Hill 2: Southeast ridge (X: 31 to 59, Z: 2 to 22)
  if (x >= 31.0 && x <= 59.0 && z >= 2.0 && z <= 22.0) {
    return 0.70;
  }
  // Hill 3: Far East high meadow (X: 57 to 79, Z: -15 to 19)
  if (x >= 57.0 && x <= 79.0 && z >= -15.0 && z <= 19.0) {
    return 1.00;
  }

  // 6. Western Whispering Forest Elevations (X: -75 to -39, Z: -59 to -31)
  if (x >= -75.0 && x <= -39.0 && z >= -59.0 && z <= -31.0) {
    const isPeak = x >= -72.0 && x <= -52.0 && z >= -59.0 && z <= -41.0;
    return isPeak ? 1.15 : 0.70;
  }

  // Playable ground level
  return 0.0;
}

function THREE_MATH_CLAMP(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Generate deterministic nature elements for 170m world with 9 tree archetypes + vegetation
export function generateWorldNature() {
  const rng = createSeededRandom(1234567);

  const trees: TransformItem[] = [];
  const rocks: TransformItem[] = [];
  const bushes: TransformItem[] = [];
  const flowers: TransformItem[] = [];
  const grassTufts: TransformItem[] = [];
  const mushrooms: TransformItem[] = [];
  const fallenLogs: TransformItem[] = [];

  const randRange = (min: number, max: number) => min + rng() * (max - min);

  // 1. Whispering Forest (Northwest: X: -80 to 15, Z: -78 to -26)
  for (let i = 0; i < 36; i++) {
    const x = randRange(-80, 15);
    const z = randRange(-78, -26);
    if (!isPositionInExclusionZone(x, z, 1.4)) {
      const scale = randRange(0.85, 1.45);
      const r = rng();
      const type =
        r > 0.68
          ? 'tall_pine'
          : r > 0.45
          ? 'pine'
          : r > 0.28
          ? 'large_oak'
          : r > 0.14
          ? 'autumn_amber'
          : 'dead_tree';
      const y = getTerrainHeight(x, z);
      trees.push({
        id: `forest-tree-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type,
      });
    }
  }

  // 2. Mountain Foothills (Z: -68 to -56, X: -65 to 65)
  for (let i = 0; i < 12; i++) {
    const x = randRange(-65, 65);
    const z = randRange(-68, -56);
    if (!isPositionInExclusionZone(x, z, 1.3)) {
      const scale = randRange(0.75, 1.25);
      const r = rng();
      const type = r > 0.5 ? 'tall_pine' : r > 0.25 ? 'pine' : 'dead_tree';
      const y = getTerrainHeight(x, z);
      trees.push({
        id: `mountain-tree-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type,
      });
    }
  }

  // 3. Sunlit Meadow (East: X: 18 to 80, Z: -35 to 30)
  for (let i = 0; i < 20; i++) {
    const x = randRange(18, 80);
    const z = randRange(-35, 30);
    if (!isPositionInExclusionZone(x, z, 1.3)) {
      const scale = randRange(0.75, 1.3);
      const r = rng();
      const type =
        r > 0.65
          ? 'flowering_blossom'
          : r > 0.42
          ? 'fruit_tree'
          : r > 0.22
          ? 'small_oak'
          : r > 0.1
          ? 'autumn_amber'
          : 'sapling';
      const y = getTerrainHeight(x, z);
      trees.push({
        id: `meadow-tree-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type,
      });
    }
  }

  // 4. Southern Orchard & Verges (South of river: X: -80 to 12, Z: 26 to 80)
  for (let i = 0; i < 16; i++) {
    const x = randRange(-80, 12);
    const z = randRange(26, 80);
    if (!isPositionInExclusionZone(x, z, 1.3)) {
      const scale = randRange(0.8, 1.25);
      const r = rng();
      const type =
        r > 0.55
          ? 'fruit_tree'
          : r > 0.35
          ? 'flowering_blossom'
          : r > 0.18
          ? 'small_oak'
          : 'large_oak';
      const y = getTerrainHeight(x, z);
      trees.push({
        id: `orchard-tree-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type,
      });
    }
  }

  // 5. Village & Farm Perimeter Trees
  for (let i = 0; i < 8; i++) {
    const x = randRange(-28, 24);
    const z = randRange(-26, 18);
    if (!isPositionInExclusionZone(x, z, 1.4)) {
      const scale = randRange(0.75, 1.15);
      const r = rng();
      const type =
        r > 0.55
          ? 'flowering_blossom'
          : r > 0.35
          ? 'fruit_tree'
          : r > 0.18
          ? 'small_oak'
          : 'sapling';
      const y = getTerrainHeight(x, z);
      trees.push({
        id: `village-tree-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type,
      });
    }
  }

  // 6. Lake Border Groves (South & East of Lake: X: 14 to 80, Z: 68 to 80)
  for (let i = 0; i < 8; i++) {
    const x = randRange(14, 80);
    const z = randRange(68, 80);
    if (!isPositionInExclusionZone(x, z, 1.3)) {
      const scale = randRange(0.8, 1.2);
      const type = rng() > 0.5 ? 'small_oak' : rng() > 0.25 ? 'tall_pine' : 'pine';
      const y = getTerrainHeight(x, z);
      trees.push({
        id: `lake-tree-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type,
      });
    }
  }

  // 7. Weeping Willows along Clearwater River & Azure Lake Shore
  // North riverbank (X: -75 to 8, Z: 16.5)
  for (let x = -75; x <= 8; x += 14.0) {
    const rx = x + randRange(-1.2, 1.2);
    const rz = 16.5 + randRange(-0.8, 0.8);
    if (!isPositionInExclusionZone(rx, rz, 0.4)) {
      const scale = randRange(0.85, 1.25);
      const y = getTerrainHeight(rx, rz);
      trees.push({
        id: `river-willow-north-${Math.round(rx)}`,
        position: [rx, y, rz],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type: 'willow',
      });
    }
  }

  // South riverbank (X: -75 to 8, Z: 26.8)
  for (let x = -72; x <= 8; x += 14.0) {
    const rx = x + randRange(-1.2, 1.2);
    const rz = 26.8 + randRange(-0.6, 0.8);
    if (!isPositionInExclusionZone(rx, rz, 0.4)) {
      const scale = randRange(0.85, 1.25);
      const y = getTerrainHeight(rx, rz);
      trees.push({
        id: `river-willow-south-${Math.round(rx)}`,
        position: [rx, y, rz],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type: 'willow',
      });
    }
  }

  // Azure Lake Shoreline Willows (West, North, and South edges)
  const lakeShorePoints: [number, number][] = [
    [13.5, 32],
    [13.8, 55],
    [32, 21],
    [58, 21.2],
    [32, 68],
    [58, 68],
  ];
  lakeShorePoints.forEach(([lx, lz], idx) => {
    const rx = lx + randRange(-0.8, 0.8);
    const rz = lz + randRange(-0.8, 0.8);
    if (!isPositionInExclusionZone(rx, rz, 0.3)) {
      const scale = randRange(0.9, 1.3);
      const y = getTerrainHeight(rx, rz);
      trees.push({
        id: `lake-willow-${idx}`,
        position: [rx, y, rz],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
        type: 'willow',
      });
    }
  });

  // 8. Columnar Cypress lining the Arterial Highway
  for (let z = -58; z <= 28; z += 18) {
    if (z >= -24 && z <= 5) continue; // Leave village square open
    [-3.8, 3.8].forEach((sideX, sideIdx) => {
      const px = sideX + (sideX > 0 ? 0.3 : -0.3);
      const pz = z + randRange(-0.4, 0.4);
      if (!isPositionInExclusionZone(px, pz, 0.3)) {
        const scale = randRange(0.85, 1.15);
        const y = getTerrainHeight(px, pz);
        trees.push({
          id: `road-columnar-${z}-${sideIdx}`,
          position: [px, y, pz],
          rotation: [0, rng() * Math.PI * 2, 0],
          scale: [scale, scale, scale],
          type: 'columnar',
        });
      }
    });
  }

  // ==========================================
  // ROCKS & BOULDERS
  // ==========================================
  // Mountain Talus Boulders
  for (let i = 0; i < 14; i++) {
    const x = randRange(-68, 68);
    const z = randRange(-68, -54);
    if (!isPositionInExclusionZone(x, z, 0.8)) {
      const scale = randRange(0.6, 1.6);
      const y = getTerrainHeight(x, z);
      rocks.push({
        id: `mountain-rock-${i}`,
        position: [x, y, z],
        rotation: [rng() * 0.4, rng() * Math.PI * 2, rng() * 0.4],
        scale: [scale * 1.2, scale * 0.8, scale],
      });
    }
  }

  // Riverbank Rocks
  for (let i = 0; i < 8; i++) {
    const side = i % 2 === 0 ? RIVER_BOUNDS.minZ - 0.3 : RIVER_BOUNDS.maxZ + 0.3;
    const x = randRange(-80, 10);
    if (Math.abs(x) > 3.2) {
      const scale = randRange(0.4, 0.95);
      rocks.push({
        id: `river-rock-${i}`,
        position: [x, -0.15, side],
        rotation: [rng() * 0.4, rng() * Math.PI * 2, rng() * 0.4],
        scale: [scale * 1.3, scale * 0.6, scale],
      });
    }
  }

  // Lake Shore Rocks
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const rx = 44 + Math.cos(angle) * 28.5 + randRange(-1.5, 1.5);
    const rz = 43 + Math.sin(angle) * 22.5 + randRange(-1.5, 1.5);
    if (!(rx >= 13 && rx <= 27 && rz >= 28 && rz <= 36)) {
      const scale = randRange(0.4, 1.05);
      rocks.push({
        id: `lake-rock-${i}`,
        position: [rx, -0.12, rz],
        rotation: [rng() * 0.3, rng() * Math.PI * 2, rng() * 0.3],
        scale: [scale * 1.1, scale * 0.7, scale],
      });
    }
  }

  // Meadow & Forest Field Stones
  for (let i = 0; i < 12; i++) {
    const x = randRange(-78, 78);
    const z = randRange(-60, 78);
    if (!isPositionInExclusionZone(x, z, 0.8)) {
      const scale = randRange(0.4, 0.9);
      const y = getTerrainHeight(x, z);
      rocks.push({
        id: `field-rock-${i}`,
        position: [x, y, z],
        rotation: [rng() * 0.3, rng() * Math.PI * 2, rng() * 0.3],
        scale: [scale, scale * 0.6, scale],
      });
    }
  }

  // ==========================================
  // BUSHES
  // ==========================================
  for (let i = 0; i < 40; i++) {
    const x = randRange(-80, 80);
    const z = randRange(-75, 78);
    if (!isPositionInExclusionZone(x, z, 0.7)) {
      const scale = randRange(0.6, 1.15);
      const y = getTerrainHeight(x, z);
      bushes.push({
        id: `bush-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale * randRange(0.75, 1.1), scale],
      });
    }
  }

  // ==========================================
  // WILDFLOWERS
  // ==========================================
  const flowerColors = ['#ffd166', '#ff85a1', '#b388eb', '#ffffff', '#70d6ff'];
  for (let i = 0; i < 70; i++) {
    const x = randRange(-76, 76);
    const z = randRange(-55, 76);
    if (!isPositionInExclusionZone(x, z, 0.4)) {
      const color = flowerColors[Math.floor(rng() * flowerColors.length)];
      const scale = randRange(0.45, 0.85);
      const y = getTerrainHeight(x, z);
      flowers.push({
        id: `flower-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, (rng() - 0.5) * 0.2],
        scale: [scale, scale, scale],
        color,
      });
    }
  }

  // ==========================================
  // GRASS TUFTS
  // ==========================================
  for (let i = 0; i < 60; i++) {
    const x = randRange(-78, 78);
    const z = randRange(-60, 78);
    if (!isPositionInExclusionZone(x, z, 0.4)) {
      const scale = randRange(0.5, 0.95);
      const y = getTerrainHeight(x, z);
      grassTufts.push({
        id: `grass-tuft-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale * 1.2, scale],
      });
    }
  }

  // ==========================================
  // FOREST MUSHROOMS (Red Fly Agaric Toadstools)
  // ==========================================
  for (let i = 0; i < 20; i++) {
    const x = randRange(-75, 10);
    const z = randRange(-75, -28);
    if (!isPositionInExclusionZone(x, z, 0.5)) {
      const scale = randRange(0.5, 0.9);
      const y = getTerrainHeight(x, z);
      mushrooms.push({
        id: `mushroom-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
      });
    }
  }

  // ==========================================
  // FALLEN MOSSY LOGS
  // ==========================================
  for (let i = 0; i < 8; i++) {
    const x = randRange(-75, 70);
    const z = randRange(-70, 70);
    if (!isPositionInExclusionZone(x, z, 1.2)) {
      const scale = randRange(0.8, 1.25);
      const y = getTerrainHeight(x, z);
      fallenLogs.push({
        id: `log-${i}`,
        position: [x, y, z],
        rotation: [0, rng() * Math.PI * 2, 0],
        scale: [scale, scale, scale],
      });
    }
  }

  return { trees, rocks, bushes, flowers, grassTufts, mushrooms, fallenLogs };
}
