import React from "react";
import { Composition } from "remotion";
import { VibeToolsVideo } from "./Composition";
import { HandGestureVideo } from "./HandGestureComposition";
import { VIDEO_CONFIG } from "./utils/constants";
import { AUTO_VIDEO_CONFIG } from "./utils/automationConstants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VibeToolsVideo"
        component={VibeToolsVideo}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="HandGestureAutomation"
        component={HandGestureVideo}
        durationInFrames={AUTO_VIDEO_CONFIG.durationInFrames}
        fps={AUTO_VIDEO_CONFIG.fps}
        width={AUTO_VIDEO_CONFIG.width}
        height={AUTO_VIDEO_CONFIG.height}
      />
    </>
  );
};
