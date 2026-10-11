# Pesquisa A: IA de vídeo grátis para sites premium

Data: 11/10/2026. Autor: agente de pesquisa "IA de vídeo grátis".
Objetivo: clipes curtos (produto girando, cenas abstratas, transições, fundos em loop) para animação de scroll em site de cliente, **gastando zero**.

## Resumo

1. **Nenhum serviço online grátis libera uso comercial sem marca d'água.** Kling, Hailuo, Pika, PixVerse, Vidu, Higgsfield e Luma (sem plano grátis fixo) vetam o uso comercial no plano grátis ou não deixam claro. Runway permite, mas só tem 125 créditos uma vez e põe marca d'água. Serviço grátis serve para **rascunho e aprovação com o cliente**, não para entrega.
2. **O caminho grátis e comercial são os modelos abertos:** **Wan 2.2** (Apache 2.0) e **LTX-2.3/2.5** (grátis para quem fatura menos de US$ 10 mi/ano). Rodam no computador do Daniel com placa NVIDIA, ou com cota grátis pequena no Hugging Face, no Colab ou no Kaggle.
3. **A chave do Google AI Studio não dá Veo de graça.** A página oficial de preços (atualizada em 09/10/2026) mostra "Free Tier: Not available" para Veo 3.1 Standard, Fast e Lite e para o Gemini Omni. Com faturamento ligado, o Veo 3.1 Lite custa US$ 0,05/s em 720p (cerca de US$ 0,40 por clipe de 8 s). Não testei, para não gerar cobrança.
4. **Google Flow (Veo 3.1) dá 50 créditos por dia a quem não assina** (oficial). Isso rende uns 5 clipes Lite ou 2 Fast por dia, com a melhor qualidade grátis, mas com marca d'água e uso comercial não esclarecido. Use para rascunhos.
5. **Neste container (4 CPUs, 15 GB de RAM, sem GPU) não dá para gerar vídeo por IA.** Os modelos nem cabem na memória. Aqui fazemos o resto: quadros de início e fim no Blender (skill `blender-ia`) e pós-produção no ffmpeg (loop, codificação para scroll e WebM). Os comandos estão testados na seção 6.

---

## 1. Serviços online: tabela comparativa (plano grátis)

As notas valem para **o nosso caso**: entrega comercial em site de cliente, de graça. Uma nota baixa não significa modelo ruim.

