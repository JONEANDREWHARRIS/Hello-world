import { Composition } from "remotion";
import { AudioVisualization } from "./AudioVisualization";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AudioVisualization"
        component={AudioVisualization}
        durationInFrames={30 * 30} // 30 seconds at 30fps (adjust as needed)
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
