// Escolha do visitante no aviso de cookies e privacidade (LGPD). O site não usa cookies de rastreamento
// nem de publicidade: só guarda no navegador o pedido e o número do cliente. Recusar apaga esses dados
// e o site deixa de guardá-los (a escolha em si fica salva para o aviso não voltar a cada visita).

export const CHAVE_PRIVACIDADE = 'chef-carlos-2:privacidade';

export type EscolhaPrivacidade = 'aceito' | 'recusado';

type ArmazenamentoCompleto = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const SEM_ARMAZENAMENTO: ArmazenamentoCompleto = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

/** localStorage pode estar bloqueado (modo privado, cookies desativados): sem ele, nada é guardado. */
export function armazenamentoLocal(): ArmazenamentoCompleto {
  try {
    return window.localStorage;
  } catch {
    return SEM_ARMAZENAMENTO;
  }
}

export function lerEscolhaPrivacidade(armazenamento: Pick<Storage, 'getItem'>): EscolhaPrivacidade | null {
  try {
    const valor = armazenamento.getItem(CHAVE_PRIVACIDADE);
    return valor === 'aceito' || valor === 'recusado' ? valor : null;
  } catch {
    return null;
  }
}

/** Guarda a escolha; ao recusar, apaga antes os dados do site (`chavesDoSite`). */
export function aplicarEscolhaPrivacidade(
  armazenamento: ArmazenamentoCompleto,
  escolha: EscolhaPrivacidade,
  chavesDoSite: readonly string[],
): void {
  try {
    if (escolha === 'recusado') chavesDoSite.forEach((chave) => armazenamento.removeItem(chave));
    armazenamento.setItem(CHAVE_PRIVACIDADE, escolha);
  } catch {
    // Armazenamento bloqueado: a escolha vale só nesta visita (e nada fica guardado de qualquer forma).
  }
}
