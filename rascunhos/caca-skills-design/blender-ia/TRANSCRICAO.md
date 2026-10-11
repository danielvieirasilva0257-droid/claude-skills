# Transcrição: pesquisas "Animação com IA no Blender" (11/10/2026)

Registro fiel do que os dois agentes de pesquisa acharam. Os textos completos, com todos os links, estão em `pesquisa-A.md` (22–24 KB) e `pesquisa-B.md` (34 KB), nesta pasta. Aqui ficam todos os achados, números e fontes, sem opinião minha; minhas observações estão marcadas como **[transcrição]**.

Base anterior usada pelos dois: `research_notes/Motion design 3D e voz IA/3d_pipeline.md` e `3d_round2.md` (08–09/10/2026) e a seção 3D da `remotion-video`.

---

## Pesquisa A: skills e MCPs + teste no container

**Como buscou:** `npx -y skills@1.7.2 find` com os termos blender, blender python, bpy (nada), 3d animation, 3d modeling, three.js, product render (só lixo de geração de imagem, contagens provavelmente infladas) e 3d motion; busca no GitHub pelo MCP do GitHub (a API REST `gh api` estava bloqueada); 6 repositórios clonados com `--depth 1` e lidos como dados; 3 `SKILL.md` avulsos.

### Resumo em 8 pontos (do agente)
1. Não existe skill pronta para "promo de app em Blender". A mais próxima (`kevinbadi/blender-skills`) não tem licença.
2. O MCP padrão é o `ahujasid/mcp-for-blender` (antigo blender-mcp): 30,4 mil estrelas, MIT, v2.1.9 de 06/10/2026. Recusa rodar com `blender -b` (no código) e precisa do Blender aberto.
3. Testado: o Blender com interface roda sob `xvfb-run`, e o mecanismo dos MCPs (servidor TCP numa thread + `bpy.app.timers`) funciona. Render OpenGL da viewport ~1 s; `screen.screenshot` sai preto.
4. O MCP não traz vantagem no container: `bpy` + `blender -b -P` é mais simples, reprodutível e versionável. O MCP vale no computador do Daniel.
5. Render medido (1080×1920, Cycles CPU + OIDN, celular + logo): ~13–17 s por quadro com 4–8 amostras e `persistent_data`, mais ~20 s no 1º quadro. 60 quadros a 8 amostras: 16 min 41 s. Prévia a 25%: 1,4 s por quadro.
6. Licenças: MIT (mcp-for-blender, blenderwright, cc-blender-skill, claudedesignskills, ECC, Flue, scenario-labs, BlenderGPT); GPL-3.0 (MCP oficial do Blender Lab, bpy-dev/blender-mcp, Dream Textures, StableGen); sem licença (kevinbadi/blender-skills, CloudAI-X/threejs-skills).
7. Add-ons de IA dentro do Blender precisam de GPU ou chave paga, ou estão abandonados.
8. Recomendação: skill nossa, de scripts `bpy` headless parametrizados; MCP como opção documentada para o computador do Daniel.

### MCPs de Blender (nota 0–10 para o nosso caso)
| Nome | Licença | Popularidade / data | Nota |
|---|---|---|---|
| MCP for Blender (ahujasid/mcp-for-blender) | MIT | 30.454★, 2.758 forks, PyPI 2.1.9; 06/10/2026 | 7 no PC do Daniel / 4 aqui |
| blenderwright (HoldMyBeer-gg) | MIT | 168★, PyPI 2.2.1; 08/10/2026 | 6 |
| Blender Lab MCP (oficial) | GPL-3.0 (SPDX "Blender Authors") | add-on 1.0.3; 2026 | 4 |
| bpy-dev/blender-mcp | GPL-3.0 | 98★; 12/09/2026 | 5 |
| blender-open-mcp | MIT | 120★; 04/09/2026 | 2 |
| GenesisCore / blender-mcp-vxai | — | 141★ / 300★; parados desde 2025 | 1 |

