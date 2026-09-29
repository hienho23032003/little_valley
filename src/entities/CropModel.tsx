import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CropType } from '../data/cropData';
import { GrowthStage } from '../stores/farmStore';
import { PALETTE } from '../utils/colors';

interface CropModelProps {
  cropType: CropType;
  stage: GrowthStage;
  growthProgress?: number;
  isReady?: boolean;
}

export const CropModel: React.FC<CropModelProps> = React.memo(({
  cropType,
  stage,
  isReady = false,
}) => {
  const swayRef = useRef<THREE.Group>(null);

  // Gentle wind sway animation for growing & ready crops
  useFrame((state) => {
    if (swayRef.current && stage >= 2) {
      const t = state.clock.getElapsedTime();
      swayRef.current.rotation.z = Math.sin(t * 2.2) * 0.04;
      swayRef.current.rotation.x = Math.cos(t * 1.8) * 0.03;
    }
  });

  // ================= STAGE 0: SEED / SPROUT =================
  if (stage === 0) {
    return (
      <group position={[0, 0.15, 0]}>
        {/* Tiny soil mound */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 0.05, 6]} />
          <meshStandardMaterial color={PALETTE.tilledSoilDark} roughness={0.9} flatShading />
        </mesh>
        {/* Seedling sprout tip */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.045, 5, 5]} />
          <meshStandardMaterial color="#80ed99" roughness={0.6} />
        </mesh>
      </group>
    );
  }

  // ================= STAGE 1: SMALL PLANT =================
  if (stage === 1) {
    return (
      <group position={[0, 0.15, 0]}>
        {/* Baby Stem */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.15, 4]} />
          <meshStandardMaterial color="#57cc99" roughness={0.7} />
        </mesh>
        {/* Left Leaf */}
        <mesh position={[-0.08, 0.14, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.12, 0.02, 0.06]} />
          <meshStandardMaterial color="#57cc99" roughness={0.7} flatShading />
        </mesh>
        {/* Right Leaf */}
        <mesh position={[0.08, 0.14, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.12, 0.02, 0.06]} />
          <meshStandardMaterial color="#57cc99" roughness={0.7} flatShading />
        </mesh>
      </group>
    );
  }

  // ================= STAGE 2: MEDIUM PLANT =================
  if (stage === 2) {
    return (
      <group ref={swayRef} position={[0, 0.15, 0]}>
        {cropType === 'wheat' && (
          <group>
            {[-0.08, 0, 0.08].map((x, i) => (
              <mesh key={`wheat-stem-${i}`} position={[x, 0.25, (i % 2) * 0.04]} rotation={[0, 0, (i - 1) * 0.1]} castShadow>
                <cylinderGeometry args={[0.02, 0.03, 0.45, 4]} />
                <meshStandardMaterial color="#b7d568" roughness={0.7} flatShading />
              </mesh>
            ))}
          </group>
        )}

        {cropType === 'corn' && (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.6, 5]} />
              <meshStandardMaterial color="#52b788" roughness={0.7} flatShading />
            </mesh>
            {/* Broad Leaves */}
            <mesh position={[-0.15, 0.25, 0]} rotation={[0, 0, 0.7]} castShadow>
              <boxGeometry args={[0.26, 0.02, 0.1]} />
              <meshStandardMaterial color="#40916c" roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0.15, 0.35, 0]} rotation={[0, 0, -0.7]} castShadow>
              <boxGeometry args={[0.26, 0.02, 0.1]} />
              <meshStandardMaterial color="#40916c" roughness={0.7} flatShading />
            </mesh>
          </group>
        )}

        {cropType === 'carrot' && (
          <group>
            {/* Bushy Green Foliage */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <coneGeometry args={[0.22, 0.38, 5]} />
              <meshStandardMaterial color="#38b000" roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0.06, 0.18, 0.05]} rotation={[0.2, 0, -0.2]} castShadow>
              <coneGeometry args={[0.15, 0.3, 4]} />
              <meshStandardMaterial color="#2d6a4f" roughness={0.7} flatShading />
            </mesh>
          </group>
        )}

        {cropType === 'tomato' && (
          <group>
            {/* Small garden stake */}
            <mesh position={[0.12, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
              <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} />
            </mesh>
            {/* Bushy Vine */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <dodecahedronGeometry args={[0.24, 0]} />
              <meshStandardMaterial color="#40916c" roughness={0.7} flatShading />
            </mesh>
            {/* Tiny Yellow Flower Bud */}
            <mesh position={[-0.12, 0.3, 0.12]} castShadow>
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshStandardMaterial color="#ffd166" roughness={0.5} />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  // ================= STAGE 3: FULLY GROWN (READY) =================
  return (
    <group ref={swayRef} position={[0, 0.15, 0]}>
      {/* Ready Golden Sparkle Indicator */}
      {isReady && (
        <mesh position={[0, 0.9, 0]}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshStandardMaterial color="#ffe66d" emissive="#ffb703" emissiveIntensity={0.8} roughness={0.3} />
        </mesh>
      )}

      {/* 1. WHEAT */}
      {cropType === 'wheat' && (
        <group>
          {[-0.15, -0.05, 0.05, 0.15].map((x, i) => {
            const z = ((i % 2) - 0.5) * 0.12;
            const rotZ = (i - 1.5) * 0.12;
            return (
              <group key={`wheat-ear-${i}`} position={[x, 0, z]} rotation={[0, 0, rotZ]}>
                {/* Golden Stem */}
                <mesh position={[0, 0.35, 0]} castShadow>
                  <cylinderGeometry args={[0.02, 0.03, 0.65, 4]} />
                  <meshStandardMaterial color="#e9c46a" roughness={0.7} flatShading />
                </mesh>
                {/* Golden Wheat Ear / Grain Head */}
                <mesh position={[0, 0.72, 0]} castShadow>
                  <coneGeometry args={[0.08, 0.28, 5]} />
                  <meshStandardMaterial color="#f4a261" roughness={0.6} flatShading />
                </mesh>
                {/* Wheat Awns / Whiskers */}
                <mesh position={[0, 0.88, 0]}>
                  <cylinderGeometry args={[0.008, 0.015, 0.12, 3]} />
                  <meshStandardMaterial color="#e76f51" />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* 2. CORN */}
      {cropType === 'corn' && (
        <group>
          {/* Main Tall Stalk */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.08, 1.05, 6]} />
            <meshStandardMaterial color="#52b788" roughness={0.7} flatShading />
          </mesh>

          {/* Broad Arching Leaves */}
          {[-0.24, 0.24].map((x, i) => (
            <mesh key={`corn-leaf-${i}`} position={[x, 0.5 + i * 0.2, 0]} rotation={[0, 0, i === 0 ? 0.65 : -0.65]} castShadow>
              <boxGeometry args={[0.42, 0.03, 0.14]} />
              <meshStandardMaterial color="#2d6a4f" roughness={0.7} flatShading />
            </mesh>
          ))}
          <mesh position={[0, 0.85, 0.18]} rotation={[0.65, 0, 0]} castShadow>
            <boxGeometry args={[0.14, 0.03, 0.36]} />
            <meshStandardMaterial color="#40916c" roughness={0.7} flatShading />
          </mesh>

          {/* Golden Corn Cobs */}
          {/* Cob 1 */}
          <group position={[-0.14, 0.55, 0.08]} rotation={[0, 0, 0.45]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.07, 0.09, 0.28, 6]} />
              <meshStandardMaterial color="#ffd166" roughness={0.5} flatShading />
            </mesh>
            {/* Green Husk wrapping */}
            <mesh position={[-0.03, -0.06, 0]} castShadow>
              <coneGeometry args={[0.1, 0.2, 4]} />
              <meshStandardMaterial color="#52b788" roughness={0.7} flatShading />
            </mesh>
          </group>
          {/* Cob 2 */}
          <group position={[0.14, 0.65, -0.08]} rotation={[0, 0, -0.45]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.07, 0.09, 0.28, 6]} />
              <meshStandardMaterial color="#ffd166" roughness={0.5} flatShading />
            </mesh>
            <mesh position={[0.03, -0.06, 0]} castShadow>
              <coneGeometry args={[0.1, 0.2, 4]} />
              <meshStandardMaterial color="#52b788" roughness={0.7} flatShading />
            </mesh>
          </group>

          {/* Corn Silk Top */}
          <mesh position={[0, 1.12, 0]}>
            <coneGeometry args={[0.06, 0.16, 4]} />
            <meshStandardMaterial color="#d4a373" />
          </mesh>
        </group>
      )}

      {/* 3. CARROT */}
      {cropType === 'carrot' && (
        <group>
          {/* Orange Carrot Crown peeking out of soil */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.12, 6]} />
            <meshStandardMaterial color="#f77f00" roughness={0.6} flatShading />
          </mesh>

          {/* Lush Green Fronds / Foliage */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <coneGeometry args={[0.26, 0.48, 6]} />
            <meshStandardMaterial color="#38b000" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[-0.08, 0.25, 0.08]} rotation={[0.2, 0, -0.3]} castShadow>
            <coneGeometry args={[0.18, 0.38, 5]} />
            <meshStandardMaterial color="#55a630" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[0.08, 0.25, -0.08]} rotation={[-0.2, 0, 0.3]} castShadow>
            <coneGeometry args={[0.18, 0.38, 5]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.7} flatShading />
          </mesh>
        </group>
      )}

      {/* 4. TOMATO */}
      {cropType === 'tomato' && (
        <group>
          {/* Wooden Support Stake */}
          <mesh position={[0.12, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 4]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </mesh>

          {/* Bushy Vine Body */}
          <mesh position={[0, 0.38, 0]} castShadow>
            <dodecahedronGeometry args={[0.34, 0]} />
            <meshStandardMaterial color="#40916c" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[-0.12, 0.48, 0.06]} scale={0.75} castShadow>
            <dodecahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.7} flatShading />
          </mesh>

          {/* Ripe Red Tomatoes */}
          {[
            [-0.18, 0.3, 0.16],
            [0.16, 0.32, 0.18],
            [-0.08, 0.52, 0.22],
            [0.18, 0.48, -0.16],
          ].map(([x, y, z], i) => (
            <group key={`tomato-${i}`} position={[x, y, z]}>
              <mesh castShadow>
                <sphereGeometry args={[0.11, 6, 6]} />
                <meshStandardMaterial color="#d90429" roughness={0.4} flatShading />
              </mesh>
              {/* Green calyx cap */}
              <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.04, 0.03, 4]} />
                <meshStandardMaterial color="#2d6a4f" />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
});
