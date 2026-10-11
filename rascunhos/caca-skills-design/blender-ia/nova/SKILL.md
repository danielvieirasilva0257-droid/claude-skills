---
name: blender-ia
description: "Faz animação 3D com o Blender escrita pelo Claude em Python (bpy), sem interface: celular 3D realista, produto girando (turntable), revelação de produto, logo 3D, luz de estúdio, render com fundo transparente para virar camada no Remotion. Também explica o Blender MCP no computador do usuário. Use quando o pedido falar em Blender, bpy, render 3D realista, plano-herói, celular ou produto 3D \"de verdade\", turntable, logo 3D, MCP do Blender, ou quando o 3D do Remotion/three.js não tiver qualidade suficiente."
---

# Animação 3D com IA no Blender

O Claude escreve um script `bpy` (a API Python do Blender) e roda `blender -b -P script.py`. O script é a fonte da verdade: entra no Git, roda de novo igual e funciona no container e no computador do Daniel.
A pesquisa e os testes por trás desta skill (11/10/2026) estão em `APRENDIZADOS.md` e `ORIGEM.md`. Os números de 3D do Remotion estão em `skills/video/remotion-video/SKILL.md`, seção "3D de verdade".

## Quando usar o Blender (e quando não)

| Situação | Ferramenta |
|---|---|
| Celular 3D como fio condutor do vídeo, muitos segundos, UI legível | `@remotion/three` (R3F) na skill `remotion-video`: ~0,7 s por quadro |
| Movimento 2D/2,5D, cartões, textos, legendas | Remotion puro (ou CSS 3D) |
| **1–2 planos-herói** de produto com reflexo e luz realistas (3–5 s cada) | **Blender, Cycles na CPU** (esta skill): ~15–30 s por quadro aqui |
| Montar a cena olhando ao vivo, no computador com placa de vídeo | Blender com MCP (seção "No computador do Daniel") |
| Ambiência fotorrealista sem UI exata | vídeo por IA (Higgsfield, Kling etc.); não reproduz a tela do app |

Regra prática: **o Blender é ~20 vezes mais lento que o R3F neste container.** Só vale onde o realismo aparece (reflexo varrendo o vidro e o metal).

## Regras de ouro

1. **Script `bpy` parametrizado, rodado sem interface:** `blender -b --factory-startup -P cena.py -- <parâmetros>`. Nada de cliques.
2. **Diga a versão.** Esta skill foi testada no **Blender 5.2.2 LTS**. A API mudou no 5.0 e muito código de IA (treinado em 3.x/4.x) quebra (veja "Armadilhas da API 5.x").
3. **Cycles na CPU no container.** O Eevee não roda com `-b` aqui (falta `libEGL`) e, com `xvfb-run`, não sai mais barato.
4. **30 fps** (`scene.render.fps = 30`; o padrão do Blender é 24) e 1080×1920, iguais à composição do Remotion.
5. **View transform `Standard`** quando a tela do app aparece: as cores da UI saem exatas. O AgX (padrão) desbota.
6. **Fundo transparente** (`film_transparent`) e **PNG RGBA**: o fundo, os textos e a sombra vêm do Remotion.
7. **Celular genérico procedural**, sem logo e sem o layout de câmera do iPhone (as regras da Apple desencorajam render de produto Apple em anúncio).
8. **Escala real em metros** (celular 0,0716 × 0,1466 × 0,0083 m). Sem isso, o f-stop do desfoque não corresponde.
9. **Nada de texto no Blender.** Toda tipografia fica no Remotion. Exceção: o logo 3D, que segue as regras do editor.
10. **Fluxo de custo:** rascunho a 25% → folha de quadros → **1 quadro de aprovação** em 1080×1920 → render final em segundo plano.
11. **As regras de composição do editor são obrigatórias** (seção própria, abaixo).

## No container (sem interface, sem placa de vídeo)

```bash
# 1. instalar (383 MB; ~9 s de download + ~24 s para extrair; confere o SHA-256)
bash skills/video/blender-ia/scripts/instalar_blender.sh "$SCRATCHPAD/blender"   # última linha = caminho do executável
BL=$SCRATCHPAD/blender/blender-5.2.2-linux-x64/blender

# 2. rascunho: 25%, 8 amostras, quadros soltos (~1,5–2,5 s por quadro)
$BL -b --factory-startup -P skills/video/blender-ia/scripts/produto.py -- \
  --out /abs/rascunho/phone_ --pct 25 --spp 8 --frames 1-90 --so 1,7,13,19,25,31

# 3. final: 100%, 8–16 amostras, em segundo plano (Bash com run_in_background)
$BL -b --factory-startup -P skills/video/blender-ia/scripts/produto.py -- \
  --out /abs/public/blender/plano1/phone_ --pct 100 --spp 16 --frames 1-90 --screen /abs/ui/tela_0001.png --tela_seq 90
```

