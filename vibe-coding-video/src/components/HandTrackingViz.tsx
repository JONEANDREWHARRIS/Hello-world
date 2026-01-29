import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AUTO_COLORS } from "../utils/automationConstants";

/**
 * MediaPipe-style hand with animated landmark points and skeleton lines.
 * The hand appears, landmarks light up in sequence, then skeleton draws on.
 *
 * Designed for frames 0–150 within its Sequence (about 5 seconds).
 */

// -- Hand landmark positions (21 MediaPipe-style keypoints) ---------------
// Normalised to a 400×500 viewBox.
const LANDMARKS: [number, number][] = [
  // Wrist
  [200, 460],
  // Thumb (4 joints)
  [140, 380], [100, 320], [75, 260], [60, 200],
  // Index (4 joints)
  [150, 300], [140, 210], [135, 150], [132, 100],
  // Middle (4 joints)
  [195, 290], [192, 195], [190, 130], [188, 75],
  // Ring (4 joints)
  [240, 300], [245, 205], [248, 145], [250, 95],
  // Pinky (4 joints)
  [280, 320], [290, 235], [296, 180], [300, 130],
];

// Finger skeletons (landmark index chains)
const FINGERS = [
  [0, 1, 2, 3, 4],       // thumb
  [0, 5, 6, 7, 8],       // index
  [0, 9, 10, 11, 12],    // middle
  [0, 13, 14, 15, 16],   // ring
  [0, 17, 18, 19, 20],   // pinky
  [5, 9, 13, 17],        // palm bridge
];

export const HandTrackingViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -- Overall entrance ---------------------------------------------------
  const handScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });
  const handOpacity = interpolate(handScale, [0, 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // -- Skeleton draw-on progress (0→1 over frames 15–60) ------------------
  const skeletonProgress = interpolate(frame, [15, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -- Landmark pulse (cycle every 60 frames) -----------------------------
  const pulse = Math.sin((frame % 60) / 60 * Math.PI * 2) * 0.3 + 0.7;

  // -- Scanning line (sweeps top→bottom) ----------------------------------
  const scanY = interpolate(frame % 90, [0, 90], [-20, 520]);

  // -- Exit fade ----------------------------------------------------------
  const exitOpacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -- "TRACKING" label ---------------------------------------------------
  const labelOpacity = spring({
    frame: frame - 40,
    fps,
    config: { damping: 18, stiffness: 200, mass: 0.5 },
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
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          position: "relative",
          transform: `scale(${0.3 + handScale * 0.7})`,
          opacity: handOpacity,
        }}
      >
        {/* Glow backdrop */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${AUTO_COLORS.landmark}15 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
        />

        <svg viewBox="-20 -20 440 540" width={600} height={720}>
          {/* Scan line */}
          <line
            x1={-20}
            y1={scanY}
            x2={440}
            y2={scanY}
            stroke={AUTO_COLORS.landmark}
            strokeWidth={1.5}
            opacity={0.25}
          />

          {/* Skeleton lines */}
          {FINGERS.map((chain, fi) =>
            chain.slice(0, -1).map((fromIdx, ci) => {
              const toIdx = chain[ci + 1];
              const segmentIdx = fi * 5 + ci;
              const totalSegments = 30;
              const segmentThreshold = segmentIdx / totalSegments;
              const segOpacity = interpolate(
                skeletonProgress,
                [segmentThreshold, segmentThreshold + 0.08],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <line
                  key={`seg-${fi}-${ci}`}
                  x1={LANDMARKS[fromIdx][0]}
                  y1={LANDMARKS[fromIdx][1]}
                  x2={LANDMARKS[toIdx][0]}
                  y2={LANDMARKS[toIdx][1]}
                  stroke={AUTO_COLORS.landmarkLine}
                  strokeWidth={2.5}
                  opacity={segOpacity * 0.8}
                  strokeLinecap="round"
                />
              );
            })
          )}

          {/* Landmark dots */}
          {LANDMARKS.map(([x, y], i) => {
            const dotDelay = 8 + i * 1.5;
            const dotProgress = spring({
              frame: frame - dotDelay,
              fps,
              config: { damping: 12, stiffness: 250, mass: 0.4 },
            });
            const isFingerTip = [4, 8, 12, 16, 20].includes(i);
            const r = isFingerTip ? 7 : 4.5;

            return (
              <React.Fragment key={`lm-${i}`}>
                {/* Outer glow for fingertips */}
                {isFingerTip && (
                  <circle
                    cx={x}
                    cy={y}
                    r={r + 8 * pulse}
                    fill="none"
                    stroke={AUTO_COLORS.landmark}
                    strokeWidth={1.5}
                    opacity={dotProgress * 0.35 * pulse}
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={r * dotProgress}
                  fill={isFingerTip ? AUTO_COLORS.landmark : AUTO_COLORS.landmarkLine}
                  opacity={dotProgress}
                />
              </React.Fragment>
            );
          })}

          {/* Label: TRACKING */}
          <text
            x={200}
            y={510}
            textAnchor="middle"
            fontSize={22}
            fontWeight={700}
            letterSpacing={6}
            fill={AUTO_COLORS.landmark}
            opacity={labelOpacity}
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          >
            HAND TRACKING ACTIVE
          </text>
        </svg>

        {/* Data readout overlay */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: -220,
            opacity: labelOpacity * 0.85,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontFamily: "'Inter', monospace",
          }}
        >
          {["Landmarks: 21", "Confidence: 0.97", "FPS: 30", "Model: MediaPipe"].map(
            (line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 14,
                  color: AUTO_COLORS.landmark,
                  opacity: 0.7,
                  letterSpacing: 1,
                }}
              >
                {line}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
