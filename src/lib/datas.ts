// Contagem regressiva usada na intro (ex.: dias até o Natal).

const DATA_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
const DIA_MS = 86_400_000;

/** Dias inteiros de `hoje` (data local) até `alvoIso` (aaaa-mm-dd); zero no dia e depois dele. */
export function diasAte(alvoIso: string, hoje: Date): number {
  const m = DATA_ISO.exec(alvoIso);
  if (!m) return 0;
  const alvo = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.max(0, Math.round((alvo.getTime() - inicio.getTime()) / DIA_MS));
}
