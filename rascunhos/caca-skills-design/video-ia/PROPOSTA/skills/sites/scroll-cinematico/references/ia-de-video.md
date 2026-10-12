# IA de vídeo para sites: o que dá para usar de graça (e entregar ao cliente)

Pesquisa de 11/10/2026 (preços e termos mudam todo mês: confira na tela do serviço no dia e anote no `APRENDIZADOS.md`). Isto não é parecer jurídico.

## Conclusão em 5 linhas

1. **Nenhum serviço online grátis libera uso comercial sem marca d'água.** Plano grátis serve para **rascunho e aprovação com o cliente**, não para entrega.
2. **O caminho grátis e comercial são os modelos abertos:** **Wan 2.2** (Apache 2.0) e **LTX-2.3/2.5** (grátis abaixo de US$ 10 mi/ano de receita). Rodam num PC com placa NVIDIA, ou com cota pequena no Hugging Face, Kaggle ou Colab.
3. **A chave do Google AI Studio não dá Veo de graça** ("Free Tier: Not available" para Veo 3.1 e Gemini Omni, página oficial de 09/10/2026). Pago: Veo 3.1 Lite US$ 0,05/s em 720p (~US$ 0,40 por 8 s).
4. **Google Flow (Veo 3.1):** 50 créditos/dia para quem não assina (oficial): ~5 clipes Lite ou 2 Fast por dia, com marca d'água e uso comercial não esclarecido. Melhor qualidade grátis, **só rascunho**.
5. **No container (4 CPUs, 15 GB RAM, sem GPU) não dá para gerar vídeo por IA.** Aqui fazemos quadros no Blender e a pós-produção no ffmpeg.

## Serviços online (plano grátis), nota para o nosso caso (entrega comercial grátis)

| Ferramenta | Grátis quanto | Duração / resolução | Marca d'água | Comercial no grátis | Qualidade premium | Nota |
|---|---|---|---|---|---|---|
| **Google Flow (Veo 3.1 Lite/Fast)** | 50 créditos/dia sem acumular; Lite 10, Fast 20, Quality 100; pode bloquear no pico | 4, 6 ou 8 s; 1080p só assinante | Sim ("Veo") + SynthID | **Não esclarecido** (trate como não) | Excelente; 1º quadro; último quadro no 3.1 (confira no Lite) | **7** (rascunho) |
| **Kling** | ~66 créditos/dia (ou mensal), ~2 vídeos 720p, modelos antigos | 5 s, 720p | Sim | **Não** | Muito boa; início/fim em alguns modelos | **5** |
| **Dreamina / CapCut (Seedance)** | Créditos diários (~120/dia citado) | Varia | Sim | Não verificado | Seedance 2.x topo de linha | **4** |
| **Runway** | 125 créditos **uma vez** (oficial) | ~5 s | Sim (Standard US$ 12–15/mês remove) | **Sim** segundo comparativo; confirme | Boa (Gen-4) | **4** |
| **Hailuo / MiniMax** | Pacote de teste que expira em 3 dias | ~6 s, 720p | Sim | **Não** | Boa; início/fim no Hailuo 02 | **3** |
| **Luma (Ray3.x)** | Sem plano grátis fixo; créditos de teste | Rascunho | Sim | **Não**; comercial a partir do Plus (US$ 25–30/mês) | Muito boa; **loop** e keyframes | **3** |
| **PixVerse** | ~90 no cadastro, ~60/dia (fonte única) | 360p–720p | Divergente | **Não** | Média-boa; "Transition" | **3** |
| **Vidu** | ~40/mês ou "Off-Peak" ilimitado (divergente) | 720p | Sim | **Não** | Boa; início/fim | **3** |
| **Pika** | 80/mês ou 0 (divergente) | 480p | Sim | **Não**; Creator US$ 35/mês | Média; Pikaframes | **2** |
| **Higgsfield** (conector deste ambiente) | 0–10 créditos/dia (divergente) | — | Provável | **Não** no grátis | Agrega Kling, Veo, Seedance, Wan; **o conector gasta créditos pagos** | **2** |
| **Grok Imagine** | Vídeo quase só pago (SuperGrok ~US$ 30/mês) | — | Sim nos planos baixos | Resultado do usuário, no pago | Média | **2** |
| **Meta AI / Vibes** | Grátis no lançamento, limites não publicados | Curto | Invisível + rótulo "IA" | Não esclarecido | Pouco controle | **2** |
| **Gemini app** | Não gera vídeo no grátis (promo acabou em 04/08/2026) | — | — | — | — | **0** |
| **Sora (OpenAI)** | App de consumo encerrado em 26/04/2026 | — | — | — | — | **0** |
| *API Gemini, Veo 3.1 Lite (pago)* | US$ 0,05/s 720p, US$ 0,08/s 1080p (8 s 1080p = US$ 0,64) | 4–8 s | SynthID | Comercial ok (termos Cloud/API) | Excelente | *8 se aprovar gasto* |
| *Google Cloud, teste US$ 300/90 dias* | Conta nova + cartão; Veo 3.1 não confirmado | — | — | Comercial ok | Excelente | *se o Daniel quiser* |

