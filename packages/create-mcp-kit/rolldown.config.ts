import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rolldown'
import typescript from '@rollup/plugin-typescript'

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'local'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'esm',
    dir: 'dist',
    sourcemap: isDev,
  },
  plugins: [isProd && terser(), typescript()],
  external: [
    '@clack/prompts',
    'picocolors',
    'fs/promises',
    'timers/promises',
    'path',
    'child_process',
    'url',
    '@mcp-tool-kit/shared',
    'gradient-string',
  ],
})
