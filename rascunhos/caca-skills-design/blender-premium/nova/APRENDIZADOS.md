# APRENDIZADOS: blender-ia

Adendos datados. O mais novo fica embaixo.
O `SKILL.md` incorpora os aprendizados até 11/10/2026.

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
