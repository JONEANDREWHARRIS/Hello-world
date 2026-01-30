import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { ScaleInText, FadeInText, WordByWord } from '../components/AnimatedText';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

export const Scene2EToysRUs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Toys R Us" title entrance
  const titleProgress = spring({
    frame: frame - 5,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const titleScale = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Case study label
  const labelProgress = spring({ frame, fps, config: SPRING_CONFIG.snappy });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Stats entrance staggered
  const stat1Progress = spring({ frame: frame - 60, fps, config: SPRING_CONFIG.smooth });
  const stat1Opacity = interpolate(stat1Progress, [0, 1], [0, 1]);
  const stat1Scale = interpolate(stat1Progress, [0, 1], [0.5, 1]);

  const stat2Progress = spring({ frame: frame - 110, fps, config: SPRING_CONFIG.smooth });
  const stat2Opacity = interpolate(stat2Progress, [0, 1], [0, 1]);
  const stat2Scale = interpolate(stat2Progress, [0, 1], [0.5, 1]);

  const stat3Progress = spring({ frame: frame - 170, fps, config: SPRING_CONFIG.smooth });
  const stat3Opacity = interpolate(stat3Progress, [0, 1], [0, 1]);
  const stat3Y = interpolate(stat3Progress, [0, 1], [20, 0]);

  // Checkmark for final stat
  const checkProgress = spring({ frame: frame - 200, fps, config: SPRING_CONFIG.bouncy });
  const checkScale = interpolate(checkProgress, [0, 1], [0, 1]);

  // Divider line
  const lineProgress = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 25 }}>
          {/* Case Study label */}
          <div
            style={{
              fontSize: 20,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.semibold,
              color: COLORS.whiteAlpha40,
              opacity: labelOpacity,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            Case Study
          </div>

          {/* Toys R Us title */}
          <div
            style={{
              fontSize: 96,
              fontFamily: FONT.family,
              fontWeight: FONT.weight.black,
              color: COLORS.white,
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            TOYS &ldquo;R&rdquo; US
          </div>

          {/* Divider line */}
          <div
            style={{
              width: 600 * lineProgress,
              height: 2,
              background: `linear-gradient(to right, transparent, ${COLORS.whiteAlpha40}, transparent)`,
              margin: '10px 0',
            }}
          />

          {/* Stat 1: Workers lost jobs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: stat1Opacity,
              transform: `scale(${stat1Scale})`,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.black,
                color: COLORS.secondary,
                textShadow: `0 0 30px ${COLORS.redAlpha40}`,
              }}
            >
              33,000
            </span>
            <span
              style={{
                fontSize: 36,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.semibold,
                color: COLORS.whiteAlpha80,
              }}
            >
              workers lost their jobs
            </span>
          </div>

          {/* Stat 2: Executive bonuses */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: stat2Opacity,
              transform: `scale(${stat2Scale})`,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.black,
                color: COLORS.primary,
                textShadow: `0 0 30px ${COLORS.greenAlpha40}`,
              }}
            >
              $16M
            </span>
            <span
              style={{
                fontSize: 36,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.semibold,
                color: COLORS.whiteAlpha80,
              }}
            >
              in executive bonuses
            </span>
          </div>

          {/* Stat 3: PE firm already made money */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: stat3Opacity,
              transform: `translateY(${stat3Y}px)`,
              marginTop: 20,
              padding: '20px 40px',
              borderRadius: 12,
              border: `1px solid ${COLORS.greenAlpha20}`,
              background: COLORS.greenAlpha20 + '10',
            }}
          >
            <div
              style={{
                fontSize: 36,
                opacity: checkScale > 0 ? 1 : 0,
                transform: `scale(${checkScale})`,
              }}
            >
              ✅
            </div>
            <span
              style={{
                fontSize: 32,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.bold,
                color: COLORS.primary,
              }}
            >
              PE Firm: Already made their money back
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
