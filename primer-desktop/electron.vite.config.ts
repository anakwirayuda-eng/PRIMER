import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
    },
  },
  preload: {
    build: {
      outDir: 'out/preload',
    },
  },
  renderer: {
    build: {
      outDir: 'out/renderer',
    },
    resolve: {
      alias: {
        '@engine': resolve(__dirname, 'src/engine'),
        '@content': resolve(__dirname, 'src/content'),
        '@ui': resolve(__dirname, 'src/renderer/src'),
      },
    },
    plugins: [react()],
  },
})
