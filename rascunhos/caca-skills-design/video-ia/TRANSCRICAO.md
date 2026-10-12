# Transcrição: pesquisas "Scroll cinematográfico + IA de vídeo" (11/10/2026)

Registro fiel do que os dois agentes de pesquisa acharam. Os textos completos estão em `pesquisa-A.md` (24 KB) e `pesquisa-B.md` (30 KB), nesta pasta. Aqui ficam todos os achados, números e fontes, sem opinião minha; minhas observações estão marcadas como **[transcrição]**.

---

## Pesquisa A: IA de vídeo grátis para sites premium

**Objetivo:** clipes curtos (produto girando, cenas abstratas, transições, fundos em loop) para animação de scroll em site de cliente, gastando zero.

### Resumo do agente
1. Nenhum serviço online grátis libera uso comercial sem marca d'água. Kling, Hailuo, Pika, PixVerse, Vidu, Higgsfield e Luma (sem plano grátis fixo) vetam ou não deixam claro. Runway permite, mas só 125 créditos uma vez e com marca d'água. Grátis = rascunho e aprovação com o cliente.
2. Caminho grátis e comercial: modelos abertos **Wan 2.2** (Apache 2.0) e **LTX-2.3/2.5** (grátis abaixo de US$ 10 mi/ano). Rodam no PC do Daniel com NVIDIA, ou com cota pequena no Hugging Face, Colab ou Kaggle.
3. A chave do Google AI Studio não dá Veo grátis: página oficial de preços (09/10/2026) mostra "Free Tier: Not available" para Veo 3.1 Standard, Fast e Lite e para o Gemini Omni. Com faturamento, Veo 3.1 Lite = US$ 0,05/s em 720p (~US$ 0,40 por 8 s). Não testado, para não gerar cobrança.
4. Google Flow (Veo 3.1): 50 créditos/dia para quem não assina (oficial) → ~5 clipes Lite ou 2 Fast por dia; melhor qualidade grátis; marca d'água; comercial não esclarecido. Rascunho.
5. No container (4 CPUs, 15 GB RAM, sem GPU) não dá para gerar vídeo por IA (os modelos nem cabem). Aqui: quadros no Blender e pós-produção no ffmpeg.

### Serviços online (plano grátis)
| Ferramenta | Grátis | Duração / resolução | Marca d'água | Comercial no grátis | Qualidade | Nota |
|---|---|---|---|---|---|---|
| Google Flow (Veo 3.1 Lite/Fast) | 50 créditos/dia sem acumular (oficial); Lite 10, Fast 20, Quality 100; pode bloquear no pico | 4/6/8 s; upscale 1080p só assinante | Sim ("Veo" fora do Ultra) + SynthID | Não esclarecido (pergunta sem resposta no fórum do Google); tratar como não | Excelente; 1º quadro; último quadro no 3.1 (conferir no Lite) | 7 (rascunho) |
| Kling | ~66 créditos/dia (há quem diga mensal), ~2 vídeos 720p, modelos antigos | 5 s, 720p | Sim | Não | Muito boa; início/fim em alguns modelos | 5 |
| Dreamina / CapCut (Seedance) | créditos diários (artigo cita 120/dia) | varia | Sim | Não verificado | Seedance 2.x topo | 4 |
| Runway | 125 créditos uma vez (oficial) | ~5 s | Sim (Standard US$ 12–15/mês remove) | Sim segundo um comparativo; resultado é do usuário; confirmar | Boa (Gen-4) | 4 |
| Hailuo / MiniMax | desde 2025 pacote de teste que expira em 3 dias | ~6 s, 720p | Sim | Não | Boa; início/fim no Hailuo 02 | 3 |
| Luma (Ray3.x) | sem plano grátis na página; créditos de teste possíveis | rascunho | Sim | Não no grátis antigo; comercial a partir do Plus (US$ 25–30/mês) | Muito boa; loop e keyframes | 3 |
| PixVerse | ~90 no cadastro, ~60/dia (fonte única, revendedora) | 360p–720p | divergente | Não | Média-boa; "Transition" | 3 |
| Vidu | ~40/mês ou "Off-Peak" ilimitado (divergente) | 720p | Sim (canto inferior direito) | Não | Boa; início/fim | 3 |
| Pika | 80/mês (Krea) ou 0 (outra fonte) | 480p | Sim | Não; Creator US$ 35/mês | Média; Pikaframes | 2 |
| Higgsfield (conector do ambiente) | 0–10 créditos/dia (divergente) | — | Provável | Não no grátis | Agrega Kling, Veo, Seedance, Wan; o conector gasta créditos pagos | 2 |
| Grok Imagine | vídeo quase só pago (SuperGrok ~US$ 30/mês) | — | Sim nos planos baixos | resultado do usuário, no pago | Média | 2 |
| Meta AI / Vibes | grátis no lançamento, limites não publicados | curto | invisível + rótulo "IA" | não esclarecido | pouco controle | 2 |
| Gemini app | grátis não gera vídeo (agora Gemini Omni, pago); promo de 10 vídeos acabou em 04/08/2026 | — | — | — | — | 0 |
| Sora | app de consumo encerrado em 26/04/2026 | — | — | — | — | 0 |
| API Gemini, Veo 3.1 Lite (pago) | US$ 0,05/s 720p, US$ 0,08/s 1080p; 8 s 1080p = US$ 0,64 | 4–8 s, até 1080p | SynthID; marca visível não documentada | comercial ok (termos Cloud/API) | Excelente | 8 se aprovar gasto |
| Google Cloud, teste US$ 300/90 dias | conta nova e cartão; blogs dizem que serve para Veo, sem confirmação para o 3.1 | — | — | comercial ok | Excelente | só se o Daniel quiser |

