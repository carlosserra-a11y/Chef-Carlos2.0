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

// Na Netlify a política também vai como cabeçalho HTTP de verdade (arquivo _headers; o GitHub Pages o ignora).
// Lá dá para impedir que outro site mostre este dentro de um iframe (frame-ancestors e X-Frame-Options).
const CABECALHOS_NETLIFY = `/*
  Content-Security-Policy: ${POLITICA_DE_SEGURANCA}; frame-ancestors 'none'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
`;

function politicaDeSeguranca(): Plugin {
  return {
    name: 'politica-de-seguranca',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: POLITICA_DE_SEGURANCA }, injectTo: 'head-prepend' },
    ],
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '_headers', source: CABECALHOS_NETLIFY });
    },
  };
}

// Caminho público do site: "/" localmente e na Netlify; o workflow do GitHub Pages
// define BASE_PATH=/<nome-do-repo>/ para a versão publicada lá.
const BASE = process.env.BASE_PATH || '/';
// Endereço completo exigido pelas prévias de link (WhatsApp, Instagram, Facebook): na Netlify vem da
// variável URL que ela define no build; no GitHub Pages, do endereço da conta + BASE_PATH.
const URL_DO_SITE = process.env.URL ? `${process.env.URL.replace(/\/$/, '')}/` : `https://carlosserra-a11y.github.io${BASE}`;

function enderecoDoSite(): Plugin {
  return {
    name: 'endereco-do-site',
    transformIndexHtml: (html) => html.replaceAll('__URL_DO_SITE__', URL_DO_SITE),
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), politicaDeSeguranca(), enderecoDoSite()],
  // Nunca embute arquivos como data: (a política acima só aceita arquivos servidos pelo próprio site).
  build: { assetsInlineLimit: 0 },
});
