import React, { useState, useEffect } from 'react';
import { useInventoryStore, HOTBAR_SLOTS_COUNT, TOTAL_SLOTS } from '../stores/inventoryStore';
import { getItemDefinition, ItemDefinition, ItemCategory } from '../data/itemData';

export const InventoryModal: React.FC = () => {
  const isInventoryOpen = useInventoryStore((state) => state.isInventoryOpen);
  const toggleInventory = useInventoryStore((state) => state.toggleInventory);
  const setInventoryOpen = useInventoryStore((state) => state.setInventoryOpen);
  const slots = useInventoryStore((state) => state.slots);
  const addItem = useInventoryStore((state) => state.addItem);
  const removeItem = useInventoryStore((state) => state.removeItem);
  const clearSlot = useInventoryStore((state) => state.clearSlot);

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'All'>('All');

  // Key listener for 'KeyI' and 'Escape' to toggle/close inventory
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.code === 'KeyI') {
        toggleInventory();
      } else if (e.code === 'Escape' && isInventoryOpen) {
        setInventoryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInventoryOpen, toggleInventory, setInventoryOpen]);

  if (!isInventoryOpen) return null;

  const selectedSlot = selectedSlotIndex !== null ? slots[selectedSlotIndex] : null;
  const selectedItemDef = selectedSlot?.itemId ? getItemDefinition(selectedSlot.itemId) : null;

  // Filter slots if a category filter is active
  const filteredSlots = slots.filter((slot) => {
    if (filterCategory === 'All') return true;
    if (!slot.itemId) return true;
    const def = getItemDefinition(slot.itemId);
    return def?.category === filterCategory;
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(30, 41, 35, 0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'auto',
        animation: 'fadeInUp 0.15s ease-out',
      }}
      onClick={() => setInventoryOpen(false)}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '760px',
          maxWidth: '94vw',
          maxHeight: 'min(90vh, calc(var(--app-height, 100dvh) - 32px))',
          background: 'rgba(253, 251, 247, 0.98)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(25, 40, 30, 0.28)',
          border: '2px solid #cbd5c0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '20px 24px',
            background: '#e9f1e4',
            borderBottom: '1px solid #d4dec9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🎒</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#2d4734' }}>
                Backpack & Inventory
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#588157', fontWeight: 600 }}>
                {slots.filter((s) => s.itemId !== null).length} of {TOTAL_SLOTS} slots occupied
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setInventoryOpen(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #cbd5c0',
              fontSize: '18px',
              fontWeight: 800,
              color: '#344e41',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
          >
            ✕
          </button>
        </div>

        {/* Category Filters Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: '#f6f9f3',
            borderBottom: '1px solid #e3ebe0',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {(['All', 'Seed', 'Crop', 'Material', 'Tool', 'AnimalProduct', 'Food', 'Resource'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: filterCategory === cat ? '2px solid #3a5a40' : '1px solid #d4dec9',
                  background: filterCategory === cat ? '#588157' : '#ffffff',
                  color: filterCategory === cat ? '#ffffff' : '#344e41',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Content Body: Left Slots Grid, Right Item Details Panel */}
        <div style={{ display: 'flex', flex: 1, minHeight: '380px', overflow: 'hidden' }}>
          {/* Slots Grid */}
          <div
            style={{
              flex: 1.5,
              padding: '20px 24px',
              overflowY: 'auto',
              borderRight: '1px solid #e3ebe0',
            }}
          >
            {/* Hotbar Section Header */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#718355',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚡ Hotbar Slots (Keys 1-9)</span>
            </div>

            {/* Hotbar 9 Slots Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {filteredSlots.slice(0, HOTBAR_SLOTS_COUNT).map((slot) => {
                const item = slot.itemId ? getItemDefinition(slot.itemId) : null;
                const isSelected = selectedSlotIndex === slot.slotIndex;

                return (
                  <SlotCard
                    key={`slot-${slot.slotIndex}`}
                    slot={slot}
                    item={item}
                    isSelected={isSelected}
                    onClick={() => setSelectedSlotIndex(slot.slotIndex)}
                    hotkey={slot.slotIndex + 1}
                  />
                );
              })}
            </div>

            {/* Backpack Storage Section Header */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#718355',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
              }}
            >
              <span>📦 Storage Bag (Slots 10-24)</span>
            </div>

            {/* Backpack Slots Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
                gap: '8px',
              }}
            >
              {filteredSlots.slice(HOTBAR_SLOTS_COUNT).map((slot) => {
                const item = slot.itemId ? getItemDefinition(slot.itemId) : null;
                const isSelected = selectedSlotIndex === slot.slotIndex;

                return (
                  <SlotCard
                    key={`slot-${slot.slotIndex}`}
                    slot={slot}
                    item={item}
                    isSelected={isSelected}
                    onClick={() => setSelectedSlotIndex(slot.slotIndex)}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Details & Test Actions Panel */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              background: '#fafcf8',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Selected Item Info */}
            {selectedSlot && selectedItemDef ? (
              <div>
                {/* Large Icon Placeholder */}
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '20px',
                    background: '#e9f1e4',
                    border: '2px solid #cbd5c0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '44px',
                    margin: '0 auto 14px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {selectedItemDef.icon}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#2d4734' }}>
                    {selectedItemDef.name}
                  </h3>
                  <div
                    style={{
                      display: 'inline-block',
                      background: '#e0ebd9',
                      color: '#466848',
                      borderRadius: '8px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginTop: '6px',
                    }}
                  >
                    {selectedItemDef.category}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e3ebe0',
                    fontSize: '13px',
                    color: '#526955',
                    lineHeight: '1.4',
                  }}
                >
                  {selectedItemDef.description}
                </div>

                {/* Quantity Stack Info */}
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e3ebe0',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#344e41',
                  }}
                >
                  <span>Stack Quantity:</span>
                  <strong style={{ color: '#2d4734' }}>
                    {selectedSlot.quantity} / {selectedItemDef.maxStack}
                  </strong>
                </div>

                {/* Item Testing Actions */}
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => addItem(selectedItemDef.id, 1)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      background: '#588157',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +1 Add
                  </button>
                  <button
                    onClick={() => removeItem(selectedItemDef.id, 1)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      background: '#f4a261',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    -1 Remove
                  </button>
                  <button
                    onClick={() => clearSlot(selectedSlot.slotIndex)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: '#e76f51',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#8fa382',
                  textAlign: 'center',
                  padding: '20px',
                }}
              >
                <span style={{ fontSize: '36px', marginBottom: '8px' }}>📦</span>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>
                  Select an item slot to view details, stack count, or test adding/removing items.
                </p>
              </div>
            )}

            {/* Quick Test Add Item Palette */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid #e3ebe0',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#718355',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                🛠️ Quick Test Item Spawner
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  onClick={() => addItem('wood', 5)}
                  style={testButtonStyle}
                >
                  🪵 +5 Wood
                </button>
                <button
                  onClick={() => addItem('stone', 5)}
                  style={testButtonStyle}
                >
                  🪨 +5 Stone
                </button>
                <button
                  onClick={() => addItem('wheat', 5)}
                  style={testButtonStyle}
                >
                  🌾 +5 Wheat
                </button>
                <button
                  onClick={() => addItem('milk', 2)}
                  style={testButtonStyle}
                >
                  🥛 +2 Milk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const testButtonStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: '8px',
  border: '1px solid #cbd5c0',
  background: '#ffffff',
  fontSize: '11px',
  fontWeight: 700,
  color: '#344e41',
  cursor: 'pointer',
  textAlign: 'center',
};

