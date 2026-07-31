import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  COLORS,
  clamp,
  gradientText,
  monoFont,
  panelStyle,
  uiFont,
} from '../theme';
import {FeatureChip} from './TerminalPieces';

const ServerIcon: React.FC<{color?: string}> = ({color = COLORS.cyan}) => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <rect x="6" y="5" width="30" height="10" rx="3" stroke={color} strokeWidth="2" />
    <rect x="6" y="17" width="30" height="10" rx="3" stroke={color} strokeWidth="2" />
    <rect x="6" y="29" width="30" height="8" rx="3" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="10" r="1.7" fill={color} />
    <circle cx="12" cy="22" r="1.7" fill={color} />
    <circle cx="12" cy="33" r="1.7" fill={color} />
  </svg>
);

const TerminalIcon: React.FC<{color?: string}> = ({color = COLORS.magenta}) => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <rect x="4" y="7" width="34" height="28" rx="5" stroke={color} strokeWidth="2" />
    <path d="M11 17l5 4-5 4M20 26h9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GlobeIcon: React.FC<{color?: string}> = ({color = COLORS.green}) => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="21" r="16" stroke={color} strokeWidth="2" />
    <path d="M5 21h32M21 5c5 5 7 10 7 16s-2 11-7 16M21 5c-5 5-7 10-7 16s2 11 7 16" stroke={color} strokeWidth="1.7" />
  </svg>
);

export const TransportDiagram: React.FC<{frameOverride?: number}> = ({
  frameOverride,
}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = frameOverride ?? currentFrame;
  const enter = spring({
    frame: frame - 30,
    fps,
    durationInFrames: 24,
    config: {damping: 200},
  });
  const pipeProgress = clamp(frame, [52, 96], [0, 1]);
  const httpProgress = clamp(frame, [68, 116], [0, 1]);
  const pulse = (frame * 8) % 330;

  return (
    <div
      style={{
        ...panelStyle,
        position: 'absolute',
        right: 82,
        top: 236,
        width: 500,
        height: 460,
        padding: 32,
        boxSizing: 'border-box',
        opacity: enter,
        transform: `translateX(${(1 - enter) * 40}px)`,
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontFamily: uiFont,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        Selected transport topology
      </div>
      <div
        style={{
          position: 'absolute',
          top: 106,
          left: 38,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          color: COLORS.magenta,
          fontFamily: monoFont,
          fontSize: 16,
        }}
      >
        <TerminalIcon />
        LOCAL PROCESS
      </div>
      <div
        style={{
          position: 'absolute',
          top: 112,
          left: 218,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          color: COLORS.cyan,
          fontFamily: monoFont,
          fontSize: 16,
        }}
      >
        <ServerIcon />
        MCP SERVER
      </div>
      <div
        style={{
          position: 'absolute',
          top: 106,
          right: 28,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          color: COLORS.green,
          fontFamily: monoFont,
          fontSize: 16,
        }}
      >
        <GlobeIcon />
        REMOTE CLIENT
      </div>
      <svg
        width="436"
        height="120"
        viewBox="0 0 436 120"
        style={{position: 'absolute', left: 32, top: 116}}
      >
        <path
          d="M92 36H214"
          stroke={COLORS.magenta}
          strokeWidth="3"
          strokeDasharray="122"
          strokeDashoffset={122 * (1 - pipeProgress)}
        />
        <path
          d="M270 36H376"
          stroke={COLORS.green}
          strokeWidth="3"
          strokeDasharray="106"
          strokeDashoffset={106 * (1 - httpProgress)}
        />
        <circle
          cx={92 + Math.min(pulse, 122)}
          cy="36"
          r="4"
          fill={COLORS.cyan}
          opacity={pipeProgress}
        />
        <circle
          cx={270 + Math.min(Math.max(0, pulse - 160), 106)}
          cy="36"
          r="4"
          fill={COLORS.green}
          opacity={httpProgress}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 104,
          top: 226,
          color: COLORS.magenta,
          fontFamily: monoFont,
          fontSize: 17,
        }}
      >
        STDIO pipe
      </div>
      <div
        style={{
          position: 'absolute',
          right: 64,
          top: 226,
          color: COLORS.green,
          fontFamily: monoFont,
          fontSize: 17,
        }}
      >
        HTTP line
      </div>
      <div
        style={{
          position: 'absolute',
          left: 48,
          right: 48,
          bottom: 88,
          padding: '14px 18px',
          textAlign: 'center',
          borderRadius: 10,
          border: `1px solid ${COLORS.border}`,
          background: 'rgba(2,6,23,0.72)',
          color: COLORS.cyan,
          fontFamily: monoFont,
          fontSize: 20,
        }}
      >
        http://localhost:8401/mcp
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: COLORS.text,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        Local <span style={{color: COLORS.muted}}>+</span> Remote
      </div>
    </div>
  );
};

