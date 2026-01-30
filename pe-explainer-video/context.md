Goal: Create a 60-second PE explainer video with 3 sections - Hook (0-5s), Body (5-45s), CTA (45-60s). Dark theme, smooth animations, kinetic typography focus.

## Video Specs
- Duration: 1800 frames (60 seconds at 30fps)
- Resolution: 1920x1080
- FPS: 30

## Visual Style
- Background: Dark gradient (#0a0a0a to #1a1a2e)
- Primary accent: Money green (#00ff88)
- Secondary accent: Warning red (#ff4444)
- Typography: Bold sans-serif, white text with green/red highlights
- Animations: spring() for text entrances, interpolate() for smooth transitions

## Scene Breakdown
1. HOOK (frames 0-150): Word-by-word reveal, dollar signs background
2. THE DEAL (frames 150-450): Animated bar chart, $1B split
3. INTEREST (frames 450-600): Pulsing $400M counter
4. FEES (frames 600-900): Stacked list with slide-in
5. DIVIDEND RECAP (frames 900-1050): Debt cycle diagram
6. TOYS R US (frames 1050-1350): Case study split screen
7. CTA (frames 1350-1800): House fire metaphor, end card

## Component Structure
- Root.tsx - Main composition registration
- PEExplainer.tsx - Main video using Sequence
- components/AnimatedText.tsx - Kinetic typography
- components/BarChart.tsx - Animated bar chart
- components/FeesList.tsx - Stacked fee list
- components/CountUp.tsx - Number counting animation
- scenes/ - Individual scene components