interface SlotCardProps {
  slot: { slotIndex: number; itemId: string | null; quantity: number };
  item: ItemDefinition | null | undefined;
  isSelected: boolean;
  onClick: () => void;
  hotkey?: number;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, item, isSelected, onClick, hotkey }) => {
  return (
    <div
      onClick={onClick}
      style={{
        height: '68px',
        background: isSelected ? '#e9f2e3' : '#ffffff',
        border: isSelected ? '2px solid #588157' : '1px solid #d4dec9',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: isSelected
          ? '0 4px 12px rgba(88, 129, 87, 0.2)'
          : '0 2px 4px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.1s ease',
      }}
    >
      {/* Hotkey Number Badge */}
      {hotkey !== undefined && (
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: '4px',
            fontSize: '9px',
            fontWeight: 800,
            color: '#8fa382',
          }}
        >
          {hotkey}
        </span>
      )}

      {/* Item Icon Placeholder */}
      {item ? (
        <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.icon}</span>
      ) : (
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.03)',
          }}
        />
      )}

      {/* Item Quantity Stack (e.g. Wheat x 15) */}
      {slot.quantity > 0 && (
        <span
          style={{
            position: 'absolute',
            bottom: '3px',
            right: '4px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#2d4734',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '5px',
            padding: '0 4px',
          }}
        >
          {slot.quantity}
        </span>
      )}
    </div>
  );
};
