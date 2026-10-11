# Estilos premium: arquétipos, receitas e fichas de marcas

Texto nosso. Os números de marcas são fatos citados pontualmente, com a fonte: "awesome-design-md" = coleção [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT, © 2026 VoltAgent, commit `13be5c0` de 05/10/2026), análises de terceiros no formato DESIGN.md do Google; "HIG" = Apple Human Interface Guidelines (só números, texto © Apple). Marcas, nomes e fontes pertencem aos donos.

## O que faz um site parecer caro

- **UI quase sem cor.** A interface fica neutra e a foto do produto carrega a cor.
- **No máximo 1 acento, com 1 trabalho.** Muitas marcas premium não têm nenhum (a foto faz esse papel).
- **Sem sombra em card e botão.** Profundidade = troca de superfície + linha de 1px.
- **Display grande e leve:** 56 a 120px, peso 300 a 600, tracking negativo que cresce com o tamanho.
- **Respiro:** 80 a 160px entre seções.
- **Botões em dois extremos:** pílula ou quina viva (0 a 4px). O "meio-termo genérico de 8px" é o que mais parece template.
- **Movimento muda cor, não posição:** 0,2s em cor, borda e opacidade; revelações de 0,5 a 0,75s sem quique.

## Arquétipo 1: Galeria clara

**Para:** produto físico, app de consumo, e-commerce premium, "tipo Apple" ou "tipo Samsung".

- Canvas off-white neutro (`#f5f5f7`, `#fafafa`) alternado com `#ffffff` entre seções **no lugar de linhas divisórias**.
- Texto quase preto com subtom (`#1d1d1f`); secundário cinza médio (`#6e6e73` passa 4,5:1 em branco).
- Um acento só como fundo do botão principal. Links numa variação mais escura do acento, sublinhado só no hover.
- Produto isolado (render ou foto de estúdio, ângulo de 15 a 25° ou 3/4) ocupando a metade de baixo do hero. Sem card em volta.
- Cards de destaque: branco sobre off-white (ou o inverso), raio de 20 a 28px, sem borda e sem sombra, padding de 28 a 40px. A mídia pode "vazar" pela borda.
- Raios: pílula nos botões + 1 raio de card + 1 raio pequeno.

Tokens de partida (nossos, para ajustar à marca):

```css
:root {
  --color-canvas: #f5f5f7;   --color-surface: #ffffff;   --color-border: #d2d2d7;
  --color-text: #1d1d1f;     --color-text-muted: #6e6e73;
  --color-action: #0a66d8;   --color-action-hover: #0858bb;   --color-link: #0a5cc2;
  --font-text: system-ui, -apple-system, "Inter", sans-serif;
  --text-body: 17px;  --leading-body: 1.47;
  --text-display: clamp(2.75rem, 7vw, 5rem);  --leading-display: 1.05;  --tracking-display: -0.015em;
  --radius-button: 9999px;  --radius-card: 24px;  --radius-sm: 8px;
  --section-gap: clamp(64px, 10vw, 120px);
}
```

## Arquétipo 2: Palco escuro

**Para:** linha "Pro", automotivo, aeroespacial, cinema, produto noturno. Só quando a cena pede escuro (frase de cena).

- Hero em `#000`; bandas em `#0a0a0a` a `#1d1d1f`; texto `#f5f5f7` (não `#fff`), secundário `#a1a1a6`.
- Fotografia cinematográfica em tela cheia, luz dramática, recorte justo.
- Cor só no produto, nos dados (bateria, batimento) ou no hover. Automotivo: a cor da marca aparece só no hover e no foco.
- Variante automotiva e aeroespacial: rótulos e títulos em **caixa alta com tracking positivo** (+0,02 a +0,10em), raio 0, botões fantasma de 1px.
- Texto claro sobre escuro pede um pouco mais de entrelinha, tracking e peso que o mesmo texto no claro.

## Arquétipo 3: Instrumento de precisão

**Para:** SaaS, ferramenta de desenvolvedor, finanças, produtividade.

- Superfícies em degraus de luminância (escuro: `#08090a` → `#111` → `#1a1a1a`; claro: `#fafafa` → `#fff`).
- Linhas finas de 1px (ou 0,5px) como separador principal. Anel duplo em vez de sombra: `0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px var(--color-canvas)`.
- Mono só para metadados, código e IDs (rótulos em caixa alta a +0,07em).
- Uma cor elétrica numa ação por vista.
- Raios de 4 a 8px em tudo + pílula para tags (exemplo de sistema: 6/12/9999).
- **Cuidado:** "quase preto + um acento ácido" virou cara de IA. Só use se a referência e o produto pedirem.

## Arquétipo 4: Minimalista editorial

