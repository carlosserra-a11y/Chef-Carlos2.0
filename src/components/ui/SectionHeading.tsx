import type { ReactNode } from 'react';
import { Reveal } from './Reveal.tsx';

type Props = {
  id: string;
  selo: string;
  titulo: ReactNode;
  descricao?: ReactNode;
  escuro?: boolean;
  centralizado?: boolean;
};

export function SectionHeading({ id, selo, titulo, descricao, escuro = false, centralizado = false }: Props) {
  const alinhamento = centralizado ? 'mx-auto text-center items-center' : 'items-start';
  const corTitulo = escuro ? 'text-carrara' : 'text-tinta';
  const corTexto = escuro ? 'text-carrara/70' : 'text-pedra';
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-5 ${alinhamento}`}>
      <span className={`text-xs font-semibold uppercase tracking-[0.32em] ${escuro ? 'text-ouro' : 'text-ouro-escuro'}`}>
        {selo}
      </span>
      <h2 id={id} className={`font-display text-[clamp(2.4rem,1.5rem+3.4vw,4.4rem)] font-semibold leading-[0.98] ${corTitulo}`}>
        {titulo}
      </h2>
      <div className="filete w-28" aria-hidden="true" />
      {descricao && <p className={`max-w-2xl text-base leading-relaxed md:text-lg ${corTexto}`}>{descricao}</p>}
    </Reveal>
  );
}
