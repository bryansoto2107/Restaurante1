import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Esto permite que el servidor sea accesible desde la red local
    port: 5173,     // Asegúrate de que sea el puerto correcto, si es diferente
    // open: true, // Puedes dejarlo si quieres que se abra automáticamente en el navegador
  },
});