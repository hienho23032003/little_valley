import React from 'react';
import { useBuildStore } from '../stores/buildStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { BUILDING_LIST, BuildingDefinition } from '../data/buildingData';

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

  if (!isBuildMenuOpen) return null;

  const handleGrantTestResources = () => {
    addItem('wood', 50);
    addItem('stone', 50);
    addCoins(500);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(25, 35, 28, 0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'auto',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBuildMenu();
      }}
    >
      <div
        style={{
          width: '780px',
          maxWidth: '92vw',
          maxHeight: 'min(88vh, calc(var(--app-height, 100dvh) - 32px))',
          background: '#fdfbf7',
          borderRadius: '24px',
          border: '2px solid #e2d9cc',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e8e0d5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f7f3eb 0%, #fdfbf7 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🔨</span>
              <h2
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#2d4734',
                  letterSpacing: '-0.02em',
                }}
              >
                Valley Workshop & Construction
              </h2>
            </div>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: '#65816c',
                fontWeight: 500,
              }}
            >
              Choose a structure to place in the valley. Press <strong>[B]</strong> or <strong>[Esc]</strong> to close.
            </p>
          </div>

          <button
            onClick={closeBuildMenu}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #d4c8b8',
              background: '#f0ece1',
              color: '#495057',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e2dbce')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f0ece1')}
          >
            ✕
          </button>
        </div>

        {/* Player Resources Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: '#f2ece1',
            borderBottom: '1px solid #e2d9cc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#708375',
              }}
            >
              Available Resources:
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fff',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid #ded5c8',
                fontWeight: 700,
                fontSize: '14px',
                color: '#4a2810',
              }}
            >
              <span>🪵</span>
              <span>Wood: {woodCount}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fff',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid #ded5c8',
                fontWeight: 700,
                fontSize: '14px',
                color: '#495057',
              }}
            >
              <span>🪨</span>
              <span>Stone: {stoneCount}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fff',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid #ded5c8',
                fontWeight: 700,
                fontSize: '14px',
                color: '#b07d12',
              }}
            >
              <span>🪙</span>
              <span>Coins: {coins.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick test grant */}
          <button
            onClick={handleGrantTestResources}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#344e41',
              background: '#e9f5db',
              border: '1px solid #cfe1b9',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#d8f3dc')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#e9f5db')}
          >
            + Get Test Materials
          </button>
        </div>

        {/* Buildings Grid */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {BUILDING_LIST.map((building: BuildingDefinition) => {
            const affordable = canAffordBuilding(building.id);
            const hasWood = woodCount >= building.cost.wood;
            const hasStone = stoneCount >= building.cost.stone;
            const hasCoins = coins >= building.cost.coins;

            return (
              <div
                key={building.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: affordable ? '1px solid #d4c8b8' : '1px dashed #d8cfc4',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(60, 75, 65, 0.06)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  opacity: affordable ? 1.0 : 0.82,
                }}
              >
                <div>
                  {/* Top Header & Icon */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: '#f4ede2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      {building.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#708375',
                        background: '#edf3e8',
                        padding: '3px 8px',
                        borderRadius: '8px',
                      }}
                    >
                      {building.size[0]}×{building.size[1]}m
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: '0 0 6px 0',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#2d4734',
                    }}
                  >
                    {building.name}
                  </h3>

                  <p
                    style={{
                      margin: '0 0 14px 0',
                      fontSize: '12px',
                      color: '#65776a',
                      lineHeight: '1.45',
                    }}
                  >
                    {building.description}
                  </p>
                </div>

                <div>
                  {/* Cost List */}
                  <div
                    style={{
                      background: '#f9f6f0',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      marginBottom: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: hasWood ? '#2d6a4f' : '#b02a37',
                      }}
                    >
                      <span>🪵 Wood:</span>
                      <span>
                        {woodCount}/{building.cost.wood} {hasWood ? '✓' : '✗'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: hasStone ? '#2d6a4f' : '#b02a37',
                      }}
                    >
                      <span>🪨 Stone:</span>
                      <span>
                        {stoneCount}/{building.cost.stone} {hasStone ? '✓' : '✗'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: hasCoins ? '#2d6a4f' : '#b02a37',
                      }}
                    >
                      <span>🪙 Coins:</span>
                      <span>
                        {coins.toLocaleString()}/{building.cost.coins} {hasCoins ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>

                  {/* Build Action Button */}
                  <button
                    disabled={!affordable}
                    onClick={() => selectBuilding(building.id)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: affordable
                        ? 'linear-gradient(180deg, #52b788 0%, #40916c 100%)'
                        : '#dee2e6',
                      color: affordable ? '#ffffff' : '#868e96',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: affordable ? 'pointer' : 'not-allowed',
                      boxShadow: affordable ? '0 4px 12px rgba(64, 145, 108, 0.28)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (affordable) e.currentTarget.style.filter = 'brightness(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      if (affordable) e.currentTarget.style.filter = 'none';
                    }}
                  >
                    {affordable ? 'Select & Place' : 'Lacking Resources'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
