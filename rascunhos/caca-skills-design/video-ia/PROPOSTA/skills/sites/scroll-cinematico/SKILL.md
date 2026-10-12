---
name: scroll-cinematico
description: "Animação cinematográfica controlada pela rolagem em sites (estilo página de produto da Apple): sequência de quadros num canvas preso com sticky, vídeo ligado ao scroll, CSS scroll-driven (animation-timeline), GSAP ScrollTrigger, Motion (useScroll) e Three.js. Dá os números (quadros, peso, formato, altura da seção presa), o caminho Blender/Remotion/IA de vídeo → ffmpeg → site, as regras de composição do editor no scroll, acessibilidade (reduzir movimento, sem JS), desempenho, um modelo HTML testado, um componente Next.js e um teste Playwright. Use quando o pedido falar em 'site estilo Apple', 'animação no scroll', 'produto girando quando rola', 'scrollytelling', 'vídeo controlado pela rolagem', 'herói animado', 'sequência de quadros', 'parallax premium', ou em gerar vídeo por IA (LTX, Wan, Veo, Kling, Higgsfield) para usar num site."
---

# Scroll cinematográfico

A rolagem vira a "agulha" de um filme: o visitante rola e o produto gira, abre ou monta, com textos entrando no tempo certo. Esta skill diz **qual técnica usar**, **com que números**, **como produzir os quadros** (Blender, Remotion ou IA de vídeo) e **como testar**.
Base: duas pesquisas de 11/10/2026 com teste no container (registro em `ORIGEM.md` e `APRENDIZADOS.md`). Todo o código é nosso.

## Arquivos de apoio: quando ler cada um

| Arquivo | Leia ou use quando |
|---|---|
| `assets/scroll-sequencia.html` | Página **sem dependências, testada**: canvas + sticky + 2 textos + reduzir movimento + sem JS. Comece daqui em site estático ou para aprovar a ideia. |
| `assets/SequenciaScroll.tsx` | O site é **Next.js/React** (nosso padrão). Mesma lógica, com Motion 14 (`useScroll` + `useSpring`). |
| `scripts/preparar-quadros.sh` | Transformar o render (PNG RGBA) ou um vídeo em WebP do site + conjunto *lite* + pôster + `manifest.json`. |
| `scripts/gerar-quadros.sh` | Gerar 60 quadros falsos (aparelho girando com o número do quadro) para testar a página antes do render de verdade. |
| `scripts/testar-scroll.js` | **Sempre antes de entregar:** confere quadro × progresso, texto sobre texto, reduzir movimento e sem JS, e tira screenshots. |
| `references/receitas.md` | Código de vídeo ligado ao scroll, CSS scroll-driven, GSAP + Lenis, Three.js/R3F. |
| `references/ia-de-video.md` | Vai **gerar o clipe por IA**: tabela de serviços e modelos, licença comercial, GPU, prompts, `scripts/gerar_ltx.py` e `gerar_wan.py`, pós-produção no ffmpeg. |

## Regras de ouro

1. **Escolha a técnica pela tabela abaixo.** Uma técnica principal por cena; o resto (textos, cartões) vai junto na mesma linha do tempo.
2. **Um progresso só.** Quadros e textos leem o **mesmo** valor. Se o canvas tem inércia (lerp ou mola), os textos usam o progresso suavizado; se os textos ficam em CSS puro, tire a inércia do canvas. Senão, texto e quadro descolam.
3. **Pin com CSS** (`position: sticky` dentro de uma seção alta), sem JS. Com GSAP, use o pin do GSAP e **não** misture com sticky.
4. **No evento de scroll, leia só `scrollY`.** Medidas (`getBoundingClientRect`, `offsetTop`) só no `ResizeObserver`. Redesenhe só quando o índice do quadro muda.
5. **WebP com alpha é o formato padrão.** O celular recebe um **render vertical próprio**, nunca o desktop recortado.
6. **"Reduzir movimento" = versão parada** (pôster + textos lado a lado, sem pin), não uma versão mais lenta. **Sem JS = pôster.**
7. **Texto real no DOM**, na ordem de leitura. Nenhuma informação só dentro dos quadros.
8. **As 4 regras de composição do editor são obrigatórias** (seção própria abaixo).
9. **Vídeo de IA só de fonte com uso comercial.** Plano grátis de serviço online (Kling, Hailuo, Pika, Flow…) é **rascunho**, não entrega. O conector Higgsfield gasta créditos pagos: só com aprovação do Daniel. Detalhes em `references/ia-de-video.md`.
10. **Teste com `scripts/testar-scroll.js` e num iPhone e num Android reais** antes de publicar.

## Qual técnica usar

