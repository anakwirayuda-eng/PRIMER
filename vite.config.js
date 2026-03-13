import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@game': path.resolve(__dirname, './src/game'),
      '@components': path.resolve(__dirname, './src/components'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@diagnostics': path.resolve(__dirname, './src/diagnostics'),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/test-setup.js',
    css: true,
  },
  server: {
    host: true, // Listen on all addresses (0.0.0.0)
    port: 5173,
    strictPort: true, // Keep the dev URL stable so dynamic imports do not drift to a new port.
    hmr: {
      overlay: false, // Disable the error overlay if it's annoying, but keeping it is usually good.
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('src/game/CaseLibrary')) {
            return 'case-library';
          }
          if (id.includes('src/data/VillageRegistry')) {
            return 'village-registry';
          }
          if (id.includes('src/data/FKTP144Diseases')) {
            return 'diseases-data';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
