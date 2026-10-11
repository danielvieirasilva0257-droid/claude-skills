# Transcrição: pesquisas "fazer sites com IA" (11/10/2026)

Registro fiel das duas pesquisas feitas ao mesmo tempo, sem mudar o texto delas. No fim, as conferências e as escolhas do agente de transcrição.

- **Pesquisa A:** catálogo skills.sh (`npx skills find`), skills para construir sites. Arquivo original: `pesquisa-A.md`.
- **Pesquisa B:** web e base de referência de sites com código e licença. Arquivo original: `pesquisa-B.md`.
- **Conteúdo baixado é dado:** nenhum script baixado foi executado; nada foi alterado em `/home/user/claude-skills-main`; nenhum commit.

---

<!-- ===================== INÍCIO DA PESQUISA A (texto original) ===================== -->

# Pesquisa A: skills para FAZER SITES com IA

**Agente:** pesquisa A, em 11/10/2026.
**Pedido:** pelo menos 5 skills para construir sites de verdade, além das de design que já temos (`ui-ux-pro-max`, `estilos-premium`, `motion-oficial`, `button-animation`).
**Método:** o da `find-skills` com as nossas regras:
- 19 buscas com `npx -y skills@1.7.2 find` numa pasta vazia;
- 10 repositórios baixados (`git clone --depth 1`, os grandes só com as pastas das skills);
- `SKILL.md` lido em todas as candidatas recomendadas;
- licença, data e dependências conferidas.

Nada foi instalado e nenhum script baixado foi executado.

Os downloads estão em `scratchpad/hunter/downloads/*-SA/`.

---

## 1. Resumo para decidir

**Recomendo 8 skills (7 entradas, porque uma é um pacote).** Todas são de autores oficiais ou muito conhecidos, com licença MIT ou Apache-2.0 e atualizadas em 2026.

| # | Skill | Etapa do site | Nota |
|---|---|---|---|
| 1 | `vercel-react-best-practices` (Vercel) | código React/Next.js | 9 |
| 2 | `shadcn` (oficial do shadcn/ui) | componentes e Tailwind; usa o nosso `DESIGN.md` | 9 |
| 3 | pacote `web-quality-skills` (Addy Osmani, Google Chrome): auditoria, desempenho, Core Web Vitals, acessibilidade, SEO técnico e boas práticas | qualidade | 9 |
| 4 | `webapp-testing` (Anthropic) | testar no navegador e tirar prints | 8 |
| 5 | `deploy-to-vercel` (Vercel) | publicar | 8 |
| 6 | `site-architecture` (Corey Haines) | planejar páginas, menu e URLs | 7,5 |
| 7 | `cro` (Corey Haines) | landing page que converte e formulários | 7,5 |
| 8 | `seo-audit` (Corey Haines) | SEO depois do lançamento | 7,5 |

- **Categoria proposta:** nova, `skills/sites/` (precisa da aprovação do Daniel).
- **Como entram:** intactas, cada uma com `LICENSE`, `ORIGEM.md` e `APRENDIZADOS.md`, pela receita 5.1 do manual.
- **Ficam para depois, se surgir a necessidade:** `analytics`, `schema`, `playwright-best-practices`, `next-dev-loop` e `astro`.

---

## 2. Tabela de candidatas

**Como ler a tabela:**
- As instalações são do `skills find` em 11/10/2026.
- A data é a do último commit do repositório baixado.
- A nota vai de 0 a 10 e mede a utilidade para nós.

| Nome | Repositório | Instalações | Licença | Data | O que faz | Nota |
|---|---|---|---|---|---|---|
| vercel-react-best-practices | vercel-labs/agent-skills | 789,1 mil | MIT | 28/08/2026 (`063bee9`) | 70 regras de desempenho para React e Next.js, organizadas por impacto: cascatas de requisições, tamanho do bundle, servidor, re-render | **9** |
| shadcn | shadcn-ui/ui | 372,3 mil | MIT | 11/10/2026 (`02cad61`) | Usa a CLI do shadcn: adicionar componentes, formulários, estilo com tokens, presets. Também cria um design system a partir de um `DESIGN.md` | **9** |
| web-quality-audit + 5 irmãs (performance, core-web-vitals, accessibility, seo, best-practices) | addyosmani/web-quality-skills | 30,3 mil / 39 mil / – / 60,3 mil / 49,7 mil / – | MIT | 24/08/2026 (`afa8da9`) | Auditoria no estilo Lighthouse: Core Web Vitals, WCAG 2.2, SEO técnico (meta tags, sitemap, JSON-LD), segurança | **9** |
| webapp-testing | anthropics/skills | 174,8 mil | Apache-2.0 | 09/10/2026 (`dbd4588`) | Testa o site local com Playwright em Python: prints, cliques, console. Traz um script que sobe o servidor | **8** |
| deploy-to-vercel | vercel-labs/agent-skills | 151,9 mil | MIT (no README do repositório) | 28/08/2026 | Publica na Vercel: primeiro em preview, ligação com o git e push, e uma opção sem login | **8** |
| seo-audit | coreyhaines31/marketingskills | 225,2 mil | MIT | 08/10/2026 (`1efedbc`) | Diagnóstico de SEO técnico, on-page, conteúdo e SEO local | **7,5** |
| site-architecture | coreyhaines31/marketingskills | 115,4 mil | MIT | 08/10/2026 | Hierarquia de páginas, menu, URLs, links internos e mapa do site em Mermaid | **7,5** |
| cro (antiga page-cro) | coreyhaines31/marketingskills | 57,5 mil | MIT | 08/10/2026 | Conversão da home, landing, preços e formulários; ideias de teste A/B | **7,5** |
| analytics | coreyhaines31/marketingskills | 76,4 mil | MIT | 08/10/2026 | Plano de eventos, GA4, GTM, UTM, privacidade | 6,5 |
| schema | coreyhaines31/marketingskills | 70,6 mil | MIT | 08/10/2026 | Dados estruturados JSON-LD (rich results) | 6 |
| playwright-best-practices | currents-dev/playwright-best-practices-skill | 92,3 mil | MIT | 21/07/2026 (`283d5cb`) | Testes E2E robustos: mais de 50 referências, POM, CI, axe-core, mocks | 7 |
| next-dev-loop | vercel/next.js (oficial) | 19,2 mil | MIT | 10/10/2026 (`d8c1c1b`) | Confere cada mudança no `next dev` via `/_next/mcp` e agent-browser | 6,5 |
| web-perf | cloudflare/skills | 96,3 mil | Apache-2.0 | 10/10/2026 (`c430dd9`) | Desempenho com Chrome DevTools MCP (exige o MCP) | 6 |
| ai-seo / programmatic-seo | coreyhaines31/marketingskills | 140,9 mil / 142,6 mil | MIT | 08/10/2026 | Aparecer em respostas de IA (GEO) e páginas de SEO geradas em escala | 5,5 |
| vercel-optimize | vercel-labs/agent-skills | 95,2 mil | MIT | 28/08/2026 | Custo e desempenho de um projeto **já publicado** na Vercel; precisa das métricas da conta | 5 |
| astro | astrolicious/agent-skills | 16,8 mil | MIT | 20/03/2026 (v0.0.1) | O básico do Astro (comunidade, não é a skill oficial) | 5 |
| agent-browser | vercel-labs/agent-browser | 1 milhão | Apache-2.0 | 10/10/2026 | Robô de navegador; o `SKILL.md` é só um "stub" que manda baixar o conteúdo do programa | 4 |
| frontend-design | anthropics/skills | 974,1 mil | Apache-2.0 | 09/10/2026 | Direção visual (já é fonte da nossa `ui-ux-pro-max`) | – (já coberta) |
| web-design-guidelines | vercel-labs/agent-skills | 722,6 mil | MIT | 28/08/2026 | Revisa a interface contra as diretrizes da Vercel, que ela busca online (já é fonte da `ui-ux-pro-max`) | – (já coberta) |
| taste-skill, impeccable | leonxlnx / pbakaus | 300 a 590 mil | – | – | Design (avaliadas na caça de design de 11/10) | – (já coberta) |
| nextjs-app-router-patterns | wshobson/agents | 31,7 mil | não conferida | – | Padrões do App Router (fica abaixo da Vercel e da equipe do Next) | 4 |
| `*/superpowers@landing-page-design` | 101-skills, magentosh, qu-skills, skills-shell | 17 a 47 mil | – | – | A mesma skill repetida por 4 donos diferentes | **0 (sinal de alerta: cópias)** |

