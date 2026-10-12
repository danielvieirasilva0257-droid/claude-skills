# Origem desta skill

Cópia **sem nenhuma alteração** do `SKILL.md` da skill `web-design-guidelines`. Só `ORIGEM.md`, `APRENDIZADOS.md`, `LICENCA-NOTA.md` e a pasta `regras-fixadas/` foram escritos ou acrescentados aqui.

- **Origem:** https://github.com/vercel-labs/agent-skills, pasta `skills/web-design-guidelines`, commit `063bee94c3f4df8453406c830b0a7df0f2860278` de 28/08/2026 (o **mesmo commit** da nossa `deploy-to-vercel`). Baixada em 12/10/2026.
- **Autor e licença:** Vercel, **MIT**. O repositório não tem arquivo LICENSE: veja `LICENCA-NOTA.md`.
- **Popularidade em 12/10/2026:** `vercel-labs/agent-skills@web-design-guidelines` com 723,9 mil instalações no skills.sh; o repositório tem cerca de 32,3 mil estrelas.
- **O que foi copiado:** só o `SKILL.md` (1,2 KB). Ele **não traz as regras**: manda buscar na internet, a cada revisão, o arquivo `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`.
- **O que acrescentamos (arquivos nossos, fora do original):** `regras-fixadas/command.md`, uma cópia **igual** (conferida byte a byte em 12/10/2026) do arquivo que a skill busca, do repositório https://github.com/vercel-labs/web-interface-guidelines, commit `434b7f91364665f2f733b310ec54809bf8f37937` de 05/10/2026, licença **MIT** ("Copyright (c) 2025 Vercel Labs", em `regras-fixadas/LICENSE`). Serve para a skill funcionar **sem buscar texto da internet** (veja `APRENDIZADOS.md`).
- **Skills irmãs do repositório NÃO copiadas aqui:** `react-best-practices` (já entra como `vercel-react-best-practices`), `deploy-to-vercel` (já entra), `composition-patterns`, `react-native-skills`, `react-view-transitions`, `vercel-cli-with-tokens`, `vercel-optimize`, `writing-guidelines`.
- **Instalação oficial equivalente:** `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` (não use: copiamos à mão).

## Como atualizar

```bash
git clone --depth 1 https://github.com/vercel-labs/agent-skills.git
diff agent-skills/skills/web-design-guidelines/SKILL.md <caminho>/skills/design/web-design-guidelines/SKILL.md
git clone --depth 1 https://github.com/vercel-labs/web-interface-guidelines.git
diff web-interface-guidelines/command.md <caminho>/skills/design/web-design-guidelines/regras-fixadas/command.md
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui os commits novos.