| Técnica | Use quando | Fortes | Custos e riscos |
|---|---|---|---|
| **Sequência de quadros no `<canvas>`** | Produto herói que gira, abre, explode ou monta; 60–150 quadros | Quadro exato; **alpha** (produto por cima do texto); qualquer navegador | Muitos arquivos; memória decodificada alta; pré-carregamento |
| **Vídeo com `currentTime` = scroll** | Cena longa (5–10 s, >150 quadros), fotográfica ou vídeo de IA | Um arquivo; compressão | Busca assíncrona; **exige all-intra** (`-g 1`, 3–5× mais pesado); alpha desigual entre navegadores; manias do iOS |
| **CSS scroll-driven** (`animation-timeline: scroll()/view()`) | Textos, cartões, parallax, barra de progresso | Zero JS; roda no compositor | Chrome/Edge 115+, Safari 26+; **Firefox estável ainda não** (out/2026): `@supports` + fallback; não desenha canvas |
| **GSAP ScrollTrigger** (`scrub`, `pin`, `snap`) | Coreografia com muitas faixas; depuração com `markers` | Uma linha do tempo para tudo; `scrub: 0.5` dá inércia | Peso extra; **licença proprietária** grátis (ver `ORIGEM.md`) |
| **Motion** (`useScroll`/`useTransform`/`useSpring`) | Projeto React/Next.js (nosso padrão) | Tipado; mola sem overshoot sincroniza quadros e textos | Valor que vai para o canvas roda na thread principal |
| **Lenis** (rolagem suave) | "Sensação premium" no desktop, opcional | MIT; `lerp ≈ 0,1` | Desligar com reduzir movimento; não quebrar teclado nem iOS |
| **Three.js / R3F** (drei `ScrollControls`) | O visitante **gira** o produto; configurador; GLB (1–3 MB) mais leve que 150 quadros | Interativo; resolução infinita | GPU do celular; menos beleza que o Cycles |
| **View Transitions** | Troca de página/estado (cartão vira página do produto) | Baseline desde out/2025 | **Não é scrub**: só complemento |

**Regra de bolso:** produto herói em ≤150 quadros → **canvas**. Filmagem ou vídeo de IA longo → **vídeo all-intra**. Textos e cartões → **CSS scroll-driven** com fallback, ou a mesma linha do tempo JS do canvas.

## Números

| Item | Valor |
|---|---|
| Quadros por cena | **60–150** (Apple AirPods Pro, 2019: 148 JPGs) |
| Rolagem por quadro | ≤ 20–25 px (com inércia, até ~30). Ex.: 120 quadros em 300vh de 720 px ≈ 18 px |
| Altura da seção presa | **200–400vh** de pin por cena (seção = pin + 100vh). Acima de 5 telas vira "sequestro de rolagem" |
| Formato | **WebP com alpha**; AVIF só se a banda for o gargalo **e** o aparelho real aguentar; JPG só sem alpha |
| Largura do quadro | Desktop 1280–1600 px (largura exibida × DPR ≤ 2); celular 720–900 px, render vertical próprio |
| Peso por quadro | 20–60 KB (fotorrealista, WebP q70–80); 147 quadros ≈ 4 MB (fórum GSAP) |
| Orçamento total | Desktop ≤ 3–6 MB; celular ≤ 1,5–2,5 MB; Save-Data → *lite* ou só pôster |
| Memória decodificada | `L × A × 4` bytes: 1920×1080 = **8,3 MB por quadro** (150 = 1,2 GB!); 1280×720 = 3,7 MB |
| Vídeo all-intra | 1280 px, 30 fps: ~8 MB MP4, ~13 MB WebM; GOP normal 1–2 MB; 1080p all-intra pode passar de 100 MB |
| Inércia | lerp 0,15–0,2 por 16,7 ms (**por tempo**, não por quadro); GSAP `scrub: 0.5–1`; mola `{stiffness: 200, damping: 40}` sem overshoot |
| Tempo de leitura | Cada texto parado ≥ 15–20% do pin (~50vh de rolagem) |

**Medido no teste** (60 quadros 1280×720, gráfico simples, Chromium headless):

| Variante | Total | Por quadro | Carregar + decodificar |
|---|---|---|---|
| WebP com alpha (q80) | 796 KB | 13,3 KB | **13,0 ms** |
| AVIF com alpha (crf 32) | 294 KB | 4,9 KB | 32,6 ms (2,5× mais lento) |
| H.264 all-intra (`-g 1`) / GOP 250 | 432 KB / 137 KB | – | all-intra **3,2× maior** |
| VP9 all-intra (crf 32) | 629 KB | – | – |

