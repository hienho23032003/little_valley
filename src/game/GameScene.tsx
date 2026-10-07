import React, { useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Lighting } from './Lighting';
import { CameraController } from './CameraController';
import { World } from './World';
import { PALETTE } from '../utils/colors';

const SceneExposer: React.FC = () => {
  const { scene } = useThree();
  useEffect(() => {
    (window as unknown as { __THREE_SCENE__?: THREE.Scene }).__THREE_SCENE__ = scene;
  }, [scene]);
  return null;
};

export const GameScene: React.FC = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 1.35]}
      camera={{
        position: [0, 44, 48],
        fov: 44,
        near: 1.0,
        far: 300,
      }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          console.warn('WebGL Context Lost - waiting for restore...');
        });
        gl.domElement.addEventListener('webglcontextrestored', () => {
          console.info('WebGL Context Restored successfully!');
        });
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: PALETTE.ambientSky,
      }}
    >
      {/* Pastel Atmospheric Horizon Fog (softens distant boundary beyond the 170m table) */}
      <fog attach="fog" args={[PALETTE.fogColor, 130, 360]} />

      {/* Scene Exposer for Diagnostics */}
      <SceneExposer />

      {/* Lighting & Shadows */}
      <Lighting />

      {/* Dynamic Elevated 45-degree Follow Camera */}
      <CameraController />

      {/* Complete Low-poly 3D World inside Suspense Boundary */}
      <Suspense fallback={null}>
        <World />
      </Suspense>
    </Canvas>
  );
};
