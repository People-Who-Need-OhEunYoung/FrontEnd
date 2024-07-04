import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/problem': {
        target: 'https://www.acmicpc.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/problem/, '/problem'),
      },
    },
  },
});
