import { CropType } from './cropData';

export type ItemCategory =
  | 'Seed'
  | 'Crop'
  | 'Resource'
  | 'AnimalProduct'
  | 'Material'
  | 'Food'
  | 'Tool'
  | 'Fish'
  | 'Bait';

export interface ItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  icon: string;
  imageIcon?: string;
  maxStack: number;
  cropType?: CropType;
  rodLevel?: number;
  fishId?: string;
  baitId?: string;
}

export const ITEMS: Record<string, ItemDefinition> = {
  // === SEEDS ===
  wheat_seed: {
    id: 'wheat_seed',
    name: 'Wheat Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow golden wheat.',
    icon: '🌾',
    imageIcon: '/ui/cozy/icons/cozy_icon_seed_bag__87x84.png',
    maxStack: 99,
    cropType: 'wheat',
  },
  corn_seed: {
    id: 'corn_seed',
    name: 'Corn Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow tall sweet corn.',
    icon: '🌽',
    imageIcon: '/ui/cozy/icons/cozy_icon_seed_bag__87x84.png',
    maxStack: 99,
    cropType: 'corn',
  },
  carrot_seed: {
    id: 'carrot_seed',
    name: 'Carrot Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow sweet, crisp carrots.',
    icon: '🥕',
    imageIcon: '/ui/cozy/icons/cozy_icon_seed_bag__87x84.png',
    maxStack: 99,
    cropType: 'carrot',
  },
  tomato_seed: {
    id: 'tomato_seed',
    name: 'Tomato Seed',
    category: 'Seed',
    description: 'Plant in tilled soil to grow vine-ripened tomatoes.',
    icon: '🍅',
    imageIcon: '/ui/cozy/icons/cozy_icon_seed_bag__87x84.png',
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
    imageIcon: '/ui/cozy/icons/cozy_icon_herb_bundle__97x107.png',
    maxStack: 99,
    cropType: 'wheat',
  },
  corn: {
    id: 'corn',
    name: 'Corn',
    category: 'Crop',
    description: 'Plump and juicy ears of sweet corn.',
    icon: '🌽',
    imageIcon: '/ui/cozy/icons/cozy_icon_vegetables__104x77.png',
    maxStack: 99,
    cropType: 'corn',
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    category: 'Crop',
    description: 'Crunchy and vibrant orange carrots.',
    icon: '🥕',
    imageIcon: '/icons/veggies/icon-carrot.png',
    maxStack: 99,
    cropType: 'carrot',
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    category: 'Crop',
    description: 'Juicy, sun-ripened red tomatoes.',
    icon: '🍅',
    imageIcon: '/icons/veggies/icon-tomato.png',
    maxStack: 99,
    cropType: 'tomato',
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'Crop',
    description: 'Plump and hearty autumn pumpkin.',
    icon: '🎃',
    imageIcon: '/icons/veggies/icon-pumpkin.png',
    maxStack: 99,
    cropType: 'pumpkin',
  },
  eggplant: {
    id: 'eggplant',
    name: 'Eggplant',
    category: 'Crop',
    description: 'Glossy purple garden eggplant.',
    icon: '🍆',
    imageIcon: '/icons/veggies/icon-eggplant.png',
    maxStack: 99,
    cropType: 'eggplant',
  },
  mushroom: {
    id: 'mushroom',
    name: 'Wild Mushroom',
    category: 'Crop',
    description: 'Earthy forest mushroom.',
    icon: '🍄',
    imageIcon: '/icons/veggies/icon-mushroom.png',
    maxStack: 99,
  },

  // === MATERIALS ===
  wood: {
    id: 'wood',
    name: 'Wood',
    category: 'Material',
    description: 'Sturdy timber logs from valley trees.',
    icon: '🪵',
    imageIcon: '/ui/cozy/icons/cozy_icon_logs__91x74.png',
    maxStack: 99,
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    category: 'Material',
    description: 'Smooth gray stones collected from the riverbed and cliffs.',
    icon: '🪨',
    imageIcon: '/ui/cozy/icons/cozy_icon_stone__75x62.png',
    maxStack: 99,
  },

  // === ANIMAL PRODUCTS ===
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
    imageIcon: '/ui/cozy/icons/cozy_icon_watering_can__87x77.png',
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
    imageIcon: '/ui/cozy/icons/cozy_icon_flower__98x119.png',
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

  // === FISHING RODS ===
  fishing_rod_1: {
    id: 'fishing_rod_1',
    name: 'Cần Trúc Tập Sự',
    category: 'Tool',
    description: 'Cần câu trúc nhẹ nhàng, bấm [E] hoặc quăng mồi ven bờ suối.',
    icon: '🎣',
    maxStack: 1,
    rodLevel: 1,
  },
  fishing_rod_2: {
    id: 'fishing_rod_2',
    name: 'Cần Câu Gỗ Gia Cố',
    category: 'Tool',
    description: 'Cần câu gỗ hồ đào bền bỉ, quăng mồi xa hơn và trợ lực kéo.',
    icon: '🎣',
    maxStack: 1,
    rodLevel: 2,
  },
  fishing_rod_3: {
    id: 'fishing_rod_3',
    name: 'Cần Sợi Thủy Tinh',
    category: 'Tool',
    description: 'Cần câu cao cấp đàn hồi cao, câu cá lớn tại bến tàu hồ Azure.',
    icon: '🎣',
    maxStack: 1,
    rodLevel: 3,
  },
  fishing_rod_4: {
    id: 'fishing_rod_4',
    name: 'Cần Titan Chuyên Nghiệp',
    category: 'Tool',
    description: 'Cần titan siêu nhẹ chống gãy, thanh giữ cá rộng hơn khi kéo.',
    icon: '🎣',
    maxStack: 1,
    rodLevel: 4,
  },
  fishing_rod_5: {
    id: 'fishing_rod_5',
    name: 'Cần Huyền Thoại Thung Lũng',
    category: 'Tool',
    description: 'Cần câu thần thoại Little Valley, thu hút cá hiếm và cá kiếm khổng lồ.',
    icon: '🎣',
    maxStack: 1,
    rodLevel: 5,
  },

  // === BAIT ===
  worm: {
    id: 'worm',
    name: 'Giun Đất Đào Vườn',
    category: 'Bait',
    description: 'Giun đất tươi xốp đào từ đất cày, giảm 25% thời gian cắn câu.',
    icon: '🪱',
    maxStack: 99,
    baitId: 'worm',
  },
  lure_feather: {
    id: 'lure_feather',
    name: 'Mồi Lông Vũ Nghệ Thuật',
    category: 'Bait',
    description: 'Mồi giả lông vũ sặc sỡ, tăng 15% cơ hội gặp cá quý hiếm.',
    icon: '🪶',
    maxStack: 99,
    baitId: 'lure_feather',
  },
  lure_spinner: {
    id: 'lure_spinner',
    name: 'Mồi Xoay Óng Ánh',
    category: 'Bait',
    description: 'Mồi thìa xoay tít lấp lánh, mở rộng thanh đỡ minigame 15%.',
    icon: '✨',
    maxStack: 99,
    baitId: 'lure_spinner',
  },
  lure_master: {
    id: 'lure_master',
    name: 'Mồi Câu Hoàng Gia',
    category: 'Bait',
    description: 'Mồi câu thượng hạng chuyên phục vụ săn thủy quái hồ sâu.',
    icon: '👑',
    maxStack: 99,
    baitId: 'lure_master',
  },
};

// Dynamically register all 34 fish species into the item database
import { FISH_LIST } from './fishData';
FISH_LIST.forEach((f) => {
  ITEMS[f.id] = {
    id: f.id,
    name: f.name,
    category: 'Fish',
    description: `${f.description} • Độ hiếm: ${f.rarity.toUpperCase()}`,
    icon: f.icon,
    maxStack: 99,
    fishId: f.id,
  };
});

export const ITEM_LIST = Object.values(ITEMS);

export function getItemDefinition(itemId: string): ItemDefinition | undefined {
  return ITEMS[itemId];
}
