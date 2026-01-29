import React from "react";
import { Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./components/Background";
import { Intro } from "./components/Intro";
import { ToolCard } from "./components/ToolCard";
import { Outro } from "./components/Outro";
import { TOOLS, TIMING } from "./utils/constants";

/**
 * Main video composition - 30 seconds at 30fps (900 frames)
 *
 * Timeline:
 *   0-120   : Intro (0-4s)
 * 120-252   : Tool #1 - Vibecode (4-8.4s)
 * 252-384   : Tool #2 - Rork (8.4-12.8s)
 * 384-516   : Tool #3 - Replit (12.8-17.2s)
 * 516-648   : Tool #4 - Cursor (17.2-21.6s)
 * 648-780   : Tool #5 - Rocket (21.6-26s)
 * 780-900   : Outro (26-30s)
 */
export const VibeToolsVideo: React.FC = () => {
  const toolTimings = [
    TIMING.tool1,
    TIMING.tool2,
    TIMING.tool3,
    TIMING.tool4,
    TIMING.tool5,
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

      {/* Intro Section: 0-4 seconds */}
      <Sequence from={TIMING.intro.start} durationInFrames={TIMING.intro.end - TIMING.intro.start}>
        <Intro />
      </Sequence>

      {/* Tool Rankings: 5 tools, ~4.4 seconds each */}
      {TOOLS.map((tool, index) => {
        const timing = toolTimings[index];
        return (
          <Sequence
            key={tool.name}
            from={timing.start}
            durationInFrames={timing.end - timing.start}
          >
            <ToolCard tool={tool} />
          </Sequence>
        );
      })}

      {/* Outro Section: 26-30 seconds */}
      <Sequence from={TIMING.outro.start} durationInFrames={TIMING.outro.end - TIMING.outro.start}>
        <Outro />
      </Sequence>
    </div>
  );
};
