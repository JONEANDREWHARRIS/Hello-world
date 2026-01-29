import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import { VIDEO } from './styles/constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AIAgencyVideo"
        component={Video}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
