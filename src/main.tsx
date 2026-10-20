import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TEXTURA_MARMORE } from './data/menuData.ts';
import './index.css';

document.documentElement.style.setProperty('--textura-marmore', `url("${TEXTURA_MARMORE}")`);

const raiz = document.getElementById('root');
if (!raiz) throw new Error('Elemento #root não encontrado no index.html');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