AVIF fica 2–3× menor, mas decodifica 2–3× mais devagar, e o navegador descarta e redecodifica imagens quando falta memória. No scrub isso pesa: **WebP é o padrão**.

## Pipeline: do render ao site

```
Blender (produto.py) ─┐                          ┌─ public/seq/d/f_0001..N.webp  (desktop 16:9, 1280–1600 px)
Remotion (--sequence)─┼─► PNG RGBA ─► preparar-  ├─ public/seq/m/…                (celular 9:16, 720–900 px, render próprio)
Vídeo de IA (mp4) ────┘   (IA: sem    quadros.sh ├─ …/lite/…                      (meia taxa: Save-Data / aparelho fraco)
                          alpha)                 ├─ …/poster.webp                 (melhor quadro: reduzir movimento, sem JS, LCP)
                                                 └─ …/manifest.json               ({total, largura, altura, padrao, poster, lite})
```

1. **Blender** (skill `blender-ia`, `produto.py`): `--frames 1-120`, PNG RGBA com `film_transparent`. Renderize **de novo** com câmera vertical para o celular. Guarde o `<prefixo>caixas.json` (caixa 2D do produto por quadro): ele mostra onde há espaço livre para texto e de onde um texto pode "sair de trás".
2. **Remotion** (skill `remotion-video`): `npx remotion render <entrada> <Comp> out/seq --sequence --image-format=png --frames=0-119`, com fundo transparente. Fundo e textos vêm do site, não do render. (Confira as flags na versão instalada.)
3. **Vídeo de IA** (`references/ia-de-video.md`): 5–10 s a 24 fps, sem alpha. O vídeo vira o **fundo** da cena e os textos ficam em áreas vazias. Confira cintilação entre quadros. Mais de 150 quadros → rota do vídeo all-intra (`references/receitas.md`).
4. **Converter:**
   ```bash
   bash scripts/preparar-quadros.sh "render/d/phone_%04d.png" public/seq/d 1600
   bash scripts/preparar-quadros.sh "render/m/phone_%04d.png" public/seq/m 900
   FPS=24 bash scripts/preparar-quadros.sh ia.mp4 public/seq/d 1280 75     # vídeo; POSTER=<n> escolhe o pôster
   ```
   Testado: 60 PNG RGBA → 864 KB (1280 px) + *lite* 30 quadros 376 KB, alpha preservado; vídeo de 8 s → 192 quadros.
5. **Site:** `assets/scroll-sequencia.html` (estático) ou `assets/SequenciaScroll.tsx` (Next.js). Nomes versionados e `Cache-Control: immutable`; com HTTP/2 ou 3, muitos arquivos pequenos não são problema.

## Regras de composição do editor no scroll (obrigatórias)

