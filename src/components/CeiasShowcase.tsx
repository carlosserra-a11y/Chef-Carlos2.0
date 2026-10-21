import { Check, Gift, Images, LayoutGrid, ShoppingBag, Truck, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { BRINDE_TEXTO, CEIAS, ENTREGA_TEXTO, EXTRAS, PRAZO_PEDIDOS_TEXTO, WHATSAPP_NUMERO, foto, miniatura } from '../data/menuData.ts';
import { comExtra } from '../lib/carrinho.ts';
import { formatarBRL } from '../lib/formato.ts';
import { linkWhatsApp, valorExtras } from '../lib/pedido.ts';
import type { Ceia, CeiaId } from '../types.ts';
import { CeiaIllustration } from './CeiaIllustration.tsx';
import { ExtrasSelector } from './ExtrasSelector.tsx';
import { WhatsAppIcon } from './ui/BrandIcons.tsx';
import { Reveal, SUAVE } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

type Props = {
  selecionada: CeiaId;
  onSelecionar: (id: CeiaId) => void;
  onAdicionar: (id: CeiaId, extras: Record<string, number>) => void;
};

export function CeiasShowcase({ selecionada, onSelecionar, onAdicionar }: Props) {
  const ceia = CEIAS.find((c) => c.id === selecionada) ?? CEIAS[0];
  const abas = useRef<(HTMLButtonElement | null)[]>([]);

  // Navegação de abas pelo teclado (setas, Home, End), como espera o padrão ARIA.
  const teclado = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const destinos: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CEIAS.length - 1 };
    if (!(e.key in destinos)) return;
    e.preventDefault();
    const alvo = (destinos[e.key] + CEIAS.length) % CEIAS.length;
    onSelecionar(CEIAS[alvo].id);
    abas.current[alvo]?.focus();
  };

  return (
    <section id="ceias" aria-labelledby="titulo-ceias" className="relative overflow-hidden bg-tinta py-24 text-carrara md:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-ouro/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          id="titulo-ceias"
          escuro
          selo="Natal 2026 · valores oficiais"
          titulo={<>As três ceias <span className="italic text-ouro">do Chef</span></>}
          descricao="Escolha o tamanho da sua mesa, acrescente adicionais e envie o pedido completo direto para o WhatsApp do Chef."
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-ouro/50 bg-ouro/10 px-4 py-2 text-xs font-semibold text-carrara">
            <Truck className="size-4 text-ouro" aria-hidden="true" /> {PRAZO_PEDIDOS_TEXTO} · entrega no dia {ENTREGA_TEXTO}
          </p>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-carrara/75">
            <Users className="size-4 text-ouro" aria-hidden="true" /> Cada ceia atende até 12 pessoas. Para mais convidados, adicione outra ceia ao pedido.
          </p>
        </div>

        <div role="tablist" aria-label="Tamanho da ceia" className="mt-10 grid gap-4 md:grid-cols-3">
          {CEIAS.map((c, i) => (
            <Reveal key={c.id} atraso={i * 0.1}>
              <CartaoCeia
                ceia={c}
                ativa={c.id === selecionada}
                onClick={() => onSelecionar(c.id)}
                onKeyDown={(e) => teclado(e, i)}
                refBotao={(el) => {
                  abas.current[i] = el;
                }}
              />
            </Reveal>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={ceia.id}
            id={`painel-${ceia.id}`}
            role="tabpanel"
            aria-labelledby={`aba-${ceia.id}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: SUAVE }}
            className="mt-8"
          >
            <PainelCeia ceia={ceia} onAdicionar={onAdicionar} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

type CartaoProps = {
  ceia: Ceia;
  ativa: boolean;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  refBotao: (el: HTMLButtonElement | null) => void;
};

function CartaoCeia({ ceia, ativa, onClick, onKeyDown, refBotao }: CartaoProps) {
  return (
    <button
      ref={refBotao}
      id={`aba-${ceia.id}`}
      type="button"
      role="tab"
      aria-selected={ativa}
      aria-controls={`painel-${ceia.id}`}
      tabIndex={ativa ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`group relative w-full overflow-hidden rounded-3xl border text-left transition duration-300 ${
        ativa ? 'border-ouro bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]'
      }`}
    >
      {ativa && <motion.span layoutId="ceia-ativa" className="absolute inset-x-0 top-0 z-10 h-1 bg-ouro" />}
      <div className="relative h-36 overflow-hidden">
        <img src={miniatura(ceia.fotos[0].nome)} alt="" loading="lazy" className="size-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
        <span className="absolute inset-0 bg-gradient-to-t from-tinta to-transparent" aria-hidden="true" />
        {ceia.destaque && (
          <span className="absolute right-4 top-4 rounded-full bg-ouro px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-tinta">
            {ceia.destaque}
          </span>
        )}
      </div>
      <div className="p-6 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-carrara/60">{ceia.pessoas}</p>
        <p className="mt-2 font-display text-3xl font-semibold leading-tight">{ceia.nome}</p>
        <p className="mt-2 font-display text-4xl font-semibold text-ouro">{formatarBRL(ceia.preco)}</p>
        <p className="mt-3 text-sm leading-relaxed text-carrara/65">{ceia.resumo}</p>
      </div>
    </button>
  );
}

function PainelCeia({ ceia, onAdicionar }: { ceia: Ceia; onAdicionar: Props['onAdicionar'] }) {
  const [extras, setExtras] = useState<Record<string, number>>({});
  const [visao, setVisao] = useState<'fotos' | 'composicao'>('fotos');
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const totalExtras = Object.values(extras).reduce((s, q) => s + q, 0);
  const valorAdicionais = valorExtras(extras, EXTRAS);
  const total = ceia.preco + valorAdicionais;
  const atual = ceia.fotos[fotoAtiva] ?? ceia.fotos[0];
  const mensagem = `Olá, Chef Carlos! Tenho interesse na ${ceia.nome} (${formatarBRL(ceia.preco)}). Pode me passar as datas disponíveis?`;

  const adicionar = () => {
    onAdicionar(ceia.id, extras);
    setExtras({});
  };

  return (
    <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 md:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10 lg:p-10 [&>*]:min-w-0">
      <div>
        <div role="group" aria-label="Modo de visualização" className="mb-4 inline-flex rounded-full border border-white/15 p-1">
          {[
            { id: 'fotos' as const, rotulo: 'Fotos', Icone: Images },
            { id: 'composicao' as const, rotulo: 'Composição da mesa', Icone: LayoutGrid },
          ].map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              type="button"
              aria-pressed={visao === id}
              onClick={() => setVisao(id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                visao === id ? 'bg-ouro text-tinta' : 'text-carrara/70 hover:text-carrara'
              }`}
            >
              <Icone className="size-3.5" aria-hidden="true" /> {rotulo}
            </button>
          ))}
        </div>

        {visao === 'fotos' ? (
          <div>
            <figure className="overflow-hidden rounded-3xl bg-black/30">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={atual.nome}
                    src={foto(atual.nome)}
                    alt={`${ceia.nome}: ${atual.legenda}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-carrara/90">
                <span>{atual.legenda}</span>
                {atual.ilustrativa && (
                  <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider backdrop-blur">
                    Imagem ilustrativa
                  </span>
                )}
              </figcaption>
            </figure>
            {ceia.fotos.length > 1 && (
              <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {ceia.fotos.map((f, i) => (
                  <li key={`${f.nome}-${i}`}>
                    <button
                      type="button"
                      onClick={() => setFotoAtiva(i)}
                      aria-pressed={i === fotoAtiva}
                      aria-label={`Ver foto: ${f.legenda}`}
                      className={`block w-full overflow-hidden rounded-xl border-2 transition ${i === fotoAtiva ? 'border-ouro' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={miniatura(f.nome)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <div className="overflow-hidden rounded-3xl bg-carrara p-2 shadow-2xl">
              <CeiaIllustration ceia={ceia} />
            </div>
            <p className="mt-3 text-xs text-carrara/55">
              Mesa vista de cima: cada peça corresponde a um item da ceia, na quantidade e proporção servidas.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-carrara/55">{ceia.pessoas}</p>
        <h3 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{ceia.nome}</h3>
        <div className="mt-6 space-y-5">
          {ceia.cardapio.map((grupo) => (
            <div key={grupo.titulo}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ouro">{grupo.titulo}</p>
              <ul className="mt-2 space-y-2">
                {grupo.itens.map((item) => (
                  <li key={item.nome} className="flex items-start gap-3 text-carrara/85">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ouro/20 text-ouro">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                      <span>{item.nome}</span>
                      {item.quantidade && <span className="text-xs text-carrara/55">{item.quantidade}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-2xl font-semibold">Adicionais</p>
            <p className="text-xs text-carrara/55">{totalExtras > 0 ? `${totalExtras} selecionado(s)` : 'opcional'}</p>
          </div>
          <div className="rolagem-fina mt-2 max-h-64 overflow-y-auto pr-2">
            <ExtrasSelector extras={EXTRAS} valores={extras} onAlterar={(id, q) => setExtras((atual) => comExtra(atual, id, q))} escuro />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
          <div aria-live="polite">
            <p className="text-xs uppercase tracking-[0.2em] text-carrara/55">{totalExtras > 0 ? 'Total com adicionais' : 'Valor da ceia'}</p>
            <motion.p
              key={total}
              initial={{ opacity: 0.5, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: SUAVE }}
              className="origin-left font-display text-5xl font-semibold text-ouro"
            >
              {formatarBRL(total)}
            </motion.p>
            {totalExtras > 0 && (
              <p className="mt-1 text-xs text-carrara/60">
                Ceia {formatarBRL(ceia.preco)} + adicionais {formatarBRL(valorAdicionais)}
              </p>
            )}
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-ouro">
              <Gift className="size-3.5" aria-hidden="true" /> Brinde: {BRINDE_TEXTO}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={linkWhatsApp(WHATSAPP_NUMERO, mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm font-semibold transition hover:border-whatsapp hover:text-[#4fd389]"
            >
              <WhatsAppIcon className="size-4" /> Tirar dúvidas
            </a>
            <button
              type="button"
              onClick={adicionar}
              className="inline-flex items-center gap-2 rounded-full bg-ouro px-6 py-3.5 text-sm font-bold text-tinta transition hover:-translate-y-0.5 hover:bg-[#c7a46c] active:translate-y-0"
            >
              <ShoppingBag className="size-4" aria-hidden="true" /> Encomendar ceia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
