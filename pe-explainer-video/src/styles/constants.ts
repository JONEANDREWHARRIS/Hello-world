export const COLORS = {
  background: '#0a0a0a',
  backgroundEnd: '#1a1a2e',
  primary: '#00ff88', // Money green
  secondary: '#ff4444', // Warning red
  white: '#ffffff',
  whiteAlpha80: 'rgba(255,255,255,0.8)',
  whiteAlpha60: 'rgba(255,255,255,0.6)',
  whiteAlpha40: 'rgba(255,255,255,0.4)',
  whiteAlpha20: 'rgba(255,255,255,0.2)',
  whiteAlpha10: 'rgba(255,255,255,0.1)',
  whiteAlpha05: 'rgba(255,255,255,0.05)',
  greenAlpha20: 'rgba(0,255,136,0.2)',
  greenAlpha40: 'rgba(0,255,136,0.4)',
  redAlpha20: 'rgba(255,68,68,0.2)',
  redAlpha40: 'rgba(255,68,68,0.4)',
  gold: '#ffd700',
};

export const FONT = {
  family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  weight: {
    regular: 400,
    semibold: 600,
    bold: 700,
    black: 900,
  },
};

export const SPRING_CONFIG = {
  smooth: { damping: 12, stiffness: 100, mass: 1 },
  bouncy: { damping: 10, stiffness: 150, mass: 1 },
  snappy: { damping: 15, stiffness: 200, mass: 1 },
  slam: { damping: 14, stiffness: 250, mass: 1 },
  gentle: { damping: 20, stiffness: 80, mass: 1 },
};

export const STAGGER = {
  fast: 3,
  normal: 5,
  slow: 8,
  verySlow: 12,
};

export const TIMING = {
  scene1Hook: { from: 0, duration: 150 },
  scene2ADeal: { from: 150, duration: 300 },
  scene2BInterest: { from: 450, duration: 150 },
  scene2CFees: { from: 600, duration: 300 },
  scene2DDividend: { from: 900, duration: 150 },
  scene2EToysRUs: { from: 1050, duration: 300 },
  scene3CTA: { from: 1350, duration: 450 },
};
