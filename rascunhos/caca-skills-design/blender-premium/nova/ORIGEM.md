# ORIGEM: skill blender-ia

**Skill nossa** (não é de terceiros). Criada em 11/10/2026 a partir de duas pesquisas paralelas (agente A: skills e MCPs + teste no container; agente B: técnicas, fluxos e licenças na web) e das notas de 08–09/10/2026 em `research_notes/Motion design 3D e voz IA/3d_pipeline.md` e `3d_round2.md`.

**Ampliada em 12/10/2026 ("Blender premium")** com mais duas pesquisas paralelas: A (direção de animação, fluidez e suavização de keyframes; testes em `teste-A/`) e B (visual premium: luz, materiais, render e modelagem 3D; testes em `teste-B/`), mais a integração e o teste final feitos pelo agente de transcrição (`teste-T/`). Registro: `scratchpad/hunter/blender-premium/TRANSCRICAO.md`; pesquisas completas: `pesquisa-A.md` e `pesquisa-B.md` (ao salvar na `main`, copiar para `research_notes/Blender com IA/`).

## Código

| Arquivo | Origem | Licença |
|---|---|---|
| `scripts/produto.py` | escrito pelo agente B (receita testada), com a opção `--tela_seq` e `--fps` acrescentadas e testadas pelo agente de transcrição | GPL-3.0-or-later |
| `scripts/logo_e_celular.py` | escrito pelo agente A (`promo_min.py`, teste de 60 quadros), com o texto do logo como parâmetro e a entrada do logo corrigida (regra 4 do editor) | GPL-3.0-or-later |
| `scripts/premium.py` (12/10/2026) | **junta três peças próprias:** o `celular_premium.py` (agente B: modelagem, materiais, estúdio, sheen, compositor), o `curvas_premium.py` (agente A: handles a partir do cubic-bezier, mola assada, pivô de órbita, QA das curvas) e a integração do `produto.py` (RGBA, sombra em camada, `caixas.json`, `--tela_seq`). Acrescentados pelo agente de transcrição: shader da tela (borda, cantos e furo da câmera), `--anim heroi\|turntable\|parado`, `qa.json`, `--salvar`, `--so`, `--fstop` | GPL-3.0-or-later |
| `scripts/verifica_curvas.py` (12/10/2026) | extraído do `curvas_premium.py` (agente A) e generalizado: lê todas as f-curves de uma cena; `--selftest` do cubic-bezier | GPL-3.0-or-later |
| `scripts/tela_teste.py` (12/10/2026) | adaptado do `gera_tela.py` (agente B) para sair só a área ativa 1080×2309 | sem restrição (código nosso) |
| `scripts/baixar_hdri.sh` (12/10/2026) | escrito para esta skill; baixa HDRI da Poly Haven (CC0) | sem restrição (código nosso) |
| `references/*.md` (12/10/2026) | escritos a partir de `pesquisa-A.md`, `pesquisa-B.md` e dos testes; números marcados MEDIDO/FONTE/INFERÊNCIA | sem restrição (texto nosso) |
| `scripts/folha.sh`, `png_para_video.sh`, `instalar_blender.sh` | escritos para esta skill (comandos ffmpeg testados pelo agente B) | sem restrição (código nosso) |
| `assets/CamadaBlender.tsx` | componente da pesquisa B, mesmo padrão do Rotina v2 | sem restrição (código nosso) |
| `scripts/LICENSE` | texto oficial da GPL-3.0, copiado sem alteração de `license/spdx/GPL-3.0-or-later.txt` do tarball do Blender 5.2.2 (cópia literal permitida pela própria licença) | — |

