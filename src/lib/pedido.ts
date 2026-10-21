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

/** Quantas pessoas as ceias do pedido servem somadas (cada ceia atende até 12). */
export function capacidadePedido(itens: readonly ItemCarrinho[], ceias: readonly Ceia[]): number {
  return itens.reduce((soma, item) => soma + (ceias.find((c) => c.id === item.ceiaId)?.maxPessoas ?? 0), 0);
}

export interface DadosCliente {
  nome: string;
  endereco: string;
  observacoes: string;
}

export type ErrosCliente = Partial<Record<keyof DadosCliente, string>>;

/** A entrega é em data fixa (24/12), então o cliente só informa nome, endereço e observações. */
export function validarCliente(dados: DadosCliente): ErrosCliente {
  const erros: ErrosCliente = {};
  const nome = dados.nome.trim();
  if (nome.length < 2 || nome.length > 80) erros.nome = 'Informe seu nome (2 a 80 caracteres).';
  const endereco = dados.endereco.trim();
  if (endereco.length < 5 || endereco.length > 200) erros.endereco = 'Informe o endereço de entrega.';
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

/** `entrega` = texto fixo da entrega (ex.: "24/12, a partir das 12h, com rastreio de entrega"). */
export function montarMensagem(resumo: ResumoPedido, cliente: DadosCliente, entrega: string): string {
  const linhas = [
    'Olá, Chef Carlos! Quero encomendar minha ceia pelo site.',
    '',
    `*Cliente:* ${cliente.nome.trim()}`,
    `*Endereço:* ${cliente.endereco.trim()}`,
    `*Entrega:* ${entrega}`,
    '',
    '*Ceias*',
    ...resumo.ceias.flatMap((c) => [`• ${c.nome} — ${formatarBRL(c.preco)}`, ...c.extras.map(linhaExtra)]),
    '',
    `*Total:* ${formatarBRL(resumo.total)}`,
  ];
  if (resumo.temValorACombinar) linhas.push('_Extras sem preço na tabela: valores a combinar por aqui._');
  const obs = cliente.observacoes.trim();
  if (obs) linhas.push('', `*Observações:* ${obs}`);
  return linhas.join('\n');
}

export function linkWhatsApp(numero: string, texto?: string): string {
  const base = `https://wa.me/${numero}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
