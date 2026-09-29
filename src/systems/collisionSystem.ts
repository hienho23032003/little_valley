import { VILLAGE_BUILDINGS } from '../data/buildingConfigs';
import { generateWorldNature } from '../data/worldData';
import { PlacedBuildingRef } from './buildingValidation';

// ======================================================================
// 1. COLLIDER TYPES & DATA STRUCTURES
// ======================================================================

export const PLAYER_COLLISION_RADIUS = 0.26; // 26cm radius matching character low-poly body footprint

export interface CircleCollider {
  id: string;
  type: 'circle';
  x: number;
  z: number;
  radius: number;
  label: string;
  lastQueryStamp?: number;
}

export interface AabbCollider {
  id: string;
  type: 'aabb';
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  label: string;
  lastQueryStamp?: number;
}

export interface ObbCollider {
  id: string;
  type: 'obb';
  cx: number;
  cz: number;
  halfW: number;
  halfD: number;
  rotation: number;
  label: string;
  lastQueryStamp?: number;
}

export type WorldCollider = CircleCollider | AabbCollider | ObbCollider;

export interface WorldBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

// Development-only collision debug flag
export let DEBUG_COLLISION = false;
export function setDebugCollision(enabled: boolean) {
  DEBUG_COLLISION = enabled;
}

// Cache of all static colliders for debug visualization
let allStaticCollidersCache: WorldCollider[] = [];

export function getAllStaticColliders(): WorldCollider[] {
  return allStaticCollidersCache;
}

// ======================================================================
// 2. 2D UNIFORM SPATIAL HASH GRID
// ======================================================================

const GRID_ORIGIN = -85;
const GRID_SIZE = 170;
const CELL_SIZE = 10; // 10m x 10m grid cells
const NUM_CELLS = Math.ceil(GRID_SIZE / CELL_SIZE); // 17 cells per axis (289 total)

function getCellCoord(val: number): number {
  const c = Math.floor((val - GRID_ORIGIN) / CELL_SIZE);
  return Math.max(0, Math.min(NUM_CELLS - 1, c));
}

// Static 17x17 grid populated once at startup
let staticGrid: WorldCollider[][][] | null = null;

// Dynamic 17x17 grid for player-placed buildings
let dynamicGrid: WorldCollider[][][] = Array.from({ length: NUM_CELLS }, () =>
  Array.from({ length: NUM_CELLS }, () => [])
);

let queryStamp = 1;

function insertColliderIntoGrid(collider: WorldCollider, grid: WorldCollider[][][]) {
  let minX: number;
  let maxX: number;
  let minZ: number;
  let maxZ: number;

  if (collider.type === 'circle') {
    minX = collider.x - collider.radius;
    maxX = collider.x + collider.radius;
    minZ = collider.z - collider.radius;
    maxZ = collider.z + collider.radius;
  } else if (collider.type === 'aabb') {
    minX = collider.minX;
    maxX = collider.maxX;
    minZ = collider.minZ;
    maxZ = collider.maxZ;
  } else {
    // OBB: calculate bounding envelope
    const cos = Math.abs(Math.cos(collider.rotation));
    const sin = Math.abs(Math.sin(collider.rotation));
    const effW = cos * collider.halfW + sin * collider.halfD;
    const effD = sin * collider.halfW + cos * collider.halfD;
    minX = collider.cx - effW;
    maxX = collider.cx + effW;
    minZ = collider.cz - effD;
    maxZ = collider.cz + effD;
  }

  const startX = getCellCoord(minX);
  const endX = getCellCoord(maxX);
  const startZ = getCellCoord(minZ);
  const endZ = getCellCoord(maxZ);

  for (let ix = startX; ix <= endX; ix++) {
    for (let iz = startZ; iz <= endZ; iz++) {
      grid[ix][iz].push(collider);
    }
  }
}

// ======================================================================
// 3. WATER BODY COLLISION (CLEARWATER RIVER & AZURE LAKE)
// Accurately blocks deep water while keeping Bridge, Pier, and Shrine walkable
// ======================================================================

