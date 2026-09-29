export type AnimalSpeciesType =
  | 'chicken'
  | 'cow'
  | 'sheep'
  | 'pig'
  | 'duck'
  | 'goat'
  | 'dog'
  | 'cat';

export interface SpeciesDef {
  id: AnimalSpeciesType;
  name: string;
  badge: string;
  productItemId?: string;
  productName?: string;
  productIcon?: string;
  baseCooldown: number;
  speed: number;
  feedItems: string[];
}

export const SPECIES_CATALOG: Record<AnimalSpeciesType, SpeciesDef> = {
  chicken: {
    id: 'chicken',
    name: 'Hen',
    badge: '🐔',
    productItemId: 'egg',
    productName: 'Egg',
    productIcon: '🥚',
    baseCooldown: 45,
    speed: 0.9,
    feedItems: ['wheat_seed', 'corn_seed', 'wheat'],
  },
  cow: {
    id: 'cow',
    name: 'Dairy Cow',
    badge: '🐮',
    productItemId: 'milk',
    productName: 'Fresh Milk',
    productIcon: '🥛',
    baseCooldown: 75,
    speed: 0.5,
    feedItems: ['wheat', 'corn'],
  },
  sheep: {
    id: 'sheep',
    name: 'Fluffy Sheep',
    badge: '🐑',
    productItemId: 'wool',
    productName: 'Soft Wool',
    productIcon: '🧶',
    baseCooldown: 60,
    speed: 0.65,
    feedItems: ['wheat'],
  },
  pig: {
    id: 'pig',
    name: 'Farm Pig',
    badge: '🐷',
    productItemId: 'truffle',
    productName: 'Rare Truffle',
    productIcon: '🍄',
    baseCooldown: 80,
    speed: 0.6,
    feedItems: ['carrot', 'corn'],
  },
  duck: {
    id: 'duck',
    name: 'Mallard Duck',
    badge: '🦆',
    productItemId: 'feather',
    productName: 'Silky Feather',
    productIcon: '🪶',
    baseCooldown: 50,
    speed: 0.85,
    feedItems: ['wheat_seed'],
  },
  goat: {
    id: 'goat',
    name: 'Mountain Goat',
    badge: '🐐',
    productItemId: 'goat_milk',
    productName: 'Goat Milk',
    productIcon: '🥛',
    baseCooldown: 65,
    speed: 0.7,
    feedItems: ['wheat'],
  },
  dog: {
    id: 'dog',
    name: 'Valley Collie',
    badge: '🐶',
    baseCooldown: 0,
    speed: 1.2,
    feedItems: ['meat', 'food'],
  },
  cat: {
    id: 'cat',
    name: 'Calico Cat',
    badge: '🐱',
    baseCooldown: 0,
    speed: 0.95,
    feedItems: ['fish', 'milk'],
  },
};
