# Chef Carlos Jr · Ceia de Natal (2.0)

Site das ceias de Natal do Chef Carlos Jr, focado só na encomenda da ceia.
Publicado em **https://carlosserra-a11y.github.io/Chef-Carlos2.0/**.

React 19 · Vite 8 · Tailwind CSS 4 · Motion · TypeScript.

## O que tem no site

- **Intro** em verde-pinheiro e dourado: a assinatura oficial do Chef é escrita com brilho dourado, neve dourada que reage ao toque/mouse (com faíscas), logo com inclinação 3D, contagem regressiva para o Natal e botão "Entrar no cardápio" (cerca de 6 s, uma vez por visita; "Pular"; respeita "reduzir movimento").
- **Hero** focado na ceia, com os três valores clicáveis e parallax.
- **As três ceias** (R$ 599,90 · R$ 999,90 · R$ 1.399,90), cada uma com o **cardápio oficial com quantidades** (proteínas, acompanhamentos, sobremesas e finalização), fotos, ilustração da composição da mesa e **adicionais**.
- Ceias de **até 4, de 6 a 8 e de 10 a 12 pessoas**; para mais convidados o cliente pede outra ceia ou adicionais (o carrinho mostra quantas pessoas o pedido serve).
- **Pagamento**: PIX, débito ou crédito; 50% na hora do pedido e 50% na entrega. O carrinho e a mensagem do WhatsApp já mostram os dois valores (`PAGAMENTO_FORMAS` e `PAGAMENTO_CONDICOES` em `menuData.ts`).
- **Aviso de cookies e privacidade** (Aceitar/Recusar; reabre pelo rodapé): o site não usa cookies de rastreamento; recusar apaga o carrinho e o número salvos e deixa de guardá-los.
- **Brinde**: bolsa térmica Chef Carlos Jr em todo pedido (seção própria, aviso em cada ceia, no carrinho e na mensagem do WhatsApp).
- **Como encomendar** em 4 passos.
- **Pedidos até 20/12/2026; entrega no dia 24/12, a partir das 12h, com rastreio** (o carrinho não pede data nem convidados e bloqueia o envio depois do prazo).
- **Total ao vivo**: cada adicional escolhido soma na hora ao valor da ceia (no painel da ceia e em cada item do carrinho).
- **Carrinho** com adicionais editáveis e formulário que monta a mensagem e abre o WhatsApp oficial (+55 48 99683-5439).
- **Número do cliente na comanda**: cada pessoa nova que envia um pedido recebe o próximo número (1, 2, 3…), que vai na mensagem como `*Cliente nº N:* Nome` e aparece para o cliente na tela de pedido enviado. A mesma pessoa (mesmo navegador) mantém o número nos pedidos seguintes. Como o site é estático, a sequência vem de um contador público gratuito ([abacus](https://jasoncameron.dev/abacus/)); se ele estiver fora do ar, o pedido sai normalmente, só sem o número. Quantos clientes já foram numerados: <https://abacus.jasoncameron.dev/get/chef-carlos-jr/clientes-natal-2026> (em desenvolvimento o site usa a chave `clientes-teste`). O número é um apoio para organizar os pedidos, não uma identificação segura: quem limpar o navegador ou usar outro aparelho recebe um número novo, então o Chef continua confirmando cada pedido pelo nome e pelo telefone do WhatsApp.

## Como alterar conteúdo

Tudo fica em `src/data/menuData.ts`:

- **Valores e cardápio das ceias**: campos `preco` e `cardapio` em `CEIAS` (`composicao` define as peças da ilustração).
- **Brinde**: `BRINDE_TEXTO` e `BRINDE_FOTO`.
- **Prazo e entrega**: `PRAZO_PEDIDOS_ISO`, `PRAZO_PEDIDOS_TEXTO` e `ENTREGA_TEXTO`.
- **Fotos de cada ceia**: lista `fotos` (`nome` do arquivo em `public/assets/fotos/`, `legenda` e `ilustrativa: true` para imagens criadas).
- **Adicionais**: `EXTRAS` (nome, porção, `preco` e `descricao` opcional). Os preços somam no total do pedido.
- **Logo**: desenho oficial em `public/assets/logo-chef-carlos.png` (preta + "GASTRONOMIA" prata) e `logo-chef-carlos-clara.png` (branca, para fundos escuros).

## Segurança

- **Política de segurança (CSP) com Trusted Types** na página publicada (`vite.config.ts`): o site só carrega arquivos dele mesmo, só se conecta ao contador de clientes e bloqueia injeção de scripts/HTML. Se um dia precisar de outro serviço externo, ele tem que ser liberado ali.
- **Sem terceiros carregando conteúdo**: as fontes são servidas pelo próprio site (`@fontsource`), sem Google Fonts; `referrer` desligado para WhatsApp, Instagram e contador.
- **Anti-clickjacking**: dentro de um iframe de outro site, a página mostra só um link para abrir o site direto (o GitHub Pages não permite o cabeçalho `X-Frame-Options`).
- **Comanda protegida**: nome, endereço e observações viram uma linha simples, sem quebras, caracteres invisíveis/de direção de texto ou marcas de formatação do WhatsApp, então ninguém forja linhas como "*Total:* R$ 1,00"; o nome precisa ter letras e o endereço letras ou números. Mesmo assim o cliente pode editar a mensagem antes de enviar: **o Chef sempre confere o total pela tabela de preços e não toca em links que vierem dentro de um pedido**.
- **Dados pessoais**: nome e endereço não ficam salvos no navegador nem passam por servidor; vão só na mensagem do WhatsApp. O navegador guarda apenas o carrinho e o número do cliente.
- **Publicação**: actions fixadas por commit, permissões mínimas por job, `npm ci --ignore-scripts`, assinaturas do npm verificadas e `npm audit` bloqueando o deploy se houver vulnerabilidade alta. O Dependabot (`.github/dependabot.yml`) propõe atualizações semanais, só de versões com 7+ dias, e cada proposta passa pela mesma verificação (auditoria, lint, testes e build) antes de poder ser aceita; nada é publicado sem passar por ela.
- **Endereço principal: https://ceiachefcarlos.netlify.app** (Netlify, ligada a este repositório: cada push na `main` publica lá também). Lá o site tem endereço só dele e cabeçalhos HTTP de segurança de verdade (arquivo `_headers` gerado no build: CSP com `frame-ancestors`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`). É esse o link para divulgar.
- **Endereço compartilhado no GitHub Pages**: em `carlosserra-a11y.github.io` todos os sites da conta dividem a mesma origem para o navegador, e um script de terceiros comprometido em outro desses sites poderia mexer neste. Por isso o endereço principal é o da Netlify.
- **Prévia do link** (WhatsApp, Instagram, Facebook): imagem `public/og-ceia.jpg` (1200×630). O endereço completo de cada hospedagem entra no build (`__URL_DO_SITE__` em `index.html`).
- **HTTPS** obrigatório com HSTS (GitHub Pages) e sem source maps publicados.

## Rodar localmente

```bash
npm install
npm run dev
```

Verificações: `npm run lint` (tipos), `npm test` (lógica) e `npm run build`.

## Publicação

Cada push na `main` roda `.github/workflows/deploy-pages.yml`: auditoria de dependências, tipos, testes, build e deploy no GitHub Pages.
