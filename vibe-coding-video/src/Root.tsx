import React from "react";
import { Composition } from "remotion";
import { VibeToolsVideo } from "./Composition";
import { VIDEO_CONFIG } from "./utils/constants";

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
    </>
  );
};
