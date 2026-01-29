// === COLOR PALETTE ===
export const COLORS = {
  background: '#0a0a0f',
  backgroundLight: '#12121a',
  primary: '#6366f1', // indigo
  primaryLight: '#818cf8',
  secondary: '#22d3ee', // cyan accent
  secondaryDark: '#0891b2',
  text: '#ffffff',
  textMuted: '#94a3b8',
  textDim: '#475569',
  success: '#22c55e',
  successDark: '#16a34a',
  danger: '#ef4444',
  dangerDark: '#dc2626',
  warning: '#f59e0b',
  accent1: '#a855f7', // purple
  accent2: '#f97316', // orange
  accent3: '#ec4899', // pink
  gradientStart: '#6366f1',
  gradientEnd: '#22d3ee',
};

// === FONTS ===
export const FONTS = {
  heading: 'Inter, system-ui, -apple-system, sans-serif',
  body: 'Inter, system-ui, -apple-system, sans-serif',
};

// === FONT WEIGHTS ===
export const WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// === VIDEO SPECS ===
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 3600, // 120 seconds
};

// === SCENE TIMING (in frames) ===
export const SCENES = {
  intro: { start: 0, duration: 300 }, // 0-10s
  whatToSell: { start: 300, duration: 1200 }, // 10-50s
  technicalSkills: { start: 1500, duration: 300 }, // 50-60s
  whoToSellTo: { start: 1800, duration: 750 }, // 60-85s
  howToGetClients: { start: 2550, duration: 750 }, // 85-110s
  outro: { start: 3300, duration: 300 }, // 110-120s
};

// === SPRING CONFIGS ===
export const SPRING_CONFIG = {
  smooth: { damping: 12, stiffness: 100, mass: 0.5 },
  bouncy: { damping: 10, stiffness: 150, mass: 0.4 },
  snappy: { damping: 15, stiffness: 200, mass: 0.3 },
  gentle: { damping: 20, stiffness: 80, mass: 0.6 },
  slam: { damping: 14, stiffness: 250, mass: 0.5 },
};

// === STAGGER DELAYS ===
export const STAGGER = {
  fast: 3, // frames between each element
  normal: 5,
  slow: 8,
  verySlow: 12,
};

// === PRODUCT DATA ===
export const PRODUCTS = [
  {
    title: 'RAG Systems',
    subtitle: 'Connect AI to ANY data source',
    description: 'Give AI full context of any business',
    icon: '🧠',
    color: COLORS.primary,
  },
  {
    title: 'Lead Gen Automations',
    subtitle: 'Scrape → Enrich → Personalize → Send',
    description: 'Scrape, enrich, personalize at scale',
    icon: '🎯',
    color: COLORS.secondary,
  },
  {
    title: 'Voice Agents',
    subtitle: '24/7 sales, fraction of the cost',
    description: '24/7 sales reps for a fraction of the cost',
    icon: '🎙️',
    color: COLORS.accent1,
  },
  {
    title: 'Content Automation',
    subtitle: 'Idea → Final product, automated',
    description: 'Ideation to final product, streamlined',
    icon: '⚡',
    color: COLORS.accent2,
  },
];

// === TARGET MARKET DATA ===
export const MARKETS = {
  bad: [
    { label: 'Mom & Pop Shops', reason: 'No budget', color: COLORS.danger },
    { label: 'Enterprise', reason: 'Red tape', color: COLORS.danger },
  ],
  good: {
    label: '£2M–£10M ARR Companies',
    reason: 'Sweet spot: budget + agility',
    color: COLORS.success,
  },
};

// === CLIENT ACQUISITION DATA ===
export const ACQUISITION = {
  split: { demand: 90, supply: 10 },
  warmNetwork: { contacts: '30-50', result: 'First client' },
  social: [
    { platform: 'Short Form', frequency: '2x / day' },
    { platform: 'LinkedIn', frequency: '3x / week' },
  ],
  milestone: { posts: 100, days: 50 },
};