- **mcp-for-blender:** ferramentas `execute_blender_code`, `get_scene_info`, "look" (viewport, câmera, vistas, tira de animação, wireframe), `search_assets`/`import_asset` (Poly Haven, Sketchfab, Poly Pizza), `generate_3d` (Tripo, Hunyuan3D, Rodin; plano "Premium" dispensa chaves). Socket TCP na porta 9876 sem autenticação + servidor MCP via `uvx`. `addon.py:1266` recusa `-b` e sugere `xvfb-run -a blender`. Captura por `GPUOffScreen.draw_view3d` (fallback `screenshot_area`). Telemetria anônima mínima por padrão (ID, ferramenta, sucesso, tempo, SO); prompts/código/capturas só com opt-in; os dados "podem ser usados para treinar modelos de IA"; `DISABLE_TELEMETRY=true` desliga. `BLENDER_MCP_SAFE_MODE=1` bloqueia arquivos, subprocessos e rede. Poly Pizza bloqueia IPs de nuvem.
- **blenderwright:** 191 ferramentas em 28 módulos, 12 "prompts de especialista", análise de malha, zero telemetria, Python livre desligado por padrão, Blender 4.2+, add-on por zip dos Releases. README: "Headless Blender may not support viewport screenshots" (a captura usa `bpy.ops.render.opengl`, que funcionou sob Xvfb). Exemplo do README (foguete, 60 quadros Cycles) feito com o Claude Code.
- **Blender Lab MCP:** Blender 5.1+, `mcp-1.0.3.zip`, servidor `.mcpb`; documentado para llama.cpp; voltado a consultar cenas e a API. Aviso: "will execute LLM generated code in Blender without any guards" (pede VM).
- **bpy-dev/blender-mcp:** Lab MCP modificado com ferramentas `_for_cli` que abrem um `.blend` num subprocesso headless (executável ou `bpy` 5.2.1 standalone de terceiros); "developer preview", sem pacote, 1 mês de vida. Única abordagem MCP que conversa com headless.

### Skills de Blender e 3D
| Skill | Licença | Popularidade / data | Nota |
|---|---|---|---|
| RobLe3/cc-blender-skill (30 skills) | MIT | 88★; modeling 1,5 mil instalações, materials 1,1 mil, rendering 929, animation 897, lighting 866; 01/05/2026 | 7 |
| kevinbadi/blender-skills (turntable, slow-zoom, dolly-rotate, crane-shot, dynamic-full-loop, perfect-loop, product-polish, polyhaven-studio, image-to-3d/Meshy, threejs-export) | **sem licença** | 148★; 04/04/2026 | 7 como ideia / 0 para copiar |
| freshtechbro/claudedesignskills: blender-web-pipeline | MIT | 1.026★; 3,1 mil; 20/11/2025 | 5 |
| vladmdgolam/agent-skills: blender-mcp | MIT | 9★; 2,1 mil; 14/09/2026 | 4 |
| sunxiayi/make-blender-education-video-skill | MIT | 49★; 25/07/2026 | 5 |
| viettranx/3dviz-pro-max | MIT | 719★; 11/09/2026 | 4 |
| affaan-m/ECC: blender-motion-state-inspection | MIT | 276,8 mil★ (repo); 5,9 mil; 11/10/2026 | 2 |
| SFKislev/Flue | MIT | 95★; 2,8 mil; 01/09/2026 | 2 |
| scenario-labs/skills | MIT | 964★; 170–217; 10/10/2026 | 2 |
| arjun988/blender-skills (94 skills, jogos) | MIT | 285★; 261; 10/07/2026 | 2 |
| outras (blender-agent-studio, jithinolickal, game-skills, claymation, LobzyJay) | — | 11–139★; ≤110 | 1–2 |
| CloudAI-X/threejs-skills | **sem licença** | 3.525★; 10–17 mil cada; 09/07/2026 | 3 |

