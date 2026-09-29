import React from 'react';
import { PALETTE } from '../utils/colors';
import { ModularBuildingConfig } from '../data/buildingConfigs';
import { ModularBuilding } from './buildings/modular/BuildingModular';

export interface HouseProps {
  config?: ModularBuildingConfig;
  position?: [number, number, number];
  rotation?: number;
  scale?: [number, number, number];
  roofColor?: string;
  wallColor?: string;
  hasChimney?: boolean;
  hasPorch?: boolean;
}

export const House: React.FC<HouseProps> = React.memo(({
  config,
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
  scale = [1, 1, 1] as [number, number, number],
  roofColor = PALETTE.roofTerracotta,
  wallColor = PALETTE.housePlasterWhite,
  hasChimney = true,
  hasPorch = true,
}: HouseProps) => {
  if (config) {
    return <ModularBuilding config={config} />;
  }

  // Fallback building configuration with rich modular features
  const fallbackConfig: ModularBuildingConfig = {
    id: `house-${position.join('-')}`,
    name: 'Cozy Cottage',
    type: 'village_house',
    position,
    rotation,
    scale,
    width: 4.6,
    depth: 3.8,
    height: 2.3,
    foundationHeight: 0.35,
    wallStyle: 'timber_frame_plaster',
    wallColor,
    roofStyle: 'extended_gable',
    roofHeight: 1.8,
    roofColor,
    roofOverhang: 0.35,
    doorStyle: 'single_timber',
    hasChimney,
    chimneyPosition: [1.2, 0, -0.6],
    chimneyHeight: 2.1,
    chimneyMaterial: 'brick',
    hasPorch,
    porchConfig: {
      width: 2.4,
      depth: 1.1,
      hasAwning: true,
      hasRailings: true,
    },
    windows: [
      { position: [-1.2, 1.3, 1.91], style: 'shutters', hasFlowerBox: true },
      { position: [1.2, 1.3, 1.91], style: 'shutters', hasFlowerBox: true },
      { position: [2.31, 1.3, 0], rotation: [0, Math.PI / 2, 0], style: 'cross_mullion' },
    ],
    decorations: {
      hasBarrels: true,
      barrelPositions: [[-1.8, 0, 2.3]],
    },
  };

  return <ModularBuilding config={fallbackConfig} />;
});
