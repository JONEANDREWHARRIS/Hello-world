import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springIn, fadeBlur, scaleUp } from "../utils/animations";
import { StaggeredText } from "./StaggeredText";
import { COLORS } from "../utils/constants";

/**
 * Intro section (0-4 seconds / frames 0-120)
 * Bold title with scale-up + blur reveal, subtitle fade-in
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title scale-up + blur reveal
  const titleScale = scaleUp({ frame, fps, delay: 8 });
  const titleFade = fadeBlur({ frame, fps, delay: 8 });

  // Subtitle fade in after title
  const subtitleFade = fadeBlur({ frame, fps, delay: 35 });
  const subtitleSpring = springIn({ frame, fps, delay: 35 });

  // Decorative line animation
  const lineWidth = interpolate(
    springIn({ frame, fps, delay: 20 }),
    [0, 1],
    [0, 300]
  );

  // Exit fade (last 15 frames of intro)
  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
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
        opacity: exitOpacity,
      }}
    >
      {/* Top accent number */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.vibecode,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: titleFade.opacity,
          filter: `blur(${titleFade.blur}px)`,
          marginBottom: 20,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        2025 RANKINGS
      </div>

      {/* Main title with staggered text */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          filter: `blur(${titleFade.blur}px)`,
          opacity: titleFade.opacity,
        }}
      >
        <StaggeredText
          text="TOP 5 VIBE CODING"
          delay={10}
          staggerDelay={1.5}
          fontSize={96}
          fontWeight={900}
          color={COLORS.textPrimary}
          letterSpacing={4}
        />
        <StaggeredText
          text="TOOLS"
          delay={20}
          staggerDelay={2}
          fontSize={96}
          fontWeight={900}
          color={COLORS.textPrimary}
          letterSpacing={4}
        />
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${COLORS.vibecode}, transparent)`,
          marginTop: 30,
          marginBottom: 30,
          borderRadius: 2,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 400,
          color: COLORS.textSecondary,
          opacity: subtitleFade.opacity * subtitleSpring,
          filter: `blur(${subtitleFade.blur}px)`,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 2,
        }}
      >
        For Shipping Real Mobile Apps
      </div>
    </div>
  );
};
