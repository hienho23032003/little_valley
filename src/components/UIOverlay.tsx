import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { useBuildStore } from '../stores/buildStore';
import { useFarmStore } from '../stores/farmStore';
import { useAnimalStore } from '../stores/animalStore';
import { ClockWidget } from './ClockWidget';
import { performInteract, getContextualAction } from '../systems/actionManager';
import { getRegionAtPosition } from '../data/worldRegions';

/**
 * Isolated LocationBadge: throttled subscription so UIOverlay does NOT re-render on every frame!
 */
const LocationBadge: React.FC = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [region, setRegion] = useState<string>('Village Central Square ⛲');

  useEffect(() => {
    let lastX = 999;
    let lastZ = 999;
    const unsub = useGameStore.subscribe((state) => {
      const x = state.playerPosition[0];
      const z = state.playerPosition[2];
      // Only trigger React state update if moved by at least 0.5 units
      if (Math.hypot(x - lastX, z - lastZ) >= 0.5) {
        lastX = x;
        lastZ = z;
        setCoords([x, z]);
        const reg = getRegionAtPosition(x, z);
        setRegion(`${reg.name} ${reg.badge}`);
      }
    });
    return unsub;
  }, []);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '10px 16px',
        boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <span
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 700,
          color: '#7b9e73',
        }}
      >
        Current Location
      </span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#344e41',
          marginTop: '1px',
        }}
      >
        {region}
      </span>
      <span
        style={{
          fontSize: '10px',
          color: '#8fa382',
          marginTop: '1px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        X: {coords[0].toFixed(1)} | Z: {coords[1].toFixed(1)}
      </span>
    </div>
  );
};

const WalkingBadge: React.FC = React.memo(() => {
  const isMoving = useGameStore((state) => state.isMoving);
  if (!isMoving) return null;
  return (
    <span
      style={{
        fontSize: '11px',
        padding: '3px 8px',
        background: '#a3b18a',
        color: '#fff',
        borderRadius: '8px',
        fontWeight: 600,
      }}
    >
      Walking
    </span>
  );
});

const CoinsBadge: React.FC = React.memo(() => {
  const coins = useInventoryStore((state) => state.coins);
  return (
    <div
      className="action-badge-coins"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #ebd99f',
        borderRadius: '12px',
        padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.2vw, 14px)',
        color: '#9a6700',
        fontSize: 'clamp(11px, 1.1vw, 13px)',
        fontWeight: 800,
        boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        whiteSpace: 'nowrap',
      }}
    >
      <span>🪙</span>
      <span>{coins.toLocaleString()}</span>
    </div>
  );
});

const ContextInteractButton: React.FC = React.memo(() => {
  useFarmStore((state) => state.activeTileId);
  useAnimalStore((state) => state.activeAnimalId);
  const contextAction = getContextualAction();

  return (
    <button
      className="action-btn-interact"
      onClick={() => performInteract()}
      title="Interact [E]"
      style={{
        background: contextAction.canInteract
          ? 'linear-gradient(135deg, #2d6a4f, #40916c)'
          : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        border: contextAction.canInteract
          ? '2px solid #52b788'
          : '1px solid #cbd5c0',
        borderRadius: '12px',
        padding: 'clamp(6px, 1vw, 10px) clamp(10px, 1.3vw, 16px)',
        color: contextAction.canInteract ? '#ffffff' : '#2d4734',
        fontSize: 'clamp(11px, 1.1vw, 13px)',
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: contextAction.canInteract
          ? '0 6px 20px rgba(45, 106, 79, 0.45)'
          : '0 8px 24px rgba(70, 90, 80, 0.12)',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        touchAction: 'manipulation',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!contextAction.canInteract) e.currentTarget.style.background = '#e9f5db';
      }}
      onMouseLeave={(e) => {
        if (!contextAction.canInteract) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
      }}
    >
      <span style={{ fontSize: '15px' }}>{contextAction.icon}</span>
      <span className="action-btn-text">
        {contextAction.label}
        <span className="keyboard-shortcut-hint"> [E]</span>
      </span>
    </button>
  );
});

