import React from 'react';
import { PALETTE } from '../../utils/colors';

export const WorldPointsOfInterest: React.FC = React.memo(() => {
  return (
    <group>
      {/* ========================================================
          1. GRANITE MOUNTAIN MINE ENTRANCE (X: 0, Z: -62)
         ======================================================== */}
      <group position={[0, 0, -62]}>
        {/* Mine Opening Dark Portal Void */}
        <mesh position={[0, 1.6, 0.2]} receiveShadow>
          <boxGeometry args={[4.2, 3.2, 0.8]} />
          <meshStandardMaterial color="#1a1e22" roughness={0.98} />
        </mesh>

        {/* Timber Frame Archway - Left Post */}
        <mesh position={[-2.1, 1.7, 0.4]} castShadow>
          <boxGeometry args={[0.42, 3.4, 0.42]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
        </mesh>
        {/* Timber Frame Archway - Right Post */}
        <mesh position={[2.1, 1.7, 0.4]} castShadow>
          <boxGeometry args={[0.42, 3.4, 0.42]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
        </mesh>
        {/* Timber Frame Archway - Header Beam */}
        <mesh position={[0, 3.4, 0.4]} castShadow>
          <boxGeometry args={[5.0, 0.46, 0.46]} />
          <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
        </mesh>
        {/* Archway Cross Supports */}
        <mesh position={[-1.6, 3.0, 0.4]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} />
        </mesh>
        <mesh position={[1.6, 3.0, 0.4]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} />
        </mesh>

        {/* 2 Mine Lanterns on Posts */}
        {[-2.2, 2.2].map((x, idx) => (
          <group key={`mine-lantern-${idx}`} position={[x, 2.4, 0.7]}>
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.16, 0.12, 4]} />
              <meshStandardMaterial color={PALETTE.rockDark} roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.16, 0.15]} />
              <meshStandardMaterial
                color="#ffe066"
                emissive="#ffb703"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Minecart Tracks leading out into valley (Z: 0 to 12) */}
        {/* Wooden Ties */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={`tie-${i}`}
            position={[0, 0.04, 1.0 + i * 0.9]}
            receiveShadow
          >
            <boxGeometry args={[2.2, 0.08, 0.28]} />
            <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.9} flatShading />
          </mesh>
        ))}
        {/* Steel Rails */}
        {[-0.75, 0.75].map((rx, idx) => (
          <mesh key={`rail-${idx}`} position={[rx, 0.1, 6.0]} receiveShadow>
            <boxGeometry args={[0.1, 0.1, 11.5]} />
            <meshStandardMaterial color="#8d99ae" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}

        {/* Minecart filled with ore */}
        <group position={[0, 0.2, 7.5]}>
          {/* Cart Iron Wheels */}
          {[-0.75, 0.75].map((wx) =>
            [-0.6, 0.6].map((wz) => (
              <mesh
                key={`wheel-${wx}-${wz}`}
                position={[wx, 0.05, wz]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.18, 0.18, 0.08, 8]} />
                <meshStandardMaterial color="#2b2d42" metalness={0.7} roughness={0.3} />
              </mesh>
            ))
          )}
          {/* Cart Wooden Hopper Body */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.6, 0.75, 1.8]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.85} flatShading />
          </mesh>
          {/* Iron Rim Trim */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[1.65, 0.08, 1.85]} />
            <meshStandardMaterial color="#555b6e" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Shiny Ore Chunks inside cart */}
          <mesh position={[0, 0.8, 0]} rotation={[0.2, 0.4, 0]}>
            <dodecahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color="#e0aaff"
              emissive="#7b2cbf"
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.3}
              flatShading
            />
          </mesh>
        </group>

        {/* Supply Crates & Barrels by Mine */}
        <group position={[3.2, 0, 2.5]}>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color={PALETTE.woodLight} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.2, 0.95, 0]} rotation={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.85} flatShading />
          </mesh>
          {/* Ore Barrel */}
          <mesh position={[-0.9, 0.45, 0.2]} castShadow>
            <cylinderGeometry args={[0.35, 0.38, 0.9, 8]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          2. FOREST CLEARING & WOODCUTTER'S CAMPSITE (X: -45, Z: -45)
         ======================================================== */}
      <group position={[-45, 0, -45]}>
        {/* Campfire Stone Ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={`fire-stone-${i}`}
              position={[Math.cos(ang) * 0.9, 0.12, Math.sin(ang) * 0.9]}
              rotation={[0.2, ang, 0]}
              castShadow
            >
              <dodecahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial color={PALETTE.rockDark} roughness={0.9} flatShading />
            </mesh>
          );
        })}

        {/* Campfire Ash & Glowing Embers */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.08, 8]} />
          <meshStandardMaterial color="#2d2b2a" roughness={0.98} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <dodecahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial
            color="#ff5400"
            emissive="#ff0054"
            emissiveIntensity={0.8}
            roughness={0.5}
            flatShading
          />
        </mesh>

        {/* Campfire Logs Criss-crossed */}
        <mesh position={[0, 0.2, 0]} rotation={[0.4, 0.5, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.9, 5]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[-0.3, -0.7, 0.4]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.9, 5]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} />
        </mesh>

        {/* Sitting Log Benches */}
        <mesh position={[0, 0.25, 2.0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.25, 2.4, 6]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.88} flatShading />
        </mesh>
        <mesh position={[2.0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.25, 2.0, 6]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.88} flatShading />
        </mesh>

        {/* Chopping Block & Stuck Axe */}
        <group position={[-2.4, 0, 0.8]}>
          {/* Stump */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.5, 0.8, 7]} />
            <meshStandardMaterial color={PALETTE.woodLight} roughness={0.9} flatShading />
          </mesh>
          {/* Axe Handle */}
          <mesh position={[0.05, 0.95, 0]} rotation={[0.3, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.7, 4]} />
            <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.8} />
          </mesh>
          {/* Axe Steel Blade */}
          <mesh position={[0.15, 0.88, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.2, 0.14, 0.05]} />
            <meshStandardMaterial color="#adb5bd" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Stacked Firewood Cord */}
        <group position={[-2.8, 0, -2.0]}>
          {[-0.4, 0, 0.4].map((lx, idx) => (
            <mesh key={`log-bot-${idx}`} position={[lx, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 1.6, 6]} />
              <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} flatShading />
            </mesh>
          ))}
          {[-0.2, 0.2].map((lx, idx) => (
            <mesh key={`log-mid-${idx}`} position={[lx, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 1.6, 6]} />
              <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.9} flatShading />
            </mesh>
          ))}
          <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 1.6, 6]} />
            <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} flatShading />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          3. VILLAGE MARKET STALLS & FLOWER CART (X: 3.5, Z: -5.5)
         ======================================================== */}
      <group position={[3.5, 0, -5.5]}>
        {/* Wooden Stall Counter */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.0, 1.2]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.85} flatShading />
        </mesh>
        {/* 4 Canopy Support Poles */}
        {[-1.1, 1.1].map((px) =>
          [-0.5, 0.5].map((pz) => (
            <mesh key={`stall-pole-${px}-${pz}`} position={[px, 1.5, pz]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 1.6, 5]} />
              <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
            </mesh>
          ))
        )}
        {/* Striped Pastel Fabric Awning */}
        <mesh position={[0, 2.25, 0]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[2.6, 0.15, 1.5]} />
          <meshStandardMaterial color="#f28482" roughness={0.8} flatShading />
        </mesh>
        {/* Counter Display Crates with Produce */}
        <group position={[-0.6, 1.08, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.7, 0.16, 0.7]} />
            <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.85} />
          </mesh>
          {/* Apples in crate */}
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.18, 5, 5]} />
            <meshStandardMaterial color="#e63946" roughness={0.4} flatShading />
          </mesh>
        </group>
        <group position={[0.6, 1.08, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.7, 0.16, 0.7]} />
            <meshStandardMaterial color={PALETTE.woodPlank} roughness={0.85} />
          </mesh>
          {/* Pumpkins/Carrots in crate */}
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.18, 5, 5]} />
            <meshStandardMaterial color={PALETTE.pumpkinOrange} roughness={0.4} flatShading />
          </mesh>
        </group>
      </group>
    </group>
  );
});