- O Blender **não fica no PATH** e não vai para o repositório: instale no scratchpad.
- O aviso `CUEW initialization failed` é normal (não há placa NVIDIA).
- A primeira execução leva ~11–12 s a mais (cache frio do Cycles); as seguintes, ~1 s.
- No modo `-b` não há barra de progresso: imprima o tempo por quadro com `bpy.app.handlers.render_pre/render_post` (o `logo_e_celular.py` já faz isso).
- `use_persistent_data = True` reaproveita a cena entre quadros (o 1º quadro custa ~20 s a mais).
- Render longo: rode em segundo plano e confira o log; nunca bloqueie a conversa.

## No computador do Daniel (com placa de vídeo e MCP)

O MCP liga o Claude a um Blender **aberto, com interface**. Serve para montar a cena olhando ao vivo. **Não roda com `blender -b`** (o código do MCP recusa).

| MCP | Licença | Observação |
|---|---|---|
| **MCP for Blender** (`ahujasid/mcp-for-blender`, antigo blender-mcp) | MIT | ~30 mil estrelas, v2.1.9 (out/2026). Roda Python livre, "olha" a viewport, busca assets (Poly Haven, Sketchfab, Poly Pizza) e gera 3D por IA (Tripo, Hunyuan3D, Rodin). **Telemetria ligada por padrão.** |
| **blenderwright** (`HoldMyBeer-gg/blenderwright`) | MIT | 191 ferramentas, **zero telemetria**, Python livre desligado até você ligar. |
| **Blender Lab MCP** (oficial do Blender, conector do Claude desde 28/04/2026) | GPL-3.0 | Blender 5.1+. Bom para analisar e depurar um `.blend`; não gera 3D. A página pede rodar numa VM. |

Instalação (só depois da aprovação do Daniel, pela receita de instalação do `guia/LEIA-ANTES-DE-USAR.md`):

```bash
claude mcp add blender -e DISABLE_TELEMETRY=true -e BLENDER_MCP_SAFE_MODE=1 -- uvx mcp-for-blender
uvx mcp-for-blender install-addon   # Blender > Preferences > Add-ons > ativar "MCP for Blender"
# no Blender: painel N > "MCP for Blender" > Start MCP Server (porta 9876)
```

- **Segurança:** o socket da porta 9876 não tem senha e o Claude roda qualquer Python. Use `BLENDER_MCP_SAFE_MODE=1` (bloqueia arquivos, rede e subprocessos). Não use o instalador `curl … | sh`. Os MCPs usam a mesma porta: um de cada vez.
- **Como usar bem** (relatos de quem testou): dê assets prontos em vez de pedir modelagem do zero; peça mudanças pontuais; salve o `.blend` a cada etapa e abra conversa nova (contexto longo degrada: um teste gastou 2 h num donut com erros).
- **Fluxo híbrido:** monte e aprove a cena no MCP, salve o `.blend` e renderize em lote: `blender -b cena.blend -P render.py`.
- No container, o MCP até roda com `xvfb-run -a blender` (testado: o Blender com interface sobe em ~19 s a frio), mas não traz vantagem sobre o script.

## Scripts prontos (`scripts/`, testados no 5.2.2)

| Arquivo | O que faz |
|---|---|
| `produto.py` | **Receita principal.** Celular genérico em escala real, materiais, luz de estúdio, câmera 85 mm, revelação ou turntable, PNG RGBA, tela com imagem ou **sequência do Remotion** (`--tela_seq`), sombra em camada (`--sombra`, `--so_sombra`), motion blur (`--mb`), desfoque (`--dof`), HDRI (`--hdri`), e `<prefixo>caixas.json` com a caixa 2D do celular por quadro. |
| `logo_e_celular.py` | Celular + logo 3D que **entra pela borda de baixo** com overshoot, 4 luzes de área e fundo com brilho (o fundo é um objeto: para camada transparente, prefira o `produto.py`). |
| `folha.sh` | Folha de quadros sobre cor sólida (1 a cada 6), para revisar as regras do editor e o alpha. |
| `png_para_video.sh` | PNG RGBA → ProRes 4444 (`.mov`) e WebM VP9 com alpha (`.webm`). |
| `instalar_blender.sh` | Baixa o 5.2.2 oficial, confere o SHA-256 e extrai. |
| `../assets/CamadaBlender.tsx` | Componente do Remotion que mostra a sequência PNG como camada, mais `caixaNoQuadro()`. |

