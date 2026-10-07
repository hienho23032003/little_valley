import React, { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFishingStore } from '../../stores/fishingStore';
import { fishingTipAnchor } from './fishingTipAnchor';

const SEGMENTS = 20;

export const FishingLine: React.FC = React.memo(() => {
  const bobberPos = useFishingStore((state) => state.bobberPos);
  const phase = useFishingStore((state) => state.phase);

  // Pre-allocate positions array once to follow AGENTS.md zero-allocations rule
  const positions = useMemo(() => new Float32Array((SEGMENTS + 1) * 3), []);

  const { lineObject, geom } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#e2e8f0',
      transparent: true,
      opacity: 0.85,
    });
    const obj = new THREE.Line(g, mat);
    obj.frustumCulled = false;
    return { lineObject: obj, geom: g };
  }, [positions]);

  useEffect(() => {
    return () => {
      geom.dispose();
      if (Array.isArray(lineObject.material)) {
        lineObject.material.forEach((m) => m.dispose());
      } else {
        lineObject.material.dispose();
      }
    };
  }, [geom, lineObject]);

  useFrame((state) => {
    const isActive =
      bobberPos &&
      (phase === 'waiting' || phase === 'nibble' || phase === 'biting' || phase === 'minigame');

    lineObject.visible = Boolean(isActive && fishingTipAnchor.active);
    if (!isActive || !fishingTipAnchor.active) return;

    const t = state.clock.getElapsedTime();
    const tip = fishingTipAnchor.pos;
    const [bobX, bobY, bobZ] = bobberPos;

    // Control point calculation
    const midX = (tip.x + bobX) * 0.5;
    const midZ = (tip.z + bobZ) * 0.5;
    let midY: number;

    if (phase === 'waiting') {
      // Gentle natural catenary sag in the fishing line
      const lineLen = Math.hypot(bobX - tip.x, bobZ - tip.z);
      const sag = Math.min(0.6, 0.15 + lineLen * 0.035);
      midY = (tip.y + bobY) * 0.5 - sag;
    } else if (phase === 'nibble') {
      const sag = 0.2 + Math.sin(t * 18.0) * 0.04;
      midY = (tip.y + bobY) * 0.5 - sag;
    } else {
      // Taut tension line during bite or minigame fight
      const vibration = Math.sin(t * 40.0) * 0.015;
      midY = (tip.y + bobY) * 0.5 + vibration;
    }

    // Evaluate quadratic bezier curve across segments
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= SEGMENTS; i++) {
      const s = i / SEGMENTS;
      const inv = 1 - s;
      const w0 = inv * inv;
      const w1 = 2 * inv * s;
      const w2 = s * s;

      const px = w0 * tip.x + w1 * midX + w2 * bobX;
      const py = w0 * tip.y + w1 * midY + w2 * (bobY + 0.1);
      const pz = w0 * tip.z + w1 * midZ + w2 * bobZ;

      posAttr.setXYZ(i, px, py, pz);
    }

    posAttr.needsUpdate = true;
  });

  return <primitive object={lineObject} />;
});