| Ferramenta | Grátis quanto | Duração / resolução no grátis | Marca d'água | Uso comercial no grátis | Qualidade para premium | Nota |
|---|---|---|---|---|---|---|
| **Google Flow (Veo 3.1 Lite/Fast)** | 50 créditos/dia, sem acumular (oficial). Lite custa 10 e Fast 20; Quality custa 100 e não cabe num dia. Pode bloquear vídeo no horário de pico. | 4, 6 ou 8 s. Upscale para 1080p só para assinantes. | Sim, selo visível "Veo" fora do Ultra, mais SynthID invisível | **Não esclarecido.** Há pergunta aberta no fórum do Google sem resposta oficial. Trate como "não". | Excelente: física, luz, câmera lenta, áudio. Tem primeiro quadro; último quadro no Veo 3.1 (confira se o Lite grátis aceita). | **7** (rascunho) |
| **Kling** | ~66 créditos/dia (há quem diga mensal), ~2 vídeos em 720p, só modelos antigos | 5 s, 720p | Sim | **Não** | Muito boa (produto e movimento); quadro inicial e final em alguns modelos | **5** |
| **Dreamina / CapCut (Seedance)** | Créditos diários (artigo da Dreamina cita 120/dia), sem número fixo de vídeos | Varia por modelo | Sim no grátis | **Não verificado** | Seedance 2.x é topo de linha | **4** |
| **Runway** | 125 créditos **uma vez**, sem renovar (oficial) | ~5 s | Sim (o Standard de US$ 12–15/mês remove) | **Sim**, segundo um comparativo; Runway diz que o resultado é do usuário. Confirme nos termos. | Boa (Gen-4); keyframes dependem do modelo | **4** |
| **Hailuo / MiniMax** | Desde 2025 é teste: pacote único que expira em 3 dias. A cota diária é política antiga. | ~6 s, 720p | Sim | **Não** | Boa; Hailuo 02 tem quadro inicial e final | **3** |
| **Luma Dream Machine (Ray3.x)** | A página de preços não tem plano grátis; contas novas podem ganhar créditos de teste | Teste em resolução de rascunho | Sim | **Não** no grátis antigo. Comercial a partir do Plus (US$ 25–30/mês). | Muito boa; tem **loop** e keyframes | **3** |
| **PixVerse** | ~90 créditos no cadastro, depois ~60/dia (fonte única, revendedora) | Baixa (360p–720p) | Fontes divergem | **Não** | Média-boa; tem "Transition" (quadro inicial e final) | **3** |
| **Vidu** | ~40 créditos/mês, ou ilimitado no "Off-Peak" (fontes divergem) | 720p | Sim (canto inferior direito) | **Não** | Boa; quadro inicial e final | **3** |
| **Pika** | 80 créditos/mês (Krea) ou 0 (outra fonte) | 480p | Sim | **Não**; comercial a partir do Creator (US$ 35/mês) | Média; Pikaframes | **2** |
| **Higgsfield** (conector deste ambiente) | 0 a 10 créditos/dia (fontes divergem) | — | Provável | **Não** no grátis | Agrega Kling, Veo, Seedance e Wan; **o conector gasta créditos pagos** | **2** |
| **Grok Imagine (xAI)** | Vídeo é praticamente só pago (SuperGrok ~US$ 30/mês) | — | Sim nos planos baixos | xAI diz que o resultado é do usuário, mas no plano pago | Média | **2** |
| **Meta AI / Vibes** | Grátis durante o lançamento, com limites não publicados | Curto | Marca invisível e rótulo "IA" | **Não esclarecido** | Pouco controle (sem quadro inicial e final confiável) | **2** |
| **Gemini app** | Grátis não gera vídeo (agora é o Gemini Omni, pago). A promo de 10 vídeos acabou em 04/08/2026. | — | — | — | — | **0** |
| **Sora (OpenAI)** | App de consumo encerrado em 26/04/2026 | — | — | — | — | **0** |
| *API Gemini, Veo 3.1 Lite (pago, quase grátis)* | Sem grátis. US$ 0,05/s em 720p e US$ 0,08/s em 1080p; 8 s em 1080p = US$ 0,64. | 4–8 s, até 1080p | SynthID invisível; marca visível não documentada | Termos do Google Cloud/API: comercial ok | Excelente | *8 se aprovar gasto* |
| *Google Cloud, teste de US$ 300 / 90 dias (Vertex AI)* | Exige conta nova e cartão. Blogs dizem que serve para Veo, sem confirmação oficial para o 3.1. | — | — | Comercial ok (Cloud) | Excelente | *só se o Daniel quiser cadastrar* |

---

## 2. Modelos abertos: licença, GPU e onde rodar

