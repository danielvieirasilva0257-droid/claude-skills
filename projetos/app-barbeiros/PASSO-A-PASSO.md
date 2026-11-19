# App Barbeiros — passo a passo

App mobile para o barbeiro individual controlar o resultado da própria cadeira (agenda, faturamento, comissão, metas, clientes) com uma IA que dá insights e estratégias. Identidade própria, sem relação com o Rotina.

- Plano de Negócio completo (fonte da verdade): https://claude.ai/artifact/S6HbgHKHwANXCssPUsmQAn
- Estratégias em detalhe: https://claude.ai/artifact/JbrpEkhSzYdt9dfVnwJFEP
- IA (formatos de entrada e saída): https://claude.ai/artifact/QQPZw4MEBAjgEKCeQaicGk
- **Código:** branch `app-barbeiros`, pasta `app-barbeiros/`. Lá estão `CLAUDE.md` (regras), `ESPECIFICACAO.md` (especificação completa para o Claude Code, com fases, skills e critérios de pronto) e o banco em `supabase/migrations/0001_banco_app_barbeiros_para_ia.sql` (versão 2).
- **Para construir:** no Claude Code, abra a branch `app-barbeiros` e peça: "Leia app-barbeiros/CLAUDE.md e app-barbeiros/ESPECIFICACAO.md e faça a fase atual."

## Decisões travadas (18/11/2026)

- Público do app: barbeiro individual; plano Barbearias à parte.
- Planos: Grátis, Pago R$ 19,90 (anual R$ 179), Premium R$ 59,90, Premium Plus R$ 119,90, Barbearias R$ 179 + R$ 39 por barbeiro.
- Visual: base branca, verde #15803D (dinheiro, ação), azul #1D4ED8 (IA). Mascote: nota de dinheiro com asinhas. Estilo Duolingo só em metas e resultados.
- Regra da IA: o banco calcula, a IA interpreta. Nunca inventa número.
- Comissão fixa ou escalonada (sobre o total ou por faixa), configurável.
- 67 estratégias aprovadas, gravadas no banco (T, V, A, R, P).

## Etapas e skills

| # | Etapa | Skills (caminhos) | Status |
|---|---|---|---|
| 1 | Pesquisa e estratégia | deep-research (Claude); `skills/ferramentas-de-skills/find-skills`; externas: hooked-ux, laws-of-ux, fogg-behavior-model | feito |
| 2 | Mapa de telas e fluxo | `skills/design/ui-ux-pro-max` (etapas 1–3); `skills/sites/site-architecture` adaptada | feito (27 telas) |
| 3 | Cores e identidade | `skills/design/ui-ux-pro-max` (tokens), `skills/design/estilos-premium`, `skills/design/frontend-design`, `skills/design/taste-skill`; externas: color-expert, design-color-psychology, fintech-ux | feito |
| 4 | Persuasão e gamificação | externas: hooked-ux (filtro de ética), laws-of-ux, fogg-behavior-model, duo-gamification, gamification-marketing | definido no plano |
| 5 | Design das telas | `skills/design/ui-ux-pro-max`, `skills/design/estilos-premium`, `skills/design/frontend-design`, `skills/design/image-to-code`; tipo Design do Claude; artifact-design | próximo |
| 6 | Gráficos e relatórios | dataviz (Claude); externa: financial-design-systems | próximo |
| 7 | Textos do app | `skills/combos/combo-copy-humanizada` (copywriting → humanizer), `skills/sites/cro` | próximo |
| 8 | Animações | `skills/design/motion-oficial`, `skills/design/button-animation` (receita 12, status-button, hold-to-confirm), `skills/design/animation-vocabulary`, `skills/design/review-animations`; externas RN: animations (Software Mansion), animating-react-native-expo, animation-principles | botão 3D especificado |
| 9 | Mascote | Rive (app); `skills/video/blender-ia` (versão 3D de comercial); conectores Open Art / Higgsfield (rascunhos) | próximo |
| 10 | Código | externas RN; `skills/sites/vercel-react-best-practices`; banco no Supabase | Fase 0 pronta (19/11); Fase 1 é a próxima |
| 11 | IA do app | seção 6 do plano + banco; product-self-knowledge (Claude) se usar a API da Anthropic | em conversa |
| 12 | Testes | `skills/sites/webapp-testing`, `skills/sites/playwright-cli`, `skills/sites/web-quality/accessibility`, `skills/design/web-design-guidelines`, `skills/design/review-animations` | depois |
| 13 | Site de venda | `skills/combos/combo-site-premium` | depois |
| 14 | Vídeos e tutoriais | `skills/combos/combo-video-explicativo`, `skills/video/motion-video`, `skills/video/motion-video-director`, `skills/video/blender-ia`, motion-effectcraft (Claude), conector MotionSmith | depois |
| 15 | Documentação | docs (Claude); este passo a passo | contínuo |

