import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';

import {TransitionSeries, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {
  Scene01PowerOn,
  Scene02InvokeCli,
  Scene03NameLanguage,
  Scene04Transports,
  Scene05CustomPlugins,
  Scene06Scaffolding,
  Scene07InstallTree,
  Scene08Success,
} from './scenes';
import {SoundDesign} from './SoundDesign';
import {
  COLORS,
  SCENE_DURATIONS,
  TOTAL_FRAMES,
  TRANSITION_FRAMES,
} from './theme';

export const McpKitCliWalkthrough: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  if (durationInFrames !== TOTAL_FRAMES) {
    throw new Error(
      `McpKitCliWalkthrough must be exactly ${TOTAL_FRAMES} frames, received ${durationInFrames}.`,
    );
  }

  const transitionTiming = springTiming({
    durationInFrames: TRANSITION_FRAMES,
    config: {damping: 200},
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        overflow: 'hidden',
      }}
    >
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[0]} premountFor={fps}>
          <Scene01PowerOn />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[1]} premountFor={fps}>
          <Scene02InvokeCli />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[2]} premountFor={fps}>
          <Scene03NameLanguage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[3]} premountFor={fps}>
          <Scene04Transports />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[4]} premountFor={fps}>
          <Scene05CustomPlugins />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[5]} premountFor={fps}>
          <Scene06Scaffolding />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[6]} premountFor={fps}>
          <Scene07InstallTree />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS[7]} premountFor={fps}>
          <Scene08Success />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SoundDesign />
    </AbsoluteFill>
  );
};
