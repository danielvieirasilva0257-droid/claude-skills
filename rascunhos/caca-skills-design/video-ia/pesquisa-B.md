# Pesquisa B: scroll cinematográfico (animação premium controlada pela rolagem)

Data: 11/10/2026. Agente de pesquisa "Scroll cinematográfico".
Teste: `teste-scroll/` (nesta mesma pasta). Todas as receitas abaixo são código próprio.

## 0. Resumo em 6 linhas

1. **Produto que gira, abre ou monta:** use uma sequência de quadros WebP **com alpha**, desenhada num `<canvas>` preso com `position: sticky`. É o que a Apple fazia no AirPods Pro: 148 JPGs.
2. **Cena longa ou fotográfica (vídeo de IA):** use vídeo com `currentTime` ligado ao scroll. O vídeo **precisa** ser recodificado em all-intra (`-g 1`).
3. **Textos, cartões e parallax:** use CSS scroll-driven (`animation-timeline`), que roda fora da thread principal. Funciona no Chrome/Edge 115+ e no Safari 26+. O **Firefox estável ainda não tem**, então é preciso um fallback em JS.
4. **GSAP está grátis** desde 30/04/2025, com todos os plugins, inclusive ScrollTrigger e SplitText. Mas a licença é **proprietária** (Webflow "Standard No Charge"), não MIT.
5. **Motion** (`useScroll` + `useTransform` + `useSpring`) é o caminho natural em React/Next.js e conversa com a skill `motion-oficial`. **Lenis** é opcional.
6. **Teste:** 60 quadros, canvas, sticky e 2 textos. No Chromium headless, o quadro desenhado bateu com o esperado nas 4 posições, sem texto sobre texto. O modo "reduzir movimento" mostra o pôster parado.

---

## 1. Técnicas comparadas

| Técnica | Quando usar | Pontos fortes | Custos e riscos |
|---|---|---|---|
| **Sequência de imagens no `<canvas>`** | Herói de produto (gira, abre, explode, monta), 60–150 quadros | Quadro exato; **alpha** (o produto fica por cima do texto); funciona em qualquer navegador; controle total | Muitos arquivos; memória decodificada alta; precisa de pré-carregamento; dá trabalho preparar |
| **Vídeo com `currentTime` = scroll** | Cena longa (5–10 s, >150 quadros), fotográfica ou vídeo de IA | Um arquivo só; compressão entre quadros (se não for all-intra) | Seek assíncrono; sem keyframe em todo quadro ele "pula" em blocos; all-intra pesa 3–5× mais; alpha não funciona igual em todo navegador; manias do iOS |
| **CSS scroll-driven** (`animation-timeline: scroll()/view()`) | Textos, cartões, parallax, barra de progresso, revelações | Zero JS; roda no compositor (transform/opacity); declarativo | Chrome/Edge 115+ e Safari 26+; Firefox só no Nightly/preview (out/2026), então precisa de `@supports` + fallback; não desenha canvas |
| **GSAP ScrollTrigger** (scrub, pin) | Coreografia complexa com muitas faixas, `snap`, depuração com `markers` | Linha do tempo única para quadros e textos; `scrub: 0.5` dá inércia; pin com espaçamento automático | Peso extra; licença proprietária grátis, que proíbe usar o GSAP para fazer um construtor visual de animação concorrente do Webflow |
| **Motion** (`useScroll`/`useTransform`/`useSpring`) | Projeto React/Next.js (o nosso padrão) | Tipado; `useSpring` sem overshoot sincroniza quadros e textos; usa ScrollTimeline acelerada quando pode | Roda na thread principal quando o valor vai para JS (canvas) |
| **Lenis** (rolagem suave) | "Sensação premium" no desktop | MIT; `lerp ≈ 0,1`; integra com ScrollTrigger | Opcional; **desligar** com "reduzir movimento"; não pode quebrar a rolagem por teclado nem o iOS |
| **Three.js / R3F** (drei `ScrollControls`) | Produto interativo (o usuário gira), configurador, cena simples | GLB leve; reage a mouse e toque; resolução infinita | GPU no celular; qualidade abaixo do Cycles; aparência depende do aparelho |
| **View Transitions** | Troca de estado ou de página (cartão vira página do produto) | Same-document é Baseline desde out/2025 (Chrome 125, Safari 18, Firefox 144) | **Não é scrub de scroll**: entra como complemento, não como técnica principal |

