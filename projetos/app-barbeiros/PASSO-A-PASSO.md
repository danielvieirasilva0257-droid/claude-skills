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
- Visual: ~~base branca, verde #15803D, azul #1D4ED8~~ → **versão 2 (20/11/2026, pelas referências do Daniel):** escuro com vidro líquido (Liquid Glass), verde-limão #C5F23A no dinheiro e na ação, lavanda #9AA8FF só na IA, pílula branca no item selecionado. **Sem mascote** (decisão do Daniel, 20/11/2026). Estilo Duolingo só em metas e resultados.
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
| 9 | ~~Mascote~~ | — | removido: o Daniel não quer mascote (20/11/2026); a celebração mostra o ícone da conquista |
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
| 1. Design e componentes | `DESIGN.md`, tokens, componentes da seção 7 (`Texto`, `Campo`, `DuoButton`, `StatusButton`, `HoldToConfirm`, `ConquistaButton` "pulo com dinheiro", `Chip`, `Cartao`, `BottomSheet`, `LockedScreen`, `InsightCard`, `MetaRing`, gráficos; o `Mascote` saiu em 20/11) e a galeria `dev/componentes` | — | `skills/design/ui-ux-pro-max`, `skills/design/button-animation`, `skills/design/motion-oficial`, `skills/design/animation-vocabulary` |
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

## Logo, modo demonstração e APK (20/11/2026)

Pedido do Daniel: "Termine o protótipo, crie uma logo e faça o APK".

1. **Logo:** poste de barbearia em verde-limão, com as listras subindo para a direita (o resultado da cadeira crescendo), sobre o preto do app.
   - A primeira ideia (três barras de gráfico com o topo inclinado) parecia o ícone de sinal do celular e foi descartada.
   - A segunda (poste com uma bola em cima) formava um "i" ao lado da palavra ("ibarbeiros"). A versão final tem pino, tampas largas em cima e embaixo e o corpo listrado.
   - Tudo em vetor, gerado por script: `scripts/gerar_marca.py` escreve os SVGs em `assets/marca/` (com a palavra "barbeiros" em curvas da Inter ExtraBold) e `scripts/renderizar-marca.mjs` gera os ícones do app (`npm run marca`). A alternativa da nota com asinhas foi descartada junto com o mascote.
   - No app: componente `Marca` (mesma geometria em `react-native-svg`) na tela de entrar.
2. **Modo demonstração** (`EXPO_PUBLIC_DEMO=1`): o app funciona no celular sem servidor.
   - `npm run demo:gravar` abre todas as telas no navegador com as contas de teste (banco local e funções locais) e grava cada resposta em `src/features/demo/gravacao.json` (cerca de 120 respostas e 4 perguntas do chat).
   - No celular, `fetchDemo` responde o Supabase (login, tabelas e funções do banco) e as funções a partir da gravação. As datas da pergunta viram relativas a hoje (D-3, M-1, sem a hora) e as da resposta andam com o calendário, então "hoje" continua hoje.
   - Na tela de entrar há um botão para cada conta (barbeiro e dono). Nada é salvo, e o Início e o Mais avisam isso.
   - A gravação só entra no build de demonstração: o `require` fica atrás de `process.env.EXPO_PUBLIC_DEMO === '1'`, que o Metro troca por um valor fixo e corta.
   - Testes: `src/features/demo/__tests__/chave.test.ts` (Jest) e `npm run demo:web && npm run demo:testar` (navegador com o servidor local **bloqueado**).
3. **APK** (`npm run apk`): Android, pacote provisório `br.com.appbarbeiros`, só arm64 (quase todos os celulares atuais; metade do tempo de build), assinado com a chave de debug (serve para instalar direto, não para a loja).

**Aprendizados do APK no container da nuvem:**

- **Rede:** o Android SDK vem de `dl.google.com` e o Supabase na nuvem de `api.supabase.com`. Os dois foram liberados no ambiente novo `claude-skills` (criado nesta sessão, com o script de preparo `npm ci`).
- **`jitpack.io` bloqueado:** o `expo-blur` do Android depende de uma biblioteca de lá. Ele ficou fora do Android (`expo.autolinking.android.exclude`), com o componente `Desfoque` por plataforma: no Android, véu escuro no lugar do desfoque.
- **Maven Central responde 429 (muitos pedidos)** ao proxy compartilhado, inclusive pelos redirecionamentos do portal de plugins do Gradle. A solução foi o espelho público do Google (`maven-central.storage-download.googleapis.com`) primeiro em todas as listas, por um `--init-script` só deste build (`scripts/apk/espelho-maven.gradle`). Um init script global em `~/.gradle` foi barrado pelo sistema de permissões.
  - Ao declarar repositório de plugin no init script, o portal padrão some: é preciso pôr `gradlePluginPortal()` e `google()` de volta.
