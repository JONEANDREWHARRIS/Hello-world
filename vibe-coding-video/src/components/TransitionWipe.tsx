import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface TransitionWipeProps {
  color: string;
  direction?: "left" | "right";
}

/**
 * Animated color wipe transition between sections.
 * A colored bar sweeps across the screen and then retreats.
 * Total duration: ~20 frames (0.67s)
 */
export const TransitionWipe: React.FC<TransitionWipeProps> = ({
  color,
  direction = "right",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Bar sweeps in
  const sweepIn = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.8 },
  });

  // Bar sweeps out (starts after sweep in)
  const sweepOut = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.8 },
  });

  const barWidth = 120;

  const position =
    direction === "right"
      ? interpolate(sweepIn, [0, 1], [-barWidth, width]) -
        interpolate(sweepOut, [0, 1], [0, width + barWidth])
      : interpolate(sweepIn, [0, 1], [width, -barWidth]) -
        interpolate(sweepOut, [0, 1], [0, -(width + barWidth)]);

  // Overall opacity — fade out quickly
  const opacity = interpolate(frame, [16, 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: position,
        width: barWidth,
        height,
        background: `linear-gradient(${
          direction === "right" ? "90deg" : "270deg"
        }, transparent, ${color}90, ${color}, ${color}90, transparent)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
