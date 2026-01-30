import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { WordByWord, FadeInText } from '../components/AnimatedText';
import { COLORS, FONT, SPRING_CONFIG } from '../styles/constants';

export const Scene3CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "This is how Wall Street flips companies like houses..."
  // Appears at start of scene

  // Line 2: "...except when the house burns down, someone else is living in it."
  // Appears around frame 120

  // House icon
  const houseProgress = spring({
    frame: frame - 160,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const houseScale = interpolate(houseProgress, [0, 1], [0, 1]);
  const houseOpacity = interpolate(houseProgress, [0, 1], [0, 1]);

  // Fire effect (after house appears)
  const fireStart = 210;
  const fireOpacity = interpolate(frame, [fireStart, fireStart + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fireFlicker = frame > fireStart ? 0.8 + 0.2 * Math.sin(frame * 0.5) : 0;

  // House color shifts to red as it burns
  const houseColorShift = interpolate(frame, [fireStart, fireStart + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Final text
  const finalProgress = spring({
    frame: frame - 300,
    fps,
    config: SPRING_CONFIG.gentle,
  });
  const finalOpacity = interpolate(finalProgress, [0, 1], [0, 1]);
  const finalY = interpolate(finalProgress, [0, 1], [30, 0]);

  // End card
  const endCardProgress = spring({
    frame: frame - 370,
    fps,
    config: SPRING_CONFIG.smooth,
  });
  const endCardOpacity = interpolate(endCardProgress, [0, 1], [0, 1]);

  // Final fade out
  const fadeOut = interpolate(frame, [420, 450], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.backgroundEnd}, ${COLORS.background})`,
        opacity: fadeOut,
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          {/* Line 1 */}
          <WordByWord
            text='This is how Wall Street flips companies like houses...'
            startFrame={10}
            fontSize={48}
            staggerDelay={4}
            highlightWords={{
              'Wall': COLORS.whiteAlpha80,
              'Street': COLORS.whiteAlpha80,
              flips: COLORS.primary,
              companies: COLORS.primary,
              'houses...': COLORS.secondary,
            }}
            maxWidth={1100}
          />

          {/* House icon with fire */}
          <div
            style={{
              position: 'relative',
              opacity: houseOpacity,
              transform: `scale(${houseScale})`,
              margin: '20px 0',
            }}
          >
            {/* House SVG */}
            <svg width={120} height={120} viewBox="0 0 120 120">
              {/* House body */}
              <rect
                x={25}
                y={55}
                width={70}
                height={55}
                fill={interpolate(houseColorShift, [0, 1], [0.2, 0]).toString() === '0'
                  ? COLORS.secondary
                  : COLORS.whiteAlpha20}
                rx={4}
                style={{
                  fill: `rgba(${Math.round(interpolate(houseColorShift, [0, 1], [255, 255]))}, ${Math.round(interpolate(houseColorShift, [0, 1], [255, 68]))}, ${Math.round(interpolate(houseColorShift, [0, 1], [255, 68]))}, 0.3)`,
                }}
              />
              {/* Roof */}
              <polygon
                points="60,10 10,58 110,58"
                fill={`rgba(${Math.round(interpolate(houseColorShift, [0, 1], [255, 255]))}, ${Math.round(interpolate(houseColorShift, [0, 1], [255, 68]))}, ${Math.round(interpolate(houseColorShift, [0, 1], [255, 68]))}, 0.5)`}
              />
              {/* Door */}
              <rect x={48} y={75} width={24} height={35} fill={COLORS.whiteAlpha20} rx={3} />
              {/* Window */}
              <rect x={32} y={68} width={16} height={16} fill={COLORS.whiteAlpha10} rx={2} />
              <rect x={72} y={68} width={16} height={16} fill={COLORS.whiteAlpha10} rx={2} />
            </svg>

            {/* Fire effect */}
            {frame > fireStart && (
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: fireOpacity * fireFlicker,
                  fontSize: 60,
                  filter: `brightness(${1 + fireFlicker * 0.3})`,
                }}
              >
                🔥
              </div>
            )}

            {/* Fire glow */}
            {frame > fireStart && (
              <div
                style={{
                  position: 'absolute',
                  top: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${COLORS.secondary}40, transparent)`,
                  opacity: fireOpacity * fireFlicker * 0.5,
                }}
              />
            )}
          </div>

          {/* Line 2 */}
          <WordByWord
            text="...except when the house burns down, someone else is living in it."
            startFrame={120}
            fontSize={48}
            staggerDelay={4}
            highlightWords={{
              'burns': COLORS.secondary,
              'down,': COLORS.secondary,
              'someone': COLORS.whiteAlpha80,
              'else': COLORS.whiteAlpha80,
              'it.': COLORS.secondary,
            }}
            maxWidth={1100}
          />

          {/* Final weight text */}
          <div
            style={{
              marginTop: 40,
              opacity: finalOpacity,
              transform: `translateY(${finalY}px)`,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.bold,
                color: COLORS.whiteAlpha60,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              The workers. The customers. The communities.
            </div>
          </div>

          {/* End card */}
          <div
            style={{
              opacity: endCardOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              marginTop: 30,
            }}
          >
            <div
              style={{
                width: 200,
                height: 2,
                background: `linear-gradient(to right, transparent, ${COLORS.whiteAlpha40}, transparent)`,
              }}
            />
            <div
              style={{
                fontSize: 22,
                fontFamily: FONT.family,
                fontWeight: FONT.weight.semibold,
                color: COLORS.whiteAlpha40,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              Follow for more
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
