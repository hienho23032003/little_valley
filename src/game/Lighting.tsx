import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeStore } from '../stores/timeStore';
import { calculateTimeVisuals } from '../utils/timeVisuals';

export const Lighting: React.FC = React.memo(() => {
  const { scene } = useThree();

  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  useFrame((_, delta) => {
    // 1. Advance game time clock imperatively without React component re-renders
    const timeState = useTimeStore.getState();
    timeState.tickTime(delta);

    // 2. Compute dynamic time-of-day visuals
    const visuals = calculateTimeVisuals(timeState.timeOfDay);

    // 3. Update Scene Background & Fog
    if (!scene.background) {
      scene.background = visuals.skyColor.clone();
    } else {
      (scene.background as THREE.Color).copy(visuals.skyColor);
    }

    if (scene.fog) {
      scene.fog.color.copy(visuals.fogColor);
    }

    // 4. Update Directional Sun/Moonlight
    if (sunLightRef.current) {
      sunLightRef.current.position.set(...visuals.sunPosition);
      sunLightRef.current.color.copy(visuals.sunColor);
      sunLightRef.current.intensity = visuals.sunIntensity;
    }

    // 5. Update Ambient Fill Light
    if (ambientLightRef.current) {
      ambientLightRef.current.color.copy(visuals.ambientColor);
      ambientLightRef.current.intensity = visuals.ambientIntensity;
    }

    // 6. Update Hemisphere Sky/Ground Light
    if (hemiLightRef.current) {
      hemiLightRef.current.color.copy(visuals.hemiSkyColor);
      hemiLightRef.current.groundColor.copy(visuals.hemiGroundColor);
      hemiLightRef.current.intensity = visuals.hemiIntensity;
    }
  });

  return (
    <>
      {/* Sky & Ground Ambient Atmosphere */}
      <hemisphereLight
        ref={hemiLightRef}
        color="#d8ecf8"
        groundColor="#88bf58"
        intensity={0.85}
      />

      {/* Warm Soft Ambient Light for Fill */}
      <ambientLight ref={ambientLightRef} color="#fff7ed" intensity={0.4} />

      {/* Main Directional Sunlight / Moonlight casting soft shadows */}
      <directionalLight
        ref={sunLightRef}
        position={[35, 60, 30]}
        intensity={1.6}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={15}
        shadow-camera-far={160}
        shadow-camera-left={-42}
        shadow-camera-right={42}
        shadow-camera-top={42}
        shadow-camera-bottom={-42}
        shadow-bias={-0.0003}
        shadow-normalBias={0.03}
      />
    </>
  );
});
