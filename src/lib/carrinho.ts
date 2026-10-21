// Carrinho de ceias: reducer imutável + sanitização do que vem do localStorage.
import type { CeiaId, ItemCarrinho } from '../types.ts';

export const MAX_EXTRA = 10;
/** Teto para o carrinho lido do localStorage (dado externo): evita travar a página com lixo gigante. */
export const MAX_ITENS_SALVOS = 50;
const MAX_TAMANHO_UID = 64;

export type AcaoCarrinho =
  | { tipo: 'adicionar'; itens: readonly ItemCarrinho[] }
  | { tipo: 'remover'; uid: string }
  | { tipo: 'definirExtra'; uid: string; extraId: string; quantidade: number }
  | { tipo: 'limpar' };

const limitarExtra = (q: number): number =>
  Number.isFinite(q) ? Math.min(MAX_EXTRA, Math.max(0, Math.round(q))) : 0;

/** Novo objeto de extras com a quantidade ajustada (0 remove a chave). */
export function comExtra(extras: Readonly<Record<string, number>>, id: string, qtd: number): Record<string, number> {
  const { [id]: _anterior, ...resto } = extras;
  const q = limitarExtra(qtd);
  return q > 0 ? { ...resto, [id]: q } : resto;
}

export function carrinhoReducer(estado: readonly ItemCarrinho[], acao: AcaoCarrinho): ItemCarrinho[] {
  switch (acao.tipo) {
    case 'adicionar':
      return [...estado, ...acao.itens.map((i) => ({ ...i, extras: { ...i.extras } }))];
    case 'remover':
      return estado.filter((i) => i.uid !== acao.uid);
    case 'definirExtra':
      return estado.map((i) => (i.uid === acao.uid ? { ...i, extras: comExtra(i.extras, acao.extraId, acao.quantidade) } : i));
    case 'limpar':
      return [];
  }
}

export interface IdsValidos {
  ceias: readonly string[];
  extras: readonly string[];
}

const ehObjeto = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** Aceita só itens com ids conhecidos e uid único: o localStorage é dado externo e não confiável. */
export function sanitizarCarrinho(bruto: unknown, ids: IdsValidos): ItemCarrinho[] {
  if (!Array.isArray(bruto)) return [];
  const vistos = new Set<string>();
  return bruto.slice(0, MAX_ITENS_SALVOS * 2).flatMap((item): ItemCarrinho[] => {
    if (vistos.size >= MAX_ITENS_SALVOS || !ehObjeto(item) || typeof item.uid !== 'string') return [];
    if (item.uid.length > MAX_TAMANHO_UID || vistos.has(item.uid)) return [];
    if (typeof item.ceiaId !== 'string' || !ids.ceias.includes(item.ceiaId)) return [];
    vistos.add(item.uid);
    const extrasBrutos = ehObjeto(item.extras) ? item.extras : {};
    const extras = Object.entries(extrasBrutos).reduce<Record<string, number>>(
      (acc, [id, q]) => (ids.extras.includes(id) && typeof q === 'number' ? comExtra(acc, id, q) : acc),
      {},
    );
    return [{ uid: item.uid, ceiaId: item.ceiaId as CeiaId, extras }];
  });
}
