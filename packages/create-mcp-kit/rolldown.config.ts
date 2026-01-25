import { builtinModules } from 'node:module'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rolldown'

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'esm',
    dir: 'dist',
    sourcemap: isDev,
  },
  plugins: [isProd && terser(), typescript()],
  external: [
    ...builtinModules,
    ...builtinModules.map(m => `node:${m}`),
    '@clack/prompts',
    'picocolors',
    'handlebars',
    'gradient-string',
    '@mcp-tool-kit/shared',
  ],
})