| Modelo | Licença (uso comercial?) | VRAM mínima / confortável | Saída típica | Recursos úteis para premium | Nota |
|---|---|---|---|---|---|
| **Wan 2.2** (TI2V-5B, T2V/I2V-A14B; Alibaba, jul/2025) | **Apache 2.0, comercial livre** (conferido no HF) | 5B: ~8 GB (GGUF + offload). 14B: 6–8 GB em 480p com GGUF Q3/Q4; **12 GB** confortável com Q5/Q6; FP16 pede 50 GB+. | 720p, ~5 s; 24 fps (5B), 16 fps (14B) | Texto e imagem para vídeo. **Quadro inicial e final** (Wan2.1-FLF2V-14B Apache 2.0 e workflows 2.2), o que dá **loop perfeito**. Ecossistema enorme no ComfyUI. Os Wan 2.5–3.0 são fechados (só API). | **8** |
| **LTX-2.5** (Lightricks, jul/2026, 22B) e **LTX-2.3** (mar/2026) | **Grátis para quem fatura < US$ 10 mi/ano** (LTX-2.x Community License, conferida). Acima disso, licença paga. O 2.5 pede aceite no HF (aprovação automática). | 2.3: ~10 GB (Q4 GGUF, 960×544) e ~16 GB (FP8 em 720p). 2.5: transformer 22B + codificador Gemma 12B, então 24–32 GB, ou menos com `--quantization fp8-cast --offload cpu` (mais lento). | Até 4K, 24–50 fps, ~5–10 s, **com áudio** | **KeyframeInterpolation** (quadro inicial e final), **IC-LoRA Alpha-Gen** (gera **matte alpha**: vídeo com fundo transparente para o site), **LoRA Slow-Motion-Control**, Restore, SDR→HDR, versão destilada rápida | **9** |
| **HunyuanVideo 1.5** (Tencent, nov/2025, 8,3B) | Tencent Community: comercial ok, **mas não vale na UE, no Reino Unido e na Coreia do Sul**, inclusive para **exibir o resultado** lá (cláusula 5c). Site público acessível na Europa = risco. | ~14 GB com offload; 24 GB padrão | 720p, 5–10 s | Bons rostos e cenas com várias pessoas | **5** |
| **CogVideoX** (2B / 5B / 1.5-5B) | 2B: Apache 2.0. 5B: comercial só com **cadastro** na Zhipu e até 1 mi de visitas/mês. | 8–12 GB | 720×480, 6 s, 8 fps (o 1.5 vai a 1360×768) | Imagem para vídeo razoável; ultrapassado | **3** |
| **Mochi 1** (Genmo) | Apache 2.0 | ~20 GB (ComfyUI) / 24 GB | 480p, ~5 s, 30 fps | Segue bem o prompt; ultrapassado | **3** |
| **Stable Video Diffusion** (SVD-XT) | Stability Community: comercial com **cadastro** e só se faturar **< US$ 1 mi/ano** | < 10 GB | 1024×576, 14–25 quadros (~2–4 s) | Só imagem para vídeo, movimento fraco; ultrapassado | **2** |
| Step-Video-T2V (StepFun, 30B) | MIT | 80 GB (servidor) | — | Grande demais para uso local | **1** |

### Onde rodar grátis

| Onde | Quanto grátis | Serve para | Observação |
|---|---|---|---|
| **Aqui (container, 4 CPUs, 15 GB de RAM, sem GPU)** | — | **Nada de geração.** O LTX-2.5 tem ~44 GB de pesos mais ~24 GB do codificador. O Wan 5B em CPU levaria horas para 2 s, se coubesse na RAM. | Aqui: quadros do Blender, ffmpeg e chamadas remotas (Spaces/API) |
| **Hugging Face Spaces (ZeroGPU)** | Oficial: **2 min/dia sem login** e **3,5 min/dia com conta grátis** (PRO: 25 min) | 1 clipe por dia nos Spaces oficiais (`Lightricks/LTX-2-3`, `multimodalart/wan-2-2-first-last-frame`, `zerogpu-aoti/wan2-2-fp8da-aoti-faster`) | Cada chamada reserva a duração declarada; o LTX-2.3 pede **150 s**. Sem login nunca cabe (120 s). **Testei: veja a seção 8.** |
| **Kaggle** | ~30 h/semana de GPU (T4 ×2 ou P100, 16 GB); sessão de até 12 h; exige telefone verificado | Wan 2.2 5B / 14B GGUF e LTX-2.3 GGUF por script Python (diffusers) | Lento numa T4 (minutos por clipe), mas comercial e sem marca d'água |
| **Google Colab grátis** | T4 16 GB; cota não publicada (~15–30 h/semana); sessão de até 12 h | Igual ao Kaggle | O plano grátis restringe interfaces web remotas (túnel de ComfyUI). Use notebook/diffusers. |
| **Computador do Daniel** | Ilimitado | Tudo acima, via **ComfyUI** (workflows prontos de Wan 2.2 e LTX) | Ver GPU abaixo |