- **Java:** o plugin do React Native pede Java 17 (o container tem 21) e o download automático (foojay) é bloqueado. Instale `openjdk-17-jdk-headless` e passe `-Porg.gradle.java.installations.paths=...`.
- **SDK novo:** o `sdkmanager` virou "Android CLI" e não tem mais `--licenses`; `yes |` com `pipefail` sai com 141 (SIGPIPE). As licenças são aceitas na própria instalação.
- **Versões do RN 0.88:** compileSdk 37, build-tools 37.0.0, NDK 27.1.12297006, AGP 9.2.1, Gradle 9.4.1.

**Pendente:** o token do Supabase colado duas vezes não é um token pessoal (a API responde "JWT could not be decoded"). Com um token `sbp_…` (Account › Access Tokens), dá para criar o projeto na nuvem (região São Paulo), aplicar as migrations e o seed, publicar as funções e gerar o APK com servidor de verdade (`EXPO_PUBLIC_DEMO=0`).

## Melhorias pedidas pelo Daniel (20/11/2026)

Pedido (por áudio): agenda com calendário no estilo Booksy/AVEC, cadastro do cliente com observações livres, bolinha que desliza na barra de abas, atendidos do dia e "Fale com a IA" no centro da aba dos três risquinhos, e uma IA de voz que mexe no app.

1. **Agenda:** calendário do mês (pontinho limão nos dias com horário marcado) e, embaixo, a grade do dia escolhido, da entrada à saída do expediente, com a pausa marcada e a linha "agora".
   - Tocar num horário abre o "CRM do agendamento": cliente, data, horário, profissional, serviços com preço, valor. O nome do cliente leva ao cadastro.
   - Tocar numa meia hora vazia abre "Agendar" já com a hora.
   - No banco: `agenda_mes` e `agenda_grade` (migration 0008). O fim de cada horário sai da duração dos serviços.
2. **Cadastro:** "Observações" (texto livre) no lugar das perguntas, mais "Técnica do corte de cabelo" e "Técnica da barba". O que estava escrito nas perguntas antigas foi para as observações.
3. **Barra de abas:** uma bolha só, que desliza da aba atual até a tocada. As abas alargam e estreitam no caminho. Rápida, sem quique, e respeita "reduzir movimento".
4. **Mais (três risquinhos):** no centro, os clientes atendidos hoje e o botão grande "Fale com a IA". O resto da tela continua igual até o Daniel detalhar.
5. **Fale com a IA:**
   - tela com a bolinha lavanda animada (respira, segue o microfone, ondula pensando, pulsa falando);
   - microfone (fala vira texto no próprio celular), teclado e botão de som; a resposta sai em voz pelo celular;
   - o agente usa Claude com ferramentas: lê agenda, números, ficha e horários livres, abre telas e **prepara** mudanças. A mudança só é gravada quando o barbeiro confirma (botão ou "sim");
   - nomes de clientes viram "Cliente N" antes da IA, até no que o barbeiro fala.

**Testes:** pgTAP 100 (9 novos), Deno 20 (5 do agente), Jest 23 (3 da confirmação falada), E2E 9 fluxos (novo `agenda_e_voz`: CRM, cadastro, meia hora vazia, a IA marca e o barbeiro confirma dizendo "sim"), axe nas telas novas.

**Aprendizados:**

- **Reanimated na web (bolha das abas):**
  - um estilo animado que lê o valor por uma função auxiliar não é atualizado na web, porque a dependência não é vista; leia `pos.value` direto dentro de cada `useAnimatedStyle`;
  - estilo fixo (altura, centralização) e largura animada no mesmo elemento fizeram a web perder a altura de 52 px. Separe: largura animada no botão (`Animated.createAnimatedComponent(Pressable)`) e o layout num `View` interno.
- **Agente com confirmação:** as ferramentas de mudança não gravam; devolvem uma ação pendente que o app mostra num cartão. Com voz isso evita erro de entendimento ("marca às 10" virar "às 2"), e o barbeiro confirma falando "sim".
- **Privacidade com voz:** o reconhecimento de fala roda no celular (o áudio não sai). O texto passa pelo mesmo anonimizador das outras funções antes da IA. Se o Daniel trocar por uma IA de voz na nuvem, o áudio com nomes vai para esse provedor: decidir com ele.
- **Não troque de branch com um build rodando:** o `git checkout` da branch do PR tirou arquivos do app por alguns segundos e o build do APK falhou. Para levar o registro ao PR, use `git worktree add` (uma cópia separada) em vez de trocar de branch na pasta principal.
- **Simulado testável:** o modo `mock` do agente usa regras simples, mas chama as mesmas ferramentas e a mesma confirmação, então os testes cobrem o caminho real até o banco.

**Pendências:** nome do botão ("Fale com a IA" provisório), as IAs de texto e voz que o Daniel vai integrar e o modelo (padrão `claude-opus-5-5` com esforço baixo; trocar para `claude-haiku-5-5` deixa mais barato e rápido, decisão dele).

