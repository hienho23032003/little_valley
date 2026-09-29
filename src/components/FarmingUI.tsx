import React from 'react';
import { useFarmStore } from '../stores/farmStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { CROPS } from '../data/cropData';

export const FarmingUI: React.FC = React.memo(() => {
  const activeTile = useFarmStore((state) =>
    state.activeTileId ? state.tiles.find((t) => t.id === state.activeTileId) : null
  );
  const selectedSeed = useFarmStore((state) => state.selectedSeed);
  const notifications = useFarmStore((state) => state.notifications);

  const heldItem = useInventoryStore((state) => state.getSelectedItem());
  const getItemCount = useInventoryStore((state) => state.getItemCount);

  // Determine current active seed (either held seed or fallback selectedSeed)
  const isHeldSeed = heldItem?.category === 'Seed' && heldItem.cropType;
  const activeCropType = isHeldSeed ? heldItem.cropType! : selectedSeed;
  const currentCropDef = CROPS[activeCropType];
  const seedStock = getItemCount(currentCropDef.seedItem);

  // Context Action text calculation
  let promptText = '';
  let promptSubtext = '';
  let promptBadge = '';

  if (activeTile) {
    switch (activeTile.state) {
      case 'EMPTY':
        promptText = 'Plow Soil';
        promptSubtext = 'Prepare tile for planting crops';
        promptBadge = '⛏️';
        break;
      case 'PLOWED': {
        promptText = `Plant ${currentCropDef.name}`;
        promptSubtext = `${seedStock} seeds in inventory • Keys 1-9 to select item`;
        promptBadge = currentCropDef.icon;
        break;
      }
      case 'PLANTED':
      case 'GROWING': {
        const crop = activeTile.crop;
        if (crop) {
          const cropDef = CROPS[crop.cropType];
          const pct = Math.floor(crop.growthProgress * 100);
          if (!crop.wateredToday) {
            promptText = `Water ${cropDef.name}`;
            promptSubtext = `Unwatered grows slower (${pct}% grown) • Press [E] or [Q] to water`;
            promptBadge = '💧';
          } else {
            promptText = `${cropDef.name} Growing...`;
            promptSubtext = `${pct}% ready • 💧 Watered & growing at normal speed`;
            promptBadge = '🌱';
          }
        }
        break;
      }
      case 'READY': {
        const crop = activeTile.crop;
        if (crop) {
          const cropDef = CROPS[crop.cropType];
          promptText = `Harvest ${cropDef.name}!`;
          promptSubtext = `Press [E] to harvest into inventory`;
          promptBadge = '✨';
        }
        break;
      }
    }
  }

  return (
    <>
      {/* 1. Context Action Prompt (Centered above bottom hotbar when near a tile) */}
      {activeTile && (
        <div
          className="desktop-keyboard-popover"
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
              border: '2px solid #a3b18a',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            {/* Key Action Icon Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                background: '#588157',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 800,
                boxShadow: '0 3px 0 #344e41',
              }}
            >
              E
            </div>

            <div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#344e41',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{promptBadge}</span>
                <span>{promptText}</span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#588157',
                  marginTop: '2px',
                }}
              >
                {promptSubtext}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Harvest Notifications ("+1 Wheat") */}
      <div
        style={{
          position: 'absolute',
          top: '180px',
          right: '24px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          zIndex: 50,
        }}
      >
        {notifications.map((notif) => (
          <div
            key={notif.id}
            style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(10px)',
              borderRadius: '14px',
              padding: '10px 18px',
              boxShadow: '0 8px 24px rgba(44, 62, 53, 0.2)',
              border: '2px solid #588157',
              color: notif.color || '#344e41',
              fontSize: '15px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'floatUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            }}
          >
            {notif.icon && <span style={{ fontSize: '18px' }}>{notif.icon}</span>}
            <span>{notif.text}</span>
          </div>
        ))}
      </div>
    </>
  );
});
