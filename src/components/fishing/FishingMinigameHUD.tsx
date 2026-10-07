import React, { useEffect, useCallback } from 'react';
import { useFishingStore } from '../../stores/fishingStore';
import { useGameStore } from '../../stores/gameStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import { CozyButton } from '../ui/CozyUIComponents';

export const FishingMinigameHUD: React.FC = React.memo(() => {
  const phase = useFishingStore((state) => state.phase);
  const castPower = useFishingStore((state) => state.castPower);
  const targetFish = useFishingStore((state) => state.targetFish);
  const barPos = useFishingStore((state) => state.barPos);
  const barHeight = useFishingStore((state) => state.barHeight);
  const fishPos = useFishingStore((state) => state.fishPos);
  const catchProgress = useFishingStore((state) => state.catchProgress);
  const biteReactionWindow = useFishingStore((state) => state.biteReactionWindow);
  const notification = useFishingStore((state) => state.notification);

  const startCharging = useFishingStore((state) => state.startCharging);
  const releaseCast = useFishingStore((state) => state.releaseCast);
  const hookBite = useFishingStore((state) => state.hookBite);
  const pressReel = useFishingStore((state) => state.pressReel);
  const cancelFishing = useFishingStore((state) => state.cancelFishing);

  // Cast trigger handler
  const handlePerformCast = useCallback(() => {
    const pPos = useGameStore.getState().playerPosition;
    const pRot = (useGameStore.getState() as { playerRotation?: number }).playerRotation || 0;
    releaseCast(pPos, pRot);
  }, [releaseCast]);

  // Keyboard handlers for Fishing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.code === 'Space' || e.key === ' ') {
        const curPhase = useFishingStore.getState().phase;
        if (curPhase === 'idle') {
          // Check if player has fishing rod selected
          const inv = useInventoryStore.getState();
          const item = inv.getSelectedItem();
          if (item && item.id.startsWith('fishing_rod')) {
            e.preventDefault();
            startCharging();
          }
        } else if (curPhase === 'biting') {
          e.preventDefault();
          hookBite();
        } else if (curPhase === 'minigame') {
          e.preventDefault();
          pressReel(true);
        }
      }

      if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') {
        const curPhase = useFishingStore.getState().phase;
        if (curPhase === 'biting') {
          e.preventDefault();
          hookBite();
        }
      }

      if (e.code === 'Escape') {
        const curPhase = useFishingStore.getState().phase;
        if (curPhase !== 'idle' && curPhase !== 'celebration') {
          e.preventDefault();
          cancelFishing();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.code === 'Space' || e.key === ' ') {
        const curPhase = useFishingStore.getState().phase;
        if (curPhase === 'charging') {
          e.preventDefault();
          handlePerformCast();
        } else if (curPhase === 'minigame') {
          e.preventDefault();
          pressReel(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startCharging, handlePerformCast, hookBite, pressReel, cancelFishing]);

  // Is fish currently inside the reel bar?
  const isInside = fishPos >= barPos && fishPos <= barPos + barHeight;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* 1. POWER CHARGING METER (When charging cast) */}
      {phase === 'charging' && (
        <div
          style={{
            position: 'absolute',
            bottom: '124px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(30, 41, 59, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1.5px solid #fbbf24',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            }}
          >
            🎣 Thả chuột / [Space] để Quăng mồi ({Math.round(castPower * 100)}%)
          </div>

          {/* Oscillating Cozy Power Bar */}
          <div
            style={{
              width: '280px',
              height: '32px',
              background: 'url("/ui/cozy/ui_components/bars/cozy_bar_frame_parchment__721x80.png") center / 100% 100% no-repeat',
              padding: '4px 6px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.max(4, Math.min(100, castPower * 100))}%`,
                background: 'url("/ui/cozy/ui_components/bars/cozy_bar_fill_lime__702x61.png") center / cover no-repeat',
                borderRadius: '8px',
                transition: 'width 0.04s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* 2. WAITING / NIBBLE STATUS BANNER */}
      {(phase === 'waiting' || phase === 'nibble') && (
        <div
          style={{
            position: 'absolute',
            bottom: '124px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(248, 236, 218, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            padding: '8px 18px',
            border: '2px solid #ddb892',
            boxShadow: '0 8px 24px rgba(70, 90, 80, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: '18px' }}>{phase === 'nibble' ? '🐟' : '🌊'}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#344e41' }}>
            {phase === 'nibble'
              ? 'Cá đang rỉa mồi... Chuẩn bị giật cần!'
              : 'Đang câu cá... Quan sát phao câu!'}
          </span>
          <button
            onClick={() => cancelFishing()}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #ef4444',
              color: '#b91c1c',
              borderRadius: '8px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Thu cần [ESC]
          </button>
        </div>
      )}

      {/* 3. BITING ALERT BANNER (High Urgency Strike!) */}
      {phase === 'biting' && (
        <div
          onClick={() => hookBite()}
          style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
            cursor: 'pointer',
            animation: 'pulse 0.4s infinite alternate',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              border: '3px solid #fef08a',
              borderRadius: '24px',
              padding: '16px 36px',
              boxShadow: '0 12px 36px rgba(239, 68, 68, 0.6), 0 0 20px rgba(254, 240, 138, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <span style={{ fontSize: '32px' }}>❗</span>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#ffffff',
                  textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  letterSpacing: '0.04em',
                }}
              >
                CÁ CẮN CÂU!
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fef08a', marginTop: '2px' }}>
                BẤM [SPACE], [E] HOẶC BẤM ĐÂY NGAY!
              </div>
            </div>
            <span style={{ fontSize: '32px' }}>🎣</span>
          </div>

          {/* Reaction Timer Countdown */}
          <div
            style={{
              width: '200px',
              height: '8px',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.max(0, (biteReactionWindow / 1.85) * 100)}%`,
                background: '#facc15',
                transition: 'width 0.05s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* 4. REEL-IN TENSION MINIGAME (Stardew Valley Style) */}
      {phase === 'minigame' && targetFish && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 'clamp(20px, 4vw, 60px)',
            transform: 'translateY(-50%)',
            width: '240px',
            background: 'url("/ui/cozy/ui_components/panels/cozy_panel_parchment_detail_plain__1155x1263.png") center / 100% 100% no-repeat',
            padding: '24px 20px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.35))',
            pointerEvents: 'auto',
          }}
        >
          {/* Header with target fish name and difficulty */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#4a2810',
                textShadow: '0 1px 1px rgba(255,255,255,0.8)',
              }}
            >
              {targetFish.icon} {targetFish.name}
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: targetFish.rarityColor,
                marginTop: '1px',
              }}
            >
              Độ khó: {targetFish.difficulty}/10 • {targetFish.rarity.toUpperCase()}
            </div>
          </div>

          {/* Main Minigame Columns (Tension Bar + Progress Meter) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '4px 0' }}>
            {/* Water Column (Catch Tube) */}
            <div
              style={{
                position: 'relative',
                width: '64px',
                height: '240px',
                background: 'linear-gradient(to top, #1e3a8a 0%, #0284c7 60%, #38bdf8 100%)',
                borderRadius: '16px',
                border: '3px solid #8b5e34',
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}
            >
              {/* Subtle bubble particle lines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage: 'radial-gradient(#fff 15%, transparent 20%)',
                  backgroundSize: '12px 12px',
                }}
              />

              {/* Player Catch Green Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: '4px',
                  right: '4px',
                  bottom: `${barPos * 100}%`,
                  height: `${barHeight * 100}%`,
                  background: 'url("/ui/cozy/ui_components/bars/cozy_bar_fill_lime__702x61.png") center / cover no-repeat',
                  borderRadius: '10px',
                  border: isInside ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.6)',
                  boxShadow: isInside
                    ? '0 0 16px rgba(132, 204, 22, 0.9), inset 0 0 8px rgba(255,255,255,0.8)'
                    : 'none',
                  transition: 'border 0.1s ease, box-shadow 0.1s ease',
                }}
              />

              {/* Swimming Fish Icon */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: `${fishPos * 100}%`,
                  transform: 'translate(-50%, 50%)',
                  fontSize: '24px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {targetFish.icon || '🐟'}
              </div>
            </div>

            {/* Catch Progress Meter */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '13px' }}>🪝</span>
              <div
                style={{
                  position: 'relative',
                  width: '18px',
                  height: '220px',
                  background: 'rgba(74, 40, 16, 0.25)',
                  borderRadius: '10px',
                  border: '2px solid #8b5e34',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(2, Math.min(100, catchProgress * 100))}%`,
                    background:
                      catchProgress > 0.75
                        ? 'linear-gradient(to top, #16a34a, #22c55e)'
                        : catchProgress > 0.35
                        ? 'linear-gradient(to top, #eab308, #facc15)'
                        : 'linear-gradient(to top, #dc2626, #ef4444)',
                    borderRadius: '8px',
                    transition: 'height 0.05s linear',
                    boxShadow: '0 0 8px rgba(250, 204, 21, 0.6)',
                  }}
                />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#5a3407' }}>
                {Math.round(catchProgress * 100)}%
              </span>
            </div>
          </div>

          {/* Interactive Reeling Button (Supports Mouse, Touch & Space) */}
          <CozyButton
            variant="primary"
            onMouseDown={() => pressReel(true)}
            onMouseUp={() => pressReel(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              pressReel(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              pressReel(false);
            }}
            style={{ width: '100%', height: '46px', fontSize: '14px' }}
          >
            <span>🎣 GIỮ ĐỂ CUỘN DÂY</span>
          </CozyButton>

          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#854d0e',
              textAlign: 'center',
            }}
          >
            Nhấn giữ [Space] hoặc phím trên để giữ cá trong thanh xanh!
          </div>
        </div>
      )}

      {/* 5. BRIEF NOTIFICATION TOAST (e.g. Escaped) */}
      {notification && phase === 'escaped' && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239, 68, 68, 0.95)',
            border: '2px solid #fecaca',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 800,
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
            pointerEvents: 'auto',
          }}
        >
          {notification}
        </div>
      )}
    </div>
  );
});
