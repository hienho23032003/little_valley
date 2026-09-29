import React, { useRef, useState, useCallback, useEffect } from 'react';
import { inputManager } from '../systems/inputManager';

export const VirtualJoystick: React.FC = () => {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const centerRef = useRef<{ x: number; y: number; maxRadius: number }>({
    x: 0,
    y: 0,
    maxRadius: 40,
  });

  // State only for active styling and initial tutorial hint
  const [isActive, setIsActive] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    return !localStorage.getItem('little_valley_joystick_used');
  });

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const { x: cx, y: cy, maxRadius } = centerRef.current;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);

    // Clamp knob displacement to joystick radius
    const clampedDist = Math.min(dist, maxRadius);
    const knobX = dist > 0 ? (dx / dist) * clampedDist : 0;
    const knobY = dist > 0 ? (dy / dist) * clampedDist : 0;

    // Direct DOM transform update for 120 FPS performance with zero React re-renders
    if (knobRef.current) {
      knobRef.current.style.transform = `translate3d(${knobX}px, ${knobY}px, 0)`;
    }

    // Normalized vector: X in [-1, 1], Y in [-1, 1] where up is +Y (forward)
    let normX = maxRadius > 0 ? knobX / maxRadius : 0;
    let normY = maxRadius > 0 ? -knobY / maxRadius : 0;

    // Small deadzone to prevent microscopic drift
    if (Math.hypot(normX, normY) < 0.08) {
      normX = 0;
      normY = 0;
    }

    inputManager.setJoystickVector(normX, normY, true);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const radius = rect.width / 2;
    // Maximum travel is base radius minus knob radius buffer (~36%)
    const maxRadius = radius * 0.72;

    centerRef.current = {
      x: rect.left + radius,
      y: rect.top + radius,
      maxRadius,
    };

    activePointerId.current = e.pointerId;
    baseRef.current.setPointerCapture(e.pointerId);
    setIsActive(true);

    if (showHint) {
      setShowHint(false);
      localStorage.setItem('little_valley_joystick_used', 'true');
    }

    updatePosition(e.clientX, e.clientY);
  }, [showHint, updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    e.stopPropagation();
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handlePointerEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    e.stopPropagation();
    e.preventDefault();

    if (baseRef.current && activePointerId.current !== null) {
      try {
        baseRef.current.releasePointerCapture(activePointerId.current);
      } catch {
        // Pointer capture may have already ended
      }
    }

    activePointerId.current = null;
    setIsActive(false);

    // Reset knob to center
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }

    inputManager.setJoystickVector(0, 0, false);
  }, []);

  // Cleanup on unmount or blur
  useEffect(() => {
    const handleWindowBlur = () => {
      activePointerId.current = null;
      setIsActive(false);
      if (knobRef.current) {
        knobRef.current.style.transform = 'translate3d(0px, 0px, 0)';
      }
      inputManager.setJoystickVector(0, 0, false);
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  return (
    <div
      className="virtual-joystick-container"
      style={{
        position: 'fixed',
        bottom: 'var(--joystick-bottom, calc(26px + env(safe-area-inset-bottom, 0px)))',
        left: 'var(--joystick-left, calc(24px + env(safe-area-inset-left, 0px)))',
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'auto',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Optional First-Time Tutorial Hint (Floating cleanly to the right of the joystick base) */}
      {showHint && (
        <div
          className="joystick-tutorial-hint"
          style={{
            position: 'absolute',
            left: 'calc(100% + 12px)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#2d4734',
            boxShadow: '0 4px 16px rgba(44, 62, 53, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            animation: 'fadeInUp 0.2s ease-out',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <span>🕹️</span>
          <span>Drag to move</span>
        </div>
      )}

      {/* Joystick Base Ring */}
      <div
        ref={baseRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          width: 'clamp(96px, 12vw, 114px)',
          height: 'clamp(96px, 12vw, 114px)',
          borderRadius: '50%',
          background: isActive
            ? 'radial-gradient(circle, rgba(255,255,255,0.65) 0%, rgba(220,235,215,0.5) 100%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.48) 0%, rgba(230,240,225,0.32) 100%)',
          backdropFilter: 'blur(10px)',
          border: isActive
            ? '2.5px solid #588157'
            : '2px solid rgba(255, 255, 255, 0.85)',
          boxShadow: isActive
            ? '0 10px 28px rgba(44, 62, 53, 0.25), inset 0 2px 6px rgba(0,0,0,0.06)'
            : '0 8px 22px rgba(44, 62, 53, 0.16), inset 0 2px 4px rgba(0,0,0,0.04)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
          transition: 'border-color 0.15s ease, background 0.15s ease',
        }}
      >
        {/* Direction Indicator Crosshair Dots */}
        {[-1, 1].map((dir) => (
          <React.Fragment key={`indicator-${dir}`}>
            {/* Top / Bottom notch */}
            <div
              style={{
                position: 'absolute',
                top: dir === -1 ? '6px' : 'auto',
                bottom: dir === 1 ? '6px' : 'auto',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(88, 129, 87, 0.4)',
              }}
            />
            {/* Left / Right notch */}
            <div
              style={{
                position: 'absolute',
                left: dir === -1 ? '6px' : 'auto',
                right: dir === 1 ? '6px' : 'auto',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(88, 129, 87, 0.4)',
              }}
            />
          </React.Fragment>
        ))}

        {/* Center Target Ring */}
        <div
          style={{
            position: 'absolute',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(88, 129, 87, 0.3)',
            pointerEvents: 'none',
          }}
        />

        {/* Draggable Joystick Knob */}
        <div
          ref={knobRef}
          style={{
            width: 'clamp(44px, 5.5vw, 52px)',
            height: 'clamp(44px, 5.5vw, 52px)',
            borderRadius: '50%',
            background: isActive
              ? 'linear-gradient(145deg, #629960, #40753e)'
              : 'linear-gradient(145deg, #74a872, #528a50)',
            border: '2.5px solid #ffffff',
            boxShadow: isActive
              ? '0 6px 18px rgba(44, 62, 53, 0.4), inset 0 2px 4px rgba(255,255,255,0.4)'
              : '0 4px 12px rgba(44, 62, 53, 0.28), inset 0 2px 4px rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            willChange: 'transform',
            transform: 'translate3d(0px, 0px, 0)',
            transition: isActive ? 'none' : 'transform 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          }}
        >
          {/* Inner Knob Emboss */}
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
