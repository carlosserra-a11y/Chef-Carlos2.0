// Abre o WhatsApp com a comanda do pedido, numerando o cliente novo sem cair no bloqueio de pop-up.

/** O que o envio usa de uma aba do navegador (a janela devolvida por window.open atende a este formato). */
export interface AbaNavegador {
  closed: boolean;
  opener: unknown;
  location: { href: string };
  document?: { title: string; body: { textContent: string | null } | null };
}

export interface OpcoesEnvio {
  /** Número já salvo deste cliente, ou null se ele ainda não tem. */
  numeroSalvo: number | null;
  abrir: (url: string, alvo: string, recursos?: string) => AbaNavegador | null;
  /** Plano B quando o pop-up é bloqueado: leva a própria página ao WhatsApp. */
  irPara: (url: string) => void;
  obterNumero: () => Promise<number | null>;
  montarLink: (numeroCliente: number | null) => string;
}

export type ResultadoEnvio = { enviado: true; numero: number | null } | { enviado: false };

const AGUARDE = 'Abrindo o WhatsApp do Chef Carlos Jr…';

function mostrarAguarde(aba: AbaNavegador): void {
  try {
    if (!aba.document) return;
    aba.document.title = AGUARDE;
    if (aba.document.body) aba.document.body.textContent = AGUARDE;
  } catch {
    // Só um aviso visual: se o navegador não deixar escrever na aba, ela fica em branco até o WhatsApp abrir.
  }
}

/**
 * Cliente com número salvo: abre o WhatsApp na hora. Cliente novo: a aba abre já no clique
 * (depois da espera pelo número o navegador bloquearia o pop-up) e só então recebe o link numerado.
 * Se o cliente fechar essa aba durante a espera, o envio é cancelado.
 */
export async function enviarPedidoWhatsApp(opcoes: OpcoesEnvio): Promise<ResultadoEnvio> {
  const { numeroSalvo, abrir, irPara, obterNumero, montarLink } = opcoes;
  if (numeroSalvo !== null) {
    abrir(montarLink(numeroSalvo), '_blank', 'noopener,noreferrer');
    return { enviado: true, numero: numeroSalvo };
  }

  const aba = abrir('', '_blank');
  if (aba) {
    aba.opener = null;
    mostrarAguarde(aba);
  }
  let numero: number | null;
  try {
    numero = await obterNumero();
  } catch {
    numero = null; // sem número o pedido segue do mesmo jeito
  }
  if (aba?.closed) return { enviado: false };
  const link = montarLink(numero);
  if (aba) aba.location.href = link;
  else irPara(link);
  return { enviado: true, numero };
}
