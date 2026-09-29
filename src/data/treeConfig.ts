import { PALETTE } from '../utils/colors';

export type TreeVariant =
  | 'small_oak'
  | 'large_oak'
  | 'pine'
  | 'tall_pine'
  | 'fruit_tree'
  | 'autumn_amber'
  | 'flowering_blossom'
  | 'sapling'
  | 'dead_tree';

export interface TreeVariantConfig {
  id: TreeVariant;
  name: string;
  trunkColor: string;
  foliageColor: string;
  accentColor?: string;
  trunkHeight: number;
  trunkRadius: number;
  canopyType: 'spheres' | 'cones' | 'pyramids' | 'bare' | 'blossom';
}

export const TREE_VARIANTS: Record<TreeVariant, TreeVariantConfig> = {
  small_oak: {
    id: 'small_oak',
    name: 'Small Oak',
    trunkColor: PALETTE.woodDark,
    foliageColor: PALETTE.oakGreen,
    trunkHeight: 1.6,
    trunkRadius: 0.2,
    canopyType: 'spheres',
  },
  large_oak: {
    id: 'large_oak',
    name: 'Ancient Oak',
    trunkColor: '#5c3a1e',
    foliageColor: '#4f9448',
    trunkHeight: 2.6,
    trunkRadius: 0.34,
    canopyType: 'spheres',
  },
  pine: {
    id: 'pine',
    name: 'Whispering Pine',
    trunkColor: '#4d3319',
    foliageColor: PALETTE.pineDark,
    trunkHeight: 2.8,
    trunkRadius: 0.22,
    canopyType: 'cones',
  },
  tall_pine: {
    id: 'tall_pine',
    name: 'Tall Alpine Pine',
    trunkColor: '#3d2814',
    foliageColor: '#2d5a3f',
    trunkHeight: 4.2,
    trunkRadius: 0.24,
    canopyType: 'cones',
  },
  fruit_tree: {
    id: 'fruit_tree',
    name: 'Apple Orchard Tree',
    trunkColor: PALETTE.woodMedium,
    foliageColor: '#68ad58',
    accentColor: '#e63946', // Red apples
    trunkHeight: 1.8,
    trunkRadius: 0.22,
    canopyType: 'spheres',
  },
  autumn_amber: {
    id: 'autumn_amber',
    name: 'Golden Birch',
    trunkColor: '#f0ece1', // Birch white trunk
    foliageColor: PALETTE.oakAutumn, // Amber/gold
    trunkHeight: 2.2,
    trunkRadius: 0.2,
    canopyType: 'spheres',
  },
  flowering_blossom: {
    id: 'flowering_blossom',
    name: 'Flowering Willow',
    trunkColor: '#5a4d41',
    foliageColor: '#f4acb7', // Delicate pink blossom
    accentColor: '#ffcad4',
    trunkHeight: 2.2,
    trunkRadius: 0.22,
    canopyType: 'blossom',
  },
  sapling: {
    id: 'sapling',
    name: 'Young Sapling',
    trunkColor: PALETTE.woodLight,
    foliageColor: PALETTE.oakLight,
    trunkHeight: 1.1,
    trunkRadius: 0.12,
    canopyType: 'spheres',
  },
  dead_tree: {
    id: 'dead_tree',
    name: 'Weathered Snag',
    trunkColor: '#7d746d',
    foliageColor: '#7d746d',
    trunkHeight: 2.2,
    trunkRadius: 0.24,
    canopyType: 'bare',
  },
};
