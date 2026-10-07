import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../stores/gameStore';
import { useKeyboardControls } from '../systems/useKeyboardControls';
import { inputManager } from '../systems/inputManager';
import { getTerrainHeight } from '../data/worldData';
import { resolveMovement, syncPlacedBuildings } from '../systems/collisionSystem';
import { useBuildStore } from '../stores/buildStore';
import { useCharacterStore } from '../stores/characterStore';
import { CHARACTERS } from '../data/characterData';
import { KayKitCharacter } from './KayKitCharacter';
import { FishingRodProp } from './fishing/FishingRodProp';
import { useInventoryStore } from '../stores/inventoryStore';
import { useFishingStore } from '../stores/fishingStore';

// Configurable base movement speed (units per second)
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

interface PlayerProps {
  config?: CharacterConfig;
}

export const Player: React.FC<PlayerProps> = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null);

  useKeyboardControls();
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerRotation = useGameStore((state) => state.setPlayerRotation);
  const setIsMoving = useGameStore((state) => state.setIsMoving);
  const worldBounds = useGameStore((state) => state.worldBounds);
  const spawnPosition = useGameStore((state) => state.spawnPosition);
  const placedBuildings = useBuildStore((state) => state.placedBuildings);

  // Selected 3D hero definition and custom color
  const selectedCharacterId = useCharacterStore((state) => state.selectedCharacterId);
  const selectedColor = useCharacterStore((state) => state.selectedColor);
  const heroDef = CHARACTERS[selectedCharacterId] || CHARACTERS.knight;

  // Active inventory item & fishing state
  const selectedHotbarIndex = useInventoryStore((state) => state.selectedHotbarIndex);
  const hotbarSlots = useInventoryStore((state) => state.slots);
  const currentItemId = hotbarSlots[selectedHotbarIndex]?.itemId;
  const isFishing = useFishingStore((state) => state.isFishing);
  const equippedRod = useFishingStore((state) => state.equippedRod);

  // Sync equipped rod if player selects a rod in hotbar
  useEffect(() => {
    if (currentItemId && currentItemId.startsWith('fishing_rod')) {
      useFishingStore.getState().equipRod(currentItemId);
    }
  }, [currentItemId]);

  const isHoldingRod = isFishing || Boolean(currentItemId && currentItemId.startsWith('fishing_rod'));

  // Active animation state: Idle vs Running
  const [activeAnim, setActiveAnim] = useState<string>('Idle_A');
  const wasMovingRef = useRef<boolean>(false);

  // Sync placed buildings to collision spatial grid
  useEffect(() => {
    syncPlacedBuildings(placedBuildings);
  }, [placedBuildings]);

  // Position and rotation refs for 60fps frame-rate independent movement
  const initialY = getTerrainHeight(spawnPosition[0], spawnPosition[2]);
  const currentPos = useRef<THREE.Vector3>(new THREE.Vector3(spawnPosition[0], initialY, spawnPosition[2]));
  const currentRotation = useRef<number>(0);
  const lastStorePos = useRef<THREE.Vector3>(new THREE.Vector3(spawnPosition[0], initialY, spawnPosition[2]));

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

    // Toggle animation only on movement state transition (prevents continuous state re-renders)
    if (moving !== wasMovingRef.current) {
      wasMovingRef.current = moving;
      setIsMoving(moving);
      setActiveAnim(moving ? 'Running_A' : 'Idle_A');
    }

    if (moving) {
      const len = Math.sqrt(lenSq);
      const normX = moveX / len;
      const normZ = moveZ / len;

      const speedMultiplier = Math.min(len, 1.0) * (heroDef.speedMultiplier || 1.0);
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
    }

    // Ground player directly on terrain surface
    const targetGroundY = getTerrainHeight(currentPos.current.x, currentPos.current.z);
    currentPos.current.y = THREE.MathUtils.lerp(
      currentPos.current.y,
      targetGroundY,
      Math.min(dt * 18, 1.0)
    );

    // Direct 3D transform update (zero React allocation)
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
    const distSq =
      (currentPos.current.x - lastStorePos.current.x) ** 2 +
      (currentPos.current.z - lastStorePos.current.z) ** 2;
    if (distSq >= 0.25 || (!moving && distSq > 0.0001)) {
      lastStorePos.current.copy(currentPos.current);
      setPlayerPosition([currentPos.current.x, currentPos.current.y, currentPos.current.z]);
      setPlayerRotation(currentRotation.current);
    }
  });

  return (
    <group ref={groupRef} position={[spawnPosition[0], initialY, spawnPosition[2]]}>
      {/* Contact soft shadow under character feet */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.25} />
      </mesh>

      {/* KayKit 3D Rigged Adventurer Character with fluid animations */}
      <KayKitCharacter
        key={heroDef.id}
        modelUrl={heroDef.modelFile}
        animationName={activeAnim}
        tintColor={selectedColor}
        tintMeshName={heroDef.tintMeshName}
        scale={0.74}
      />

      {/* Held 3D Fishing Rod Prop */}
      {isHoldingRod && (
        <FishingRodProp modelUrl={equippedRod.modelUrl} />
      )}
    </group>
  );
});
