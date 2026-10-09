# claude-skills

Base de conhecimento e habilidades (skills) do Claude para os projetos do Daniel. O índice rápido de tudo o que existe está em **`HABILIDADES.txt`**: uma linha por habilidade, com o caminho do arquivo.

| Habilidade | O que faz | Onde está |
|---|---|---|
| `remotion-video` | Vídeos com Remotion (React): promos e explicativos de app, legendas, 3D, voz, música e regras de motion premium | `skills/remotion-video/` |
| `motion-video` | Kit de motion design em canvas (sem Remotion), com iPhone realista, cards 3D e sons sintetizados | `.claude/skills/motion-video/` + `motion-studio/` |
| `button-animation` | Animações de botões e de UI, mais o componente Compose | `skills/button-animation/` |
| `thumbnail-carousel` | Carrossel com miniaturas (framer-motion) | `skills/thumbnail-carousel/` |
| `ui-ux-pro-max` | Como instalar e usar a skill externa de design de UI/UX | `skills/ui-ux-pro-max/` |

Também neste repositório:
- `rotina-video/`: o projeto Remotion dos vídeos do app Rotina.
- `reports/`: relatórios de pesquisa, em português.
- `research_notes/`: anotações brutas e amostras de voz.
- `CLAUDE.md`: as regras de trabalho, como a de que mudanças em skills só entram com aprovação.

Para usar uma skill em qualquer projeto no Claude Code, copie a pasta dela para `~/.claude/skills/` (vale para todos os projetos) ou para `<projeto>/.claude/skills/`. Os arquivos originais (`.txt` e o link) continuam na raiz.