Os scripts `.py` são GPL-3.0-or-later (scripts publicados que usam a API do Blender precisam de licença compatível com a GPL). O texto está em `scripts/LICENSE`.

## Receitas `bpy` (trechos de `produto.py`)

**Render transparente para o Remotion:**
```python
r = sc.render; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = 16; sc.cycles.adaptive_threshold = 0.02
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
r.use_persistent_data = True; r.fps = 30; r.resolution_x, r.resolution_y = 1080, 1920
r.film_transparent = True
im = r.image_settings
im.media_type = 'IMAGE'                    # 5.x: antes de file_format
im.file_format = 'PNG'; im.color_mode = 'RGBA'; im.color_depth = '8'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
r.filepath = '/abs/public/blender/plano1/phone_'   # vira phone_0001.png ...
```

**Câmera suave com a mesma curva do Remotion** (`Easing.bezier(x1, y1, x2, y2)` vira os handles da f-curve):
```python
def fcurves(idb):
    ad = idb.animation_data; act = ad.action
    if hasattr(act, 'fcurves'): return act.fcurves          # Blender <= 4.x
    from bpy_extras import anim_utils                       # 5.x: camadas e slots
    return anim_utils.action_get_channelbag_for_slot(act, ad.action_slot).fcurves

def anima(obj, path, idx, pts, bez=(0.16, 1, 0.3, 1)):    # pts = [(quadro, valor), ...]
    for f, v in pts:
        getattr(obj, path)[idx] = v; obj.keyframe_insert(path, index=idx, frame=f)
    fc = next(c for c in fcurves(obj) if c.data_path == path and c.array_index == idx)
    x1, y1, x2, y2 = bez
    for p, q in zip(fc.keyframe_points[:-1], fc.keyframe_points[1:]):
        p.interpolation = 'BEZIER'; dt, dv = q.co.x - p.co.x, q.co.y - p.co.y
        p.handle_right_type = q.handle_left_type = 'FREE'
        p.handle_right = (p.co.x + x1 * dt, p.co.y + y1 * dv)
        q.handle_left = (p.co.x + x2 * dt, p.co.y + y2 * dv)
    fc.update(); return fc
```
- Curvas: chegada premium `(0.16, 1, 0.3, 1)`; dolly suave `(0.65, 0, 0.35, 1)`; Easy Ease do After Effects `(0.33, 0, 0.67, 1)`.
- Atalhos prontos: `kp.interpolation = 'EXPO' | 'BACK' | 'ELASTIC' ...` com `kp.easing = 'EASE_OUT'`.
- **Cuidado:** a interpolação de uma chave vale para o trecho **depois** dela. O overshoot de chegada vai na chave de partida.
- A câmera usa `TRACK_TO` mirando um empty `Foco`, que também é o `dof.focus_object`.

**Revelação e turntable** (gire o produto, deixe as luzes paradas: o reflexo "varre" o vidro e o metal):
```python
anima(prod, 'rotation_euler', 2, [(1, math.radians(-40)), (55, math.radians(18))])   # revelação: 40–60° em 1,5–2 s
anima(cam, 'location', 1, [(1, -0.80), (90, -0.55)], bez=(0.65, 0, 0.35, 1))          # dolly 0,80 → 0,55 m em 3 s
fc = anima(prod, 'rotation_euler', 2, [(f0, 0), (f1 + 1, 2 * math.pi)])               # turntable 360° em 6–8 s
for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
fc.extrapolation = 'LINEAR'                     # chave final em f1+1 = loop sem soluço
```

**Luz de estúdio** (escala real, view Standard; valores medidos que não estouram):

| Luz | Tamanho | Potência | Posição (m) |
|---|---|---|---|
| Key (softbox) | 0,5 × 0,5 m | 6 W | (−0,45, −0,55, 0,35) |
| Fill | 0,8 × 0,8 m | 1,5 W | (0,6, −0,4, 0,05) |
| Rim E / Rim D (faixas finas = linhas de brilho no aro) | 0,04 × 0,9 m | 6 W cada | (∓0,35, 0,35, 0,10) |
| Topo | 1 × 1 m | 3 W | (0, 0, 0,7) |
| HDRI de estúdio Poly Haven (CC0), só para reflexos | — | força 0,25 | — |

