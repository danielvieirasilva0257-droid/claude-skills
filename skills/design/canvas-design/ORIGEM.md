# Origem desta skill

Cópia **sem nenhuma alteração** da skill `canvas-design` da Anthropic. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui.

- **Origem:** https://github.com/anthropics/skills, pasta `skills/canvas-design`, commit `e4bb5d960d87126ff3b3a8af1a104b7db67560ba` de 16/11/2026. Baixada em 25/11/2026, a pedido do Daniel.
- **Autor e licença:** Anthropic (`LICENSE.txt`, que já vem dentro da pasta, só como registro). As fontes da pasta `canvas-fonts/` são do Google Fonts, cada uma com o seu `*-OFL.txt`.
- **O que foi copiado:** a pasta inteira: `SKILL.md`, `LICENSE.txt` e `canvas-fonts/` (cerca de 5,5 MB de fontes `.ttf`, que a skill usa para desenhar).
- **Também existe na plataforma:** a mesma skill aparece no Claude como `anthropic-skills:canvas-design`. A cópia daqui serve para o Claude Code e para outros programas.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/anthropics/skills.git an
cd an && git sparse-checkout set skills/canvas-design && cd ..
diff -r an/skills/canvas-design <caminho>/skills/design/canvas-design
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
