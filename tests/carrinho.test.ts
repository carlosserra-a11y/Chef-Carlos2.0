import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_EXTRA, MAX_ITENS_SALVOS, carrinhoReducer, sanitizarCarrinho } from '../src/lib/carrinho.ts';
import type { ItemCarrinho } from '../src/types.ts';

const vazio: ItemCarrinho[] = [];
const ceia = (uid: string, extras: Record<string, number> = {}): ItemCarrinho => ({ uid, ceiaId: 'ceia-4', extras });

test('adiciona uma ou várias ceias sem alterar o estado anterior', () => {
  const um = carrinhoReducer(vazio, { tipo: 'adicionar', itens: [ceia('a', { farofa: 2 })] });
  assert.equal(vazio.length, 0);
  assert.deepEqual(um, [ceia('a', { farofa: 2 })]);
  const tres = carrinhoReducer(um, { tipo: 'adicionar', itens: [ceia('b'), ceia('c')] });
  assert.deepEqual(tres.map((i) => i.uid), ['a', 'b', 'c']);
  assert.equal(um.length, 1);
});

test('define quantidade de extra com limites e remove quando zera', () => {
  const base = carrinhoReducer(vazio, { tipo: 'adicionar', itens: [ceia('a')] });
  const muitos = carrinhoReducer(base, { tipo: 'definirExtra', uid: 'a', extraId: 'pudim', quantidade: 99 });
  assert.deepEqual(muitos[0].extras, { pudim: MAX_EXTRA });
  const zerado = carrinhoReducer(muitos, { tipo: 'definirExtra', uid: 'a', extraId: 'pudim', quantidade: 0 });
  assert.deepEqual(zerado[0].extras, {});
  assert.deepEqual(base[0].extras, {});
});

test('remove item e limpa carrinho', () => {
  const um = carrinhoReducer(vazio, { tipo: 'adicionar', itens: [ceia('x')] });
  assert.deepEqual(carrinhoReducer(um, { tipo: 'remover', uid: 'x' }), []);
  assert.deepEqual(carrinhoReducer(um, { tipo: 'limpar' }), []);
});

test('sanitiza carrinho salvo no navegador descartando dados inválidos e uids repetidos', () => {
  const ids = { ceias: ['ceia-4'], extras: ['farofa'] };
  const bruto: unknown = [
    { uid: 'a', ceiaId: 'ceia-4', extras: { farofa: 3, hack: 5, pudim: 'x' } },
    { uid: 'a', ceiaId: 'ceia-4', extras: {} },
    { uid: 'b', ceiaId: 'ceia-999', extras: {} },
    { tipo: 'criacao', uid: 'c', criacaoId: 'brie' },
    'lixo',
    null,
  ];
  assert.deepEqual(sanitizarCarrinho(bruto, ids), [ceia('a', { farofa: 3 })]);
  assert.deepEqual(sanitizarCarrinho('{}', ids), []);
});

test('carrinho salvo gigante ou com uid enorme é limitado', () => {
  const ids = { ceias: ['ceia-4'], extras: [] };
  const muitos = Array.from({ length: 500 }, (_, i) => ceia(`u${i}`));
  assert.equal(sanitizarCarrinho(muitos, ids).length, MAX_ITENS_SALVOS);
  assert.deepEqual(sanitizarCarrinho([ceia('x'.repeat(65)), ceia('ok')], ids), [ceia('ok')]);
});
