import React from 'react';
import { PALETTE } from '../utils/colors';

interface PathSegmentProps {
  position: [number, number, number];
  size: [number, number]; // [width, length]
  rotation?: number;
  type?: 'main' | 'village' | 'farm' | 'trail' | 'cobble';
  layerOffset?: number;
}

const PathSegment: React.FC<PathSegmentProps> = React.memo(({
  position,
  size,
  rotation = 0,
  type = 'village',
  layerOffset = 0,
}) => {
  const isCobble = type === 'cobble';
  const isMain = type === 'main';
  const isTrail = type === 'trail';
  const isFarm = type === 'farm';

  const baseColor = isCobble
    ? '#b8b2a6'
    : isMain
    ? '#c49a6c'
    : isFarm
    ? '#ad8557'
    : isTrail
    ? '#997b66'
    : '#bf9b6d';

  // Strict monotonic vertical clearance and polygonOffset hierarchy to eliminate coplanar intersection jitter:
  // Base Terrain: Y = 0.00
  // Main Thoroughfare: Y = 0.020 (offset -2)
  // Regional Trails: Y = 0.022 (offset -2)
  // Village Arterials: Y = 0.025 (offset -3)
  // Farm Branches: Y = 0.027 (offset -4)
  // Cobblestone Forecourts & Piazza: Y = 0.030 (offset -5)
  // Stepping Stones & Rocks: Y = 0.035+
  const baseOffset = isCobble ? 0.030 : isFarm ? 0.027 : isMain ? 0.020 : isTrail ? 0.022 : 0.025;
  const yOffset = baseOffset + layerOffset * 0.002;
  const basePoly = isCobble ? -5 : isFarm ? -4 : isMain ? -2 : isTrail ? -2 : -3;
  const polyOffset = basePoly - layerOffset;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, yOffset, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size[0], size[1]]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.92}
          flatShading
          polygonOffset
          polygonOffsetFactor={polyOffset}
          polygonOffsetUnits={polyOffset}
        />
      </mesh>
    </group>
  );
});