- **cc-blender-skill:** receitas `bpy` por domínio (Bezier, giro, `BACK`/`ELASTIC`, drivers, NLA, loop cíclico; perfis Cycles/Eevee, nomes de motor por versão, color management, sequência PNG resistente a falhas); tabela do que funciona; "gates" de qualidade (folha de contato). Feita para o MCP, mas o código é `bpy` puro.
- **kevinbadi:** vocabulário de planos (turntable, push-in, dolly + giro, crane, speed-ramp, loop perfeito); câmera `TRACK_TO` num Empty; ProRes 4444 com alfa; Cycles em GPU com 64 amostras. Só a ideia pode ser usada.
- **make-blender-education-video:** "exatamente 1 quadro de aprovação em alta antes do render completo".

### Add-ons de IA dentro do Blender
Dream Textures (GPL-3.0, 8.214★, GPU) 1; StableGen (GPL-3.0, 942★, GPU + ComfyUI) 1; BlenderGPT (MIT, 4.985★, abandonado desde 06/2024) 0; mixamo-llm-mocap (357★, personagens) 1. Geração 3D por IA (Tripo, Hunyuan3D, Rodin, Meshy, Higgsfield `generate_3d`) gera GLB; licenças ficaram para o agente B. O celular procedural sai em ~40 linhas.

### Instalação (só depois da aprovação)
- `claude mcp add blender -e DISABLE_TELEMETRY=true -e BLENDER_MCP_SAFE_MODE=1 -- uvx mcp-for-blender`; `uvx mcp-for-blender install-addon`; ativar o add-on; painel N > Start MCP Server (porta 9876). Não usar `curl … | sh`. Uma instância só.
- blenderwright: `claude mcp add blenderwright -- uvx blenderwright`; add-on pelo zip; "Allow raw Python" no painel N.
- Container: `xvfb-run -a -s "-screen 0 1920x1080x24" <blender> --factory-startup`.
- Skills para ver antes: `npx -y skills@1.7.2 add RobLe3/cc-blender-skill --list` e `freshtechbro/claudedesignskills --list`.
- Blender no container: tarball 5.2.2 em `scratchpad/3d/blender-dl/` (fora do PATH). Alternativa não testada: wheel oficial `pip install bpy` 5.2.2 (só Python 3.13, 401 MB; o container tem 3.13.16).

### Limitações (do agente)
MCPs precisam de interface (no container, só com Xvfb + llvmpipe, ~0,7 s por redesenho); `screen.screenshot` preto, render OpenGL/offscreen ok (1,07 s a 540×960); sockets sem autenticação; telemetria por padrão; export GLTF pelo MCP dá timeout; skills do catálogo supõem GPU; Eevee sem GPU não é mais barato (40,7 s a 540×960/16 amostras sob Xvfb, com disputa; ~85 s em resolução cheia na rodada anterior; aborta em `-b` por falta de `libEGL`); celular genérico.

### Teste no container
- **`promo_min.py`** (celular procedural com bevel de 8 segmentos, corpo metálico escuro com clearcoat, tela emissiva em degradê com cantos arredondados, Empty "rig" girando de −55° a +30° e flutuando, logo 3D "Rotina" com easing `BACK`, 4 luzes de área com `TRACK_TO`, plano de brilho radial, câmera 50 mm, 1080×1920, 30 fps, view Standard; Cycles CPU adaptativo + OIDN, bounces reduzidos, `persistent_data`).

| Teste | Resultado |
|---|---|
| 1 quadro, 16 amostras, 1080×1920 (ocioso) | render 30,6 s; processo 41,7 s (~11 s de carga a frio) |
| 2 quadros, 4 amostras | 20,8 s → 13,5 s |
| 2 quadros, 8 amostras | 21,6 s → 17,3 s |
| Prévia 25%, 8 amostras | 1,4 s por quadro |
| 60 quadros, 8 amostras, 1080×1920 | 1.001 s (16 min 41 s), média 16,7 s; quadros 12–60 mediana 14,4 s, média 14,6, mínimo 13,7; quadros 1–11 de 15 a 44 s (outro Blender rodando) |

