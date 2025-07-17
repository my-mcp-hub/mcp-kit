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
  plugins: [terser(), typescript()],
  external: [],
})