**Regra de bolso:**

- O produto é o herói e cabe em ≤150 quadros? Use **canvas**.
- É filmagem ou vídeo de IA longo? Use **vídeo all-intra**.
- O resto (textos e cartões) vai em **CSS scroll-driven** com fallback, ou na mesma linha do tempo JS do canvas.
- Atenção à sincronia:
  - Se o canvas usa inércia (lerp ou mola), os textos **têm de usar o mesmo progresso suavizado**.
  - Se os textos ficarem em CSS puro, tire a inércia do canvas. Senão, texto e quadro descolam.

### 1.1 Como a Apple faz (dados verificáveis)

- **AirPods Pro (2019):** 148 quadros JPG em `/anim/sequence/large/01-hero-lightpass/0001.jpg…0148.jpg`, desenhados num canvas conforme o scroll (artigo da CSS-Tricks, 2020).
- **Páginas atuais:** não verifiquei a contagem de quadros. As fontes de 2025–2026 citam de 60 a 180 imagens por sequência no "estilo Apple".
- **Dado de comunidade (fórum GSAP):** 147 quadros caíram de PNG 21 MB para WebP ≈ 4 MB, uns 27 KB por quadro. O mesmo autor relata que **no iPhone travava**: o celular precisa de um conjunto próprio, menor.

### 1.2 Suporte e licenças (conferidos em out/2026)

- **`animation-timeline`, `scroll()` e `view()`:**
  - Chrome/Edge 115, Chrome Android 115, Safari e Safari iOS 26.
  - Firefox: "preview" (MDN browser-compat-data, branch main). O MDN marca como *Limited availability*.
  - `animation-trigger`: só Chromium 146+.
- **GSAP:**
  - Standard "No Charge" License, da Webflow, em vigor desde 30/04/2025 e atualizada em 30/05/2025.
  - Uso comercial liberado, com todos os plugins.
  - É proibido usar o GSAP para construir uma ferramenta visual de animação sem código que concorra com o Webflow.
  - Gerar código GSAP com IA é permitido.
  - Versão atual no npm: 3.15.0.
  - Não é MIT: não copie texto literal da documentação. Os trechos abaixo são próprios.
- **Lenis** (darkroom.engineering): MIT, 1.3.x.
- **Motion:** MIT.
- **Three, R3F, drei:** MIT.

---

## 2. Números

| Item | Valor recomendado | Base |
|---|---|---|
| Quadros por cena | 60–150 | Apple 148; fontes citam 60–180 |
| Distância de rolagem por quadro | ≤ 20–25 px (com inércia, até ~30) | Ex.: 120 quadros em 300vh de 720px ≈ 18 px por quadro |
| Comprimento do pin | 200–400vh por cena; acima de 5 telas vira "sequestro de rolagem" | Prática corrente |
| Formato | **WebP com alpha** (padrão); AVIF quando a banda for o gargalo; JPG só sem alpha | Medição abaixo |
| Tamanho do quadro (desktop) | Largura máxima exibida × DPR ≤ 2 → 1280–1600 px | Nunca maior que o maior tamanho exibido |
| Tamanho do quadro (celular) | Render vertical separado, 720–900 px de largura | Fórum GSAP: o iPhone travava com o conjunto do desktop |
| Peso por quadro | 20–60 KB (fotorrealista, WebP q70–80) | 147 quadros ≈ 4 MB (fórum) |
| Orçamento total | Desktop ≤ 3–6 MB; celular ≤ 1,5–2,5 MB; Save-Data só pôster ou meia taxa | Proposta |
| **Memória decodificada** | `L × A × 4` bytes: 1920×1080 = **8,3 MB por quadro** (150 quadros = 1,2 GB!); 1280×720 = 3,7 MB | Aritmética. Por isso não segure todos os `ImageBitmap`s. |
| Vídeo all-intra | 1280 px, 30 fps: ~8 MB (MP4) e ~13 MB (WebM); GOP normal 1–2 MB; 1080p all-intra pode passar de 100 MB | hontran.dev, jul/2026 |
| Inércia (scrub) | lerp 0,15–0,2 por 16,7 ms (por tempo, não por quadro); `scrub: 0.5–1` no GSAP; mola `{stiffness: 200, damping: 40}` sem overshoot | Teste |

