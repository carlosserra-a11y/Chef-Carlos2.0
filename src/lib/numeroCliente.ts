// Número sequencial do cliente (1, 2, 3…) para o Chef identificar cada pessoa na comanda do WhatsApp.
// O site é estático, então a sequência vem de um contador público compartilhado por todos os visitantes;
// o número fica salvo no navegador para a mesma pessoa manter o mesmo número nos pedidos seguintes.

import { armazenamentoLocal, lerEscolhaPrivacidade } from './privacidade.ts';

export const CHAVE_NUMERO_CLIENTE = 'chef-carlos-2:numero-cliente';
const TEMPO_LIMITE_MS = 3000;
/** Só dígitos (até 9): recusa "0x10", "1e3", " 7 " e outros formatos que Number() aceitaria. */
const FORMATO_SALVO = /^\d{1,9}$/;

type Armazenamento = Pick<Storage, 'getItem' | 'setItem'>;

const SEM_ARMAZENAMENTO: Armazenamento = { getItem: () => null, setItem: () => undefined };

/** Mesmo teto do formato salvo (9 dígitos): um número maior nunca seria relido do navegador. */
const MAIOR_NUMERO = 999_999_999;

const numeroValido = (valor: unknown): valor is number =>
  typeof valor === 'number' && Number.isSafeInteger(valor) && valor > 0 && valor <= MAIOR_NUMERO;

/**
 * Onde guardar o número: o localStorage, a menos que esteja bloqueado (modo privado) ou que o visitante
 * tenha recusado o aviso de cookies; nesses casos o número vale só para o pedido atual.
 */
export function armazenamentoDoNavegador(): Armazenamento {
  const local = armazenamentoLocal();
  return lerEscolhaPrivacidade(local) === 'recusado' ? SEM_ARMAZENAMENTO : local;
}

export function lerNumeroSalvo(armazenamento: Pick<Storage, 'getItem'>): number | null {
  try {
    const bruto = armazenamento.getItem(CHAVE_NUMERO_CLIENTE);
    if (bruto === null || !FORMATO_SALVO.test(bruto)) return null;
    const salvo = Number(bruto);
    return numeroValido(salvo) ? salvo : null;
  } catch {
    return null;
  }
}

export interface OpcoesNumeroCliente {
  /** Endereço que incrementa o contador e devolve { value: número }. */
  url: string;
  armazenamento: Armazenamento;
  buscar?: typeof fetch;
  tempoLimiteMs?: number;
}

/**
 * Devolve o número já salvo desta pessoa ou pede o próximo ao contador.
 * Sem rede, contador fora do ar ou demora: devolve null e o pedido segue sem número.
 */
export async function obterNumeroCliente({
  url,
  armazenamento,
  buscar = fetch,
  tempoLimiteMs = TEMPO_LIMITE_MS,
}: OpcoesNumeroCliente): Promise<number | null> {
  const salvo = lerNumeroSalvo(armazenamento);
  if (salvo !== null) return salvo;

  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), tempoLimiteMs);
  try {
    const resposta = await buscar(url, { signal: controle.signal, cache: 'no-store' });
    if (!resposta.ok) return null;
    const corpo: unknown = await resposta.json();
    const valor = typeof corpo === 'object' && corpo !== null ? (corpo as { value?: unknown }).value : undefined;
    if (!numeroValido(valor)) return null;
    try {
      armazenamento.setItem(CHAVE_NUMERO_CLIENTE, String(valor));
    } catch {
      // Sem armazenamento o número vale só para este pedido.
    }
    return valor;
  } catch {
    return null;
  } finally {
    clearTimeout(relogio);
  }
}