### Modelos abertos
| Modelo | Licença | VRAM | Saída | Recursos | Nota |
|---|---|---|---|---|---|
| Wan 2.2 (TI2V-5B, T2V/I2V-A14B; Alibaba, jul/2025) | Apache 2.0 (conferido no HF) | 5B ~8 GB (GGUF + offload); 14B 6–8 GB em 480p (GGUF Q3/Q4), 12 GB confortável (Q5/Q6); FP16 50 GB+ | 720p ~5 s; 24 fps (5B), 16 fps (14B) | texto/imagem→vídeo; início/fim (Wan2.1-FLF2V-14B Apache 2.0 e workflows 2.2) → loop; ComfyUI; Wan 2.5–3.0 fechados | 8 |
| LTX-2.5 (jul/2026, 22B) e LTX-2.3 (mar/2026) | LTX-2.x Community: grátis abaixo de US$ 10 mi/ano (conferida); 2.5 pede aceite no HF (automático) | 2.3: ~10 GB (Q4 GGUF 960×544), ~16 GB (FP8 720p); 2.5: 22B + Gemma 12B → 24–32 GB, ou menos com `--quantization fp8-cast --offload cpu` | até 4K, 24–50 fps, ~5–10 s, com áudio | KeyframeInterpolation; IC-LoRA Alpha-Gen (matte alpha); LoRA Slow-Motion-Control; Restore; SDR→HDR; destilado | 9 |
| HunyuanVideo 1.5 (Tencent, nov/2025, 8,3B) | Tencent Community: comercial ok, não vale na UE, Reino Unido e Coreia do Sul, inclusive para exibir lá (cláusula 5c) | ~14 GB c/ offload; 24 GB | 720p 5–10 s | rostos, várias pessoas | 5 |
| CogVideoX 2B / 5B / 1.5-5B | 2B Apache 2.0; 5B comercial com cadastro na Zhipu e ≤ 1 mi visitas/mês | 8–12 GB | 720×480, 6 s, 8 fps (1.5: 1360×768) | ultrapassado | 3 |
| Mochi 1 (Genmo) | Apache 2.0 | ~20 GB (ComfyUI) / 24 GB | 480p ~5 s 30 fps | segue bem o prompt; ultrapassado | 3 |
| SVD-XT | Stability Community: cadastro e < US$ 1 mi/ano | < 10 GB | 1024×576, 14–25 quadros | só I2V, movimento fraco | 2 |
| Step-Video-T2V (StepFun, 30B) | MIT | 80 GB | — | grande demais | 1 |

