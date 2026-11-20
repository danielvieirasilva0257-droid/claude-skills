# App Barbeiros — passo a passo

App mobile para o barbeiro individual controlar o resultado da própria cadeira (agenda, faturamento, comissão, metas, clientes) com uma IA que dá insights e estratégias. Identidade própria, sem relação com o Rotina.

- Plano de Negócio completo (fonte da verdade): https://claude.ai/artifact/S6HbgHKHwANXCssPUsmQAn
- Estratégias em detalhe: https://claude.ai/artifact/JbrpEkhSzYdt9dfVnwJFEP
- IA (formatos de entrada e saída): https://claude.ai/artifact/QQPZw4MEBAjgEKCeQaicGk
- **Código:** branch `app-barbeiros`, pasta `app-barbeiros/`. Lá estão `CLAUDE.md` (regras), `ESPECIFICACAO.md` (especificação completa, com fases, skills e critérios de pronto), `DESIGN.md` (visual v2), `REVISAO-FINAL.md` e o banco em `supabase/migrations/` (0001 a 0007).
- **Para construir:** no Claude Code, abra a branch `app-barbeiros` e peça: "Leia app-barbeiros/CLAUDE.md e app-barbeiros/ESPECIFICACAO.md e faça a fase atual."

## Decisões travadas (18/11/2026)

- Público do app: barbeiro individual; plano Barbearias à parte.
- Planos: Grátis, Pago R$ 19,90 (anual R$ 179), Premium R$ 59,90, Premium Plus R$ 119,90, Barbearias R$ 179 + R$ 39 por barbeiro.
- Visual: ~~base branca, verde #15803D, azul #1D4ED8~~ → **versão 2 (20/11/2026, pelas referências do Daniel):** escuro com vidro líquido (Liquid Glass), verde-limão #C5F23A no dinheiro e na ação, lavanda #9AA8FF só na IA, pílula branca no item selecionado. Mascote: nota de dinheiro com asinhas. Estilo Duolingo só em metas e resultados.
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
| 5 | Design das telas | `skills/design/ui-ux-pro-max`, `skills/design/estilos-premium`, `skills/design/frontend-design`, `skills/design/image-to-code`; tipo Design do Claude; artifact-design | feito (v2 vidro líquido, 20/11) |
| 6 | Gráficos e relatórios | dataviz (Claude); externa: financial-design-systems | feito |
| 7 | Textos do app | `skills/combos/combo-copy-humanizada` (copywriting → humanizer), `skills/sites/cro` | feito (rascunhos legais aguardam revisão jurídica) |
| 8 | Animações | `skills/design/motion-oficial`, `skills/design/button-animation` (receita 12, status-button, hold-to-confirm), `skills/design/animation-vocabulary`, `skills/design/review-animations`; externas RN: animations (Software Mansion), animating-react-native-expo, animation-principles | feito e revisado |
| 9 | Mascote | Rive (app); `skills/video/blender-ia` (versão 3D de comercial); conectores Open Art / Higgsfield (rascunhos) | provisório em SVG; arte final no Rive pendente |
| 10 | Código | externas RN; `skills/sites/vercel-react-best-practices`; banco no Supabase | Fases 0 a 8 prontas (20/11) |
| 11 | IA do app | seção 6 do plano + banco; claude-api (Claude) | feito (modo simulado; chave e modelo a decidir) |
| 12 | Testes | `skills/sites/webapp-testing`, `skills/sites/playwright-cli`, `skills/sites/web-quality/accessibility`, `skills/design/web-design-guidelines`, `skills/design/review-animations` | feito (Fase 8) |
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

## Combo criado: `combo-app-premium` (20/11/2026)

`skills/combos/combo-app-premium/SKILL.md`: ui-ux-pro-max + estilos-premium (DESIGN.md ✋) → combo-copy-humanizada → motion-oficial + button-animation + animation-vocabulary (frames ✋) → código RN (vercel-react-best-practices) → dataviz e claude-api → testes (webapp-testing, playwright-cli, accessibility; prints ✋) → review-animations + web-design-guidelines (✋ final). Tem os avisos aprendidos neste projeto.

## Skills externas a aprovar

fintech-ux (ravipalwe/design-skills), color-expert (meodai/skill.color-expert), design-color-psychology (Intense-Visions/harness-engineering), hooked-ux (wondelai/skills), laws-of-ux (rolemodel/skills), fogg-behavior-model (flpbalada/fb-skills), duo-gamification (hktitan/duolingo), animations (software-mansion-labs/skills), animating-react-native-expo (tristanmanchester/agent-skills), animation-principles (dylantarre/animation-principles), financial-design-systems (wpank, ClawHub).

