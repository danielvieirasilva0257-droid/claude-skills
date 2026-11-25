# Origem desta skill

Cópia **sem nenhuma alteração** da skill `brand-guidelines` da Anthropic. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui.

- **Origem:** https://github.com/anthropics/skills, pasta `skills/brand-guidelines`, commit `e4bb5d960d87126ff3b3a8af1a104b7db67560ba` de 16/11/2026. Baixada em 25/11/2026, a pedido do Daniel.
- **Autor e licença:** Anthropic (`LICENSE.txt`, que já vem dentro da pasta, só como registro).
- **O que foi copiado:** a pasta inteira: `SKILL.md` e `LICENSE.txt`.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/anthropics/skills.git an
cd an && git sparse-checkout set skills/brand-guidelines && cd ..
diff -r an/skills/brand-guidelines <caminho>/skills/design/brand-guidelines
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
