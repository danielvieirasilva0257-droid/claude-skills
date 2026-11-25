# Origem desta skill

Cópia **sem nenhuma alteração** da skill `character-reference-sheet`. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui (e o `LICENSE`, quando veio da raiz do repositório de origem).

- **Origem:** https://github.com/shinchven/nano-banana-skills, pasta `skills/character-reference-sheet`, commit `d93dc85`. Baixada em 25/11/2026, a pedido do Daniel ("salve todas, as que usam motor de imagem e as que não usam").
- **Autor e licença:** shinchven, MIT (só como registro).
- **O que foi copiado:** só o `SKILL.md`.
- **O que ficou de fora:** as outras skills de Nano Banana do repositório.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/shinchven/nano-banana-skills.git tmp
cd tmp && git sparse-checkout set skills/character-reference-sheet && cd ..
diff -r tmp/skills/character-reference-sheet <caminho>/skills/design/character-reference-sheet
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
