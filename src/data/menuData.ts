// Conteúdo oficial: contatos, as três ceias (valores e cardápio) e os adicionais.
// As fotos ficam em public/assets/fotos/<nome>.webp (+ <nome>-thumb.webp).
import type { Ceia, Extra } from '../types.ts';
import { CONTADOR_ORIGEM } from './contador.ts';

/** WhatsApp oficial do Chef: +55 48 99683-5439 (formato internacional, só dígitos). */
export const WHATSAPP_NUMERO = '5548996835439';
export const WHATSAPP_EXIBICAO = '+55 48 99683-5439';
export const INSTAGRAM_URL = 'https://www.instagram.com/chefcarlosjr_gastronomia/';
export const INSTAGRAM_USUARIO = '@chefcarlosjr_gastronomia';

/** Prazo de encomenda e entrega fixa das ceias de Natal. */
export const PRAZO_PEDIDOS_ISO = '2026-12-20';
export const PRAZO_PEDIDOS_TEXTO = 'Pedidos até 20/12/2026';
export const ENTREGA_TEXTO = '24/12, a partir das 12h, com rastreio de entrega';

/** Brinde que acompanha todo pedido de ceia. */
export const BRINDE_TEXTO = 'Bolsa térmica Chef Carlos Jr';
export const BRINDE_FOTO = 'BOLSA_BRINDE';

/** Pagamento: formas aceitas e divisão (50% no pedido, 50% na entrega). */
export const PAGAMENTO_FORMAS = 'PIX, débito ou crédito';
export const PAGAMENTO_CONDICOES = '50% na hora do pedido e 50% na entrega das ceias';

/**
 * Contador público que dá a cada cliente novo o próximo número (1, 2, 3…) na comanda do WhatsApp.
 * Em desenvolvimento usa outra chave, para os testes não gastarem a numeração real.
 * Quantos clientes já foram numerados: https://abacus.jasoncameron.dev/get/chef-carlos-jr/clientes-natal-2026
 */
const CONTADOR_BASE = `${CONTADOR_ORIGEM}/hit/chef-carlos-jr`;
export const CONTADOR_CLIENTES_URL = `${CONTADOR_BASE}/${import.meta.env.DEV ? 'clientes-teste' : 'clientes-natal-2026'}`;

const base = import.meta.env.BASE_URL;
export const foto = (nome: string): string => `${base}assets/fotos/${nome}.webp`;
export const miniatura = (nome: string): string => `${base}assets/fotos/${nome}-thumb.webp`;
export const TEXTURA_MARMORE = `${base}assets/textura-marmore.webp`;
/** Logotipo oficial (desenho original): preto + "GASTRONOMIA" prata para fundos claros. */
export const LOGO_URL = `${base}assets/logo-chef-carlos.png`;
/** Mesma arte em branco + "GASTRONOMIA" prata, para fundos escuros. */
export const LOGO_CLARA_URL = `${base}assets/logo-chef-carlos-clara.png`;

const POR_PESSOA = (g: number): string => `${g} g por pessoa`;
const DECORACAO = { titulo: 'Finalização' as const, itens: [{ nome: 'Decoração com frutas' }] };