## Comparações justas e dados de teste (20/11/2026)

Pedido (por áudio): "75% menor que o mês passado" no começo do mês desanima. Compare sempre **até o mesmo dia, "até aquele momento"** (hoje é dia 4 → o mês passado até o dia 4) e, embaixo, **comparado à média** ("X% acima da média" / "X% abaixo da média"). E colocar dados de teste: 4 meses (um abaixo da média, um acima, um na média e o atual), com o mês passado em R$ 10.150,82 e ticket perto de R$ 200.

1. **Banco (migration `0009_comparacao_mesmo_periodo.sql`):**
   - `corte_mes(mes, ref)`: onde a janela termina, no **mesmo dia e hora** de agora (cortado no fim de meses mais curtos); mês fechado = mês inteiro. `dia_comparavel` dá o número do dia para os textos.
   - `metricas_periodo(barbeiro, inicio, fim)` e `comparacao_mes(barbeiro, mes)`: o mês até hoje, o mesmo pedaço do mês passado, a média dos 3 meses anteriores (só os que tiveram atendimento nesse pedaço) e os 4 meses lado a lado com o "vs média" de cada um.
   - `relatorio_mes` passa a mandar `anterior` (mesmo pedaço), `variacao`, `media`, `vs_media`, `comparacao` e `meses`; o mix de serviços e produtos compara com o mesmo pedaço.
   - `painel_barbearia` (dono), `resumo_semana` (segunda até agora x segunda até o mesmo dia e hora da semana passada, e a média de 4 semanas) e `contexto_ia` com a mesma regra.
2. **Telas:** `Comparacoes` (duas linhas: "▲ 8,2% vs mês passado" e "▲ 9% acima da média"; até 3% = "≈ na média"), o período escrito no cartão ("Do dia 1 ao dia 21, comparado ao mesmo período do mês passado e à média de 3 meses"), gráfico novo `MesesComMedia` (4 meses até o mesmo dia, linha tracejada da média, cada mês dizendo acima/abaixo/na média), legendas "Mês passado até o dia N" nas barras, painel do dono e cartão da semana nos Insights.
3. **IA:** o agente de voz recebe a comparação pronta em "números do mês" e responde "Até o dia 21: 8,2% acima do mês passado e 9% acima da média". Os prompts proíbem comparar o mês pela metade com um mês inteiro.
4. **Dados de teste (fim do `supabase/seed.sql`):** 4 serviços de química (Luzes, Platinado, Selagem, Pigmentação) para o ticket chegar a R$ 200, 24 clientes de teste e um gerador com semente fixa que enche cada período até o valor pedido (contando as visitas do Rafael, Bruno e Carlos), de terça a sábado, sem encavalar horários e fora do almoço. A última visita do período leva o ajuste dos centavos (desconto no serviço mais caro). Cada mês fechado é dividido em "até o dia de hoje" e "o resto" na mesma proporção, para a comparação até o mesmo dia contar a mesma história:

   | Mês | Mês inteiro | Atendimentos | Ticket | Até o dia 21 |
   |---|---|---|---|---|
   | 3 meses atrás | R$ 8.432,40 | 44 | R$ 191,65 | 16,3% abaixo da média |
   | 2 meses atrás | R$ 11.650,00 | 57 | R$ 204,39 | 15,6% acima |
   | mês passado | R$ 10.150,82 | 51 | R$ 199,04 | na média (+0,7%) |
   | este mês (até o dia 21) | R$ 7.465,15 (às 9h) | 37 | R$ 201,76 | +8,2% vs mês passado, +9% vs média |

   Neste mês as visitas vão aumentando com os dias (rampa), então a semana também fica no verde (+2,7% vs a semana passada no mesmo momento).

**Testes:** pgTAP 116 (16 novos em `comparacao_mesmo_periodo.test.sql`), Deno 21 (resposta do agente com a comparação), Jest 25.

**Aprendizados:**