**Qual GPU o Daniel precisa (NVIDIA; Mac/AMD funcionam mal ou devagar):**
- **8 GB** (RTX 3060 Ti/4060): Wan 2.2 5B GGUF, ~2–4 min por clipe de 5 s numa 4090 e bem mais nessa faixa. É o mínimo, e só para testar.
- **12 GB** (RTX 3060 12 GB/4070): Wan 2.2 14B GGUF Q5/Q6 (480p–720p) e LTX-2.3 Q4. **Mínimo recomendado.**
- **16 GB** (RTX 4060 Ti 16 GB/4070 Ti Super/5070 Ti): LTX-2.3 FP8 em 720p, HunyuanVideo 1.5 com offload. **Bom custo-benefício.**
- **24–32 GB** (RTX 3090/4090/5090): LTX-2.5 22B FP8, 1080p e acima, sem sofrimento. **Ideal para produção.**
- RAM do PC: 32 GB ou mais (offload). Disco: 60–120 GB para os pesos.

---

## 3. Qualidade para o caso "premium"

| Necessidade | Melhor opção grátis/aberta | Observação |
|---|---|---|
| **Produto consistente** (rótulo e forma sem derreter) | **Imagem para vídeo** a partir de render do Blender ou foto real, com movimento curto (≤ 5 s) e câmera lenta. LTX-2.5 e Wan 2.2 I2V; Veo 3.1 no rascunho. | IA **inventa detalhes** em giro de 360°. Para giro completo com logo legível, use o **Blender** (skill `blender-ia`) e deixe a IA para fundo e ambiência. |
| **Loop perfeito** | **Quadro inicial = quadro final** (Wan FLF2V, LTX Keyframe, Luma "Loop", Veo 3.1 com primeiro e último quadro) **ou** crossfade no ffmpeg (seção 6) | Fundos abstratos (seda, fumaça, líquido, gradiente) fecham loop fácil |
| **Câmera lenta suave** | LTX-2.5 com LoRA Slow-Motion-Control; interpolação de fps (DFR do LTX faz 2×/4× fps) | Peça no prompt "very slow motion, locked camera" |
| **Fundo limpo** | Quadro inicial com fundo liso (render), negative prompt contra objetos extras | LTX-2.5 **Alpha-Gen** gera o alpha, o que dá vídeo transparente sobre o layout do site |
| **Controle do primeiro e do último quadro** (essencial para scroll) | LTX-2.5 KeyframeInterpolation; Wan FLF2V; Veo 3.1 (Flow) | Renderize os quadros A e B no Blender; a IA faz a transição |
| **Imagem para vídeo** | Todos os listados. Os melhores abertos são LTX-2.5 e Wan 2.2. | — |

---

## 4. Top 3 recomendações

1. **LTX-2.5 (ou LTX-2.3) local, no PC do Daniel**: nota 9.
   *Motivo:* licença grátis para comercial (cliente e Daniel faturando < US$ 10 mi/ano), **sem marca d'água**, até 4K, **quadro inicial e final**, **alpha** (vídeo transparente), câmera lenta controlada e versão destilada rápida. É o mais "site premium" dos abertos.
   *Requisito:* GPU de 16 GB (2.3) ou 24–32 GB (2.5). Sem GPU: Space oficial `Lightricks/LTX-2-3` com conta grátis no HF (cerca de 1 clipe por dia).
2. **Wan 2.2 local, no Kaggle ou no Colab**: nota 8.
   *Motivo:* **Apache 2.0** (a licença mais limpa: sem teto de faturamento nem território), roda **até em 8–12 GB** e tem quadro inicial e final para **loop** e transição. Também roda de graça no **Kaggle/Colab** (T4), então serve mesmo se o PC do Daniel for fraco.
