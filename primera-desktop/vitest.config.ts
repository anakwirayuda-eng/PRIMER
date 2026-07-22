import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // `environmentMatchGlobs` deprecated di Vitest 3. Proyek eksplisit juga
    // mencegah test renderer diam-diam berjalan di Node setelah upgrade Vitest.
    projects: [
      {
        extends: true,
        test: {
          name: 'engine-content',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/renderer/**/*.test.tsx'],
          environment: 'node',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'renderer',
          include: ['src/renderer/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@engine': resolve(__dirname, 'src/engine'),
      '@content': resolve(__dirname, 'src/content'),
    },
  },
})
