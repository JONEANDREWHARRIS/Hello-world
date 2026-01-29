import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONTS, WEIGHTS, COLORS, SPRING_CONFIG } from '../styles/constants';

export const BulletPoint: React.FC<{
  text: string;
  startFrame?: number;
  icon?: string;
  color?: string;
  fontSize?: number;
  index?: number;
  staggerDelay?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  icon = '→',
  color = COLORS.primary,
  fontSize = 32,
  index = 0,
  staggerDelay = 8,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = startFrame + index * staggerDelay;

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIG.smooth,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-40, 0]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  // Icon pop-in happens slightly after the text
  const iconProgress = spring({
    frame: frame - delay - 3,
    fps,
    config: SPRING_CONFIG.bouncy,
  });
  const iconScale = interpolate(iconProgress, [0, 1], [0, 1]);
  const iconRotate = interpolate(iconProgress, [0, 1], [-45, 0]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        ...style,
      }}
    >
      <span
        style={{
          fontSize: fontSize * 0.9,
          color,
          transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
          display: 'inline-block',
          minWidth: fontSize * 1.2,
          textAlign: 'center',
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: FONTS.body,
          fontSize,
          fontWeight: WEIGHTS.medium,
          color: COLORS.text,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// === ANIMATED CHECKMARK BULLET ===
export const CheckBullet: React.FC<{
  text: string;
  startFrame?: number;
  index?: number;
  staggerDelay?: number;
  checked?: boolean;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  index = 0,
  staggerDelay = 10,
  checked = true,
  fontSize = 30,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = startFrame + index * staggerDelay;

  const textProgress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIG.smooth,
  });

  const checkProgress = spring({
    frame: frame - delay - 8,
    fps,
    config: SPRING_CONFIG.bouncy,
  });

  const opacity = interpolate(textProgress, [0, 1], [0, 1]);
  const translateX = interpolate(textProgress, [0, 1], [30, 0]);
  const checkScale = interpolate(checkProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity,
        transform: `translateX(${translateX}px)`,
        ...style,
      }}
    >
      <div
        style={{
          width: fontSize * 1.2,
          height: fontSize * 1.2,
          borderRadius: '50%',
          background: checked ? COLORS.success : COLORS.danger,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${checkScale})`,
        }}
      >
        <span style={{ fontSize: fontSize * 0.7, color: '#fff' }}>
          {checked ? '✓' : '✕'}
        </span>
      </div>
      <span
        style={{
          fontFamily: FONTS.body,
          fontSize,
          fontWeight: WEIGHTS.medium,
          color: COLORS.text,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// === STRIKETHROUGH BULLET (for WhoToSellTo scene) ===
export const StrikethroughBullet: React.FC<{
  text: string;
  reason: string;
  startFrame?: number;
  index?: number;
  staggerDelay?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  reason,
  startFrame = 0,
  index = 0,
  staggerDelay = 15,
  fontSize = 36,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = startFrame + index * staggerDelay;

  // Text appears first
  const textProgress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIG.smooth,
  });

  // Strikethrough sweeps across after text appears
  const strikeDelay = delay + 20;
  const strikeProgress = interpolate(
    frame - strikeDelay,
    [0, 15],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // X mark pops in after strike
  const xProgress = spring({
    frame: frame - strikeDelay - 10,
    fps,
    config: SPRING_CONFIG.bouncy,
  });

  // Reason text appears after X
  const reasonProgress = spring({
    frame: frame - strikeDelay - 18,
    fps,
    config: SPRING_CONFIG.gentle,
  });

  const opacity = interpolate(textProgress, [0, 1], [0, 1]);
  const translateX = interpolate(textProgress, [0, 1], [30, 0]);
  const xScale = interpolate(xProgress, [0, 1], [0, 1.2]);
  const reasonOpacity = interpolate(reasonProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        opacity,
        transform: `translateX(${translateX}px)`,
        ...style,
      }}
    >
      {/* X Mark */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: COLORS.danger,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${xScale})`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 22, color: '#fff', fontWeight: 800 }}>✕</span>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Main text with strikethrough */}
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize,
            fontWeight: WEIGHTS.bold,
            color: strikeProgress > 50 ? COLORS.textDim : COLORS.text,
            position: 'relative',
            transition: 'color 0.3s',
          }}
        >
          {text}
          {/* Animated strike line */}
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              height: 3,
              width: `${strikeProgress}%`,
              background: COLORS.danger,
              transform: 'translateY(-50%)',
            }}
          />
        </span>

        {/* Reason text */}
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: fontSize * 0.55,
            fontWeight: WEIGHTS.regular,
            color: COLORS.danger,
            opacity: reasonOpacity,
            marginTop: 4,
          }}
        >
          {reason}
        </div>
      </div>
    </div>
  );
};
