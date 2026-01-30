import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { BarChart } from '../components/BarChart';
import { WordByWord, ScaleInText } from '../components/AnimatedText';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

export const Scene2ADeal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

  // "$1 BILLION" scale in
  const billionProgress = spring({
    frame: frame - 20,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const billionScale = interpolate(billionProgress, [0, 1], [0, 1]);
  const billionOpacity = interpolate(billionProgress, [0, 1], [0, 1]);

  // Subtitle
  const subProgress = spring({
    frame: frame - 45,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);

  // Bar chart (starts later)
  const barChartOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit fade
  const exitOpacity = interpolate(frame, [270, 300], [1, 0], {
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
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Section label */}
          <div
            style={{
              fontSize: 24,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.semibold,
              color: COLORS.primary,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            Step 1: The Deal
          </div>

          {/* Big number */}
          <div
            style={{
              fontSize: 110,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.black,
              color: COLORS.white,
              opacity: billionOpacity,
              transform: `scale(${billionScale})`,
              textShadow: '0 0 60px rgba(255,255,255,0.2)',
              lineHeight: 1,
            }}
          >
            $1 BILLION
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.regular,
              color: COLORS.whiteAlpha60,
              opacity: subOpacity,
              marginBottom: 30,
            }}
          >
            That&apos;s how much it costs to buy the company. But here&apos;s the trick:
          </div>

          {/* Animated bar chart */}
          <div style={{ opacity: barChartOpacity }}>
            <BarChart
              bars={[
                {
                  label: "PE Firm's Money",
                  value: 200,
                  displayValue: '$200M',
                  color: COLORS.primary,
                },
                {
                  label: 'Debt on Company',
                  value: 800,
                  displayValue: '$800M',
                  color: COLORS.secondary,
                },
              ]}
              startFrame={80}
              maxHeight={320}
              barWidth={320}
              gap={120}
              staggerDelay={25}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Bottom annotation */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <WordByWord
          text="The company they bought now owes the debt."
          startFrame={180}
          fontSize={32}
          color={COLORS.whiteAlpha80}
          staggerDelay={4}
        />
      </div>
    </AbsoluteFill>
  );
};