export const CEIAS: Ceia[] = [
  {
    id: 'ceia-4',
    nome: 'Ceia até 4 pessoas',
    pessoas: 'até 4 pessoas',
    maxPessoas: 4,
    preco: 599.9,
    resumo: 'Chester assado inteiro com acompanhamentos clássicos, pavê e decoração com frutas.',
    cardapio: [
      { titulo: 'Proteína', itens: [{ nome: 'Chester assado', quantidade: '1 unidade de 3 a 4 kg' }] },
      {
        titulo: 'Acompanhamentos',
        itens: [
          { nome: 'Arroz à grega', quantidade: POR_PESSOA(150) },
          { nome: 'Farofa especial', quantidade: POR_PESSOA(80) },
          { nome: 'Salpicão', quantidade: POR_PESSOA(150) },
          { nome: 'Maionese de batata', quantidade: POR_PESSOA(100) },
        ],
      },
      { titulo: 'Sobremesa', itens: [{ nome: 'Pavê', quantidade: POR_PESSOA(150) }] },
      DECORACAO,
    ],
    composicao: { 'chester-inteiro': 1, 'arroz-grega': 1, farofa: 1, salpicao: 1, maionese: 1, pave: 1, frutas: 1 },
    fotos: [
      { nome: 'CEIA4_01', legenda: 'A mesa completa da ceia para 4 pessoas', ilustrativa: true },
      { nome: 'CEIA4_02', legenda: 'Chester assado com decoração de frutas' },
      { nome: 'CEIA4_03', legenda: 'Chester dourado, assado lentamente' },
      { nome: 'CEIA4_04', legenda: 'Chester, arroz à grega e saladas' },
      { nome: 'CEIA4_05', legenda: 'Arroz à grega e pavê' },
      { nome: 'CEIA4_06', legenda: 'Pavê' },
      { nome: 'CEIA4_07', legenda: 'Maionese de batata, salada e farofa especial' },
      { nome: 'CEIA4_08', legenda: 'Chester servido na travessa' },
    ],
  },
  {
    id: 'ceia-6-8',
    nome: 'Ceia de 6 a 8 pessoas',
    pessoas: '6 a 8 pessoas',
    maxPessoas: 8,
    preco: 999.9,
    destaque: 'Mais pedida',
    resumo: 'Chester e lombo suíno à Califórnia, dois tipos de arroz, quiche e duas sobremesas.',
    cardapio: [
      {
        titulo: 'Proteínas',
        itens: [
          { nome: 'Chester assado', quantidade: '1 unidade de 3 a 4 kg' },
          { nome: 'Lombo suíno à Califórnia', quantidade: '1,5 kg' },
        ],
      },
      {
        titulo: 'Acompanhamentos',
        itens: [
          { nome: 'Arroz branco', quantidade: POR_PESSOA(150) },
          { nome: 'Arroz à grega', quantidade: POR_PESSOA(150) },
          { nome: 'Farofa especial', quantidade: POR_PESSOA(80) },
          { nome: 'Quiche', quantidade: '1 unidade de aprox. 1 kg' },
          { nome: 'Maionese de batata', quantidade: POR_PESSOA(150) },
          { nome: 'Salpicão', quantidade: POR_PESSOA(150) },
        ],
      },
      {
        titulo: 'Sobremesas',
        itens: [
          { nome: 'Pavê', quantidade: POR_PESSOA(150) },
          { nome: 'Cheesecake', quantidade: '1 unidade' },
        ],
      },
      DECORACAO,
    ],
    composicao: {
      'chester-inteiro': 1, lombo: 1, 'arroz-branco': 1, 'arroz-grega': 1, farofa: 1, quiche: 1,
      maionese: 1, salpicao: 1, pave: 1, cheesecake: 1, frutas: 1,
    },
    fotos: [
      { nome: 'CEIA68_MONTAGEM', legenda: 'Algumas preparações: Chester, quiche, arroz à grega, pavê e cheesecake', ilustrativa: true },
      { nome: 'CEIA4_02', legenda: 'Chester assado com decoração de frutas' },
      { nome: 'IMG_2288', legenda: 'Quiche' },
      { nome: 'CEIA4_05', legenda: 'Arroz à grega e pavê' },
      { nome: 'IMG_2292', legenda: 'Cheesecake' },
    ],
  },
  {
    id: 'ceia-10-12',
    nome: 'Ceia de 10 a 12 pessoas',
    pessoas: '10 a 12 pessoas',
    maxPessoas: 12,
    preco: 1399.9,
    destaque: 'Mesa completa',
    resumo: 'Dois Chesters e lombo à Califórnia, mesa completa de acompanhamentos e três sobremesas.',
    cardapio: [
      {
        titulo: 'Proteínas',
        itens: [
          { nome: 'Chester assado', quantidade: '2 unidades de 3 a 4 kg cada' },
          { nome: 'Lombo suíno à Califórnia', quantidade: '2 kg' },
        ],
      },
      {
        titulo: 'Acompanhamentos',
        itens: [
          { nome: 'Arroz branco', quantidade: POR_PESSOA(150) },
          { nome: 'Arroz à grega', quantidade: POR_PESSOA(150) },
          { nome: 'Farofa especial', quantidade: POR_PESSOA(80) },
          { nome: 'Quiche', quantidade: '1 unidade de aprox. 2 kg' },
          { nome: 'Maionese de batata', quantidade: POR_PESSOA(100) },
          { nome: 'Salada Waldorf', quantidade: POR_PESSOA(80) },
          { nome: 'Salpicão', quantidade: POR_PESSOA(100) },
        ],
      },
      {
        titulo: 'Sobremesas',
        itens: [
          { nome: 'Pavê', quantidade: POR_PESSOA(150) },
          { nome: 'Cheesecake', quantidade: '1 unidade' },
          { nome: 'Pudim', quantidade: '1 unidade' },
        ],
      },
      DECORACAO,
    ],
    composicao: {
      'chester-inteiro': 2, lombo: 1, 'arroz-branco': 1, 'arroz-grega': 1, farofa: 1, quiche: 1,
      maionese: 1, waldorf: 1, salpicao: 1, pave: 1, cheesecake: 1, pudim: 1, frutas: 1,
    },
    fotos: [
      { nome: 'CEIA1012_MONTAGEM', legenda: 'Algumas preparações: 2 Chesters, quiche, saladas e 3 sobremesas', ilustrativa: true },
      { nome: 'IMG_7326', legenda: 'Mesa completa montada pela equipe' },
      { nome: 'CEIA4_03', legenda: 'Chester assado dourado' },
      { nome: 'CEIA4_06', legenda: 'Pavê' },
      { nome: 'IMG_2292', legenda: 'Cheesecake' },
      { nome: 'IMG_6346', legenda: 'Pudim' },
    ],
  },
];