## Aprendizados

- O repositório ainda não tem regras de React Native: os valores de mola e curva vêm das skills web e foram convertidos para Reanimated (conferir no primeiro uso).
- `motion-oficial` e `button-animation` usam `--ease-out` cubic-bezier(0.23, 1, 0.32, 1); `ui-ux-pro-max` usa (0.16, 1, 0.3, 1). Escolhido o primeiro.
- App de dinheiro: encanto só nos momentos raros; o que se usa dezenas de vezes por dia fica rápido e sem quique.

## Fase 0: preparar o projeto (feita em 19/11/2026)

**Onde está o código:** pasta `app-barbeiros/`, branch `app-barbeiros`. Todos os critérios da Fase 0 em `ESPECIFICACAO.md` estão marcados.

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

## Fases 1 a 8 (feitas de 19 a 20/11/2026)

**Onde está o código:** pasta `app-barbeiros/` na branch `app-barbeiros` (commits do dia 19 e 20/11; o último registra a Fase 8). Cada fase tem os critérios marcados e um parágrafo "Como ficou" em `ESPECIFICACAO.md`. A revisão final está em `app-barbeiros/REVISAO-FINAL.md`.

| Fase | O que entrou | Banco | Skills usadas (caminhos) |
|---|---|---|---|
| 1. Design e componentes | `DESIGN.md`, tokens, componentes da seção 7 (`Texto`, `Campo`, `DuoButton`, `StatusButton`, `HoldToConfirm`, `ConquistaButton` "pulo com dinheiro", `Chip`, `Cartao`, `BottomSheet`, `LockedScreen`, `InsightCard`, `MetaRing`, `Mascote`, gráficos) e a galeria `dev/componentes` | — | `skills/design/ui-ux-pro-max`, `skills/design/button-animation`, `skills/design/motion-oficial`, `skills/design/animation-vocabulary` |
| 2. Grátis (telas 1–5) | entrar, primeiro uso, Início, Agenda (lançar em 2 toques, "Ofereceu algo?", fechar o caixa), Serviços, Mais (exportar CSV em todo plano, cancelar sem culpa) | `0003` | `skills/combos/combo-copy-humanizada`, `skills/sites/vercel-react-best-practices` |
| 3. Pago (telas 6–15) e IA | clientes e ficha, gastos, financeiro, meta, relatórios, insights, chat, coach, comissão e extrato com PDF, MEI; Edge Functions de IA | `0004` | dataviz (Claude), claude-api (Claude), `skills/combos/combo-copy-humanizada` |
| 4–5. Premium e Plus (telas 16–23) | expediente e lista de espera, WhatsApp com IA (assumir conversa), automações por `pode_enviar`, mensagens e LGPD, Instagram, prospecção por palavra-código, personalidade da IA | `0005` | claude-api (Claude) |
| Visual v2 | escuro com vidro líquido pelas referências do Daniel: componentes `Vidro`, `Aurora` e `BarraAbas` flutuante com o botão redondo "+" | — | `skills/design/ui-ux-pro-max`, `skills/design/estilos-premium` |
| 6. Barbearias (telas 24–27) | painel do dono, equipe com convite por código, agenda da equipe, relatório por barbeiro | `0006` | dataviz (Claude) |
| 7. Assinaturas | loja pelo RevenueCat (só no celular), tela Planos com renovação e teste grátis, cancelar pela mesma loja; rascunhos de termos e privacidade | `0007` | `skills/combos/combo-copy-humanizada` |
| 8. Qualidade | Jest (16), pgTAP (91), Deno (15), E2E (8 fluxos), axe em 16 telas, 4 fluxos do Maestro escritos, revisão de animação e de interface | — | `skills/design/review-animations`, `skills/design/web-design-guidelines`, `skills/sites/web-quality/accessibility`, `skills/sites/webapp-testing`, `skills/sites/playwright-cli` |

**Comandos** (dentro de `app-barbeiros/`, depois dos da Fase 0):

```bash
npm run funcoes:dev    # funções de IA, canais e assinatura no Deno (porta 54329), modo simulado
npm run test:db        # 91 testes do banco
npm run db:reset && npm run test:funcoes   # 15 testes das funções (criam dados: banco novo antes)
npm run typecheck && npm test              # TypeScript estrito e 16 testes Jest
EXPO_OFFLINE=1 npm run web:export
npm run e2e            # 8 fluxos no navegador (recria o banco antes de cada um)
npm run a11y           # axe (WCAG 2.2 AA) em 16 telas
npm run legal          # texto dos termos e da privacidade no app, a partir de legal/*.md
EXPO_OFFLINE=1 npx expo export --platform android   # confere que o Android compila
```

