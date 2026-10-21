import { ArrowDown, Sparkles } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { CEIAS, INSTAGRAM_URL, INSTAGRAM_USUARIO, WHATSAPP_NUMERO, foto } from '../data/menuData.ts';
import { formatarBRL } from '../lib/formato.ts';
import { linkWhatsApp } from '../lib/pedido.ts';
import type { CeiaId } from '../types.ts';
import { InstagramIcon, WhatsAppIcon } from './ui/BrandIcons.tsx';
import { SUAVE } from './ui/Reveal.tsx';

const MENSAGEM_HERO = 'Olá, Chef Carlos! Vim pelo site e quero saber mais sobre a ceia de Natal.';
const MENOR_PRECO = Math.min(...CEIAS.map((c) => c.preco));

type Props = {
  /** Só anima a entrada depois que a intro termina. */
  iniciar: boolean;
  onEscolherCeia: (id: CeiaId) => void;
};

function SeloNatal() {
  return (
    <>
      <p className="font-script text-3xl leading-none text-ouro-escuro">Natal 2026</p>
      <p className="mt-1 text-sm font-semibold text-tinta">Entrega 24/12, a partir das 12h</p>
      <p className="mt-1 text-xs text-pedra">Pedidos até 20/12 · a partir de {formatarBRL(MENOR_PRECO)}</p>
    </>
  );
}

export function Hero({ iniciar, onEscolherCeia }: Props) {
  const secao = useRef<HTMLElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: secao, offset: ['start start', 'end start'] });
  const mover = (px: number) => (reduzir ? [0, 0] : [0, px]);
  const yFundo = useTransform(scrollYProgress, [0, 1], mover(220));
  const yTexto = useTransform(scrollYProgress, [0, 1], mover(-60));
  const yRetrato = useTransform(scrollYProgress, [0, 1], mover(-120));
  const yCartao = useTransform(scrollYProgress, [0, 1], mover(-240));
  const ySelo = useTransform(scrollYProgress, [0, 1], mover(-170));
  const opacidade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const entrada = (atraso: number) => ({
    initial: reduzir ? false : { opacity: 0, y: 40 },
    animate: iniciar ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, delay: atraso, ease: SUAVE },
  });

  return (
    <section ref={secao} id="inicio" aria-labelledby="titulo-hero" className="relative isolate min-h-[100svh] overflow-hidden">
      <motion.div style={{ y: yFundo }} className="absolute inset-0 -z-20 scale-110" aria-hidden="true">
        <img src={foto('IMG_6247')} alt="" width={1600} height={1200} fetchPriority="high" className="size-full object-cover opacity-45 blur-[1.5px] saturate-[0.85]" />
      </motion.div>
      <div className="fundo-marmore absolute inset-0 -z-10 opacity-[0.86]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgb(248_246_242/0.6)_55%,rgb(248_246_242)_100%)]" aria-hidden="true" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        <motion.div style={{ y: yTexto, opacity: opacidade }} className="lg:col-span-7">
          <motion.p {...entrada(0.1)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-ouro/40 bg-white/60 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro sm:text-xs sm:tracking-[0.28em]">
            <Sparkles className="size-3.5" aria-hidden="true" /> Ceia de Natal 2026 · encomendas abertas
          </motion.p>
          <motion.h1 {...entrada(0.25)} id="titulo-hero" className="font-display text-[clamp(2.9rem,1.4rem+5.6vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.01em] text-tinta">
            A sua Ceia de Natal
            <span className="mt-3 block font-script text-[0.72em] font-normal leading-[1.1] text-grafite">pelo Chef Carlos Jr</span>
          </motion.h1>
          <motion.p {...entrada(0.4)} className="mt-7 max-w-xl text-base leading-relaxed text-grafite md:text-lg">
            Três tamanhos de ceia, até 12 pessoas cada, com o acabamento de alta gastronomia do Chef. Escolha a sua, acrescente
            adicionais e envie o pedido completo pelo WhatsApp.
          </motion.p>

          <motion.ul {...entrada(0.55)} className="mt-8 flex flex-wrap gap-2" aria-label="Ceias disponíveis">
            {CEIAS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onEscolherCeia(c.id)}
                  className="group rounded-2xl border border-linho bg-white/70 px-4 py-3 text-left backdrop-blur transition hover:-translate-y-0.5 hover:border-ouro hover:shadow-md"
                >
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-pedra">{c.pessoas}</span>
                  <span className="font-display text-2xl font-semibold text-tinta group-hover:text-ouro-escuro">{formatarBRL(c.preco)}</span>
                </button>
              </li>
            ))}
          </motion.ul>

          <motion.div {...entrada(0.7)} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#ceias" className="inline-flex items-center gap-2 rounded-full bg-tinta px-7 py-4 text-sm font-semibold text-carrara shadow-[0_18px_40px_-18px_rgb(29_27_24/0.8)] transition hover:-translate-y-0.5 hover:bg-grafite">
              Montar minha ceia
            </a>
            <a href={linkWhatsApp(WHATSAPP_NUMERO, MENSAGEM_HERO)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110">
              <WhatsAppIcon /> Falar no WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-4 py-4 text-sm font-semibold text-grafite underline-offset-4 transition hover:text-tinta hover:underline">
              <InstagramIcon /> {INSTAGRAM_USUARIO}
            </a>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <motion.figure style={{ y: yRetrato }} {...entrada(0.35)} className="relative">
            <div className="overflow-hidden rounded-[2.2rem] border-[10px] border-white shadow-[0_40px_80px_-30px_rgb(29_27_24/0.55)]">
              <img
                src={foto('CHEF_RETRATO')}
                alt="Chef Carlos Jr de dólmã branca, de braços cruzados"
                width={1280}
                height={1032}
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover object-[50%_35%]"
              />
            </div>
            <figcaption className="vidro absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-grafite">
              Chef Carlos Jr
            </figcaption>
          </motion.figure>
          {/* Telas maiores: foto com prato e selo flutuando nas laterais, longe do rosto. */}
          <motion.div style={{ y: yCartao }} {...entrada(0.7)} className="absolute -left-16 bottom-14 hidden w-52 rotate-[-6deg] overflow-hidden rounded-2xl border-[6px] border-white shadow-2xl sm:block">
            <img src={foto('CHEF_PRATO')} alt="Chef Carlos Jr apresentando um prato autoral" width={1302} height={1066} className="aspect-[4/5] w-full object-cover object-[50%_45%]" />
          </motion.div>
          <motion.div style={{ y: ySelo }} {...entrada(0.85)} className="vidro absolute -left-12 top-8 hidden max-w-[12rem] rounded-2xl p-4 shadow-xl sm:block">
            <SeloNatal />
          </motion.div>

          {/* Celular: os dois lado a lado, abaixo do retrato, sem cobrir o Chef. */}
          <motion.div {...entrada(0.6)} className="mt-10 grid grid-cols-2 gap-3 sm:hidden">
            <div className="overflow-hidden rounded-2xl border-4 border-white shadow-lg">
              <img src={foto('CHEF_PRATO')} alt="Chef Carlos Jr apresentando um prato autoral" width={1302} height={1066} className="aspect-[4/5] w-full object-cover object-[50%_45%]" />
            </div>
            <div className="vidro flex flex-col justify-center rounded-2xl p-4 shadow-lg">
              <SeloNatal />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#ceias"
        aria-label="Rolar para as ceias"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-pedra md:flex"
        animate={reduzir ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Conheça as ceias <ArrowDown className="size-4" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
