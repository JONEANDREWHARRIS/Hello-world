import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { COLORS, FONTS, WEIGHTS, SPRING_CONFIG } from '../styles/constants';
import { LetterByLetter, BlurReveal } from '../components/AnimatedText';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === BACKGROUND PARTICLES ===
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const x = (i * 137.5) % 1920;
    const baseY = (i * 191.3) % 1080;
    const y = baseY + Math.sin((frame + i * 20) * 0.02) * 40;
    const size = 2 + (i % 4);
    const particleOpacity = interpolate(
      frame,
      [0, 30, 270, 300],
      [0, 0.15 + (i % 3) * 0.1, 0.15 + (i % 3) * 0.1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return { x, y, size, opacity: particleOpacity, i };
  });

  // === "2026" YEAR - Big background text ===
  const yearProgress = spring({
    frame: frame - 5,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const yearScale = interpolate(yearProgress, [0, 1], [2, 1]);
  const yearOpacity = interpolate(yearProgress, [0, 1], [0, 0.06]);

  // === MAIN TITLE - "Starting an AI Agency" ===
  // This uses LetterByLetter but we also add a container animation
  const titleContainerProgress = spring({
    frame: frame - 15,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const titleScale = interpolate(titleContainerProgress, [0, 1], [0.9, 1]);
  const titleOpacity = interpolate(titleContainerProgress, [0, 1], [0, 1]);

  // === "in 2026" accent line ===
  const accentProgress = spring({
    frame: frame - 50,
    fps,
    config: SPRING_CONFIG.bouncy,
  });
  const accentScale = interpolate(accentProgress, [0, 1], [0.5, 1]);
  const accentOpacity = interpolate(accentProgress, [0, 1], [0, 1]);

  // === Gradient line divider ===
  const lineProgress = interpolate(frame - 80, [0, 20], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === BADGE: "No ML Degree Needed" ===
  const badgeProgress = spring({
    frame: frame - 100,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);
  const badgeTranslateY = interpolate(badgeProgress, [0, 1], [20, 0]);

  // === Exit animation ===
  const exitOpacity = interpolate(frame, [260, 295], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(frame, [260, 295], [1, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      {/* Animated gradient background orbs */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}20, transparent 70%)`,
          top: '20%',
          left: '30%',
          transform: `translate(${Math.sin(frame * 0.015) * 50}px, ${Math.cos(frame * 0.01) * 30}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.secondary}15, transparent 70%)`,
          bottom: '10%',
          right: '20%',
          transform: `translate(${Math.cos(frame * 0.012) * 40}px, ${Math.sin(frame * 0.018) * 25}px)`,
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.i % 2 === 0 ? COLORS.primary : COLORS.secondary,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Background "2026" */}
      <div
        style={{
          position: 'absolute',
          fontFamily: FONTS.heading,
          fontSize: 300,
          fontWeight: WEIGHTS.black,
          color: COLORS.text,
          opacity: yearOpacity,
          transform: `scale(${yearScale})`,
          letterSpacing: -10,
        }}
      >
        2026
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          zIndex: 10,
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        {/* Main title */}
        <LetterByLetter
          text="Starting an AI Agency"
          startFrame={15}
          fontSize={88}
          fontWeight={WEIGHTS.black}
          staggerFrames={2}
          style={{ letterSpacing: -2 }}
        />

        {/* "in 2026" accent */}
        <div
          style={{
            opacity: accentOpacity,
            transform: `scale(${accentScale})`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.heading,
              fontSize: 64,
              fontWeight: WEIGHTS.black,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            in 2026
          </span>
        </div>

        {/* Gradient line divider */}
        <div
          style={{
            width: 300,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.primary}, ${COLORS.secondary}, transparent)`,
            transform: `scaleX(${lineProgress / 100})`,
            marginTop: 10,
            marginBottom: 10,
          }}
        />

        {/* Subtitle / badge */}
        <BlurReveal
          text="No ML degree required."
          startFrame={100}
          fontSize={34}
          color={COLORS.textMuted}
          fontWeight={WEIGHTS.medium}
        />

        {/* Badge pill */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeTranslateY}px)`,
            marginTop: 16,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 22,
              fontWeight: WEIGHTS.semibold,
              color: COLORS.secondary,
              background: `${COLORS.secondary}12`,
              border: `1px solid ${COLORS.secondary}30`,
              borderRadius: 100,
              padding: '10px 32px',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            The Complete Blueprint
          </div>
        </div>
      </div>

      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.text}04 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.text}04 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.5,
        }}
      />
    </div>
  );
};