**Por que GPL nos `.py`:** a página de licença do Blender (https://www.blender.org/about/license/, lida em 11/10/2026) diz que scripts que usam a API Python, quando publicados, precisam de licença compatível com a GPL. O repositório é público, então os scripts `bpy` levam `SPDX-License-Identifier: GPL-3.0-or-later`. O que o Blender renderiza é nosso ("What you create with Blender is your sole property").

**Nenhum texto ou código de terceiros foi copiado.** Os trechos `bpy` do `SKILL.md` saem do `produto.py` e do `premium.py`. Das fontes MIT entraram só fatos (números, nomes de parâmetros), reescritos com palavras nossas; do manual do Blender (CC-BY-SA), só paráfrase.

## Fontes consultadas (só leitura, nada copiado)

| Fonte | Licença | Uso nesta skill |
|---|---|---|
| ahujasid/mcp-for-blender (antigo blender-mcp), v2.1.9 | MIT | descrição do MCP, instalação, telemetria, `SAFE_MODE`; recusa de `-b` em `addon.py:1266` |
| HoldMyBeer-gg/blenderwright | MIT | alternativa de MCP sem telemetria |
| Blender Lab MCP (projects.blender.org/lab/blender_mcp; blender.org/lab/mcp-server) | GPL-3.0 (cabeçalhos SPDX) | descrição do MCP oficial |
| bpy-dev/blender-mcp | GPL-3.0 | citado como "reavaliar quando sair do preview" |
| RobLe3/cc-blender-skill | MIT | lido; ideias de receitas e "gates" de qualidade; nada copiado |
| kevinbadi/blender-skills | **sem licença** | só o vocabulário de planos (turntable, push-in, crane, speed-ramp); nada copiado |
| sunxiayi/make-blender-education-video-skill | MIT | ideia de "1 quadro de aprovação antes do render" |
| CloudAI-X/threejs-skills | **sem licença** | não usado |
| Notas da API do Blender 5.0 (developer.blender.org) | docs | armadilhas da API 5.x |
| Remotion: transparent-videos, assets | docs | integração |
| Poly Haven, Sketchfab, Meshy, Tripo, Hyper3D Rodin, Stability AI, Hunyuan3D 2.1, TRELLIS.2, licença SAM, Skybox AI | ver tabela no SKILL.md | tabela de licenças para anúncio |
| Anthropic "Claude for Creative Work" (28/04/2026), MindStudio (teste do donut, 01/05/2026), The Rundown (18/05/2026), StraySpark (comparação de MCPs) | — | relatos de uso do MCP |

As pesquisas completas, com todos os links: `scratchpad/hunter/blender-ia/pesquisa-A.md` e `pesquisa-B.md` (registro em `TRANSCRICAO.md`) e, do "Blender premium", `scratchpad/hunter/blender-premium/pesquisa-A.md` e `pesquisa-B.md`. Ao salvar na `main`, copiar para `research_notes/Blender com IA/`.

### Fontes novas (12/10/2026, só leitura)

| Fonte | Licença | Uso nesta skill |
|---|---|---|
| RobLe3/cc-blender-skill (`blender-animation`, `animation-quality-gate`, `blender-materials`, `blender-lighting`, `blender-rendering`) | MIT (conferida) | tabela de lentes, razão de luz de produto, "Metallic é chave", `transmission_bounces ≥ 16`, gate de folha de contato. **Bug conhecido:** a receita 4 põe BOUNCE na última chave (sem efeito); nada copiado. (A pesquisa A grafou `roble3`; o dono é RobLe3.) |
| scenario-labs/skills (`scenario-blender-lighting-rendering`, `scenario-blender-hard-surface`) | MIT (conferida) | erro de cor por view transform (Khronos 3,8; AgX 27–42; Standard 33), exposição no view transform, compositor 5.x, bevel duplo, Weighted Normal por último, regra da largura. Só fatos. |
| arjun988/blender-skills (`lighting`, `lookdev`, `procedural-modeling`) | MIT (conferida) | confirma o rig "Product Hero Shot" (softbox, 2 rims, fundo em degradê, 85 mm) |
| dylantarre/animation-principles | MIT | antecipação de 400–600 ms e câmera que recua antes do push-in (plano "dramático") |
| affaan-m/ecc `blender-motion-state-inspection` | MIT | ideia: extrair fatos quadro a quadro (virou `verifica_curvas.py`) |
| emilkowalski/skills `apple-design` | MIT | mola Apple (ζ, response) já resumida em `motion-oficial/references/molas-e-curvas.md` |
| kevinbadi/blender-skills (`slow-zoom`, `crane-shot`, `dolly-rotate`, `perfect-loop`, `product-polish`) | **sem licença** | só o vocabulário de planos; **nada copiado** |
| Blender Manual 5.2 (F-Curves, modificadores, edição, Cycles Motion Blur) e API 5.x (`anim_utils`, `Action`, `ActionKeyframeStrip`) | CC-BY-SA 4.0 (docs) | só paráfrase |
| Notas do Blender 4.2 (Khronos PBR Neutral) e devtalk; manual do Principled BSDF; API do OIDN e do Lens Distortion | docs | view transform, anisotropia, thin film, denoiser |
| Poly Haven (HDRI `studio_small_09` 1k; FAQ e API) | CC0 | HDRI de estúdio só para reflexos (baixado por `baixar_hdri.sh`, **não** guardado no repositório) |
| Physically Based (API de materiais) | CC0 | cor base linear e IOR medidos (alumínio, aço, titânio, cromo; vidro 1,52) |
| WARC (MacLachlan & Logan), LBB ("Shot on iPhone" Ano-Novo Chinês), Cannes Lions (Sarofsky/iMac Pro), Vagon (02/2025), Derek Elliott/BlenderNation (2019), Superhive "Dark Luxury Studio" (pago) | artigos | contexto de ritmo e de estúdio; nada copiado |
| Manfrotto "How to shoot cinematic tech videos like Apple" | não lido (HTTP 429) | não usado |

## Versões testadas

- Blender **5.2.2 LTS** (build 15/09/2026), tarball oficial `blender-5.2.2-linux-x64.tar.xz`, SHA-256 `84098912789dc450e95697c4184fb8a90acbe5111c2ba4aede3fecb57806a168` (conferido com `blender-5.2.2.sha256` do site).
- ffmpeg do container (ProRes `prores_ks`, VP9 `libvpx-vp9`).

## Como atualizar

- Blender novo: troque `VER`, `SERIE` e `SHA` em `scripts/instalar_blender.sh` (o SHA está em `https://download.blender.org/release/Blender<serie>/blender-<ver>.sha256`) e rode os testes do `APRENDIZADOS.md`.
- MCP: `uvx mcp-for-blender --version` e leia o changelog antes de recomendar outra versão.
