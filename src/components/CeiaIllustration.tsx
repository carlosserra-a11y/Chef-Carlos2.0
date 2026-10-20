import { motion, useReducedMotion } from 'motion/react';
import { useId, type ReactNode } from 'react';
import { TEXTURA_MARMORE } from '../data/menuData.ts';
import type { Ceia, PecaIlustracao } from '../types.ts';

// Ilustração vista de cima da mesa: cada peça desenhada corresponde a um item
// da ceia, na quantidade exata (ex.: 2 Chesters inteiros na ceia de 10 a 12).

const ROTULO: Record<PecaIlustracao, string> = {
  'chester-fatiado': 'Chester fatiado',
  'chester-inteiro': 'Chester inteiro',
  arroz: 'Arroz festivo',
  farofa: 'Farofa',
  salpicao: 'Salpicão',
  quiche: 'Quiche',
  waldorf: 'Waldorf',
  pudim: 'Pudim',
  pave: 'Pavê belga',
  cheesecake: 'Cheesecake',
};

const ORDEM: PecaIlustracao[] = ['quiche', 'arroz', 'farofa', 'salpicao', 'waldorf', 'pave', 'cheesecake', 'pudim'];
const VAGAS: [number, number][] = [
  [72, 182], [448, 182], [150, 64], [370, 64], [150, 298], [370, 298], [260, 64], [260, 298],
];

const prato = (r: number): ReactNode => (
  <>
    <circle r={r + 6} fill="#fff" stroke="#e3ddd3" strokeWidth="1.5" />
    <circle r={r} fill="#fbfaf7" stroke="#ece8e1" />
  </>
);

function Chester({ inteiro, gradiente }: { inteiro: boolean; gradiente: string }) {
  if (!inteiro) {
    return (
      <g>
        {prato(46)}
        {[-30, -15, 0, 15, 30].map((x, i) => (
          <ellipse key={x} cx={x * 0.9} cy={i % 2 ? 6 : -4} rx="15" ry="27" fill="#f0d7b5" stroke="#b9772f" strokeWidth="3" transform={`rotate(${x / 2})`} />
        ))}
        <circle cx="-26" cy="-26" r="3" fill="#5f7d3a" />
        <circle cx="24" cy="26" r="3" fill="#5f7d3a" />
      </g>
    );
  }
  return (
    <g>
      {prato(52)}
      {/* coxas apontando para baixo, com a ponta do osso aparente */}
      {[-1, 1].map((lado) => (
        <g key={lado} transform={`rotate(${lado * 22} ${lado * 20} 30)`}>
          <ellipse cx={lado * 20} cy="34" rx="12" ry="20" fill="#9c5a1b" />
          <circle cx={lado * 20} cy="55" r="4.5" fill="#f4ead8" stroke="#d8c7a8" />
        </g>
      ))}
      {/* asas recolhidas nas laterais */}
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

function Tigela({ fundo, children }: { fundo: string; children: ReactNode }) {
  return (
    <g>
      {prato(30)}
      <circle r="26" fill={fundo} />
      {children}
    </g>
  );
}

const pontos = (n: number, raio: number, cor: string, tam = 2.2): ReactNode =>
  Array.from({ length: n }, (_, i) => {
    const a = i * 2.39996;
    const d = raio * Math.sqrt((i + 0.5) / n);
    return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={tam} fill={cor} />;
  });

function Peca({ tipo, gradiente }: { tipo: PecaIlustracao; gradiente: string }) {
  switch (tipo) {
    case 'chester-inteiro':
      return <Chester inteiro gradiente={gradiente} />;
    case 'chester-fatiado':
      return <Chester inteiro={false} gradiente={gradiente} />;
    case 'arroz':
      return <Tigela fundo="#fffdf6">{pontos(40, 22, '#efe6cf', 2.4)}{pontos(7, 18, '#e07a3a', 2.4)}{pontos(6, 20, '#6d9b3a', 2.4)}</Tigela>;
    case 'farofa':
      return <Tigela fundo="#d8b47c">{pontos(36, 22, '#b88a4a', 2)}{pontos(6, 16, '#7a4b22', 3.6)}</Tigela>;
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
          {pontos(18, 18, '#3b2014', 2.4)}
          {pontos(6, 14, '#f3e6cf', 2.4)}
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
  }
}

type Props = { ceia: Ceia };

export function CeiaIllustration({ ceia }: Props) {
  const reduzir = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const ids = { laqueado: `laqueado-${uid}`, mesa: `mesa-${uid}`, sombra: `sombra-${uid}` };
  const chesters = (ceia.composicao['chester-inteiro'] ?? 0) + (ceia.composicao['chester-fatiado'] ?? 0);
  const tipoChester: PecaIlustracao = ceia.composicao['chester-inteiro'] ? 'chester-inteiro' : 'chester-fatiado';
  const centros: [number, number][] = chesters === 2 ? [[193, 182], [327, 182]] : [[260, 182]];
  const demais = ORDEM.flatMap((tipo) => Array<PecaIlustracao>(ceia.composicao[tipo] ?? 0).fill(tipo));
  const pecas = [
    ...centros.slice(0, chesters).map((pos) => ({ tipo: tipoChester, pos })),
    ...demais.map((tipo, i) => ({ tipo, pos: VAGAS[i] })),
  ];
  return (
    <svg viewBox="0 0 520 370" className="h-auto w-full" role="img" aria-label={`Composição da ${ceia.nome}: ${ceia.itens.join(', ')}`}>
      <defs>
        <radialGradient id={ids.laqueado} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#e7a85a" />
          <stop offset="60%" stopColor="#b8691f" />
          <stop offset="100%" stopColor="#7c4012" />
        </radialGradient>
        <clipPath id={ids.mesa}>
          <rect x="6" y="6" width="508" height="358" rx="28" />
        </clipPath>
        <filter id={ids.sombra} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1d1b18" floodOpacity="0.18" />
        </filter>
      </defs>
      <g clipPath={`url(#${ids.mesa})`}>
        <image href={TEXTURA_MARMORE} x="0" y="0" width="560" height="380" preserveAspectRatio="xMidYMid slice" />
        <rect x="6" y="6" width="508" height="358" fill="#fff" opacity="0.25" />
      </g>
      <rect x="6" y="6" width="508" height="358" rx="28" fill="none" stroke="#d9d2c6" strokeWidth="2" />
      {pecas.map(({ tipo, pos: [x, y] }, i) => (
        <motion.g
          key={`${ceia.id}-${tipo}-${i}`}
          initial={reduzir ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 * i, type: 'spring', stiffness: 220, damping: 18 }}
          style={{ x, y }}
        >
          <g filter={`url(#${ids.sombra})`}>
            <Peca tipo={tipo} gradiente={ids.laqueado} />
          </g>
          <text
            y={tipo.startsWith('chester') ? 72 : 48}
            textAnchor="middle"
            className="fill-grafite font-sans text-[11px] font-semibold"
          >
            {ROTULO[tipo]}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
