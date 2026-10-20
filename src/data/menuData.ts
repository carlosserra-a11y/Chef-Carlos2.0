// Conteúdo oficial: contatos, as três ceias (valores) e os extras do personalizador.
// As fotos ficam em public/assets/fotos/<nome>.webp (+ <nome>-thumb.webp).
import type { Ceia, Extra } from '../types.ts';

/** WhatsApp oficial do Chef: +55 48 99683-5439 (formato internacional, só dígitos). */
export const WHATSAPP_NUMERO = '5548996835439';
export const WHATSAPP_EXIBICAO = '+55 48 99683-5439';
export const INSTAGRAM_URL = 'https://www.instagram.com/chefcarlosjr_gastronomia/';
export const INSTAGRAM_USUARIO = '@chefcarlosjr_gastronomia';

const base = import.meta.env.BASE_URL;
export const foto = (nome: string): string => `${base}assets/fotos/${nome}.webp`;
export const miniatura = (nome: string): string => `${base}assets/fotos/${nome}-thumb.webp`;
export const TEXTURA_MARMORE = `${base}assets/textura-marmore.webp`;
/** Logotipo oficial (desenho original): preto + "GASTRONOMIA" prata para fundos claros. */
export const LOGO_URL = `${base}assets/logo-chef-carlos.png`;
/** Mesma arte em branco + "GASTRONOMIA" prata, para fundos escuros. */
export const LOGO_CLARA_URL = `${base}assets/logo-chef-carlos-clara.png`;

export const CEIAS: Ceia[] = [
  {
    id: 'ceia-4',
    nome: 'Ceia até 4 pessoas',
    pessoas: 'até 4 pessoas',
    maxPessoas: 4,
    preco: 599.9,
    resumo: 'A ceia íntima: o essencial do Natal, com o acabamento de alta gastronomia do Chef.',
    itens: [
      'Chester fatiado ao mel e ervas',
      'Arroz festivo',
      'Farofa de castanhas',
      'Salpicão defumado',
      'Pudim artesanal',
    ],
    composicao: { 'chester-inteiro': 1, arroz: 1, farofa: 1, salpicao: 1, pudim: 1 },
    fotos: [
      { nome: 'CEIA4_01', legenda: 'A mesa completa da ceia para 4 pessoas' },
      { nome: 'CEIA4_02', legenda: 'Chester assado com laranja, uvas e alecrim' },
      { nome: 'CEIA4_03', legenda: 'Chester dourado, assado lentamente' },
      { nome: 'CEIA4_04', legenda: 'Chester, arroz festivo e saladas' },
      { nome: 'CEIA4_05', legenda: 'Arroz festivo e sobremesa' },
      { nome: 'CEIA4_06', legenda: 'Sobremesa da ceia' },
      { nome: 'CEIA4_07', legenda: 'Saladas e farofa crocante' },
      { nome: 'CEIA4_08', legenda: 'Chester servido na travessa' },
    ],
  },
  {
    id: 'ceia-6-8',
    nome: 'Ceia de 6 a 8 pessoas',
    pessoas: '6 a 8 pessoas',
    maxPessoas: 8,
    preco: 999.99,
    destaque: 'Mais pedida',
    resumo: 'Chester inteiro laqueado como centro de mesa, com quiche francesa e saladas clássicas.',
    itens: [
      'Chester inteiro laqueado',
      'Quiche francesa de brie e alho-poró',
      'Salada Waldorf',
      'Salpicão',
      'Pudim artesanal',
    ],
    composicao: { 'chester-inteiro': 1, quiche: 1, waldorf: 1, salpicao: 1, pudim: 1 },
    fotos: [
      { nome: 'IMG_2288', legenda: 'Quiche francesa artesanal' },
      { nome: 'IMG_7063', legenda: 'Saladas de folhas nobres' },
      { nome: 'IMG_6346', legenda: 'Pudim artesanal' },
    ],
  },
  {
    id: 'ceia-10-12',
    nome: 'Ceia de 10 a 12 pessoas',
    pessoas: '10 a 12 pessoas',
    maxPessoas: 12,
    preco: 1399,
    destaque: 'Mesa completa',
    resumo: 'O banquete completo: dois Chesters inteiros, quiches, todas as saladas e três sobremesas.',
    itens: [
      '2 Chesters inteiros',
      'Mesa completa com quiches',
      'Todas as saladas (salpicão e Waldorf)',
      'Pavê de chocolate belga',
      'Cheesecake de frutas vermelhas',
      'Pudim artesanal',
    ],
    composicao: { 'chester-inteiro': 2, quiche: 2, salpicao: 1, waldorf: 1, pave: 1, cheesecake: 1, pudim: 1 },
    fotos: [
      { nome: 'IMG_7326', legenda: 'Mesa completa montada pela equipe' },
      { nome: 'IMG_2292', legenda: 'Sobremesas da mesa' },
      { nome: 'IMG_2288', legenda: 'Quiche francesa' },
    ],
  },
];

/** Porções adicionais do personalizador. Sem `preco`, o valor é combinado no WhatsApp. */
export const EXTRAS: Extra[] = [
  { id: 'chester', nome: 'Chester inteiro extra', porcao: '1 unidade laqueada' },
  { id: 'chester-fatiado', nome: 'Chester fatiado ao mel e ervas', porcao: 'porção extra' },
  { id: 'farofa', nome: 'Farofa de castanhas', porcao: 'porção extra' },
  { id: 'arroz', nome: 'Arroz festivo', porcao: 'porção extra' },
  { id: 'salpicao', nome: 'Salpicão defumado', porcao: 'porção extra' },
  { id: 'waldorf', nome: 'Salada Waldorf', porcao: 'porção extra' },
  { id: 'quiche', nome: 'Quiche de brie e alho-poró', porcao: '1 quiche inteira' },
  { id: 'pudim', nome: 'Pudim artesanal', porcao: '1 unidade' },
  { id: 'pave', nome: 'Pavê de chocolate belga', porcao: '1 travessa' },
  { id: 'cheesecake', nome: 'Cheesecake de frutas vermelhas', porcao: '1 unidade' },
];
