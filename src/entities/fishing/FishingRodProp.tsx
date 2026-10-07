import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';
import { useFishingStore } from '../../stores/fishingStore';
import { fishingTipAnchor } from './fishingTipAnchor';

interface FishingRodPropProps {
  modelUrl?: string;
  onTipWorldPosUpdate?: (tipPos: [number, number, number]) => void;
}

export const FishingRodProp: React.FC<FishingRodPropProps> = React.memo(({
  modelUrl = '/models/fishing/FishingRod_Lvl1.fbx',
  onTipWorldPosUpdate,
}) => {
  const fbx = useFBX(modelUrl);
  const rodRef = useRef<THREE.Group>(null);
  const tipRef = useRef<THREE.Group>(null);
  const tempTipVec = useMemo(() => new THREE.Vector3(), []);

  const phase = useFishingStore((state) => state.phase);
  const castPower = useFishingStore((state) => state.castPower);
  const isHoldingReel = useFishingStore((state) => state.isHoldingReel);

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
    if (!rodRef.current) return;
    const t = state.clock.getElapsedTime();

    if (phase === 'charging') {
      // Pull rod back as cast power charges
      rodRef.current.rotation.x = -0.45 - castPower * 0.4;
      rodRef.current.rotation.y = 0.15;
      rodRef.current.rotation.z = -0.15;
    } else if (phase === 'waiting' || phase === 'nibble') {
      // Hold rod forward resting over the water with slight breath sway
      const nibbleShake = phase === 'nibble' ? Math.sin(t * 18) * 0.04 : 0;
      rodRef.current.rotation.x = 0.2 + Math.sin(t * 1.5) * 0.02 + nibbleShake;
      rodRef.current.rotation.y = 0.05;
      rodRef.current.rotation.z = -0.05;
    } else if (phase === 'biting') {
      // Sharp tug dip when fish strikes!
      rodRef.current.rotation.x = 0.4 + Math.sin(t * 24) * 0.08;
      rodRef.current.rotation.y = 0.05;
      rodRef.current.rotation.z = -0.05;
    } else if (phase === 'minigame') {
      // Under tension! Rod bows and flexes with reeling strain
      const flex = isHoldingReel ? 0.35 : 0.15;
      rodRef.current.rotation.x = 0.3 + flex + Math.sin(t * 14) * 0.05;
      rodRef.current.rotation.y = 0.08 + Math.cos(t * 8) * 0.03;
      rodRef.current.rotation.z = -0.08;
    } else {
      // Idle carrying posture
      rodRef.current.rotation.x = 0.15;
      rodRef.current.rotation.y = 0.1;
      rodRef.current.rotation.z = -0.1;
    }

    // Broadcast world tip position for dynamic fishing line
    if (tipRef.current) {
      tipRef.current.getWorldPosition(tempTipVec);
      fishingTipAnchor.pos.copy(tempTipVec);
      fishingTipAnchor.active = true;
      if (onTipWorldPosUpdate) {
        onTipWorldPosUpdate([tempTipVec.x, tempTipVec.y, tempTipVec.z]);
      }
    }
  });

  useEffect(() => {
    return () => {
      fishingTipAnchor.active = false;
    };
  }, []);

  return (
    <group ref={rodRef} position={[0.26, 0.42, 0.18]}>
      {/* 3D Fishing Rod Model scaled to natural hand size */}
      <primitive object={clone} scale={[0.0055, 0.0055, 0.0055]} rotation={[0, Math.PI / 2, 0]} />

      {/* Tip marker for fishing line attachment */}
      <group ref={tipRef} position={[0, 1.45, 1.85]} />
    </group>
  );
});

// Preload the rods
useFBX.preload('/models/fishing/FishingRod_Lvl1.fbx');
useFBX.preload('/models/fishing/FishingRod_Lvl2.fbx');
useFBX.preload('/models/fishing/FishingRod_Lvl3.fbx');
useFBX.preload('/models/fishing/FishingRod_Lvl4.fbx');
useFBX.preload('/models/fishing/FishingRod_Lvl5.fbx');