**Onde rodar grátis:** container: nada de geração (LTX-2.5 ~44 GB de pesos + ~24 GB do codificador; Wan 5B em CPU levaria horas para 2 s). **HF Spaces ZeroGPU:** oficial 2 min/dia sem login, 3,5 min/dia com conta grátis (PRO 25 min); ~1 clipe/dia em `Lightricks/LTX-2-3`, `multimodalart/wan-2-2-first-last-frame`, `zerogpu-aoti/wan2-2-fp8da-aoti-faster`; cada chamada reserva a duração declarada; o LTX-2.3 pede 150 s (sem login nunca cabe). **Kaggle:** ~30 h/semana (T4 ×2 ou P100, 16 GB), sessão até 12 h, telefone verificado; Wan 2.2 5B/14B GGUF e LTX-2.3 GGUF via diffusers; lento, mas comercial e sem marca. **Colab grátis:** T4 16 GB, cota não publicada (~15–30 h/semana), sessão até 12 h; restringe interfaces web remotas (túnel ComfyUI): usar notebook/diffusers. **PC do Daniel:** ilimitado, via ComfyUI.

**GPU (NVIDIA; Mac/AMD mal ou devagar):** 8 GB (3060 Ti/4060): Wan 2.2 5B GGUF, ~2–4 min por clipe de 5 s numa 4090 e bem mais nessa faixa; mínimo, só para testar. 12 GB (3060 12 GB/4070): Wan 14B Q5/Q6 e LTX-2.3 Q4; mínimo recomendado. 16 GB (4060 Ti 16 GB/4070 Ti Super/5070 Ti): LTX-2.3 FP8 720p, Hunyuan 1.5 com offload; bom custo-benefício. 24–32 GB (3090/4090/5090): LTX-2.5 FP8, 1080p+; ideal. RAM 32 GB+; disco 60–120 GB.

### Qualidade premium
- Produto consistente: imagem→vídeo a partir de render do Blender ou foto, ≤ 5 s, câmera lenta (LTX-2.5, Wan 2.2 I2V; Veo no rascunho). IA inventa detalhes em giro de 360°: giro completo com logo legível = Blender; IA para fundo e ambiência.
- Loop perfeito: quadro inicial = final (Wan FLF2V, LTX Keyframe, Luma Loop, Veo 3.1) ou crossfade no ffmpeg. Fundos abstratos fecham loop fácil.
- Câmera lenta: LTX-2.5 + LoRA Slow-Motion-Control; DFR do LTX (2×/4× fps). Prompt "very slow motion, locked camera".
- Fundo limpo: quadro inicial liso + negative prompt; LTX-2.5 Alpha-Gen dá alpha.
- Controle de 1º e último quadro (essencial para scroll): LTX-2.5 KeyframeInterpolation, Wan FLF2V, Veo 3.1 (Flow).

### Top 3 do agente
1. LTX-2.5/2.3 local (9): licença grátis comercial, sem marca, até 4K, início/fim, alpha, câmera lenta, destilado. GPU 16 GB (2.3) ou 24–32 GB (2.5); sem GPU, Space `Lightricks/LTX-2-3` com conta grátis (~1 clipe/dia).
2. Wan 2.2 local, Kaggle ou Colab (8): Apache 2.0, 8–12 GB, início/fim.
3. Google Flow (7, só rascunho): para entregar, refazer no LTX/Wan com o mesmo quadro inicial ou, com aprovação de gasto, Veo 3.1 Lite pela API (US$ 0,40–0,64 por clipe) com a chave existente depois de ligar o faturamento.
Fora do top 3: Kling e Dreamina para rascunho; Runway único que parece permitir comercial no grátis (125 créditos uma vez, com marca).

### Fluxo, prompts e ffmpeg
- Fluxo: Blender (quadro A e B, fundo liso, 1920×1080) → IA (I2V ou A→B; loop A = B) → ffmpeg (loop, scrub, WebM, sequência WebP) → site (currentTime ou canvas). Registrar modelo, versão, seed, prompt e licença no `APRENDIZADOS.md` do projeto.
- Prompts A (produto premium, perfume preto com tampa dourada, órbita de 90°), B (fundo de seda líquida azul-marinho e champanhe em loop), C (transição A→B), e negative prompt: transcritos literalmente em `PROPOSTA/.../references/ia-de-video.md`. Ajustes: 5 s, 24 fps, seed fixa; Wan "lightning" com CFG baixo; LTX-2.5 com DFR na versão final.
- ffmpeg testado (vídeo sintético em `ffteste/`): loop com crossfade (`trim=X:D`, `trim=0:X`, `offset = D-2X`), scrub all-intra `-g 1` (todos os quadros saíram keyframe), WebM VP9 crf 34, sequência WebP q80. Com alpha do Alpha-Gen: PNG com alpha → `blender-ia/scripts/png_para_video.sh`.

