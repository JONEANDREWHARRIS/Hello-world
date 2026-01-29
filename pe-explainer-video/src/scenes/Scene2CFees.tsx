import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { FeesList } from '../components/FeesList';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

export const Scene2CFees: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section label
  const labelProgress = spring({ frame, fps, config: SPRING_CONFIG.snappy });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelY = interpolate(labelProgress, [0, 1], [-20, 0]);

  // Title
  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const titleScale = interpolate(titleProgress, [0, 1], [0.5, 1]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Summary text at bottom
  const summaryProgress = spring({
    frame: frame - 200,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const summaryOpacity = interpolate(summaryProgress, [0, 1], [0, 1]);
  const summaryY = interpolate(summaryProgress, [0, 1], [20, 0]);

  // Exit
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
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
          {/* Section label */}
          <div
            style={{
              fontSize: 24,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.semibold,
              color: COLORS.primary,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            Step 3: The Fees
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.black,
              color: COLORS.white,
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            They charge the company{' '}
            <span style={{ color: COLORS.primary }}>they just bought</span>
          </div>

          {/* Fees list */}
          <div style={{ marginTop: 10, width: 700 }}>
            <FeesList
              items={[
                { label: 'Management Fees', sublabel: '2% of assets, annually', icon: '💼' },
                { label: 'Transaction Fees', sublabel: 'Millions at closing', icon: '🤝' },
                { label: 'Monitoring Fees', sublabel: 'For "oversight"', icon: '👁️' },
              ]}
              startFrame={60}
              staggerDelay={35}
              fontSize={44}
              accentColor={COLORS.primary}
            />
          </div>

          {/* Summary */}
          <div
            style={{
              fontSize: 28,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.semibold,
              color: COLORS.whiteAlpha60,
              opacity: summaryOpacity,
              transform: `translateY(${summaryY}px)`,
              textAlign: 'center',
              marginTop: 20,
              maxWidth: 800,
            }}
          >
            All paid by the company — meaning by its employees and customers.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