Todas as luzes são `AREA` retangulares com `TRACK_TO` num alvo. Com 40/8/30/15 W e HDRI 0,6, a imagem estourou.

**Materiais do celular:**
- Aro: metallic 1, roughness 0,28, cinza 0,55.
- Vidro traseiro: preto, roughness 0,35, coat 1, coat roughness 0,04. **Sem Transmission** (opaco e mais barato).
- Tela: base preta, roughness 0,05, Specular IOR Level 0,3, emissão 1,0 com a imagem da UI (o reflexo do estúdio passa por cima).
- Frente e verso recebem o vidro, as laterais o metal: `p.material_index = 1 if abs(p.normal.z) > 0.9 else 0`.

**Tela com a UI do app** (imagem ou sequência renderizada pelo Remotion):
```python
tx.image = bpy.data.images.load('/abs/ui/tela_0001.png')
nt.links.new(tc.outputs['Generated'], tx.inputs['Vector'])        # 0..1 na caixa, sem UV
nt.links.new(tx.outputs['Color'], bsdf.inputs['Emission Color'])
tx.image.source = 'SEQUENCE'                                       # UI quadro a quadro
tx.image_user.frame_duration, tx.image_user.frame_start = 90, 1
tx.image_user.use_auto_refresh = True
```
Testado: a sequência troca a cada quadro, na orientação certa e sem espelhar.

**Sombra em camada própria** (fica abaixo dos textos): um plano com `is_shadow_catcher = True` (só no Cycles) e um 2º render com o celular invisível para a câmera (`visible_camera = False`), mas ainda projetando sombra. Flags `--sombra` e `--so_sombra` do `produto.py`.

**Caixa 2D do celular por quadro** (`world_to_camera_view` nos 8 cantos do `bound_box`): sai em `<prefixo>caixas.json`, em pixels de 1080×1920 (não muda com `--pct`). Serve para ancorar no Remotion o texto que sai de trás do celular.

## Armadilhas da API 5.x

- `action.fcurves` não existe mais: use `anim_utils.action_get_channelbag_for_slot(...)` (helper acima).
- `BLENDER_EEVEE_NEXT` voltou a ser `BLENDER_EEVEE`; o Cycles é `CYCLES` (não aparece no enum, mas funciona).
- `scene.node_tree` (compositor) virou `scene.compositing_node_group`.
- `image_settings.media_type = 'IMAGE'` antes de `file_format`.
- `Material.use_nodes` gera aviso de obsoleto (será removido no 6.0); por enquanto funciona.

## Assets 3D e geração por IA (licenças para anúncio)

O **celular-herói é sempre procedural** (malha de IA sai densa, triangulada, às vezes com furos). IA serve para **objetos de cena** (moedas, halteres, ícones 3D): gere o GLB, importe, limpe (decimate, apagar faces soltas) e aplique materiais próprios.

| Fonte | Anúncio? | Condição |
|---|---|---|
| Blender (o que ele gera) | Sim | "What you create with Blender is your sole property" |
| Poly Haven (HDRI, texturas, modelos) | Sim | CC0, sem crédito |
| Sketchfab | Depende | CC0, CC BY (com crédito) e Standard sim; **CC BY-NC e Editorial, não** |
| Poly Pizza | Em parte | ~69% CC BY, com crédito; bloqueia IPs de nuvem |
| TRELLIS.2 (imagem → 3D) | Sim | MIT; precisa de GPU NVIDIA ≥ 24 GB |
| Hunyuan3D 2.1 | Sim no Brasil | não vale em UE/Reino Unido/Coreia; > 1 mi usuários/mês pede licença |
| Meshy | Sim | grátis = CC BY 4.0 com crédito; Pro+ sem crédito |
| Tripo / Rodin | Só plano pago | termos do plano grátis contraditórios ou vagos |
| Stable Fast 3D / SPAR3D | Sim | receita anual < US$ 1 mi |
| SAM 3D Objects | Sim, com restrições | licença SAM |
| Skybox AI (HDRI por IA) | Só pago | e não é HDR de 32 bits: prefira Poly Haven |
| `generate_3d` do Higgsfield (MCP deste ambiente) | A conferir | não testado; leia os termos antes |
| Aparência de iPhone/Apple | **Evitar** | sem logo, sem layout de câmera reconhecível |

Não é parecer jurídico: confira a licença de cada modelo no dia do uso e registre no `APRENDIZADOS.md` do projeto.

## Integração com o Remotion

