import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../stores/gameStore';
import {
  DEBUG_COLLISION,
  setDebugCollision,
  getAllStaticColliders,
  PLAYER_COLLISION_RADIUS,
  isCollidingAt,
  WorldCollider,
} from '../systems/collisionSystem';

export const CollisionDebugger: React.FC = () => {
  const [active, setActive] = useState<boolean>(DEBUG_COLLISION);
  const playerCylinderRef = useRef<THREE.Mesh>(null);
  const playerMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Keyboard shortcut: F9 or backtick (`) to toggle collision debug visualization
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9' || e.key === '`') {
        const next = !DEBUG_COLLISION;
        setDebugCollision(next);
        setActive(next);
        console.log(`[CollisionDebugger] Debug collision mode: ${next ? 'ENABLED' : 'DISABLED'}`);
      }
    };

    // Expose global helper for console or tablet testing
    (window as unknown as { toggleCollisionDebug?: () => void }).toggleCollisionDebug = () => {
      const next = !DEBUG_COLLISION;
      setDebugCollision(next);
      setActive(next);
      console.log(`[CollisionDebugger] Debug collision mode: ${next ? 'ENABLED' : 'DISABLED'}`);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete (window as unknown as { toggleCollisionDebug?: () => void }).toggleCollisionDebug;
    };
  }, []);

  // Update player collider position and collision state at 60 FPS without allocations
  useFrame(() => {
    if (!active || !playerCylinderRef.current) return;

    const rawPos = useGameStore.getState().playerPosition;
    playerCylinderRef.current.position.set(rawPos[0], rawPos[1] + 0.8, rawPos[2]);

    const isBlocked = isCollidingAt(rawPos[0], rawPos[2], PLAYER_COLLISION_RADIUS);
    if (playerMaterialRef.current) {
      playerMaterialRef.current.color.setHex(isBlocked ? 0xff2222 : 0x00ff66);
    }
  });

  if (!active) return null;

  const colliders: WorldCollider[] = getAllStaticColliders();

  return (
    <group name="collision-debugger">
      {/* 1. Player Collision Cylinder */}
      <mesh ref={playerCylinderRef}>
        <cylinderGeometry args={[PLAYER_COLLISION_RADIUS, PLAYER_COLLISION_RADIUS, 1.6, 16]} />
        <meshBasicMaterial
          ref={playerMaterialRef}
          wireframe
          color="#00ff66"
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Static Colliders */}
      {colliders.map((c) => {
        if (c.type === 'circle') {
          return (
            <mesh key={c.id} position={[c.x, 0.6, c.z]}>
              <cylinderGeometry args={[c.radius, c.radius, 1.2, 14]} />
              <meshBasicMaterial wireframe color="#ff4444" transparent opacity={0.65} />
            </mesh>
          );
        }

        if (c.type === 'aabb') {
          const width = c.maxX - c.minX;
          const depth = c.maxZ - c.minZ;
          const centerX = (c.minX + c.maxX) / 2;
          const centerZ = (c.minZ + c.maxZ) / 2;
          return (
            <mesh key={c.id} position={[centerX, 0.6, centerZ]}>
              <boxGeometry args={[width, 1.2, depth]} />
              <meshBasicMaterial wireframe color="#ffaa00" transparent opacity={0.65} />
            </mesh>
          );
        }

        if (c.type === 'obb') {
          return (
            <mesh
              key={c.id}
              position={[c.cx, 0.6, c.cz]}
              rotation={[0, c.rotation, 0]}
            >
              <boxGeometry args={[c.halfW * 2, 1.2, c.halfD * 2]} />
              <meshBasicMaterial wireframe color="#ff00aa" transparent opacity={0.65} />
            </mesh>
          );
        }

        return null;
      })}

      {/* 3. Water Obstacle Zones (Clearwater River & Azure Lake) */}
      {/* Western River water barrier */}
      <mesh position={[-43.7, 0.1, 21.25]}>
        <boxGeometry args={[82.6, 0.3, 4.3]} />
        <meshBasicMaterial wireframe color="#00d4ff" transparent opacity={0.4} />
      </mesh>
      {/* Eastern River water barrier */}
      <mesh position={[8.7, 0.1, 21.25]}>
        <boxGeometry args={[12.6, 0.3, 4.3]} />
        <meshBasicMaterial wireframe color="#00d4ff" transparent opacity={0.4} />
      </mesh>
      {/* Azure Lake Basin barrier */}
      <mesh position={[43.75, 0.1, 43.0]}>
        <boxGeometry args={[57.5, 0.3, 45.5]} />
        <meshBasicMaterial wireframe color="#0088ff" transparent opacity={0.35} />
      </mesh>
      {/* Walkable Fishing Pier safe passage highlight */}
      <mesh position={[19.35, 0.15, 32.0]}>
        <boxGeometry args={[9.7, 0.35, 2.8]} />
        <meshBasicMaterial wireframe color="#00ff66" transparent opacity={0.7} />
      </mesh>
      {/* Walkable Ancient Shrine Islet safe passage highlight */}
      <mesh position={[58.0, 0.15, 58.0]}>
        <boxGeometry args={[18.0, 0.35, 18.0]} />
        <meshBasicMaterial wireframe color="#00ff66" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};
