# Origem desta skill

Desde 11/10/2026 esta skill **não é mais uma cópia intacta** do pacote oficial. Com autorização do Daniel, ela foi reescrita em português, juntando a skill oficial do Motion com as melhores partes de outras skills e guias. Cada parte copiada ou adaptada tem a fonte marcada no próprio arquivo. As licenças das fontes estão em `LICENSES/`.

Regra seguida: **texto literal só de fontes MIT, Apache-2.0 ou CC BY**; de fontes sem licença aberta, só ideias reescritas com nossas palavras. Código de exemplo foi mantido em inglês.

## Fontes usadas

| Fonte | Link | Licença | Versão / commit (data) | O que foi aproveitado | Onde está |
|---|---|---|---|---|---|
| **Skill oficial do Motion** (`motion-ai`), Matt Perry | https://github.com/motiondivision/ai-kit (pacote npm `motion-ai`) | MIT (campo `license` do `package.json`; o pacote não traz arquivo LICENSE) | 14.1.0, baixado em 09/10/2026 | Regras de API (imports, `transform` × `x/y`, `will-change`, MotionValues, `useTransform`, React, Vue, JS, Base UI, Radix), busca no codex, Motion+, migração, molas CSS `linear()`, editor visual, agente revisor | `SKILL.md` (Motion: o essencial), `references/api-motion.md`, `references/codex-mcp.md`, `references/molas-e-curvas.md` §3–4, `references/revisao.md` §7, `agents/motion-reviewer.md` |
| **Emil Kowalski**: `animate` (+ `RECIPES.md`), `review-animations` (+ `STANDARDS.md`), `apple-design` | https://github.com/emilkowalski/skills | MIT (2026) | `e8a175d` (02/10/2026) | Sequência de decisão (frequência, propósito, ferramenta, propriedades, curva, interrupção, acessibilidade), curvas fortes, tabela de durações, "Never Ship", receitas, molas Apple, impulso, rubber-band, formato de revisão, depuração de sensação | `SKILL.md` (ordem de trabalho, nunca entregar), `references/receitas.md`, `references/gestos.md`, `references/molas-e-curvas.md`, `references/revisao.md` |
| **Matthew Blode**: `ui-animation` | https://github.com/mblode/agent-skills | MIT (2026) | `872bc83` (11/10/2026) | Curvas nomeadas extras, durações com curva, presets de mola, mola assimétrica medida, armadilhas do Motion (reduced motion só em CSS, `borderRadius` inline, `key`), tarefas longas, depuração por sintoma, regra dos pares, troca de tema, método de engenharia reversa (sem os scripts) | `SKILL.md`, `references/api-motion.md` §7, `references/molas-e-curvas.md`, `references/revisao.md` §5, `references/coreografia.md` §6 |
| **Kyle Zantos**: `design-motion-principles` | https://github.com/kylezantos/design-motion-principles | MIT (2026) | `4a9ca87` (30/05/2026) | Anti-checklist "movimento de IA" com limites, peso por tipo de projeto, receita de entrada com blur e troca de ícone (atribuída a Jakub Krehel), limite de `will-change` | `references/revisao.md` §3, `references/coreografia.md` §4, `references/receitas.md` |
| **Julien Thibeaut (ibelick)**: `fixing-motion-performance` | https://github.com/ibelick/ui-skills | MIT (2026) | `d036a68` (11/10/2026) | Auditoria de desempenho grátis (nunca, medição/FLIP, scroll, pintura, variáveis CSS, blur ≤ 8 px, View Transitions, não migrar bibliotecas) | `references/revisao.md` §4 |
| **Raphael Salaja**: `userinterface-wiki` | https://github.com/raphaelsalaja/userinterface-wiki | MIT (2026) | `256a954` (17/03/2026) | Regras de `AnimatePresence` (`key`, wrapper, `propagate`, `mode="wait"`, `popLayout`, `useIsPresent`, `safeToRemove`), padrão de duas divs | `references/api-motion.md` §7 |
| **Motion Lexicon** (Ryan-yang125 e colaboradores) | https://github.com/Ryan-yang125/motion-lexicon | código MIT; **texto e dados CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/) | `88f979a` (19/08/2026) | Atores e beats, gramática de beat, padrões de composição, corrida assíncrona, rubrica de revisão. **Mudanças feitas:** tradução, resumo e exemplos nossos | `references/coreografia.md` §2–3, `references/revisao.md` §6 |
| **Material Design 3** (tokens do material-web), Google | https://github.com/material-components/material-web (`tokens/versions/latest/sass/_md-sys-motion.scss`) | Apache-2.0 | `47adb65` (07/10/2026) | Curvas `standard`, `emphasized-*`; molas convertidas para `{ stiffness, damping }` do Motion (conversão nossa) | `references/molas-e-curvas.md` §1–2 |
| **Vercel Web Interface Guidelines** | https://github.com/vercel-labs/web-interface-guidelines | MIT (2025) | `434b7f9` (05/10/2026) | CSS > WAAPI > JS; honrar reduced motion; SVG em `<g>` com `transform-box: fill-box`; autoplay > 5 s | `SKILL.md` passos 3, 4 e 7 |
| Documentação do Motion: acessibilidade | https://motion.dev/docs/react-accessibility | documentação (só citada) | 2026 | `MotionConfig reducedMotion="user"`, `useReducedMotion()` | `SKILL.md` passo 7 |
| Paul Bakaus: `impeccable` / `animate` | https://github.com/pbakaus/impeccable | Apache-2.0 (com NOTICE) | `c63b8dd` (11/10/2026) | **Só a ideia** da "motion thesis", reescrita | `references/coreografia.md` §1 |
| Josh Comeau: "Springs and Bounces in Native CSS" | https://www.joshwcomeau.com/animation/linear-timing-function/ | sem licença aberta | 10/2025 | **Só ideias**: quantidade de pontos no `linear()`, `@supports`, reduced motion, sem velocidade na interrupção | `references/molas-e-curvas.md` §3 |
| Skills oficiais do Remotion | https://github.com/remotion-dev/skills | sem LICENSE no repositório | `32b241b` (07/10/2026) | **Só a ideia**: CSS e Motion não renderizam no Remotion; use `useCurrentFrame()` + `interpolate()`/`spring()` | `SKILL.md` (Vídeo), `references/coreografia.md` §5 |
| Rauno Freiberg: "Web Interface Guidelines" | https://github.com/raunofreiberg/interfaces | sem licença | `81f523a` (06/06/2023) | **Só ideias**: troca de tema sem transição, press ~0,96 | `references/receitas.md` |
| GSAP (skills oficiais) | https://github.com/greensock/gsap-skills | MIT | `aed9cfd` (21/04/2026) | **Só a ideia** de sequência com posição relativa em vez de somar `delay` | `references/api-motion.md` §6 |
| Regras da casa | `skills/video/remotion-video/SKILL.md` e `guia/LEIA-ANTES-DE-USAR.md` §9 | nossas | 10/10/2026 | 4 regras de composição do editor, molas `Entra`/`Atras`/`PalavraDividida`, tempo de leitura, sons | `SKILL.md`, `references/coreografia.md` §5 |

