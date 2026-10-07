import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useGameStore } from '../../stores/gameStore';

const DOG_MODEL_URL = '/models/animals/dog.glb';

export const DogCompanion: React.FC = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const currentActionRef = useRef<string>('iddle');

  // Dog position state in mutable refs for 60fps performance (AGENTS.md)
  const posRef = useRef<[number, number, number]>([6.5, 0, 7.0]);
  const rotRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);
  const stateTimerRef = useRef<number>(0);

  const { scene: rawScene, animations } = useGLTF(DOG_MODEL_URL);

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

  useEffect(() => {
    if (!clonedScene || animations.length === 0) return;

    const mixer = new THREE.AnimationMixer(clonedScene);
    mixerRef.current = mixer;

    const actions: Record<string, THREE.AnimationAction> = {};
    animations.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip);
    });
    actionsRef.current = actions;

    const act = actions['iddle'];
    if (act) {
      act.play();
      currentActionRef.current = 'iddle';
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [clonedScene, animations]);

  const switchAnim = (newAnim: string) => {
    if (currentActionRef.current === newAnim) return;
    const cur = actionsRef.current[currentActionRef.current];
    const nxt = actionsRef.current[newAnim];
    if (nxt) {
      nxt.reset();
      nxt.fadeIn(0.25);
      nxt.play();
      if (cur) cur.fadeOut(0.25);
      currentActionRef.current = newAnim;
    }
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (mixerRef.current) mixerRef.current.update(dt);

    stateTimerRef.current += dt;

    // Follow player if nearby, otherwise roam farmstead
    const playerPos = useGameStore.getState().playerPosition;
    const px = playerPos[0];
    const pz = playerPos[2];
    const dx = px - posRef.current[0];
    const dz = pz - posRef.current[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    let targetX = posRef.current[0];
    let targetZ = posRef.current[2];

    if (dist < 8.0 && dist > 2.2) {
      // Follow friendly player
      targetX = px - (dx / dist) * 1.8;
      targetZ = pz - (dz / dist) * 1.8;
      isMovingRef.current = true;
      rotRef.current = Math.atan2(dx, dz);
      switchAnim('run');
    } else if (dist <= 2.2) {
      // Near player: wag tail / sniff / idle
      isMovingRef.current = false;
      rotRef.current = Math.atan2(dx, dz);
      if (stateTimerRef.current > 4.0) {
        stateTimerRef.current = 0;
        const randomIdle = Math.random() > 0.5 ? 'walksent' : 'iddle';
        switchAnim(randomIdle);
      }
    } else {
      // Roam around doghouse / farm (X: 6 to 9, Z: 6 to 10)
      if (stateTimerRef.current > 5.0) {
        stateTimerRef.current = 0;
        if (Math.random() > 0.6) {
          isMovingRef.current = true;
          switchAnim('walk');
        } else {
          isMovingRef.current = false;
          switchAnim('walksent');
        }
      }
    }

    if (isMovingRef.current && dist > 2.0) {
      const step = 2.2 * dt;
      posRef.current[0] += (targetX - posRef.current[0]) * Math.min(1, step);
      posRef.current[2] += (targetZ - posRef.current[2]) * Math.min(1, step);
    }

    if (groupRef.current) {
      groupRef.current.position.set(posRef.current[0], 0, posRef.current[2]);
      groupRef.current.rotation.y = rotRef.current;
    }
  });

  return (
    <group ref={groupRef} position={[6.5, 0, 7.0]}>
      <primitive
        object={clonedScene}
        scale={[0.85, 0.85, 0.85]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
});

useGLTF.preload(DOG_MODEL_URL);
