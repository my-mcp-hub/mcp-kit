import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  FinalCta,
  GeneratedFileTree,
  PrimitiveBadges,
  ScaffoldingPipeline,
  TransportDiagram,
} from './components/StoryGraphics';
import {SceneShell} from './components/SceneShell';
import {
  ChoiceList,
  CompletedPrompt,
  FeatureChip,
  GradientText,
  MultiChoiceList,
  TerminalLine,
  TypewriterLine,
  type Choice,
} from './components/TerminalPieces';
import {TerminalWindow} from './components/TerminalWindow';
import {
  COLORS,
  GRADIENT,
  SCENE_DURATIONS,
  clamp,
  gradientText,
  monoFont,
  panelStyle,
  uiFont,
} from './theme';

const projectTypeChoices: Choice[] = [
  {label: 'MCP Server', color: COLORS.magenta},
  {label: 'MCP Client', color: COLORS.green},
];

const languageChoices: Choice[] = [
  {label: 'TypeScript', color: COLORS.magenta},
  {label: 'JavaScript', color: COLORS.green},
];

const transportChoices: Choice[] = [
  {label: 'STDIO', color: COLORS.magenta},
  {label: 'Streamable HTTP', color: COLORS.green},
];

const templateChoices: Choice[] = [
  {label: 'Standard (recommended)', color: COLORS.magenta},
  {label: 'Custom', color: COLORS.green},
];

const pluginChoices: Choice[] = [
  {label: 'GitHub Action', color: COLORS.magenta},
  {label: 'Vitest', color: COLORS.green},
  {label: 'Inspector', color: COLORS.cyan},
  {label: 'ESLint + Prettier + Lint-staged', color: COLORS.warning},
  {label: 'Commitlint', color: COLORS.red},
  {label: 'Changelog', color: COLORS.blue},
];

const IntroLine: React.FC<{size?: number}> = ({size = 29}) => (
  <TerminalLine style={{fontSize: size}}>
    <GradientText>MCP Kit - The Modern Context Protocol Builder</GradientText>
  </TerminalLine>
);

const TerminalStage: React.FC<{
  children: React.ReactNode;
  left?: number;
  top?: number;
}> = ({children, left = 270, top = 150}) => (
  <div style={{position: 'absolute', left, top}}>{children}</div>
);

const BadgeStack: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: 'absolute',
      right: 80,
      top: 280,
      width: 380,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 18,
    }}
  >
    <FeatureChip label="SERVER" color={COLORS.magenta} delay={68} frameOverride={frame} />
    <FeatureChip
      label="mcp-server-starter"
      color={COLORS.cyan}
      delay={92}
      frameOverride={frame}
    />
    <FeatureChip
      label="TypeScript"
      color={COLORS.green}
      delay={132}
      frameOverride={frame}
    />
    <svg
      width="310"
      height="190"
      viewBox="0 0 310 190"
      style={{
        position: 'absolute',
        left: -34,
        top: 22,
        opacity: clamp(frame, [138, 172], [0, 0.42]),
        zIndex: -1,
      }}
    >
      <path
        d="M18 0v48h36M18 48v58h36M18 106v58h36"
        fill="none"
        stroke={COLORS.cyan}
        strokeWidth="1.5"
      />
      <circle cx="18" cy="48" r="3" fill={COLORS.cyan} />
      <circle cx="18" cy="106" r="3" fill={COLORS.cyan} />
    </svg>
  </div>
);