### Alertas de licença do agente
Plano grátis ≠ comercial; não remover marca d'água (viola termos; SynthID fica); Flow grátis não confirmado; LTX-2.x < US$ 10 mi/ano somando afiliadas (se o cliente grande rodar o modelo, precisa de licença paga; quando o Daniel roda e entrega o vídeo, quem usa é o Daniel); HunyuanVideo 1.5 evitar em site público; SVD cadastro e < US$ 1 mi; CogVideoX-5B cadastro; Wan 2.2, Mochi e CogVideoX-2B Apache 2.0; licença do modelo não cobre marca de terceiros, nada de visual de iPhone/Apple; Higgsfield gasta créditos pagos, só com aprovação; termos mudam todo mês e vários números vêm de blogs contraditórios. Não é parecer jurídico.

### Teste do agente
- API Gemini: não testada (sem plano grátis; poderia cobrar). A chave não foi lida nem impressa.
- HF ZeroGPU sem login: 1 geração no `Lightricks/LTX-2-3` (I2V, 3 s, 768×512, quadro inicial de esfera champanhe feito em numpy): **recusada por cota** (pede 150 s; o IP compartilhado tinha 55 s). 2ª tentativa no `zerogpu-aoti/wan2-2-fp8da-aoti-faster` (4 passos, 2 s): limite de execuções anônimas. Nenhum vídeo, nenhum custo.
- Conclusão: a rota grátis sem GPU exige conta grátis no HF criada pelo Daniel (3,5 min/dia, ~1 clipe LTX/dia); token em `/root/.config/rotina/`; a chamada está pronta em `scripts/gerar_ltx.py`.
- Arquivos: `teste/quadro-inicial.png`, `scripts/gerar_ltx.py`, `scripts/gerar_wan.py`, `scripts/esfera.py`, `ffteste/`.

### Fontes (11/10/2026)
**Oficiais:** https://ai.google.dev/gemini-api/docs/pricing · https://support.google.com/flow/answer/16526234?hl=en · https://runway.com/pricing · https://lumalabs.ai/pricing · https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x · https://github.com/Lightricks/LTX-2 · https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Alpha-Gen · https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5/blob/master/LICENSE · https://huggingface.co/THUDM/CogVideoX-5b/blob/main/LICENSE · https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt · https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B · https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B · https://huggingface.co/docs/hub/spaces-zerogpu

**Secundárias (com ressalva):** https://whichoneisreal.com/compare/best-free-ai-video/ · https://www.krea.ai/blog/best-free-ai-video-generators-in-2026 · https://diyai.io/ai-tools/video-generation/google-veo-pricing/ · https://discuss.ai.google.dev/t/inquiry-about-commercial-use-of-videos-generated-via-google-labs-flow-free-tier-for-a-contest/169174 · https://aireiter.com/blog/kling-ai-free-tier-2026 · https://eesel.ai/blog/kling-ai-pricing · https://costbench.com/software/ai-video-generators/hailuo-ai/free-plan/ · https://aireiter.com/blog/hailuo-ai-pricing · https://eesel.ai/blog/luma-ai-pricing · https://costbench.com/software/ai-video-generators/vidu/free-plan/ · https://www.atlascloud.ai/blog/guides/pixverse-ai-free · https://creatify.ai/blog/is-higgsfield-free-free-plan-trials-and-promo-codes-explained-(2026) · https://zsky.ai/blog/is-higgsfield-free.html · https://wavespeed.ai/blog/ai-api-pricing/grok-imagine-video-free/ · https://aiimagetovideo.pro/blog/vibes-ai/ · https://pasqualepillitteri.it/en/news/9685/gemini-omni-ten-free-videos-august-4-deadline · https://dreamina.capcut.com/ai-video/free-ai-video-generators-recurring-credits-vs-trials-2026 · https://insiderllm.com/guides/local-ai-video-generation/ · https://wan2-7.io/blog/wan-3-0-open-source/ · https://gpuperhour.com/blog/free-cloud-gpus-and-credits · https://cloud.google.com/free

---

## Pesquisa B: scroll cinematográfico

