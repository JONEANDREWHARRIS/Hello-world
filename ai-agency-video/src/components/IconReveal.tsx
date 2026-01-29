import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIG } from '../styles/constants';

export const IconReveal: React.FC<{
  icon: string;
  startFrame?: number;
  size?: number;
  color?: string;
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({
  icon,
  startFrame = 0,
  size = 80,
  color = COLORS.primary,
  glowColor,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIG.bouncy,
  });

  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const rotate = interpolate(progress, [0, 1], [-15, 0]);

  // Glow ring expands and fades
  const ringProgress = spring({
    frame: frame - startFrame - 5,
    fps,
    config: SPRING_CONFIG.gentle,
  });
  const ringScale = interpolate(ringProgress, [0, 1], [0.5, 1.3]);
  const ringOpacity = interpolate(ringProgress, [0, 1], [0.6, 0]);

  const effectiveGlow = glowColor || color;

  return (
    <div
      style={{
        position: 'relative',
        width: size * 1.8,
        height: size * 1.8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.6,
          height: size * 1.6,
          borderRadius: '50%',
          border: `2px solid ${effectiveGlow}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />

      {/* Background circle */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: '50%',
          background: `${color}15`,
          border: `2px solid ${color}30`,
          transform: `scale(${scale})`,
          opacity,
        }}
      />

      {/* Icon */}
      <span
        style={{
          fontSize: size,
          opacity,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          display: 'inline-block',
          lineHeight: 1,
          filter: `drop-shadow(0 0 12px ${effectiveGlow}60)`,
        }}
      >
        {icon}
      </span>
    </div>
  );
};

// === ICON WITH LABEL ===
export const IconWithLabel: React.FC<{
  icon: string;
  label: string;
  startFrame?: number;
  size?: number;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({
  icon,
  label,
  startFrame = 0,
  size = 60,
  color = COLORS.primary,
  fontSize = 20,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIG.smooth,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.6, 1]);

  const labelProgress = spring({
    frame: frame - startFrame - 10,
    fps,
    config: SPRING_CONFIG.gentle,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelTranslateY = interpolate(labelProgress, [0, 1], [10, 0]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <span
        style={{
          fontSize: size,
          filter: `drop-shadow(0 0 10px ${color}50)`,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize,
          fontWeight: 500,
          color: COLORS.textMuted,
          opacity: labelOpacity,
          transform: `translateY(${labelTranslateY}px)`,
        }}
      >
        {label}
      </span>
    </div>
  );
};
