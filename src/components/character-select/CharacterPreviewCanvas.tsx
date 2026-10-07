import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { KayKitCharacter } from '../../entities/KayKitCharacter';
import { CharacterDefinition } from '../../data/characterData';

interface PedestalProps {
  tintColor?: string;
}

const Pedestal: React.FC<PedestalProps> = React.memo(({ tintColor }) => {
  return (
    <group position={[0, -0.58, 0]}>
      {/* Outer Golden/Wood Beveled Ring */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.05, 1.18, 0.22, 48]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.35}
          metalness={0.25}
        />
      </mesh>

      {/* Inner Cream Dais Platform */}
      <mesh position={[0, 0.24, 0]} receiveShadow>
        <cylinderGeometry args={[0.96, 0.96, 0.05, 48]} />
        <meshStandardMaterial
          color="#fffbeb"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle Ambient Tint Glow Ring */}
      {tintColor && (
        <mesh position={[0, 0.266, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.68, 0.92, 48]} />
          <meshBasicMaterial
            color={tintColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Ground Contact Shadow Disk */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.45, 48]} />
        <meshBasicMaterial
          color="#0f172a"
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
});

interface ShowcaseSceneProps {
  character: CharacterDefinition;
  animationName: string;
  tintColor: string;
  manualRotation: number;
}

const CameraSetup: React.FC = () => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.58, 2.9);
    camera.lookAt(0, 0.12, 0);
  }, [camera]);
  return null;
};

const ShowcaseScene: React.FC<ShowcaseSceneProps> = ({
  character,
  animationName,
  tintColor,
  manualRotation,
}) => {
  const rotGroupRef = useRef<THREE.Group>(null);
  const currentAngle = useRef<number>(0);

  useFrame((_, delta) => {
    if (!rotGroupRef.current) return;
    currentAngle.current = THREE.MathUtils.lerp(currentAngle.current, manualRotation, Math.min(delta * 12, 1));
    rotGroupRef.current.rotation.y = currentAngle.current;
  });

  return (
    <group>
      <CameraSetup />

      {/* Crisp showcase lighting */}
      <ambientLight intensity={1.5} color="#ffffff" />
      
      {/* Front-right warm key light with shadow */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.2}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-3, 3, 3, -3, 0.1, 15]} />
      </directionalLight>

      {/* Fill lights */}
      <directionalLight position={[-4, 3, 2]} intensity={0.8} color="#e0f2fe" />
      <directionalLight position={[0, 4, -4]} intensity={1.2} color="#bfdbfe" />

      {/* 3D Pedestal Base */}
      <Pedestal tintColor={tintColor} />

      {/* Character inside rotating container */}
      <group ref={rotGroupRef}>
        <KayKitCharacter
          key={character.id}
          modelUrl={character.modelFile}
          animationName={animationName}
          tintColor={tintColor}
          tintMeshName={character.tintMeshName}
          position={[0, -0.34, 0]}
          scale={0.48}
        />
      </group>
    </group>
  );
};

export interface CharacterPreviewCanvasProps {
  character: CharacterDefinition;
  animationName: string;
  tintColor: string;
}

export const CharacterPreviewCanvas: React.FC<CharacterPreviewCanvasProps> = React.memo(({
  character,
  animationName,
  tintColor,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const isDragging = useRef<boolean>(false);
  const lastPointerX = useRef<number>(0);
  const autoRotateSpeed = useRef<number>(0.2);

  // Auto-rotation loop when not dragging
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!isDragging.current) {
        setRotation((prev) => prev + autoRotateSpeed.current * Math.min(dt, 0.1));
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastPointerX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    setRotation((prev) => prev + deltaX * 0.015);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        cursor: 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0.82, 3.55],
          fov: 34,
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        <ShowcaseScene
          character={character}
          animationName={animationName}
          tintColor={tintColor}
          manualRotation={rotation}
        />
      </Canvas>
    </div>
  );
});
