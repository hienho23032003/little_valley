import React, { useEffect } from 'react';
import { useBuildStore } from '../stores/buildStore';
import { getBuildingDefinition } from '../data/buildingData';

export const BuildPlacementHUD: React.FC = () => {
  const selectedBuildingId = useBuildStore((state) => state.selectedBuildingId);
  const previewPosition = useBuildStore((state) => state.previewPosition);
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
      {/* Toast Notification Banner */}
      {lastNotification && (
        <div
          style={{
            position: 'absolute',
            top: '84px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            padding: '10px 20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            border: '1px solid #d4c8b8',
            fontSize: '14px',
            fontWeight: 700,
            color: '#2d4734',
            zIndex: 60,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: 'clamp(10px, 1.4vw, 14px) clamp(12px, 1.8vw, 20px)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.18)',
            border: `2px solid ${isValidPlacement ? '#52b788' : '#e63946'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.5vw, 20px)',
            zIndex: 40,
            pointerEvents: 'auto',
            maxWidth: 'calc(100vw - 24px)',
            overflowX: 'auto',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Building Info & Rotation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>{selectedDef.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#2d4734' }}>
                  {selectedDef.name}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#e9ecef',
                    color: '#495057',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >
                  {selectedDef.size[0]}×{selectedDef.size[1]}m
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                Pos: ({previewPosition[0].toFixed(1)}, {previewPosition[2].toFixed(1)}) • Angle:{' '}
                {rotationDeg}°
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: '#dee2e6' }} />

          {/* Validation Status */}
          <div style={{ minWidth: '220px' }}>
            {isValidPlacement ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#2d6a4f',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <span>✅</span>
                <span>Valid Position — Ready to place!</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#b02a37',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <span>❌</span>
                <span>{validationError || 'Cannot build here'}</span>
              </div>
            )}
            <div style={{ fontSize: '11px', color: '#868e96', marginTop: '2px' }}>
              Cost: 🪵 {selectedDef.cost.wood} • 🪨 {selectedDef.cost.stone} • 🪙{' '}
              {selectedDef.cost.coins}
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: '#dee2e6' }} />

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Rotate Button */}
            <button
              onClick={rotatePreview}
              title="Rotate building 90 degrees [R]"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1px solid #ced4da',
                background: '#f8f9fa',
                color: '#343a40',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e9ecef')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f8f9fa')}
            >
              <span>🔄</span>
              <span>Rotate [R]</span>
            </button>

            {/* Place Button (if clicking instead of canvas left click) */}
            <button
              disabled={!isValidPlacement}
              onClick={placeBuilding}
              title="Confirm placement [Left Click on Ground]"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: isValidPlacement
                  ? 'linear-gradient(180deg, #52b788 0%, #40916c 100%)'
                  : '#dee2e6',
                color: isValidPlacement ? '#ffffff' : '#868e96',
                fontSize: '13px',
                fontWeight: 700,
                cursor: isValidPlacement ? 'pointer' : 'not-allowed',
                boxShadow: isValidPlacement ? '0 4px 12px rgba(64, 145, 108, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🔨</span>
              <span>Place Building</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={cancelPlacement}
              title="Cancel build mode [Esc]"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid #e9ecef',
                background: '#fff',
                color: '#6c757d',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8d7da')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              <span>✕</span>
              <span>[Esc]</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