- Estimativa livre: ~14,5 s por quadro (~15 min para 2 s, ~22 min para 3 s; 24 fps corta 20%; 4 amostras ~13,5 s). Qualidade (folha `teste/anim_contato.jpg`): sem ruído a 8 amostras + OIDN; giro e logo corretos; reflexo de recorte nas bordas; **"funcional, ainda não premium"** (brilho de fundo encheu o quadro, corpo fino, tela lisa). Comparação: R3F ~0,7 s; Cycles 64 amostras da rodada anterior 45,8 s; Blender ~20× mais lento que o R3F.
- **MCP sob Xvfb:** Blender com interface em 18,8 s a frio e 3,7 s a quente (`bpy.app.background = False`; aviso Wayland inofensivo); servidor TCP + `bpy.app.timers` recebeu código: objeto criado em 1,4 s ida e volta; Eevee 540×960/16 amostras em 40,7 s; render OpenGL da viewport em 1,07 s; `screen.screenshot` preto mesmo após `redraw_timer`. O add-on dos MCPs não foi instalado nem executado (6 mil linhas não auditadas).

### Recomendação do agente A
Skill nossa (nome provisório `blender-promo-3d`): scripts `bpy` parametrizados; biblioteca de planos escrita do zero (turntable, hero reveal, whip-spin com speed-ramp, dolly + giro, crane, logo reveal, loop perfeito) sobre um rig único; celular procedural com tela recebendo a sequência do Remotion; estúdio de luz; perfis de render; logo por texto ou SVG (`import_curve.svg`); fluxo animatic 25% → 1 quadro de aprovação → final 8 amostras em segundo plano → PNG/alfa no Remotion; limite de 1–2 planos-herói. MCP como apêndice. Não trazer kevinbadi, threejs-skills, add-ons de textura, BlenderGPT, Flue, ECC, scenario, arjun988; reavaliar bpy-dev/blender-mcp depois do preview.

---

## Pesquisa B: técnicas, fluxos, licenças e receitas (web + testes)

### Resumo em 10 linhas (do agente)
1. Caminho que funciona no container: `bpy` → `blender -b -P` → PNG RGBA → camada no Remotion. Testado de ponta a ponta no 5.2.2 (alpha, sombra separada, JSON de posição).
2. Dois MCPs: o oficial do Blender Lab (v1.0.3 set/2026, Blender 5.1+, não gera 3D, conector do Claude desde 28/04/2026) e o comunitário "MCP for Blender" (MIT, ~30 mil★, `generate_3d`, assets). Os dois precisam de interface.
3. Relatos: MCP bom para analisar cenas, edições em lote e scripts; fraco em criação livre. Teste da MindStudio (01/05/2026): 2 h e 60% dos tokens num donut cheio de erros.
4. API 5.0: `action.fcurves`, `scene.node_tree` e `BLENDER_EEVEE_NEXT` não existem mais; `image_settings.media_type` antes de `file_format`.
5. Handles Bezier recebem o mesmo `cubic-bezier` do `Easing.bezier` do Remotion (helper `anima()`).
6. Luz em escala real com view Standard: key 0,5 m/6 W, rims 4×90 cm/6 W, topo 1 m/3 W, fill 1,5 W, HDRI Poly Haven 0,25.
7. Tempos: rascunho 25%/8 amostras ≈ 2,5 s por quadro (ocioso); final 16 amostras ≈ 20 s por quadro (round 2); plano de 3–5 s em 30–50 min; motion blur + DOF +4% de CPU (com disputa).
8. Remotion: sequência PNG com `<Img src={staticFile(...)}>` ou ProRes 4444 / WebM VP9 com alpha (testados); sombra em camada própria; JSON da caixa 2D para ancorar textos.
9. Licenças: livres (Blender, Poly Haven CC0, TRELLIS.2 MIT, MCP for Blender MIT); com condições (Hunyuan3D 2.1, Meshy grátis CC BY 4.0, Stable Fast 3D < US$ 1 mi, SAM 3D); Tripo e Rodin grátis contraditórios (usar pago); evitar Sketchfab Editorial, CC BY-NC e qualquer iPhone/Apple.
10. Recomendação: `skills/video/blender-ia/` com SKILL.md curto, scripts, `CamadaBlender.tsx` e referências.

