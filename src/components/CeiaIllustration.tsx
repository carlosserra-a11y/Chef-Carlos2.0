import { motion, useReducedMotion } from 'motion/react';
import { useId, type ReactNode } from 'react';
import { TEXTURA_MARMORE } from '../data/menuData.ts';
import type { Ceia, PecaIlustracao } from '../types.ts';

// Ilustração vista de cima da mesa: cada peça desenhada corresponde a um item
// do cardápio da ceia, na quantidade exata (ex.: 2 Chesters na ceia de 10 a 12).

const W = 640;
const H = 450;

const ROTULO: Record<PecaIlustracao, string> = {
  'chester-inteiro': 'Chester assado',
  lombo: 'Lombo à Califórnia',
  'arroz-branco': 'Arroz branco',
  'arroz-grega': 'Arroz à grega',
  farofa: 'Farofa especial',
  quiche: 'Quiche',
  maionese: 'Maionese',
  salpicao: 'Salpicão',
  waldorf: 'Waldorf',
  pave: 'Pavê',
  cheesecake: 'Cheesecake',
  pudim: 'Pudim',
  frutas: 'Frutas',
};

const CENTRAIS: PecaIlustracao[] = ['chester-inteiro', 'lombo'];
const ORDEM: PecaIlustracao[] = [
  'arroz-branco', 'arroz-grega', 'farofa', 'quiche', 'maionese', 'salpicao', 'waldorf',
  'pave', 'cheesecake', 'pudim', 'frutas',
];

const prato = (r: number): ReactNode => (
  <>
    <circle r={r + 6} fill="#fff" stroke="#e3ddd3" strokeWidth="1.5" />
    <circle r={r} fill="#fbfaf7" stroke="#ece8e1" />
  </>
);

const pontos = (n: number, raio: number, cor: string, tam = 2.2): ReactNode =>
  Array.from({ length: n }, (_, i) => {
    const a = i * 2.39996;
    const d = raio * Math.sqrt((i + 0.5) / n);
    return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={tam} fill={cor} />;
  });

function Chester({ gradiente }: { gradiente: string }) {
  return (
    <g>
      {prato(52)}
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`rotate(${lado * 22} ${lado * 20} 30)`}>
          <ellipse cx={lado * 20} cy="34" rx="12" ry="20" fill="#9c5a1b" />
          <circle cx={lado * 20} cy="55" r="4.5" fill="#f4ead8" stroke="#d8c7a8" />
        </g>
      ))}
      <ellipse cx="-38" cy="-6" rx="9" ry="16" fill="#a8641f" transform="rotate(18 -38 -6)" />
      <ellipse cx="38" cy="-6" rx="9" ry="16" fill="#a8641f" transform="rotate(-18 38 -6)" />
      <ellipse cy="-4" rx="36" ry="42" fill={`url(#${gradiente})`} />
      <path d="M0 -40 V30" stroke="#7c4012" strokeWidth="1.5" opacity="0.35" />
      <ellipse cx="-12" cy="-16" rx="12" ry="18" fill="#fff" opacity="0.18" />
      {[[-18, 10], [16, 18], [20, -20], [-22, -24], [4, -32]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3.2" fill="#5f7d3a" />
      ))}
    </g>
  );
}

/** Lombo suíno à Califórnia: peça fatiada com frutas em calda (abacaxi, pêssego, ameixa). */
function Lombo() {
  return (
    <g>
      <ellipse rx="62" ry="46" fill="#fff" stroke="#e3ddd3" strokeWidth="1.5" />
      <ellipse rx="55" ry="39" fill="#fbfaf7" stroke="#ece8e1" />
      <rect x="-40" y="-16" width="62" height="30" rx="14" fill="#a65a2a" />
      <rect x="-36" y="-12" width="54" height="9" rx="4" fill="#c97a42" opacity="0.7" />
      {[24, 36].map((x) => (
        <ellipse key={x} cx={x} cy="0" rx="7" ry="15" fill="#e9b7a0" stroke="#a65a2a" strokeWidth="3" />
      ))}
      {[[-30, 24], [0, 26], [30, -26]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r="8" fill="#f2c94c" />
          <circle cx={x} cy={y} r="3" fill="#fbfaf7" />
        </g>
      ))}
      <circle cx="-8" cy="-26" r="6" fill="#f0a35e" />
      <circle cx="44" cy="22" r="5" fill="#5b2346" />
      <circle cx="-46" cy="4" r="5" fill="#5b2346" />
    </g>
  );
}