## O computador do Daniel (informado em 12/10/2026)

- **Placa de vídeo NVIDIA com cerca de 4 GB** (modelo exato não confirmado).
- **Isso fica abaixo do mínimo** que as pesquisas encontraram para os modelos recomendados: Wan 2.2 pede cerca de 8 a 12 GB e o LTX-2.x recomenda 12 GB ou mais. **Não tente rodar esses modelos localmente.**
- **Caminho para o Daniel (todos grátis):**
  1. **Kaggle** (cerca de 30 h por semana de GPU, com mais memória que a do PC) ou **Google Colab grátis**: rodar o Wan 2.2 ou o LTX num notebook. Conferir no dia do uso qual modelo e qual tamanho cabem na GPU grátis do momento.
  2. **Conta grátis no Hugging Face** (ZeroGPU): cerca de 1 clipe por dia, com os scripts `scripts/gerar_ltx.py` e `scripts/gerar_wan.py`.
  3. **Para rascunho e para mostrar a ideia ao cliente:** serviços online grátis (com marca d'água, sem uso comercial).
- **Nos três caminhos, o vídeo final de cliente só vale com modelo aberto de licença comercial** (Wan 2.2 em Apache 2.0, LTX abaixo do limite de faturamento). Não use a saída de serviço grátis em site de cliente.
- **Pendente:** montar um notebook pronto para Kaggle/Colab (Wan/LTX) e confirmar o tamanho de modelo que cabe na GPU grátis.

## Modelos abertos: licença e GPU

| Modelo | Licença | VRAM mínima / confortável | Saída | Recursos úteis | Nota |
|---|---|---|---|---|---|
| **Wan 2.2** (TI2V-5B, T2V/I2V-A14B; jul/2025) | **Apache 2.0**, comercial livre | 5B ~8 GB (GGUF + offload); 14B 6–8 GB em 480p (GGUF Q3/Q4), **12 GB** confortável (Q5/Q6); FP16 50 GB+ | 720p, ~5 s; 24 fps (5B), 16 fps (14B) | Texto/imagem para vídeo; **quadro inicial e final** (Wan2.1-FLF2V-14B, Apache 2.0, e workflows 2.2) → **loop perfeito**; ComfyUI. Wan 2.5–3.0 são fechados. | **8** |
| **LTX-2.5** (jul/2026, 22B) e **LTX-2.3** (mar/2026) | **LTX-2.x Community: grátis abaixo de US$ 10 mi/ano** (empresa + afiliadas); acima, paga. O 2.5 pede aceite no HF (automático). | 2.3: ~10 GB (Q4 GGUF, 960×544), ~16 GB (FP8 720p). 2.5: 22B + Gemma 12B → 24–32 GB, ou menos com `--quantization fp8-cast --offload cpu` (lento) | Até 4K, 24–50 fps, ~5–10 s, **com áudio** | **KeyframeInterpolation** (início/fim); **IC-LoRA Alpha-Gen** (matte alpha: vídeo transparente sobre o site); LoRA Slow-Motion-Control; Restore; SDR→HDR; versão destilada | **9** |
| **HunyuanVideo 1.5** (nov/2025, 8,3B) | Tencent Community: comercial ok, **não vale na UE, Reino Unido e Coreia do Sul**, nem para exibir o resultado lá (cláusula 5c) | ~14 GB c/ offload; 24 GB | 720p, 5–10 s | Rostos, várias pessoas | **5** (evite em site público) |
| **CogVideoX** 2B / 5B / 1.5-5B | 2B Apache 2.0; 5B só com cadastro na Zhipu e ≤ 1 mi visitas/mês | 8–12 GB | 720×480, 6 s, 8 fps (1.5: 1360×768) | Ultrapassado | **3** |
| **Mochi 1** | Apache 2.0 | ~20–24 GB | 480p, ~5 s, 30 fps | Ultrapassado | **3** |
| **Stable Video Diffusion** (XT) | Stability Community: cadastro e receita < US$ 1 mi/ano | < 10 GB | 1024×576, 14–25 quadros | Só imagem→vídeo, movimento fraco | **2** |
| Step-Video-T2V (30B) | MIT | 80 GB | — | Grande demais | **1** |

### Onde rodar grátis

| Onde | Quanto | Serve para | Observação |
|---|---|---|---|
| Container (sem GPU) | — | **Nada de geração** (LTX-2.5 ~44 GB de pesos + ~24 GB do codificador; Wan 5B em CPU: horas para 2 s, se coubesse) | Blender, ffmpeg, chamadas remotas |
| **Hugging Face Spaces (ZeroGPU)** | 2 min/dia sem login; **3,5 min/dia com conta grátis** (PRO 25 min) | ~1 clipe/dia: `Lightricks/LTX-2-3`, `multimodalart/wan-2-2-first-last-frame`, `zerogpu-aoti/wan2-2-fp8da-aoti-faster` | Cada chamada reserva a duração declarada; o LTX-2.3 pede **150 s** (sem login nunca cabe) |
| **Kaggle** | ~30 h/semana (T4 ×2 ou P100, 16 GB); sessão até 12 h; telefone verificado | Wan 2.2 5B/14B GGUF, LTX-2.3 GGUF via diffusers | Lento na T4, mas comercial e sem marca |
| **Google Colab grátis** | T4 16 GB; cota não publicada (~15–30 h/semana) | Igual ao Kaggle | Restringe interfaces web remotas (túnel ComfyUI): use notebook/diffusers |
| **PC do Daniel** | Ilimitado | Tudo, via **ComfyUI** (workflows de Wan 2.2 e LTX) | Ver GPU abaixo |

**GPU necessária (NVIDIA; Mac/AMD funcionam mal ou devagar):**

| VRAM | Placas | O que roda |
|---|---|---|
| 8 GB | RTX 3060 Ti / 4060 | Wan 2.2 5B GGUF; só para testar (numa 4090 são ~2–4 min por clipe de 5 s; aqui bem mais) |
| **12 GB** | RTX 3060 12 GB / 4070 | Wan 2.2 14B GGUF Q5/Q6 (480p–720p), LTX-2.3 Q4. **Mínimo recomendado** |
| 16 GB | RTX 4060 Ti 16 GB / 4070 Ti Super / 5070 Ti | LTX-2.3 FP8 720p, HunyuanVideo 1.5 com offload. **Bom custo-benefício** |
| 24–32 GB | RTX 3090 / 4090 / 5090 | LTX-2.5 22B FP8, 1080p+. **Ideal para produção** |

RAM do PC: 32 GB ou mais (offload). Disco: 60–120 GB para os pesos.

## Qualidade para "premium"

| Necessidade | Melhor opção grátis/aberta | Observação |
|---|---|---|
| Produto consistente (rótulo e forma sem derreter) | **Imagem para vídeo** a partir de render do Blender ou foto real, ≤ 5 s, câmera lenta (LTX-2.5, Wan 2.2 I2V; Veo no rascunho) | IA **inventa detalhes** em giro de 360°. Giro completo com logo legível: **Blender** (`blender-ia`); IA para fundo e ambiência |
| Loop perfeito | Quadro inicial = final (Wan FLF2V, LTX Keyframe, Luma Loop, Veo 3.1 início+fim) ou crossfade no ffmpeg | Fundos abstratos (seda, fumaça, líquido) fecham loop fácil |
| Câmera lenta suave | LTX-2.5 + LoRA Slow-Motion-Control; interpolação de fps (DFR do LTX: 2×/4×) | Prompt: "very slow motion, locked camera" |
| Fundo limpo / transparente | Quadro inicial com fundo liso + negative prompt; **LTX-2.5 Alpha-Gen** dá alpha | Vídeo transparente sobre o layout |
| Controle de 1º e último quadro (essencial para scroll) | LTX-2.5 KeyframeInterpolation; Wan FLF2V; Veo 3.1 (Flow) | Quadros A e B do Blender; a IA faz a transição |

## Top 3

1. **LTX-2.5 (ou 2.3) no PC do Daniel** (nota 9): comercial grátis abaixo de US$ 10 mi/ano, sem marca d'água, até 4K, início/fim, **alpha**, câmera lenta, versão destilada. GPU de 16 GB (2.3) ou 24–32 GB (2.5). Sem GPU: Space `Lightricks/LTX-2-3` com conta grátis no HF (~1 clipe/dia).
2. **Wan 2.2 local, Kaggle ou Colab** (nota 8): **Apache 2.0** (licença mais limpa: sem teto nem território), roda em 8–12 GB, início/fim para loop e transição; roda grátis na T4.
3. **Google Flow (Veo 3.1 Lite/Fast)** (nota 7, **só rascunho e aprovação**): melhor qualidade grátis. Para entregar, refaça no LTX/Wan com o mesmo quadro inicial, ou, com aprovação de gasto, use o Veo 3.1 Lite pela API (US$ 0,40–0,64 por clipe, sem marca visível do Flow) com a chave existente **depois de ligar o faturamento**.

Fora do top 3: Kling e Dreamina são bons rascunhos (créditos diários); Runway é o único que parece permitir comercial no grátis, mas só 125 créditos uma vez e com marca.

## Fluxo

```
[Blender, container]          [IA de vídeo]                       [ffmpeg, container]           [site]
quadro A (e B) do produto ─► imagem→vídeo / quadro A→B        ─► loop, all-intra, WebM,      ─► vídeo com currentTime ou
fundo liso, 1920×1080        LTX-2.5 / Wan 2.2 (PC, Kaggle, HF)   sequência WebP                  quadros num <canvas>
                             rascunho: Flow (Veo)
```

1. **Quadros:** renderize no Blender (`blender-ia`, `produto.py`) o quadro A (e B, se for transição) na proporção final (16:9 ou 9:16), fundo liso. Produto fiel, menos alucinação.
2. **Gerar:** imagem para vídeo (só A) ou interpolação (A→B). Loop: A = B.
3. **Pós-produção:** comandos abaixo; depois `scripts/preparar-quadros.sh` ou a rota de vídeo all-intra (`receitas.md`).
4. **Registrar** modelo, versão, seed, prompt e licença no `APRENDIZADOS.md` do projeto (prova de origem para o cliente).

## Prompts de exemplo (em inglês: os modelos seguem melhor)

**A) Produto premium (imagem para vídeo; quadro inicial = render ou foto do produto)**
```
Slow 90-degree orbit around a matte black perfume bottle with a brushed gold cap,
standing on a seamless dark graphite surface. A single soft key light from the upper left
glides slowly across the glass, crisp specular highlights, subtle cool rim light,
shallow depth of field, ultra smooth slow motion, steady gimbal camera, no shake.
The bottle keeps its exact shape, proportions and label. Clean minimal studio,
luxury commercial look, no text, no people, no extra objects.
```
Negative prompt (Wan/LTX):
```
text, watermark, subtitles, logo distortion, warping, morphing, melting, extra objects,
duplicate product, flicker, jitter, camera shake, overexposed, low quality, blurry, deformed
```
5 s, 24 fps, seed fixa. Wan "lightning": CFG baixo. LTX-2.5: DFR na versão final.

