import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS, WEIGHTS, SPRING_CONFIG } from '../styles/constants';
import { SectionTitle } from '../components/SectionTitle';
import { CheckBullet } from '../components/BulletPoint';

// === ANIMATED COUNTER ===
const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
}> = ({
  value,
  suffix = '',
  startFrame,
  fontSize = 120,
  color = COLORS.primary,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const displayValue = Math.min(
    Math.round(
      interpolate(localFrame, [0, 40], [0, value], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    ),
    value
  );

  const scale = spring({
    frame: frame - startFrame,
    fps: 30,
    config: SPRING_CONFIG.bouncy,
  });
  const scaleVal = interpolate(scale, [0, 1], [0.5, 1]);
  const opacity = interpolate(scale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: FONTS.heading,
        fontSize,
        fontWeight: WEIGHTS.black,
        color,
        transform: `scale(${scaleVal})`,
        opacity,
        lineHeight: 1,
        textShadow: `0 0 40px ${color}40`,
      }}
    >
      {displayValue}
      {suffix}
    </div>
  );
};

export const TechnicalSkills: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene is 300 frames (10 seconds)
  // Counter reveal: frames 0-60
  // Bullets: frames 60-220
  // Summary: frames 220-300

  // "1 Month of Weekends" - big counter
  const counterVisible = frame >= 10;

  // Label under counter
  const labelProgress = spring({
    frame: frame - 55,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelTranslateY = interpolate(labelProgress, [0, 1], [15, 0]);

  // Bullet points
  const bullets = [
    { text: 'Master ONE system, not all four', icon: '🎯' },
    { text: 'No-code tools are enough', icon: '🛠️' },
    { text: 'Learn by building real projects', icon: '🚀' },
  ];

  // Decorative progress ring
  const ringProgress = interpolate(frame, [10, 80], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Summary line
  const summaryProgress = spring({
    frame: frame - 220,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const summaryOpacity = interpolate(summaryProgress, [0, 1], [0, 1]);

  // Exit
  const exitOpacity = interpolate(frame, [265, 295], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(frame, [265, 295], [1, 0.97], {
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
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.success}12, transparent 70%)`,
          top: '20%',
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
          title="Technical Reality"
          startFrame={0}
          fontSize={52}
          accentColor={COLORS.success}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 100,
          marginTop: 20,
        }}
      >
        {/* Left: Counter with ring */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
          }}
        >
          {/* Progress ring */}
          <svg
            width={260}
            height={260}
            style={{ position: 'absolute', top: -30, left: -30 }}
          >
            <circle
              cx={130}
              cy={130}
              r={120}
              stroke={`${COLORS.success}15`}
              strokeWidth={4}
              fill="none"
            />
            <circle
              cx={130}
              cy={130}
              r={120}
              stroke={COLORS.success}
              strokeWidth={4}
              fill="none"
              strokeDasharray={`${ringProgress * 7.54} ${754 - ringProgress * 7.54}`}
              strokeDashoffset={188.5}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.1s' }}
            />
          </svg>

          {counterVisible && (
            <AnimatedCounter
              value={1}
              startFrame={10}
              fontSize={140}
              color={COLORS.success}
            />
          )}

          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 28,
              fontWeight: WEIGHTS.bold,
              color: COLORS.textMuted,
              opacity: labelOpacity,
              transform: `translateY(${labelTranslateY}px)`,
              textAlign: 'center',
            }}
          >
            Month of Weekends
          </div>
        </div>

        {/* Right: Bullet points */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {bullets.map((bullet, i) => (
            <CheckBullet
              key={i}
              text={bullet.text}
              startFrame={80 + i * 25}
              index={0}
              checked={true}
              fontSize={32}
            />
          ))}
        </div>
      </div>

      {/* Summary line */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          opacity: summaryOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 36,
            fontWeight: WEIGHTS.bold,
            color: COLORS.text,
            textAlign: 'center',
            padding: '16px 48px',
            background: `${COLORS.success}08`,
            border: `1px solid ${COLORS.success}20`,
            borderRadius: 16,
          }}
        >
          1 month. No-code tools.{' '}
          <span style={{ color: COLORS.success }}>Pick ONE specialty.</span>
        </div>
      </div>
    </div>
  );
};
