import { builtinModules } from 'node:module'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rolldown'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'esm',
    dir: 'dist',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  watch: {
    clearScreen: false,
  },
  plugins: [isProd && terser(), typescript({ tsconfig: './tsconfig.build.json' })],
  external: [...builtinModules, ...builtinModules.map(m => `node:${m}`), 'handlebars'],
})
