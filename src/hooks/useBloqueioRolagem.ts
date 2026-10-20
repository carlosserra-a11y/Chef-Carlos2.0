import { useEffect } from 'react';

// Contador global: com intro, carrinho e outros painéis abrindo/fechando ao mesmo
// tempo, a rolagem só volta quando o último painel fecha (antes um painel fechando
// restaurava a rolagem por baixo de outro ainda aberto).
let bloqueios = 0;

export function useBloqueioRolagem(ativo: boolean): void {
  useEffect(() => {
    if (!ativo) return;
    bloqueios += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      bloqueios = Math.max(0, bloqueios - 1);
      if (bloqueios === 0) document.body.style.overflow = '';
    };
  }, [ativo]);
}
