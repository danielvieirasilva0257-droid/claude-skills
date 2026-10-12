# ORIGEM: skill scroll-cinematico

**Skill nossa** (não é de terceiros). Criada em 11/10/2026 a partir de duas pesquisas paralelas: agente A, "IA de vídeo grátis para sites premium" (com tentativa de geração no Hugging Face e testes de ffmpeg), e agente B, "Scroll cinematográfico" (com página de teste no Chromium headless). O registro fiel das duas está em `scratchpad/hunter/video-ia/TRANSCRICAO.md`; ao salvar na `main`, copiar `pesquisa-A.md`, `pesquisa-B.md` e a transcrição para `research_notes/Scroll cinematico e IA de video/`.

## Código

| Arquivo | Origem | Licença |
|---|---|---|
| `assets/scroll-sequencia.html` | `teste-scroll/index.html` do agente B, sem mudança de comportamento (só um comentário de uso no topo) | código nosso, sem restrição |
| `assets/SequenciaScroll.tsx` | componente proposto pelo agente B (§3.2), completado pelo agente de transcrição: textos como props, `useInView` para carregar perto da seção, pôster sob o canvas que some no 1º quadro, centralização fora do `motion.div` | código nosso |
| `scripts/gerar-quadros.sh` | `teste-scroll/gerar-quadros.sh` do agente B (só comentários novos) | código nosso |
| `scripts/testar-scroll.js` | `teste-scroll/testar.js` do agente B, generalizado: caminho por argumento, N lido da página, todos os `.txt`, teste sem JS, código de saída | código nosso |
| `scripts/preparar-quadros.sh` | escrito pelo agente de transcrição com os comandos ffmpeg testados pelo agente B (§4) | código nosso |
| `scripts/gerar_ltx.py`, `scripts/gerar_wan.py` | do agente A; acrescentados prompt por argumento e token opcional (`HF_TOKEN` ou `/root/.config/rotina/hf_token`) | código nosso; chamam Spaces de terceiros (licença dos modelos abaixo) |
| Receitas em `references/receitas.md` | trechos escritos pelos agentes (CSS, GSAP, vídeo, R3F) | código nosso |

**Nenhum texto de terceiros foi copiado.** Os prompts de exemplo são nossos. Os trechos de GSAP são nossos (a documentação do GSAP não é MIT, então nada dela foi copiado).

## Bibliotecas citadas e licenças (conferidas em out/2026)

| Biblioteca | Licença | Observação |
|---|---|---|
| **GSAP 3.15.0** (ScrollTrigger, SplitText e todos os plugins) | **Proprietária: Webflow "Standard No Charge" License**, em vigor desde 30/04/2025, atualizada em 30/05/2025. **Não é MIT.** | Grátis, inclusive uso comercial e todos os plugins. **Proibido** usar o GSAP para construir uma ferramenta visual de animação sem código que concorra com o Webflow. Gerar código GSAP com IA é permitido. Não copiar texto da documentação. https://gsap.com/community/standard-license/ |
| Motion 14 (`motion/react`) | MIT | testado com 14.1.0 |
| Lenis 1.3.x (darkroom.engineering) | MIT | opcional |
| three, @react-three/fiber, drei | MIT | |
| ffmpeg | LGPL/GPL (o libx264 é GPL) | só ferramenta; os arquivos gerados são nossos |
| Playwright | Apache 2.0 | só no teste |

## Modelos e serviços de IA de vídeo (licença do resultado)

Resumo; a tabela completa está em `references/ia-de-video.md`.

| Modelo / serviço | Licença | Comercial |
|---|---|---|
| Wan 2.2 (Alibaba) | Apache 2.0 | livre |
| LTX-2.3 / LTX-2.5 (Lightricks) | LTX-2.x Community License | grátis abaixo de US$ 10 mi/ano de receita (empresa + afiliadas) |
| HunyuanVideo 1.5 (Tencent) | Tencent Community | não vale na UE, Reino Unido e Coreia do Sul (cláusula 5c): evitar em site público |
| CogVideoX 2B / 5B | Apache 2.0 / licença própria | 5B: cadastro na Zhipu e ≤ 1 mi visitas/mês |
| Stable Video Diffusion | Stability Community | cadastro e receita < US$ 1 mi/ano |
| Mochi 1 | Apache 2.0 | livre |
| Serviços online no plano grátis (Kling, Hailuo, Pika, PixVerse, Vidu, Luma, Higgsfield, Flow) | termos de cada serviço | **não** ou não esclarecido: só rascunho |

## Fontes

**Scroll (pesquisa B):**
- GSAP Standard "No Charge" License: https://gsap.com/community/standard-license/ · README 3.15.0: https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md
- MDN `animation-timeline`: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline · browser-compat-data: https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json
- Chrome for Developers, scroll-driven animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- ICS Media (Safari 26; `animation-trigger` Chromium 146): https://ics.media/en/entry/230718/
- web.dev, View Transitions same-document Baseline: https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available
- Motion `useScroll`: https://motion.dev/docs/react-use-scroll
- Lenis README 1.3.26: https://cdn.jsdelivr.net/gh/darkroomengineering/lenis@1.3.26/README.md
- Vídeo scrub que trava, correção all-intra (jul/2026): https://www.hontran.dev/blog/scroll-scrubbed-video-stutters-fix
- Scrubbing de vídeo com JS: https://muffinman.io/blog/scrubbing-videos-using-javascript/
- CSS-Tricks, sequência do AirPods Pro (148 quadros): https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- Fórum GSAP, PNG 21 MB → WebP 4 MB, iPhone travando: https://gsap.com/community/forums/topic/25188-airpods-image-sequence-animation-using-scrolltrigger/
- bunny.net, custo de decodificação do AVIF: https://bunny.net/blog/lets-talk-avif-and-why-we-are-not-adding-support-just-yet/

**IA de vídeo (pesquisa A), oficiais:**
- Preços da API Gemini (Veo 3.1, Omni; "Free Tier: Not available", 09/10/2026): https://ai.google.dev/gemini-api/docs/pricing
- Créditos do Flow: https://support.google.com/flow/answer/16526234?hl=en
- Runway: https://runway.com/pricing · Luma: https://lumalabs.ai/pricing
- LTX-2.x: https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x · https://github.com/Lightricks/LTX-2 · https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Alpha-Gen
- HunyuanVideo 1.5: https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5/blob/master/LICENSE
- CogVideoX-5B: https://huggingface.co/THUDM/CogVideoX-5b/blob/main/LICENSE · SVD: https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt
- Wan 2.2: https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B · https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B
- Cota ZeroGPU: https://huggingface.co/docs/hub/spaces-zerogpu

**IA de vídeo, secundárias (números divergentes, usadas com ressalva):** whichoneisreal.com, krea.ai, diyai.io, fórum do Google (comercial no Flow), aireiter.com, eesel.ai, costbench.com, atlascloud.ai, creatify.ai, zsky.ai, wavespeed.ai, aiimagetovideo.pro, pasqualepillitteri.it, dreamina.capcut.com, insiderllm.com, wan2-7.io, gpuperhour.com, cloud.google.com/free. Links completos em `TRANSCRICAO.md` (pesquisa A, §9).
