export interface BuildingCost {
  wood: number;
  stone: number;
  coins: number;
}

export interface BuildingDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: BuildingCost;
  size: [number, number]; // [width, depth] in world units
}

export const BUILDINGS: Record<string, BuildingDefinition> = {
  chicken_coop: {
    id: 'chicken_coop',
    name: 'Chicken Coop',
    description: 'A cozy elevated timber shelter with nesting boxes for clucking hens.',
    icon: '🐔',
    cost: {
      wood: 20,
      stone: 10,
      coins: 250,
    },
    size: [3, 3],
  },
  barn: {
    id: 'barn',
    name: 'Barn',
    description: 'A spacious traditional red barn for housing cattle and livestock.',
    icon: '🐄',
    cost: {
      wood: 30,
      stone: 10,
      coins: 500,
    },
    size: [4, 4],
  },
  silo: {
    id: 'silo',
    name: 'Silo',
    description: 'A towering grain silo for preserving winter hay, wheat, and livestock feed.',
    icon: '🌾',
    cost: {
      wood: 15,
      stone: 25,
      coins: 300,
    },
    size: [2.5, 2.5],
  },
  storage_shed: {
    id: 'storage_shed',
    name: 'Storage Shed',
    description: 'A sturdy wooden shed to safeguard tools, seeds, and farm materials.',
    icon: '🏚️',
    cost: {
      wood: 25,
      stone: 5,
      coins: 200,
    },
    size: [3, 3],
  },
  bakery: {
    id: 'bakery',
    name: 'Bakery',
    description: 'An artisan bakery with a stone hearth oven and smoking chimney for bread.',
    icon: '🍞',
    cost: {
      wood: 35,
      stone: 30,
      coins: 650,
    },
    size: [4, 4],
  },
  windmill: {
    id: 'windmill',
    name: 'Windmill',
    description: 'A picturesque stone tower with spinning cloth sails that grinds grain into flour.',
    icon: '💨',
    cost: {
      wood: 40,
      stone: 20,
      coins: 600,
    },
    size: [3.5, 3.5],
  },
};

export const BUILDING_LIST = Object.values(BUILDINGS);

export function getBuildingDefinition(id: string): BuildingDefinition | undefined {
  return BUILDINGS[id];
}