### 2.1 O que medimos no teste

60 quadros a 1280×720, gráfico simples, Chromium headless:

| Variante | Total | Por quadro | Carregar + decodificar (sequencial) |
|---|---|---|---|
| WebP com alpha (`-quality 80`) | 796 KB | 13,3 KB | **13,0 ms** |
| AVIF com alpha (libaom, `-crf 32`) | 294 KB | 4,9 KB | **32,6 ms** (2,5× mais lento) |
| H.264 all-intra (`-g 1`, crf 23, sem alpha) | 432 KB | – | – |
| H.264 GOP 250 (normal) | 137 KB | – | – (o all-intra fica **3,2× maior**) |
| VP9 all-intra (crf 32) | 629 KB | – | – |

**Conclusão:**

- **WebP é o padrão.** AVIF fica 2–3× menor, mas decodifica 2–3× mais devagar, e os navegadores descartam a imagem decodificada quando falta memória e decodificam de novo ao desenhar. Isso pesa no scrub.
- AVIF só vale com poucos quadros, ou se o teste no aparelho real mostrar que dá.

---

## 3. Receitas de código (próprias)

### 3.1 Canvas + scroll, sem dependências (testado)

Arquivo completo: `teste-scroll/index.html`. Os pontos que importam:

- **Pin:** `.cine { height: 400vh }` e `.palco { position: sticky; top: 0; height: 100vh; overflow: clip }`. Não precisa de JS. O recorte fica na borda da tela, que é uma borda real da cena (regra 2).
- **Camadas** (regra 3): fundo CSS (`z 0`), depois textos (`z 1`), depois **canvas com quadros transparentes** (`z 2`, `pointer-events: none`).
- **Geometria lida só no resize** (`ResizeObserver`):
  - `top` e `len` da seção;
  - `canvas.width = clientWidth × min(DPR, 2)`.
  - No scroll, o código lê **apenas** `scrollY`.
- **Laço:**
  - `scroll` (passivo) → `requestAnimationFrame` → progresso `p = clamp((scrollY − top) / len)`;
  - inércia por tempo: `cur += (p − cur) × (1 − 0,82^(dt/16,7))`;
  - quadro = `round(cur × (N − 1))`;
  - **só redesenha quando o quadro muda**.
- **Carregamento:**
  - o 1º quadro vem com `<link rel=preload fetchpriority=high>` (é o LCP);
  - o resto entra em ordem grosso → fino (passos 8, 4, 2, 1), 6 por vez, com `img.decode()`;
  - enquanto falta um quadro, desenha o **mais próximo já carregado**.
- **Textos:**
  - faixas de progresso **que não se sobrepõem**: A entra em 0,06–0,22, fica parado até 0,40 e sai em 0,40–0,50; B entra em 0,78–0,92;
  - só `transform` e `opacity`;
  - entrada `easeOutCubic`, que não passa do ponto.

```js
// núcleo (resumido do teste)
const tick = now => {
  raf = 0;
  const dt = last ? Math.min(64, now - last) : 16.7; last = now;
  const t = clamp((scrollY - top) / len);
  cur += (t - cur) * (reduzir ? 1 : 1 - Math.pow(0.82, dt / 16.7));
  if (Math.abs(t - cur) < 5e-4) cur = t;
  const i = Math.round(cur * (N - 1));
  desenhar(i);   // drawImage "contain" do quadro i (ou do mais próximo carregado)
  textos(cur);   // mesmo progresso suavizado = sincronia
  if (cur !== t) kick(); else last = 0;
};
addEventListener('scroll', kick, { passive: true });
```

### 3.2 React/Next.js com Motion (componente proposto para a skill)

Não foi testado aqui. A lógica é a mesma da versão HTML testada.