1. **Áudio e duração primeiro:** defina no Remotion quantos quadros o plano tem e passe `--frames 1-N` ao Blender (30 fps nos dois).
2. **Renderize** em `public/blender/<plano>/` (fora do Git: são centenas de MB; o `public/` é copiado em cada bundle).
3. **Componha** com `assets/CamadaBlender.tsx`: o quadro 0 da `<Sequence>` mostra o `0001.png` do Blender.
4. **Alternativa de arquivo único:** `scripts/png_para_video.sh` gera ProRes 4444 e WebM VP9 com alpha; no Remotion, `<OffthreadVideo transparent>` ou `<Video>` de `@remotion/media`. A sequência PNG é preferida (quadro exato).
5. **Ordem das camadas:** fundo → sombra do Blender → textos e cartões → celular do Blender.
6. **Mudou só o 2D?** Não renderize o 3D de novo. Mudou o movimento? Renderize só os quadros afetados (`--frames a-b`).

## Regras de composição do editor no 3D (obrigatórias)

As 4 regras do Daniel (`skills/video/remotion-video/SKILL.md`, "Regras de composição do editor") valem aqui assim:

1. **Nada de texto sobre texto, nem logo sobre texto:** texto só no Remotion. O logo 3D pousa numa área livre do quadro.
2. **Nenhum recorte no meio da tela:** renderize sempre o quadro inteiro com alpha e nunca recorte o PNG. O motion blur e o desfoque fazem bordas semitransparentes, e o alpha as preserva. Confira no `caixas.json` que o celular só sai do quadro pela borda do vídeo.
3. **O celular fica por cima do texto:** garantido pela ordem das camadas. A sombra separada não escurece o texto.
4. **Todo texto (e o logo) entra de fora do quadro ou de trás do celular:** nada de logo crescendo do zero no meio da tela. O `logo_e_celular.py` faz o logo subir da borda de baixo. Para texto saindo de trás, use a caixa do `caixas.json` no quadro de entrada com o componente `Atras` da `remotion-video`, com a camada do texto abaixo da do celular.

Atenção à zona segura do Reels: a faixa de baixo do 1080×1920 fica coberta pela interface do Instagram; ajuste a altura do logo.

## Tempos medidos (4 CPUs, sem GPU, Blender 5.2.2, 11/10/2026)

| O quê | Tempo |
|---|---|
| Instalar (383 MB) | ~9 s de download + ~24 s para extrair |
| Partida a frio / a quente | ~11–12 s / ~1 s |
| Rascunho 25% (270×480), 2–4 amostras | 0,5–0,6 s por quadro |
| Rascunho 25%, 8 amostras | 1,4–2,5 s por quadro (depende da cena) |
| **Final 1080×1920, Cycles 8 amostras + OIDN** | **~14,5 s por quadro** (60 quadros = 16 min 41 s com outro processo disputando a CPU; ~15 min livre) |
| Final 1080×1920, 4 amostras | ~13,5 s (pouco ganho: o OIDN e a sincronização pesam) |
| Final 1080×1920, 16 amostras | ~20–30 s por quadro; 64 amostras: 45,8 s (cena com HDRI) |
| 16 amostras + OIDN ≈ 64 amostras | visualmente quase iguais |
| Motion blur + desfoque | ~+4% (medido com disputa de CPU: só ordem de grandeza) |
| Plano-herói de 3–5 s (90–150 quadros) | ~22–36 min a 8 amostras; ~30–50 min a 16 (em segundo plano) |
| Eevee | `-b`: aborta (falta `libEGL`); `xvfb-run`: ~85 s de CPU por quadro a 16 amostras (não compensa) |
| Comparação: R3F no Remotion | ~0,7 s por quadro |

No computador com placa de vídeo, espere segundos por quadro (não medido).

## Checklist antes do render final

- [ ] Duração em quadros vinda do Remotion; 30 fps; 1080×1920.
- [ ] Rascunho a 25% e `scripts/folha.sh` (1 a cada 6 quadros, sobre cor sólida).
- [ ] Nas folhas: texto sobre texto, linha de corte no meio, texto na frente do celular, texto/logo surgindo do nada.
- [ ] Cores da UI conferidas (view `Standard`); sombra na camada certa; `caixas.json` coerente.
- [ ] 1 quadro de aprovação em resolução cheia, mostrado ao Daniel.
- [ ] Tempo estimado = quadros × s/quadro; render em segundo plano; quadros fora do Git.
- [ ] Licença de cada asset externo anotada.
- [ ] Aprendizados novos no `APRENDIZADOS.md` desta skill.
