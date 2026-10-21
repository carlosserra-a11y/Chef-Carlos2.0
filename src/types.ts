// Tipos compartilhados entre os dados das ceias, a lógica (src/lib) e os componentes.

export type CeiaId = 'ceia-4' | 'ceia-6-8' | 'ceia-10-12';

/** Peças desenhadas na ilustração de composição de cada ceia. */
export type PecaIlustracao =
  | 'chester-inteiro'
  | 'lombo'
  | 'arroz-branco'
  | 'arroz-grega'
  | 'farofa'
  | 'quiche'
  | 'maionese'
  | 'salpicao'
  | 'waldorf'
  | 'pave'
  | 'cheesecake'
  | 'pudim'
  | 'frutas';

export interface FotoCeia {
  /** Nome do arquivo em public/assets/fotos, sem extensão. */
  nome: string;
  legenda: string;
  /** Imagem criada para ilustrar a montagem (não é foto do evento). */
  ilustrativa?: boolean;
}

/** Item do cardápio oficial, com a quantidade servida (ex.: "150 g por pessoa"). */
export interface ItemCardapio {
  nome: string;
  quantidade?: string;
}

export interface GrupoCardapio {
  titulo: 'Proteína' | 'Proteínas' | 'Acompanhamentos' | 'Sobremesa' | 'Sobremesas' | 'Finalização';
  itens: ItemCardapio[];
}

export interface Ceia {
  id: CeiaId;
  nome: string;
  pessoas: string;
  maxPessoas: number;
  preco: number;
  destaque?: string;
  resumo: string;
  cardapio: GrupoCardapio[];
  /** Quantidade de cada peça na mesa, usada pela ilustração (composição e porção). */
  composicao: Partial<Record<PecaIlustracao, number>>;
  fotos: FotoCeia[];
}

export interface Extra {
  id: string;
  nome: string;
  porcao: string;
  /** Sem preço definido o extra entra no pedido como "valor a combinar". */
  preco?: number;
}

export interface ItemCarrinho {
  uid: string;
  ceiaId: CeiaId;
  extras: Readonly<Record<string, number>>;
}
