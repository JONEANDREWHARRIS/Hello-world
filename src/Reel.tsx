import {
  AbsoluteFill,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  spring,
  Sequence,
  Easing,
} from "remotion";

interface ReelProps {
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

// Pulsing glow circle behind visualizer
const GlowingOrb: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.05) * 0.3 + 1;
  const rotation = frame * 0.5;

  return (
    <div
      style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}44 0%, ${accentColor}22 40%, transparent 70%)`,
        transform: `scale(${pulse}) rotate(${rotation}deg)`,
        filter: "blur(40px)",
      }}
    />
  );
};

// Animated background with moving gradient mesh
const AnimatedBackground: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const angle1 = frame * 0.3;
  const angle2 = frame * 0.2 + 120;
  const angle3 = frame * 0.4 + 240;

  return (
    <AbsoluteFill>
      {/* Base dark gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)",
        }}
      />
      {/* Moving color blobs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `${accentColor}33`,
          filter: "blur(100px)",
          transform: `translate(${Math.sin(angle1 * 0.02) * 100}px, ${Math.cos(angle1 * 0.02) * 50}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "20%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#ff006633",
          filter: "blur(80px)",
          transform: `translate(${Math.sin(angle2 * 0.02) * 80}px, ${Math.cos(angle2 * 0.02) * 60}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "40%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "#00ff8833",
          filter: "blur(90px)",
          transform: `translate(${Math.sin(angle3 * 0.02) * 70}px, ${Math.cos(angle3 * 0.02) * 90}px)`,
        }}
      />
      {/* Noise/grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </AbsoluteFill>
  );
};

// Floating particles effect - more particles, more variety
const Particles: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: (i * 37 + 13) % 100,
    y: (i * 53 + 7) % 100,
    size: 2 + (i % 5),
    speed: 0.3 + (i % 4) * 0.2,
    opacity: 0.3 + (i % 3) * 0.2,
    hue: i * 7,
  }));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {particles.map((p) => {
        const y = (p.y + frame * p.speed * 0.2) % 120 - 10;
        const wobble = Math.sin(frame * 0.03 + p.id) * 10;
        const opacity = interpolate(y, [-10, 20, 80, 110], [0, p.opacity, p.opacity, 0]);
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `calc(${p.x}% + ${wobble}px)`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.id % 3 === 0 ? accentColor : "white",
              opacity,
              boxShadow: p.id % 3 === 0 ? `0 0 ${p.size * 2}px ${accentColor}` : "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Animated title with glow effect
const AnimatedTitle: React.FC<{ text: string; delay?: number; accentColor: string }> = ({
  text,
  delay = 0,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 80, mass: 1.2 },
  });

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glowPulse = Math.sin(frame * 0.08) * 0.3 + 1;

  return (
    <div
      style={{
        fontSize: 80,
        fontWeight: 900,
        color: "white",
        fontFamily: "'Segoe UI', 'Arial Black', sans-serif",
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity,
        textShadow: `
          0 0 ${20 * glowPulse}px ${accentColor}88,
          0 0 ${40 * glowPulse}px ${accentColor}44,
          0 0 ${60 * glowPulse}px ${accentColor}22,
          0 4px 20px rgba(0,0,0,0.8)
        `,
        letterSpacing: 4,
      }}
    >
      {text}
    </div>
  );
};

// Subtitle with smooth fade and slide
const Subtitle: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(slideUp, [0, 1], [30, 0]);

  return (
    <div
      style={{
        fontSize: 32,
        color: "#888",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        textAlign: "center",
        marginTop: 24,
        opacity,
        transform: `translateY(${translateY}px)`,
        letterSpacing: 8,
        textTransform: "uppercase",
        fontWeight: 300,
      }}
    >
      {text}
    </div>
  );
};

// Circular audio visualizer - much more impressive
const CircularVisualizer: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numBars = 60;
  const radius = 180;
  const time = frame / fps;

  const bars = Array.from({ length: numBars }, (_, i) => {
    const angle = (i / numBars) * Math.PI * 2;
    const offset = i * 0.15;

    // Multiple frequencies for more dynamic movement
    const height =
      40 +
      Math.sin(time * 5 + offset) * 25 +
      Math.cos(time * 3 + offset * 1.5) * 20 +
      Math.sin(time * 8 + offset * 0.7) * 15 +
      Math.cos(time * 2 + offset * 2) * 10;

    return { angle, height: Math.max(20, height), index: i };
  });

  return (
    <div
      style={{
        position: "relative",
        width: radius * 2 + 200,
        height: radius * 2 + 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Center glow */}
      <GlowingOrb accentColor={accentColor} />

      {/* Bars */}
      {bars.map(({ angle, height, index }) => {
        const x = Math.cos(angle - Math.PI / 2) * radius;
        const y = Math.sin(angle - Math.PI / 2) * radius;
        const rotation = (angle * 180) / Math.PI;
        const hue = interpolate(index, [0, numBars], [220, 320]);

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 6,
              height: height,
              background: `linear-gradient(to top, ${accentColor}, hsl(${hue}, 80%, 65%))`,
              borderRadius: 3,
              transform: `translate(${x - 3}px, ${y}px) rotate(${rotation}deg)`,
              transformOrigin: "center top",
              boxShadow: `0 0 10px ${accentColor}66, 0 0 20px ${accentColor}33`,
            }}
          />
        );
      })}

      {/* Center circle */}
      <div
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, #1a1a2e 0%, #0a0a0f 100%)`,
          border: `3px solid ${accentColor}66`,
          boxShadow: `0 0 30px ${accentColor}44, inset 0 0 30px ${accentColor}22`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Play icon or waveform icon */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "25px solid white",
            borderTop: "15px solid transparent",
            borderBottom: "15px solid transparent",
            marginLeft: 8,
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
};

