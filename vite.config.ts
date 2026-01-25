import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ REQUIRED for correct asset loading in production
  base: '/',

  server: {
    port: 5173,
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
