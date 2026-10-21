import { CheckCircle2, ChevronDown, Gift, ShoppingBag, Trash2, Truck, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { BRINDE_TEXTO, CEIAS, ENTREGA_TEXTO, EXTRAS, PRAZO_PEDIDOS_ISO, PRAZO_PEDIDOS_TEXTO, WHATSAPP_NUMERO, miniatura } from '../data/menuData.ts';
import { useBloqueioRolagem } from '../hooks/useBloqueioRolagem.ts';
import type { AcaoCarrinho } from '../lib/carrinho.ts';
import { formatarBRL } from '../lib/formato.ts';
import {
  capacidadePedido,
  linkWhatsApp,
  montarMensagem,
  pedidosAbertos,
  resumirPedido,
  validarCliente,
  type DadosCliente,
  type ErrosCliente,
} from '../lib/pedido.ts';
import type { ItemCarrinho } from '../types.ts';
import { ExtrasSelector } from './ExtrasSelector.tsx';
import { WhatsAppIcon } from './ui/BrandIcons.tsx';
import { SUAVE } from './ui/Reveal.tsx';

const CATALOGO = { ceias: CEIAS, extras: EXTRAS };
const VAZIO: DadosCliente = { nome: '', endereco: '', observacoes: '' };
const FOCAVEIS = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

const hojeLocal = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type Props = {
  aberto: boolean;
  itens: readonly ItemCarrinho[];
  despachar: (acao: AcaoCarrinho) => void;
  onFechar: () => void;
};

export function OrderDrawer({ aberto, itens, despachar, onFechar }: Props) {
  // O formulário vive aqui (fora do painel animado) para não se perder ao fechar e reabrir.
  const [dados, setDados] = useState<DadosCliente>(VAZIO);
  const [enviado, setEnviado] = useState(false);
  const painel = useRef<HTMLElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  useBloqueioRolagem(aberto);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    fechar.current?.focus();
    const tecla = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onFechar();
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener('keydown', tecla);
      anterior?.focus?.();
    };
  }, [aberto, onFechar]);

  useEffect(() => {
    if (itens.length > 0) setEnviado(false);
  }, [itens.length]);

  // Mantém o Tab dentro do painel enquanto ele está aberto.
  const prenderFoco = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab' || !painel.current) return;
    const focaveis = [...painel.current.querySelectorAll<HTMLElement>(FOCAVEIS)];
    if (focaveis.length === 0) return;
    const [primeiro, ultimo] = [focaveis[0], focaveis[focaveis.length - 1]];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  };

  const aoEnviar = () => {
    setEnviado(true);
    despachar({ tipo: 'limpar' });
  };

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="fixed inset-0 z-[75]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label="Fechar pedido" onClick={onFechar} className="absolute inset-0 bg-tinta/60 backdrop-blur-sm" />
          <motion.aside
            ref={painel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-pedido"
            onKeyDown={prenderFoco}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: SUAVE }}
            className="rolagem-fina absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-carrara shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-linho bg-carrara/95 px-6 py-5 backdrop-blur">
              <h2 id="titulo-pedido" className="flex items-center gap-2 font-display text-3xl font-semibold text-tinta">
                <ShoppingBag className="size-5 text-ouro-escuro" aria-hidden="true" /> Seu pedido
              </h2>
              <button ref={fechar} type="button" onClick={onFechar} aria-label="Fechar" className="grid size-10 place-items-center rounded-full hover:bg-marmore">
                <X className="size-5" />
              </button>
            </header>
            {enviado && itens.length === 0 ? (
              <Enviado onFechar={onFechar} />
            ) : itens.length === 0 ? (
              <Vazio onFechar={onFechar} />
            ) : (
              <Conteudo itens={itens} despachar={despachar} dados={dados} setDados={setDados} onEnviado={aoEnviar} />
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Vazio({ onFechar }: { onFechar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <p className="font-script text-5xl text-ouro-escuro">Mesa vazia</p>
      <p className="text-sm text-pedra">Escolha uma das três ceias e acrescente os adicionais para montar o seu pedido.</p>
      <a href="#ceias" onClick={onFechar} className="mt-2 rounded-full bg-tinta px-6 py-3 text-sm font-semibold text-carrara">
        Ver ceias
      </a>
    </div>
  );
}

function Enviado({ onFechar }: { onFechar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center" role="status">
      <CheckCircle2 className="size-12 text-oliva" aria-hidden="true" />
      <p className="font-display text-3xl font-semibold text-tinta">Pedido enviado!</p>
      <p className="text-sm text-pedra">
        Abrimos o WhatsApp com o seu pedido completo. É só tocar em enviar por lá: o Chef Carlos responde para confirmar a data e a entrega.
      </p>
      <button type="button" onClick={onFechar} className="mt-2 rounded-full bg-tinta px-6 py-3 text-sm font-semibold text-carrara">
        Voltar ao site
      </button>
    </div>
  );
}

type ConteudoProps = {
  itens: readonly ItemCarrinho[];
  despachar: Props['despachar'];
  dados: DadosCliente;
  setDados: (atualizar: (d: DadosCliente) => DadosCliente) => void;
  onEnviado: () => void;
};

function Conteudo({ itens, despachar, dados, setDados, onEnviado }: ConteudoProps) {
  const [erros, setErros] = useState<ErrosCliente>({});
  const [expandido, setExpandido] = useState<string | null>(null);
  const resumo = resumirPedido(itens, CATALOGO);
  const capacidade = capacidadePedido(itens, CEIAS);
  const abertos = pedidosAbertos(hojeLocal(), PRAZO_PEDIDOS_ISO);

  const campo = (chave: keyof DadosCliente) => ({
    id: `pedido-${chave}`,
    value: dados[chave],
    'aria-invalid': Boolean(erros[chave]),
    'aria-describedby': erros[chave] ? `erro-${chave}` : undefined,
    onChange: (e: { target: { value: string } }) => setDados((d) => ({ ...d, [chave]: e.target.value })),
  });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!abertos) return;
    const encontrados = validarCliente(dados);
    setErros(encontrados);
    const primeiroErro = Object.keys(encontrados)[0];
    if (primeiroErro) {
      document.getElementById(`pedido-${primeiroErro}`)?.focus();
      return;
    }
    window.open(linkWhatsApp(WHATSAPP_NUMERO, montarMensagem(resumo, dados, { entrega: ENTREGA_TEXTO, brinde: BRINDE_TEXTO })), '_blank', 'noopener,noreferrer');
    onEnviado();
  };

  return (
    <div className="flex flex-1 flex-col">
      <ul className="divide-y divide-linho px-6">
        {itens.map((item) => {
          const ceia = CEIAS.find((c) => c.id === item.ceiaId);
          if (!ceia) return null;
          const qtdExtras = Object.values(item.extras).reduce((s, q) => s + q, 0);
          const aberto = expandido === item.uid;
          return (
            <li key={item.uid} className="py-4">
              <div className="flex items-start gap-4">
                <img src={miniatura(ceia.fotos[0].nome)} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-tinta">{ceia.nome}</p>
                  <p className="font-display text-xl font-semibold text-ouro-escuro">{formatarBRL(ceia.preco)}</p>
                  <button
                    type="button"
                    onClick={() => setExpandido(aberto ? null : item.uid)}
                    aria-expanded={aberto}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-grafite hover:text-tinta"
                  >
                    {qtdExtras > 0 ? `${qtdExtras} adicional(is)` : 'Adicionar adicionais'}
                    <ChevronDown className={`size-3.5 transition ${aberto ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => despachar({ tipo: 'remover', uid: item.uid })}
                  aria-label={`Remover ${ceia.nome}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-pedra transition hover:bg-marmore hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <AnimatePresence initial={false}>
                {aberto && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 rounded-2xl border border-linho bg-white px-4">
                      <ExtrasSelector
                        extras={EXTRAS}
                        valores={item.extras}
                        onAlterar={(extraId, quantidade) => despachar({ tipo: 'definirExtra', uid: item.uid, extraId, quantidade })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="mx-6 mt-2 rounded-2xl bg-tinta p-5 text-carrara">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-carrara/70">Total</p>
          <p className="font-display text-3xl font-semibold text-ouro">{formatarBRL(resumo.total)}</p>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-carrara/60">
          <Users className="size-3.5" aria-hidden="true" /> Este pedido serve até {capacidade} pessoas.
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-ouro">
          <Gift className="size-3.5" aria-hidden="true" /> Brinde: {BRINDE_TEXTO}
        </p>
        {resumo.temValorACombinar && <p className="mt-1 text-xs text-carrara/60">Adicionais sem preço na tabela: valor combinado no WhatsApp.</p>}
      </div>

      <form onSubmit={enviar} noValidate className="space-y-4 px-6 py-6">
        <div className="flex gap-3 rounded-2xl border border-ouro/40 bg-white p-4">
          <Truck className="mt-0.5 size-5 shrink-0 text-ouro-escuro" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-tinta">Entrega no dia {ENTREGA_TEXTO}</p>
            <p className="mt-0.5 text-pedra">{PRAZO_PEDIDOS_TEXTO}.</p>
          </div>
        </div>
        <p className="font-display text-2xl font-semibold text-tinta">Seus dados</p>
        <Campo rotulo="Seu nome" erro={erros.nome} chave="nome">
          <input {...campo('nome')} autoComplete="name" maxLength={80} className={estiloCampo} />
        </Campo>
        <Campo rotulo="Endereço de entrega" erro={erros.endereco} chave="endereco">
          <textarea {...campo('endereco')} autoComplete="street-address" rows={2} maxLength={200} className={estiloCampo} />
        </Campo>
        <Campo rotulo="Observações (opcional)" erro={erros.observacoes} chave="observacoes">
          <textarea {...campo('observacoes')} rows={2} maxLength={500} placeholder="Restrições alimentares, ponto de referência…" className={estiloCampo} />
        </Campo>
        {!abertos && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            As encomendas da ceia foram encerradas ({PRAZO_PEDIDOS_TEXTO.toLowerCase()}).
          </p>
        )}
        <button
          type="submit"
          disabled={!abertos}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <WhatsAppIcon className="size-5" /> Enviar pedido pelo WhatsApp
        </button>
        <button
          type="button"
          onClick={() => despachar({ tipo: 'limpar' })}
          className="w-full text-center text-xs font-semibold text-pedra underline-offset-4 hover:text-tinta hover:underline"
        >
          Esvaziar pedido
        </button>
      </form>
    </div>
  );
}

const estiloCampo =
  'w-full rounded-xl border border-linho bg-white px-4 py-3 text-sm text-tinta outline-none transition placeholder:text-pedra/60 focus:border-ouro-escuro focus:ring-2 focus:ring-ouro/25 aria-[invalid=true]:border-red-700';

function Campo({ rotulo, erro, chave, children }: { rotulo: string; erro?: string; chave: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`pedido-${chave}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-grafite">
        {rotulo}
      </label>
      {children}
      {erro && (
        <p id={`erro-${chave}`} className="mt-1 text-xs font-medium text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}
