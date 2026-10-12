# APRENDIZADOS: scroll-cinematico

Adendos datados. O mais novo fica embaixo.
O `SKILL.md` incorpora os aprendizados até 11/10/2026.

## 11/10/2026: entrada na base

**Para que serve:** fazer a animação "estilo Apple" em que a rolagem controla o filme: o produto gira, abre ou monta enquanto o visitante rola, com textos entrando no tempo certo. Cobre a escolha da técnica, os números, a produção dos quadros (Blender, Remotion ou IA de vídeo), as regras do editor, acessibilidade, desempenho e teste.

**Quando usar:** "site estilo Apple", "animação no scroll", "produto girando quando rola", "scrollytelling", "vídeo controlado pela rolagem", herói animado de site; e quando for preciso gerar um clipe por IA para um site (qual ferramenta, licença comercial, GPU).

**O que tem de mais útil:**
- `assets/scroll-sequencia.html`: página sem dependências, testada (canvas + sticky + inércia por tempo + carregamento grosso → fino + reduzir movimento + sem JS).
- `assets/SequenciaScroll.tsx`: o mesmo em Next.js + Motion 14.
- `scripts/testar-scroll.js`: confere quadro × progresso, texto sobre texto, reduzir movimento e sem JS; sai com código 1 se falhar.
- `scripts/preparar-quadros.sh`: render ou vídeo → WebP com alpha + *lite* + pôster + `manifest.json`.
- `references/ia-de-video.md`: o que é grátis **e** comercial em IA de vídeo (Wan 2.2, LTX-2.x), GPU necessária, prompts e pós-produção no ffmpeg.

**Testes feitos no container (4 CPUs, sem GPU, Chromium headless 1194, ffmpeg 6.1):**
- Agente B, página de teste (60 quadros WebP RGBA 1280×720, 400vh): quadro desenhado = esperado em p = 0,28 / 0,62 / 0,83 / 0,97 (18, 38, 50, 58); nenhum texto sobre texto; reduzir movimento → seção de 720 px com pôster; 60 rAF/s na rolagem contínua (renderização por software: não vale como medida de celular).
- Agente B, formatos (60 quadros): WebP q80 796 KB e 13,0 ms por quadro para carregar + decodificar; AVIF crf 32 294 KB e 32,6 ms; H.264 all-intra 432 KB × GOP 250 137 KB (3,2×); VP9 all-intra 629 KB.
- Agente A, ffmpeg: loop com crossfade, vídeo all-intra (todos os quadros keyframe), WebM VP9 e sequência WebP validados com vídeo sintético.
- Agente A, Hugging Face ZeroGPU sem login: LTX-2.3 recusado por cota (pede 150 s; o IP tinha 55 s); Wan 2.2 parou no limite anônimo. Nenhum vídeo, nenhum custo.
- Agente de transcrição (esta entrada):
  - `testar-scroll.js` generalizado rodou de novo no modelo HTML: mesmos quadros (18, 38, 50, 58), sem sobreposição, reduzir movimento ok (720 px, pôster), **sem JS ok** (pôster visível), código de saída 0. Com as faixas de B mexidas para se cruzar com A, o teste acusou "texto sobre texto".
  - `preparar-quadros.sh`: 60 PNG RGBA → 864 KB a 1280 px + *lite* (30 quadros, 1024 px) 376 KB; alpha preservado (canto com alpha 0); vídeo de 8 s a 24 fps → 192 quadros.
  - `SequenciaScroll.tsx`: `tsc --strict` ok (Motion 14.1.0, React 19.3); teste de fumaça no Chromium (bundle esbuild): canvas desenhado, pôster some, texto A dentro em 0,28 e fora em 0,62, B deslocado 333 px em 0,97, quadro 58 em 0,97; reduzir movimento sem canvas.

**Erros encontrados e corrigidos:**
- Filtro `rotate` do ffmpeg com `c=none` deixou sujeira dos quadros anteriores; use `c=black@0`.
- Com inércia, ler o estado logo depois do `scrollTo` dá o quadro antigo (10 em vez de 18): o teste agora espera `p ≈ alvo`.
- No componente proposto: o pôster ficaria **atrás** dos quadros com alpha (aparecendo duplicado) → agora some no 1º desenho; `padrao` nas dependências recarregaria tudo a cada render do pai → trocar de conjunto agora é pela `key`; misturar `x` animado com `translateY` no mesmo `motion.div` → centralização numa caixa externa em CSS.
- `getImageData` num canvas aberto por `file://` dá "tainted canvas": para inspecionar pixels no teste, sirva a pasta por HTTP.
- `ffprobe -of csv=s=' '` não aceita espaço: use `s=x`.

**Pendente:**
- Testar num iPhone e num Android reais (decodificação, memória, `svh/lvh`).
- Rodar o componente dentro de um app Next.js de verdade.
- Gerar um clipe de verdade por IA: o PC do Daniel tem GPU NVIDIA de ~4 GB (12/10/2026), abaixo do mínimo; usar Kaggle, Colab ou conta grátis no HF. Falta montar o notebook.
- A categoria `skills/sites/` ainda precisa da aprovação do Daniel.