- **Comparação justa:** número parcial contra número inteiro sempre parece queda. Defina a janela no banco (dia 1 até agora, cortada no fim de meses mais curtos) e use a mesma janela no mês passado, na média e no mix. Mês fechado compara inteiro.
- **Corte pelo dia não basta, precisa da hora:** o primeiro print saiu com a semana em vermelho (▼ 18%) porque às 9h de sábado ainda não havia cliente, e a semana passada contava o sábado inteiro. Cortar no mesmo dia **e hora** resolveu (▲ 21,7%), e é o que o Daniel pediu ("até aquele momento").
- **Dados de teste que "crescem":** sorteio puro deixou a semana passada mais forte que esta (▼ 15%). Para a história do teste, este mês tem rampa (mais visitas nos dias recentes). Encaixar as visitas em sequência (e não em horários sorteados soltos) coube mais gente por dia; com horários soltos, setembro perdeu 2 visitas por falta de espaço. Quando um dia lota, a visita vai para o dia anterior, não para o começo do período.
- **Versão do APK:** o `expo prebuild` só roda na primeira vez, então mudar a versão no `app.json` não chegava ao APK (saiu 0.2.0). O `gerar-apk.sh` agora copia `version` e `versionCode` do `app.json` para o `android/app/build.gradle` a cada build.
- **"Na média" precisa de faixa:** sem ela, 0,7% acima vira "acima da média" e confunde. Até 3% de distância = "na média" (cor neutra, com o número entre parênteses).
- **Seed que bate um valor exato com datas relativas:** como as datas mudam a cada dia, o gerador mede o que já existe no período e preenche até o alvo, guiando a escolha das combinações pelo valor que falta por visita; os centavos vão na última. Com `setseed` o resultado é o mesmo em cada reset.
- **Testes presos ao dia:** dois testes de "pausa do almoço" usavam "amanhã" e falharam no sábado (domingo não tem pausa). Escolha o próximo dia útil (terça a sábado) em vez de "amanhã". Testes que contavam atendimentos fixos (16, meta de R$ 90) passaram a ler o número do banco.

## Pesquisa: IA e voz dentro do celular (21/11/2026)

O Daniel quer uma IA aberta rodando no celular (como a Google AI Edge Gallery), mexendo nas funções do app, com voz. Anotações e amostras em `research_notes/Voz no celular 2026-11/`.

- **IA:** Gemma 4 E2B (Apache 2.0, ~2,6 GB, chama funções) pela biblioteca `react-native-litert-lm` (o mesmo motor da Edge Gallery). Reserva: a IA da nuvem atual.
- **O Gemma 4 ouve, mas não fala:** entende e transcreve áudio de até 30 s; a resposta é sempre texto. A voz precisa de outro modelo.
- **ElevenLabs:** os modelos não podem ser baixados (rodam só nos servidores deles). Os repositórios de "engenharia reversa" usam o serviço sem pagar (contas automáticas, API privada do app Reader), contra os termos; não servem para um app vendido e não foram testados. Dá para usar a API oficial paga como "voz premium" opcional (precisa de internet e manda o texto falado para eles).
- **Voz no celular:** Kokoro-82M (Apache 2.0), vozes pt-BR Dora (feminina), Alex e Santa (masculinas), ~330 MB, pela `react-native-executorch` (compatível com as versões do app; fala em pedaços enquanto gera). Amostras com frases da IA do app geradas aqui.
- **Fluxo proposto:** reconhecimento de voz do celular (texto ao vivo) → Gemma 4 com as funções e a confirmação → Kokoro falando frase por frase → a voz para se o barbeiro voltar a falar.
- **Falta decidir (Daniel):** a voz (Dora, Alex ou Santa) e se faz o protótipo. Velocidade e acerto só dá para medir no celular dele.

## Voz Supertonic no app (21/11/2026)

O Daniel ouviu as amostras e escolheu o **Supertonic 3, vozes F2 e M1**.

1. **Biblioteca:** `react-native-executorch` 0.11.1 (Software Mansion), que já traz o Supertonic 3 pronto. A versão int8 (XNNPACK) tem ~144 MB (a ONNX original tem 398 MB). Só as duas vozes escolhidas são baixadas. A telemetria de download da biblioteca fica desligada (`setTelemetryEnabled(false)`).
2. **No app:** "Voz: … ›" no Fale com a IA abre a gaveta "Voz da IA" (voz do celular, F2 ou M1). Baixa uma vez, com progresso e pausa (continua de onde parou), e "Ouvir a voz". A fala é gerada no celular, pedaço por pedaço: o próximo pedaço é gerado enquanto o anterior toca (WAV no cache + `expo-audio`).
3. **Reserva:** se a voz não estiver baixada ou der erro, a IA fala com a voz do celular (`expo-speech`), sem travar a conversa.
4. **Números:** o Supertonic lê letra por letra e transformava "R$ 7.466,39" em "EDEO7 com a 6". O `textoParaFala` escreve por extenso dinheiro, porcentagem, horas, datas e números antes de falar (testes em Jest; conferido com o Supertonic e o Whisper).
5. **Licença (OpenRAIL-M):** pode em app vendido. Os Termos de Uso ganharam as regras de uso (não imitar pessoas, não enganar, não assediar...), e o app avisa que a voz é gerada por IA.
6. **Android mínimo 8.0 (SDK 26):** exigência da biblioteca, configurada pelo `expo-build-properties`. O `android/` foi recriado com `expo prebuild --clean`.

**Comandos:** `npm install react-native-executorch@0.11.1 react-native-blob-util@0.24.11`, `EXPO_OFFLINE=1 npx expo install expo-audio expo-build-properties`, `EXPO_OFFLINE=1 CI=1 npx expo prebuild --platform android --clean --no-install`, `npm run apk`.

**Aprendizados:**

