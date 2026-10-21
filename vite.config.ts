import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { CONTADOR_ORIGEM } from './src/data/contador.ts';

// Política de segurança (CSP) do site publicado: só carrega o que é do próprio site, conversa só com o
// contador de clientes (src/data/contador.ts, o mesmo endereço que o site usa) e o Trusted Types
// bloqueia injeção de HTML. Vai numa <meta> porque o GitHub Pages não deixa enviar cabeçalhos próprios,
// e só no build: no dev o Vite precisa de scripts inline para o recarregamento automático.
const POLITICA_DE_SEGURANCA = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  `connect-src ${CONTADOR_ORIGEM}`,
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
  "require-trusted-types-for 'script'",
  "trusted-types 'none'",
  'upgrade-insecure-requests',
].join('; ');

function politicaDeSeguranca(): Plugin {
  return {
    name: 'politica-de-seguranca',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: POLITICA_DE_SEGURANCA }, injectTo: 'head-prepend' },
    ],
  };
}

export default defineConfig({
  // Caminho público do site: "/" localmente; o workflow do GitHub Pages
  // define BASE_PATH=/<nome-do-repo>/ para a versão publicada.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), politicaDeSeguranca()],
  // Nunca embute arquivos como data: (a política acima só aceita arquivos servidos pelo próprio site).
  build: { assetsInlineLimit: 0 },
});
