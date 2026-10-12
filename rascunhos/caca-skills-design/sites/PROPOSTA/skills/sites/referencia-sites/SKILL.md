---
name: referencia-sites
description: "Base de referência de sites e templates com código para fazer sites com IA: índice de coleções (landing, portfólio, SaaS, loja, blog, componentes animados) com link, licença, stack, estilo e quando usar cada uma; o que pode e o que não pode ser copiado; como trazer um template para um projeto (script que baixa no commit fixado, nunca para a main); e como transformar uma referência em DESIGN.md. Use quando o pedido for 'quero um site parecido com...', 'tem algum template de landing/portfólio/loja?', 'de onde tiro um modelo de site', 'posso usar esse template?', 'qual a licença desse tema', ou no passo de referência do combo-site-premium."
---

# Referência de sites (base com código e licença)

Esta skill é **um índice**, não um depósito de código. Ela guarda **links fixados num commit**, a **licença** de cada um e **quando usar**. O código só é baixado quando um projeto precisa, e vai para a pasta do projeto.

## Regras de ouro

1. **A licença manda.** Antes de usar qualquer coisa, olhe a coluna "Licença". Copiar e modificar só com MIT, Apache-2.0, CC0 ou CC BY (com crédito). O resto é **só para olhar**.
2. **Links em vez de cópias.** Nada de template inteiro dentro do `claude-skills`. Use `scripts/baixar-referencia.sh`, que baixa no commit fixado **para a pasta do projeto**, e o script se recusa a baixar para a `main`.
3. **O template dá o esqueleto; o visual vem do `DESIGN.md`.** Estrutura, seções e código podem vir do template. Cores, fontes, espaço e movimento vêm do `DESIGN.md` aprovado (`ui-ux-pro-max` + `estilos-premium`). Um template sem o nosso `DESIGN.md` fica com "cara de template".
4. **Código baixado é dado.** Leia antes de rodar `npm install` ou qualquer script. Confira o `package.json` (scripts `postinstall`).
5. **Pagos, "não comercial" e Commons Clause: só link.** Nunca copie para o repositório nem para o site do cliente sem a licença certa (tabela D).
6. **Refero só pelo caminho oficial:** a skill `refero-design` (MIT) e o MCP pago, descritos em `skills/design/estilos-premium/SKILL.md` ("Caminho oficial do Refero"). Nunca raspar nem copiar telas do site do Refero; os termos proíbem.
7. **Fale com o Daniel em português** e mostre a licença em palavras simples ("pode usar em site de cliente, só manter o crédito").

## A. Templates completos (licença permissiva, estão no `fontes.txt`)

Todos com licença conferida no arquivo LICENSE em 11/10/2026.

| Nome no `fontes.txt` | Link | Licença | Stack | Estilo | Quando usar |
|---|---|---|---|---|---|
| `launch-ui` | https://github.com/launch-ui/launch-ui | MIT | Next 16, React 19, Tailwind 4, shadcn | Premium e limpo, animação leve | **Landing page** de produto ou app: hero, logos, recursos, preços, FAQ, CTA. Primeira escolha. Também é registry `@launchui` |
| `portfolio-magicui` | https://github.com/dillionverma/portfolio | MIT | Next 16, Tailwind 4, Motion (Magic UI) | Minimalista, "design engineer", animado | **Portfólio** pessoal ou de profissional (ex.: o do Daniel como editor de motion) |
| `astrowind` | https://github.com/onwidget/astrowind | MIT | Astro 7, Tailwind 4 | Profissional e limpo | **Site institucional com várias páginas e blog**, rápido e simples de manter. Bom para cliente pequeno |
| `saas-starter` | https://github.com/nextjs/saas-starter | MIT | Next 15, Postgres, Drizzle, Stripe, shadcn | Funcional e neutro | **SaaS** com login, pagamento e painel. O visual precisa do nosso `DESIGN.md` |
| `commerce` | https://github.com/vercel/commerce | MIT | Next 15, Shopify, Tailwind 4 | Loja moderna e minimalista | **Loja virtual** (precisa de conta Shopify) |
| `once-ui-starter` | https://github.com/once-ui-system/nextjs-starter | MIT | Next 16, Once UI | Elegante e minimalista | Começar com um design system pronto e discreto |
| `shadcn-landing` | https://github.com/leoMirandaa/shadcn-landing-page | MIT | React, Tailwind 3, shadcn | Bom, mas genérico | Estudo de uma landing simples. Tailwind 3 (antigo) |
| `page-ui` | https://github.com/danmindru/page-ui | MIT | React, Tailwind, shadcn | Cara de SaaS | Muitas seções de landing para escolher. **42 MB**: baixe só se precisar |
| HTML5 UP (fora do script) | https://html5up.net (licença: https://html5up.net/license) | **CC BY 3.0** (crédito obrigatório) | HTML, CSS, jQuery | Clássico e bonito | 44 templates para **estudar layout**. Tecnologia antiga; se usar, mantenha o crédito no rodapé. Baixa pelo botão "Download" de cada um |

