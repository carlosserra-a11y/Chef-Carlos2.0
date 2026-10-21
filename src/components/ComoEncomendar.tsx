import { ClipboardList, MessageCircle, Plus, Truck, type LucideIcon } from 'lucide-react';
import { Reveal } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

const PASSOS: { titulo: string; texto: string; Icone: LucideIcon }[] = [
  { titulo: 'Escolha o tamanho', texto: 'Até 4, de 6 a 8 ou de 10 a 12 pessoas. Para mais convidados, peça outra ceia ou adicionais.', Icone: ClipboardList },
  { titulo: 'Acrescente adicionais', texto: 'Mais Chester, farofa, quiche ou sobremesas: escolha as porções extras de cada ceia.', Icone: Plus },
  {
    titulo: 'Envie pelo WhatsApp',
    texto: 'Informe seu nome e o endereço de entrega. Na hora do pedido você paga 50% por PIX, débito ou crédito. Pedidos até 20/12/2026.',
    Icone: MessageCircle,
  },
  { titulo: 'Entrega no dia 24/12', texto: 'Sua ceia chega a partir das 12h, com rastreio de entrega. Os outros 50% são pagos na entrega.', Icone: Truck },
];

export function ComoEncomendar() {
  return (
    <section id="como-encomendar" aria-labelledby="titulo-como" className="fundo-marmore py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          id="titulo-como"
          selo="Como encomendar"
          titulo={<>Do pedido <span className="italic text-ouro-escuro">à sua mesa</span></>}
          descricao="Quatro passos simples, com atendimento pessoal do Chef do começo ao fim."
        />
        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map(({ titulo, texto, Icone }, i) => (
            <Reveal key={titulo} atraso={i * 0.1} className="h-full">
              <li className="relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
                <span className="absolute -right-2 -top-6 font-display text-[7rem] font-semibold leading-none text-linho" aria-hidden="true">
                  {i + 1}
                </span>
                <Icone className="relative size-7 text-ouro-escuro" aria-hidden="true" />
                <p className="relative mt-5 font-display text-2xl font-semibold text-tinta">{titulo}</p>
                <p className="relative mt-2 text-sm leading-relaxed text-grafite">{texto}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
