import React, { useEffect } from 'react';
import { useBuildStore } from '../stores/buildStore';
import { getBuildingDefinition } from '../data/buildingData';
import { CozyButton } from './ui/CozyUIComponents';

export const BuildPlacementHUD: React.FC = () => {
  const selectedBuildingId = useBuildStore((state) => state.selectedBuildingId);
  const previewRotation = useBuildStore((state) => state.previewRotation);
  const isValidPlacement = useBuildStore((state) => state.isValidPlacement);
  const validationError = useBuildStore((state) => state.validationError);
  const rotatePreview = useBuildStore((state) => state.rotatePreview);
  const cancelPlacement = useBuildStore((state) => state.cancelPlacement);
  const placeBuilding = useBuildStore((state) => state.placeBuilding);

  const lastNotification = useBuildStore((state) => state.lastNotification);
  const clearNotification = useBuildStore((state) => state.clearNotification);

  // Auto clear notification after 3.5s
  useEffect(() => {
    if (lastNotification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastNotification, clearNotification]);

  const selectedDef = selectedBuildingId ? getBuildingDefinition(selectedBuildingId) : null;
  const rotationDeg = Math.round((previewRotation * 180) / Math.PI) % 360;

  return (
    <>
      {/* Toast Notification Banner with Cozy Texture */}
      {lastNotification && (
        <div
          style={{
            position: 'absolute',
            top: '84px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'url("/ui/cozy/ui_components/other_controls/cozy_banner_notification__408x71.png") no-repeat center / 100% 100%',
            minWidth: '240px',
            height: '48px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 900,
            color: '#4a2810',
            zIndex: 60,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.22))',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>✨</span>
          <span>{lastNotification}</span>
        </div>
      )}

      {/* Floating Placement HUD (Only active during placement mode) */}
      {selectedBuildingId && selectedDef && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(clamp(84px, 10vh, 96px) + env(safe-area-inset-bottom, 0px))',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'url("/ui/cozy/ui_components/panels/cozy_panel_detail__1000x300.png") no-repeat center / 100% 100%',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: '20px 36px',
            filter: 'drop-shadow(0 18px 40px rgba(70, 40, 15, 0.45))',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.5vw, 20px)',
            zIndex: 40,
            pointerEvents: 'auto',
            animation: 'fadeInUp 0.15s ease-out',
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          {/* Building Info Icon & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'rgba(230, 190, 140, 0.3)',
                border: '1px solid #d6b88b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              {selectedDef.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#4a2810',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{selectedDef.name}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: isValidPlacement ? 'rgba(82, 183, 136, 0.3)' : 'rgba(230, 57, 70, 0.25)',
                    color: isValidPlacement ? '#1b4332' : '#9b2226',
                    border: `1px solid ${isValidPlacement ? '#52b788' : '#e63946'}`,
                  }}
                >
                  {isValidPlacement ? 'Vị trí hợp lệ' : validationError || 'Bị vướng'}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#7f5539',
                  fontWeight: 700,
                  marginTop: '2px',
                }}
              >
                Góc xoay: {rotationDeg}° • Kích thước: {selectedDef.size[0]}×{selectedDef.size[1]}m
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', background: '#e0c8a8' }} />

          {/* Action Buttons (100% Cozy Image Buttons) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Rotate Button */}
            <CozyButton
              variant="secondary"
              onClick={rotatePreview}
              style={{ minWidth: 'auto', height: '40px', padding: '0 14px', fontSize: '12px' }}
            >
              <span>🔄 Xoay [R]</span>
            </CozyButton>

            {/* Place Button */}
            <CozyButton
              variant="primary"
              disabled={!isValidPlacement}
              onClick={placeBuilding}
              style={{ minWidth: 'auto', height: '40px', padding: '0 18px', fontSize: '13px' }}
            >
              <span>🔨 Đặt công trình</span>
            </CozyButton>

            {/* Cancel Button */}
            <CozyButton
              variant="secondary"
              onClick={cancelPlacement}
              style={{ minWidth: 'auto', height: '40px', padding: '0 12px', fontSize: '12px' }}
            >
              <span>✕ [Esc]</span>
            </CozyButton>
          </div>
        </div>
      )}
    </>
  );
};
