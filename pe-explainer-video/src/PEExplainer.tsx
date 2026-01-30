import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2ADeal } from './scenes/Scene2ADeal';
import { Scene2BInterest } from './scenes/Scene2BInterest';
import { Scene2CFees } from './scenes/Scene2CFees';
import { Scene2DDividend } from './scenes/Scene2DDividend';
import { Scene2EToysRUs } from './scenes/Scene2EToysRUs';
import { Scene3CTA } from './scenes/Scene3CTA';
import { COLORS } from './styles/constants';

export const PEExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  // Progress bar at the bottom
  const progress = (frame / 1800) * 100;

  // Subtle vignette
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.background}, ${COLORS.backgroundEnd})`,
      }}
    >
      {/* Scene 1: Hook (0-150 frames, 0-5s) */}
      <Sequence from={0} durationInFrames={150} name="Hook">
        <Scene1Hook />
      </Sequence>

      {/* Scene 2A: The Deal (150-450 frames, 5-15s) */}
      <Sequence from={150} durationInFrames={300} name="The Deal">
        <Scene2ADeal />
      </Sequence>

      {/* Scene 2B: Interest (450-600 frames, 15-20s) */}
      <Sequence from={450} durationInFrames={150} name="Interest">
        <Scene2BInterest />
      </Sequence>

      {/* Scene 2C: Fees (600-900 frames, 20-30s) */}
      <Sequence from={600} durationInFrames={300} name="Fees">
        <Scene2CFees />
      </Sequence>

      {/* Scene 2D: Dividend Recap (900-1050 frames, 30-35s) */}
      <Sequence from={900} durationInFrames={150} name="Dividend Recap">
        <Scene2DDividend />
      </Sequence>

      {/* Scene 2E: Toys R Us Case (1050-1350 frames, 35-45s) */}
      <Sequence from={1050} durationInFrames={300} name="Toys R Us">
        <Scene2EToysRUs />
      </Sequence>

      {/* Scene 3: CTA (1350-1800 frames, 45-60s) */}
      <Sequence from={1350} durationInFrames={450} name="CTA">
        <Scene3CTA />
      </Sequence>

      {/* Vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Progress bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 4,
          backgroundColor: COLORS.whiteAlpha10,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`,
            boxShadow: `0 0 10px ${COLORS.primary}60`,
            position: 'relative',
          }}
        >
          {/* Glowing dot at the edge */}
          <div
            style={{
              position: 'absolute',
              right: -4,
              top: -3,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: COLORS.white,
              boxShadow: `0 0 10px ${COLORS.primary}, 0 0 20px ${COLORS.primary}80`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
