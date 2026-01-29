# AI Agency Video - Project Context

## Goal
Build a Remotion project that renders a 2-min video (120 seconds @ 30fps = 3600 frames) about starting an AI agency in 2026.

## Style
- Modern, clean, dark theme with accent colors
- Premium feel, fast-paced, educational
- Kinetic typography throughout

## Motion
- Spring-based animations (damping: 12, stiffness: 100)
- Staggered reveals with 3-5 frame delays
- Smooth easing with Easing.bezier for custom curves
- Scale 0.8 -> 1 with opacity 0 -> 1 for pop-in effects
- translateY from 20px to 0 for text reveals

## Typography
- Bold headlines with letter-by-letter animation
- Supporting text animates word-by-word
- Blur-to-sharp transitions for emphasis
- Highlight sweep with animated gradient on key phrases

## Video Specs
- Resolution: 1920x1080
- FPS: 30
- Duration: 3600 frames (120 seconds)
- Font: Inter (system-ui fallback)

## Scene Breakdown
| Scene | Time | Frames | Content |
|-------|------|--------|---------|
| Intro | 0-10s | 0-300 | Hook + title slam |
| What to Sell | 10-50s | 300-1500 | 4 product cards |
| Technical Reality | 50-60s | 1500-1800 | Skills needed |
| Who to Sell To | 60-85s | 1800-2550 | Target market |
| How to Get Clients | 85-110s | 2550-3300 | Acquisition strategy |
| Outro | 110-120s | 3300-3600 | Recap + CTA |
