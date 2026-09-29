import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CowModelProps {
  isWalking: boolean;
  isProductReady: boolean;
}

export const CowModel: React.FC<CowModelProps> = React.memo(({ isWalking, isProductReady }) => {
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const frontLeftLeg = useRef<THREE.Group>(null);
  const frontRightLeg = useRef<THREE.Group>(null);
  const backLeftLeg = useRef<THREE.Group>(null);
  const backRightLeg = useRef<THREE.Group>(null);
  const readyIconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Walking leg cycle
    if (isWalking) {
      const walkSpeed = t * 7;
      const legSwing = Math.sin(walkSpeed) * 0.45;
      if (frontLeftLeg.current && backRightLeg.current) {
        frontLeftLeg.current.rotation.x = legSwing;
        backRightLeg.current.rotation.x = legSwing;
      }
      if (frontRightLeg.current && backLeftLeg.current) {
        frontRightRightSwing(frontRightLeg.current, backLeftLeg.current, -legSwing);
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(walkSpeed * 0.5) * 0.08;
      }
    } else {
      // 2. Idle grazing / looking around
      if (headRef.current) {
        const graze = Math.sin(t * 0.7);
        headRef.current.rotation.x = graze > 0.2 ? 0.35 : 0.05; // Head down to graze
      }
      if (frontLeftLeg.current) frontLeftLeg.current.rotation.x = 0;
      if (frontRightLeg.current) frontRightLeg.current.rotation.x = 0;
      if (backLeftLeg.current) backLeftLeg.current.rotation.x = 0;
      if (backRightLeg.current) backRightLeg.current.rotation.x = 0;
    }

    // 3. Tail Swish
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 3.5) * 0.25;
    }

    // 4. Product Ready Milk Indicator
    if (readyIconRef.current && isProductReady) {
      readyIconRef.current.position.y = 1.6 + Math.sin(t * 3) * 0.08;
      readyIconRef.current.rotation.y = t * 1.5;
    }
  });

  function frontRightRightSwing(fl: THREE.Group, bl: THREE.Group, val: number) {
    fl.rotation.x = val;
    bl.rotation.x = val;
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Ready Milk Indicator */}
      {isProductReady && (
        <group ref={readyIconRef} position={[0, 1.6, 0]}>
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

      {/* Main Body (Spotted White) */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.72, 1.35]} />
        <meshStandardMaterial color="#fafaf2" roughness={0.8} flatShading />
      </mesh>

      {/* Black Spots on Body */}
      <mesh position={[-0.42, 0.82, 0.15]} castShadow>
        <boxGeometry args={[0.05, 0.35, 0.45]} />
        <meshStandardMaterial color="#212529" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.42, 0.7, -0.2]} castShadow>
        <boxGeometry args={[0.05, 0.38, 0.5]} />
        <meshStandardMaterial color="#212529" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 1.12, -0.1]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.4]} />
        <meshStandardMaterial color="#212529" roughness={0.8} flatShading />
      </mesh>

      {/* Pink Udder */}
      <group position={[0, 0.36, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.14, 0.35]} />
          <meshStandardMaterial color="#ffb4a2" roughness={0.6} />
        </mesh>
      </group>

      {/* Tail with Tuft */}
      <group ref={tailRef} position={[0, 0.95, -0.68]} rotation={[-0.3, 0, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 4]} />
          <meshStandardMaterial color="#fafaf2" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.52, 0]} castShadow>
          <coneGeometry args={[0.06, 0.12, 4]} />
          <meshStandardMaterial color="#212529" roughness={0.8} />
        </mesh>
      </group>

      {/* Head & Neck */}
      <group ref={headRef} position={[0, 0.95, 0.75]}>
        {/* Head Block */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.48, 0.52]} />
          <meshStandardMaterial color="#fafaf2" roughness={0.8} flatShading />
        </mesh>

        {/* Black spot on eye */}
        <mesh position={[-0.14, 0.1, 0.12]} castShadow>
          <boxGeometry args={[0.22, 0.22, 0.3]} />
          <meshStandardMaterial color="#212529" roughness={0.8} flatShading />
        </mesh>

        {/* Snout with Pink Nose & Mouth */}
        <mesh position={[0, -0.12, 0.28]} castShadow>
          <boxGeometry args={[0.38, 0.24, 0.22]} />
          <meshStandardMaterial color="#ffb4a2" roughness={0.6} flatShading />
        </mesh>
        {/* Nostrils */}
        <mesh position={[-0.08, -0.1, 0.395]}>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          <meshStandardMaterial color="#6d597a" />
        </mesh>
        <mesh position={[0.08, -0.1, 0.395]}>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          <meshStandardMaterial color="#6d597a" />
        </mesh>

        {/* Cute Cream Horns */}
        <mesh position={[-0.26, 0.3, -0.06]} rotation={[0, 0, -0.45]} castShadow>
          <coneGeometry args={[0.05, 0.18, 5]} />
          <meshStandardMaterial color="#faedcd" roughness={0.6} flatShading />
        </mesh>
        <mesh position={[0.26, 0.3, -0.06]} rotation={[0, 0, 0.45]} castShadow>
          <coneGeometry args={[0.05, 0.18, 5]} />
          <meshStandardMaterial color="#faedcd" roughness={0.6} flatShading />
        </mesh>

        {/* Floppy Ears */}
        <mesh position={[-0.32, 0.12, -0.05]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.08]} />
          <meshStandardMaterial color="#fafaf2" roughness={0.8} />
        </mesh>
        <mesh position={[0.32, 0.12, -0.05]} rotation={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.08]} />
          <meshStandardMaterial color="#212529" roughness={0.8} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.245, 0.06, 0.14]}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.245, 0.06, 0.14]}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* 4 Sturdy Legs with Hooves */}
      {/* Front Left */}
      <group ref={frontLeftLeg} position={[-0.28, 0.4, 0.45]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.42, 0.15]} />
          <meshStandardMaterial color="#fafaf2" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color="#212529" roughness={0.9} />
        </mesh>
      </group>

      {/* Front Right */}
      <group ref={frontRightLeg} position={[0.28, 0.4, 0.45]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.42, 0.15]} />
          <meshStandardMaterial color="#212529" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color="#212529" roughness={0.9} />
        </mesh>
      </group>

      {/* Back Left */}
      <group ref={backLeftLeg} position={[-0.28, 0.4, -0.45]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.42, 0.15]} />
          <meshStandardMaterial color="#fafaf2" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color="#212529" roughness={0.9} />
        </mesh>
      </group>

      {/* Back Right */}
      <group ref={backRightLeg} position={[0.28, 0.4, -0.45]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.42, 0.15]} />
          <meshStandardMaterial color="#fafaf2" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshStandardMaterial color="#212529" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
});
