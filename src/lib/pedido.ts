// Pedido: resumo do carrinho, validação do formulário e mensagem para o WhatsApp.
import type { Ceia, Extra, ItemCarrinho } from '../types.ts';
import { formatarBRL } from './formato.ts';

export interface LinhaExtra {
  nome: string;
  porcao: string;
  quantidade: number;
  preco?: number;
}

export interface LinhaCeia {
  uid: string;
  nome: string;
  preco: number;
  extras: LinhaExtra[];
}

export interface ResumoPedido {
  ceias: LinhaCeia[];
  total: number;
  temValorACombinar: boolean;
}

export interface Catalogo {
  ceias: readonly Ceia[];
  extras: readonly Extra[];
}

const centavos = (v: number): number => Math.round(v * 100) / 100;

export function resumirPedido(itens: readonly ItemCarrinho[], catalogo: Catalogo): ResumoPedido {
  const ceias = itens.flatMap((item): LinhaCeia[] => {
    const ceia = catalogo.ceias.find((c) => c.id === item.ceiaId);
    if (!ceia) return [];
    const extras = Object.entries(item.extras).flatMap(([id, quantidade]): LinhaExtra[] => {
      const extra = catalogo.extras.find((e) => e.id === id);
      return extra ? [{ nome: extra.nome, porcao: extra.porcao, quantidade, preco: extra.preco }] : [];
    });
    return [{ uid: item.uid, nome: ceia.nome, preco: ceia.preco, extras }];
  });
  const total = centavos(
    ceias.reduce((soma, c) => soma + c.preco + c.extras.reduce((s, e) => s + (e.preco ?? 0) * e.quantidade, 0), 0),
  );
  const temValorACombinar = ceias.some((c) => c.extras.some((e) => e.preco === undefined));
  return { ceias, total, temValorACombinar };
}

/** Soma dos adicionais com preço (os sem preço ficam a combinar). */
export function valorExtras(extras: Readonly<Record<string, number>>, catalogo: readonly Extra[]): number {
  return centavos(
    Object.entries(extras).reduce((soma, [id, quantidade]) => soma + (catalogo.find((e) => e.id === id)?.preco ?? 0) * quantidade, 0),
  );
}

/** Quantas pessoas as ceias do pedido servem somadas (até 4, 8 ou 12, conforme a ceia). */
export function capacidadePedido(itens: readonly ItemCarrinho[], ceias: readonly Ceia[]): number {
  return itens.reduce((soma, item) => soma + (ceias.find((c) => c.id === item.ceiaId)?.maxPessoas ?? 0), 0);
}

export interface DadosCliente {
  nome: string;
  endereco: string;
  observacoes: string;
}

export type ErrosCliente = Partial<Record<keyof DadosCliente, string>>;

