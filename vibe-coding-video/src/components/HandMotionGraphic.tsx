import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { COLORS } from "../utils/constants";

/**
 * Animated hand motion graphic — a stylized hand tapping and swiping
 * on a phone screen, fitting the "vibe coding on mobile" theme.
 */
export const HandMotionGraphic: React.FC<{
  /** Frame at which this component starts (within its Sequence) */
  startFrame?: number;
  /** Accent color for the glow effects */
  accentColor?: string;
}> = ({ startFrame = 0, accentColor = COLORS.vibecode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  // ── Hand entrance: slides up from below ──────────────────────────
  const entranceProgress = spring({
    frame: f,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const handY = interpolate(entranceProgress, [0, 1], [300, 0]);
  const handOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);

  // ── Tap animation: finger presses down then back up (looping) ────
  const tapCycleDuration = 40; // frames per tap cycle
  const tapFrame = f % tapCycleDuration;
  const tapDown = interpolate(
    tapFrame,
    [0, 8, 16, tapCycleDuration],
    [0, 1, 0, 0],
    { extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );
  const fingerTipY = interpolate(tapDown, [0, 1], [0, 12]);

  // ── Tap ripple on screen ─────────────────────────────────────────
  const rippleScale = interpolate(
    tapFrame,
    [8, 30],
    [0.2, 1.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rippleOpacity = interpolate(
    tapFrame,
    [8, 30],
    [0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Swipe animation: hand moves right then resets (slower cycle) ─
  const swipeCycleDuration = 80;
  const swipeFrame = f % swipeCycleDuration;
  const swipeX = interpolate(
    swipeFrame,
    [0, 20, 50, 65, swipeCycleDuration],
    [0, 0, 60, 0, 0],
    { extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  // ── Phone screen glow pulse ──────────────────────────────────────
  const glowPulse = interpolate(
    f % 60,
    [0, 30, 60],
    [0.3, 0.7, 0.3],
    { extrapolateRight: "clamp" }
  );

  // ── Code lines appearing on phone screen ─────────────────────────
  const codeLineCount = 6;
  const codeLines = Array.from({ length: codeLineCount }, (_, i) => {
    const lineDelay = 15 + i * 12;
    const lineProgress = spring({
      frame: f - lineDelay,
      fps,
      config: { damping: 18, stiffness: 200, mass: 0.5 },
    });
    const lineWidth = [85, 60, 75, 50, 90, 40][i];
    return { progress: lineProgress, width: lineWidth };
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Container for hand + phone */}
      <div
        style={{
          position: "relative",
          width: 600,
          height: 800,
          transform: `translateY(${handY}px)`,
          opacity: handOpacity,
        }}
      >
        {/* ── Phone ────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 120,
            width: 280,
            height: 520,
            borderRadius: 36,
            background: "linear-gradient(145deg, #1a1a2e, #16162a)",
            border: `2px solid rgba(${hexToRgb(accentColor)}, 0.3)`,
            boxShadow: `
              0 0 ${40 * glowPulse}px rgba(${hexToRgb(accentColor)}, ${0.15 * glowPulse}),
              inset 0 0 30px rgba(0, 0, 0, 0.5)
            `,
            overflow: "hidden",
          }}
        >
          {/* Screen content area */}
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 16,
              right: 16,
              bottom: 30,
              borderRadius: 12,
              background: "rgba(10, 10, 20, 0.9)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Status bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: COLORS.textSecondary,
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  width: 24,
                  height: 4,
                  borderRadius: 2,
                  background: accentColor,
                  opacity: 0.7,
                }}
              />
            </div>

            {/* Animated code lines */}
            {codeLines.map((line, i) => (
              <div
                key={i}
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: `${line.width * line.progress}%`,
                  background:
                    i === 0 || i === 4
                      ? accentColor
                      : i % 2 === 0
                      ? COLORS.textSecondary
                      : "rgba(255,255,255,0.15)",
                  opacity: interpolate(line.progress, [0, 1], [0, 0.8]),
                  transform: `translateX(${i > 0 && i < 4 ? 16 : 0}px)`,
                }}
              />
            ))}

            {/* Blinking cursor */}
            <div
              style={{
                width: 2,
                height: 14,
                background: accentColor,
                opacity: f % 30 < 15 ? 1 : 0.2,
                marginLeft: 16,
                borderRadius: 1,
              }}
            />
          </div>

          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 24,
              borderRadius: 12,
              background: "#0a0a0f",
            }}
          />

          {/* Tap ripple */}
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              transform: `translate(-50%, -50%) scale(${rippleScale})`,
              opacity: rippleOpacity,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── Hand (SVG) ───────────────────────────────────────── */}
        <svg
          viewBox="0 0 400 500"
          width={400}
          height={500}
          style={{
            position: "absolute",
            bottom: -60,
            left: 60 + swipeX,
            filter: `drop-shadow(0 4px 20px rgba(0,0,0,0.5))`,
          }}
        >
          {/* Palm */}
          <path
            d="M 130 280 Q 100 320 110 400 Q 120 460 200 470 Q 280 460 290 400 Q 300 320 270 280 Z"
            fill="#e8b89a"
            stroke="#d4a088"
            strokeWidth="2"
          />

          {/* Thumb */}
          <path
            d="M 130 300 Q 90 270 80 230 Q 75 200 95 195 Q 115 190 120 220 Q 125 250 130 280"
            fill="#e8b89a"
            stroke="#d4a088"
            strokeWidth="2"
          />

          {/* Index finger (the one that taps) */}
          <path
            d={`M 160 280 Q 155 240 150 ${180 + fingerTipY} Q 148 ${150 + fingerTipY} 165 ${145 + fingerTipY} Q 182 ${150 + fingerTipY} 180 ${180 + fingerTipY} Q 178 240 175 280`}
            fill="#e8b89a"
            stroke="#d4a088"
            strokeWidth="2"
          />

          {/* Middle finger */}
          <path
            d="M 185 280 Q 183 235 180 165 Q 178 135 195 130 Q 212 135 210 165 Q 207 235 205 280"
            fill="#e8b89a"
            stroke="#d4a088"
            strokeWidth="2"
          />

          {/* Ring finger */}
          <path
            d="M 210 280 Q 210 240 210 180 Q 210 150 225 148 Q 240 150 240 180 Q 238 240 235 280"
            fill="#e8b89a"
            stroke="#d4a088"
            strokeWidth="2"
          />

          {/* Pinky finger */}
          <path
            d="M 240 285 Q 242 250 245 200 Q 246 175 258 173 Q 270 175 268 200 Q 265 250 262 285"
            fill="#e8b89a"
            stroke="#d4a088"
            strokeWidth="2"
          />

          {/* Knuckle lines */}
          <path
            d="M 155 275 Q 200 265 265 278"
            fill="none"
            stroke="#d4a088"
            strokeWidth="1.5"
            opacity="0.5"
          />

          {/* Fingertip glow on index finger (tap indicator) */}
          <circle
            cx="165"
            cy={145 + fingerTipY}
            r={8 + tapDown * 4}
            fill={accentColor}
            opacity={tapDown * 0.6}
          />
        </svg>

        {/* ── Floating particles ────────────────────────────────── */}
        {[...Array(5)].map((_, i) => {
          const particleDelay = i * 18;
          const pFrame = (f - particleDelay + 200) % 90;
          const pY = interpolate(pFrame, [0, 90], [0, -120]);
          const pOpacity = interpolate(pFrame, [0, 20, 70, 90], [0, 0.8, 0.6, 0]);
          const pX = Math.sin((f + i * 40) * 0.05) * 15;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 200 + i * 30 + pY,
                left: 230 + i * 25 + pX,
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                borderRadius: "50%",
                background: accentColor,
                opacity: pOpacity * handOpacity,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Convert hex color to r,g,b string for use in rgba() */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
