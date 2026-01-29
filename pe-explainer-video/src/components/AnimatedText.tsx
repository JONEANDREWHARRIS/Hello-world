import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONT, SPRING_CONFIG, STAGGER } from '../styles/constants';

interface WordByWordProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  highlightWords?: Record<string, string>;
  staggerDelay?: number;
  centered?: boolean;
  fontWeight?: number;
  maxWidth?: number;
}

export const WordByWord: React.FC<WordByWordProps> = ({
  text,
  startFrame = 0,
  fontSize = 64,
  color = COLORS.white,
  highlightWords = {},
  staggerDelay = STAGGER.normal,
  centered = true,
  fontWeight = FONT.weight.bold,
  maxWidth = 1400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: centered ? 'center' : 'flex-start',
        gap: fontSize * 0.25,
        maxWidth,
      }}
    >
      {words.map((word, i) => {
        const delay = startFrame + i * staggerDelay;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIG.smooth,
        });
        const scale = interpolate(progress, [0, 1], [0.3, 1]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const blur = interpolate(progress, [0, 1], [8, 0]);
        const wordColor = highlightWords[word.toLowerCase()] || highlightWords[word] || color;

        return (
          <span
            key={i}
            style={{
              fontSize,
              fontFamily: FONT.family,
              fontWeight,
              color: wordColor,
              opacity,
              transform: `scale(${scale})`,
              filter: `blur(${blur}px)`,
              display: 'inline-block',
              lineHeight: 1.3,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

interface FadeInTextProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  centered?: boolean;
  duration?: number;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  startFrame = 0,
  fontSize = 48,
  color = COLORS.white,
  fontWeight = FONT.weight.bold,
  centered = true,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [startFrame, startFrame + duration], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        fontSize,
        fontFamily: FONT.family,
        fontWeight,
        color,
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: centered ? 'center' : 'left',
        lineHeight: 1.3,
      }}
    >
      {text}
    </div>
  );
};

interface ScaleInTextProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}

export const ScaleInText: React.FC<ScaleInTextProps> = ({
  text,
  startFrame = 0,
  fontSize = 80,
  color = COLORS.primary,
  fontWeight = FONT.weight.black,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontSize,
        fontFamily: FONT.family,
        fontWeight,
        color,
        opacity,
        transform: `scale(${scale})`,
        textAlign: 'center',
        lineHeight: 1.2,
        textShadow: `0 0 40px ${color}40`,
      }}
    >
      {text}
    </div>
  );
};

interface SlideInTextProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  direction?: 'left' | 'right';
}

export const SlideInText: React.FC<SlideInTextProps> = ({
  text,
  startFrame = 0,
  fontSize = 48,
  color = COLORS.white,
  fontWeight = FONT.weight.bold,
  direction = 'left',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIG.snappy,
  });
  const translateX = interpolate(
    progress,
    [0, 1],
    [direction === 'left' ? -200 : 200, 0]
  );
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontSize,
        fontFamily: FONT.family,
        fontWeight,
        color,
        opacity,
        transform: `translateX(${translateX}px)`,
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  );
};
