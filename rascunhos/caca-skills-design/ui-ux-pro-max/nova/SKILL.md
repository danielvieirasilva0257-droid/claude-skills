---
name: ui-ux-pro-max
description: "Design de interface premium e minimalista para sites, landing pages, apps e dashboards, com fluxo DESIGN.md (briefing, referência travada, tokens, componentes e revisão) e regras com números de tipografia, cor, espaço, componentes, acessibilidade e anti-padrões de cara de IA. Use quando o pedido for criar, redesenhar, revisar ou deixar com cara de caro uma tela, site ou app; escolher estilo, paleta, fonte ou espaçamento; fazer visual tipo Apple, Samsung, Linear ou Stripe; fazer algo minimalista; criar um DESIGN.md ou design system; ou tirar a cara de feito por IA."
---

# UI/UX Pro Max (versão nossa, 11/10/2026)

Skill nossa, em português, montada em "Frankenstein": a base antiga desta skill mais o melhor de sete skills públicas (Anthropic, Refero, taste-skill, Emil Kowalski, Vercel, impeccable, nextlevelbuilder), do padrão aberto DESIGN.md do Google e das análises de marcas premium do awesome-design-md (MIT). O texto é nosso. Fontes, licenças e o que veio de cada uma: `ORIGEM.md`.

**O `DESIGN.md` do projeto sempre vence.** As regras desta skill são o padrão para quando o projeto ainda não tem um.

## Quando usar e com quem combinar

| Situação | O que fazer |
|---|---|
| Tela, site, landing, app ou dashboard novo | Fluxo completo de 6 etapas (abaixo) |
| Ajuste pequeno num projeto que já tem `DESIGN.md` | Ler o `DESIGN.md`, aplicar, fazer a etapa 6 |
| "Deixa com cara de caro", "tipo Apple", "minimalista" | Etapa 1 + `references/estilos-premium.md` ou `references/minimalismo.md` |
| Revisar uma interface pronta | `references/checklist.md` + `references/anti-padroes-ia.md` |
| Animar botão ou micro-interação | `skills/design/button-animation/` (receitas) e `skills/design/motion-oficial/` (Motion 14) |
| Carrossel de miniaturas | `skills/design/thumbnail-carousel/` |
| Vídeo do app (promo) | `skills/video/remotion-video/`: usa o **mesmo `DESIGN.md`** (paleta, fontes e curvas iguais às do app) |
| Texto da interface | `skills/texto/copywriting/` e `skills/texto/humanizer/` |

## Regras de ouro

1. **O briefing decide.** Nenhum estilo é padrão. Se o plano sairia igual para qualquer briefing parecido, refaça.
2. **Uma referência principal.** As outras emprestam no máximo 1 ou 2 detalhes. Nunca tire a média.
3. **Um acento, com um papel só** (por exemplo: só o fundo do botão principal). Nunca 2 botões preenchidos lado a lado.
4. **Uma escola de raio** (pílula ou quina viva) e no máximo 3 valores de raio.
5. **Uma família de ícones**, com o mesmo traço. Nunca emoji como ícone.
6. **No máximo 2 famílias de fonte** e 3 pesos. Título grande com peso 300 a 600, nunca 700 ou mais.
7. **Sem sombra em card e botão.** Profundidade vem de troca de superfície e de linha de 1px.
8. **Um momento de movimento forte** por página; o resto anima só com motivo. Só `transform` e `opacity`, nunca `transition: all`, sempre `prefers-reduced-motion`.
9. **Contraste mínimo de 4,5:1** no corpo e 3:1 em texto grande, ícones e controles. **Alvo de toque de 44×44px.**
10. **Todo valor tem papel.** Hex sem "onde usar e onde nunca usar" não entra no `DESIGN.md`.
11. **As 4 regras de composição do editor valem também em tela** (seção própria abaixo).
12. **Gaste a ousadia num lugar só** e, no fim, tire um acessório.

## Fluxo de 6 etapas (✋ = aprovação do Daniel)

### 1. Briefing

Pergunte só o que muda o resultado. Se der para deduzir, deduza e siga. Se for ambíguo, **uma** pergunta.

```text
Desenhando [O QUÊ] para [QUEM] em [PLATAFORMA].
Objetivo: [tarefa principal do usuário].
Tom: [sensação desejada].
Objeção principal: [o que pode fazer a pessoa desistir].
Precisa lembrar: [o detalhe marcante].
Restrições: [marca existente, framework, prazo, conteúdo, acessibilidade].
Mídia: [fotos e renders reais? se não, placeholder com direção de arte].
Caminho: [build direto | 3 direções | auditoria].
```

