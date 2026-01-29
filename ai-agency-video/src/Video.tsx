import React from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { SCENES, COLORS } from './styles/constants';
import { ProgressBar, SceneIndicator } from './components/ProgressBar';
import { Intro } from './scenes/Intro';
import { WhatToSell } from './scenes/WhatToSell';
import { TechnicalSkills } from './scenes/TechnicalSkills';
import { WhoToSellTo } from './scenes/WhoToSellTo';
import { HowToGetClients } from './scenes/HowToGetClients';
import { Outro } from './scenes/Outro';

// Determine active scene index from frame
const getActiveScene = (frame: number): number => {
  const entries = Object.values(SCENES);
  for (let i = entries.length - 1; i >= 0; i--) {
    if (frame >= entries[i].start) return i;
  }
  return 0;
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const activeScene = getActiveScene(frame);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.background,
        position: 'relative',
      }}
    >
      {/* Scene 1: Intro (0-10s) */}
      <Sequence
        from={SCENES.intro.start}
        durationInFrames={SCENES.intro.duration}
        name="Intro"
      >
        <Intro />
      </Sequence>

      {/* Scene 2: What To Sell (10-50s) */}
      <Sequence
        from={SCENES.whatToSell.start}
        durationInFrames={SCENES.whatToSell.duration}
        name="What To Sell"
      >
        <WhatToSell />
      </Sequence>

      {/* Scene 3: Technical Skills (50-60s) */}
      <Sequence
        from={SCENES.technicalSkills.start}
        durationInFrames={SCENES.technicalSkills.duration}
        name="Technical Skills"
      >
        <TechnicalSkills />
      </Sequence>

      {/* Scene 4: Who To Sell To (60-85s) */}
      <Sequence
        from={SCENES.whoToSellTo.start}
        durationInFrames={SCENES.whoToSellTo.duration}
        name="Who To Sell To"
      >
        <WhoToSellTo />
      </Sequence>

      {/* Scene 5: How To Get Clients (85-110s) */}
      <Sequence
        from={SCENES.howToGetClients.start}
        durationInFrames={SCENES.howToGetClients.duration}
        name="How To Get Clients"
      >
        <HowToGetClients />
      </Sequence>

      {/* Scene 6: Outro (110-120s) */}
      <Sequence
        from={SCENES.outro.start}
        durationInFrames={SCENES.outro.duration}
        name="Outro"
      >
        <Outro />
      </Sequence>

      {/* Persistent UI: Progress Bar */}
      <ProgressBar />

      {/* Scene indicator dots (top right) */}
      <SceneIndicator
        currentScene={activeScene}
        totalScenes={6}
        startFrame={0}
      />
    </div>
  );
};