Logins de teste (só no banco local, senha `senha-teste-123`): `barbeiro.teste@example.com` (Premium Plus, com dados), `gratis.teste@example.com` (Grátis, sem primeiro uso), `dono.teste@example.com` (Barbearias, dono da "Barbearia Navalha").

**Aprendizados das Fases 1 a 8:**

- **O banco calcula, a tela só formata:** até a soma de preços no lançamento saiu da tela ("R$ 45 + R$ 35" em vez do total). Plano, valor da equipe, variações e comissão vêm de funções SQL.
- **Segurança no banco:**
  - nunca "fingir ser outro usuário" com `set_config` dentro de função: passe o barbeiro de forma explícita e rode com as permissões de quem chama (quem pede o de outro recebe vazio);
  - `revoke ... from anon` sozinho não tira o acesso, porque o `anon` herda do `PUBLIC`: use `from public, anon` (e `authenticated` quando for só do servidor);
  - quem vê dados de outro (dono da equipe) lê só por funções que conferem o papel; as tabelas de cada barbeiro não ganharam política nova.
- **Plano numa função só (`plano_efetivo`):** assinatura própria, Premium vindo da equipe do plano Barbearias e 3 horas de tolerância para a renovação da loja chegar. App, IA, cron e canais leem dela.
- **Expo Router:** depois de criar rota nova, as rotas tipadas só atualizam com `EXPO_OFFLINE=1 CI=1 timeout 40 npx expo start --web --port 8099`. Redirecionamento do primeiro uso com `<Redirect>` explícito (o `Stack.Protected` mandava para `/planos`).
- **Deno (Edge Functions):** versões de pacote com pelo menos 2 semanas; `deno.json` com `"nodeModulesDir": "none"` para não misturar com o `node_modules` do app; `DENO_CERT=/root/.ccr/ca-bundle.crt` por causa do proxy.
- **SQL:** `generate_series` só em `timestamp` (não em `time`); apelido de tabela igual ao nome de variável do laço dá conflito no PL/pgSQL; `jsonb_build_object('lista', '["a"]')` vira texto, use `'["a"]'::jsonb`.
- **Gráficos (dataviz):** o cinza para "mês anterior" reprovou no teste de daltonismo; ficou um par de verdes (`#6E8F1F` e `#C5F23A` no escuro).
- **Visual v2:** vidro com `expo-glass-effect` só no iOS 26 (nos outros, translúcido + desfoque + brilho); face de botão sobre lábio colorido precisa de cor opaca (o lábio vermelho aparecia e escondia o texto).
- **E2E:** banco recriado antes de cada fluxo; celebrações em sequência usam o mesmo painel; procurar texto dentro do `testID` da tela, porque a tela anterior continua montada e escondida.
- **axe no React Native Web:** `aria-checked` em vez de `accessibilityState.checked`; `Pressable` com rótulo precisa de papel; área de rolagem com `tabIndex={0}` no navegador.

## Pendências (fora do código)

1. **Modelo da IA:** o padrão é `claude-opus-5-5` (regra da skill da API). Para o custo-alvo de R$ 0,50 a R$ 2 por barbeiro por mês, a troca para `claude-haiku-5-5` é decisão do Daniel (`LLM_MODEL`). Falta a chave da API nos secrets do Supabase.
2. **Login com Google:** precisa das credenciais do Google Cloud.
3. **WhatsApp e Instagram de verdade:** credenciais da Meta (app, número, tokens); hoje roda em modo simulado.
4. **Assinaturas:** conta no RevenueCat, produtos nas lojas (entitlements `pago`, `premium`, `plus`, `barbearias`) e as chaves `EXPO_PUBLIC_REVENUECAT_*` e `REVENUECAT_WEBHOOK_AUTH`.
5. **Revisão jurídica** de `legal/termos-de-uso.md` e `legal/politica-de-privacidade.md` (razão social, CNPJ, encarregado, prazos).
6. **Nome, logo, `bundleIdentifier`/`package`** e a **arte final do mascote** no Rive.
7. **MEI 2026:** limite de R$ 81 mil por ano e DAS de serviços R$ 86,05 (5% do salário mínimo de R$ 1.621 + R$ 5 de ISS), gravados em `parametros` por ano. Conferir quando sair o salário mínimo de 2027.

## Próximo passo

1. Daniel olha os prints, testa num build de desenvolvimento e decide as pendências acima.
2. Rodar os fluxos do Maestro (`app-barbeiros/.maestro/`) no celular.
3. Depois do app: site de venda (`skills/combos/combo-site-premium`) e vídeos (`skills/combos/combo-video-explicativo`).
