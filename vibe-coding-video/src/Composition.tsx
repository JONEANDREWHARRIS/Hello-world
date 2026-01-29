import React from "react";
import { Sequence } from "remotion";
import { Background } from "./components/Background";
import { FloatingParticles } from "./components/FloatingParticles";
import { Intro } from "./components/Intro";
import { ToolCard } from "./components/ToolCard";
import { TransitionWipe } from "./components/TransitionWipe";
import { Outro } from "./components/Outro";
import { TOOLS, TIMING, COLORS } from "./utils/constants";

/**
 * Main video composition — 60 seconds at 30fps (1800 frames)
 *
 * Timeline:
 *     0-210  : Intro (0-7s)
 *   210-480  : Tool #1 - Vibecode (7-16s)
 *   480-750  : Tool #2 - Rork (16-25s)
 *   750-1020 : Tool #3 - Replit (25-34s)
 *  1020-1290 : Tool #4 - Cursor (34-43s)
 *  1290-1560 : Tool #5 - Rocket (43-52s)
 *  1560-1800 : Outro (52-60s)
 */
export const VibeToolsVideo: React.FC = () => {
  const toolTimings = [
    TIMING.tool1,
    TIMING.tool2,
    TIMING.tool3,
    TIMING.tool4,
    TIMING.tool5,
  ];

  const toolColors = [
    COLORS.vibecode,
    COLORS.rork,
    COLORS.replit,
    COLORS.cursor,
    COLORS.rocket,
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Background - persistent across entire video */}
      <Background />

      {/* Floating particles - persistent */}
      <FloatingParticles color="#ffffff" count={25} />

      {/* Intro Section: 0-7 seconds */}
      <Sequence
        from={TIMING.intro.start}
        durationInFrames={TIMING.intro.end - TIMING.intro.start}
      >
        <Intro />
      </Sequence>

      {/* Transition wipe into first tool */}
      <Sequence from={TIMING.intro.end - 5} durationInFrames={25}>
        <TransitionWipe color={COLORS.vibecode} direction="right" />
      </Sequence>

      {/* Tool Rankings: 5 tools, 9 seconds each */}
      {TOOLS.map((tool, index) => {
        const timing = toolTimings[index];
        const nextColor = index < 4 ? toolColors[index + 1] : COLORS.textMuted;
        return (
          <React.Fragment key={tool.name}>
            <Sequence
              from={timing.start}
              durationInFrames={timing.end - timing.start}
            >
              <ToolCard tool={tool} />
            </Sequence>

            {/* Transition wipe to next section */}
            <Sequence from={timing.end - 5} durationInFrames={25}>
              <TransitionWipe
                color={nextColor}
                direction={index % 2 === 0 ? "right" : "left"}
              />
            </Sequence>
          </React.Fragment>
        );
      })}

      {/* Outro Section: 52-60 seconds */}
      <Sequence
        from={TIMING.outro.start}
        durationInFrames={TIMING.outro.end - TIMING.outro.start}
      >
        <Outro />
      </Sequence>
    </div>
  );
};