**B) Fundo abstrato em loop (A = B)**
```
Seamless looping abstract background: slow flowing liquid silk in deep navy blue and
champagne gold, soft volumetric light, gentle undulating folds, very slow motion,
locked static camera, minimal and elegant high-end brand aesthetic, subtle film grain,
no text, no objects. The last frame matches the first frame.
```
Mesma imagem como quadro inicial e final (Wan FLF2V / LTX Keyframe / Veo 3.1). Sem suporte: crossfade no ffmpeg.

**C) Transição para scroll (quadro A → quadro B)**
```
One continuous shot: the camera slowly pushes in and arcs to the right, the product rotates
45 degrees to reveal its side profile, constant speed, no cuts, same lighting throughout,
ending exactly on the provided last frame.
```

## Scripts (Hugging Face ZeroGPU, sem GPU local)

```bash
pip install gradio_client                       # testado com 2.7.2
# token opcional: HF_TOKEN no ambiente ou o arquivo /root/.config/rotina/hf_token (nunca no repositório)
python scripts/gerar_ltx.py quadro.png saida.mp4 "Slow 90-degree orbit around ..."   # LTX-2.3, 3 s, 768×512, seed 42
python scripts/gerar_wan.py quadro.png saida.mp4 "slow cinematic orbit ..."          # Wan 2.2 I2V A14B, 4 passos, 2 s
```

