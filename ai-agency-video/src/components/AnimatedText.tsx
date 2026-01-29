import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { FONTS, WEIGHTS, COLORS, SPRING_CONFIG, STAGGER } from '../styles/constants';

// === WORD-BY-WORD REVEAL ===
export const WordByWord: React.FC<{
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  staggerFrames?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  fontSize = 32,
  color = COLORS.text,
  fontWeight = WEIGHTS.medium,
  staggerFrames = STAGGER.normal,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: fontSize * 0.3,
        justifyContent: 'center',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const delay = startFrame + i * staggerFrames;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIG.smooth,
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [20, 0]);
        const blur = interpolate(progress, [0, 1], [6, 0]);

        return (
          <span
            key={i}
            style={{
              fontFamily: FONTS.body,
              fontSize,
              fontWeight,
              color,
              opacity,
              transform: `translateY(${translateY}px)`,
              filter: `blur(${blur}px)`,
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// === LETTER-BY-LETTER REVEAL ===
export const LetterByLetter: React.FC<{
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  staggerFrames?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  fontSize = 72,
  color = COLORS.text,
  fontWeight = WEIGHTS.black,
  staggerFrames = 2,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split('');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {letters.map((letter, i) => {
        const delay = startFrame + i * staggerFrames;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIG.bouncy,
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [30, 0]);
        const scale = interpolate(progress, [0, 1], [0.5, 1]);

        return (
          <span
            key={i}
            style={{
              fontFamily: FONTS.heading,
              fontSize,
              fontWeight,
              color,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              display: 'inline-block',
              whiteSpace: letter === ' ' ? 'pre' : 'normal',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </div>
  );
};

// === BLUR-TO-SHARP TEXT ===
export const BlurReveal: React.FC<{
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  fontSize = 36,
  color = COLORS.textMuted,
  fontWeight = WEIGHTS.medium,
  duration = 20,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const opacity = interpolate(localFrame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const blur = interpolate(localFrame, [0, duration], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(localFrame, [0, duration], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        fontFamily: FONTS.body,
        fontSize,
        fontWeight,
        color,
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translateY(${translateY}px)`,
        textAlign: 'center',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// === HIGHLIGHT SWEEP TEXT ===
export const HighlightSweep: React.FC<{
  text: string;
  startFrame?: number;
  fontSize?: number;
  fontWeight?: number;
  baseColor?: string;
  highlightColor?: string;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  fontSize = 40,
  fontWeight = WEIGHTS.bold,
  baseColor = COLORS.text,
  highlightColor = COLORS.primary,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const sweepProgress = interpolate(localFrame, [0, 30], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        fontFamily: FONTS.heading,
        fontSize,
        fontWeight,
        color: baseColor,
        opacity,
        background: `linear-gradient(90deg, ${highlightColor} 0%, ${highlightColor} ${sweepProgress - 10}%, transparent ${sweepProgress}%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: sweepProgress > 5 ? 'transparent' : baseColor,
        backgroundClip: 'text',
        textAlign: 'center',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// === TYPEWRITER TEXT ===
export const TypewriterText: React.FC<{
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame = 0,
  fontSize = 28,
  color = COLORS.text,
  fontWeight = WEIGHTS.medium,
  charsPerFrame = 0.8,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const charsToShow = Math.min(
    Math.floor(Math.max(0, localFrame) * charsPerFrame),
    text.length
  );
  const visibleText = text.substring(0, charsToShow);
  const showCursor = localFrame >= 0 && charsToShow < text.length;

  return (
    <div
      style={{
        fontFamily: FONTS.body,
        fontSize,
        fontWeight,
        color,
        textAlign: 'center',
        ...style,
      }}
    >
      {visibleText}
      {showCursor && (
        <span
          style={{
            opacity: Math.sin(localFrame * 0.4) > 0 ? 1 : 0,
            color: COLORS.primary,
          }}
        >
          |
        </span>
      )}
    </div>
  );
};
