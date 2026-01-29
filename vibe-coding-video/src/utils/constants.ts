export const VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 900, // 30 seconds
};

export const COLORS = {
  bg: "#0a0a0f",
  bgGradient1: "#0f0f1a",
  bgGradient2: "#0a0a0f",
  textPrimary: "#ffffff",
  textSecondary: "#888888",
  textMuted: "#555555",
  // Tool accent colors
  vibecode: "#22c55e", // Green
  rork: "#3b82f6", // Blue
  replit: "#f97316", // Orange
  cursor: "#a855f7", // Purple
  rocket: "#ef4444", // Red
};

export const TIMING = {
  intro: { start: 0, end: 120 }, // 0-4s
  tool1: { start: 120, end: 252 }, // 4-8.4s
  tool2: { start: 252, end: 384 }, // 8.4-12.8s
  tool3: { start: 384, end: 516 }, // 12.8-17.2s
  tool4: { start: 516, end: 648 }, // 17.2-21.6s
  tool5: { start: 648, end: 780 }, // 21.6-26s
  outro: { start: 780, end: 900 }, // 26-30s
};

export interface ToolData {
  rank: number;
  name: string;
  tagline: string;
  keyPoint: string;
  color: string;
}

export const TOOLS: ToolData[] = [
  {
    rank: 1,
    name: "VIBECODE",
    tagline: "Mobile-First Winner",
    keyPoint: "Describe \u2192 Test \u2192 Ship",
    color: COLORS.vibecode,
  },
  {
    rank: 2,
    name: "RORK",
    tagline: "Own Your Code",
    keyPoint: "React Native + GitHub",
    color: COLORS.rork,
  },
  {
    rank: 3,
    name: "REPLIT",
    tagline: "Cloud Playground",
    keyPoint: "Learn & Prototype Fast",
    color: COLORS.replit,
  },
  {
    rank: 4,
    name: "CURSOR",
    tagline: "Pro\u2019s Workbench",
    keyPoint: "AI-Powered IDE",
    color: COLORS.cursor,
  },
  {
    rank: 5,
    name: "ROCKET",
    tagline: "One to Watch",
    keyPoint: "Figma \u2192 Full App",
    color: COLORS.rocket,
  },
];
