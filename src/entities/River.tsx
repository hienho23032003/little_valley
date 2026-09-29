import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../utils/colors';
import { useGameStore } from '../stores/gameStore';
import { RIVER_WATER_CONFIG, LAKE_WATER_CONFIG } from './water/waterConfig';
import { createWaterMaterial } from './water/waterShaders';

interface RiverProps {
  centerZ?: number;
  width?: number;
}

export const River: React.FC<RiverProps> = React.memo(({
  centerZ = 21.2,
  width = 5.2,
}) => {
  const riverWaterRef = useRef<THREE.Mesh>(null);
  const lakeWaterRef = useRef<THREE.Mesh>(null);
  const boatRef = useRef<THREE.Group>(null);

  // Authoritative lightweight stylized water shader materials
  const riverMaterial = useMemo(() => createWaterMaterial(RIVER_WATER_CONFIG), []);
  const lakeMaterial = useMemo(() => createWaterMaterial(LAKE_WATER_CONFIG), []);

  useEffect(() => {
    return () => {
      riverMaterial.dispose();
      lakeMaterial.dispose();
    };
  }, [riverMaterial, lakeMaterial]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Advance shader animation clock (frame-rate independent)
    riverMaterial.uniforms.uTime.value = t;
    lakeMaterial.uniforms.uTime.value = t;

    // 2. Feed live player position & speed for physical water ripples (zero allocations inside useFrame)
    const [px, py, pz] = useGameStore.getState().playerPosition;
    const isMoving = useGameStore.getState().isMoving;
    const speed = isMoving ? 1.0 : 0.0;

    riverMaterial.uniforms.uPlayerPos.value.set(px, py, pz);
    riverMaterial.uniforms.uPlayerSpeed.value = speed;

    lakeMaterial.uniforms.uPlayerPos.value.set(px, py, pz);
    lakeMaterial.uniforms.uPlayerSpeed.value = speed;

    // 3. Moored rowboat gentle bobbing & rocking
    if (boatRef.current) {
      boatRef.current.position.y = -0.10 + Math.sin(t * 1.8) * 0.015;
      boatRef.current.rotation.z = Math.sin(t * 1.2) * 0.025;
      boatRef.current.rotation.x = Math.cos(t * 1.4) * 0.015;
    }
  });

  // River extends from west border (X = -85) to the lake inlet (X = 14.5) -> span ~99.5m, center X = -35.25
  const riverLength = 100;
  const riverCenterX = -35.25;

  return (
    <group>
      {/* ========================================================
          1. WESTERN CLEARWATER RIVER (X: -85 to 14.5, Z: 21.2)
         ======================================================== */}
      <group position={[riverCenterX, 0, centerZ]}>
        {/* River Trench / Sandy Pebble Riverbed */}
        <mesh position={[0, -0.42, 0]} receiveShadow>
          <boxGeometry args={[riverLength, 0.42, width + 1.2]} />
          <meshStandardMaterial color="#889da8" roughness={0.92} flatShading />
        </mesh>

        {/* Stylized Flowing River Water Surface (West -> East directional flow, foam crests, glints) */}
        <mesh
          ref={riverWaterRef}
          position={[0, -0.12, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          material={riverMaterial}
        >
          <planeGeometry args={[riverLength, width + 0.2, 64, 8]} />
        </mesh>
      </group>

      {/* ========================================================
          2. AZURE LAKE (X: 14.5 to 73.0, Z: 20.0 to 66.0)
         ======================================================== */}
      {/* Lake Center at X = 43.75, Z = 43.0 */}
      <group position={[43.75, 0, 43.0]}>
        {/* Lake Bed Excavation Basin */}
        <mesh position={[0, -0.48, 0]} receiveShadow>
          <boxGeometry args={[58.5, 0.45, 46.0]} />
          <meshStandardMaterial color="#6a828e" roughness={0.94} flatShading />
        </mesh>

        {/* Sandy Shoreline Bed Transition */}
        <mesh position={[0, -0.22, 0]} receiveShadow>
          <boxGeometry args={[57.5, 0.15, 45.0]} />
          <meshStandardMaterial color="#cbb892" roughness={0.95} flatShading />
        </mesh>

        {/* Deep Azure Lake Water Surface (Calm circular ripples, soft caustics, gentle lapping foam) */}
        <mesh
          ref={lakeWaterRef}
          position={[0, -0.12, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          material={lakeMaterial}
        >
          <planeGeometry args={[56.5, 44.0, 48, 36]} />
        </mesh>

        {/* Floating Water Lily Pads */}
        {[
          [-14, -8, 0.85],
          [-12, -6, 0.7],
          [-16, -10, 0.9],
          [6, 8, 0.8],
          [8, 11, 0.75],
          [-4, 14, 0.95],
          [-2, 12, 0.65],
          [16, -12, 0.85],
          [18, -9, 0.7],
        ].map(([lx, lz, sc], idx) => (
          <group key={`lily-${idx}`} position={[lx, -0.11, lz]}>
            {/* Round pad with notch */}
            <mesh rotation={[-Math.PI / 2, 0, idx * 0.7]}>
              <cylinderGeometry args={[sc, sc, 0.02, 7]} />
              <meshStandardMaterial color="#387a3e" roughness={0.7} flatShading />
            </mesh>
            {/* Flower bud on every second pad */}
            {idx % 2 === 0 && (
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[sc * 0.28, 5, 5]} />
                <meshStandardMaterial
                  color={idx % 4 === 0 ? '#ff85a1' : '#fff3b0'}
                  roughness={0.5}
                  flatShading
                />
              </mesh>
            )}
          </group>
        ))}

        {/* Shoreline Cattails / Reeds */}
        {[
          [-27, -14],
          [-26, -10],
          [-27, 4],
          [-26, 8],
          [-18, 21],
          [-14, 21.5],
          [10, 21.2],
          [14, 21.0],
          [27, -5],
          [26.5, 0],
          [27, 10],
        ].map(([rx, rz], idx) => (
          <group key={`reed-${idx}`} position={[rx, 0, rz]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 1.1, 4]} />
              <meshStandardMaterial color="#4d7c38" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.35, 5]} />
              <meshStandardMaterial color="#6b4423" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          3. WOODEN FISHING PIER & ROWBOAT (West shore of Lake)
         ======================================================== */}
      {/* Pier starts at land (X = 15, Z = 32) and extends into lake to X = 25 */}
      <group position={[19.5, 0, 32]}>
        {/* Pier Support Pilings */}
        {[-3.5, 0, 3.5].map((px) =>
          [-1.0, 1.0].map((pz) => (
            <mesh key={`pier-pile-${px}-${pz}`} position={[px, -0.4, pz]} castShadow>
              <cylinderGeometry args={[0.16, 0.18, 1.4, 6]} />
              <meshStandardMaterial color={PALETTE.woodDark} roughness={0.95} flatShading />
            </mesh>
          ))
        )}

        {/* Deck Timber Stringers */}
        {[-0.8, 0.8].map((pz) => (
          <mesh key={`pier-stringer-${pz}`} position={[0, 0.05, pz]} castShadow receiveShadow>
            <boxGeometry args={[9.5, 0.22, 0.25]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Pier Deck Planks */}
        {Array.from({ length: 18 }).map((_, i) => {
          const px = -4.2 + i * 0.5;
          return (
            <mesh
              key={`pier-plank-${i}`}
              position={[px, 0.2, 0]}
              rotation={[0, 0, 0.01 * (i % 2 === 0 ? 1 : -1)]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.42, 0.12, 2.4]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? PALETTE.woodPlank : PALETTE.woodLight}
                roughness={0.82}
                flatShading
              />
            </mesh>
          );
        })}

        {/* Pier End Lantern Post */}
        <group position={[4.2, 0.2, 1.0]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[0.16, 1.6, 0.16]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </mesh>
          {/* Hanging arm */}
          <mesh position={[-0.2, 1.5, 0]}>
            <boxGeometry args={[0.4, 0.08, 0.08]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
          </mesh>
          {/* Lantern */}
          <group position={[-0.35, 1.3, 0]}>
            <mesh position={[0, 0.12, 0]}>
              <coneGeometry args={[0.14, 0.1, 4]} />
              <meshStandardMaterial color={PALETTE.rockDark} roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.13, 0.14, 0.13]} />
              <meshStandardMaterial
                color="#ffe066"
                emissive="#ffcc00"
                emissiveIntensity={0.65}
                roughness={0.3}
              />
            </mesh>
          </group>
        </group>

        {/* Moored Wooden Rowboat floating beside the pier */}
        <group ref={boatRef} position={[2.5, -0.10, 2.5]} rotation={[0, 0.15, 0]}>
          {/* Boat Hull Bottom */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.35, 1.2]} />
            <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.85} flatShading />
          </mesh>
          {/* Boat Bow Point */}
          <mesh position={[1.7, 0.15, 0]} rotation={[0, 0, -0.3]} castShadow>
            <coneGeometry args={[0.65, 0.8, 4]} />
            <meshStandardMaterial color={PALETTE.woodLight} roughness={0.85} flatShading />
          </mesh>
          {/* Boat Interior Bench */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.3, 0.08, 1.1]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </mesh>
          {/* Wooden Oars resting across */}
          <mesh position={[0.2, 0.32, 0.4]} rotation={[0.2, 0.4, -0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 4]} />
            <meshStandardMaterial color={PALETTE.woodLight} roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
});
