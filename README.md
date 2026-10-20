# Chef Carlos Jr · Ceia de Natal (2.0)

Site das ceias de Natal do Chef Carlos Jr, focado só na encomenda da ceia.
Publicado em **https://carlosserra-a11y.github.io/Chef-Carlos2.0/**.

React 19 · Vite 8 · Tailwind CSS 4 · Motion · TypeScript.

## O que tem no site

- **Intro** ao abrir o site: "Chef Carlos" escrito à mão em dourado, com cortina de abertura (uma vez por visita; botão "Pular intro"; respeita "reduzir movimento").
- **Hero** focado na ceia, com os três valores clicáveis e parallax.
- **As três ceias** (R$ 599,90 · R$ 999,99 · R$ 1.399,00), cada uma com fotos, ilustração da composição da mesa e **adicionais**.
- Cada ceia atende **até 12 pessoas**; para mais convidados o cliente adiciona outra ceia ao pedido (o formulário avisa).
- **Como encomendar** em 4 passos.
- **Carrinho** com adicionais editáveis e formulário que monta a mensagem e abre o WhatsApp oficial (+55 48 99683-5439).

## Como alterar conteúdo

Tudo fica em `src/data/menuData.ts`:

- **Valores das ceias**: campo `preco` em `CEIAS`.
- **Fotos de cada ceia**: lista `fotos` (`nome` do arquivo em `public/assets/fotos/`, `legenda` e `ilustrativa: true` para imagens criadas).
- **Preço dos adicionais**: preencha `preco` no item de `EXTRAS` (ex.: `preco: 89.9`). Sem preço, entra como "valor a combinar".
- **Logo**: `public/assets/logo-chef-carlos.png` (branca com fundo transparente). Sem o arquivo, o site usa a assinatura tipográfica.

## Rodar localmente

```bash
npm install
npm run dev
```

Verificações: `npm run lint` (tipos), `npm test` (lógica) e `npm run build`.

## Publicação

Cada push na `main` roda `.github/workflows/deploy-pages.yml`: auditoria de dependências, tipos, testes, build e deploy no GitHub Pages.
