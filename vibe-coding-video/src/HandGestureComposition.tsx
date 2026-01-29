import React from "react";
import { Sequence } from "remotion";
import { Background } from "./components/Background";
import { AutomationIntro } from "./components/AutomationIntro";
import { HandTrackingViz } from "./components/HandTrackingViz";
import { GestureTrigger } from "./components/GestureTrigger";
import { AutomationFlow } from "./components/AutomationFlow";
import { AutomationOutro } from "./components/AutomationOutro";
import { AUTO_TIMING } from "./utils/automationConstants";

/**
 * Hand Gesture Automation — 30-second Remotion composition (900 frames @ 30fps)
 *
 * Timeline:
 *   0–120   (0–4s)   Intro         — Title: "Hand Motion Automations"
 * 120–270   (4–9s)   Hand Reveal   — MediaPipe-style hand with landmarks
 * 270–510   (9–17s)  Gestures      — 3 gesture→trigger demos (tap, swipe, pinch)
 * 510–750   (17–25s) Flow          — Node-based automation workflow diagram
 * 750–900   (25–30s) Outro         — Recap cards, CTA, fade to black
 */
export const HandGestureVideo: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Persistent background */}
      <Background />

      {/* Intro: 0–4s */}
      <Sequence
        from={AUTO_TIMING.intro.start}
        durationInFrames={AUTO_TIMING.intro.end - AUTO_TIMING.intro.start}
      >
        <AutomationIntro />
      </Sequence>

      {/* Hand Tracking Reveal: 4–9s */}
      <Sequence
        from={AUTO_TIMING.handReveal.start}
        durationInFrames={AUTO_TIMING.handReveal.end - AUTO_TIMING.handReveal.start}
      >
        <HandTrackingViz />
      </Sequence>

      {/* Gesture → Trigger Demos: 9–17s */}
      <Sequence
        from={AUTO_TIMING.gestures.start}
        durationInFrames={AUTO_TIMING.gestures.end - AUTO_TIMING.gestures.start}
      >
        <GestureTrigger />
      </Sequence>

      {/* Automation Flow Diagram: 17–25s */}
      <Sequence
        from={AUTO_TIMING.flow.start}
        durationInFrames={AUTO_TIMING.flow.end - AUTO_TIMING.flow.start}
      >
        <AutomationFlow />
      </Sequence>

      {/* Outro: 25–30s */}
      <Sequence
        from={AUTO_TIMING.outro.start}
        durationInFrames={AUTO_TIMING.outro.end - AUTO_TIMING.outro.start}
      >
        <AutomationOutro />
      </Sequence>
    </div>
  );
};
