# APRENDIZADOS: blender-ia

Adendos datados. O mais novo fica embaixo.
O `SKILL.md` incorpora os aprendizados até 12/10/2026.

## 11/10/2026: entrada na base

**Para que serve:** fazer planos 3D realistas (celular, produto, logo) no Blender, escritos pelo Claude em `bpy` e renderizados sem interface, para entrar como camada transparente num vídeo do Remotion.

**Quando usar:** em 1–2 planos-herói por vídeo, quando o R3F do Remotion não tiver o realismo de reflexo e luz que o plano pede. Para o resto do vídeo, continue na `remotion-video`. O MCP do Blender serve no computador do Daniel, com o Blender aberto.

**O que tem de mais útil:**
- `scripts/produto.py`: celular genérico + estúdio + câmera com a mesma curva do Remotion + PNG RGBA + sombra em camada + `caixas.json`.
- Helper `fcurves()` que funciona no Blender 4.x e 5.x (o 5.0 removeu `action.fcurves`).
- Tabela de luz de estúdio em escala real que não estoura com view `Standard`.
- Tabela de licenças de assets e de geradores 3D por IA para anúncio.

**Testes feitos no container (4 CPUs, sem GPU, Blender 5.2.2 LTS):**
- Agente A, `logo_e_celular.py` (então `promo_min.py`): 60 quadros 1080×1920, Cycles 8 amostras + OIDN, **16 min 41 s** (mediana de 14,4 s por quadro nos quadros sem disputa de CPU). 1 quadro a 16 amostras: 30,6 s de render, 41,7 s de processo. Rascunho a 25%: 1,4 s por quadro.
- Agente A: o Blender **com interface** sobe sob `xvfb-run` (18,8 s a frio, 3,7 s a quente). Um servidor TCP numa thread + `bpy.app.timers` (a arquitetura dos MCPs) recebeu código de fora; render OpenGL da viewport em 1,07 s; `bpy.ops.screen.screenshot` sai **preto**.
- Agente B, `produto.py` (então `receita_produto.py`): alpha, sombra em camada separada e `caixas.json` conferidos; rascunho 270×480 a 8 amostras ≈ 2,5 s por quadro; motion blur + desfoque ≈ +4% de CPU (com disputa); ProRes 4444 saiu `yuva444p12le` e WebM com `alpha_mode=1`.
- Agente de transcrição (esta entrada):
  - `--tela_seq` (tela com sequência de imagens): os quadros 1, 2 e 3 mostraram vermelho, verde e azul no centro da tela; canto com alpha 0; ~0,6 s por quadro a 25% e 4 amostras.
  - `folha.sh` testado na animação de 60 quadros e numa sequência com alpha; `png_para_video.sh` testado (ProRes 4444 + WebM VP9 alpha); `instalar_blender.sh` testado com o tarball já baixado; SHA-256 conferido com o arquivo oficial; `CamadaBlender.tsx` passa no `tsc --strict`.

**Erros encontrados e corrigidos:**
- **Logo "brotando" no meio da tela.** O `promo_min.py` original fazia o logo crescer de escala 0 no lugar (quebra a regra 4 do editor). Agora ele sobe da borda de baixo do quadro.
- **Overshoot na chave errada.** No Blender, a interpolação de uma chave vale para o trecho **depois** dela. O `BACK` estava na chave de chegada (sem efeito). Agora fica na chave de partida; conferido: z vai de −2,6 a −1,53 (passa do ponto) e pousa em −1,62 no quadro 30.
- `folha.sh`: o `ffprobe -of csv=s=' '` não aceita espaço como separador; use `s=x`. E o fundo de cor do ffmpeg precisa de `r=30`, senão (25 fps) quadros são pulados ou repetidos.
- Download do texto da GPL em gnu.org falhou pelo proxy; a cópia veio do próprio tarball do Blender (`license/spdx/`).

