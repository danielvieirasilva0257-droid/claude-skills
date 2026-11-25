# Origem desta skill

Cópia **sem nenhuma alteração** da skill `concept-art`. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui (e o `LICENSE`, quando veio da raiz do repositório de origem).

- **Origem:** https://github.com/omer-metin/skills-for-antigravity, pasta `skills/concept-art`, commit `e8dcf4e8737921a10088bd5c9eb65e81f74c051f`. Baixada em 25/11/2026, a pedido do Daniel ("salve todas, as que usam motor de imagem e as que não usam").
- **Autor e licença:** Omer Metin, Apache-2.0 (só como registro).
- **O que foi copiado:** `SKILL.md` e `references/` (patterns, sharp_edges, validations).
- **O que ficou de fora:** as outras skills do repositório (a irmã `character-design` já está na base).

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/omer-metin/skills-for-antigravity.git tmp
cd tmp && git sparse-checkout set skills/concept-art && cd ..
diff -r tmp/skills/concept-art <caminho>/skills/design/concept-art
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