```tsx
'use client';
import {useEffect, useRef} from 'react';
import {motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion} from 'motion/react';

type Props = {total: number; padrao: (i: number) => string; poster: string; alt: string};

export function SequenciaScroll({total, padrao, poster, alt}: Props) {
  const secao = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<(HTMLImageElement | undefined)[]>([]);
  const desenhado = useRef(-1);
  const reduzir = useReducedMotion();

  const {scrollYProgress} = useScroll({target: secao, offset: ['start start', 'end end']});
  // Mola sem overshoot (damping ≥ 2√stiffness): quadros e textos usam o MESMO valor.
  const p = useSpring(scrollYProgress, {stiffness: 200, damping: 40, restDelta: 0.0005});

  const desenhar = (v: number, forcar = false) => {
    const c = cv.current; if (!c) return;
    const alvo = Math.round(v * (total - 1)), L = imgs.current;
    let i = -1;
    for (let d = 0; d < total; d++) { if (L[alvo - d]) { i = alvo - d; break; } if (L[alvo + d]) { i = alvo + d; break; } }
    if (i < 0 || (i === desenhado.current && !forcar)) return;          // mais próximo já carregado
    const im = L[i]!;
    const ctx = c.getContext('2d')!, s = Math.min(c.width / im.naturalWidth, c.height / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(im, (c.width - w) / 2, (c.height - h) / 2, w, h);
    desenhado.current = i;
  };
  useMotionValueEvent(p, 'change', (v) => desenhar(v));

  useEffect(() => { // pré-carrega grosso → fino
    if (reduzir) return;
    let vivo = true, q = 0;
    const ordem = [0, total - 1];
    for (const s of [8, 4, 2, 1]) for (let i = 0; i < total; i += s) if (!ordem.includes(i)) ordem.push(i);
    const prox = () => {
      if (!vivo || q >= ordem.length) return;
      const i = ordem[q++], im = new Image(); im.src = padrao(i);
      im.decode().then(() => { if (vivo) { imgs.current[i] = im; desenhar(p.get(), true); } }).catch(() => {}).finally(prox);
    };
    for (let k = 0; k < 6; k++) prox();
    return () => { vivo = false; };
  }, [total, reduzir]);

  useEffect(() => { // tamanho só no resize
    const c = cv.current; if (!c) return;
    const ro = new ResizeObserver(() => {
      const d = Math.min(devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * d); c.height = Math.round(c.clientHeight * d); desenhar(p.get(), true);
    });
    ro.observe(c); return () => ro.disconnect();
  }, []);

  // Textos: faixas sem sobreposição (regra 1); A vem da borda (regra 4); B sai de trás do produto.
  const xA = useTransform(p, [0.06, 0.22, 0.40, 0.50], ['-100vw', '0vw', '0vw', '-100vw']);
  const xB = useTransform(p, [0.78, 0.92], [0, 330]);
  const oB = useTransform(p, (v) => (v > 0.78 ? 1 : 0));

  if (reduzir) return (/* versão parada: pôster + textos lado a lado, sem pin */
    <section className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-6 py-12">
      <h2>Gira.</h2><img src={poster} alt={alt} /><p>60 quadros</p>
    </section>);

  return (
    <section ref={secao} style={{height: '400lvh', position: 'relative'}}>
      <div style={{position: 'sticky', top: 0, height: '100svh', overflow: 'clip'}}>
        <motion.h2 style={{x: xA, position: 'absolute', zIndex: 1}}>Gira.</motion.h2>
        <motion.p style={{x: xB, opacity: oB, position: 'absolute', zIndex: 1}}>60 quadros</motion.p>
        <canvas ref={cv} role="img" aria-label={alt}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none'}} />
      </div>
    </section>);
}
```

**Next.js:**

- Quadros em `public/seq/{d,m}/f_0001.webp`.
- Escolha o conjunto `d` ou `m` com `matchMedia('(max-width: 700px)')` **antes** de carregar.
- O pôster vira `<link rel="preload" fetchpriority="high">` no `head`.
- Arquivos com nome versionado e `Cache-Control: immutable`.

### 3.3 CSS scroll-driven para os textos (sem JS)

```css
@supports (animation-timeline: view()) {
  .cine { view-timeline: --cine block; }          /* seção alta com palco sticky dentro */
  #tA {
    animation: tA linear both;
    animation-timeline: --cine;                    /* SEMPRE depois do shorthand `animation` */
    animation-range: contain 6% contain 50%;       /* contain 0–100% = palco preso do início ao fim */
  }
  @keyframes tA {                                  /* % = (p − 0,06) / 0,44 */
    0%   { transform: translateX(-100vw); animation-timing-function: cubic-bezier(.165,.84,.44,1); }
    36%  { transform: translateX(0); }             /* p = 0,22: pousou */
    77%  { transform: translateX(0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
    100% { transform: translateX(-100vw); }        /* p = 0,50: saiu pela mesma borda */
  }
}
@media (prefers-reduced-motion: reduce) { #tA { animation: none; } }
```