**Avisos para a próxima vez:**
- O visual do teste do agente A é "funcional, ainda não premium" (fundo com brilho demais, corpo fino, tela lisa). O premium vem da direção de arte: HDRI de estúdio, UI real na tela, motion blur e desfoque.
- O `logo_e_celular.py` tem um plano de fundo com brilho: com `alpha`, esse plano continua opaco. Para camada transparente, use o `produto.py`.
- O logo pousa perto da borda de baixo: confira a zona segura do Reels.
- Não testado ainda: flicker do OIDN numa sequência longa; leitura de ProRes 4444 pelo `<OffthreadVideo transparent>`; MCP real no computador do Daniel; `generate_3d` do Higgsfield e sua licença; `pip install bpy` (wheel oficial 5.2.2, Python 3.13).

## 12/10/2026: Blender premium (direção de animação, visual e modelagem)

**Para que serve:** deixar o plano-herói com cara de comercial: movimento fluido e legível, luz e material de anúncio, celular com espessura e detalhe. Três pesquisas: A (animação), B (visual e modelagem) e a integração feita pelo agente de transcrição. Pesquisas completas e imagens: `scratchpad/hunter/blender-premium/`.

**Quando usar:** em todo plano-herói. O `premium.py` substitui o `produto.py` nesse caso; o `produto.py` fica como versão leve e o `logo_e_celular.py` só para teste de logo.

**O que tem de mais útil:**
- `scripts/premium.py`: celular genérico de 8,2 mm (aro, vidros encaixados, botões, antenas, USB-C, ilha de câmera), estúdio com sheen, Khronos, órbita com pivô, push-in, mola defasada, RGBA, sombra, `caixas.json` e `qa.json`.
- `scripts/verifica_curvas.py`: QA de curvas (vmax, entrada, overshoot, paradas, CSV).
- `references/direcao-animacao.md`, `visual-premium.md`, `modelagem.md`.

**Testes (Blender 5.2.2, 4 CPUs, sem GPU):**
- **Curva do Remotion dentro do Blender:** handles Bezier de um `cubic-bezier(x1,y1,x2,y2)` reproduzem a curva com erro de **0,00002–0,00005%** do curso (piso do float32), em quadros e subquadros, 7 canais (agente A) e de novo no `--selftest` do `verifica_curvas.py`. O `frame_set` bate com `fcurve.evaluate` (diferença 0,0 rad).
- **Direção:** a v1 (expo-out na órbita + mola rápida) fez o reflexo cruzar o vidro em **8 quadros**; a v2 (drift, dolly, mola ζ 0,85 response 2,4 s defasada 6 quadros) em **22 quadros**. No `premium.py` (response automático 2,35 s): **24 quadros**, 25,2° relativos, câmera vmax 2,51× (órbita) e 2,85× (dolly), 0% de overshoot, produto vmax 3,01× com 0,3–0,6%, nenhuma parada no meio. Entrada da órbita a 0,26× da média.
- **Overshoot medido:** handle `(0.2,1.2,0.3,1)` 1,25%; BACK `back=0.5` 0,82%, `1.0` 3,7%, padrão `1.70158` 10%; mola ζ 0,8 1,5%.
- **Três chaves:** ease por trecho para na chave do meio; `AUTO_CLAMPED` + `CONT_ACCEL` reduz o salto de aceleração 6,4× (o `AUTO` + `CONT_ACCEL`, 41×, mas passa 0,018% do fim).
- **Turntable com `CYCLES` + `REPEAT_OFFSET`:** passo de 6,0000° por quadro, sem salto (o `REPEAT` padrão volta 358° por ciclo).
- **Visual:** cantos do quadro em 2–4/255 (antes 51), halo ~35/255; view `Khronos PBR Neutral` (UI fiel); 16 contra 32 amostras quase não muda o tempo; OIDN Balanced economiza ~6 s por quadro (diferença média 0,16–0,21/255, mas há pixels isolados de até 89/255 nos brilhos finos).
- **Tempos:** rascunho 25% a 8 amostras com motion blur: 1,4–1,5 s por quadro (9,5 s o 1º); **1080×1920, 16 amostras + Balanced + motion blur + compositor: 23,5–24,7 s por quadro** (quadros 20, 50, 80; 32,6 s o 1º, a frio); 90 quadros ≈ 36 min.
- **Modos conferidos no `premium.py`:** `--tela_seq` (vermelho, verde e azul no centro nos quadros 1–3, canto com alpha 0), `--so_sombra` (celular invisível, alpha da sombra até 241), `--anim turntable`, `--vista tras`, `--fundo escuro --comp` (vinheta), `--clay`, `--salvar` + `verifica_curvas.py` na cena salva.

