import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../utils/constants";

interface RatingBarProps {
  rating: number; // 1-10
  color: string;
  delay?: number;
  label?: string;
}

/**
 * Animated horizontal rating bar that fills to the tool's score.
 * Includes a pulsing glow effect on the filled portion.
 */
export const RatingBar: React.FC<RatingBarProps> = ({
  rating,
  color,
  delay = 0,
  label = "MOBILE SCORE",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bar container fades in
  const containerOpacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 150, mass: 0.8 },
  });

  // Fill animates from 0 to rating
  const fillProgress = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });
  const fillWidth = interpolate(fillProgress, [0, 1], [0, (rating / 10) * 100]);

  // Score number counts up
  const scoreProgress = interpolate(
    frame - delay - 8,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const displayScore = Math.round(scoreProgress * rating);

  // Subtle pulse on the glow
  const pulsePhase = Math.sin((frame - delay) * 0.15) * 0.3 + 0.7;

  return (
    <div
      style={{
        opacity: containerOpacity,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 500,
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.textMuted,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 28,
            fontWeight: 900,
            color,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {displayScore}
          <span style={{ fontSize: 16, color: COLORS.textMuted }}>/10</span>
        </span>
      </div>

      {/* Bar track */}
      <div
        style={{
          width: "100%",
          height: 10,
          borderRadius: 5,
          backgroundColor: `${COLORS.textMuted}20`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Filled portion */}
        <div
          style={{
            width: `${fillWidth}%`,
            height: "100%",
            borderRadius: 5,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 ${20 * pulsePhase}px ${color}60, 0 0 ${40 * pulsePhase}px ${color}30`,
            position: "relative",
          }}
        />
      </div>

      {/* Tick marks */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        {Array.from({ length: 11 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 1,
              height: i % 5 === 0 ? 6 : 3,
              backgroundColor:
                i <= rating ? `${color}60` : `${COLORS.textMuted}30`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