export const Path: React.FC = React.memo(() => {
  return (
    <group>
      {/* ========================================================
          1. VILLAGE CENTRAL PLAZA & WELL COBBLESTONE PAVING
         ======================================================== */}
      {/* Central Cobblestone Round Piazza around the Village Well (X: 0, Z: -10) */}
      <mesh position={[0, 0.030, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.4, 24]} />
        <meshStandardMaterial
          color="#b8b2a6"
          roughness={0.92}
          flatShading
          polygonOffset
          polygonOffsetFactor={-5}
          polygonOffsetUnits={-5}
        />
      </mesh>

      {/* Town Hall Forecourt Plaza Entrance (Z: -15 to -22) */}
      <PathSegment position={[0, 0, -18.5]} size={[4.8, 7.0]} type="cobble" />

      {/* ========================================================
          2. MAIN CENTRAL THOROUGHFARE (North Forest -> Village -> Farm -> Bridge)
         ======================================================== */}
      {/* Deep North Highway towards Granite Mountain & Mine (Z: -62 to -38) */}
      <PathSegment position={[0, 0, -50]} size={[3.2, 24]} type="main" />
      {/* North Forest into Village Town Hall (Z: -38 to -23) */}
      <PathSegment position={[0, 0, -31]} size={[3.2, 14]} type="main" />

      {/* Village Plaza to South Village Crossroad (Z: -10 to -1) */}
      <PathSegment position={[0, 0, -5.5]} size={[3.0, 9]} type="main" />

      {/* South Village to Farm Hub (Z: -1 to 8) */}
      <PathSegment position={[0, 0, 3.5]} size={[3.0, 9]} type="main" />

      {/* Farm Hub to Clearwater River Bridge (Z: 8 to 18.5) */}
      <PathSegment position={[0, 0, 13.25]} size={[3.2, 10.5]} type="main" />

      {/* Bridge South Landing into Southern Verges (Z: 24 to 32) */}
      <PathSegment position={[0, 0, 28]} size={[3.0, 8]} type="main" />

      {/* ========================================================
          3. VILLAGE ARTERIAL AVENUES & SHOP LANES
         ======================================================== */}
      {/* East-West High Street connecting Blacksmith and General Store to Central Plaza */}
      <PathSegment position={[-8.5, 0, -8.0]} size={[9.0, 2.8]} type="village" />
      <PathSegment position={[8.5, 0, -8.0]} size={[9.0, 2.8]} type="village" />

      {/* Blacksmith Forecourt & Forge Entry (Z: -8.5 in front of south entrance) */}
      <PathSegment position={[-13.5, 0, -8.5]} size={[3.6, 2.2]} type="cobble" />

      {/* General Store Forecourt & Market Entry (Z: -8.5 in front of south entrance) */}
      <PathSegment position={[13.5, 0, -8.5]} size={[3.6, 2.2]} type="cobble" />

      {/* Southwest Lane to Artisan Workshop */}
      <PathSegment position={[-7.5, 0, -2.5]} size={[9.0, 2.4]} type="village" />
      <PathSegment position={[-13.5, 0, -0.8]} size={[3.4, 2.4]} type="cobble" />

      {/* Southeast Lane to Cozy Village Cottage */}
      <PathSegment position={[7.5, 0, -2.5]} size={[9.0, 2.4]} type="village" />
      <PathSegment position={[13.5, 0, -0.8]} size={[3.4, 2.4]} type="cobble" />

      {/* ========================================================
          4. FARMSTEAD & AGRICULTURAL PATHWAYS
         ======================================================== */}
      {/* Pathway connecting Main Road to Farmer's Homestead front porch, Tool Shed & Chicken Run Gate */}
      <PathSegment position={[-5.0, 0, 8.5]} size={[7.0, 2.4]} type="farm" />
      <PathSegment position={[-8.5, 0, 7.2]} size={[2.4, 2.6]} type="cobble" />
      <PathSegment position={[-13.0, 0, 8.5]} size={[5.0, 2.2]} type="farm" />

      {/* Farm lane curving down to Red Barn & Crop Plots */}
      <PathSegment position={[-16.0, 0, 11.5]} size={[2.4, 6.0]} type="farm" layerOffset={1} />
      <PathSegment position={[-19.0, 0, 13.5]} size={[4.0, 2.6]} type="farm" layerOffset={2} />

      {/* East Farm Lane to Animal Pastures */}
      <PathSegment position={[6.5, 0, 5.5]} size={[8.0, 2.2]} type="farm" />

      {/* Access lane between Cow Pasture and Sheep Pen */}
      <PathSegment position={[4.0, 0, 11.0]} size={[2.0, 9.0]} type="farm" />

      {/* ========================================================
          5. REGIONAL TRAILS (Azure Lake, Mountain, Whispering Forest)
         ======================================================== */}
      {/* Scenic Trail from Bridge Eastward toward Fishing Pier (X: 19.5, Z: 32) */}
      <PathSegment position={[7.5, 0, 29.5]} size={[11, 2.0]} rotation={0.16} type="trail" />
      <PathSegment position={[14.0, 0, 31.0]} size={[6.5, 2.2]} type="trail" layerOffset={1} />

      {/* Scenic mainland shoreline trail along Azure Lake on solid grass (West & South bluffs) */}
      <PathSegment position={[13.5, 0, 48.0]} size={[2.2, 32.0]} type="trail" />
      <PathSegment position={[33.0, 0, 67.5]} size={[40.0, 2.2]} type="trail" layerOffset={1} />
      <PathSegment position={[53.0, 0, 60.5]} size={[2.2, 12.0]} type="trail" />

      {/* Eastern Trail winding through Sunlit Meadow */}
      <PathSegment position={[21.0, 0, -10.0]} size={[11.0, 2.0]} type="trail" />
      <PathSegment position={[28.5, 0, -8.5]} size={[9.0, 1.8]} rotation={0.2} type="trail" layerOffset={1} />

      {/* Northwest Winding Trail into Whispering Forest */}
      <PathSegment position={[-20.0, 0, -26.0]} size={[16.0, 2.0]} rotation={-0.35} type="trail" />
      <PathSegment position={[-32.0, 0, -34.0]} size={[18.0, 1.8]} rotation={-0.45} type="trail" layerOffset={1} />

      {/* ========================================================
          6. STEPPING STONES & NATURAL STONE PATHWAYS
         ======================================================== */}
      {[
        // Plaza surrounding flagstones
        [-1.8, -8.0],
        [1.8, -8.0],
        [-2.4, -10.0],
        [2.4, -10.0],
        [-1.8, -12.0],
        [1.8, -12.0],
        // Town Hall Stone Steps
        [-0.8, -18.2],
        [0.8, -18.2],
        [0, -18.4],
        // General store approach
        [13.5, -8.2],
        [14.0, -8.6],
        // Blacksmith approach
        [-13.5, -8.2],
        [-13.2, -8.6],
        // Artisan workshop approach
        [-14.0, -0.6],
        // Cottage approach
        [14.0, -0.6],
        // Pier approach steps
        [15.5, 31.8],
        [17.0, 32.2],
        [18.5, 32.4],
        // Ancient Shrine ceremonial path steps
        [49.0, 56.5],
        [51.0, 57.2],
        [53.0, 57.8],
        [55.0, 58.2],
      ].map(([x, z], idx) => (
        <mesh
          key={`step-stone-${idx}`}
          position={[x, 0.035, z]}
          rotation={[0, idx * 0.45, 0]}
          receiveShadow
        >
          <cylinderGeometry args={[0.32 + (idx % 3) * 0.05, 0.35 + (idx % 3) * 0.05, 0.03, 6]} />
          <meshStandardMaterial color={PALETTE.rockLight} roughness={0.9} flatShading />
        </mesh>
      ))}

      {/* Natural Edge Pebbles along Main Village Artery */}
      {[
        [-1.7, -22],
        [1.8, -20],
        [-1.8, -15],
        [1.7, -13],
        [-1.6, -2],
        [1.7, 0],
        [-1.7, 5],
        [1.8, 8],
        [-1.8, 14],
        [1.7, 16],
      ].map(([x, z], idx) => (
        <mesh
          key={`edge-pebble-${idx}`}
          position={[x, 0.03, z]}
          rotation={[0.2, idx * 0.7, 0]}
          receiveShadow
        >
          <dodecahedronGeometry args={[0.1 + (idx % 3) * 0.03, 0]} />
          <meshStandardMaterial color={PALETTE.rockBase} roughness={0.92} flatShading />
        </mesh>
      ))}
    </group>
  );
});
