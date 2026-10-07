import React, { useState } from 'react';
import { useCharacterStore } from '../../stores/characterStore';
import { CHARACTERS, CHARACTER_LIST, COLOR_OPTIONS } from '../../data/characterData';
import { CharacterPreviewCanvas } from './CharacterPreviewCanvas';
import { CozyButton, CozyCloseButton } from '../ui/CozyUIComponents';

interface TabItem {
  id: 'name' | 'hero' | 'color' | 'accessories';
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: 'name', label: 'Tên', icon: '✏️' },
  { id: 'hero', label: 'Anh hùng', icon: '🦸' },
  { id: 'color', label: 'Màu', icon: '🎨' },
  { id: 'accessories', label: 'Phụ kiện', icon: '👒' },
];

export const CharacterSelectScreen: React.FC = () => {
  const selectedCharacterId = useCharacterStore((state) => state.selectedCharacterId);
  const playerName = useCharacterStore((state) => state.playerName);
  const farmName = useCharacterStore((state) => state.farmName);
  const selectedColor = useCharacterStore((state) => state.selectedColor);
  const previewAnimation = useCharacterStore((state) => state.previewAnimation);
  const isCharacterCreated = useCharacterStore((state) => state.isCharacterCreated);

  const selectCharacter = useCharacterStore((state) => state.selectCharacter);
  const nextCharacter = useCharacterStore((state) => state.nextCharacter);
  const prevCharacter = useCharacterStore((state) => state.prevCharacter);
  const setPlayerName = useCharacterStore((state) => state.setPlayerName);
  const setFarmName = useCharacterStore((state) => state.setFarmName);
  const setSelectedColor = useCharacterStore((state) => state.setSelectedColor);
  const setPreviewAnimation = useCharacterStore((state) => state.setPreviewAnimation);
  const randomizeName = useCharacterStore((state) => state.randomizeName);
  const completeCreation = useCharacterStore((state) => state.completeCreation);
  const closeCharacterModal = useCharacterStore((state) => state.closeCharacterModal);

  const [activeTab, setActiveTab] = useState<'name' | 'hero' | 'color' | 'accessories'>('name');

  const currentHero = CHARACTERS[selectedCharacterId] || CHARACTERS.knight;

  const handleStartGame = () => {
    completeCreation();
  };

  const handleBack = () => {
    if (isCharacterCreated) {
      closeCharacterModal();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 35%, #bfdbfe 70%, #dbeafe 100%)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. TOP HEADER & WOODEN BOARDS */}
      <div
        style={{
          position: 'relative',
          height: '110px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        {/* Back Button (Top-Left) */}
        {isCharacterCreated && (
          <div style={{ position: 'absolute', left: '24px', top: '24px', zIndex: 10 }}>
            <CozyCloseButton onClick={handleBack} size={48} />
          </div>
        )}

        {/* Left Wooden Hanging Sign */}
        <div
          style={{
            position: 'absolute',
            left: '96px',
            top: '16px',
            background: 'linear-gradient(135deg, #a16207 0%, #854d0e 50%, #713f12 100%)',
            border: '3px solid #451a03',
            borderRadius: '16px',
            padding: '8px 16px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.3)',
            transform: 'rotate(-4deg)',
            color: '#fef08a',
            fontSize: '13px',
            fontWeight: '700',
            lineHeight: 1.25,
            textAlign: 'center',
            maxWidth: '170px',
            display: window.innerWidth > 960 ? 'block' : 'none',
          }}
        >
          Mỗi nhân vật là một câu chuyện bắt đầu! ❤️
        </div>

        {/* Center Main Wooden Board */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            top: '2px',
          }}
        >
          {/* Main Plank */}
          <div
            style={{
              position: 'relative',
              background: 'linear-gradient(180deg, #92400e 0%, #78350f 60%, #451a03 100%)',
              border: '4px solid #3e1704',
              borderRadius: '24px',
              padding: '10px 48px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Cute Leaf on Left Corner */}
            <div
              style={{
                position: 'absolute',
                left: '-14px',
                top: '-10px',
                fontSize: '28px',
                transform: 'rotate(-30deg)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            >
              🍃
            </div>

            {/* Cute Leaf on Right Corner */}
            <div
              style={{
                position: 'absolute',
                right: '-14px',
                bottom: '-6px',
                fontSize: '28px',
                transform: 'rotate(45deg)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            >
              🍃
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '1px',
                textShadow: '0 3px 6px rgba(0,0,0,0.6)',
              }}
            >
              Tạo nhân vật
            </h1>
          </div>

          {/* Sub-badge: "Chọn phong cách của bạn" */}
          <div
            style={{
              marginTop: '-8px',
              background: '#fffbeb',
              border: '2px solid #ca8a04',
              borderRadius: '9999px',
              padding: '3px 20px',
              fontSize: '13px',
              fontWeight: '800',
              color: '#854d0e',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              zIndex: 2,
            }}
          >
            Chọn phong cách của bạn
          </div>
        </div>

        {/* Right Wooden Hanging Sign */}
        <div
          style={{
            position: 'absolute',
            right: '48px',
            top: '16px',
            background: 'linear-gradient(135deg, #a16207 0%, #854d0e 50%, #713f12 100%)',
            border: '3px solid #451a03',
            borderRadius: '16px',
            padding: '8px 16px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.3)',
            transform: 'rotate(4deg)',
            color: '#fef08a',
            fontSize: '13px',
            fontWeight: '700',
            lineHeight: 1.25,
            textAlign: 'center',
            maxWidth: '170px',
            display: window.innerWidth > 960 ? 'block' : 'none',
          }}
        >
          Cùng nhau xây nên thị trấn tuyệt vời! ❤️
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN CONTENT BODY */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '270px 1fr 420px',
          gap: '20px',
          padding: '0 32px 24px 32px',
          minHeight: 0,
          alignItems: 'center',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* LEFT COLUMN: HERO SELECTION LIST */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            justifyContent: 'center',
            height: '100%',
            overflowY: 'auto',
            paddingRight: '6px',
          }}
        >
          {CHARACTER_LIST.map((hero) => {
            const isSelected = hero.id === selectedCharacterId;
            const bgImg = isSelected
              ? '/ui/cozy/ui_components/buttons/cozy_button_primary_normal__353x76.png'
              : '/ui/cozy/ui_components/buttons/cozy_button_secondary_normal__356x77.png';

            return (
              <button
                key={hero.id}
                onClick={() => selectCharacter(hero.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 18px',
                  border: 'none',
                  outline: 'none',
                  borderRadius: 0,
                  background: `url("${bgImg}") no-repeat center / 100% 100%`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.03) translateX(6px)' : 'scale(1)',
                  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
                  minHeight: '54px',
                }}
              >
                {/* Hero Avatar Disc */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#f8fafc',
                    border: isSelected ? '2px solid #ffffff' : '2px solid #cbd5e1',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={hero.avatar}
                    alt={hero.name}
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {/* Hero Labels */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      color: isSelected ? '#ffffff' : '#1e293b',
                      lineHeight: 1.2,
                    }}
                  >
                    {hero.name}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isSelected ? '#dbeafe' : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {hero.subtitle}
                  </div>
                </div>

                {/* Arrow chevron indicator */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#ffffff' : '#64748b',
                    fontSize: '14px',
                    fontWeight: '900',
                    flexShrink: 0,
                  }}
                >
                  ›
                </div>
              </button>
            );
          })}
        </div>

        {/* CENTER COLUMN: 3D CHARACTER PREVIEW POD & ANIMATION CONTROLS */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Top Instruction Pill */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.95)',
              borderRadius: '9999px',
              padding: '5px 16px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#334155',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 5,
            }}
          >
            <span>🖐️</span> Kéo để xoay
          </div>

          {/* Left Arrow Button (Cozy Wood Arrow Image) */}
          <button
            onClick={prevCharacter}
            title="Nhân vật trước"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '54px',
              height: '42px',
              background: 'url("/ui/cozy/ui_components/other_controls/cozy_arrow_left__143x112.png") no-repeat center / contain',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transition: 'transform 0.1s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')}
          />

          {/* Right Arrow Button (Cozy Wood Arrow Image) */}
          <button
            onClick={nextCharacter}
            title="Nhân vật tiếp"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '54px',
              height: '42px',
              background: 'url("/ui/cozy/ui_components/other_controls/cozy_arrow_right__143x112.png") no-repeat center / contain',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transition: 'transform 0.1s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')}
          />

          {/* 3D Canvas Showcase */}
          <div
            style={{
              width: '100%',
              height: 'calc(100% - 70px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CharacterPreviewCanvas
              character={currentHero}
              animationName={previewAnimation}
              tintColor={selectedColor}
            />
          </div>

          {/* Bottom Action Animation Pills */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid #ffffff',
              borderRadius: '9999px',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
              zIndex: 5,
            }}
          >
            {[
              { id: 'Idle_A' as const, label: 'Đứng', icon: '😶' },
              { id: 'Walking_A' as const, label: 'Đi', icon: '👟' },
              { id: 'Running_A' as const, label: 'Chạy', icon: '🏃' },
              { id: 'Interact' as const, label: 'Vẫy', icon: '👋' },
              { id: 'Jump_Full_Short' as const, label: 'Ăn mừng', icon: '⭐' },
            ].map((anim) => {
              const isActive = previewAnimation === anim.id;
              const bgImg = isActive
                ? '/ui/cozy/ui_components/buttons/cozy_button_primary_normal__353x76.png'
                : '/ui/cozy/ui_components/buttons/cozy_button_secondary_normal__356x77.png';

              return (
                <button
                  key={anim.id}
                  onClick={() => setPreviewAnimation(anim.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 16px',
                    border: 'none',
                    outline: 'none',
                    borderRadius: 0,
                    background: `url("${bgImg}") no-repeat center / 100% 100%`,
                    color: isActive ? '#5a3407' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.22))',
                    transition: 'all 0.15s ease',
                    textShadow: isActive ? '0 1px 2px rgba(255,255,255,0.7)' : '0 2px 4px rgba(0,0,0,0.6)',
                  }}
                >
                  <span>{anim.icon}</span>
                  <span>{anim.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: CHARACTER CUSTOMIZATION CARD */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Main Card with Cozy Parchment Panel, NO white background! */}
          <div
            style={{
              background: 'url("/ui/cozy/ui_components/panels/cozy_panel_parchment_detail_plain__1155x1263.png") no-repeat center / 100% 100%',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 0,
              filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.35))',
              display: 'flex',
              padding: '38px 30px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left Vertical Tabs (Cozy Round Slot Frames) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingRight: '14px',
                borderRight: '2px dashed #d6b88b',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const slotBg = isActive
                  ? '/ui/cozy/ui_components/slots_frames/cozy_slot_item_round_selected__152x151.png'
                  : '/ui/cozy/ui_components/slots_frames/cozy_slot_item_round__134x133.png';

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                    style={{
                      width: '52px',
                      height: '52px',
                      background: `url("${slotBg}") no-repeat center / contain`,
                      border: 'none',
                      outline: 'none',
                      color: isActive ? '#4a2810' : '#7f5539',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      filter: isActive ? 'drop-shadow(0 4px 8px rgba(230,150,40,0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
                      transition: 'all 0.15s ease',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <span style={{ fontSize: '15px' }}>{tab.icon}</span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: '900',
                        color: isActive ? '#4a2810' : '#7f5539',
                        marginTop: '1px',
                        textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Form Fields & Actions */}
            <div
              style={{
                flex: 1,
                paddingLeft: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Field 1: Tên Nhân Vật */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#854d0e',
                    marginBottom: '6px',
                    letterSpacing: '0.5px',
                  }}
                >
                  TÊN NHÂN VẬT
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Nhập tên nhân vật..."
                    maxLength={16}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid #cbd5e1',
                      background: '#f8fafc',
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#1e293b',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                  <button
                    onClick={randomizeName}
                    title="Ngẫu nhiên tên"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      border: '1.5px solid #cbd5e1',
                      background: '#f1f5f9',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.12s ease',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92) rotate(15deg)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
                  >
                    🎲
                  </button>
                </div>
              </div>

              {/* Field 2: Tên Nông Trại */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#854d0e',
                    marginBottom: '6px',
                    letterSpacing: '0.5px',
                  }}
                >
                  TÊN NÔNG TRẠI
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="vd: Nông trại Mây Hồng"
                  maxLength={24}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>

              {/* Box 3: Anh Hùng Đã Chọn */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#854d0e',
                    marginBottom: '6px',
                    letterSpacing: '0.5px',
                  }}
                >
                  ANH HÙNG ĐÃ CHỌN
                </label>
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '16px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '2px solid #93c5fd',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={currentHero.avatar}
                      alt={currentHero.name}
                      style={{
                        width: '90%',
                        height: '90%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        color: '#1d4ed8',
                        lineHeight: 1.2,
                      }}
                    >
                      {currentHero.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#475569',
                        marginTop: '2px',
                        lineHeight: 1.35,
                      }}
                    >
                      {currentHero.perk}
                    </div>
                  </div>
                </div>
              </div>

              {/* Field 4: Chọn Màu Sắc */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#854d0e',
                    marginBottom: '8px',
                    letterSpacing: '0.5px',
                  }}
                >
                  CHỌN MÀU SẮC
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = selectedColor === c.hex;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.hex)}
                        title={c.label}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: isSelected
                            ? `0 0 0 3px #ffffff, 0 0 0 5.5px #2563eb, 0 4px 10px rgba(0,0,0,0.2)`
                            : '0 2px 5px rgba(0,0,0,0.15)',
                          transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                          transition: 'all 0.15s ease',
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Big CTA Button (100% Cozy Golden Image Button) */}
              <CozyButton
                variant="primary"
                onClick={handleStartGame}
                style={{ width: '100%', minWidth: 'auto', height: '54px', fontSize: '17px', marginTop: '6px' }}
              >
                <span>▶️</span>
                <span>{isCharacterCreated ? 'Lưu & Tiếp tục' : 'Bắt đầu hành trình'}</span>
              </CozyButton>
            </div>
          </div>


          {/* Bottom Right Hanging Sign */}
          <div
            style={{
              position: 'absolute',
              right: '-12px',
              bottom: '-36px',
              background: 'linear-gradient(135deg, #a16207 0%, #854d0e 50%, #713f12 100%)',
              border: '3px solid #451a03',
              borderRadius: '16px',
              padding: '8px 18px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
              transform: 'rotate(3deg)',
              color: '#fef08a',
              fontSize: '12px',
              fontWeight: '800',
              zIndex: 15,
            }}
          >
            Thế giới tuyệt vời đang chờ bạn! ❤️
          </div>
        </div>
      </div>
    </div>
  );
};
