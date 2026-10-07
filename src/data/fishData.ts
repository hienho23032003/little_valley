export type FishRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type WaterType = 'river' | 'lake' | 'all';
export type TimePreference = 'all' | 'day' | 'night';

export interface FishSpecies {
  id: string;
  name: string; // Vietnamese
  englishName: string;
  rarity: FishRarity;
  waterType: WaterType;
  timePreference: TimePreference;
  modelUrl: string;
  minWeight: number; // in kg
  maxWeight: number;
  minLength: number; // in cm
  maxLength: number;
  basePrice: number; // coins
  difficulty: number; // 1 to 10 (controls minigame erratic movement & bar escape speed)
  icon: string;
  description: string;
  rarityColor: string;
}

export interface FishingRodDefinition {
  id: string;
  level: number;
  name: string; // Vietnamese
  englishName: string;
  modelUrl: string;
  castDistance: number;
  barWidthMultiplier: number; // catch bar width
  reelSpeedMultiplier: number;
  rarityBoost: number;
  price: number;
  description: string;
}

export interface BaitDefinition {
  id: string;
  name: string;
  englishName: string;
  modelUrl: string;
  biteTimeReduction: number; // 0.0 to 0.5
  rareChanceBonus: number; // 0.0 to 0.3
  barWidthBonus: number; // 0.0 to 0.25
  icon: string;
  description: string;
  price: number;
}