**Buscas sem resultado bom:**
- "analytics": voltou só Azure e skills de pesquisa.
- "forms": voltou só PDF e DOCX.
- "react hook form": nada sobre formulário de site.

Para formulários, as melhores fontes são `shadcn` (regras `forms.md`: Field, validação, `aria-invalid`) e `cro` (`references/form.md`, conversão). Para analytics, a melhor é a `analytics` do Corey Haines.

---

## 3. Detalhe das recomendadas

### 3.1 `vercel-react-best-practices`: o código (nota 9)

- **O que ensina:** 70 regras em 8 grupos, do mais grave ao menos grave:
  - eliminar cascatas de `await` (`Promise.all`, Suspense);
  - bundle pequeno: sem "barrel imports", `next/dynamic`, analytics carregado depois da hidratação;
  - servidor: `React.cache`, `after()`, autenticar server actions;
  - re-render, renderização e JavaScript.

  Cada regra tem um arquivo próprio com exemplo "errado → certo". O `AGENTS.md` traz tudo junto (13 mil palavras): ler só a regra necessária.
- **Sobreposição com as nossas:** quase nenhuma. A `motion-oficial` cuida do desempenho de **animação**; esta cuida do resto do código.
- **Riscos:**
  - Só serve para React e Next.js.
  - Cita a biblioteca `better-all` (da Vercel) numa regra.
  - Pasta grande (76 arquivos), mas é só texto.
  - Não há script, binário nem serviço pago.

### 3.2 `shadcn`: componentes e Tailwind (nota 9)

- **O que ensina:**
  - Usar a CLI oficial (`npx shadcn@latest add/search/docs/info`).
  - Regras rígidas: `gap-*` em vez de `space-y-*`, cores só por tokens (`bg-primary`), formulários com `FieldGroup` e `Field`, Dialog sempre com título (acessibilidade), Button sem `isLoading` (usar `Spinner`).
  - Uma tabela "qual componente usar para cada coisa".
- **Combina com a nossa `ui-ux-pro-max`:** o arquivo `design-system.md` monta o design system **a partir de um `DESIGN.md`**. Ele mapeia os tokens para as variáveis do shadcn e gera uma página do design system com contraste conferido. Isso é exatamente o que sai do passo 3 da `ui-ux-pro-max`.
- **Sobreposição:** a `button-animation` dá a animação dos botões, e o `shadcn` dá a estrutura dos componentes. Para não brigarem, vale uma regra no APRENDIZADOS, por exemplo: "botão do shadcn + animação da `button-animation`".
- **Riscos:**
  - O `SKILL.md` tem `` !`npx shadcn@latest info --json` ``, um comando que o Claude Code **executa sozinho ao carregar a skill**: baixa a CLI na versão `@latest`, sem versão fixa, e lê o projeto.
  - O cabeçalho pré-aprova `npx shadcn@latest *`.
  - Precisa de Node e de rede. Não é pago.
  - **Anotar no APRENDIZADOS:** usar só dentro da pasta do projeto.

### 3.3 Pacote `web-quality-skills`: qualidade (nota 9)

- **O que ensina:** uma auditoria "baseada em evidência":
  1. medir primeiro (trace de desempenho, Lighthouse);
  2. separar o que foi medido do que é suposição;
  3. corrigir;
  4. medir de novo.

  São 6 skills que se citam entre si (`../performance/references/...`), por isso entram **juntas**, numa pasta só (proposta: `skills/sites/web-quality/<skill>/`):
  - `web-quality-audit`: a porta de entrada;
  - `performance`: orçamento, imagens e fontes;
  - `core-web-vitals`: LCP, INP e CLS, com correções para Next e React;
  - `accessibility`: WCAG 2.2 com as regras novas de alvo de toque e foco;
  - `seo`: SEO técnico, JSON-LD e "navegação por agentes de IA";
  - `best-practices`: segurança e compatibilidade.
- **Sobreposição:** a parte de acessibilidade e contraste toca no checklist da `ui-ux-pro-max`, mas aqui é auditoria técnica, não design. Desempenho de Next.js conversa com a `vercel-react-best-practices`. As duas se complementam.
- **Riscos:**
  - Prefere o Chrome DevTools MCP ou a CLI do Lighthouse (grátis; precisa de Chrome).
  - Sem essas ferramentas, usa `scripts/analyze.sh`. Li o cabeçalho: ele se declara "somente leitura" e não usa rede.
  - Não há serviço pago. A API do CrUX só é usada se já houver chave.

### 3.4 `webapp-testing`: testar e tirar prints (nota 8)

- **O que ensina:**
  - Uma árvore de decisão: HTML estático ou app dinâmico.
  - O padrão "reconhecer, depois agir": esperar `networkidle`, tirar print, achar os seletores, agir.
  - Usar `scripts/with_server.py` para subir o `npm run dev` e rodar o teste.
  - É curta (481 palavras).
