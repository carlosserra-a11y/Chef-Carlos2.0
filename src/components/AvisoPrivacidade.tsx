import { Cookie } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { EscolhaPrivacidade } from '../lib/privacidade.ts';
import { SUAVE } from './ui/Reveal.tsx';

type Props = { onEscolher: (escolha: EscolhaPrivacidade) => void };

/** Aviso de cookies e privacidade (LGPD): fica na parte de baixo da tela até o visitante aceitar ou recusar. */
export function AvisoPrivacidade({ onEscolher }: Props) {
  const reduzir = useReducedMotion();
  return (
    <motion.section
      aria-labelledby="titulo-privacidade"
      initial={reduzir ? false : { y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.5, ease: SUAVE }}
      className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-3xl border border-white/10 bg-tinta p-5 text-carrara shadow-2xl sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:gap-6 sm:p-6"
    >
      <div className="flex gap-3">
        <Cookie className="mt-1 size-6 shrink-0 text-ouro" aria-hidden="true" />
        <div>
          <h2 id="titulo-privacidade" className="font-display text-2xl font-semibold">
            Cookies e privacidade
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-carrara/75">
            Não usamos cookies de rastreamento nem de publicidade. O site só guarda no seu navegador o seu pedido e o seu
            número de cliente, para você não perder nada. Se recusar, nada fica guardado.
          </p>
        </div>
      </div>
      <div className="mt-4 flex shrink-0 gap-2 sm:mt-0 sm:flex-col">
        <button
          type="button"
          onClick={() => onEscolher('aceito')}
          className="flex-1 rounded-full bg-ouro px-7 py-3 text-sm font-bold text-tinta transition hover:bg-[#c7a46c]"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => onEscolher('recusado')}
          className="flex-1 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-carrara transition hover:border-ouro hover:text-ouro"
        >
          Recusar
        </button>
      </div>
    </motion.section>
  );
}
