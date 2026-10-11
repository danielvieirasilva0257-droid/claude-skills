# ORIGEM: skill blender-ia

**Skill nossa** (não é de terceiros). Criada em 11/10/2026 a partir de duas pesquisas paralelas (agente A: skills e MCPs + teste no container; agente B: técnicas, fluxos e licenças na web) e das notas de 08–09/10/2026 em `research_notes/Motion design 3D e voz IA/3d_pipeline.md` e `3d_round2.md`.

## Código

| Arquivo | Origem | Licença |
|---|---|---|
| `scripts/produto.py` | escrito pelo agente B (receita testada), com a opção `--tela_seq` e `--fps` acrescentadas e testadas pelo agente de transcrição | GPL-3.0-or-later |
| `scripts/logo_e_celular.py` | escrito pelo agente A (`promo_min.py`, teste de 60 quadros), com o texto do logo como parâmetro e a entrada do logo corrigida (regra 4 do editor) | GPL-3.0-or-later |
| `scripts/folha.sh`, `png_para_video.sh`, `instalar_blender.sh` | escritos para esta skill (comandos ffmpeg testados pelo agente B) | sem restrição (código nosso) |
| `assets/CamadaBlender.tsx` | componente da pesquisa B, mesmo padrão do Rotina v2 | sem restrição (código nosso) |
| `scripts/LICENSE` | texto oficial da GPL-3.0, copiado sem alteração de `license/spdx/GPL-3.0-or-later.txt` do tarball do Blender 5.2.2 (cópia literal permitida pela própria licença) | — |

**Por que GPL nos `.py`:** a página de licença do Blender (https://www.blender.org/about/license/, lida em 11/10/2026) diz que scripts que usam a API Python, quando publicados, precisam de licença compatível com a GPL. O repositório é público, então os scripts `bpy` levam `SPDX-License-Identifier: GPL-3.0-or-later`. O que o Blender renderiza é nosso ("What you create with Blender is your sole property").

**Nenhum texto ou código de terceiros foi copiado.** Os trechos `bpy` do `SKILL.md` saem do `produto.py`.

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

As pesquisas completas, com todos os links: `scratchpad/hunter/blender-ia/pesquisa-A.md` e `pesquisa-B.md` (registro em `TRANSCRICAO.md`). Ao salvar na `main`, copiar as duas para `research_notes/Blender com IA/`.

## Versões testadas

- Blender **5.2.2 LTS** (build 15/09/2026), tarball oficial `blender-5.2.2-linux-x64.tar.xz`, SHA-256 `84098912789dc450e95697c4184fb8a90acbe5111c2ba4aede3fecb57806a168` (conferido com `blender-5.2.2.sha256` do site).
- ffmpeg do container (ProRes `prores_ks`, VP9 `libvpx-vp9`).

## Como atualizar

- Blender novo: troque `VER`, `SERIE` e `SHA` em `scripts/instalar_blender.sh` (o SHA está em `https://download.blender.org/release/Blender<serie>/blender-<ver>.sha256`) e rode os testes do `APRENDIZADOS.md`.
- MCP: `uvx mcp-for-blender --version` e leia o changelog antes de recomendar outra versão.
