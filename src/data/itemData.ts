import { CropType } from './cropData';

export type ItemCategory =
  | 'Seed'
  | 'Crop'
  | 'Resource'
  | 'AnimalProduct'
  | 'Material'
  | 'Food'
  | 'Tool';

export interface ItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  icon: string;
  maxStack: number;
  cropType?: CropType;
}

export const ITEMS: Record<string, ItemDefinition> = {
  // === SEEDS ===
  wheat_seed: {
    id: 'wheat_seed',
    name: 'Wheat Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow golden wheat.',
    icon: '🌾',
    maxStack: 99,
    cropType: 'wheat',
  },
  corn_seed: {
    id: 'corn_seed',
    name: 'Corn Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow tall sweet corn.',
    icon: '🌽',
    maxStack: 99,
    cropType: 'corn',
  },
  carrot_seed: {
    id: 'carrot_seed',
    name: 'Carrot Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow sweet, crisp carrots.',
    icon: '🥕',
    maxStack: 99,
    cropType: 'carrot',
  },
  tomato_seed: {
    id: 'tomato_seed',
    name: 'Tomato Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow vine-ripened tomatoes.',
    icon: '🍅',
    maxStack: 99,
    cropType: 'tomato',
  },

  // === CROPS ===
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    category: 'Crop',
    description: 'Freshly harvested golden wheat grains.',
    icon: '🌾',
    maxStack: 99,
    cropType: 'wheat',
  },
  corn: {
    id: 'corn',
    name: 'Corn',
    category: 'Crop',
    description: 'Plump and juicy ears of sweet corn.',
    icon: '🌽',
    maxStack: 99,
    cropType: 'corn',
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    category: 'Crop',
    description: 'Crunchy and vibrant orange carrots.',
    icon: '🥕',
    maxStack: 99,
    cropType: 'carrot',
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    category: 'Crop',
    description: 'Juicy, sun-ripened red tomatoes.',
    icon: '🍅',
    maxStack: 99,
    cropType: 'tomato',
  },

  // === MATERIALS ===
  wood: {
    id: 'wood',
    name: 'Wood',
    category: 'Material',
    description: 'Sturdy timber logs from valley trees.',
    icon: '🪵',
    maxStack: 99,
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    category: 'Material',
    description: 'Smooth gray stones collected from the riverbed and cliffs.',
    icon: '🪨',
    maxStack: 99,
  },

  // === ANIMAL PRODUCTS (Defined for future animal system) ===
  milk: {
    id: 'milk',
    name: 'Fresh Milk',
    category: 'AnimalProduct',
    description: 'Rich, wholesome milk from valley dairy cows.',
    icon: '🥛',
    maxStack: 99,
  },
  egg: {
    id: 'egg',
    name: 'Farm Egg',
    category: 'AnimalProduct',
    description: 'A fresh organic egg from free-range chickens.',
    icon: '🥚',
    maxStack: 99,
  },
  wool: {
    id: 'wool',
    name: 'Soft Wool',
    category: 'AnimalProduct',
    description: 'Warm and fluffy fleece sheared from sheep.',
    icon: '🧶',
    maxStack: 99,
  },

  // === TOOLS ===
  watering_can: {
    id: 'watering_can',
    name: 'Watering Can',
    category: 'Tool',
    description: 'Sprinkles refreshing water to hydrate growing crops.',
    icon: '💧',
    maxStack: 1,
  },
  hoe: {
    id: 'hoe',
    name: 'Farmer Hoe',
    category: 'Tool',
    description: 'Tills grassy earth into fertile plowed farm soil.',
    icon: '⛏️',
    maxStack: 1,
  },
  axe: {
    id: 'axe',
    name: 'Woodcutter Axe',
    category: 'Tool',
    description: 'Used for chopping timber and clearing logs.',
    icon: '🪓',
    maxStack: 1,
  },
  pickaxe: {
    id: 'pickaxe',
    name: 'Miner Pickaxe',
    category: 'Tool',
    description: 'Breaks rocks and boulders into building stones.',
    icon: '🔨',
    maxStack: 1,
  },

  // === FOOD ===
  bread: {
    id: 'bread',
    name: 'Fresh Bread',
    category: 'Food',
    description: 'Warm, crusty loaf baked from freshly milled wheat.',
    icon: '🍞',
    maxStack: 99,
  },
  salad: {
    id: 'salad',
    name: 'Valley Salad',
    category: 'Food',
    description: 'Tossed bowl of crisp garden vegetables.',
    icon: '🥗',
    maxStack: 99,
  },

  // === RESOURCE ===
  clay: {
    id: 'clay',
    name: 'River Clay',
    category: 'Resource',
    description: 'Soft moldable clay harvested from riverbanks.',
    icon: '🧱',
    maxStack: 99,
  },
};

export const ITEM_LIST = Object.values(ITEMS);

export function getItemDefinition(itemId: string): ItemDefinition | undefined {
  return ITEMS[itemId];
}
