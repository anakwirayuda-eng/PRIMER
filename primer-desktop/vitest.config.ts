import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@engine': resolve(__dirname, 'src/engine'),
      '@content': resolve(__dirname, 'src/content'),
    },
  },
})
