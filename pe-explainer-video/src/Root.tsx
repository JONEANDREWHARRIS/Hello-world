import React from 'react';
import { Composition } from 'remotion';
import { PEExplainer } from './PEExplainer';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PEExplainer"
      component={PEExplainer}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
