# Pesquisa B: animação com IA no Blender (web, 2025–2026) + receitas bpy + integração com o Remotion

Agente B, 11/10/2026. O Agente A cobre o catálogo de skills/MCPs e o teste principal no container. Este arquivo cobre técnicas, fluxos, licenças e receitas.

**Como ler:**
- **MEDIDO** = rodei aqui, no Blender 5.2.2 LTS do container (4 vCPU, sem GPU).
- **FONTE** = página oficial ou texto da licença, com link.
- **FONTE 3ª** = blog, agregador ou fornecedor concorrente; trate com cautela.
- **INFERÊNCIA** = opinião minha, não verificada.

Material de trabalho em `scratchpad/hunter/blender-ia/work-B/`:
- `receita_produto.py`: receita completa, 171 linhas, código próprio, testada.
- `introspect.py` e `introspect2.py`: conferência da API 5.2.2.
- `out/`: quadros de teste e `check_*.png`.
- `out/seq/`: teste de PNG → ProRes/WebM.

---

## 1. Resumo em 10 linhas

1. O caminho que já funciona no container é este: o Claude escreve o bpy, roda `blender -b -P script.py`, gera PNG RGBA (fundo transparente) e o PNG entra como camada no Remotion. Testei de ponta a ponta no 5.2.2: alpha, sombra separada e JSON de posição.
2. Existem dois MCPs de Blender. O **oficial**, do Blender Lab: v1.0.3 (set/2026), exige Blender 5.1+, não gera 3D e é conector do Claude desde 28/04/2026. O **comunitário** do ahujasid, hoje "MCP for Blender": MIT, ~30 mil estrelas, tem `generate_3d` (Tripo, Hunyuan3D, Rodin) e assets (Poly Haven, Sketchfab, Poly Pizza). Os dois precisam do Blender aberto (interface gráfica). Servem para a máquina do Daniel, não para o container.
3. Relatos reais: o MCP é bom para analisar cenas, fazer edições em lote e escrever scripts. É fraco em criação livre. Um teste da MindStudio (01/05/2026) gastou 2 h e 60% dos tokens da sessão num donut cheio de erros.
4. A API mudou no Blender 5.0. `action.fcurves`, `scene.node_tree` e `BLENDER_EEVEE_NEXT` não existem mais, e `image_settings.media_type` vem antes de `file_format`. Script de IA treinado em 3.x/4.x quebra. A skill precisa trazer helpers prontos.
5. Para curvas com cara de motion premium, os handles Bezier do Blender recebem o mesmo `cubic-bezier(x1,y1,x2,y2)` do `Easing.bezier` do Remotion. O 3D e o 2D ficam com a mesma "assinatura" de movimento (helper `anima()` na seção 5).
6. Luz de estúdio em escala real (metros) que deu exposição correta com view transform **Standard** (a UI sai com as cores exatas): softbox key 0,5 m/6 W, duas faixas de rim 4×90 cm/6 W, topo 1 m/3 W, fill 1,5 W, HDRI Poly Haven (CC0) com força 0,25.
7. Tempos sem GPU, em Cycles + OIDN. Rascunho a 25% com 8 spp: cerca de 2,5 s/quadro com a máquina ociosa, medido. Quadro final 1080×1920 a 16 spp: cerca de 20 s/quadro (round 2). Um plano-herói de 3–5 s leva 30–50 min. Motion blur + DOF custaram só +4% de CPU num teste com a máquina disputada.
8. Integração com o Remotion: sequência PNG em `public/` com `<Img src={staticFile(...)}>` por quadro, ou ProRes 4444 / WebM VP9 com alpha (os comandos ffmpeg foram testados). A sombra vai numa camada própria, abaixo dos textos. O JSON com a caixa 2D do celular por quadro serve para ancorar os textos "saindo de trás do celular".
9. Licenças para anúncio:
   - Livres: Blender (o resultado é seu), Poly Haven (CC0), TRELLIS.2 (MIT), MCP for Blender (MIT).
   - Com condições: Hunyuan3D 2.1 (vale fora de UE/Reino Unido/Coreia, até 1 mi de usuários ativos por mês, e o Brasil está coberto); Meshy grátis (CC BY 4.0, exige crédito); Stable Fast 3D (receita anual < US$1 mi); SAM 3D (licença SAM).
   - Tripo grátis e Rodin grátis: termos contraditórios. Use plano pago.
   - Evite Sketchfab Editorial e qualquer CC BY-NC, e nada de iPhone/Apple reconhecível.
10. Recomendação: criar a skill `skills/video/blender-ia/` com o SKILL.md curto e scripts prontos (`produto.py`, `folha.sh`, `png_para_video.sh`), componente `CamadaBlender.tsx` e referências (API 5.x, licenças, MCP, luz e materiais). Detalhes na seção 9.

---

## 2. Fontes

