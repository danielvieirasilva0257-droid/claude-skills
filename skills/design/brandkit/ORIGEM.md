# Origem desta skill

Cópia **sem nenhuma alteração** da skill `brandkit` do Leonxlnx. Só `ORIGEM.md`, `APRENDIZADOS.md` e o `LICENSE` (copiado da raiz do repositório de origem) foram acrescentados aqui.

- **Origem:** https://github.com/Leonxlnx/imagegen-skills, pasta `skills/brandkit`, commit `beb16b0d0f4dae9a6f5cb04ea41e97b93a54ab8e`. Baixada em 25/11/2026, a pedido do Daniel.
- **Autor e licença:** Leonxlnx, MIT (`LICENSE`, só como registro).
- **O que foi copiado:** só o `SKILL.md` (a pasta de origem tem só ele).
- **O que ficou de fora:** as outras skills de geração de imagem do mesmo repositório (por exemplo `imagegen-frontend-web`), que não foram pedidas.
- **Instalação oficial equivalente:** `npx skills add https://github.com/Leonxlnx/imagegen-skills --skill brandkit` (não use: copiamos à mão).

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/Leonxlnx/imagegen-skills.git ig
cd ig && git sparse-checkout set skills/brandkit && cd ..
diff ig/skills/brandkit/SKILL.md <caminho>/skills/design/brandkit/SKILL.md
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
