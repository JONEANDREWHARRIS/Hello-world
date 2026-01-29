import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS, WEIGHTS, SPRING_CONFIG, ACQUISITION } from '../styles/constants';
import { SectionTitle } from '../components/SectionTitle';
import { WordByWord } from '../components/AnimatedText';

// === ANIMATED PIE CHART ===
const PieChart: React.FC<{
  demandPct: number;
  supplyPct: number;
  startFrame: number;
  size?: number;
}> = ({ demandPct, supplyPct, startFrame, size = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame - startFrame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const demandAngle = demandPct * 3.6 * progress; // 90% = 324 degrees
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  // Convert angle to radians for SVG arc
  const demandEndAngle = (demandAngle - 90) * (Math.PI / 180);
  const demandX = cx + r * Math.cos(demandEndAngle);
  const demandY = cy + r * Math.sin(demandEndAngle);
  const largeArc = demandAngle > 180 ? 1 : 0;

  // Labels
  const labelProgress = spring({
    frame: frame - startFrame - 30,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(0deg)' }}>
        {/* Background circle (supply - 10%) */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={COLORS.secondary}
          strokeWidth={40}
          opacity={progress > 0 ? 0.3 : 0}
        />

        {/* Demand arc (90%) */}
        {progress > 0 && (
          <path
            d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${demandX} ${demandY}`}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={40}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 32,
            fontWeight: WEIGHTS.black,
            color: COLORS.text,
            opacity: labelOpacity,
          }}
        >
          Time Split
        </div>
      </div>

      {/* Labels */}
      <div
        style={{
          position: 'absolute',
          top: -10,
          right: -180,
          opacity: labelOpacity,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: COLORS.primary,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.body,
              fontSize: 22,
              fontWeight: WEIGHTS.bold,
              color: COLORS.text,
            }}
          >
            {demandPct}% Getting Clients
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: COLORS.secondary,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.body,
              fontSize: 22,
              fontWeight: WEIGHTS.bold,
              color: COLORS.text,
            }}
          >
            {supplyPct}% Building
          </span>
        </div>
      </div>
    </div>
  );
};

// === FREQUENCY GRID ===
const FrequencyGrid: React.FC<{
  items: { platform: string; frequency: string }[];
  startFrame: number;
}> = ({ items, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'flex', gap: 30 }}>
      {items.map((item, i) => {
        const delay = startFrame + i * 15;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIG.smooth,
        });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [25, 0]);
        const scale = interpolate(progress, [0, 1], [0.85, 1]);

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '24px 36px',
              background: COLORS.backgroundLight,
              border: `1px solid ${COLORS.primary}25`,
              borderRadius: 16,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              minWidth: 200,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 36,
                fontWeight: WEIGHTS.black,
                color: COLORS.secondary,
              }}
            >
              {item.frequency}
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 20,
                fontWeight: WEIGHTS.medium,
                color: COLORS.textMuted,
              }}
            >
              {item.platform}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// === MAIN SCENE ===
export const HowToGetClients: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene is 750 frames (25 seconds)
  // Title: 0-40
  // Pie chart section: 40-200
  // Warm network: 200-380
  // Social media: 380-580
  // 100 posts milestone: 580-700
  // Exit: 700-750

  // === WARM NETWORK SECTION ===
  const warmDelay = 200;
  const warmProgress = spring({
    frame: frame - warmDelay,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const warmOpacity = interpolate(warmProgress, [0, 1], [0, 1]);
  const warmTranslateX = interpolate(warmProgress, [0, 1], [-50, 0]);

  // Warm network exit
  const warmExit = interpolate(frame, [360, 390], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === SOCIAL SECTION ===
  const socialDelay = 380;
  const socialProgress = spring({
    frame: frame - socialDelay,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const socialOpacity = interpolate(socialProgress, [0, 1], [0, 1]);

  // Social exit
  const socialExit = interpolate(frame, [560, 590], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === 100 POSTS MILESTONE ===
  const milestoneDelay = 580;
  const milestoneProgress = spring({
    frame: frame - milestoneDelay,
    fps,
    config: SPRING_CONFIG.slam,
  });
  const milestoneScale = interpolate(milestoneProgress, [0, 1], [0.6, 1]);
  const milestoneOpacity = interpolate(milestoneProgress, [0, 1], [0, 1]);

  // Counter for posts
  const postCount = Math.min(
    Math.round(
      interpolate(frame - milestoneDelay, [0, 50], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    ),
    100
  );

  const daysCount = Math.min(
    Math.round(
      interpolate(frame - milestoneDelay - 15, [0, 50], [0, 50], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    ),
    50
  );

  // === PIE CHART EXIT ===
  const pieExit = interpolate(frame, [180, 210], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit
  const exitOpacity = interpolate(frame, [710, 745], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(frame, [710, 745], [1, 0.97], {
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
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}10, transparent 70%)`,
          top: '40%',
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
          title="How To Get Clients"
          startFrame={0}
          fontSize={52}
          accentColor={COLORS.secondary}
        />
      </div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          marginTop: 30,
        }}
      >
        {/* PIE CHART (frames 40-200) */}
        {frame >= 40 && frame < 220 && (
          <div style={{ opacity: pieExit }}>
            <PieChart
              demandPct={ACQUISITION.split.demand}
              supplyPct={ACQUISITION.split.supply}
              startFrame={40}
              size={260}
            />
          </div>
        )}

        {/* WARM NETWORK (frames 200-380) */}
        {frame >= warmDelay && frame < 400 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              opacity: warmOpacity * warmExit,
              transform: `translateX(${warmTranslateX}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 20,
                fontWeight: WEIGHTS.semibold,
                color: COLORS.secondary,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              Method 1: Warm Network
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 100,
                  fontWeight: WEIGHTS.black,
                  color: COLORS.primary,
                  textShadow: `0 0 30px ${COLORS.primary}40`,
                }}
              >
                30-50
              </span>
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 36,
                  fontWeight: WEIGHTS.bold,
                  color: COLORS.textMuted,
                }}
              >
                contacts
              </span>
            </div>

            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 32,
                fontWeight: WEIGHTS.bold,
                color: COLORS.text,
              }}
            >
              ={' '}
              <span style={{ color: COLORS.success }}>Your first client</span>
            </div>

            {/* Contact dots visualization */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                maxWidth: 400,
                justifyContent: 'center',
                marginTop: 8,
              }}
            >
              {Array.from({ length: 40 }).map((_, i) => {
                const dotDelay = warmDelay + 30 + i * 1.5;
                const dotProg = spring({
                  frame: frame - dotDelay,
                  fps,
                  config: SPRING_CONFIG.snappy,
                });
                const dotScale = interpolate(dotProg, [0, 1], [0, 1]);
                const isHighlighted = i === 37; // One "conversion" dot

                return (
                  <div
                    key={i}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: isHighlighted ? COLORS.success : `${COLORS.primary}60`,
                      transform: `scale(${dotScale})`,
                      boxShadow: isHighlighted
                        ? `0 0 8px ${COLORS.success}`
                        : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* SOCIAL MEDIA (frames 380-580) */}
        {frame >= socialDelay && frame < 600 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
              opacity: socialOpacity * socialExit,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 20,
                fontWeight: WEIGHTS.semibold,
                color: COLORS.secondary,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              Method 2: Social Media
            </div>

            <FrequencyGrid
              items={ACQUISITION.social}
              startFrame={socialDelay + 15}
            />

            <WordByWord
              text="Consistency beats virality. Every. Single. Time."
              startFrame={socialDelay + 50}
              fontSize={26}
              color={COLORS.textMuted}
              fontWeight={WEIGHTS.medium}
              staggerFrames={4}
            />
          </div>
        )}

        {/* 100 POSTS MILESTONE (frames 580-700) */}
        {frame >= milestoneDelay && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              opacity: milestoneOpacity,
              transform: `scale(${milestoneScale})`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 28,
                fontWeight: WEIGHTS.bold,
                color: COLORS.textMuted,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              The Rule
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 40,
              }}
            >
              {/* Posts counter */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 100,
                    fontWeight: WEIGHTS.black,
                    color: COLORS.primary,
                    lineHeight: 1,
                    textShadow: `0 0 40px ${COLORS.primary}40`,
                  }}
                >
                  {postCount}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 24,
                    fontWeight: WEIGHTS.semibold,
                    color: COLORS.textMuted,
                  }}
                >
                  posts
                </span>
              </div>

              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 48,
                  color: COLORS.textDim,
                }}
              >
                =
              </span>

              {/* Days counter */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 100,
                    fontWeight: WEIGHTS.black,
                    color: COLORS.secondary,
                    lineHeight: 1,
                    textShadow: `0 0 40px ${COLORS.secondary}40`,
                  }}
                >
                  {daysCount}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 24,
                    fontWeight: WEIGHTS.semibold,
                    color: COLORS.textMuted,
                  }}
                >
                  days to results
                </span>
              </div>
            </div>

            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 30,
                fontWeight: WEIGHTS.bold,
                color: COLORS.text,
                marginTop: 12,
                padding: '12px 36px',
                background: `${COLORS.primary}08`,
                border: `1px solid ${COLORS.primary}20`,
                borderRadius: 14,
              }}
            >
              100 posts before you judge.{' '}
              <span style={{ color: COLORS.secondary }}>That's 50 days.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
