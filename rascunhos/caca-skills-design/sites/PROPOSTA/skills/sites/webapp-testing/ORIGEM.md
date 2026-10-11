# Origem desta skill

Cópia **sem nenhuma alteração** da skill `webapp-testing` da Anthropic. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui.

- **Origem:** https://github.com/anthropics/skills, pasta `skills/webapp-testing`, commit `dbd4588f9e1033efb41dad4bef2f7947c8993d44` de 09/10/2026. Baixada em 11/10/2026.
- **Autor e licença:** Anthropic, **Apache-2.0** (`LICENSE.txt`, que já vem dentro da pasta).
- **O que foi copiado:** a pasta inteira: `SKILL.md`, `LICENSE.txt`, `scripts/with_server.py` e `examples/` (`element_discovery.py`, `console_logging.py`, `static_html_automation.py`).
- **Skills do mesmo repositório que NÃO foram instaladas:** `frontend-design` (já é fonte da `ui-ux-pro-max`) e `web-artifacts-builder` (protótipos; opcional).
- **Instalação oficial equivalente:** `npx skills add anthropics/skills --skill webapp-testing`.

## Como atualizar

```bash
git clone --depth 1 https://github.com/anthropics/skills.git
diff -r skills/skills/webapp-testing <caminho>/skills/sites/webapp-testing
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