- **Sobreposição:** dá o **como** do passo 6 da `ui-ux-pro-max` (prints em 375 px e 1440 px).
- **Riscos:**
  - Precisa de `pip install playwright` + `playwright install chromium`. **Não estão no container hoje**: `import playwright` falhou.
  - O script executa comandos de servidor.
  - A skill manda "não ler o código do script, só rodar com `--help`". Pela nossa regra, ler o script antes de instalar.
  - Licença Apache-2.0 (`LICENSE.txt` na pasta).

### 3.5 `deploy-to-vercel`: publicar (nota 8)

- **O que ensina:**
  1. Conferir o estado: git remote, `.vercel/`, `vercel whoami`.
  2. Escolher o caminho: push no git ou `vercel deploy`.
  3. Publicar **sempre em preview**; produção só se pedirem.
  4. **Perguntar antes de dar push.**
- **Sobreposição:** nenhuma.
- **Riscos:**
  - **Conta da Vercel:** o plano Hobby é grátis, mas é para uso pessoal e não comercial. Site de cliente exige o Pro (pago).
  - **Opção sem login:** `resources/deploy.sh` empacota o projeto (tira `.env`, `.git` e `node_modules`) e **envia para `claude-skills-deploy.vercel.com`**, que devolve um link "reivindicável". Só usar com o "sim" do Daniel.
  - **Lixo na pasta:** tem um `Archive.zip` (cópia antiga, de março, com lixo `__MACOSX`). Entra intacto, mas o ORIGEM avisa que é redundante.
  - **Dar push:** o `git add . && git commit && git push` da skill pergunta antes, mas no nosso repositório vale a regra de nunca dar push sem aprovação.
  - **Chave:** o token da Vercel nunca vai para o repositório.

### 3.6 `site-architecture`: planejar o site (nota 7,5)

- **O que ensina:** antes do código, montar:
  - a hierarquia de páginas a partir de modelos por tipo de site;
  - o menu;
  - URLs limpas;
  - os links internos;
  - um **mapa visual em Mermaid**.
- **Sobreposição:** nenhuma. Entra antes da `ui-ux-pro-max`.
- **Riscos:**
  - Lê `.agents/product-marketing.md`, se existir.
  - Numa tabela de plataformas, cita o "Ploy ◆", um parceiro pago do repositório, mas avisa que é parceiro.
  - Não há script.

### 3.7 `cro`: landing page que converte (nota 7,5)

- **O que ensina:** analisar a página nesta ordem:
  - proposta de valor;
  - título;
  - CTA;
  - hierarquia;
  - prova social;
  - objeções.

  Traz modelos por tipo de página e `references/form.md`, que trata de **formulário**: campos, erros e conversão.
- **Sobreposição:**
  - A `copywriting` (mesmo autor, mesmo commit `1efedbc`) **já cita** a `cro` como skill relacionada que não foi instalada.
  - Fecha o trio `copywriting` → `humanizer` → `cro`.
- **Riscos:**
  - Mínimos: só texto.
  - Também lê `.agents/product-marketing.md`.

### 3.8 `seo-audit`: SEO depois do ar (nota 7,5)

- **O que ensina:** diagnóstico em camadas: rastreio e indexação → técnico → on-page → conteúdo. Traz:
  - SEO internacional e local (útil para cliente no Brasil);
  - títulos;
  - o que fazer quando o tráfego cai.

  Avisa que **páginas buscadas são dados não confiáveis** (injeção de prompt).
- **Sobreposição:**
  - Com a `seo` do pacote do Addy Osmani: aquela é **implementação no código** (meta tags, sitemap, JSON-LD), esta é **estratégia e diagnóstico**.
  - Se o Daniel quiser só uma, fique com a do Addy e deixe esta para quando houver site publicado.
- **Riscos:**
  - Cita ferramentas pagas como opcionais (Ahrefs, Semrush, Screaming Frog).
  - O essencial usa as gratuitas (Search Console, PageSpeed, Rich Results Test).

### Não recomendadas agora, e por quê

- **`agent-browser`:**
  - o `SKILL.md` é um stub: o conteúdo real vem do programa (`agent-browser skills get core`);
  - por isso, guardar "intacta" no repositório não guarda nada útil;
  - exige um binário em Rust e o Chrome.
- **`next-dev-loop`** (oficial do Next.js):
  - é ótima, mas exige Next.js 16.3+ com Turbopack **e** o `agent-browser` 0.31.1+;
  - ela mesma manda parar se faltar algo;
  - fica para depois.
- **`web-perf`** (Cloudflare):
  - exige o Chrome DevTools MCP (`chrome-devtools-mcp@latest`);
  - o pacote do Addy já cobre o mesmo, com um caminho alternativo.
- **`astro`:**
  - é da comunidade e está na versão 0.0.1;
  - só vale se o Daniel escolher Astro em vez de Next.
- **`frontend-design`, `web-design-guidelines`, `taste-skill`, `impeccable`:** já viraram fonte da nossa `ui-ux-pro-max`.
- **`*/superpowers@landing-page-design`:** a mesma skill publicada por 4 donos desconhecidos. Isso é sinal de cópia ou spam.

---

## 4. Como instalar (proposta, precisa do "sim" do Daniel)

1. **Criar a categoria nova** `skills/sites/` e a seção `[SITES (skills/sites/)]` no `guia/HABILIDADES.txt`.
2. **Copiar cada skill sem alterar nada,** com `LICENSE`, `ORIGEM.md` (repositório, commit, data, o que foi copiado) e `APRENDIZADOS.md` (as nossas regras):
   - `skills/sites/vercel-react-best-practices/`: a pasta `react-best-practices` inteira (`rules/`, `AGENTS.md`);
   - `skills/sites/shadcn/`: `SKILL.md`, `rules/`, `*.md`, `assets/` e `evals/`;
   - `skills/sites/web-quality/`: as 6 pastas lado a lado, para manter os links `../`, e um `LICENSE`/`ORIGEM`/`APRENDIZADOS` do pacote;
   - `skills/sites/webapp-testing/`: com `scripts/` e `examples/`;
   - `skills/sites/deploy-to-vercel/`: com `resources/`;
   - `skills/sites/site-architecture/`, `skills/sites/cro/` e `skills/sites/seo-audit/`: do mesmo commit `1efedbc` da nossa `copywriting`.
3. **Regras para os APRENDIZADOS:**
   - **shadcn:** o comando automático usa `@latest`; rodar só na pasta do projeto; o botão continua com a animação da `button-animation`.
   - **deploy:** preview primeiro; nada de push nem do script "sem login" sem aprovação; o token da Vercel fica fora do repositório.
   - **webapp-testing:** instalar o Playwright no container antes e ler o `with_server.py`.
   - **Corey Haines:** o arquivo `product-marketing.md` não existe aqui; ignorar as menções a parceiros pagos.
4. **Conferir:** rodar `npx skills add danielvieirasilva0257-droid/claude-skills --list` para ver se o programa acha todas.
5. **Depois:** criar o combo `skills/combos/combo-site-do-zero/` com o fluxo da seção 5.

