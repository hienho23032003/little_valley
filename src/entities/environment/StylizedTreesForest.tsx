import React, { useMemo, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFBX } from '@react-three/drei';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TransformItem } from '../../data/worldData';

interface StylizedTreesForestProps {
  trees: TransformItem[];
}

const textureLoader = new THREE.TextureLoader();

function loadSRGBTexture(url: string): THREE.Texture {
  const tex = textureLoader.load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Extract trunk and leaf geometries from an FBX group, baking local transform and base scale
function extractTreeGeometries(fbx: THREE.Group, baseScale = 0.004): {
  trunkGeo: THREE.BufferGeometry;
  leafGeo: THREE.BufferGeometry;
} {
  const c = fbx.clone(true);
  c.position.set(0, 0, 0);
  c.rotation.set(0, 0, 0);
  c.scale.set(baseScale, baseScale, baseScale);
  c.updateMatrixWorld(true);

  const trunkGeos: THREE.BufferGeometry[] = [];
  const leafGeos: THREE.BufferGeometry[] = [];

  c.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const isLeaf = mesh.name.toLowerCase().includes('leaf');
      const geo = mesh.geometry.clone();
      mesh.updateMatrixWorld(true);
      geo.applyMatrix4(mesh.matrixWorld);
      if (isLeaf) {
        leafGeos.push(geo);
      } else {
        trunkGeos.push(geo);
      }
    }
  });

  const trunkGeo =
    trunkGeos.length > 1
      ? mergeGeometries(trunkGeos) || trunkGeos[0]
      : trunkGeos[0] || new THREE.BufferGeometry();

  const leafGeo =
    leafGeos.length > 1
      ? mergeGeometries(leafGeos) || leafGeos[0]
      : leafGeos[0] || new THREE.BufferGeometry();

  return { trunkGeo, leafGeo };
}

