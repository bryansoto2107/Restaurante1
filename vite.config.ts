import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // host: '0.0.0.0', // ¡ELIMINA O COMENTA ESTA LÍNEA!
    port: 5173,
    // open: true,
  },
});