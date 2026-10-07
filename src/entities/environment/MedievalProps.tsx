import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../../utils/colors';

export interface PropTransformProps {
  position?: [number, number, number];
  rotation?: number | [number, number, number];
  scale?: number | [number, number, number];
}

const parsePosition = (pos?: [number, number, number] | number[]): [number, number, number] => {
  if (pos && pos.length >= 3) return [pos[0], pos[1], pos[2]];
  return [0, 0, 0];
};

const parseRotation = (rot?: number | [number, number, number] | number[]): [number, number, number] => {
  if (rot === undefined) return [0, 0, 0];
  if (typeof rot === 'number') return [0, rot, 0];
  if (rot.length >= 3) return [rot[0], rot[1], rot[2]];
  return [0, 0, 0];
};

const parseScale = (sc?: number | [number, number, number] | number[]): [number, number, number] => {
  if (sc === undefined) return [1, 1, 1];
  if (typeof sc === 'number') return [sc, sc, sc];
  if (sc.length >= 3) return [sc[0], sc[1], sc[2]];
  return [1, 1, 1];
};

// ============================================================================
// 1. MEDIEVAL WAGON
// ============================================================================
export const MedievalWagon: React.FC<PropTransformProps> = React.memo(({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}) => {
  const { scene } = useGLTF('/models/medieval/Prop_Wagon.gltf');
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={parseRotation(rotation)}
      scale={parseScale(scale)}
    />
  );
});

// ============================================================================
// 2. MEDIEVAL CRATE
// ============================================================================
export const MedievalCrate: React.FC<PropTransformProps> = React.memo(({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}) => {
  const { scene } = useGLTF('/models/medieval/Prop_Crate.gltf');
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={parseRotation(rotation)}
      scale={parseScale(scale)}
    />
  );
});

// ============================================================================
// 3. MEDIEVAL CHIMNEY WITH ANIMATED SMOKE
// ============================================================================
export interface MedievalChimneyProps extends PropTransformProps {
  variant?: 1 | 2;
  hasSmoke?: boolean;
}

