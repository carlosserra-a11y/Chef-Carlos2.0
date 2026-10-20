import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  atraso?: number;
  deslocamento?: number;
  className?: string;
};

export const SUAVE = [0.16, 1, 0.3, 1] as const;

/** Revela o conteúdo com fade + subida quando entra na tela (uma vez). */
export function Reveal({ children, atraso = 0, deslocamento = 36, className }: Props) {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduzir ? false : { opacity: 0, y: deslocamento }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: atraso, ease: SUAVE }}
    >
      {children}
    </motion.div>
  );
}
