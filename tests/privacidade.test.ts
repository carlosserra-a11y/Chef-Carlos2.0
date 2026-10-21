import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CHAVE_PRIVACIDADE, aplicarEscolhaPrivacidade, lerEscolhaPrivacidade } from '../src/lib/privacidade.ts';

function memoria(inicial: Record<string, string> = {}) {
  const dados = new Map(Object.entries(inicial));
  return {
    dados,
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => {
      dados.set(k, v);
    },
    removeItem: (k: string) => {
      dados.delete(k);
    },
  };
}

const bloqueado = {
  getItem: (): string | null => {
    throw new Error('bloqueado');
  },
  setItem: () => {
    throw new Error('bloqueado');
  },
  removeItem: () => {
    throw new Error('bloqueado');
  },
};

test('lê só escolhas válidas do aviso de cookies', () => {
  assert.equal(lerEscolhaPrivacidade(memoria({ [CHAVE_PRIVACIDADE]: 'aceito' })), 'aceito');
  assert.equal(lerEscolhaPrivacidade(memoria({ [CHAVE_PRIVACIDADE]: 'recusado' })), 'recusado');
  assert.equal(lerEscolhaPrivacidade(memoria({ [CHAVE_PRIVACIDADE]: 'talvez' })), null);
  assert.equal(lerEscolhaPrivacidade(memoria()), null);
  assert.equal(lerEscolhaPrivacidade(bloqueado), null);
});

test('aceitar grava a escolha e mantém pedido e número salvos', () => {
  const armazenamento = memoria({ carrinho: '[1]', numero: '7' });
  aplicarEscolhaPrivacidade(armazenamento, 'aceito', ['carrinho', 'numero']);
  assert.equal(armazenamento.dados.get(CHAVE_PRIVACIDADE), 'aceito');
  assert.equal(armazenamento.dados.get('carrinho'), '[1]');
  assert.equal(armazenamento.dados.get('numero'), '7');
});

test('recusar grava a escolha e apaga só os dados do site', () => {
  const armazenamento = memoria({ carrinho: '[1]', numero: '7', outroSite: 'x' });
  aplicarEscolhaPrivacidade(armazenamento, 'recusado', ['carrinho', 'numero']);
  assert.equal(armazenamento.dados.get(CHAVE_PRIVACIDADE), 'recusado');
  assert.equal(armazenamento.dados.has('carrinho'), false);
  assert.equal(armazenamento.dados.has('numero'), false);
  assert.equal(armazenamento.dados.get('outroSite'), 'x');
});

test('armazenamento bloqueado não quebra a escolha', () => {
  assert.doesNotThrow(() => aplicarEscolhaPrivacidade(bloqueado, 'recusado', ['carrinho']));
});
