// Konfigurasi preview renderer-only (browser, tanpa Electron) — untuk QA visual.
// Game asli tetap berjalan via electron-vite; shim window.primer ada di main.tsx.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  plugins: [react()],
  resolve: {
    alias: {
      '@engine': resolve(__dirname, 'src/engine'),
      '@content': resolve(__dirname, 'src/content'),
      '@ui': resolve(__dirname, 'src/renderer/src'),
    },
  },
  server: { port: 5199, strictPort: true },
})
