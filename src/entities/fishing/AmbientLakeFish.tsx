import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';

interface AmbientFishConfig {
  modelUrl: string;
  center: [number, number];
  radius: [number, number];
  speed: number;
  depth: number;
  scale: number;
  phaseOffset: number;
}

const AMBIENT_FISH_CONFIGS: AmbientFishConfig[] = [
  // Magnificent Koi swimming near the Azure Pier
  {
    modelUrl: '/models/fish/Koi.fbx',
    center: [28, 35],
    radius: [6.5, 5.0],
    speed: 0.22,
    depth: -0.28,
    scale: 0.007,
    phaseOffset: 0.0,
  },
  // Playful Clownfish swimming in shallow reef reeds
  {
    modelUrl: '/models/fish/Clownfish.fbx',
    center: [23, 30],
    radius: [3.8, 3.2],
    speed: 0.35,
    depth: -0.22,
    scale: 0.0055,
    phaseOffset: 1.8,
  },
  // Radiant Goldfish near the lake center
  {
    modelUrl: '/models/fish/Goldfish.fbx',
    center: [38, 42],
    radius: [8.0, 6.5],
    speed: 0.26,
    depth: -0.32,
    scale: 0.006,
    phaseOffset: 3.4,
  },
  // Elegant Betta near the southern lake shore
  {
    modelUrl: '/models/fish/Betta.fbx',
    center: [32, 50],
    radius: [5.2, 4.0],
    speed: 0.28,
    depth: -0.25,
    scale: 0.0065,
    phaseOffset: 4.9,
  },
  // Vibrant Blue Tang patrolling deeper waters
  {
    modelUrl: '/models/fish/BlueTang.fbx',
    center: [46, 36],
    radius: [7.5, 6.0],
    speed: 0.3,
    depth: -0.35,
    scale: 0.006,
    phaseOffset: 2.2,
  },
];

const SingleAmbientFish: React.FC<{ config: AmbientFishConfig }> = React.memo(({ config }) => {
  const fbx = useFBX(config.modelUrl);
  const groupRef = useRef<THREE.Group>(null);

  const clone = useMemo(() => {
    const c = fbx.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    return c;
  }, [fbx]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    const angle = t * config.speed + config.phaseOffset;
    const x = config.center[0] + Math.cos(angle) * config.radius[0];
    const z = config.center[1] + Math.sin(angle) * config.radius[1];
    const y = config.depth + Math.sin(t * 2.5 + config.phaseOffset) * 0.04;

    groupRef.current.position.set(x, y, z);

    // Facing direction tangential to orbit ellipse + organic tail sway
    const dx = -Math.sin(angle) * config.radius[0];
    const dz = Math.cos(angle) * config.radius[1];
    const heading = Math.atan2(dx, dz);
    const tailWiggle = Math.sin(t * 7.0 + config.phaseOffset) * 0.12;

    groupRef.current.rotation.set(
      Math.sin(t * 3.0) * 0.05,
      heading + Math.PI + tailWiggle,
      Math.cos(t * 3.0) * 0.05
    );
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={clone}
        scale={[config.scale, config.scale, config.scale]}
      />
    </group>
  );
});

export const AmbientLakeFish: React.FC = React.memo(() => {
  return (
    <group name="ambient_lake_fish">
      {AMBIENT_FISH_CONFIGS.map((cfg, idx) => (
        <SingleAmbientFish key={idx} config={cfg} />
      ))}
    </group>
  );
});

// Preload ambient fish models
AMBIENT_FISH_CONFIGS.forEach((c) => useFBX.preload(c.modelUrl));
