import React from 'react';
import { PALETTE } from '../utils/colors';

interface FarmPlotProps {
  position: [number, number, number];
  rows?: number;
  cols?: number;
  cropType?: 'cabbage' | 'carrot' | 'pumpkin';
}

export const FarmPlot: React.FC<FarmPlotProps> = ({
  position,
  rows = 4,
  cols = 5,
  cropType = 'carrot',
}) => {
  const plotWidth = cols * 0.9;
  const plotLength = rows * 0.9;

  return (
    <group position={position}>
      {/* Wooden Raised Bed Border */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[plotWidth + 0.3, 0.24, plotLength + 0.3]} />
        <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
      </mesh>

      {/* Dark Tilled Soil Base */}
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[plotWidth, 0.15, plotLength]} />
        <meshStandardMaterial color={PALETTE.tilledSoilDark} roughness={0.95} flatShading />
      </mesh>

      {/* Soil Furrows (raised soil ridges) */}
      {Array.from({ length: rows }).map((_, r) => {
        const z = -plotLength / 2 + 0.45 + r * 0.9;
        return (
          <mesh key={`furrow-${r}`} position={[0, 0.26, z]} receiveShadow>
            <cylinderGeometry args={[0.18, 0.28, plotWidth - 0.2, 5]} />
            {/* rotate cylinder 90 deg along Z to run along X */}
            <meshStandardMaterial color={PALETTE.tilledSoil} roughness={0.95} flatShading />
          </mesh>
        );
      })}

      {/* Low-poly stylized vegetable sprouts */}
      {Array.from({ length: rows }).map((_, r) => {
        const z = -plotLength / 2 + 0.45 + r * 0.9;
        return Array.from({ length: cols }).map((_, c) => {
          const x = -plotWidth / 2 + 0.45 + c * 0.9;

          if (cropType === 'carrot') {
            return (
              <group key={`carrot-${r}-${c}`} position={[x, 0.32, z]}>
                {/* Carrot top orange tip */}
                <mesh position={[0, 0.05, 0]} castShadow>
                  <coneGeometry args={[0.08, 0.15, 5]} />
                  <meshStandardMaterial color={PALETTE.carrotOrange} roughness={0.6} />
                </mesh>
                {/* Carrot green fronds */}
                <mesh position={[0, 0.15, 0]} castShadow>
                  <coneGeometry args={[0.12, 0.2, 4]} />
                  <meshStandardMaterial color={PALETTE.carrotLeaves} roughness={0.7} flatShading />
                </mesh>
              </group>
            );
          } else if (cropType === 'cabbage') {
            return (
              <group key={`cabbage-${r}-${c}`} position={[x, 0.35, z]}>
                <mesh castShadow>
                  <dodecahedronGeometry args={[0.18, 0]} />
                  <meshStandardMaterial color={PALETTE.cabbageGreen} roughness={0.7} flatShading />
                </mesh>
                <mesh position={[0, -0.05, 0]} scale={[1.3, 0.4, 1.3]} castShadow>
                  <dodecahedronGeometry args={[0.16, 0]} />
                  <meshStandardMaterial color="#558b2f" roughness={0.7} flatShading />
                </mesh>
              </group>
            );
          } else {
            // Pumpkin
            return (
              <group key={`pumpkin-${r}-${c}`} position={[x, 0.34, z]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.22, 6, 6]} />
                  <meshStandardMaterial color={PALETTE.pumpkinOrange} roughness={0.6} flatShading />
                </mesh>
                <mesh position={[0, 0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.04, 0.1, 4]} />
                  <meshStandardMaterial color="#33691e" roughness={0.8} />
                </mesh>
              </group>
            );
          }
        });
      })}
    </group>
  );
};

// Farm Props: Hay Bales & Watering Trough
export const HayBale: React.FC<{ position: [number, number, number]; rotation?: number }> = ({
  position,
  rotation = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.1, 8]} />
        <meshStandardMaterial color={PALETTE.hayBale} roughness={0.9} flatShading />
      </mesh>
      {/* String bands */}
      <mesh position={[0, 0.4, 0.25]}>
        <torusGeometry args={[0.46, 0.02, 4, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[0, 0.4, -0.25]}>
        <torusGeometry args={[0.46, 0.02, 4, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
    </group>
  );
};

export const WaterTrough: React.FC<{ position: [number, number, number]; rotation?: number }> = ({
  position,
  rotation = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Wood trough body */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.5, 0.8]} />
        <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} flatShading />
      </mesh>
      {/* Water inside trough */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.4, 0.08, 0.6]} />
        <meshStandardMaterial color={PALETTE.water} roughness={0.2} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};