- **Voz que lê letra por letra precisa de números por extenso:** teste sempre com as frases reais do app (dinheiro, horas, porcentagem), não só com texto corrido.
- **A web não roda a voz nativa:** arquivo `.native.ts` com a biblioteca e um `.ts` vazio para a web e os testes. Assim o build web e o E2E continuam funcionando.
- **Instalar código de terceiros direto do GitHub** (pip com git) foi bloqueado pela regra de segurança da sessão. Use pacotes publicados (npm, PyPI) ou só os arquivos de dados (Hugging Face).

**Falta:** testar no celular do Daniel (velocidade, qualidade da versão int8 e bateria). Se a int8 soar pior que as amostras, dá para trocar para a versão fp32 (398 MB).

## Uma IA só: Gemma 4 pensa e escreve, a voz fala junto (21/11/2026)

Pedido: o Gemma 4 faz o texto do que a IA vai falar, a voz fala ao mesmo tempo pegando o que a IA escreve, e texto e voz funcionam como uma IA só; a voz é só uma ferramenta.

1. **Cérebro no celular:** Gemma 4 E2B pela `react-native-executorch` (a mesma biblioteca da voz), versão XNNPACK 8da4w de ~3,2 GB, baixada uma vez. Sessão de conversa da biblioteca com ferramentas (`createLLMChatSession` + `toolOpts`), sem o "pensamento" do Gemma (resposta rápida) e no máximo 320 palavras-pedaço por resposta.
2. **As mesmas regras e ferramentas da nuvem:** o celular pede ao `ia-agente` `{contexto: true}` (regras curtas para modelo pequeno, lista de ferramentas, data de hoje, perfil da entrevista e a lista de clientes para o "Cliente N") e executa cada ferramenta com `{ferramenta, entrada}`. Esses modos não chamam modelo no servidor: só conferem o plano, sem gastar a cota de IA.
3. **Texto e voz juntos:** o Gemma escreve palavra por palavra; o filtro tira as chamadas de ferramenta e o resto que não é para o barbeiro; o texto aparece na bolha enquanto é escrito; cada frase completa vai para a voz (`criarFala`), que fala na ordem enquanto o Gemma escreve a próxima.
4. **Uma conversa:** "Chat com a IA" faz a entrevista inicial (na primeira vez) e abre o mesmo assistente em modo texto (`/ia/voz?modo=texto`, voz desligada). Gaveta "IA e voz": onde a IA pensa (Gemma 4 no celular ou nuvem) e a voz.
5. **Reserva:** sem o Gemma baixado, ou se ele falhar, a IA da nuvem responde aquela vez.
6. **Demonstração:** a gravação guarda as regras e as respostas das ferramentas mais comuns, então o Gemma funciona no APK de demonstração (com o modelo baixado).

**Teste com o Gemma 4 de verdade aqui (sem celular):** `scripts/gemma/validar.py` roda o Gemma 4 E2B (GGUF Q4_K_M de 3,1 GB no `llama.cpp`) com as regras e ferramentas do servidor local e o leitor de chamadas do próprio app. Comandos:
`uv venv -p 3.12 .venv && CMAKE_ARGS="-DGGML_NATIVE=ON -DLLAMA_CURL=OFF" uv pip install --python .venv llama-cpp-python jinja2` (compila em ~15 min), modelo `unsloth/gemma-4-E2B-it-GGUF`, modelo de conversa `google/gemma-4-E2B-it/chat_template.jinja`.

Resultado (7 pedidos): chama a ferramenta certa com os argumentos certos ("Cliente 2", data de amanhã, "10:00", ["Corte"]), o nome volta só na tela e na voz, prepara a mudança e pede confirmação, abre telas. Aqui gera 1 a 4 palavras-pedaço por segundo (processador do servidor, sem memória entre voltas); no celular top de linha a referência é 25 a 56.

**Aprendizados (do teste com o modelo de verdade):**

- **Parar no fim da chamada:** depois de `<tool_call|>` o Gemma começa uma "resposta da ferramenta" inventada. O app usa `stopRegex` para parar ali; sem isso, texto inventado iria para a tela e para a voz.
- **Frase pronta nas ferramentas:** ele escreveu "7563.38 reais" e esqueceu a comparação. Com um campo `resumo` em português ("No mês, até hoje: R$ 7.563,38 em 37 atendimentos. Até o dia 21: 8,2% acima...") ele repete certo. A IA da nuvem também ganha.
- **"Confirma?" sem preparar:** no começo ele pedia confirmação sem chamar a ferramenta (sem botão de confirmar). A regra "chame primeiro a ferramenta; nunca pergunte se confirma sem ter chamado" resolveu.
- **Descrição dos campos importa:** "degradê baixo" foi parar na técnica da barba até a descrição dizer "técnica do CORTE DE CABELO (ex.: degradê…)".
- **Teste o modelo pequeno com as regras reais antes do celular:** 15 minutos de compilação pouparam um ciclo de APK e mostraram 4 problemas que nenhum teste simulado pegaria.

