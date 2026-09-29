import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../stores/gameStore';
import { useKeyboardControls } from '../systems/useKeyboardControls';
import { inputManager } from '../systems/inputManager';
import { PALETTE } from '../utils/colors';
import { getTerrainHeight } from '../data/worldData';
import { resolveMovement, syncPlacedBuildings } from '../systems/collisionSystem';
import { useBuildStore } from '../stores/buildStore';

// Configurable movement speed (units per second)
export const PLAYER_SPEED = 5.5;
export const ROTATION_LERP_SPEED = 14.0;

export interface CharacterConfig {
  skinColor?: string;
  hairColor?: string;
  shirtColor?: string;
  cuffColor?: string;
  overallsColor?: string;
  bandanaColor?: string;
  hatColor?: string;
  hatRibbonColor?: string;
  bootsColor?: string;
  beltColor?: string;
  buckleColor?: string;
  hasHat?: boolean;
  hasBandana?: boolean;
  hasPouch?: boolean;
}

export const DEFAULT_PLAYER_CONFIG: Required<CharacterConfig> = {
  skinColor: PALETTE.skinTone,
  hairColor: PALETTE.hairBrown,
  shirtColor: PALETTE.shirtRed,
  cuffColor: '#f87171',
  overallsColor: PALETTE.overallsBlue,
  bandanaColor: PALETTE.farmerBandana,
  hatColor: PALETTE.farmerHat,
  hatRibbonColor: PALETTE.farmerHatRibbon,
  bootsColor: PALETTE.farmerBoots,
  beltColor: PALETTE.leatherBelt,
  buckleColor: PALETTE.buckleBrass,
  hasHat: true,
  hasBandana: true,
  hasPouch: true,
};

interface PlayerProps {
  config?: CharacterConfig;
}