3. **Google Flow (Veo 3.1 Lite/Fast), 50 créditos/dia**: nota 7, **só para rascunho e aprovação**.
   *Motivo:* a melhor qualidade de imagem grátis (luz, física, câmera), ótima para mostrar o conceito ao cliente. Para **entregar**, refaça no LTX/Wan com o mesmo quadro inicial, ou, com aprovação de gasto, gere no **Veo 3.1 Lite pela API** (US$ 0,40–0,64 por clipe, sem a marca visível do Flow), usando a chave que já existe **depois de ligar o faturamento**.

*Fora do top 3:* Kling e Dreamina são bons para rascunho (créditos diários). Runway é o único serviço que parece permitir uso comercial no grátis, mas são só 125 créditos uma vez e com marca d'água.

---

## 5. Como usar no nosso fluxo

```
[Blender no container]           [IA de vídeo]                         [ffmpeg no container]        [site]
quadro A (e B) do produto  ──►   imagem para vídeo / quadro A→B  ──►   loop, codificação para    ──►  scroll que avança o
fundo liso, 1920×1080            LTX-2.5 / Wan 2.2 (PC, Kaggle, HF)    scroll, WebM, sequência       currentTime ou desenha
                                 rascunho: Flow (Veo)                  de quadros WebP               quadros num <canvas>
```

1. **Quadros:** renderize no Blender (skill `blender-ia`, `produto.py`) o **quadro A**, e o **quadro B** se for transição, na proporção final (16:9 ou 9:16), com fundo liso. Isso dá produto fiel e reduz alucinação.
2. **Gerar:** imagem para vídeo (só A) ou interpolação (A→B). Para loop, use A = B.
3. **Pós-produção:** comandos da seção 6.
4. **Registrar:** modelo, versão, seed, prompt e licença no `APRENDIZADOS.md` do projeto, para comprovar a origem ao cliente.

### Prompts de exemplo (em inglês, porque os modelos seguem melhor)

**A) Produto premium (imagem para vídeo, quadro inicial = render ou foto do produto):**
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
Ajustes: 5 s, 24 fps, seed fixa para repetir. Para Wan, CFG baixo nas versões "lightning". Para LTX-2.5, use DFR na versão final.

**B) Fundo abstrato em loop (texto para vídeo, ou imagem para vídeo com A = B):**
```
Seamless looping abstract background: slow flowing liquid silk in deep navy blue and
champagne gold, soft volumetric light, gentle undulating folds, very slow motion,
locked static camera, minimal and elegant high-end brand aesthetic, subtle film grain,
no text, no objects. The last frame matches the first frame.
```
Use a mesma imagem como quadro inicial **e** final (Wan FLF2V / LTX Keyframe / Veo 3.1 first+last). Se o modelo não aceitar, feche o loop no ffmpeg com crossfade.

**C) Transição para scroll (quadro A → quadro B):**
```
One continuous shot: the camera slowly pushes in and arcs to the right, the product rotates
45 degrees to reveal its side profile, constant speed, no cuts, same lighting throughout,
ending exactly on the provided last frame.
```

---

## 6. Pós-produção no container (ffmpeg, testada aqui em 11/10/2026)

```bash
# Loop sem emenda num clipe de 8 s: o último 1 s faz crossfade com o primeiro 1 s (o resultado tem 7 s)
ffmpeg -i in.mp4 -filter_complex "[0:v]split[a][b];[a]trim=1:8,setpts=PTS-STARTPTS[corpo];\
[b]trim=0:1,setpts=PTS-STARTPTS[inicio];[corpo][inicio]xfade=transition=fade:duration=1:offset=6,format=yuv420p[v]" \
-map "[v]" -an -c:v libx264 -crf 18 loop.mp4
# Generalizando para um clipe de D segundos e crossfade de X: trim=X:D, trim=0:X, offset = D-2X

# Vídeo para scroll que avança o currentTime: TODO quadro é keyframe (-g 1), senão a busca engasga
ffmpeg -i loop.mp4 -an -vf "scale=1920:-2:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 20 \
-g 1 -pix_fmt yuv420p -movflags +faststart scrub.mp4

# Fundo em loop leve para a web (VP9) + MP4 de fallback
ffmpeg -i loop.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good loop.webm

# Sequência de quadros para <canvas> (estilo Apple): mais pesado, mas a busca é perfeita
ffmpeg -i loop.mp4 -vf "scale=1280:-2,fps=24" -c:v libwebp -quality 80 quadros/q%04d.webp
```
Com o alpha do LTX-2.5 (Alpha-Gen), exporte PNG com alpha e use `skills/video/blender-ia/scripts/png_para_video.sh`, que gera WebM VP9 com alpha.