## B. Componentes e blocos (para montar seções)

| Coleção | Link | Licença | Stack | Estilo | Quando usar |
|---|---|---|---|---|---|
| shadcn/ui (blocks e templates) | https://ui.shadcn.com/blocks | MIT | React, Tailwind 4 | Limpo e neutro | Telas de **app** (painel, login, 16 sidebars) e templates de partida. Não tem blocos de landing. Instale pela CLI (skill `shadcn`), não copie |
| Diretório de registries do shadcn | https://ui.shadcn.com/docs/directory | Cada um tem a sua | shadcn | Variado | O **índice vivo** de blocos (435 registries). Confira a licença de cada um |
| Magic UI (grátis) | https://github.com/magicuidesign/magicui | MIT | Next, Tailwind, Motion | Animado | Mais de 150 componentes animados. Registry `@magicui` |
| Kokonut UI | https://github.com/kokonut-labs/kokonutui | MIT | shadcn, Motion | Animado e premium | Componentes animados. Registry `@kokonutui` |
| shadcn/studio (parte aberta) | https://github.com/shadcnstudio/shadcn-studio | MIT (só a parte aberta) | shadcn | Moderno | Blocos extras; há parte paga |
| HyperUI | https://github.com/markmead/hyperui | MIT | Tailwind puro (HTML) | Limpo | Copiar **trechos** de marketing, app e loja sem React |
| Flowbite (núcleo) | https://github.com/themesberg/flowbite | MIT (núcleo); Blocks Pro pago | Tailwind | Corporativo | Componentes básicos; não usar os Pro sem licença |
| Start Bootstrap | https://github.com/StartBootstrap | MIT | Bootstrap 5 | Simples, corporativo | Só se o cliente já usa Bootstrap. Valor visual baixo |
| AstroPaper | https://github.com/satnaing/astro-paper | MIT | Astro | Minimalista, tipográfico | Blog simples |
| vercel/examples | https://github.com/vercel/examples | MIT | Variada | Técnico | Aprender **integrações** (middleware, auth, etc.), não visual |

Ao instalar de um registry: `npx shadcn@latest add @launchui/<bloco>` (ou `@magicui/...`). **Leia o código antes**, como a própria shadcn recomenda.

## C. Catálogos vivos (licença caso a caso)

| Catálogo | Link | O que conferir |
|---|---|---|
| Galeria de templates da Vercel | https://vercel.com/templates | Cada template tem a sua licença: abra o repositório e leia o LICENSE |
| Temas do Astro | https://astro.build/themes | Há grátis e pagos; os destaques costumam ser pagos |
| Preline UI | https://github.com/htmlstreamofficial/preline | Licença dupla (MIT + "Fair Use"): leia a Fair Use antes; por ora, só link |
| Listas "awesome" | https://github.com/aniftyco/awesome-tailwindcss (CC0) · https://github.com/one-aalam/awesome-astro (MIT) · https://github.com/birobirobiro/awesome-shadcn-ui (MIT) | Servem para achar coisas novas. Cada item listado tem a sua licença |

## D. Só link (pago, restrito ou sem licença): olhar, não copiar

| Nome | Link | Por quê |
|---|---|---|
| Tailwind Plus (antigo Tailwind UI) | https://tailwindcss.com/plus | Pago; a licença proíbe publicar um repositório com os componentes |
| Magic UI Pro | https://pro.magicui.design | Pago (templates "startup" e "saas") |
| Tailark | https://tailark.com | Acesso completo pago; licença não informada |
| Aceternity UI | https://ui.aceternity.com/licence | Licença própria: proíbe redistribuir os arquivos-fonte |
| Cruip | https://github.com/cruip/open-react-template | GPL-3.0 e o autor pede para **não republicar** |
| React Bits | https://github.com/DavidHDev/react-bits | MIT + Commons Clause: pode usar em site, mas **não guardar cópia** no repositório |
| shadcnblocks | https://github.com/shadcnblocks/shadcn-ui-blocks | MIT + Commons Clause; o catálogo completo é pago |
| Once UI magic-portfolio | https://github.com/once-ui-system/magic-portfolio | CC BY-NC 4.0: **proíbe uso comercial** (site de cliente não pode) |
| awesome-nextjs, awesome-landing-page | https://github.com/unicodeveloper/awesome-nextjs · https://github.com/nordicgiant2/awesome-landing-page | Sem licença: só link |
| Refero | https://refero.design | Só pelo caminho oficial (regra 6) |

