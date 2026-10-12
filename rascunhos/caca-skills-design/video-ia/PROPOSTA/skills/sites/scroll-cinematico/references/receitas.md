# Receitas de código (nossas)

Todo o código aqui foi escrito por nós. Nada foi copiado da documentação do GSAP (licença proprietária) nem de outras fontes. A versão testada de ponta a ponta é `assets/scroll-sequencia.html`; as receitas abaixo seguem a mesma lógica, mas **não** foram testadas no navegador (exceto onde está dito).

## 1. Núcleo do laço (canvas + scroll, sem dependências; testado)

```js
// Geometria (top, len, tamanho do canvas) só no ResizeObserver. Aqui só se lê scrollY.
const tick = now => {
  raf = 0;
  const dt = last ? Math.min(64, now - last) : 16.7; last = now;
  const t = clamp((scrollY - top) / len);
  cur += (t - cur) * (reduzir ? 1 : 1 - Math.pow(0.82, dt / 16.7)); // inércia por tempo: igual em 60 e 120 Hz
  if (Math.abs(t - cur) < 5e-4) cur = t;
  const i = Math.round(cur * (N - 1));
  desenhar(i);   // drawImage "contain" do quadro i (ou do mais próximo já carregado); só se i mudou
  textos(cur);   // MESMO progresso suavizado = sincronia
  if (cur !== t) kick(); else last = 0;
};
function kick() { if (!raf) raf = requestAnimationFrame(tick); }
addEventListener('scroll', kick, { passive: true });
```

Lição do teste: com inércia, ler o estado logo depois de um `scrollTo` dá o valor antigo. Espere `p ≈ alvo` (na 1ª rodada o teste leu o quadro 10 no lugar do 18).

## 2. CSS scroll-driven para os textos (sem JS)

```css
@supports (animation-timeline: view()) {
  .cine { view-timeline: --cine block; }          /* seção alta com o palco sticky dentro */
  #tA {
    animation: tA linear both;
    animation-timeline: --cine;                    /* SEMPRE depois do atalho `animation`, que a zera */
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

- Suporte (out/2026): Chrome/Edge 115+, Chrome Android 115+, Safari e Safari iOS 26+. Firefox só em preview: o `@supports` deixa o fallback em JS assumir. `animation-trigger` só no Chromium 146+.
- **Se os textos estão em CSS, o canvas não pode ter inércia** (lerp 1). Senão descolam.
- Canvas em CSS puro só com sprite sheet + `steps(N)`: até ~30 quadros pequenos (limite de textura ~16k px).
- Em JS, `new ScrollTimeline({source: document.documentElement})` dá o progresso sem ler o layout.

## 3. GSAP ScrollTrigger + Lenis

A licença do GSAP permite uso comercial grátis com todos os plugins (ver `ORIGEM.md`). Trecho nosso:

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

- Com GSAP, o pin é do GSAP: a seção **não** leva `height: 400vh` (`end: '+=300%'` cria o espaço). Não misture com sticky.
- React: `useGSAP()` do `@gsap/react` limpa tudo ao desmontar.
- `scrub: 0.5–1` dá a inércia; os textos estão na mesma linha do tempo, então ficam sincronizados.

## 4. Vídeo ligado ao scroll (quando não for sequência de quadros)

```bash
# all-intra (todo quadro é keyframe): busca exata. No <video>, liste o WebM antes do MP4.
ffmpeg -i in.mov -vf scale=1280:-2 -r 30 -an -c:v libx264 -crf 23 -g 1 -pix_fmt yuv420p -movflags +faststart scrub.mp4
ffmpeg -i in.mov -vf scale=1280:-2 -r 30 -an -c:v libvpx-vp9 -crf 32 -b:v 0 -g 1 -row-mt 1 -pix_fmt yuv420p scrub.webm
# meio-termo (arquivo menor, busca um pouco menos exata): -g 6 -keyint_min 6
```

```js
// <video muted playsinline preload="auto"> (nunca .play()); um seek por vez
let ocupado = false, alvo = 0;
const ir = () => { if (!Number.isFinite(v.duration)) return; ocupado = true; v.currentTime = alvo; };
v.addEventListener('seeked', () => { ocupado = false; if (Math.abs(v.currentTime - alvo) > 1 / 60) ir(); });
aoProgresso((p) => { alvo = p * v.duration; if (!ocupado) ir(); });
```

- Baixe o arquivo inteiro com `fetch()` e use `URL.createObjectURL(blob)`: evita uma requisição de faixa a cada seek.
- iOS costuma ignorar `preload`: "acorde" o vídeo no 1º toque com `play().then(pause)`.
- `yuv420p` evita a caixa preta no Safari.
- Alpha em vídeo não é igual em todo lugar (VP9 alpha no Chrome/Firefox, HEVC alpha no Safari). **Se o produto precisa ficar por cima do texto, use a sequência WebP.**
- O comando all-intra foi testado no ffmpeg do container: no `scrub.mp4`, todos os quadros saíram como keyframe.

## 5. Three.js / R3F

- `<ScrollControls pages={4} damping={0.2}>` e, dentro, `const s = useScroll(); useFrame(() => { modelo.rotation.y = s.range(0, 1 / 2) * Math.PI; })`.
- Textos: `<Scroll html>` do drei, ou textos DOM fora do canvas, com a mesma regra de faixas sem sobreposição.
- Vale quando o visitante deve **girar o produto** com o dedo, ou quando o GLB (1–3 MB) sai mais leve que 150 quadros. Para beleza cinematográfica, quadros pré-renderizados no Blender ganham.

## 6. View Transitions

Same-document é Baseline desde 16/10/2025 (Chrome 125, Safari 18, Firefox 144). Serve para trocar de estado ou de página (cartão vira página do produto). **Não é scrub de scroll**: use como complemento.
