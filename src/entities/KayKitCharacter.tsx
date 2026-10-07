import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export interface KayKitCharacterProps {
  modelUrl: string;
  animationName?: string;
  tintMeshName?: string;
  tintColor?: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const ANIMATION_MOVE_URL = '/models/animations/Rig_Medium_MovementBasic.glb';
const ANIMATION_GEN_URL = '/models/animations/Rig_Medium_General.glb';

export const KayKitCharacter: React.FC<KayKitCharacterProps> = React.memo(({
  modelUrl,
  animationName = 'Idle_A',
  tintMeshName,
  tintColor,
  scale = 0.75,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) => {
  const currentActionName = useRef<string | null>(null);

  // Load character glb
  const { scene: rawScene } = useGLTF(modelUrl);

  // Load animations
  const { animations: moveAnims } = useGLTF(ANIMATION_MOVE_URL);
  const { animations: genAnims } = useGLTF(ANIMATION_GEN_URL);

  const allAnimations = useMemo(() => {
    return [...moveAnims, ...genAnims];
  }, [moveAnims, genAnims]);

  // Clone skinned scene using SkeletonUtils to guarantee fresh bone bindings
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(rawScene);

    // Apply shadow casting & material setup
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }
      }
    });

    return clone;
  }, [rawScene]);

  // Direct AnimationMixer explicitly targeted to clonedScene root
  const mixer = useMemo(() => {
    const m = new THREE.AnimationMixer(clonedScene);
    return m;
  }, [clonedScene]);

  // Clean up previous animations when mixer recreates
  useEffect(() => {
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer]);

  // Create dictionary of actions
  const actions = useMemo(() => {
    const actMap: Record<string, THREE.AnimationAction> = {};
    for (const clip of allAnimations) {
      actMap[clip.name] = mixer.clipAction(clip);
    }
    return actMap;
  }, [mixer, allAnimations]);

  // Advance animation mixer on every frame
  useFrame((_, delta) => {
    mixer.update(Math.min(delta, 0.05));
  });

  // Apply tint color to specific accent mesh (e.g. Cape or BearHat)
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const isTarget =
          (tintMeshName && mesh.name.toLowerCase().includes(tintMeshName.toLowerCase())) ||
          mesh.name.toLowerCase().includes('cape') ||
          mesh.name.toLowerCase().includes('bearhat');

        if (isTarget && tintColor) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if ('color' in mat) {
                (mat as THREE.MeshStandardMaterial).color.set(tintColor);
              }
            });
          } else if (mesh.material && 'color' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(tintColor);
          }
        }
      }
    });
  }, [clonedScene, tintMeshName, tintColor]);

  // Smooth crossfade animation transitions
  useEffect(() => {
    const targetAction = actions[animationName] || actions['Idle_A'] || Object.values(actions)[0];
    if (!targetAction) return;

    if (currentActionName.current !== animationName || !targetAction.isRunning()) {
      const prevAction =
        currentActionName.current && currentActionName.current !== animationName
          ? actions[currentActionName.current]
          : null;

      targetAction.reset();
      if (prevAction) {
        targetAction.fadeIn(0.2);
        prevAction.fadeOut(0.2);
      } else {
        targetAction.setEffectiveWeight(1);
      }
      targetAction.play();

      currentActionName.current = animationName;
    }

    return () => {
      currentActionName.current = null;
    };
  }, [actions, animationName]);

  const scaleVec: [number, number, number] = typeof scale === 'number' ? [scale, scale, scale] : scale;

  return (
    <group position={position} rotation={rotation} scale={scaleVec}>
      <primitive object={clonedScene} />
    </group>
  );
});

// Preload models and animations for instantaneous switching
useGLTF.preload('/models/characters/Knight.glb');
useGLTF.preload('/models/characters/Mage.glb');
useGLTF.preload('/models/characters/Barbarian.glb');
useGLTF.preload('/models/characters/Ranger.glb');
useGLTF.preload('/models/characters/Rogue.glb');
useGLTF.preload('/models/characters/Rogue_Hooded.glb');
useGLTF.preload(ANIMATION_MOVE_URL);
useGLTF.preload(ANIMATION_GEN_URL);
