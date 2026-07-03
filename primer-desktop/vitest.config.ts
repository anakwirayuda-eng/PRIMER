import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
    // Test komponen React (src/renderer/**/*.test.tsx) butuh DOM — engine/
    // content tetap 'node' (lebih cepat, dan menjamin murni tanpa DOM/React).
    environmentMatchGlobs: [['src/renderer/**/*.test.tsx', 'jsdom']],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@engine': resolve(__dirname, 'src/engine'),
      '@content': resolve(__dirname, 'src/content'),
    },
  },
})
