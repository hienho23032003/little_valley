import React, { useState } from 'react';
import { useBuildStore } from '../stores/buildStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { BUILDING_LIST, BuildingDefinition } from '../data/buildingData';
import { CozyModal, CozyButton, CozyTab } from './ui/CozyUIComponents';

export const BuildingMenuModal: React.FC = () => {
  const isBuildMenuOpen = useBuildStore((state) => state.isBuildMenuOpen);
  const closeBuildMenu = useBuildStore((state) => state.closeBuildMenu);
  const selectBuilding = useBuildStore((state) => state.selectBuilding);
  const canAffordBuilding = useBuildStore((state) => state.canAffordBuilding);

  const woodCount = useInventoryStore((state) => state.getItemCount('wood'));
  const stoneCount = useInventoryStore((state) => state.getItemCount('stone'));
  const coins = useInventoryStore((state) => state.coins);
  const addItem = useInventoryStore((state) => state.addItem);
  const addCoins = useInventoryStore((state) => state.addCoins);

  const [activeCategory, setActiveCategory] = useState<'All' | 'Farm' | 'Production' | 'Storage'>('All');

  if (!isBuildMenuOpen) return null;

  const handleGrantTestResources = () => {
    addItem('wood', 50);
    addItem('stone', 50);
    addCoins(500);
  };

  const filteredBuildings = BUILDING_LIST.filter((b) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Farm') return b.id.includes('coop') || b.id.includes('barn') || b.id.includes('silo') || b.id.includes('water_tower') || b.id.includes('well');
    if (activeCategory === 'Production') return b.id.includes('windmill') || b.id.includes('bakery') || b.id.includes('silo');
    if (activeCategory === 'Storage') return b.id.includes('shed') || b.id.includes('silo') || b.id.includes('water_tower');
    return true;
  });

  return (
    <CozyModal
      isOpen={isBuildMenuOpen}
      onClose={closeBuildMenu}
      title="Xưởng Mộc & Xây Dựng (Construction)"
      subtitle="Chọn công trình để xây dựng trong thung lũng • Phím tắt [B] hoặc [Esc]"
      icon="🔨"
      width="820px"
      maxHeight="88vh"
    >
      {/* Resource Header & Grant Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(215, 175, 125, 0.22)',
          padding: '10px 16px',
          borderRadius: '16px',
          border: '1.5px dashed #b8864e',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#7f5539', textTransform: 'uppercase' }}>
            Tài nguyên sẵn có:
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(240, 220, 190, 0.65)',
              padding: '4px 10px',
              borderRadius: '10px',
              border: '1px solid #c9a87d',
              fontWeight: 800,
              fontSize: '13px',
              color: '#4a2810',
            }}
          >
            <img src="/ui/cozy/icons/cozy_icon_logs__91x74.png" alt="wood" style={{ width: '18px', height: '18px' }} />
            <span>Gỗ: {woodCount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(240, 220, 190, 0.65)',
              padding: '4px 10px',
              borderRadius: '10px',
              border: '1px solid #c9a87d',
              fontWeight: 800,
              fontSize: '13px',
              color: '#4a2810',
            }}
          >
            <img src="/ui/cozy/icons/cozy_icon_stone__75x62.png" alt="stone" style={{ width: '18px', height: '18px' }} />
            <span>Đá: {stoneCount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(240, 220, 190, 0.65)',
              padding: '4px 10px',
              borderRadius: '10px',
              border: '1px solid #c9a87d',
              fontWeight: 800,
              fontSize: '13px',
              color: '#b45309',
            }}
          >
            <span>🪙</span>
            <span>Xu: {coins}</span>
          </div>
        </div>

        <CozyButton
          variant="secondary"
          onClick={handleGrantTestResources}
          style={{ minWidth: 'auto', height: '36px', fontSize: '11px', padding: '0 14px' }}
        >
          + Thêm vật liệu thử nghiệm
        </CozyButton>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['All', 'Farm', 'Production', 'Storage'] as const).map((cat) => (
          <CozyTab
            key={cat}
            label={cat === 'All' ? 'Tất cả' : cat === 'Farm' ? 'Nông trại' : cat === 'Production' ? 'Sản xuất' : 'Kho bãi'}
            isActive={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Buildings Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))',
          gap: '14px',
        }}
      >
        {filteredBuildings.map((building: BuildingDefinition) => {
          const affordable = canAffordBuilding(building.id);
          const hasWood = woodCount >= building.cost.wood;
          const hasStone = stoneCount >= building.cost.stone;
          const hasCoins = coins >= building.cost.coins;

          return (
            <div
              key={building.id}
              style={{
                background: 'rgba(247, 233, 210, 0.65)',
                borderRadius: '18px',
                border: affordable ? '2px solid #c9a87d' : '1.5px dashed #b58c5c',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(120, 60, 20, 0.08)',
                opacity: affordable ? 1.0 : 0.85,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: 'rgba(221, 184, 146, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      border: '1px solid #d6b88b',
                    }}
                  >
                    {building.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#7f5539',
                      background: '#ede0d4',
                      padding: '3px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    {building.size[0]}×{building.size[1]}m
                  </span>
                </div>

                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 900, color: '#4a2810' }}>
                  {building.name}
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#7f5539', lineHeight: '1.4' }}>
                  {building.description}
                </p>
              </div>

              <div>
                {/* Cost Requirements */}
                <div
                  style={{
                    background: 'rgba(245, 235, 220, 0.65)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    marginBottom: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: hasWood ? '#2d6a4f' : '#b02a37' }}>
                    <span>🪵 Gỗ:</span>
                    <span>{woodCount}/{building.cost.wood} {hasWood ? '✓' : '✗'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: hasStone ? '#2d6a4f' : '#b02a37' }}>
                    <span>🪨 Đá:</span>
                    <span>{stoneCount}/{building.cost.stone} {hasStone ? '✓' : '✗'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: hasCoins ? '#2d6a4f' : '#b02a37' }}>
                    <span>🪙 Xu:</span>
                    <span>{coins}/{building.cost.coins} {hasCoins ? '✓' : '✗'}</span>
                  </div>
                </div>

                <CozyButton
                  variant={affordable ? 'primary' : 'secondary'}
                  disabled={!affordable}
                  onClick={() => selectBuilding(building.id)}
                  style={{ width: '100%', minWidth: 'auto', height: '42px', fontSize: '13px' }}
                >
                  {affordable ? 'Chọn vị trí đặt' : 'Chưa đủ vật liệu'}
                </CozyButton>
              </div>
            </div>
          );
        })}
      </div>
    </CozyModal>
  );
};
