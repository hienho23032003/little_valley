import React, { useEffect } from 'react';
import { useInventoryStore, HOTBAR_SLOTS_COUNT } from '../stores/inventoryStore';
import { getItemDefinition } from '../data/itemData';
import { useFarmStore } from '../stores/farmStore';

const SLOT_FRAME_NORMAL = '/ui/cozy/ui_components/slots_frames/cozy_slot_item_round__134x133.png';
const SLOT_FRAME_SELECTED = '/ui/cozy/ui_components/slots_frames/cozy_slot_item_round_selected__152x151.png';

export const Hotbar: React.FC = React.memo(() => {
  const slots = useInventoryStore((state) => state.slots);
  const selectedHotbarIndex = useInventoryStore((state) => state.selectedHotbarIndex);
  const selectHotbarSlot = useInventoryStore((state) => state.selectHotbarSlot);
  const setSelectedSeed = useFarmStore((state) => state.setSelectedSeed);

  // Number keys 1-9 to select hotbar slots
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.code.startsWith('Digit')) {
        const num = parseInt(e.code.replace('Digit', ''), 10);
        if (num >= 1 && num <= HOTBAR_SLOTS_COUNT) {
          const index = num - 1;
          selectHotbarSlot(index);

          // If the selected slot contains a seed, sync with farmStore
          const selectedSlot = useInventoryStore.getState().slots[index];
          if (selectedSlot?.itemId) {
            const itemDef = getItemDefinition(selectedSlot.itemId);
            if (itemDef?.category === 'Seed' && itemDef.cropType) {
              setSelectedSeed(itemDef.cropType);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectHotbarSlot, setSelectedSeed]);

  const hotbarSlots = slots.slice(0, HOTBAR_SLOTS_COUNT);
  const currentItem = hotbarSlots[selectedHotbarIndex]?.itemId
    ? getItemDefinition(hotbarSlots[selectedHotbarIndex].itemId!)
    : null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'auto',
        zIndex: 40,
        maxWidth: 'calc(100vw - 20px)',
        userSelect: 'none',
      }}
    >
      {/* Selected Item Name Label in Cozy Parchment Style */}
      {currentItem && (
        <div
          style={{
            background: '#fffdf5',
            borderRadius: '14px',
            padding: '5px 16px',
            fontSize: 'clamp(12px, 1.2vw, 14px)',
            fontWeight: 800,
            color: '#78350f',
            boxShadow: '0 6px 16px rgba(120, 53, 15, 0.15)',
            border: '2px solid #fed7aa',
            animation: 'fadeInUp 0.12s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {currentItem.imageIcon ? (
            <img
              src={currentItem.imageIcon}
              alt={currentItem.name}
              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontSize: '16px' }}>{currentItem.icon}</span>
          )}
          <span>{currentItem.name}</span>
          <span
            style={{
              fontSize: '10px',
              color: '#b45309',
              fontWeight: 700,
              background: '#fef3c7',
              padding: '2px 6px',
              borderRadius: '6px',
            }}
          >
            {currentItem.category}
          </span>
        </div>
      )}

      {/* 9 Hotbar Slots with Cozy Free Round Frames */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(3px, 0.5vw, 6px)',
          background: 'rgba(255, 253, 245, 0.94)',
          backdropFilter: 'blur(12px)',
          padding: 'clamp(6px, 0.8vw, 9px)',
          borderRadius: 'clamp(18px, 2.2vw, 24px)',
          boxShadow: '0 12px 32px rgba(120, 53, 15, 0.18)',
          border: '2.5px solid #fed7aa',
          maxWidth: 'calc(100vw - 24px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          alignItems: 'center',
        }}
      >
        {hotbarSlots.map((slot, index) => {
          const isSelected = selectedHotbarIndex === index;
          const itemDef = slot.itemId ? getItemDefinition(slot.itemId) : null;

          return (
            <button
              key={`hotbar-slot-${index}`}
              onClick={() => {
                selectHotbarSlot(index);
                if (itemDef?.category === 'Seed' && itemDef.cropType) {
                  setSelectedSeed(itemDef.cropType);
                }
              }}
              style={{
                width: 'clamp(42px, 4.6vw, 52px)',
                height: 'clamp(42px, 4.6vw, 52px)',
                minWidth: 'clamp(42px, 4.6vw, 52px)',
                background: 'transparent',
                border: 'none',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                transition: 'transform 0.14s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isSelected ? 'translateY(-4px) scale(1.08)' : 'scale(1)',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Cozy Free Round Slot Frame Texture */}
              <img
                src={isSelected ? SLOT_FRAME_SELECTED : SLOT_FRAME_NORMAL}
                alt="Slot frame"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  filter: isSelected ? 'drop-shadow(0 4px 8px rgba(37,99,235,0.4))' : 'none',
                }}
              />

              {/* Hotkey Number Badge 1-9 */}
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '6px',
                  fontSize: 'clamp(9px, 1.1vw, 11px)',
                  fontWeight: 900,
                  color: isSelected ? '#1d4ed8' : '#78350f',
                  zIndex: 2,
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                }}
              >
                {index + 1}
              </span>

              {/* Cozy Item Icon or fallback emoji */}
              {itemDef && (
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '68%',
                    height: '68%',
                  }}
                >
                  {itemDef.imageIcon ? (
                    <img
                      src={itemDef.imageIcon}
                      alt={itemDef.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 'clamp(20px, 2.6vw, 26px)',
                        lineHeight: 1,
                        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
                      }}
                    >
                      {itemDef.icon}
                    </span>
                  )}
                </div>
              )}

              {/* Cozy Free Quantity Badge */}
              {slot.quantity > 1 && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '3px',
                    right: '4px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    fontSize: 'clamp(9px, 1.1vw, 11px)',
                    fontWeight: 900,
                    padding: '1px 5px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
                    border: '1px solid #ffffff',
                    zIndex: 3,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {slot.quantity}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
