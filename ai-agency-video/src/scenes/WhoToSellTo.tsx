import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS, WEIGHTS, SPRING_CONFIG, MARKETS } from '../styles/constants';
import { SectionTitle } from '../components/SectionTitle';
import { StrikethroughBullet } from '../components/BulletPoint';

export const WhoToSellTo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene is 750 frames (25 seconds)
  // Title: 0-40
  // Bad options: 40-300
  // Transition: 300-350
  // Sweet spot: 350-550
  // Niche advice: 550-700
  // Exit: 700-750

  // === BAD OPTIONS ===
  // Mom & Pop Shops strikethrough
  // Enterprise strikethrough

  // === SWEET SPOT REVEAL ===
  const sweetSpotDelay = 300;
  const sweetProgress = spring({
    frame: frame - sweetSpotDelay,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const sweetScale = interpolate(sweetProgress, [0, 1], [0.7, 1]);
  const sweetOpacity = interpolate(sweetProgress, [0, 1], [0, 1]);

  // Green glow pulse for sweet spot
  const glowPulse = interpolate(
    Math.sin((frame - sweetSpotDelay) * 0.05),
    [-1, 1],
    [0.3, 0.8]
  );

  // Revenue range counter
  const revenueProgress = spring({
    frame: frame - sweetSpotDelay - 20,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const revenueOpacity = interpolate(revenueProgress, [0, 1], [0, 1]);

  // "Pick a niche you know" reveal
  const nicheDelay = 500;
  const nicheProgress = spring({
    frame: frame - nicheDelay,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const nicheOpacity = interpolate(nicheProgress, [0, 1], [0, 1]);
  const nicheTranslateY = interpolate(nicheProgress, [0, 1], [30, 0]);

  // Summary
  const summaryDelay = 600;
  const summaryProgress = spring({
    frame: frame - summaryDelay,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const summaryOpacity = interpolate(summaryProgress, [0, 1], [0, 1]);

  // Exit
  const exitOpacity = interpolate(frame, [710, 745], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(frame, [710, 745], [1, 0.97], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Target visual - animated rings
  const targetRing1 = interpolate(frame - sweetSpotDelay, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const targetRing2 = interpolate(frame - sweetSpotDelay - 10, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const targetRing3 = interpolate(frame - sweetSpotDelay - 20, [0, 30], [0, 1], {
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
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}10, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.text}03 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.text}03 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Section Title */}
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0 }}>
        <SectionTitle
          title="Who To Sell To"
          startFrame={0}
          fontSize={52}
          accentColor={COLORS.primary}
        />
      </div>

      {/* Main content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 50,
          marginTop: 30,
        }}
      >
        {/* BAD OPTIONS (visible frames 40-350) */}
        {frame < 450 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
              opacity: frame > 350 ? interpolate(frame, [350, 400], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }) : 1,
            }}
          >
            {/* Skip header */}
            {frame >= 30 && (
              <div
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 32,
                  fontWeight: WEIGHTS.bold,
                  color: COLORS.danger,
                  textAlign: 'center',
                  opacity: interpolate(
                    spring({ frame: frame - 30, fps, config: SPRING_CONFIG.smooth }),
                    [0, 1],
                    [0, 1]
                  ),
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                ✕ Skip These ✕
              </div>
            )}

            <StrikethroughBullet
              text="Mom & Pop Shops"
              reason="No budget for AI services"
              startFrame={50}
              index={0}
              fontSize={40}
            />

            <StrikethroughBullet
              text="Enterprise Companies"
              reason="6-month sales cycles, red tape"
              startFrame={50}
              index={1}
              staggerDelay={60}
              fontSize={40}
            />
          </div>
        )}

        {/* SWEET SPOT (visible from frame 300+) */}
        {frame >= sweetSpotDelay && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 60,
              opacity: sweetOpacity,
              transform: `scale(${sweetScale})`,
            }}
          >
            {/* Target graphic */}
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              {/* Outer ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `3px solid ${COLORS.success}30`,
                  transform: `scale(${targetRing1})`,
                }}
              />
              {/* Middle ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 30,
                  borderRadius: '50%',
                  border: `3px solid ${COLORS.success}50`,
                  transform: `scale(${targetRing2})`,
                }}
              />
              {/* Inner ring / bullseye */}
              <div
                style={{
                  position: 'absolute',
                  inset: 60,
                  borderRadius: '50%',
                  background: `${COLORS.success}20`,
                  border: `3px solid ${COLORS.success}`,
                  transform: `scale(${targetRing3})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 ${40 * glowPulse}px ${COLORS.success}40`,
                }}
              >
                <span style={{ fontSize: 36 }}>🎯</span>
              </div>
            </div>

            {/* Sweet spot text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 22,
                  fontWeight: WEIGHTS.semibold,
                  color: COLORS.success,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                Sweet Spot
              </div>

              <div
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 56,
                  fontWeight: WEIGHTS.black,
                  color: COLORS.text,
                  lineHeight: 1.1,
                  opacity: revenueOpacity,
                }}
              >
                £2M – £10M{' '}
                <span style={{ color: COLORS.success }}>ARR</span>
              </div>

              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 24,
                  fontWeight: WEIGHTS.medium,
                  color: COLORS.textMuted,
                  opacity: revenueOpacity,
                }}
              >
                Budget + agility. Decision makers accessible.
              </div>
            </div>
          </div>
        )}

        {/* NICHE ADVICE */}
        {frame >= nicheDelay && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              opacity: nicheOpacity,
              transform: `translateY(${nicheTranslateY}px)`,
            }}
          >
            <div
              style={{
                width: 80,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 36,
                fontWeight: WEIGHTS.bold,
                color: COLORS.text,
                textAlign: 'center',
              }}
            >
              Pick a niche{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                you already know
              </span>
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 22,
                color: COLORS.textMuted,
              }}
            >
              Real estate, e-commerce, SaaS, healthcare...
            </div>
          </div>
        )}

        {/* SUMMARY BAR */}
        {frame >= summaryDelay && (
          <div
            style={{
              position: 'absolute',
              bottom: 80,
              opacity: summaryOpacity,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 30,
                fontWeight: WEIGHTS.bold,
                color: COLORS.text,
                padding: '14px 40px',
                background: `${COLORS.primary}08`,
                border: `1px solid ${COLORS.primary}20`,
                borderRadius: 14,
              }}
            >
              Skip broke shops. Skip enterprise red tape.{' '}
              <span style={{ color: COLORS.success }}>Target the middle.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