---

## 5. Fluxo sugerido: fazer um site do zero

| Passo | O que fazer | Skill |
|---|---|---|
| 1. Briefing e páginas | Público, objetivo, páginas, menu, URLs, mapa em Mermaid | `site-architecture` |
| 2. Texto | Título, seções, CTAs; depois tirar o jeito de IA | `combo-copy-humanizada` (`copywriting` → `humanizer`) |
| 3. Visual | Escolher a referência e escrever o `DESIGN.md` (✋ aprovação do Daniel) | `ui-ux-pro-max` + `estilos-premium` |
| 4. Projeto e componentes | `npx shadcn init` (Next.js + Tailwind v4); design system a partir do `DESIGN.md`; componentes e formulários | `shadcn` |
| 5. Código | Páginas em Next.js seguindo as regras críticas (sem cascata de `await`, bundle leve, imagens otimizadas) | `vercel-react-best-practices` |
| 6. Movimento | Animações de entrada e rolagem, botões, carrossel, com `prefers-reduced-motion` | `motion-oficial`, `button-animation`, `thumbnail-carousel` |
| 7. Conversão | Revisar o hero, o CTA, a prova social e o formulário | `cro` |
| 8. Testar | Subir o `next dev`, prints em 375 e 1440 px (claro e escuro), clicar nos CTAs, enviar o formulário, ler o console | `webapp-testing` |
| 9. Qualidade | Core Web Vitals, WCAG 2.2, SEO técnico (meta tags, sitemap, JSON-LD), segurança; corrigir e medir de novo | `web-quality-audit` (+ irmãs) |
| 10. Publicar | Preview na Vercel → Daniel aprova → produção | `deploy-to-vercel` |
| 11. Depois do lançamento | Search Console, diagnóstico de SEO, eventos e conversões | `seo-audit` (+ `analytics` e `schema`, se aprovadas) |


<!-- ===================== FIM DA PESQUISA A ===================== -->

---

<!-- ===================== INÍCIO DA PESQUISA B (texto original) ===================== -->

# Pesquisa B: fazer sites com IA (web e base de referência)

Data: 11/10/2026. Agente B. O catálogo skills.sh ficou com o agente A.

**Regras seguidas**
- O Refero **não** foi acessado.
- Nenhum script baixado foi executado.
- Nada foi alterado em `/home/user/claude-skills-main`.
- Não houve commit.
- As licenças foram conferidas no arquivo LICENSE de cada repositório (via raw.githubusercontent) ou na página oficial de licença. Quando a licença não foi conferida, o texto diz isso.

---

## 1. Resumo em 6 pontos

1. **Next.js mudou a regra do jogo.**
   - Desde a versão 16.2, a documentação vem dentro do pacote, em `node_modules/next/dist/docs/`.
   - O `create-next-app` cria um `AGENTS.md` e um `CLAUDE.md` que apontam para ela. A partir da 16.3, o `next dev` também mantém esse `AGENTS.md`.
   - Nos testes da Vercel, essa documentação acertou **100%** das tarefas, contra **no máximo 79%** das skills de conhecimento.
   - **Consequência:** não precisamos de uma skill de "boas práticas de Next.js".
2. **Skills oficiais que valem a pena:**
   - `shadcn/ui` (skill e MCP);
   - `vercel-labs/agent-skills` (`web-design-guidelines`, `react-best-practices`, `deploy-to-vercel`);
   - `anthropics/skills` (`frontend-design` e `webapp-testing`, ambas Apache-2.0);
   - `addyosmani/web-quality-skills` (Lighthouse, Core Web Vitals, acessibilidade e SEO; MIT);
   - `coreyhaines31/marketingskills` (copy, SEO e conversão; MIT).
3. **Para ver o site, o agente precisa de navegador:** Playwright MCP ou Chrome DevTools MCP, ambos Apache-2.0. Sem isso, a IA "não vê o que construiu".
4. **Base de referência legal:** há bastante material MIT de boa qualidade:
   - Launch UI, portfólio do Magic UI, AstroWind, Next.js SaaS Starter, Next.js Commerce, Once UI starter, Start Bootstrap;
   - HTML5 UP, que é CC BY 3.0 (44 templates).
   - Os **pagos ou restritos** servem só como link: Tailwind Plus, Aceternity, Cruip (GPL com pedido de não republicar), Magic UI Pro, Tailark completo, Once UI Magic Portfolio (CC BY-NC).
5. **Recomendação:** não copiar repositórios inteiros. Montar um **índice nosso** com:
   - um link fixado num commit e a licença de cada site;
   - **fichas escritas por nós** (o que aproveitar de cada site);
   - um **script que clona sob demanda** numa pasta ignorada pelo git;
   - **poucas cópias MIT pequenas**, com LICENSE e ORIGEM, no mesmo padrão de `estilos-premium`.
6. **Fluxo recomendado:** briefing, depois referência e DESIGN.md, depois Next.js (ou Astro) com shadcn, construir seção por seção, conferir com capturas de tela, auditoria de qualidade e deploy. Os detalhes estão na seção 5.

---

## 2. Skills, MCPs e fluxos para fazer sites com agentes (2025–2026)

