import React, { useMemo } from 'react';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';

interface TreeItemProps {
  url: string;
  position: [number, number, number];
  scale?: number;
  rotation?: number;
}

const textureLoader = new THREE.TextureLoader();

const TREE_TEXTURES: Record<string, { trunk: string; leaf: string }> = {
  STOak: {
    trunk: '/models/trees/Textures/STOakTrunkTexture.png',
    leaf: '/models/trees/Textures/STOakLeafTexture.png',
  },
  STWillow: {
    trunk: '/models/trees/Textures/STWillowTrunkTexture.png',
    leaf: '/models/trees/Textures/STWillowLeafTexture.png',
  },
  STPine: {
    trunk: '/models/trees/Textures/STPineTrunkTexture.png',
    leaf: '/models/trees/Textures/STPineLeafTexture.png',
  },
  STColumnar: {
    trunk: '/models/trees/Textures/STColumnarTrunkTexture.png',
    leaf: '/models/trees/Textures/STLeafTexture1.png',
  },
};

const StylizedFBXTree: React.FC<TreeItemProps> = React.memo(({
  url,
  position,
  scale = 0.004,
  rotation = 0,
}) => {
  const fbx = useFBX(url);

  const clone = useMemo(() => {
    const c = fbx.clone(true);
    let typeKey = 'STOak';
    if (url.includes('Willow')) typeKey = 'STWillow';
    else if (url.includes('Pine')) typeKey = 'STPine';
    else if (url.includes('Columnar')) typeKey = 'STColumnar';

    const texConfig = TREE_TEXTURES[typeKey];
    const trunkTex = textureLoader.load(texConfig.trunk);
    trunkTex.colorSpace = THREE.SRGBColorSpace;
    const leafTex = textureLoader.load(texConfig.leaf);
    leafTex.colorSpace = THREE.SRGBColorSpace;

    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const isLeaf = mesh.name.toLowerCase().includes('leaf');
        if (isLeaf) {
          let leafColor = '#40916c';
          if (url.includes('Willow')) leafColor = '#52b788';
          else if (url.includes('Pine')) leafColor = '#2d5a3f';
          else if (url.includes('Columnar')) leafColor = '#2d6a4f';

          mesh.material = new THREE.MeshStandardMaterial({
            map: leafTex,
            color: new THREE.Color(leafColor),
            transparent: true,
            alphaTest: 0.5,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.0,
          });
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            map: trunkTex,
            roughness: 0.9,
            metalness: 0.0,
          });
        }
      }
    });
    return c;
  }, [fbx, url]);

  return (
    <primitive
      object={clone}
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    />
  );
});

export const StylizedTreeDecor: React.FC = React.memo(() => {
  return (
    <group>
      {/* 1. Weeping Willows along Clearwater River & Azure Lake Pier */}
      <StylizedFBXTree
        url="/models/trees/Models/STWillow1.fbx"
        position={[14.0, 0, 25.0]}
        scale={0.0045}
        rotation={0.4}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STWillow2.fbx"
        position={[19.5, 0, 31.5]}
        scale={0.0042}
        rotation={-0.6}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STWillow3.fbx"
        position={[25.0, 0, 27.0]}
        scale={0.0046}
        rotation={1.2}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STWillow1.fbx"
        position={[-4.5, 0, 23.5]}
        scale={0.0042}
        rotation={-0.3}
      />

      {/* 2. Grand Ancient Oaks at Village Boundaries & Riverbanks */}
      <StylizedFBXTree
        url="/models/trees/Models/STOak1.fbx"
        position={[-7.5, 0, -11.0]}
        scale={0.0036}
        rotation={0.2}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STOak2.fbx"
        position={[7.5, 0, -9.5]}
        scale={0.0034}
        rotation={-0.8}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STOak3.fbx"
        position={[-8.5, 0, 3.5]}
        scale={0.0032}
        rotation={0.5}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STOak1.fbx"
        position={[8.5, 0, 3.5]}
        scale={0.0033}
        rotation={-0.4}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STOak4.fbx"
        position={[-10.5, 0, 24.5]}
        scale={0.0034}
        rotation={1.1}
      />


      {/* 3. Columnar Trees lining the South-to-North Main Highway */}
      <StylizedFBXTree
        url="/models/trees/Models/STColumnar1.fbx"
        position={[-3.0, 0, 8.5]}
        scale={0.0045}
        rotation={0.1}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STColumnar2.fbx"
        position={[3.0, 0, 8.5]}
        scale={0.0044}
        rotation={-0.3}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STColumnar3.fbx"
        position={[-3.0, 0, -3.0]}
        scale={0.0046}
        rotation={0.4}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STColumnar1.fbx"
        position={[3.0, 0, -3.0]}
        scale={0.0045}
        rotation={-0.2}
      />

      {/* 4. Tall Pines framing Whispering Forest northern boundary */}
      <StylizedFBXTree
        url="/models/trees/Models/STPine1.fbx"
        position={[-12.0, 0, -22.0]}
        scale={0.005}
        rotation={0.3}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STPine2.fbx"
        position={[12.0, 0, -22.0]}
        scale={0.0048}
        rotation={-0.5}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STPine3.fbx"
        position={[-16.0, 0, -28.0]}
        scale={0.0052}
        rotation={0.7}
      />
      <StylizedFBXTree
        url="/models/trees/Models/STPine4.fbx"
        position={[16.0, 0, -28.0]}
        scale={0.005}
        rotation={-0.2}
      />
    </group>
  );
});

// Preload the key stylized tree models
useFBX.preload('/models/trees/Models/STWillow1.fbx');
useFBX.preload('/models/trees/Models/STWillow2.fbx');
useFBX.preload('/models/trees/Models/STWillow3.fbx');
useFBX.preload('/models/trees/Models/STOak1.fbx');
useFBX.preload('/models/trees/Models/STOak2.fbx');
useFBX.preload('/models/trees/Models/STOak3.fbx');
useFBX.preload('/models/trees/Models/STOak4.fbx');
useFBX.preload('/models/trees/Models/STColumnar1.fbx');
useFBX.preload('/models/trees/Models/STColumnar2.fbx');
useFBX.preload('/models/trees/Models/STColumnar3.fbx');
useFBX.preload('/models/trees/Models/STPine1.fbx');
useFBX.preload('/models/trees/Models/STPine2.fbx');
useFBX.preload('/models/trees/Models/STPine3.fbx');
useFBX.preload('/models/trees/Models/STPine4.fbx');