Teste de 11/10/2026, sem login: o LTX foi **recusado por cota** (o Space pede 150 s; o IP compartilhado do container tinha 55 s) e o Wan parou no limite de execuções anônimas. **Nenhum vídeo gerado, nenhum custo.** Com uma conta grátis no HF (3,5 min/dia), cabe ~1 clipe LTX por dia. A API do Gemini **não** foi testada (poderia cobrar).

## Pós-produção no ffmpeg (testada no container em 11/10/2026)

```bash
# Loop sem emenda num clipe de 8 s: o último 1 s faz crossfade com o primeiro 1 s (resultado: 7 s)
ffmpeg -i in.mp4 -filter_complex "[0:v]split[a][b];[a]trim=1:8,setpts=PTS-STARTPTS[corpo];\
[b]trim=0:1,setpts=PTS-STARTPTS[inicio];[corpo][inicio]xfade=transition=fade:duration=1:offset=6,format=yuv420p[v]" \
-map "[v]" -an -c:v libx264 -crf 18 loop.mp4
# Geral (clipe de D s, crossfade de X s): trim=X:D, trim=0:X, offset = D-2X

# Vídeo para scroll com currentTime: TODO quadro é keyframe (-g 1)
ffmpeg -i loop.mp4 -an -vf "scale=1920:-2:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 20 \
-g 1 -pix_fmt yuv420p -movflags +faststart scrub.mp4

# Fundo em loop leve (VP9) + o MP4 como fallback
ffmpeg -i loop.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good loop.webm

# Sequência de quadros para o <canvas> (ou use scripts/preparar-quadros.sh)
ffmpeg -i loop.mp4 -vf "scale=1280:-2,fps=24" -c:v libwebp -quality 80 quadros/q%04d.webp
```

