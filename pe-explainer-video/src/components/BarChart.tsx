import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

interface BarData {
  label: string;
  value: number;
  displayValue: string;
  color: string;
}

interface BarChartProps {
  bars: BarData[];
  startFrame?: number;
  maxHeight?: number;
  barWidth?: number;
  gap?: number;
  staggerDelay?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  bars,
  startFrame = 0,
  maxHeight = 400,
  barWidth = 280,
  gap = 80,
  staggerDelay = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...bars.map((b) => b.value));
  const totalWidth = bars.length * barWidth + (bars.length - 1) * gap;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap,
        height: maxHeight + 120,
        width: totalWidth,
      }}
    >
      {bars.map((bar, i) => {
        const delay = startFrame + i * staggerDelay;
        const growProgress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIG.smooth,
        });
        const barHeight = interpolate(
          growProgress,
          [0, 1],
          [0, (bar.value / maxValue) * maxHeight]
        );
        const labelOpacity = interpolate(
          growProgress,
          [0.5, 1],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Count-up for the display value
        const countProgress = interpolate(
          frame,
          [delay, delay + 60],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const numericValue = parseInt(bar.displayValue.replace(/[^0-9]/g, ''));
        const currentNum = Math.round(numericValue * countProgress);
        const displayPrefix = bar.displayValue.match(/^\D*/)?.[0] || '';
        const displaySuffix = bar.displayValue.match(/\D*$/)?.[0] || '';
        const countedDisplay = `${displayPrefix}${currentNum}${displaySuffix}`;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.black,
                color: bar.color,
                opacity: labelOpacity,
                textShadow: `0 0 20px ${bar.color}40`,
              }}
            >
              {countedDisplay}
            </div>
            <div
              style={{
                width: barWidth,
                height: barHeight,
                background: `linear-gradient(to top, ${bar.color}80, ${bar.color})`,
                borderRadius: '8px 8px 0 0',
                boxShadow: `0 0 30px ${bar.color}30`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: bar.color,
                  borderRadius: '8px 8px 0 0',
                  boxShadow: `0 0 20px ${bar.color}`,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 22,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.semibold,
                color: COLORS.whiteAlpha80,
                opacity: labelOpacity,
                textAlign: 'center',
                maxWidth: barWidth,
                lineHeight: 1.3,
              }}
            >
              {bar.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