// Controles e caracteres de formatação invisíveis (\p{Cc}, \p{Cf}: marcas de direção de texto, que podem
// inverter o que o Chef lê, espaços de largura zero, caracteres de tag...) e "preenchedores" que parecem
// espaço em branco. O U+200D (junção que forma emojis como o de chef) continua permitido.
const INVISIVEIS = /(?!\u200D)[\p{Cc}\p{Cf}\u034F\u115F\u1160\u2800\u3164\uFFA0]/gu;
// Marcas de formatação do WhatsApp: sem elas o cliente não imita os rótulos em negrito da comanda.
const FORMATACAO_WHATSAPP = /[*_~`]/g;
const TEM_LETRA = /\p{L}/u;
const TEM_LETRA_OU_NUMERO = /[\p{L}\p{N}]/u;

/**
 * Metade de um emoji (surrogate solto, ex.: emoji cortado pelo limite do campo) quebraria o
 * encodeURIComponent do link do WhatsApp: mantém os pares válidos e descarta os soltos.
 */
function semSurrogateSolto(texto: string): string {
  let saida = '';
  for (const c of texto) {
    const unidade = c.charCodeAt(0);
    if (c.length === 1 && unidade >= 0xd800 && unidade <= 0xdfff) continue;
    saida += c;
  }
  return saida;
}

/**
 * Texto digitado pelo cliente vira uma linha simples, para não forjar linhas da comanda
 * (ex.: um nome com quebra de linha e "*Total:* R$ 1,00").
 */
export function textoSeguro(texto: string): string {
  return semSurrogateSolto(texto)
    .replace(/\s+/g, ' ')
    .replace(INVISIVEIS, '')
    .replace(FORMATACAO_WHATSAPP, '')
    .replace(/ {2,}/g, ' ')
    .trim();
}

/** A entrega é em data fixa (24/12), então o cliente só informa nome, endereço e observações. */
export function validarCliente(dados: DadosCliente): ErrosCliente {
  const erros: ErrosCliente = {};
  const nome = textoSeguro(dados.nome);
  if (nome.length < 2 || nome.length > 80 || !TEM_LETRA.test(nome)) erros.nome = 'Informe seu nome (2 a 80 caracteres).';
  const endereco = textoSeguro(dados.endereco);
  if (endereco.length < 5 || endereco.length > 200 || !TEM_LETRA_OU_NUMERO.test(endereco)) {
    erros.endereco = 'Informe o endereço de entrega.';
  }
  if (dados.observacoes.length > 500) erros.observacoes = 'Use até 500 caracteres.';
  return erros;
}

/** Datas no formato aaaa-mm-dd: pedidos aceitos até o fim do dia do prazo. */
export function pedidosAbertos(hojeIso: string, prazoIso: string): boolean {
  return hojeIso <= prazoIso;
}

const linhaExtra = (e: LinhaExtra): string =>
  `   + ${e.quantidade}x ${e.nome} (${e.porcao}) — ${
    e.preco === undefined ? 'valor a combinar' : formatarBRL(e.preco * e.quantidade)
  }`;

export interface CondicoesPedido {
  /** Texto fixo da entrega (ex.: "24/12, a partir das 12h, com rastreio de entrega"). */
  entrega: string;
  /** Brinde que acompanha todo pedido (ex.: "Bolsa térmica Chef Carlos Jr"). */
  brinde: string;
  /** Formas de pagamento aceitas (ex.: "PIX, débito ou crédito"). */
  pagamento: string;
}

export interface DivisaoPagamento {
  noPedido: number;
  naEntrega: number;
}

/** 50% na hora do pedido e 50% na entrega; um centavo ímpar fica na parte do pedido. */
export function dividirPagamento(total: number): DivisaoPagamento {
  const totalCentavos = Math.round(total * 100);
  const noPedidoCentavos = Math.ceil(totalCentavos / 2);
  return { noPedido: noPedidoCentavos / 100, naEntrega: (totalCentavos - noPedidoCentavos) / 100 };
}

/** `numeroCliente` é o número sequencial da pessoa (1, 2, 3…), que o Chef usa para identificar o pedido. */
export function montarMensagem(
  resumo: ResumoPedido,
  cliente: DadosCliente,
  condicoes: CondicoesPedido,
  numeroCliente: number | null = null,
): string {
  const rotuloCliente = numeroCliente ? `*Cliente nº ${numeroCliente}:*` : '*Cliente:*';
  const pagamento = dividirPagamento(resumo.total);
  const linhas = [
    'Olá, Chef Carlos! Quero encomendar minha ceia pelo site.',
    '',
    `${rotuloCliente} ${textoSeguro(cliente.nome)}`,
    `*Endereço:* ${textoSeguro(cliente.endereco)}`,
    `*Entrega:* ${condicoes.entrega}`,
    `*Brinde:* ${condicoes.brinde}`,
    '',
    '*Ceias*',
    ...resumo.ceias.flatMap((c) => [`• ${c.nome} — ${formatarBRL(c.preco)}`, ...c.extras.map(linhaExtra)]),
    '',
    `*Total:* ${formatarBRL(resumo.total)}`,
    `*Pagamento:* ${condicoes.pagamento}`,
    `• 50% na hora do pedido: ${formatarBRL(pagamento.noPedido)}`,
    `• 50% na entrega: ${formatarBRL(pagamento.naEntrega)}`,
  ];
  if (resumo.temValorACombinar) linhas.push('_Extras sem preço na tabela: valores a combinar por aqui._');
  const obs = textoSeguro(cliente.observacoes);
  if (obs) linhas.push('', `*Observações:* ${obs}`);
  return linhas.join('\n');
}

export function linkWhatsApp(numero: string, texto?: string): string {
  const base = `https://wa.me/${numero}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
