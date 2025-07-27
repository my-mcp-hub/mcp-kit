import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rolldown'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'esm',
    dir: 'dist',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  // resolve: {
  //   alias: {
  //     '@': './src',
  //   },
  // },
  plugins: [terser(), typescript()],
  external: ['fs/promises', 'timers/promises', 'path', 'child_process'],
})
