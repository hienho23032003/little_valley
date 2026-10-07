import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChickenModelProps {
  isWalking: boolean;
  isProductReady: boolean;
}

const CHICKEN_MODEL_URL = '/models/animals/chichen.glb';

export const ChickenModel: React.FC<ChickenModelProps> = React.memo(({ isWalking, isProductReady }) => {
  const modelRef = useRef<THREE.Group>(null);
  const readyIconRef = useRef<THREE.Group>(null);

  const { scene: rawScene } = useGLTF(CHICKEN_MODEL_URL);

  const clonedScene = useMemo(() => {
    const clone = rawScene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [rawScene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (modelRef.current) {
      if (isWalking) {
        // Walking hop and waddle
        const hop = Math.abs(Math.sin(t * 12)) * 0.1;
        const waddle = Math.sin(t * 12) * 0.12;
        modelRef.current.position.y = hop;
        modelRef.current.rotation.z = waddle;
        modelRef.current.rotation.x = Math.sin(t * 12) * 0.08;
      } else {
        // Idle peck and breathing
        const peck = (t * 1.8) % 4;
        const isPecking = peck < 0.6;
        modelRef.current.position.y = 0;
        modelRef.current.rotation.z = 0;
        modelRef.current.rotation.x = isPecking ? Math.sin(peck * Math.PI * 3) * 0.35 : 0;
      }
    }

    // Ready Egg floating indicator
    if (readyIconRef.current && isProductReady) {
      readyIconRef.current.position.y = 0.95 + Math.sin(t * 3) * 0.06;
      readyIconRef.current.rotation.y = t * 1.8;
    }
  });

  return (
    <group>
      {/* Ready Egg Indicator */}
      {isProductReady && (
        <group ref={readyIconRef} position={[0, 0.95, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#fff3b0" emissive="#ffd166" emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* Real 3D Low-Poly Chicken from stylooanimalassetpack */}
      <group ref={modelRef}>
        <primitive
          object={clonedScene}
          scale={[0.55, 0.55, 0.55]}
          position={[0, 0, 0]}
          rotation={[0, Math.PI, 0]}
        />
      </group>
    </group>
  );
});

useGLTF.preload(CHICKEN_MODEL_URL);