---

## 7. Alertas de licença (leia antes de entregar ao cliente)

- **Plano grátis de serviço online ≠ uso comercial.** Kling, Hailuo, Pika, PixVerse, Vidu, Higgsfield e Luma vetam o uso comercial no grátis ou não deixam claro. **Não entregue** ao cliente vídeo do plano grátis desses serviços.
- **Não remova marca d'água** de vídeo grátis (corte, desfoque, "remover marca"). Isso viola os termos e não tira o SynthID invisível do Google.
- **Google Flow grátis:** uso comercial **não confirmado** pelo Google. Use só como rascunho. Para entrega com Veo, use a **API paga** ou um plano pago, e confira os termos no dia.
- **LTX-2.x:** grátis abaixo de **US$ 10 mi/ano** de receita, somando empresa e afiliadas. Se o cliente for grande e **ele mesmo** rodar o modelo, precisa de licença paga. Quando o Daniel roda e entrega só o vídeo, quem usa o modelo é o Daniel, que está abaixo do teto. Mesmo assim, anote a licença.
- **HunyuanVideo 1.5:** a licença **não vale na UE, no Reino Unido e na Coreia do Sul** e proíbe exibir o resultado fora do território. Site público aberto a visitantes europeus = **evite** em site de cliente.
- **SVD:** comercial só com cadastro e receita < US$ 1 mi. **CogVideoX-5B:** comercial só com cadastro na Zhipu. **Wan 2.2, Mochi e CogVideoX-2B:** Apache 2.0, os mais tranquilos.
- **Conteúdo de entrada:** a licença do modelo não cobre **marca, logo ou produto de terceiros** no prompt ou na imagem. Use só o produto do cliente, com autorização. Nada de visual de iPhone/Apple (regra da skill `blender-ia`).
- **Higgsfield (conector deste ambiente):** cada geração gasta créditos pagos da conta. **Use só com aprovação do Daniel**, e o direito comercial segue o plano Higgsfield dele.
- **Termos mudam todo mês.** Vários números acima vêm de blogs que se contradizem (Kling diário ou mensal, Pika 80 ou 0, Vidu). Confira na tela do serviço no dia e registre no `APRENDIZADOS.md`. Isto não é parecer jurídico.

---

## 8. Teste feito daqui

- **API Gemini com a chave existente:** **não testei.** Veo e Gemini Omni não têm plano grátis (página oficial), e uma chamada poderia **cobrar** se o projeto tiver faturamento ligado. A chave não foi lida nem impressa.
- **Hugging Face ZeroGPU sem login (grátis e sem cadastro):** tentei **uma** geração (imagem para vídeo, 3 s, 768×512) no Space oficial **`Lightricks/LTX-2-3`**, com quadro inicial de esfera champanhe feito em numpy. Resultado: **recusada por cota.** O Space pede 150 s de GPU e o IP do container (compartilhado) tinha 55 s. Uma segunda tentativa no `zerogpu-aoti/wan2-2-fp8da-aoti-faster` (Wan 2.2, 4 passos, 2 s) parou no limite de execuções anônimas. **Nenhum vídeo foi gerado e nenhum custo houve.**
- **Conclusão do teste:** a rota grátis sem GPU exige **conta grátis no HF**, criada pelo Daniel (3,5 min/dia, cerca de 1 clipe LTX por dia). Depois, ele põe o token em `/root/.config/rotina/` e rodamos `scripts/gerar_ltx.py` daqui. A API do Space funciona e a chamada está pronta.
- Arquivos: `teste/quadro-inicial.png` (quadro de entrada), `scripts/gerar_ltx.py`, `scripts/gerar_wan.py` e `scripts/esfera.py`, todos nesta pasta. Os comandos ffmpeg da seção 6 foram validados com vídeo sintético em `ffteste/`. No `scrub.mp4`, todos os quadros saíram como keyframe.

