import { PALETTE } from '../utils/colors';

export type RoofStyle =
  | 'gable'
  | 'extended_gable'
  | 'gambrel'
  | 'hip'
  | 'thatched'
  | 'shed_sloped'
  | 'tower_bell';

export type WallStyle =
  | 'timber_frame_plaster'
  | 'clapboard_white'
  | 'clapboard_cream'
  | 'clapboard_yellow'
  | 'red_barn'
  | 'dark_timber'
  | 'fieldstone'
  | 'weathered_wood'
  | 'blacksmith_stone';

export type DoorStyle =
  | 'single_timber'
  | 'double_barn'
  | 'shop_transom'
  | 'arched_stone'
  | 'rustic_plank';

export type WindowStyle =
  | 'cross_mullion'
  | 'small_square'
  | 'shutters'
  | 'dormer_attic'
  | 'arched_glass';

export type SignType =
  | 'none'
  | 'town_hall'
  | 'general_store'
  | 'blacksmith'
  | 'bakery'
  | 'herbalist'
  | 'tavern'
  | 'farm'
  | 'workshop'
  | 'cottage';

export interface WindowPlacement {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  hasFlowerBox?: boolean;
  hasShutters?: boolean;
  style?: WindowStyle;
}

export interface BuildingDecorationConfig {
  hasBarrels?: boolean;
  barrelPositions?: [number, number, number][];
  hasCrates?: boolean;
  cratePositions?: [number, number, number][];
  hasFirewood?: boolean;
  firewoodPosition?: [number, number, number];
  hasHayBales?: boolean;
  hayPositions?: [number, number, number][];
  hasBenches?: boolean;
  benchPositions?: { position: [number, number, number]; rotation?: number }[];
  hasLanterns?: boolean;
  lanternPositions?: [number, number, number][];
  hasFlowerPots?: boolean;
  flowerPotPositions?: [number, number, number][];
  hasAwning?: boolean;
  awningColor?: string;
  hasWeathervane?: boolean;
  hasBelfry?: boolean;
}

export interface ModularBuildingConfig {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  rotation: number;
  scale?: [number, number, number];

  // Base Dimensions
  width: number;
  depth: number;
  height: number;

  // Foundation
  foundationHeight?: number;
  foundationColor?: string;

  // Walls
  wallStyle: WallStyle;
  wallColor: string;
  timberColor?: string;

  // Roof
  roofStyle: RoofStyle;
  roofHeight: number;
  roofColor: string;
  roofOverhang?: number;
  ridgeColor?: string;

  // Door
  doorStyle: DoorStyle;
  doorPosition?: [number, number, number];
  doorColor?: string;

  // Windows
  windows: WindowPlacement[];

  // Chimney
  hasChimney?: boolean;
  chimneyPosition?: [number, number, number];
  chimneyHeight?: number;
  chimneyMaterial?: 'brick' | 'stone';

  // Porch
  hasPorch?: boolean;
  porchConfig?: {
    width: number;
    depth: number;
    hasAwning?: boolean;
    awningColor?: string;
    hasRailings?: boolean;
  };

  // Sign & Awning
  signType?: SignType;

  // Decorations & Props
  decorations?: BuildingDecorationConfig;
}

// -------------------------------------------------------------
// PREDEFINED VILLAGE & WORLD BUILDINGS CONFIGURATION
// -------------------------------------------------------------

