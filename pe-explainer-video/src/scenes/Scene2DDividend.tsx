import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { WordByWord, ScaleInText } from '../components/AnimatedText';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

export const Scene2DDividend: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section label
  const labelProgress = spring({ frame, fps, config: SPRING_CONFIG.snappy });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Arrow animation between "Force MORE debt" and "Pay themselves dividends"
  const arrowProgress = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Circular flow diagram
  const circleProgress = spring({
    frame: frame - 50,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const circleOpacity = interpolate(circleProgress, [0, 1], [0, 1]);

  // Rotating arrow on the cycle
  const rotation = frame > 50 ? ((frame - 50) * 3) % 360 : 0;

  // Red warning pulse
  const pulse = frame > 80 ? 0.5 + 0.5 * Math.sin((frame - 80) * 0.15) : 0;

  // Exit
  const exitOpacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.backgroundEnd}, ${COLORS.background})`,
        opacity: exitOpacity,
      }}
    >
      {/* Red pulse overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.secondary,
          opacity: pulse * 0.06,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          {/* Section label */}
          <div
            style={{
              fontSize: 24,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.semibold,
              color: COLORS.secondary,
              opacity: labelOpacity,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            Step 4: Dividend Recap
          </div>

          {/* Main text with arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <WordByWord
              text="Force MORE debt onto the company"
              startFrame={10}
              fontSize={52}
              staggerDelay={4}
              highlightWords={{ MORE: COLORS.secondary, debt: COLORS.secondary }}
            />

            {/* Arrow */}
            <div
              style={{
                fontSize: 60,
                color: COLORS.secondary,
                opacity: arrowProgress,
                transform: `scaleY(${arrowProgress})`,
              }}
            >
              ↓
            </div>

            <WordByWord
              text="Pay themselves massive dividends"
              startFrame={50}
              fontSize={52}
              staggerDelay={4}
              highlightWords={{ themselves: COLORS.primary, dividends: COLORS.primary }}
            />
          </div>

          {/* Circular flow diagram */}
          <div
            style={{
              opacity: circleOpacity,
              marginTop: 30,
              position: 'relative',
              width: 300,
              height: 160,
            }}
          >
            {/* Cycle ring */}
            <svg width={300} height={160} viewBox="0 0 300 160">
              <ellipse
                cx={150}
                cy={80}
                rx={130}
                ry={60}
                fill="none"
                stroke={COLORS.whiteAlpha20}
                strokeWidth={3}
                strokeDasharray="8 4"
              />
              {/* Rotating indicator dot */}
              <circle
                cx={150 + 130 * Math.cos((rotation * Math.PI) / 180)}
                cy={80 + 60 * Math.sin((rotation * Math.PI) / 180)}
                r={8}
                fill={COLORS.secondary}
                style={{ filter: `drop-shadow(0 0 10px ${COLORS.secondary})` }}
              />
            </svg>

            {/* Labels on cycle */}
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 18,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.bold,
                color: COLORS.secondary,
              }}
            >
              DEBT
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 18,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.bold,
                color: COLORS.primary,
              }}
            >
              DIVIDENDS
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
