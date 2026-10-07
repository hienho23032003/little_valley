import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingRendererProps {
  buildingTypeId: string;
  isGhost?: boolean;
  isValid?: boolean;
}

const GLB_BUILDING_CONFIGS: Record<
  string,
  {
    path: string;
    scale: [number, number, number];
    position: [number, number, number];
    rotation?: [number, number, number];
  }
> = {
  chicken_coop: {
    path: '/models/farm_buildings/ChickenCoop.glb',
    scale: [1.25, 1.25, 1.25],
    position: [0, 0, 0],
  },
  barn: {
    path: '/models/farm_buildings/BigBarn.glb',
    scale: [0.72, 0.72, 0.72],
    position: [0, 0, 0],
  },
  silo: {
    path: '/models/farm_buildings/Silo.glb',
    scale: [0.85, 0.85, 0.85],
    position: [0, 0, 0],
  },
  storage_shed: {
    path: '/models/farm_buildings/OpenBarn.glb',
    scale: [0.9, 0.9, 0.9],
    position: [0, 0, 0],
  },
  bakery: {
    path: '/models/farm_buildings/SmallBarn.glb',
    scale: [0.85, 0.85, 0.85],
    position: [0, 0, 0],
  },
  windmill: {
    path: '/models/farm_buildings/Windmill.glb',
    scale: [0.9, 0.9, 0.9],
    position: [0, 0, 0],
  },
  water_tower: {
    path: '/models/farm_buildings/WaterTower.glb',
    scale: [0.95, 0.95, 0.95],
    position: [0, 0, 0],
  },
  well: {
    path: '/models/farm_buildings/Well.glb',
    scale: [1.0, 1.0, 1.0],
    position: [0, 0, 0],
  },
};

const FarmBuildingGLB: React.FC<{
  path: string;
  scale: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  isGhost?: boolean;
  isValid?: boolean;
}> = React.memo(({ path, scale, position, rotation = [0, 0, 0], isGhost = false, isValid = true }) => {
  const { scene } = useGLTF(path);
  const bladesRef = useRef<THREE.Object3D | null>(null);

  // Rotate windmill sails in the breeze
  useFrame((_, delta) => {
    if (bladesRef.current && !isGhost) {
      bladesRef.current.rotation.z += delta * 1.5;
    }
  });

  const clone = useMemo(() => {
    const c = scene.clone(true);
    const ghostMaterial = isGhost
      ? new THREE.MeshStandardMaterial({
          color: isValid ? '#52b788' : '#e63946',
          transparent: true,
          opacity: 0.65,
          roughness: 0.4,
          emissive: isValid ? '#2d6a4f' : '#9b2226',
          emissiveIntensity: 0.35,
        })
      : null;

    c.traverse((child) => {
      if (child.name.toLowerCase().includes('blade')) {
        bladesRef.current = child;
      }
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (isGhost && ghostMaterial) {
          mesh.material = ghostMaterial;
        } else {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((mat) => {
              const m = mat as THREE.MeshStandardMaterial;
              m.metalness = 0;
              m.roughness = 0.85;
              if (m.name === 'RoofBlack') {
                m.color.set('#495057');
              } else if (m.name === 'DarkRed' || m.name === 'LightRed') {
                m.color.set('#c84b31');
              } else if (m.name === 'Brown') {
                m.color.set('#c08552');
              } else if (m.name === 'White') {
                m.color.set('#f4f1de');
              }
            });
          }
        }
      }
    });
    return c;
  }, [scene, isGhost, isValid]);

  return <primitive object={clone} scale={scale} position={position} rotation={rotation} />;
});

export const BuildingRenderer: React.FC<BuildingRendererProps> = ({
  buildingTypeId,
  isGhost = false,
  isValid = true,
}) => {
  const config = GLB_BUILDING_CONFIGS[buildingTypeId];
  if (!config) return null;

  return (
    <FarmBuildingGLB
      path={config.path}
      scale={config.scale}
      position={config.position}
      rotation={config.rotation}
      isGhost={isGhost}
      isValid={isValid}
    />
  );
};

// Preload all farm building GLBs
Object.values(GLB_BUILDING_CONFIGS).forEach((c) => {
  useGLTF.preload(c.path);
});
