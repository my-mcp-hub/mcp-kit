import { defineProject } from 'vitest/config'

export default defineProject({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {},
})
