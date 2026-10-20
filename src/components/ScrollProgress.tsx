import { motion, useScroll, useSpring } from 'motion/react';

/** Barra dourada no topo que acompanha o progresso da rolagem. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const escala = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-ouro-escuro via-ouro to-[#e2c48d]"
      style={{ scaleX: escala }}
    />
  );
}
