import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springIn, fadeBlur, slideFromLeft } from "../utils/animations";
import { COLORS, TOOLS } from "../utils/constants";

/**
 * Outro section (26-30 seconds / frames 0-120 within sequence)
 * Shows all 5 tools as small cards, CTA text, fade to black
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mini cards stagger in
  const cardStagger = (index: number) => {
    const delay = 5 + index * 5;
    const progress = springIn({ frame, fps, delay });
    const x = slideFromLeft({ frame, fps, delay: delay, distance: 100 });
    return { opacity: progress, x };
  };

  // Main text animations
  const mainTextFade = fadeBlur({ frame, fps, delay: 30 });
  const mainTextSpring = springIn({ frame, fps, delay: 30 });

  // CTA text
  const ctaFade = fadeBlur({ frame, fps, delay: 50 });
  const ctaSpring = springIn({ frame, fps, delay: 50 });

  // Final fade to black
  const blackOverlay = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Mini tool cards row */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 60,
        }}
      >
        {TOOLS.map((tool, index) => {
          const { opacity, x } = cardStagger(index);
          return (
            <div
              key={tool.name}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "20px 28px",
                borderRadius: 16,
                border: `1px solid ${tool.color}30`,
                background: `linear-gradient(135deg, ${tool.color}08, ${tool.color}03)`,
                minWidth: 160,
              }}
            >
              {/* Rank circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${tool.color}20`,
                  border: `2px solid ${tool.color}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  color: tool.color,
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {tool.rank}
              </div>
              {/* Tool name */}
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: 2,
                }}
              >
                {tool.name}
              </span>
              {/* Tagline */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: tool.color,
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {tool.tagline}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main CTA text */}
      <div
        style={{
          opacity: mainTextFade.opacity * mainTextSpring,
          filter: `blur(${mainTextFade.blur}px)`,
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.textPrimary,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 2,
          marginBottom: 20,
        }}
      >
        Start with{" "}
        <span style={{ color: COLORS.vibecode }}>#1</span>, level up from
        there
      </div>

      {/* Secondary CTA */}
      <div
        style={{
          opacity: ctaFade.opacity * ctaSpring,
          filter: `blur(${ctaFade.blur}px)`,
          fontSize: 30,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 1,
        }}
      >
        Ship your first app this week
      </div>

      {/* Logo placeholder area */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: interpolate(frame, [60, 80], [0, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 14,
          fontWeight: 600,
          color: COLORS.textMuted,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        YOUR LOGO HERE
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: COLORS.bg,
          opacity: blackOverlay,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