const PIPELINE_STEPS = [
  'Verify template/server-ts',
  'Check target directory',
  'Copy template',
  'Rename _github → .github',
  'Rename _husky → .husky',
  'Compile Handlebars templates',
  'Apply transports + plugins',
  'Remove unused files and empty directories',
] as const;

export const ScaffoldingPipeline: React.FC<{frameOverride?: number}> = ({
  frameOverride,
}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = frameOverride ?? currentFrame;
  const panelEnter = spring({
    frame: frame - 8,
    fps,
    durationInFrames: 28,
    config: {damping: 200},
  });
  const completeCount = Math.max(0, Math.min(8, Math.floor((frame - 22) / 17) + 1));
  const pulseX = clamp(frame, [20, 162], [0, 1]);

  return (
    <div
      style={{
        ...panelStyle,
        position: 'absolute',
        left: 800,
        right: 82,
        top: 132,
        height: 820,
        padding: '34px 38px',
        boxSizing: 'border-box',
        opacity: panelEnter,
        transform: `translateX(${(1 - panelEnter) * 56}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div
            style={{
              color: COLORS.text,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Behind the scenes
          </div>
          <div
            style={{
              marginTop: 8,
              color: COLORS.muted,
              fontFamily: monoFont,
              fontSize: 17,
            }}
          >
            deterministic scaffolding engine
          </div>
        </div>
        <div
          style={{
            padding: '8px 13px',
            borderRadius: 999,
            color: COLORS.green,
            border: `1px solid ${COLORS.green}66`,
            background: `${COLORS.green}12`,
            fontFamily: monoFont,
            fontSize: 15,
          }}
        >
          CREATE PROJECT
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 25,
            right: 25,
            top: 56,
            height: 1,
            background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.blue}, ${COLORS.cyan}, ${COLORS.green})`,
            opacity: 0.28,
          }}
        />
        {PIPELINE_STEPS.map((step, index) => {
          const reveal = spring({
            frame: frame - 10 - index * 6,
            fps,
            durationInFrames: 18,
            config: {damping: 200},
          });
          const complete = index < completeCount;
          return (
            <div
              key={step}
              style={{
                position: 'relative',
                minHeight: 88,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 18px',
                borderRadius: 13,
                border: `1px solid ${complete ? `${COLORS.green}66` : COLORS.border}`,
                background: complete
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.11), rgba(8,13,25,0.88))'
                  : 'rgba(5,8,20,0.76)',
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 12}px)`,
              }}
            >
              <div
                style={{
                  width: 31,
                  height: 31,
                  flex: '0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: `1px solid ${complete ? COLORS.green : COLORS.borderBright}`,
                  color: complete ? COLORS.green : COLORS.cyan,
                  fontFamily: monoFont,
                  fontSize: 14,
                  boxShadow: complete ? `0 0 18px ${COLORS.green}2B` : undefined,
                }}
              >
                {complete ? '✓' : String(index + 1).padStart(2, '0')}
              </div>
              <div
                style={{
                  color: complete ? COLORS.text : COLORS.muted,
                  fontFamily: monoFont,
                  fontSize: index === 7 ? 16 : 18,
                  lineHeight: 1.3,
                }}
              >
                {step}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            top: 53,
            left: `calc(${pulseX * 100}% - 6px)`,
            width: 12,
            height: 7,
            borderRadius: 999,
            background: COLORS.cyan,
            boxShadow: `0 0 18px ${COLORS.cyan}`,
            opacity: frame < 166 ? 1 : 0,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 26,
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: 14,
        }}
      >
        <CodeToken label="projectName" value={'"mcp-server-starter"'} color={COLORS.purple} />
        <CodeToken label="transports" value={'["stdio", "streamable"]'} color={COLORS.cyan} />
        <div style={{gridColumn: '1 / -1'}}>
          <CodeToken label="plugins" value={'["github-action", "vitest", "inspector", "style", "commitlint", "changelog"]'} color={COLORS.green} small />
        </div>
      </div>
    </div>
  );
};

const CodeToken: React.FC<{
  label: string;
  value: string;
  color: string;
  small?: boolean;
}> = ({label, value, color, small = false}) => (
  <div
    style={{
      padding: '13px 15px',
      borderRadius: 10,
      background: 'rgba(2,6,23,0.82)',
      border: `1px solid ${COLORS.border}`,
      color: COLORS.muted,
      fontFamily: monoFont,
      fontSize: small ? 14 : 16,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }}
  >
    <span style={{color}}>{label}</span>
    <span style={{color: COLORS.dim}}>: </span>
    <span style={{color: COLORS.text}}>{value}</span>
  </div>
);

export const FILE_TREE = [
  'mcp-server-starter/',
  '├── .github/workflows/',
  '├── .husky/',
  '├── scripts/',
  '├── src/',
  '│   ├── assets/',
  '│   │   ├── mcp.stdio.json',
  '│   │   └── mcp.http.json',
  '│   ├── data/documents.ts',
  '│   ├── prompts/index.ts',
  '│   ├── resources/index.ts',
  '│   ├── services/',
  '│   │   ├── index.ts',
  '│   │   ├── stdio.ts',
  '│   │   └── web.ts',
  '│   ├── tools/',
  '│   │   ├── index.ts',
  '│   │   └── registerSearchDocuments.ts',
  '│   └── index.ts',
  '├── tests/',
  '├── package.json',
  '└── README.md',
] as const;

const treeLineColor = (line: string) => {
  if (line.includes('stdio')) return COLORS.magenta;
  if (line.includes('web.ts') || line.includes('mcp.http')) return COLORS.green;
  if (line.includes('tools/') || line.includes('resources/') || line.includes('prompts/')) {
    return COLORS.cyan;
  }
  if (line.endsWith('/')) return '#7DD3FC';
  return COLORS.text;
};

export const GeneratedFileTree: React.FC<{
  frameOverride?: number;
  compact?: boolean;
}> = ({frameOverride, compact = false}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = frameOverride ?? currentFrame;
  const enter = spring({
    frame: frame - 8,
    fps,
    durationInFrames: 26,
    config: {damping: 200},
  });
  const lineInterval = compact ? 2 : 7;
  const visibleLines = Math.max(
    0,
    Math.min(FILE_TREE.length, Math.floor((frame - 24) / lineInterval) + 1),
  );

  return (
    <div
      style={{
        ...panelStyle,
        position: 'relative',
        width: compact ? 610 : 850,
        height: compact ? 510 : 840,
        padding: compact ? '24px 28px' : '28px 34px',
        boxSizing: 'border-box',
        opacity: enter,
        transform: `translateX(${(1 - enter) * 38}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: compact ? 16 : 22,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            color: COLORS.text,
            fontWeight: 700,
            fontSize: compact ? 20 : 24,
          }}
        >
          Core generated files
        </div>
        <div
          style={{
            color: COLORS.muted,
            fontFamily: monoFont,
            fontSize: compact ? 12 : 14,
            letterSpacing: '0.08em',
          }}
        >
          ABRIDGED TREE
        </div>
      </div>
      <div style={{paddingTop: compact ? 14 : 20}}>
        {FILE_TREE.slice(0, visibleLines).map((line, index) => (
          <div
            key={`${line}-${index}`}
            style={{
              color: treeLineColor(line),
              fontFamily: monoFont,
              fontSize: compact ? 16 : 20,
              lineHeight: compact ? 1.25 : 1.42,
              whiteSpace: 'pre',
              textShadow:
                line.includes('stdio') || line.includes('web.ts')
                  ? `0 0 12px ${treeLineColor(line)}55`
                  : undefined,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PrimitiveBadges: React.FC<{
  frameOverride?: number;
  start?: number;
}> = ({frameOverride, start = 160}) => {
  const currentFrame = useCurrentFrame();
  const frame = frameOverride ?? currentFrame;
  return (
    <div style={{display: 'flex', gap: 12}}>
      <FeatureChip label="Tools" color={COLORS.magenta} delay={start} frameOverride={frame} />
      <FeatureChip label="Resources" color={COLORS.cyan} delay={start + 10} frameOverride={frame} />
      <FeatureChip label="Prompts" color={COLORS.green} delay={start + 20} frameOverride={frame} />
    </div>
  );
};

export const FinalCta: React.FC<{frameOverride?: number}> = ({
  frameOverride,
}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = frameOverride ?? currentFrame;
  const enter = spring({
    frame: frame - 108,
    fps,
    durationInFrames: 30,
    config: {damping: 200},
  });
  const sweep = clamp(frame, [132, 168], [-45, 145]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 74,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '18px 34px',
          borderRadius: 15,
          border: `1px solid ${COLORS.borderBright}`,
          background: 'rgba(2,6,23,0.92)',
          boxShadow: '0 18px 70px rgba(0,0,0,0.45), 0 0 30px rgba(6,182,212,0.12)',
          color: COLORS.text,
          fontFamily: monoFont,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: '-0.035em',
        }}
      >
        <span style={{color: COLORS.cyan}}>$ </span>
        <span style={gradientText}>npm create mcp-kit@latest</span>
        <div
          style={{
            position: 'absolute',
            top: -30,
            bottom: -30,
            left: `${sweep}%`,
            width: 110,
            transform: 'skewX(-18deg)',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
          }}
        />
      </div>
      <div
        style={{
          marginTop: 16,
          color: COLORS.muted,
          fontFamily: monoFont,
          fontSize: 19,
          letterSpacing: '0.025em',
        }}
      >
        github.com/my-mcp-hub/mcp-kit
      </div>
    </div>
  );
};
