import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { AvisoPrivacidade } from './components/AvisoPrivacidade.tsx';
import { BrindeBolsa } from './components/BrindeBolsa.tsx';
import { CeiasShowcase } from './components/CeiasShowcase.tsx';
import { ComoEncomendar } from './components/ComoEncomendar.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { Footer } from './components/Footer.tsx';
import { Hero } from './components/Hero.tsx';
import { Intro } from './components/Intro.tsx';
import { Navbar } from './components/Navbar.tsx';
import { OrderDrawer } from './components/OrderDrawer.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { CEIAS, EXTRAS } from './data/menuData.ts';
import { carrinhoReducer, sanitizarCarrinho } from './lib/carrinho.ts';
import { CHAVE_NUMERO_CLIENTE } from './lib/numeroCliente.ts';
import { aplicarEscolhaPrivacidade, armazenamentoLocal, lerEscolhaPrivacidade, type EscolhaPrivacidade } from './lib/privacidade.ts';
import type { CeiaId, ItemCarrinho } from './types.ts';

// Chave própria: o site 1.0 fica no mesmo domínio (carlosserra-a11y.github.io)
// e a chave antiga misturava os carrinhos dos dois sites.
const CHAVE_CARRINHO = 'chef-carlos-2:pedido';
const CHAVE_INTRO = 'chef-carlos-2:intro-vista';
const IDS_VALIDOS = { ceias: CEIAS.map((c) => c.id), extras: EXTRAS.map((e) => e.id) };

function lerArmazenamento(armazenamento: 'local' | 'sessao', chave: string): string | null {
  try {
    return (armazenamento === 'local' ? window.localStorage : window.sessionStorage).getItem(chave);
  } catch {
    return null;
  }
}

function gravarArmazenamento(armazenamento: 'local' | 'sessao', chave: string, valor: string): void {
  try {
    (armazenamento === 'local' ? window.localStorage : window.sessionStorage).setItem(chave, valor);
  } catch {
    // Navegação privada ou armazenamento bloqueado: segue só na memória.
  }
}

function carregarCarrinho(): ItemCarrinho[] {
  try {
    const salvo = lerArmazenamento('local', CHAVE_CARRINHO);
    return salvo ? sanitizarCarrinho(JSON.parse(salvo), IDS_VALIDOS) : [];
  } catch {
    return [];
  }
}

const novoId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function App() {
  const [itens, despachar] = useReducer(carrinhoReducer, undefined, carregarCarrinho);
  const [mostrarIntro, setMostrarIntro] = useState(() => lerArmazenamento('sessao', CHAVE_INTRO) !== '1');
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [ceiaSelecionada, setCeiaSelecionada] = useState<CeiaId>('ceia-6-8');
  const [aviso, setAviso] = useState<string | null>(null);
  // null = ainda não escolheu (mostra o aviso de cookies); "recusado" = não guarda nada no navegador.
  const [privacidade, setPrivacidade] = useState<EscolhaPrivacidade | null>(() => lerEscolhaPrivacidade(armazenamentoLocal()));

  useEffect(() => {
    if (privacidade !== 'recusado') gravarArmazenamento('local', CHAVE_CARRINHO, JSON.stringify(itens));
  }, [itens, privacidade]);

  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(null), 3800);
    return () => window.clearTimeout(id);
  }, [aviso]);

  const concluirIntro = useCallback(() => {
    gravarArmazenamento('sessao', CHAVE_INTRO, '1');
    setMostrarIntro(false);
  }, []);
  const escolherPrivacidade = (escolha: EscolhaPrivacidade) => {
    aplicarEscolhaPrivacidade(armazenamentoLocal(), escolha, [CHAVE_CARRINHO, CHAVE_NUMERO_CLIENTE]);
    setPrivacidade(escolha);
  };
  const abrirCarrinho = useCallback(() => setCarrinhoAberto(true), []);
  const fecharCarrinho = useCallback(() => setCarrinhoAberto(false), []);

  const adicionarCeia = (ceiaId: CeiaId, extras: Record<string, number>) => {
    despachar({ tipo: 'adicionar', itens: [{ uid: novoId(), ceiaId, extras }] });
    setAviso(`${CEIAS.find((c) => c.id === ceiaId)?.nome ?? 'Ceia'} adicionada ao pedido`);
  };

  return (
    <>
      <AnimatePresence>{mostrarIntro && <Intro onConcluir={concluirIntro} />}</AnimatePresence>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-carrara">
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <Navbar quantidade={itens.length} onAbrirCarrinho={abrirCarrinho} />
      <main id="conteudo">
        <Hero iniciar={!mostrarIntro} />
        <CeiasShowcase selecionada={ceiaSelecionada} onSelecionar={setCeiaSelecionada} onAdicionar={adicionarCeia} />
        <BrindeBolsa />
        <ComoEncomendar />
      </main>
      <Footer onPreferenciasPrivacidade={() => setPrivacidade(null)} />
      {/* O botão flutuante espera a escolha de cookies para não ficar por cima do aviso. */}
      {!carrinhoAberto && !mostrarIntro && privacidade !== null && <FloatingWhatsApp />}
      <AnimatePresence>
        {!mostrarIntro && privacidade === null && <AvisoPrivacidade onEscolher={escolherPrivacidade} />}
      </AnimatePresence>

      <OrderDrawer aberto={carrinhoAberto} itens={itens} despachar={despachar} onFechar={fecharCarrinho} />

      <AnimatePresence>
        {aviso && (
          <motion.div
            role="status"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-24 left-1/2 z-[85] flex w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-2xl bg-tinta px-5 py-4 text-sm text-carrara shadow-2xl sm:bottom-6"
          >
            <span>{aviso}</span>
            <button
              type="button"
              onClick={() => {
                setAviso(null);
                abrirCarrinho();
              }}
              className="shrink-0 font-semibold text-ouro hover:underline"
            >
              Ver pedido
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
