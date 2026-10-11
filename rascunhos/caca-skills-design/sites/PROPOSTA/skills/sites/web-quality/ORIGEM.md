# Origem deste pacote

Cópia **sem nenhuma alteração** das 6 skills do pacote `web-quality-skills` (versão 2.0). Só `ORIGEM.md` e `APRENDIZADOS.md` (desta pasta de cima) foram escritos aqui.

- **Origem:** https://github.com/addyosmani/web-quality-skills, pasta `skills/`, commit `afa8da942115f2961fdbfa80807ea0b232ff6c00` de 24/08/2026. Baixado em 11/10/2026.
- **Autor e licença:** Addy Osmani, **MIT** (`LICENSE` da raiz do repositório, copiado para esta pasta). Cada `SKILL.md` também traz `license: MIT`.
- **O que foi copiado:** as 6 pastas, lado a lado, porque elas se citam com caminhos `../`:
  - `web-quality-audit/` (`SKILL.md`, `scripts/analyze.sh`);
  - `performance/` (`references/MEASUREMENT.md`, `RUM.md`);
  - `core-web-vitals/` (`references/LCP.md`, `INP.md`, `CLS.md`);
  - `accessibility/` (`references/WCAG.md`, `A11Y-PATTERNS.md`);
  - `seo/` (`references/STRUCTURED-DATA.md`);
  - `best-practices/` (`references/SECURITY.md`).
- **O que ficou de fora:** `AGENTS.md`, `CLAUDE.md`, `docs/`, `codex/` e `gemini-extension.json` da raiz (instruções para outros programas).
- **Instalação oficial equivalente:** `npx skills add addyosmani/web-quality-skills`.

## Como atualizar

```bash
git clone --depth 1 https://github.com/addyosmani/web-quality-skills.git
for s in accessibility best-practices core-web-vitals performance seo web-quality-audit; do
  diff -r web-quality-skills/skills/$s <caminho>/skills/sites/web-quality/$s
done
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
