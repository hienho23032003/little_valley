import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

interface CowModelProps {
  isWalking: boolean;
  isProductReady: boolean;
}

const COW_MODEL_URL = '/models/animals/Cow.glb';

export const CowModel: React.FC<CowModelProps> = React.memo(({ isWalking, isProductReady }) => {
  const groupRef = useRef<THREE.Group>(null);
  const readyIconRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const currentActionRef = useRef<string>('iddle');

  const { scene: rawScene, animations } = useGLTF(COW_MODEL_URL);

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(rawScene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [rawScene]);

  // Setup animations
  useEffect(() => {
    if (!clonedScene || animations.length === 0) return;

    const mixer = new THREE.AnimationMixer(clonedScene);
    mixerRef.current = mixer;

    const actions: Record<string, THREE.AnimationAction> = {};
    animations.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip);
    });
    actionsRef.current = actions;

    const initial = isWalking ? 'walk' : 'iddle';
    const act = actions[initial] || actions['iddle'];
    if (act) {
      act.play();
      currentActionRef.current = initial;
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [clonedScene, animations]);

  // Switch between walk and idle
  useEffect(() => {
    const target = isWalking ? 'walk' : 'iddle';
    if (target === currentActionRef.current) return;

    const current = actionsRef.current[currentActionRef.current];
    const next = actionsRef.current[target] || actionsRef.current['walking'] || actionsRef.current['iddle'];

    if (next) {
      next.reset();
      next.fadeIn(0.2);
      next.play();
      if (current) current.fadeOut(0.2);
      currentActionRef.current = target;
    }
  }, [isWalking]);

  // Frame update
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(Math.min(delta, 0.05));
    }

    // Product Ready Milk Bottle floating indicator
    if (readyIconRef.current && isProductReady) {
      const t = state.clock.getElapsedTime();
      readyIconRef.current.position.y = 1.9 + Math.sin(t * 3) * 0.08;
      readyIconRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ready Milk Bottle Indicator */}
      {isProductReady && (
        <group ref={readyIconRef} position={[0, 1.9, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.09, 0.22, 6]} />
            <meshStandardMaterial color="#f8f9fa" emissive="#90e0ef" emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <octahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial color="#00b4d8" emissive="#90e0ef" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Real 3D Low-Poly Animated Cow from stylooanimalassetpack */}
      <primitive
        object={clonedScene}
        scale={[0.7, 0.7, 0.7]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
});

useGLTF.preload(COW_MODEL_URL);
