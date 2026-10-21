// Fontes servidas pelo próprio site (sem Google Fonts: nenhum terceiro recebe o acesso do visitante).
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-600-italic.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/great-vibes/latin-400.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TEXTURA_MARMORE } from './data/menuData.ts';
import './index.css';

document.documentElement.style.setProperty('--textura-marmore', `url("${TEXTURA_MARMORE}")`);

const raiz = document.getElementById('root');
if (!raiz) throw new Error('Elemento #root não encontrado no index.html');

// O GitHub Pages não permite cabeçalhos anti-iframe (X-Frame-Options / frame-ancestors). Se outra página
// carregar o site dentro de um iframe (clickjacking), mostra só um link para abri-lo diretamente.
if (window.self !== window.top) {
  const link = document.createElement('a');
  link.href = window.location.href;
  link.target = '_top';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Abrir o site do Chef Carlos Jr';
  link.className = 'm-8 inline-block rounded-full bg-tinta px-6 py-3 text-sm font-semibold text-carrara';
  raiz.replaceChildren(link);
} else {
  createRoot(raiz).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
