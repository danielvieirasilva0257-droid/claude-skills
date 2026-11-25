# Origem desta skill

Cópia **sem nenhuma alteração** da skill `image-to-svg` do Paul Somers (shhac). Só `ORIGEM.md`, `APRENDIZADOS.md` e o `LICENSE` (copiado da raiz do repositório de origem) foram acrescentados aqui.

- **Origem:** https://github.com/shhac/skills, pasta `skills/image-to-svg`, commit `0c9cf7516ec1c8a605ac0f8e8fbe6310f6dd325d`. Baixada em 25/11/2026, aprovada pelo Daniel no mesmo dia.
- **Autor e licença:** Paul Somers (shhac), MIT (`LICENSE`, só como registro).
- **O que foi copiado:** a pasta inteira: `SKILL.md`, `analysis/`, `features/` (fichas de olhos, boca, nariz, orelhas, formato do rosto, cabelo, corpo, acessórios, comida, objetos, plantas, veículos), `styles/`, `workflow/` e `scripts/crop-tool.py`.
- **O que ficou de fora:** as outras skills do repositório shhac/skills.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/shhac/skills.git sh
cd sh && git sparse-checkout set skills/image-to-svg && cd ..
diff -r sh/skills/image-to-svg <caminho>/skills/design/image-to-svg
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