export const Player: React.FC<PlayerProps> = React.memo(({ config: customConfig }) => {
  const config = { ...DEFAULT_PLAYER_CONFIG, ...customConfig };

  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);

  useKeyboardControls();
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerRotation = useGameStore((state) => state.setPlayerRotation);
  const setIsMoving = useGameStore((state) => state.setIsMoving);
  const worldBounds = useGameStore((state) => state.worldBounds);
  const spawnPosition = useGameStore((state) => state.spawnPosition);
  const placedBuildings = useBuildStore((state) => state.placedBuildings);

  // Sync placed buildings to collision spatial grid whenever player constructs or removes a structure
  useEffect(() => {
    syncPlacedBuildings(placedBuildings);
  }, [placedBuildings]);

  // Position, rotation, and animation refs for 60fps frame-rate independent movement
  const initialY = getTerrainHeight(spawnPosition[0], spawnPosition[2]);
  const currentPos = useRef<THREE.Vector3>(new THREE.Vector3(spawnPosition[0], initialY, spawnPosition[2]));
  const currentRotation = useRef<number>(0);
  const walkCycle = useRef<number>(0);
  const idleCycle = useRef<number>(0);
  const lastStorePos = useRef<THREE.Vector3>(new THREE.Vector3(spawnPosition[0], initialY, spawnPosition[2]));
  const wasMovingRef = useRef<boolean>(false);

  // Sync when player is reset to spawn externally
  useEffect(() => {
    const unsub = useGameStore.subscribe((state) => {
      if (
        state.playerPosition[0] === state.spawnPosition[0] &&
        state.playerPosition[2] === state.spawnPosition[2] &&
        (currentPos.current.x !== state.spawnPosition[0] ||
          currentPos.current.z !== state.spawnPosition[2])
      ) {
        const resetY = getTerrainHeight(state.spawnPosition[0], state.spawnPosition[2]);
        currentPos.current.set(state.spawnPosition[0], resetY, state.spawnPosition[2]);
        lastStorePos.current.set(state.spawnPosition[0], resetY, state.spawnPosition[2]);
        if (groupRef.current) {
          groupRef.current.position.set(state.spawnPosition[0], resetY, state.spawnPosition[2]);
        }
      }
    });
    return unsub;
  }, []);

  useFrame((_, delta) => {
    // Frame-rate independent delta time (capped to 0.05s to avoid huge steps after tab blur)
    const dt = Math.min(delta, 0.05);

    // Read unified input from Keyboard + Mobile/Mouse Virtual Joystick
    const { x: inputX, y: inputY } = inputManager.getCombinedInput();

    // Movement direction relative to camera angle
    const camAngle = inputManager.getCameraAngle();
    const sinAngle = Math.sin(camAngle);
    const cosAngle = Math.cos(camAngle);

    const moveX = cosAngle * inputX - sinAngle * inputY;
    const moveZ = -sinAngle * inputX - cosAngle * inputY;

    const lenSq = moveX * moveX + moveZ * moveZ;
    const moving = lenSq > 0.0001;
    if (moving !== wasMovingRef.current) {
      wasMovingRef.current = moving;
      setIsMoving(moving);
    }

    if (moving) {
      // Normalize direction so diagonal movement is not faster
      const len = Math.sqrt(lenSq);
      const normX = moveX / len;
      const normZ = moveZ / len;

      // Analog sensitivity: stick deflection scales speed smoothly up to 1.0
      const speedMultiplier = Math.min(len, 1.0);

      // Desired movement delta with delta time and analog speed scaling
      const deltaX = normX * (PLAYER_SPEED * speedMultiplier) * dt;
      const deltaZ = normZ * (PLAYER_SPEED * speedMultiplier) * dt;

      // Resolve movement against solid world obstacles using spatial grid + sliding
      const resolved = resolveMovement(
        currentPos.current.x,
        currentPos.current.z,
        deltaX,
        deltaZ,
        worldBounds
      );

      const actualDeltaX = resolved.x - currentPos.current.x;
      const actualDeltaZ = resolved.z - currentPos.current.z;
      const movedDistSq = actualDeltaX * actualDeltaX + actualDeltaZ * actualDeltaZ;

      // Apply collision-approved position
      currentPos.current.x = resolved.x;
      currentPos.current.z = resolved.z;

      // Smooth facing rotation
      let faceDirX = normX;
      let faceDirZ = normZ;
      if (movedDistSq > 1e-6) {
        const movedLen = Math.sqrt(movedDistSq);
        faceDirX = actualDeltaX / movedLen;
        faceDirZ = actualDeltaZ / movedLen;
      }

      const targetAngle = Math.atan2(faceDirX, faceDirZ);
      let angleDiff = targetAngle - currentRotation.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      currentRotation.current += angleDiff * Math.min(ROTATION_LERP_SPEED * dt, 1);

      // Advance walk animation cycle proportionally to movement speed
      if (movedDistSq > 1e-6) {
        walkCycle.current += dt * 13 * speedMultiplier;
      } else {
        walkCycle.current = THREE.MathUtils.lerp(walkCycle.current, 0, dt * 8);
      }
    } else {
      // Smoothly return limbs to idle resting stance
      walkCycle.current = THREE.MathUtils.lerp(walkCycle.current, 0, dt * 8);
    }

    // Smoothly ground player to terrain surface elevation
    const targetGroundY = getTerrainHeight(currentPos.current.x, currentPos.current.z);
    currentPos.current.y = THREE.MathUtils.lerp(
      currentPos.current.y,
      targetGroundY,
      Math.min(dt * 18, 1.0)
    );

    // Life & Movement Animations
    if (moving) {
      idleCycle.current = 0;
      // Walking body bobbing applies to the inner body mesh only (NOT player root Y)
      const bobbing = Math.abs(Math.sin(walkCycle.current)) * 0.08;
      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = bobbing;
        bodyGroupRef.current.scale.set(1, 1, 1);
      }

      // Arm and Leg swings
      const swing = Math.sin(walkCycle.current) * 0.6;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = swing;
        rightLegRef.current.rotation.x = -swing;
        leftLegRef.current.rotation.z = 0;
        rightLegRef.current.rotation.z = 0;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -swing * 0.8;
        rightArmRef.current.rotation.x = swing * 0.8;
        leftArmRef.current.rotation.z = 0.04;
        rightArmRef.current.rotation.z = -0.04;
      }
    } else {
      // Subtle idle breathing animation: gentle chest rise and relaxed limb sway
      idleCycle.current += dt * 2.8;
      const breath = Math.sin(idleCycle.current) * 0.014;

      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = breath;
        bodyGroupRef.current.scale.set(1 + breath * 0.4, 1 + breath, 1 + breath * 0.4);
      }

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, dt * 8);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, dt * 8);
        leftLegRef.current.rotation.z = -0.02;
        rightLegRef.current.rotation.z = 0.02;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, dt * 8);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, dt * 8);
        leftArmRef.current.rotation.z = 0.06 + Math.sin(idleCycle.current * 0.5) * 0.015;
        rightArmRef.current.rotation.z = -0.06 - Math.sin(idleCycle.current * 0.5) * 0.015;
      }
    }

    // Update 3D root group transform directly
    if (groupRef.current) {
      groupRef.current.position.set(currentPos.current.x, currentPos.current.y, currentPos.current.z);
      groupRef.current.rotation.y = currentRotation.current;
    }

    // 1. Keep raw mutable tuple strictly synchronized for high-frequency 60 FPS useFrame consumers
    const rawPos = useGameStore.getState().playerPosition;
    rawPos[0] = currentPos.current.x;
    rawPos[1] = currentPos.current.y;
    rawPos[2] = currentPos.current.z;
    (useGameStore.getState() as { playerRotation: number }).playerRotation = currentRotation.current;

    // 2. Throttle React store state update (triggers subscribers like LocationBadge)
    const distSq = (currentPos.current.x - lastStorePos.current.x) ** 2 + (currentPos.current.z - lastStorePos.current.z) ** 2;
    if (distSq >= 0.25 || (!moving && distSq > 0.0001)) {
      lastStorePos.current.copy(currentPos.current);
      setPlayerPosition([currentPos.current.x, currentPos.current.y, currentPos.current.z]);
      setPlayerRotation(currentRotation.current);
    }
  });

  return (
    <group ref={groupRef} position={[spawnPosition[0], initialY, spawnPosition[2]]}>
      <group ref={bodyGroupRef}>
        {/* === HEAD & FACE === */}
        <group position={[0, 1.25, 0]}>
          {/* Head Base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.38, 0.38]} />
            <meshStandardMaterial color={config.skinColor} roughness={0.6} />
          </mesh>

          {/* Hair framing face under hat */}
          {/* Front Left Bang */}
          <mesh position={[-0.1, 0.14, 0.19]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.13, 0.08, 0.03]} />
            <meshStandardMaterial color={config.hairColor} roughness={0.7} />
          </mesh>
          {/* Front Right Bang */}
          <mesh position={[0.08, 0.15, 0.19]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.14, 0.07, 0.03]} />
            <meshStandardMaterial color={config.hairColor} roughness={0.7} />
          </mesh>
          {/* Left Hair Lock / Sideburn */}
          <mesh position={[-0.195, 0.02, 0.04]}>
            <boxGeometry args={[0.025, 0.18, 0.18]} />
            <meshStandardMaterial color={config.hairColor} roughness={0.7} />
          </mesh>
          {/* Right Hair Lock / Sideburn */}
          <mesh position={[0.195, 0.02, 0.04]}>
            <boxGeometry args={[0.025, 0.18, 0.18]} />
            <meshStandardMaterial color={config.hairColor} roughness={0.7} />
          </mesh>
          {/* Back Hair Fringe */}
          <mesh position={[0, -0.02, -0.195]}>
            <boxGeometry args={[0.34, 0.22, 0.025]} />
            <meshStandardMaterial color={config.hairColor} roughness={0.7} />
          </mesh>

          {/* Expressive Eyes */}
          <mesh position={[-0.09, 0.04, 0.195]}>
            <boxGeometry args={[0.05, 0.07, 0.02]} />
            <meshStandardMaterial color="#2d3748" roughness={0.3} />
          </mesh>
          <mesh position={[0.09, 0.04, 0.195]}>
            <boxGeometry args={[0.05, 0.07, 0.02]} />
            <meshStandardMaterial color="#2d3748" roughness={0.3} />
          </mesh>
          {/* Eye Spark Highlights */}
          <mesh position={[-0.1, 0.06, 0.206]}>
            <boxGeometry args={[0.016, 0.016, 0.005]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.08, 0.06, 0.206]}>
            <boxGeometry args={[0.016, 0.016, 0.005]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Cheerful Blush */}
          <mesh position={[-0.13, -0.04, 0.193]}>
            <boxGeometry args={[0.06, 0.03, 0.01]} />
            <meshStandardMaterial color="#f687b3" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.13, -0.04, 0.193]}>
            <boxGeometry args={[0.06, 0.03, 0.01]} />
            <meshStandardMaterial color="#f687b3" transparent opacity={0.65} />
          </mesh>

          {/* Cheerful Smile */}
          <mesh position={[0, -0.08, 0.194]}>
            <boxGeometry args={[0.08, 0.022, 0.01]} />
            <meshStandardMaterial color="#b85d38" roughness={0.5} />
          </mesh>

          {/* === STRAW FARMER HAT === */}
          {config.hasHat && (
            <group position={[0, 0.22, 0]}>
              {/* Wide Hat Brim */}
              <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.48, 0.54, 0.06, 12]} />
                <meshStandardMaterial color={config.hatColor} roughness={0.8} />
              </mesh>
              {/* Hat Crown */}
              <mesh position={[0, 0.12, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.3, 0.2, 10]} />
                <meshStandardMaterial color={config.hatColor} roughness={0.8} />
              </mesh>
              {/* Hat Ribbon Band */}
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.31, 0.31, 0.06, 10]} />
                <meshStandardMaterial color={config.hatRibbonColor} roughness={0.5} />
              </mesh>
            </group>
          )}
        </group>

        {/* === NECK & COZY BANDANA === */}
        <group position={[0, 1.03, 0]}>
          {/* Neck cylinder */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.13, 0.12, 8]} />
            <meshStandardMaterial color={config.skinColor} roughness={0.6} />
          </mesh>

          {config.hasBandana && (
            <>
              {/* Bandana Ring Collar */}
              <mesh position={[0, -0.01, 0]} castShadow>
                <cylinderGeometry args={[0.17, 0.19, 0.08, 8]} />
                <meshStandardMaterial color={config.bandanaColor} roughness={0.7} />
              </mesh>
              {/* Bandana Front-Facing Fold Point */}
              <mesh position={[-0.03, -0.07, 0.15]} rotation={[0.45, 0.2, -0.1]} castShadow>
                <boxGeometry args={[0.1, 0.12, 0.02]} />
                <meshStandardMaterial color={config.bandanaColor} roughness={0.7} />
              </mesh>
              {/* Bandana Knot */}
              <mesh position={[0.07, -0.04, 0.15]}>
                <boxGeometry args={[0.04, 0.04, 0.03]} />
                <meshStandardMaterial color={config.bandanaColor} roughness={0.7} />
              </mesh>
            </>
          )}
        </group>

        {/* === TORSO & CLOTHES === */}
        <group position={[0, 0.72, 0]}>
          {/* Shirt Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.52, 0.26]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
          </mesh>

          {/* Blue Denim Overalls */}
          <mesh position={[0, -0.08, 0.01]} castShadow>
            <boxGeometry args={[0.43, 0.38, 0.27]} />
            <meshStandardMaterial color={config.overallsColor} roughness={0.8} />
          </mesh>

          {/* Overall Suspenders Straps */}
          <mesh position={[-0.12, 0.12, 0.137]}>
            <boxGeometry args={[0.06, 0.28, 0.02]} />
            <meshStandardMaterial color={config.overallsColor} roughness={0.8} />
          </mesh>
          <mesh position={[0.12, 0.12, 0.137]}>
            <boxGeometry args={[0.06, 0.28, 0.02]} />
            <meshStandardMaterial color={config.overallsColor} roughness={0.8} />
          </mesh>

          {/* Brass Suspender Buttons */}
          <mesh position={[-0.12, 0.04, 0.149]}>
            <boxGeometry args={[0.03, 0.03, 0.01]} />
            <meshStandardMaterial color={config.buckleColor} roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0.12, 0.04, 0.149]}>
            <boxGeometry args={[0.03, 0.03, 0.01]} />
            <meshStandardMaterial color={config.buckleColor} roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Leather Work Belt */}
          <mesh position={[0, -0.24, 0.01]} castShadow>
            <boxGeometry args={[0.44, 0.06, 0.28]} />
            <meshStandardMaterial color={config.beltColor} roughness={0.8} />
          </mesh>
          {/* Brass Belt Buckle */}
          <mesh position={[0, -0.24, 0.153]}>
            <boxGeometry args={[0.07, 0.07, 0.01]} />
            <meshStandardMaterial color={config.buckleColor} roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Hip Utility Seed/Tool Pouch */}
          {config.hasPouch && (
            <group position={[0.22, -0.22, 0.04]} rotation={[0, 0, -0.1]}>
              <mesh castShadow>
                <boxGeometry args={[0.09, 0.13, 0.12]} />
                <meshStandardMaterial color={config.beltColor} roughness={0.8} />
              </mesh>
              {/* Pouch Flap & Fastener */}
              <mesh position={[0.01, 0.05, 0]}>
                <boxGeometry args={[0.08, 0.04, 0.125]} />
                <meshStandardMaterial color="#4a2c17" roughness={0.9} />
              </mesh>
              <mesh position={[0.05, 0.02, 0]}>
                <boxGeometry args={[0.015, 0.02, 0.02]} />
                <meshStandardMaterial color={config.buckleColor} roughness={0.4} metalness={0.6} />
              </mesh>
            </group>
          )}
        </group>

        {/* === ARMS === */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.28, 0.88, 0]}>
          {/* Shoulder sleeve */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <boxGeometry args={[0.13, 0.26, 0.14]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
          </mesh>
          {/* Rolled sleeve cuff */}
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.14, 0.06, 0.15]} />
            <meshStandardMaterial color={config.cuffColor} roughness={0.7} />
          </mesh>
          {/* Farmer hand */}
          <mesh position={[0, -0.37, 0]} castShadow>
            <boxGeometry args={[0.1, 0.12, 0.1]} />
            <meshStandardMaterial color={config.skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.28, 0.88, 0]}>
          {/* Shoulder sleeve */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <boxGeometry args={[0.13, 0.26, 0.14]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
          </mesh>
          {/* Rolled sleeve cuff */}
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.14, 0.06, 0.15]} />
            <meshStandardMaterial color={config.cuffColor} roughness={0.7} />
          </mesh>
          {/* Farmer hand */}
          <mesh position={[0, -0.37, 0]} castShadow>
            <boxGeometry args={[0.1, 0.12, 0.1]} />
            <meshStandardMaterial color={config.skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* === LEGS & BOOTS === */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.11, 0.44, 0]}>
          {/* Denim Overall Pant Leg */}
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[0.16, 0.30, 0.17]} />
            <meshStandardMaterial color={config.overallsColor} roughness={0.8} />
          </mesh>
          {/* Rolled Pant Cuff */}
          <mesh position={[0, -0.29, 0]} castShadow>
            <boxGeometry args={[0.17, 0.05, 0.18]} />
            <meshStandardMaterial color="#4b6cb7" roughness={0.8} />
          </mesh>
          {/* Sturdy Brown Work Boot */}
          <mesh position={[0, -0.36, 0.03]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.11, 0.22]} />
            <meshStandardMaterial color={config.bootsColor} roughness={0.85} />
          </mesh>
          {/* Boot Sole Tread */}
          <mesh position={[0, -0.42, 0.03]} receiveShadow>
            <boxGeometry args={[0.16, 0.03, 0.23]} />
            <meshStandardMaterial color="#221811" roughness={0.95} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.11, 0.44, 0]}>
          {/* Denim Overall Pant Leg */}
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[0.16, 0.30, 0.17]} />
            <meshStandardMaterial color={config.overallsColor} roughness={0.8} />
          </mesh>
          {/* Rolled Pant Cuff */}
          <mesh position={[0, -0.29, 0]} castShadow>
            <boxGeometry args={[0.17, 0.05, 0.18]} />
            <meshStandardMaterial color="#4b6cb7" roughness={0.8} />
          </mesh>
          {/* Sturdy Brown Work Boot */}
          <mesh position={[0, -0.36, 0.03]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.11, 0.22]} />
            <meshStandardMaterial color={config.bootsColor} roughness={0.85} />
          </mesh>
          {/* Boot Sole Tread */}
          <mesh position={[0, -0.42, 0.03]} receiveShadow>
            <boxGeometry args={[0.16, 0.03, 0.23]} />
            <meshStandardMaterial color="#221811" roughness={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
});
