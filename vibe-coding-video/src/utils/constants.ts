export const VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 1800, // 60 seconds
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
  intro: { start: 0, end: 210 }, // 0-7s
  tool1: { start: 210, end: 480 }, // 7-16s
  tool2: { start: 480, end: 750 }, // 16-25s
  tool3: { start: 750, end: 1020 }, // 25-34s
  tool4: { start: 1020, end: 1290 }, // 34-43s
  tool5: { start: 1290, end: 1560 }, // 43-52s
  outro: { start: 1560, end: 1800 }, // 52-60s
};

// Duration of each tool section in frames
export const TOOL_SECTION_FRAMES = 270; // 9 seconds

export interface ToolData {
  rank: number;
  name: string;
  tagline: string;
  keyPoint: string;
  quote: string;
  quoteAuthor: string;
  pros: string[];
  verdict: string;
  rating: number; // 1-10 scale for the animated bar
  color: string;
}

export const TOOLS: ToolData[] = [
  {
    rank: 1,
    name: "VIBECODE",
    tagline: "Mobile-First Winner",
    keyPoint: "Describe \u2192 Test \u2192 Ship to App Store",
    quote: "If a non-technical friend asked me how to ship a mobile app, I\u2019d send Vibecode first.",
    quoteAuthor: "8-year iOS engineer",
    pros: [
      "Builds real native iOS & Android apps",
      "End-to-end: describe \u2192 test on phone \u2192 publish",
      "Handles UI, logic, and APIs \u2014 not just front-end",
    ],
    verdict: "Best for shipping your first mobile app",
    rating: 10,
    color: COLORS.vibecode,
  },
  {
    rank: 2,
    name: "RORK",
    tagline: "Own Your Code",
    keyPoint: "React Native + GitHub Export",
    quote: "Prototype in Rork, sync to GitHub, then refine with Cursor or Claude.",
    quoteAuthor: "Author\u2019s workflow",
    pros: [
      "React Native & Expo under the hood",
      "Fast previews that don\u2019t break",
      "Full code ownership via GitHub export",
    ],
    verdict: "Best if you want to own your repo",
    rating: 9,
    color: COLORS.rork,
  },
  {
    rank: 3,
    name: "REPLIT",
    tagline: "Cloud Playground",
    keyPoint: "Learn & Prototype Fast",
    quote: "Fun for experiments, but for mobile shipping I prefer Vibecode or Rork.",
    quoteAuthor: "Author\u2019s take",
    pros: [
      "Full cloud IDE: editor, terminal, DB, hosting",
      "Great for learning and quick prototypes",
      "AI assistant for code generation",
    ],
    verdict: "Best for learning \u2014 not ideal for mobile shipping",
    rating: 7,
    color: COLORS.replit,
  },
  {
    rank: 4,
    name: "CURSOR",
    tagline: "Pro\u2019s Workbench",
    keyPoint: "AI-Powered IDE \u00b7 Multi-Model",
    quote: "I often take code exported from Vibecode or Rork and then polish it in Cursor.",
    quoteAuthor: "Author\u2019s workflow",
    pros: [
      "VS Code-style IDE with AI built in",
      "Supports Claude, GPT, and other models",
      "Great for repo-wide refactors and edits",
    ],
    verdict: "Best for polishing \u2014 not a one-click builder",
    rating: 8,
    color: COLORS.cursor,
  },
  {
    rank: 5,
    name: "ROCKET",
    tagline: "One to Watch",
    keyPoint: "Figma \u2192 Full App",
    quote: "I watch it, but I would not move my main production app there yet.",
    quoteAuthor: "Author\u2019s take",
    pros: [
      "Import Figma designs \u2192 real screens",
      "Aims at full-stack mobile + web",
      "Tries to build real apps, not toy demos",
    ],
    verdict: "Promising but still early stage",
    rating: 6,
    color: COLORS.rocket,
  },
];