Com o alpha do LTX-2.5 (Alpha-Gen), exporte PNG com alpha e use `skills/video/blender-ia/scripts/png_para_video.sh` (WebM VP9 com alpha) ou `scripts/preparar-quadros.sh` (WebP com alpha).

## Alertas de licença (antes de entregar)

- **Plano grátis de serviço online ≠ uso comercial.** Kling, Hailuo, Pika, PixVerse, Vidu, Higgsfield e Luma vetam ou não esclarecem. Não entregue vídeo desses planos.
- **Não remova marca d'água** (corte, desfoque, "remover marca"): viola os termos e não tira o SynthID.
- **Flow grátis:** comercial não confirmado. Entrega com Veo = API paga ou plano pago, conferindo os termos no dia.
- **LTX-2.x:** grátis abaixo de US$ 10 mi/ano (empresa + afiliadas). Se um cliente grande rodar o modelo **ele mesmo**, precisa de licença paga. Quando o Daniel roda e entrega só o vídeo, quem usa é o Daniel. Anote mesmo assim.
- **HunyuanVideo 1.5:** não vale na UE, Reino Unido e Coreia do Sul, nem para exibir lá. Site público = **evite**.
- **SVD:** cadastro e receita < US$ 1 mi. **CogVideoX-5B:** cadastro na Zhipu. **Wan 2.2, Mochi, CogVideoX-2B:** Apache 2.0, os mais tranquilos.
- **Entrada:** a licença do modelo não cobre marca, logo ou produto de terceiros. Só o produto do cliente, com autorização. Nada de visual de iPhone/Apple (regra da `blender-ia`).
- **Higgsfield (conector):** cada geração gasta créditos pagos; **só com aprovação do Daniel**, e o direito comercial segue o plano dele.
