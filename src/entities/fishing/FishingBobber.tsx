import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFishingStore } from '../../stores/fishingStore';

export const FishingBobber: React.FC = React.memo(() => {
  const bobberGroupRef = useRef<THREE.Group>(null);
  const ripple1Ref = useRef<THREE.Mesh>(null);
  const ripple2Ref = useRef<THREE.Mesh>(null);
  const alertRef = useRef<THREE.Group>(null);

  const bobberPos = useFishingStore((state) => state.bobberPos);
  const phase = useFishingStore((state) => state.phase);

  useFrame((state) => {
    if (!bobberGroupRef.current || !bobberPos) return;

    const t = state.clock.getElapsedTime();
    let yOffset = 0.04;
    let tiltX = 0;
    let tiltZ = 0;

    if (phase === 'waiting') {
      // Gentle lazy surface bobbing
      yOffset += Math.sin(t * 3.0) * 0.035;
      tiltX = Math.sin(t * 2.0) * 0.1;
      tiltZ = Math.cos(t * 2.5) * 0.1;
    } else if (phase === 'nibble') {
      // Rapid intermittent twitch
      yOffset += -0.04 + Math.sin(t * 18.0) * 0.04;
      tiltX = Math.sin(t * 20.0) * 0.25;
      tiltZ = Math.cos(t * 22.0) * 0.25;
    } else if (phase === 'biting') {
      // Strong downward tug / plunged underwater
      yOffset += -0.12 + Math.sin(t * 25.0) * 0.03;
      tiltX = Math.sin(t * 28.0) * 0.35;
      tiltZ = Math.cos(t * 30.0) * 0.35;
    } else if (phase === 'minigame') {
      // Vigorous thrashing as fish fights
      yOffset += Math.sin(t * 14.0) * 0.06;
      tiltX = Math.sin(t * 16.0) * 0.4;
      tiltZ = Math.cos(t * 18.0) * 0.4;
    }

    bobberGroupRef.current.position.set(bobberPos[0], bobberPos[1] + yOffset, bobberPos[2]);
    bobberGroupRef.current.rotation.set(tiltX, t * 0.8, tiltZ);

    // Dynamic water ripples expansion & fade
    if (ripple1Ref.current) {
      const ripPhase1 = (t * 1.5) % 1.0;
      const s1 = 0.3 + ripPhase1 * 1.2;
      ripple1Ref.current.scale.set(s1, s1, 1);
      (ripple1Ref.current.material as THREE.MeshBasicMaterial).opacity = (1.0 - ripPhase1) * 0.6;
    }

    if (ripple2Ref.current) {
      const ripPhase2 = (t * 1.5 + 0.5) % 1.0;
      const s2 = 0.3 + ripPhase2 * 1.2;
      ripple2Ref.current.scale.set(s2, s2, 1);
      (ripple2Ref.current.material as THREE.MeshBasicMaterial).opacity = (1.0 - ripPhase2) * 0.6;
    }

    // Exclamation mark bounce when fish bites
    if (alertRef.current) {
      if (phase === 'biting') {
        alertRef.current.visible = true;
        const bounce = Math.abs(Math.sin(t * 14.0)) * 0.2;
        alertRef.current.position.y = 0.75 + bounce;
        alertRef.current.scale.setScalar(1.0 + Math.sin(t * 18.0) * 0.15);
      } else {
        alertRef.current.visible = false;
      }
    }
  });

  if (!bobberPos || phase === 'idle' || phase === 'charging' || phase === 'celebration' || phase === 'escaped') {
    return null;
  }

  return (
    <group position={[bobberPos[0], 0, bobberPos[2]]}>
      {/* Expanding water ripple rings */}
      <mesh
        ref={ripple1Ref}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
      >
        <ringGeometry args={[0.3, 0.38, 24]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        ref={ripple2Ref}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
      >
        <ringGeometry args={[0.3, 0.38, 24]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Bobber Mesh Group */}
      <group ref={bobberGroupRef}>
        {/* Red Top Half Dome */}
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ef233c" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* White Bottom Half Dome */}
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Black Middle Band */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.02, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>

        {/* Antenna Stem */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        {/* High-visibility Fluorescent Tip */}
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshStandardMaterial color="#ffbe0b" emissive="#ffbe0b" emissiveIntensity={0.6} />
        </mesh>

        {/* Exclamation '!' Alert Marker when Fish Bites */}
        <group ref={alertRef} position={[0, 0.75, 0]} visible={false}>
          {/* Main Exclamation Stroke */}
          <mesh position={[0, 0.12, 0]}>
            <capsuleGeometry args={[0.065, 0.22, 8, 12]} />
            <meshStandardMaterial
              color="#ff0054"
              emissive="#ff0054"
              emissiveIntensity={1.2}
              roughness={0.1}
            />
          </mesh>
          {/* Dot */}
          <mesh position={[0, -0.1, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color="#ff0054"
              emissive="#ff0054"
              emissiveIntensity={1.2}
              roughness={0.1}
            />
          </mesh>
          {/* Golden Glow Aura */}
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#f72585" transparent opacity={0.35} />
          </mesh>
        </group>
      </group>
    </group>
  );
});
