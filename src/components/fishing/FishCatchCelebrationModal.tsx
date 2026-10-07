import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';
import { useFishingStore } from '../../stores/fishingStore';
import { CozyModal, CozyButton } from '../ui/CozyUIComponents';

import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Suspense } from 'react';

const RotatingFishModel: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  const fbx = useFBX(modelUrl);
  const meshRef = useRef<THREE.Group>(null);

  const { clone, offset, scaleFactor } = useMemo(() => {
    const c = SkeletonUtils.clone(fbx);
    const box = new THREE.Box3().setFromObject(c);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const sf = 1.6 / maxDim;

    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return {
      clone: c,
      offset: [-center.x * sf, -center.y * sf, -center.z * sf] as [number, number, number],
      scaleFactor: sf,
    };
  }, [fbx]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.2;
      meshRef.current.position.y = Math.sin(Date.now() * 0.003) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      <group position={offset} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <primitive object={clone} />
      </group>
    </group>
  );
};

export const FishCatchCelebrationModal: React.FC = React.memo(() => {
  const phase = useFishingStore((state) => state.phase);
  const lastCaught = useFishingStore((state) => state.lastCaught);
  const claimCatch = useFishingStore((state) => state.claimCatch);
  const records = useFishingStore((state) => state.records);

  if (phase !== 'celebration' || !lastCaught) {
    return null;
  }

  const { species, weight, length, price } = lastCaught;
  const isNewRecord = records[species.id]?.weight === weight;

  const rarityNameMap: Record<string, { label: string; color: string; bg: string }> = {
    common: { label: 'Phổ biến', color: '#166534', bg: '#dcfce7' },
    uncommon: { label: 'Đặc biệt', color: '#0e7490', bg: '#cffafe' },
    rare: { label: 'Quý hiếm', color: '#1d4ed8', bg: '#dbeafe' },
    legendary: { label: 'Huyền thoại', color: '#6b21a8', bg: '#f3e8ff' },
  };

  const rarityInfo = rarityNameMap[species.rarity] || rarityNameMap.common;

  return (
    <CozyModal
      isOpen={true}
      onClose={claimCatch}
      title={`BẮT ĐƯỢC ${species.name.toUpperCase()}!`}
      subtitle={`${species.englishName} • ${species.waterType === 'river' ? 'Sông Clearwater' : 'Hồ Azure'}`}
      icon={species.icon}
      width="520px"
      footer={
        <CozyButton
          variant="primary"
          onClick={claimCatch}
          style={{ width: '100%', height: '52px', fontSize: '16px' }}
        >
          <span>🎒 Thêm vào Ba Lô</span>
        </CozyButton>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 3D Rotating Fish Viewer */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '180px',
            background: 'radial-gradient(circle, rgba(186, 230, 253, 0.45) 0%, rgba(224, 242, 254, 0.15) 70%, transparent 100%)',
            borderRadius: '20px',
            border: '1.5px solid #bae6fd',
            overflow: 'hidden',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 2.2], fov: 42 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[3, 4, 2]} intensity={2.0} />
            <directionalLight position={[-3, -2, -2]} intensity={0.8} />
            <pointLight position={[0, 0, 2]} intensity={1.0} color="#ffffff" />
            <Suspense fallback={null}>
              <RotatingFishModel modelUrl={species.modelUrl} />
            </Suspense>
          </Canvas>

          {/* Rarity & Record Badges */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: rarityInfo.color,
                background: rarityInfo.bg,
                padding: '4px 10px',
                borderRadius: '12px',
                border: `1px solid ${rarityInfo.color}`,
              }}
            >
              ★ {rarityInfo.label}
            </span>
            {isNewRecord && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#9a3412',
                  background: '#ffedd5',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid #ea580c',
                }}
              >
                👑 Kỷ Lục Mới!
              </span>
            )}
          </div>
        </div>

        {/* Fish Measurements Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              borderRadius: '14px',
              padding: '10px 12px',
              border: '1px solid #fed7aa',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9a3412', fontWeight: 700 }}>CÂN NẶNG</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#431407', marginTop: '2px' }}>
              {weight.toFixed(2)} kg
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              borderRadius: '14px',
              padding: '10px 12px',
              border: '1px solid #fed7aa',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9a3412', fontWeight: 700 }}>CHIỀU DÀI</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#431407', marginTop: '2px' }}>
              {length.toFixed(1)} cm
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              borderRadius: '14px',
              padding: '10px 12px',
              border: '1px solid #fed7aa',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9a3412', fontWeight: 700 }}>GIÁ TRỊ</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#b45309', marginTop: '2px' }}>
              🪙 {price} xu
            </div>
          </div>
        </div>

        {/* Species Description Lore */}
        <div
          style={{
            background: 'rgba(254, 243, 199, 0.55)',
            borderRadius: '14px',
            padding: '12px 16px',
            border: '1px dashed #d97706',
            fontSize: '13px',
            lineHeight: 1.5,
            color: '#78350f',
            fontStyle: 'italic',
          }}
        >
          &ldquo;{species.description}&rdquo;
        </div>
      </div>
    </CozyModal>
  );
});