function Tigela({ fundo, children }: { fundo: string; children: ReactNode }) {
  return (
    <g>
      {prato(30)}
      <circle r="26" fill={fundo} />
      {children}
    </g>
  );
}

function Peca({ tipo, gradiente }: { tipo: PecaIlustracao; gradiente: string }) {
  switch (tipo) {
    case 'chester-inteiro':
      return <Chester gradiente={gradiente} />;
    case 'lombo':
      return <Lombo />;
    case 'arroz-branco':
      return <Tigela fundo="#fffefa">{pontos(46, 22, '#efe9da', 2.2)}</Tigela>;
    case 'arroz-grega':
      return <Tigela fundo="#fffdf6">{pontos(40, 22, '#efe6cf', 2.4)}{pontos(7, 18, '#e07a3a', 2.4)}{pontos(6, 20, '#6d9b3a', 2.4)}{pontos(5, 16, '#7a3b8f', 2.2)}</Tigela>;
    case 'farofa':
      return <Tigela fundo="#d8b47c">{pontos(36, 22, '#b88a4a', 2)}{pontos(6, 16, '#7a4b22', 3.6)}</Tigela>;
    case 'maionese':
      return <Tigela fundo="#f6edc8">{pontos(12, 20, '#efe0a6', 4.2)}{pontos(7, 18, '#5f8f3a', 1.8)}{pontos(5, 16, '#e07a3a', 2)}</Tigela>;
    case 'salpicao':
      return <Tigela fundo="#f4ecd3">{pontos(14, 22, '#e7b43c', 3)}{pontos(8, 20, '#e07a3a', 2.4)}{pontos(6, 18, '#83a85a', 2.4)}</Tigela>;
    case 'waldorf':
      return <Tigela fundo="#cfe2a9">{pontos(9, 20, '#8db255', 5)}{pontos(6, 18, '#c0392b', 3.6)}{pontos(5, 14, '#8a5a2b', 3)}</Tigela>;
    case 'quiche':
      return (
        <g>
          {prato(34)}
          {Array.from({ length: 22 }, (_, i) => (
            <circle key={i} cx={Math.cos((i / 22) * Math.PI * 2) * 29} cy={Math.sin((i / 22) * Math.PI * 2) * 29} r="4.4" fill="#d9a85c" />
          ))}
          <circle r="27" fill="#f1cf7e" />
          {pontos(10, 20, '#c8902f', 3)}
          {pontos(5, 16, '#7d9b4a', 2)}
        </g>
      );
    case 'pudim':
      return (
        <g>
          {prato(30)}
          <circle r="25" fill="#b8692a" />
          <circle r="20" fill="#e8b765" />
          <circle r="8" fill="#fbfaf7" />
          <path d="M-14 -10 A17 17 0 0 1 4 -18" stroke="#fff" strokeWidth="3" fill="none" opacity="0.55" />
        </g>
      );
    case 'pave':
      return (
        <g>
          <rect x="-40" y="-28" width="80" height="56" rx="10" fill="#fff" stroke="#e3ddd3" strokeWidth="1.5" />
          <rect x="-33" y="-21" width="66" height="42" rx="6" fill="#5b3420" />
          {[-12, 0, 12].map((y) => (
            <path key={y} d={`M-30 ${y} L30 ${y}`} stroke="#f3e6cf" strokeWidth="1.6" opacity="0.8" />
          ))}
          {[-18, -6, 6, 18].map((x) => (
            <path key={x} d={`M${x} -19 L${x} 19`} stroke="#f3e6cf" strokeWidth="1.6" opacity="0.8" />
          ))}
        </g>
      );
    case 'cheesecake':
      return (
        <g>
          {prato(30)}
          <circle r="25" fill="#f3e3c3" />
          <circle r="20" fill="#a3203a" />
          {pontos(9, 15, '#6e1225', 3.4)}
          {pontos(4, 12, '#f2f2f2', 1.4)}
        </g>
      );
    case 'frutas':
      return (
        <g>
          {prato(32)}
          {[[-12, -8], [-4, -14], [-16, 2], [-8, 0], [-2, -4]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="5.2" fill="#4a2350" />
          ))}
          {[[14, 12], [2, 18]].map(([x, y]) => (
            <g key={`${x}${y}`}>
              <circle cx={x} cy={y} r="9" fill="#f39c33" />
              <circle cx={x} cy={y} r="6" fill="#f7c072" />
            </g>
          ))}
          <path d="M14 -18 q6 6 0 14 q-6 -8 0 -14" fill="#d6283b" />
          <circle cx="20" cy="-4" r="3" fill="#5f7d3a" />
        </g>
      );
  }
}