## O que ficou de fora

- **Do pacote oficial:** `rules/motion.mdc` (só serve para o Cursor). Os arquivos `best-practices/`, `codex/`, `css-spring/`, `performance-audit/` e `transition-preview/` foram **absorvidos** (traduzidos e reorganizados) em `references/`; as pastas antigas deixam de existir.
- **Scripts Python do Blode** (`extract_frames.py`, `track_motion.py`, `fit_curves.py`): não foram lidos linha a linha nem executados. Só o método entrou.
- **transitions.dev** (Jakub Antalik): licença própria proíbe redistribuir. Nada copiado.
- **taste-skill** (usa `transition: all`), **pproenca/emilkowal-animations** (cópia do Emil), **hyperframes** e **GSAP** como biblioteca (outro assunto), skills genéricas de "framer-motion" de autores pouco conhecidos.
- Skills relacionadas **não instaladas**: `emilkowalski/skills@improve-animations`, `find-animation-opportunities`, `animate-expo` (React Native); `vercel-labs/agent-skills@vercel-react-view-transitions`.

## Como atualizar

```bash
# skill oficial
npm pack motion-ai && tar -xzf motion-ai-*.tgz   # arquivos em package/content/skills/motion/
# demais fontes
git clone --depth 1 https://github.com/emilkowalski/skills
git clone --depth 1 https://github.com/mblode/agent-skills
# compare com o commit anotado na tabela: git log -1 --format='%h %cs'
```

Compare com a tabela acima. Se houver novidade, mostre ao Daniel antes de mudar (regra do `CLAUDE.md` da main) e atualize o commit/data aqui.