export const FISH_SPECIES: Record<string, FishSpecies> = {
  // === COMMON SPECIES (Phổ biến) ===
  goldfish: {
    id: 'goldfish',
    name: 'Cá Vàng',
    englishName: 'Goldfish',
    rarity: 'common',
    waterType: 'all',
    timePreference: 'all',
    modelUrl: '/models/fish/Goldfish.fbx',
    minWeight: 0.15,
    maxWeight: 0.85,
    minLength: 10,
    maxLength: 25,
    basePrice: 20,
    difficulty: 2,
    icon: '🐟',
    description: 'Chú cá vàng lấp lánh tung tăng bơi lội trong dòng nước trong veo.',
    rarityColor: '#70e000',
  },
  clownfish: {
    id: 'clownfish',
    name: 'Cá Hề',
    englishName: 'Clownfish',
    rarity: 'common',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Clownfish.fbx',
    minWeight: 0.1,
    maxWeight: 0.45,
    minLength: 8,
    maxLength: 18,
    basePrice: 25,
    difficulty: 2,
    icon: '🐠',
    description: 'Chú cá hề sọc cam rực rỡ vui vẻ thích nấp quanh rong rêu.',
    rarityColor: '#70e000',
  },
  tetra: {
    id: 'tetra',
    name: 'Cá Neon',
    englishName: 'Tetra',
    rarity: 'common',
    waterType: 'river',
    timePreference: 'all',
    modelUrl: '/models/fish/Tetra.fbx',
    minWeight: 0.05,
    maxWeight: 0.2,
    minLength: 4,
    maxLength: 10,
    basePrice: 15,
    difficulty: 2,
    icon: '🐟',
    description: 'Loài cá nhỏ phát ánh huỳnh quang rực rỡ ven bờ suối.',
    rarityColor: '#70e000',
  },
  flatfish: {
    id: 'flatfish',
    name: 'Cá Bơn Dẹt',
    englishName: 'Flatfish',
    rarity: 'common',
    waterType: 'river',
    timePreference: 'all',
    modelUrl: '/models/fish/Flatfish.fbx',
    minWeight: 0.4,
    maxWeight: 1.6,
    minLength: 20,
    maxLength: 40,
    basePrice: 22,
    difficulty: 2,
    icon: '🐟',
    description: 'Loài cá ngụy trang hoàn hảo dưới đáy cát phù sa.',
    rarityColor: '#70e000',
  },
  turbot: {
    id: 'turbot',
    name: 'Cá Bơn Lớn',
    englishName: 'Turbot',
    rarity: 'common',
    waterType: 'river',
    timePreference: 'all',
    modelUrl: '/models/fish/Turbot.fbx',
    minWeight: 0.8,
    maxWeight: 3.2,
    minLength: 25,
    maxLength: 50,
    basePrice: 30,
    difficulty: 3,
    icon: '🐟',
    description: 'Thân tròn dẹt với vị thịt ngọt mềm danh tiếng.',
    rarityColor: '#70e000',
  },
  armored_catfish: {
    id: 'armored_catfish',
    name: 'Cá Lau Kiếng Hoàng Gia',
    englishName: 'Armored Catfish',
    rarity: 'common',
    waterType: 'river',
    timePreference: 'all',
    modelUrl: '/models/fish/ArmoredCatfish.fbx',
    minWeight: 0.3,
    maxWeight: 1.5,
    minLength: 15,
    maxLength: 35,
    basePrice: 18,
    difficulty: 2,
    icon: '🛡️',
    description: 'Bộ vảy giáp cứng cáp như tấm khiên hiệp sĩ bảo vệ đáy sông.',
    rarityColor: '#70e000',
  },
  cardinalfish: {
    id: 'cardinalfish',
    name: 'Cá Hồng Ngọc',
    englishName: 'Cardinalfish',
    rarity: 'common',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/CardinalFish.fbx',
    minWeight: 0.1,
    maxWeight: 0.4,
    minLength: 6,
    maxLength: 14,
    basePrice: 24,
    difficulty: 2,
    icon: '💎',
    description: 'Mang sắc đỏ ruby óng ả nổi bật giữa làn nước trong xanh.',
    rarityColor: '#70e000',
  },
  tang: {
    id: 'tang',
    name: 'Cá Đuôi Gai Sọc',
    englishName: 'Tang',
    rarity: 'common',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Tang.fbx',
    minWeight: 0.2,
    maxWeight: 0.9,
    minLength: 12,
    maxLength: 26,
    basePrice: 28,
    difficulty: 3,
    icon: '🐠',
    description: 'Thân dẹt hình thoi thanh lịch với các sọc chỉ vàng sắc nét.',
    rarityColor: '#70e000',
  },

  // === UNCOMMON SPECIES (Đặc biệt) ===
  zebra_clownfish: {
    id: 'zebra_clownfish',
    name: 'Cá Hề Ngựa Vằn',
    englishName: 'Zebra Clownfish',
    rarity: 'uncommon',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/ZebraClownFish.fbx',
    minWeight: 0.15,
    maxWeight: 0.5,
    minLength: 10,
    maxLength: 20,
    basePrice: 45,
    difficulty: 3,
    icon: '🐠',
    description: 'Biến thể sọc đen tuyền quý phái của loài cá hề.',
    rarityColor: '#38b000',
  },
  blue_goldfish: {
    id: 'blue_goldfish',
    name: 'Cá Vàng Lam Ngọc',
    englishName: 'Blue Goldfish',
    rarity: 'uncommon',
    waterType: 'river',
    timePreference: 'all',
    modelUrl: '/models/fish/BlueGoldfish.fbx',
    minWeight: 0.2,
    maxWeight: 0.9,
    minLength: 12,
    maxLength: 26,
    basePrice: 50,
    difficulty: 4,
    icon: '🐟',
    description: 'Vảy cá óng ánh sắc xanh ngọc bích hiếm gặp của dòng sông.',
    rarityColor: '#38b000',
  },
  blue_tang: {
    id: 'blue_tang',
    name: 'Cá Đuôi Gai Xanh',
    englishName: 'Blue Tang',
    rarity: 'uncommon',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/BlueTang.fbx',
    minWeight: 0.3,
    maxWeight: 1.2,
    minLength: 14,
    maxLength: 30,
    basePrice: 60,
    difficulty: 4,
    icon: '🐠',
    description: 'Màu lam đậm huyền thoại với chiếc đuôi vàng chanh tươi sáng.',
    rarityColor: '#38b000',
  },
  betta: {
    id: 'betta',
    name: 'Cá Xiêm Song Kiếm',
    englishName: 'Betta',
    rarity: 'uncommon',
    waterType: 'river',
    timePreference: 'all',
    modelUrl: '/models/fish/Betta.fbx',
    minWeight: 0.1,
    maxWeight: 0.35,
    minLength: 8,
    maxLength: 16,
    basePrice: 55,
    difficulty: 4,
    icon: '🐟',
    description: 'Tà vây bồng bềnh tựa dải lụa hoàng gia của võ sĩ đường thủy.',
    rarityColor: '#38b000',
  },
  puffer: {
    id: 'puffer',
    name: 'Cá Nóc Phúng Phính',
    englishName: 'Puffer',
    rarity: 'uncommon',
    waterType: 'all',
    timePreference: 'all',
    modelUrl: '/models/fish/Puffer.fbx',
    minWeight: 0.5,
    maxWeight: 2.5,
    minLength: 15,
    maxLength: 35,
    basePrice: 65,
    difficulty: 4,
    icon: '🐡',
    description: 'Thổi phồng như quả bóng gai ngộ nghĩnh mỗi khi cắn câu!',
    rarityColor: '#38b000',
  },
  cowfish: {
    id: 'cowfish',
    name: 'Cá Bò Sừng Vàng',
    englishName: 'Cowfish',
    rarity: 'uncommon',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Cowfish.fbx',
    minWeight: 0.3,
    maxWeight: 1.1,
    minLength: 12,
    maxLength: 25,
    basePrice: 55,
    difficulty: 4,
    icon: '🐮',
    description: 'Mang hai chiếc sừng bé xíu trên trán trông hệt như chú bò con.',
    rarityColor: '#38b000',
  },
  piranha: {
    id: 'piranha',
    name: 'Cá Hổ Răng Sắc',
    englishName: 'Piranha',
    rarity: 'uncommon',
    waterType: 'river',
    timePreference: 'all',
    modelUrl: '/models/fish/Piranha.fbx',
    minWeight: 0.4,
    maxWeight: 1.8,
    minLength: 16,
    maxLength: 32,
    basePrice: 70,
    difficulty: 5,
    icon: '🐟',
    description: 'Hàm răng bén nhọn giật dây câu rất mạnh và giãy giụa quyết liệt.',
    rarityColor: '#38b000',
  },
  red_snapper: {
    id: 'red_snapper',
    name: 'Cá Hồng Vị Biển',
    englishName: 'Red Snapper',
    rarity: 'uncommon',
    waterType: 'all',
    timePreference: 'all',
    modelUrl: '/models/fish/RedSnapper.fbx',
    minWeight: 1.2,
    maxWeight: 4.5,
    minLength: 30,
    maxLength: 65,
    basePrice: 75,
    difficulty: 5,
    icon: '🐟',
    description: 'Loài cá thượng hạng với vị ngọt thanh, thương lái trả giá rất cao.',
    rarityColor: '#38b000',
  },
  butterfly_fish: {
    id: 'butterfly_fish',
    name: 'Cá Bướm Hoa Văn',
    englishName: 'Butterfly Fish',
    rarity: 'uncommon',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/ButterflyFish.fbx',
    minWeight: 0.2,
    maxWeight: 0.75,
    minLength: 10,
    maxLength: 22,
    basePrice: 58,
    difficulty: 3,
    icon: '🦋',
    description: 'Thân mỏng manh như cánh bướm chao lượn quanh trụ cầu gỗ.',
    rarityColor: '#38b000',
  },
  parrot_fish: {
    id: 'parrot_fish',
    name: 'Cá Mó Xanh Ngọc',
    englishName: 'Parrot Fish',
    rarity: 'uncommon',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/ParrotFish.fbx',
    minWeight: 0.8,
    maxWeight: 3.0,
    minLength: 22,
    maxLength: 48,
    basePrice: 68,
    difficulty: 4,
    icon: '🦜',
    description: 'Mỏ cá tròn như mỏ vẹt, thân lấp lánh sắc xanh biếc của hồ ngọc.',
    rarityColor: '#38b000',
  },

  // === RARE SPECIES (Quý hiếm) ===
  koi: {
    id: 'koi',
    name: 'Cá Chép Koi Phong Thủy',
    englishName: 'Koi',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Koi.fbx',
    minWeight: 1.5,
    maxWeight: 6.0,
    minLength: 35,
    maxLength: 75,
    basePrice: 160,
    difficulty: 6,
    icon: '🎏',
    description: 'Biểu tượng của sự may mắn và tài lộc, vảy thắm như hoa đào.',
    rarityColor: '#0077b6',
  },
  yellow_tang: {
    id: 'yellow_tang',
    name: 'Cá Đuôi Gai Hoàng Yến',
    englishName: 'Yellow Tang',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'day',
    modelUrl: '/models/fish/YellowTang.fbx',
    minWeight: 0.25,
    maxWeight: 0.9,
    minLength: 12,
    maxLength: 24,
    basePrice: 140,
    difficulty: 5,
    icon: '🐠',
    description: 'Sắc vàng óng như tia nắng ban mai chiếu qua mặt nước hồ Azure.',
    rarityColor: '#0077b6',
  },
  tuna: {
    id: 'tuna',
    name: 'Cá Ngừ Lưng Xanh',
    englishName: 'Tuna',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Tuna.fbx',
    minWeight: 5.0,
    maxWeight: 22.0,
    minLength: 60,
    maxLength: 130,
    basePrice: 220,
    difficulty: 7,
    icon: '🐟',
    description: 'Chiến binh bơi nhanh như tên bắn, đòi hỏi sức kéo tay điêu luyện.',
    rarityColor: '#0077b6',
  },
  sunfish: {
    id: 'sunfish',
    name: 'Cá Mặt Trăng Khổng Lồ',
    englishName: 'Sunfish',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'day',
    modelUrl: '/models/fish/Sunfish.fbx',
    minWeight: 12.0,
    maxWeight: 45.0,
    minLength: 80,
    maxLength: 160,
    basePrice: 260,
    difficulty: 6,
    icon: '🐡',
    description: 'Tấm thân khổng lồ hình đĩa tròn tắm mình dưới ánh mặt trời rực rỡ.',
    rarityColor: '#0077b6',
  },
  lionfish: {
    id: 'lionfish',
    name: 'Cá Mao Tiên Lộng Lẫy',
    englishName: 'Lionfish',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Lionfish.fbx',
    minWeight: 0.6,
    maxWeight: 2.0,
    minLength: 20,
    maxLength: 42,
    basePrice: 180,
    difficulty: 6,
    icon: '🦁',
    description: 'Gai vây xòe rộng như cánh quạt vương giả đầy kiêu hãnh.',
    rarityColor: '#0077b6',
  },
  mandarin_fish: {
    id: 'mandarin_fish',
    name: 'Cá Trạng Nguyên Ngũ Sắc',
    englishName: 'Mandarin Fish',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/MandarinFish.fbx',
    minWeight: 0.1,
    maxWeight: 0.35,
    minLength: 7,
    maxLength: 15,
    basePrice: 190,
    difficulty: 6,
    icon: '👑',
    description: 'Hoa văn tuyệt tác như bức tranh sơn mài của bậc trạng nguyên.',
    rarityColor: '#0077b6',
  },
  moorish_idol: {
    id: 'moorish_idol',
    name: 'Cá Chim Cờ Quý Tộc',
    englishName: 'Moorish Idol',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/MoorishIdol.fbx',
    minWeight: 0.3,
    maxWeight: 1.1,
    minLength: 14,
    maxLength: 28,
    basePrice: 170,
    difficulty: 5,
    icon: '🐠',
    description: 'Cờ lưng vươn dài thanh thoát, bơi lượn kiêu sa quanh bến tàu cổ.',
    rarityColor: '#0077b6',
  },
  flower_horn: {
    id: 'flower_horn',
    name: 'Cá La Hán Phúc Lộc',
    englishName: 'Flowerhorn',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/FlowerHorn.fbx',
    minWeight: 1.2,
    maxWeight: 3.8,
    minLength: 25,
    maxLength: 50,
    basePrice: 210,
    difficulty: 6,
    icon: '🌺',
    description: 'Cục gù đầu uy nghi đem lại hồng phúc và thịnh vượng cho gia chủ.',
    rarityColor: '#0077b6',
  },
  humphead: {
    id: 'humphead',
    name: 'Cá Đầu Gù Đại Dương',
    englishName: 'Humphead',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Humphead.fbx',
    minWeight: 4.0,
    maxWeight: 18.0,
    minLength: 45,
    maxLength: 110,
    basePrice: 240,
    difficulty: 7,
    icon: '🐟',
    description: 'Chiếc trán gồ ghề dũng mãnh, sức nặng kéo cong cả cần câu.',
    rarityColor: '#0077b6',
  },
  royal_gramma: {
    id: 'royal_gramma',
    name: 'Cá Hoàng Gia Hai Màu',
    englishName: 'Royal Gramma',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/RoyalGramma.fbx',
    minWeight: 0.12,
    maxWeight: 0.4,
    minLength: 7,
    maxLength: 16,
    basePrice: 155,
    difficulty: 5,
    icon: '👑',
    description: 'Nửa thân trước màu tím mộng mơ, nửa thân sau màu vàng óng ánh.',
    rarityColor: '#0077b6',
  },
  coral_grouper: {
    id: 'coral_grouper',
    name: 'Cá Mú Sao San Hô',
    englishName: 'Coral Grouper',
    rarity: 'rare',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/CoralGrouper.fbx',
    minWeight: 2.0,
    maxWeight: 7.5,
    minLength: 35,
    maxLength: 75,
    basePrice: 230,
    difficulty: 7,
    icon: '🐟',
    description: 'Thân đỏ rực điểm xuyết hàng ngàn đốm sao xanh thăm thẳm.',
    rarityColor: '#0077b6',
  },
  blobfish: {
    id: 'blobfish',
    name: 'Cá Giọt Nước Ngộ Nghĩnh',
    englishName: 'Blobfish',
    rarity: 'rare',
    waterType: 'all',
    timePreference: 'night',
    modelUrl: '/models/fish/Blobfish.fbx',
    minWeight: 1.0,
    maxWeight: 4.0,
    minLength: 20,
    maxLength: 40,
    basePrice: 185,
    difficulty: 4,
    icon: '💧',
    description: 'Gương mặt buồn ngủ đáng yêu nhất vùng nước sâu thung lũng!',
    rarityColor: '#0077b6',
  },

  // === LEGENDARY SPECIES (Huyền thoại) ===
  swordfish: {
    id: 'swordfish',
    name: 'Cá Kiếm Thần Kiếm',
    englishName: 'Swordfish',
    rarity: 'legendary',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Swordfish.fbx',
    minWeight: 15.0,
    maxWeight: 55.0,
    minLength: 120,
    maxLength: 240,
    basePrice: 550,
    difficulty: 9,
    icon: '🗡️',
    description: 'Mũi kiếm sắc lạnh xé toạc làn sóng biếc, chúa tể tốc độ của hồ Azure.',
    rarityColor: '#9d4edd',
  },
  shark: {
    id: 'shark',
    name: 'Cá Mập Xanh Thẳm',
    englishName: 'Shark',
    rarity: 'legendary',
    waterType: 'lake',
    timePreference: 'all',
    modelUrl: '/models/fish/Shark.fbx',
    minWeight: 35.0,
    maxWeight: 120.0,
    minLength: 150,
    maxLength: 320,
    basePrice: 750,
    difficulty: 10,
    icon: '🦈',
    description: 'Hàm răng thép và sức mạnh kinh hoàng thử thách mọi cần thủ cự phách.',
    rarityColor: '#9d4edd',
  },
  goblin_shark: {
    id: 'goblin_shark',
    name: 'Cá Mập Yêu Tinh Cổ Đại',
    englishName: 'Goblin Shark',
    rarity: 'legendary',
    waterType: 'lake',
    timePreference: 'night',
    modelUrl: '/models/fish/GoblinShark.fbx',
    minWeight: 25.0,
    maxWeight: 80.0,
    minLength: 130,
    maxLength: 280,
    basePrice: 680,
    difficulty: 9,
    icon: '🦈',
    description: 'Hóa thạch sống của vực thẳm với chiếc mõm nhô dài bí ẩn.',
    rarityColor: '#9d4edd',
  },
  anglerfish: {
    id: 'anglerfish',
    name: 'Cá Lồng Đèn Ma Thuật',
    englishName: 'Anglerfish',
    rarity: 'legendary',
    waterType: 'lake',
    timePreference: 'night',
    modelUrl: '/models/fish/Anglerfish.fbx',
    minWeight: 4.0,
    maxWeight: 14.0,
    minLength: 35,
    maxLength: 70,
    basePrice: 620,
    difficulty: 8,
    icon: '🏮',
    description: 'Cần câu sinh học phát sáng mờ ảo dẫn dụ con mồi trong đêm thanh vắng.',
    rarityColor: '#9d4edd',
  },
  black_lionfish: {
    id: 'black_lionfish',
    name: 'Cá Mao Tiên Hắc Ám',
    englishName: 'Black Lionfish',
    rarity: 'legendary',
    waterType: 'lake',
    timePreference: 'night',
    modelUrl: '/models/fish/BlackLionFish.fbx',
    minWeight: 1.5,
    maxWeight: 4.5,
    minLength: 25,
    maxLength: 50,
    basePrice: 590,
    difficulty: 8,
    icon: '🦁',
    description: 'Bộ vây bóng đêm huyền bí chỉ xuất hiện khi trăng khuyết soi bóng hồ.',
    rarityColor: '#9d4edd',
  },
};

