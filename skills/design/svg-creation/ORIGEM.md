# Origem desta skill

Cópia **sem nenhuma alteração** da skill `svg-creation` do dvy1987 (repositório agent-loom). Só `ORIGEM.md`, `APRENDIZADOS.md` e o `LICENSE` (copiado da raiz do repositório de origem) foram acrescentados aqui.

- **Origem:** https://github.com/dvy1987/agent-loom, pasta `.agents/skills/svg-creation`, commit `54960e6b73986113709765f8515650589be64198`. Baixada em 25/11/2026, aprovada pelo Daniel no mesmo dia.
- **Autor e licença:** dvy1987, MIT (`LICENSE`, só como registro).
- **O que foi copiado:** `SKILL.md` e `references/` (static-craft, animation-craft, ai-svg-prompts, svg-tooling, github-safe-smil, examples).
- **O que ficou de fora:** as outras skills do agent-loom que ela cita (`design-system`, `motion-animation`, `gsap-animation`).

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/dvy1987/agent-loom.git al
cd al && git sparse-checkout set .agents/skills/svg-creation && cd ..
diff -r al/.agents/skills/svg-creation <caminho>/skills/design/svg-creation
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