**Falta:** testar no celular (velocidade do Gemma com a voz ao mesmo tempo, memória, bateria); com 8 GB de RAM ou mais deve ficar bom.

## IA na nuvem de graça e o celular sem travar (22/11/2026)

Pedido: o Gemma 4 no celular "não deu conta" (a tela apagou); colocar na nuvem, de graça, para testar.

1. **Celular sem travar:** a IA pensa na nuvem por padrão (chave nova da preferência, `cerebro-da-ia-v2`, então o "celular" antigo não vale mais). O Gemma 4 no celular virou experimental: só aparece com 8 GB de memória ou mais (`expo-device`, `memoria.ts` arredonda para o tamanho da caixa: 7,4 GiB = 8 GB). Trava de segurança: o app grava "em uso" antes de o Gemma carregar ou escrever e apaga depois; se abrir e achar a marca, o celular travou com ele e o Gemma fica desligado naquele aparelho ("Travou neste celular").
2. **IA da nuvem grátis:** `LLM_PROVIDER=google` usa o Google AI Studio (API Gemini) com o **Gemma 4 26B** (`gemma-4-26b-a4b-it`), com as mesmas regras e ferramentas do Gemma no celular (`sistemaDoBarbeiro` e `ferramentasParaCelular`). Cliente REST próprio em `supabase/functions/_shared/google.ts` (ferramentas, JSON e stream), sem SDK.
3. **Chave do Google:** guardada no container em `/root/.config/rotina/google-ai-studio.key` (nunca no git). Na nuvem vai como segredo `LLM_API_KEY` do Supabase.
4. **Validação com o modelo de verdade:** `supabase/functions/_dev/validar-nuvem.ts` (8 pedidos típicos pelo `ia-agente` contra o banco local). Resultado: **8 de 8** (faturamento do dia e do mês com a comparação, agenda, marcar, anotar, preço, gasto, abrir tela). Comando:
   `LLM_PROVIDER=google LLM_API_KEY=$(cat /root/.config/rotina/google-ai-studio.key) bash scripts/funcoes-env.sh deno run --config supabase/functions/deno.json -A supabase/functions/_dev/validar-nuvem.ts` (`LLM_DEBUG=1` mostra modelo, status e tempo de cada pedido).

**Aprendizados:**

- **O Gemma 4 na API do Google chama ferramentas de verdade** (`functionCall`), aceita instrução de sistema e devolve o "pensamento" separado (`thought: true`).
- **Pensar o mínimo:** com o pensamento padrão ele leva ~6 s por pedido; com `thinkingConfig: { thinkingLevel: "minimal" }`, ~1 a 2 s, acertando igual. `thinkingBudget` e `thinkingLevel: "low"` são recusados nesse modelo.
- **O grátis vive ocupado:** "high demand" (503) com frequência, limite por minuto (429) depois de uns 7 a 10 pedidos seguidos, e às vezes um pedido fica 30 a 50 s na fila. Solução: 2 novas tentativas rápidas no 503, limite de 10 s por modelo (`LLM_TEMPO_MAX_MS`) e reserva no **Gemini Flash-Lite** (`gemini-flash-lite-latest`, também grátis, ~0,6 s). O Gemma 4 31B levou 20 a 30 s e ficou fora da reserva. Com isso, os 8 pedidos ficaram entre 1,5 e 11 s.
- **Palavra solta "thought":** às vezes o Gemma deixa a palavra "thought" antes da resposta; o `textoDe` tira.
- **Rede do container:** `generativelanguage.googleapis.com` responde sem liberar nada no ambiente.
- **O formulário de credencial do ambiente só guarda chave no cabeçalho `Authorization`:** a API do Google usa `x-goog-api-key`, então a chave ficou no arquivo do container.

### Servidor na nuvem (Supabase grátis), 22/11/2026

- **Projeto:** `app-barbeiros`, ref `vhotfkqytzqbpyldkyuh`, região São Paulo (`sa-east-1`), plano Free, na organização do Daniel. Painel: `supabase.com/dashboard/project/vhotfkqytzqbpyldkyuh`. (Existe também um projeto vazio "danielvieirasilva0257-droid's Project" nos EUA, criado pelo Daniel; não é usado.)
- **Token e segredos no container** (nunca no git), em `/root/.config/rotina/`: `supabase.token` (token pessoal `sbp_`, 30 dias), `supabase-app-barbeiros-db.pass` (senha do banco), `google-ai-studio.key`, `revenuecat-webhook-auth`.
- **Como foi montado (tudo pela API de gestão, sem Docker):**
  1. `POST /v1/projects` com `region: sa-east-1`.
  2. Migrations e seed por `POST /v1/projects/<ref>/database/query` (um arquivo por chamada, em ordem) e registro das versões em `supabase_migrations.schema_migrations` (para o `supabase db push` saber o que já foi aplicado).
  3. Segredos das funções: `LLM_PROVIDER=google`, `LLM_API_KEY`, `REVENUECAT_WEBHOOK_AUTH` (`POST /v1/projects/<ref>/secrets`).
  4. Funções: `SUPABASE_ACCESS_TOKEN=$(cat /root/.config/rotina/supabase.token) SSL_CERT_FILE=/root/.ccr/ca-bundle.crt npx supabase functions deploy --use-api --remote=<ref> --yes <funções>` (o CLI 3.2 pede `--yes` quando roda por agente).
  5. Auth: sem confirmação de e-mail (`mailer_autoconfirm`), `site_url` `appbarbeiros://` (`PATCH /v1/projects/<ref>/config/auth`).
  6. Vault para as rotinas agendadas: `url_funcoes` e `chave_servico` (`vault.create_secret`).