### Resumo do agente
1. Produto que gira, abre ou monta: sequência WebP com alpha num `<canvas>` preso com sticky (Apple AirPods Pro: 148 JPGs).
2. Cena longa ou fotográfica (vídeo de IA): vídeo com `currentTime` ligado ao scroll, recodificado all-intra (`-g 1`).
3. Textos, cartões, parallax: CSS scroll-driven (`animation-timeline`), fora da thread principal; Chrome/Edge 115+, Safari 26+; Firefox estável ainda não → fallback JS.
4. GSAP grátis desde 30/04/2025 com todos os plugins, mas licença proprietária (Webflow "Standard No Charge"), não MIT.
5. Motion (`useScroll` + `useTransform` + `useSpring`) é o caminho em React/Next.js; Lenis opcional.
6. Teste: 60 quadros, canvas, sticky, 2 textos; quadro bateu nas 4 posições, sem texto sobre texto; reduzir movimento mostra o pôster.

### Técnicas (tabela do agente)
Canvas (herói de produto, 60–150 quadros; quadro exato, alpha; muitos arquivos, memória, pré-carga) · vídeo `currentTime` (cena longa >150 quadros; um arquivo; seek assíncrono, all-intra 3–5× mais pesado, alpha desigual, iOS) · CSS scroll-driven (textos, cartões, parallax, progresso; zero JS, compositor; Chrome/Edge 115+, Safari 26+, Firefox só Nightly/preview em out/2026, não desenha canvas) · GSAP ScrollTrigger (coreografia complexa, `snap`, `markers`; `scrub: 0.5`; pin automático; peso extra, licença proprietária que proíbe construtor visual concorrente do Webflow) · Motion (React/Next.js; tipado; `useSpring` sem overshoot; ScrollTimeline acelerada quando pode; thread principal quando vai para o canvas) · Lenis (MIT, `lerp ≈ 0,1`, integra com ScrollTrigger; desligar com reduzir movimento) · Three.js/R3F (drei `ScrollControls`; produto interativo; GPU do celular, abaixo do Cycles) · View Transitions (same-document Baseline desde out/2025: Chrome 125, Safari 18, Firefox 144; não é scrub).
Regra de bolso: herói ≤150 quadros → canvas; filmagem/IA longa → vídeo all-intra; textos → CSS com fallback ou mesma linha do tempo JS. Com inércia no canvas, os textos usam o mesmo progresso suavizado; textos em CSS puro → canvas sem inércia.

**Apple:** AirPods Pro (2019) 148 JPGs em `/anim/sequence/large/01-hero-lightpass/0001.jpg…0148.jpg` (CSS-Tricks, 2020); páginas atuais não verificadas (fontes 2025–2026: 60–180 imagens). Fórum GSAP: 147 quadros PNG 21 MB → WebP ≈ 4 MB (~27 KB/quadro); no iPhone travava → conjunto próprio para celular.

**Suporte e licenças (out/2026):** `animation-timeline`/`scroll()`/`view()`: Chrome/Edge 115, Chrome Android 115, Safari e Safari iOS 26; Firefox "preview" (MDN BCD main); MDN "Limited availability"; `animation-trigger` só Chromium 146+. GSAP: Standard "No Charge" (Webflow), desde 30/04/2025, atualizada 30/05/2025; comercial com todos os plugins; proibido construir ferramenta visual sem código concorrente do Webflow; gerar código GSAP com IA permitido; npm 3.15.0; não copiar texto da documentação. Lenis MIT 1.3.x; Motion MIT; Three/R3F/drei MIT.

### Números (tabela do agente)
Quadros 60–150 · rolagem ≤ 20–25 px por quadro (com inércia até ~30; 120 quadros em 300vh de 720 px ≈ 18 px) · pin 200–400vh por cena; acima de 5 telas = sequestro · WebP com alpha padrão, AVIF se banda for gargalo, JPG só sem alpha · desktop 1280–1600 px (largura exibida × DPR ≤ 2) · celular render vertical 720–900 px · 20–60 KB por quadro (WebP q70–80) · orçamento desktop ≤ 3–6 MB, celular ≤ 1,5–2,5 MB, Save-Data só pôster ou meia taxa (proposta) · memória `L × A × 4`: 1920×1080 = 8,3 MB/quadro (150 = 1,2 GB), 1280×720 = 3,7 MB · vídeo all-intra 1280 px 30 fps ~8 MB MP4, ~13 MB WebM; GOP normal 1–2 MB; 1080p all-intra >100 MB (hontran.dev, jul/2026) · inércia lerp 0,15–0,2 por 16,7 ms (por tempo), `scrub: 0.5–1`, mola `{200, 40}` sem overshoot.

