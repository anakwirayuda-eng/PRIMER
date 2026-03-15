import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const normalizeId = (id) => id.replace(/\\/g, '/');

function manualChunks(id) {
  const normalizedId = normalizeId(id);

  if (normalizedId.includes('/src/data/master_icd_10_parts/')) {
    return `icd10-${path.basename(normalizedId, '.json')}`;
  }
  if (normalizedId.includes('/src/data/master_icd_9.json')) {
    return 'master-icd9';
  }
  if (normalizedId.includes('/src/data/MedicationDatabase.js') || normalizedId.includes('/src/data/medication/')) {
    return 'medication-data';
  }
  if (normalizedId.includes('/src/content/cases/')) {
    return 'case-content';
  }
  if (normalizedId.includes('/src/content/scenarios/')) {
    return 'scenario-content';
  }
  if (normalizedId.includes('/src/domains/village/')) {
    return 'village-domain';
  }
  if (normalizedId.includes('/src/data/FKTP144Diseases.js')) {
    return 'diseases-data';
  }

  if (normalizedId.includes('/node_modules/')) {
    return 'vendor';
  }
}

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
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks
      }
    }
  }
})