- **Contas de teste (do seed):** `dono.teste@example.com` e `gratis.teste@example.com`, senha `senha-teste-123`. A conta `barbeiro.teste` (plano Plus, 27 clientes, 194 atendimentos) passou a ser a do Daniel: entra com o Gmail e a senha que ele criou no app (a conta vazia que ele tinha criado foi apagada e o nome, a entrevista e a senha dela foram para a conta de teste). Para recriar a conta de teste num banco novo, rode o seed.
- **Teste na nuvem:** login + `ia-agente` ("Quanto eu faturei no mês?" → "R$ 7.910,87 em 39 atendimentos… 8,2% acima do mês passado e 9% acima da sua média"; agendamento preparado). Primeira chamada ~16 s (função fria), depois 7 a 13 s.
- **APK com servidor:** `.env.nuvem` (ignorado pelo git) e
  `set -a && . ./.env.nuvem && set +a && EXPO_NO_DOTENV=1 EXPO_PUBLIC_DEMO=0 npm run apk` (`EXPO_NO_DOTENV=1` para o `.env` local, que aponta para 127.0.0.1, não entrar no APK).

- **Conta de desenvolvedor (pedido do Daniel):** plano novo `dev` ("Desenvolvedor"), acima de todos e nunca vendido: libera tudo do Premium Plus e o painel do dono (Barbearias), 500 perguntas por dia à IA. Migrations `0010_plano_desenvolvedor.sql` (só o valor novo do enum: ele não pode ser usado na mesma transação em que foi criado) e `0011_conta_desenvolvedor.sql` (as funções que conferem o plano pelo nome). No app, `src/lib/plano.ts` (o `dev` só aparece na tela de planos para quem tem) e `libera()` não quebra com um plano que a versão não conhece. A conta do Daniel ficou `dev` (`app_assinatura` com provedor `manual`) e virou a dona da "Barbearia Navalha" (o Dono Teste passou a barbeiro), para ver o painel do dono com equipe.

**Aprendizados do servidor:**

- **Token do Supabase agora é "com escopo":** na página Access Tokens, escolha "todos os projetos das organizações selecionadas" (o projeto ainda não existe), a organização e "Acesso total". O token continua começando com `sbp_`.
- **Credencial salva no ambiente pode ficar presa:** o proxy continuou mandando uma chave antiga para `api.supabase.com` mesmo depois de salvar a nova várias vezes (resposta "JWT could not be decoded" e cabeçalho `X-Proxy-Error: upstream auth failed`). A saída foi um ambiente novo (`app-barbeiros`) sem segredo de rede e o token no arquivo do container.
- **O host do projeto (`<ref>.supabase.co`) precisa ser liberado no ambiente** para testar login e funções daqui; o celular não depende disso.

## IA que fala enquanto escreve e tem controle total (22/11/2026)

Pedido: a IA demorava porque gerava a resposta inteira e só depois falava; e não conseguia fazer contas de períodos (ex.: ticket médio dos últimos 4 dias), criar relatórios nem mudar uma comanda específica.

1. **Falar enquanto escreve:** `ia-agente` com `stream: true` responde em Server-Sent Events: `{t:'ferramenta', nome}` quando a IA vai consultar algo, `{t:'texto', d}` enquanto escreve e `{t:'fim', ...}` no fim. O app (`falarComAgenteStream` + `criarDivisorDeFrases` + `criarFala`) mostra o texto chegando e fala cada frase assim que fecha. Enquanto consulta, diz uma frase de espera ("Vou olhar sua agenda.", `src/features/ia/assistente/espera.ts`).
   - O servidor devolve o nome real sem cortar "Cliente 12" no meio (`criarRevelador`) e tira a palavra solta "thought" que o Gemma às vezes escreve.
   - Medido (servidor local, modelo real): consulta aos 2 s, primeiras palavras aos 4,7 s, fim aos 5,3 s. Na nuvem, medido daqui (EUA): 4,6 s, 6,5 s e 7,0 s.
