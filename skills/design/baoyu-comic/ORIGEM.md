# Origem desta skill

Cópia **sem nenhuma alteração** da skill `baoyu-comic`. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui (e o `LICENSE`, quando veio da raiz do repositório de origem).

- **Origem:** https://github.com/JimLiu/baoyu-skills, pasta `skills/baoyu-comic`, commit `bf1ff07`. Baixada em 25/11/2026, a pedido do Daniel ("salve todas, as que usam motor de imagem e as que não usam").
- **Autor e licença:** Jim Liu (宝玉), MIT (só como registro).
- **O que foi copiado:** a pasta inteira (39 arquivos): `SKILL.md`, `references/` (estilos de traço, tons, layouts de página, presets, modelos de personagem e de roteiro) e `scripts/merge-to-pdf.ts`.
- **O que ficou de fora:** as outras skills do repositório, inclusive o gerador de imagem dele (`baoyu-imagine`/`baoyu-image-gen`), que esta skill chama.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/JimLiu/baoyu-skills.git tmp
cd tmp && git sparse-checkout set skills/baoyu-comic && cd ..
diff -r tmp/skills/baoyu-comic <caminho>/skills/design/baoyu-comic
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