export const FISH_LIST: FishSpecies[] = Object.values(FISH_SPECIES);

// ============================================================================
// FISHING RODS
// ============================================================================
export const FISHING_RODS: Record<string, FishingRodDefinition> = {
  rod_lvl1: {
    id: 'rod_lvl1',
    level: 1,
    name: 'Cần Trúc Tập Sự',
    englishName: 'Bamboo Training Rod',
    modelUrl: '/models/fishing/FishingRod_Lvl1.fbx',
    castDistance: 9.0,
    barWidthMultiplier: 1.0,
    reelSpeedMultiplier: 1.0,
    rarityBoost: 0.0,
    price: 150,
    description: 'Cần câu trúc mộc mạc nhẹ nhàng, phù hợp cho người mới bắt đầu bên bờ suối.',
  },
  rod_lvl2: {
    id: 'rod_lvl2',
    level: 2,
    name: 'Cần Câu Gỗ Gia Cố',
    englishName: 'Reinforced Timber Rod',
    modelUrl: '/models/fishing/FishingRod_Lvl2.fbx',
    castDistance: 12.0,
    barWidthMultiplier: 1.15,
    reelSpeedMultiplier: 1.15,
    rarityBoost: 0.1,
    price: 350,
    description: 'Thân gỗ hồ đào bền bỉ với khuyên đồng chống rối dây cước hiệu quả.',
  },
  rod_lvl3: {
    id: 'rod_lvl3',
    level: 3,
    name: 'Cần Sợi Thủy Tinh',
    englishName: 'Fiberglass Pier Rod',
    modelUrl: '/models/fishing/FishingRod_Lvl3.fbx',
    castDistance: 15.0,
    barWidthMultiplier: 1.3,
    reelSpeedMultiplier: 1.25,
    rarityBoost: 0.2,
    price: 650,
    description: 'Độ đàn hồi tuyệt vời cho phép quăng mồi xa tận giữa lòng hồ Azure.',
  },
  rod_lvl4: {
    id: 'rod_lvl4',
    level: 4,
    name: 'Cần Titan Chuyên Nghiệp',
    englishName: 'Titanium Pro Rod',
    modelUrl: '/models/fishing/FishingRod_Lvl4.fbx',
    castDistance: 18.0,
    barWidthMultiplier: 1.5,
    reelSpeedMultiplier: 1.4,
    rarityBoost: 0.35,
    price: 1200,
    description: 'Khung hợp kim titan siêu nhẹ trợ lực, dễ dàng ghìm cương các loài cá lớn.',
  },
  rod_lvl5: {
    id: 'rod_lvl5',
    level: 5,
    name: 'Cần Câu Huyền Thoại Thung Lũng',
    englishName: 'Master Legend Rod',
    modelUrl: '/models/fishing/FishingRod_Lvl5.fbx',
    castDistance: 22.0,
    barWidthMultiplier: 1.75,
    reelSpeedMultiplier: 1.6,
    rarityBoost: 0.55,
    price: 2500,
    description: 'Tuyệt tác của bậc thầy thợ rèn, rực sáng ánh ngọc khi thu hút cá thần thoại.',
  },
};

