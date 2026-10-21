import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent as EventoPonteiro } from 'react';
import { LOGO_CLARA_URL } from '../data/menuData.ts';
import { useBloqueioRolagem } from '../hooks/useBloqueioRolagem.ts';
import { diasAte } from '../lib/datas.ts';
import { SUAVE } from './ui/Reveal.tsx';

const NATAL_ISO = '2026-12-24';
const DURACAO_MS = 10_000;
const DURACAO_REDUZIDA_MS = 2_500;
const DOURADO = '232, 200, 130';

type Props = { onConcluir: () => void };

/**
 * Abertura do site em verde-pinheiro e dourado: a assinatura oficial do Chef é
 * "escrita" da esquerda para a direita com brilho dourado, neve dourada reage ao
 * dedo/mouse (e solta faíscas ao tocar), a logo inclina em 3D e há contagem
 * regressiva para o Natal. Entra no site pelo botão, pela tecla Enter ou sozinha.
 */
export function Intro({ onConcluir }: Props) {
  const reduzir = useReducedMotion() ?? false;
  const [pronto, setPronto] = useState(false);
  useBloqueioRolagem(true);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const giroY = useSpring(useTransform(px, [-1, 1], [-12, 12]), { stiffness: 140, damping: 16 });
  const giroX = useSpring(useTransform(py, [-1, 1], [10, -10]), { stiffness: 140, damping: 16 });

  const dias = diasAte(NATAL_ISO, new Date());
  const contador = useMotionValue(0);
  const contadorInteiro = useTransform(contador, (v) => Math.round(v));

  useEffect(() => {
    let ativo = true;
    const espera = new Promise((r) => setTimeout(r, 900));
    const imagem = new Promise((r) => {
      const img = new Image();
      img.onload = img.onerror = r;
      img.src = LOGO_CLARA_URL;
    });
    Promise.race([Promise.all([imagem, document.fonts?.ready]), espera]).finally(() => ativo && setPronto(true));
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    const id = window.setTimeout(onConcluir, reduzir ? DURACAO_REDUZIDA_MS : DURACAO_MS);
    const tecla = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && onConcluir();
    window.addEventListener('keydown', tecla);
    const conta = animate(contador, dias, { duration: reduzir ? 0 : 1.6, delay: reduzir ? 0 : 1.8, ease: 'easeOut' });
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', tecla);
      conta.stop();
    };
  }, [pronto, reduzir, onConcluir, contador, dias]);

  const inclinar = (e: EventoPonteiro<HTMLDivElement>) => {
    if (reduzir) return;
    px.set((e.clientX / window.innerWidth) * 2 - 1);
    py.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Abertura: Chef Carlos Jr, Ceia de Natal 2026"
      onPointerMove={inclinar}
      className="fixed inset-0 z-[100] grid touch-none place-items-center overflow-hidden text-[#f3e3bf]"
      style={{ background: 'radial-gradient(ellipse at 50% 42%, #1f5039 0%, #0f2c20 48%, #06150f 100%)' }}
      initial={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={reduzir ? { opacity: 0 } : { clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 0.9, ease: SUAVE }}
    >
      <NeveDourada estatica={reduzir} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(232_200_130/0.18),transparent_55%)]" aria-hidden="true" />

      {pronto && (
        <div className="pointer-events-none relative flex w-full max-w-3xl flex-col items-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.55em' }}
            transition={{ duration: 1.4, ease: SUAVE }}
            className="text-[0.65rem] font-semibold uppercase text-[#e8c882] sm:text-xs"
          >
            Ceia de Natal · 2026
          </motion.p>

          <motion.div
            style={{ rotateX: giroX, rotateY: giroY, transformPerspective: 900 }}
            className="relative mt-6 w-[min(84vw,620px)]"
          >
            <motion.img
              src={LOGO_CLARA_URL}
              alt="Chef Carlos Jr Gastronomia"
              width={1448}
              height={700}
              initial={reduzir ? false : { clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 2.2, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
              className="w-full drop-shadow-[0_0_28px_rgba(232,200,130,0.35)]"
            />
            {!reduzir && (
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: `url(${LOGO_CLARA_URL})`,
                  maskImage: `url(${LOGO_CLARA_URL})`,
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  backgroundImage: 'linear-gradient(105deg, transparent 38%, rgba(255,226,160,0.95) 50%, transparent 62%)',
                  backgroundSize: '260% 100%',
                }}
                initial={{ backgroundPositionX: '160%' }}
                animate={{ backgroundPositionX: ['160%', '-60%'] }}
                transition={{ duration: 2.2, delay: 2.4, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
              />
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: reduzir ? 0 : 2.2 }}
            className="mt-8 font-display text-2xl italic text-[#f3e3bf]/90 sm:text-3xl"
          >
            {dias > 0 ? (
              <>
                {dias === 1 ? 'Falta ' : 'Faltam '}
                <motion.span className="not-italic font-semibold text-[#e8c882] tabular-nums">{contadorInteiro}</motion.span>
                {dias === 1 ? ' dia para o Natal' : ' dias para o Natal'}
              </>
            ) : (
              'Feliz Natal!'
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: reduzir ? 0 : 2.8 }}
            className="pointer-events-auto mt-9 flex flex-col items-center gap-4"
          >
            <motion.button
              type="button"
              onClick={onConcluir}
              autoFocus
              animate={
                reduzir
                  ? undefined
                  : { boxShadow: ['0 0 0 0 rgba(232,200,130,0.55)', '0 0 0 16px rgba(232,200,130,0)'] }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              className="rounded-full bg-gradient-to-r from-[#e8c882] to-[#b08d57] px-9 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#0f2c20] transition-transform hover:scale-[1.03] active:scale-95"
            >
              Entrar no cardápio
            </motion.button>
            <p className="text-xs text-[#f3e3bf]/55">Toque na tela para fazer a neve dourada brilhar ✦</p>
          </motion.div>
        </div>
      )}

      <button
        type="button"
        onClick={onConcluir}
        className="absolute right-5 top-5 rounded-full border border-[#e8c882]/30 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#f3e3bf]/70 transition hover:border-[#e8c882] hover:text-[#e8c882]"
      >
        Pular
      </button>
    </motion.div>
  );
}

type Particula = { x: number; y: number; r: number; vx: number; vy: number; alfa: number; fase: number; vida: number };

/** Neve dourada em canvas: desvia do ponteiro e solta faíscas onde a tela é tocada. */
function NeveDourada({ estatica }: { estatica: boolean }) {
  const tela = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = tela.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ponteiro = { x: -9999, y: -9999 };
    let largura = 0;
    let altura = 0;
    let quadro = 0;

    const redimensionar = () => {
      largura = canvas.clientWidth;
      altura = canvas.clientHeight;
      canvas.width = largura * dpr;
      canvas.height = altura * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    redimensionar();

    const floco = (): Particula => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      r: 0.6 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.3 + Math.random() * 0.9,
      alfa: 0.3 + Math.random() * 0.6,
      fase: Math.random() * Math.PI * 2,
      vida: 1,
    });
    const faisca = (x: number, y: number): Particula => {
      const angulo = Math.random() * Math.PI * 2;
      const velocidade = 1.5 + Math.random() * 3.5;
      return { x, y, r: 1 + Math.random() * 2.4, vx: Math.cos(angulo) * velocidade, vy: Math.sin(angulo) * velocidade, alfa: 1, fase: 0, vida: 1 };
    };

    const flocos = Array.from({ length: Math.min(160, Math.round((largura * altura) / 9000)) }, floco);
    let faiscas: Particula[] = [];

    const desenhar = (p: Particula, alfa: number) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOURADO}, ${alfa})`;
      ctx.shadowColor = `rgba(${DOURADO}, 0.9)`;
      ctx.shadowBlur = p.r > 1.6 ? p.r * 4 : 0;
      ctx.fill();
    };

    const passo = () => {
      ctx.clearRect(0, 0, largura, altura);
      for (const p of flocos) {
        p.fase += 0.012;
        p.x += p.vx + Math.sin(p.fase) * 0.35;
        p.y += p.vy;
        const dx = p.x - ponteiro.x;
        const dy = p.y - ponteiro.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12_100 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const forca = ((110 - d) / 110) * 3;
          p.x += (dx / d) * forca;
          p.y += (dy / d) * forca;
        }
        if (p.y > altura + 8) {
          p.y = -8;
          p.x = Math.random() * largura;
        }
        if (p.x < -8) p.x = largura + 8;
        if (p.x > largura + 8) p.x = -8;
        desenhar(p, p.alfa);
      }
      faiscas = faiscas.filter((p) => p.vida > 0);
      for (const p of faiscas) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.05;
        p.vida -= 0.018;
        desenhar(p, Math.max(0, p.vida));
      }
      quadro = requestAnimationFrame(passo);
    };

    const mover = (e: PointerEvent) => {
      const caixa = canvas.getBoundingClientRect();
      ponteiro.x = e.clientX - caixa.left;
      ponteiro.y = e.clientY - caixa.top;
    };
    const tocar = (e: PointerEvent) => {
      mover(e);
      faiscas = [...faiscas, ...Array.from({ length: 28 }, () => faisca(ponteiro.x, ponteiro.y))];
    };
    const afastar = () => {
      ponteiro.x = -9999;
      ponteiro.y = -9999;
    };

    window.addEventListener('resize', redimensionar);
    if (estatica) {
      flocos.forEach((p) => desenhar(p, p.alfa));
    } else {
      quadro = requestAnimationFrame(passo);
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerdown', tocar);
      document.addEventListener('pointerleave', afastar);
    }
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener('resize', redimensionar);
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerdown', tocar);
      document.removeEventListener('pointerleave', afastar);
    };
  }, [estatica]);

  return <canvas ref={tela} className="absolute inset-0 size-full" aria-hidden="true" />;
}
