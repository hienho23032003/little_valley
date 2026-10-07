import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TERRAIN_SIZE } from '../data/worldData';

interface TerrainProps {
  size?: number;
}

export const Terrain: React.FC<TerrainProps> = React.memo(({ size = TERRAIN_SIZE }) => {
  // Load Medieval Village MegaKit ground and stone textures
  const [terrainNoise, rockBase, rockNormal, brickBase, brickNormal] = useTexture([
    '/textures/terrain/T_Noise_Terrain.png',
    '/textures/terrain/T_RockTrim_BaseColor.png',
    '/textures/terrain/T_RockTrim_Normal.png',
    '/textures/terrain/T_UnevenBrick_BaseColor.png',
    '/textures/terrain/T_UnevenBrick_Normal.png',
  ]);

  // Configure seamless texture tiling
  useMemo(() => {
    terrainNoise.wrapS = terrainNoise.wrapT = THREE.RepeatWrapping;
    terrainNoise.repeat.set(48, 48);

    rockBase.wrapS = rockBase.wrapT = THREE.RepeatWrapping;
    rockBase.repeat.set(14, 4);

    rockNormal.wrapS = rockNormal.wrapT = THREE.RepeatWrapping;
    rockNormal.repeat.set(14, 4);

    brickBase.wrapS = brickBase.wrapT = THREE.RepeatWrapping;
    brickBase.repeat.set(6, 6);

    brickNormal.wrapS = brickNormal.wrapT = THREE.RepeatWrapping;
    brickNormal.repeat.set(6, 6);
  }, [terrainNoise, rockBase, rockNormal, brickBase, brickNormal]);

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          1. CLEANLY SEGMENTED PLAYABLE GROUND PLATES (Y = 0.0)
          Textured with Medieval MegaKit T_Noise_Terrain for organic grass & soil
         ======================================================== */}

      {/* A. North Mainland (Village, Farm, Whispering Forest, Mountain Foothills) */}
      <mesh position={[0, -0.05, -33]} receiveShadow>
        <boxGeometry args={[size, 0.1, 104]} />
        <meshStandardMaterial
          color="#7cbd6a"
          roughness={0.88}
          map={terrainNoise}
          roughnessMap={terrainNoise}
        />
      </mesh>

      {/* B. Southwest Mainland (South Verges & Orchard, South of River, West of Lake) */}
      <mesh position={[-35.25, -0.05, 54.25]} receiveShadow>
        <boxGeometry args={[99.5, 0.1, 61.5]} />
        <meshStandardMaterial
          color="#7cbd6a"
          roughness={0.88}
          map={terrainNoise}
          roughnessMap={terrainNoise}
        />
      </mesh>

      {/* C. Southeast Mainland (South of Azure Lake) */}
      <mesh position={[49.75, -0.05, 75.5]} receiveShadow>
        <boxGeometry args={[70.5, 0.1, 19]} />
        <meshStandardMaterial
          color="#6ea35d"
          roughness={0.88}
          map={terrainNoise}
          roughnessMap={terrainNoise}
        />
      </mesh>

      {/* D. Far-East Rim (East of Azure Lake, toward Ancient Shrine) */}
      <mesh position={[79.0, -0.05, 42.5]} receiveShadow>
        <boxGeometry args={[12, 0.1, 47]} />
        <meshStandardMaterial
          color="#7cbd6a"
          roughness={0.88}
          map={terrainNoise}
          roughnessMap={terrainNoise}
        />
      </mesh>

      {/* ========================================================
          2. MEDIEVAL DIORAMA SUBSTRUCTURE (ROCK TRIM & BEDROCK)
         ======================================================== */}
      {/* A. North Mainland Subsoil */}
      <mesh position={[0, -0.95, -33]} receiveShadow>
        <boxGeometry args={[size + 0.6, 1.7, 104]} />
        <meshStandardMaterial
          color="#7f5539"
          roughness={0.92}
          map={rockBase}
          normalMap={rockNormal}
        />
      </mesh>

      {/* B. Southwest Mainland Subsoil */}
      <mesh position={[-35.25, -0.95, 54.25]} receiveShadow>
        <boxGeometry args={[99.5 + 0.6, 1.7, 61.5]} />
        <meshStandardMaterial
          color="#7f5539"
          roughness={0.92}
          map={rockBase}
          normalMap={rockNormal}
        />
      </mesh>

      {/* C. Southeast Mainland Subsoil */}
      <mesh position={[49.75, -0.95, 75.5]} receiveShadow>
        <boxGeometry args={[70.5 + 0.6, 1.7, 19]} />
        <meshStandardMaterial
          color="#7f5539"
          roughness={0.92}
          map={rockBase}
          normalMap={rockNormal}
        />
      </mesh>

      {/* D. Far-East Rim Subsoil */}
      <mesh position={[79.0, -0.95, 42.5]} receiveShadow>
        <boxGeometry args={[12 + 0.6, 1.7, 47]} />
        <meshStandardMaterial
          color="#7f5539"
          roughness={0.92}
          map={rockBase}
          normalMap={rockNormal}
        />
      </mesh>

      {/* Deep Bedrock Base (Floating Island diorama feel) */}
      <mesh position={[0, -2.6, 0]}>
        <boxGeometry args={[size - 1.2, 1.8, size - 1.2]} />
        <meshStandardMaterial
          color="#495057"
          roughness={0.95}
          map={rockBase}
          normalMap={rockNormal}
        />
      </mesh>

      {/* ========================================================
          3. NATURAL RIVERBANKS & LAKE SHORELINE SLOPES
         ======================================================== */}
      {/* North Riverbank Earthen Verge */}
      <mesh position={[-35.25, -0.08, 19.0]} rotation={[0.12, 0, 0]} receiveShadow>
        <boxGeometry args={[99.5, 0.08, 0.8]} />
        <meshStandardMaterial
          color="#b08968"
          roughness={0.92}
          map={terrainNoise}
        />
      </mesh>

      {/* South Riverbank Earthen Verge */}
      <mesh position={[-35.25, -0.08, 23.5]} rotation={[-0.12, 0, 0]} receiveShadow>
        <boxGeometry args={[99.5, 0.08, 0.8]} />
        <meshStandardMaterial
          color="#b08968"
          roughness={0.92}
          map={terrainNoise}
        />
      </mesh>

      {/* West Lake Shoreline Earthen Bank */}
      <mesh position={[14.5, -0.08, 43.0]} rotation={[0, 0, -0.12]} receiveShadow>
        <boxGeometry args={[0.8, 0.08, 45.0]} />
        <meshStandardMaterial color="#cbb892" roughness={0.95} map={terrainNoise} />
      </mesh>

      {/* South Lake Shoreline Earthen Bank */}
      <mesh position={[44.0, -0.08, 66.0]} rotation={[-0.12, 0, 0]} receiveShadow>
        <boxGeometry args={[58.0, 0.08, 0.8]} />
        <meshStandardMaterial color="#cbb892" roughness={0.95} map={terrainNoise} />
      </mesh>

      {/* East Lake Shoreline Earthen Bank */}
      <mesh position={[73.0, -0.08, 43.0]} rotation={[0, 0, 0.12]} receiveShadow>
        <boxGeometry args={[0.8, 0.08, 45.0]} />
        <meshStandardMaterial color="#cbb892" roughness={0.95} map={terrainNoise} />
      </mesh>

      {/* ========================================================
          4. NORTHERN GRANITE MOUNTAIN WALL & CLIFFS
         ======================================================== */}
      <group position={[0, 0, -73]}>
        {/* Mountain Base Tier 1 */}
        <mesh position={[0, 1.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[130, 2.4, 20]} />
          <meshStandardMaterial
            color="#5c677d"
            roughness={0.9}
            map={rockBase}
            normalMap={rockNormal}
          />
        </mesh>
        {/* Mountain Base Tier 2 */}
        <mesh position={[-15, 3.2, -3]} receiveShadow castShadow>
          <boxGeometry args={[95, 2.8, 16]} />
          <meshStandardMaterial
            color="#495057"
            roughness={0.92}
            map={rockBase}
            normalMap={rockNormal}
          />
        </mesh>
        {/* Western Crag Peak */}
        <mesh position={[-38, 5.8, -4]} receiveShadow castShadow>
          <boxGeometry args={[45, 3.6, 14]} />
          <meshStandardMaterial
            color="#343a40"
            roughness={0.94}
            map={rockBase}
            normalMap={rockNormal}
          />
        </mesh>
        {/* Eastern Crag Peak */}
        <mesh position={[28, 5.2, -4]} receiveShadow castShadow>
          <boxGeometry args={[50, 3.2, 14]} />
          <meshStandardMaterial
            color="#343a40"
            roughness={0.94}
            map={rockBase}
            normalMap={rockNormal}
          />
        </mesh>
        {/* Mountain Highest Summit */}
        <mesh position={[-12, 8.2, -6]} receiveShadow castShadow>
          <boxGeometry args={[32, 4.0, 10]} />
          <meshStandardMaterial color="#212529" roughness={0.95} map={rockBase} normalMap={rockNormal} />
        </mesh>
        {/* Snow Frost Caps on High Peaks */}
        <mesh position={[-12, 10.3, -6]}>
          <boxGeometry args={[26, 0.4, 8]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.6} />
        </mesh>
        <mesh position={[-38, 7.7, -4]}>
          <boxGeometry args={[36, 0.35, 11]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.6} />
        </mesh>
      </group>

      {/* ========================================================
          5. EASTERN SUNLIT MEADOW ROLLING HILLS
         ======================================================== */}
      <group>
        <mesh position={[48, 0.3, -15]} receiveShadow>
          <boxGeometry args={[32, 0.6, 26]} />
          <meshStandardMaterial color="#52b788" roughness={0.88} map={terrainNoise} />
        </mesh>
        <mesh position={[52, 0.8, -14]} receiveShadow>
          <boxGeometry args={[20, 0.5, 16]} />
          <meshStandardMaterial color="#74c69d" roughness={0.88} map={terrainNoise} />
        </mesh>
        <mesh position={[45, 0.35, 12]} receiveShadow>
          <boxGeometry args={[28, 0.7, 20]} />
          <meshStandardMaterial color="#52b788" roughness={0.88} map={terrainNoise} />
        </mesh>
        <mesh position={[68, 0.5, 2]} receiveShadow>
          <boxGeometry args={[22, 1.0, 34]} />
          <meshStandardMaterial color="#40916c" roughness={0.88} map={terrainNoise} />
        </mesh>
      </group>

      {/* ========================================================
          6. WESTERN WHISPERING FOREST ELEVATIONS
         ======================================================== */}
      <group>
        <mesh position={[-55, 0.35, -45]} receiveShadow>
          <boxGeometry args={[32, 0.7, 28]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.9} map={terrainNoise} />
        </mesh>
        <mesh position={[-62, 0.85, -50]} receiveShadow>
          <boxGeometry args={[20, 0.6, 18]} />
          <meshStandardMaterial color="#40916c" roughness={0.9} map={terrainNoise} />
        </mesh>
      </group>

      {/* ========================================================
          7. ANCIENT SHRINE RAISED DAIS (Uneven Brick Textures)
         ======================================================== */}
      <group position={[58, 0, 58]}>
        {/* Lower flagstone base */}
        <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
          <boxGeometry args={[18, 0.3, 18]} />
          <meshStandardMaterial
            color="#adb5bd"
            roughness={0.85}
            map={brickBase}
            normalMap={brickNormal}
          />
        </mesh>
        {/* Upper inner dais */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.3, 12]} />
          <meshStandardMaterial
            color="#ced4da"
            roughness={0.85}
            map={brickBase}
            normalMap={brickNormal}
          />
        </mesh>
        {/* Center altar pedestal */}
        <mesh position={[0, 0.9, 0]} receiveShadow castShadow>
          <boxGeometry args={[4, 0.6, 4]} />
          <meshStandardMaterial
            color="#495057"
            roughness={0.85}
            map={rockBase}
            normalMap={rockNormal}
          />
        </mesh>
        {/* Ancient Relic / Mystical Stone on Altar */}
        <mesh position={[0, 1.55, 0]} rotation={[0.4, 0.6, 0.2]} castShadow>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#a8dadc"
            emissive="#457b9d"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        {/* 4 Standing Monolith Pillars */}
        {[-4.5, 4.5].map((px) =>
          [-4.5, 4.5].map((pz) => (
            <group key={`shrine-pillar-${px}-${pz}`} position={[px, 0.6, pz]}>
              <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.9, 2.6, 0.9]} />
                <meshStandardMaterial
                  color="#343a40"
                  roughness={0.92}
                  map={rockBase}
                  normalMap={rockNormal}
                />
              </mesh>
              <mesh position={[0, 1.8, 0.46]}>
                <boxGeometry args={[0.3, 0.6, 0.05]} />
                <meshStandardMaterial
                  color="#e0fbfc"
                  emissive="#00b4d8"
                  emissiveIntensity={0.8}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))
        )}
      </group>
    </group>
  );
});

// Preload terrain textures
useTexture.preload('/textures/terrain/T_Noise_Terrain.png');
useTexture.preload('/textures/terrain/T_RockTrim_BaseColor.png');
useTexture.preload('/textures/terrain/T_RockTrim_Normal.png');
useTexture.preload('/textures/terrain/T_UnevenBrick_BaseColor.png');
useTexture.preload('/textures/terrain/T_UnevenBrick_Normal.png');