Ver `minimalismo.md`. Serifa no display só para produto editorial, cultural, de moda ou de hospitalidade.

## Variações "de agência" (usar com moderação)

Ideias da taste-skill (MIT, `high-end-visual-design`), resumidas por nós. Úteis para landing expressiva; conferir contra o anti-padrões antes.

- **Vidro etéreo (SaaS de IA):** fundo quase preto, um degradê suave como atmosfera do hero (nunca em botão), cards de vidro com borda branca de 10%. Alto risco de cara de IA: só com referência forte.
- **Luxo editorial:** tons quentes, serifa variável, grão de ruído a 3% num pseudo-elemento fixo.
- **Estrutura suave:** branco ou prata, grotesca grande, sombras muito difusas e claras.
- Layouts: bento assimétrico, cascata em profundidade e divisão editorial, **sempre com a regra de como empilham no celular**.

### Bisel duplo ("hardware usinado")

Ideia da taste-skill (MIT). Um invólucro fino com anel quase invisível e um núcleo com raio menor, que dá o acabamento de peça usinada:

```html
<div class="rounded-[2rem] p-1.5 ring-1 ring-black/5 bg-black/[0.02]">
  <div class="rounded-[calc(2rem-0.375rem)] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,.6)]">…</div>
</div>
```

Regra geral: **raio interno = raio externo − padding**.

## Receita "tipo Apple" (web)

Fatos do `design-md/apple` do awesome-design-md e da HIG:

- Canvas `#fff` alternado com `#f5f5f7` e com faixas escuras (`#272729`); texto `#1d1d1f`; **uma única cor interativa**, o azul `#0066cc` (`#0071e3` no foco, `#2997ff` sobre escuro).
- Hero de 56px peso 600, entrelinha 1,07, tracking levemente negativo; corpo em torno de 17px. Fonte do sistema (`system-ui`, que vira SF no Apple).
- Botão primário em pílula (9999px) com padding 11 × 22px; raios do sistema 8/11/18px + pílula.
- **Nenhuma sombra no chrome.** A única sombra é a que fica embaixo da foto do produto apoiada numa superfície.
- Escala de espaço 4/8/12/17/24/32/48 e 80px entre seções; cada bloco ocupa mais ou menos uma tela.
- Par de CTAs = pílula preenchida + pílula contornada ou link "Saiba mais ›". **Nunca dois preenchidos.** Nav fina que vira vidro ao rolar (`backdrop-filter: saturate(180%) blur(20px)`).
- HIG: "1 ou 2 botões proeminentes por vista"; alvo de 44×44pt; texto padrão de 17pt no iOS (mínimo 11pt); evitar pesos Ultralight, Thin e Light em texto pequeno; evitar movimento em interação frequente.

Para usar a análise completa num projeto (MIT, com atribuição), baixe para dentro do projeto:

```bash
curl -fsSL https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/apple/DESIGN.md -o referencias/apple-DESIGN.md
```

### Movimento "fluido" da Apple na web

Ideias e fórmulas da skill `apple-design` de Emil Kowalski (MIT), resumidas por nós:

| Uso | Amortecimento | Resposta |
|---|---|---|
| Mover | 1,0 | 0,4s |
| Girar | 0,8 | 0,4s |
| Gaveta ou folha | 0,8 | 0,3s |

- No Motion: `{type: 'spring', bounce: 0, duration: 0.4}`. Quique só quando o gesto teve impulso.
- **Projeção de impulso** (onde um arrasto solto vai parar): `atual + (v / 1000) × d / (1 − d)`, com `d ≈ 0,998`.
- **Elástico na borda:** `(o × dim × 0,55) / (dim + 0,55 × |o|)`.
- Interrompa sempre a partir do valor que está na tela.
- **Material de vidro:**

  ```css
  background: rgba(255,255,255,.6);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255,255,255,.4);
  ```

  O vidro "aparece" animando o desfoque junto com a escala. Borda de rolagem vira desfoque ou degradê, não linha de 1px. `backdrop-filter` só em elemento fixo ou sticky (desempenho).
- Respeite `prefers-reduced-motion` (crossfade), `prefers-reduced-transparency` (vidro sólido) e `prefers-contrast: more`.

## Receita "tipo Samsung" (web)

**Não existe DESIGN.md da Samsung no awesome-design-md.** Fatos medidos em samsung.com (fonte de terceiros: oh-my-design.kr, sem licença declarada; usamos só números) + princípios públicos do One UI (developer.samsung.com/one-ui):

