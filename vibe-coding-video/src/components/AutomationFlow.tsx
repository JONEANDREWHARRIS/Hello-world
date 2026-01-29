import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import {
  AUTO_COLORS,
  FLOW_NODES,
  FLOW_EDGES,
  FlowNode,
} from "../utils/automationConstants";

/**
 * Node-based automation flow visualization.
 * Shows interconnected automation nodes (hand gesture → detection → platforms → output)
 * with animated connections and data pulses flowing through.
 *
 * Runs for 240 frames (~8s) within its Sequence.
 */

const NODE_W = 180;
const NODE_H = 80;

// --- Sub-component: Flow Node card ----------------------------------------

const FlowNodeCard: React.FC<{
  node: FlowNode;
  delay: number;
}> = ({ node, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });
  const cardScale = interpolate(entrance, [0, 1], [0.5, 1]);
  const cardOpacity = entrance;

  // Subtle breathing glow
  const breathe = Math.sin((frame + delay * 3) * 0.08) * 0.3 + 0.7;

  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
        transform: `scale(${cardScale})`,
        opacity: cardOpacity,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          border: `2px solid ${node.color}50`,
          background: `linear-gradient(135deg, ${node.color}12, ${AUTO_COLORS.bg}ee)`,
          boxShadow: `0 0 ${20 * breathe}px ${node.color}20`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "8px 12px",
        }}
      >
        {/* Node label */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: node.color,
            letterSpacing: 1.5,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            textAlign: "center",
          }}
        >
          {node.label}
        </div>
        {/* Sublabel */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: AUTO_COLORS.textSecondary,
            letterSpacing: 1,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            textAlign: "center",
          }}
        >
          {node.sublabel}
        </div>
      </div>

      {/* Status dot */}
      <div
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: node.color,
          boxShadow: `0 0 8px ${node.color}`,
          opacity: cardOpacity * breathe,
        }}
      />
    </div>
  );
};

// --- Main component --------------------------------------------------------

export const AutomationFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale to fill 1920x1080 from the logical 1100×600 layout
  const layoutScale = 1.5;
  const offsetX = 180;
  const offsetY = 120;

  // Overall entrance
  const containerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Section title
  const titleProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 16, stiffness: 160, mass: 0.6 },
  });

  // Exit fade
  const exitOpacity = interpolate(frame, [210, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Build a quick lookup for node positions (center of each node)
  const nodeCenter = (id: string): { x: number; y: number } => {
    const n = FLOW_NODES.find((n) => n.id === id);
    if (!n) return { x: 0, y: 0 };
    return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: containerOpacity * exitOpacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 50,
          width: "100%",
          textAlign: "center",
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: AUTO_COLORS.textPrimary,
            letterSpacing: 4,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          AUTOMATION{" "}
          <span style={{ color: AUTO_COLORS.landmark }}>FLOW</span>
        </span>
      </div>

      {/* Flow diagram container */}
      <div
        style={{
          position: "absolute",
          top: offsetY,
          left: offsetX,
          transform: `scale(${layoutScale})`,
          transformOrigin: "top left",
        }}
      >
        {/* SVG layer for edges */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
          width={1100}
          height={600}
        >
          {FLOW_EDGES.map(([fromId, toId], i) => {
            const from = nodeCenter(fromId);
            const to = nodeCenter(toId);

            // Edge draws on with staggered delay
            const edgeDelay = 20 + i * 6;
            const edgeProgress = interpolate(
              frame,
              [edgeDelay, edgeDelay + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Data pulse traveling along edge
            const pulseT = ((frame - edgeDelay * 1.5) % 50) / 50;
            const pulseX = from.x + (to.x - from.x) * pulseT;
            const pulseY = from.y + (to.y - from.y) * pulseT;
            const pulseVisible = frame > edgeDelay + 20;

            // Determine color from source node
            const sourceNode = FLOW_NODES.find((n) => n.id === fromId);
            const edgeColor = sourceNode?.color || AUTO_COLORS.landmark;

            return (
              <React.Fragment key={`edge-${i}`}>
                {/* Edge line */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={from.x + (to.x - from.x) * edgeProgress}
                  y2={from.y + (to.y - from.y) * edgeProgress}
                  stroke={edgeColor}
                  strokeWidth={2}
                  opacity={0.35}
                  strokeDasharray="6 4"
                />
                {/* Pulse dot */}
                {pulseVisible && (
                  <circle
                    cx={pulseX}
                    cy={pulseY}
                    r={4}
                    fill={edgeColor}
                    opacity={0.9}
                  >
                    {/* SVG glow via filter not needed — boxShadow equivalent */}
                  </circle>
                )}
              </React.Fragment>
            );
          })}
        </svg>

        {/* Node cards */}
        {FLOW_NODES.map((node, i) => (
          <FlowNodeCard key={node.id} node={node} delay={8 + i * 8} />
        ))}
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {[
          { label: "Nodes Active", value: "7", color: AUTO_COLORS.landmark },
          { label: "Connections", value: "9", color: AUTO_COLORS.tap },
          { label: "Latency", value: "<50ms", color: AUTO_COLORS.swipe },
        ].map((stat, i) => {
          const statOpacity = spring({
            frame: frame - (80 + i * 10),
            fps,
            config: { damping: 18, stiffness: 200, mass: 0.5 },
          });
          return (
            <div
              key={i}
              style={{
                opacity: statOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "'Inter', monospace",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 13,
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
    </div>
  );
};
