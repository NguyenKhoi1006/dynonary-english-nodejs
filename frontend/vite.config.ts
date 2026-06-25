import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: [
      // Use regex to only match imports starting with alias/ (not bare package names)
      { find: /^assets\//, replacement: path.resolve(__dirname, 'src/assets') + '/' },
      { find: /^apis\//, replacement: path.resolve(__dirname, 'src/apis') + '/' },
      { find: /^components\//, replacement: path.resolve(__dirname, 'src/components') + '/' },
      { find: /^configs\//, replacement: path.resolve(__dirname, 'src/configs') + '/' },
      { find: /^constant/, replacement: path.resolve(__dirname, 'src/constant') },
      { find: /^helper/, replacement: path.resolve(__dirname, 'src/helper') },
      { find: /^hooks\//, replacement: path.resolve(__dirname, 'src/hooks') + '/' },
      { find: /^pages\//, replacement: path.resolve(__dirname, 'src/pages') + '/' },
      { find: /^redux\//, replacement: path.resolve(__dirname, 'src/redux') + '/' },
      { find: /^utils\//, replacement: path.resolve(__dirname, 'src/utils') + '/' },
      { find: /^features\//, replacement: path.resolve(__dirname, 'src/features') + '/' },
      { find: /^services\//, replacement: path.resolve(__dirname, 'src/services') + '/' },
      { find: /^shared\//, replacement: path.resolve(__dirname, 'src/shared') + '/' },
      { find: /^types\//, replacement: path.resolve(__dirname, 'src/types') + '/' },
    ],
  },
  server: {
    host: true,
    strictPort: false,
    allowedHosts: true,
    port: 8888,
    proxy: {
      '/apis': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