| # | Nome | Link | Licença (conferida) | O que faz | Nota |
|---|---|---|---|---|---|
| 1 | **Docs do Next.js no pacote + AGENTS.md** | https://nextjs.org/docs/app/guides/ai-agents | MIT (repo `vercel/next.js`) | Next ≥16.2 traz a documentação em `node_modules/next/dist/docs/`. O `AGENTS.md` aponta para ela; o `create-next-app` cria esse arquivo e, a partir da 16.3, o `next dev` o mantém. Dá para desligar com a opção `agentRules`. | **Essencial.** Não instalar skill de conhecimento de Next. Na versão 16.4.0 o guia ainda cita `agentFeedback` e `agentUpgrade`. |
| 2 | **Skills do Next.js** (antes `vercel-labs/next-skills`) | https://github.com/vercel/next.js/tree/canary/skills | MIT (repo next.js) | O repo antigo diz que **as skills se mudaram**. Elas ficam no repo do Next.js e servem para tarefas, não para ensinar o framework: `next-dev-loop`, `next-bundle-optimizer`, `next-cache-components-adoption/optimizer`, `next-partial-prefetching-adoption/optimizer` e outras. As antigas `next-best-practices` e `next-upgrade` deixaram de existir; o conteúdo foi para a documentação e para o `npx @next/codemod@latest upgrade`. | Bom para otimizar depois que o site está pronto. Instala com `npx skills add vercel/next.js`. |
| 3 | **next-devtools-mcp** | https://github.com/vercel/next-devtools-mcp | MIT (package.json) | Encontra o `next dev` em execução e expõe erros, rotas, logs e metadados da página (`/_next/mcp`). | Útil para o agente achar erros. Não serve mais documentação. |
| 4 | **Skill do shadcn/ui** | https://ui.shadcn.com/docs/skills | MIT (repo `shadcn-ui/ui`) | Lê o `components.json` (`shadcn info --json`) e conhece a CLI (`init`, `add`, `search`, `view`, `docs`, `diff`, `build`), os temas (OKLCH, modo escuro) e os registries. | **Essencial** se o site usar shadcn. Instala com `npx skills add shadcn/ui`. |
| 5 | **MCP do shadcn** | https://ui.shadcn.com/docs/mcp | MIT | Busca e instala componentes de qualquer registry. A CLI já reconhece **435 registries comunitários**, entre eles `@magicui`, `@launchui`, `@tailark`, `@aceternity`, `@kokonutui`, `@react-bits`, `@shadcn-studio` e `@efferd`. | Instala com `npx shadcn@latest mcp init --client claude`. O próprio shadcn avisa que é preciso **revisar o código** de registries de terceiros. |
| 6 | **vercel-labs/agent-skills** | https://github.com/vercel-labs/agent-skills | MIT (README e `license:` de cada skill) | `web-design-guidelines` (audita a interface contra as Web Interface Guidelines e lista arquivo:linha), `react-best-practices`, `composition-patterns`, `react-view-transitions`, `deploy-to-vercel`, `vercel-optimize` e `writing-guidelines`. | **Recomendado:** `web-design-guidelines` e `deploy-to-vercel`. Já está baixado em `downloads/vercel-agent-skills-A2`. |
| 7 | **Web Interface Guidelines** | https://github.com/vercel-labs/web-interface-guidelines | MIT | São as regras que a skill acima usa: acessibilidade, formulários, animação e imagens. | Já baixado (`vercel-wig-B`). |
| 8 | **anthropics/skills: `frontend-design`** | https://github.com/anthropics/skills/tree/main/skills/frontend-design | Apache-2.0 (LICENSE.txt) | Faz o agente escolher uma direção estética ousada antes de escrever código e evitar o visual genérico de IA. | Nossa `ui-ux-pro-max` já cita essa skill. Combina com `estilos-premium`. |
| 9 | **anthropics/skills: `webapp-testing`** | https://github.com/anthropics/skills/tree/main/skills/webapp-testing | Apache-2.0 | Testa um site local com Playwright: capturas de tela, cliques e logs. | Bom para o passo de conferência visual. |
| 10 | **anthropics/skills: `web-artifacts-builder` e `theme-factory`** | mesmo repo | Apache-2.0 | Artefatos em React, Tailwind e shadcn, e temas prontos. | Opcional. Serve mais para protótipos. |
| 11 | **addyosmani/web-quality-skills** | https://github.com/addyosmani/web-quality-skills | **MIT** (2026) | `web-quality-audit`, `performance`, `core-web-vitals` (LCP < 2,5 s, INP < 200 ms, CLS < 0,1), `accessibility` (WCAG 2.2), `seo` e `best-practices`. Usa o Chrome DevTools MCP quando ele existe. | **Recomendado** para a auditoria antes de publicar. |
| 12 | **coreyhaines31/marketingskills** | https://github.com/coreyhaines31/marketingskills | **MIT** | `copywriting`, `copy-editing`, `page-cro`, `seo-audit`, `ai-seo`, `schema-markup`, `programmatic-seo`, `site-architecture`, `launch-strategy`, `pricing-strategy`, `form-cro` e outras. | Bom para o **texto** da landing e para SEO. |
| 13 | **Playwright MCP** | https://github.com/microsoft/playwright-mcp | Apache-2.0 | O agente abre o navegador, tira capturas de tela e clica. | Dá "olhos" ao agente. |
| 14 | **Chrome DevTools MCP** | https://github.com/ChromeDevTools/chrome-devtools-mcp | Apache-2.0 | Lighthouse, traces de desempenho, console e rede. | Junto com o item 11. |
| 15 | **Claude Design → Claude Code** | https://claude.com/resources/tutorials/using-claude-design-for-prototypes-and-ux | Produto da Anthropic (planos Pro, Max, Team e Enterprise) | O protótipo visual é feito no Claude Design. O "handoff" gera um pacote com os arquivos de design, o histórico e um README, que é aberto no Claude Code. | Alternativa ao passo de design. Os detalhes vêm de fontes secundárias. Confira na documentação oficial. |

**Como os criadores estão fazendo, segundo blogs e Reddit (relatos pessoais, não estudos):**
- Escrevem uma "tese visual" ou DESIGN.md **antes** do código.
- Mantêm um `CLAUDE.md` forte com as regras do projeto.
- Constroem por **seções**.
- Fecham o ciclo com **capturas de tela** (o agente gera código bonito, mas "não vê" o resultado).
- Fazem o design no Claude Design ou no Figma e implementam no Claude Code.

---

## 3. Base de referência: coleções de sites e templates com código

Legenda da coluna "Guardar no nosso repo?":
- **Sim:** licença permissiva; pode copiar com LICENSE e crédito.
- **Só link:** pago, restrito ou sem licença.

