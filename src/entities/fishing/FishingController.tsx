import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';
import { useFishingStore } from '../../stores/fishingStore';
import { FishingBobber } from './FishingBobber';
import { FishingLine } from './FishingLine';
import { AmbientLakeFish } from './AmbientLakeFish';

/**
 * Moored stylized wooden boat floating beside Azure Pier
 */
const MooredBoat: React.FC = React.memo(() => {
  const fbx = useFBX('/models/fishing/Boat.fbx');
  const boatRef = useRef<THREE.Group>(null);

  const clone = useMemo(() => {
    const c = fbx.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [fbx]);

  useFrame((state) => {
    if (!boatRef.current) return;
    const t = state.clock.getElapsedTime();
    boatRef.current.position.y = -0.14 + Math.sin(t * 1.8) * 0.018;
    boatRef.current.rotation.z = Math.sin(t * 1.4) * 0.035;
    boatRef.current.rotation.x = Math.cos(t * 1.6) * 0.02;
  });

  return (
    <group ref={boatRef} position={[23.0, -0.14, 34.8]} rotation={[0, 0.45, 0]}>
      <primitive object={clone} scale={[0.007, 0.007, 0.007]} />
    </group>
  );
});

export const FishingController: React.FC = React.memo(() => {
  // Advance store simulation frame-rate independently
  useFrame((_, delta) => {
    useFishingStore.getState().tickFishing(delta);
  });

  return (
    <group name="fishing_system">
      {/* 3D Floating Bobber */}
      <FishingBobber />

      {/* Dynamic Bezier Fishing Line */}
      <FishingLine />

      {/* Living Ambient Fish swimming in Azure Lake */}
      <AmbientLakeFish />

      {/* High-fidelity 3D Moored Boat at Azure Lake Pier */}
      <MooredBoat />
    </group>
  );
});

useFBX.preload('/models/fishing/Boat.fbx');
