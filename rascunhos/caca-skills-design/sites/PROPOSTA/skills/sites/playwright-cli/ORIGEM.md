# Origem desta skill

Cópia **sem nenhuma alteração** da skill `playwright-cli` do projeto da Microsoft (ferramenta `@playwright/cli`, versão 0.1.22). Só `ORIGEM.md`, `APRENDIZADOS.md` e o `LICENSE` (copiado da raiz do repositório) foram acrescentados aqui.

- **Origem:** https://github.com/microsoft/playwright-cli, pasta `skills/playwright-cli`, commit `b85c7a736bb473bf55b584e54a09ffa698d6d871` de 28/09/2026 ("mark v0.1.22"). Baixada em 12/10/2026.
- **Como foi identificada:** `npx skills find playwright cli` devolve em primeiro lugar `microsoft/playwright-cli@playwright-cli` (181,1 mil instalações no skills.sh). Outros candidatos (não escolhidos): `openai/skills@playwright` (7,9 mil instalações, outra ferramenta, da OpenAI) e o `agent-browser` (vercel-labs, Apache-2.0, muito instalado e repetido por vários donos), cujo `SKILL.md` é só um "stub" que manda baixar o conteúdo real do programa; já tinha ficado de fora na pesquisa de 11/10/2026.
- **Autor e licença:** Microsoft Corporation, **Apache-2.0** (`LICENSE`; o `package.json` também diz `Apache-2.0`). O repositório não tem arquivo `NOTICE`.
- **Popularidade em 12/10/2026:** cerca de 14 mil estrelas no GitHub.
- **O que foi copiado:** a pasta inteira da skill: `SKILL.md` (15 KB) e `references/` (10 arquivos `.md`, uns 53 KB). Total uns 70 KB, sem binários.
- **O que NÃO foi copiado:** o programa em si (`@playwright/cli`, em JavaScript). Ele **não vem junto**: instala-se por fora (veja `APRENDIZADOS.md`).
- **Instalação oficial equivalente:** `npx skills add microsoft/playwright-cli --skill playwright-cli`; o próprio programa também tem `playwright-cli install --skills` (não use: copiamos à mão).
- **Aviso sobre o cabeçalho:** o campo `allowed-tools: Bash(playwright-cli:*) Bash(npx playwright:*) Bash(npx --no-install playwright:*)` **libera sem perguntar** qualquer comando `playwright-cli` e `npx playwright` quando a skill está ativa. Veja os cuidados.

## Como atualizar

```bash
git clone --depth 1 https://github.com/microsoft/playwright-cli.git
diff -r playwright-cli/skills/playwright-cli <caminho>/skills/sites/playwright-cli
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo. O `SKILL.md` também vem embutido no programa (`playwright-cli install --skills`); versão do programa e da skill precisam andar juntas.
