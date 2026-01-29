# AI Agency Video - Design Insights

## Design Decisions
- Dark theme (#0a0a0f) with indigo (#6366f1) + cyan (#22d3ee) as primary/secondary accents
- Each scene manages its own entry/exit animations for clean Sequence transitions
- Cards show one-at-a-time to keep focus and maintain fast-paced feel
- Ambient background elements (gradient orbs, particles, grid overlay) persist across scenes for visual continuity
- Strikethrough animations in WhoToSellTo create strong visual contrast between bad/good options
- Counters and numerical reveals used for data-heavy sections to add visual interest
- "GO." slam ending with particle burst creates a memorable close

## Reusable Components Created
1. **AnimatedText.tsx** - 5 text animation variants:
   - `WordByWord` - spring-based word reveal with blur
   - `LetterByLetter` - character-level spring animation for headlines
   - `BlurReveal` - simple blur-to-sharp fade-in
   - `HighlightSweep` - gradient sweep across text as background clip
   - `TypewriterText` - character-by-character with blinking cursor

2. **BulletPoint.tsx** - 3 bullet variants:
   - `BulletPoint` - icon + text slide-in with stagger
   - `CheckBullet` - checkmark/X circle with text
   - `StrikethroughBullet` - animated strike line + X mark + reason text

3. **SectionTitle.tsx** - 2 header variants:
   - `SectionTitle` - slam-in with underline sweep + glow
   - `NumberedSection` - number pop + title slide

4. **IconReveal.tsx** - 2 icon variants:
   - `IconReveal` - pop-in with glow ring expansion
   - `IconWithLabel` - icon + label with staggered reveal

5. **ProgressBar.tsx** - 2 progress indicators:
   - `ProgressBar` - thin bottom bar with glow dot
   - `SceneIndicator` - dot indicators showing active scene

## Animation Patterns
- **Spring configs** defined as named presets: smooth, bouncy, snappy, gentle, slam
- **Stagger pattern**: base delay + (index * staggerFrames) for sequential reveals
- **Entry/exit**: each scene handles opacity + scale fade on its own frame range
- **Glow pulse**: `Math.sin(frame * rate)` mapped to intensity for organic feel
- **Counter animations**: `interpolate(frame, [start, end], [0, target])` with clamp

## Issues Solved
- TypeScript compiles with zero errors on first pass
- Matched Remotion v4.0.411 + React 19 from existing project for compatibility
- Used `extrapolateLeft/Right: 'clamp'` consistently to prevent animation overshoot
- SVG pie chart uses arc math for the demand/supply split visualization
- Scene indicator auto-detects active scene from frame number
