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
