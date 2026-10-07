import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const BARN_LVL1_URL = '/models/farm/barnlvl1.glb';
const TOWER_LVL1_URL = '/models/farm/towerlvl1.glb';
const HAY_CUBE_URL = '/models/farm/haystackcube.glb';
const HAY_ROUND_URL = '/models/farm/haystackround.glb';

interface CozyBarnModelProps {
  position?: [number, number, number];
  rotation?: number;
  scale?: number;
}

export const CozyBarnModel: React.FC<CozyBarnModelProps> = React.memo(({ position = [0, 0, 0], rotation = 0, scale = 1.0 }) => {
  const { scene: barnScene } = useGLTF(BARN_LVL1_URL);
  const { scene: towerScene } = useGLTF(TOWER_LVL1_URL);
  const { scene: hayCubeScene } = useGLTF(HAY_CUBE_URL);
  const { scene: hayRoundScene } = useGLTF(HAY_ROUND_URL);

  const clonedBarn = useMemo(() => {
    const c = barnScene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [barnScene]);

  const clonedTower = useMemo(() => {
    const c = towerScene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [towerScene]);

  const clonedHayCube = useMemo(() => {
    const c = hayCubeScene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [hayCubeScene]);

  const clonedHayRound = useMemo(() => {
    const c = hayRoundScene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [hayRoundScene]);

  return (
    <group position={position as [number, number, number]} rotation={[0, rotation, 0]} scale={scale}>
      {/* Main 3D Cozy Barn Level 1 */}
      <primitive object={clonedBarn} position={[0, 1.85, 0]} scale={[1.05, 1.05, 1.05]} />

      {/* Silo / Grain Tower beside Barn */}
      <primitive object={clonedTower} position={[2.6, 2.3, -0.6]} scale={[1.2, 1.2, 1.2]} />

      {/* Real 3D Hay Bales */}
      <primitive object={clonedHayCube} position={[-2.4, 0, 1.6]} scale={[1.2, 1.2, 1.2]} />
      <primitive object={clonedHayRound} position={[-2.2, 0, -1.5]} scale={[1.1, 1.1, 1.1]} />
    </group>
  );
});

useGLTF.preload(BARN_LVL1_URL);
useGLTF.preload(TOWER_LVL1_URL);
useGLTF.preload(HAY_CUBE_URL);
useGLTF.preload(HAY_ROUND_URL);