| Coleção | Link | Licença (conferida) | Quantidade | Stack | Qualidade visual | Guardar no nosso repo? |
|---|---|---|---|---|---|---|
| **Launch UI** | https://github.com/launch-ui/launch-ui · launchuicomponents.com | **MIT** | 1 template de landing com muitas seções (hero, logos, recursos, preços, FAQ, CTA). Existe versão Pro paga. | Next 16, React 19, Tailwind 4, shadcn | Premium e limpo, com animações leves. Também é registry `@launchui`. | **Sim** (5 MB, 60 arquivos) |
| **Magic UI**: componentes e portfólio | https://github.com/magicuidesign/magicui · https://github.com/dillionverma/portfolio | **MIT** (os dois) | Mais de 150 componentes animados grátis e 1 template de portfólio grátis. Os templates "startup" e "saas" ficam no **Magic UI Pro (pago)**. | Next, Tailwind, Motion | Animado e "design engineer". O portfólio é minimalista e premium. | **Sim** para o grátis (portfólio: 1,9 MB). **Só link** para o Pro. |
| **Once UI** | https://github.com/once-ui-system/core · https://github.com/once-ui-system/nextjs-starter · magic-portfolio | `core` e `nextjs-starter`: **MIT**. **magic-portfolio: CC BY-NC 4.0** (proíbe uso comercial). | Design system, starter e alguns templates | Next 16, Once UI | Elegante e minimalista | **Sim** para o starter (296 KB). **Não guardar** o magic-portfolio, porque é NC; só link. |
| **Next.js SaaS Starter** (oficial) | https://github.com/nextjs/saas-starter | **MIT** | 1 app SaaS (login, pagamentos Stripe, painel) | Next 15, Postgres, Drizzle, shadcn | Funcional e neutro | **Sim** (556 KB) |
| **Next.js Commerce** (oficial) | https://github.com/vercel/commerce | **MIT** | 1 loja completa | Next 15, Shopify, Tailwind 4 | Loja moderna e minimalista | **Sim** (812 KB) |
| **vercel/examples** | https://github.com/vercel/examples | **MIT** | Cerca de 250 exemplos: 52 boilerplates de framework, 36 middlewares, 36 "solutions" etc. | Variada | **Técnico**, pouco visual | Só link (aprender integrações) |
| **Galeria de templates da Vercel** | https://vercel.com/templates | **Cada template tem a sua** | Centenas, por framework (Next, Astro, Nuxt, Svelte…) | Variada | De básico a premium | Só link. Conferir caso a caso. |
| **shadcn/ui blocks e templates** | https://ui.shadcn.com/blocks · repo `shadcn-ui/ui` | **MIT** | Cerca de 27–30 blocos de **app** (painel, login, cadastro, 16 sidebars) e 10 templates de partida (Next, Vite, Astro, React Router, Start). **Não há blocos de landing.** | React, Tailwind 4 | Limpo e neutro | Sim, mas é melhor instalar pela CLI do que copiar |
| **Diretório de registries do shadcn** | https://ui.shadcn.com/docs/directory | Cada registry tem a sua | **435 registries** | shadcn | De básico a premium | Só link. É o melhor **índice vivo** de blocos. |
| **shadcn/studio** | https://github.com/shadcnstudio/shadcn-studio | **MIT** (parte aberta) | Componentes, blocos e alguns templates. Há parte paga. | shadcn | Moderno | Sim, só a parte MIT |
| **Page UI** (Shipixen) | https://github.com/danmindru/page-ui | **MIT** | Muitos componentes de landing (hero, depoimentos, preços…) | React, Tailwind, shadcn | Bom, com cara de SaaS | Só link: **42 MB**, 857 arquivos. É grande. |
| **shadcn landing pages da comunidade** | https://github.com/leoMirandaa/shadcn-landing-page · https://github.com/nobruf/shadcn-landing-page | **MIT** (os dois) | 1 landing cada | React ou Next, shadcn | Bom, mas genérico | Sim (cerca de 650 KB) |
| **AstroWind** | https://github.com/onwidget/astrowind | **MIT** | 1 template com várias páginas (landing, blog, SaaS, startup) | Astro 7, Tailwind 4 | Profissional e limpo. É o tema Astro mais famoso. | **Sim** (2,5 MB) |
| **AstroPaper** | https://github.com/satnaing/astro-paper | **MIT** | 1 blog | Astro | Minimalista e tipográfico | Sim |
| **Temas do Astro (catálogo)** | https://astro.build/themes | **Cada tema tem a sua**. Há grátis e pagos; os destaques são pagos. | Centenas (o site não mostra o total) | Astro | De básico a premium | Só link |
| **HTML5 UP** | https://html5up.net · https://html5up.net/license | **CC BY 3.0**: pode copiar e modificar, inclusive em uso comercial, **dando crédito** | **44 templates** | HTML, CSS e jQuery | Clássico e bonito. Bom para estudar layout, embora seja tecnologia antiga. | **Sim, com crédito** (manter o aviso CC BY) |
| **Start Bootstrap** | https://github.com/StartBootstrap (`startbootstrap-landing-page`, `-agency`, `-creative`…) | **MIT** (conferido em 3 repos) | Dezenas de templates grátis, um repo por template (número não conferido) | Bootstrap 5 | Simples e "corporativo" | Sim, mas o valor visual é baixo |
| **HyperUI** | https://github.com/markmead/hyperui | **MIT** | Muitos componentes em HTML e Tailwind (marketing, app, loja) | Tailwind puro | Limpo | Sim (copiar só trechos) |
| **Flowbite** | https://github.com/themesberg/flowbite | **MIT** (o núcleo). Os Flowbite Blocks Pro são pagos. | Componentes e blocos | Tailwind | Corporativo | Sim só para o grátis |
| **Preline UI** | https://github.com/htmlstreamofficial/preline | **Dupla: MIT + "Preline UI Fair Use License"** | Componentes e alguns exemplos | Tailwind | Moderno | Cuidado: ler a Fair Use antes. Só link. |
| **Kokonut UI** | https://github.com/kokonut-labs/kokonutui | **MIT** | Componentes animados (registry `@kokonutui`) | shadcn, Motion | Animado e premium | Sim, só trechos |
| **React Bits** | https://github.com/DavidHDev/react-bits | **MIT + Commons Clause** (não pode vender o software em si) | Muitos componentes animados (número não conferido) | React | Muito animado e chamativo | Uso em sites ok. **Não guardar cópia** no repo; só link. Já baixado em `react-bits-B`. |
| **shadcnblocks** (grátis) | https://github.com/shadcnblocks/shadcn-ui-blocks | **MIT + Commons Clause**. O site completo é pago (mais de 1.400 blocos). | Parte grátis pequena | shadcn | Premium | Só link |
| **Tailark** | https://tailark.com | Não informada no site. Há "Get full access" (pago); não achamos repo público. | Blocos de marketing e kits (Quartz, Dusk…) | shadcn, Next | Premium e minimalista | Só link |
| **Aceternity UI** | https://ui.aceternity.com/licence | **Licença própria**: proíbe redistribuir os arquivos-fonte, mesmo modificados | Componentes grátis e templates pagos | Next, Motion | Muito animado | **Só link**. Não copiar para o repo. |
| **Cruip** (templates grátis) | https://github.com/cruip/open-react-template · `tailwind-landing-page-template` | **GPL-3.0**, e o README pede "**não republicar nem redistribuir**" | Alguns grátis e muitos pagos (número não conferido) | Next, Tailwind | Premium | **Só link** |
| **Tailwind Plus** (antigo Tailwind UI) | https://tailwindcss.com/plus | **Paga**: cerca de US$ 299 pessoal e US$ 979 time, em pagamento único, nos preços vistos. A licença **proíbe publicar um repositório com os componentes**. | Centenas de blocos e alguns templates de site (número não conferido) | React, HTML, Tailwind | Premium (referência do setor) | **Não guardar.** Uma fonte secundária (Untitled UI) diz que as vendas pararam em 09/2026. **Não confirmamos.** |
| **Listas "awesome"** | https://github.com/aniftyco/awesome-tailwindcss (**CC0**) · https://github.com/one-aalam/awesome-astro (**MIT**) · https://github.com/birobirobiro/awesome-shadcn-ui (**MIT**) · https://github.com/nordicgiant2/awesome-landing-page (**sem licença**) · https://github.com/unicodeveloper/awesome-nextjs (**sem licença**) | Conforme a coluna ao lado | Centenas de links | — | Inspiração | As CC0 e MIT podem ser copiadas. As sem licença: só link. |

