# Pesquisa A: animação com IA no Blender (catálogo de skills e MCPs)

**Agente de pesquisa A, 11/10/2026.** Objetivo: base para uma skill nova que deixe o Claude fazer animação 3D no Blender para vídeos promocionais de apps (celular 3D, produto girando, logos, motion), com visual premium.

**Situação:** busca no catálogo feita, 6 repositórios clonados e lidos, teste real no container feito (Blender 5.2.2, sem GPU). Nada foi instalado no assistente nem no repositório.

---

## Resumo em 8 pontos

1. **Não existe skill pronta para "promo de app em Blender".** O catálogo (skills.sh) tem skills de Blender genéricas (modelagem, jogos, rigs). A mais próxima do nosso caso, `kevinbadi/blender-skills` (turntable, crane, whip-loop, ProRes com alfa), **não tem licença** e só serve de inspiração.
2. **O MCP padrão é o `ahujasid/mcp-for-blender`**, antigo `blender-mcp`: 30,4 mil estrelas, MIT, versão 2.1.9 de 06/10/2026. Ele **recusa rodar com `blender -b`** (está no código) e precisa do Blender aberto com interface.
3. **Testado no container:** o Blender **com interface roda sob `xvfb-run`**. Nesse modo, o mecanismo dos MCPs funciona (servidor TCP numa thread mais `bpy.app.timers`). O render OpenGL do viewport (o "olhar" do MCP) leva ~1 s; o `screen.screenshot` sai preto. Os dois MCPs principais usam render OpenGL/offscreen, então provavelmente funcionam aqui. Não rodei o código deles.
4. **O MCP não traz vantagem neste container.** O Claude já escreve `bpy` e roda `blender -b -P script.py` sem interface, que é mais simples, reprodutível e versionável. O MCP vale para o computador do Daniel, com GPU e Blender aberto.
5. **Renderização medida** (1080×1920, Cycles na CPU com OIDN, cena de celular + logo): **~13–17 s por quadro com 4–8 amostras** quando os dados ficam carregados entre quadros (`persistent_data`), mais ~20 s no primeiro quadro.
   - Os 60 quadros (2 s a 30 fps) a 8 amostras **levaram ver §8**.
   - A prévia a 25% leva **1,4 s por quadro**.
6. **Licenças:**
   - MIT: mcp-for-blender, blenderwright, cc-blender-skill, claudedesignskills, ECC, Flue, scenario-labs e BlenderGPT.
   - GPL-3.0: o MCP oficial do Blender Lab, o `bpy-dev/blender-mcp`, Dream Textures e StableGen. Usar não tem problema; copiar código para a nossa skill obriga a usar GPL.
   - **Sem licença** (não copiar nada): `kevinbadi/blender-skills` e `CloudAI-X/threejs-skills` (esta tem 17 mil instalações).
7. **Add-ons de IA dentro do Blender** (texturas por Stable Diffusion, chat GPT) precisam de GPU ou de chave paga, ou estão abandonados. Não servem para nós.
8. **Recomendação:** criar uma skill **nossa**, de scripts `bpy` headless parametrizados, com receitas de plano escritas do zero. Pode adaptar receitas MIT do `cc-blender-skill`, com atribuição. O MCP fica como opção documentada para o computador do Daniel (detalhes no §9).

---

## 1. Como busquei

- Usei `npx -y skills@1.7.2 find "<termo>"` numa pasta vazia (`hunter/work-A-blender/`). A saída completa está em `hunter/work-A-blender/find.txt`.
- Termos: `blender`, `blender python`, `bpy` (nenhum resultado), `3d animation`, `3d modeling`, `three.js`, `product render` (só lixo de geração de imagem, com contagens de 260–726 mil instalações em forks "superpowers", provavelmente infladas) e `3d motion`.
- Fiz busca no GitHub (MCP do GitHub) por "blender mcp", "blender skill claude" e "blender addon AI".
  - A API REST do GitHub (`gh api`) está bloqueada nesta sessão. As estrelas, licenças e datas vieram da busca do MCP do GitHub e do PyPI.
