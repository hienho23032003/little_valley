import React, { useState } from 'react';
import { useTimeStore, formatTime12Hour, Season, SEASONS } from '../stores/timeStore';

const SEASON_ICONS: Record<Season, string> = {
  Spring: '🌱',
  Summer: '🌻',
  Autumn: '🍁',
  Winter: '❄️',
};

const SEASON_COLORS: Record<Season, string> = {
  Spring: '#52b788',
  Summer: '#e76f51',
  Autumn: '#e09f3e',
  Winter: '#4ea8de',
};

export const ClockWidget: React.FC = () => {
  const day = useTimeStore((state) => state.day);
  const season = useTimeStore((state) => state.season);
  const hour = useTimeStore((state) => state.hour);
  const minute = useTimeStore((state) => state.minute);
  const period = useTimeStore((state) => state.period);
  const isPaused = useTimeStore((state) => state.isPaused);
  const timeScale = useTimeStore((state) => state.timeScale);
  const togglePause = useTimeStore((state) => state.togglePause);
  const setTimeScale = useTimeStore((state) => state.setTimeScale);
  const advanceToNextDay = useTimeStore((state) => state.advanceToNextDay);
  const setTime = useTimeStore((state) => state.setTime);
  const setSeason = useTimeStore((state) => state.setSeason);

  const [showControls, setShowControls] = useState(false);

  // Dynamic Sun/Moon indicator based on period
  let celestialIcon = '☀️';
  let celestialBg = 'radial-gradient(circle, #fde047 30%, #f59e0b 90%)';
  let celestialGlow = 'rgba(250, 204, 21, 0.45)';

  if (period === 'Morning') {
    celestialIcon = '🌅';
    celestialBg = 'radial-gradient(circle, #fbcfe8 20%, #fb923c 90%)';
    celestialGlow = 'rgba(251, 146, 60, 0.4)';
  } else if (period === 'Evening') {
    celestialIcon = '🌇';
    celestialBg = 'radial-gradient(circle, #fdba74 20%, #ea580c 90%)';
    celestialGlow = 'rgba(234, 88, 12, 0.45)';
  } else if (period === 'Night') {
    celestialIcon = '🌙';
    celestialBg = 'radial-gradient(circle, #93c5fd 20%, #312e81 90%)';
    celestialGlow = 'rgba(147, 197, 253, 0.45)';
  }

  const timeFormatted = formatTime12Hour(hour, minute);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
        pointerEvents: 'auto',
      }}
    >
      {/* Main Clock Card */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          borderRadius: '18px',
          padding: '12px 18px',
          boxShadow: '0 8px 24px rgba(44, 62, 53, 0.14)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          minWidth: '210px',
          justifyContent: 'space-between',
        }}
      >
        {/* Left Info: Day & Season */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#2d4734',
                letterSpacing: '-0.01em',
              }}
            >
              Day {day}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: SEASON_COLORS[season],
                background: '#f0f5ec',
                padding: '2px 7px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span>{SEASON_ICONS[season]}</span>
              <span>{season}</span>
            </span>
          </div>

          {/* Time Display */}
          <div
            style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#344e41',
              marginTop: '2px',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
            }}
          >
            {timeFormatted}
          </div>
        </div>

        {/* Right Info: Animated Sun / Moon Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            title={`Period: ${period}`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: celestialBg,
              boxShadow: `0 0 16px ${celestialGlow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => setShowControls(!showControls)}
          >
            {celestialIcon}
          </div>

          {/* Small Time Controls Expander Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            title="Toggle Time Controls"
            style={{
              background: showControls ? '#e9f5db' : '#f0f3ed',
              border: '1px solid #cbd5c0',
              borderRadius: '8px',
              width: '26px',
              height: '26px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#344e41',
            }}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Expandable Time Controls Panel (for easy testing of day transitions & seasons) */}
      {showControls && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '14px',
            padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(44, 62, 53, 0.16)',
            border: '1px solid #d4dec9',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '220px',
            animation: 'fadeInUp 0.12s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#718355',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Clock & Speed Controls
          </div>

          {/* Time Scale Buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { label: '1x', scale: 60 },
              { label: '5x', scale: 300 },
              { label: '20x', scale: 1200 },
            ].map(({ label, scale }) => (
              <button
                key={label}
                onClick={() => setTimeScale(scale)}
                style={{
                  flex: 1,
                  padding: '4px 6px',
                  borderRadius: '6px',
                  border: timeScale === scale ? '1px solid #344e41' : '1px solid #d4dec9',
                  background: timeScale === scale ? '#588157' : '#ffffff',
                  color: timeScale === scale ? '#ffffff' : '#344e41',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}

            {/* Pause/Play Button */}
            <button
              onClick={togglePause}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #d4dec9',
                background: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
          </div>

          {/* Jump to specific time */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setTime(6, 0)}
              style={jumpButtonStyle}
              title="Jump to Morning (06:00)"
            >
              🌅 6 AM
            </button>
            <button
              onClick={() => setTime(12, 0)}
              style={jumpButtonStyle}
              title="Jump to Noon (12:00)"
            >
              ☀️ 12 PM
            </button>
            <button
              onClick={() => setTime(18, 0)}
              style={jumpButtonStyle}
              title="Jump to Evening (18:00)"
            >
              🌇 6 PM
            </button>
            <button
              onClick={() => setTime(22, 0)}
              style={jumpButtonStyle}
              title="Jump to Night (22:00)"
            >
              🌙 10 PM
            </button>
          </div>

          {/* Seasons Row */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                style={{
                  flex: 1,
                  padding: '4px 2px',
                  borderRadius: '6px',
                  border: season === s ? '1px solid #344e41' : '1px solid #d4dec9',
                  background: season === s ? SEASON_COLORS[s] : '#ffffff',
                  color: season === s ? '#ffffff' : '#344e41',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {SEASON_ICONS[s]} {s.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Advance to Next Day Button (Tests 24:00 daily reset) */}
          <button
            onClick={advanceToNextDay}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              background: '#588157',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span>⏭️</span>
            <span>Advance to Tomorrow (Reset)</span>
          </button>
        </div>
      )}
    </div>
  );
};

const jumpButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '4px 2px',
  borderRadius: '6px',
  border: '1px solid #d4dec9',
  background: '#ffffff',
  fontSize: '10px',
  fontWeight: 700,
  color: '#344e41',
  cursor: 'pointer',
};