**Inspiração sem código** (só para olhar e citar como link; nunca copiar nem raspar): Godly, Lapa Ninja, Land-book, One Page Love, Awwwards e Codrops (as demos do Codrops têm termos próprios).

---

## 4. Recomendação: como montar a base no GitHub sem inflar o repositório

**Decisão sugerida:** índice nosso, fichas nossas, um script de clone sob demanda e poucas cópias MIT.

**Onde:** na branch `main`, numa pasta nova `referencias/sites/` (ou numa skill `skills/design/sites-referencia/`). **Não** na branch `rotina-video`.

```
referencias/sites/
  INDICE.md          # tabela: nome | link | commit fixado | licença | stack | tipo | estilo | "o que aproveitar"
  fontes.txt         # uma linha por repo: owner/repo  commit  licença   (ex.: launch-ui/launch-ui a1b2c3 MIT)
  baixar.sh          # lê fontes.txt e faz git clone --depth 1 em referencias/sites/_clones/
  fichas/<nome>.md   # análise NOSSA: paleta, fontes, ordem das seções, animações, o que copiar como ideia
  copias/<nome>/     # SÓ 3–5 trechos MIT/CC BY pequenos (ex.: um hero, uma tabela de preços), cada um com LICENSE + ORIGEM.md
.gitignore           # + referencias/sites/_clones/
```

**Por que assim**
- **Repo leve:** os 7 favoritos MIT somam cerca de 12 MB de código. Com o Page UI, passam de 54 MB. Copiar tudo incharia o histórico para sempre, e o script baixa em segundos quando for preciso.
- **Legal:** links e fichas escritas por nós são sempre permitidos. Cópia literal só de MIT, Apache, CC0 ou CC BY, com LICENSE e crédito, no mesmo padrão do `estilos-premium/ORIGEM.md`.
- **Reprodutível:** cada referência fica fixada num commit, então o site de referência não muda sem a gente ver.
- **Por que não submodule:**
  - Funciona (o submodule é só um ponteiro, sem custo de tamanho).
  - Mas complica clone, pull e sessões na nuvem: precisa de `--recurse-submodules` e quebra se o repo de origem sumir.
  - Para o Daniel, que está começando, o `baixar.sh` é mais simples. Se ele preferir submodules, use **só nos 5 favoritos** e com `shallow = true`.
- **Proteção contra sumiço:** opcionalmente, fazer **fork** dos 5 favoritos MIT para a conta do Daniel. O fork não ocupa espaço no nosso repo e preserva o código e a licença.

**Primeiros favoritos para o `fontes.txt`** (todos com licença conferida):
- `launch-ui/launch-ui` (MIT, landing);
- `dillionverma/portfolio` (MIT, portfólio animado);
- `onwidget/astrowind` (MIT, site Astro);
- `nextjs/saas-starter` (MIT, SaaS);
- `vercel/commerce` (MIT, loja);
- `once-ui-system/nextjs-starter` (MIT);
- `leoMirandaa/shadcn-landing-page` (MIT);
- HTML5 UP (CC BY 3.0, baixar o zip do site, com crédito).

Cópias rasas desses repos já estão em `scratchpad/hunter/downloads/*-SB/`, só para consulta. Eles **não** foram executados.

**Fichas:** use o `modelo-DESIGN.md` da `ui-ux-pro-max` para extrair de cada referência os tokens, a tipografia, as seções e o movimento, **com as nossas palavras**. Assim a base vira conhecimento reaproveitável pela IA, e não só código parado.

---

## 5. Fluxo "site do zero com IA" (Claude Code)

1. **Briefing (10 min).** Defina o objetivo do site, o público, a ação principal (CTA), as páginas, o conteúdo **real** (textos, fotos, logo) e as 2–3 referências do `INDICE.md`.
2. **Direção visual.**
   - Escolha um estilo em `estilos-premium` (fichas DESIGN.md) e uma referência de código da base.
   - Escreva o `DESIGN.md` do projeto: cores, fontes, espaçamento, raio, movimento, o que **não** fazer.
   - Use as skills `ui-ux-pro-max` e `frontend-design`. Alternativa: protótipo no Claude Design, depois o handoff para o Claude Code.
3. **Criar o projeto.**
   - **Next.js:** `npx create-next-app@latest`. Já gera o `AGENTS.md` e o `CLAUDE.md` com a documentação local.
   - **Site simples ou estático:** Astro, por exemplo `npm create astro@latest -- --template onwidget/astrowind`.
   - Coloque as regras do `DESIGN.md` no `CLAUDE.md` do projeto.
4. **Componentes.**
   - `npx shadcn@latest init`
   - `npx skills add shadcn/ui`
   - `npx shadcn@latest mcp init --client claude`
   - Puxe blocos de registries confiáveis (`@launchui`, `@magicui`, `@kokonutui`) e **leia o código antes**.
5. **Construir por seções.** Peça uma seção por vez: hero, prova social, benefícios, como funciona, preços, FAQ, CTA final, rodapé. Cada uma deve seguir o `DESIGN.md` e a referência.
6. **Ver o resultado (loop visual).**
   - Use Playwright MCP ou `webapp-testing` para tirar capturas em **desktop e celular**.
   - Compare com a referência e passe a checklist `anti-padroes-ia.md`.
   - Corrija e repita.
7. **Qualidade.**
   - `web-design-guidelines` (Vercel) e `web-quality-audit` (Lighthouse, Core Web Vitals, WCAG 2.2, SEO), com o Chrome DevTools MCP.
   - O `next-devtools-mcp` mostra erros de execução.
8. **Texto e SEO.** Use `copywriting`, `page-cro`, `seo-audit` e `schema-markup` (marketingskills): títulos, meta tags, Open Graph, sitemap e dados estruturados.
9. **Publicar.**
   - Use a skill `deploy-to-vercel` ou a Vercel CLI: primeiro um preview, e depois da aprovação, produção.
   - Configure o domínio e o analytics.
   - **Nunca** salve chaves no repo.
10. **Registrar.** Anote no PASSO-A-PASSO do projeto, na `main`, o que funcionou, e acrescente o site pronto ao `INDICE.md` como nova referência.

---

## 6. Alertas de licença (resumo)

- **Pode copiar, com LICENSE e crédito:**
  - MIT: Launch UI, Magic UI e o portfólio, Once UI core e starter, Next.js e exemplos, shadcn/ui, AstroWind, AstroPaper, Start Bootstrap, HyperUI, Flowbite (núcleo), Kokonut UI, shadcn-studio (parte aberta), web-quality-skills, marketingskills, vercel-labs/agent-skills;
  - Apache-2.0: as skills da Anthropic, Playwright MCP, Chrome DevTools MCP;
  - CC0: awesome-tailwindcss;
  - CC BY 3.0: HTML5 UP, mantendo o crédito.