export function isWaterBlocked(px: number, pz: number, radius = PLAYER_COLLISION_RADIUS): boolean {
  // A. Clearwater River channel (Z: 19.1 to 23.4)
  if (pz >= 19.1 - radius && pz <= 23.4 + radius) {
    // Wooden arched bridge at X in [-2.4, 2.4] is open for crossing!
    if (px < -2.4 + radius) return true; // River west of bridge
    if (px > 2.4 - radius && px < 15.0 + radius) return true; // River east of bridge
  }

  // B. Azure Lake deep basin
  if (px >= 15.0 - radius && px <= 72.5 + radius && pz >= 20.0 - radius && pz <= 65.5 + radius) {
    // 1. Fishing Pier wooden dock (X: 14.5 to 24.2, Z: 30.6 to 33.4) is 100% walkable!
    if (px >= 14.5 && px <= 24.2 && pz >= 30.6 && pz <= 33.4) {
      return false;
    }
    // 2. Sacred Ancient Shrine Islet (X: 49.0 to 67.0, Z: 49.0 to 67.0) is 100% walkable!
    if (px >= 49.0 && px <= 67.0 && pz >= 49.0 && pz <= 67.0) {
      return false;
    }
    return true; // Deep water!
  }

  return false;
}

// ======================================================================
// 4. STATIC WORLD COLLIDERS GENERATION (CALLED ONCE)
// ======================================================================

