import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CHAVE_NUMERO_CLIENTE, lerNumeroSalvo, obterNumeroCliente } from '../src/lib/numeroCliente.ts';

const URL_CONTADOR = 'https://contador.exemplo/hit/chef/clientes';

function memoria(inicial: Record<string, string> = {}) {
  const dados = new Map(Object.entries(inicial));
  return {
    dados,
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => {
      dados.set(k, v);
    },
  };
}

const resposta = (corpo: unknown, ok = true) => async () => ({ ok, json: async () => corpo }) as Response;

test('lê o número salvo só quando é um inteiro positivo', () => {
  assert.equal(lerNumeroSalvo(memoria({ [CHAVE_NUMERO_CLIENTE]: '7' })), 7);
  assert.equal(lerNumeroSalvo(memoria()), null);
  assert.equal(lerNumeroSalvo(memoria({ [CHAVE_NUMERO_CLIENTE]: 'abc' })), null);
  assert.equal(lerNumeroSalvo(memoria({ [CHAVE_NUMERO_CLIENTE]: '0' })), null);
  assert.equal(lerNumeroSalvo(memoria({ [CHAVE_NUMERO_CLIENTE]: '2.5' })), null);
  for (const estranho of ['0x10', '1e3', ' 7 ', '-3', '12345678901']) {
    assert.equal(lerNumeroSalvo(memoria({ [CHAVE_NUMERO_CLIENTE]: estranho })), null, estranho);
  }
});

test('mesma pessoa mantém o número sem consultar o contador de novo', async () => {
  let chamadas = 0;
  const numero = await obterNumeroCliente({
    url: URL_CONTADOR,
    armazenamento: memoria({ [CHAVE_NUMERO_CLIENTE]: '3' }),
    buscar: async () => {
      chamadas += 1;
      return { ok: true, json: async () => ({ value: 99 }) } as Response;
    },
  });
  assert.equal(numero, 3);
  assert.equal(chamadas, 0);
});

test('pessoa nova recebe o próximo número do contador e ele fica salvo', async () => {
  const armazenamento = memoria();
  const numero = await obterNumeroCliente({ url: URL_CONTADOR, armazenamento, buscar: resposta({ value: 12 }) });
  assert.equal(numero, 12);
  assert.equal(armazenamento.dados.get(CHAVE_NUMERO_CLIENTE), '12');
});

test('sem contador (erro, resposta inválida ou demora) o pedido segue sem número e nada é salvo', async () => {
  const casos = [
    resposta({ value: 12 }, false),
    resposta({ erro: 'x' }),
    resposta({ value: -1 }),
    resposta({ value: '12' }),
    resposta({ value: 1e21 }),
    resposta({ value: 1_000_000_000 }),
    async () => ({ ok: true, json: async () => Promise.reject(new SyntaxError('json inválido')) }) as unknown as Response,
    async () => {
      throw new Error('sem rede');
    },
  ];
  for (const buscar of casos) {
    const armazenamento = memoria();
    assert.equal(await obterNumeroCliente({ url: URL_CONTADOR, armazenamento, buscar }), null);
    assert.equal(armazenamento.dados.size, 0);
  }

  const lento = (_url: string | URL | Request, init?: RequestInit) =>
    new Promise<Response>((_resolve, rejeitar) => init?.signal?.addEventListener('abort', () => rejeitar(new Error('abortado'))));
  assert.equal(await obterNumeroCliente({ url: URL_CONTADOR, armazenamento: memoria(), buscar: lento, tempoLimiteMs: 20 }), null);
});

test('armazenamento indisponível não impede de buscar o número', async () => {
  const bloqueado = {
    getItem: () => {
      throw new Error('bloqueado');
    },
    setItem: () => {
      throw new Error('bloqueado');
    },
  };
  assert.equal(await obterNumeroCliente({ url: URL_CONTADOR, armazenamento: bloqueado, buscar: resposta({ value: 5 }) }), 5);
});
