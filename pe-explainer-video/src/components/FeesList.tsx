import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

interface FeeItem {
  label: string;
  sublabel?: string;
  icon?: string;
}

interface FeesListProps {
  items: FeeItem[];
  startFrame?: number;
  staggerDelay?: number;
  fontSize?: number;
  accentColor?: string;
}

export const FeesList: React.FC<FeesListProps> = ({
  items,
  startFrame = 0,
  staggerDelay = 30,
  fontSize = 48,
  accentColor = COLORS.primary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {items.map((item, i) => {
        const delay = startFrame + i * staggerDelay;
        const slideProgress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIG.snappy,
        });
        const translateX = interpolate(slideProgress, [0, 1], [-400, 0]);
        const opacity = interpolate(slideProgress, [0, 1], [0, 1]);

        // Accent bar grows in
        const barProgress = spring({
          frame: frame - delay - 5,
          fps,
          config: SPRING_CONFIG.smooth,
        });
        const barWidth = interpolate(barProgress, [0, 1], [0, 6]);

        // Checkmark appears after text
        const checkProgress = spring({
          frame: frame - delay - 15,
          fps,
          config: SPRING_CONFIG.bouncy,
        });
        const checkScale = interpolate(checkProgress, [0, 1], [0, 1]);
        const checkOpacity = interpolate(checkProgress, [0, 1], [0, 1]);

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              transform: `translateX(${translateX}px)`,
              opacity,
            }}
          >
            {/* Accent bar */}
            <div
              style={{
                width: barWidth,
                height: fontSize * 1.2,
                backgroundColor: accentColor,
                borderRadius: 3,
                boxShadow: `0 0 15px ${accentColor}50`,
              }}
            />
            {/* Fee text */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize,
                  fontFamily: FONT.family,
                  fontWeight: FONT.weight.bold,
                  color: COLORS.white,
                  lineHeight: 1.2,
                }}
              >
                {item.label}
              </div>
              {item.sublabel && (
                <div
                  style={{
                    fontSize: fontSize * 0.5,
                    fontFamily: FONT.family,
                    fontWeight: FONT.weight.regular,
                    color: COLORS.whiteAlpha60,
                    marginTop: 4,
                  }}
                >
                  {item.sublabel}
                </div>
              )}
            </div>
            {/* Checkmark / dollar sign */}
            <div
              style={{
                fontSize: fontSize * 0.8,
                opacity: checkOpacity,
                transform: `scale(${checkScale})`,
                color: accentColor,
              }}
            >
              {item.icon || '💰'}
            </div>
          </div>
        );
      })}
    </div>
  );
};
