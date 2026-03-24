import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const normalizeId = (id) => id.replace(/\\/g, '/');
const hasPackage = (id, pkg) => id.includes(`/node_modules/${pkg}/`);

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
    if (
      hasPackage(normalizedId, 'react') ||
      hasPackage(normalizedId, 'react-dom') ||
      hasPackage(normalizedId, 'react-router-dom') ||
      hasPackage(normalizedId, 'scheduler')
    ) {
      return 'vendor-react';
    }

    if (
      hasPackage(normalizedId, 'i18next') ||
      hasPackage(normalizedId, 'react-i18next')
    ) {
      return 'vendor-i18n';
    }

    if (
      hasPackage(normalizedId, 'three') ||
      hasPackage(normalizedId, '@react-three/fiber') ||
      hasPackage(normalizedId, '@react-three/drei') ||
      hasPackage(normalizedId, '@react-three/postprocessing')
    ) {
      return 'vendor-3d';
    }

    if (
      hasPackage(normalizedId, 'konva') ||
      hasPackage(normalizedId, 'react-konva') ||
      hasPackage(normalizedId, 'recharts')
    ) {
      return 'vendor-visualization';
    }

    if (
      hasPackage(normalizedId, 'lucide-react') ||
      hasPackage(normalizedId, 'framer-motion')
    ) {
      return 'vendor-ui';
    }

    return 'vendor-3d';
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
