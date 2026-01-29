import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS, WEIGHTS, SPRING_CONFIG, PRODUCTS } from '../styles/constants';
import { LetterByLetter } from '../components/AnimatedText';

// === RECAP CARD ===
const RecapCard: React.FC<{
  icon: string;
  text: string;
  color: string;
  startFrame: number;
  index: number;
}> = ({ icon, text, color, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = startFrame + index * 10;

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIG.bouncy,
  });

  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '24px 28px',
        background: `${color}08`,
        border: `1px solid ${color}25`,
        borderRadius: 16,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        minWidth: 180,
      }}
    >
      <span style={{ fontSize: 40 }}>{icon}</span>
      <span
        style={{
          fontFamily: FONTS.body,
          fontSize: 18,
          fontWeight: WEIGHTS.semibold,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene is 300 frames (10 seconds)
  // Recap cards: 0-80
  // Formula text: 80-160
  // CTA: 160-240
  // Fade out: 240-300

  const recapItems = [
    { icon: '🛠️', text: '4 Products', color: COLORS.primary },
    { icon: '🎯', text: 'Mid-Market', color: COLORS.success },
    { icon: '📱', text: 'Content', color: COLORS.secondary },
    { icon: '🤝', text: 'Network', color: COLORS.accent1 },
  ];

  // "The Formula" headline
  const formulaDelay = 80;
  const formulaProgress = spring({
    frame: frame - formulaDelay,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const formulaScale = interpolate(formulaProgress, [0, 1], [1.3, 1]);
  const formulaOpacity = interpolate(formulaProgress, [0, 1], [0, 1]);

  // Arrow connectors between recap cards
  const arrowDelay = 60;
  const arrowProgress = interpolate(frame - arrowDelay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA
  const ctaDelay = 160;
  const ctaProgress = spring({
    frame: frame - ctaDelay,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);
  const ctaTranslateY = interpolate(ctaProgress, [0, 1], [20, 0]);

  // "Go." slam
  const goDelay = 200;
  const goProgress = spring({
    frame: frame - goDelay,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const goScale = interpolate(goProgress, [0, 1], [2, 1]);
  const goOpacity = interpolate(goProgress, [0, 1], [0, 1]);

  // Final fade to black
  const fadeToBlack = interpolate(frame, [260, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Particle burst on "Go."
  const burstParticles = Array.from({ length: 20 }).map((_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const burstProgress = interpolate(frame - goDelay, [0, 40], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const distance = burstProgress * 300;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const particleOpacity = interpolate(burstProgress, [0, 0.3, 1], [0, 1, 0]);
    const size = 4 + (i % 3) * 2;
    return { x, y, opacity: particleOpacity, size, i };
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
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}15, transparent 70%)`,
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

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          zIndex: 10,
        }}
      >
        {/* Recap Cards Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {recapItems.map((item, i) => (
            <React.Fragment key={i}>
              <RecapCard
                icon={item.icon}
                text={item.text}
                color={item.color}
                startFrame={10}
                index={i}
              />
              {i < recapItems.length - 1 && (
                <div
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 28,
                    color: COLORS.textDim,
                    opacity: arrowProgress,
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* The Formula line */}
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 44,
            fontWeight: WEIGHTS.bold,
            color: COLORS.text,
            textAlign: 'center',
            opacity: formulaOpacity,
            transform: `scale(${formulaScale})`,
          }}
        >
          Sell 4 things →{' '}
          <span style={{ color: COLORS.success }}>Mid-market</span> → Via{' '}
          <span style={{ color: COLORS.secondary }}>content + network</span>
        </div>

        {/* CTA area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            opacity: ctaOpacity,
            transform: `translateY(${ctaTranslateY}px)`,
          }}
        >
          <div
            style={{
              width: 120,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 24,
              fontWeight: WEIGHTS.medium,
              color: COLORS.textMuted,
              textAlign: 'center',
            }}
          >
            Your AI Agency Blueprint for 2026
          </div>
        </div>

        {/* "GO." slam text */}
        <div style={{ position: 'relative' }}>
          {/* Burst particles */}
          {burstParticles.map((p) => (
            <div
              key={p.i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background:
                  p.i % 2 === 0 ? COLORS.primary : COLORS.secondary,
                opacity: p.opacity,
                transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
              }}
            />
          ))}

          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 120,
              fontWeight: WEIGHTS.black,
              opacity: goOpacity,
              transform: `scale(${goScale})`,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: `drop-shadow(0 0 40px ${COLORS.primary}40)`,
            }}
          >
            GO.
          </div>
        </div>
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          opacity: fadeToBlack,
          zIndex: 50,
        }}
      />
    </div>
  );
};
