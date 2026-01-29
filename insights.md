# Design Insights & Decisions

## Timing Breakdown
- 30 seconds @ 30fps = 900 total frames
- Intro: 4 seconds (120 frames) - enough for title + subtitle with spring animations
- Each tool: ~4.4 seconds (132 frames) - rank entrance, name, tagline, key point, exit
- Outro: 4 seconds (120 frames) - summary cards + CTA fade

## Design Decisions
- Using dark mode (#0a0a0f) background for modern tech aesthetic
- Each tool gets a unique accent color for visual distinction
- Spring animations for bouncy, energetic feel appropriate for beginner audience
- Staggered text reveals for kinetic typography effect
- Grain overlay at low opacity for texture without distraction

## Architecture Notes
- `src/utils/animations.ts` - All reusable animation functions (springIn, slideFromLeft, slideFromRight, staggerText, fadeBlur, countUp, fadeOut, scaleUp)
- `src/utils/constants.ts` - Video config, colors, timing, and tool data
- `src/components/Background.tsx` - Animated gradient mesh + grid + grain overlay
- `src/components/StaggeredText.tsx` - Reusable kinetic typography component
- `src/components/Intro.tsx` - Title + subtitle with blur reveal (0-4s)
- `src/components/ToolCard.tsx` - Reusable tool ranking card with rank number, name, tagline, key point
- `src/components/Outro.tsx` - Summary cards + CTA + fade to black (26-30s)
- `src/Composition.tsx` - Main composition stitching all Sequences together
- `src/Root.tsx` - Remotion root registration
- `src/index.ts` - Entry point

## Issues Log
- TypeScript compilation: PASSES clean with no errors
- Rendering requires Chrome Headless Shell download (not available in sandboxed env)
- Minor version mismatch in transitive Remotion dependencies (4.0.411 vs 4.0.410) - cosmetic warning, does not affect functionality
- To render locally: run `npm start` for Remotion Studio or `npm run render` for MP4 output