- Clonei 6 repositórios em pastas novas `hunter/downloads/<nome>-A3/repo` (`--depth 1`) e li tudo como dado.
  - Também baixei 3 `SKILL.md` avulsos em `downloads/skillmds-A3/`.
- Ponto de partida: as notas `3d_pipeline.md`, `3d_round2.md` e `claude_skills_mcp_ecosystem.md` (Q4), e a seção 3D da `remotion-video`.

---

## 2. MCPs de Blender

Nota de 0 a 10 = utilidade para **o nosso caso**: promo de app premium feita pelo Claude, com peso para este container sem GPU, licença e manutenção.

| Nome | Repositório | Licença | Popularidade | Último push | Nota |
|---|---|---|---|---|---|
| **MCP for Blender** (antigo blender-mcp) | [ahujasid/mcp-for-blender](https://github.com/ahujasid/mcp-for-blender) | MIT | 30.454★, 2.758 forks; PyPI `mcp-for-blender` 2.1.9 | 06/10/2026 | **7** (no PC do Daniel) / 4 (aqui) |
| **blenderwright** (antigo blend-ai) | [HoldMyBeer-gg/blenderwright](https://github.com/HoldMyBeer-gg/blenderwright) | MIT | 168★; PyPI `blenderwright` 2.2.1 | 08/10/2026 | **6** |
| **Blender Lab MCP** (oficial do Blender) | [projects.blender.org/lab/blender_mcp](https://projects.blender.org/lab/blender_mcp) · [página](https://www.blender.org/lab/mcp-server/) | GPL-3.0 (cabeçalhos SPDX "Blender Authors") | sem números; add-on 1.0.3 | 2026 | **4** |
| **bpy-dev/blender-mcp** (Lab MCP turbinado) | [bpy-dev/blender-mcp](https://github.com/bpy-dev/blender-mcp) | GPL-3.0 | 98★ | 12/09/2026 | **5** (ideia certa, imaturo) |
| blender-open-mcp | [dhakalnirajan/blender-open-mcp](https://github.com/dhakalnirajan/blender-open-mcp) | MIT | 120★ | 04/09/2026 | 2 |
| GenesisCore / blender-mcp-vxai | AIGODLIKE/GenesisCore · VxASI/blender-mcp-vxai | — | 141★ / 300★ | parados desde 03–04/2025 | 1 |

**O que cada um permite:**

- **mcp-for-blender** (lido: `README.md`, `addon.py` com 6.441 linhas, `src/blender_mcp/server.py`, `TERMS_AND_CONDITIONS.md`)
  - Ferramentas:
    - `execute_blender_code` (Python livre no Blender);
    - `get_scene_info`;
    - "look" (viewport, câmera, várias vistas, tira de animação, wireframe/raio-x);
    - `search_assets`/`import_asset` (Poly Haven, Sketchfab, Poly Pizza);
    - `generate_3d` (Tripo, Hunyuan3D, Hyper3D Rodin; há um plano "Premium" que dispensa as chaves).
  - Arquitetura: add-on com socket TCP na porta 9876, sem autenticação, mais um servidor MCP via `uvx`.
  - **Background:** `addon.py:1266` imprime *"cannot start server in background mode (blender -b) - commands would never execute … use a virtual display: xvfb-run -a blender"*.
  - Captura do viewport: usa `gpu.types.GPUOffScreen.draw_view3d` e só recorre a `screenshot_area` como fallback (`addon.py:2078–2151`).
  - **Telemetria:**
    - um registro anônimo mínimo é enviado **por padrão** (ID de instalação, ferramenta, sucesso, tempo, SO);
    - prompts, código e capturas só com opt-in;
    - os dados "podem ser usados para treinar modelos de IA";
    - para desligar tudo: `DISABLE_TELEMETRY=true`.
  - `BLENDER_MCP_SAFE_MODE=1` bloqueia arquivos, subprocessos e rede no código executado.
  - O Poly Pizza bloqueia IPs de nuvem.
- **blenderwright** (lido: `README.md`)
  - 191 ferramentas em 28 módulos (modelagem, materiais procedurais, luz, câmera, animação, `render_animation`, física, geometry nodes etc.).
  - 12 "prompts de especialista" (estúdio, PBR, autocrítica).
  - Análise de malha.
  - **Zero telemetria.**
  - O Python livre vem **desligado** e se liga por sessão.
  - Precisa de Blender 4.2+ e do add-on instalado como extensão (zip dos Releases), com "Start Server" no painel N.
  - O README admite: *"Headless Blender may not support viewport screenshots"*. A captura usa `bpy.ops.render.opengl`, que funcionou sob Xvfb no meu teste.
  - O exemplo do README (foguete animado, 60 quadros Cycles) foi feito com o Claude Code.
- **Blender Lab MCP (oficial):**
  - Blender 5.1+, add-on `mcp-1.0.3.zip`, servidor como bundle `.mcpb` ou do código-fonte.
  - Documentado para llama.cpp; o Claude Code não aparece na página.
  - Voltado a entender e consultar cenas e a API, não a produzir.
  - Aviso da própria página: *"will execute LLM generated code in Blender without any guards"*, por isso pede uma VM.
- **bpy-dev/blender-mcp** (lido: `readme.md`, `readme_bpy_backend.rst`, `NOTICE.md`)
  - É uma distribuição modificada do Lab MCP com ferramentas `_for_cli`, que abrem um `.blend` salvo num **subprocesso headless**.
  - Backend: o executável do Blender ou o `bpy` standalone (Python 3.13 + `bpy` 5.2.1 de um build de terceiros).
  - Inclui consulta da API em tempo de execução e um benchmark (BlenderBench).
  - É **a única abordagem MCP que conversa com o modo headless**, mas está em "developer preview", sem pacote publicado, com 98★ e 1 mês de vida.

---

## 3. Skills de Blender e 3D (catálogo skills.sh mais GitHub)

| Skill | Repositório | Licença | Popularidade | Último push | Nota |
|---|---|---|---|---|---|
| **cc-blender-skill** (30 skills: text-to-blender, modeling, materials, lighting, cameras, rendering, animation, export, quality gates) | [RobLe3/cc-blender-skill](https://github.com/RobLe3/cc-blender-skill) | MIT | 88★; skills.sh: modeling 1,5 mil, materials 1,1 mil, rendering 929, animation 897, lighting 866 | 01/05/2026 | **7** |
| **kevinbadi/blender-skills** (turntable, slow-zoom, dolly-rotate, crane-shot, dynamic-full-loop, perfect-loop, product-polish, polyhaven-studio, image-to-3d/Meshy, threejs-export) | [kevinbadi/blender-skills](https://github.com/kevinbadi/blender-skills) | **sem licença** | 148★ | 04/04/2026 | 7 como ideia / **0 para copiar** |
| blender-web-pipeline (export glTF/GLB para web, batch `blender --background`, LOD, baking) | [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) | MIT | 1.026★; 3,1 mil instalações | 20/11/2025 | 5 |
| blender-mcp (uso do MCP, armadilhas do export GLTF, "use headless CLI para export porque o MCP dá timeout") | [vladmdgolam/agent-skills](https://github.com/vladmdgolam/agent-skills) | MIT | 9★; 2,1 mil instalações | 14/09/2026 | 4 |
| make-blender-education-video (vídeo explicativo 4K com Blender: roteiro, checagem, **1 quadro de aprovação antes do render**, legendas, QA) | [sunxiayi/make-blender-education-video-skill](https://github.com/sunxiayi/make-blender-education-video-skill) | MIT | 49★ | 25/07/2026 | 5 (o processo é bom) |
| 3dviz-pro-max (Three.js/Blender, 223 receitas; vitrine feita "em GPU real") | [viettranx/3dviz-pro-max](https://github.com/viettranx/3dviz-pro-max) | MIT | 719★ | 11/09/2026 | 4 |
| blender-motion-state-inspection (rigs, retarget, poses) | [affaan-m/ECC](https://github.com/affaan-m/ECC) | MIT | 276,8 mil★ no repositório; 5,9 mil instalações | 11/10/2026 | 2 |
| Flue/Blender (ponte shell→Blender aberto no desktop, sem MCP) | [SFKislev/Flue](https://github.com/SFKislev/Flue) | MIT | 95★; 2,8 mil instalações | 01/09/2026 | 2 |
| scenario-blender-expert/animation/rigging (via a plataforma paga Scenario) | [scenario-labs/skills](https://github.com/scenario-labs/skills) | MIT | 964★; 170–217 instalações | 10/10/2026 | 2 |
| blender-skills (94 skills para assets de jogo, via MCP) | [arjun988/blender-skills](https://github.com/arjun988/blender-skills) | MIT | 285★; 261 instalações | 10/07/2026 | 2 |
| blender-agent-studio · jithinolickal/blender · blender-game-skills · claymation · LobzyJay motion | vários | — | 11–139★; ≤110 instalações | 2026 | 1–2 |
| *Rota Three.js (não Blender):* threejs-animation e outras | [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) | **sem licença** | 3.525★; 10–17 mil instalações cada | 09/07/2026 | 3 (a nossa `remotion-video` já cobre) |

**O que vale aproveitar:**

- **cc-blender-skill** (lido: `README.md`, índice das skills de animação e renderização)
  - Receitas `bpy` organizadas por domínio:
    - animação: Bezier, giro, `BACK`/`ELASTIC`, drivers, NLA, loop com extrapolação cíclica;
    - render: perfis Cycles/Eevee, nomes do motor por versão (`BLENDER_EEVEE` no 5.x), color management, sequência PNG resistente a falhas.
  - Tem tabela honesta do que funciona e do que não funciona, e "gates" de qualidade (folha de contato da animação).
  - Foi feita para rodar via `execute_blender_code` do MCP, mas o código é `bpy` puro e serve headless.
  - É MIT, então dá para adaptar com atribuição.
- **kevinbadi** (lido: `README.md`, `dynamic-full-loop`, render do `turntable`)
  - É o vocabulário de planos de produto que queremos:
    - turntable;
    - push-in;
    - dolly + giro;
    - crane;
    - **speed-ramp** (chaves próximas = lento, distantes = whip);
    - loop perfeito.
  - Usa câmera com `TRACK_TO` num Empty, saída ProRes 4444 com alfa e Cycles **em GPU** com 64 amostras.
  - **Sem licença:** só a ideia pode ser usada, reescrita do zero.
- **make-blender-education-video:** a regra "exatamente 1 quadro de aprovação em alta antes do render completo" se encaixa no custo de render aqui.

---

## 4. Add-ons de IA dentro do Blender

| Add-on | Repositório | Licença | Popularidade | Último push | Nota | Por quê |
|---|---|---|---|---|---|---|
| Dream Textures (Stable Diffusion dentro do Blender) | carson-katri/dream-textures | GPL-3.0 | 8.214★ | 17/09/2026 | 1 | precisa de GPU ou serviço externo; textura não é o nosso gargalo |
| StableGen (texturização por IA via ComfyUI, TRELLIS 2) | sakalond/StableGen | GPL-3.0 | 942★ | 29/09/2026 | 1 | precisa de GPU e de um servidor ComfyUI |
| BlenderGPT (chat GPT-4 dentro do Blender) | gd3kr/BlenderGPT | MIT | 4.985★ | **06/2024 (abandonado)** | 0 | é superado pelos MCPs |
| mixamo-llm-mocap (vídeo → animação Mixamo via MCP) | squall01337/mixamo-llm-mocap | — | 357★ | 2026 | 1 | personagens, não produto |

A **geração de modelos 3D por IA** (Tripo, Hunyuan3D, Rodin no mcp-for-blender; skill `meshy-dev/meshy-3d-agent@meshy-3d-generation` com 2 mil instalações; `generate_3d` do Higgsfield neste workspace) gera GLB para importar no Blender. As licenças e o custo dependem de cada fornecedor e ficaram fora desta fatia. **Para o celular não precisamos disso:** o celular procedural é feito em ~40 linhas de `bpy`.

---

## 5. Como instalar no Claude Code (só depois da aprovação do Daniel)

> **Regra nossa** (find-skills/APRENDIZADOS): nunca instalar direto. Mostrar ao Daniel, pedir aprovação, e trazer pela receita "Instalar uma skill de terceiros", com `LICENSE`, `ORIGEM.md`, `APRENDIZADOS.md` e linha no índice.

**MCP for Blender (no computador do Daniel, com o Blender aberto):**
```bash
claude mcp add blender -e DISABLE_TELEMETRY=true -e BLENDER_MCP_SAFE_MODE=1 -- uvx mcp-for-blender
uvx mcp-for-blender install-addon        # depois: Blender > Preferences > Add-ons > ativar "MCP for Blender"
# no Blender: painel N > "MCP for Blender" > Start MCP Server (porta 9876)
```
- Não use o instalador `curl … | sh`; ele mexe na configuração de todos os clientes.
- Rode só uma instância do servidor.

**blenderwright (alternativa sem telemetria):**
```bash
claude mcp add blenderwright -- uvx blenderwright
# add-on: zip dos GitHub Releases > Edit > Preferences > Get Extensions > Install from Disk; painel N > Start Server
```
- O Python livre fica desligado até marcar "Allow raw Python" no painel N.

**No container (só se um dia quisermos o MCP aqui):**
```bash
xvfb-run -a -s "-screen 0 1920x1080x24" <blender> --factory-startup   # Blender com interface virtual
```
- Antes, é preciso instalar e ativar o add-on por script.

**Skills (ver antes de trazer):**
```bash
npx -y skills@1.7.2 add RobLe3/cc-blender-skill --list
npx -y skills@1.7.2 add freshtechbro/claudedesignskills --list
```

**Blender no container:**
- O tarball oficial 5.2.2 já está em `scratchpad/3d/blender-dl/blender-5.2.2-linux-x64/blender` (383 MB; 9 s de download e 24 s para extrair, medidos na rodada anterior). `which blender` não acha nada, porque ele não está no PATH.
- Não precisa de sudo: o container já roda como root e o Xvfb já está instalado.
- Alternativa não testada: o wheel **oficial** `pip install bpy` (Blender Foundation, 5.2.2, só Python 3.13, 401 MB, 15/09/2026). O container tem Python 3.13.16.

---

## 6. Limitações

- **Os MCPs precisam do Blender com interface** (de propósito, no mcp-for-blender). No container isso só funciona com Xvfb e Mesa llvmpipe, que é lento para Eevee e para o viewport (~0,7 s por redesenho da janela).
- **O "olhar" do MCP:** `bpy.ops.screen.screenshot` sai **preto** sob Xvfb. O render OpenGL e o offscreen funcionam (1,07 s a 540×960).
- **Segurança:**
  - os sockets dos MCPs não têm autenticação;
  - `execute_blender_code` roda qualquer Python;
  - o Lab MCP pede uma VM;
  - use `SAFE_MODE` (mcp-for-blender) ou o raw-Python desligado (blenderwright).
- **Telemetria por padrão no mcp-for-blender** (anônima). Configure com `DISABLE_TELEMETRY=true`.
- **O export GLTF pelo MCP dá timeout** (skill do vladmdgolam). Exportações devem ser headless.
- **As skills do catálogo supõem GPU** (kevinbadi: `cycles.device='GPU'`, 64 amostras). Aqui é só CPU.
- **Sem GPU, Eevee não é mais barato que Cycles:**
  - sob Xvfb, levou 40,7 s para 540×960 a 16 amostras, com a CPU dividida;
  - a rodada anterior mediu ~85 s por quadro em resolução cheia;
  - com `blender -b` puro, o Eevee aborta por falta de `libEGL`.
- **O celular deve ser genérico** (as regras da Apple desencorajam renders de iPhone em anúncio de terceiros). Isso já está na `remotion-video`.

---

## 7. Teste de viabilidade no container (feito)

Máquina: 4 CPUs, 15 GB de RAM, sem GPU, Blender **5.2.2 LTS** (build de 15/09/2026). Scripts e saídas em `hunter/blender-ia/teste/`.

### 7.1 Animação headless (`promo_min.py`, escrito por mim)

- **Cena:** celular genérico procedural, que é uma caixa com bevel de 8 segmentos, corpo metálico escuro com clearcoat e tela emissiva com degradê vermelho e cantos arredondados.
  - Fica num Empty "rig" que gira de −55° para +30° e flutua.
  - O logo 3D "Rotina" entra com easing `BACK` (overshoot).
  - Há 4 luzes de área com `TRACK_TO` (chave, recorte azul, recorte vermelho, topo) e um plano de brilho radial no fundo.
  - Câmera de 50 mm, 1080×1920, 30 fps, `view_transform='Standard'`.
- **Render:** Cycles na CPU, amostragem adaptativa, OIDN, bounces reduzidos, `use_persistent_data`.
- **Uso:** `blender -b --factory-startup -P promo_min.py -- CYCLES <amostras> <saida> <q_ini> <q_fim> [res%] [alpha]`

| Teste | Resultado |
|---|---|
| 1 quadro, 16 amostras, 1080×1920 (máquina ociosa) | render **30,6 s**; processo inteiro **41,7 s** (~11 s de carga a frio) |
| 2 quadros, 4 amostras | 20,8 s (1º) → **13,5 s** (2º, dados persistentes) |
| 2 quadros, 8 amostras | 21,6 s (1º) → **17,3 s** (2º) |
| Prévia a 25% (270×480), 8 amostras | **1,4 s por quadro** (serve para animatic e aprovação de movimento) |
| **Animação 60 quadros (2 s), 8 amostras, 1080×1920** | **ver §8** |

### 7.2 MCP no container: prova da arquitetura sob Xvfb (`xvfb_socket_server.py` + `xvfb_socket_client.py`, código meu)

- O Blender com interface subiu sob `xvfb-run` em **18,8 s a frio e 3,7 s a quente**, com `bpy.app.background = False`.
  - O erro "GHOST/Wayland: XDG_RUNTIME_DIR" é inofensivo: o Blender cai para X11.
- O servidor TCP numa thread mais a fila drenada por `bpy.app.timers` (**a mesma arquitetura dos MCPs**) recebeu código Python de fora e devolveu JSON:
  - criou um objeto em 1,4 s (ida e volta);
  - renderizou Eevee 540×960 a 16 amostras em **40,7 s** (com outro Blender rodando ao mesmo tempo);
  - fez render OpenGL do viewport em **1,07 s**, com imagem certa;
  - `screen.screenshot` saiu **preto**, mesmo depois de `redraw_timer`.
- **Conclusão:**
  - os MCPs de Blender **dá para rodar** neste container com Xvfb, porque os dois principais capturam por render offscreen/OpenGL;
  - não instalei nem executei o add-on deles, que é código de terceiros com 6 mil linhas não auditadas;
  - para produzir vídeo, o headless puro continua melhor.

---

## 8. Resultado da animação completa

(preenchido abaixo depois do fim do render)

---

## 9. Recomendação

**Criar a skill `blender-promo-3d` (nome provisório), nossa, sem depender de MCP.**

1. **Motor:** o Claude escreve scripts `bpy` **parametrizados** e roda `blender -b --factory-startup -P cena.py -- <parâmetros>`. Isso é reprodutível, entra no Git, não precisa de interface e funciona aqui e no computador do Daniel.
2. **Biblioteca de planos** (escrita do zero, com o vocabulário do kevinbadi):
   - turntable;
   - hero reveal (push-in);
   - whip-spin com speed-ramp;
   - dolly + giro;
   - crane;
   - logo reveal com overshoot;
   - loop perfeito.
   - Tudo sobre um **rig único** (Empty) que também alimenta o 2D, como no Rotina v2.
3. **Peças prontas:**
   - celular genérico procedural, com tela que recebe uma sequência de imagens do Remotion;
   - estúdio de luz (chave + recortes + topo + brilho de fundo);
   - perfis de render;
   - logo 3D a partir de texto ou de SVG (`import_curve.svg`).
   - Dá para adaptar as receitas MIT do `cc-blender-skill` (animação e render) com atribuição.
4. **Fluxo de custo, ajustado a este container:**
   1. animatic a 25% (~1,4 s por quadro);
   2. **1 quadro de aprovação** em 1080×1920;
   3. render final Cycles a 8 amostras + OIDN (~15–17 s por quadro; 2–3 s de vídeo ≈ 15–25 min), em segundo plano;
   4. sequência PNG, ou com alfa (`film_transparent`), composta no Remotion.
   - Limite de 1–2 planos-herói por vídeo; o resto fica no R3F/Remotion (~0,7 s por quadro).
5. **MCP como apêndice da skill:**
   - "No seu computador (com GPU), se quiser ver ao vivo": mcp-for-blender com `DISABLE_TELEMETRY=true` e `BLENDER_MCP_SAFE_MODE=1`, ou blenderwright (sem telemetria).
   - Nesse modo, a mesma biblioteca de planos roda via `execute_blender_code`.
6. **Não trazer:**
   - kevinbadi e CloudAI-X threejs-skills, que não têm licença;
   - os add-ons de textura por IA, que precisam de GPU;
   - BlenderGPT, que está abandonado;
   - Flue, ECC motion-inspection, scenario e arjun988, que não são o nosso caso.
   - Avaliar o `bpy-dev/blender-mcp` de novo quando sair do preview.

---

## 10. Arquivos

- Relatório: `scratchpad/hunter/blender-ia/pesquisa-A.md` (este arquivo).
- Teste: `scratchpad/hunter/blender-ia/teste/`
  - `promo_min.py`: cena e animação headless;
  - `xvfb_socket_server.py`, `xvfb_socket_client.py` e `xvfb_socket_client2.py`: prova do MCP sob Xvfb;
  - `log_*.txt`: logs com tempos;
  - `q1_cycles16/`, `q1_cycles4/`, `q1_cycles8/` e `q_cycles8/`: quadros de teste;
  - `prev_pair.jpg`: prévias;
  - `anim_cycles8/` e `promo_min_cycles8.mp4`: animação de 60 quadros;
  - `xvfb_out/`: Eevee sob a interface, render OpenGL do viewport e screenshot preto (`trio.jpg` compara os três).
- Catálogo: `scratchpad/hunter/work-A-blender/find.txt`.
- Clones (somente leitura): `scratchpad/hunter/downloads/{mcp-for-blender,blenderwright,bpy-blender-mcp,kevinbadi-blender-skills,cc-blender-skill,claudedesignskills}-A3/` e `downloads/skillmds-A3/`.