Em seguida escreva **uma linha de leitura**: "Estou lendo isto como: [tipo de página] para [público], com linguagem [clima], puxando para [arquétipo]."

Decida também:

- **Modo de visita:** Persuadir (landing, preços), Operar (app, dashboard), Ler (docs, artigo) ou Experiência (portfólio, galeria). Uma landing de ferramenta continua sendo Persuadir.
- **Claro ou escuro:** escreva uma frase de cena ("quem usa, onde, sob que luz"). Ela decide. Sem informação, claro.
- **Três controles (1 a 10):**

  | Briefing | Variação | Movimento | Densidade |
  |---|---|---|---|
  | Minimalista, calmo, tipo Linear | 5–6 | 3–4 | 2–3 |
  | Premium de consumo, tipo Apple, luxo | 7–8 | 5–7 | 3–4 |
  | Confiança, setor regulado (banco, saúde) | 3–4 | 2–3 | 4–5 |
  | Site com animação, cinematográfico | 7–9 | 7–9 | 2–3 |

  Densidade baixa: espaços de 24 a 96px. Densidade alta: 8 a 32px.

### 2. Referência (reference lock) ✋

1. Junte 3 a 5 referências: sites reais, prints do Daniel, DESIGN.md de marcas do awesome-design-md (MIT, fichas em `references/estilos-premium.md`) ou o catálogo opcional (fim deste arquivo).
2. Escolha **uma principal**. Das outras, no máximo 1 ou 2 detalhes, cada um com um trabalho delimitado (por exemplo: "a janela de código vem da B").
3. Escreva a trava:

```text
Principal: [uma fonte dominante]
Preservar: [3 a 5 traços: canvas, tipo, acento, layout, densidade, mídia]
Emprestar só: [1 a 2 detalhes das secundárias]
Regras de papel: [ex.: acento só no CTA; cor de código só no código]
Mídia: [real, gerada, banco de imagens, desenhada em código ou placeholder; proporção e direção de arte]
Rejeitar: [os padrões genéricos que matariam a direção]
Compromissos de token: [fundo, tipo, acento, raio, borda/sombra, imagem]
```

Para tela grande e visível (landing, redesign), proponha **3 direções** travadas e deixe o Daniel escolher.

**Sinais de média (refaça):** fundo escuro virou creme; acento ácido virou argila; sans geométrica virou serifa educada; quina viva virou card arredondado; mídia marcante virou "hero + seções".

### 3. DESIGN.md ✋

- Crie `DESIGN.md` na raiz do projeto a partir de `references/modelo-DESIGN.md`. Ele é compatível com a spec aberta do Google (front matter YAML + seções `##` em inglês, texto em português).
- Todo valor tem papel. Inclua o **decision ledger** (Decisão | Fonte | Regra de papel | Por quê). **Decisão grande sem fonte não entra.**
- No `CLAUDE.md` do projeto, acrescente: "Antes de mudar qualquer UI, leia @DESIGN.md. Cores, tipografia e espaço vêm dele; campos, textos, estados e comportamento vêm do projeto."
- Projeto com muitas páginas: uma pasta `design/paginas/<pagina>.md` só com o que muda naquela página.

### 4. Tokens

1. Antes do código, revise o plano contra o briefing e contra `references/anti-padroes-ia.md`: "se alguma parte parece o padrão que eu faria para qualquer página parecida, troco e digo por quê".
2. Confira e exporte (precisa de Node; não instala nada no projeto):

   ```bash
   npx -y @google/design.md lint DESIGN.md          # contraste WCAG e referências quebradas
   npx -y @google/design.md export --format css-tailwind DESIGN.md > app/theme.css   # @theme do Tailwind v4
   ```

   Pegadinha: no YAML, `fontFamily` leva **um** nome só (ex.: `Inter`); o `export` põe o valor inteiro entre aspas, então complete a pilha (`Inter, system-ui, sans-serif`) à mão no `theme.css`.
