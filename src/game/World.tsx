import React, { useMemo } from 'react';
import { Terrain } from './Terrain';
import { River } from '../entities/River';
import { Bridge } from '../entities/Bridge';
import { Path } from '../entities/Path';
import { House } from '../entities/House';
import { FenceLine } from '../entities/Fence';
import { HayBale, WaterTrough } from '../entities/FarmPlot';
import { FarmingField } from '../entities/FarmingField';
import { AnimalsManager } from '../entities/animals/AnimalsManager';
import { BuildingPlacementManager } from '../entities/buildings/BuildingPlacementManager';
import { VillageWell, Signpost, VillageBench, LanternPost } from '../entities/VillageDecor';
import { InstancedFoliage } from '../entities/environment/InstancedFoliage';
import { WorldPointsOfInterest } from '../entities/environment/WorldPointsOfInterest';
import { Player } from '../entities/Player';
import { CollisionDebugger } from './CollisionDebugger';
import { HOUSES, RIVER_BOUNDS, TERRAIN_SIZE, generateWorldNature } from '../data/worldData';

export const World: React.FC = React.memo(() => {
  // Deterministically generate trees, rocks, bushes, flowers, grass tufts, mushrooms, and logs
  const nature = useMemo(() => generateWorldNature(), []);

  return (
    <group>
      {/* 1. Base Terrain (Expanded 170x170m Diorama with Mountains, Hills, & Shrine Dais) */}
      <Terrain size={TERRAIN_SIZE} />

      {/* 2. Clearwater River & Azure Lake with Fishing Pier & Moored Rowboat */}
      <River centerZ={(RIVER_BOUNDS.minZ + RIVER_BOUNDS.maxZ) / 2} />

      {/* 3. Wooden Arched Bridge spanning Clearwater River */}
      <Bridge position={[0, 0, (RIVER_BOUNDS.minZ + RIVER_BOUNDS.maxZ) / 2]} />

      {/* 4. Interconnecting Dirt Paths, Arterial Highway, Cobblestone Plaza & Stepping Stones */}
      <Path />

      {/* 5. Village & World Modular Buildings (Town Hall, General Store, Forge, Bakery, Cottages, Barn) */}
      {HOUSES.map((house) => (
        <House
          key={house.id}
          config={house.config}
          position={house.position}
          rotation={house.rotation}
          scale={house.scale}
          roofColor={house.roofColor}
          wallColor={house.wallColor}
          hasChimney={house.hasChimney}
          hasPorch={house.hasPorch}
        />
      ))}

      {/* 6. Active Farmstead Area */}
      <group>
        {/* Animals & Dedicated Pastures (Chickens, Cows, Sheep) */}
        <AnimalsManager />

        {/* Interactive 4x4 Farming Field (Plowing, Planting, Watering, Harvesting) */}
        <FarmingField />

        {/* Farm Wooden Fencing */}
        {/* Right field fence */}
        <FenceLine start={[4.5, 5.5]} end={[13.5, 5.5]} />
        <FenceLine start={[13.5, 5.5]} end={[13.5, 16.5]} />
        <FenceLine start={[13.5, 16.5]} end={[4.5, 16.5]} />
        <FenceLine start={[4.5, 16.5]} end={[4.5, 10.5]} />
        {/* Opening between Z=7.5 and Z=10.5 for player to walk in */}
        <FenceLine start={[4.5, 7.5]} end={[4.5, 5.5]} />

        {/* Farm Props */}
        <HayBale position={[3.5, 0, 6.0]} rotation={0.4} />
        <HayBale position={[3.6, 0, 6.4]} rotation={-0.3} />
        <HayBale position={[3.6, 0.7, 6.2]} rotation={0.8} />
        <WaterTrough position={[-6.0, 0, 6.5]} rotation={0.2} />
      </group>

      {/* 7. Village Center Decor (Well, Signpost, Benches, Lanterns) */}
      <group>
        {/* Village Centerpiece: Rustic Well on Cobblestone Plaza */}
        <VillageWell position={[0, 0, -10]} />

        {/* Crossroads Signpost */}
        <Signpost position={[2.4, 0, -2.5]} rotation={-0.3} />

        {/* Village Plaza Benches */}
        <VillageBench position={[-3.8, 0, -10]} rotation={Math.PI / 2} />
        <VillageBench position={[3.8, 0, -10]} rotation={-Math.PI / 2} />

        {/* Street Lantern Posts */}
        <LanternPost position={[-2.4, 0, -19.5]} />
        <LanternPost position={[2.4, 0, -19.5]} />
        <LanternPost position={[-2.4, 0, -14.5]} />
        <LanternPost position={[2.4, 0, -14.5]} />
        <LanternPost position={[-2.4, 0, -6.5]} />
        <LanternPost position={[2.4, 0, -6.5]} />
        <LanternPost position={[-2.4, 0, 1.5]} />
        <LanternPost position={[2.4, 0, 15.5]} />
        <LanternPost position={[-2.4, 0, 27.0]} />
        <LanternPost position={[-2.4, 0, -38.0]} />
        <LanternPost position={[2.4, 0, -50.0]} />
      </group>

      {/* 8. Regional Points of Interest (Granite Mine, Woodcutter Campsite, Market Stalls, Lake Pier, Shrine) */}
      <WorldPointsOfInterest />

      {/* 9. Instanced Nature Foliage (Hundreds of trees, rocks, bushes, wildflowers, grass, mushrooms, logs) */}
      <InstancedFoliage
        trees={nature.trees}
        rocks={nature.rocks}
        bushes={nature.bushes}
        flowers={nature.flowers}
        grassTufts={nature.grassTufts}
        mushrooms={nature.mushrooms}
        fallenLogs={nature.fallenLogs}
      />

      {/* 10. Player Constructed & Placed Buildings & Ghost Placement */}
      <BuildingPlacementManager />

      {/* 11. Player Character */}
      <Player />

      {/* 12. Development Collision Debugger (Toggle via F9 or backtick) */}
      <CollisionDebugger />
    </group>
  );
});
