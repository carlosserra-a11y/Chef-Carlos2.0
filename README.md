# Chef Carlos Jr · Ceia de Natal (2.0)

Site das ceias de Natal do Chef Carlos Jr, focado só na encomenda da ceia.
Publicado em **https://carlosserra-a11y.github.io/Chef-Carlos2.0/**.

React 19 · Vite 8 · Tailwind CSS 4 · Motion · TypeScript.

## O que tem no site

- **Intro** em verde-pinheiro e dourado: a assinatura oficial do Chef é escrita com brilho dourado, neve dourada que reage ao toque/mouse (com faíscas), logo com inclinação 3D, contagem regressiva para o Natal e botão "Entrar no cardápio" (uma vez por visita; "Pular"; respeita "reduzir movimento").
- **Hero** focado na ceia, com os três valores clicáveis e parallax.
- **As três ceias** (R$ 599,90 · R$ 999,90 · R$ 1.399,90), cada uma com o **cardápio oficial com quantidades** (proteínas, acompanhamentos, sobremesas e finalização), fotos, ilustração da composição da mesa e **adicionais**.
- Cada ceia atende **até 12 pessoas**; para mais convidados o cliente adiciona outra ceia ao pedido (o carrinho mostra quantas pessoas o pedido serve).
- **Brinde**: bolsa térmica Chef Carlos Jr em todo pedido (seção própria, aviso em cada ceia, no carrinho e na mensagem do WhatsApp).
- **Como encomendar** em 4 passos.
- **Pedidos até 20/12/2026; entrega no dia 24/12, a partir das 12h, com rastreio** (o carrinho não pede data nem convidados e bloqueia o envio depois do prazo).
- **Carrinho** com adicionais editáveis e formulário que monta a mensagem e abre o WhatsApp oficial (+55 48 99683-5439).

## Como alterar conteúdo

Tudo fica em `src/data/menuData.ts`:

- **Valores e cardápio das ceias**: campos `preco` e `cardapio` em `CEIAS` (`composicao` define as peças da ilustração).
- **Brinde**: `BRINDE_TEXTO` e `BRINDE_FOTO`.
- **Prazo e entrega**: `PRAZO_PEDIDOS_ISO`, `PRAZO_PEDIDOS_TEXTO` e `ENTREGA_TEXTO`.
- **Fotos de cada ceia**: lista `fotos` (`nome` do arquivo em `public/assets/fotos/`, `legenda` e `ilustrativa: true` para imagens criadas).
- **Adicionais**: `EXTRAS` (nome, porção, `preco` e `descricao` opcional). Os preços somam no total do pedido.
- **Logo**: desenho oficial em `public/assets/logo-chef-carlos.png` (preta + "GASTRONOMIA" prata) e `logo-chef-carlos-clara.png` (branca, para fundos escuros).

## Rodar localmente

```bash
npm install
npm run dev
```

Verificações: `npm run lint` (tipos), `npm test` (lógica) e `npm run build`.

## Publicação

Cada push na `main` roda `.github/workflows/deploy-pages.yml`: auditoria de dependências, tipos, testes, build e deploy no GitHub Pages.