---

## 9. Fontes (consultadas em 11/10/2026)

**Oficiais:**
- Preços da API Gemini (Veo 3.1, Omni, "Free Tier: Not available", atualizado em 09/10/2026): https://ai.google.dev/gemini-api/docs/pricing
- Créditos do Flow (50/dia, custo por modelo): https://support.google.com/flow/answer/16526234?hl=en
- Preços do Runway (125 créditos únicos; Standard sem marca d'água): https://runway.com/pricing
- Preços da Luma (sem plano grátis; Plus com uso comercial): https://lumalabs.ai/pricing
- Licença LTX-2.x (< US$ 10 mi): https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x · README do LTX-2 (pipelines, Keyframe, FP8/offload): https://github.com/Lightricks/LTX-2 · Alpha-Gen: https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Alpha-Gen
- Licença HunyuanVideo 1.5: https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5/blob/master/LICENSE
- Licença CogVideoX-5B: https://huggingface.co/THUDM/CogVideoX-5b/blob/main/LICENSE · SVD: https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt
- Wan 2.2 (Apache 2.0): https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B · https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B
- Cota ZeroGPU: https://huggingface.co/docs/hub/spaces-zerogpu

**Secundárias (números divergentes; usadas com ressalva):**
- Comparativo de vídeo grátis (set/2026): https://whichoneisreal.com/compare/best-free-ai-video/
- Krea, "Best free AI video generators in 2026" (ago/2026): https://www.krea.ai/blog/best-free-ai-video-generators-in-2026
- Veo e Flow (set/2026): https://diyai.io/ai-tools/video-generation/google-veo-pricing/
- Fórum Google, uso comercial no Flow grátis: https://discuss.ai.google.dev/t/inquiry-about-commercial-use-of-videos-generated-via-google-labs-flow-free-tier-for-a-contest/169174
- Kling grátis: https://aireiter.com/blog/kling-ai-free-tier-2026 · https://eesel.ai/blog/kling-ai-pricing
- Hailuo: https://costbench.com/software/ai-video-generators/hailuo-ai/free-plan/ · https://aireiter.com/blog/hailuo-ai-pricing
- Luma: https://eesel.ai/blog/luma-ai-pricing
- Vidu: https://costbench.com/software/ai-video-generators/vidu/free-plan/
- PixVerse: https://www.atlascloud.ai/blog/guides/pixverse-ai-free
- Higgsfield: https://creatify.ai/blog/is-higgsfield-free-free-plan-trials-and-promo-codes-explained-(2026) · https://zsky.ai/blog/is-higgsfield-free.html
- Grok Imagine: https://wavespeed.ai/blog/ai-api-pricing/grok-imagine-video-free/
- Meta Vibes: https://aiimagetovideo.pro/blog/vibes-ai/
- Gemini Omni (promo encerrada): https://pasqualepillitteri.it/en/news/9685/gemini-omni-ten-free-videos-august-4-deadline
- Dreamina: https://dreamina.capcut.com/ai-video/free-ai-video-generators-recurring-credits-vs-trials-2026
- Modelos locais e VRAM (ago/2026): https://insiderllm.com/guides/local-ai-video-generation/
- Wan 2.5–3.0 fechados: https://wan2-7.io/blog/wan-3-0-open-source/
- GPUs grátis (Kaggle/Colab, set/2026): https://gpuperhour.com/blog/free-cloud-gpus-and-credits
- Teste de US$ 300 no Google Cloud: https://cloud.google.com/free