- Canvas `#fff`, superfície `#f7f7f7`, texto secundário `#707070`, borda `#ddd`.
- **CTA preto** (`#000`, texto branco), raio de 20px, altura de 40px, padding ~10 × 24px. O contornado é preto e **inverte no hover** (fundo preto, texto branco).
- Azul só em hover, pressionado e foco da navegação, nunca em repouso.
- Sem sombras. Foco: `outline: 2px dotted #000`.
- Display em sans geométrica **bold (700)**: é a exceção consciente à regra "nunca 700" (fonte substituta livre: Manrope ou Inter Tight 700).
- Movimento: cor e borda em 0,2s linear; no hover do tile de produto, a imagem vai a `scale(1.05)` e a linha "comprar" aparece com fade.
- One UI (app): **área de leitura em cima, área de interação embaixo**, ao alcance do polegar; conforto visual (modo escuro, alto contraste); One UI Sans com pesos 200/300/400/600.

Resumo: a receita "tipo Apple" com CTA preto de 20px de raio e 40px de altura no lugar da pílula azul, mais display bold geométrico.

## Fichas de marcas (awesome-design-md, MIT)

Uma linha por marca, com 2 ou 3 fatos do arquivo da coleção. O caminho de cada uma é `https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/<pasta>`. Para usar num projeto, baixe **só a marca escolhida, para dentro do projeto** (comando no `SKILL.md`), nunca para o `claude-skills`. Não há Samsung, Bang & Olufsen, Dyson nem Sonos na coleção.

| Marca (pasta) | Arquétipo | Fatos do arquivo |
|---|---|---|
| Apple (`apple`) | Galeria clara | um azul `#0066cc` como única cor interativa; pílula; sombra só sob a foto do produto |
| BMW (`bmw`) | Galeria clara | azul `#1c69d4`; texto `#262626`; botão primário com raio **0** e padding 14 × 32px |
| Nike (`nike`) | Galeria clara | primário quase preto `#111`; vermelho `#d30005` só para promoção; display de 96px peso 500 |
| Tesla (`tesla`) | Galeria clara | um azul `#3e6ae1` só nos CTAs; hero de tela cheia com foto; título de 40px peso 500 |
| Ferrari (`ferrari`) | Palco escuro | canvas `#181818`; vermelho `#da291c`; display de 80px peso 500 com tracking de −0,02em |
| SpaceX (`spacex`) | Palco escuro | `#000` e branco; display condensado em caixa alta com tracking **positivo** (+0,02em) |
| PlayStation (`playstation`) | Palco escuro | azul `#0070d1`; laranja `#d53b00` só no comércio; display peso 300 |
| Stripe (`stripe`) | Instrumento (claro) | display de 56px peso **300** a −0,025em; índigo `#533afd` da marca; raios de 4 a 8px |
| Vercel (`vercel`) | Instrumento (claro) | primário `#171717`; Geist 600 a −0,05em; azul `#0070f3` só em link |
| Linear (`linear.app`) | Instrumento (escuro) | canvas `#010102` com 4 degraus de superfície; display de 80px peso 600 a −0,0375em |
| Raycast (`raycast`) | Instrumento (escuro) | canvas `#07080a`; botão primário **branco** com texto preto; raio de 8px |
| Framer (`framer`) | Instrumento (escuro) | canvas `#090909`; display de 110px peso 500 a −0,05em; azul `#0099ff` como acento |
| Superhuman (`superhuman`) | Minimalista | primário `#1b1938`; texto `#292827`; display de 48 a 64px com peso intermediário (460 a 540) |
| Notion (`notion`) | Minimalista | canvas `#fff` com superfície quente `#f6f5f4`; texto `#1a1a1a` |
| Cursor (`cursor`) | Minimalista | canvas tingido `#f7f7f4`; texto `#26251e`; laranja `#f54e00` como acento |
| Airbnb (`airbnb`) | Galeria clara (consumo) | canvas `#fff`; texto `#222`; um coral `#ff385c` da marca |

Outras marcas da coleção que podem servir: `bugatti`, `lamborghini`, `bmw-m`, `nvidia`, `spotify`, `uber`, `wise`, `revolut`, `figma`, `webflow`, `shopify`, `claude`, `elevenlabs`.

Fontes de marca (SF Pro, SamsungOne, Söhne, FerrariSans etc.) têm licença própria: use substitutas livres (Inter, Inter Tight, Geist, Manrope, Barlow para DIN e condensadas, Jost para Futura).

## Checklist anti-barato

- [ ] Nenhum par de CTAs coloridos; nenhum gradiente em botão.
- [ ] Nenhum selo colorido em todo card; nenhum bold 700+ em título grande (exceto receita Samsung, consciente).
- [ ] Nenhuma sombra suave genérica (`shadow-md`, `shadow-lg`); nenhum `#ccc` como fundo.
- [ ] O produto ou a foto real é o herói, até a borda, sem moldura.
- [ ] Um detalhe memorável; o resto em silêncio.
