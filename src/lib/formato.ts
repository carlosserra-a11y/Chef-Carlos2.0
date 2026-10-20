const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatarBRL(valor: number): string {
  return BRL.format(valor);
}

export function formatarKg(kg: number): string {
  return `${kg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}
