import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  root: '.', // Ensure Vite uses Frontend as root
  publicDir: 'public', // Optional: if you have a public folder
});