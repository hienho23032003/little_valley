import React from 'react';
import { useAnimalStore } from '../stores/animalStore';

export const AnimalUI: React.FC = React.memo(() => {
  const activeAnimal = useAnimalStore((state) =>
    state.activeAnimalId ? state.animals.find((a) => a.id === state.activeAnimalId) : null
  );

  if (!activeAnimal) return null;

  let productPrompt = '';
  let productIcon = '';
  let feedItemName = 'Wheat';

  if (activeAnimal.species === 'chicken') {
    productPrompt = 'Collect Egg';
    productIcon = '🥚';
    feedItemName = 'Wheat Seeds';
  } else if (activeAnimal.species === 'cow') {
    productPrompt = 'Milk Cow';
    productIcon = '🥛';
    feedItemName = 'Wheat';
  } else if (activeAnimal.species === 'sheep') {
    productPrompt = 'Shear Wool';
    productIcon = '🧶';
    feedItemName = 'Wheat';
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
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '12px 24px',
          boxShadow: '0 12px 32px rgba(44, 62, 53, 0.18)',
          border: '2px solid #52b788',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '260px',
        }}
      >
        {/* Header: Name, Species, and Age */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>
              {activeAnimal.species === 'chicken' ? '🐔' : activeAnimal.species === 'cow' ? '🐄' : '🐑'}
            </span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#2d4734' }}>
              {activeAnimal.name}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#718355', fontWeight: 700 }}>
            {activeAnimal.species.toUpperCase()} • Day {activeAnimal.age}
          </span>
        </div>

        {/* Meters: Hunger & Happiness */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700 }}>
          {/* Hunger Bar */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#588157', marginBottom: '2px' }}>
              <span>Hunger:</span>
              <span>{Math.round(activeAnimal.hunger)}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${activeAnimal.hunger}%`,
                  height: '100%',
                  background: activeAnimal.hunger > 30 ? '#52b788' : '#e76f51',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>

          {/* Happiness Bar */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e63946', marginBottom: '2px' }}>
              <span>Happiness:</span>
              <span>{Math.round(activeAnimal.happiness)}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${activeAnimal.happiness}%`,
                  height: '100%',
                  background: '#ff758f',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Prompts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
          {activeAnimal.isProductReady ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#e9f5db',
                padding: '4px 10px',
                borderRadius: '10px',
                border: '1px solid #718355',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  background: '#2d4734',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: 800,
                }}
              >
                E
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#2d4734' }}>
                {productIcon} {productPrompt}!
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
              {/* Feed Prompt */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f8f9fa',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  fontSize: '11px',
                  color: '#344e41',
                }}
              >
                <span
                  className="keyboard-shortcut-hint"
                  style={{
                    background: '#588157',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    fontSize: '10px',
                    fontWeight: 800,
                  }}
                >
                  F / E
                </span>
                <span style={{ fontWeight: 700 }}>Feed {feedItemName}</span>
              </div>

              {/* Pet Prompt */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fff0f3',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid #ffccd5',
                  fontSize: '11px',
                  color: '#c9184a',
                }}
              >
                <span
                  className="keyboard-shortcut-hint"
                  style={{
                    background: '#e63946',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    fontSize: '10px',
                    fontWeight: 800,
                  }}
                >
                  P
                </span>
                <span style={{ fontWeight: 700 }}>Pet ❤️</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
