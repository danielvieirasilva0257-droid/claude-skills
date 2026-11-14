# Origem desta skill

Cópia **sem alteração** do original. Só `ORIGEM.md` e `APRENDIZADOS.md` foram escritos aqui.

- **Origem:** https://github.com/elevenlabs/skills, commit `1d84076319721b3e0b3c8189c76e91a0d859d9d4` (13/11/2026). Baixada em 14/11/2026.
- **Licença:** MIT (`LICENSE` na raiz desta pasta).
- **O que foi copiado:** as pastas `text-to-speech`, `sound-effects`, `music`, `speech-to-text`, `voice-isolator` e `voice-changer`, inteiras. Ficaram de fora `agents`, `realtime`, `speech-engine`, `dubbing`, `onboarding` e `setup-api-key` (são de agente de voz ou de configuração, não de vídeo).
- **Por que entrou:** aprovada pelo Daniel em 14/11/2026 ("aprovo tudo"), depois da análise do vídeo "skill vídeo claude" (`reports/Skills de vídeo com IA - análise do vídeo skill vídeo claude (2026-11-14).md`).

## Como atualizar

```bash
git clone --depth 1 https://github.com/elevenlabs/skills.git
diff -r skills/<skill> <caminho>/skills/audio/elevenlabs/<skill>
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