2. **Controle total (migration `0012_ia_controle_total.sql`, 20 testes pgTAP):**
   - `analisar_periodo`: qualquer período, com filtro (cliente, serviço, pagamento) e agrupamento (dia, semana, mês, dia da semana, hora, serviço, cliente, pagamento). O banco calcula; a IA recebe o dinheiro já escrito como "R$ 1.234,56".
   - `listar_atendimentos`, `editar_atendimento` (serviços, valor total repartido na proporção, pagamento, dia e hora, cliente, observação; respeita o caixa fechado), `apagar_atendimento`, e a ferramenta `reabrir_caixa`.
   - `relatorios_ia`: as páginas HTML que a IA monta (`criar_relatorio`, `_shared/relatorio.ts`), com os números do banco, guardadas e abertas na tela `/ia/relatorio/[id]` (WebView, botão "Compartilhar PDF"). Lista em "Relatórios da IA" (Mais).
   - As regras da IA ganharam as datas prontas (ontem, últimos 7 dias, esta semana, semana passada, este mês, mês passado, este ano), porque o modelo erra ao contar dias.
3. **Validação com o modelo real** (`_dev/validar-nuvem.ts`, 12 pedidos): todos certos, como "ticket médio dos últimos 4 dias" (R$ 212,00, igual ao banco), "dia da semana que mais faturou" (sexta) e "faz um relatório da semana passada". Também mudou a comanda do Lucas do dia 20/11 para pix, preparada com o botão de confirmar. `VALIDAR_SO="relatório|comanda"` roda só alguns. `_dev/medir-stream.ts "pergunta"` mede o tempo do stream.

4. **Conversa mãos livres (0.7.1):** um toque no microfone e a conversa segue sozinha. Quando a IA termina de falar, o microfone abre de novo (depois de 350 ms, para não pegar o fim da voz dela). Tocar enquanto ela fala interrompe e escuta. Silêncio, abrir o teclado, abrir outra tela ou o botão "Encerrar" terminam a conversa. Interromper só falando por cima dela ficou para depois: o microfone do celular escuta a própria voz da IA.

5. **A voz começa nas 5 primeiras palavras (pedido do Daniel):** `criarDivisorDeFrases` solta o primeiro pedaço assim que há 5 palavras completas (palavra completa = seguida de espaço, então um valor chegando nunca é cortado). Depois segue por frase, cortando na vírgula ou a cada 15 palavras numa frase longa. O pedaço nunca termina em "R$" nem em "Cliente" (o número do cliente vem depois).

**Aprendizados:**

- **O plano grátis do Google tem limite por minuto** (uns 15 pedidos por modelo), e cada pergunta gasta de 2 a 3 pedidos (consulta + resposta). Testes em sequência batem no limite: espere um minuto ou rode só alguns casos. Para um barbeiro só testando, dá.
- **Gemma na API aceita stream** (`streamGenerateContent`) com ferramentas: a chamada da ferramenta vem nos pedaços do stream.
- **Rotas tipadas do Expo Router** só se atualizam com o servidor de desenvolvimento ligado (`npx expo start` por uns segundos), não com `expo export`.
- **Função que cria tabela temporária** não pode ser `stable` no Postgres ("INSERT is not allowed in a non-volatile function").

## Pendências (fora do código)

1. **Modelo da IA:** para testar, a nuvem usa o Gemma 4 grátis do Google AI Studio (com o Flash-Lite de reserva). Para lançar, decidir entre continuar no Google (plano pago tira os limites) ou voltar para o Claude (`LLM_PROVIDER=anthropic`).
2. **Login com Google:** precisa das credenciais do Google Cloud.
3. **WhatsApp e Instagram de verdade:** credenciais da Meta (app, número, tokens); hoje roda em modo simulado.
4. **Assinaturas:** conta no RevenueCat, produtos nas lojas (entitlements `pago`, `premium`, `plus`, `barbearias`) e as chaves `EXPO_PUBLIC_REVENUECAT_*` e `REVENUECAT_WEBHOOK_AUTH`.
5. **Revisão jurídica** de `legal/termos-de-uso.md` e `legal/politica-de-privacidade.md` (razão social, CNPJ, encarregado, prazos).
6. **Nome** (a logo já existe; o pacote `br.com.appbarbeiros` é provisório).
7. **MEI 2026:** limite de R$ 81 mil por ano e DAS de serviços R$ 86,05 (5% do salário mínimo de R$ 1.621 + R$ 5 de ISS), gravados em `parametros` por ano. Conferir quando sair o salário mínimo de 2027.

## Próximo passo

1. Daniel instala o APK 0.6.0 (ligado ao servidor na nuvem), entra com o Gmail dele (a conta com os dados de teste) e testa a IA por voz e por texto.
2. Rodar os fluxos do Maestro (`app-barbeiros/.maestro/`) no celular.
3. Depois do app: site de venda (`skills/combos/combo-site-premium`) e vídeos (`skills/combos/combo-video-explicativo`).
