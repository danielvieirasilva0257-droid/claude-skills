# Origem desta skill

Cópia **sem nenhuma alteração** da skill `deploy-to-vercel` (versão 3.0.0). Só `ORIGEM.md`, `APRENDIZADOS.md` e `LICENCA-NOTA.md` foram escritos aqui.

- **Origem:** https://github.com/vercel-labs/agent-skills, pasta `skills/deploy-to-vercel`, commit `063bee94c3f4df8453406c830b0a7df0f2860278` de 28/08/2026. Baixada em 11/10/2026.
- **Autor e licença:** Vercel, **MIT**. O repositório não tem arquivo LICENSE: veja `LICENCA-NOTA.md`.
- **O que foi copiado:** a pasta inteira: `SKILL.md`, `resources/deploy.sh`, `resources/deploy-codex.sh` e `Archive.zip`.
- **Sobre o `Archive.zip`:** é uma cópia antiga (março/2026) do `SKILL.md` e dos dois scripts, com lixo `__MACOSX`. É redundante, mas fica porque a regra é copiar intacto. Não use: os arquivos soltos são os atuais.
- **Endereços que os scripts usam:** `deploy.sh` envia o projeto para `https://claude-skills-deploy.vercel.com/api/deploy`; `deploy-codex.sh` para `https://codex-deploy-skills.vercel.sh/api/deploy`.
- **Skill relacionada não instalada:** `vercel-cli-with-tokens` (deploy com token, no mesmo repositório).

## Como atualizar

```bash
git clone --depth 1 https://github.com/vercel-labs/agent-skills.git
diff -r agent-skills/skills/deploy-to-vercel <caminho>/skills/sites/deploy-to-vercel
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
