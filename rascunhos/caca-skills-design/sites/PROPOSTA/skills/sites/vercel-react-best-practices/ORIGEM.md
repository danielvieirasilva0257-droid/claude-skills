# Origem desta skill

Cópia **sem nenhuma alteração** da skill `vercel-react-best-practices` (versão 1.0.0). Só `ORIGEM.md`, `APRENDIZADOS.md` e `LICENCA-NOTA.md` foram escritos aqui.

- **Origem:** https://github.com/vercel-labs/agent-skills, pasta `skills/react-best-practices`, commit `063bee94c3f4df8453406c830b0a7df0f2860278` de 28/08/2026. Baixada em 11/10/2026.
- **Nome da pasta:** aqui a pasta se chama `vercel-react-best-practices`, igual ao `name:` do `SKILL.md`. Os arquivos são os mesmos.
- **Autor e licença:** Vercel, **MIT**. O repositório não tem arquivo LICENSE: veja `LICENCA-NOTA.md`.
- **O que foi copiado:** a pasta inteira: `SKILL.md`, `AGENTS.md` (todas as regras juntas, ~13 mil palavras), `README.md`, `metadata.json` e `rules/` (70 regras + `_template.md` + `_sections.md`).
- **Skills do mesmo repositório que NÃO foram instaladas:** `web-design-guidelines` (já é fonte da `ui-ux-pro-max`), `composition-patterns`, `react-view-transitions`, `react-native-skills`, `vercel-optimize`, `vercel-cli-with-tokens` e `writing-guidelines`. A `deploy-to-vercel` foi instalada em `skills/sites/deploy-to-vercel/`.
- **Instalação oficial equivalente:** `npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices`.

## Como atualizar

```bash
git clone --depth 1 https://github.com/vercel-labs/agent-skills.git
diff -r agent-skills/skills/react-best-practices <caminho>/skills/sites/vercel-react-best-practices
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
