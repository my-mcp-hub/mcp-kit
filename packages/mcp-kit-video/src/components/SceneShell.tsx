import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, TRANSITION_FRAMES, uiFont} from '../theme';
import {CircuitBackground} from './CircuitBackground';

type SceneShellProps = {
  index: number;
  label: string;
  duration: number;
  children: React.ReactNode;
  frameOverride?: number;
  backgroundIntensity?: number;
};

export const SceneShell: React.FC<SceneShellProps> = ({
  index,
  label,
  duration,
  children,
  frameOverride,
  backgroundIntensity = 1,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = frameOverride ?? currentFrame;
  const entrance = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(
    frame,
    [duration - TRANSITION_FRAMES, duration],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const movement = Math.min(entrance, exit);
  const scanOpacity =
    index === 1
      ? 0
      : interpolate(frame, [0, 3, 10, 12], [0, 0.35, 0.15, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const scanY = interpolate(frame, [0, 12], [-40, 1120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{fontFamily: uiFont, color: COLORS.text}}>
      <CircuitBackground
        frameOverride={frame}
        intensity={backgroundIntensity}
      />
      <AbsoluteFill
        style={{
          transform: `perspective(1800px) scale(${0.985 + movement * 0.015}) rotateX(${(1 - movement) * 0.55}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 82,
            top: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: COLORS.muted,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{color: COLORS.cyan, fontFamily: 'monospace'}}>
            {String(index).padStart(2, '0')}
          </span>
          <span
            style={{
              width: 38,
              height: 1,
              background: `linear-gradient(90deg, ${COLORS.cyan}, transparent)`,
            }}
          />
          {label}
        </div>
        {children}
      </AbsoluteFill>
      {index > 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: scanY,
            height: 2,
            opacity: scanOpacity,
            background:
              'linear-gradient(90deg, transparent 2%, #A855F7 24%, #38BDF8 50%, #10B981 76%, transparent 98%)',
            boxShadow: '0 0 22px rgba(34,211,238,0.75)',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
