export type CharacterId = 'knight' | 'mage' | 'barbarian' | 'ranger' | 'rogue' | 'rogue_hooded';

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  subtitle: string;
  description: string;
  perk: string;
  modelFile: string;
  avatar: string;
  tintMeshName?: string;
  speedMultiplier: number;
}

export const CHARACTERS: Record<CharacterId, CharacterDefinition> = {
  knight: {
    id: 'knight',
    name: 'Hiệp sĩ',
    subtitle: 'Vững vàng, mạnh mẽ',
    description: 'Chiến binh quả cảm với bộ giáp vững chắc, sẵn sàng bảo vệ ngôi làng khỏi mọi hiểm nguy.',
    perk: 'Vững vàng, chăm chỉ — thu hoạch nhanh hơn 5%.',
    modelFile: '/models/characters/Knight.glb',
    avatar: '/images/avatars/knight.png',
    tintMeshName: 'Knight_Cape',
    speedMultiplier: 1.0,
  },
  mage: {
    id: 'mage',
    name: 'Pháp sư',
    subtitle: 'Khám phá, bí ẩn',
    description: 'Bậc thầy về thảo mộc và phép màu nguyên tố, am hiểu bí mật của các loại thực vật cổ xưa.',
    perk: 'Thông thái, am hiểu — tăng 10% kinh nghiệm và tốc độ tạo phép.',
    modelFile: '/models/characters/Mage.glb',
    avatar: '/images/avatars/mage.png',
    tintMeshName: 'Mage_Cape',
    speedMultiplier: 1.0,
  },
  barbarian: {
    id: 'barbarian',
    name: 'Nông dân',
    subtitle: 'Gần gũi, chăm chỉ',
    description: 'Người gắn bó sâu sắc với đất đai, có sức khỏe dẻo dai và đôi bàn tay chăm bón tài hoa.',
    perk: 'Gắn kết đất đai — cây trồng tưới nước giữ ẩm lâu hơn.',
    modelFile: '/models/characters/Barbarian.glb',
    avatar: '/images/avatars/barbarian.png',
    tintMeshName: 'Barbarian_BearHat',
    speedMultiplier: 1.05,
  },
  ranger: {
    id: 'ranger',
    name: 'Thợ săn',
    subtitle: 'Nhanh nhẹn, dũng cảm',
    description: 'Bậc thầy theo dấu trong rừng sâu, tinh anh và am tường địa hình thung lũng.',
    perk: 'Nhanh nhẹn, tinh anh — tốc độ di chuyển tăng 10%.',
    modelFile: '/models/characters/Ranger.glb',
    avatar: '/images/avatars/ranger.png',
    tintMeshName: 'Ranger_Cape',
    speedMultiplier: 1.1,
  },
  rogue: {
    id: 'rogue',
    name: 'Cư dân',
    subtitle: 'Thân thiện, hoà đồng',
    description: 'Người dân thân thiện của Little Valley, luôn niềm nở và có tài thương lượng buôn bán.',
    perk: 'Thân thiện, khéo léo — giá bán nông sản tại cửa hàng tăng 8%.',
    modelFile: '/models/characters/Rogue.glb',
    avatar: '/images/avatars/rogue.png',
    tintMeshName: 'Rogue_Cape',
    speedMultiplier: 1.05,
  },
  rogue_hooded: {
    id: 'rogue_hooded',
    name: 'Lữ khách',
    subtitle: 'Tự do, phiêu lưu',
    description: 'Kẻ phiêu bạt giang hồ yêu chuộng tự do, đã chu du qua muôn vàn vùng đất mới lạ.',
    perk: 'Tự do, dẻo dai — hồi phục thể lực nhanh hơn khi thám hiểm.',
    modelFile: '/models/characters/Rogue_Hooded.glb',
    avatar: '/images/avatars/rogue_hooded.png',
    tintMeshName: 'RogueHooded_Cape',
    speedMultiplier: 1.05,
  },
};

export const CHARACTER_LIST: CharacterDefinition[] = Object.values(CHARACTERS);

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'silver', label: 'Bạc / Thép', hex: '#94a3b8' },
  { id: 'coral', label: 'Hồng San Hô', hex: '#f87171' },
  { id: 'blue', label: 'Xanh Biển', hex: '#60a5fa' },
  { id: 'green', label: 'Xanh Lá', hex: '#86efac' },
  { id: 'gold', label: 'Vàng Ánh Kim', hex: '#facc15' },
  { id: 'purple', label: 'Tím Mộng Mơ', hex: '#c084fc' },
];

export const DEFAULT_NAMES = [
  'Arthur',
  'Maya',
  'Robin',
  'Luke',
  'Luna',
  'Kai',
  'Elena',
  'Milo',
  'Hana',
  'Oliver',
  'Zoe',
  'Felix',
  'Bảo An',
  'Minh Khôi',
  'Ánh Dương',
];

export const DEFAULT_FARM_NAMES = [
  'Nông trại Mây Hồng',
  'Nông trại Bình Minh',
  'Nông trại Thung Lũng Xanh',
  'Nông trại Nắng Ấm',
  'Nông trại Ngôi Sao',
  'Nông trại Cỏ May',
  'Nông trại Trăng Tròn',
];
