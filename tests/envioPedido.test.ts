import assert from 'node:assert/strict';
import { test } from 'node:test';
import { enviarPedidoWhatsApp, type AbaNavegador } from '../src/lib/envioPedido.ts';

const montarLink = (numero: number | null) => `https://wa.me/55?text=cliente-${numero ?? 'sem'}`;

function abaFalsa(): AbaNavegador {
  return {
    closed: false,
    opener: 'janela-do-site',
    location: { href: '' },
    document: { title: '', body: { textContent: '' } },
  };
}

test('cliente com número salvo: abre o WhatsApp na hora, sem consultar o contador', async () => {
  const aberturas: unknown[][] = [];
  let consultas = 0;
  const resultado = await enviarPedidoWhatsApp({
    numeroSalvo: 5,
    abrir: (...args) => {
      aberturas.push(args);
      return null;
    },
    irPara: () => assert.fail('não deve sair da página'),
    obterNumero: async () => {
      consultas += 1;
      return 9;
    },
    montarLink,
  });
  assert.deepEqual(resultado, { enviado: true, numero: 5 });
  assert.deepEqual(aberturas, [[montarLink(5), '_blank', 'noopener,noreferrer']]);
  assert.equal(consultas, 0);
});

test('cliente novo: a aba abre antes da espera pelo número e depois recebe o link numerado', async () => {
  const eventos: string[] = [];
  const aba = abaFalsa();
  const resultado = await enviarPedidoWhatsApp({
    numeroSalvo: null,
    abrir: (url) => {
      eventos.push(`abrir:${url}`);
      return aba;
    },
    irPara: () => assert.fail('não deve sair da página'),
    obterNumero: async () => {
      eventos.push('numero');
      return 7;
    },
    montarLink,
  });
  assert.deepEqual(eventos, ['abrir:', 'numero']);
  assert.equal(aba.opener, null);
  assert.match(aba.document?.body?.textContent ?? '', /Abrindo o WhatsApp/);
  assert.equal(aba.location.href, montarLink(7));
  assert.deepEqual(resultado, { enviado: true, numero: 7 });
});

test('pop-up bloqueado: segue para o WhatsApp na própria página', async () => {
  const destinos: string[] = [];
  const resultado = await enviarPedidoWhatsApp({
    numeroSalvo: null,
    abrir: () => null,
    irPara: (url) => destinos.push(url),
    obterNumero: async () => 3,
    montarLink,
  });
  assert.deepEqual(destinos, [montarLink(3)]);
  assert.deepEqual(resultado, { enviado: true, numero: 3 });
});

test('cliente fechou a aba durante a espera: trata como cancelado', async () => {
  const aba = abaFalsa();
  const resultado = await enviarPedidoWhatsApp({
    numeroSalvo: null,
    abrir: () => aba,
    irPara: () => assert.fail('não deve sair da página'),
    obterNumero: async () => {
      aba.closed = true;
      return 4;
    },
    montarLink,
  });
  assert.deepEqual(resultado, { enviado: false });
  assert.equal(aba.location.href, '');
});

test('erro ao montar o link: fecha a aba de espera e repassa o erro', async () => {
  let fechada = false;
  const aba = { ...abaFalsa(), close: () => (fechada = true) };
  await assert.rejects(
    enviarPedidoWhatsApp({
      numeroSalvo: null,
      abrir: () => aba,
      irPara: () => assert.fail('não deve sair da página'),
      obterNumero: async () => 8,
      montarLink: () => {
        throw new URIError('URI malformed');
      },
    }),
    URIError,
  );
  assert.equal(fechada, true);
});

test('sem número (contador fora do ar ou erro): o pedido segue sem número', async () => {
  for (const obterNumero of [async () => null, async () => Promise.reject(new Error('falhou'))]) {
    const aba = abaFalsa();
    const resultado = await enviarPedidoWhatsApp({ numeroSalvo: null, abrir: () => aba, irPara: () => undefined, obterNumero, montarLink });
    assert.deepEqual(resultado, { enviado: true, numero: null });
    assert.equal(aba.location.href, montarLink(null));
  }
});