export const Scene01PowerOn: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = spring({
    frame: frame - 34,
    fps,
    durationInFrames: 34,
    config: {damping: 200},
  });
  const tagline = spring({
    frame: frame - 54,
    fps,
    durationInFrames: 34,
    config: {damping: 200},
  });
  const drift = interpolate(frame, [0, SCENE_DURATIONS[0]], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell
      index={1}
      label="System online"
      duration={SCENE_DURATIONS[0]}
      backgroundIntensity={0.82}
    >
      <TerminalStage left={250 + drift} top={164 + drift * 0.5}>
        <TerminalWindow width={1420} height={760} entrance syncRipple={clamp(frame, [2, 18], [1, 0])}>
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                opacity: brand,
                transform: `translateY(${(1 - brand) * 18}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: monoFont,
                  fontSize: 30,
                  color: COLORS.cyan,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: 30,
                }}
              >
                mcp-kit
              </div>
              <div
                style={{
                  ...gradientText,
                  fontFamily: uiFont,
                  fontSize: 74,
                  fontWeight: 700,
                  letterSpacing: '-0.055em',
                }}
              >
                MCP Kit
              </div>
            </div>
            <div
              style={{
                ...gradientText,
                marginTop: 22,
                fontFamily: monoFont,
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: '-0.025em',
                opacity: tagline,
                transform: `translateY(${(1 - tagline) * 12}px)`,
              }}
            >
              The Modern Context Protocol Builder
            </div>
            <div
              style={{
                width: 460,
                height: 1,
                marginTop: 44,
                transform: `scaleX(${tagline})`,
                background: GRADIENT,
                boxShadow: '0 0 16px rgba(34,211,238,0.38)',
              }}
            />
          </AbsoluteFill>
        </TerminalWindow>
      </TerminalStage>
    </SceneShell>
  );
};

export const Scene02InvokeCli: React.FC = () => {
  const frame = useCurrentFrame();
  const command = 'npm create mcp-kit@latest';
  const typingStart = 14;
  const enterAt = 72;
  const introVisible = frame >= 82;
  const promptVisible = frame >= 103;
  const promptComplete = frame >= 142;
  const shift = clamp(frame, [enterAt, enterAt + 12], [0, -18]);

  return (
    <SceneShell index={2} label="Invoke the CLI" duration={SCENE_DURATIONS[1]}>
      <TerminalStage left={270} top={150}>
        <TerminalWindow
          width={1380}
          height={780}
          syncRipple={clamp(frame, [0, 9], [0.8, 0])}
        >
          <div style={{transform: `translateY(${shift}px)`}}>
            <TypewriterLine
              prefix="~/projects $ "
              text={command}
              frame={frame}
              start={typingStart}
              framesPerCharacter={2}
              cursor={frame < enterAt}
              keepCursorAfterDone
            />
            {introVisible ? (
              <div
                style={{
                  marginTop: 24,
                  opacity: clamp(frame, [82, 93], [0, 1]),
                }}
              >
                <IntroLine />
              </div>
            ) : null}
            {promptVisible ? (
              <div
                style={{
                  marginTop: 28,
                  opacity: clamp(frame, [103, 113], [0, 1]),
                }}
              >
                <ChoiceList
                  label="Project type:"
                  choices={projectTypeChoices}
                  selectedIndex={0}
                  confirmed={promptComplete}
                />
              </div>
            ) : null}
          </div>
        </TerminalWindow>
      </TerminalStage>
    </SceneShell>
  );
};

export const Scene03NameLanguage: React.FC = () => {
  const frame = useCurrentFrame();
  const name = 'mcp-server-starter';
  const nameStart = 22;
  const nameDone = frame >= 66;
  const languageVisible = frame >= 84;
  const languageDone = frame >= 154;

  return (
    <SceneShell index={3} label="Define the project" duration={SCENE_DURATIONS[2]}>
      <TerminalStage left={82} top={148}>
        <TerminalWindow
          width={1320}
          height={790}
          syncRipple={clamp(frame, [0, 9], [0.8, 0])}
        >
          <IntroLine size={25} />
          <div style={{height: 18}} />
          <CompletedPrompt
            label="Project type:"
            answer="MCP Server"
            answerColor={COLORS.magenta}
            compact
          />
          <div style={{marginTop: 8}}>
            <TerminalLine>
              <span style={{color: COLORS.green}}>{nameDone ? '◇' : '◆'}</span>
              {'  '}Project name:
            </TerminalLine>
            <TypewriterLine
              prefix="│  "
              text={name}
              frame={frame}
              start={nameStart}
              framesPerCharacter={2}
              cursor={!nameDone}
              keepCursorAfterDone
            />
          </div>
          {languageVisible ? (
            <div
              style={{
                marginTop: 10,
                opacity: clamp(frame, [84, 96], [0, 1]),
              }}
            >
              <ChoiceList
                label="Project language:"
                choices={languageChoices}
                selectedIndex={0}
                confirmed={languageDone}
              />
            </div>
          ) : null}
        </TerminalWindow>
      </TerminalStage>
      <BadgeStack frame={frame} />
    </SceneShell>
  );
};

export const Scene04Transports: React.FC = () => {
  const frame = useCurrentFrame();
  const httpChecked = frame >= 65;
  const completed = frame >= 121;

  return (
    <SceneShell index={4} label="Connect every context" duration={SCENE_DURATIONS[3]}>
      <TerminalStage left={80} top={156}>
        <TerminalWindow
          width={1200}
          height={744}
          syncRipple={clamp(frame, [0, 9], [0.8, 0])}
        >
          <CompletedPrompt label="Project type:" answer="MCP Server" answerColor={COLORS.magenta} compact />
          <CompletedPrompt label="Project name:" answer="mcp-server-starter" answerColor={COLORS.cyan} compact />
          <CompletedPrompt label="Project language:" answer="TypeScript" answerColor={COLORS.magenta} compact />
          <div style={{marginTop: 18}}>
            <MultiChoiceList
              label="Project transport type:"
              choices={transportChoices}
              checked={[true, httpChecked]}
              activeIndex={frame < 48 ? 0 : 1}
              confirmed={completed}
            />
          </div>
        </TerminalWindow>
      </TerminalStage>
      <TransportDiagram frameOverride={frame} />
    </SceneShell>
  );
};

const WrappedCompletedPlugins: React.FC = () => (
  <div style={{marginBottom: 12}}>
    <TerminalLine style={{fontSize: 27, lineHeight: 1.18}}>
      <span style={{color: COLORS.green}}>◇</span>
      {'  '}Project plugins:
    </TerminalLine>
    {[
      'GitHub Action, Vitest, Inspector,',
      'ESLint + Prettier + Lint-staged,',
      'Commitlint, Changelog',
    ].map((line, index) => (
      <TerminalLine
        key={line}
        color={COLORS.cyan}
        style={{fontSize: 24, lineHeight: 1.28}}
      >
        <span style={{color: COLORS.dim}}>│</span>
        {'  '}
        {line}
      </TerminalLine>
    ))}
  </div>
);

const PluginChips: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: 'absolute',
      left: 1305,
      top: 238,
      width: 530,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
    }}
  >
    {pluginChoices.map((plugin, index) => (
      <FeatureChip
        key={plugin.label}
        label={plugin.label === 'ESLint + Prettier + Lint-staged' ? 'Style tooling' : plugin.label}
        color={plugin.color}
        delay={126 + index * 5}
        frameOverride={frame}
      />
    ))}
    <div
      style={{
        ...panelStyle,
        gridColumn: '1 / -1',
        marginTop: 12,
        padding: '20px 22px',
        opacity: clamp(frame, [154, 174], [0, 1]),
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Custom profile
      </div>
      <div style={{marginTop: 10, color: COLORS.text, fontSize: 25, fontWeight: 700}}>
        Six plugins selected
      </div>
      <div style={{marginTop: 8, color: COLORS.green, fontFamily: monoFont, fontSize: 17}}>
        install dependencies: Yes
      </div>
    </div>
  </div>
);

export const Scene05CustomPlugins: React.FC = () => {
  const frame = useCurrentFrame();
  const templateDone = frame >= 54;
  const pluginsVisible = frame >= 58;
  const checkedCount = Math.max(0, Math.min(6, Math.floor((frame - 70) / 9) + 1));
  const pluginsDone = frame >= 132;
  const installVisible = frame >= 148;
  const installDone = frame >= 179;

  return (
    <SceneShell index={5} label="Custom build profile" duration={SCENE_DURATIONS[4]}>
      <TerminalStage left={80} top={138}>
        <TerminalWindow
          width={1160}
          height={820}
          screenPadding={36}
          syncRipple={clamp(frame, [0, 9], [0.8, 0])}
        >
          <CompletedPrompt
            label="Project transport type:"
            answer="STDIO, Streamable HTTP"
            answerColor={COLORS.green}
            compact
          />
          <ChoiceList
            label="Project template:"
            choices={templateChoices}
            selectedIndex={frame < 28 ? 0 : 1}
            confirmed={templateDone}
          />
          {pluginsVisible ? (
            <div style={{marginTop: 8, opacity: clamp(frame, [58, 66], [0, 1])}}>
              <MultiChoiceList
                label="Project plugins:"
                choices={pluginChoices}
                checked={pluginChoices.map((_, index) => index < checkedCount)}
                activeIndex={Math.min(checkedCount, 5)}
                dense
                confirmed={pluginsDone}
              />
            </div>
          ) : null}
          {installVisible ? (
            <div style={{marginTop: 8, opacity: clamp(frame, [148, 158], [0, 1])}}>
              <ChoiceList
                label="Do you want to install dependencies?"
                choices={[
                  {label: 'Yes', color: COLORS.green},
                  {label: 'No', color: COLORS.muted},
                ]}
                selectedIndex={0}
                confirmed={installDone}
              />
            </div>
          ) : null}
        </TerminalWindow>
      </TerminalStage>
      <PluginChips frame={frame} />
    </SceneShell>
  );
};

export const Scene06Scaffolding: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const terminalShift = spring({
    frame,
    fps,
    durationInFrames: 30,
    config: {damping: 200},
  });

  return (
    <SceneShell index={6} label="Scaffolding engine" duration={SCENE_DURATIONS[5]}>
      <TerminalStage left={80 - (1 - terminalShift) * 40} top={184}>
        <TerminalWindow
          width={650}
          height={710}
          screenPadding={30}
          syncRipple={clamp(frame, [0, 9], [0.8, 0])}
        >
          <CompletedPrompt label="Project transport type:" answer="STDIO, Streamable HTTP" answerColor={COLORS.green} compact />
          <CompletedPrompt label="Project template:" answer="Custom" answerColor={COLORS.green} compact />
          <WrappedCompletedPlugins />
          <div style={{marginBottom: 7}}>
            <TerminalLine style={{fontSize: 24, lineHeight: 1.18}}>
              <span style={{color: COLORS.green}}>◇</span>
              {'  '}Do you want to install dependencies?
            </TerminalLine>
            <TerminalLine color={COLORS.green} style={{lineHeight: 1.2}}>
              <span style={{color: COLORS.dim}}>│</span>
              {'  '}Yes
            </TerminalLine>
          </div>
        </TerminalWindow>
      </TerminalStage>
      <ScaffoldingPipeline frameOverride={frame} />
    </SceneShell>
  );
};

export const Scene07InstallTree: React.FC = () => {
  const frame = useCurrentFrame();
  const spinner = ['◒', '◐', '◓', '◑'][Math.floor(frame / 4) % 4];
  const installed = frame >= 226;

  return (
    <SceneShell index={7} label="Ready-to-run starter" duration={SCENE_DURATIONS[6]}>
      <TerminalStage left={60} top={170}>
        <TerminalWindow
          width={880}
          height={720}
          screenPadding={38}
          syncRipple={clamp(frame, [0, 9], [0.8, 0])}
        >
          <IntroLine size={28} />
          <div style={{height: 26}} />
          <CompletedPrompt
            label="Do you want to install dependencies?"
            answer="Yes"
            answerColor={COLORS.green}
          />
          <div style={{height: 30}} />
          <TerminalLine
            color={installed ? COLORS.green : COLORS.cyan}
            style={{fontSize: 30}}
          >
            <span
              style={{
                display: 'inline-block',
                width: 36,
                color: installed ? COLORS.green : COLORS.cyan,
              }}
            >
              {installed ? '✓' : spinner}
            </span>
            {installed ? 'Dependencies installed!' : 'Installing dependencies...'}
          </TerminalLine>
        </TerminalWindow>
      </TerminalStage>
      <div style={{position: 'absolute', right: 80, top: 126}}>
        <GeneratedFileTree frameOverride={frame} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 80,
          bottom: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: clamp(frame, [118, 145], [0, 1]),
        }}
      >
        <PrimitiveBadges frameOverride={frame} start={154} />
        <div
          style={{
            width: 1,
            height: 34,
            background: COLORS.border,
            marginLeft: 6,
          }}
        />
        <FeatureChip
          label="stdio.ts"
          color={COLORS.magenta}
          delay={190}
          frameOverride={frame}
        />
        <FeatureChip
          label="web.ts"
          color={COLORS.green}
          delay={200}
          frameOverride={frame}
        />
      </div>
      {installed ? (
        <div
          style={{
            position: 'absolute',
            left: 850,
            top: 470,
            width: clamp(frame, [226, 252], [0, 970]),
            height: 2,
            background:
              'linear-gradient(90deg, transparent, #22D3EE, #10B981, transparent)',
            boxShadow: '0 0 22px #22D3EE',
            opacity: clamp(frame, [226, 238], [0, 0.8]),
          }}
        />
      ) : null}
    </SceneShell>
  );
};

const HeroBrand: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - 74,
    fps,
    durationInFrames: 30,
    config: {damping: 200},
  });
  return (
    <div
      style={{
        position: 'absolute',
        right: 142,
        top: 165,
        width: 590,
        textAlign: 'center',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
      }}
    >
      <div
        style={{
          ...gradientText,
          fontFamily: uiFont,
          fontSize: 58,
          fontWeight: 750,
          letterSpacing: '-0.055em',
        }}
      >
        MCP Kit
      </div>
      <div
        style={{
          marginTop: 12,
          color: COLORS.text,
          fontFamily: monoFont,
          fontSize: 20,
        }}
      >
        The Modern Context Protocol Builder
      </div>
      <div style={{marginTop: 22, display: 'flex', justifyContent: 'center', gap: 12}}>
        <FeatureChip label="MCP Server" color={COLORS.magenta} delay={92} frameOverride={frame} />
        <FeatureChip label="MCP Client" color={COLORS.green} delay={100} frameOverride={frame} />
      </div>
    </div>
  );
};

export const Scene08Success: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const frame = Math.min(rawFrame, 194);
  const {fps} = useVideoConfig();
  const check = spring({
    frame: frame - 10,
    fps,
    durationInFrames: 26,
    config: {damping: 16, stiffness: 210},
  });
  const pullback = spring({
    frame: frame - 62,
    fps,
    durationInFrames: 42,
    config: {damping: 200},
  });

  return (
    <SceneShell
      index={8}
      label="Ship the protocol"
      duration={SCENE_DURATIONS[7]}
      frameOverride={frame}
      backgroundIntensity={0.92}
    >
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 156,
          transform: `scale(${1 - pullback * 0.19}) translate(${pullback * -30}px, ${pullback * 60}px)`,
          transformOrigin: '0 0',
        }}
      >
        <TerminalWindow
          width={1120}
          height={700}
          screenPadding={42}
          frameOverride={frame}
          syncRipple={clamp(frame, [0, 9], [0.8, 0])}
        >
          <div
            style={{
              marginBottom: 34,
              opacity: clamp(frame, [4, 18], [0, 1]),
            }}
          >
            <TerminalLine color={COLORS.green} style={{fontSize: 30}}>
              <span
                style={{
                  display: 'inline-block',
                  transform: `scale(${check})`,
                  transformOrigin: '50% 55%',
                  textShadow: `0 0 18px ${COLORS.green}66`,
                }}
              >
                ✓
              </span>{' '}
              Project created successfully!
            </TerminalLine>
          </div>
          <TerminalLine color={COLORS.cyan}>Next steps:</TerminalLine>
          <TerminalLine style={{paddingLeft: 30}}>
            <span style={{color: COLORS.muted}}>cd</span> mcp-server-starter
          </TerminalLine>
          <TerminalLine style={{paddingLeft: 30}}>
            <span style={{color: COLORS.muted}}>npm run dev</span>
          </TerminalLine>
          <div style={{height: 30}} />
          <TerminalLine>Enjoy coding! 🎉</TerminalLine>
        </TerminalWindow>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 82,
          top: 360,
          opacity: clamp(frame, [68, 104], [0, 1]),
          transform: `scale(${0.74 + pullback * 0.06})`,
          transformOrigin: '100% 0',
        }}
      >
        <GeneratedFileTree frameOverride={frame + 80} compact />
      </div>
      <HeroBrand frame={frame} />
      <FinalCta frameOverride={frame} />
    </SceneShell>
  );
};