3. Três camadas: primitivo (`--blue-600`) → semântico (`--color-action`) → componente (`--button-bg`). Componente nunca recebe hex direto.
4. Nomes pelo **propósito** (`--color-canvas`, `--color-surface`, `--color-border`, `--color-text-muted`, `--color-primary` como cor de ação), nunca pela cor.
5. Inclua os tokens de movimento: `--duration-fast: 150ms`, `--duration-base: 240ms`, `--duration-slow: 400ms`, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)`.

### 5. Componentes

- Primeiro os primitivos: botão em 3 níveis, link, input, card (só se for clicável), nav, seção, rodapé. Depois as páginas.
- Use o que o projeto já tem (olhe o `package.json`). Se faltar, **uma** recomendação, não um menu: base-ui ou Radix (base), cmdk (menu ⌘K), Sonner (avisos), Motion (animação), NumberFlow (números animados), recharts (gráficos), dnd kit (arrastar), Virtuoso (listas longas).
- Nada de valor solto no código ("utility drift"): procure `[#…]`, `p-[13px]`, raios e sombras avulsos.
- Animação: `button-animation` e `motion-oficial`. Carrossel: `thumbnail-carousel`.

### 6. Revisão

1. **Uma rodada** de prints em **375px e 1440px**, claro e escuro, com `prefers-reduced-motion` ligado uma vez.
2. Passe `references/checklist.md` (hierarquia → consistência → estados) e o detector de `references/anti-padroes-ia.md`.
3. Compare com a trava da etapa 2 e corrija o desvio, em vez de "melhorar" no vago.
4. Corrija tudo de uma vez, confira **mais uma vez no máximo** e pare.
5. Relatório no formato "Antes | Depois | Por quê" (ou `arquivo:linha: problema` em revisão de código).
6. O que aprendeu vai no `APRENDIZADOS.md` desta skill.

## Arquétipos de estilo

Um por projeto. Detalhe, tokens e receitas (Apple, Samsung, Liquid Glass, bisel duplo): `references/estilos-premium.md`. Minimalismo: `references/minimalismo.md`.

| Arquétipo | Quando | Canvas | Assinatura |
|---|---|---|---|
| **Galeria clara** | produto físico, app de consumo, "tipo Apple/Samsung" | off-white `#f5f5f7`, `#fafafa` | produto isolado é o herói, UI sem cor, 1 CTA |
| **Palco escuro** | produto "Pro", automotivo, cinema, quando a cena é escura | `#000` a `#0a0a0a`, texto `#f5f5f7` | foto cinematográfica em tela cheia; cor só no produto ou no hover |
| **Instrumento de precisão** | ferramenta, SaaS, dev, finanças | degraus de luminância (claro ou escuro) | linhas finas, mono só em metadados, 1 cor elétrica |
| **Minimalista editorial** | conteúdo, leitura, revista, marca cultural | papel levemente tingido | tipografia é o herói; serifa só se o produto for editorial |

**Escola de raio (não misture):** macia = pílula 9999px nos botões e 12 a 28px nos cards; precisa = 0 a 6px em tudo.

**Personalidade de movimento:** utilidade quieta, premium com peso, estúdio cinematográfico ou lúdico. Uma por projeto.

## Tipografia

| Item | Regra |
|---|---|
| Famílias | 1, ou 2 com papéis rígidos (display e texto). Mono só para código e metadados. |
| Pesos | 2 ou 3 no sistema. Display 300 a 600; corpo 400; botão 500. |
| Corpo | 16 a 17px, entrelinha 1,47 a 1,6, tracking 0. Nunca abaixo de 12px (Apple: mínimo de 11pt em app). |
| Display (hero no desktop) | 56 a 96px (padrão 64 a 72px), entrelinha 0,95 a 1,1. No celular: `clamp(2.5rem, 8vw, 6rem)`. |
| Tracking por tamanho | 24–28px: −0,01em · 32–48px: −0,02em · 56–64px: −0,03em · 72px ou mais: −0,04 a −0,05em (piso −0,06em). |
| Caixa alta e texto pequeno | 11 a 13px, peso 500, tracking +0,06 a +0,08em. Texto de 11 a 13px comum: +0,01 a +0,02em. |
| Escala | Razão 1,2 em app; 1,25 a 1,333 em marketing. Escala de app (Apple): 34/28/22/20/17/16/15/13/12/11. |
| Medida | 60 a 70 caracteres (540 a 680px). Título pode centralizar; parágrafo de mais de 2 linhas, à esquerda. |
| Detalhes | `text-wrap: balance` em títulos, `pretty` em prosa; `tabular-nums` em preços e métricas; "…" e aspas curvas; espaço não separável em "10 MB"; itálico com entrelinha ≥ 1,1 para não cortar descendentes. |
| Fontes livres | Sans: Inter / Inter Tight / Inter Display, Geist, Manrope, Instrument Sans. Serifa: Instrument Serif, Newsreader, EB Garamond. Mono: Geist Mono, JetBrains Mono. Visual Apple: pilha `system-ui` (vira SF no Apple). SF Pro e SamsungOne têm licença restrita: não embarcar. |

Escolha a fonte **com motivo escrito**. As fontes mais usadas por IA (Playfair, Fraunces, Space Grotesk, DM Sans, Outfit, Plus Jakarta, Inter como display "por padrão") só entram se a referência pedir.

## Cor

| Item | Regra |
|---|---|
| Proporção | 60 a 80% neutros, 10 a 20% níveis de texto, 5 a 10% acento. No máximo 2 cores por componente. |
| Neutros | 6 a 10, nomeados por papel (canvas, superfície, borda, texto 1/2/3), com degraus de 2 a 5% de luminosidade. |
| Canvas | Tingido em vez de `#fff` puro (`#f5f5f7`, `#fafafa`, `#fafaf9`). Escuro: `#000` a `#0a0a0a`, superfícies +3 a 6%. |
| Texto | Quase preto (`#1d1d1f`, `#171717`), nunca `#000` no claro. No escuro, `#f5f5f7`, nunca `#fff`. |
| Acento | 1 cor, 1 papel, saturação abaixo de ~80%. Hover e pressionado só escurecem ou clareiam 8 a 12% a mesma cor. |
| Significado | A mesma cor nunca tem 2 significados. Cor nunca é a única pista (junte texto ou ícone). |
| Paleta nova | Monte em OKLCH; reduza o croma perto do branco e do preto. Escuro tem tons próprios, não é o claro invertido. |
| Proibido por padrão | Índigo e violeta (`#6366f1`, `#8b5cf6`, `#7c3aed`) se não forem da marca; gradiente em botão ou card; glow; texto em gradiente; segundo acento decorativo; `#ccc` como fundo. |

## Espaço e grid

| Item | Regra |
|---|---|
| Base | 4px. Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160. |
| Proximidade | 8px dentro do grupo; 16 a 24px entre grupos. Entre grupos sempre mais que dentro. |
| Seções | 96px no desktop (80 a 160px; hero com 120 a 160px de respiro); 56 a 64px no celular. |
| Card | Padding de 24px (16 a 32px). Raio interno = raio externo − padding. |
| Largura | Conteúdo de 1200 a 1280px (1440px em full-bleed); texto até 680px; margem lateral de 16 a 24px no celular e 48 a 64px no desktop. |
| Ritmo | 1 foco visual por seção. Separe seções com **um** recurso só: respiro, faixa alternada (`#fff`/`#f5f5f7`) ou linha de 1px. |
| Breakpoints | 375 · 768 · 1024 · 1440. Use `min-h-dvh`, não `100vh`. z-index em escala: 0, 10, 20, 40, 100, 1000. |
| Hero | Cabe na primeira tela; título com até 2 linhas; subtítulo com até 20 palavras; até 4 elementos de texto; logos de clientes abaixo do hero. |
| Nav | Uma linha, 44 a 64px de altura, até 5 links, CTA à direita. Vidro e borda só depois de rolar. |

## Forma e profundidade

- **Até 3 raios** no sistema (exemplos: 6/12/9999 ou 8/28/9999). Menu de opções: 0/4/8/12/16/28/9999.
- **Sombra zero em card e botão.** Se precisar, uma sombra "sussurro" de 4 a 10% de opacidade, em 2 camadas, com anel de 1px (`0 0 0 1px rgba(0,0,0,.08)`). Sombra forte só no **único** elemento flutuante (menu, modal, mockup). Sombra tingida com a cor do fundo, nunca preta pura.
- **Vidro** só na nav ao rolar e em controles sobre mídia: fundo com 70 a 80% de opacidade + `backdrop-filter: saturate(180%) blur(20px)`. Nunca duas camadas claras de vidro uma sobre a outra.
- **Gradiente** só dentro de mídia ou como atmosfera de hero.

## Componentes

- **Botão primário:** 1 por tela; altura de 40 a 48px; alvo ≥ 44×44px; padding 8–12 × 16–24px; label de 14 a 17px, peso 500; sem sombra e sem gradiente; label numa linha só.
- **Hierarquia de ação:** 1 preenchido + 1 contornado de 1px ao lado (mesma altura e raio) + 1 link de texto. O preferido se mostra pelo estilo, não pelo tamanho. Ação destrutiva nunca é a primária. Dois CTAs com a mesma intenção: corte um.
- **Card:** só quando o usuário interage com o contêiner. Teste: se tirar borda, fundo, sombra e raio não atrapalha, não é card.
- **Input:** label acima, ajuda abaixo, erro com texto e ícone (não só cor), `type`, `inputmode` e `autocomplete` certos, nunca bloquear colar.
- **Foco:** `:focus-visible` com anel de 2px e afastamento de 2px na cor de ação. Nunca `outline: none` sem substituto.
- **Selos:** texto puro de 12px, no máximo 1 por tela.
- **Superfícies do navegador** com tema da paleta: seleção de texto, cursor de digitação, barra de rolagem, anel de foco, afastamento do sublinhado.

## Movimento (resumo; detalhe em `motion-oficial` e `button-animation`)

| Camada | Duração | Curva |
|---|---|---|
| Toque e feedback | 100 a 160ms | `ease-out` |
| Hover e cor | 150 a 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Estado (abas, acordeão, dropdown) | 150 a 300ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Modal e gaveta | entrada 250 a 400ms, saída 150 a 200ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Revelação no scroll | 500 a 750ms; deslocamento de 16 a 32px; intervalo de 60 a 100ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Frase do hero (só cinematográfico) | 0,8 a 1,5s | expo ou quint out |
| Loop ambiente | 27 a 80s, no máximo 1 por página | linear |

- Premium **muda a cor, não a posição.** Zoom de imagem no hover: 1,03 a 1,05. Nada de quique em botão e menu; mola só no momento-assinatura. No Motion: `{type: 'spring', bounce: 0, duration: 0.4}`.
- Ação feita mais de 100 vezes por dia ou pelo teclado **não anima**.
- Nunca `ease-in` em interface; nunca começar de `scale(0)` (use 0,95 com opacidade 0). Saída mais rápida que a entrada.
- Rolagem: `useScroll`, IntersectionObserver ou `animation-timeline: view()`. Nunca `addEventListener('scroll')`.
- Autoplay com mais de 5s precisa de pausa. `prefers-reduced-motion` vira crossfade; `prefers-reduced-transparency` deixa o vidro sólido.
- Fade-up igual em toda seção + hover em todo card é cara de IA. Um momento orquestrado vale mais.

## Acessibilidade e celular

- Contraste: texto principal ≥ 7:1; corpo ≥ 4,5:1; texto ≥ 24px (ou ≥ 18,7px em negrito), ícones e bordas de controle ≥ 3:1.
- Alvo de toque ≥ 44×44px (Apple 44pt; Material 48dp), com 8px entre alvos.
- Celular (Apple e Samsung One UI): **leitura em cima, ação embaixo**, ao alcance do polegar. Barra inferior com até 5 itens. `env(safe-area-inset-*)` nas bordas. Tipo em `rem` com `clamp()` para respeitar o zoom de texto, e layout que empilha quando a fonte cresce.
- `<button>` para ação e `<a>` para navegação; `alt` nas imagens; títulos h1 a h6 em ordem; `aria-label` em botão só com ícone; `aria-live` em avisos.

## Regras de composição do editor, aplicadas a telas

As 4 regras do Daniel (`skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor") valem para site e app também, inclusive durante a animação.

1. **Nada de texto sobre texto, nem logo sobre texto.**
   - Nav fixa, vidro, aviso (toast), selo ou botão flutuante nunca cobrem texto que está sendo lido. O vidro precisa de opacidade suficiente para o texto de baixo não "vazar" ilegível.
   - Texto sobre foto só numa área calma da imagem ou com véu (scrim) que garanta 4,5:1.
   - Troca de tela ou de título: o antigo sai antes de o novo entrar (no Motion, `AnimatePresence mode="wait"`), ou cada um fica numa área. Nunca dois títulos cruzando no meio do movimento.
2. **Nenhum recorte no meio da tela.**
   - Nada de texto "subindo de dentro de uma máscara" (`overflow: hidden`, `clip-path`, wipe) com a linha de corte no meio da página.
   - Recorte só numa borda real: a borda do card ou da mídia, a borda da janela, a tela de um mockup de celular.
   - Blur e sombra também cortam: dê folga ao contêiner ou use filtro SVG com região maior.
3. **O elemento principal fica por cima do texto.**
   - Ordem das camadas no hero: fundo → texto → produto, mockup ou celular.
   - O produto pode passar na frente de um texto só depois de o texto ter sido lido (narrativa por scroll).
4. **Todo texto entra de um lugar que explique a entrada.**
   - Em hero cinematográfico, intro ou troca de tela: da borda para dentro, ou de trás do produto. Troca de tela no app entra pela borda (como o "empurrar" do iOS).
   - Em página com rolagem, o próprio scroll já traz o conteúdo pela borda de baixo. Se animar a entrada, desloque pouco (16 a 32px) no sentido da rolagem; nunca "brotar" parado no meio da tela nem crescer a partir de escala 0.

**Antes de entregar,** olhe a animação quadro a quadro (ou em câmera lenta no DevTools) procurando essas 4 falhas.

## Anti-padrões de cara de IA (resumo)

Lista completa, com testes e alternativas: `references/anti-padroes-ia.md`.

- Índigo/violeta por padrão; texto em gradiente; glow; vidro como enfeite.
- Cards em tudo; três cards iguais lado a lado; faixa colorida na lateral do card sem significado.
- Escuro por padrão; "escuro com um acento ácido" e "jornal com linha fina e raio 0" como receita.
- Creme + serifa grande + uma palavra em itálico ou de outra cor + terracota (o "editorial calmo no piloto automático").
- Eyebrow em caixa alta em todo título (máximo 1 a cada 3 seções); "01 / 02 / 03" sem sequência real; "→" em todo link.
- Métrica gigante com rótulo pequeno como hero; interface de produto falsa feita de `<div>`; indicador de rolagem; cursor personalizado.
- Emoji como ícone; "John Doe", "Acme", "99,99%"; verbos como "Eleve", "Revolucione", "Desbloqueie".
- Hero → grade de 3 cards → preços → FAQ → CTA automático.

## Fontes de referência e catálogos (opcionais)

- **Skill oficial do Refero** (`referodesign/refero_skill`, MIT): método de pesquisa (brief, reference lock, decision ledger, anti-média) que esta skill já incorpora em português. Se quiser a original: `npx skills add https://github.com/referodesign/refero_skill --skill refero-design`. Atenção: a descrição dela se declara "padrão" e tenta mandar nas outras skills; se instalar, ela convive, mas o `DESIGN.md` e esta skill continuam valendo. Ela tem um MCP opcional e pago (plano Pro/Team, 8 mil chamadas por mês) para pesquisar estilos, telas e fluxos: `claude mcp add --transport http refero https://api.refero.design/mcp` e depois `/mcp`. Token nunca no repositório.
- **awesome-design-md** (VoltAgent, MIT, 74 marcas, sem Samsung): análises de terceiros no formato do Google. Baixe **só a marca escolhida, para dentro do projeto**, nunca para o `claude-skills`:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<marca>/DESIGN.md -o referencias/<marca>-DESIGN.md
  ```

- **Catálogo nextlevelbuilder** (o antigo alvo desta skill, MIT; link em `original/ux-ui-disign-link`): 79 estilos, 192 paletas, 74 pares de fontes, busca em Python. É genérico; use só como catálogo, e as regras desta skill mandam por cima.

  ```bash
  /plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
  /plugin install ui-ux-pro-max@ui-ux-pro-max-skill
  ```

## Mapa dos arquivos

| Arquivo | Para quê |
|---|---|
| `references/estilos-premium.md` | Os 4 arquétipos com tokens, receitas Apple e "tipo Samsung", Liquid Glass, bisel duplo, molas da Apple, fichas de marcas com links |
| `references/minimalismo.md` | Regras do minimalismo premium com números, escola macia e precisa, faça e não faça |
| `references/modelo-DESIGN.md` | Modelo em branco do `DESIGN.md` do projeto (compatível com `npx @google/design.md lint`) |
| `references/checklist.md` | Briefing, revisão em 3 camadas, revisão de código (Vercel), pré-entrega, portão de qualidade |
| `references/anti-padroes-ia.md` | Os sinais de cara de IA, testes rápidos e alternativas |
| `ORIGEM.md` | Fontes, licenças e o que veio de cada uma |
| `APRENDIZADOS.md` | Adendos datados |
