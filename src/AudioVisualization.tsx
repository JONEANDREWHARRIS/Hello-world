import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig, staticFile } from "remotion";

interface AudioVisualizationProps {
  audioSrc: string;
}

export const AudioVisualization: React.FC<AudioVisualizationProps> = ({
  audioSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create animated bars for visualization
  const numBars = 20;
  const bars = Array.from({ length: numBars }, (_, i) => {
    // Create a simple animation pattern
    const offset = i * 0.3;
    const height = 50 + Math.sin((frame / fps) * 4 + offset) * 40 + Math.cos((frame / fps) * 2 + offset * 2) * 30;
    return height;
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Audio element */}
      <Audio src={staticFile("audio.mp4")} />

      {/* Title */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 48,
          fontFamily: "Arial, sans-serif",
          marginBottom: 60,
          textAlign: "center",
        }}
      >
        Audio Visualization
      </div>

      {/* Visualization bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          height: 300,
        }}
      >
        {bars.map((height, index) => (
          <div
            key={index}
            style={{
              width: 40,
              height: `${height}%`,
              backgroundColor: `hsl(${200 + index * 8}, 70%, 60%)`,
              borderRadius: 8,
              transition: "height 0.1s ease",
            }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div
        style={{
          marginTop: 60,
          color: "#888",
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {Math.floor(frame / fps)}s
      </div>
    </AbsoluteFill>
  );
};