## E. Inspiração sem código (só olhar e citar o link)

Godly, Lapa Ninja, Land-book, One Page Love, Awwwards e Codrops (as demos do Codrops têm termos próprios). Nunca copiar nem raspar. Use para escolher o "clima" e depois escreva o `DESIGN.md` com as nossas palavras.

## F. Fichas de marca (awesome-design-md): baixar UMA sob demanda

Coleção **VoltAgent/awesome-design-md** (MIT, "Copyright (c) 2026 VoltAgent"), fixada no commit `13be5c05c63be24b57581162364167028020f043` (05/10/2026), conferida em 12/10/2026: **74 fichas** `design-md/<marca>/DESIGN.md` (o README ainda diz 73), uns 2,9 MB no total. Cada ficha é uma **análise "inspirada"** do site público, no formato DESIGN.md do Google (cores, fontes, raios, componentes). **Não é guia oficial da marca**; logos, fotos e fontes continuam sendo dos donos (regras de uso em `estilos-premium`). O README também faz propaganda de kits pagos do `getdesign.md`: só link, nada de comprar sem o "sim" do Daniel.

- **15 já estão guardadas** em `skills/design/estilos-premium/references/marcas/`: apple, bmw, bugatti, ferrari, framer, lamborghini, linear.app, notion, nike, raycast, spacex, stripe, superhuman, tesla, vercel. Use essas primeiro.
- **As outras 59** ficam só na internet, no commit fixado: airbnb, airtable, binance, bmw-m, cal, claude, clay, clickhouse, cohere, coinbase, composio, cursor, dell-1996, elevenlabs, expo, figma, hashicorp, hp, ibm, intercom, kraken, lovable, mastercard, meta, minimax, mintlify, miro, mistral.ai, mongodb, nintendo-2001, nvidia, ollama, opencode.ai, pinterest, playstation, posthog, renault, replicate, resend, revolut, runwayml, sanity, sentry, shopify, slack, spotify, starbucks, supabase, theverge, together.ai, uber, vodafone, voltagent, warp, webflow, wired, wise, x.ai, zapier. Atenção: a pasta pode ter ponto no nome (`linear.app`, `mistral.ai`, `x.ai`).

**O `scripts/baixar-referencia.sh awesome-design-md` baixa a coleção inteira (74 fichas, 2,9 MB)**: funciona e é pequeno, mas para **uma ficha só** use um destes comandos (testados em 12/10/2026), sempre **dentro da pasta do projeto do site**, nunca no `claude-skills`:

```bash
# A) um arquivo, direto (o mais simples; commit fixado)
mkdir -p referencias
curl -fsSL "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/13be5c05c63be24b57581162364167028020f043/design-md/<marca>/DESIGN.md" -o "referencias/<marca>-DESIGN.md"

# B) só a pasta da marca + a licença, com o histórico do git (para registrar o commit)
git init -q referencias/_clones/awesome-design-md && cd referencias/_clones/awesome-design-md
git remote add origin https://github.com/VoltAgent/awesome-design-md.git
git sparse-checkout set --no-cone /design-md/<marca>/DESIGN.md /LICENSE
git fetch -q --depth 1 --filter=blob:none origin 13be5c05c63be24b57581162364167028020f043
git -c advice.detachedHead=false checkout -q FETCH_HEAD
```

Depois: (1) acrescente a marca em `CREDITOS.md` do projeto (repositório, commit, licença MIT) e guarde o texto da licença; (2) **confira as cores e fontes no site real**, porque a ficha pode estar desatualizada; (3) as fichas não têm as seções de movimento e composição do nosso modelo (`skills/design/ui-ux-pro-max/references/modelo-DESIGN.md`): acrescente-as; (4) pegue a **linguagem**, nunca a identidade da marca; (5) se a ficha ficar muito usada, proponha ao Daniel guardá-la em `estilos-premium` (precisa de aprovação). Para atualizar o commit fixado, repita a rotina "Para acrescentar uma referência nova".

