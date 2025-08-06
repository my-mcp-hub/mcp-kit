import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rolldown'
import typescript from '@rollup/plugin-typescript'

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
  external: ['fs/promises', 'timers/promises', 'path', 'child_process', 'handlebars'],
})