### Fontes (26)
1. ahujasid/blender-mcp: renomeado "MCP for Blender" em 16/09/2026 (PyPI `mcp-for-blender`); ferramentas `execute_blender_code`, `look`, `get_scene_info`, `generate_3d`, `search_assets`/`import_asset`; `claude mcp add blender uvx mcp-for-blender`; telemetria por padrão; socket sem autenticação; Poly Pizza ~69% CC-BY.
2. blender.org/lab/mcp-server: Blender 5.1+; executa código "without any guards"; recomenda VM (repositório deu 403 para o agente).
3. StraySpark (FONTE 3ª, vende MCP concorrente): oficial GPL-3.0-or-later, v1.0.0 em 27/04/2026, v1.0.3 em 11/09/2026, 26 ferramentas (6 `_for_cli`), sem geração 3D; comunitário 36 ferramentas, Blender 3.0+; os dois na porta 9876.
4. Anthropic "Claude for Creative Work" (28/04/2026): conector Blender como "natural-language interface to its Python API"; Anthropic Corporate Patron do Blender Development Fund (RedShark).
5. MindStudio (01/05/2026): conector oficial, plano Max 5x, 2 h, 60% dos tokens; objetos atravessando, escala e câmera ruins, tom magenta; melhor para nós de geometria e lote; salvar .blend e abrir sessão nova.
6. The Rundown (18/05/2026): instalar a extensão, servidor em localhost:9876, conectar o Claude Code; "Claude can make basic geometry, but results are better with downloaded assets."
7. Picsart: grey-box no Blender → modelo de vídeo fotorrealiza; não reproduz a UI.
8. Notas da API 5.0 (developer.blender.org): Action legada removida (channelbag por slot); `BLENDER_EEVEE_NEXT` → `BLENDER_EEVEE`; `scene.node_tree` → `scene.compositing_node_group`; `media_type` antes de `file_format`; passes renomeados.
9. Licença do Blender: "What you create with Blender is your sole property"; scripts publicados com a API têm de ser compatíveis com a GPL.
10. Hunyuan3D 2.1: não vale na UE, Reino Unido, Coreia do Sul; > 1 mi usuários ativos/mês pede licença; "Tencent claims no rights in Outputs"; proibido treinar outra IA com os resultados; 3.0 sem pesos abertos confirmados.
11. TRELLIS.2-4B: MIT; imagem → 3D com PBR; Linux + NVIDIA ≥ 24 GB; pode deixar furos.
12. Meshy: grátis CC BY 4.0 com crédito; Pro+ comercial sem crédito.
13. Tripo: grátis CC BY 4.0 público; pago privado e comercial; fontes contraditórias (blog 403).
14. Hyper3D Rodin: Creator US$ 30/mês "Unlimited export and any use"; grátis não diz; FONTE 3ª fala em marca d'água.
15. Stability AI Community License: Stable Fast 3D / SPAR3D comerciais com receita < US$ 1 mi.
16. Licença SAM (19/11/2025): SAM 3D Objects comercial com restrições (militar, armas); repassar a licença.
17. UniRig: código MIT, checkpoints com termos próprios; GPU ≥ 8 GB; pouco útil para promo.
18. StableGen: GPL-3, SDXL/FLUX.1-dev via ComfyUI, GPU NVIDIA.
19. Skybox AI: grátis CC BY + marca d'água (2023); pago comercial; "HDR" não é 32 bits.
20. Sketchfab: Standard qualquer uso; Editorial proibido em comercial/promocional; CC BY-NC proibido em anúncio.
21. Poly Haven: CC0.
22. Remotion: alpha em WebM VP8/VP9 (`yuva420p`) e ProRes 4444; `<Video>` de `@remotion/media` sem prop, `<OffthreadVideo transparent>`; sequência com `staticFile` em `<Img>`.
23. Fóruns de denoise: seed estática faz "manchas paradas", seed animada cintila; denoise temporal só OptiX (NVIDIA).
24. Versluis: Eevee sem shadow catcher nativo; Cycles tem `is_shadow_catcher`.
25. Skills para agentes (CLI-Anything Blender, tmhsdigital/blender-developer-tools, major-ai-skills/blender): só pistas.
26. Tutoriais: BlenderNation (fones, set/2025), vídeo Blender MCP de 26 min (mar/2025); curso pago Mammoth Club; nenhum tutorial de 2026 de "anúncio de celular com Claude + bpy".

