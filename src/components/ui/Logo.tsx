import { LOGO_CLARA_URL, LOGO_URL } from '../../data/menuData.ts';

type Props = {
  /** true = fundo escuro (versão branca); false = fundo claro (versão preta). */
  claro?: boolean;
  tamanho?: 'pequeno' | 'grande';
};

/**
 * Logotipo oficial do Chef Carlos Jr, com o desenho original:
 * "Chef Carlos Jr" em preto (ou branco em fundo escuro) e "GASTRONOMIA" em prata.
 */
export function Logo({ claro = false, tamanho = 'pequeno' }: Props) {
  const altura = tamanho === 'grande' ? 'h-28 md:h-36' : 'h-14 md:h-16';
  return (
    <img
      src={claro ? LOGO_CLARA_URL : LOGO_URL}
      alt="Chef Carlos Jr Gastronomia"
      width={1448}
      height={700}
      className={`${altura} w-auto select-none`}
      draggable={false}
    />
  );
}