/** Distribui as peças centrais (proteínas) e as demais em fileiras acima e abaixo. */
function posicionar(ceia: Ceia): { tipo: PecaIlustracao; x: number; y: number }[] {
  const expandir = (tipos: PecaIlustracao[]) =>
    tipos.flatMap((tipo) => Array<PecaIlustracao>(ceia.composicao[tipo] ?? 0).fill(tipo));
  const centrais = expandir(CENTRAIS);
  const demais = expandir(ORDEM);
  const passo = 130;
  const inicio = W / 2 - ((centrais.length - 1) * passo) / 2;
  const meio = centrais.map((tipo, i) => ({ tipo, x: inicio + i * passo, y: H / 2 }));
  const laterais = Math.max(0, demais.length - 10);
  const fileiras = demais.length - laterais;
  const cima = Math.ceil(fileiras / 2);
  const linha = (tipos: PecaIlustracao[], y: number) =>
    tipos.map((tipo, i) => ({ tipo, x: 80 + ((W - 160) * (i + 0.5)) / tipos.length, y }));
  const lados = [{ x: 46, y: H / 2 }, { x: W - 46, y: H / 2 }];
  return [
    ...meio,
    ...linha(demais.slice(0, cima), 72),
    ...linha(demais.slice(cima, fileiras), H - 82),
    ...demais.slice(fileiras).map((tipo, i) => ({ tipo, ...lados[i] })),
  ];
}

type Props = { ceia: Ceia };

export function CeiaIllustration({ ceia }: Props) {
  const reduzir = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const ids = { laqueado: `laqueado-${uid}`, mesa: `mesa-${uid}`, sombra: `sombra-${uid}` };
  const pecas = posicionar(ceia);
  const descricao = ceia.cardapio.flatMap((g) => g.itens.map((i) => i.nome)).join(', ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Composição da ${ceia.nome}: ${descricao}`}>
      <defs>
        <radialGradient id={ids.laqueado} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#e7a85a" />
          <stop offset="60%" stopColor="#b8691f" />
          <stop offset="100%" stopColor="#7c4012" />
        </radialGradient>
        <clipPath id={ids.mesa}>
          <rect x="6" y="6" width={W - 12} height={H - 12} rx="28" />
        </clipPath>
        <filter id={ids.sombra} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1d1b18" floodOpacity="0.18" />
        </filter>
      </defs>
      <g clipPath={`url(#${ids.mesa})`}>
        <image href={TEXTURA_MARMORE} x="0" y="0" width={W + 40} height={H + 20} preserveAspectRatio="xMidYMid slice" />
        <rect x="6" y="6" width={W - 12} height={H - 12} fill="#fff" opacity="0.25" />
      </g>
      <rect x="6" y="6" width={W - 12} height={H - 12} rx="28" fill="none" stroke="#d9d2c6" strokeWidth="2" />
      {pecas.map(({ tipo, x, y }, i) => (
        <motion.g
          key={`${ceia.id}-${tipo}-${i}`}
          initial={reduzir ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.06 * i, type: 'spring', stiffness: 220, damping: 18 }}
          style={{ x, y }}
        >
          <g filter={`url(#${ids.sombra})`}>
            <Peca tipo={tipo} gradiente={ids.laqueado} />
          </g>
          <text
            y={tipo === 'chester-inteiro' ? 74 : tipo === 'lombo' ? 64 : 50}
            textAnchor="middle"
            className="fill-grafite font-sans text-[13px] font-semibold"
          >
            {ROTULO[tipo]}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
