import React from 'react';
import { useAnimalStore } from '../stores/animalStore';

export const AnimalUI: React.FC = React.memo(() => {
  const activeAnimal = useAnimalStore((state) =>
    state.activeAnimalId ? state.animals.find((a) => a.id === state.activeAnimalId) : null
  );

  if (!activeAnimal) return null;

  let productPrompt = '';
  let productIcon = '';
  let feedItemName = 'Lúa mì';

  if (activeAnimal.species === 'chicken') {
    productPrompt = 'Thu hoạch trứng';
    productIcon = '🥚';
    feedItemName = 'Hạt lúa mì';
  } else if (activeAnimal.species === 'cow') {
    productPrompt = 'Vắt sữa tươi';
    productIcon = '🥛';
    feedItemName = 'Lúa mì';
  } else if (activeAnimal.species === 'sheep') {
    productPrompt = 'Xén lông cừu';
    productIcon = '🧶';
    feedItemName = 'Lúa mì';
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(clamp(96px, 12vh, 120px) + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 35,
        animation: 'fadeInUp 0.15s ease-out',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <div
        style={{
          background: 'url("/ui/cozy/ui_components/panels/cozy_panel_detail__1000x300.png") no-repeat center / 100% 100%',
          backgroundColor: 'transparent',
          borderRadius: 0,
          padding: '24px 36px',
          filter: 'drop-shadow(0 16px 36px rgba(70, 40, 15, 0.45))',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '300px',
        }}
      >
        {/* Header: Name, Species, and Age */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>
              {activeAnimal.species === 'chicken' ? '🐔' : activeAnimal.species === 'cow' ? '🐄' : '🐑'}
            </span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#4a2810' }}>
              {activeAnimal.name}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#8b5e34', fontWeight: 800 }}>
            {activeAnimal.species.toUpperCase()} • Ngày {activeAnimal.age}
          </span>
        </div>

        {/* Meters: Hunger & Happiness */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '11px', fontWeight: 800 }}>
          {/* Hunger Bar */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#588157', marginBottom: '3px' }}>
              <span>Độ no:</span>
              <span>{Math.round(activeAnimal.hunger)}%</span>
            </div>
            <div style={{ width: '100%', height: '7px', background: 'rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${activeAnimal.hunger}%`,
                  height: '100%',
                  background: activeAnimal.hunger > 30 ? 'linear-gradient(90deg, #52b788, #40916c)' : '#e76f51',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>

          {/* Happiness Bar */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e63946', marginBottom: '3px' }}>
              <span>Thân thiết:</span>
              <span>{Math.round(activeAnimal.happiness)}%</span>
            </div>
            <div style={{ width: '100%', height: '7px', background: 'rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${activeAnimal.happiness}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff758f, #e63946)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Prompts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          {activeAnimal.isProductReady ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'url("/ui/cozy/ui_components/buttons/cozy_button_primary_normal__353x76.png") no-repeat center / 100% 100%',
                padding: '8px 16px',
                border: 'none',
                width: '100%',
                justifyContent: 'center',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
            >
              <span
                style={{
                  background: 'rgba(74, 40, 16, 0.4)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 900,
                }}
              >
                E
              </span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#5a3407', textShadow: '0 1px 2px rgba(255,255,255,0.7)' }}>
                {productIcon} {productPrompt}!
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              {/* Feed Prompt */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'url("/ui/cozy/ui_components/buttons/cozy_button_secondary_normal__356x77.png") no-repeat center / 100% 100%',
                  padding: '7px 12px',
                  border: 'none',
                  fontSize: '11px',
                  color: '#ffffff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              >
                <span
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    color: '#fff',
                    borderRadius: '5px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 900,
                  }}
                >
                  F / E
                </span>
                <span style={{ fontWeight: 800 }}>Cho ăn {feedItemName}</span>
              </div>

              {/* Pet Prompt */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'url("/ui/cozy/ui_components/buttons/cozy_button_secondary_normal__356x77.png") no-repeat center / 100% 100%',
                  padding: '7px 12px',
                  border: 'none',
                  fontSize: '11px',
                  color: '#ffffff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              >
                <span
                  style={{
                    background: 'rgba(230, 57, 70, 0.7)',
                    color: '#fff',
                    borderRadius: '5px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 900,
                  }}
                >
                  P
                </span>
                <span style={{ fontWeight: 800 }}>Vuốt ve ❤️</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
