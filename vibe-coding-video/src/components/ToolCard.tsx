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
import { COLORS, ToolData } from "../utils/constants";

interface ToolCardProps {
  tool: ToolData;
}

/**
 * Reusable tool ranking card component
 * Each tool gets ~132 frames (4.4 seconds)
 * Layout: rank number left, tool info right
 */
export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Entrance animations ---
  // Rank number slides from left
  const rankX = slideFromLeft({ frame, fps, delay: 3, distance: 300 });
  const rankOpacity = springIn({ frame, fps, delay: 3 });

  // Tool name staggered in (handled by StaggeredText)
  const nameDelay = 10;

  // Tagline slides from right
  const taglineX = slideFromRight({ frame, fps, delay: 22, distance: 200 });
  const taglineOpacity = springIn({ frame, fps, delay: 22 });

  // Key point fades + blurs in
  const keyPointFade = fadeBlur({ frame, fps, delay: 38 });

  // Icon placeholder scales up
  const iconScale = scaleUp({ frame, fps, delay: 15 });
  const iconOpacity = springIn({ frame, fps, delay: 15 });

  // Accent bar grows
  const barHeight = interpolate(
    springIn({ frame, fps, delay: 5 }),
    [0, 1],
    [0, 180]
  );

  // --- Exit animation (last 15 frames) ---
  const sectionDuration = 132;
  const exitOpacity = interpolate(
    frame,
    [sectionDuration - 18, sectionDuration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
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
      {/* Left side: Rank number */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: 80,
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
            marginRight: 40,
            boxShadow: `0 0 30px ${tool.color}60, 0 0 60px ${tool.color}30`,
          }}
        />

        {/* Rank number */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: tool.color,
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: 1,
              textShadow: `0 0 40px ${tool.color}40`,
            }}
          >
            {tool.rank}
          </span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: `${tool.color}88`,
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
          gap: 16,
          maxWidth: 700,
        }}
      >
        {/* Tool name */}
        <StaggeredText
          text={tool.name}
          delay={nameDelay}
          staggerDelay={2}
          fontSize={88}
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
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: tool.color,
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {tool.tagline}
          </span>
        </div>

        {/* Key point */}
        <div
          style={{
            opacity: keyPointFade.opacity,
            filter: `blur(${keyPointFade.blur}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: tool.color,
              boxShadow: `0 0 10px ${tool.color}`,
            }}
          />
          <span
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: COLORS.textSecondary,
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: 1,
            }}
          >
            {tool.keyPoint}
          </span>
        </div>

        {/* Icon placeholder - glowing circle */}
        <div
          style={{
            position: "absolute",
            right: 180,
            top: "50%",
            transform: `translateY(-50%) scale(${iconScale})`,
            opacity: iconOpacity * 0.15,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `2px solid ${tool.color}40`,
              background: `radial-gradient(circle, ${tool.color}10 0%, transparent 70%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: `${tool.color}15`,
                border: `1px solid ${tool.color}30`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