/** Adicionais com preço oficial (somados ao total do pedido). */
export const EXTRAS: Extra[] = [
  { id: 'chester', nome: 'Chester assado', porcao: '3 a 4 kg', preco: 299.9 },
  { id: 'lombo', nome: 'Lombo suíno à Califórnia', porcao: '1 kg', preco: 149.9 },
  { id: 'salmao', nome: 'Salmão com crosta de limão siciliano e parmesão', porcao: '1 kg', preco: 250 },
  { id: 'arroz-branco', nome: 'Arroz branco', porcao: '1,5 kg', preco: 39.9 },
  {
    id: 'arroz-grega', nome: 'Arroz à grega', porcao: '1,5 kg', preco: 49.9,
    descricao: 'Arroz, cenoura, uvas-passas, ervilha, milho, presunto, queijo e tempero verde',
  },
  {
    id: 'farofa', nome: 'Farofa especial', porcao: '1 kg', preco: 29.9,
    descricao: 'Farinha de mandioca, flocão de milho, bacon, frutas cristalizadas e batata palha',
  },
  { id: 'maionese', nome: 'Maionese de batata', porcao: '1 kg', preco: 49.9 },
  {
    id: 'salpicao', nome: 'Salpicão', porcao: '1 kg', preco: 89.9,
    descricao: 'Frango desfiado, pimentão, milho, ervilha, salsa, maçã e maionese. Acompanha batata palha à parte',
  },
  { id: 'waldorf', nome: 'Salada Waldorf', porcao: '800 g', preco: 59.9 },
  { id: 'quiche', nome: 'Quiche de peito de peru', porcao: '1 kg', preco: 119.9 },
  { id: 'quiche-queijos', nome: 'Quiche quatro queijos', porcao: '1 kg', preco: 119.9 },
  { id: 'pave', nome: 'Pavê de chocolate meio amargo com creme de baunilha', porcao: '1 kg', preco: 99.9 },
  { id: 'cheesecake', nome: 'Cheesecake de frutas vermelhas', porcao: '1,5 kg', preco: 159.9 },
  { id: 'pudim', nome: 'Pudim', porcao: '1 kg', preco: 89.9 },
];
