import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONT } from '../styles/constants';

interface CountUpProps {
  startFrame?: number;
  endFrame?: number;
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  decimals?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  startFrame = 0,
  endFrame = 60,
  from = 0,
  to,
  prefix = '',
  suffix = '',
  fontSize = 96,
  color = COLORS.primary,
  fontWeight = FONT.weight.black,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const displayValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <div
      style={{
        fontSize,
        fontFamily: FONT.family,
        fontWeight,
        color,
        opacity,
        textAlign: 'center',
        lineHeight: 1,
        textShadow: `0 0 60px ${color}50`,
      }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </div>
  );
};

interface PulsingCountProps {
  value: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  pulseSpeed?: number;
}

export const PulsingCount: React.FC<PulsingCountProps> = ({
  value,
  startFrame = 0,
  fontSize = 120,
  color = COLORS.secondary,
  pulseSpeed = 20,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = frame > startFrame
    ? 1 + 0.03 * Math.sin(((frame - startFrame) / pulseSpeed) * Math.PI * 2)
    : 0;

  return (
    <div
      style={{
        fontSize,
        fontFamily: FONT.family,
        fontWeight: FONT.weight.black,
        color,
        opacity,
        transform: `scale(${pulse})`,
        textAlign: 'center',
        lineHeight: 1,
        textShadow: `0 0 80px ${color}60`,
      }}
    >
      {value}
    </div>
  );
};