function buildStaticWorldColliders(): WorldCollider[] {
  const colliders: WorldCollider[] = [];

  // ----------------------------------------------------
  // A. PREDEFINED VILLAGE & WORLD BUILDINGS
  // ----------------------------------------------------
  for (const b of VILLAGE_BUILDINGS) {
    const scaleX = b.scale?.[0] ?? 1.0;
    const scaleZ = b.scale?.[2] ?? 1.0;
    // Inset half-dimensions by 15cm so character's physical body can closely touch the visual wall
    const halfW = Math.max(0.5, (b.width * scaleX) / 2 - 0.15);
    const halfD = Math.max(0.5, (b.depth * scaleZ) / 2 - 0.15);

    if (Math.abs(b.rotation) < 0.01) {
      colliders.push({
        id: `static-bldg-${b.id}`,
        type: 'aabb',
        minX: b.position[0] - halfW,
        maxX: b.position[0] + halfW,
        minZ: b.position[2] - halfD,
        maxZ: b.position[2] + halfD,
        label: b.name,
      });
    } else {
      colliders.push({
        id: `static-bldg-${b.id}`,
        type: 'obb',
        cx: b.position[0],
        cz: b.position[2],
        halfW,
        halfD,
        rotation: b.rotation,
        label: b.name,
      });
    }
  }

  // ----------------------------------------------------
  // B. FARMSTEAD ANIMAL STRUCTURES & SHELTERS
  // ----------------------------------------------------
  // 1. Chicken Coop House (position: [-16.1, 0, 4.7])
  colliders.push({
    id: 'chicken-coop-house',
    type: 'aabb',
    minX: -16.1 - 0.75,
    maxX: -16.1 + 0.75,
    minZ: 4.7 - 0.65,
    maxZ: 4.7 + 0.65,
    label: 'Chicken Coop House',
  });

  // 2. Red Barn Structure (position: [10.4, 0, 7.3])
  colliders.push({
    id: 'red-barn-structure',
    type: 'aabb',
    minX: 10.4 - 1.7,
    maxX: 10.4 + 1.7,
    minZ: 7.3 - 1.4,
    maxZ: 7.3 + 1.4,
    label: 'Red Cattle Barn',
  });

  // 3. Sheep Pen Shelter (position: [10.4, 0, 15.2])
  colliders.push({
    id: 'sheep-pen-shelter',
    type: 'aabb',
    minX: 10.4 - 1.3,
    maxX: 10.4 + 1.3,
    minZ: 15.2 - 0.9,
    maxZ: 15.2 + 0.9,
    label: 'Sheep Pen Shelter',
  });

  // ----------------------------------------------------
  // C. WOODEN FENCES (AXIS-ALIGNED LINE SEGMENTS)
  // ----------------------------------------------------
  const FENCE_THICKNESS = 0.24;
  const HALF_FT = FENCE_THICKNESS / 2;

  const addFenceAabb = (id: string, x1: number, z1: number, x2: number, z2: number, label: string) => {
    const minX = Math.min(x1, x2) - HALF_FT;
    const maxX = Math.max(x1, x2) + HALF_FT;
    const minZ = Math.min(z1, z2) - HALF_FT;
    const maxZ = Math.max(z1, z2) + HALF_FT;
    colliders.push({
      id,
      type: 'aabb',
      minX,
      maxX,
      minZ,
      maxZ,
      label,
    });
  };

  // Right field fences (Cow & Sheep Pastures)
  addFenceAabb('fence-right-north', 4.5, 5.5, 13.5, 5.5, 'Pasture North Fence');
  addFenceAabb('fence-right-east', 13.5, 5.5, 13.5, 16.5, 'Pasture East Fence');
  addFenceAabb('fence-right-south', 13.5, 16.5, 4.5, 16.5, 'Pasture South Fence');
  addFenceAabb('fence-right-west-top', 4.5, 16.5, 4.5, 10.5, 'Pasture West Upper Fence');
  // Gate opening is between Z=7.5 and Z=10.5!
  addFenceAabb('fence-right-west-bottom', 4.5, 7.5, 4.5, 5.5, 'Pasture West Lower Fence');
  // Divider fence between Cow Pasture and Sheep Pen
  addFenceAabb('fence-pasture-divider', 5.5, 11.1, 12.5, 11.1, 'Pasture Divider Fence');

  // Chicken Coop Fenced Run (enclosure from X: -17.2 to -13.2, Z: 3.5 to 7.5)
  addFenceAabb('fence-chicken-north', -17.2, 3.5, -13.2, 3.5, 'Chicken Run North Fence');
  addFenceAabb('fence-chicken-west', -17.2, 3.5, -17.2, 7.5, 'Chicken Run West Fence');
  addFenceAabb('fence-chicken-east', -13.2, 3.5, -13.2, 7.5, 'Chicken Run East Fence');
  // South fence has a 1.4m gate opening from X: -15.2 to -13.8 so player can enter
  addFenceAabb('fence-chicken-south-w', -17.2, 7.5, -15.2, 7.5, 'Chicken Run South West Fence');
  addFenceAabb('fence-chicken-south-e', -13.8, 7.5, -13.2, 7.5, 'Chicken Run South East Fence');

  // ----------------------------------------------------
  // D. VILLAGE PROPS & SANCTUARY OBJECTS
  // ----------------------------------------------------
  // Village Centerpiece Well (radius 0.95m)
  colliders.push({
    id: 'village-well',
    type: 'circle',
    x: 0,
    z: -10,
    radius: 0.95,
    label: 'Village Cobblestone Well',
  });

  // Village Benches
  colliders.push({
    id: 'village-bench-left',
    type: 'aabb',
    minX: -4.1,
    maxX: -3.5,
    minZ: -10.6,
    maxZ: -9.4,
    label: 'Village Plaza Bench Left',
  });
  colliders.push({
    id: 'village-bench-right',
    type: 'aabb',
    minX: 3.5,
    maxX: 4.1,
    minZ: -10.6,
    maxZ: -9.4,
    label: 'Village Plaza Bench Right',
  });

  // Farm Props (Water Trough & Stacked Hay Bales)
  colliders.push({
    id: 'farm-water-trough',
    type: 'aabb',
    minX: -6.4,
    maxX: -5.6,
    minZ: 6.2,
    maxZ: 6.8,
    label: 'Farm Water Trough',
  });
  colliders.push({
    id: 'farm-hay-bales',
    type: 'aabb',
    minX: 3.2,
    maxX: 4.0,
    minZ: 5.8,
    maxZ: 7.0,
    label: 'Stacked Hay Bales',
  });

  // Ancient Shrine Altar Pedestal (center X: 58, Z: 58)
  colliders.push({
    id: 'ancient-shrine-altar',
    type: 'aabb',
    minX: 56.5,
    maxX: 59.5,
    minZ: 56.5,
    maxZ: 59.5,
    label: 'Ancient Shrine Altar Pedestal',
  });

  // ----------------------------------------------------
  // E. NATURE OBJECTS: TREE TRUNKS & LARGE BOULDERS
  // ----------------------------------------------------
  const nature = generateWorldNature();

  // 1. Tree Trunks (trunk ONLY, clamped between 0.15m and 0.26m)
  for (const tree of nature.trees) {
    const scale = tree.scale[0];
    const trunkRadius = Math.max(0.15, Math.min(0.26, 0.20 * scale));

    colliders.push({
      id: `tree-trunk-${tree.id}`,
      type: 'circle',
      x: tree.position[0],
      z: tree.position[2],
      radius: trunkRadius,
      label: `Tree Trunk (${tree.type})`,
    });
  }

  // 2. Large Mountain Boulders ONLY (scale >= 1.0)
  for (const rock of nature.rocks) {
    if (rock.id.startsWith('mountain-rock') && rock.scale[0] >= 1.0) {
      const rockRadius = Math.min(0.55, 0.30 * rock.scale[0]);
      colliders.push({
        id: `rock-${rock.id}`,
        type: 'circle',
        x: rock.position[0],
        z: rock.position[2],
        radius: rockRadius,
        label: 'Large Mountain Boulder',
      });
    }
  }

  allStaticCollidersCache = colliders;
  return colliders;
}

