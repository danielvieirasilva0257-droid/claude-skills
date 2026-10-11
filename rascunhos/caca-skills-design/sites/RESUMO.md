# Resumo: skills para fazer sites com IA (11/10/2026)

Daniel, você pediu pelo menos 5 skills de IA para fazer sites, além das de design que já temos, e uma base de referência de sites no GitHub. Dois agentes pesquisaram ao mesmo tempo: um no catálogo de skills, outro na web. Aqui está o resultado. **Nada foi salvo no repositório ainda.**

## O que precisa da sua aprovação

1. **Uma categoria nova: `skills/sites/`** (o manual exige o seu "sim" para categoria nova).
2. **As skills abaixo**, numeradas. Você pode aprovar todas ou só algumas.
3. **O combo `combo-site-premium`** (o passo a passo do site do zero).

Como responder: "pode salvar tudo", ou os números ("pode salvar 1 a 6 e o combo"), ou o que mudar antes.

## As skills (8 de fora + 1 nossa)

Todas as de fora são de autores oficiais ou muito conhecidos, de 2026, e têm licença que permite copiar. Elas entram **sem mudar nada**. O que é nosso (regras, cuidados, português) fica num arquivo de anotações ao lado.

| # | Skill | Para que serve, em uma frase | De quem | Licença |
|---|---|---|---|---|
| 1 | **referencia-sites** (nossa) | A base de referência: lista de modelos de sites com o link, a licença e quando usar cada um | nossa | — |
| 2 | **site-architecture** | Planejar o site antes do código: que páginas fazer, o menu e um mapa do site em desenho | Corey Haines (o mesmo da `copywriting`) | MIT |
| 3 | **shadcn** | Montar as peças do site (botões, formulários, menus) já com as cores e fontes do nosso `DESIGN.md` | shadcn/ui (oficial) | MIT |
| 4 | **vercel-react-best-practices** | Fazer o código do site ficar rápido: 70 regras com exemplo "errado → certo" | Vercel | MIT |
| 5 | **cro** | Fazer a página vender mais: título, botão de ação, provas, formulário | Corey Haines | MIT |
| 6 | **webapp-testing** | Abrir o site num navegador, tirar prints no celular e no computador, clicar e achar erros | Anthropic | Apache-2.0 |
| 7 | **web-quality** (pacote de 6) | Revisão final: velocidade, acessibilidade, SEO no código e segurança | Addy Osmani (Google Chrome) | MIT |
| 8 | **deploy-to-vercel** | Colocar o site no ar: primeiro um link de teste, depois o oficial | Vercel | MIT |
| 9 | **seo-audit** | Depois que o site está no ar: por que não aparece no Google e como melhorar | Corey Haines | MIT |

**Como elas se juntam com as de design que já temos:** o visual continua vindo da `ui-ux-pro-max` e da `estilos-premium` (o `DESIGN.md`), e a animação da `motion-oficial` e da `button-animation`, sempre com as suas 4 regras de composição. As skills novas cuidam do resto: planejar, construir, testar, revisar e publicar.

## A base de referência de sites (skill 1)

- É um **índice**, não um depósito de código. Para cada coleção ela diz: link, licença, tecnologia, estilo e **quando usar** (landing, portfólio, site com blog, sistema com login, loja).
- **8 modelos favoritos**, todos com licença livre (MIT), ficam numa lista travada na versão certa. Exemplos: Launch UI (landing), portfólio do Magic UI, AstroWind (site com blog), SaaS Starter e Commerce (da Vercel).
- Um **programa pequeno** baixa um modelo **para a pasta do projeto do site** quando precisar. Ele se recusa a baixar para a `main`, para o repositório não ficar pesado. Testei no container e funcionou.
- **O que é pago ou restrito fica só como link**, para olhar: Tailwind Plus, Magic UI Pro, Aceternity, Cruip, React Bits, entre outros. A skill explica cada licença em uma frase.
- **Refero:** só pelo caminho oficial, que já está descrito na `estilos-premium` (a skill grátis deles e o MCP pago). Nada copiado do site.

## O combo `combo-site-premium` (o passo a passo)

Briefing → mapa do site → texto → `DESIGN.md` e modelo → peças (shadcn) → código, uma parte por vez → animação → página que vende → prints e testes → revisão de qualidade → link de teste → site no ar → SEO.

Você aprova em **5 momentos**: o mapa, o texto, o `DESIGN.md` com o modelo, os prints, e a hora de colocar no ar.

## Cuidados importantes (em palavras simples)

- **Vercel grátis é só para uso pessoal.** Site de cliente precisa do plano pago. Eu aviso antes.
- **Nada vai para o ar, nem é enviado, sem o seu "sim".** A skill de publicar tem uma opção "sem login" que envia o projeto para um servidor da Vercel: só com a sua aprovação.
- **A skill do shadcn roda um comando sozinha** quando é aberta. Por isso ela só é usada dentro da pasta do projeto do site.
- **Para ver o site, preciso instalar um navegador de testes** (Playwright) no container. Hoje ele não está instalado.
- **Uma das licenças da Vercel** está escrita só na página do projeto, não num arquivo próprio. Anotei isso. É MIT do mesmo jeito.
- **O combo ainda não foi usado num site de verdade.** No primeiro site, eu anoto o que funcionou e o que precisou mudar.

## O que ficou de fora (só como referência)

- Skills boas, mas que não fazem falta agora, ou que dependem de outras coisas: as do Next.js, a de desempenho da Cloudflare, a de testes avançados com Playwright, a do Astro e as de analytics e dados estruturados.
- Uma skill repetida por 4 donos diferentes, com cara de cópia: descartada.

## Conferido

- As 8 cópias são iguais às originais (comparação arquivo por arquivo).
- As licenças foram lidas nos arquivos.
- O cabeçalho de todas as skills foi lido sem erro.
- O programa `npx skills` achou as 15 skills da proposta (as 9, contando o pacote como 6, mais o combo).
- O programa da base de referência foi testado.