export const StylizedTreesForest: React.FC<StylizedTreesForestProps> = React.memo(({ trees }) => {
  // Load base stylized FBX models
  const oakFBX = useFBX('/models/trees/Models/STOak1.fbx');
  const pineFBX = useFBX('/models/trees/Models/STPine1.fbx');
  const willowFBX = useFBX('/models/trees/Models/STWillow1.fbx');
  const columnarFBX = useFBX('/models/trees/Models/STColumnar1.fbx');

  // Extract geometries once with baked scaling
  const oakGeos = useMemo(() => extractTreeGeometries(oakFBX, 0.0036), [oakFBX]);
  const pineGeos = useMemo(() => extractTreeGeometries(pineFBX, 0.0046), [pineFBX]);
  const willowGeos = useMemo(() => extractTreeGeometries(willowFBX, 0.0044), [willowFBX]);
  const columnarGeos = useMemo(() => extractTreeGeometries(columnarFBX, 0.0044), [columnarFBX]);

  // Shared Materials with SRGB textures, alphaTest, and double-side leaves
  const materials = useMemo(() => {
    const oakTrunkMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STOakTrunkTexture.png'),
      roughness: 0.9,
      metalness: 0.0,
    });
    const oakLeafMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STOakLeafTexture.png'),
      color: new THREE.Color('#40916c'),
      transparent: false,
      alphaTest: 0.5,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.0,
    });
    const autumnLeafMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STOakLeafTexture.png'),
      color: new THREE.Color('#e76f51'),
      transparent: false,
      alphaTest: 0.5,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.0,
    });

    const pineTrunkMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STPineTrunkTexture.png'),
      roughness: 0.92,
      metalness: 0.0,
    });
    const pineLeafMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STPineLeafTexture.png'),
      color: new THREE.Color('#2d5a3f'),
      transparent: false,
      alphaTest: 0.5,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.0,
    });

    const willowTrunkMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STWillowTrunkTexture.png'),
      roughness: 0.9,
      metalness: 0.0,
    });
    const willowLeafMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STWillowLeafTexture.png'),
      color: new THREE.Color('#52b788'),
      transparent: false,
      alphaTest: 0.5,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.0,
    });
    const blossomLeafMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STWillowLeafTexture.png'),
      color: new THREE.Color('#ffb3c1'),
      transparent: false,
      alphaTest: 0.5,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.0,
    });

    const columnarTrunkMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STColumnarTrunkTexture.png'),
      roughness: 0.9,
      metalness: 0.0,
    });
    const columnarLeafMat = new THREE.MeshStandardMaterial({
      map: loadSRGBTexture('/models/trees/Textures/STLeafTexture1.png'),
      color: new THREE.Color('#2d6a4f'),
      transparent: false,
      alphaTest: 0.5,
      depthWrite: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.0,
    });

    return {
      oakTrunkMat,
      oakLeafMat,
      autumnLeafMat,
      pineTrunkMat,
      pineLeafMat,
      willowTrunkMat,
      willowLeafMat,
      blossomLeafMat,
      columnarTrunkMat,
      columnarLeafMat,
    };
  }, []);

  // Separate tree instances into groups
  const treeGroups = useMemo(() => {
    const oaks: TransformItem[] = [];
    const autumnOaks: TransformItem[] = [];
    const pines: TransformItem[] = [];
    const willows: TransformItem[] = [];
    const blossoms: TransformItem[] = [];
    const columnars: TransformItem[] = [];

    trees.forEach((t) => {
      const type = t.type || 'small_oak';
      if (type === 'pine' || type === 'tall_pine' || type === 'dead_tree') {
        pines.push(t);
      } else if (type === 'willow') {
        willows.push(t);
      } else if (type === 'flowering_blossom') {
        blossoms.push(t);
      } else if (type === 'columnar') {
        columnars.push(t);
      } else if (type === 'autumn_amber') {
        autumnOaks.push(t);
      } else {
        // large_oak, small_oak, fruit_tree, sapling
        oaks.push(t);
      }
    });

    return { oaks, autumnOaks, pines, willows, blossoms, columnars };
  }, [trees]);

  // Reusable dummy for setting transform matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // InstancedMesh refs
  const oakTrunkRef = useRef<THREE.InstancedMesh>(null);
  const oakLeafRef = useRef<THREE.InstancedMesh>(null);
  const autumnTrunkRef = useRef<THREE.InstancedMesh>(null);
  const autumnLeafRef = useRef<THREE.InstancedMesh>(null);

  const pineTrunkRef = useRef<THREE.InstancedMesh>(null);
  const pineLeafRef = useRef<THREE.InstancedMesh>(null);

  const willowTrunkRef = useRef<THREE.InstancedMesh>(null);
  const willowLeafRef = useRef<THREE.InstancedMesh>(null);
  const blossomTrunkRef = useRef<THREE.InstancedMesh>(null);
  const blossomLeafRef = useRef<THREE.InstancedMesh>(null);

  const columnarTrunkRef = useRef<THREE.InstancedMesh>(null);
  const columnarLeafRef = useRef<THREE.InstancedMesh>(null);

  const populateInstances = (
    items: TransformItem[],
    trunkMesh: THREE.InstancedMesh | null,
    leafMesh: THREE.InstancedMesh | null
  ) => {
    if (!trunkMesh || !leafMesh || items.length === 0) return;
    items.forEach((item, i) => {
      dummy.position.set(item.position[0], item.position[1], item.position[2]);
      dummy.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
      dummy.scale.set(item.scale[0], item.scale[1], item.scale[2]);
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(i, dummy.matrix);
      leafMesh.setMatrixAt(i, dummy.matrix);
    });
    trunkMesh.instanceMatrix.needsUpdate = true;
    leafMesh.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => {
    populateInstances(treeGroups.oaks, oakTrunkRef.current, oakLeafRef.current);
    populateInstances(treeGroups.autumnOaks, autumnTrunkRef.current, autumnLeafRef.current);
    populateInstances(treeGroups.pines, pineTrunkRef.current, pineLeafRef.current);
    populateInstances(treeGroups.willows, willowTrunkRef.current, willowLeafRef.current);
    populateInstances(treeGroups.blossoms, blossomTrunkRef.current, blossomLeafRef.current);
    populateInstances(treeGroups.columnars, columnarTrunkRef.current, columnarLeafRef.current);
  }, [treeGroups, dummy]);

  return (
    <group name="StylizedTreesForest">
      {/* 1. Lush Green Oaks */}
      {treeGroups.oaks.length > 0 && (
        <>
          <instancedMesh
            ref={oakTrunkRef}
            args={[oakGeos.trunkGeo, materials.oakTrunkMat, treeGroups.oaks.length]}
            castShadow
            receiveShadow
          />
          <instancedMesh
            ref={oakLeafRef}
            args={[oakGeos.leafGeo, materials.oakLeafMat, treeGroups.oaks.length]}
            receiveShadow
          />
        </>
      )}

      {/* 2. Autumn Amber Oaks */}
      {treeGroups.autumnOaks.length > 0 && (
        <>
          <instancedMesh
            ref={autumnTrunkRef}
            args={[oakGeos.trunkGeo, materials.oakTrunkMat, treeGroups.autumnOaks.length]}
            castShadow
            receiveShadow
          />
          <instancedMesh
            ref={autumnLeafRef}
            args={[oakGeos.leafGeo, materials.autumnLeafMat, treeGroups.autumnOaks.length]}
            receiveShadow
          />
        </>
      )}

      {/* 3. Deep Mountain & Whispering Pines */}
      {treeGroups.pines.length > 0 && (
        <>
          <instancedMesh
            ref={pineTrunkRef}
            args={[pineGeos.trunkGeo, materials.pineTrunkMat, treeGroups.pines.length]}
            castShadow
            receiveShadow
          />
          <instancedMesh
            ref={pineLeafRef}
            args={[pineGeos.leafGeo, materials.pineLeafMat, treeGroups.pines.length]}
            receiveShadow
          />
        </>
      )}

      {/* 4. Weeping Willows along River & Lake */}
      {treeGroups.willows.length > 0 && (
        <>
          <instancedMesh
            ref={willowTrunkRef}
            args={[willowGeos.trunkGeo, materials.willowTrunkMat, treeGroups.willows.length]}
            castShadow
            receiveShadow
          />
          <instancedMesh
            ref={willowLeafRef}
            args={[willowGeos.leafGeo, materials.willowLeafMat, treeGroups.willows.length]}
            receiveShadow
          />
        </>
      )}

      {/* 5. Flowering Blossom Willows */}
      {treeGroups.blossoms.length > 0 && (
        <>
          <instancedMesh
            ref={blossomTrunkRef}
            args={[willowGeos.trunkGeo, materials.willowTrunkMat, treeGroups.blossoms.length]}
            castShadow
            receiveShadow
          />
          <instancedMesh
            ref={blossomLeafRef}
            args={[willowGeos.leafGeo, materials.blossomLeafMat, treeGroups.blossoms.length]}
            receiveShadow
          />
        </>
      )}

      {/* 6. Columnar Cypress Trees along Arterial Highways */}
      {treeGroups.columnars.length > 0 && (
        <>
          <instancedMesh
            ref={columnarTrunkRef}
            args={[columnarGeos.trunkGeo, materials.columnarTrunkMat, treeGroups.columnars.length]}
            castShadow
            receiveShadow
          />
          <instancedMesh
            ref={columnarLeafRef}
            args={[columnarGeos.leafGeo, materials.columnarLeafMat, treeGroups.columnars.length]}
            receiveShadow
          />
        </>
      )}
    </group>
  );
});

// Preload the four core stylized tree FBXs
useFBX.preload('/models/trees/Models/STOak1.fbx');
useFBX.preload('/models/trees/Models/STPine1.fbx');
useFBX.preload('/models/trees/Models/STWillow1.fbx');
useFBX.preload('/models/trees/Models/STColumnar1.fbx');