export function initStaticColliders(): WorldCollider[][][] {
  if (staticGrid) return staticGrid;

  staticGrid = Array.from({ length: NUM_CELLS }, () =>
    Array.from({ length: NUM_CELLS }, () => [])
  );

  const staticColliders = buildStaticWorldColliders();
  for (const c of staticColliders) {
    insertColliderIntoGrid(c, staticGrid);
  }

  return staticGrid;
}

// Ensure static colliders are ready at module load
initStaticColliders();

// Throttled debug logger
let lastDebugLogTime = 0;
function logDebugBlocked(px: number, pz: number, id: string, label: string) {
  if (!DEBUG_COLLISION) return;
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  if (now - lastDebugLogTime > 600) {
    lastDebugLogTime = now;
    console.log(`[COLLISION BLOCKED] Player at (${px.toFixed(2)}, ${pz.toFixed(2)}) blocked by: ${id} [${label}]`);
  }
}

// ======================================================================
// 5. DYNAMIC BUILDING PLACEMENT SYNCHRONIZATION
// ======================================================================

export function syncPlacedBuildings(placedBuildings: PlacedBuildingRef[]): void {
  // Reset dynamic grid
  for (let ix = 0; ix < NUM_CELLS; ix++) {
    for (let iz = 0; iz < NUM_CELLS; iz++) {
      dynamicGrid[ix][iz].length = 0;
    }
  }

  for (const b of placedBuildings) {
    const halfW = b.size[0] / 2;
    const halfD = b.size[1] / 2;

    const collider: WorldCollider =
      Math.abs(b.rotation) < 0.01
        ? {
            id: `placed-${b.id}`,
            type: 'aabb',
            minX: b.position[0] - halfW,
            maxX: b.position[0] + halfW,
            minZ: b.position[2] - halfD,
            maxZ: b.position[2] + halfD,
            label: 'Player Building',
          }
        : {
            id: `placed-${b.id}`,
            type: 'obb',
            cx: b.position[0],
            cz: b.position[2],
            halfW,
            halfD,
            rotation: b.rotation,
            label: 'Player Building',
          };

    insertColliderIntoGrid(collider, dynamicGrid);
  }
}

// ======================================================================
// 6. HIGH-SPEED ZERO-ALLOCATION COLLISION QUERY
// ======================================================================

function isCircleIntersecting(
  px: number,
  pz: number,
  pRadius: number,
  collider: WorldCollider
): boolean {
  if (collider.type === 'circle') {
    const dx = px - collider.x;
    const dz = pz - collider.z;
    const minD = pRadius + collider.radius;
    return dx * dx + dz * dz < minD * minD;
  }

  if (collider.type === 'aabb') {
    const closeX = Math.max(collider.minX, Math.min(collider.maxX, px));
    const closeZ = Math.max(collider.minZ, Math.min(collider.maxZ, pz));
    const dx = px - closeX;
    const dz = pz - closeZ;
    return dx * dx + dz * dz < pRadius * pRadius;
  }

  // OBB: transform query point into building's local unrotated space
  const cos = Math.cos(-collider.rotation);
  const sin = Math.sin(-collider.rotation);
  const relX = px - collider.cx;
  const relZ = pz - collider.cz;
  const localX = cos * relX - sin * relZ;
  const localZ = sin * relX + cos * relZ;

  const closeX = Math.max(-collider.halfW, Math.min(collider.halfW, localX));
  const closeZ = Math.max(-collider.halfD, Math.min(collider.halfD, localZ));
  const dx = localX - closeX;
  const dz = localZ - closeZ;
  return dx * dx + dz * dz < pRadius * pRadius;
}

export function isCollidingAt(px: number, pz: number, radius = PLAYER_COLLISION_RADIUS): boolean {
  // 1. Water bodies check (Clearwater River & Azure Lake deep basin)
  if (isWaterBlocked(px, pz, radius)) {
    logDebugBlocked(px, pz, 'water-body', 'Clearwater River / Azure Lake');
    return true;
  }

  const grid = staticGrid || initStaticColliders();

  queryStamp = (queryStamp + 1) | 0;
  if (queryStamp > 1000000000) queryStamp = 1;

  const startX = getCellCoord(px - radius);
  const endX = getCellCoord(px + radius);
  const startZ = getCellCoord(pz - radius);
  const endZ = getCellCoord(pz + radius);

  // 2. Check static obstacles
  for (let ix = startX; ix <= endX; ix++) {
    for (let iz = startZ; iz <= endZ; iz++) {
      const cell = grid[ix][iz];
      for (let i = 0; i < cell.length; i++) {
        const c = cell[i];
        if (c.lastQueryStamp === queryStamp) continue;
        c.lastQueryStamp = queryStamp;

        if (isCircleIntersecting(px, pz, radius, c)) {
          logDebugBlocked(px, pz, c.id, c.label);
          return true;
        }
      }
    }
  }

  // 3. Check dynamic placed buildings
  for (let ix = startX; ix <= endX; ix++) {
    for (let iz = startZ; iz <= endZ; iz++) {
      const cell = dynamicGrid[ix][iz];
      for (let i = 0; i < cell.length; i++) {
        const c = cell[i];
        if (c.lastQueryStamp === queryStamp) continue;
        c.lastQueryStamp = queryStamp;

        if (isCircleIntersecting(px, pz, radius, c)) {
          logDebugBlocked(px, pz, c.id, c.label);
          return true;
        }
      }
    }
  }

  return false;
}

