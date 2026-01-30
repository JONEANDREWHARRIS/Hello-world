# Rendering Decisions & Component Structure

## Architecture Decisions
- Following same patterns as ai-agency-video project for consistency
- Using Remotion 4.x with React 19, TypeScript
- Dark corporate aesthetic with green/red accent colors for financial theme
- Spring physics for organic motion feel
- Staggered reveals for text hierarchy

## Component Structure Rationale
- AnimatedText: Reusable word-by-word and letter-by-letter reveals
- CountUp: Dedicated number interpolation component for financial figures
- BarChart: SVG-based animated bars for the deal breakdown visual
- FeesList: Specialized staggered list for fee enumeration
- Each scene is self-contained with its own timing relative to sequence start

## Rendering Notes
- H.264 codec with CRF 18 for high quality
- 1920x1080 at 30fps for social media compatibility
- Total duration: 1800 frames = 60 seconds
- Using extrapolateRight: "clamp" on all interpolations to prevent overshoot
- Used Playwright's chrome-headless-shell for rendering (system Chrome unavailable)
- Final output: out/video.mp4, 7.8 MB

## Animation Techniques Used
- **WordByWord**: Each word springs in with scale + blur-to-sharp + opacity transition
- **CountUp**: interpolate() drives numeric counter from 0 to target value
- **BarChart**: Bars grow from bottom using spring(), labels count up in parallel
- **FeesList**: Items slide in from left with staggered 30-frame delays, accent bars grow
- **Scene exits**: All scenes fade opacity 0 in final 20 frames for smooth transitions
- **Background effects**: Floating dollar signs, falling coins, red flash overlays
- **Circular flow diagram**: SVG ellipse with rotating dot for debt cycle visualization
- **House fire**: Simple house SVG with emoji fire overlay + radial glow + color shift
- **Progress bar**: Bottom progress indicator with glowing dot at leading edge