**Medido (60 quadros 1280×720, Chromium headless):** WebP alpha q80 796 KB, 13,3 KB/quadro, 13,0 ms carregar+decodificar · AVIF alpha (libaom crf 32) 294 KB, 4,9 KB, 32,6 ms (2,5×) · H.264 all-intra crf 23 432 KB · H.264 GOP 250 137 KB (all-intra 3,2× maior) · VP9 all-intra crf 32 629 KB. Conclusão: WebP padrão; AVIF 2–3× menor mas 2–3× mais lento para decodificar, e o navegador descarta/redecodifica quando falta memória.

### Receitas (código próprio do agente)
- §3.1 Canvas sem dependências (testado): pin `.cine {height: 400vh}` + `.palco {sticky; 100vh; overflow: clip}`; camadas fundo z0 / textos z1 / canvas z2 `pointer-events: none`; geometria só no `ResizeObserver`; laço scroll passivo → rAF → `p` → inércia `cur += (p − cur) × (1 − 0,82^(dt/16,7))` → quadro; redesenha só quando muda; 1º quadro `preload fetchpriority=high`; resto grosso → fino (8, 4, 2, 1), 6 por vez, `img.decode()`; desenha o mais próximo carregado; textos A entra 0,06–0,22, parado até 0,40, sai 0,40–0,50; B entra 0,78–0,92; `easeOutCubic`.
- §3.2 Componente React/Next.js com Motion (não testado pelo agente): `useScroll({offset: ['start start','end end']})` + `useSpring({stiffness: 200, damping: 40, restDelta: 0.0005})`; `useMotionValueEvent` desenha; pré-carga grosso → fino; ResizeObserver; `useTransform` para os textos; versão parada com `useReducedMotion`; seção `400lvh`, palco `100svh`. Next.js: `public/seq/{d,m}/`, `matchMedia('(max-width: 700px)')` antes de carregar, pôster em preload, `immutable`.
- §3.3 CSS scroll-driven: `view-timeline: --cine block`, `animation-timeline` depois do atalho `animation`, `animation-range: contain 6% contain 50%`, keyframes com curvas por trecho; `@media (prefers-reduced-motion)`. Canvas em CSS puro só com sprite + `steps(N)` (≤ ~30 quadros, textura ~16k px). `new ScrollTimeline(...)` em JS. Textos em CSS → canvas sem inércia.
- §3.4 GSAP + Lenis: `gsap.matchMedia` com `prefers-reduced-motion: no-preference`; Lenis `lerp: 0.1` + `ScrollTrigger.update` + ticker; timeline `scrub: 0.6`, `pin: '.palco'`, `end: '+=300%'`; com GSAP não usar `height: 400vh` nem sticky; React `useGSAP()`.
- §3.5 Vídeo: all-intra H.264 crf 23 e VP9 crf 32 `-g 1` a 1280 px 30 fps; meio-termo `-g 6 -keyint_min 6`; um seek por vez com `seeked`; `fetch` + `createObjectURL`; iOS `play().then(pause)` no 1º toque; `yuv420p`; alpha em vídeo desigual → sequência WebP se o produto fica por cima do texto.
- §3.6 R3F: `<ScrollControls pages={4} damping={0.2}>`, `useScroll().range()`; `<Scroll html>`; vale para girar com o dedo ou GLB 1–3 MB; beleza → Blender.

### Pipeline e regras
- Blender (`produto.py --frames 1-120`, PNG RGBA `film_transparent`, render vertical próprio, `caixas.json` por quadro para zonas de texto e "sair de trás"); Remotion (`--sequence --image-format=png --frames=0-119`, fundo transparente; conferir flags na 4.0.534); IA (5–10 s a 24 fps → WebP; sem alpha → fundo; conferir cintilação; >150 quadros → vídeo all-intra); ffmpeg 6.1 testado (WebP desktop 1600 q78, *lite* metade dos quadros 1280 q72 com `select` + `-fps_mode vfr`, AVIF opcional); `rotate` com `c=black@0` (c=none deixou sujeira; corrigido); saída d/m/lite/poster/manifest.json.
- 4 regras do editor no scroll: faixas sem sobreposição e teste com `getBoundingClientRect`; sem `clip-path`, `overflow: clip` só no palco; canvas transparente acima dos textos (ou texto em espaço vazio pelo `caixas.json`); texto da borda (`translateX(-100vw → 0)`) ou de trás do produto; tempo de leitura ≥ 15–20% do pin (teste: 54vh).
- Acessibilidade: reduzir movimento = versão parada (pôster + textos, sem pin/scrub/Lenis/parallax; opcional storyboard); sem JS = pôster; texto real no DOM, canvas `role="img"` + `aria-label` ou `aria-hidden`; rolagem nativa, pin ≤ 3–5 telas, WCAG 2.3.3 e 2.2.2.
- Desempenho: só `scrollY` + rAF; medidas no `ResizeObserver`; redesenho só quando o índice muda; `transform`/`opacity`; canvas × `min(DPR, 2)`; `decode()`; sem 150 `ImageBitmap`s (janela ±10); pré-carga com `IntersectionObserver` `rootMargin: '200% 0px'`; celular com conjunto próprio, Save-Data → *lite*/pôster, `100svh`/`lvh`; nomes versionados e `immutable`, HTTP/2-3.

