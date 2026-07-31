import type { CSSProperties } from 'react'
import { Easing, interpolate } from 'remotion'

export const WIDTH = 1920
export const HEIGHT = 1080
export const FPS = 30
export const TOTAL_FRAMES = 1440
export const TRANSITION_FRAMES = 12
export const SCENE_DURATIONS = [105, 165, 195, 165, 210, 180, 264, 240] as const
export const SCENE_STARTS = [0, 93, 246, 429, 582, 780, 948, 1200] as const

export const COLORS = {
  background: '#020617',
  backgroundDeep: '#01030A',
  backgroundSoft: '#050814',
  surface: '#080D19',
  surfaceBright: '#0B1323',
  border: '#1E3A5F',
  borderBright: '#287DB7',
  text: '#E6F1FF',
  muted: '#708099',
  dim: '#46556E',
  purple: '#A855F7',
  blue: '#3B82F6',
  cyan: '#06B6D4',
  green: '#10B981',
  warning: '#FBBF24',
  red: '#F87171',
  magenta: '#E879F9',
} as const

export const GRADIENT = 'linear-gradient(90deg, #A855F7 0%, #3B82F6 40%, #06B6D4 78%, #10B981 100%)'

export const monoFont = '"JetBrains Mono", "SFMono-Regular", Consolas, monospace'
export const uiFont = 'Inter, ui-sans-serif, system-ui, sans-serif'

export const gradientText: CSSProperties = {
  backgroundImage: GRADIENT,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}

export const clamp = (frame: number, input: readonly [number, number], output: readonly [number, number]) =>
  interpolate(frame, [...input], [...output], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

export const fadeWindow = (frame: number, start: number, end: number, fadeFrames = 10) =>
  Math.min(clamp(frame, [start, start + fadeFrames], [0, 1]), clamp(frame, [end - fadeFrames, end], [1, 0]))

export const monoText: CSSProperties = {
  color: COLORS.text,
  fontFamily: monoFont,
  fontSize: 29,
  lineHeight: 1.42,
  letterSpacing: '-0.02em',
}

export const panelStyle: CSSProperties = {
  background: 'linear-gradient(145deg, rgba(11,19,35,0.96), rgba(5,8,20,0.96))',
  border: `1px solid ${COLORS.border}`,
  boxShadow: '0 26px 80px rgba(0,0,0,0.44), inset 0 1px 0 rgba(125,211,252,0.05)',
  borderRadius: 20,
}
