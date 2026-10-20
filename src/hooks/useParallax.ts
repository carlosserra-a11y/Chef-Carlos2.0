import { useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import type { RefObject } from 'react';

/**
 * Deslocamento vertical (px) enquanto o elemento atravessa a tela.
 * Valores positivos descem mais devagar que a rolagem (efeito de profundidade).
 * Com "reduzir movimento" ativo no sistema, fica parado.
 */
export function useParallax(alvo: RefObject<HTMLElement | null>, distancia: number): MotionValue<number> {
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: alvo, offset: ['start end', 'end start'] });
  return useTransform(scrollYProgress, [0, 1], reduzir ? [0, 0] : [-distancia, distancia]);
}
