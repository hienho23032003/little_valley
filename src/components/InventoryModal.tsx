import React, { useState, useEffect } from 'react';
import { useInventoryStore, HOTBAR_SLOTS_COUNT, TOTAL_SLOTS } from '../stores/inventoryStore';
import { getItemDefinition, ItemCategory } from '../data/itemData';
import {
  CozyModal,
  CozyRoundSlot,
  CozyTab,
  CozyButton,
} from './ui/CozyUIComponents';

export const InventoryModal: React.FC = () => {
  const isInventoryOpen = useInventoryStore((state) => state.isInventoryOpen);
  const toggleInventory = useInventoryStore((state) => state.toggleInventory);
  const setInventoryOpen = useInventoryStore((state) => state.setInventoryOpen);
  const slots = useInventoryStore((state) => state.slots);
  const addItem = useInventoryStore((state) => state.addItem);
  const removeItem = useInventoryStore((state) => state.removeItem);
  const clearSlot = useInventoryStore((state) => state.clearSlot);
  const coins = useInventoryStore((state) => state.coins);

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

  const categories: (ItemCategory | 'All')[] = [
    'All',
    'Seed',
    'Crop',
    'Material',
    'Tool',
    'Food',
    'Resource',
  ];

  return (
    <CozyModal
      isOpen={isInventoryOpen}
      onClose={() => setInventoryOpen(false)}
      title="Túi đồ & Ba lô (Backpack)"
      subtitle={`${slots.filter((s) => s.itemId !== null).length} / ${TOTAL_SLOTS} ô đang chứa đồ • Phím tắt [I]`}
      icon="/ui/cozy/icons/cozy_icon_seed_bag__87x84.png"
      width="820px"
      maxHeight="90vh"
    >
      {/* Category Tabs & Coin Counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <CozyTab
              key={cat}
              label={cat === 'All' ? 'Tất cả' : cat}
              isActive={filterCategory === cat}
              onClick={() => setFilterCategory(cat)}
            />
          ))}
        </div>

        {/* Coins display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 235, 180, 0.65)',
            border: '2px solid #e0b060',
            borderRadius: '16px',
            padding: '6px 14px',
            fontWeight: 800,
            fontSize: '14px',
            color: '#78450f',
          }}
        >
          <span>🪙</span>
          <span>{coins} Xu</span>
        </div>
      </div>

      {/* Grid Layout: Left Slots (Hotbar + Backpack), Right Item Details */}
      <div style={{ display: 'flex', gap: '20px', minHeight: '400px' }}>
        {/* Left: Slots View */}
        <div
          style={{
            flex: 1.5,
            background: 'rgba(235, 215, 185, 0.35)',
            borderRadius: '18px',
            padding: '16px',
            border: '1.5px dashed #b8864e',
            overflowY: 'auto',
          }}
        >
          {/* Hotbar Section */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 900,
              color: '#8b5e34',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚡ Phím tắt nhanh (Hotbar 1-9)</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            {filteredSlots.slice(0, HOTBAR_SLOTS_COUNT).map((slot) => {
              const item = slot.itemId ? getItemDefinition(slot.itemId) : null;
              const isSelected = selectedSlotIndex === slot.slotIndex;
              return (
                <CozyRoundSlot
                  key={`slot-${slot.slotIndex}`}
                  isSelected={isSelected}
                  itemImage={item?.imageIcon}
                  itemEmoji={item?.icon}
                  count={slot.quantity}
                  hotkey={slot.slotIndex + 1}
                  onClick={() => setSelectedSlotIndex(slot.slotIndex)}
                  size={64}
                  label={item?.name}
                />
              );
            })}
          </div>

          {/* Storage Bag Section */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 900,
              color: '#8b5e34',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px',
            }}
          >
            <span>📦 Ngăn chứa Balo (Kho đồ 10-24)</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
              gap: '8px',
            }}
          >
            {filteredSlots.slice(HOTBAR_SLOTS_COUNT).map((slot) => {
              const item = slot.itemId ? getItemDefinition(slot.itemId) : null;
              const isSelected = selectedSlotIndex === slot.slotIndex;
              return (
                <CozyRoundSlot
                  key={`slot-${slot.slotIndex}`}
                  isSelected={isSelected}
                  itemImage={item?.imageIcon}
                  itemEmoji={item?.icon}
                  count={slot.quantity}
                  onClick={() => setSelectedSlotIndex(slot.slotIndex)}
                  size={64}
                  label={item?.name}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Item Details Panel */}
        <div
          style={{
            flex: 1,
            background: 'rgba(247, 233, 210, 0.55)',
            borderRadius: '18px',
            padding: '20px',
            border: '1.5px dashed #b8864e',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {selectedSlot && selectedItemDef ? (
            <div>
              {/* Item Large Icon */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(240, 210, 160, 0.35)',
                  borderRadius: '24px',
                  border: '2px solid #e0c090',
                  boxShadow: '0 4px 12px rgba(120, 60, 20, 0.12)',
                }}
              >
                {selectedItemDef.imageIcon ? (
                  <img
                    src={selectedItemDef.imageIcon}
                    alt={selectedItemDef.name}
                    style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ fontSize: '48px' }}>{selectedItemDef.icon}</span>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#4a2810' }}>
                  {selectedItemDef.name}
                </h3>
                <span
                  style={{
                    display: 'inline-block',
                    background: '#e2cfb7',
                    color: '#653a15',
                    borderRadius: '8px',
                    padding: '2px 10px',
                    fontSize: '11px',
                    fontWeight: 800,
                    marginTop: '6px',
                  }}
                >
                  {selectedItemDef.category}
                </span>
              </div>

              {/* Description */}
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px',
                  background: 'rgba(245, 230, 205, 0.65)',
                  borderRadius: '12px',
                  border: '1px solid #d6b88b',
                  fontSize: '13px',
                  color: '#654321',
                  lineHeight: '1.45',
                }}
              >
                {selectedItemDef.description}
              </div>

              {/* Quantity */}
              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(245, 230, 205, 0.65)',
                  borderRadius: '10px',
                  border: '1px solid #d6b88b',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#4a2810',
                }}
              >
                <span>Số lượng có sẵn:</span>
                <strong style={{ color: '#d97706', fontSize: '15px' }}>
                  {selectedSlot.quantity} / {selectedItemDef.maxStack}
                </strong>
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
                color: '#9c7a5b',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '44px', opacity: 0.5, marginBottom: '8px' }}>🌾</span>
              <p style={{ margin: 0, fontWeight: 700 }}>Chọn một ô đồ để xem thông tin chi tiết</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedSlot && selectedSlot.itemId && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <CozyButton
                  variant="secondary"
                  style={{ flex: 1, minWidth: 'auto', height: '42px', fontSize: '13px' }}
                  onClick={() => selectedSlotIndex !== null && selectedSlot.itemId && removeItem(selectedSlot.itemId, 1)}
                >
                  Bỏ 1 vật phẩm
                </CozyButton>
                <CozyButton
                  variant="secondary"
                  style={{ flex: 1, minWidth: 'auto', height: '42px', fontSize: '13px' }}
                  onClick={() => selectedSlotIndex !== null && clearSlot(selectedSlotIndex)}
                >
                  Xóa ô này
                </CozyButton>
              </div>
            )}

            {/* Test quick add items */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <CozyButton
                variant="primary"
                style={{ flex: 1, minWidth: 'auto', height: '42px', fontSize: '12px' }}
                onClick={() => {
                  addItem('carrot', 5);
                  addItem('tomato', 5);
                  addItem('pumpkin', 2);
                }}
              >
                + Thêm nông sản
              </CozyButton>
              <CozyButton
                variant="primary"
                style={{ flex: 1, minWidth: 'auto', height: '42px', fontSize: '12px' }}
                onClick={() => {
                  addItem('wheat_seed', 5);
                  addItem('carrot_seed', 5);
                  addItem('tomato_seed', 5);
                }}
              >
                + Thêm hạt giống
              </CozyButton>
            </div>
          </div>
        </div>
      </div>
    </CozyModal>
  );
};
