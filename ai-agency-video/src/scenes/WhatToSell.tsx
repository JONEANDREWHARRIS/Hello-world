import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS, WEIGHTS, SPRING_CONFIG, PRODUCTS } from '../styles/constants';
import { SectionTitle } from '../components/SectionTitle';
import { WordByWord } from '../components/AnimatedText';
import { IconReveal } from '../components/IconReveal';

// === PRODUCT CARD COMPONENT ===
const ProductCard: React.FC<{
  product: (typeof PRODUCTS)[number];
  index: number;
  cardStartFrame: number;
}> = ({ product, index, cardStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slides in from right
  const slideProgress = spring({
    frame: frame - cardStartFrame,
    fps,
    config: SPRING_CONFIG.smooth,
  });

  const translateX = interpolate(slideProgress, [0, 1], [200, 0]);
  const opacity = interpolate(slideProgress, [0, 1], [0, 1]);
  const scale = interpolate(slideProgress, [0, 1], [0.85, 1]);

  // Number counts up
  const numProgress = spring({
    frame: frame - cardStartFrame - 5,
    fps,
    config: SPRING_CONFIG.bouncy,
  });
  const numScale = interpolate(numProgress, [0, 1], [0, 1]);

  // Card border glow animation
  const glowIntensity = interpolate(
    Math.sin((frame - cardStartFrame) * 0.06),
    [-1, 1],
    [0.2, 0.6]
  );

  // Exit animation for this card (each card exits before next scene section)
  const cardDuration = 220; // frames each card is visible
  const exitStart = cardStartFrame + cardDuration;
  const exitOpacity = interpolate(
    frame,
    [exitStart, exitStart + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 40,
        opacity: opacity * exitOpacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        width: '100%',
        maxWidth: 1200,
      }}
    >
      {/* Left: Number + Icon */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          minWidth: 140,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 100,
            fontWeight: WEIGHTS.black,
            color: product.color,
            opacity: interpolate(numProgress, [0, 1], [0, 0.15]),
            transform: `scale(${numScale})`,
            lineHeight: 1,
          }}
        >
          {index + 1}
        </div>
        <IconReveal
          icon={product.icon}
          startFrame={cardStartFrame + 10}
          size={56}
          color={product.color}
        />
      </div>

      {/* Right: Card content */}
      <div
        style={{
          flex: 1,
          background: `${COLORS.backgroundLight}`,
          border: `1px solid ${product.color}${Math.round(glowIntensity * 60).toString(16).padStart(2, '0')}`,
          borderRadius: 20,
          padding: '40px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent gradient top border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${product.color}, ${product.color}50)`,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 44,
            fontWeight: WEIGHTS.bold,
            color: COLORS.text,
            marginBottom: 12,
          }}
        >
          {product.title}
        </div>

        {/* Subtitle with word animation */}
        <WordByWord
          text={product.subtitle}
          startFrame={cardStartFrame + 15}
          fontSize={28}
          color={product.color}
          fontWeight={WEIGHTS.semibold}
          staggerFrames={4}
          style={{ justifyContent: 'flex-start' }}
        />

        {/* Description */}
        <WordByWord
          text={product.description}
          startFrame={cardStartFrame + 35}
          fontSize={22}
          color={COLORS.textMuted}
          fontWeight={WEIGHTS.regular}
          staggerFrames={3}
          style={{ justifyContent: 'flex-start', marginTop: 12 }}
        />

        {/* Subtle corner glow */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${product.color}10, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
};

// === MAIN SCENE ===
export const WhatToSell: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene is 1200 frames (40 seconds)
  // Section header: frames 0-60
  // Card 1 (RAG): frames 60-340 (about 9.3s)
  // Card 2 (Lead Gen): frames 280-560
  // Card 3 (Voice): frames 500-780
  // Card 4 (Content): frames 720-1000
  // Summary: frames 1000-1200

  // Background gradient shift based on active card
  const gradientHue = interpolate(frame, [0, 1200], [240, 300], {
    extrapolateRight: 'clamp',
  });

  // Summary section at the end
  const summaryStart = 1020;
  const summaryProgress = spring({
    frame: frame - summaryStart,
    fps: 30,
    config: SPRING_CONFIG.smooth,
  });
  const summaryOpacity = interpolate(summaryProgress, [0, 1], [0, 1]);

  // Exit
  const exitOpacity = interpolate(frame, [1160, 1195], [1, 0], {
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
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, hsl(${gradientHue}, 60%, 30%) 0%, transparent 70%)`,
          opacity: 0.08,
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Grid overlay */}
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
          title="What To Sell"
          startFrame={0}
          fontSize={56}
          accentColor={COLORS.primary}
        />
      </div>

      {/* Product Cards - stacked in center */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          marginTop: 40,
          padding: '0 80px',
          width: '100%',
        }}
      >
        {/* Show one card at a time */}
        {PRODUCTS.map((product, i) => {
          const cardStart = 60 + i * 240;
          const cardEnd = cardStart + 260;
          const isVisible = frame >= cardStart - 10 && frame < cardEnd;
          if (!isVisible) return null;

          return (
            <ProductCard
              key={i}
              product={product}
              index={i}
              cardStartFrame={cardStart}
            />
          );
        })}

        {/* Summary: "4 Products, Infinite Demand" */}
        {frame >= summaryStart && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              opacity: summaryOpacity,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 40,
                alignItems: 'center',
              }}
            >
              {PRODUCTS.map((p, i) => {
                const iconDelay = summaryStart + 10 + i * 8;
                const iconProg = spring({
                  frame: frame - iconDelay,
                  fps: 30,
                  config: SPRING_CONFIG.bouncy,
                });
                const iconScale = interpolate(iconProg, [0, 1], [0, 1]);
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transform: `scale(${iconScale})`,
                    }}
                  >
                    <span style={{ fontSize: 48 }}>{p.icon}</span>
                    <span
                      style={{
                        fontFamily: FONTS.body,
                        fontSize: 16,
                        color: p.color,
                        fontWeight: WEIGHTS.semibold,
                      }}
                    >
                      {p.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 48,
                fontWeight: WEIGHTS.bold,
                color: COLORS.text,
                textAlign: 'center',
              }}
            >
              4 Products.{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Infinite Demand.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