// Bottom wave effect
const WaveEffect: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1080 200"
        style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M0,100
              Q${270 + Math.sin(frame * 0.03) * 50},${50 + Math.sin(frame * 0.05) * 30}
              540,100
              T1080,100
              V200 H0 Z`}
          fill="url(#waveGradient)"
        />
        <path
          d={`M0,120
              Q${270 + Math.cos(frame * 0.04) * 40},${80 + Math.cos(frame * 0.03) * 25}
              540,120
              T1080,120
              V200 H0 Z`}
          fill={`${accentColor}15`}
        />
      </svg>
    </div>
  );
};

// Progress bar at bottom
const ProgressBar: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 60,
        right: 60,
        height: 4,
        backgroundColor: "#ffffff22",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${accentColor}, #ff6b6b)`,
          borderRadius: 2,
          boxShadow: `0 0 10px ${accentColor}`,
        }}
      />
    </div>
  );
};

// Time display
const TimeDisplay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const currentSeconds = Math.floor(frame / fps);
  const totalSeconds = Math.floor(durationInFrames / fps);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 60,
        color: "#666",
        fontSize: 18,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontWeight: 500,
      }}
    >
      {formatTime(currentSeconds)} / {formatTime(totalSeconds)}
    </div>
  );
};

// Main Reel component
export const Reel: React.FC<ReelProps> = ({
  title = "zauey.talks",
  subtitle = "Original Audio",
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in at start
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 45, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Audio */}
      <Audio src={staticFile("audio.mp4")} />

      {/* Animated Background */}
      <AnimatedBackground accentColor={accentColor} />

      {/* Particles */}
      <Particles accentColor={accentColor} />

      {/* Main content */}
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        {/* Center content */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            paddingBottom: 100,
          }}
        >
          {/* Title */}
          <Sequence from={20}>
            <AnimatedTitle text={title} accentColor={accentColor} />
          </Sequence>

          {/* Subtitle */}
          <Sequence from={50}>
            <Subtitle text={subtitle} />
          </Sequence>

          {/* Circular Visualizer */}
          <Sequence from={80}>
            <div style={{ marginTop: 60 }}>
              <CircularVisualizer accentColor={accentColor} />
            </div>
          </Sequence>
        </AbsoluteFill>

        {/* Bottom wave */}
        <WaveEffect accentColor={accentColor} />

        {/* Progress bar */}
        <ProgressBar accentColor={accentColor} />

        {/* Time display */}
        <TimeDisplay />

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 60,
            color: "#444",
            fontSize: 14,
            fontFamily: "'Segoe UI', Arial, sans-serif",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Made with Remotion
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
