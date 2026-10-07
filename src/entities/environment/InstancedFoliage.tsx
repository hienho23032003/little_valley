import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE } from '../../utils/colors';
import { TransformItem } from '../../data/worldData';

interface InstancedFoliageProps {
  trees?: TransformItem[];
  rocks: TransformItem[];
  bushes: TransformItem[];
  flowers: TransformItem[];
  grassTufts?: TransformItem[];
  mushrooms?: TransformItem[];
  fallenLogs?: TransformItem[];
}

export const InstancedFoliage: React.FC<InstancedFoliageProps> = React.memo(({
  rocks,
  bushes,
  flowers,
  grassTufts = [],
  mushrooms = [],
  fallenLogs = [],
}) => {
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
    // 1. Rocks & Boulders
    if (rockRef.current && rocks.length > 0) {
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

    // 2. Bushes
    if (bushRef.current && bushes.length > 0) {
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

    // 3. Grass Tufts
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

    // 4. Forest Mushrooms
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

    // 5. Fallen Mossy Logs
    if (fallenLogRef.current && fallenLogs.length > 0) {
      fallenLogs.forEach((l, i) => {
        const [x, y, z] = l.position;
        const [sx, sy, sz] = l.scale;

        dummy.position.set(x, y + 0.18 * sy, z);
        dummy.rotation.set(0, l.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        fallenLogRef.current!.setMatrixAt(i, dummy.matrix);
      });

      fallenLogRef.current.instanceMatrix.needsUpdate = true;
    }

    // 6. Wildflower Stems
    if (flowerStemRef.current && flowers.length > 0) {
      flowers.forEach((f, i) => {
        const [x, y, z] = f.position;
        const [sx, sy, sz] = f.scale;

        dummy.position.set(x, y + 0.18 * sy, z);
        dummy.rotation.set(0, f.rotation[1], 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();
        flowerStemRef.current!.setMatrixAt(i, dummy.matrix);
      });

      flowerStemRef.current.instanceMatrix.needsUpdate = true;
    }

    // 7. Wildflower Blossoms by Color
    const updateFlowerBlossoms = (
      ref: React.RefObject<THREE.InstancedMesh | null>,
      items: TransformItem[]
    ) => {
      if (!ref.current || items.length === 0) return;
      items.forEach((f, i) => {
        const [x, y, z] = f.position;
        const [sx, sy, sz] = f.scale;

        dummy.position.set(x, y + 0.36 * sy, z);
        dummy.rotation.set(0, f.rotation[1], 0);
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
  }, [rocks, bushes, flowers, grassTufts, mushrooms, fallenLogs, flowerGroups, dummy]);

  return (
    <group name="GroundFoliageProps">
      {/* 1. Rocks & Boulders */}
      {rocks.length > 0 && (
        <instancedMesh
          ref={rockRef}
          args={[undefined, undefined, rocks.length]}
          receiveShadow
        >
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color={PALETTE.rockBase} roughness={0.92} flatShading />
        </instancedMesh>
      )}

      {/* 2. Fluffy Bushes */}
      {bushes.length > 0 && (
        <instancedMesh
          ref={bushRef}
          args={[undefined, undefined, bushes.length]}
          receiveShadow
        >
          <dodecahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial color={PALETTE.bushGreen} roughness={0.88} flatShading />
        </instancedMesh>
      )}

      {/* 3. Grass Tufts */}
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

      {/* 4. Forest Mushrooms (Fly Agaric Toadstools) */}
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

      {/* 5. Fallen Mossy Logs */}
      {fallenLogs.length > 0 && (
        <instancedMesh
          ref={fallenLogRef}
          args={[undefined, undefined, fallenLogs.length]}
          receiveShadow
        >
          <cylinderGeometry args={[0.22, 0.24, 2.4, 6]} />
          <meshStandardMaterial color="#583101" roughness={0.9} flatShading />
        </instancedMesh>
      )}

      {/* 6. Wildflower Stems */}
      {flowers.length > 0 && (
        <instancedMesh
          ref={flowerStemRef}
          args={[undefined, undefined, flowers.length]}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.36, 4]} />
          <meshStandardMaterial color={PALETTE.flowerStem} roughness={0.8} />
        </instancedMesh>
      )}

      {/* 7. Wildflower Blossoms (Color Variants) */}
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
