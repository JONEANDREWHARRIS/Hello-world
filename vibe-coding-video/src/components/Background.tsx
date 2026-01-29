import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../utils/constants";

/**
 * Animated dark background with gradient mesh and subtle grid
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Slow-moving gradient positions (extended for 1800 frames)
  const gradX1 = interpolate(frame, [0, 1800], [20, 80]);
  const gradY1 = interpolate(frame, [0, 1800], [20, 60]);
  const gradX2 = interpolate(frame, [0, 1800], [80, 30]);
  const gradY2 = interpolate(frame, [0, 1800], [70, 40]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        background: COLORS.bg,
        overflow: "hidden",
      }}
    >
      {/* Gradient mesh orbs */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(34, 197, 94, 0.06) 0%, transparent 70%)`,
          left: `${gradX1}%`,
          top: `${gradY1}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)`,
          left: `${gradX2}%`,
          top: `${gradY2}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)`,
          left: `${100 - gradX1}%`,
          top: `${100 - gradY1}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Subtle grid overlay */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.04 }}
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Grain overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};
