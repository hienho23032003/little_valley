import React, { useEffect } from 'react';
import { useInventoryStore, HOTBAR_SLOTS_COUNT } from '../stores/inventoryStore';
import { getItemDefinition } from '../data/itemData';
import { useFarmStore } from '../stores/farmStore';

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
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'auto',
        zIndex: 40,
        maxWidth: 'calc(100vw - 20px)',
      }}
    >
      {/* Selected Item Name Label */}
      {currentItem && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '4px 14px',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            fontWeight: 800,
            color: '#344e41',
            boxShadow: '0 4px 12px rgba(44, 62, 53, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            animation: 'fadeInUp 0.12s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{currentItem.icon}</span>
          <span>{currentItem.name}</span>
          <span style={{ fontSize: '10px', color: '#718355', fontWeight: 600 }}>
            [{currentItem.category}]
          </span>
        </div>
      )}

      {/* 9 Hotbar Slots Grid with Safe-Area & Touch Scaling */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(4px, 0.6vw, 6px)',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          padding: 'clamp(5px, 0.7vw, 8px)',
          borderRadius: 'clamp(14px, 1.8vw, 18px)',
          boxShadow: '0 10px 30px rgba(44, 62, 53, 0.16)',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          maxWidth: 'calc(100vw - 24px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
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
                width: 'clamp(42px, 5.2vw, 54px)',
                height: 'clamp(42px, 5.2vw, 54px)',
                minWidth: 'clamp(42px, 5.2vw, 54px)',
                background: isSelected ? '#588157' : '#f4f7f0',
                border: isSelected ? '2px solid #2d4734' : '1px solid #d4dec9',
                borderRadius: 'clamp(10px, 1.4vw, 14px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.12s cubic-bezier(0.2, 0, 0, 1)',
                transform: isSelected ? 'translateY(-3px) scale(1.04)' : 'none',
                boxShadow: isSelected
                  ? '0 6px 16px rgba(88, 129, 87, 0.35)'
                  : '0 2px 4px rgba(0, 0, 0, 0.04)',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Hotkey Number Badge 1-9 */}
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: '4px',
                  fontSize: 'clamp(8px, 1.1vw, 10px)',
                  fontWeight: 800,
                  color: isSelected ? '#ffffff' : '#7b8f72',
                }}
              >
                {index + 1}
              </span>

              {/* Item Icon Placeholder */}
              {itemDef ? (
                <span
                  style={{
                    fontSize: 'clamp(18px, 2.4vw, 24px)',
                    lineHeight: '1',
                    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
                  }}
                >
                  {itemDef.icon}
                </span>
              ) : (
                <span
                  style={{
                    width: 'clamp(14px, 1.8vw, 18px)',
                    height: 'clamp(14px, 1.8vw, 18px)',
                    borderRadius: '5px',
                    background: 'rgba(0,0,0,0.04)',
                  }}
                />
              )}

              {/* Quantity Stack Badge (e.g. x15) */}
              {slot.quantity > 1 && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '3px',
                    fontSize: 'clamp(9px, 1.2vw, 11px)',
                    fontWeight: 800,
                    color: isSelected ? '#ffffff' : '#344e41',
                    background: isSelected ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
                    borderRadius: '5px',
                    padding: '0 3px',
                    lineHeight: '1.2',
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
