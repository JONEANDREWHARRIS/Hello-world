import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONTS, WEIGHTS, COLORS, SPRING_CONFIG } from '../styles/constants';

export const SectionTitle: React.FC<{
  title: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  style?: React.CSSProperties;
}> = ({
  title,
  startFrame = 0,
  fontSize = 80,
  color = COLORS.text,
  accentColor = COLORS.primary,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main title slams in from scale
  const titleProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIG.slam,
  });

  const titleScale = interpolate(titleProgress, [0, 1], [1.4, 1]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleBlur = interpolate(titleProgress, [0, 1], [15, 0]);

  // Underline sweeps in after title
  const lineProgress = interpolate(
    frame - startFrame - 12,
    [0, 18],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Glow effect pulses subtly
  const glowIntensity = interpolate(
    Math.sin((frame - startFrame) * 0.08),
    [-1, 1],
    [0.3, 0.7]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize,
          fontWeight: WEIGHTS.black,
          color,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          filter: `blur(${titleBlur}px)`,
          textAlign: 'center',
          textShadow: `0 0 ${40 * glowIntensity}px ${accentColor}40`,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      {/* Animated underline */}
      <div
        style={{
          width: Math.min(fontSize * title.length * 0.4, 600),
          height: 4,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${accentColor}, ${COLORS.secondary})`,
          transform: `scaleX(${lineProgress / 100})`,
          transformOrigin: 'left',
          opacity: lineProgress > 0 ? 1 : 0,
        }}
      />
    </div>
  );
};

// === SECTION NUMBER + TITLE COMBO ===
export const NumberedSection: React.FC<{
  number: string;
  title: string;
  startFrame?: number;
  fontSize?: number;
  accentColor?: string;
  style?: React.CSSProperties;
}> = ({
  number,
  title,
  startFrame = 0,
  fontSize = 64,
  accentColor = COLORS.primary,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Number pops in first
  const numProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIG.bouncy,
  });

  // Title slides in from right
  const titleProgress = spring({
    frame: frame - startFrame - 8,
    fps,
    config: SPRING_CONFIG.smooth,
  });

  const numScale = interpolate(numProgress, [0, 1], [0, 1]);
  const numOpacity = interpolate(numProgress, [0, 1], [0, 1]);
  const titleTranslateX = interpolate(titleProgress, [0, 1], [60, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: fontSize * 1.3,
          fontWeight: WEIGHTS.black,
          color: accentColor,
          opacity: numOpacity,
          transform: `scale(${numScale})`,
          textShadow: `0 0 30px ${accentColor}50`,
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize,
          fontWeight: WEIGHTS.bold,
          color: COLORS.text,
          opacity: titleOpacity,
          transform: `translateX(${titleTranslateX}px)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};
