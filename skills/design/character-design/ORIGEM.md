# Origem desta skill

Cópia **sem nenhuma alteração** da skill `character-design` do Omer Metin (repositório skills-for-antigravity). Só `ORIGEM.md`, `APRENDIZADOS.md` e o `LICENSE` (copiado da raiz do repositório de origem) foram acrescentados aqui.

- **Origem:** https://github.com/omer-metin/skills-for-antigravity, pasta `skills/character-design`, commit `e8dcf4e8737921a10088bd5c9eb65e81f74c051f`. Baixada em 25/11/2026, aprovada pelo Daniel no mesmo dia.
- **Autor e licença:** Omer Metin, Apache-2.0 (`LICENSE`, só como registro).
- **O que foi copiado:** `SKILL.md` e `references/` (patterns, sharp_edges, validations).
- **O que ficou de fora:** a irmã `founder-character` e as outras skills do repositório.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/omer-metin/skills-for-antigravity.git om
cd om && git sparse-checkout set skills/character-design && cd ..
diff -r om/skills/character-design <caminho>/skills/design/character-design
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
