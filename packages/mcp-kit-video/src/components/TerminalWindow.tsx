import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, clamp, monoFont} from '../theme';
import {CrtTerminalCanvas} from './CrtTerminalCanvas';

type TerminalWindowProps = {
  children: React.ReactNode;
  width?: number;
  height?: number;
  frameOverride?: number;
  syncRipple?: number;
  entrance?: boolean;
  style?: React.CSSProperties;
  screenPadding?: number;
};

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  width = 1320,
  height = 760,
  frameOverride,
  syncRipple = 0,
  entrance = false,
  style,
  screenPadding = 42,
}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = frameOverride ?? currentFrame;
  const titleBarHeight = 72;
  const progress = entrance
    ? spring({
        frame,
        fps,
        durationInFrames: Math.round(1.05 * fps),
        config: {damping: 200},
      })
    : 1;
  const powerLine = entrance ? clamp(frame, [2, 26], [0, 1]) : 0;
  const lineHeight = clamp(powerLine, [0, 1], [2, height]);
  const opacity = entrance ? clamp(frame, [2, 20], [0, 1]) : 1;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 22,
        border: `1px solid ${COLORS.borderBright}`,
        overflow: 'hidden',
        background: COLORS.surface,
        boxShadow:
          '0 32px 110px rgba(0,0,0,0.62), 0 0 42px rgba(6,182,212,0.13), inset 0 0 0 1px rgba(59,130,246,0.12)',
        transformOrigin: '50% 100%',
        transform: entrance
          ? `perspective(1400px) rotateX(${(1 - progress) * 14}deg) scale(${0.92 + progress * 0.08}) translateY(${(1 - progress) * 24}px)`
          : undefined,
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          height: titleBarHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background:
            'linear-gradient(180deg, rgba(13,23,42,0.98), rgba(8,13,25,0.98))',
          borderBottom: `1px solid ${COLORS.border}`,
          color: COLORS.cyan,
          fontFamily: monoFont,
          fontSize: 24,
          letterSpacing: '0.04em',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 26,
            display: 'flex',
            gap: 12,
          }}
        >
          <div style={{width: 15, height: 15, borderRadius: '50%', background: '#FF5F57'}} />
          <div style={{width: 15, height: 15, borderRadius: '50%', background: '#FFBD2E'}} />
          <div style={{width: 15, height: 15, borderRadius: '50%', background: '#28C840'}} />
        </div>
        mcp-kit
        <div
          style={{
            position: 'absolute',
            right: 28,
            display: 'flex',
            gap: 7,
          }}
        >
          {[0, 1, 2].map(item => (
            <div
              key={item}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: COLORS.muted,
              }}
            />
          ))}
        </div>
      </div>
      <div style={{position: 'relative', height: height - titleBarHeight}}>
        <CrtTerminalCanvas
          width={width}
          height={height - titleBarHeight}
          frameOverride={frame}
          syncRipple={syncRipple}
        >
          <div
            style={{
              boxSizing: 'border-box',
              width,
              height: height - titleBarHeight,
              padding: screenPadding,
              background:
                'radial-gradient(circle at 46% 34%, rgba(7,22,37,0.72), rgba(1,4,11,0.98) 75%)',
              color: COLORS.text,
              overflow: 'hidden',
            }}
          >
            {children}
          </div>
        </CrtTerminalCanvas>
      </div>
      {entrance && powerLine < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: clamp(frame, [0, 15], [0, width * 0.92]),
            height: lineHeight,
            transform: 'translate(-50%, -50%)',
            background:
              lineHeight < 10
                ? 'linear-gradient(90deg, transparent, #67E8F9, transparent)'
                : 'transparent',
            boxShadow: lineHeight < 20 ? '0 0 28px #22D3EE' : undefined,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
};
