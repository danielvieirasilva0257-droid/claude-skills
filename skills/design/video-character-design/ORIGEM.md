# Origem desta skill

Cópia **sem nenhuma alteração** da skill `video-character-design`. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui (e o `LICENSE`, quando veio da raiz do repositório de origem).

- **Origem:** https://github.com/agentara/skills, pasta `skills/aigc/video-character-design`, commit `950e1bf`. Baixada em 25/11/2026, a pedido do Daniel ("salve todas, as que usam motor de imagem e as que não usam").
- **Autor e licença:** agentara, MIT (só como registro).
- **O que foi copiado:** só o `SKILL.md`.
- **O que ficou de fora:** as outras skills do repositório.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/agentara/skills.git tmp
cd tmp && git sparse-checkout set skills/aigc/video-character-design && cd ..
diff -r tmp/skills/aigc/video-character-design <caminho>/skills/design/video-character-design
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
