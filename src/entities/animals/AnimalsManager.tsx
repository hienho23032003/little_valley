import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimalStore, Animal } from '../../stores/animalStore';
import { useGameStore } from '../../stores/gameStore';
import { ChickenModel } from './ChickenModel';
import { CowModel } from './CowModel';
import { SheepModel } from './SheepModel';
import { ChickenCoopStructure, BarnStructure, SheepPenStructure } from './AnimalPen';
import { performInteract } from '../../systems/actionManager';

const ANIMAL_INTERACTION_DIST = 2.4;

export const AnimalsManager: React.FC = React.memo(() => {
  const animals = useAnimalStore((state) => state.animals);
  const activeAnimalId = useAnimalStore((state) => state.activeAnimalId);
  const setActiveAnimalId = useAnimalStore((state) => state.setActiveAnimalId);
  const updateAnimals = useAnimalStore((state) => state.updateAnimals);
  const feedAnimal = useAnimalStore((state) => state.feedAnimal);
  const petAnimal = useAnimalStore((state) => state.petAnimal);
  const tickAccRef = useRef(0);

  // Frame loop for movement, behavior, and player proximity detection
  useFrame((_, delta) => {
    // 1. Advance animal wandering & cooldowns on fixed 5Hz game tick (every 0.2s)
    tickAccRef.current += delta;
    if (tickAccRef.current >= 0.2) {
      updateAnimals(tickAccRef.current);
      tickAccRef.current = 0;
    }

    // 2. Proximity detection (read directly from store to avoid 60fps React re-renders)
    const [px, , pz] = useGameStore.getState().playerPosition;
    let closestId: string | null = null;
    const maxDistSq = ANIMAL_INTERACTION_DIST * ANIMAL_INTERACTION_DIST;
    let minDistSq = maxDistSq;

    for (const animal of animals) {
      const [ax, , az] = animal.position;
      const dx = px - ax;
      const dz = pz - az;
      const distSq = dx * dx + dz * dz;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        closestId = animal.id;
      }
    }

    if (closestId !== activeAnimalId) {
      setActiveAnimalId(closestId);
    }
  });

  // Global keydown listeners for interacting with animals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in text fields
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      // Key E: Context action (shared with mobile touch action)
      if (e.code === 'KeyE') {
        performInteract();
        return;
      }

      const activeId = useAnimalStore.getState().activeAnimalId;
      if (!activeId) return;

      const currentAnimal = useAnimalStore
        .getState()
        .animals.find((a) => a.id === activeId);
      if (!currentAnimal) return;

      // Key F: Direct Feed action
      if (e.code === 'KeyF') {
        feedAnimal(currentAnimal.id);
      }

      // Key P: Direct Pet action
      if (e.code === 'KeyP') {
        petAnimal(currentAnimal.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedAnimal, petAnimal]);

  return (
    <group>
      {/* 1. Static 3D Animal Pens Structures (memoized so 5Hz ticks do not re-render them) */}
      <StaticAnimalPens />

      {/* 2. Render Animals */}
      {animals.map((animal) => (
        <AnimalEntity
          key={animal.id}
          animal={animal}
          isActive={animal.id === activeAnimalId}
        />
      ))}
    </group>
  );
});

// Isolated static pens component that never re-renders during gameplay
const StaticAnimalPens: React.FC = React.memo(() => (
  <group>
    <ChickenCoopStructure />
    <BarnStructure />
    <SheepPenStructure />

    {/* Divider fence between Cow Pasture and Sheep Pen */}
    <mesh position={[9.0, 0.45, 11.1]} castShadow receiveShadow>
      <boxGeometry args={[7.0, 0.08, 0.08]} />
      <meshStandardMaterial color="#9e6a38" roughness={0.85} />
    </mesh>
  </group>
));

const ActiveAnimalPulse: React.FC<{ isProductReady: boolean }> = ({ isProductReady }) => {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = state.clock.getElapsedTime();
      const s = 1.0 + Math.sin(t * 6.0) * 0.05;
      pulseRef.current.scale.set(s, 1, s);
    }
  });

  return (
    <group position={[0, 0.08, 0]}>
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.65, 8]} />
        <meshBasicMaterial
          color={isProductReady ? '#ffd166' : '#52b788'}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

interface AnimalEntityProps {
  animal: Animal;
  isActive: boolean;
}

const AnimalEntity: React.FC<AnimalEntityProps> = React.memo(({ animal, isActive }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Smoothly lerp 3D transform towards store state for 60/120 FPS fluid motion
    if (groupRef.current) {
      const [tx, ty, tz] = animal.position;
      const lerpSpeed = Math.min(1, 6 * delta);
      groupRef.current.position.x += (tx - groupRef.current.position.x) * lerpSpeed;
      groupRef.current.position.z += (tz - groupRef.current.position.z) * lerpSpeed;
      groupRef.current.position.y = ty;

      let diffRot = animal.rotation - groupRef.current.rotation.y;
      while (diffRot < -Math.PI) diffRot += Math.PI * 2;
      while (diffRot > Math.PI) diffRot -= Math.PI * 2;
      groupRef.current.rotation.y += diffRot * Math.min(1, 8 * delta);
    }
  });

  return (
    <group ref={groupRef} position={animal.position} rotation={[0, animal.rotation, 0]}>
      {/* Active Selection Ring */}
      {isActive && <ActiveAnimalPulse isProductReady={animal.isProductReady} />}

      {/* Specific Species 3D Model */}
      {animal.species === 'chicken' && (
        <ChickenModel
          isWalking={animal.isWalking}
          isProductReady={animal.isProductReady}
        />
      )}

      {animal.species === 'cow' && (
        <CowModel
          isWalking={animal.isWalking}
          isProductReady={animal.isProductReady}
        />
      )}

      {animal.species === 'sheep' && (
        <SheepModel
          isWalking={animal.isWalking}
          isProductReady={animal.isProductReady}
        />
      )}
    </group>
  );
});
