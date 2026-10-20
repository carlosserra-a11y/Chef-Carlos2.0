import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useBloqueioRolagem } from '../hooks/useBloqueioRolagem.ts';
import { SUAVE } from './ui/Reveal.tsx';

const DURACAO_MS = 4200;
const DURACAO_REDUZIDA_MS = 1400;

type Props = { onConcluir: () => void };

/**
 * Abertura do site: "Chef Carlos" escrito à mão (traço dourado que se desenha e
 * depois ganha preenchimento), filete e subtítulo; ao final a cortina se abre.
 */
export function Intro({ onConcluir }: Props) {
  const reduzir = useReducedMotion();
  const [fonteOk, setFonteOk] = useState(false);
  useBloqueioRolagem(true);

  useEffect(() => {
    let ativo = true;
    const limite = new Promise((r) => setTimeout(r, 1200));
    Promise.race([document.fonts?.load('120px "Great Vibes"') ?? Promise.resolve(), limite]).finally(() => {
      if (ativo) setFonteOk(true);
    });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!fonteOk) return;
    const id = window.setTimeout(onConcluir, reduzir ? DURACAO_REDUZIDA_MS : DURACAO_MS);
    const tecla = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && onConcluir();
    window.addEventListener('keydown', tecla);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', tecla);
    };
  }, [fonteOk, reduzir, onConcluir]);

  const tracar = reduzir
    ? { initial: { strokeDashoffset: 0, fillOpacity: 1 }, animate: { strokeDashoffset: 0, fillOpacity: 1 } }
    : {
        initial: { strokeDashoffset: 1400, fillOpacity: 0 },
        animate: { strokeDashoffset: 0, fillOpacity: 1 },
        transition: {
          strokeDashoffset: { duration: 2.4, ease: 'easeInOut' as const },
          fillOpacity: { duration: 0.9, delay: 1.9 },
        },
      };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Abertura: Chef Carlos"
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-tinta text-carrara"
      exit={reduzir ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 1, ease: SUAVE }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(176_141_87/0.22),transparent_60%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:var(--textura-marmore)] bg-cover" aria-hidden="true" />

      {fonteOk && (
        <div className="relative flex w-full max-w-4xl flex-col items-center px-6">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.6em' }}
            transition={{ duration: 1.4, ease: SUAVE }}
            className="text-[0.65rem] font-semibold uppercase text-ouro sm:text-xs"
          >
            Ceia de Natal 2026
          </motion.p>
          <svg viewBox="0 0 900 260" className="mt-2 w-full" aria-hidden="true">
            <motion.text
              x="450"
              y="175"
              textAnchor="middle"
              className="font-script"
              fontSize="170"
              fill="#f8f6f2"
              stroke="#d6b77f"
              strokeWidth="1.6"
              strokeDasharray="1400"
              {...tracar}
            >
              Chef Carlos
            </motion.text>
          </svg>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: reduzir ? 0 : 2.1, ease: SUAVE }}
            className="filete -mt-2 w-48 origin-center sm:w-72"
            aria-hidden="true"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: reduzir ? 0 : 2.5 }}
            className="mt-5 text-xs font-semibold uppercase tracking-[0.5em] text-carrara/70"
          >
            Jr · Gastronomia
          </motion.p>
        </div>
      )}

      <button
        type="button"
        onClick={onConcluir}
        className="absolute bottom-6 right-6 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-carrara/70 transition hover:border-ouro hover:text-ouro"
      >
        Pular intro
      </button>
    </motion.div>
  );
}