export const UIOverlay: React.FC = React.memo(() => {
  const resetToSpawn = useGameStore((state) => state.resetToSpawn);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'calc(14px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'calc(16px + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(16px + env(safe-area-inset-right, 0px))',
        boxSizing: 'border-box',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            padding: '14px 20px',
            boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 800,
              color: '#344e41',
              letterSpacing: '-0.02em',
            }}
          >
            Little Valley
          </h1>
          <p
            style={{
              margin: '3px 0 0 0',
              fontSize: '12px',
              fontWeight: 500,
              color: '#588157',
            }}
          >
            Cozy 3D Low-Poly World
          </p>
        </div>

        {/* Top-Right: Game Clock & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {/* Game Clock Widget */}
          <ClockWidget />

          {/* Region & Location Badge */}
          <LocationBadge />
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {/* Controls Info (Desktop Only) */}
        <div
          className="desktop-controls-hint"
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            padding: '10px 16px',
            boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '4px' }}>
            {['W', 'A', 'S', 'D'].map((key) => (
              <span
                key={key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  background: '#f0f3ed',
                  color: '#344e41',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  boxShadow: '0 2px 0 #cbd5c0',
                }}
              >
                {key}
              </span>
            ))}
          </div>
          <span style={{ fontSize: '13px', color: '#588157', fontWeight: 600 }}>
            to move • 🖱️ <strong style={{ color: '#344e41' }}>Drag</strong> Orbit 360° • <strong style={{ color: '#344e41' }}>Scroll</strong> Zoom • <strong style={{ color: '#344e41' }}>[E]</strong> Interact • <strong style={{ color: '#344e41' }}>[1-9]</strong> Hotbar • <strong style={{ color: '#344e41' }}>[I]</strong> Bag • <strong style={{ color: '#344e41' }}>[B]</strong> Build
          </span>
          <WalkingBadge />
        </div>

        {/* Action Buttons: Unified Interact, Coins, Build, Backpack & Reset */}
        <div
          className="action-buttons-group"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 0.8vw, 8px)',
            pointerEvents: 'auto',
          }}
        >
          {/* Primary Unified Interact Button (isolated & memoized) */}
          <ContextInteractButton />

          {/* Coins Badge (isolated & memoized) */}
          <CoinsBadge />

          {/* Build Menu Button */}
          <button
            className="action-btn-build"
            onClick={() => useBuildStore.getState().toggleBuildMenu()}
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #b7e4c7',
              borderRadius: '12px',
              padding: 'clamp(6px, 1vw, 10px) clamp(10px, 1.3vw, 16px)',
              color: '#1b4332',
              fontSize: 'clamp(11px, 1.1vw, 13px)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              touchAction: 'manipulation',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d8f3dc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
            }}
          >
            <span>🔨</span>
            <span className="action-btn-text">
              Build<span className="keyboard-shortcut-hint"> [B]</span>
            </span>
          </button>

          {/* Backpack Button */}
          <button
            className="action-btn-backpack"
            onClick={() => useInventoryStore.getState().toggleInventory()}
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #cbd5c0',
              borderRadius: '12px',
              padding: 'clamp(6px, 1vw, 10px) clamp(10px, 1.3vw, 16px)',
              color: '#2d4734',
              fontSize: 'clamp(11px, 1.1vw, 13px)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              touchAction: 'manipulation',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e9f5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
            }}
          >
            <span>🎒</span>
            <span className="action-btn-text">
              Backpack<span className="keyboard-shortcut-hint"> [I]</span>
            </span>
          </button>

          {/* Reset Button */}
          <button
            className="action-btn-reset"
            onClick={resetToSpawn}
            title="Reset position to spawn"
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              borderRadius: '12px',
              padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.2vw, 14px)',
              color: '#344e41',
              fontSize: 'clamp(11px, 1.1vw, 13px)',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e9f5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.88)';
            }}
          >
            <span>↺</span>
            <span className="action-btn-text">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
});
