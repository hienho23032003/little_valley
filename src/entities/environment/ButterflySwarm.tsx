import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const BUTTERFLY_MODEL_URL = '/models/animals/butterfly.glb';

interface SingleButterflyProps {
  basePos: [number, number, number];
  radius?: number;
  speed?: number;
  heightOffset?: number;
  phase?: number;
}

const SingleButterfly: React.FC<SingleButterflyProps> = React.memo(({
  basePos,
  radius = 2.0,
  speed = 1.0,
  heightOffset = 1.0,
  phase = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  const { scene: rawScene, animations } = useGLTF(BUTTERFLY_MODEL_URL);

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(rawScene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return clone;
  }, [rawScene]);

  useEffect(() => {
    if (!clonedScene || animations.length === 0) return;
    const mixer = new THREE.AnimationMixer(clonedScene);
    mixerRef.current = mixer;
    const clip = animations.find((a) => a.name === 'fly') || animations[0];
    if (clip) {
      const act = mixer.clipAction(clip);
      act.setEffectiveTimeScale(1.8 + Math.random() * 0.4);
      act.play();
    }
    return () => {
      mixer.stopAllAction();
    };
  }, [clonedScene, animations]);

  useFrame((state, delta) => {
    if (mixerRef.current) mixerRef.current.update(Math.min(delta, 0.05));

    if (groupRef.current) {
      const t = state.clock.getElapsedTime() * speed + phase;
      const x = basePos[0] + Math.cos(t) * radius;
      const z = basePos[2] + Math.sin(t) * radius;
      const y = basePos[1] + heightOffset + Math.sin(t * 3) * 0.25;

      groupRef.current.position.set(x, y, z);
      // Face flight direction
      groupRef.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <group ref={groupRef} position={basePos}>
      <primitive object={clonedScene} scale={[0.55, 0.55, 0.55]} />
    </group>
  );
});

export const ButterflySwarm: React.FC = React.memo(() => {
  const swarmPoints: [number, number, number][] = [
    [8.5, 0, 8.5],    // Over farm pumpkins & cabbages
    [-1.0, 0, -10.0], // Over village square flowers
    [10.0, 0, 14.0],  // Over farm trellis
    [-12.0, 0, 10.0], // Over crop field
  ];

  return (
    <group>
      {swarmPoints.map((pos, idx) => (
        <React.Fragment key={`butterfly-cluster-${idx}`}>
          <SingleButterfly basePos={pos} radius={1.8} speed={0.9} heightOffset={0.9} phase={idx * 1.5} />
          <SingleButterfly basePos={pos} radius={2.4} speed={0.7} heightOffset={1.3} phase={idx * 1.5 + 2.0} />
        </React.Fragment>
      ))}
    </group>
  );
});

useGLTF.preload(BUTTERFLY_MODEL_URL);