- **Canvas em CSS puro:** só é possível com um sprite sheet e `steps(N)`. Serve para ≤ ~30 quadros pequenos, por causa do limite de textura de ~16k px. Em JS, `new ScrollTimeline({source: document.documentElement})` dá o progresso sem ler o layout.
- **Sincronia:** se os textos estão em CSS, o canvas **não** pode ter inércia (lerp 1). Senão eles descolam.

### 3.4 GSAP ScrollTrigger + Lenis (licença permite; trechos próprios)

```js
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const lenis = new Lenis({lerp: 0.1});                 // opcional
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(raf); gsap.ticker.lagSmoothing(0);

  const seq = {f: 0};
  const tl = gsap.timeline({
    defaults: {ease: 'none'},
    scrollTrigger: {trigger: '.cine', start: 'top top', end: '+=300%', pin: '.palco', scrub: 0.6},
  });
  // duração total = 1 → as posições abaixo são frações do progresso
  tl.to(seq, {f: N - 1, snap: 'f', duration: 1, onUpdate: () => desenhar(seq.f)}, 0)
    .fromTo('#tA', {x: '-100vw'}, {x: 0, ease: 'power3.out', duration: 0.16}, 0.06)
    .to('#tA', {x: '-100vw', ease: 'power3.in', duration: 0.10}, 0.40)
    .set('#tB', {autoAlpha: 1}, 0.78)                   // já está escondido atrás do produto
    .fromTo('#tB', {x: 0}, {x: 330, ease: 'power3.out', duration: 0.14}, 0.78);

  return () => { gsap.ticker.remove(raf); lenis.destroy(); };
});
```

- **Com GSAP, o pin é o do próprio GSAP:** a seção **não** leva `height: 400vh`, porque `end: '+=300%'` cria o espaço. Não misture com o `sticky`.
- **React:** `useGSAP()` do `@gsap/react` limpa tudo ao desmontar.

### 3.5 Vídeo ligado ao scroll (quando não for sequência)

```bash
# all-intra (todo quadro é keyframe): seek exato; listar o WebM antes do MP4 no <video>
ffmpeg -i in.mov -vf scale=1280:-2 -r 30 -an -c:v libx264 -crf 23 -g 1 -pix_fmt yuv420p -movflags +faststart scrub.mp4
ffmpeg -i in.mov -vf scale=1280:-2 -r 30 -an -c:v libvpx-vp9 -crf 32 -b:v 0 -g 1 -row-mt 1 -pix_fmt yuv420p scrub.webm
# meio-termo (arquivo menor, seek um pouco menos exato): -g 6 -keyint_min 6
```

```js
// <video muted playsinline preload="auto"> (nunca .play()); um seek por vez
let ocupado = false, alvo = 0;
const ir = () => { if (!Number.isFinite(v.duration)) return; ocupado = true; v.currentTime = alvo; };
v.addEventListener('seeked', () => { ocupado = false; if (Math.abs(v.currentTime - alvo) > 1 / 60) ir(); });
aoProgresso((p) => { alvo = p * v.duration; if (!ocupado) ir(); });
```

**Dicas:**

- Baixe o arquivo inteiro com `fetch()` e use `URL.createObjectURL(blob)`. Isso evita uma requisição de faixa a cada seek.
- No iOS, o `preload` costuma ser ignorado. "Acorde" o vídeo no 1º toque com `play().then(pause)`.
- `yuv420p` evita a caixa preta no Safari.
- Alpha em vídeo não é igual em todo lugar: VP9 com alpha no Chrome/Firefox, HEVC com alpha no Safari. **Se o produto precisa ficar por cima do texto, prefira a sequência WebP.**

### 3.6 Three.js / R3F (resumo)

