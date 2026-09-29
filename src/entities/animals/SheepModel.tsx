import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SheepModelProps {
  isWalking: boolean;
  isProductReady: boolean;
}

export const SheepModel: React.FC<SheepModelProps> = React.memo(({ isWalking, isProductReady }) => {
  const headRef = useRef<THREE.Group>(null);
  const woolBodyRef = useRef<THREE.Group>(null);
  const frontLeftLeg = useRef<THREE.Group>(null);
  const frontRightLeg = useRef<THREE.Group>(null);
  const backLeftLeg = useRef<THREE.Group>(null);
  const backRightLeg = useRef<THREE.Group>(null);
  const readyIconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Walking leg swing & wool bounce
    if (isWalking) {
      const walkSpeed = t * 8;
      const legSwing = Math.sin(walkSpeed) * 0.45;
      if (frontLeftLeg.current && backRightLeg.current) {
        frontLeftLeg.current.rotation.x = legSwing;
        backRightLeg.current.rotation.x = legSwing;
      }
      if (frontRightLeg.current && backLeftLeg.current) {
        frontRightLeg.current.rotation.x = -legSwing;
        backLeftLeg.current.rotation.x = -legSwing;
      }
      if (woolBodyRef.current) {
        woolBodyRef.current.position.y = 0.58 + Math.abs(Math.sin(walkSpeed)) * 0.05;
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(walkSpeed * 0.5) * 0.06;
      }
    } else {
      // 2. Idle chewing & head bob
      if (headRef.current) {
        const chew = Math.sin(t * 3.5) * 0.04;
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.12;
        headRef.current.position.y = 0.65 + chew;
      }
      if (woolBodyRef.current) {
        woolBodyRef.current.position.y = 0.58;
      }
      if (frontLeftLeg.current) frontLeftLeg.current.rotation.x = 0;
      if (frontRightLeg.current) frontRightLeg.current.rotation.x = 0;
      if (backLeftLeg.current) backLeftLeg.current.rotation.x = 0;
      if (backRightLeg.current) backRightLeg.current.rotation.x = 0;
    }

    // 3. Product Ready Wool Indicator
    if (readyIconRef.current && isProductReady) {
      readyIconRef.current.position.y = 1.35 + Math.sin(t * 3) * 0.07;
      readyIconRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Ready Wool Ball Indicator */}
      {isProductReady && (
        <group ref={readyIconRef} position={[0, 1.35, 0]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[0.11, 1]} />
            <meshStandardMaterial color="#b388eb" emissive="#c77dff" emissiveIntensity={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <octahedronGeometry args={[0.04, 0]} />
            <meshStandardMaterial color="#ffd166" emissive="#ffeaa7" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Fluffy Wool Body (Layered Low-Poly Cloud Puffs) */}
      <group ref={woolBodyRef} position={[0, 0.58, 0]}>
        {/* Central Wool Torso */}
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.9} flatShading />
        </mesh>
        {/* Wool Puff Front */}
        <mesh position={[0, 0.08, 0.28]} scale={0.75} castShadow>
          <dodecahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial color="#f1f3f5" roughness={0.9} flatShading />
        </mesh>
        {/* Wool Puff Back */}
        <mesh position={[0, 0.08, -0.28]} scale={0.75} castShadow>
          <dodecahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial color="#f1f3f5" roughness={0.9} flatShading />
        </mesh>
        {/* Wool Side Puffs */}
        <mesh position={[-0.24, 0, 0]} scale={0.7} castShadow>
          <dodecahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0.24, 0, 0]} scale={0.7} castShadow>
          <dodecahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Dark Slate Head & Face */}
      <group ref={headRef} position={[0, 0.65, 0.52]}>
        {/* Head Block */}
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.28, 0.32]} />
          <meshStandardMaterial color="#495057" roughness={0.8} flatShading />
        </mesh>

        {/* Fluffy Wool Forehead Cap */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.9} flatShading />
        </mesh>

        {/* Snout with Pinkish-Gray Tip */}
        <mesh position={[0, -0.06, 0.16]} castShadow>
          <boxGeometry args={[0.18, 0.14, 0.14]} />
          <meshStandardMaterial color="#343a40" roughness={0.8} />
        </mesh>

        {/* Floppy Side Ears */}
        <mesh position={[-0.18, 0.04, -0.02]} rotation={[0, 0, -0.4]} castShadow>
          <boxGeometry args={[0.12, 0.06, 0.06]} />
          <meshStandardMaterial color="#495057" roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0.04, -0.02]} rotation={[0, 0, 0.4]} castShadow>
          <boxGeometry args={[0.12, 0.06, 0.06]} />
          <meshStandardMaterial color="#495057" roughness={0.8} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.135, 0.04, 0.08]}>
          <sphereGeometry args={[0.022, 4, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.135, 0.04, 0.08]}>
          <sphereGeometry args={[0.022, 4, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* 4 Little Dark Legs */}
      {/* Front Left */}
      <group ref={frontLeftLeg} position={[-0.2, 0.32, 0.25]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.32, 4]} />
          <meshStandardMaterial color="#343a40" roughness={0.9} />
        </mesh>
      </group>

      {/* Front Right */}
      <group ref={frontRightLeg} position={[0.2, 0.32, 0.25]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.32, 4]} />
          <meshStandardMaterial color="#343a40" roughness={0.9} />
        </mesh>
      </group>

      {/* Back Left */}
      <group ref={backLeftLeg} position={[-0.2, 0.32, -0.25]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.32, 4]} />
          <meshStandardMaterial color="#343a40" roughness={0.9} />
        </mesh>
      </group>

      {/* Back Right */}
      <group ref={backRightLeg} position={[0.2, 0.32, -0.25]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.32, 4]} />
          <meshStandardMaterial color="#343a40" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
});
