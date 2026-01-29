import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import {
  springIn,
  slideFromLeft,
  slideFromRight,
  fadeBlur,
  scaleUp,
} from "../utils/animations";
import { StaggeredText } from "./StaggeredText";
import { RatingBar } from "./RatingBar";
import { COLORS, ToolData, TOOL_SECTION_FRAMES } from "../utils/constants";

interface ToolCardProps {
  tool: ToolData;
}

/**
 * Expanded tool ranking card — 9 seconds (270 frames).
 *
 * Layout (two-column):
 *   Left: rank number + accent bar
 *   Right: name, tagline, 3 pros, rating bar, quote, verdict
 *
 * Animation timeline (frame offsets within this section):
 *   0-5   : Accent bar + rank slide in
 *   8-18  : Tool name staggers in
 *   20-28 : Tagline slides from right
 *   35-75 : 3 pros stagger in (one every ~12 frames)
 *   80-110: Rating bar fills
 *   115-140: Quote fades in
 *   145-165: Verdict slides in
 *   245-270: Exit fade
 */
export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Entrance animations ---
  const rankX = slideFromLeft({ frame, fps, delay: 3, distance: 300 });
  const rankOpacity = springIn({ frame, fps, delay: 3 });

  const nameDelay = 10;

  const taglineX = slideFromRight({ frame, fps, delay: 22, distance: 200 });
  const taglineOpacity = springIn({ frame, fps, delay: 22 });

  // Pros stagger in one by one
  const prosAnimations = tool.pros.map((_, i) => {
    const delay = 40 + i * 14;
    return {
      opacity: springIn({ frame, fps, delay }),
      x: slideFromLeft({ frame, fps, delay, distance: 80 }),
    };
  });

  // Rating bar
  const ratingDelay = 90;

  // Quote
  const quoteFade = fadeBlur({ frame, fps, delay: 125 });
  const quoteSpring = springIn({ frame, fps, delay: 125 });

  // Verdict
  const verdictFade = fadeBlur({ frame, fps, delay: 155 });
  const verdictX = slideFromRight({ frame, fps, delay: 155, distance: 100 });
  const verdictOpacity = springIn({ frame, fps, delay: 155 });

  // Accent bar grows
  const barHeight = interpolate(
    springIn({ frame, fps, delay: 5 }),
    [0, 1],
    [0, 320]
  );

  // Decorative background glow
  const glowOpacity = springIn({ frame, fps, delay: 10 });
  const glowPulse = Math.sin(frame * 0.06) * 0.02 + 0.08;

  // --- Exit animation (last 25 frames) ---
  const exitOpacity = interpolate(
    frame,
    [TOOL_SECTION_FRAMES - 25, TOOL_SECTION_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: exitOpacity,
      }}
    >
      {/* Background glow for the tool's accent color */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tool.color}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)`,
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Left side: Rank number */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: 70,
          transform: `translateX(${rankX}px)`,
          opacity: rankOpacity,
        }}
      >
        {/* Vertical accent bar */}
        <div
          style={{
            width: 6,
            height: barHeight,
            backgroundColor: tool.color,
            borderRadius: 3,
            marginRight: 35,
            boxShadow: `0 0 30px ${tool.color}60, 0 0 60px ${tool.color}30`,
          }}
        />

        {/* Rank number */}
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: tool.color,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: 1,
              textShadow: `0 0 40px ${tool.color}40`,
            }}
          >
            {tool.rank}
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: `${tool.color}88`,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              marginLeft: 4,
            }}
          >
            #
          </span>
        </div>
      </div>

      {/* Right side: Tool info */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 750,
        }}
      >
        {/* Tool name */}
        <StaggeredText
          text={tool.name}
          delay={nameDelay}
          staggerDelay={2}
          fontSize={80}
          fontWeight={900}
          color={COLORS.textPrimary}
          letterSpacing={6}
          style={{ justifyContent: "flex-start" }}
        />

        {/* Tagline */}
        <div
          style={{
            transform: `translateX(${taglineX}px)`,
            opacity: taglineOpacity,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: tool.color,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {tool.tagline}
          </span>
        </div>

        {/* Pros list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
          {tool.pros.map((pro, i) => {
            const anim = prosAnimations[i];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: anim.opacity,
                  transform: `translateX(${anim.x}px)`,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: tool.color,
                    boxShadow: `0 0 8px ${tool.color}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: COLORS.textSecondary,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    letterSpacing: 0.5,
                  }}
                >
                  {pro}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rating bar */}
        <RatingBar
          rating={tool.rating}
          color={tool.color}
          delay={ratingDelay}
        />

        {/* Author quote */}
        <div
          style={{
            opacity: quoteFade.opacity * quoteSpring,
            filter: `blur(${quoteFade.blur}px)`,
            marginTop: 10,
            paddingLeft: 16,
            borderLeft: `3px solid ${tool.color}40`,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              fontStyle: "italic",
              color: `${tool.color}cc`,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: 0.3,
            }}
          >
            "{tool.quote}"
          </span>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.textMuted,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            \u2014 {tool.quoteAuthor}
          </div>
        </div>

        {/* Verdict */}
        <div
          style={{
            opacity: verdictOpacity * verdictFade.opacity,
            filter: `blur(${verdictFade.blur}px)`,
            transform: `translateX(${verdictX}px)`,
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              backgroundColor: `${tool.color}18`,
              border: `1px solid ${tool.color}30`,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: tool.color,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {tool.verdict}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
