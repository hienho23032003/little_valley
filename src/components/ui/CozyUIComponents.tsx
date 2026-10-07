import React, { useState } from 'react';

// ============================================================================
// 1. COZY CLOSE BUTTON
// ============================================================================
export const CozyCloseButton: React.FC<{
  onClick: () => void;
  size?: number;
  className?: string;
}> = ({ onClick, size = 42, className = '' }) => {
  const [state, setState] = useState<'normal' | 'hover' | 'pressed'>('normal');

  const imgSrc =
    state === 'pressed'
      ? '/ui/cozy/ui_components/buttons/cozy_button_close_pressed__100x99.png'
      : state === 'hover'
      ? '/ui/cozy/ui_components/buttons/cozy_button_close_hover__100x99.png'
      : '/ui/cozy/ui_components/buttons/cozy_button_close_normal__100x99.png';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setState('hover')}
      onMouseLeave={() => setState('normal')}
      onMouseDown={() => setState('pressed')}
      onMouseUp={() => setState('hover')}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `url("${imgSrc}") no-repeat center / contain`,
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        padding: 0,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))',
        transition: 'transform 0.1s ease',
        transform: state === 'pressed' ? 'scale(0.92)' : state === 'hover' ? 'scale(1.06)' : 'scale(1)',
      }}
      aria-label="Close"
    />
  );
};

// ============================================================================
// 2. COZY BUTTON (Primary Golden & Secondary Wood)
// ============================================================================
export const CozyButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchStart?: (e: React.TouchEvent<HTMLButtonElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}> = ({
  children,
  onClick,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  variant = 'primary',
  disabled = false,
  style = {},
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const prefix = variant === 'primary' ? 'primary' : 'secondary';
  const stateStr = disabled ? 'disabled' : isPressed ? 'pressed' : isHovered ? 'hover' : 'normal';

  const normalWidth = variant === 'primary' ? '353x76' : '356x77';
  const bgImg = `/ui/cozy/ui_components/buttons/cozy_button_${prefix}_${stateStr}__${normalWidth}.png`;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => {
        if (!disabled) {
          setIsPressed(true);
          onMouseDown?.();
        }
      }}
      onMouseUp={() => {
        if (!disabled) {
          setIsPressed(false);
          onMouseUp?.();
        }
      }}
      onTouchStart={(e) => {
        if (!disabled) {
          setIsPressed(true);
          onTouchStart?.(e);
        }
      }}
      onTouchEnd={(e) => {
        if (!disabled) {
          setIsPressed(false);
          onTouchEnd?.(e);
        }
      }}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '150px',
        height: '48px',
        padding: '0 24px',
        background: `url("${bgImg}") no-repeat center / 100% 100%`,
        border: 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: variant === 'primary' ? '#5a3407' : '#ffffff',
        fontFamily: 'inherit',
        fontSize: '15px',
        fontWeight: 800,
        textShadow: variant === 'primary' ? '0 1px 2px rgba(255,255,255,0.7)' : '0 2px 4px rgba(0,0,0,0.6)',
        filter: disabled ? 'grayscale(0.6) opacity(0.7)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        transform: isPressed ? 'scale(0.96)' : isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.1s ease',
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ============================================================================
// 3. COZY MODAL CONTAINER (Parchment Panel)
// ============================================================================
export const CozyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  width?: string;
  maxHeight?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  width = '820px',
  maxHeight = '90vh',
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 20, 18, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'auto',
        animation: 'cozyFadeIn 0.2s ease-out',
        padding: '16px',
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      {/* Modal Parchment Panel - Pure PNG texture with transparent edges, NO white card! */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: '96vw',
          maxHeight,
          background: 'url("/ui/cozy/ui_components/panels/cozy_panel_parchment_detail_plain__1155x1263.png") no-repeat center / 100% 100%',
          backgroundColor: 'transparent',
          borderRadius: 0,
          border: 'none',
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.6))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '42px 48px 46px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '2px dashed #d6b88b',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {icon && (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: 'rgba(230, 186, 120, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  border: '1px solid #d6b88b',
                }}
              >
                {icon.startsWith('/') ? <img src={icon} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> : icon}
              </div>
            )}
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#4a2810',
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '13px',
                    color: '#7f5539',
                    fontWeight: 600,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <CozyCloseButton onClick={onClose} size={44} />
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              paddingTop: '16px',
              borderTop: '2px dashed #d6b88b',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. COZY ROUND ITEM SLOT