**Erros encontrados e corrigidos:**
- **Key baixa lavando a tela** (a 0,40 m de altura o reflexo cobria metade da UI): key a 0,65 m.
- **Rim de 10 W do lado da câmera** estourou a lateral em branco: 10 W só no lado escuro, 4 W do outro.
- **Thin film de 380 nm** deixou a lente ciano (olho de desenho): 120 nm.
- **Vidro traseiro com roughness 0,42 e base clara** ficou cinza "de plástico": 0,30 e base escura.
- **Anel de lente prateado** virou disco branco chapado: grafite.
- **Compositor no `-b` tentou GPU e falhou (`libEGL`):** `render.compositor_device = 'CPU'`.
- **`CompositorNodeMixRGB` não existe no 5.2:** `ShaderNodeMix`.
- **Clay estourado em branco** (cinza 0,5 sob a key de 26 W): cinza 0,18.
- **Receita 4 do cc-blender-skill** põe BOUNCE na última chave (sem efeito): a interpolação vale para o trecho depois da chave.
- **UI com tamanho errado:** a UI da tela tem de ser 1080×2309 (área ativa 68 × 145,4 mm). O 1º `tela_teste.py` saiu 1080×2311 por arredondamento: agora força 2309; o `premium.py` avisa quando a proporção da imagem sai de 2%.

**Avisos para a próxima vez:**
- **Números de duração e velocidade são INFERÊNCIA** (não achamos fonte de 2025–26 de animadores de filme de produto). A medição de varredura (20, 30 ou 40 quadros) e do overshoot (0,8% ou 1,5%) precisa do olho do Daniel: mostrar as folhas v1 e v2 lado a lado.
- **Não testado:** flicker do OIDN numa sequência longa (só quadros soltos a 25% e 3 a 100%); o final completo de 90 quadros; ProRes/WebM vindos do `premium.py`; a UI real do Rotina na tela (só a UI genérica de teste); `--tela_seq` com a sequência real do Remotion em 1080×2309; HDRI diferente do `studio_small_09`; Eevee.
- A borda esquerda (silhueta contra o fundo) ainda fica escura; se o Daniel quiser contorno dos dois lados, suba a Rim E.
- O `Noise` de micro-deriva foi medido numa sonda (0,15° pico a pico), mas **não está ligado** no `premium.py`; está na receita de `references/direcao-animacao.md`.
- O `produto.py` e o `logo_e_celular.py` não foram alterados (só um aviso no cabeçalho do segundo); o `produto.py` continua com view `Standard` por padrão (passe `--view "Khronos PBR Neutral"`).
- Aprovação: o Daniel decide se o `premium.py` vira o padrão e se o `produto.py` pode ser aposentado.

## 12/10/2026: testes finais dispensados (decisão do Daniel)

- O Daniel disse que **não quer mais testes no Blender**. Os quatro itens abaixo ficam registrados como **não testados**, para ninguém achar que foram conferidos: o render completo de 90 quadros, a tela real do app Rotina no celular, a cintilação do removedor de ruído (OIDN) numa sequência longa e o Blender no computador dele.
- **Valores mantidos como padrão:** o celular passa do ponto 1% e o `premium.py` é o script principal do plano-herói. Se o olho de editor dele achar o reflexo rápido demais ou o movimento errado, ajustar pelos números da `references/direcao-animacao.md`.


