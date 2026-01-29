import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { AUTO_COLORS, GESTURES, GestureData } from "../utils/automationConstants";

/**
 * Shows three gesture→automation trigger demonstrations in sequence.
 * Each gesture gets ~80 frames (~2.7s):
 *   - Hand performs gesture (left side)
 *   - Arrow shoots across
 *   - Automation trigger card appears (right side)
 *
 * Total: 240 frames within its Sequence.
 */

const GESTURE_DURATION = 80;

// --- Sub-component: single gesture demo -----------------------------------

const GestureDemo: React.FC<{
  gesture: GestureData;
  index: number;
}> = ({ gesture, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - index * GESTURE_DURATION;

  // Don't render if not in this gesture's window
  if (localFrame < 0 || localFrame > GESTURE_DURATION) return null;

  // -- Gesture icon entrance (left side) --
  const iconScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.6 },
  });
  const iconOpacity = interpolate(iconScale, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // -- Hand silhouette animation --
  const handPulse = interpolate(
    localFrame,
    [10, 20, 30],
    [1, 1.1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // -- Arrow shoots from left to right --
  const arrowProgress = interpolate(localFrame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrowX = interpolate(arrowProgress, [0, 1], [0, 400]);
  const arrowOpacity = interpolate(
    localFrame,
    [15, 20, 40, 50],
    [0, 1, 1, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // -- Trigger card entrance (right side) --
  const cardProgress = spring({
    frame: localFrame - 30,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.7 },
  });
  const cardX = interpolate(cardProgress, [0, 1], [80, 0]);

  // -- Data pulse (particles along the arrow) --
  const particleCount = 5;

  // -- Exit --
  const exitOpacity = interpolate(localFrame, [60, GESTURE_DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
      {/* Left: Gesture visual */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: 60,
          opacity: iconOpacity,
          transform: `scale(${iconScale})`,
        }}
      >
        {/* Gesture circle with hand silhouette */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `3px solid ${gesture.color}`,
            background: `radial-gradient(circle, ${gesture.color}15, transparent 70%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 40px ${gesture.color}30, inset 0 0 30px ${gesture.color}10`,
            transform: `scale(${handPulse})`,
          }}
        >
          {/* SVG hand silhouette performing gesture */}
          <svg viewBox="0 0 100 100" width={100} height={100}>
            {gesture.name === "TAP" && (
              <>
                {/* Index finger pointing down */}
                <path
                  d="M 50 20 Q 48 40 50 65 Q 52 40 50 20"
                  fill={gesture.color}
                  opacity={0.9}
                />
                <circle cx={50} cy={72} r={6} fill={gesture.color} opacity={handPulse > 1.03 ? 0.9 : 0.4} />
                {/* Tap rings */}
                <circle cx={50} cy={72} r={12 * handPulse} fill="none" stroke={gesture.color} strokeWidth={1.5} opacity={handPulse > 1.03 ? 0.6 : 0} />
                <circle cx={50} cy={72} r={20 * handPulse} fill="none" stroke={gesture.color} strokeWidth={1} opacity={handPulse > 1.03 ? 0.3 : 0} />
              </>
            )}
            {gesture.name === "SWIPE" && (
              <>
                {/* Open palm moving right */}
                <path
                  d="M 25 50 L 70 50"
                  stroke={gesture.color}
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <path
                  d="M 58 38 L 72 50 L 58 62"
                  stroke={gesture.color}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.9}
                />
                {/* Motion lines */}
                {[35, 45, 55].map((y, i) => (
                  <line
                    key={i}
                    x1={15}
                    y1={y}
                    x2={30}
                    y2={y}
                    stroke={gesture.color}
                    strokeWidth={1.5}
                    opacity={0.4}
                    strokeLinecap="round"
                  />
                ))}
              </>
            )}
            {gesture.name === "PINCH" && (
              <>
                {/* Two fingers pinching */}
                <path
                  d="M 30 30 Q 45 45 50 50"
                  stroke={gesture.color}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <path
                  d="M 70 30 Q 55 45 50 50"
                  stroke={gesture.color}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <circle cx={50} cy={50} r={5} fill={gesture.color} opacity={handPulse > 1.03 ? 0.9 : 0.5} />
                {/* Zoom lines */}
                <path d="M 35 65 L 20 80" stroke={gesture.color} strokeWidth={1.5} opacity={0.4} strokeLinecap="round" />
                <path d="M 65 65 L 80 80" stroke={gesture.color} strokeWidth={1.5} opacity={0.4} strokeLinecap="round" />
              </>
            )}
          </svg>
        </div>

        {/* Gesture name label */}
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 800,
            color: gesture.color,
            letterSpacing: 4,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {gesture.name}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 16,
            color: AUTO_COLORS.textSecondary,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {gesture.description}
        </div>
      </div>

      {/* Arrow + particles */}
      <div style={{ position: "relative", width: 400, height: 60 }}>
        {/* Arrow line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: arrowX,
            height: 3,
            background: `linear-gradient(90deg, ${gesture.color}, ${AUTO_COLORS.landmark})`,
            borderRadius: 2,
            opacity: arrowOpacity,
            transform: "translateY(-50%)",
          }}
        />
        {/* Arrowhead */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: arrowX - 5,
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderLeft: `12px solid ${AUTO_COLORS.landmark}`,
            transform: "translateY(-50%)",
            opacity: arrowOpacity,
          }}
        />
        {/* Data particles */}
        {Array.from({ length: particleCount }).map((_, i) => {
          const pOffset = (localFrame * 4 + i * 80) % 400;
          const pOpacity = arrowProgress > 0.3 ? 0.6 : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: pOffset,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: gesture.color,
                opacity: pOpacity * (1 - pOffset / 400),
                transform: "translateY(-50%)",
                boxShadow: `0 0 6px ${gesture.color}`,
              }}
            />
          );
        })}

        {/* Label in center */}
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            color: AUTO_COLORS.textMuted,
            letterSpacing: 2,
            fontFamily: "'Inter', monospace",
            opacity: arrowOpacity * 0.7,
            whiteSpace: "nowrap",
          }}
        >
          WEBHOOK FIRED
        </div>
      </div>

      {/* Right: Trigger card */}
      <div
        style={{
          opacity: cardProgress,
          transform: `translateX(${cardX}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "28px 36px",
          borderRadius: 20,
          border: `1px solid ${AUTO_COLORS.landmark}30`,
          background: `linear-gradient(145deg, ${AUTO_COLORS.landmark}08, transparent)`,
          minWidth: 300,
          boxShadow: `0 0 30px ${AUTO_COLORS.landmark}10`,
        }}
      >
        {/* Platform name */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: AUTO_COLORS.textMuted,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {gesture.platform}
        </div>
        {/* Action */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: AUTO_COLORS.textPrimary,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {gesture.triggerAction}
        </div>
        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: AUTO_COLORS.tap,
              boxShadow: `0 0 8px ${AUTO_COLORS.tap}`,
            }}
          />
          <span
            style={{
              fontSize: 14,
              color: AUTO_COLORS.tap,
              fontWeight: 600,
              fontFamily: "'Inter', monospace",
              letterSpacing: 1,
            }}
          >
            TRIGGERED
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main component --------------------------------------------------------

export const GestureTrigger: React.FC = () => {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      {GESTURES.map((gesture, i) => (
        <GestureDemo key={gesture.name} gesture={gesture} index={i} />
      ))}
    </div>
  );
};
