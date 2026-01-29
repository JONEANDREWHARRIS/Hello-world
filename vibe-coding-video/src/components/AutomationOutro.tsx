import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { springIn, fadeBlur, slideFromLeft } from "../utils/animations";
import { AUTO_COLORS, GESTURES } from "../utils/automationConstants";

/**
 * Outro for the Hand Gesture Automation video.
 * 25-30 seconds (150 frames within its Sequence).
 * Shows recap gesture icons, CTA, and agency attribution.
 */
export const AutomationOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mini gesture cards stagger in
  const cardStagger = (index: number) => {
    const delay = 5 + index * 6;
    const progress = springIn({ frame, fps, delay });
    const x = slideFromLeft({ frame, fps, delay, distance: 80 });
    return { opacity: progress, x };
  };

  // Main CTA
  const ctaFade = fadeBlur({ frame, fps, delay: 30 });
  const ctaSpring = springIn({ frame, fps, delay: 30 });

  // Secondary text
  const secondaryFade = fadeBlur({ frame, fps, delay: 45 });
  const secondarySpring = springIn({ frame, fps, delay: 45 });

  // Agency line
  const agencyFade = fadeBlur({ frame, fps, delay: 60 });

  // Stats row
  const statsDelay = 70;

  // Fade to black
  const blackOverlay = interpolate(frame, [120, 150], [0, 1], {
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
      {/* Gesture recap cards */}
      <div style={{ display: "flex", gap: 30, marginBottom: 50 }}>
        {GESTURES.map((gesture, i) => {
          const { opacity, x } = cardStagger(i);
          return (
            <div
              key={gesture.name}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                padding: "24px 32px",
                borderRadius: 20,
                border: `1px solid ${gesture.color}30`,
                background: `linear-gradient(135deg, ${gesture.color}08, ${gesture.color}03)`,
                minWidth: 200,
              }}
            >
              {/* Gesture circle */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: `2px solid ${gesture.color}60`,
                  background: `${gesture.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}
              >
                {gesture.icon}
              </div>
              {/* Name */}
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: AUTO_COLORS.textPrimary,
                  letterSpacing: 2,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {gesture.name}
              </span>
              {/* Platform */}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: gesture.color,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {gesture.platform}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main CTA */}
      <div
        style={{
          opacity: ctaFade.opacity * ctaSpring,
          filter: `blur(${ctaFade.blur}px)`,
          fontSize: 48,
          fontWeight: 800,
          color: AUTO_COLORS.textPrimary,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 2,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Your gestures.{" "}
        <span style={{ color: AUTO_COLORS.landmark }}>Their automations.</span>
      </div>

      {/* Secondary */}
      <div
        style={{
          opacity: secondaryFade.opacity * secondarySpring,
          filter: `blur(${secondaryFade.blur}px)`,
          fontSize: 28,
          fontWeight: 400,
          color: AUTO_COLORS.textSecondary,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 1,
          marginBottom: 40,
        }}
      >
        Build gesture-triggered workflows for your clients
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 60 }}>
        {[
          { value: "3", label: "Gesture Types" },
          { value: "3", label: "Platforms" },
          { value: "\u221E", label: "Possibilities" },
        ].map((stat, i) => {
          const statProgress = springIn({ frame, fps, delay: statsDelay + i * 8 });
          return (
            <div
              key={i}
              style={{
                opacity: statProgress,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: AUTO_COLORS.landmark,
                  fontFamily: "'Inter', monospace",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: AUTO_COLORS.textMuted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Agency attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: agencyFade.opacity * 0.6,
          filter: `blur(${agencyFade.blur}px)`,
          fontSize: 16,
          fontWeight: 500,
          color: AUTO_COLORS.textMuted,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Powered by MediaPipe + TouchDesigner
      </div>

      {/* Fade to black */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: AUTO_COLORS.bg,
          opacity: blackOverlay,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