- **Não copiar, só link:**
  - Once UI **magic-portfolio** (CC BY-NC, sem uso comercial);
  - **React Bits** e **shadcnblocks** (Commons Clause);
  - **Cruip** (GPL e pedido de não redistribuir);
  - **Aceternity** (proíbe redistribuir os arquivos-fonte);
  - **Tailwind Plus**, **Magic UI Pro**, **Tailark** (pagos);
  - repos **sem licença** (awesome-nextjs, awesome-landing-page);
  - **Refero** (termos proíbem).
- **Conferir caso a caso:** galeria da Vercel, temas do Astro, registries do shadcn e Preline (licença dupla).

---

## 7. Fontes consultadas

- https://nextjs.org/docs/app/guides/ai-agents
- https://nextjs.org/blog/next-16-2-ai
- https://nextjs.org/blog/next-16-3-ai-improvements
- https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals (citado pelo guia do Next)
- https://github.com/vercel-labs/next-skills (README: "have moved")
- https://github.com/vercel/next.js/tree/canary/skills
- https://ui.shadcn.com/docs/skills
- https://ui.shadcn.com/docs/mcp
- https://ui.shadcn.com/docs/directory
- https://ui.shadcn.com/r/registries.json
- https://github.com/vercel-labs/agent-skills
- https://github.com/anthropics/skills
- https://github.com/addyosmani/web-quality-skills
- https://github.com/coreyhaines31/marketingskills
- https://html5up.net/license
- https://ui.aceternity.com/licence
- https://tailwindcss.com/plus
- https://www.untitledui.com/blog/tailwind-plus-alternatives (fonte secundária, não confirmada)
- https://claude.com/resources/tutorials/using-claude-design-for-prototypes-and-ux
- https://composio.dev/blog/top-design-skills
- https://www.mejba.me/blog/claude-skills-design-workflows (relatos de fluxo)
- Arquivos LICENSE lidos em raw.githubusercontent.com dos repositórios citados na seção 3

**Downloads desta pesquisa** (pasta `scratchpad/hunter/downloads/`):
- clones rasos `*-SB`: launch-ui, dillionverma/portfolio, astrowind, saas-starter, shadcn-landing-page, once-ui nextjs-starter, page-ui, commerce;
- só a árvore de arquivos, sem conteúdo: `vercel-examples-SB` e `shadcn-ui-SB`.

O script de conferência de licença está em `scratchpad/hunter/sites/tools/lic.sh`.


<!-- ===================== FIM DA PESQUISA B ===================== -->


---

# Conferências e escolhas do agente de transcrição

## O que as duas pesquisas concordam

- As mesmas fontes oficiais aparecem nas duas: `shadcn/ui`, `vercel-labs/agent-skills`, `anthropics/skills` (`webapp-testing`), `addyosmani/web-quality-skills` e `coreyhaines31/marketingskills`.
- Ver o site é obrigatório: a IA não enxerga o resultado sem navegador (Playwright).
- Publicar sempre em preview primeiro; produção só com aprovação.

## Onde elas diferem, e o que foi decidido

| Ponto | Pesquisa A | Pesquisa B | Decisão na proposta |
|---|---|---|---|
| Skill de boas práticas de React/Next | `vercel-react-best-practices` (nota 9) | Next 16.2+ traz a documentação no pacote; "não precisamos de skill de boas práticas de Next" | **Entra**, porque é sobre **desempenho de React**, não sobre a API do Next. O APRENDIZADOS avisa que, para API do Next, manda a documentação do pacote |
| `web-design-guidelines` (Vercel) | já coberta pela `ui-ux-pro-max` | recomendada | **Não entra** (já é fonte da `ui-ux-pro-max`); fica como referência |
| Base de referência | — | índice nosso + `fontes.txt` + script de clone + poucas cópias MIT; pasta `referencias/sites/` ou skill | **Skill `referencia-sites`** em `skills/sites/`, **sem cópias** de template (todas por link e script); fichas ficam na pasta do projeto |
| Nome do combo | `combo-site-do-zero` | — | `combo-site-premium` (nome definido no pedido desta tarefa) |

## Conferências feitas na hora de copiar (11/10/2026)

- **Cópia intacta:** cada pasta foi copiada com `cp -a` e comparada com a origem por `diff -r`: nenhuma diferença (só os arquivos nossos a mais: `ORIGEM.md`, `APRENDIZADOS.md`, `LICENSE` da raiz e `LICENCA-NOTA.md`).
- **Commits:** shadcn `02cad61`, vercel-labs/agent-skills `063bee9`, web-quality-skills `afa8da9`, anthropics/skills `dbd4588`, marketingskills `1efedbc`.
- **Licenças lidas no arquivo:** shadcn `LICENSE.md` MIT; web-quality `LICENSE` MIT (Addy Osmani, 2026); marketingskills `LICENSE` MIT; webapp-testing `LICENSE.txt` Apache-2.0. **vercel-labs/agent-skills não tem arquivo LICENSE**: MIT só no README (linhas 237–239) e no cabeçalho da `react-best-practices`; anotado em `LICENCA-NOTA.md`.
- **YAML:** os 13 `SKILL.md` de terceiros foram lidos por um leitor de YAML sem erro. Nenhum tem `description` sem aspas com dois-pontos seguido de espaço; a da `cro` já vem entre aspas. Nada precisou ser anotado como risco.
- **Programa `npx skills`:** `npx -y skills@1.7.2 add PROPOSTA --list` achou **15 skills**: as 9 entradas de `sites` (8 de terceiros + `referencia-sites`) contam 14 (o pacote web-quality conta como 6) e o combo é a 15ª.
- **Script `baixar-referencia.sh`:** testado (lista, download no commit fixado, nome errado, pasta repetida, recusa na `main` do `claude-skills`, aviso de `.gitignore`).
- **Links da base de referência:** os 16 repositórios citados só como link responderam ao `git ls-remote`; `pro.magicui.design` respondeu 200.

## Ficaram só como referência (não copiadas)

- **Skills:** `web-design-guidelines`, `frontend-design`, `web-artifacts-builder`, `next-dev-loop` e as outras skills do Next.js, `web-perf` (Cloudflare), `playwright-best-practices`, `agent-browser`, `astro` (comunidade, v0.0.1), `analytics`, `schema`, `ai-seo`, `programmatic-seo`, `vercel-optimize`; `*/superpowers@landing-page-design` descartada (cópias de 4 donos).
- **MCPs (instalar só com aprovação):** Playwright MCP, Chrome DevTools MCP, next-devtools-mcp, MCP do shadcn, MCP do Refero (pago).
- **Templates:** todos por link e `fontes.txt`; pagos e restritos (Tailwind Plus, Magic UI Pro, Tailark, Aceternity, Cruip, React Bits, shadcnblocks, Once UI magic-portfolio) só como link.