export const VILLAGE_BUILDINGS: ModularBuildingConfig[] = [
  // 1. TOWN HALL / CIVIC CENTERPIECE (North of Grand Village Square)
  {
    id: 'bldg-town-hall',
    name: 'Town Hall',
    type: 'town_hall',
    position: [0, 0, -22],
    rotation: 0,
    width: 6.8,
    depth: 5.2,
    height: 3.4,
    foundationHeight: 0.5,
    foundationColor: PALETTE.rockDark,
    wallStyle: 'timber_frame_plaster',
    wallColor: '#fbfbf2',
    timberColor: '#2b2d42',
    roofStyle: 'tower_bell',
    roofHeight: 2.4,
    roofColor: '#d96b43', // Majestic Terracotta
    roofOverhang: 0.45,
    ridgeColor: '#2b2d42',
    doorStyle: 'shop_transom',
    doorPosition: [0, 0.5, 2.61],
    doorColor: '#4a2810',
    hasChimney: true,
    chimneyPosition: [2.2, 0, -1.2],
    chimneyHeight: 2.2,
    chimneyMaterial: 'brick',
    hasPorch: true,
    porchConfig: {
      width: 3.6,
      depth: 1.4,
      hasAwning: true,
      hasRailings: true,
    },
    signType: 'town_hall',
    windows: [
      { position: [-2.2, 1.8, 2.61], style: 'shutters', hasFlowerBox: true },
      { position: [2.2, 1.8, 2.61], style: 'shutters', hasFlowerBox: true },
      { position: [-3.41, 1.8, 0], rotation: [0, -Math.PI / 2, 0], style: 'cross_mullion' },
      { position: [3.41, 1.8, 0], rotation: [0, Math.PI / 2, 0], style: 'cross_mullion' },
    ],
    decorations: {
      hasBelfry: true,
      hasLanterns: true,
      lanternPositions: [
        [-1.6, 2.2, 3.2],
        [1.6, 2.2, 3.2],
      ],
      hasFlowerPots: true,
      flowerPotPositions: [
        [-1.9, 0.5, 3.1],
        [1.9, 0.5, 3.1],
      ],
      hasBenches: true,
      benchPositions: [
        { position: [-4.2, 0, 1.0], rotation: Math.PI / 2 },
        { position: [4.2, 0, 1.0], rotation: -Math.PI / 2 },
      ],
    },
  },

  // 2. VILLAGE GENERAL STORE (East of Village Square)
  {
    id: 'bldg-general-store',
    name: 'Valley Provisions & Market',
    type: 'general_store',
    position: [14.5, 0, -12.0],
    rotation: -0.22,
    width: 5.2,
    depth: 4.4,
    height: 2.6,
    foundationHeight: 0.35,
    wallStyle: 'clapboard_cream',
    wallColor: '#f7edd0',
    timberColor: '#583101',
    roofStyle: 'extended_gable',
    roofHeight: 1.8,
    roofColor: '#495867', // Slate Navy
    roofOverhang: 0.4,
    doorStyle: 'shop_transom',
    doorPosition: [-0.6, 0.35, 2.21],
    doorColor: '#6f1d1b',
    hasChimney: true,
    chimneyPosition: [1.6, 0, -0.9],
    chimneyHeight: 1.9,
    chimneyMaterial: 'brick',
    hasPorch: true,
    porchConfig: {
      width: 4.8,
      depth: 1.5,
      hasAwning: true,
      awningColor: '#588157',
      hasRailings: false,
    },
    signType: 'general_store',
    windows: [
      { position: [1.3, 1.5, 2.21], size: 0.9, style: 'arched_glass' },
      { position: [-2.61, 1.5, 0], rotation: [0, -Math.PI / 2, 0], style: 'cross_mullion' },
    ],
    decorations: {
      hasBarrels: true,
      barrelPositions: [
        [-2.0, 0, 2.9],
        [-2.5, 0, 2.4],
      ],
      hasCrates: true,
      cratePositions: [
        [1.8, 0, 2.8],
        [2.3, 0, 2.3],
      ],
      hasLanterns: true,
      lanternPositions: [[-0.6, 2.4, 2.9]],
    },
  },

  // 3. VILLAGE BLACKSMITH (West of Village Square)
  {
    id: 'bldg-blacksmith',
    name: 'Ironstone Forge & Smithy',
    type: 'blacksmith',
    position: [-14.5, 0, -12.0],
    rotation: 0.22,
    width: 5.4,
    depth: 4.6,
    height: 2.6,
    foundationHeight: 0.4,
    foundationColor: '#3a3d40',
    wallStyle: 'blacksmith_stone',
    wallColor: '#6c757d',
    timberColor: '#2b2d42',
    roofStyle: 'shed_sloped',
    roofHeight: 1.9,
    roofColor: '#212529', // Charcoal iron slate
    roofOverhang: 0.4,
    doorStyle: 'double_barn',
    doorPosition: [0.8, 0.4, 2.31],
    doorColor: '#495057',
    hasChimney: true,
    chimneyPosition: [-1.8, 0, 0.4],
    chimneyHeight: 2.6,
    chimneyMaterial: 'stone',
    hasPorch: true,
    porchConfig: {
      width: 3.2,
      depth: 1.6,
      hasAwning: true,
      awningColor: '#495057',
      hasRailings: false,
    },
    signType: 'blacksmith',
    windows: [
      { position: [-1.4, 1.5, 2.31], style: 'small_square' },
      { position: [2.71, 1.5, 0], rotation: [0, Math.PI / 2, 0], style: 'cross_mullion' },
    ],
    decorations: {
      hasBarrels: true,
      barrelPositions: [[-2.3, 0, 2.8]],
      hasFirewood: true,
      firewoodPosition: [2.5, 0, -1.8],
      hasLanterns: true,
      lanternPositions: [[0.8, 2.2, 3.0]],
    },
  },

  // 4. ARTISAN WORKSHOP (West Village Lane)
  {
    id: 'bldg-artisan-workshop',
    name: 'Artisan Craft Workshop',
    type: 'workshop',
    position: [-15.0, 0, -2.5],
    rotation: 0.15,
    width: 5.0,
    depth: 4.2,
    height: 2.5,
    foundationHeight: 0.35,
    wallStyle: 'dark_timber',
    wallColor: '#5c4033',
    timberColor: '#3d2616',
    roofStyle: 'gable',
    roofHeight: 1.8,
    roofColor: '#b56576', // Rosewood slate
    roofOverhang: 0.35,
    doorStyle: 'rustic_plank',
    doorPosition: [0, 0.35, 2.11],
    doorColor: '#43281c',
    hasChimney: true,
    chimneyPosition: [-1.4, 0, -0.7],
    chimneyHeight: 2.2,
    chimneyMaterial: 'brick',
    hasPorch: true,
    porchConfig: {
      width: 2.8,
      depth: 1.2,
      hasAwning: true,
      hasRailings: false,
    },
    signType: 'workshop',
    windows: [
      { position: [-1.3, 1.4, 2.11], style: 'cross_mullion' },
      { position: [1.3, 1.4, 2.11], style: 'cross_mullion' },
      { position: [2.51, 1.4, 0], rotation: [0, Math.PI / 2, 0], style: 'small_square' },
    ],
    decorations: {
      hasBarrels: true,
      barrelPositions: [[1.8, 0, 2.3]],
      hasCrates: true,
      cratePositions: [[-1.9, 0, 2.4]],
      hasFirewood: true,
      firewoodPosition: [2.5, 0, -1.6],
      hasLanterns: true,
      lanternPositions: [[0, 2.2, 2.6]],
    },
  },

  // 5. COZY VILLAGE COTTAGE (East Village Lane)
  {
    id: 'bldg-cozy-cottage',
    name: 'Rosewood Thatched Cottage',
    type: 'cottage',
    position: [15.0, 0, -2.5],
    rotation: -0.15,
    width: 4.8,
    depth: 4.0,
    height: 2.4,
    foundationHeight: 0.3,
    wallStyle: 'timber_frame_plaster',
    wallColor: '#fae1dd',
    timberColor: '#4a3b32',
    roofStyle: 'thatched',
    roofHeight: 1.9,
    roofColor: '#4a827e', // Teal moss thatched
    roofOverhang: 0.45,
    doorStyle: 'single_timber',
    doorPosition: [0, 0.3, 2.01],
    doorColor: '#588157',
    hasChimney: true,
    chimneyPosition: [1.3, 0, -0.6],
    chimneyHeight: 2.0,
    chimneyMaterial: 'stone',
    hasPorch: true,
    porchConfig: {
      width: 2.4,
      depth: 1.1,
      hasAwning: true,
      hasRailings: true,
    },
    signType: 'cottage',
    windows: [
      { position: [-1.2, 1.3, 2.01], style: 'shutters', hasFlowerBox: true },
      { position: [1.2, 1.3, 2.01], style: 'shutters', hasFlowerBox: true },
      { position: [2.41, 1.3, 0], rotation: [0, Math.PI / 2, 0], style: 'cross_mullion' },
    ],
    decorations: {
      hasFlowerPots: true,
      flowerPotPositions: [
        [-1.6, 0, 2.3],
        [1.6, 0, 2.3],
      ],
      hasBenches: true,
      benchPositions: [{ position: [2.8, 0, 1.0], rotation: -Math.PI / 2 }],
      hasLanterns: true,
      lanternPositions: [[0, 2.2, 2.5]],
    },
  },

  // 6. MAIN FARMER'S HOMESTEAD (West of Farm Thoroughfare)
  {
    id: 'bldg-farmer-homestead',
    name: 'Valley Homestead',
    type: 'farmhouse',
    position: [-8.5, 0, 4.5],
    rotation: 0.08,
    scale: [1.05, 1.05, 1.05],
    width: 5.6,
    depth: 4.6,
    height: 2.7,
    foundationHeight: 0.4,
    wallStyle: 'clapboard_white',
    wallColor: '#fdfbf7',
    timberColor: '#6f4e37',
    roofStyle: 'extended_gable',
    roofHeight: 2.0,
    roofColor: '#d96b43', // Classic terracotta
    roofOverhang: 0.4,
    doorStyle: 'single_timber',
    doorPosition: [0, 0.4, 2.31],
    doorColor: '#5c3a21',
    hasChimney: true,
    chimneyPosition: [1.8, 0, -0.8],
    chimneyHeight: 2.4,
    chimneyMaterial: 'brick',
    hasPorch: true,
    porchConfig: {
      width: 5.2,
      depth: 1.5,
      hasAwning: true,
      hasRailings: true,
    },
    signType: 'farm',
    windows: [
      { position: [-1.6, 1.5, 2.31], style: 'shutters', hasFlowerBox: true },
      { position: [1.6, 1.5, 2.31], style: 'shutters', hasFlowerBox: true },
      { position: [0, 3.2, 2.31], size: 0.6, style: 'dormer_attic' },
    ],
    decorations: {
      hasBenches: true,
      benchPositions: [{ position: [-1.8, 0.4, 3.0], rotation: 0 }],
      hasFirewood: true,
      firewoodPosition: [-3.2, 0, -1.2],
      hasLanterns: true,
      lanternPositions: [[0, 2.3, 3.0]],
      hasFlowerPots: true,
      flowerPotPositions: [
        [2.0, 0.4, 3.0],
        [2.3, 0.4, 2.5],
      ],
    },
  },

  // 7. RUSTIC RED BARN (West Farm Pasture & Livestock Verges)
  {
    id: 'bldg-rustic-barn',
    name: 'Valley Red Barn',
    type: 'barn',
    position: [-21.0, 0, 13.5],
    rotation: Math.PI / 2,
    width: 6.2,
    depth: 4.8,
    height: 3.2,
    foundationHeight: 0.35,
    wallStyle: 'red_barn',
    wallColor: '#9d0208', // Classic rustic crimson barn
    timberColor: '#f8f9fa', // White trim crossbeams
    roofStyle: 'gambrel',
    roofHeight: 2.4,
    roofColor: '#343a40', // Dark tin/shingle
    roofOverhang: 0.35,
    doorStyle: 'double_barn',
    doorPosition: [0, 0.35, 2.41],
    doorColor: '#f8f9fa',
    hasChimney: false,
    hasPorch: false,
    windows: [
      { position: [0, 3.4, 2.41], size: 0.8, style: 'dormer_attic' },
      { position: [-3.11, 2.0, 0], rotation: [0, -Math.PI / 2, 0], style: 'small_square' },
      { position: [3.11, 2.0, 0], rotation: [0, Math.PI / 2, 0], style: 'small_square' },
    ],
    decorations: {
      hasWeathervane: true,
      hasHayBales: true,
      hayPositions: [
        [-2.5, 0, 3.1],
        [-2.0, 0, 3.3],
        [-2.2, 0.6, 3.2],
      ],
      hasBarrels: true,
      barrelPositions: [[2.4, 0, 3.0]],
    },
  },

  // 8. FARM SUPPLY & TOOL SHED (Adjacent to Crops Field Corner)
  {
    id: 'bldg-tool-shed',
    name: 'Farm Tool Shed',
    type: 'tool_shed',
    position: [-15.5, 0, 11.5],
    rotation: -0.15,
    width: 3.4,
    depth: 2.8,
    height: 2.2,
    foundationHeight: 0.25,
    wallStyle: 'weathered_wood',
    wallColor: '#7f5539',
    timberColor: '#43281c',
    roofStyle: 'shed_sloped',
    roofHeight: 1.2,
    roofColor: '#6c584c',
    roofOverhang: 0.3,
    doorStyle: 'rustic_plank',
    doorPosition: [0, 0.25, 1.41],
    doorColor: '#582f0e',
    hasChimney: false,
    hasPorch: false,
    windows: [{ position: [1.71, 1.2, 0], rotation: [0, Math.PI / 2, 0], style: 'small_square' }],
    decorations: {
      hasBarrels: true,
      barrelPositions: [[-1.4, 0, 1.8]],
      hasCrates: true,
      cratePositions: [[1.3, 0, 1.8]],
    },
  },

  // 9. LAKESIDE FISHERMAN'S SHACK & BOATHOUSE (Azure Lake Pier)
  {
    id: 'bldg-lakeside-shack',
    name: "Fisherman's Boathouse",
    type: 'lakeside_shack',
    position: [16.5, 0, 28.5],
    rotation: -0.3,
    width: 4.4,
    depth: 3.6,
    height: 2.3,
    foundationHeight: 0.5,
    foundationColor: '#4a5568',
    wallStyle: 'weathered_wood',
    wallColor: '#8a9a86', // Weathered seafoam teal
    timberColor: '#3a4a38',
    roofStyle: 'shed_sloped',
    roofHeight: 1.4,
    roofColor: '#3d5a80', // Coastal deep blue
    roofOverhang: 0.4,
    doorStyle: 'rustic_plank',
    doorPosition: [0, 0.5, 1.81],
    doorColor: '#293241',
    hasChimney: true,
    chimneyPosition: [1.2, 0, -0.6],
    chimneyHeight: 1.8,
    chimneyMaterial: 'brick',
    hasPorch: true,
    porchConfig: {
      width: 3.6,
      depth: 1.4,
      hasAwning: true,
      hasRailings: false,
    },
    windows: [
      { position: [-1.2, 1.4, 1.81], style: 'cross_mullion' },
      { position: [2.21, 1.4, 0], rotation: [0, Math.PI / 2, 0], style: 'small_square' },
    ],
    decorations: {
      hasBarrels: true,
      barrelPositions: [
        [-1.8, 0, 2.3],
        [-2.2, 0, 1.8],
      ],
      hasCrates: true,
      cratePositions: [[1.6, 0, 2.3]],
      hasLanterns: true,
      lanternPositions: [[0, 2.2, 2.4]],
    },
  },
];
