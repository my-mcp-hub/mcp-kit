import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, gradientText, monoFont, monoText} from '../theme';

export const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => <span style={{...gradientText, ...style}}>{children}</span>;

export const TerminalLine: React.FC<{
  children: React.ReactNode;
  color?: string;
  dim?: boolean;
  style?: React.CSSProperties;
}> = ({children, color, dim = false, style}) => (
  <div
    style={{
      ...monoText,
      color: color ?? (dim ? COLORS.muted : COLORS.text),
      whiteSpace: 'pre',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Cursor: React.FC<{frame: number; color?: string}> = ({
  frame,
  color = COLORS.cyan,
}) => (
  <span
    style={{
      display: 'inline-block',
      width: 16,
      height: 30,
      marginLeft: 4,
      verticalAlign: -5,
      background: color,
      opacity: Math.floor(frame / 14) % 2 === 0 ? 1 : 0.18,
      boxShadow: `0 0 10px ${color}`,
    }}
  />
);

export const TypewriterLine: React.FC<{
  prefix?: string;
  text: string;
  frame: number;
  start: number;
  framesPerCharacter?: number;
  cursor?: boolean;
  keepCursorAfterDone?: boolean;
}> = ({
  prefix = '',
  text,
  frame,
  start,
  framesPerCharacter = 2,
  cursor = true,
  keepCursorAfterDone = false,
}) => {
  const characters = Math.max(0, Math.floor((frame - start) / framesPerCharacter));
  const visible = text.slice(0, characters);
  const done = characters >= text.length;
  return (
    <TerminalLine>
      <span style={{color: COLORS.cyan}}>{prefix}</span>
      {visible}
      {cursor && (!done || keepCursorAfterDone) ? (
        <Cursor frame={frame - start} />
      ) : null}
    </TerminalLine>
  );
};

export const CompletedPrompt: React.FC<{
  label: string;
  answer: React.ReactNode;
  answerColor?: string;
  compact?: boolean;
}> = ({label, answer, answerColor = COLORS.text, compact = false}) => (
  <div style={{marginBottom: compact ? 7 : 14}}>
    <TerminalLine style={{lineHeight: 1.18}}>
      <span style={{color: COLORS.green}}>◇</span>
      {'  '}
      {label}
    </TerminalLine>
    <TerminalLine color={answerColor} style={{lineHeight: 1.2}}>
      <span style={{color: COLORS.dim}}>│</span>
      {'  '}
      {answer}
    </TerminalLine>
  </div>
);

export type Choice = {
  label: string;
  color: string;
};

export const ChoiceList: React.FC<{
  label: string;
  choices: Choice[];
  selectedIndex: number;
  confirmed?: boolean;
}> = ({label, choices, selectedIndex, confirmed = false}) => (
  <div>
    <TerminalLine>
      <span style={{color: COLORS.green}}>{confirmed ? '◇' : '◆'}</span>
      {'  '}
      {label}
    </TerminalLine>
    {choices.map((choice, index) => {
      const selected = index === selectedIndex;
      return (
        <TerminalLine
          key={choice.label}
          color={selected ? choice.color : COLORS.muted}
          style={{paddingLeft: 38}}
        >
          <span style={{color: selected ? COLORS.cyan : COLORS.dim}}>
            {selected ? '●' : '○'}
          </span>
          {'  '}
          {choice.label}
        </TerminalLine>
      );
    })}
  </div>
);

export const MultiChoiceList: React.FC<{
  label: string;
  choices: Choice[];
  checked: boolean[];
  activeIndex: number;
  dense?: boolean;
  confirmed?: boolean;
}> = ({
  label,
  choices,
  checked,
  activeIndex,
  dense = false,
  confirmed = false,
}) => (
  <div>
    <TerminalLine style={{lineHeight: dense ? 1.18 : 1.4}}>
      <span style={{color: COLORS.green}}>{confirmed ? '◇' : '◆'}</span>
      {'  '}
      {label}
    </TerminalLine>
    {choices.map((choice, index) => {
      const active = !confirmed && index === activeIndex;
      return (
        <TerminalLine
          key={choice.label}
          color={checked[index] ? choice.color : active ? COLORS.text : COLORS.muted}
          style={{
            paddingLeft: 38,
            lineHeight: dense ? 1.25 : 1.42,
            fontSize: dense ? 27 : 29,
          }}
        >
          <span style={{color: active ? COLORS.cyan : checked[index] ? choice.color : COLORS.dim}}>
            {active ? '›' : ' '}
          </span>
          {' '}
          <span style={{color: checked[index] ? choice.color : COLORS.dim}}>
            {checked[index] ? '◼' : '◻'}
          </span>
          {'  '}
          {choice.label}
        </TerminalLine>
      );
    })}
  </div>
);

export const FeatureChip: React.FC<{
  label: string;
  color?: string;
  delay?: number;
  frameOverride?: number;
}> = ({label, color = COLORS.cyan, delay = 0, frameOverride}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = frameOverride ?? currentFrame;
  const progress = spring({
    frame: frame - delay,
    fps,
    durationInFrames: 18,
    config: {damping: 18, stiffness: 210},
  });

  return (
    <div
      style={{
        height: 42,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 16px',
        borderRadius: 10,
        background: `${color}12`,
        border: `1px solid ${color}66`,
        color,
        fontFamily: monoFont,
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: '0.035em',
        opacity: progress,
        transform: `translateY(${(1 - progress) * 14}px) scale(${0.9 + progress * 0.1})`,
        boxShadow: `0 0 20px ${color}12`,
      }}
    >
      <span style={{fontSize: 12}}>◆</span>
      {label}
    </div>
  );
};