## Botão de conquista: "pulo com dinheiro" (aprovado em 19/11/2026)

Substituiu a versão "pulo com giro" (o giro 3D ficou opcional). Só em momentos especiais (fechar o caixa, bater a meta, conquista, upgrade). Valores:

1. Toque: afunda 4 px e encolhe para 0,97 (0–60 ms, cubic-bezier(0.33, 1, 0.68, 1)).
2. Onda: 2 ondas amarelas #FACC15 (opacidade 0,55 e 0,35) saem do centro **só dentro do botão** (overflow hidden na borda dele), passam por trás do texto, escala 0 → 1 e somem (520 ms cada, a segunda 110 ms depois, cubic-bezier(0.23, 1, 0.32, 1)).
3. Dinheiro: 12 peças (8 notas "R$" verdes, 4 moedas ouro #E3B341) num leque de 150° para cima, com giro e gravidade, somem no último terço (900–1.150 ms).
4. Subida: 48 px, escala 1,03 (60–300 ms, cubic-bezier(0.45, 0, 0.55, 1)).
5. Descida e pouso: mesma curva suave, achata 1,04 × 0,94 (300–540 ms).
6. Assentar: mini quique de 4 px (540–720 ms).

Botão em ~0,72 s. Vibração leve no toque, média no pouso, "sucesso" no final. Reduzir movimento: só troca de cor de 150 ms. Giro 3D opcional: 360° em Y com perspectiva 800. React Native: Reanimated 4 (`withSequence` + `withTiming` com `Easing.bezier`), react-native-fast-confetti ou Skia para notas e moedas, expo-haptics.

Aprendizado: o Daniel preferiu subida e descida suaves (curva ease-in-out) e mais rápidas do que a mola com quique forte da primeira versão. A onda fica dentro do botão (não vaza para fora) e é amarela.

## Combo proposto (aguardando aprovação do Daniel)

`combo-app-premium`: ui-ux-pro-max (DESIGN.md, aprovação 1) → estilos-premium + frontend-design (telas, aprovação 2) → combo-copy-humanizada → motion-oficial + button-animation + animation-vocabulary (animações, aprovação 3 por frames) → código React Native → review-animations + web-design-guidelines + accessibility (aprovação 4).

## Skills externas a aprovar

fintech-ux (ravipalwe/design-skills), color-expert (meodai/skill.color-expert), design-color-psychology (Intense-Visions/harness-engineering), hooked-ux (wondelai/skills), laws-of-ux (rolemodel/skills), fogg-behavior-model (flpbalada/fb-skills), duo-gamification (hktitan/duolingo), animations (software-mansion-labs/skills), animating-react-native-expo (tristanmanchester/agent-skills), animation-principles (dylantarre/animation-principles), financial-design-systems (wpank, ClawHub).

## Aprendizados

- O repositório ainda não tem regras de React Native: os valores de mola e curva vêm das skills web e foram convertidos para Reanimated (conferir no primeiro uso).
- `motion-oficial` e `button-animation` usam `--ease-out` cubic-bezier(0.23, 1, 0.32, 1); `ui-ux-pro-max` usa (0.16, 1, 0.3, 1). Escolhido o primeiro.
- App de dinheiro: encanto só nos momentos raros; o que se usa dezenas de vezes por dia fica rápido e sem quique.

## Fase 0: preparar o projeto (feita em 19/11/2026)

**Onde está o código:** pasta `app-barbeiros/`, commit `05db9ed` na branch `ccr-d1519fd6-fxhwi4`, feita a partir da branch `app-barbeiros` (falta levar para a `app-barbeiros`). Todos os critérios da Fase 0 em `ESPECIFICACAO.md` estão marcados.

**O que foi feito:**

1. **Projeto Expo** gerado com `create-expo-app` (modelo de abas) e refeito do nosso jeito:
   - versões: Expo SDK 58, React Native 0.88, Expo Router 58, Reanimated 4.7, TypeScript 6 estrito;
   - telas: as 5 abas (Início, Agenda, Relatórios, Clientes, Mais) e a tela Entrar, com login por e-mail e senha.
2. **Tokens:** `src/theme/tokens.ts` copiado da seção 6 da especificação, letra por letra. A fonte Inter é carregada com um nome por peso (`src/theme/fonts.ts`).
3. **Banco local:** Supabase pelo Docker, só com o que o app usa hoje (Postgres 17, login, API e o portão Kong). A migration 0001 entrou sem erro.
4. **Migration 0002 (nova):**
   - liga a proteção (RLS) na tabela `combos_padrao`. Ela era a única aberta: com a chave pública do app, qualquer pessoa conseguia apagar os combos;
   - põe o banco no horário de Brasília. Em UTC, um corte às 22h do dia 31 ia para o mês seguinte nos relatórios.
5. **Seed** (`supabase/seed.sql`): 1 barbeiro com login de teste, 7 serviços, 2 produtos, os combos padrão, 6 narrativas e 3 clientes com 3 meses de atendimentos e ofertas.
   - As datas contam a partir de hoje, então sempre existe "este mês".
   - Cada cliente conta uma história: o Rafael volta a cada 10 dias, o Bruno está agendado só para barba e o Carlos sumiu.
6. **Testes:**
   - banco (pgTAP, 13 testes): comissão de R$ 16 mil = R$ 4.640 (total) e R$ 4.140 (marginal), as ofertas do Bruno (sobrancelha, hidratação e depilação), a narrativa que fecha 4 de 6, o Carlos sumido, `pode_enviar` (sem permissão, limite semanal e domingo), um barbeiro sem ver os dados de outro e a tabela de combos protegida;
   - formatadores de moeda, porcentagem e data (Jest, 5 testes);
   - teste de fumaça no navegador: o app abre, a senha errada mostra o erro, o login entra, o Início mostra o mesmo faturamento do banco, as 5 abas abrem e "Sair" volta para Entrar.
   - O app também compila para Android.

**Comandos** (dentro de `app-barbeiros/`):

```bash
nohup dockerd > /tmp/dockerd.log 2>&1 &   # só no container da nuvem
npm install
npm run db:start      # Supabase local (imagens do Docker Hub)
npm run db:reset      # migrations + seed
npm run db:status     # URL e ANON_KEY para o .env
cp .env.example .env  # e preencha as duas linhas EXPO_PUBLIC_
npm run test:db       # testes do banco
npm run typecheck && npm test
EXPO_OFFLINE=1 npm run web:export && npm run smoke
```

Login de teste (só no banco local): `barbeiro.teste@example.com` / `senha-teste-123`.

**Aprendizados da Fase 0:**

- **Docker no container da nuvem:**
  - funciona, mas não sobe sozinho: rode `dockerd` à mão (o `service docker start` falha);
  - o registro de imagens `public.ecr.aws` responde "Data limit exceeded", então as imagens vêm do Docker Hub (`SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io`, já dentro de `scripts/supabase-local.sh`).
- **Expo no container da nuvem:** o proxy bloqueia a API da Expo. `npx expo install` e `npx expo export` só funcionam com `EXPO_OFFLINE=1`, e o `expo-doctor` passa em 18 de 20 verificações (as 2 que faltam dependem dessa API).
- **Login fora de um grupo com layout:** com `app/(auth)/_layout.tsx` e sem um `index`, o `Stack.Protected` mandava quem saía para "Tela não encontrada". Por isso a tela fica em `app/(auth)/entrar.tsx`, sem layout no grupo, e o layout raiz usa `<Stack.Screen name="(auth)/entrar" />`.
- **Barra de abas:** a altura padrão (49 px) foi feita para rótulos de 10 px. Com os nossos rótulos de 12 px em Inter, eles eram cortados; a altura passou para 58 px mais a área segura. A aba ativa fica verde e em negrito, para não depender só da cor.
- **Fonte:** com Inter, use o nome do peso (`Inter_600SemiBold`) e nunca `fontWeight`. Com `fontWeight`, o Android e a web criam um negrito falso.
- **TypeScript 6** não carrega mais os tipos do Jest sozinho: os testes importam `describe`, `it` e `expect` de `@jest/globals`.
- **Seed com datas relativas** (`pg_temp.quando(-10, '10:00')`) mantém os números de "este mês" vivos. Os testes de `pode_enviar` escolhem o próximo dia de envio (de terça a sábado) para não depender do dia da semana.

**Skills usadas:** `skills/sites/vercel-react-best-practices` (regras de re-render e de bundle aplicadas ao React Native; adendo no `APRENDIZADOS.md` dela). A externa *animating-react-native-expo não foi usada: a Fase 0 não tem animação.

## Próximo passo

1. Levar o commit da Fase 0 para a branch `app-barbeiros`.
2. **Fase 1 (design e componentes):** começa pelo `DESIGN.md` do app, que precisa da aprovação 1 do Daniel ✋. Depois vêm os componentes da seção 7 e o `ConquistaButton`, com os frames enviados para a aprovação 2 ✋.
3. Em paralelo, fechar as decisões pendentes da seção 12 da especificação: nome e logo, provedor de assinatura, provedor do LLM, arte do mascote, voz e skills externas.
