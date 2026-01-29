import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springIn, fadeBlur, scaleUp } from "../utils/animations";
import { StaggeredText } from "./StaggeredText";
import { AUTO_COLORS } from "../utils/automationConstants";

/**
 * Intro for the Hand Gesture Automation video.
 * 0-4 seconds (120 frames) — title + tagline + decorative elements.
 */
export const AutomationIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title scale + blur
  const titleScale = scaleUp({ frame, fps, delay: 8 });
  const titleFade = fadeBlur({ frame, fps, delay: 8 });

  // Subtitle
  const subtitleFade = fadeBlur({ frame, fps, delay: 35 });
  const subtitleSpring = springIn({ frame, fps, delay: 35 });

  // Decorative line
  const lineWidth = interpolate(
    springIn({ frame, fps, delay: 20 }),
    [0, 1],
    [0, 400]
  );

  // Badge
  const badgeFade = fadeBlur({ frame, fps, delay: 50 });
  const badgeSpring = springIn({ frame, fps, delay: 50 });

  // Hand icon pulse
  const handPulse = interpolate(frame % 40, [0, 20, 40], [1, 1.15, 1]);

  // Exit
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
      {/* Animated hand icon above title */}
      <div
        style={{
          opacity: titleFade.opacity,
          filter: `blur(${titleFade.blur}px)`,
          marginBottom: 24,
          transform: `scale(${handPulse})`,
        }}
      >
        <svg viewBox="0 0 80 80" width={80} height={80}>
          {/* Stylised open hand */}
          <circle cx={40} cy={40} r={36} fill="none" stroke={AUTO_COLORS.landmark} strokeWidth={2} opacity={0.4} />
          <circle cx={40} cy={40} r={28} fill={`${AUTO_COLORS.landmark}15`} stroke={AUTO_COLORS.landmark} strokeWidth={1.5} opacity={0.6} />
          {/* Five finger dots */}
          {[
            [40, 10], [22, 18], [14, 36], [58, 18], [66, 36],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill={AUTO_COLORS.landmark} opacity={0.8} />
          ))}
          {/* Palm dot */}
          <circle cx={40} cy={42} r={6} fill={AUTO_COLORS.landmark} opacity={0.5} />
          {/* Lines from palm to fingertips */}
          {[
            [40, 10], [22, 18], [14, 36], [58, 18], [66, 36],
          ].map(([x, y], i) => (
            <line key={`l-${i}`} x1={40} y1={42} x2={x} y2={y} stroke={AUTO_COLORS.landmarkLine} strokeWidth={1.5} opacity={0.4} />
          ))}
        </svg>
      </div>

      {/* Top label */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: AUTO_COLORS.landmark,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: titleFade.opacity,
          filter: `blur(${titleFade.blur}px)`,
          marginBottom: 16,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        GESTURE-CONTROLLED
      </div>

      {/* Main title */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          filter: `blur(${titleFade.blur}px)`,
          opacity: titleFade.opacity,
        }}
      >
        <StaggeredText
          text="HAND MOTION"
          delay={10}
          staggerDelay={1.5}
          fontSize={100}
          fontWeight={900}
          color={AUTO_COLORS.textPrimary}
          letterSpacing={5}
        />
        <StaggeredText
          text="AUTOMATIONS"
          delay={18}
          staggerDelay={1.2}
          fontSize={100}
          fontWeight={900}
          color={AUTO_COLORS.landmark}
          letterSpacing={5}
        />
      </div>

      {/* Decorative gradient line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${AUTO_COLORS.landmark}, ${AUTO_COLORS.tap}, transparent)`,
          marginTop: 32,
          marginBottom: 32,
          borderRadius: 2,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          fontSize: 34,
          fontWeight: 400,
          color: AUTO_COLORS.textSecondary,
          opacity: subtitleFade.opacity * subtitleSpring,
          filter: `blur(${subtitleFade.blur}px)`,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 2,
        }}
      >
        MediaPipe + TouchDesigner + Your Automation Stack
      </div>

      {/* Platform badges */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 30,
          opacity: badgeFade.opacity * badgeSpring,
          filter: `blur(${badgeFade.blur}px)`,
        }}
      >
        {[
          { name: "Make.com", color: AUTO_COLORS.makeCom },
          { name: "n8n", color: AUTO_COLORS.n8n },
          { name: "GoHighLevel", color: AUTO_COLORS.goHighLevel },
        ].map((p) => (
          <div
            key={p.name}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: `1px solid ${p.color}40`,
              background: `${p.color}10`,
              fontSize: 16,
              fontWeight: 600,
              color: p.color,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: 1,
            }}
          >
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
};
