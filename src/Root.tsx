import { Composition } from "remotion";
import { AudioVisualization } from "./AudioVisualization";
import { Reel } from "./Reel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Polished Reel - Main composition */}
      <Composition
        id="Reel"
        component={Reel}
        durationInFrames={30 * 30} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920} // Vertical for social media reels
        defaultProps={{
          title: "zauey.talks",
          subtitle: "Original Audio",
          accentColor: "#6366f1",
        }}
      />

      {/* Horizontal version for YouTube/desktop */}
      <Composition
        id="ReelHorizontal"
        component={Reel}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "zauey.talks",
          subtitle: "Original Audio",
          accentColor: "#6366f1",
        }}
      />

      {/* Simple visualization */}
      <Composition
        id="AudioVisualization"
        component={AudioVisualization}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          audioSrc: "/audio.mp4",
        }}
      />
    </>
  );
};