### Fluxos de criadores
A. Agente com scripts headless (o nosso caso; medido no 5.2.2). B. MCP com o Blender aberto (oficial = assistente técnico; comunitário = montar cena e look-dev; lições: assets reais, mudanças pontuais, salvar .blend e abrir sessão nova, dizer a versão; híbrido: aprovar no MCP e renderizar em lote). C. Geração 3D por IA para objetos de cena; celular-herói procedural; `mcp__higsfield__generate_3d` existe aqui, não testado. D. Texturas/HDRI por IA: preferir HDRI CC0 + softboxes. E. Rig automático: personagens; promo não precisa. F. Grey-box → vídeo IA: só ambiência.

### Números de referência (do agente)
fps 30 (padrão Blender 24); easing chegada `(0.16, 1, 0.3, 1)`, dolly `(0.65, 0, 0.35, 1)`, Easy Ease `(0.33, 0, 0.67, 1)`; `interpolation='EXPO'` + `easing='EASE_OUT'` (e SINE, QUAD, CUBIC, QUART, QUINT, CIRC, BACK, BOUNCE, ELASTIC); revelação 40–60° em 1,5–2 s com expo out, dolly 0,80 → 0,55 m em 3 s; turntable 360° em 6–8 s, LINEAR + extrapolação LINEAR, chave final em f1+1; motion blur shutter 0,5; DOF 85 mm f/2.8 com foco num empty, escala real (0,0716 × 0,1466 × 0,0083 m); 16 amostras + OIDN ≈ 64; `adaptive_threshold=0.02`; `max_bounces=6`; luz (key 0,5 m 6 W a ~0,8 m; fill 0,8 m 1,5 W; rims 0,04×0,9 m 6 W; topo 1 m 3 W; HDRI 0,25; com 40/8/30/15 W e HDRI 0,6 estourou); view Standard (AgX dessatura; há Khronos PBR Neutral, ACES 2.0, Filmic); materiais (aro metallic 1 roughness 0,28; vidro preto roughness 0,35 coat 1 coat roughness 0,04 sem Transmission; tela base preta roughness 0,05 Specular IOR Level 0,3 emissão 1,0); rascunho 270×480/8 amostras ≈ 2,5 s (1 quadro = 3,2 s de processo, 6,1 s de CPU); partida a frio 12 s, depois ~1 s; final 20/27/46 s a 16/32/64 amostras (round 2); MB + DOF 540×960/16 amostras/2 quadros: 134,3 → 139,7 s de CPU (+4%, com disputa); plano-herói 30–50 min; com GPU, segundos por quadro (inferência).

### Receitas (código próprio em `work-B/receita_produto.py`, testado no 5.2.2)
5.1 render transparente; 5.2 `fcurves()` 4.x/5.x + `anima()` com cubic-bezier (medido: `hasattr(action,'fcurves')` é False no 5.2.2); 5.3 turntable em loop e revelação, câmera `TRACK_TO` no empty `Foco` = `dof.focus_object`; 5.4 celular com cantos arredondados por bmesh em escala real, materiais por índice (|normal.z| > 0,9 = vidro); 5.5 tela com imagem (orientação certa, testado) ou sequência (não testado pelo B); 5.6 luz de estúdio; 5.7 sombra em camada (shadow catcher + `visible_camera = False`, `out/check_sombra.png`); 5.8 caixa 2D por quadro em JSON (pixels de 1080×1920, não muda com `--pct`); 5.9 rascunho + folha de quadros sobre cor (testado com `tile=3x1`). Armadilhas Eevee: aborta em `-b`, xvfb não compensa, sem shadow catcher.

