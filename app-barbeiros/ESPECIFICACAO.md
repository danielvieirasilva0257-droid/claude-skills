# App Barbeiros — especificação para construir no Claude Code

**Fase atual:** Fase 7 (Assinaturas) · Fases 0 a 3 prontas em 19/11/2026; Fases 4, 5 e 6 e o visual v2 (vidro líquido) prontos em 20/11/2026
**Versão:** 1.1 · 19/11/2026
**Fonte de negócio:** Plano de Negócio — App Barbeiros (https://claude.ai/artifact/S6HbgHKHwANXCssPUsmQAn). Se algo aqui contradizer o plano, pergunte ao Daniel.

---

## 0. Como usar este documento

No Claude Code, abra o repositório `danielvieirasilva0257-droid/claude-skills`, branch `app-barbeiros`, pasta `app-barbeiros/`, e diga:

> Leia app-barbeiros/CLAUDE.md e app-barbeiros/ESPECIFICACAO.md e faça a fase atual.

Cada fase tem: o que construir, skills a carregar, critérios de pronto (caixas `- [ ]`) e pontos de aprovação ✋. Só avance de fase com todos os critérios marcados.

---

## 1. O produto em uma página

App mobile para o **barbeiro individual** (comissionado, que aluga cadeira ou autônomo/MEI) controlar o resultado da própria cadeira, com uma IA que analisa os números e ensina a vender mais, reter e conquistar clientes.

| Plano | Preço | Libera |
| --- | --- | --- |
| Grátis | R$ 0 | agenda, lançamentos, serviços, perfil |
| Pago | R$ 19,90/mês (anual R$ 179) | clientes, gastos, financeiro, meta, relatórios, comissão, MEI, IA (insights, chat, coach de vendas) |
| Premium | R$ 59,90/mês | + WhatsApp com IA, automações, lista de espera, 100 mensagens de marketing/mês |
| Premium Plus | R$ 119,90/mês | + Instagram com IA (comentários, direct, prospecção) |
| Barbearias | R$ 179 + R$ 39 por barbeiro a partir do 3º | painel do dono, equipe, agenda da equipe, relatório por barbeiro |

Diferencial: registro de oferta → narrativa → aceitação; comissão escalonada; combos feitos no mesmo tempo; IA que adapta tudo ao público (A, B, C, D) e à estratégia (volume ou ticket).

---

## 2. Stack (fixa)

| Camada | Escolha |
| --- | --- |
| App | Expo (SDK estável mais recente, mínimo 53 por causa do Rive) + React Native + TypeScript estrito |
| Navegação | Expo Router (abas + stacks) |
| Animação | react-native-reanimated 4 + react-native-gesture-handler |
| Mascote | @rive-app/react-native (exige dev build, não roda no Expo Go) |
| Confete / partículas | react-native-fast-confetti ou @shopify/react-native-skia |
| Vibração / som | expo-haptics / expo-audio (som desligado por padrão) |
| Gráficos | @shopify/react-native-skia (ou victory-native, que usa Skia) |
| Dados | Supabase: Auth, Postgres, Row Level Security, Edge Functions (Deno), Cron |
| Estado / cache | @tanstack/react-query (servidor) + zustand (estado local) |
| Formulários | react-hook-form + zod |
| Datas | date-fns com locale pt-BR, fuso America/Sao_Paulo |
| Dinheiro | o banco usa `numeric(10,2)` e faz as contas; no app só formate com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`, sem somar floats na tela |
| Assinaturas | **decisão pendente** (RevenueCat sobre as lojas, ou gateway próprio). Não implemente pagamento antes da Fase 7 |
| IA de texto | Edge Function chamando o provedor de LLM via API; provedor configurável por variável de ambiente |
| Voz (opcional, Premium) | ElevenLabs (voz Flash) + transcrição; só depois da Fase 3 |
| Testes | Jest + @testing-library/react-native; Maestro para fluxos E2E; pgTAP ou script SQL para o banco |

---

## 3. Estrutura de pastas

```
app-barbeiros/
├── CLAUDE.md
├── ESPECIFICACAO.md
├── .env.example                 # nomes das variáveis, sem valores
├── app/                         # Expo Router
│   ├── (auth)/entrar.tsx
│   ├── (tabs)/_layout.tsx       # abas: Início, Agenda, Relatórios, Clientes, Mais
│   ├── (tabs)/index.tsx         # Início
│   ├── (tabs)/agenda.tsx
│   ├── (tabs)/relatorios.tsx
│   ├── (tabs)/clientes.tsx
│   ├── (tabs)/mais.tsx
│   └── ...                      # demais telas como stacks
├── src/
│   ├── theme/tokens.ts          # cores, tipografia, espaço, raio, movimento
│   ├── components/              # DuoButton, ConquistaButton, StatusButton, HoldToConfirm, MetaRing, InsightCard, ...
│   ├── features/<modulo>/       # agenda, atendimentos, clientes, financeiro, comissao, relatorios, ia, planos
│   ├── lib/supabase.ts
│   ├── lib/format.ts            # moeda, datas, porcentagem
│   └── lib/plano.ts             # quais telas cada plano libera
├── supabase/
│   ├── migrations/0001_banco_app_barbeiros_para_ia.sql
│   ├── functions/ia-insights/   # Edge Functions (Deno)
│   ├── functions/ia-chat/
│   ├── functions/ia-narrativa/
│   ├── functions/ia-entrevista/
│   └── seed.sql                 # dados de exemplo para desenvolvimento
└── assets/rive/mascote.riv      # nota de dinheiro com asinhas (Fase 2)
```

---

## 4. Configuração

```bash
# dentro de app-barbeiros/
npx create-expo-app@latest . --template tabs   # se a pasta app/ ainda não existir
npx expo install react-native-reanimated react-native-gesture-handler expo-haptics expo-router
npm i @supabase/supabase-js @tanstack/react-query zustand react-hook-form zod date-fns
npx supabase init            # se ainda não houver supabase/config.toml
npx supabase start           # Postgres local (precisa de Docker; sem Docker, use um projeto Supabase de teste)
npx supabase db reset        # aplica migrations + seed
```

Variáveis (`.env.example`, valores só no `.env` local e nos secrets do Supabase):

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
# secrets das Edge Functions (supabase secrets set ...)
LLM_PROVIDER=
LLM_API_KEY=
LLM_MODEL=
WHATSAPP_TOKEN=              # Fase 4
INSTAGRAM_TOKEN=             # Fase 5
ELEVENLABS_API_KEY=          # opcional
```

---

## 5. Banco de dados

Arquivo: `supabase/migrations/0001_banco_app_barbeiros_para_ia.sql` (versão 2, testado em Postgres local com dados de exemplo). Cada barbeiro só vê os próprios dados (RLS por `auth.uid()`). `barbeiros.id` = `auth.users.id`: crie a linha do barbeiro no primeiro login.

**Tabelas principais:** barbeiros, perfis_publico, servicos, combinacoes_servico, combos_padrao, experiencias_premium, produtos, clientes, cliente_recorrencia, atendimentos, atendimento_itens, ofertas, narrativas, jornada_etapas, followups, regras_comissao, faixas_comissao, vales, gastos, metas, ia_insights, estrategias (67 linhas), barbeiro_estrategias, mimos_recebidos, eventos_cliente, consentimentos, contatos_enviados, lista_espera, fidelidade, planos_assinatura, assinaturas, origens.

**Views (o app só lê):** v_visitas, v_atendimento_resumo, v_metricas_mes, v_mix_servicos_mes, v_mix_produtos_mes, v_aceitacao_item, v_aceitacao_narrativa, v_cliente_servico_status, v_cliente_frequencia, v_clientes_sumidos, v_tempo_real_servico, v_saude_cadeira, v_assinaturas_uso.

**Funções (chamar com `supabase.rpc`):**

| Função | Para quê |
| --- | --- |
| `sugerir_ofertas(atendimento)` | até 3 ofertas (recorrente na hora, combo fácil, reforço de meta de extras) com a melhor narrativa |
| `sugerir_metas(barbeiro, mes)` | metas do mês pela média de 3 meses, clientes ativos, capacidade e estratégia |
| `calcular_comissao(barbeiro, base, data)` | comissão fixa ou escalonada (total ou marginal) |
| `proxima_faixa(barbeiro, base)` | quanto falta para a próxima faixa |
| `extrato_mes(barbeiro, mes)` | bruto, taxas, insumos, base, comissões, vales, aluguel, líquido |
| `gerar_followups(barbeiro)` | cria pós-venda, lembrete de serviço recorrente e reativação (rodar 1×/dia via Cron) |
| `problemas_cadeira(barbeiro)` | pontos fracos detectados |
| `sugerir_estrategias(barbeiro, limite)` | estratégias do catálogo para o público e os problemas |
| `pode_enviar(cliente, categoria, quando)` | libera ou bloqueia mensagem (LGPD, limites, horário) com o motivo |

**Mudanças no banco:** sempre em nova migration (`0002_...sql`), nunca editando a 0001 depois de aplicada. Funções que o app chama via RPC e que leem dados de outros barbeiros não podem existir: todas devem respeitar RLS (as views usam `security_invoker`).

**Conferências já feitas:** cliente agendado só para barba recebeu hidratação (recorrente, 29 dias), depilação (22 dias) e sobrancelha (cliente deitado), com a narrativa que fecha 67%; comissão de R$ 16 mil = R$ 4.640 (total) e R$ 4.140 (marginal); `pode_enviar` bloqueou sem permissão, no domingo e após o limite semanal.

---

## 6. Design (tokens)

**Versão 2 (20/11/2026):** o Daniel trocou a direção visual para **escuro com vidro líquido (Liquid Glass)**, com 6 referências de app financeiro. A fonte da verdade dos valores é `src/theme/tokens.ts` e o porquê de cada um está no `DESIGN.md`. Resumo:

- Fundo `#050506`; vidro = branco 6% com desfoque, borda branca 10% e brilho branco 22% no alto (`GlassView` nativo no iOS 26, desfoque no Android e na web); véu preto 62%.
- Texto `#F4F4F0`, texto secundário `#A1A19A` (contrastes de 6:1 a 18:1 conferidos).
- Dinheiro e ação: verde-limão `#C5F23A` (lábio `#9DC42A`, texto sobre ele `#0B0F02`). IA: lavanda `#9AA8FF`. Selecionado: pílula branca com texto escuro.
- Risco `#FFB020`, prejuízo/erro `#FF6464`, conquista `#F5C451`, onda `#FACC15`, notinhas `#22C55E`.
- Raios 10 / 16 / 24 / pílula. Espaço, tipografia (Inter por peso, números tabulares) e movimento iguais à versão 1 (curvas `easeOut` 0.23,1,0.32,1 e `easeInOut` 0.45,0,0.55,1; molas `springBack` 500/18/0,6 e `springCalm` 620/36/0,6).

Regras: números com `fontVariant: ['tabular-nums']`; um botão principal por tela; sem sombra borrada (profundidade pelo vidro); nunca vidro sobre vidro; gasto comum em texto neutro com "−"; nada só por cor.

## 7. Componentes base

| Componente | Comportamento |
| --- | --- |
| `DuoButton` | botão principal verde, lábio sólido de 4px, raio 16, altura 52. Toque: desce 4px em 60 ms + `Haptics.impactAsync(Light)`; solta com `motion.springBack` |
| `SecondaryButton` | contorno 1px, mesma altura e raio, escala 0,97 ao tocar |
| `ConquistaButton` | variante do DuoButton para momentos especiais (ver abaixo) |
| `StatusButton` | Salvar → spinner só após 200 ms (mínimo 400 ms) → "✓ Salvo"; largura fixa; trava duplo envio |
| `HoldToConfirm` | segurar 2 s para apagar lançamento, cancelar horário, excluir cliente |
| `MetaRing` | anel de progresso; verde no caminho, âmbar em risco; mola com amortecimento ~0,65 |
| `InsightCard` | fundo azul suave, ícone, título até 5 palavras, número, por quê, ação, botão |
| `Chip` | serviços e formas de pagamento; pop 0,96 → 1 ao escolher |
| `BottomSheet` | sobe com `motion.springCalm` |
| `LockedScreen` | cadeado no metal do plano + prévia borrada com dados reais + "Conhecer o plano" |
| `Mascote` | Rive com estados: parado, comemorando, pensando, preocupado leve |

### ConquistaButton ("pulo com dinheiro") — aprovado em 19/11

Usar só em: fechar o caixa do dia, bater 50%/100% da meta, recorde, marco de sequência, upgrade de plano.

| Fase | Tempo | O que faz |
| --- | --- | --- |
| Toque | 0–60 ms | desce 4px, escala 0,97, lábio some · haptic Light |
| Onda | 0–630 ms | 2 círculos `color.wave` (opacidade 0,55 e 0,35) crescem do centro **dentro do botão** (`overflow: 'hidden'` no botão, texto por cima) · 520 ms cada, o 2º com 110 ms de atraso, `easeOut` |
| Dinheiro | 60 ms → ~1,2 s | 12 peças (8 notas "R$" `color.bill`, 4 moedas `color.gold`) em leque de 150° para cima, giram, caem com gravidade e somem no último terço |
| Subida | 60–300 ms | sobe 48px, escala 1,03, `easeInOut` |
| Descida e pouso | 300–540 ms | desce, achata 1,04 × 0,94 · haptic Medium no pouso |
| Assentar | 540–720 ms | mini quique de 4px · `Haptics.notificationAsync(Success)` no fim |
| Giro 3D | opcional | 360° em Y com `perspective: 800` (primeiro item do transform) |

```tsx
// esboço (Reanimated 4)
const y = useSharedValue(0), sx = useSharedValue(1), sy = useSharedValue(1);
const ease = Easing.bezier(0.45, 0, 0.55, 1);
function play() {
  if (reduceMotion) { /* só troca de cor de 150 ms */ return; }
  y.value = withSequence(
    withTiming(4, { duration: 60, easing: Easing.bezier(0.33, 1, 0.68, 1) }),
    withTiming(-48, { duration: 240, easing: ease }),
    withTiming(2, { duration: 240, easing: ease }),
    withTiming(-4, { duration: 80 }),
    withTiming(0, { duration: 100 }),
  );
  // sx/sy: 0,97 → 1,03 → 1,04×0,94 no pouso → 1; ondas e partículas disparam em paralelo
}
const style = useAnimatedStyle(() => ({
  transform: [{ perspective: 800 }, { translateY: y.value }, { scaleX: sx.value }, { scaleY: sy.value }],
}));
```

Reduzir movimento: ler `useReducedMotion()` e ouvir `AccessibilityInfo.addEventListener('reduceMotionChanged')`; sem onda, sem dinheiro, sem pulo.

Protótipo de referência (HTML) aprovado pelo Daniel na conversa: valores acima são a fonte.

---

## 8. Telas (27) e onde ficam

Abas: **Início · Agenda · Relatórios · Clientes · Mais**. O resto abre como stack a partir delas. Telas de plano superior aparecem com `LockedScreen`.

| # | Tela | Plano | Rota |
| --- | --- | --- | --- |
| 1 | Entrar e perfil inicial (preço do corte, público, modelo de trabalho, estratégia) | Grátis | `(auth)/entrar`, `onboarding` |
| 2 | Início: lucro/faturamento de hoje, próximos horários, "+ Atendimento" fixo embaixo à direita, olho para esconder valores | Grátis | `(tabs)/index` |
| 3 | Agenda do dia: lançar em 2 toques; "Ofereceu algo?" no fim; ticks salvo/sincronizado/caixa fechado | Grátis | `(tabs)/agenda` |
| 4 | Serviços: preço, duração, principal/adicional, intervalo de recorrência, combos simultâneos | Grátis | `servicos` |
| 5 | Perfil e configurações: plano, exportar dados, cancelar plano, sair | Grátis | `(tabs)/mais` |
| 6 | Clientes: faixa de sumidos, ficha (técnica, bebida, assunto, datas, recorrência, pode receber oferta) | Pago | `(tabs)/clientes`, `cliente/[id]` |
| 7 | Gastos | Pago | `gastos` |
| 8 | Financeiro: faturamento, gastos, lucro por dia/semana/mês | Pago | `financeiro` |
| 9 | Meta do mês: meta sugerida, `MetaRing`, "faltam R$ X, uns N cortes" | Pago | `meta` |
| 10 | Relatórios e gráficos: ratio, ticket, barras por serviço e produto vs mês anterior, aceitação, ocupação, faltas, retorno, mapa de calor | Pago | `(tabs)/relatorios` |
| 11 | Insights da IA: até 3 cards + resumo semanal em carrossel | Pago | `insights` |
| 12 | Chat com a IA + entrevista inicial | Pago | `ia/chat` |
| 13 | Coach de vendas e narrativas (até 4 por serviço), mensagens prontas | Pago | `coach` |
| 14 | Comissão e extrato (configurar regra; extrato com cascata; PDF/WhatsApp) | Pago | `comissao`, `extrato` |
| 15 | MEI: acumulado vs R$ 81 mil, DAS | Pago | `mei` |
| 16 | Horários, expediente e lista de espera | Premium | `expediente` |
| 17 | WhatsApp: conexão, conversas da IA, assumir conversa | Premium | `whatsapp` |
| 18 | Automações e estratégias automáticas ligadas | Premium | `automacoes` |
| 19 | Uso de mensagens e permissões (LGPD) | Premium | `mensagens` |
| 20 | Instagram: conexão | Plus | `instagram` |
| 21 | Comentários e direct | Plus | `instagram/caixa` |
| 22 | Prospecção: funil e origem por canal | Plus | `prospeccao` |
| 23 | Personalidade da IA | Plus | `ia/personalidade` |
| 24 | Painel do dono | Barbearias | `barbearia` |
| 25 | Equipe | Barbearias | `barbearia/equipe` |
| 26 | Agenda da equipe | Barbearias | `barbearia/agenda` |
| 27 | Relatório por barbeiro | Barbearias | `barbearia/barbeiro/[id]` |

---

## 9. IA

**Regra 1:** a Edge Function lê as views/funções, monta o JSON com números prontos e anonimizados, chama o LLM e grava o resultado. O LLM só escreve texto.

| Edge Function | Quando roda | Entrada (do banco) | Saída (grava em) |
| --- | --- | --- | --- |
| `ia-insights` | Cron diário às 6h (fuso do barbeiro) e ao fechar o caixa | v_metricas_mes, v_mix_servicos_mes, v_aceitacao_*, proxima_faixa, sugerir_metas, problemas_cadeira | `ia_insights` (até 3 por dia) |
| `ia-chat` | sob demanda | pergunta + resumo de métricas do período pedido | resposta em streaming (não grava números novos) |
| `ia-narrativa` | ao pedir narrativa no Coach | serviço, público, estilo, momento, narrativas atuais e aceitação | rascunho em `narrativas` (`criada_pela_ia = true`), o barbeiro edita e salva |
| `ia-entrevista` | primeiro uso | respostas das 8 perguntas | `barbeiros.ia_perfil`, `jornada_etapas` |

**Gatilhos de insight** (o banco detecta, a IA escreve): queda de serviço ≥ 20%; déficit no mix; superávit; aceitação < 15% com 10+ ofertas; narrativa vencedora; ratio caindo; produto parado 30 dias; faixa de comissão a até 15%; meta em risco; clientes sumidos. No máximo 3, prioridade: dinheiro em jogo > meta > oportunidade > elogio. Com < 10 ofertas: "ainda são poucos dados".

**Entrevista inicial (8 perguntas):** preço do corte e clientes por dia · foco (agenda cheia ou ticket) · atendimento da chegada à saída · o que muda entre 1ª visita e seguintes · extras e quais faz ao mesmo tempo · experiência oferecida · como chama o cliente depois · como consegue clientes novos.

**Prompt de sistema base:**

```
Você é o coach de negócios dentro de um app para barbeiros brasileiros.
Você recebe métricas JÁ CALCULADAS pelo app. Nunca recalcule nem invente números.
1. Transforme os sinais recebidos em no máximo 3 insights curtos.
2. Cada insight: título (até 5 palavras), número que prova, por quê (1 frase), ação para hoje.
3. Priorize: dinheiro em jogo > meta > oportunidade > elogio.
4. Fale como um barbeiro experiente e parceiro, adaptado ao público do barbeiro (A, B, C ou D).
5. Com menos de 10 ofertas, diga que ainda são poucos dados.
6. Nunca prometa resultado financeiro. Nunca peça dados pessoais de clientes.
7. Responda apenas no formato JSON combinado.
```

**Formato de saída de `ia-insights`:**

```json
{ "insights": [ { "tipo": "oportunidade", "titulo": "Hidratação em baixa",
  "numero": "7 este mês (12 no anterior)", "porque": "Você ofereceu bastante, mas aceitaram menos.",
  "acao": "Use a narrativa 'Mesmo tempo', que fecha 2 de cada 3.", "botao": "Ver narrativa", "sinal": "queda_servico" } ] }
```

Validar a saída com zod antes de gravar; se falhar, não mostra nada (nunca um texto quebrado). Controle de custo: insights 1×/dia guardados; `max_tokens` baixo; chat com limite diário por plano. Custo alvo: R$ 0,50 a R$ 2 por barbeiro/mês.

---

## 10. Mensagens (Premium e Plus)

- Toda mensagem automática passa por `pode_enviar` e é registrada em `contatos_enviados`.
- Limites: marketing 1/semana e 4/mês por cliente; 7 dias sem marketing após a visita; 2 lembretes por horário; reativação até 3 tentativas; 1 mensagem por dia por cliente pela prioridade (recuperação > lembrete > pós-venda > reagendamento > aniversário > produto > promoção); envio ter–sáb, 9h–12h ou 18h–20h no fuso do barbeiro.
- Marketing só com consentimento registrado (`consentimentos`); "SAIR" encerra na hora.
- WhatsApp: API oficial da Meta; fora da janela de 24 h só modelos aprovados.
- Instagram: só responde quem comentou, respondeu story, mencionou ou mandou mensagem; 1 resposta privada por comentário em até 7 dias; conversa segue só dentro de 24 h. **Nunca** mensagem para quem só curtiu.

---

## 11. Fases, skills e critérios de pronto

Skills do repositório ficam em `../skills/...`. Externas (marcadas com *) ainda precisam da aprovação do Daniel para entrar no repositório: se não estiverem lá, siga os valores desta especificação.

### Fase 0 — Preparar o projeto
Skills: `../skills/sites/vercel-react-best-practices` (partes React); *animating-react-native-expo.
- [x] Projeto Expo + TypeScript estrito + Expo Router com as 5 abas vazias
- [x] `src/theme/tokens.ts` igual à seção 6 e fonte Inter carregada
- [x] Supabase local (ou projeto de teste) com a migration 0001 aplicada sem erro
- [x] `supabase/seed.sql` com 1 barbeiro, 7 serviços, combos padrão, 3 clientes, 3 meses de atendimentos e ofertas
- [x] `.env.example` e `.gitignore` (sem segredos)
- [x] Teste de fumaça: o app abre, faz login de teste e lê `v_metricas_mes`

**Como ficou (19/11/2026):**
- Expo SDK 58 · React Native 0.88 · React 19.3 · Expo Router 58 · Reanimated 4.7 · TypeScript 6 (estrito + `noUncheckedIndexedAccess`). Rive, Skia e confete entram na Fase 1.
- Supabase local pelo Docker (Postgres 17): `npm run db:start` e `npm run db:reset` (migrations + seed). Login de teste: `barbeiro.teste@example.com` / `senha-teste-123` (só no banco local).
- **Migration 0002** (nova): (1) liga RLS em `combos_padrao`, que era a única tabela aberta (com a chave pública dava para apagar os combos); (2) põe o banco no fuso `America/Sao_Paulo`, porque em UTC um corte às 22h do dia 31 caía no mês seguinte nas views.
- Seed com datas relativas a hoje (horário de Brasília). Ele reproduz as conferências da seção 5, que viraram teste: `npm run test:db` (pgTAP, 13 testes).
- Teste de fumaça: `npm run web:export && npm run smoke` (Playwright: abre, senha errada mostra erro, entra, Início mostra o faturamento igual ao do banco, as 5 abas abrem, sair volta para Entrar). O bundle Android também compila (`npx expo export --platform android`).
- Login da Fase 0 é só e-mail e senha; Google, cadastro, linha em `barbeiros` no 1º login e onboarding ficam na Fase 2. O botão da Fase 0 (`BotaoProvisorio`) é trocado pelo `DuoButton` na Fase 1.
- Rotas: a tela de login fica em `app/(auth)/entrar.tsx` **sem** `_layout` no grupo (com layout e sem `index`, quem saía caía em "Tela não encontrada"). O layout raiz usa `Stack.Protected`.

### Fase 1 — Design e componentes ✋
Skills: `../skills/design/ui-ux-pro-max` (DESIGN.md), `../skills/design/estilos-premium`, `../skills/design/frontend-design`, `../skills/design/taste-skill`, `../skills/design/motion-oficial`, `../skills/design/button-animation`, `../skills/design/animation-vocabulary`; *fintech-ux, *color-expert.
- [x] `DESIGN.md` do app (cena, tokens, componentes, estados) ✋ aprovação 1 (Daniel aprovou tudo em 19/11)
- [x] Componentes da seção 7 com todos os estados (normal, foco, pressionado, desativado, carregando, vazio, erro)
- [x] `ConquistaButton` igual à tabela; frames de início, meio e fim enviados ao Daniel ✋ aprovação 2 (aprovado em 19/11)
- [x] Reduzir movimento funcionando em todos os componentes

**Como ficou (19/11/2026):** `DESIGN.md` na pasta do app; componentes em `src/components/` (mais `Texto`, `Cartao` e `Estado` para vazio, carregando e erro); curvas e "reduzir movimento" em `src/theme/motion.ts` (`useMovimentoReduzido` lê o sistema e ouve a mudança); anel de foco só com teclado (`useFocoVisivel`). Galeria em `/dev/componentes` (só com `EXPO_PUBLIC_GALERIA=1`) e `npm run galeria` tira os prints e os frames do `ConquistaButton` com o relógio do navegador parado (0, 60, 180, 300, 420, 540, 720, 900 e 1.210 ms). Decisões: notas e moedas com Reanimated (12 `Animated.View`, sem Skia); gráficos com `react-native-svg`; mascote em SVG com os 4 estados até a arte final do Rive.

### Fase 2 — Plano Grátis (telas 1–5) ✋
Skills: `../skills/design/ui-ux-pro-max`, `../skills/combos/combo-copy-humanizada` (textos), `../skills/sites/cro` (onboarding).
- [x] Login (Google + e-mail) e criação da linha em `barbeiros`
- [x] Onboarding com preço do corte, público, modelo de trabalho e estratégia
- [x] Lançar atendimento em 2 toques; "Ofereceu algo?" grava em `ofertas`
- [x] Serviços com combos e recorrência
- [x] Exportar dados (CSV) e cancelar plano visíveis
- [x] Prints das telas no celular ✋ aprovação 3 (Daniel aprovou tudo em 19/11)

**Como ficou (19/11/2026):** migration `0003` com o plano do app (`app_assinatura`, só o servidor muda; `meu_plano()`), gatilho que cria `barbeiros` + plano Grátis no cadastro, `configurar_inicio` (onboarding: perfil + 7 serviços com preço proporcional ao corte + combos padrão), `lancar_atendimento`, `registrar_oferta`, `concluir_atendimento`, `mudar_pagamento`, `resumo_dia`, `agenda_dia`, `fechar_caixa`/`reabrir_caixa` e `exportar_atendimentos`; taxa da maquininha por barbeiro. Telas: Entrar/Criar conta (e-mail e Google), onboarding em 4 passos, Início (hoje, lucro, próximos, olho), Agenda (2 toques, "Ofereceu algo?", agendar, concluir, falta, cancelar e apagar segurando 2 s, fechar o caixa com o `ConquistaButton`), Serviços, Planos e Mais (maquininha, exportar CSV, cancelar plano sempre visível). Clientes e Relatórios mostram a `LockedScreen` com prévia dos dados reais no Grátis. Testes: `supabase/tests/fase2_plano_gratis.test.sql` (16) e `npm run e2e` (onboarding e bloqueios; lançar, ofertar e fechar o caixa). **Pendente fora do código:** ligar o Google no Supabase (ID e segredo do Google Cloud); sem isso o botão mostra "Entrar com Google ainda não foi ligado neste servidor".

### Fase 3 — Plano Pago (telas 6–15) e IA
Skills: dataviz (Claude) para os gráficos, *financial-design-systems, `../skills/combos/combo-copy-humanizada`; para a IA, a seção 9.
- [x] Clientes com ficha e faixa de sumidos (`v_clientes_sumidos`)
- [x] Financeiro, Meta (`sugerir_metas`), Relatórios com todos os indicadores e gráficos da seção 8
- [x] Comissão fixa/escalonada e extrato (`extrato_mes`, `proxima_faixa`) com cascata e PDF
- [x] MEI com alerta em 80% e 100%
- [x] `sugerir_ofertas` mostrado quando o cliente senta, com narrativa
- [x] Edge Functions `ia-insights`, `ia-chat`, `ia-narrativa`, `ia-entrevista` com saída validada
- [x] Celebrações com `ConquistaButton` e mascote em 50%/100% da meta
- [x] `LockedScreen` com prévia borrada para quem está no Grátis

**Como ficou (19/11/2026):** migration `0004` (parâmetros por ano com MEI 2026: limite R$ 81 mil, DAS serviços R$ 86,05; `v_clientes_lista`, `financeiro`, `progresso_meta`, `definir_meta`, conquistas, `v_mapa_calor`, `relatorio_mes`, `resumo_semana`, regra de comissão com faixas que emendam, `extrato_completo`, `mei_ano`, `sinais_insights`, `contexto_ia` sem nome nem telefone, `consumir_ia` com limite diário por plano). Edge Functions em `supabase/functions/` com o SDK oficial da Anthropic (`@anthropic-ai/sdk` 1.10.0): saída estruturada (`zodOutputFormat`) validada de novo com zod, `fallbacks: "default"` para recusa, chat em streaming, nomes trocados por "Cliente N" e de volta só na tela; **o número de cada insight é o do banco, nunca o da IA**. `LLM_PROVIDER=mock` (padrão) escreve textos a partir dos números, sem custo; `LLM_PROVIDER=anthropic` + `LLM_API_KEY` usa a IA de verdade. **Modelo:** `LLM_MODEL` vem `claude-opus-5-5` (o padrão da skill da API); para caber no custo-alvo de R$ 0,50 a R$ 2 por barbeiro/mês, a troca para `claude-haiku-5-5` é decisão do Daniel (seção 12). Gráficos com cores validadas pela skill `dataviz` (`src/theme/grafico.ts`), uma série por eixo, legenda, toque para ver o valor e "Ver em tabela". Testes: pgTAP (15 novos), Deno das funções (6, `npm run test:funcoes`) e E2E do plano Pago (insights, relatórios, meta com celebração de 50%, comissão, extrato, clientes, entrevista, chat, coach, MEI, financeiro, ofertas na cadeira) e do bloqueio no Grátis.

### Fase 4 — Premium (telas 16–19)
- [x] Expediente e lista de espera (estratégia V1)
- [x] WhatsApp oficial conectado; IA responde e agenda; "assumir conversa" · testado no modo simulado; o número real precisa das credenciais da Meta (seção 12)
- [x] Automações das estratégias com `automatizavel = true`, todas passando por `pode_enviar`
- [x] Contador das 100 mensagens e tela de permissões
- [x] Cron de `gerar_followups` 1×/dia

**Como ficou (20/11/2026):** migration `0005` (`expediente`, `horarios_livres`, `canais` + `canais_segredos` sem acesso pelo app, `conversas`, `mensagens`, `mensagens_fila` com 1 mensagem por cliente/estratégia/dia, `uso_mensagens_mes`, `planejar_automacoes` para R4, A15, R6, R9 e R12, gatilho da lista de espera V1, `registrar_envio`, `rotina_diaria`). Tudo que sai automático passa por `pode_enviar` antes de entrar na fila e de novo na hora de enviar. Edge Functions `whatsapp-webhook` (verificação da Meta e assinatura `X-Hub-Signature-256`), `canal-enviar` (texto livre só na janela de 24 h; fora dela, modelo aprovado), `canal-conectar` e `enviar-fila`; a IA atendente oferece só horários de `horarios_livres` e agenda pelo banco. `CANAIS_MODO=simulado` (padrão) grava a mensagem sem mandar para a Meta. Cron (pg_cron + pg_net + Vault): insights às 6 h, rotina diária às 8 h (follow-ups e automações) e fila a cada hora, no horário de Brasília. Telas 16 a 19 com E2E (conversa da IA, assumir e devolver, automações).

### Fase 5 — Premium Plus (telas 20–23)
- [x] Instagram oficial; respostas privadas só para quem levantou a mão · testado no modo simulado; a conta real precisa das credenciais da Meta
- [x] Funil de prospecção com origem por palavra-código
- [x] Personalidade da IA

**Como ficou (20/11/2026):** `instagram-webhook` guarda comentários e directs; `pode_responder_instagram` libera 1 resposta privada por comentário, até 7 dias, só quando a pessoa pediu (palavra-código ou pergunta). `v_funil_prospeccao` (chamaram → agendaram → vieram → voltaram, com custo por cliente) e `v_origem_clientes`; a palavra-código ("REELS") manda a origem para a ficha do cliente. `barbeiros.ia_personalidade` entra no prompt do atendente. Telas 20 a 23 com E2E.

### Fase 6 — Barbearias (telas 24–27)
- [x] Papel "dono" e "barbeiro" com RLS próprio (nova migration)
- [x] Painel, equipe, agenda da equipe e relatório por barbeiro

**Como ficou (20/11/2026):** migration `0006` com `barbearias`, `barbearia_membros` (papel `dono` ou `barbeiro`; um barbeiro em uma barbearia por vez; um dono por barbearia) e `barbearia_convites` (código de 6 letras sem I, O, 0 e 1, uso único, vale 7 dias). RLS próprio: a equipe lê a barbearia e os nomes; só o dono lê os convites; entrar, sair, convidar e remover só por funções. **As tabelas de cada barbeiro não ganharam política nova:** o dono lê a equipe só por `painel_barbearia`, `agenda_equipe` e `relatorio_barbeiro`, que conferem o papel; ele vê números e agenda (só o primeiro nome do cliente), nunca telefone, gastos pessoais nem conversas. `plano_efetivo()` virou a fonte única do plano: quem está na equipe de um dono com plano Barbearias usa o app como Premium; `meu_plano`, `consumir_ia`, `uso_mensagens_mes`, a rotina diária e as funções de canais e insights passaram a usá-la. Valor do plano pela equipe calculado no banco (R$ 179 com até 2 barbeiros + R$ 39 por barbeiro a mais; parâmetros `barbearias_*`). `relatorio_mes` virou `relatorio_mes_de(barbeiro, mês)` com as permissões de quem chama; a tela 27 reusa o mesmo conteúdo da aba Relatórios (`ConteudoRelatorio`). Telas: `barbearia` (sem barbearia: entrar com código ou criar; barbeiro da equipe: o que o dono vê e "Sair"; dono: painel), `barbearia/equipe`, `barbearia/agenda`, `barbearia/barbeiro/[id]`, cartão da casa no Início do dono e "Barbearia" no Mais. Seed com `dono.teste@example.com` (Barbearia Navalha, com o Barbeiro Teste na equipe). Testes: pgTAP (26 novos), Deno (1 novo) e E2E `barbearias` (painel, agenda, relatório, convite, barbeiro Grátis entra e vira Premium, valor sobe para R$ 218, dono remove).

### Fase 7 — Assinaturas e lançamento ✋
- [ ] Provedor de assinatura decidido pelo Daniel e integrado
- [ ] Preço de renovação claro, teste grátis com aviso, cancelamento pelo mesmo canal
- [ ] Termos de uso e política de privacidade (revisão jurídica)

### Fase 8 — Qualidade (em todas as fases)
Skills: `../skills/design/review-animations`, `../skills/design/web-design-guidelines`, `../skills/sites/web-quality/accessibility`, `../skills/sites/webapp-testing`, `../skills/sites/playwright-cli`.
- [ ] Testes unitários dos formatadores e da lógica de planos
- [x] Teste SQL das funções do banco com o seed (comissão total e marginal, ofertas, `pode_enviar`) · `supabase/tests/`, desde a Fase 0
- [ ] Fluxos E2E: lançar atendimento, fechar caixa, bater meta, configurar comissão
- [ ] Revisão de animação e acessibilidade ✋ aprovação final

### Depois do app
- Site de venda: `../skills/combos/combo-site-premium`.
- Vídeos e tutoriais: `../skills/combos/combo-video-explicativo`, `../skills/video/motion-video`, `../skills/video/blender-ia`.

---

## 12. Decisões pendentes (perguntar ao Daniel)

1. Nome do app e logo.
2. Provedor de assinatura (RevenueCat ou gateway próprio).
3. Provedor e modelo do LLM.
4. Arte final do mascote (nota de dinheiro com asinhas) no Rive.
5. Voz no Premium (ElevenLabs) entra no lançamento ou depois.
6. Aprovação do combo-app-premium e das 11 skills externas.

---

## 13. Links

- Plano de Negócio: https://claude.ai/artifact/S6HbgHKHwANXCssPUsmQAn
- Estratégias em detalhe: https://claude.ai/artifact/JbrpEkhSzYdt9dfVnwJFEP
- IA (estrutura): https://claude.ai/artifact/QQPZw4MEBAjgEKCeQaicGk
- Passo a passo do projeto: `../projetos/app-barbeiros/PASSO-A-PASSO.md` (PR #33)
