# Remotion Optimization Review

## Part 1: Types of Edits Available in Remotion

### Core Animations (Currently Used)
- `spring()` with configurable damping/stiffness/mass
- `interpolate()` for frame-to-value mapping
- Manual frame math for opacity, scale, translate

### The 5 Basic Transforms
| Transform | CSS Property | Description |
|-----------|-------------|-------------|
| Opacity | `opacity` | Fade in/out (0 = invisible, 1 = visible) |
| Scale | `scale` or `transform: scale()` | Grow/shrink elements |
| Translate | `transform: translateX/Y/Z()` | Move elements on any axis |
| Rotate | `transform: rotate()` | Spin around Z, X, or Y axis |
| Skew | `transform: skew()` | Distort/stretch elements |

### Additional Animatable Properties (Not Yet Used)
- `border-radius` - morph shapes (square to circle transitions)
- `interpolateColors()` - smooth color transitions between scenes
- `evolvePath()` - animate SVG path drawing (great for diagrams)
- Dynamic font weight and slant changes
- `linear-gradient` stop positions
- CSS `filter()` values (blur, brightness, contrast, etc.)
- `makeTransform()` from `@remotion/animation-utils` for type-safe transform strings

### Scene Transitions (NEW - `@remotion/transitions`)
Currently scenes cut hard. The transitions package provides:

| Transition | Effect | Best For |
|-----------|--------|----------|
| `fade()` | Cross-dissolve | Smooth scene changes |
| `slide()` | Slide in from direction | Sequential content |
| `wipe()` | Wipe reveal | Dramatic reveals |
| `flip()` | 3D card flip | Before/after |
| `clockWipe()` | Clock hand sweep | Time-based reveals |
| `iris()` | Circular iris open/close | Focus transitions |
| `cube()` | 3D cube rotation (paid) | Premium feel |
| `none()` | No visual (timing only) | Audio-only transitions |

**Usage:**
```tsx
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={300}>
    <Intro />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={slide()}
    timing={linearTiming({ durationInFrames: 30 })}
  />
  <TransitionSeries.Sequence durationInFrames={1200}>
    <WhatToSell />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

### Audio Capabilities
- Import audio with `<Html5Audio>` or `<Audio>`
- Delay audio start with `<Sequence from={frame}>`
- Volume control with fade curves
- Speed and pitch control
- Audio visualization (reactive visuals from waveforms)
- Extract audio from video files

### Other Edit Types
- **Image sequences** - frame-by-frame imports from After Effects
- **Video embedding** - `<OffthreadVideo>` for inline video clips
- **Captions** - import, transcribe, display, and export
- **Layering** - `<AbsoluteFill>` for Photoshop-like stacking
- **Parameterized videos** - data-driven generation
- **GIF rendering** - export as animated GIF
- **Transparent video** - alpha channel for overlays
- **Enter/Exit animations** - place transitions first/last in TransitionSeries

---

## Part 2: Reducing Rendering Time

### 1. Add `remotion.config.ts` (No Config Exists Currently)
```ts
import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg"); // Faster than PNG for opaque videos
Config.setConcurrency(4);           // Set after benchmarking
Config.setCodec("h264");            // Fastest codec
```

### 2. Benchmark Concurrency
```bash
npx remotion benchmark --concurrency=2
npx remotion benchmark --concurrency=4
npx remotion benchmark --concurrency=8
```
Find the optimal value for your hardware.

### 3. Add `React.memo()` to Static Components
Components re-render every frame (3,600x for AI Agency). Memoize components that don't change per-frame:
```tsx
const StaticBackground = React.memo(({ color }: { color: string }) => (
  <AbsoluteFill style={{ backgroundColor: color }} />
));
```

### 4. `useMemo` for Expensive Calculations
```tsx
// Before: recalculates 30 particles every frame
const particles = Array.from({ length: 30 }, () => ({ ... }));

// After: calculate once
const particles = useMemo(() =>
  Array.from({ length: 30 }, () => ({ ... })),
[]);
```

### 5. Replace GPU-Heavy CSS Properties
| Property | Where Used | Optimization |
|---|---|---|
| `filter: blur()` | AnimatedText BlurReveal, scenes | Use opacity fade instead or pre-rendered image |
| `radial-gradient()` | Background, scenes | Use static gradient image via `staticFile()` |
| `box-shadow` | BulletPoint, ToolCard | Simpler border or static shadow image |
| `linear-gradient` on text | HighlightSweep | Pre-render gradient as image |

### 6. Preview vs Production Render Settings
**Quick preview (during development):**
```bash
npx remotion render src/index.ts AIAgencyVideo out/preview.mp4 --crf=28 --concurrency=8
```

**Final production render:**
```bash
npx remotion render src/index.ts AIAgencyVideo out/final.mp4 --crf=16
```

### 7. Codec Selection
| Need | Codec | Trade-off |
|---|---|---|
| Fastest render | H.264 (default) | Medium file size |
| Smallest file | VP9 | Very slow to render |
| Best quality | ProRes | Large file size |
| Quick preview | H.264 + high CRF | Lower quality, fast |

### 8. Hardware-Accelerated Encoding (macOS)
```bash
npx remotion render --hardware-acceleration=if-possible --video-bitrate=8M
```

### 9. Use MP3 Audio Codec
MP3 is faster to encode than AAC during the combining stage:
```bash
npx remotion render --audio-codec=mp3
```

### 10. Reduce Animation Complexity
- Reduce particle count from 30 to 10-15
- Pre-calculate static positions
- Use simpler math (linear vs sine-wave)

### 11. Cloud Rendering for Scale
- **AWS Lambda** (`@remotion/lambda`) - parallel chunk rendering
- **GitHub Actions** - CI/CD rendering pipeline
- **Google Cloud Run** - alternative (alpha)

---

## Part 3: Priority Rankings

| # | Optimization | Impact | Effort |
|---|---|---|---|
| 1 | Add `remotion.config.ts` | 20-30% faster | Low |
| 2 | `React.memo()` on static components | 15-25% faster | Medium |
| 3 | Benchmark concurrency | 10-30% faster | Low |
| 4 | Replace `filter: blur()` | 10-20% faster | Medium |
| 5 | Use `--crf=28` for previews | 40-50% faster previews | Low |
| 6 | Add `<TransitionSeries>` | Better quality | Medium |
| 7 | Reduce particles (30 to 15) | 5-10% faster | Low |
| 8 | `useMemo` for spring configs | 5-10% faster | Low |
| 9 | MP3 audio codec | Faster combining | Low |
| 10 | AWS Lambda | 10x+ faster | High |

---

## Sources
- [Remotion Performance Tips](https://www.remotion.dev/docs/performance)
- [Optimizing for Speed (Lambda)](https://www.remotion.dev/docs/lambda/optimizing-speed)
- [Hardware Accelerated Encoding](https://www.remotion.dev/docs/hardware-acceleration)
- [Encoding Guide / Quality](https://www.remotion.dev/docs/quality)
- [Transitions](https://www.remotion.dev/docs/transitioning)
- [Animating Properties](https://www.remotion.dev/docs/animating-properties)
- [Distributed Rendering](https://www.remotion.dev/docs/distributed-rendering)
- Remotion Complete Documentation.pdf (local)
