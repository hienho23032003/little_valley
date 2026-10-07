import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CropType } from '../data/cropData';
import { GrowthStage } from '../stores/farmStore';

const CROP_MODEL_PATHS: Record<CropType, [string, string, string, string]> = {
  wheat: [
    '/models/crops/Wheat_1.glb',
    '/models/crops/Wheat_2.glb',
    '/models/crops/Wheat_3.glb',
    '/models/crops/Wheat_4.glb',
  ],
  corn: [
    '/models/crops/Corn_1.glb',
    '/models/crops/Corn_2.glb',
    '/models/crops/Corn_3.glb',
    '/models/crops/Corn_4.glb',
  ],
  carrot: [
    '/models/crops/Carrot_1.glb',
    '/models/crops/Carrot_2.glb',
    '/models/crops/Carrot_3.glb',
    '/models/crops/Carrot_4.glb',
  ],
  tomato: [
    '/models/crops/Tomato_1.glb',
    '/models/crops/Tomato_2.glb',
    '/models/crops/Tomato_3.glb',
    '/models/crops/Tomato_4.glb',
  ],
  pumpkin: [
    '/models/crops/Pumpkin_1.glb',
    '/models/crops/Pumpkin_2.glb',
    '/models/crops/Pumpkin_3.glb',
    '/models/crops/Pumpkin_4.glb',
  ],
  eggplant: [
    '/models/crops/Beet_1.glb',
    '/models/crops/Beet_2.glb',
    '/models/crops/Beet_3.glb',
    '/models/crops/Beet_4.glb',
  ],
};

const CropGLBPart: React.FC<{
  path: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = React.memo(({ path, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return <primitive object={clone} scale={scale} position={position} rotation={rotation} />;
});

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
  const clampedStage = Math.min(Math.max(stage, 0), 3) as 0 | 1 | 2 | 3;
  const stagePaths = CROP_MODEL_PATHS[cropType] || CROP_MODEL_PATHS.wheat;
  const currentPath = stagePaths[clampedStage];

  // Gentle wind sway animation for growing & mature crops
  useFrame((state) => {
    if (swayRef.current && clampedStage >= 1) {
      const t = state.clock.getElapsedTime();
      swayRef.current.rotation.z = Math.sin(t * 2.2) * 0.035;
      swayRef.current.rotation.x = Math.cos(t * 1.8) * 0.025;
    }
  });

  // Base scale and height offset per crop type
  const baseScale = cropType === 'corn' || cropType === 'wheat' ? 0.65 : 0.72;

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Model for this growth stage with wind sway */}
      <group ref={swayRef} position={[0, 0.05, 0]}>
        <CropGLBPart
          path={currentPath}
          scale={[baseScale, baseScale, baseScale]}
          position={[0, 0, 0]}
        />
      </group>

      {/* Ready for Harvest Golden Shimmer Indicator */}
      {isReady && (
        <group position={[0, 1.1, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial
              color="#ffb703"
              emissive="#fb8500"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
});

// Preload common crops
Object.values(CROP_MODEL_PATHS).forEach((paths) => {
  paths.forEach((p) => {
    useGLTF.preload(p);
  });
});
