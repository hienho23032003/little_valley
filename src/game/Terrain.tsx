import React from 'react';
import { PALETTE } from '../utils/colors';
import { TERRAIN_SIZE } from '../data/worldData';

interface TerrainProps {
  size?: number;
}

export const Terrain: React.FC<TerrainProps> = React.memo(({ size = TERRAIN_SIZE }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          1. CLEANLY SEGMENTED PLAYABLE GROUND PLATES (Y = 0.0)
          The river corridor (Z: 19.0 to 23.5, X: -85 to 14.5) and
          Azure Lake basin (X: 14.5 to 73.0, Z: 20.0 to 66.0) are
          kept completely OPEN so water never Z-fights with terrain.
         ======================================================== */}

      {/* A. North Mainland (Village, Farm, Whispering Forest, Mountain Foothills) */}
      {/* Spans from Z: -85 to 19.0 across entire width X: -85 to 85. Length = 104m, Center Z = -33 */}
      <mesh position={[0, -0.05, -33]} receiveShadow>
        <boxGeometry args={[size, 0.1, 104]} />
        <meshStandardMaterial color={PALETTE.grassPrimary} roughness={0.88} flatShading />
      </mesh>

      {/* B. Southwest Mainland (South Verges & Orchard, South of River, West of Lake) */}
      {/* Spans X: -85 to 14.5 (width: 99.5m, center X = -35.25), Z: 23.5 to 85 (length: 61.5m, center Z = 54.25) */}
      <mesh position={[-35.25, -0.05, 54.25]} receiveShadow>
        <boxGeometry args={[99.5, 0.1, 61.5]} />
        <meshStandardMaterial color={PALETTE.grassPrimary} roughness={0.88} flatShading />
      </mesh>

      {/* C. Southeast Mainland (South of Azure Lake) */}
      {/* Spans X: 14.5 to 85 (width: 70.5m, center X = 49.75), Z: 66.0 to 85 (length: 19m, center Z = 75.5) */}
      <mesh position={[49.75, -0.05, 75.5]} receiveShadow>
        <boxGeometry args={[70.5, 0.1, 19]} />
        <meshStandardMaterial color={PALETTE.grassPrimary} roughness={0.88} flatShading />
      </mesh>

      {/* D. Far-East Rim (East of Azure Lake, toward Ancient Shrine) */}
      {/* Spans X: 73.0 to 85 (width: 12m, center X = 79.0), Z: 19.0 to 66.0 (length: 47m, center Z = 42.5) */}
      <mesh position={[79.0, -0.05, 42.5]} receiveShadow>
        <boxGeometry args={[12, 0.1, 47]} />
        <meshStandardMaterial color={PALETTE.grassPrimary} roughness={0.88} flatShading />
      </mesh>

      {/* ========================================================
          2. COZY DIORAMA TABLE SUBSTRUCTURE (EARTH & BEDROCK)
          Cleanly segmented beneath the landmass plates so the
          river channel and lake basin remain completely excavated.
         ======================================================== */}
      {/* A. North Mainland Subsoil */}
      <mesh position={[0, -0.95, -33]} receiveShadow>
        <boxGeometry args={[size + 0.6, 1.7, 104]} />
        <meshStandardMaterial color={PALETTE.tilledSoilDark} roughness={0.95} flatShading />
      </mesh>

      {/* B. Southwest Mainland Subsoil */}
      <mesh position={[-35.25, -0.95, 54.25]} receiveShadow>
        <boxGeometry args={[99.5 + 0.6, 1.7, 61.5]} />
        <meshStandardMaterial color={PALETTE.tilledSoilDark} roughness={0.95} flatShading />
      </mesh>

      {/* C. Southeast Mainland Subsoil */}
      <mesh position={[49.75, -0.95, 75.5]} receiveShadow>
        <boxGeometry args={[70.5 + 0.6, 1.7, 19]} />
        <meshStandardMaterial color={PALETTE.tilledSoilDark} roughness={0.95} flatShading />
      </mesh>

      {/* D. Far-East Rim Subsoil */}
      <mesh position={[79.0, -0.95, 42.5]} receiveShadow>
        <boxGeometry args={[12 + 0.6, 1.7, 47]} />
        <meshStandardMaterial color={PALETTE.tilledSoilDark} roughness={0.95} flatShading />
      </mesh>

      {/* Deep Bedrock Base (Floating Island diorama feel) */}
      <mesh position={[0, -2.6, 0]}>
        <boxGeometry args={[size - 1.2, 1.8, size - 1.2]} />
        <meshStandardMaterial color={PALETTE.cliffStone} roughness={0.98} flatShading />
      </mesh>

      {/* ========================================================
          3. NATURAL LOW-POLY RIVERBANKS & LAKE SHORELINE SLOPES
         ======================================================== */}
      {/* North Riverbank Earthen Verge (slopes from Y: 0.0 down toward water Y: -0.15) */}
      <mesh position={[-35.25, -0.08, 19.0]} rotation={[0.12, 0, 0]} receiveShadow>
        <boxGeometry args={[99.5, 0.08, 0.8]} />
        <meshStandardMaterial color={PALETTE.dirtPath} roughness={0.94} flatShading />
      </mesh>

      {/* South Riverbank Earthen Verge */}
      <mesh position={[-35.25, -0.08, 23.5]} rotation={[-0.12, 0, 0]} receiveShadow>
        <boxGeometry args={[99.5, 0.08, 0.8]} />
        <meshStandardMaterial color={PALETTE.dirtPath} roughness={0.94} flatShading />
      </mesh>

      {/* West Lake Shoreline Earthen Bank */}
      <mesh position={[14.5, -0.08, 43.0]} rotation={[0, 0, -0.12]} receiveShadow>
        <boxGeometry args={[0.8, 0.08, 45.0]} />
        <meshStandardMaterial color="#cbb892" roughness={0.95} flatShading />
      </mesh>

      {/* South Lake Shoreline Earthen Bank */}
      <mesh position={[44.0, -0.08, 66.0]} rotation={[-0.12, 0, 0]} receiveShadow>
        <boxGeometry args={[58.0, 0.08, 0.8]} />
        <meshStandardMaterial color="#cbb892" roughness={0.95} flatShading />
      </mesh>

      {/* East Lake Shoreline Earthen Bank */}
      <mesh position={[73.0, -0.08, 43.0]} rotation={[0, 0, 0.12]} receiveShadow>
        <boxGeometry args={[0.8, 0.08, 45.0]} />
        <meshStandardMaterial color="#cbb892" roughness={0.95} flatShading />
      </mesh>

      {/* ========================================================
          4. NORTHERN GRANITE MOUNTAIN WALL & CLIFFS (Z: -62 to -83)
         ======================================================== */}
      <group position={[0, 0, -73]}>
        {/* Mountain Base Tier 1 */}
        <mesh position={[0, 1.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[130, 2.4, 20]} />
          <meshStandardMaterial color={PALETTE.rockBase} roughness={0.92} flatShading />
        </mesh>
        {/* Mountain Base Tier 2 */}
        <mesh position={[-15, 3.2, -3]} receiveShadow castShadow>
          <boxGeometry args={[95, 2.8, 16]} />
          <meshStandardMaterial color={PALETTE.rockDark} roughness={0.94} flatShading />
        </mesh>
        {/* Mountain Peak Tier 3 - Western Crag */}
        <mesh position={[-38, 5.8, -4]} receiveShadow castShadow>
          <boxGeometry args={[45, 3.6, 14]} />
          <meshStandardMaterial color={PALETTE.cliffStone} roughness={0.96} flatShading />
        </mesh>
        {/* Mountain Peak Tier 3 - Eastern Crag */}
        <mesh position={[28, 5.2, -4]} receiveShadow castShadow>
          <boxGeometry args={[50, 3.2, 14]} />
          <meshStandardMaterial color={PALETTE.cliffStone} roughness={0.96} flatShading />
        </mesh>
        {/* Mountain Highest Summit */}
        <mesh position={[-12, 8.2, -6]} receiveShadow castShadow>
          <boxGeometry args={[32, 4.0, 10]} />
          <meshStandardMaterial color="#5a6268" roughness={0.95} flatShading />
        </mesh>
        {/* Snow/Frost Caps on High Peaks */}
        <mesh position={[-12, 10.3, -6]}>
          <boxGeometry args={[26, 0.4, 8]} />
          <meshStandardMaterial color="#f0f4f8" roughness={0.7} flatShading />
        </mesh>
        <mesh position={[-38, 7.7, -4]}>
          <boxGeometry args={[36, 0.35, 11]} />
          <meshStandardMaterial color="#e8eff5" roughness={0.7} flatShading />
        </mesh>
        {/* Talus & Foothill Slopes */}
        {[-48, -25, 5, 35, 52].map((x, i) => (
          <mesh
            key={`mountain-slope-${i}`}
            position={[x, 0.5, 9.5]}
            rotation={[0.3, (i % 2) * 0.2, 0]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[18 + (i % 3) * 4, 1.2, 6]} />
            <meshStandardMaterial color={PALETTE.rockBase} roughness={0.92} flatShading />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          5. EASTERN SUNLIT MEADOW ROLLING HILLS (X: 35 to 75, Z: -25 to 25)
         ======================================================== */}
      <group>
        {/* Hill 1 - Northeast gentle knoll */}
        <mesh position={[48, 0.3, -15]} receiveShadow>
          <boxGeometry args={[32, 0.6, 26]} />
          <meshStandardMaterial color={PALETTE.grassSecondary} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[52, 0.8, -14]} receiveShadow>
          <boxGeometry args={[20, 0.5, 16]} />
          <meshStandardMaterial color={PALETTE.grassPrimary} roughness={0.9} flatShading />
        </mesh>
        {/* Hill 2 - Southeast ridge overlooking lake */}
        <mesh position={[45, 0.35, 12]} receiveShadow>
          <boxGeometry args={[28, 0.7, 20]} />
          <meshStandardMaterial color={PALETTE.grassSecondary} roughness={0.9} flatShading />
        </mesh>
        {/* Hill 3 - Far East high meadow */}
        <mesh position={[68, 0.5, 2]} receiveShadow>
          <boxGeometry args={[22, 1.0, 34]} />
          <meshStandardMaterial color={PALETTE.grassDark} roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* ========================================================
          6. WESTERN WHISPERING FOREST ELEVATIONS (X: -45 to -75, Z: -35 to -60)
         ======================================================== */}
      <group>
        <mesh position={[-55, 0.35, -45]} receiveShadow>
          <boxGeometry args={[32, 0.7, 28]} />
          <meshStandardMaterial color={PALETTE.grassDark} roughness={0.92} flatShading />
        </mesh>
        <mesh position={[-62, 0.85, -50]} receiveShadow>
          <boxGeometry args={[20, 0.6, 18]} />
          <meshStandardMaterial color="#5b9338" roughness={0.92} flatShading />
        </mesh>
      </group>

      {/* ========================================================
          7. ANCIENT SHRINE RAISED DAIS (X: 58, Z: 58)
         ======================================================== */}
      <group position={[58, 0, 58]}>
        {/* Lower flagstone base */}
        <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
          <boxGeometry args={[18, 0.3, 18]} />
          <meshStandardMaterial color={PALETTE.rockLight} roughness={0.9} flatShading />
        </mesh>
        {/* Upper inner dais */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.3, 12]} />
          <meshStandardMaterial color={PALETTE.rockBase} roughness={0.88} flatShading />
        </mesh>
        {/* Center altar pedestal */}
        <mesh position={[0, 0.9, 0]} receiveShadow castShadow>
          <boxGeometry args={[4, 0.6, 4]} />
          <meshStandardMaterial color={PALETTE.cliffStone} roughness={0.85} flatShading />
        </mesh>
        {/* Ancient Relic / Mystical Stone on Altar */}
        <mesh position={[0, 1.55, 0]} rotation={[0.4, 0.6, 0.2]} castShadow>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#a8dadc"
            emissive="#457b9d"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.4}
            flatShading
          />
        </mesh>
        {/* 4 Standing Monolith Pillars */}
        {[-4.5, 4.5].map((px) =>
          [-4.5, 4.5].map((pz) => (
            <group key={`shrine-pillar-${px}-${pz}`} position={[px, 0.6, pz]}>
              <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.9, 2.6, 0.9]} />
                <meshStandardMaterial color={PALETTE.rockDark} roughness={0.95} flatShading />
              </mesh>
              {/* Pillar runic inset */}
              <mesh position={[0, 1.8, 0.46]}>
                <boxGeometry args={[0.3, 0.6, 0.05]} />
                <meshStandardMaterial
                  color="#e0fbfc"
                  emissive="#00b4d8"
                  emissiveIntensity={0.7}
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