### Resultado do teste (`teste-scroll/`, viewport 1280×720)
| p | Quadro | Esperado | Textos visíveis | Texto sobre texto | Screenshot |
|---|---|---|---|---|---|
| 0,28 | 18 | 18 | A | não | `shots/1-texto-A.png` |
| 0,62 | 38 | 38 | nenhum | não | `shots/2-entre-textos.png` |
| 0,83 | 50 | 50 | B saindo de trás | não | `shots/2b-B-saindo-de-tras.png` |
| 0,97 | 58 | 58 | B pousado | não | `shots/3-texto-B.png` |
| reduzir movimento | pôster (60) | – | A e B lado a lado; seção 720 px | não | `shots/4-reduzir-movimento.png` |
Grade: `shots/_grade.png`. Rolagem contínua de 1,5 s: 60 rAF/s (headless, software). Lição: com inércia, esperar `p ≈ alvo` (1ª rodada deu quadro 10 no lugar de 18).

### Proposta do agente
Skill `scroll-cinematico` em `skills/sites/`, com aprovação do Daniel; gatilhos "site estilo Apple", "animação no scroll", "produto girando quando rola", "scrollytelling", "vídeo controlado pela rolagem"; integra com `blender-ia`, `remotion-video`, `motion-oficial`, `estilos-premium/movimento-sites.md`; checklist de 7 itens (os 4 primeiros cobertos pelo teste).

### Fontes
https://gsap.com/community/standard-license/ · https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md · https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline · https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json · https://developer.chrome.com/docs/css-ui/scroll-driven-animations · https://ics.media/en/entry/230718/ · https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available · https://motion.dev/docs/react-use-scroll · https://cdn.jsdelivr.net/gh/darkroomengineering/lenis@1.3.26/README.md · https://www.hontran.dev/blog/scroll-scrubbed-video-stutters-fix · https://muffinman.io/blog/scrubbing-videos-using-javascript/ · https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/ · https://gsap.com/community/forums/topic/25188-airpods-image-sequence-animation-using-scrolltrigger/ · https://bunny.net/blog/lets-talk-avif-and-why-we-are-not-adding-support-just-yet/

---

## O que a transcrição fez **[transcrição]**

- Montou a skill em `PROPOSTA/skills/sites/scroll-cinematico/` seguindo a proposta do agente B, com um ajuste: em vez de 4 arquivos de referência, o essencial (técnicas, números, pipeline, regras, acessibilidade, desempenho, checklist) ficou no `SKILL.md`; o código ficou em `references/receitas.md`; a pesquisa A virou `references/ia-de-video.md`.
- Testou de novo: `testar-scroll.js` generalizado (passou; acusa sobreposição quando provocada; agora testa também "sem JS"); `preparar-quadros.sh` novo (PNG RGBA e vídeo; alpha preservado); `SequenciaScroll.tsx` (`tsc --strict` + teste de fumaça no Chromium). Detalhes no `APRENDIZADOS.md` da skill.
- Corrigiu no componente: pôster duplicado atrás dos quadros com alpha, recarga a cada render do pai, mistura de `x` com `translateY`.
- Observações: a categoria `skills/sites/` não existe na `main` (categorias aprovadas: video, audio, design, texto, ferramentas-de-skills, combos); há outra proposta paralela (`hunter/sites/PROPOSTA/skills/sites/`) que também a cria. As skills citadas (`blender-ia`, `estilos-premium/references/movimento-sites.md`) existem em `origin/main`.