As 4 regras do Daniel (detalhe em `skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor") valem para scroll também:

| Regra | Como garantir no scroll |
|---|---|
| 1. Nada de texto sobre texto (nem logo sobre texto) | As **faixas de progresso dos textos não se sobrepõem**: a saída de A termina antes de B entrar (no modelo: A 0,06–0,50; B a partir de 0,78). Textos em áreas diferentes. Entradas com `easeOutCubic` ou mola sem overshoot. O teste confere as caixas em cada posição. |
| 2. Nenhum recorte no meio da tela | Nada de `clip-path`, máscara ou wipe para revelar texto. O `overflow: clip` fica só no palco, que é a borda da tela. Quadros renderizados inteiros com alpha, nunca recortados. Blur só com folga em volta. |
| 3. Elemento principal por cima do texto | Camadas: fundo (z 0) → textos (z 1) → **canvas com quadros transparentes** (z 2, `pointer-events: none`). Com quadros opacos ou vídeo, o texto fica em espaço vazio (confira no `caixas.json`). O produto só passa na frente de um texto já lido. |
| 4. Texto entra pela borda ou de trás do produto | `translateX(-100vw → 0)` a partir da borda e saída pela mesma borda; ou o cartão nasce no centro do produto (camada abaixo do canvas, menor que o produto) e desliza para fora. Nunca "brotar" no meio da tela. |
| Tempo de leitura | Cada texto parado ≥ 15–20% do pin. No modelo: 0,22–0,40 de 300vh = 54vh. |

**Revisão:** além do teste automático, olhe as screenshots de 4 ou mais posições procurando as 4 falhas.

## Acessibilidade

- **`prefers-reduced-motion: reduce`:** troque pela versão parada: pôster (o melhor quadro) + textos lado a lado, sem pin, sem scrub, sem Lenis, sem parallax. Opcional: 3–4 quadros-chave empilhados como storyboard. O modelo troca ao vivo se a preferência mudar.
- **Sem JS:** o `<img class="poster">` já está no HTML; o canvas só aparece com a classe `js`. (No Next.js, o pôster fica sob o canvas e some quando o 1º quadro é desenhado.)
- **Leitor de tela:** `h2`/`p` reais no DOM; canvas com `role="img"` + `aria-label`, ou `aria-hidden` se for decorativo.
- **Rolagem nativa:** teclado (espaço, PageDown), leitor de tela e "voltar ao topo" funcionam. Nada de sequestrar a roda do mouse. Pin ≤ 3–5 telas. WCAG 2.3.3 (animação disparada por interação) e 2.2.2 (pausar, parar, ocultar).

## Desempenho

- `scroll` passivo → um `requestAnimationFrame` → progresso `p = clamp((scrollY − top) / len)` → inércia por tempo `cur += (p − cur) × (1 − 0,82^(dt/16,7))` → quadro `round(cur × (N − 1))`.
- Só redesenhe quando o índice muda. Textos só com `transform` e `opacity`.
- Canvas = tamanho CSS × `min(DPR, 2)`.
- **Carregamento:** 1º quadro (ou pôster) com `<link rel="preload" fetchpriority="high">` (é o LCP); o resto quando a seção está a 1–2 telas (`IntersectionObserver`/`useInView` com margem `200% 0px`), em ordem **grosso → fino** (passos 8, 4, 2, 1), 6 por vez, com `img.decode()`. Enquanto falta um quadro, desenhe o **mais próximo já carregado**. (O HTML modelo carrega logo ao abrir; ponha o `IntersectionObserver` se a seção ficar longe do topo.)
- **Memória:** não guarde 150 `ImageBitmap`s a 1080p (1,2 GB). Deixe o navegador gerir as `Image`s ou mantenha uma janela de ±10 bitmaps.
- **Celular:** conjunto vertical próprio, escolhido com `matchMedia('(max-width: 700px)')` **antes** de carregar; `navigator.connection?.saveData` → *lite* ou só pôster; palco em `100svh` e seção em `lvh` (a barra de endereço não faz pular).

## Usando os modelos prontos

**HTML:** copie `assets/scroll-sequencia.html`, ponha os quadros em `frames/`, ajuste `data-frames`, `data-pattern`, o pôster, o `preload`, os textos `#tA`/`#tB` e as faixas em `T`. Para testar a página sem render de verdade:

```bash
bash scripts/gerar-quadros.sh /tmp/teste/frames && cp assets/scroll-sequencia.html /tmp/teste/index.html
node scripts/testar-scroll.js /tmp/teste/index.html /tmp/teste/shots      # sai com código 1 se algo falhar
```

O teste precisa do Playwright (no container fica em `/opt/node-tools`; o script acha sozinho, ou use `CHROMIUM_PATH`). Contrato da página: seção `.cine` com `data-frames`, textos `.txt`, `<img class="poster">`, classe `.rm` no modo parado e `window.__scroll = {p, frame, loaded, settled}`.

**Next.js:** `assets/SequenciaScroll.tsx` recebe `total`, `padrao(i)`, `poster`, `alt`, `textoA`, `textoB` e `telas` (padrão 4). Quadros em `public/seq/{d,m}/`. Para trocar de conjunto depois de montado, mude a `key`. Instale `motion` (nunca `framer-motion`; veja a skill `motion-oficial`).

## Checklist antes de entregar

- [ ] Técnica escolhida pela tabela; quadros e textos no mesmo progresso.
- [ ] `testar-scroll.js` passou: quadro certo em 3+ posições, nenhum texto sobre texto, reduzir movimento e sem JS mostram o pôster.
- [ ] Screenshots revisadas contra as 4 regras do editor; cada texto parado ≥ 15–20% do pin.
- [ ] Pin entre 200 e 400vh; ≤ 25 px de rolagem por quadro.
- [ ] Peso dentro do orçamento (desktop ≤ 3–6 MB; celular ≤ 1,5–2,5 MB); conjunto próprio para celular e *lite*.
- [ ] Pôster com `fetchpriority="high"`; arquivos versionados com cache `immutable`.
- [ ] Origem e licença de cada clipe de IA anotadas (modelo, versão, seed, prompt); nada de plano grátis sem uso comercial.
- [ ] Testado num iPhone e num Android reais.

## Integra com

- `skills/video/blender-ia`: quadros RGBA (`produto.py --frames`) e `caixas.json`.
- `skills/video/remotion-video`: `--sequence` e as regras do editor.
- `skills/design/motion-oficial`: `useScroll`, `useSpring`, curvas (scroll ligado à rolagem → curva `linear`; entradas → ease-out).
- `skills/design/estilos-premium` (`movimento-sites.md`): curvas e Lenis `lerp ≈ 0,1`.
