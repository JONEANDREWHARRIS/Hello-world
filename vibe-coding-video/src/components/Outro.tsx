import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springIn, fadeBlur, slideFromLeft } from "../utils/animations";
import { COLORS, TOOLS } from "../utils/constants";

/**
 * Outro section (52-60 seconds / frames 0-240 within sequence)
 * Full recap with all 5 tools, ranking bars, CTA, and fade to black.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "THE FULL RANKING" header
  const headerFade = fadeBlur({ frame, fps, delay: 3 });
  const headerSpring = springIn({ frame, fps, delay: 3 });

  // Mini cards stagger in
  const cardStagger = (index: number) => {
    const delay = 12 + index * 7;
    const progress = springIn({ frame, fps, delay });
    const x = slideFromLeft({ frame, fps, delay, distance: 100 });
    return { opacity: progress, x };
  };

  // Mini rating bars per card
  const miniBarProgress = (index: number) => {
    const delay = 18 + index * 7;
    return springIn({ frame, fps, delay });
  };

  // Main text animations
  const mainTextFade = fadeBlur({ frame, fps, delay: 65 });
  const mainTextSpring = springIn({ frame, fps, delay: 65 });

  // CTA text
  const ctaFade = fadeBlur({ frame, fps, delay: 90 });
  const ctaSpring = springIn({ frame, fps, delay: 90 });

  // Workflow tip
  const tipFade = fadeBlur({ frame, fps, delay: 115 });
  const tipSpring = springIn({ frame, fps, delay: 115 });

  // Source
  const sourceFade = fadeBlur({ frame, fps, delay: 140 });

  // Final fade to black
  const blackOverlay = interpolate(frame, [210, 240], [0, 1], {
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
      {/* Header */}
      <div
        style={{
          opacity: headerFade.opacity * headerSpring,
          filter: `blur(${headerFade.blur}px)`,
          fontSize: 18,
          fontWeight: 700,
          color: COLORS.textMuted,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 30,
        }}
      >
        THE FULL RANKING
      </div>

      {/* Mini tool cards row */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 50,
        }}
      >
        {TOOLS.map((tool, index) => {
          const { opacity, x } = cardStagger(index);
          const barFill = miniBarProgress(index);
          return (
            <div
              key={tool.name}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "18px 24px",
                borderRadius: 16,
                border: `1px solid ${tool.color}30`,
                background: `linear-gradient(135deg, ${tool.color}08, ${tool.color}03)`,
                minWidth: 170,
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
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {tool.rank}
              </div>
              {/* Tool name */}
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: 2,
                }}
              >
                {tool.name}
              </span>
              {/* Mini rating bar */}
              <div
                style={{
                  width: 120,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: `${COLORS.textMuted}20`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${barFill * (tool.rating / 10) * 100}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: tool.color,
                    boxShadow: `0 0 8px ${tool.color}60`,
                  }}
                />
              </div>
              {/* Score */}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: tool.color,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {tool.rating}/10
              </span>
              {/* Tagline */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: `${tool.color}99`,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 2,
          marginBottom: 16,
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
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 1,
          marginBottom: 16,
        }}
      >
        Ship your first app this week
      </div>

      {/* Workflow tip */}
      <div
        style={{
          opacity: tipFade.opacity * tipSpring,
          filter: `blur(${tipFade.blur}px)`,
          fontSize: 18,
          fontWeight: 400,
          fontStyle: "italic",
          color: COLORS.textMuted,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 0.5,
        }}
      >
        Pro tip: Prototype in Vibecode or Rork \u2192 Polish in Cursor
      </div>

      {/* Source attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          opacity: sourceFade.opacity * 0.5,
          filter: `blur(${sourceFade.blur}px)`,
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textMuted,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Source: r/SideProject
        </span>
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.textMuted,
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textMuted,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Ranked by an 8-year iOS engineer
        </span>
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
