# Origem desta skill

Cópia **sem alteração** do original. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui.

- **Origem:** https://github.com/heygen-com/hyperframes, commit `b5e9bc6893a7a5b4ab306151c362f46b1b24e4e1` (14/11/2026). Baixada em 14/11/2026.
- **Licença:** Apache-2.0 (`LICENSE` na raiz desta pasta).
- **O que foi copiado:** as pastas `skills/hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `remotion-to-hyperframes`, `reverse-any-video` e `style-sampling`, inteiras. Ficaram de fora `figma` e `slideshow` (não são de vídeo) e os blocos de `registry/` (o CLI instala os blocos sob demanda).
- **Por que entrou:** aprovada pelo Daniel em 14/11/2026, depois da análise do vídeo "skill vídeo claude" (`reports/Skills de vídeo com IA - análise do vídeo skill vídeo claude (2026-11-14).md`).

## Como atualizar

```bash
git clone --depth 1 https://github.com/heygen-com/hyperframes.git
diff -r hyperframes/skills/<skill> <caminho>/skills/video/hyperframes/<skill>
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
