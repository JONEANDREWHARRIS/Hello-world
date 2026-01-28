import {
  AbsoluteFill,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  spring,
  Sequence,
} from "remotion";

interface ReelProps {
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

// Animated background with gradient
const AnimatedBackground: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 300], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${rotation}deg, #0f0f1a 0%, #1a1a2e 50%, ${accentColor}22 100%)`,
      }}
    />
  );
};

// Floating particles effect
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (i * 73) % 100,
    y: (i * 47) % 100,
    size: 2 + (i % 4),
    speed: 0.5 + (i % 3) * 0.3,
  }));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {particles.map((p) => {
        const y = (p.y + frame * p.speed * 0.3) % 120 - 10;
        const opacity = interpolate(y, [0, 50, 100], [0, 0.6, 0]);
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: "white",
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Animated title component
const AnimatedTitle: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize: 72,
        fontWeight: "bold",
        color: "white",
        fontFamily: "'Arial Black', sans-serif",
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity,
        textShadow: "0 4px 30px rgba(0,0,0,0.5)",
        letterSpacing: 2,
      }}
    >
      {text}
    </div>
  );
};

// Subtitle with typewriter effect
const Subtitle: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(interpolate(frame - delay, [0, text.length * 2], [0, text.length], {
    extrapolateRight: "clamp",
  }));

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize: 28,
        color: "#aaa",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        marginTop: 20,
        opacity,
        letterSpacing: 4,
        textTransform: "uppercase",
      }}
    >
      {text.slice(0, charsToShow)}
      <span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>|</span>
    </div>
  );
};

// Audio visualizer bars
const AudioBars: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numBars = 40;

  const bars = Array.from({ length: numBars }, (_, i) => {
    const offset = i * 0.2;
    const time = frame / fps;
    const height =
      30 +
      Math.sin(time * 6 + offset) * 25 +
      Math.cos(time * 4 + offset * 1.5) * 20 +
      Math.sin(time * 8 + offset * 0.5) * 15;
    return Math.max(10, height);
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        height: 200,
      }}
    >
      {bars.map((height, index) => {
        const hue = interpolate(index, [0, numBars], [200, 280]);
        return (
          <div
            key={index}
            style={{
              width: 8,
              height: `${height}%`,
              background: `linear-gradient(to top, ${accentColor}, hsl(${hue}, 80%, 65%))`,
              borderRadius: 4,
              boxShadow: `0 0 10px ${accentColor}66`,
            }}
          />
        );
      })}
    </div>
  );
};

// Circular progress ring
const ProgressRing: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg width="100" height="100" style={{ position: "absolute", bottom: 40, right: 40 }}>
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#333"
        strokeWidth="4"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={accentColor}
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
      />
    </svg>
  );
};

// Main Reel component
export const Reel: React.FC<ReelProps> = ({
  title = "zauey.talks",
  subtitle = "Original Audio",
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* Audio */}
      <Audio src={staticFile("audio.mp4")} />

      {/* Background */}
      <AnimatedBackground accentColor={accentColor} />

      {/* Particles */}
      <Particles />

      {/* Main content with fade out */}
      <AbsoluteFill style={{ opacity: fadeOut }}>

        {/* Intro sequence - Title */}
        <Sequence from={0} durationInFrames={durationInFrames}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* Title appears first */}
            <Sequence from={15}>
              <AnimatedTitle text={title} />
            </Sequence>

            {/* Subtitle with typewriter */}
            <Sequence from={45}>
              <Subtitle text={subtitle} />
            </Sequence>

            {/* Audio bars appear after intro */}
            <Sequence from={90}>
              <div style={{ marginTop: 80 }}>
                <AudioBars accentColor={accentColor} />
              </div>
            </Sequence>
          </AbsoluteFill>
        </Sequence>

        {/* Progress ring */}
        <ProgressRing accentColor={accentColor} />

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            color: "#666",
            fontSize: 14,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 2,
          }}
        >
          MADE WITH REMOTION
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