export const FISHING_ROD_LIST: FishingRodDefinition[] = Object.values(FISHING_RODS);

// ============================================================================
// BAITS & LURES
// ============================================================================
export const BAITS: Record<string, BaitDefinition> = {
  worm: {
    id: 'worm',
    name: 'Giun Đất Đào Vườn',
    englishName: 'Earthworm',
    modelUrl: '/models/fishing/Worm.fbx',
    biteTimeReduction: 0.25,
    rareChanceBonus: 0.05,
    barWidthBonus: 0.05,
    icon: '🪱',
    description: 'Giun đất tươi xốp sau cơn mưa giúp cá cắn câu nhanh hơn 25%.',
    price: 10,
  },
  lure_feather: {
    id: 'lure_feather',
    name: 'Mồi Lông Vũ Nghệ Thuật',
    englishName: 'Feather Fly Lure',
    modelUrl: '/models/fishing/Lure_1.fbx',
    biteTimeReduction: 0.2,
    rareChanceBonus: 0.15,
    barWidthBonus: 0.1,
    icon: '🪶',
    description: 'Mô phỏng côn trùng mặt nước, thu hút cá hiếm tốt hơn 15%.',
    price: 35,
  },
  lure_spinner: {
    id: 'lure_spinner',
    name: 'Mồi Xoay Óng Ánh',
    englishName: 'Spinner Lure',
    modelUrl: '/models/fishing/Lure_2.fbx',
    biteTimeReduction: 0.3,
    rareChanceBonus: 0.2,
    barWidthBonus: 0.15,
    icon: '✨',
    description: 'Cánh thìa xoay tít phản chiếu ánh sáng kích thích bản năng săn mồi.',
    price: 60,
  },
  lure_master: {
    id: 'lure_master',
    name: 'Mồi Câu Hoàng Gia',
    englishName: 'Master Kraken Lure',
    modelUrl: '/models/fishing/Lure_5.fbx',
    biteTimeReduction: 0.45,
    rareChanceBonus: 0.35,
    barWidthBonus: 0.25,
    icon: '👑',
    description: 'Mồi câu thượng hạng chuyên dụng chinh phục các loài cá huyền thoại.',
    price: 150,
  },
};