// ======================================================================
// 6. SLIDING MOVEMENT RESOLUTION (AXIS-SEPARATED COLLISION)
// ======================================================================

function clampVal(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Pre-allocated return object to prevent 60 FPS garbage generation
const movementResult = { x: 0, z: 0 };

function resolveSingleStep(
  currX: number,
  currZ: number,
  deltaX: number,
  deltaZ: number,
  bounds: WorldBounds,
  radius: number
): { x: number; z: number } {
  const targetX = clampVal(currX + deltaX, bounds.minX, bounds.maxX);
  const targetZ = clampVal(currZ + deltaZ, bounds.minZ, bounds.maxZ);

  // STEP 1: Attempt full diagonal movement
  if (!isCollidingAt(targetX, targetZ, radius)) {
    movementResult.x = targetX;
    movementResult.z = targetZ;
    return movementResult;
  }

  // STEP 2: Full diagonal hit an obstacle. Try sliding along free axes!
  // Test X-only movement with current Z
  const canMoveX = targetX !== currX && !isCollidingAt(targetX, currZ, radius);

  // Test Z-only movement with current X
  const canMoveZ = targetZ !== currZ && !isCollidingAt(currX, targetZ, radius);

  if (canMoveX && canMoveZ) {
    // Both axes are free individually (e.g. hitting an acute corner).
    // Prioritize the axis with the larger movement delta for smooth intuitive feel.
    if (Math.abs(deltaX) >= Math.abs(deltaZ)) {
      movementResult.x = targetX;
      movementResult.z = currZ;
    } else {
      movementResult.x = currX;
      movementResult.z = targetZ;
    }
  } else if (canMoveX) {
    // Sliding along Z-obstacle (e.g. North/South wall or tree side)
    movementResult.x = targetX;
    movementResult.z = currZ;
  } else if (canMoveZ) {
    // Sliding along X-obstacle (e.g. East/West wall or fence)
    movementResult.x = currX;
    movementResult.z = targetZ;
  } else {
    // Both axes blocked (e.g. flush against wall or trapped in corner)
    movementResult.x = currX;
    movementResult.z = currZ;
  }

  return movementResult;
}

export function resolveMovement(
  currX: number,
  currZ: number,
  deltaX: number,
  deltaZ: number,
  bounds: WorldBounds,
  radius = PLAYER_COLLISION_RADIUS
): { x: number; z: number } {
  // If zero movement desired, remain at current location
  if (Math.abs(deltaX) < 1e-6 && Math.abs(deltaZ) < 1e-6) {
    movementResult.x = currX;
    movementResult.z = currZ;
    return movementResult;
  }

  const distSq = deltaX * deltaX + deltaZ * deltaZ;
  const maxStep = radius * 0.7; // ~0.245m max step per sub-iteration
  if (distSq > maxStep * maxStep) {
    const dist = Math.sqrt(distSq);
    const steps = Math.min(8, Math.ceil(dist / maxStep));
    const stepDx = deltaX / steps;
    const stepDz = deltaZ / steps;

    let posX = currX;
    let posZ = currZ;

    for (let s = 0; s < steps; s++) {
      const prevX = posX;
      const prevZ = posZ;
      const res = resolveSingleStep(posX, posZ, stepDx, stepDz, bounds, radius);
      posX = res.x;
      posZ = res.z;
      // If stopped on both axes, cannot advance further
      if (Math.abs(posX - prevX) < 1e-6 && Math.abs(posZ - prevZ) < 1e-6) {
        break;
      }
    }

    movementResult.x = posX;
    movementResult.z = posZ;
    return movementResult;
  }

  return resolveSingleStep(currX, currZ, deltaX, deltaZ, bounds, radius);
}
