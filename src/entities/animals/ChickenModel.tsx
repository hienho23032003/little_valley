import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChickenModelProps {
  isWalking: boolean;
  isProductReady: boolean;
}

export const ChickenModel: React.FC<ChickenModelProps> = React.memo(({ isWalking, isProductReady }) => {
  const headRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const readyIconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Walking leg swing & wing flutter
    if (isWalking) {
      const legSwing = Math.sin(t * 12) * 0.5;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;
      }
      if (leftWingRef.current && rightWingRef.current) {
        const wingFlap = Math.sin(t * 14) * 0.2;
        leftWingRef.current.rotation.z = 0.2 + wingFlap;
        rightWingRef.current.rotation.z = -0.2 - wingFlap;
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(t * 12) * 0.15;
      }
    } else {
      // 2. Idle Pecking animation
      if (headRef.current) {
        // Peck every ~3 seconds
        const peckCycle = (t * 1.5) % Math.PI;
        const isPecking = Math.sin(t * 0.8) > 0.3;
        headRef.current.rotation.x = isPecking ? Math.abs(Math.sin(peckCycle * 3)) * 0.5 : 0;
      }
      if (leftWingRef.current && rightWingRef.current) {
        leftWingRef.current.rotation.z = 0.05;
        rightWingRef.current.rotation.z = -0.05;
      }
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    }

    // 3. Floating Egg Ready Indicator
    if (readyIconRef.current && isProductReady) {
      readyIconRef.current.position.y = 0.95 + Math.sin(t * 3) * 0.06;
      readyIconRef.current.rotation.y = t * 1.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Ready Egg Indicator */}
      {isProductReady && (
        <group ref={readyIconRef} position={[0, 0.95, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 7, 7]} />
            <meshStandardMaterial color="#fff3b0" roughness={0.4} emissive="#ffea00" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <octahedronGeometry args={[0.04, 0]} />
            <meshStandardMaterial color="#ffea00" emissive="#ffd60a" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Main Body (Feathery White/Cream) */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.26, 7, 6]} />
        <meshStandardMaterial color="#fafaf0" roughness={0.7} flatShading />
      </mesh>

      {/* Tail Feathers */}
      <group position={[0, 0.42, -0.22]} rotation={[0.4, 0, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.12, 0.22, 4]} />
          <meshStandardMaterial color="#f0efe6" roughness={0.8} flatShading />
        </mesh>
      </group>

      {/* Wings */}
      {/* Left Wing */}
      <mesh
        ref={leftWingRef}
        position={[-0.22, 0.35, 0]}
        rotation={[0, 0, 0.05]}
        castShadow
      >
        <boxGeometry args={[0.06, 0.18, 0.26]} />
        <meshStandardMaterial color="#f4f3ea" roughness={0.7} flatShading />
      </mesh>
      {/* Right Wing */}
      <mesh
        ref={rightWingRef}
        position={[0.22, 0.35, 0]}
        rotation={[0, 0, -0.05]}
        castShadow
      >
        <boxGeometry args={[0.06, 0.18, 0.26]} />
        <meshStandardMaterial color="#f4f3ea" roughness={0.7} flatShading />
      </mesh>

      {/* Head & Neck Group */}
      <group ref={headRef} position={[0, 0.52, 0.16]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.14, 6, 6]} />
          <meshStandardMaterial color="#fafaf0" roughness={0.7} flatShading />
        </mesh>

        {/* Yellow Beak */}
        <mesh position={[0, -0.02, 0.14]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.045, 0.1, 4]} />
          <meshStandardMaterial color="#ffb703" roughness={0.4} flatShading />
        </mesh>

        {/* Red Comb */}
        <mesh position={[0, 0.14, -0.01]} castShadow>
          <boxGeometry args={[0.04, 0.09, 0.14]} />
          <meshStandardMaterial color="#d90429" roughness={0.5} flatShading />
        </mesh>

        {/* Red Wattle */}
        <mesh position={[0, -0.09, 0.08]} castShadow>
          <sphereGeometry args={[0.035, 4, 4]} />
          <meshStandardMaterial color="#d90429" roughness={0.5} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.03, 0.08]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
        </mesh>
        <mesh position={[0.1, 0.03, 0.08]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
        </mesh>
      </group>

      {/* Legs & Feet */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.2, 0]}>
        <mesh position={[0, -0.08, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.16, 4]} />
          <meshStandardMaterial color="#fb8500" roughness={0.6} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.16, 0.04]} castShadow>
          <boxGeometry args={[0.08, 0.02, 0.1]} />
          <meshStandardMaterial color="#fb8500" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.2, 0]}>
        <mesh position={[0, -0.08, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.16, 4]} />
          <meshStandardMaterial color="#fb8500" roughness={0.6} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.16, 0.04]} castShadow>
          <boxGeometry args={[0.08, 0.02, 0.1]} />
          <meshStandardMaterial color="#fb8500" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
});
