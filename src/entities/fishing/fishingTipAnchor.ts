import * as THREE from 'three';

/**
 * High-performance 60 FPS mutable coordinate anchor.
 * Updated by FishingRodProp in useFrame, read by FishingLine in useFrame.
 * Follows AGENTS.md rule: Zero React state re-renders for frame-rate transforms.
 */
export const fishingTipAnchor = {
  pos: new THREE.Vector3(0, 1.2, 0),
  active: false,
};
