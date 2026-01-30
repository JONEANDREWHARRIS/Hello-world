import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CountUp, PulsingCount } from '../components/CountUp';
import { FadeInText } from '../components/AnimatedText';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

export const Scene2BInterest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section label
  const labelProgress = spring({ frame, fps, config: SPRING_CONFIG.snappy });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Falling coins effect
  const coins = Array.from({ length: 15 }, (_, i) => {
    const x = 10 + (i * 127) % 80;
    const startDelay = 20 + i * 5;
    const fallProgress = interpolate(
      frame,
      [startDelay, startDelay + 80],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const y = fallProgress * 120;
    const coinOpacity = interpolate(
      frame,
      [startDelay, startDelay + 10, startDelay + 60, startDelay + 80],
      [0, 0.3, 0.3, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const rotation = fallProgress * 360 * (i % 2 === 0 ? 1 : -1);

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${10 + y}%`,
          fontSize: 24,
          opacity: coinOpacity,
          transform: `rotate(${rotation}deg)`,
          color: COLORS.gold,
        }}
      >
        $
      </div>
    );
  });

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
      {/* Falling coins */}
      {coins}

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
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
            Step 2: The Interest
          </div>

          {/* Big counter */}
          <div style={{ marginTop: 20 }}>
            <CountUp
              startFrame={15}
              endFrame={75}
              from={0}
              to={400}
              prefix="$"
              suffix=" MILLION"
              fontSize={110}
              color={COLORS.secondary}
            />
          </div>

          {/* Subtitle */}
          <FadeInText
            text="in interest payments per year"
            startFrame={50}
            fontSize={36}
            color={COLORS.whiteAlpha80}
          />

          {/* Additional context */}
          <FadeInText
            text="That the company has to pay — not the PE firm."
            startFrame={80}
            fontSize={28}
            color={COLORS.whiteAlpha40}
          />

          {/* Drain visual - red line growing down */}
          <div style={{ marginTop: 30, position: 'relative', width: 4, height: 80 }}>
            <div
              style={{
                width: 4,
                height: interpolate(frame, [60, 100], [0, 80], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                background: `linear-gradient(to bottom, ${COLORS.secondary}, transparent)`,
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
