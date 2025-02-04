import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main', // Output untuk proses utama
    },
  },
  preload: {
    build: {
      outDir: 'out/preload', // Output untuk preload script
    },
  },
  renderer: {
    plugins: [react()],
    build: {
      outDir: 'out/renderer', // Output untuk frontend React
    },
  },
});