## 12/10/2026: Rotina v3, primeiro vídeo inteiro com o celular do Blender

- **Agora testado** (era "não testado" no adendo anterior): render longo de **895 quadros** a 100% (Cycles, 8 amostras, motion blur, OIDN); a **UI real do Rotina** como sequência na tela (1080×2309, numerada pelo quadro do Remotion); **tremido do OIDN** em sequência longa: diferença média de 0,4/255 entre quadros parados (invisível).
- **Cena base + poses de fora:** a cena saiu do `premium.py --anim parado --salvar`; um script do projeto (`blender/v3_pose.py`, branch `rotina-video`) limpa a animação, aplica uma pose por quadro (lida de um JSON exportado do Remotion, chaves lineares) e troca a imagem da tela por uma sequência (`frame_start=1`, `offset 0`).
- **Mesma câmera nos dois lados:** câmera fixa em (0, −0,62, 0) olhando +Y, `sensor_fit VERTICAL`, altura do sensor 36 mm, lente 84,68 mm (fov 24°). As projeções do Blender e do Remotion bateram com 0 px de diferença (`--checar` grava os cantos projetados).
- **Render só da região do celular (`--borda`):** a caixa projetada das malhas do celular em cada quadro (subquadros ±0,5 por causa do motion blur, folga de 3%), `use_border=True` e `use_crop_to_border=False` (o PNG continua 1080×1920). De 18 para ~10 s por quadro. Quadros sem celular não são gravados: o Remotion precisa pular exatamente os mesmos.
- **Regra do Daniel:** o celular fica sempre reto ou inclinado para cima (nunca com a tela virada para baixo). No v3 isso virou teste: o exportador de poses para com erro se algum quadro quebrar a regra.
- **Celular apagado em palco escuro vira um retângulo preto.** Uma tela acesa (bloqueio com relógio e notificações) dá forma ao aparelho.
- **Render longo em segundo plano:** o Bash em segundo plano para em 2 h. Use `setsid nohup … & disown`. Não use `pkill -f` com um padrão que também casa com o seu próprio comando (matou o shell, código 144).
- **Tempo real:** 2 h 39 min para 895 quadros (~10,7 s por quadro com 4 CPUs, dividindo a máquina com rascunhos do Remotion).
- Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 6) e `reports/Vídeo Rotina v3, skills e combos usados (2026-10-12).md`.

## 13/10/2026: Rotina v4 reaproveitou o render do v3

- Os 895 PNG do celular (2 h 40 min) foram reusados num visual totalmente novo. Só a tela de abertura mudou, porque a tela vermelha sumia no fundo vermelho: 136 quadros refeitos com `--frames` (~29 min). Guardar as poses e os PNG por quadro, separados do 2D, paga.
- Um celular escuro sobre papel claro funciona bem como foto de produto, desde que tenha sombra (feita em 2D no Remotion). Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 7).

## 17/10/2026: Rotina v5, abertura curta em 16:9

- `v3_pose.py` passou a ler a resolução do `poses.json` (`cam.w` e `cam.h`). A mesma lente (fov vertical de 24°, a 0,62 m) serve no 16:9; o v3 e o v4 não mudam.
- Só 73 quadros no Blender (~13 min): o celular abre o vídeo e some atrás de um elemento 2D (a notificação salta da tela). O resto do vídeo é 2D. Para retomar depois de um reinício, `--frames a-b` só nos quadros que faltam. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 8).

## 17/10/2026: Rotina v6, quadros desfocados a 40%

- Quando o 2D desfoca o celular (18 px), renderize esses quadros a 40%, com 4 amostras, sem motion blur e só nos pares: ~2 s por quadro contra ~7,5 s do nítido. O Remotion usa o par anterior nos ímpares.
- A pose do "mergulho" (elemento da tela no centro do quadro) sai de um ajuste de x e z em 6 passos sobre a projeção do ponto da tela. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 9).
