# Origem desta skill

Cópia **sem nenhuma alteração** da skill `mascot-character-sheet`. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui (e o `LICENSE`, quando veio da raiz do repositório de origem).

- **Origem:** https://github.com/mycurelabs/easyjoey.com, pasta `.claude/skills/_branding/mascot-character-sheet`, commit `fcf3ce5`. Baixada em 25/11/2026, a pedido do Daniel ("salve todas, as que usam motor de imagem e as que não usam").
- **Autor e licença:** mycurelabs (site easyjoey.com), sem arquivo de licença no repositório (só como registro).
- **O que foi copiado:** `SKILL.md`, `references/MASCOT_DESIGN_GUIDE.md` e `scripts/generate_mascot_sheet.py` (só monta e imprime o prompt; não chama nenhuma API).
- **O que ficou de fora:** o resto do site.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/mycurelabs/easyjoey.com.git tmp
cd tmp && git sparse-checkout set .claude/skills/_branding/mascot-character-sheet && cd ..
diff -r tmp/.claude/skills/_branding/mascot-character-sheet <caminho>/skills/design/mascot-character-sheet
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
