import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Caminho público do site: "/" localmente; o workflow do GitHub Pages
  // define BASE_PATH=/<nome-do-repo>/ para a versão publicada.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
});
