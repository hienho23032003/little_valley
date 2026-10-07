import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { useBuildStore } from '../stores/buildStore';
import { useFarmStore } from '../stores/farmStore';
import { useAnimalStore } from '../stores/animalStore';
import { ClockWidget } from './ClockWidget';
import { performInteract, getContextualAction } from '../systems/actionManager';
import { getRegionAtPosition } from '../data/worldRegions';
import { useCharacterStore } from '../stores/characterStore';
import { CHARACTERS } from '../data/characterData';
import { CozyButton } from './ui/CozyUIComponents';

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
        background: 'rgba(248, 236, 218, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '18px',
        padding: '10px 18px',
        boxShadow: '0 8px 24px rgba(100, 60, 20, 0.16)',
        border: '2px solid #ddb892',
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
          fontWeight: 800,
          color: '#8b5e34',
        }}
      >
        Vị trí hiện tại
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

const PlayerProfileBadge: React.FC = React.memo(() => {
  const selectedCharacterId = useCharacterStore((state) => state.selectedCharacterId);
  const playerName = useCharacterStore((state) => state.playerName);
  const farmName = useCharacterStore((state) => state.farmName);
  const openCharacterModal = useCharacterStore((state) => state.openCharacterModal);
  const hero = CHARACTERS[selectedCharacterId] || CHARACTERS.knight;

  return (
    <button
      onClick={() => openCharacterModal()}
      title="Đổi nhân vật & trang phục [C]"
      style={{
        pointerEvents: 'auto',
        background: 'rgba(248, 236, 218, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '8px 14px',
        boxShadow: '0 8px 24px rgba(70, 90, 80, 0.12)',
        border: '1.5px solid #fed7aa',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '8px',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '2px solid #3b82f6',
          overflow: 'hidden',
          background: '#eff6ff',
          flexShrink: 0,
        }}
      >
        <img
          src={hero.avatar}
          alt={hero.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.3) translateY(2px)' }}
        />
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
          {playerName} • {hero.name}
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#854d0e' }}>
          {farmName || 'Nông trại Mây Hồng'} ✏️
        </div>
      </div>
    </button>
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;
      if (e.code === 'KeyC') {
        const store = useCharacterStore.getState();
        if (store.showCharacterModal) {
          store.closeCharacterModal();
        } else {
          store.openCharacterModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

          {/* Active Hero Profile Badge */}
          <PlayerProfileBadge />
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
          <div style={{ display: 'flex', gap: '3px' }}>
            {['W', 'A', 'S', 'D'].map((key) => (
              <span
                key={key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  background: '#f0f3ed',
                  color: '#344e41',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 700,
                  boxShadow: '0 2px 0 #cbd5c0',
                }}
              >
                {key}
              </span>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: '#588157', fontWeight: 600 }}>
            Di chuyển • 🖱️ Xoay 360° • Zoom • <strong style={{ color: '#344e41' }}>[E]</strong> Tương tác
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

          {/* Build Menu Button (Cozy Wood Image Button) */}
          <CozyButton
            variant="secondary"
            onClick={() => useBuildStore.getState().toggleBuildMenu()}
            style={{ minWidth: 'auto', height: '44px', padding: '0 16px', fontSize: '13px' }}
          >
            <span>🔨</span>
            <span>Xây dựng [B]</span>
          </CozyButton>

          {/* Backpack Button (Cozy Wood Image Button) */}
          <CozyButton
            variant="secondary"
            onClick={() => useInventoryStore.getState().toggleInventory()}
            style={{ minWidth: 'auto', height: '44px', padding: '0 16px', fontSize: '13px' }}
          >
            <span>🎒</span>
            <span>Ba lô [I]</span>
          </CozyButton>

          {/* Character Customization Button (Cozy Wood Image Button) */}
          <CozyButton
            variant="secondary"
            onClick={() => useCharacterStore.getState().openCharacterModal()}
            style={{ minWidth: 'auto', height: '44px', padding: '0 16px', fontSize: '13px' }}
          >
            <span>👤</span>
            <span>Nhân vật [C]</span>
          </CozyButton>

          {/* Reset Button (Cozy Wood Image Button) */}
          <CozyButton
            variant="secondary"
            onClick={resetToSpawn}
            style={{ minWidth: 'auto', height: '44px', padding: '0 14px', fontSize: '13px' }}
          >
            <span>↺ Reset</span>
          </CozyButton>
        </div>
      </div>
    </div>
  );
});