- **Como fazer:** `<ScrollControls pages={4} damping={0.2}>` e, dentro, `const s = useScroll(); useFrame(() => { modelo.rotation.y = s.range(0, 1/2) * Math.PI })`.
- **Textos:** use o `<Scroll html>` do drei, ou textos DOM fora do canvas, com a mesma regra de faixas.
- **Quando vale:**
  - quando a pessoa deve **girar o produto** com o dedo;
  - ou quando o GLB (1–3 MB) sai mais leve que 150 quadros.
- **Para beleza cinematográfica,** quadros pré-renderizados no Blender ganham.

---

## 4. Pipeline com o que temos

```
Blender (produto.py) ─┐                         ┌─ web/d/f_0001..N.webp  (desktop 16:9, 1280–1600 px)
Remotion (--sequence)─┼─► PNG RGBA ─► ffmpeg ─► ├─ web/m/f_0001..N.webp  (celular 9:16, 720–900 px, render próprio)
Vídeo de IA (mp4) ────┘   (sem alpha)           ├─ web/lite/…            (meia taxa: Save-Data / aparelho fraco)
                                                ├─ poster.webp           (melhor quadro; reduzir movimento / sem JS)
                                                └─ manifest.json         ({total, largura, altura, padrao, poster})
```

1. **Blender** (skill `blender-ia`, `produto.py`):
   - `--frames 1-120`, PNG RGBA com `film_transparent`.
   - **Renderize de novo para o celular**, com câmera vertical. Não recorte, porque o produto não pode ser cortado no meio (regra 2).
   - Guarde o `<prefixo>caixas.json`: ele dá a caixa 2D do produto **por quadro**. Ele serve para:
     - checar se nenhum texto fica sob o produto antes de ser lido;
     - calcular de onde um texto "sai de trás" (o centro da caixa, com um cartão menor que a menor caixa).
2. **Remotion:**
   - `npx remotion render <entrada> <Comp> out/seq --sequence --image-format=png --frames=0-119`.
   - Composição com fundo transparente: o fundo e os textos vêm do site, não do render.
   - Conferir as flags na 4.0.534.
3. **Vídeo de IA** (Higgsfield/Kling etc., 5–10 s a 24 fps): `ffmpeg -i ia.mp4 -vf "fps=24,scale=1280:-2" -c:v libwebp -quality 75 web/d/f_%04d.webp`.
   - Não tem alpha. O vídeo vira o **fundo** da cena, e os textos ficam em áreas vazias do quadro.
   - Confira a cintilação entre quadros, que é comum em IA.
   - Se ficar longo (mais de 150 quadros), use a rota do vídeo all-intra (seção 3.5).
4. **Otimização** (comandos testados no ffmpeg 6.1):

```bash
# PNG RGBA → WebP com alpha (desktop)
ffmpeg -i png/phone_%04d.png -vf "scale=1600:-2" -c:v libwebp -quality 78 -compression_level 6 web/d/f_%04d.webp
# conjunto "lite": metade dos quadros
ffmpeg -i png/phone_%04d.png -vf "select='not(mod(n\,2))',scale=1280:-2" -fps_mode vfr -c:v libwebp -quality 72 web/lite/f_%04d.webp
# AVIF (opcional, só se medir bem no aparelho)
ffmpeg -i png/phone_0001.png -c:v libaom-av1 -still-picture 1 -crf 32 -cpu-used 6 web/avif/f_0001.avif
```

**Atenção no ffmpeg:**

- No filtro `rotate`, use `c=black@0` para o fundo transparente.
- `c=none` deixa sujeira dos quadros anteriores. O bug apareceu no teste e foi corrigido.

5. **Site:** componente da seção 3.1 (HTML) ou 3.2 (Next.js + Motion). O manifesto diz quantos quadros carregar e qual conjunto usar.

### 4.1 As 4 regras do editor aplicadas ao scroll

