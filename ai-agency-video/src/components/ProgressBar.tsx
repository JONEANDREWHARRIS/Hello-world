import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, VIDEO, SCENES } from '../styles/constants';

export const ProgressBar: React.FC<{
  style?: React.CSSProperties;
}> = ({ style = {} }) => {
  const frame = useCurrentFrame();

  // Overall progress through the video
  const progress = (frame / VIDEO.durationInFrames) * 100;

  // Determine current scene for accent color
  const sceneEntries = Object.entries(SCENES);
  let currentSceneColor = COLORS.primary;
  for (const [, scene] of sceneEntries) {
    if (frame >= scene.start && frame < scene.start + scene.duration) {
      currentSceneColor = COLORS.primary;
      break;
    }
  }

  // Subtle pulse on the leading edge
  const pulseSize = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [6, 12]
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 4,
        background: `${COLORS.text}08`,
        zIndex: 100,
        ...style,
      }}
    >
      {/* Progress fill */}
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${currentSceneColor}, ${COLORS.secondary})`,
          borderRadius: '0 2px 2px 0',
          position: 'relative',
        }}
      >
        {/* Glow dot at leading edge */}
        <div
          style={{
            position: 'absolute',
            right: -3,
            top: '50%',
            width: pulseSize,
            height: pulseSize,
            borderRadius: '50%',
            background: COLORS.secondary,
            transform: 'translateY(-50%)',
            boxShadow: `0 0 ${pulseSize}px ${COLORS.secondary}`,
          }}
        />
      </div>
    </div>
  );
};

// === SCENE INDICATOR (shows which scene is active) ===
export const SceneIndicator: React.FC<{
  currentScene: number;
  totalScenes: number;
  startFrame?: number;
  style?: React.CSSProperties;
}> = ({
  currentScene,
  totalScenes,
  startFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const opacity = interpolate(localFrame, [0, 15, 30], [0, 0.6, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        right: 50,
        display: 'flex',
        gap: 8,
        opacity,
        zIndex: 50,
        ...style,
      }}
    >
      {Array.from({ length: totalScenes }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === currentScene ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background:
              i === currentScene
                ? COLORS.primary
                : i < currentScene
                ? `${COLORS.primary}60`
                : `${COLORS.text}20`,
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
};