| # | Fonte | Licença do conteúdo / da ferramenta | Data | Nota |
|---|---|---|---|---|
| 1 | [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp) (README) | Ferramenta MIT | lido em 11/10/2026 | Detalhes abaixo da tabela (1). |
| 2 | [blender.org/lab/mcp-server](https://www.blender.org/lab/mcp-server/) | Não informada na página; o código fica em projects.blender.org (403 para mim) | add-on v1.0.3 | Detalhes abaixo da tabela (2). |
| 3 | [StraySpark: comparação dos MCPs oficial e comunitário](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026) | FONTE 3ª (vende MCP concorrente) | 2026 | Detalhes abaixo da tabela (3). |
| 4 | [Anthropic: Claude for Creative Work](https://www.anthropic.com/news/claude-for-creative-work) | — | 28/04/2026 | Conector Blender = "natural-language interface to its Python API": analisar/depurar cenas, scripts em lote. A Anthropic virou Corporate Patron do Blender Development Fund (FONTE 3ª: [RedShark](https://www.redsharknews.com/anthropic-claude-creative-connectors-adobe-blender-autodesk)). |
| 5 | [MindStudio: teste do donut](https://www.mindstudio.ai/blog/claude-blender-mcp-60-percent-tokens-donut-test-results) | FONTE 3ª | 01/05/2026 | Conector oficial, plano Max 5x: 2 h, 60% dos tokens da sessão. Problemas: objetos atravessando objetos, escala e câmera ruins, tom magenta. Conclusão: melhor para nós de geometria e lote; salvar o .blend e abrir sessão nova. |
| 6 | [The Rundown: 3D com Claude + Blender](https://app.therundown.ai/guides/how-to-3d-model-anything-with-claude-blender) | FONTE 3ª | 18/05/2026 | Detalhes abaixo da tabela (6). |
| 7 | [Picsart: Blender MCP + modelo de vídeo](https://picsart.com/blog/?p=266745) | FONTE 3ª (fornecedor) | 2026 | Esboço da cena (grey-box) no Blender → modelo de vídeo IA gera o fotorreal. Não reproduz a UI pixel a pixel. |
| 8 | [Blender 5.0, notas da Python API](https://developer.blender.org/docs/release_notes/5.0/python_api/) | Docs Blender | 2025 | Detalhes abaixo da tabela (8). |
| 9 | [Blender: licença](https://www.blender.org/about/license/) | GPL (programa) | — | "What you create with Blender is your sole property"; imagens, vídeos e .blend são livres. Scripts publicados que usam a API têm de ser compatíveis com a GPL. |
| 10 | [Hunyuan3D 2.1 LICENSE](https://huggingface.co/tencent/Hunyuan3D-2.1/blob/main/LICENSE) | Tencent Hunyuan 3D 2.1 Community License | 2025 | Detalhes abaixo da tabela (10). |
| 11 | [TRELLIS.2-4B (HF)](https://huggingface.co/microsoft/TRELLIS.2-4B) | MIT | dez/2025 | Imagem → 3D com PBR. Linux + GPU NVIDIA ≥ 24 GB (FONTE 3ª [ComfyUI Wiki](https://comfyui-wiki.com/en/models/trellis/trellis-2)); pode deixar furos na malha. |
| 12 | [Meshy: preços e licença](https://docs.meshy.ai/en/webapp/pricing), [central de ajuda](https://intercom.help/meshy/en/articles/16102098-can-i-use-meshy-assets-commercially) | Grátis = CC BY 4.0; pago = privado | 2026 | Grátis: uso comercial permitido, com crédito à Meshy. Pro ou superior: comercial, sem crédito. |
| 13 | Tripo ([blog](https://www.tripo3d.ai/blog/commercial-use-ai-3d-models): 403 para mim; resumo via busca) | Grátis = CC BY 4.0 público; pago = privado e comercial | termos de 11/07/2025 | Fontes **contraditórias** sobre uso comercial no plano grátis. Use plano pago para anúncio. |
| 14 | [Hyper3D Rodin: preços](https://hyper3d.ai/pricing) | Creator US$30/mês: "Unlimited export and any use" | 2026 | O plano grátis não diz nada sobre uso comercial. FONTE 3ª fala em marca d'água. |
| 15 | [Stability AI: licença](https://stability.ai/license) | Community License | 2024–2026 | Stable Fast 3D / SPAR3D liberados para uso comercial com receita anual < US$1 mi. Acima disso, licença Enterprise. |
| 16 | [Licença SAM (scancode)](https://scancode-licensedb.aboutcode.org/sam-2025-11-19.html) | SAM License | 19/11/2025 | SAM 3D Objects (Meta). Uso comercial permitido com restrições (militar, armas etc.); repasse a licença ao redistribuir. |
| 17 | [UniRig (HF)](https://huggingface.co/VAST-AI/UniRig) | Código MIT; checkpoints e dados com termos próprios | SIGGRAPH 2025 | Rig automático de personagem; GPU ≥ 8 GB. Pouco útil para promo de app. |
| 18 | [StableGen](https://github.com/Zaws77/StableGen) | GPL-3 (add-on) | 2025 | Texturas por difusão (SDXL/FLUX.1-dev) via ComfyUI. Precisa de GPU NVIDIA. A licença do modelo vale à parte. |
| 19 | Skybox AI ([CG Channel](https://www.cgchannel.com/2024/04/blockade-labs-launches-skybox-ai-2), [Rebusfarm](https://rebusfarm.net/news/blockade-labs-skybox-ai-0-7-released)) | Grátis: CC BY + marca d'água (2023); pago: comercial | 2023–2024 | O "HDR" exportado não era 32 bits. Para estúdio de produto, use HDRI CC0 da Poly Haven. |
| 20 | [Sketchfab: licenças](https://help.sketchfab.com/en/articles/16152221-choosing-your-model-s-license), [FAQ da loja](https://help.sketchfab.com/en/articles/16152225-store-license-usage-faq) | CC (vários tipos) / Standard / Editorial | 2026 | Standard: qualquer uso. **Editorial: proibido em uso comercial/promocional.** CC BY-NC: proibido em anúncio. |
| 21 | Poly Haven (já citado em 3d_pipeline.md) | CC0 | — | HDRIs, texturas e modelos para qualquer uso, sem crédito. |
| 22 | [Remotion: vídeos transparentes](https://www.remotion.dev/docs/transparent-videos), [assets / sequência de imagens](https://remotion.dev/docs/assets) | Docs Remotion | 2026 | Detalhes abaixo da tabela (22). |
| 23 | [Blender Artists: flicker do denoiser](https://blenderartists.org/t/cycles-denioise-issue-on-animation-sequence/696388), [devtalk: denoise temporal](https://devtalk.blender.org/t/taking-a-look-at-optix-7-3-temporal-denoising-for-cycles/18656?page=6) | Fórum | 2017–2022 | Seed estática pode criar "manchas paradas"; seed animada cria cintilação. O denoise temporal é só OptiX (GPU NVIDIA). |
| 24 | [Versluis: shadow catcher no Eevee](https://www.versluis.com/2023/05/creating-a-shadow-catcher-in-blender-for-cycles-and-eevee/) | Blog | 2023 | O Eevee não tem shadow catcher nativo (exige gambiarra no material). O Cycles tem `is_shadow_catcher`. |
| 25 | Skills de Blender para agentes: [CLI-Anything Blender](https://claudskills.com/skills/cli-anything-blender/), [tmhsdigital/blender-developer-tools](https://awesome.ecosyste.ms/projects/github.com%2Ftmhsdigital%2Fblender-developer-tools), [major-ai-skills/blender](https://unpkg.com/major-ai-skills@2.3.0/skills/blender/SKILL.md) | Variadas (não conferidas) | 2026 | Só pistas: o catálogo é do Agente A. |
| 26 | Tutoriais de produto: [BlenderNation, fones (polygonrunway)](https://www.blendernation.com/2025/09/02/headphones-product-animation-tutorial/), [vídeo Blender MCP de 26 min](https://yt.chop.dev/en/v/lCyQ717DuzQ) | Vídeo | set/2025, mar/2025 | Não achei tutorial de 2026 de "anúncio de celular com Claude + bpy". Existe um curso pago: [Mammoth Club, Claude Code + Blender](https://mammothclub.com/course/rigging-and-animation-with-blender-in-claude-code). |

**Notas das fontes mais longas:**

1. **ahujasid/blender-mcp:**
   - Desde 16/09/2026 se chama "MCP for Blender" (PyPI `mcp-for-blender`).
   - Ferramentas: `execute_blender_code`, `look` (vista, câmera, render), `get_scene_info`, `generate_3d`, `search_assets`/`import_asset`.
   - Claude Code: `claude mcp add blender uvx mcp-for-blender`.
   - **Telemetria anônima ligada por padrão**: desligue com `DISABLE_TELEMETRY=true`.
   - Socket sem autenticação.
   - Poly Pizza: cerca de 69% dos modelos são CC-BY e exigem crédito.
2. **Blender Lab MCP (oficial):**
   - Requer Blender 5.1+.
   - Aviso da página: executa código gerado pela IA "without any guards"; recomenda rodar numa VM.
3. **StraySpark (comparação):**
   - Oficial: GPL-3.0-or-later; v1.0.0 em 27/04/2026; v1.0.3 em 11/09/2026; 26 ferramentas, seis delas `_for_cli` (rodam em Blender em segundo plano); sem geração 3D.
   - Comunitário: 36 ferramentas, Blender 3.0+.
   - Os dois usam a porta 9876 e conflitam.
6. **The Rundown:**
   - Passos: instalar a extensão, iniciar o servidor (localhost:9876) e conectar o Claude Code.
   - "Claude can make basic geometry, but results are better with downloaded assets."
8. **Notas da API 5.0:**
   - API legada de Action removida (`action.fcurves`/`groups`/`id_root`). No lugar: channelbag por slot.
   - `BLENDER_EEVEE_NEXT` → `BLENDER_EEVEE`.
   - `scene.node_tree` → `scene.compositing_node_group`.
   - `ImageFormatSettings.media_type` antes de `file_format`.
   - Passes de render renomeados.
10. **Licença do Hunyuan3D 2.1:**
    - Não vale na UE, no Reino Unido nem na Coreia do Sul.
    - Mais de 1 mi de usuários ativos por mês: pedir licença à Tencent.
    - "Tencent claims no rights in Outputs".
    - Proibido usar os resultados para melhorar outro modelo de IA.
    - O 3.0 não tem pesos abertos confirmados.
22. **Remotion:**
    - O alpha sobrevive em WebM VP8/VP9 (`yuva420p`) e em ProRes 4444.
    - `<Video>` de `@remotion/media` não precisa de prop; `<OffthreadVideo transparent>` precisa do `transparent`.
    - Sequência de imagens: `staticFile(\`/frame${frame}.png\`)` dentro de `<Img>`.

---

## 3. Como criadores usam IA no Blender (2025–2026): fluxos

**A. Agente com scripts headless (o nosso caso no container)**
- O Claude escreve o bpy, roda `blender -b --factory-startup -P cena.py -- args`, gera PNG e revisa o próprio resultado lendo folhas de quadros.
- Não depende de interface nem de MCP. É reprodutível (o script é a fonte da verdade) e versionável.
- É o que skills como CLI-Anything e TerminalSkills fazem (fonte 25).
- MEDIDO: funciona no 5.2.2 do container (seção 5).

**B. MCP com o Blender aberto (máquina do Daniel)**
- **Oficial (Blender Lab):** analisar e depurar `.blend`, renomear, auditar, consultar a documentação embutida. Bom como "assistente técnico" dentro de um projeto que o Daniel já montou.
- **MCP for Blender (comunidade):**
  - `look` faz a IA "ver" a viewport.
  - `generate_3d` e assets puxam modelos.
  - Bom para montar a cena e fazer look-dev rápido.
- **Lição de quem testou (5, 6):**
  - dê assets reais em vez de pedir modelagem do zero;
  - peça mudanças pontuais;
  - salve o .blend a cada etapa e abra sessão nova, porque o contexto longo degrada (o teste da MindStudio terminou com artefatos magenta);
  - diga a versão do Blender no prompt.
- **INFERÊNCIA (fluxo híbrido):** monte e aprove a cena no MCP, salve o `.blend` e mande renderizar em lote com script (`blender -b arquivo.blend -P render.py`).

**C. Geração de objetos 3D por IA**
- Fluxo: imagem ou texto → GLB (TRELLIS.2, Hunyuan3D, Meshy, Tripo, Rodin, SAM 3D, Stable Fast 3D) → importar no Blender → limpar (remesh/decimate, apagar faces soltas) → materiais próprios.
- Bom para **objetos de cena** (moedas, halteres, ícones 3D).
- **O celular-herói deve ser procedural** (seção 5): IA gera malha triangulada e densa, com furos (TRELLIS.2) e sem bordas precisas. E o celular procedural evita a aparência de iPhone (diretrizes da Apple citadas em 3d_pipeline.md).
- Neste ambiente existe `mcp__higsfield__generate_3d` (imagem → GLB). Não testei e não li a licença.

**D. Texturas e HDRI por IA**
- StableGen (GPL-3, GPU NVIDIA) e Texturaizer (pago; licença comercial separada) projetam texturas por difusão.
- Skybox AI gera panoramas, mas não HDR de 32 bits de verdade.
- **Para produto premium, HDRI de estúdio CC0 (Poly Haven) e softboxes de área dão mais controle do que HDRI gerado** (INFERÊNCIA com base na prática de estúdio).

**E. Rig e animação automática**
- UniRig (código MIT), Mixamo e AccuRIG (licenças não verificadas) servem para personagens.
- Para promo de app, a "animação" é câmera + transformação do objeto + tela. Keyframes por script resolvem; não precisa de rig.

**F. Esboço (grey-box) → vídeo por IA**
- Fluxo: o Blender dá o layout e a câmera, e um modelo de vídeo (Seedance/Kling/Veo, via Picsart ou Higgsfield) "fotorrealiza".
- Não preserva a UI real do app nem os quadros exatos. Use só em planos de ambiência.

---

## 4. Números de referência

| Item | Valor | Origem |
|---|---|---|
| fps | `scene.render.fps = 30` (o padrão do Blender é **24**) | MEDIDO (padrão 5.2.2) |
| Easing "chegada premium" (expo out) | `cubic-bezier(0.16, 1, 0.3, 1)`: ~90% do caminho em ~35% do tempo | INFERÊNCIA (curva clássica de UI) |
| Easing "dolly suave" (in-out) | `cubic-bezier(0.65, 0, 0.35, 1)` | INFERÊNCIA |
| Easy Ease do After Effects | `cubic-bezier(0.33, 0, 0.67, 1)` (influência 33%) | conhecimento geral |
| Atalho no Blender | `kp.interpolation = 'EXPO'` e `kp.easing = 'EASE_OUT'` (também há SINE, QUAD, CUBIC, QUART, QUINT, CIRC, BACK, BOUNCE, ELASTIC) | MEDIDO (enum 5.2.2) |
| Revelação do celular | giro de 40–60° em 1,5–2 s (45–60 quadros) com expo out; dolly de 0,80 → 0,55 m em 3 s | valores do teste, gosto a validar com o Daniel |
| Turntable | 360° em 6–8 s (180–240 quadros), LINEAR com extrapolação LINEAR; chave final em `f1+1` dá loop perfeito | receita |
| Motion blur | `use_motion_blur=True`, `motion_blur_shutter=0.5` (180°) | convenção de cinema |
| DOF | lente de 85 mm, f/2.8, foco num empty no celular; **escala real em metros** (celular 0,0716 × 0,1466 × 0,0083 m) senão o f-stop não corresponde | MEDIDO (render ok) |
| Amostras | Cycles 16 spp + OIDN ≈ 64 spp nesta cena (round 2); `adaptive_threshold=0.02`; `max_bounces=6` | round 2 + receita |
| Luz (Standard, escala real) | key 0,5×0,5 m 6 W a ~0,8 m; fill 0,8 m 1,5 W; rims 0,04×0,9 m 6 W atrás; topo 1 m 3 W; HDRI 0,25 | MEDIDO (com 40/8/30/15 W e HDRI 0,6 a imagem estourou) |
| View transform | **Standard** para a UI do app ficar com as cores exatas (emissão 1,0); AgX (padrão) dessatura; há também Khronos PBR Neutral, ACES 2.0 e Filmic | MEDIDO (lista do 5.2.2) |
| Materiais | aro de metal: metallic 1, roughness 0,28; vidro traseiro: preto, roughness 0,35, coat 1 / coat roughness 0,04 (**sem Transmission**: é opaco e mais barato); tela: base preta, roughness 0,05, Specular IOR Level 0,3, emissão 1,0 | MEDIDO (visual ok) |
| Tempo do rascunho | 270×480, 8 spp: **≈2,5 s/quadro** com a máquina ociosa (1 quadro = 3,2 s de processo, 6,1 s de CPU); 2–5 s com disputa | MEDIDO 11/10 |
| Partida a frio | a 1ª execução levou 12 s só para carregar o Cycles (cache frio); as seguintes, ~1 s | MEDIDO |
| Tempo final | 1080×1920: ≈20/27/46 s/quadro a 16/32/64 spp (o de 64 foi medido com a máquina ociosa) | round 2 |
| MB + DOF | 540×960, 16 spp, 2 quadros: 134,3 → 139,7 s de CPU (**+4%**). Medido com a máquina disputada: os outros processos usaram mais CPU que eu. É ruído, use só como ordem de grandeza | MEDIDO |
| Plano-herói | 90–150 quadros a 16 spp ≈ 30–50 min no container | round 2 |
| Com GPU (máquina do Daniel) | ordem de segundos por quadro em Eevee/Cycles GPU | INFERÊNCIA, não medido |

---

## 5. Receitas bpy (código próprio, testado no 5.2.2)

Arquivo completo: `work-B/receita_produto.py`.

Uso:

```
blender -b --factory-startup -P receita_produto.py -- --out /abs/frames/phone_ \
  --pct 100 --spp 16 --frames 1-90 [--mb] [--dof] [--hdri studio.hdr] [--screen tela.png] \
  [--sombra] [--so_sombra] [--turntable] [--view Standard] [--so 1,30,60]
```

**5.1 Render transparente para o Remotion**

```python
r = sc.render; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = 16; sc.cycles.adaptive_threshold = 0.02
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
r.use_persistent_data = True; r.fps = 30
r.resolution_x, r.resolution_y = 1080, 1920
r.film_transparent = True                 # o fundo vem do Remotion
im = r.image_settings
im.media_type = 'IMAGE'                   # 5.x: definir antes de file_format
im.file_format = 'PNG'; im.color_mode = 'RGBA'; im.color_depth = '8'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
r.filepath = '/abs/public/blender/plano1/phone_'   # vira phone_0001.png ...
```

**5.2 F-curves que funcionam em 4.x e 5.x + easing igual ao Remotion**

```python
def fcurves(idb):
    ad = idb.animation_data; act = ad.action
    if hasattr(act, 'fcurves'): return act.fcurves          # <= 4.x
    from bpy_extras import anim_utils                       # 5.x (slots)
    return anim_utils.action_get_channelbag_for_slot(act, ad.action_slot).fcurves

def anima(obj, path, idx, pts, bez=(0.16, 1, 0.3, 1)):    # bez = cubic-bezier do CSS
    for f, v in pts:
        getattr(obj, path)[idx] = v; obj.keyframe_insert(path, index=idx, frame=f)
    fc = next(c for c in fcurves(obj) if c.data_path == path and c.array_index == idx)
    k = fc.keyframe_points; x1, y1, x2, y2 = bez
    for p, q in zip(k[:-1], k[1:]):
        p.interpolation = 'BEZIER'; dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right_type = q.handle_left_type = 'FREE'
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv)
        q.handle_left  = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update(); return fc
```

MEDIDO: no 5.2.2, `hasattr(action, 'fcurves')` é `False`, e `action_get_channelbag_for_slot` devolve as fcurves.

**5.3 Turntable em loop e revelação**

```python
prod = bpy.data.objects.new('Produto', None)          # empty pai do celular
fc = anima(prod, 'rotation_euler', 2, [(f0, 0), (f1 + 1, 2 * math.pi)])
for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
fc.extrapolation = 'LINEAR'                            # loop sem "soluço"
# revelação: anima(prod,'rotation_euler',2,[(1,rad(-40)),(55,rad(18))])
#            anima(cam,'location',1,[(1,-0.80),(90,-0.55)], bez=(0.65,0,0.35,1))
```

A câmera usa uma restrição `TRACK_TO` mirando o empty `Foco`, que também é o `dof.focus_object`. Girar o produto com as luzes paradas faz os reflexos "varrerem" o vidro e o metal, que é o visual de anúncio.

**5.4 Celular genérico com cantos arredondados (bmesh), em escala real**

```python
def caixa_redonda(nome, w, h, d, raio):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(w, h, d), verts=bm.verts)
    vert = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > d / 2]
    bmesh.ops.bevel(bm, geom=vert, offset=raio, segments=12, affect='EDGES', profile=0.5)
    me = bpy.data.meshes.new(nome); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(nome, me); bpy.context.scene.collection.objects.link(ob); return ob
corpo = caixa_redonda('Corpo', 0.0716, 0.1466, 0.0083, 0.011)
corpo.modifiers.new('Quina', 'BEVEL').width = 0.0015   # + limit_method='ANGLE', harden_normals
tela = caixa_redonda('Tela', 0.0676, 0.1426, 0.0002, 0.009)  # cantos iguais aos do corpo
```

Os materiais vão por índice: faces com |normal.z| > 0,9 recebem o vidro, as outras o metal. Sem logo e sem o layout de câmera do iPhone.

**5.5 Tela com a UI (imagem ou sequência renderizada pelo Remotion)**

```python
tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load('/abs/ui_0001.png')
tc = nt.nodes.new('ShaderNodeTexCoord')                 # 'Generated' = 0..1, sem UV
nt.links.new(tc.outputs['Generated'], tx.inputs['Vector'])
nt.links.new(tx.outputs['Color'], bsdf.inputs['Emission Color'])
# vídeo da UI quadro a quadro:
tx.image.source = 'SEQUENCE'; tx.image_user.frame_duration = 90
tx.image_user.frame_start = 1; tx.image_user.use_auto_refresh = True
```

MEDIDO: a imagem saiu na orientação certa e não espelhada. A parte da sequência eu não testei.

**5.6 Luz de estúdio (três pontos + faixas de rim)**

```python
def area(nome, loc, sx, sy, watts):
    L = bpy.data.lights.new(nome, 'AREA'); L.shape = 'RECTANGLE'
    L.size, L.size_y, L.energy = sx, sy, watts
    o = bpy.data.objects.new(nome, L); o.location = loc; sc.collection.objects.link(o)
    alvo = bpy.data.objects.new(nome + '_alvo', None); sc.collection.objects.link(alvo)
    o.constraints.new('TRACK_TO').target = alvo; return o
area('Key', (-0.45, -0.55, 0.35), 0.5, 0.5, 6)
area('Fill', (0.6, -0.4, 0.05), 0.8, 0.8, 1.5)
area('RimE', (-0.35, 0.35, 0.10), 0.04, 0.9, 6)     # faixas finas = linhas de brilho no aro
area('RimD', (0.35, 0.35, 0.10), 0.04, 0.9, 6)
area('Topo', (0, 0, 0.7), 1.0, 1.0, 3)
```

**5.7 Sombra em camada separada (respeita a regra 3)**

```python
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, -0.0753))
bpy.context.object.is_shadow_catcher = True             # só no Cycles
# 2º render, só da sombra: o celular some para a câmera, mas continua projetando sombra
for o in (corpo, tela): o.visible_camera = False
```

MEDIDO: a camada de sombra e a do celular se combinam certo (`out/check_sombra.png`). Nesse render, deixe o resto da cena igual.

**5.8 Caixa 2D do celular por quadro → JSON para o Remotion**

```python
from bpy_extras.object_utils import world_to_camera_view
for f in range(f0, f1 + 1):
    sc.frame_set(f)
    pts = [world_to_camera_view(sc, cam, corpo.matrix_world @ Vector(c)) for c in corpo.bound_box]
    xs = [p.x * 1080 for p in pts]; ys = [(1 - p.y) * 1920 for p in pts]
    caixas.append({'f': f - f0, 'x0': min(xs), 'y0': min(ys), 'x1': max(xs), 'y1': max(ys)})
```

Os valores estão em pixels da composição de 1080×1920 e não mudam com `--pct`. É a caixa 3D projetada, um pouco maior que a silhueta.

**5.9 Rascunho para revisão (regra do editor: folhas a cada 6 quadros)**

```bash
blender -b --factory-startup -P cena.py -- --pct 25 --spp 8 --so 1,7,13,19,25,...   # ~2,5 s/quadro
ffmpeg -f lavfi -i color=c=0x808080:s=270x480 -framerate 30 -i phone_%04d.png \
  -filter_complex "[0][1]overlay=shortest=1,select='not(mod(n\,6))',tile=6x2" -frames:v 1 folha.png
```

O comando de folha foi testado com `tile=3x1`. Sobrepor numa cor é obrigatório para enxergar o alpha.

**Armadilhas no Eevee:** em `-b` puro ele aborta neste container por falta de libEGL; com `xvfb-run` funciona, mas não sai mais barato que o Cycles (round 2). O Eevee também não tem shadow catcher nativo (fonte 24). No container, use Cycles.

---

## 6. Integração com o Remotion

**Opção 1: sequência PNG (preferida, quadro exato, sem decodificar vídeo)**

```tsx
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
export const CamadaBlender: React.FC<{pasta: string; prefixo?: string; total: number}> =
  ({pasta, prefixo = 'phone_', total}) => {
  const f = Math.min(useCurrentFrame(), total - 1);           // segura o último quadro
  const n = String(f + 1).padStart(4, '0');                   // Blender começa em 0001
  return <AbsoluteFill><Img src={staticFile(`${pasta}/${prefixo}${n}.png`)}
    style={{width: '100%', height: '100%'}} /></AbsoluteFill>;
};
// <Sequence from={60} durationInFrames={90}><CamadaBlender pasta="blender/plano1" total={90}/></Sequence>
```

**Opção 2: um arquivo com alpha.** Os dois comandos foram MEDIDOS: ProRes saiu `yuva444p12le`; WebM saiu com `alpha_mode=1`.

```bash
ffmpeg -framerate 30 -i phone_%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le phone.mov
ffmpeg -framerate 30 -i phone_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -crf 18 -b:v 0 phone.webm
```

No Remotion, use `<Video>` (`@remotion/media`) ou `<OffthreadVideo transparent>` (fonte 22). O WebM é menor: 19 KB contra 237 KB de ProRes em 3 quadros de 270×480.

**Ordem das camadas (regras do editor):**
1. Fundo/wallpaper (Remotion).
2. Camada de sombra do Blender (5.7).
3. Textos e cartões (Remotion).
4. Camada do celular do Blender, por cima.

**Regras do editor aplicadas ao 3D:**
1. **Texto sobre texto:** todo texto fica no Remotion. O Blender só entrega o objeto, sem tipografia 3D.
2. **Sem recorte no meio da tela:**
   - renderize sempre o quadro inteiro de 1080×1920 com alpha e nunca recorte o PNG;
   - DOF e motion blur geram bordas semitransparentes, e o alpha as preserva;
   - confira no `caixas.json` que o celular só sai do quadro pela borda do vídeo.
3. **Celular por cima:** garantido pela ordem acima. A sombra separada evita escurecer o texto de forma errada.
4. **Texto saindo de trás do celular:** use a caixa do quadro de entrada para iniciar o componente `Atras` dentro da silhueta e deslizar para fora, com a camada do texto abaixo da camada do celular.

**Sincronia:**
- `fps` 30 nos dois lados.
- O quadro 0 do Remotion corresponde ao 0001 do Blender.
- Os cortes ficam na grade de batidas da skill remotion-video. Defina a duração do plano no Remotion primeiro (áudio primeiro) e passe `--frames 1-N` ao Blender.

**Tamanho em disco:** um PNG RGBA de 1080×1920 ocupa da ordem de 1–3 MB, então 150 quadros dão algumas centenas de MB (INFERÊNCIA, extrapolada dos testes de 270×480 com 60–80 KB). Não vá para o git; fica em `public/` local ou no armazenamento de mídia do projeto.

---

## 7. Licenças para uso comercial em anúncios

| Ferramenta / asset | Pode usar em anúncio? | Condições |
|---|---|---|
| Blender (o que ele gera) | Sim | O resultado é seu. Scripts **publicados** com a API precisam de licença compatível com GPL; os scripts internos da skill não são publicados |
| MCP for Blender (ahujasid) | Sim (ferramenta MIT) | Telemetria ligada por padrão (`DISABLE_TELEMETRY=true`); assets puxados seguem a licença de cada um |
| Blender Lab MCP | Sim | GPL-3.0+, segundo FONTE 3ª; executa código sem proteção (use VM ou máquina sem dados sensíveis) |
| Poly Haven (HDRI, texturas, modelos) | Sim | CC0, sem crédito |
| Poly Pizza | Em parte | ~69% CC-BY, com crédito obrigatório |
| Sketchfab | Depende do modelo | CC0 e CC BY (com crédito) servem; **NC e Editorial, não**; licença Standard da loja serve |
| TRELLIS.2 | Sim | MIT; precisa de GPU ≥ 24 GB (não roda no container) |
| Hunyuan3D 2.1 | Sim no Brasil | Fora de UE/Reino Unido/Coreia; acima de 1 mi de usuários ativos por mês, pedir licença; não usar os resultados para treinar outra IA; incluir a licença ao redistribuir os pesos |
| Meshy | Sim | Grátis = CC BY 4.0, com crédito à Meshy; Pro+ = privado, sem crédito |
| Tripo | Use plano pago | Fontes contraditórias sobre o plano grátis (CC BY, público) |
| Rodin (Hyper3D) | Plano Creator ou superior | "Unlimited export and any use"; plano grátis não está claro |
| Stable Fast 3D / SPAR3D | Sim, se a receita anual for < US$1 mi | Stability Community License |
| SAM 3D Objects | Sim, com restrições | Licença SAM (proíbe usos militares etc.) |
| Skybox AI | Só no plano pago | Grátis = CC BY + marca d'água (dados de 2023) |
| Aparência de iPhone/Apple | **Evitar** | Diretrizes da Apple (3d_pipeline.md): sem logo, sem render "artístico" de produto Apple |

Isto não é parecer jurídico. Confira a licença de cada modelo no dia do uso.

---

## 8. Lacunas

- **Não testado:**
  - sequência de imagens como textura de tela (`source='SEQUENCE'`);
  - flicker do OIDN numa sequência longa;
  - leitura de ProRes 4444 pelo `<OffthreadVideo transparent>`;
  - o MCP oficial ao vivo (o container não tem interface gráfica).
- **Tempos:** só o rascunho de 270×480 foi medido com a máquina ociosa. Os de 540×960 e o custo de MB+DOF foram medidos com disputa de CPU.
- **Licenças:** não confirmei a licença do repositório oficial (projects.blender.org deu 403), o termo do plano grátis do Tripo nem os termos de Mixamo e AccuRIG.
- **Vídeos:** não achei um vídeo de 2026 de "anúncio de celular com Claude + bpy" para estudar o processo.

---

## 9. Recomendação de estrutura: `skills/video/blender-ia/`

A estrutura segue o padrão de `remotion-video`: SKILL.md + APRENDIZADOS.md + references/.

```
skills/video/blender-ia/
  SKILL.md                 ≤ ~250 linhas, em português
  LEIA-ME.txt              guia curto para o Daniel (instalar Blender, MCP na máquina dele)
  APRENDIZADOS.md          o que funcionou/falhou em cada projeto
  scripts/
    produto.py             = receita_produto.py (celular, luz, câmera, PNG RGBA, caixas.json, sombra)
    render_blend.py        renderiza um .blend aprovado no MCP (headless, args iguais)
    folha.sh               rascunho 25%/8 spp + folha de contato a cada 6 quadros sobre cor
    png_para_video.sh      PNG → ProRes 4444 / WebM VP9 alpha
    instalar_blender.sh    tarball 5.2.2 LTS (383 MB, 9 s + 24 s) no scratchpad
  remotion/
    CamadaBlender.tsx      componente da seção 6 (+ leitura de caixas.json)
  references/
    api-5x.md              mudanças 5.0–5.2 (fcurves/slots, EEVEE id, compositor, media_type, view transforms)
    luz-materiais.md       tabela de valores da seção 4, receitas de vidro/metal/tela
    mcp.md                 oficial x comunitário, instalação, porta 9876, segurança, telemetria
    licencas.md            tabela da seção 7 com links
    ia-3d.md               geradores 3D/textura/HDRI, quando usar (só objetos de cena), limpeza de malha
```

**Seções do SKILL.md (encaixam no ESQUELETO.md):**
1. **Quando usar Blender:**
   - CSS 3D ou R3F no Remotion para a maioria dos planos;
   - Blender (Cycles) só para 1–2 planos-herói por vídeo;
   - MCP só na máquina do Daniel.
2. **Regras de ouro:**
   - escala real em metros;
   - 30 fps;
   - Standard quando aparece UI;
   - `film_transparent` + PNG RGBA;
   - celular genérico;
   - script é a fonte da verdade;
   - informar a versão do Blender.
3. **Comandos no container:** Cycles CPU e tempos; Eevee só via xvfb.
4. **Receitas:** link para `scripts/produto.py`, mais os trechos 5.2, 5.3 e 5.7.
5. **Integração com o Remotion e regras do editor no 3D** (seção 6 deste arquivo).
6. **IA para assets e licenças** (resumo, com link para as referências).
7. **Checklist antes do render final:**
   - rascunho e folhas;
   - procurar as 4 falhas do editor;
   - conferir `caixas.json`;
   - conferir as cores da UI;
   - conferir a sombra;
   - tempo estimado = quadros × s/quadro.