| Regra | Como garantir no scroll |
|---|---|
| 1. Nada de texto sobre texto | As faixas de progresso dos textos **não se sobrepõem**: a saída de A acaba antes de B entrar. Textos em áreas diferentes. O teste confere as caixas com `getBoundingClientRect` em cada posição. |
| 2. Nenhum recorte no meio da tela | Sem `clip-path` ou máscara para revelar texto. O `overflow: clip` fica só no palco, que é a borda da tela. Quadros renderizados inteiros com alpha, nunca recortados. Desfoque só com folga. |
| 3. Elemento principal por cima do texto | Canvas com **quadros transparentes** acima da camada de texto. Com quadros opacos ou vídeo, o texto fica em espaço vazio, conferido com o `caixas.json`. |
| 4. Texto entra pela borda ou de trás do produto | `translateX(-100vw → 0)` a partir da borda; ou nasce no centro do produto (`z-index` abaixo do canvas, menor que o círculo inscrito no produto) e desliza para fora. |
| Tempo de leitura | Cada texto fica parado por ≥ 15–20% do pin, uns 50vh de rolagem. No teste: 0,22–0,40 de 300vh = 54vh. |

---

## 5. Acessibilidade e desempenho

**Reduzir movimento** (`prefers-reduced-motion: reduce`):

- **Não** só desacelerar. Troque por uma versão parada:
  - pôster (o melhor quadro) + textos lado a lado;
  - sem pin, sem scrub, sem Lenis, sem parallax.
- Opcional: 3–4 quadros-chave como "storyboard" empilhado.
- O teste valida: a seção vira 720px (uma tela) e o pôster aparece.

**Sem JS:** o `<img class="poster">` já está no HTML. O canvas só aparece com a classe `js`.

**Texto real:**

- `h2` e `p` no DOM, na ordem de leitura.
- O canvas leva `role="img"` + `aria-label`, ou `aria-hidden` se for decorativo.
- Nenhuma informação só dentro dos quadros.

**Rolagem nativa:**

- Teclado (espaço, PageDown), leitor de tela e "voltar ao topo" funcionam.
- Nada de sequestrar a roda do mouse.
- Pin ≤ 3–5 telas.
- WCAG 2.3.3 (animação a partir de interação) e 2.2.2.

**Desempenho:**

- No scroll, só `scrollY` (passivo) e um `rAF`. Nada de `getBoundingClientRect` ou `offsetTop` no scroll. Medidas no `ResizeObserver`.
- Só redesenha quando o índice muda. Textos só com `transform` e `opacity`.
- Canvas = tamanho CSS × `min(DPR, 2)`.
- `img.decode()` antes de usar. Não guarde 150 `ImageBitmap`s a 1080p (1,2 GB). Deixe o navegador gerir as `Image`s, ou mantenha uma janela de ±10 bitmaps.
- **Carregamento preguiçoso:**
  - 1º quadro com `fetchpriority=high`;
  - o resto quando a seção está a 1–2 telas de distância (`IntersectionObserver` com `rootMargin: '200% 0px'`), em ordem grosso → fino.
- **Celular:**
  - conjunto vertical próprio;
  - `navigator.connection?.saveData` → conjunto *lite* ou só o pôster;
  - altura do palco em `100svh` e seção em `lvh`, para a barra de endereço não "pular".
- **Cache:** nomes versionados e `immutable`. Com HTTP/2 ou 3, muitos arquivos pequenos não são problema.

---

## 6. Resultado do teste (`teste-scroll/`)

**Arquivos:**

- `gerar-quadros.sh`: o ffmpeg gera 60 quadros WebP RGBA de um "aparelho" que gira 225° e cresce, com o número do quadro desenhado nele.
- `index.html`: página sem dependências.
- `testar.js`: Playwright e Chromium headless.
- `medir-decode.js`: WebP × AVIF.
- `medidas/`: vídeos e AVIF de comparação.

**Resultado de `node testar.js`** (viewport de 1280×720):

| Posição (p) | Quadro desenhado | Esperado | Textos visíveis | Texto sobre texto | Screenshot |
|---|---|---|---|---|---|
| 0,28 | 18 | 18 | A ("Gira.", veio da borda esquerda) | não | `shots/1-texto-A.png` |
| 0,62 | 38 | 38 | nenhum (A já saiu, B não entrou) | não | `shots/2-entre-textos.png` |
| 0,83 | 50 | 50 | B saindo de trás do aparelho (o canto do aparelho cobre o cartão) | não | `shots/2b-B-saindo-de-tras.png` |
| 0,97 | 58 | 58 | B pousado à direita | não | `shots/3-texto-B.png` |
| reduzir movimento | pôster (60) | – | A e B lado a lado; seção = 720px, sem pin | não | `shots/4-reduzir-movimento.png` |

**Detalhes:**

