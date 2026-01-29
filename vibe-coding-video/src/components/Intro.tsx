import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { springIn, fadeBlur, scaleUp } from "../utils/animations";
import { StaggeredText } from "./StaggeredText";
import { COLORS } from "../utils/constants";

/**
 * Intro section (0-7 seconds / frames 0-210)
 * More dramatic entrance with context about the source.
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Phase 1: Source context (frames 0-60) ---
  const sourceFade = fadeBlur({ frame, fps, delay: 5 });
  const sourceSpring = springIn({ frame, fps, delay: 5 });

  // --- Phase 2: Main title (frames 30-140) ---
  const titleScale = scaleUp({ frame, fps, delay: 30 });
  const titleFade = fadeBlur({ frame, fps, delay: 30 });

  // Decorative line animation
  const lineWidth = interpolate(
    springIn({ frame, fps, delay: 50 }),
    [0, 1],
    [0, 400]
  );

  // --- Phase 3: Subtitle + context (frames 60-170) ---
  const subtitleFade = fadeBlur({ frame, fps, delay: 65 });
  const subtitleSpring = springIn({ frame, fps, delay: 65 });

  // "Tested every major tool" context
  const contextFade = fadeBlur({ frame, fps, delay: 85 });
  const contextSpring = springIn({ frame, fps, delay: 85 });

  // Countdown hint
  const countdownFade = fadeBlur({ frame, fps, delay: 120 });
  const countdownSpring = springIn({ frame, fps, delay: 120 });

  // Animated pulsing ring behind title
  const ringScale = interpolate(
    spring({ frame: frame - 25, fps, config: { damping: 8, stiffness: 80, mass: 1.2 } }),
    [0, 1],
    [0.3, 1]
  );
  const ringPulse = Math.sin(frame * 0.08) * 0.05 + 1;

  // --- Exit fade (last 25 frames) ---
  const exitOpacity = interpolate(frame, [185, 210], [1, 0], {
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
      {/* Decorative ring behind title */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: `1px solid ${COLORS.vibecode}15`,
          transform: `scale(${ringScale * ringPulse})`,
          opacity: titleFade.opacity * 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          border: `1px solid ${COLORS.rork}10`,
          transform: `scale(${ringScale * ringPulse * 0.95})`,
          opacity: titleFade.opacity * 0.2,
        }}
      />

      {/* Source badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          opacity: sourceFade.opacity * sourceSpring,
          filter: `blur(${sourceFade.blur}px)`,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: COLORS.vibecode,
            boxShadow: `0 0 10px ${COLORS.vibecode}`,
          }}
        />
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: COLORS.textMuted,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          r/SideProject
        </span>
      </div>

      {/* Ranked by label */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.vibecode,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: sourceFade.opacity * sourceSpring,
          filter: `blur(${sourceFade.blur}px)`,
          marginBottom: 24,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        RANKED BY AN 8-YEAR iOS ENGINEER
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
          delay={32}
          staggerDelay={1.2}
          fontSize={96}
          fontWeight={900}
          color={COLORS.textPrimary}
          letterSpacing={4}
        />
        <StaggeredText
          text="TOOLS"
          delay={48}
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
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 2,
          marginBottom: 20,
        }}
      >
        For Shipping Real Mobile Apps
      </div>

      {/* Context line */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          fontStyle: "italic",
          color: COLORS.textMuted,
          opacity: contextFade.opacity * contextSpring,
          filter: `blur(${contextFade.blur}px)`,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 1,
          marginBottom: 30,
        }}
      >
        "I tested nearly all the vibe coding app builders"
      </div>

      {/* Countdown hint */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          opacity: countdownFade.opacity * countdownSpring,
          filter: `blur(${countdownFade.blur}px)`,
        }}
      >
        {[
          { n: "5", c: COLORS.rocket },
          { n: "4", c: COLORS.cursor },
          { n: "3", c: COLORS.replit },
          { n: "2", c: COLORS.rork },
          { n: "1", c: COLORS.vibecode },
        ].map((item, i) => {
          const dotDelay = 125 + i * 4;
          const dotSpring = springIn({ frame, fps, delay: dotDelay });
          return (
            <div
              key={item.n}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                border: `2px solid ${item.c}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 800,
                color: item.c,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                opacity: dotSpring,
                transform: `scale(${interpolate(dotSpring, [0, 1], [0.5, 1])})`,
              }}
            >
              {item.n}
            </div>
          );
        })}
      </div>
    </div>
  );
};
