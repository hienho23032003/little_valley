export type CropType = 'wheat' | 'corn' | 'carrot' | 'tomato' | 'pumpkin' | 'eggplant';

export interface CropDefinition {
  id: CropType;
  name: string;
  growthTime: number; // in seconds
  seedItem: string;
  harvestItem: string;
  sellPrice: number;
  description: string;
  seedName: string;
  color: string;
  icon: string;
}

export const CROPS: Record<CropType, CropDefinition> = {
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    growthTime: 10, // 10 seconds for responsive and cozy gameplay
    seedItem: 'wheat_seed',
    harvestItem: 'wheat',
    sellPrice: 15,
    description: 'Golden stalks of grain, staple of Little Valley.',
    seedName: 'Wheat Seeds',
    color: '#e9c46a',
    icon: '🌾',
  },
  corn: {
    id: 'corn',
    name: 'Corn',
    growthTime: 18,
    seedItem: 'corn_seed',
    harvestItem: 'corn',
    sellPrice: 25,
    description: 'Tall sweet corn with plump golden ears.',
    seedName: 'Corn Seeds',
    color: '#f4a261',
    icon: '🌽',
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    growthTime: 12,
    seedItem: 'carrot_seed',
    harvestItem: 'carrot',
    sellPrice: 20,
    description: 'Crisp and sweet orange roots.',
    seedName: 'Carrot Seeds',
    color: '#e76f51',
    icon: '🥕',
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    growthTime: 15,
    seedItem: 'tomato_seed',
    harvestItem: 'tomato',
    sellPrice: 22,
    description: 'Juicy, vine-ripened red tomatoes.',
    seedName: 'Tomato Seeds',
    color: '#d62828',
    icon: '🍅',
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    growthTime: 20,
    seedItem: 'pumpkin_seed',
    harvestItem: 'pumpkin',
    sellPrice: 35,
    description: 'Plump and hearty autumn pumpkin.',
    seedName: 'Pumpkin Seeds',
    color: '#f77f00',
    icon: '🎃',
  },
  eggplant: {
    id: 'eggplant',
    name: 'Eggplant',
    growthTime: 16,
    seedItem: 'eggplant_seed',
    harvestItem: 'eggplant',
    sellPrice: 28,
    description: 'Glossy purple garden eggplant.',
    seedName: 'Eggplant Seeds',
    color: '#7209b7',
    icon: '🍆',
  },
};

export const CROP_LIST: CropDefinition[] = Object.values(CROPS);
