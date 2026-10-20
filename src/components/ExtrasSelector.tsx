import { Minus, Plus } from 'lucide-react';
import { MAX_EXTRA } from '../lib/carrinho.ts';
import { formatarBRL } from '../lib/formato.ts';
import type { Extra } from '../types.ts';

type Props = {
  extras: readonly Extra[];
  valores: Readonly<Record<string, number>>;
  onAlterar: (extraId: string, quantidade: number) => void;
  escuro?: boolean;
};

/** Seletores de porções adicionais (personalizador em tempo real). */
export function ExtrasSelector({ extras, valores, onAlterar, escuro = false }: Props) {
  const texto = escuro ? 'text-carrara' : 'text-tinta';
  const sub = escuro ? 'text-carrara/55' : 'text-pedra';
  const linha = escuro ? 'border-white/10' : 'border-linho';
  const botao = escuro
    ? 'border-white/20 text-carrara hover:border-ouro hover:text-ouro'
    : 'border-linho text-tinta hover:border-ouro-escuro hover:text-ouro-escuro';

  return (
    <ul className="divide-y" aria-label="Porções extras">
      {extras.map((extra) => {
        const qtd = valores[extra.id] ?? 0;
        const preco = extra.preco === undefined ? 'valor sob consulta' : formatarBRL(extra.preco);
        return (
          <li key={extra.id} className={`flex items-center justify-between gap-3 py-2.5 ${linha}`}>
            <div className="min-w-0">
              <p className={`truncate text-sm font-medium ${texto}`}>{extra.nome}</p>
              <p className={`text-xs ${sub}`}>
                {extra.porcao} · {preco}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => onAlterar(extra.id, qtd - 1)}
                disabled={qtd === 0}
                aria-label={`Remover uma porção de ${extra.nome}`}
                className={`grid size-8 place-items-center rounded-full border transition disabled:opacity-30 ${botao}`}
              >
                <Minus className="size-3.5" aria-hidden="true" />
              </button>
              <output
                aria-live="polite"
                aria-label={`${qtd} porções de ${extra.nome}`}
                className={`w-6 text-center text-sm font-semibold tabular-nums ${qtd > 0 ? 'text-ouro' : sub}`}
              >
                {qtd}
              </output>
              <button
                type="button"
                onClick={() => onAlterar(extra.id, qtd + 1)}
                disabled={qtd >= MAX_EXTRA}
                aria-label={`Adicionar uma porção de ${extra.nome}`}
                className={`grid size-8 place-items-center rounded-full border transition disabled:opacity-30 ${botao}`}
              >
                <Plus className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