export const BAIT_LIST: BaitDefinition[] = Object.values(BAITS);

// ============================================================================
// FISHING RANDOM GENERATION HELPERS
// ============================================================================
export function getRandomFish(
  waterType: WaterType,
  rodLevel = 1,
  baitId?: string,
  isNight = false
): FishSpecies {
  const bait = baitId ? BAITS[baitId] : undefined;
  const rareBonus = (rodLevel - 1) * 0.08 + (bait?.rareChanceBonus || 0);

  // Filter eligible fish
  const eligible = FISH_LIST.filter((f) => {
    // Water compatibility
    if (waterType !== 'all' && f.waterType !== 'all' && f.waterType !== waterType) {
      return false;
    }
    // Time compatibility
    if (f.timePreference === 'night' && !isNight) return false;
    if (f.timePreference === 'day' && isNight) return false;
    return true;
  });

  // Calculate weighted distribution
  // Base weights: Common 60, Uncommon 30, Rare 9, Legendary 1
  let wCommon = Math.max(15, 60 - rareBonus * 50);
  let wUncommon = 30 + rareBonus * 10;
  let wRare = 9 + rareBonus * 25;
  let wLegendary = 1 + rareBonus * 15;

  // Level 1 rods cannot catch difficulty 9-10 legendary fish
  if (rodLevel < 3) {
    wLegendary = 0;
  }

  const roll = Math.random() * (wCommon + wUncommon + wRare + wLegendary);
  let targetRarity: FishRarity = 'common';

  if (roll < wLegendary) {
    targetRarity = 'legendary';
  } else if (roll < wLegendary + wRare) {
    targetRarity = 'rare';
  } else if (roll < wLegendary + wRare + wUncommon) {
    targetRarity = 'uncommon';
  } else {
    targetRarity = 'common';
  }

  const pool = eligible.filter((f) => f.rarity === targetRarity);
  if (pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Fallback to random eligible fish or goldfish
  return eligible[Math.floor(Math.random() * eligible.length)] || FISH_SPECIES.goldfish;
}

export function generateFishStats(species: FishSpecies): {
  weight: number;
  length: number;
  price: number;
} {
  const weightRoll = Math.random();
  const weight = Number(
    (species.minWeight + weightRoll * (species.maxWeight - species.minWeight)).toFixed(2)
  );

  const lengthRoll = Math.random();
  const length = Math.round(
    species.minLength + lengthRoll * (species.maxLength - species.minLength)
  );

  // Big trophy bonus: bigger fish yields up to +35% price
  const sizeRatio = (lengthRoll + weightRoll) / 2;
  const price = Math.round(species.basePrice * (0.85 + sizeRatio * 0.45));

  return { weight, length, price };
}