// ============================================================================
export const CozyRoundSlot: React.FC<{
  isSelected?: boolean;
  isDimmed?: boolean;
  itemImage?: string;
  itemEmoji?: string;
  count?: number;
  hotkey?: number | string;
  onClick?: () => void;
  size?: number;
  label?: string;
}> = ({
  isSelected = false,
  isDimmed = false,
  itemImage,
  itemEmoji,
  count,
  hotkey,
  onClick,
  size = 72,
  label,
}) => {
  const slotBg = isSelected
    ? '/ui/cozy/ui_components/slots_frames/cozy_slot_item_round_selected__152x151.png'
    : isDimmed
    ? '/ui/cozy/ui_components/slots_frames/cozy_slot_item_round_dimmed__134x133.png'
    : '/ui/cozy/ui_components/slots_frames/cozy_slot_item_round__134x133.png';

  return (
    <div
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `url("${slotBg}") no-repeat center / contain`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.12s ease',
        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
        filter: isSelected ? 'drop-shadow(0 4px 10px rgba(230, 150, 40, 0.5))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
        userSelect: 'none',
      }}
      title={label}
    >
      {/* Hotkey Number Tag (Top Left) */}
      {hotkey !== undefined && (
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: '5px',
            fontSize: '11px',
            fontWeight: 900,
            color: '#7f5539',
            lineHeight: 1,
            textShadow: '0 1px 1px #fff',
          }}
        >
          {hotkey}
        </div>
      )}

      {/* Item Icon Image or Emoji */}
      {itemImage ? (
        <img
          src={itemImage}
          alt={label || ''}
          style={{
            width: `${Math.round(size * 0.62)}px`,
            height: `${Math.round(size * 0.62)}px`,
            objectFit: 'contain',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
          }}
        />
      ) : itemEmoji ? (
        <span style={{ fontSize: `${Math.round(size * 0.44)}px`, pointerEvents: 'none' }}>
          {itemEmoji}
        </span>
      ) : null}

      {/* Quantity Counter Badge (Bottom Right) */}
      {count !== undefined && count > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '24px',
            height: '24px',
            background: 'url("/ui/cozy/ui_components/other_controls/cozy_badge_counter__59x59.png") no-repeat center / contain',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 900,
            color: '#ffffff',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. COZY CATEGORY TAB (100% Image Button, zero HTML/CSS borders)
// ============================================================================
export const CozyTab: React.FC<{
  label: string;
  icon?: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const prefix = isActive ? 'primary' : 'secondary';
  const stateStr = isPressed ? 'pressed' : isHovered ? 'hover' : 'normal';
  const normalWidth = isActive ? '353x76' : '356x77';
  const bgImg = `/ui/cozy/ui_components/buttons/cozy_button_${prefix}_${stateStr}__${normalWidth}.png`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        height: '42px',
        minWidth: '95px',
        padding: '0 18px',
        background: `url("${bgImg}") no-repeat center / 100% 100%`,
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: isActive ? '#5a3407' : '#ffffff',
        fontFamily: 'inherit',
        fontSize: '13px',
        fontWeight: 800,
        textShadow: isActive ? '0 1px 2px rgba(255,255,255,0.7)' : '0 2px 4px rgba(0,0,0,0.6)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.22))',
        transform: isPressed ? 'scale(0.96)' : isHovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'transform 0.1s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