- **Grade com as 4 telas principais:** `shots/_grade.png`.
- **Rolagem contínua de 1,5 s pela seção:** 60 rAF/s no headless, que usa renderização por software. Não vale como medida de celular.
- **Lição do próprio teste:** com inércia, esperar "assentou" logo depois do `scrollTo` lê o estado antigo. O teste espera `p ≈ alvo`. Na primeira rodada isso deu quadro 10 no lugar de 18.

---

## 7. Proposta de skill: `scroll-cinematico` (categoria `sites`)

Criar na main **com aprovação do Daniel** (regra do CLAUDE.md).

```
skills/sites/scroll-cinematico/
  SKILL.md              # quando usar cada técnica (tabela §1), regras do editor no scroll (§4.1), checklist
  references/
    tecnicas.md         # canvas, vídeo, CSS scroll-driven, GSAP (licença), Motion, Lenis, R3F, View Transitions
    numeros.md          # quadros, peso, memória, formatos, medições (§2)
    pipeline.md         # Blender/Remotion/IA → ffmpeg → site; caixas.json → zonas livres para texto
    acessibilidade-desempenho.md
  assets/
    scroll-sequencia.html   # versão testada (§3.1)
    SequenciaScroll.tsx     # Next.js + Motion (§3.2)
    textos-scroll.css       # receita CSS scroll-driven com @supports (§3.3)
  scripts/
    quadros.sh          # PNG/MP4 → webp d/m/lite + pôster + manifest.json (+ AVIF opcional)
    testar-scroll.js    # Playwright: N posições → quadro esperado, sobreposição de textos, reduzir movimento, screenshots
  APRENDIZADOS.md
```

**Gatilhos:** "site estilo Apple", "animação no scroll", "produto girando quando rola", "scrollytelling", "vídeo controlado pela rolagem".

**Integra com:**

- `blender-ia` (`produto.py --frames`, `caixas.json`);
- `remotion-video` (`--sequence`; regras do editor);
- `motion-oficial` (`useScroll`, `useSpring`);
- `estilos-premium/movimento-sites.md` (curvas; Lenis `lerp ≈ 0,1`).

**Checklist de revisão** (o script de teste cobre os 4 primeiros itens):

1. O quadro bate com o progresso em 3 ou mais posições.
2. Nenhum par de textos visível ao mesmo tempo na mesma área.
3. "Reduzir movimento" mostra o pôster.
4. Sem JS mostra o pôster.
5. Peso total dentro do orçamento (§2).
6. Celular com conjunto próprio.
7. Teste em iPhone e Android reais antes de publicar.

---

## Fontes

- GSAP Standard "No Charge" License (Webflow), efetiva em 30/04/2025: https://gsap.com/community/standard-license/
- GSAP README 3.15.0 (grátis, plugins incluídos): https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md
- MDN `animation-timeline` (Limited availability, `scroll()`, `view()`): https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- MDN browser-compat-data (Chrome 115, Safari 26, Firefox "preview"): https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json
- Chrome for Developers, Scroll-driven animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- ICS Media, CSS scroll-driven sem JS (Safari 26; `animation-trigger` só Chromium 146, ago/2026): https://ics.media/en/entry/230718/
- web.dev, same-document View Transitions Baseline (16/10/2025, Firefox 144): https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available
- Motion `useScroll`: https://motion.dev/docs/react-use-scroll
- Lenis README 1.3.x (integração com o ScrollTrigger): https://cdn.jsdelivr.net/gh/darkroomengineering/lenis@1.3.26/README.md
- Vídeo scrub que trava, correção all-intra (jul/2026): https://www.hontran.dev/blog/scroll-scrubbed-video-stutters-fix
- Scrubbing de vídeo com JS (custo dos keyframes): https://muffinman.io/blog/scrubbing-videos-using-javascript/
- CSS-Tricks, sequência do AirPods Pro (148 quadros, 2020): https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- Fórum GSAP, sequência do AirPods (PNG 21 MB → WebP 4 MB; iPhone travando): https://gsap.com/community/forums/topic/25188-airpods-image-sequence-animation-using-scrolltrigger/
- Custo de decodificação do AVIF (bunny.net): https://bunny.net/blog/lets-talk-avif-and-why-we-are-not-adding-support-just-yet/
