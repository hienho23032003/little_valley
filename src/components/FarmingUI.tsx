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
  let promptImg = '';

  if (activeTile) {
    switch (activeTile.state) {
      case 'EMPTY':
        promptText = 'Cuốc xới đất';
        promptSubtext = 'Chuẩn bị ô đất để gieo hạt giống';
        promptBadge = '⛏️';
        break;
      case 'PLOWED': {
        promptText = `Gieo hạt ${currentCropDef.name}`;
        promptSubtext = `Còn ${seedStock} hạt trong túi • Nhấn phím 1-9 để đổi hạt giống`;
        promptBadge = currentCropDef.icon;
        if (activeCropType === 'carrot') promptImg = '/icons/veggies/icon-carrot.png';
        else if (activeCropType === 'tomato') promptImg = '/icons/veggies/icon-tomato.png';
        else if (activeCropType === 'pumpkin') promptImg = '/icons/veggies/icon-pumpkin.png';
        break;
      }
      case 'PLANTED':
      case 'GROWING': {
        const crop = activeTile.crop;
        if (crop) {
          const cropDef = CROPS[crop.cropType];
          const pct = Math.floor(crop.growthProgress * 100);
          if (!crop.wateredToday) {
            promptText = `Tưới nước cho ${cropDef.name}`;
            promptSubtext = `Đang khô hạn (${pct}% tiến độ) • Nhấn [E] hoặc [Q] để tưới`;
            promptImg = '/ui/cozy/icons/cozy_icon_watering_can__87x77.png';
          } else {
            promptText = `${cropDef.name} đang lớn...`;
            promptSubtext = `Đã tưới nước (${pct}% lớn) • Sinh trưởng khỏe mạnh`;
            promptBadge = '🌱';
          }
        }
        break;
      }
      case 'READY': {
        const crop = activeTile.crop;
        if (crop) {
          const cropDef = CROPS[crop.cropType];
          promptText = `Thu hoạch ${cropDef.name}!`;
          promptSubtext = `Nhấn [E] để thu hoạch vào ba lô`;
          promptBadge = '✨';
          if (crop.cropType === 'carrot') promptImg = '/icons/veggies/icon-carrot.png';
          else if (crop.cropType === 'tomato') promptImg = '/icons/veggies/icon-tomato.png';
          else if (crop.cropType === 'pumpkin') promptImg = '/icons/veggies/icon-pumpkin.png';
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
              background: 'url("/ui/cozy/ui_components/panels/cozy_panel_detail__1000x300.png") no-repeat center / 100% 100%',
              backgroundColor: 'transparent',
              borderRadius: 0,
              padding: '20px 36px',
              filter: 'drop-shadow(0 16px 36px rgba(70, 40, 15, 0.45))',
              border: 'none',
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
                width: '44px',
                height: '44px',
                background: 'url("/ui/cozy/ui_components/buttons/cozy_button_primary_normal__353x76.png") no-repeat center / 100% 100%',
                color: '#5a3407',
                borderRadius: 0,
                fontSize: '18px',
                fontWeight: 900,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
                border: 'none',
                textShadow: '0 1px 2px rgba(255,255,255,0.7)',
              }}
            >
              E
            </div>

            <div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#4a2810',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {promptImg ? (
                  <img src={promptImg} alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                ) : (
                  <span>{promptBadge}</span>
                )}
                <span>{promptText}</span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#7f5539',
                  marginTop: '2px',
                }}
              >
                {promptSubtext}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Harvest Notifications with Cozy Free Banner Texture */}
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
              background: 'url("/ui/cozy/ui_components/other_controls/cozy_banner_notification__408x71.png") no-repeat center / 100% 100%',
              minWidth: '220px',
              height: '48px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#4a2810',
              fontSize: '14px',
              fontWeight: 900,
              textShadow: '0 1px 1px rgba(255,255,255,0.8)',
              filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))',
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
