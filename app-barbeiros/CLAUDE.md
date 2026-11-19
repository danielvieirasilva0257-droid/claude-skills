# App Barbeiros — regras para o Claude Code

Esta pasta é o código do App Barbeiros. Antes de qualquer tarefa:

1. Leia `ESPECIFICACAO.md` (a especificação completa) e trabalhe **na fase atual** indicada no topo dela.
2. Ao terminar cada fase, marque os critérios de pronto em `ESPECIFICACAO.md`, atualize `../projetos/app-barbeiros/PASSO-A-PASSO.md` (na branch `main` / PR do projeto) e faça commit + push.
3. Carregue as skills da fase (tabela "Skills por fase" na especificação). Caminhos: `../skills/<categoria>/<nome>/SKILL.md`.

## Regras que nunca mudam

- **Fale com o Daniel em português do Brasil.** Código, comentários e logs podem ficar em inglês.
- **O banco calcula, a IA interpreta.** Números (faturamento, ratio, comissão, aceitação, metas) saem das views e funções do Supabase. A IA nunca recalcula nem inventa número.
- **Nunca mande telefone, nome real ou dado de pagamento do cliente para a IA.** Use "Cliente 14" e troque pelo nome só na tela.
- **Antes de qualquer mensagem automática**, chame `pode_enviar(cliente, categoria)` e respeite o resultado.
- **Chaves de API** ficam em `.env` (ignorado pelo git) e nos secrets do Supabase. Nunca no repositório.
- **Visual:** branco, verde #15803D, azul #1D4ED8 (IA). Nada do Rotina. Tokens em `src/theme/tokens.ts`; componente nunca recebe hex direto.
- **Animação:** o que se usa dezenas de vezes por dia é rápido e sem quique. Encanto (confete de dinheiro, pulo, mascote) só em metas e conquistas. Sempre respeite "reduzir movimento".
- **Acessibilidade:** toque mínimo 44×44, contraste conferido, nada informado só por cor (sempre sinal, seta ou rótulo).
- **Sem dark patterns:** cancelamento visível, sem culpa, sem contagem regressiva falsa, exportação de dados em todos os planos.
- **Peça aprovação do Daniel** nos pontos marcados com ✋ na especificação (DESIGN.md, telas, animações por frames, revisão final).
- Máquina da nuvem tem 4 CPUs e sem GPU: não rode vários builds/renders ao mesmo tempo.

## Comandos (desde a Fase 0)

Rode dentro de `app-barbeiros/`. Detalhes e porquês em `../projetos/app-barbeiros/PASSO-A-PASSO.md`.

| Comando | O que faz |
| --- | --- |
| `npm run db:start` | sobe o Supabase local (Postgres, Auth, REST) pelo Docker |
| `npm run db:reset` | recria o banco: migrations + `supabase/seed.sql` |
| `npm run test:db` | testes pgTAP do banco com o seed (`supabase/tests/`) |
| `npm run typecheck` / `npm test` | TypeScript estrito / Jest |
| `npm run web:export && npm run smoke` | teste de fumaça no navegador (abre, entra, lê `v_metricas_mes`) |

- `.env` local: copie `.env.example` e use a URL e a `ANON_KEY` de `npm run db:status`.
- **Container da nuvem:** o Docker não sobe sozinho (`nohup dockerd > /tmp/dockerd.log 2>&1 &`); as imagens vêm do Docker Hub (o script já faz isso); `npx expo install` e `npx expo export` precisam de `EXPO_OFFLINE=1`, porque o proxy bloqueia a API da Expo.
- Versões do Expo mudam a cada SDK: antes de usar uma API, confira a documentação da versão (`https://docs.expo.dev/versions/v58.0.0/`).
