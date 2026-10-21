import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatarBRL } from '../src/lib/formato.ts';
import {
  capacidadePedido,
  linkWhatsApp,
  montarMensagem,
  pedidosAbertos,
  resumirPedido,
  validarCliente,
  valorExtras,
  type DadosCliente,
} from '../src/lib/pedido.ts';
import type { Ceia, Extra, ItemCarrinho } from '../src/types.ts';

const ceias = [
  { id: 'ceia-4', nome: 'Ceia até 4 pessoas', pessoas: 'até 4 pessoas', maxPessoas: 4, preco: 599.9 },
  { id: 'ceia-6-8', nome: 'Ceia de 6 a 8 pessoas', pessoas: '6 a 8 pessoas', maxPessoas: 8, preco: 999.9 },
] as Ceia[];
const extras: Extra[] = [
  { id: 'farofa', nome: 'Farofa de castanhas', porcao: '500 g' },
  { id: 'chester', nome: 'Chester inteiro extra', porcao: '1 unidade', preco: 200 },
];
const catalogo = { ceias, extras };
const ENTREGA = '24/12, a partir das 12h, com rastreio de entrega';

const itens: ItemCarrinho[] = [
  { uid: 'a', ceiaId: 'ceia-6-8', extras: { farofa: 2, chester: 1 } },
  { uid: 'b', ceiaId: 'ceia-4', extras: {} },
];

const cliente: DadosCliente = {
  nome: '  Maria Silva ',
  endereco: 'Rua das Flores, 100 - Florianópolis',
  observacoes: 'Sem lactose na sobremesa',
};

test('formata valores em reais', () => {
  assert.equal(formatarBRL(1399.9).replace(/\s/g, ' '), 'R$ 1.399,90');
  assert.equal(formatarBRL(599.9).replace(/\s/g, ' '), 'R$ 599,90');
});

test('resume o pedido somando ceias e extras com preço', () => {
  const r = resumirPedido(itens, catalogo);
  assert.equal(r.ceias.length, 2);
  assert.equal(r.ceias[0].extras.length, 2);
  assert.equal(r.total, 1799.8);
  assert.equal(r.temValorACombinar, true);
  assert.equal(resumirPedido([itens[1]], catalogo).temValorACombinar, false);
});

test('soma a capacidade de pessoas das ceias do pedido', () => {
  assert.equal(capacidadePedido(itens, ceias), 12);
  assert.equal(capacidadePedido([], ceias), 0);
});

test('valida nome, endereço e observações (data e convidados não são mais pedidos)', () => {
  assert.deepEqual(validarCliente(cliente), {});
  const erros = validarCliente({ nome: 'A', endereco: 'x', observacoes: '' });
  assert.ok(erros.nome && erros.endereco);
  assert.ok(validarCliente({ ...cliente, observacoes: 'x'.repeat(501) }).observacoes);
});

test('aceita pedidos até o último dia do prazo e recusa depois', () => {
  assert.equal(pedidosAbertos('2026-10-20', '2026-12-20'), true);
  assert.equal(pedidosAbertos('2026-12-20', '2026-12-20'), true);
  assert.equal(pedidosAbertos('2026-12-21', '2026-12-20'), false);
});

test('monta mensagem completa para o WhatsApp com a entrega fixa', () => {
  const msg = montarMensagem(resumirPedido(itens, catalogo), cliente, {
    entrega: ENTREGA,
    brinde: 'Bolsa térmica Chef Carlos Jr',
  });
  assert.match(msg, /\*Cliente:\* Maria Silva/);
  assert.match(msg, /\*Endereço:\* Rua das Flores/);
  assert.match(msg, /\*Entrega:\* 24\/12, a partir das 12h, com rastreio de entrega/);
  assert.match(msg, /\*Brinde:\* Bolsa térmica Chef Carlos Jr/);
  assert.doesNotMatch(msg, /Convidados|Data da ceia/);
  assert.match(msg, /Ceia de 6 a 8 pessoas — R\$\s999,90/);
  assert.match(msg, /\+ 2x Farofa de castanhas \(500 g\) — valor a combinar/);
  assert.match(msg, /\+ 1x Chester inteiro extra \(1 unidade\) — R\$\s200,00/);
  assert.match(msg, /• Ceia até 4 pessoas — R\$\s599,90/);
  assert.match(msg, /\*Total:\* R\$\s1\.799,80/);
  assert.match(msg, /Sem lactose/);
});

test('soma o valor dos adicionais com preço para o total ao vivo da ceia', () => {
  assert.equal(valorExtras({ chester: 2 }, extras), 400);
  assert.equal(valorExtras({ farofa: 3 }, extras), 0);
  assert.equal(valorExtras({}, extras), 0);
  assert.equal(valorExtras({ chester: 1, inexistente: 4 }, extras), 200);
  assert.equal(valorExtras({ a: 3 }, [{ id: 'a', nome: 'A', porcao: '1 kg', preco: 29.9 }]), 89.7);
});

test('mostra o número do cliente na comanda quando ele existe', () => {
  const condicoes = { entrega: ENTREGA, brinde: 'Bolsa térmica Chef Carlos Jr' };
  const comNumero = montarMensagem(resumirPedido(itens, catalogo), cliente, condicoes, 7);
  assert.match(comNumero, /\*Cliente nº 7:\* Maria Silva/);
  const semNumero = montarMensagem(resumirPedido(itens, catalogo), cliente, condicoes, null);
  assert.match(semNumero, /\*Cliente:\* Maria Silva/);
  assert.doesNotMatch(semNumero, /nº/);
});

test('gera link do WhatsApp com texto codificado', () => {
  const url = linkWhatsApp('5548996835439', 'Olá & até já');
  assert.equal(url, 'https://wa.me/5548996835439?text=Ol%C3%A1%20%26%20at%C3%A9%20j%C3%A1');
  assert.equal(linkWhatsApp('5548996835439'), 'https://wa.me/5548996835439');
});
