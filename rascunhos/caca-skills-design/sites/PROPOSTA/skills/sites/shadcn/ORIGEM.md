# Origem desta skill

Cópia **sem nenhuma alteração** da skill oficial `shadcn`. Os arquivos em inglês são os originais. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui.

- **Origem:** https://github.com/shadcn-ui/ui, pasta `skills/shadcn`, commit `02cad61166c4c20edbc8a3f71bd720eed4c1f49b` de 11/10/2026. Baixada em 11/10/2026.
- **Autor e licença:** shadcn, **MIT** (`LICENSE.md` da raiz do repositório, copiado para esta pasta).
- **O que foi copiado:** a pasta inteira: `SKILL.md`, `cli.md`, `customization.md`, `design-system.md`, `design-system-page.md`, `mcp.md`, `registry.md`, `rules/` (6 arquivos), `assets/` (logos e `showcase/`), `scripts/showcase-coverage.mjs`, `agents/openai.yml` e `evals/evals.json` (21 arquivos, 220 KB).
- **O que ficou de fora:** a outra skill da mesma pasta, `migrate-radix-to-base` (migração de projetos antigos; não faz falta agora).
- **Instalação oficial equivalente:** `npx skills add shadcn/ui`.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/shadcn-ui/ui.git && cd ui && git sparse-checkout set skills
diff -r skills/shadcn <caminho>/skills/sites/shadcn   # ignore LICENSE.md, ORIGEM.md e APRENDIZADOS.md
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
