import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { WordByWord, FadeInText } from '../components/AnimatedText';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating dollar signs in background
  const dollarSigns = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 137.5) % 100; // pseudo-random distribution
    const y = (i * 73.3) % 100;
    const size = 20 + (i % 5) * 8;
    const speed = 0.3 + (i % 4) * 0.15;
    const delay = i * 3;
    const floatOffset = Math.sin((frame - delay) * speed * 0.05) * 20;
    const dollarOpacity = interpolate(frame, [delay, delay + 30], [0, 0.08], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          fontSize: size,
          color: COLORS.primary,
          opacity: dollarOpacity,
          transform: `translateY(${floatOffset}px)`,
          fontFamily: FONT.family,
          fontWeight: FONT.weight.bold,
        }}
      >
        $
      </div>
    );
  });

  // Red flash on "bankrupt" timing (appears around frame 60-80)
  const flashProgress = interpolate(frame, [55, 65, 75], [0, 0.15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Here's the playbook." appears after main text
  const playbookProgress = spring({
    frame: frame - 90,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const playbookScale = interpolate(playbookProgress, [0, 1], [0.5, 1]);
  const playbookOpacity = interpolate(playbookProgress, [0, 1], [0, 1]);

  // Scene exit fade
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
      {/* Red flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.secondary,
          opacity: flashProgress,
        }}
      />

      {/* Floating dollar signs */}
      {dollarSigns}

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
          {/* Main hook text */}
          <WordByWord
            text="Private equity firms make money even when the companies they buy go bankrupt."
            startFrame={5}
            fontSize={56}
            staggerDelay={4}
            highlightWords={{
              'bankrupt.': COLORS.secondary,
              money: COLORS.primary,
            }}
            maxWidth={1200}
          />

          {/* "Here's the playbook." */}
          <div
            style={{
              fontSize: 72,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.black,
              color: COLORS.primary,
              opacity: playbookOpacity,
              transform: `scale(${playbookScale})`,
              textShadow: `0 0 40px ${COLORS.greenAlpha40}`,
            }}
          >
            Here&apos;s the playbook.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
