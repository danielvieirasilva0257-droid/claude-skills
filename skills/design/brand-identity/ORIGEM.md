# Origem desta skill

Cópia **sem nenhuma alteração** da skill `brand-identity` da RampStack. Só `ORIGEM.md`, `APRENDIZADOS.md` e o `LICENSE` (copiado da raiz do repositório de origem) foram acrescentados aqui.

- **Origem:** https://github.com/rampstackco/claude-skills, pasta `skills/brand-identity`, commit `9d281db6e7a5c4a0084ba89c91633a07f5f7e42b`. Baixada em 25/11/2026, a pedido do Daniel.
- **Autor e licença:** RampStack Co., MIT (`LICENSE`, só como registro).
- **O que foi copiado:** a pasta inteira: `SKILL.md`, `README.md` e `references/` (`identity-system-spec.md`, `contrast-and-accessibility.md`).
- **O que ficou de fora:** a skill cita irmãs do mesmo repositório que **não** foram instaladas: `brand-ideation` (antes, para posicionamento e nome), `brand-style-guide` (depois, para documentar o sistema), `brand-voice` (tom de voz), `design-standards` e `design-system`. Se fizerem falta, dá para trazer depois do mesmo repositório.

## Como atualizar

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/rampstackco/claude-skills.git rs
cd rs && git sparse-checkout set skills/brand-identity && cd ..
diff -r rs/skills/brand-identity <caminho>/skills/design/brand-identity
```

Se houver novidade, mostre ao Daniel antes de substituir e anote aqui o commit novo.