### Integração com o Remotion (do agente)
Opção 1: sequência PNG com `CamadaBlender` (preferida). Opção 2: ProRes 4444 (`yuva444p12le`, medido) ou WebM VP9 (`alpha_mode=1`, medido; 19 KB contra 237 KB em 3 quadros de 270×480). Ordem: fundo → sombra → textos → celular. Regras do editor no 3D: texto só no Remotion; quadro inteiro com alpha, nunca recortar; celular por cima; texto de trás do celular com a caixa do JSON e o componente `Atras`. Sincronia: 30 fps, quadro 0 do Remotion = 0001 do Blender, duração definida no Remotion primeiro. Disco: 1–3 MB por PNG 1080×1920 (inferência), fora do Git.

### Licenças (tabela do agente)
Blender sim; MCP for Blender sim (telemetria); Blender Lab MCP sim (GPL-3.0+, VM); Poly Haven sim (CC0); Poly Pizza em parte (~69% CC-BY); Sketchfab depende (CC0/CC BY/Standard sim; NC e Editorial não); TRELLIS.2 sim (GPU ≥ 24 GB); Hunyuan3D 2.1 sim no Brasil (condições); Meshy sim (crédito no grátis); Tripo plano pago; Rodin Creator+; Stable Fast 3D/SPAR3D < US$ 1 mi; SAM 3D com restrições; Skybox AI só pago; aparência de iPhone evitar. "Não é parecer jurídico."

### Lacunas (do agente)
Não testados: sequência como textura de tela; flicker do OIDN em sequência longa; ProRes 4444 no `<OffthreadVideo transparent>`; MCP oficial ao vivo. Só o rascunho 270×480 foi medido ocioso. Licença do repositório oficial (403), termo grátis do Tripo, Mixamo e AccuRIG não confirmados. Nenhum vídeo de 2026 de "anúncio de celular com Claude + bpy".

### Recomendação de estrutura (do agente)
`skills/video/blender-ia/` com SKILL.md (≤ ~250 linhas), LEIA-ME.txt, APRENDIZADOS.md, `scripts/` (produto.py, render_blend.py, folha.sh, png_para_video.sh, instalar_blender.sh), `remotion/CamadaBlender.tsx`, `references/` (api-5x, luz-materiais, mcp, licencas, ia-3d).

---

## Onde as duas pesquisas concordam e divergem **[transcrição]**

- **Concordam:** headless `bpy` é o caminho no container; MCP só com interface (computador do Daniel); Cycles CPU, nunca Eevee aqui; celular procedural genérico; 1–2 planos-herói; PNG RGBA como camada no Remotion; ahujasid MIT com telemetria por padrão.
- **Pequenas diferenças:** rascunho a 25%/8 amostras = 1,4 s (A) contra 2,5 s (B), cenas diferentes; licença do MCP oficial = GPL-3.0 pelos cabeçalhos SPDX (A leu o código) e GPL-3.0-or-later por fonte terceira (B não acessou o repositório); nome do repositório comunitário `ahujasid/mcp-for-blender` (A) / `ahujasid/blender-mcp` renomeado (B): é o mesmo projeto.
- **O que eu (transcrição) testei e corrigi a mais:** tela com sequência de imagens (funciona); o logo do teste A crescia do zero no meio da tela (quebra a regra 4) e o `BACK` estava na chave errada (vale para o trecho depois da chave): corrigido no `nova/scripts/logo_e_celular.py`; scripts `folha.sh`, `png_para_video.sh`, `instalar_blender.sh` testados; `CamadaBlender.tsx` passa no `tsc --strict`. A página de licença do Blender foi conferida: scripts `bpy` publicados precisam de licença compatível com a GPL, por isso os `.py` da skill são GPL-3.0-or-later.
- **Fiz mais curto do que o B sugeriu:** sem `references/` e sem `render_blend.py` (o conteúdo cabe no SKILL.md; o render de um `.blend` é uma linha: `blender -b cena.blend -P render.py`). Pode virar adendo depois.
