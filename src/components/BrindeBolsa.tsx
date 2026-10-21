import { Gift, Recycle, Truck, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { BRINDE_FOTO, BRINDE_TEXTO, ENTREGA_TEXTO, foto } from '../data/menuData.ts';
import { useParallax } from '../hooks/useParallax.ts';
import { Reveal } from './ui/Reveal.tsx';

const DESTAQUES: { texto: string; Icone: LucideIcon }[] = [
  { texto: 'De brinde em todo pedido de ceia', Icone: Gift },
  { texto: `Sua ceia chega no dia ${ENTREGA_TEXTO}`, Icone: Truck },
  { texto: 'Fica com você para usar depois do Natal', Icone: Recycle },
];

/** Destaque do brinde: a bolsa térmica com o logotipo do Chef. */
export function BrindeBolsa() {
  const secao = useRef<HTMLElement>(null);
  const y = useParallax(secao, 40);
  return (
    <section ref={secao} id="brinde" aria-labelledby="titulo-brinde" className="relative overflow-hidden bg-carrara py-24 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-xl">
          <motion.div style={{ y }} className="overflow-hidden rounded-[2.2rem] border-[10px] border-white shadow-[0_40px_80px_-35px_rgb(29_27_24/0.6)]">
            <img
              src={foto(BRINDE_FOTO)}
              alt={`${BRINDE_TEXTO}: bolsa térmica preta com o logotipo do Chef`}
              width={1353}
              height={1163}
              loading="lazy"
              className="aspect-[7/6] w-full object-cover"
            />
          </motion.div>
          <span className="absolute -right-2 -top-4 rotate-6 rounded-full bg-ouro px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-tinta shadow-lg md:-right-6">
            Brinde
          </span>
        </div>

        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-ouro-escuro">Presente do Chef</span>
          <h2 id="titulo-brinde" className="mt-5 font-display text-[clamp(2.4rem,1.5rem+3.4vw,4.2rem)] font-semibold leading-[0.98] text-tinta">
            Sua ceia vai na <span className="italic text-ouro-escuro">bolsa térmica</span> do Chef
          </h2>
          <div className="filete mt-5 w-28" aria-hidden="true" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-grafite">
            Todo pedido de ceia acompanha, de brinde, a bolsa térmica com o logotipo do Chef Carlos Jr: prática para levar a ceia até a sua mesa
            e para reutilizar depois.
          </p>
          <ul className="mt-8 space-y-3">
            {DESTAQUES.map(({ texto, Icone }) => (
              <li key={texto} className="flex items-center gap-3 text-grafite">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-linho bg-white text-ouro-escuro">
                  <Icone className="size-4" aria-hidden="true" />
                </span>
                {texto}
              </li>
            ))}
          </ul>
          <a href="#ceias" className="mt-9 inline-flex rounded-full bg-tinta px-7 py-4 text-sm font-semibold text-carrara transition hover:-translate-y-0.5 hover:bg-grafite">
            Escolher minha ceia
          </a>
        </Reveal>
      </div>
    </section>
  );
}
