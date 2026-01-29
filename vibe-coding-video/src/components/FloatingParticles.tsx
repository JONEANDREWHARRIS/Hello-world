import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface FloatingParticlesProps {
  color?: string;
  count?: number;
}

/**
 * Subtle floating particle dots that drift upward.
 * Adds depth and visual texture to the background.
 */
export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  color = "#ffffff",
  count = 20,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Deterministic "random" positions using simple hash
  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = ((seed * 7.3) % 100) / 100;
    const baseY = ((seed * 3.7) % 100) / 100;
    const speed = 0.3 + ((seed * 1.3) % 1) * 0.7;
    const size = 2 + ((seed * 2.1) % 1) * 3;
    const phase = (seed * 0.9) % (Math.PI * 2);
    const opacity = 0.05 + ((seed * 1.7) % 1) * 0.12;

    // Drift upward slowly, wrap around
    const yOffset = (frame * speed * 0.5) % height;
    const y = ((baseY * height - yOffset + height) % height);

    // Gentle horizontal sway
    const xSway = Math.sin(frame * 0.02 + phase) * 20;

    return { x: x * width + xSway, y, size, opacity };
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${color}40`,
          }}
        />
      ))}
    </div>
  );
};
