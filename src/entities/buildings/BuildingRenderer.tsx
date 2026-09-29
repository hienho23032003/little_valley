import React from 'react';
import { ChickenCoopBuilding } from './ChickenCoopBuilding';
import { BarnBuilding } from './BarnBuilding';
import { SiloBuilding } from './SiloBuilding';
import { StorageShedBuilding } from './StorageShedBuilding';
import { BakeryBuilding } from './BakeryBuilding';
import { WindmillBuilding } from './WindmillBuilding';

interface BuildingRendererProps {
  buildingTypeId: string;
  isGhost?: boolean;
  isValid?: boolean;
}

export const BuildingRenderer: React.FC<BuildingRendererProps> = ({
  buildingTypeId,
  isGhost = false,
  isValid = true,
}) => {
  switch (buildingTypeId) {
    case 'chicken_coop':
      return <ChickenCoopBuilding isGhost={isGhost} isValid={isValid} />;
    case 'barn':
      return <BarnBuilding isGhost={isGhost} isValid={isValid} />;
    case 'silo':
      return <SiloBuilding isGhost={isGhost} isValid={isValid} />;
    case 'storage_shed':
      return <StorageShedBuilding isGhost={isGhost} isValid={isValid} />;
    case 'bakery':
      return <BakeryBuilding isGhost={isGhost} isValid={isValid} />;
    case 'windmill':
      return <WindmillBuilding isGhost={isGhost} isValid={isValid} />;
    default:
      return null;
  }
};
