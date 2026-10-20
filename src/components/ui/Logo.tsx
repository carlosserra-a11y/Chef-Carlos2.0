import { useState } from 'react';
import { LOGO_URL } from '../../data/menuData.ts';

type Props = {
  /** true = fundo escuro (logo branca original); false = fundo claro (logo em preto). */
  claro?: boolean;
  tamanho?: 'pequeno' | 'grande';
};

/**
 * Logotipo oficial (PNG branco com fundo transparente). Em fundos claros é
 * escurecido por filtro. Se o arquivo não carregar, mostra a assinatura tipográfica.
 */
export function Logo({ claro = false, tamanho = 'pequeno' }: Props) {
  const [falhou, setFalhou] = useState(false);
  const altura = tamanho === 'grande' ? 'h-28' : 'h-12';

  if (!falhou) {
    return (
      <img
        src={LOGO_URL}
        alt="Chef Carlos Jr Gastronomia"
        onError={() => setFalhou(true)}
        className={`${altura} w-auto select-none ${claro ? '' : 'brightness-0'}`}
      />
    );
  }

  const cor = claro ? 'text-carrara' : 'text-tinta';
  const script = tamanho === 'grande' ? 'text-6xl' : 'text-[2.15rem]';
  return (
    <span className={`inline-flex flex-col items-center leading-none ${cor}`} aria-label="Chef Carlos Jr Gastronomia">
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.45em]" aria-hidden="true">Chef</span>
      <span className={`font-script ${script} -mt-0.5`} aria-hidden="true">Carlos Jr</span>
      <span className={`${tamanho === 'grande' ? 'mt-3' : 'mt-1'} text-[0.55rem] font-semibold uppercase tracking-[0.5em] text-ouro`} aria-hidden="true">
        Gastronomia
      </span>
    </span>
  );
}
