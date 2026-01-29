/**
 * Constants for the Hand Gesture Automation video.
 * 30 seconds at 30fps = 900 frames, 1920x1080
 */

export const AUTO_VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 900,
};

export const AUTO_COLORS = {
  bg: "#06060e",
  bgGradient1: "#0c0c1a",
  bgGradient2: "#060612",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#475569",
  // Hand / tracking accent
  handSkin: "#e8b89a",
  handOutline: "#d4a088",
  landmark: "#00e5ff",
  landmarkLine: "#00b8d4",
  // Gesture accent colors
  tap: "#22c55e",
  swipe: "#3b82f6",
  pinch: "#f59e0b",
  wave: "#a855f7",
  point: "#ef4444",
  // Platform brand colors
  makeCom: "#6d28d9",
  n8n: "#ea580c",
  goHighLevel: "#0ea5e9",
  zapier: "#ff4a00",
  webhook: "#10b981",
};

/** Timeline breakdown (frame ranges within sequences) */
export const AUTO_TIMING = {
  intro: { start: 0, end: 120 },         // 0-4s:    title + tagline
  handReveal: { start: 120, end: 270 },   // 4-9s:    hand with landmarks appears
  gestures: { start: 270, end: 510 },     // 9-17s:   three gesture→trigger demos
  flow: { start: 510, end: 750 },         // 17-25s:  automation flow visualization
  outro: { start: 750, end: 900 },        // 25-30s:  CTA + fade
};

/** Gesture definitions used across components */
export interface GestureData {
  name: string;
  label: string;
  description: string;
  triggerAction: string;
  platform: string;
  color: string;
  icon: string; // emoji-style label for the automation node
}

export const GESTURES: GestureData[] = [
  {
    name: "TAP",
    label: "Tap Gesture",
    description: "Single finger tap detected",
    triggerAction: "Send webhook to Make.com",
    platform: "Make.com",
    color: AUTO_COLORS.tap,
    icon: "\u{1F446}",
  },
  {
    name: "SWIPE",
    label: "Swipe Gesture",
    description: "Horizontal swipe motion",
    triggerAction: "Trigger n8n workflow",
    platform: "n8n",
    color: AUTO_COLORS.swipe,
    icon: "\u{1F449}",
  },
  {
    name: "PINCH",
    label: "Pinch Gesture",
    description: "Pinch-to-zoom detected",
    triggerAction: "Update GoHighLevel CRM",
    platform: "GoHighLevel",
    color: AUTO_COLORS.pinch,
    icon: "\u{1F90F}",
  },
];

/** Automation flow node definitions */
export interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  x: number;
  y: number;
}

export const FLOW_NODES: FlowNode[] = [
  { id: "gesture",  label: "Hand Gesture",  sublabel: "MediaPipe Input",   color: AUTO_COLORS.landmark,     x: 100,  y: 300 },
  { id: "detect",   label: "Detect",        sublabel: "Classify Gesture",  color: AUTO_COLORS.tap,          x: 370,  y: 180 },
  { id: "webhook",  label: "Webhook",       sublabel: "HTTP POST",         color: AUTO_COLORS.webhook,      x: 370,  y: 420 },
  { id: "make",     label: "Make.com",      sublabel: "Scenario",          color: AUTO_COLORS.makeCom,      x: 640,  y: 120 },
  { id: "n8n",      label: "n8n",           sublabel: "Workflow",          color: AUTO_COLORS.n8n,          x: 640,  y: 300 },
  { id: "ghl",      label: "GoHighLevel",   sublabel: "CRM Update",       color: AUTO_COLORS.goHighLevel,  x: 640,  y: 480 },
  { id: "output",   label: "Output",        sublabel: "Client Action",     color: AUTO_COLORS.wave,         x: 910,  y: 300 },
];

/** Connections between flow nodes [from, to] */
export const FLOW_EDGES: [string, string][] = [
  ["gesture", "detect"],
  ["gesture", "webhook"],
  ["detect", "make"],
  ["detect", "n8n"],
  ["webhook", "n8n"],
  ["webhook", "ghl"],
  ["make", "output"],
  ["n8n", "output"],
  ["ghl", "output"],
];
