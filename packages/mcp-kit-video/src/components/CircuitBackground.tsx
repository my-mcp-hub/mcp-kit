import {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

type CircuitBackgroundProps = {
  frameOverride?: number;
  intensity?: number;
  freeze?: boolean;
};

type Trace = {
  points: string;
  opacity: number;
  width: number;
  color: string;
};

export const CircuitBackground: React.FC<CircuitBackgroundProps> = ({
  frameOverride,
  intensity = 1,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = frameOverride ?? currentFrame;

  const traces = useMemo<Trace[]>(() => {
    return Array.from({length: 26}, (_, index) => {
      const side = index % 2 === 0 ? 0 : 1;
      const baseY = 70 + random(`trace-y-${index}`) * 930;
      const extent = 240 + random(`trace-extent-${index}`) * 360;
      const bend = 44 + random(`trace-bend-${index}`) * 100;
      const x0 = side === 0 ? -12 : 1932;
      const x1 = side === 0 ? extent * 0.55 : 1920 - extent * 0.55;
      const x2 = side === 0 ? extent : 1920 - extent;
      const direction = random(`trace-direction-${index}`) > 0.5 ? 1 : -1;
      return {
        points: `${x0},${baseY} ${x1},${baseY} ${x2},${baseY + direction * bend}`,
        opacity: 0.08 + random(`trace-opacity-${index}`) * 0.14,
        width: 0.7 + random(`trace-width-${index}`) * 1.1,
        color: index % 5 === 0 ? COLORS.cyan : COLORS.blue,
      };
    });
  }, []);

  const particles = useMemo(
    () =>
      Array.from({length: 54}, (_, index) => ({
        x: 36 + random(`particle-x-${index}`) * 1848,
        y: 28 + random(`particle-y-${index}`) * 1024,
        size: 2 + Math.round(random(`particle-size-${index}`) * 4),
        phase: random(`particle-phase-${index}`) * Math.PI * 2,
        drift: 4 + random(`particle-drift-${index}`) * 12,
        color: index % 7 === 0 ? COLORS.green : index % 3 === 0 ? COLORS.cyan : COLORS.blue,
      })),
    [],
  );

  const driftX = Math.sin(frame / 110) * 5;
  const driftY = Math.cos(frame / 140) * 3;
  const gridOpacity = interpolate(intensity, [0, 1], [0.015, 0.06]);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 50% 46%, rgba(13, 40, 68, ${0.16 * intensity}), transparent 42%),
          radial-gradient(circle at 22% 18%, rgba(59, 130, 246, ${0.08 * intensity}), transparent 32%),
          linear-gradient(155deg, ${COLORS.backgroundDeep}, ${COLORS.backgroundSoft} 52%, ${COLORS.background})
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -80,
          transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
          opacity: gridOpacity,
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.16) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 72%)',
        }}
      />
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        {traces.map((trace, index) => {
          const pulse = 0.45 + 0.55 * Math.sin(frame / 42 + index * 0.73);
          const lastPoint = trace.points.split(' ').at(-1)?.split(',') ?? ['0', '0'];
          return (
            <g key={trace.points}>
              <polyline
                points={trace.points}
                fill="none"
                stroke={trace.color}
                strokeWidth={trace.width}
                opacity={trace.opacity * intensity}
              />
              <circle
                cx={Number(lastPoint[0])}
                cy={Number(lastPoint[1])}
                r={2.2}
                fill={trace.color}
                opacity={trace.opacity * pulse * 2.2 * intensity}
              />
            </g>
          );
        })}
      </svg>
      {particles.map((particle, index) => {
        const pulse = 0.5 + 0.5 * Math.sin(frame / 28 + particle.phase);
        const y = particle.y + Math.sin(frame / 60 + particle.phase) * particle.drift;
        return (
          <div
            key={`${particle.x}-${particle.y}`}
            style={{
              position: 'absolute',
              left: particle.x,
              top: y,
              width: particle.size,
              height: particle.size,
              border: `1px solid ${particle.color}`,
              borderRadius: index % 4 === 0 ? '50%' : 1,
              opacity: (0.08 + pulse * 0.28) * intensity,
              boxShadow: pulse > 0.82 ? `0 0 10px ${particle.color}` : undefined,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at center, transparent 50%, rgba(1,3,10,0.62) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