export const MedievalChimney: React.FC<MedievalChimneyProps> = React.memo(({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
  variant = 1,
  hasSmoke = true,
}) => {
  const modelPath = variant === 2
    ? '/models/medieval/Prop_Chimney2.gltf'
    : '/models/medieval/Prop_Chimney.gltf';

  const { scene } = useGLTF(modelPath);
  const smokeRef = useRef<THREE.Group>(null);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  // Chimney height is ~3.0m in the original model
  const topHeight = 3.0;

  useFrame((state) => {
    if (!hasSmoke || !smokeRef.current) return;
    const t = state.clock.getElapsedTime();
    smokeRef.current.children.forEach((puff, idx) => {
      const progress = ((t * 0.75 + idx * 0.55) % 1.4) / 1.4;
      puff.position.y = topHeight + 0.2 + progress * 1.5;
      const sc = 0.18 + progress * 0.35;
      puff.scale.set(sc, sc, sc);
      puff.position.x = Math.sin(t * 1.2 + idx) * 0.12 + (progress * 0.2);
    });
  });

  return (
    <group position={parsePosition(position)} rotation={parseRotation(rotation)} scale={parseScale(scale)}>
      <primitive object={clone} />

      {hasSmoke && (
        <group ref={smokeRef}>
          {[0, 1, 2].map((idx) => (
            <mesh key={`chimney-smoke-${idx}`} position={[0, topHeight + 0.3, 0]}>
              <dodecahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color={PALETTE.chimneySmoke}
                roughness={0.5}
                transparent
                opacity={0.65 - idx * 0.16}
                flatShading
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
});

// ============================================================================
// 4. MEDIEVAL VINE (Wall & Fence Foliage)
// ============================================================================
export interface MedievalVineProps extends PropTransformProps {
  variant?: 1 | 2 | 4 | 5 | 6 | 9;
}

export const MedievalVine: React.FC<MedievalVineProps> = React.memo(({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
  variant = 1,
}) => {
  const modelPath = `/models/medieval/Prop_Vine${variant}.gltf`;
  const { scene } = useGLTF(modelPath);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={parseRotation(rotation)}
      scale={parseScale(scale)}
    />
  );
});

// ============================================================================
// 5. MEDIEVAL WOODEN FENCE PIECE
// ============================================================================
export interface MedievalFenceProps extends PropTransformProps {
  variant?: 'single' | 'ext1' | 'ext2';
}

export const MedievalFence: React.FC<MedievalFenceProps> = React.memo(({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
  variant = 'single',
}) => {
  const modelPath = variant === 'single'
    ? '/models/medieval/Prop_WoodenFence_Single.gltf'
    : variant === 'ext1'
    ? '/models/medieval/Prop_WoodenFence_Extension1.gltf'
    : '/models/medieval/Prop_WoodenFence_Extension2.gltf';

  const { scene } = useGLTF(modelPath);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={parseRotation(rotation)}
      scale={parseScale(scale)}
    />
  );
});

// ============================================================================
// 6. MEDIEVAL WOODEN FENCE LINE (Procedural fence using MegaKit single segments)
// ============================================================================
export const MedievalFenceLine: React.FC<{
  start: [number, number];
  end: [number, number];
  heightOffset?: number;
}> = React.memo(({ start, end, heightOffset = 0 }) => {
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const totalLength = Math.hypot(dx, dz);
  const angle = Math.atan2(dx, dz) - Math.PI / 2; // MegaKit fence is oriented along X
  const segmentLength = 2.05; // Width of Prop_WoodenFence_Single
  const segments = Math.max(1, Math.round(totalLength / segmentLength));
  const actualSpacing = totalLength / segments;

  return (
    <group position={[start[0], heightOffset, start[1]]} rotation={[0, angle, 0]}>
      {Array.from({ length: segments }).map((_, i) => (
        <MedievalFence
          key={`med-fence-${i}`}
          position={[i * actualSpacing + actualSpacing / 2, 0, 0]}
          rotation={0}
          scale={[actualSpacing / segmentLength, 1, 1]}
        />
      ))}
    </group>
  );
});

// ============================================================================
// 7. COMPOSITE STACK OF MEDIEVAL CRATES (For market, pier, camp, barn)
// ============================================================================
export const MedievalCratesStack: React.FC<PropTransformProps> = React.memo(({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}) => {
  return (
    <group position={parsePosition(position)} rotation={parseRotation(rotation)} scale={parseScale(scale)}>
      {/* Base crate 1 */}
      <MedievalCrate position={[-0.45, 0, 0]} rotation={0.05} scale={0.9} />
      {/* Base crate 2 */}
      <MedievalCrate position={[0.45, 0, 0.05]} rotation={-0.12} scale={0.95} />
      {/* Stacked top crate */}
      <MedievalCrate position={[0.02, 0.95, 0.02]} rotation={0.22} scale={0.85} />
    </group>
  );
});

// Preload common medieval models for smooth instant rendering
useGLTF.preload('/models/medieval/Prop_Wagon.gltf');
useGLTF.preload('/models/medieval/Prop_Crate.gltf');
useGLTF.preload('/models/medieval/Prop_Chimney.gltf');
useGLTF.preload('/models/medieval/Prop_Chimney2.gltf');
useGLTF.preload('/models/medieval/Prop_Vine1.gltf');
useGLTF.preload('/models/medieval/Prop_Vine2.gltf');
useGLTF.preload('/models/medieval/Prop_Vine4.gltf');
useGLTF.preload('/models/medieval/Prop_Vine5.gltf');
useGLTF.preload('/models/medieval/Prop_WoodenFence_Single.gltf');
useGLTF.preload('/models/medieval/Prop_WoodenFence_Extension1.gltf');
useGLTF.preload('/models/medieval/Prop_WoodenFence_Extension2.gltf');
