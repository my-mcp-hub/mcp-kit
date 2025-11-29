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
    sourcemap: false,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  // resolve: {
  //   alias: {
  //     '@': './src',
  //   },
  // },
  plugins: [isProd && terser(), typescript()],
  external: [...builtinModules, ...builtinModules.map(m => `node:${m}`), 'handlebars'],
})