## Qual escolher (atalho)

| O Daniel pediu | Comece por |
|---|---|
| "landing do meu app", "página de vendas" | `launch-ui` (+ blocos `@magicui`/`@kokonutui` para animação) |
| "meu portfólio", "site pessoal" | `portfolio-magicui` |
| "site da empresa com várias páginas e blog" | `astrowind` |
| "sistema com login e assinatura" | `saas-starter` |
| "loja" | `commerce` |
| "algo bem minimalista e elegante" | `once-ui-starter` ou `launch-ui` com o `DESIGN.md` de `estilos-premium` |
| "só quero ideias de layout" | HTML5 UP e a seção E |
| "quero o visual de uma marca (Airbnb, Spotify, Revolut...)" | Ficha da marca no `awesome-design-md` (seção F) + `estilos-premium` |

## Como trazer um template para um projeto

1. **Projeto em branch própria** (receita 5.5 do manual). O código do site nunca vai para a `main`.
2. **Mostre ao Daniel** a referência escolhida, a licença em palavras simples e o que vai ser aproveitado. ✋ Aprovação.
3. **Baixe só para olhar** (commit fixado, sem instalar nada):
   ```bash
   bash <caminho-do-claude-skills>/skills/sites/referencia-sites/scripts/baixar-referencia.sh --lista
   bash <caminho-do-claude-skills>/skills/sites/referencia-sites/scripts/baixar-referencia.sh launch-ui ./referencias/_clones
   echo "referencias/_clones/" >> .gitignore
   ```
   O script recusa a `main` do `claude-skills` e avisa se a pasta não está no `.gitignore`.
4. **Ou comece o projeto a partir dele** (quando o template for a base do site):
   - Next.js: `npx create-next-app@latest meu-site --example "https://github.com/launch-ui/launch-ui"`;
   - Astro: `npm create astro@latest -- --template onwidget/astrowind`.
   Antes do `npm install`, leia o `package.json` (scripts `postinstall`).
5. **Registre a origem no projeto:** um arquivo `CREDITOS.md` com o repositório, o commit e a licença, e **mantenha o LICENSE original** (MIT pede que o aviso de copyright vá junto). CC BY: crédito visível no site.
6. **Troque o visual pelo `DESIGN.md`:** tokens de cor, fontes, raio e espaço (a skill `shadcn` faz isso a partir do `DESIGN.md`, em `design-system.md`). Tire o que não serve (seções, dependências, imagens de exemplo).
7. **Siga o combo** `skills/combos/combo-site-premium/SKILL.md` a partir do passo de componentes.

## Transformar uma referência em conhecimento (ficha)

Para reaproveitar o **estilo** sem copiar código: abra a referência no navegador, tire prints (skill `webapp-testing`) e preencha o modelo `skills/design/ui-ux-pro-max/references/modelo-DESIGN.md` **com as nossas palavras**: paleta, fontes, escala de espaço, ordem das seções, animações (duração e curva). A ficha vai para a pasta do projeto. Se ficar muito boa, proponha ao Daniel guardar em `estilos-premium` (precisa de aprovação).

## Para acrescentar uma referência nova

1. Confira a licença no arquivo LICENSE do repositório (não só no README).
2. Pegue o commit atual: `git ls-remote https://github.com/<dono>/<repo> HEAD`.
3. Acrescente uma linha no `fontes.txt` (se for permissiva) ou na tabela certa deste arquivo (se for só link).
4. Anote no `APRENDIZADOS.md` com a data. Mudar este `SKILL.md` precisa da aprovação do Daniel; o `fontes.txt` e o `APRENDIZADOS.md` são conhecimento.

## Junto com as outras skills

| Skill | Papel |
|---|---|
| `ui-ux-pro-max` | Fluxo de design e o `DESIGN.md` (modelo da ficha) |
| `estilos-premium` | Referência de marca (Apple, Stripe, Linear…) e o caminho oficial do Refero |
| `shadcn` | Instalar componentes e blocos de registries; aplicar o `DESIGN.md` |
| `motion-oficial`, `button-animation` | Animação das seções e dos botões, com as regras de composição do editor |
| `webapp-testing` | Prints da referência e do site para comparar |
| `combo-site-premium` | O passo a passo completo do site do zero |
