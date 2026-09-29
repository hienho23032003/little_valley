import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE } from '../../utils/colors';
import { TransformItem } from '../../data/worldData';

interface InstancedFoliageProps {
  trees: TransformItem[];
  rocks: TransformItem[];
  bushes: TransformItem[];
  flowers: TransformItem[];
  grassTufts?: TransformItem[];
  mushrooms?: TransformItem[];
  fallenLogs?: TransformItem[];
}

export const InstancedFoliage: React.FC<InstancedFoliageProps> = React.memo(({
  trees,
  rocks,
  bushes,
  flowers,
  grassTufts = [],
  mushrooms = [],
  fallenLogs = [],
}) => {
  // 1. Separate trees by variant
  const treeGroups = useMemo(() => {
    const pines: TransformItem[] = [];
    const tallPines: TransformItem[] = [];
    const largeOaks: TransformItem[] = [];
    const smallOaks: TransformItem[] = [];
    const fruitTrees: TransformItem[] = [];
    const autumnBirches: TransformItem[] = [];
    const blossomTrees: TransformItem[] = [];
    const saplings: TransformItem[] = [];
    const deadTrees: TransformItem[] = [];

    trees.forEach((t) => {
      const variant = t.type || 'small_oak';
      if (variant === 'pine') pines.push(t);
      else if (variant === 'tall_pine') tallPines.push(t);
      else if (variant === 'large_oak') largeOaks.push(t);
      else if (variant === 'fruit_tree') fruitTrees.push(t);
      else if (variant === 'autumn_amber') autumnBirches.push(t);
      else if (variant === 'flowering_blossom') blossomTrees.push(t);
      else if (variant === 'sapling') saplings.push(t);
      else if (variant === 'dead_tree') deadTrees.push(t);
      else smallOaks.push(t);
    });

    return {
      pines,
      tallPines,
      largeOaks,
      smallOaks,
      fruitTrees,
      autumnBirches,
      blossomTrees,
      saplings,
      deadTrees,
    };
  }, [trees]);

  // Separate flowers by color
  const flowerGroups = useMemo(() => {
    const yellow: TransformItem[] = [];
    const pink: TransformItem[] = [];
    const purple: TransformItem[] = [];
    const white: TransformItem[] = [];
    const blue: TransformItem[] = [];

    flowers.forEach((f) => {
      if (f.color === '#ff85a1') pink.push(f);
      else if (f.color === '#b388eb') purple.push(f);
      else if (f.color === '#ffffff') white.push(f);
      else if (f.color === '#70d6ff') blue.push(f);
      else yellow.push(f);
    });

    return { yellow, pink, purple, white, blue };
  }, [flowers]);

  // Reusable dummy object for setting matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // InstancedMesh Refs - Trees
  const pineTrunkRef = useRef<THREE.InstancedMesh>(null);
  const pineCone1Ref = useRef<THREE.InstancedMesh>(null);
  const pineCone2Ref = useRef<THREE.InstancedMesh>(null);
  const pineCone3Ref = useRef<THREE.InstancedMesh>(null);

  const tallPineTrunkRef = useRef<THREE.InstancedMesh>(null);
  const tallPineCone1Ref = useRef<THREE.InstancedMesh>(null);
  const tallPineCone2Ref = useRef<THREE.InstancedMesh>(null);
  const tallPineCone3Ref = useRef<THREE.InstancedMesh>(null);
  const tallPineCone4Ref = useRef<THREE.InstancedMesh>(null);

  const largeOakTrunkRef = useRef<THREE.InstancedMesh>(null);
  const largeOakCanopy1Ref = useRef<THREE.InstancedMesh>(null);
  const largeOakCanopy2Ref = useRef<THREE.InstancedMesh>(null);

  const smallOakTrunkRef = useRef<THREE.InstancedMesh>(null);
  const smallOakCanopyRef = useRef<THREE.InstancedMesh>(null);

  const fruitTrunkRef = useRef<THREE.InstancedMesh>(null);
  const fruitCanopyRef = useRef<THREE.InstancedMesh>(null);
  const fruitApplesRef = useRef<THREE.InstancedMesh>(null);

  const autumnTrunkRef = useRef<THREE.InstancedMesh>(null);
  const autumnCanopyRef = useRef<THREE.InstancedMesh>(null);

  const blossomTrunkRef = useRef<THREE.InstancedMesh>(null);
  const blossomCanopy1Ref = useRef<THREE.InstancedMesh>(null);
  const blossomCanopy2Ref = useRef<THREE.InstancedMesh>(null);

  const saplingTrunkRef = useRef<THREE.InstancedMesh>(null);
  const saplingCanopyRef = useRef<THREE.InstancedMesh>(null);

  const deadTreeRef = useRef<THREE.InstancedMesh>(null);

  // InstancedMesh Refs - Nature props
  const rockRef = useRef<THREE.InstancedMesh>(null);
  const bushRef = useRef<THREE.InstancedMesh>(null);
  const grassTuftRef = useRef<THREE.InstancedMesh>(null);
  const mushroomStemRef = useRef<THREE.InstancedMesh>(null);
  const mushroomCapRef = useRef<THREE.InstancedMesh>(null);
  const fallenLogRef = useRef<THREE.InstancedMesh>(null);

  // InstancedMesh Refs - Flowers
  const flowerStemRef = useRef<THREE.InstancedMesh>(null);
  const flowerYellowRef = useRef<THREE.InstancedMesh>(null);
  const flowerPinkRef = useRef<THREE.InstancedMesh>(null);
  const flowerPurpleRef = useRef<THREE.InstancedMesh>(null);
  const flowerWhiteRef = useRef<THREE.InstancedMesh>(null);
  const flowerBlueRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    // 1. Whispering Pines
    if (pineTrunkRef.current && pineCone1Ref.current && pineCone2Ref.current && pineCone3Ref.current) {
      treeGroups.pines.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 1.2 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        pineTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 2.2 * sy, z);
        dummy.updateMatrix();
        pineCone1Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 3.2 * sy, z);
        dummy.scale.set(sx * 0.8, sy * 0.8, sz * 0.8);
        dummy.updateMatrix();
        pineCone2Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 4.1 * sy, z);
        dummy.scale.set(sx * 0.6, sy * 0.6, sz * 0.6);
        dummy.updateMatrix();
        pineCone3Ref.current!.setMatrixAt(i, dummy.matrix);
      });

      pineTrunkRef.current.instanceMatrix.needsUpdate = true;
      pineCone1Ref.current.instanceMatrix.needsUpdate = true;
      pineCone2Ref.current.instanceMatrix.needsUpdate = true;
      pineCone3Ref.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Tall Alpine Pines
    if (
      tallPineTrunkRef.current &&
      tallPineCone1Ref.current &&
      tallPineCone2Ref.current &&
      tallPineCone3Ref.current &&
      tallPineCone4Ref.current
    ) {
      treeGroups.tallPines.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 1.9 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        tallPineTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 3.0 * sy, z);
        dummy.updateMatrix();
        tallPineCone1Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 4.2 * sy, z);
        dummy.scale.set(sx * 0.85, sy * 0.85, sz * 0.85);
        dummy.updateMatrix();
        tallPineCone2Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 5.3 * sy, z);
        dummy.scale.set(sx * 0.68, sy * 0.68, sz * 0.68);
        dummy.updateMatrix();
        tallPineCone3Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 6.3 * sy, z);
        dummy.scale.set(sx * 0.5, sy * 0.5, sz * 0.5);
        dummy.updateMatrix();
        tallPineCone4Ref.current!.setMatrixAt(i, dummy.matrix);
      });

      tallPineTrunkRef.current.instanceMatrix.needsUpdate = true;
      tallPineCone1Ref.current.instanceMatrix.needsUpdate = true;
      tallPineCone2Ref.current.instanceMatrix.needsUpdate = true;
      tallPineCone3Ref.current.instanceMatrix.needsUpdate = true;
      tallPineCone4Ref.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Large Ancient Oaks
    if (largeOakTrunkRef.current && largeOakCanopy1Ref.current && largeOakCanopy2Ref.current) {
      treeGroups.largeOaks.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 1.3 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        largeOakTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 2.8 * sy, z);
        dummy.updateMatrix();
        largeOakCanopy1Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 3.9 * sy, z);
        dummy.scale.set(sx * 0.75, sy * 0.75, sz * 0.75);
        dummy.updateMatrix();
        largeOakCanopy2Ref.current!.setMatrixAt(i, dummy.matrix);
      });

      largeOakTrunkRef.current.instanceMatrix.needsUpdate = true;
      largeOakCanopy1Ref.current.instanceMatrix.needsUpdate = true;
      largeOakCanopy2Ref.current.instanceMatrix.needsUpdate = true;
    }

    // 4. Small Oaks
    if (smallOakTrunkRef.current && smallOakCanopyRef.current) {
      treeGroups.smallOaks.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 0.9 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        smallOakTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 2.0 * sy, z);
        dummy.updateMatrix();
        smallOakCanopyRef.current!.setMatrixAt(i, dummy.matrix);
      });

      smallOakTrunkRef.current.instanceMatrix.needsUpdate = true;
      smallOakCanopyRef.current.instanceMatrix.needsUpdate = true;
    }

    // 5. Fruit Orchard Trees
    if (fruitTrunkRef.current && fruitCanopyRef.current && fruitApplesRef.current) {
      treeGroups.fruitTrees.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 1.0 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        fruitTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 2.2 * sy, z);
        dummy.updateMatrix();
        fruitCanopyRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 2.1 * sy, z);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        fruitApplesRef.current!.setMatrixAt(i, dummy.matrix);
      });

      fruitTrunkRef.current.instanceMatrix.needsUpdate = true;
      fruitCanopyRef.current.instanceMatrix.needsUpdate = true;
      fruitApplesRef.current.instanceMatrix.needsUpdate = true;
    }

    // 6. Autumn Amber Birches
    if (autumnTrunkRef.current && autumnCanopyRef.current) {
      treeGroups.autumnBirches.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 1.1 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        autumnTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 2.4 * sy, z);
        dummy.updateMatrix();
        autumnCanopyRef.current!.setMatrixAt(i, dummy.matrix);
      });

      autumnTrunkRef.current.instanceMatrix.needsUpdate = true;
      autumnCanopyRef.current.instanceMatrix.needsUpdate = true;
    }

    // 7. Flowering Blossom Trees
    if (blossomTrunkRef.current && blossomCanopy1Ref.current && blossomCanopy2Ref.current) {
      treeGroups.blossomTrees.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 1.1 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        blossomTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 2.4 * sy, z);
        dummy.updateMatrix();
        blossomCanopy1Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 3.2 * sy, z);
        dummy.scale.set(sx * 0.7, sy * 0.7, sz * 0.7);
        dummy.updateMatrix();
        blossomCanopy2Ref.current!.setMatrixAt(i, dummy.matrix);
      });

      blossomTrunkRef.current.instanceMatrix.needsUpdate = true;
      blossomCanopy1Ref.current.instanceMatrix.needsUpdate = true;
      blossomCanopy2Ref.current.instanceMatrix.needsUpdate = true;
    }

    // 8. Young Saplings
    if (saplingTrunkRef.current && saplingCanopyRef.current) {
      treeGroups.saplings.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 0.55 * sy, z);
        dummy.rotation.set(0, t.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        saplingTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 1.2 * sy, z);
        dummy.updateMatrix();
        saplingCanopyRef.current!.setMatrixAt(i, dummy.matrix);
      });

      saplingTrunkRef.current.instanceMatrix.needsUpdate = true;
      saplingCanopyRef.current.instanceMatrix.needsUpdate = true;
    }

    // 9. Dead Trees
    if (deadTreeRef.current) {
      treeGroups.deadTrees.forEach((t, i) => {
        const [x, y, z] = t.position;
        const [sx, sy, sz] = t.scale;

        dummy.position.set(x, y + 1.1 * sy, z);
        dummy.rotation.set(0.08, t.rotation[1], 0.05);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        deadTreeRef.current!.setMatrixAt(i, dummy.matrix);
      });

      deadTreeRef.current.instanceMatrix.needsUpdate = true;
    }

    // 10. Rocks & Boulders
    if (rockRef.current) {
      rocks.forEach((r, i) => {
        const [x, y, z] = r.position;
        const [sx, sy, sz] = r.scale;

        dummy.position.set(x, y + 0.3 * sy, z);
        dummy.rotation.set(r.rotation[0], r.rotation[1], r.rotation[2]);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        rockRef.current!.setMatrixAt(i, dummy.matrix);
      });

      rockRef.current.instanceMatrix.needsUpdate = true;
    }

    // 11. Bushes
    if (bushRef.current) {
      bushes.forEach((b, i) => {
        const [x, y, z] = b.position;
        const [sx, sy, sz] = b.scale;

        dummy.position.set(x, y + 0.45 * sy, z);
        dummy.rotation.set(0, b.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        bushRef.current!.setMatrixAt(i, dummy.matrix);
      });

      bushRef.current.instanceMatrix.needsUpdate = true;
    }

    // 12. Grass Tufts
    if (grassTuftRef.current && grassTufts.length > 0) {
      grassTufts.forEach((g, i) => {
        const [x, y, z] = g.position;
        const [sx, sy, sz] = g.scale;

        dummy.position.set(x, y + 0.25 * sy, z);
        dummy.rotation.set(0, g.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        grassTuftRef.current!.setMatrixAt(i, dummy.matrix);
      });

      grassTuftRef.current.instanceMatrix.needsUpdate = true;
    }

    // 13. Forest Mushrooms
    if (mushroomStemRef.current && mushroomCapRef.current && mushrooms.length > 0) {
      mushrooms.forEach((m, i) => {
        const [x, y, z] = m.position;
        const [sx, sy, sz] = m.scale;

        dummy.position.set(x, y + 0.12 * sy, z);
        dummy.rotation.set(0, m.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        mushroomStemRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 0.24 * sy, z);
        dummy.updateMatrix();
        mushroomCapRef.current!.setMatrixAt(i, dummy.matrix);
      });

      mushroomStemRef.current.instanceMatrix.needsUpdate = true;
      mushroomCapRef.current.instanceMatrix.needsUpdate = true;
    }

    // 14. Fallen Mossy Logs
    if (fallenLogRef.current && fallenLogs.length > 0) {
      fallenLogs.forEach((l, i) => {
        const [x, y, z] = l.position;
        const [sx, sy, sz] = l.scale;

        dummy.position.set(x, y + 0.18 * sy, z);
        dummy.rotation.set(0, l.rotation[1], Math.PI / 2);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        fallenLogRef.current!.setMatrixAt(i, dummy.matrix);
      });

      fallenLogRef.current.instanceMatrix.needsUpdate = true;
    }

    // 15. Flower Stems
    if (flowerStemRef.current) {
      flowers.forEach((f, i) => {
        const [x, y, z] = f.position;
        const [sx, sy, sz] = f.scale;

        dummy.position.set(x, y + 0.18 * sy, z);
        dummy.rotation.set(f.rotation[0], f.rotation[1], f.rotation[2]);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        flowerStemRef.current!.setMatrixAt(i, dummy.matrix);
      });

      flowerStemRef.current.instanceMatrix.needsUpdate = true;
    }

    // 16. Flower Blossoms (By Color)
    const updateFlowerBlossoms = (
      ref: React.RefObject<THREE.InstancedMesh | null>,
      items: TransformItem[]
    ) => {
      if (!ref.current || items.length === 0) return;
      items.forEach((f, i) => {
        const [x, y, z] = f.position;
        const [sx, sy, sz] = f.scale;

        dummy.position.set(x, y + 0.38 * sy, z);
        dummy.rotation.set(f.rotation[0], f.rotation[1], f.rotation[2]);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    };

    updateFlowerBlossoms(flowerYellowRef, flowerGroups.yellow);
    updateFlowerBlossoms(flowerPinkRef, flowerGroups.pink);
    updateFlowerBlossoms(flowerPurpleRef, flowerGroups.purple);
    updateFlowerBlossoms(flowerWhiteRef, flowerGroups.white);
    updateFlowerBlossoms(flowerBlueRef, flowerGroups.blue);
  }, [treeGroups, rocks, bushes, flowers, grassTufts, mushrooms, fallenLogs, flowerGroups, dummy]);

  return (
    <group>
      {/* 1. Whispering Pines */}
      {treeGroups.pines.length > 0 && (
        <>
          <instancedMesh
            ref={pineTrunkRef}
            args={[undefined, undefined, treeGroups.pines.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.22, 0.28, 2.4, 6]} />
            <meshStandardMaterial color="#4d3319" roughness={0.9} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={pineCone1Ref}
            args={[undefined, undefined, treeGroups.pines.length]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[1.8, 1.8, 6]} />
            <meshStandardMaterial color={PALETTE.pineDark} roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={pineCone2Ref}
            args={[undefined, undefined, treeGroups.pines.length]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[1.4, 1.6, 6]} />
            <meshStandardMaterial color={PALETTE.pineMedium} roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={pineCone3Ref}
            args={[undefined, undefined, treeGroups.pines.length]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[1.0, 1.4, 6]} />
            <meshStandardMaterial color={PALETTE.pineLight} roughness={0.85} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 2. Tall Alpine Pines */}
      {treeGroups.tallPines.length > 0 && (
        <>
          <instancedMesh
            ref={tallPineTrunkRef}
            args={[undefined, undefined, treeGroups.tallPines.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.24, 0.32, 3.8, 6]} />
            <meshStandardMaterial color="#3d2814" roughness={0.9} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={tallPineCone1Ref}
            args={[undefined, undefined, treeGroups.tallPines.length]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[1.7, 2.0, 6]} />
            <meshStandardMaterial color="#1b4332" roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={tallPineCone2Ref}
            args={[undefined, undefined, treeGroups.tallPines.length]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[1.3, 1.8, 6]} />
            <meshStandardMaterial color="#2d5a3f" roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={tallPineCone3Ref}
            args={[undefined, undefined, treeGroups.tallPines.length]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[0.9, 1.5, 6]} />
            <meshStandardMaterial color="#40916c" roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={tallPineCone4Ref}
            args={[undefined, undefined, treeGroups.tallPines.length]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[0.55, 1.2, 6]} />
            <meshStandardMaterial color="#52b788" roughness={0.85} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 3. Large Ancient Oaks */}
      {treeGroups.largeOaks.length > 0 && (
        <>
          <instancedMesh
            ref={largeOakTrunkRef}
            args={[undefined, undefined, treeGroups.largeOaks.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.34, 0.42, 2.6, 6]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.9} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={largeOakCanopy1Ref}
            args={[undefined, undefined, treeGroups.largeOaks.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[2.0, 0]} />
            <meshStandardMaterial color="#4f9448" roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={largeOakCanopy2Ref}
            args={[undefined, undefined, treeGroups.largeOaks.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#62ab5a" roughness={0.85} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 4. Small Oaks */}
      {treeGroups.smallOaks.length > 0 && (
        <>
          <instancedMesh
            ref={smallOakTrunkRef}
            args={[undefined, undefined, treeGroups.smallOaks.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.2, 0.25, 1.8, 6]} />
            <meshStandardMaterial color={PALETTE.woodDark} roughness={0.9} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={smallOakCanopyRef}
            args={[undefined, undefined, treeGroups.smallOaks.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial color={PALETTE.oakGreen} roughness={0.85} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 5. Fruit Orchard Trees */}
      {treeGroups.fruitTrees.length > 0 && (
        <>
          <instancedMesh
            ref={fruitTrunkRef}
            args={[undefined, undefined, treeGroups.fruitTrees.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.22, 0.26, 2.0, 6]} />
            <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={fruitCanopyRef}
            args={[undefined, undefined, treeGroups.fruitTrees.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#68ad58" roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={fruitApplesRef}
            args={[undefined, undefined, treeGroups.fruitTrees.length]}
            castShadow
          >
            <sphereGeometry args={[0.22, 5, 5]} />
            <meshStandardMaterial color="#e63946" roughness={0.4} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 6. Autumn Amber Birches */}
      {treeGroups.autumnBirches.length > 0 && (
        <>
          <instancedMesh
            ref={autumnTrunkRef}
            args={[undefined, undefined, treeGroups.autumnBirches.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.2, 0.24, 2.2, 6]} />
            <meshStandardMaterial color="#f0ece1" roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={autumnCanopyRef}
            args={[undefined, undefined, treeGroups.autumnBirches.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color={PALETTE.oakAutumn} roughness={0.85} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 7. Flowering Willow Blossom Trees */}
      {treeGroups.blossomTrees.length > 0 && (
        <>
          <instancedMesh
            ref={blossomTrunkRef}
            args={[undefined, undefined, treeGroups.blossomTrees.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.22, 0.28, 2.2, 6]} />
            <meshStandardMaterial color="#5a4d41" roughness={0.9} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={blossomCanopy1Ref}
            args={[undefined, undefined, treeGroups.blossomTrees.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.7, 0]} />
            <meshStandardMaterial color="#f4acb7" roughness={0.85} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={blossomCanopy2Ref}
            args={[undefined, undefined, treeGroups.blossomTrees.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial color="#ffcad4" roughness={0.85} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 8. Young Saplings */}
      {treeGroups.saplings.length > 0 && (
        <>
          <instancedMesh
            ref={saplingTrunkRef}
            args={[undefined, undefined, treeGroups.saplings.length]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.12, 0.14, 1.1, 5]} />
            <meshStandardMaterial color={PALETTE.woodLight} roughness={0.9} flatShading />
          </instancedMesh>
          <instancedMesh
            ref={saplingCanopyRef}
            args={[undefined, undefined, treeGroups.saplings.length]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color={PALETTE.oakLight} roughness={0.85} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 9. Weathered Dead Trees */}
      {treeGroups.deadTrees.length > 0 && (
        <instancedMesh
          ref={deadTreeRef}
          args={[undefined, undefined, treeGroups.deadTrees.length]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.18, 0.28, 2.2, 5]} />
          <meshStandardMaterial color="#7d746d" roughness={0.95} flatShading />
        </instancedMesh>
      )}

      {/* 10. Rocks & Boulders */}
      {rocks.length > 0 && (
        <instancedMesh
          ref={rockRef}
          args={[undefined, undefined, rocks.length]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color={PALETTE.rockBase} roughness={0.92} flatShading />
        </instancedMesh>
      )}

      {/* 11. Fluffy Bushes */}
      {bushes.length > 0 && (
        <instancedMesh
          ref={bushRef}
          args={[undefined, undefined, bushes.length]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial color={PALETTE.bushGreen} roughness={0.88} flatShading />
        </instancedMesh>
      )}

      {/* 12. Grass Tufts */}
      {grassTufts.length > 0 && (
        <instancedMesh
          ref={grassTuftRef}
          args={[undefined, undefined, grassTufts.length]}
          receiveShadow
        >
          <coneGeometry args={[0.35, 0.5, 4]} />
          <meshStandardMaterial color={PALETTE.grassSecondary} roughness={0.9} flatShading />
        </instancedMesh>
      )}

      {/* 13. Forest Mushrooms (Fly Agaric Toadstools) */}
      {mushrooms.length > 0 && (
        <>
          <instancedMesh
            ref={mushroomStemRef}
            args={[undefined, undefined, mushrooms.length]}
            receiveShadow
          >
            <cylinderGeometry args={[0.06, 0.08, 0.24, 5]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </instancedMesh>
          <instancedMesh
            ref={mushroomCapRef}
            args={[undefined, undefined, mushrooms.length]}
          >
            <coneGeometry args={[0.22, 0.16, 6]} />
            <meshStandardMaterial color="#e63946" roughness={0.7} flatShading />
          </instancedMesh>
        </>
      )}

      {/* 14. Fallen Mossy Logs */}
      {fallenLogs.length > 0 && (
        <instancedMesh
          ref={fallenLogRef}
          args={[undefined, undefined, fallenLogs.length]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.22, 0.24, 2.4, 6]} />
          <meshStandardMaterial color="#583101" roughness={0.9} flatShading />
        </instancedMesh>
      )}

      {/* 15. Wildflower Stems */}
      {flowers.length > 0 && (
        <instancedMesh
          ref={flowerStemRef}
          args={[undefined, undefined, flowers.length]}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.36, 4]} />
          <meshStandardMaterial color={PALETTE.flowerStem} roughness={0.8} />
        </instancedMesh>
      )}

      {/* 16. Wildflower Blossoms (Color Variants) */}
      {flowerGroups.yellow.length > 0 && (
        <instancedMesh
          ref={flowerYellowRef}
          args={[undefined, undefined, flowerGroups.yellow.length]}
        >
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#ffd166" roughness={0.6} flatShading />
        </instancedMesh>
      )}

      {flowerGroups.pink.length > 0 && (
        <instancedMesh
          ref={flowerPinkRef}
          args={[undefined, undefined, flowerGroups.pink.length]}
        >
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#ff85a1" roughness={0.6} flatShading />
        </instancedMesh>
      )}

      {flowerGroups.purple.length > 0 && (
        <instancedMesh
          ref={flowerPurpleRef}
          args={[undefined, undefined, flowerGroups.purple.length]}
        >
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#b388eb" roughness={0.6} flatShading />
        </instancedMesh>
      )}

      {flowerGroups.white.length > 0 && (
        <instancedMesh
          ref={flowerWhiteRef}
          args={[undefined, undefined, flowerGroups.white.length]}
        >
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} flatShading />
        </instancedMesh>
      )}

      {flowerGroups.blue.length > 0 && (
        <instancedMesh
          ref={flowerBlueRef}
          args={[undefined, undefined, flowerGroups.blue.length]}
        >
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#70d6ff" roughness={0.6} flatShading />
        </instancedMesh>
      )}
    </group>
  );
});
