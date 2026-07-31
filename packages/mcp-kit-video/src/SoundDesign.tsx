import {Audio} from '@remotion/media';
import {Sequence, interpolate, staticFile} from 'remotion';
import {FPS, TOTAL_FRAMES} from './theme';

const Sfx: React.FC<{
  from: number;
  file: string;
  volume: number;
}> = ({from, file, volume}) => (
  <Sequence from={from} premountFor={FPS}>
    <Audio src={staticFile(`audio/${file}`)} volume={volume} />
  </Sequence>
);

const transitionFrames = [93, 246, 429, 582, 780, 948, 1200];
const switchFrames = [
  235,
  312,
  400,
  494,
  550,
  636,
  652,
  661,
  670,
  679,
  688,
  697,
  714,
  761,
];
const keyFrames = [
  ...Array.from({length: 13}, (_, index) => 107 + index * 4),
  ...Array.from({length: 9}, (_, index) => 268 + index * 4),
];

export const SoundDesign: React.FC = () => {
  return (
    <>
      <Audio
        src={staticFile('audio/digital-clouds-highlight.mp3')}
        volume={frame => {
          const fadeIn = interpolate(frame, [0, 0.8 * FPS], [0, 0.34], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const fadeOut = interpolate(
            frame,
            [TOTAL_FRAMES - 1.5 * FPS, TOTAL_FRAMES],
            [0.34, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );
          return Math.min(fadeIn, fadeOut);
        }}
      />
      <Audio
        src={staticFile('audio/crt-hum.wav')}
        volume={frame =>
          interpolate(
            frame,
            [0, 12, TOTAL_FRAMES - 40, TOTAL_FRAMES],
            [0, 0.035, 0.035, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          )
        }
      />

      <Sfx from={0} file="power-on.wav" volume={0.13} />
      <Sfx from={14} file="soft-impact.wav" volume={0.12} />
      {transitionFrames.map(frame => (
        <Sfx key={`whoosh-${frame}`} from={frame - 3} file="whoosh.wav" volume={0.09} />
      ))}
      {keyFrames.map(frame => (
        <Sfx key={`key-${frame}`} from={frame} file="key.wav" volume={0.075} />
      ))}
      {switchFrames.map(frame => (
        <Sfx key={`switch-${frame}`} from={frame} file="switch.wav" volume={0.085} />
      ))}
      <Sfx from={1174} file="success-ding.wav" volume={0.14} />
      <Sfx from={1308} file="final-impact.wav" volume={0.12} />
    </>
  );
};
