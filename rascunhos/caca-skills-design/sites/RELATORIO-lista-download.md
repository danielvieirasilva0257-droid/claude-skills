# Lista de download do Daniel: skills e ferramentas para fazer sites com IA

Relatório de 12/10/2026. Os 9 itens das duas listas do vídeo foram procurados, lidos e avaliados (licença, commit, risco, o que já temos). **Nada foi salvo no repositório e nada foi instalado.** Tudo está no rascunho (`scratchpad/hunter/sites/PROPOSTA/`), esperando o seu "sim".

## Resumo em 6 linhas

1. **5 dos 9 viram skill** (cópia sem mudar nada, com licença e anotações nossas): Taste Skill, Web Design Guidelines, Frontend Design, Image to Code e Playwright CLI.
2. **3 dos 9 são MCPs, não skills** (shadcn, Magic/21st.dev e Chrome DevTools). Não dá para "copiar": criei **uma skill nossa, `mcps-para-sites`**, que é o manual dos três (comando de instalação para o **seu computador**, privacidade, chave, custo, riscos).
3. **O Awesome Design não vira skill nova**: 15 das 74 fichas de marca já estão na `estilos-premium`. As outras 59 entram na lista de download como **uma linha** no `fontes.txt` e um trecho no `referencia-sites`, para baixar **uma ficha só** quando precisar.
4. **O "Magic MCP" mudou de nome:** agora é **21st MCP**, a chave antiga parou de funcionar, e ele é **pago** para pegar o código dos componentes. Recomendo **não** ligar por enquanto.
5. **O Chrome DevTools MCP manda estatísticas ao Google por padrão.** Existe flag para desligar (`--no-usage-statistics`) e já está no comando que deixei pronto.
6. Teste de detecção (`npx skills add ... --list`, sem instalar): **21 skills encontradas, nenhuma falhou, nenhuma "Skipped"** (as 15 de antes mais as 6 novas).

## Tabela dos 9 itens

Instalações = contagem do catálogo skills.sh (`npx skills find`) em 12/10/2026. Estrelas = página do GitHub em 12/10/2026. "Commit" é o que foi lido e copiado.

| # | Item | Repositório | Licença | Commit (data) | Instalações / estrelas | O que faz (em uma frase) | Risco principal | Onde fica na nossa estrutura | Veredito |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Taste Skill** | leonxlnx/taste-skill (skill `design-taste-frontend`, v2 experimental) | MIT | `d237dd3` (11/10/2026) | 593,7 mil instalações; 94,8 mil estrelas | Faz a IA desenhar interface "anti-genérica": lê o briefing, tem 3 botões (variância, movimento, densidade) e uma lista de padrões proibidos de IA | Muito grande (uns 22 mil tokens); tem padrões com recorte/máscara que quebram as suas 4 regras; usa imagens provisórias de sites de terceiros | `skills/design/taste-skill/` | **Entra intacta** (opcional) |
| 2 | **Web Design Guidelines** | vercel-labs/agent-skills (skill `web-design-guidelines`) | MIT (só no README; o repositório não tem arquivo LICENSE) | `063bee9` (28/08/2026); regras: `434b7f9` (05/10/2026) | 723,9 mil; 32,3 mil estrelas | Revisa o código de interface contra 100+ regras da Vercel e lista os achados por arquivo e linha | O original **busca as regras na internet a cada uso** (texto que muda sem a gente ver) | `skills/design/web-design-guidelines/` (+ cópia fixada das regras) | **Entra intacta**, usando as regras fixadas |
| 3 | **Awesome Design** | VoltAgent/awesome-design-md | MIT | `13be5c0` (05/10/2026) | 120,4 mil estrelas (não é skill; sem contagem de instalações oficial) | 74 fichas `DESIGN.md` com cores, fontes e regras de sites de marcas conhecidas | Marcas e logos são dos donos; fichas podem estar defasadas; README faz propaganda de kits pagos | 15 já em `estilos-premium`; as outras 59: linha em `referencia-sites/fontes.txt` + seção F | **Só referência** (baixar uma ficha sob demanda) |
| 4 | **Image to Code** | leonxlnx/taste-skill (skill `image-to-code`, pasta `image-to-code-skill`) | MIT | `d237dd3` (11/10/2026) | 359,4 mil; 94,8 mil estrelas | Gera uma imagem por seção do site, analisa e só então escreve o código igual à imagem | Exige gerador de imagem (gasta crédito e envia o pedido a um servidor); quer a imagem como "fonte da verdade" (aqui é o DESIGN.md) | `skills/design/image-to-code/` | **Entra intacta** (opcional, só com o seu "sim" para o gerador) |
| 5 | **Playwright CLI** | microsoft/playwright-cli (skill `playwright-cli`, programa `@playwright/cli` 0.1.22) | Apache-2.0 | `b85c7a7` (28/09/2026) | 181,1 mil; 14,0 mil estrelas | Deixa a IA usar um navegador por comandos curtos: prints, cliques, formulário, console, vídeo | Libera comandos sem perguntar e roda JavaScript; pode se conectar ao seu Chrome pessoal se mandarem; o navegador não está no container | `skills/sites/playwright-cli/` | **Entra intacta** (programa instalado por fora, com aprovação) |
| 6 | **shadcn MCP** | shadcn-ui/ui (comando `shadcn mcp`; `shadcn` 4.21.4) | MIT | `02cad61` (11/10/2026) | 125,4 mil estrelas; a skill `shadcn` tem 372,3 mil instalações | Busca e instala componentes de registros shadcn | Instala código de terceiros no projeto (ler antes); baixa pacote com `npx` | Manual em `skills/sites/mcps-para-sites/` (a skill `shadcn` já cobre o mesmo pela linha de comando) | **Só instruções** |
| 7 | **Magic MCP (agora 21st MCP)** | 21st-dev/magic-mcp (proxy) e `@21st-dev/cli` 1.18.0 | ISC (proxy); MIT (CLI) | o repositório hoje é só um repasse de compatibilidade; pacote `@21st-dev/magic` 0.2.3 (09/09/2026) | 6,0 mil estrelas; skill `21st-ui` com 128 instalações | Busca e gera componentes React da 21st.dev (12 mil componentes) | **Pago** (código e IA); **envia pedidos e contexto do projeto à 21st.dev e a provedores de IA**; telemetria do CLI sem como desligar; a chave antiga foi zerada | Manual em `skills/sites/mcps-para-sites/` | **Só instruções**; recomendo não ligar por ora |
| 8 | **Frontend Design** | anthropics/skills (skill `frontend-design`) | Apache-2.0 | `dbd4588` (09/10/2026) | 975,5 mil (a mais instalada de design); 180,6 mil estrelas | Plano curto de design, revisão contra o briefing, fugir dos 5 visuais típicos de IA | Quase nenhum (curta, só lê); já é fonte da `ui-ux-pro-max` | `skills/design/frontend-design/` | **Entra intacta** |
| 9 | **Chrome DevTools MCP** | ChromeDevTools/chrome-devtools-mcp (v1.10.1) | Apache-2.0 | `f08dbe1` (09/10/2026) | 53,3 mil estrelas; skill `chrome-devtools` com 8 mil | Liga a IA a um Chrome real: trace de desempenho (LCP, INP, CLS), Lighthouse, console, rede | **Envia estatísticas ao Google por padrão** e URLs ao CrUX; dá acesso total ao navegador; roda JavaScript na página | Manual em `skills/sites/mcps-para-sites/` | **Só instruções** (flags de privacidade incluídas) |

## Item por item

### 1. Taste Skill (entra intacta, opcional)
- **Licença:** MIT, "Copyright (c) 2026 Leonxlnx" (arquivo `LICENSE` lido e copiado).
- **O que tem:** a skill `design-taste-frontend` (a pasta se chama `taste-skill`). É a **v2 experimental**: o autor avisa que ainda muda. O repositório tem mais 11 skills (v1, gpt-taste, soft, minimalist, brutalist, redesign, output, stitch e três só de imagem). Elas **não se citam entre si**, então cada uma seria uma pasta; **copiei só a que você pediu**.
- **Verifiquei:** "image-to-code" **é** uma das skills desse repositório (item 4).
- **Cuidados:**
  - **Tamanho:** 89 KB, uns 22 mil tokens. Escrevi no `APRENDIZADOS.md` um mapa de quais linhas ler.
  - **A seção 12 promete uma pasta `blocks/` que não existe.** Ignorar.
  - **Choque com as suas 4 regras de composição:** o vocabulário dela inclui *Curtain-Reveal Hero* e *Text Mask Reveal* (texto como janela para vídeo) e pilhas de cards presas na rolagem. Marquei "não usar sem passar pelas 4 regras".
  - Manda usar `picsum.photos` e `cdn.simpleicons.org` como imagem/ícone provisório: são pedidos de rede de terceiros; trocar antes de publicar.
  - Não executa nada sozinha, não tem telemetria, não pede chave.
- **Já temos:** a `ui-ux-pro-max` usa o taste-skill como **fonte** (commit `717446e`). Desde então o arquivo mudou; a cópia nova é do commit `d237dd3`. Instalar o original dá o texto completo, mas ele não conhece o nosso `DESIGN.md`. Papel sugerido: **consultor e revisor opcional**.

### 2. Web Design Guidelines (entra intacta, com as regras fixadas)
- **Licença:** o repositório `agent-skills` **não tem arquivo LICENSE**; o README diz "MIT" (mesma situação da `deploy-to-vercel`, anotada em `LICENCA-NOTA.md`). As regras vêm de outro repositório (`web-interface-guidelines`), que tem LICENSE MIT, "Copyright (c) 2025 Vercel Labs".
- **Achado importante:** o `SKILL.md` original tem só 1,2 KB e **não traz as regras**: manda buscar na internet, a cada revisão, um arquivo da ramificação `main` de outro repositório. Isso é texto de instrução que muda sem a gente ver. **Acrescentei uma cópia igual** (conferida byte a byte em 12/10/2026) em `regras-fixadas/command.md` e instruí no `APRENDIZADOS.md` a usar essa cópia. O `SKILL.md` original continua intacto.
- **Já temos:** a `ui-ux-pro-max` tem um **resumo em português** dessas regras (`checklist.md`, mesmo commit `434b7f9`). A original dá o relatório completo por arquivo e linha.

### 3. Awesome Design (só referência)
- **Hoje:** **74 fichas** `design-md/<marca>/DESIGN.md` (o README ainda diz 73), 2,9 MB, MIT, "Copyright (c) 2026 VoltAgent", commit `13be5c0` (05/10/2026), o mesmo que já usamos.
- **Como entra na lista de download (feito no rascunho):**
  - uma linha nova no `referencia-sites/fontes.txt` (mesmo formato);
  - seção F no `SKILL.md` do `referencia-sites` com a lista das 59 marcas que **ainda não** temos e **dois comandos testados** para baixar **uma ficha só** para a pasta do projeto: `curl` do arquivo bruto no commit fixado (24 KB) ou `git sparse-checkout` (44 KB).
- **Sobre o script `baixar-referencia.sh`:** testei com a linha nova e ele funciona, mas baixa a **coleção inteira** (2,9 MB, 74 fichas) porque faz um clone do commit. Não mexi no script (ele é pequeno e serve aos outros templates); a ficha única fica nos comandos acima.
- **Cuidados:** são análises "inspiradas", não guias oficiais; logos, fotos e fontes são dos donos; confira as cores no site real; o README faz propaganda de kits pagos do `getdesign.md` (só link).

### 4. Image to Code (entra intacta, opcional)
- **Como identifiquei:** `npx skills find image to code` devolve em primeiro lugar `leonxlnx/taste-skill@image-to-code` (359,4 mil instalações). Os outros resultados são de áreas diferentes (publicar no X, SDKs, ferramentas de pintura/imagem), com no máximo 28 mil instalações. É do mesmo autor da Taste Skill e aparece nas listas junto com ela. **Confiança alta.** Se o vídeo falava de outra ferramenta com esse nome (por exemplo, converter imagem do Figma em código), me diga.
- **Licença:** MIT, mesmo `LICENSE` da Taste Skill. Arquivo de 36 KB (uns 9 mil tokens).
- **Cuidados:**
  - **Precisa de gerador de imagem** (o original foi escrito para o Codex). No nosso ambiente seria o Gemini ou o Higgsfield: gasta crédito e envia o texto a um servidor. Preciso do seu "sim", do gerador e de um **teto de imagens** (a skill manda gerar uma imagem por seção e "não ser preguiçosa").
  - **Choque de ordem:** ela quer a imagem como "fonte da verdade"; aqui é o `DESIGN.md`. Regra anotada: gerar as imagens **depois** do `DESIGN.md` aprovado e mostrar a você antes do código.
  - Texto dentro de imagem gerada costuma sair errado: o texto vem sempre do passo de copy.

### 5. Playwright CLI (entra intacta; programa por fora)
- **Verifiquei:** o repositório certo é `microsoft/playwright-cli` (pacote `@playwright/cli` 0.1.22, Apache-2.0, "Copyright Microsoft"). A busca também mostrou `openai/skills@playwright` (7,9 mil instalações) e o `agent-browser` (da Vercel, já deixado de fora em 11/10/2026).
- **Copiado:** a pasta inteira da skill (`SKILL.md` + 10 arquivos de referência, uns 70 KB, sem binários) e o `LICENSE`.
- **Para que serve no combo:** prints em celular e computador (`open --mobile`, `resize`), tema claro e escuro, movimento reduzido (`set-reduced-motion`), cliques, formulário, console, **vídeo** e `show --annotate` (você marca no site o que quer mudar).
- **Cuidados (os que importam):**
  - O cabeçalho **libera os comandos sem perguntar** (`allowed-tools`) e a skill tem `run-code` e `eval` (rodam JavaScript). Só no projeto do site.
  - **Nunca** usar `attach --cdp=chrome` nem `attach --extension` (ligam ao seu Chrome real) nem `--persistent`/`--profile` com perfil pessoal.
  - `state-save` grava cookies em arquivo: é como uma senha, fora do repositório.
  - O programa e o navegador **não estão no container** hoje. Instalar baixa um navegador (centenas de MB): só na pasta do projeto ou no seu computador, com o seu "sim".
  - Uma consulta por dia ao registro do npm (desligável com `NO_UPDATE_NOTIFIER=1`). Sem telemetria, sem chave.
- **Já temos:** a `webapp-testing` (Anthropic). Regra de escolha anotada: `playwright-cli` para prints e cliques (gasta menos créditos); `webapp-testing` quando precisar subir o servidor junto.

### 6, 7 e 9. Os três MCPs (só instruções, na skill nossa `mcps-para-sites`)
A skill tem um bloco para cada um, com comando de instalação **para o seu computador**, versão fixa, privacidade, chave, custo e riscos. Resumo:

| | shadcn MCP | 21st MCP (antigo Magic) | Chrome DevTools MCP |
|---|---|---|---|
| Comando (Claude Code, no seu computador) | `claude mcp add --scope project shadcn -- npx -y shadcn@4.21.4 mcp` (dentro do projeto) | `npx @21st-dev/cli@1.18.0 init --client claude` (mostra a configuração antes de gravar) | `claude mcp add --scope user --env CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS=1 chrome-devtools -- npx -y chrome-devtools-mcp@1.10.1 --isolated --no-usage-statistics --no-performance-crux --redact-network-headers` |
| Chave | Não precisa (registros públicos) | **Sim**, nova, em 21st.dev/mcp (as antigas foram zeradas). Guardar em variável de ambiente; no container, `/root/.config/rotina/` | Não precisa |
| Custo | Grátis | Chave grátis; **código de componente e IA são pagos**. Planos lidos em 21st.dev/pricing: Free (2 cópias por dia), Builder US$ 6/mês no anual, Builder + AI de US$ 15 a US$ 60/mês, Team US$ 7,50 por pessoa. **As fontes discordam entre si** (uma página de ajuda citada deu erro 404): confirmar antes de pagar | Grátis |
| O que sai do seu computador | Pedidos aos registros listados no projeto | **Tudo que a IA escrever nos pedidos**, a chave, o contexto de design do projeto (cores, fontes, tecnologia) com `--context auto`, e nome de comandos do CLI. Política de privacidade da 21st: guarda prompts e código, repassa a hospedagem, observabilidade e provedores de IA (Anthropic e OpenAI), registros por até 12 meses; diz que não treina modelos próprios sem consentimento | Estatísticas de uso ao Google (**ligadas por padrão**), URLs de trace ao CrUX (**ligado**), consulta de versão ao npm |
| Como desligar | Não há o que desligar | Não mandar código secreto nem dados do cliente nos pedidos; não há opção para a telemetria do CLI | `--no-usage-statistics`, `--no-performance-crux`, `CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS=1`, `--redact-network-headers`, `--isolated` (já no comando) |
| Nunca fazer | Aceitar componente sem ler | Depender do serviço no site (copiar o código) | `--autoConnect`, `--browserUrl`, `--wsEndpoint` (ligam ao Chrome pessoal) |

- **shadcn MCP:** não repete nada novo para nós, porque a skill `shadcn` (já na proposta) traz o mesmo pelo comando `npx shadcn`. Fica como opção.
- **21st MCP:** recomendo **não ligar agora**. As coleções gratuitas (Magic UI, Kokonut UI, via shadcn) já estão na `referencia-sites`. A licença de cada componente da 21st.dev é do autor; não verifiquei o catálogo.
- **Chrome DevTools MCP:** é o mais útil dos três para nós (medir LCP, INP, CLS e Lighthouse num Chrome real: o passo "medir, corrigir, medir de novo" do combo). O repositório dele tem 7 skills próprias (as úteis seriam `debug-optimize-lcp` e `a11y-debugging`); **não copiei**, só listei.

### 8. Frontend Design (entra intacta)
- **Licença:** Apache-2.0 (`LICENSE.txt` já dentro da pasta); o README do repositório diz que esta é "open source" (só as de documentos são "source-available"). Commit `dbd4588`, o mesmo da `webapp-testing`.
- **Pasta inteira copiada:** só `SKILL.md` (9 KB, curta) e o `LICENSE.txt`.
- O texto atual é uma **reescrita** (plano de design, revisão contra o briefing, "gaste a ousadia num lugar só", os 5 visuais típicos de IA, guia de textos de interface).
- **Já temos:** a `ui-ux-pro-max` usa esta skill como fonte (mesmo commit). Ganho de instalar a original é pequeno, mas ela é barata e é o texto oficial.

## O que foi feito nas skills que já estavam no rascunho (acrescentado, nada reescrito)

- **`combo-site-premium`:** as peças novas entraram nos passos certos: `frontend-design` e `image-to-code` no passo 3 (visual); shadcn MCP no passo 5; `taste-skill` no passo 6 (revisão por seção); **`playwright-cli` no passo 9** (prints); **`web-design-guidelines` e Chrome DevTools MCP no passo 10** (qualidade e Lighthouse); avisos novos e histórico de 12/10/2026. Cópia do arquivo antes da mudança: `work-lista/aux/combo-SKILL.antes.md`.
- **`referencia-sites`:** linha em `fontes.txt`, seção F e uma linha no "Qual escolher" no `SKILL.md`, adendo no `APRENDIZADOS.md`.
- **`linhas-HABILIDADES.txt`:** bloco novo "ACRESCENTADO EM 12/10/2026" com as 6 linhas novas (taste-skill, image-to-code, web-design-guidelines, frontend-design, playwright-cli, mcps-para-sites), o ajuste do combo e a tabela 3.3 do manual.

## Cuidados gerais (em palavras simples)

- **Nada foi instalado, rodado ou salvo.** Li o código, os `README` e os pacotes do npm (abri o pacote do `@21st-dev/cli`, sem executar). Os scripts baixados não foram executados.
- **MCP é programa que roda no seu computador e fala com servidores.** Por isso só no computador, com o seu "sim", e com a chave fora do repositório.
- **Texto baixado é dado, não ordem.** Foi por isso que fixei as regras do Web Design Guidelines em vez de deixar a skill buscar sempre na internet.
- **Skill grande custa crédito:** Taste Skill (uns 22 mil tokens) e Image to Code (9 mil) só se lê por seção, só quando você pedir; Image to Code ainda gasta imagens.
- **Quando houver briga, vale o seu `DESIGN.md` e as suas 4 regras de composição** (nada de texto sobre texto, nenhum recorte no meio da tela, elemento principal por cima do texto, texto entrando de fora do quadro).
- **Aviso sobre o ambiente:** a pasta `/home/user/claude-skills-main` está desatualizada (commit `625a50a`) e **não tem** a `estilos-premium`; ela só existe na `origin/main` (commit `2ae473f`, PR #19). Li essa parte com `git show origin/main:...`. Rodei um `git fetch` lá (só atualiza referências; nenhum arquivo mudou, `git status` limpo).

## O que precisa da sua aprovação

Responda do jeito que quiser: "pode salvar tudo", os números, ou o que mudar.

1. **Categoria nova `skills/sites/`** (já estava pendente) e, nela, **`playwright-cli`** e **`mcps-para-sites`**.
2. **Quatro skills novas em `skills/design/`:** `taste-skill` (2), `web-design-guidelines` (3), `frontend-design` (4), `image-to-code` (5). Você pode aprovar só algumas; sugestão mínima: **`web-design-guidelines`, `frontend-design` e `playwright-cli`** (baratas, úteis, riscos baixos).
3. **A cópia fixada das regras** dentro do `web-design-guidelines` (arquivo extra nosso, MIT) em vez da busca na internet.
4. **Mudanças no `combo-site-premium` e no `referencia-sites`** (são skills nossas): ver o `SKILL.md` novo de cada um.
5. **Awesome Design:** concorda com a linha no `fontes.txt` e a seção F (baixar uma ficha só)?
6. **Decisões que são suas, não de salvar arquivo:**
   - instalar o **Playwright CLI e um navegador** (na pasta do projeto, no container, ou só no seu computador)?
   - ligar o **Chrome DevTools MCP** e o **shadcn MCP** no seu computador? (recomendo o DevTools; o shadcn é opcional)
   - **21st MCP / Magic:** não assinar nem ligar agora (minha recomendação). Se quiser, é preciso gerar a chave nova e aprovar o plano.
   - **Image to Code:** qual gerador de imagem e qual o teto de imagens por site?
   - O **Image to Code é mesmo o do vídeo?** Se a ferramenta era outra, me diga o nome.

## Arquivos criados e mudados (caminhos em `scratchpad/hunter/`)

Novos (todos em `sites/PROPOSTA/skills/`):
- `design/taste-skill/`: `SKILL.md` (intacto), `LICENSE`, `ORIGEM.md`, `APRENDIZADOS.md`
- `design/image-to-code/`: `SKILL.md` (intacto), `LICENSE`, `ORIGEM.md`, `APRENDIZADOS.md`
- `design/web-design-guidelines/`: `SKILL.md` (intacto), `ORIGEM.md`, `APRENDIZADOS.md`, `LICENCA-NOTA.md`, `regras-fixadas/command.md`, `regras-fixadas/LICENSE`
- `design/frontend-design/`: `SKILL.md` e `LICENSE.txt` (intactos), `ORIGEM.md`, `APRENDIZADOS.md`
- `sites/playwright-cli/`: `SKILL.md` e `references/` (intactos, 10 arquivos), `LICENSE`, `ORIGEM.md`, `APRENDIZADOS.md`
- `sites/mcps-para-sites/`: `SKILL.md` (nossa), `APRENDIZADOS.md`

Acrescentados (existiam):
- `sites/PROPOSTA/skills/combos/combo-site-premium/SKILL.md` e `APRENDIZADOS.md`
- `sites/PROPOSTA/skills/sites/referencia-sites/SKILL.md`, `fontes.txt` e `APRENDIZADOS.md`
- `sites/PROPOSTA/linhas-HABILIDADES.txt`

Este relatório: `sites/RELATORIO-lista-download.md`.

Clones, testes e anotações de trabalho (podem ser apagados): `work-lista/` (clones, `net/`, `npm21/` com o pacote do 21st aberto sem executar, `test-ref/`, `teste-deteccao/`).

## Conferido

- **Originais intactos:** comparação byte a byte (`cmp` e `diff -r`) de todas as cópias com os clones, sem diferença. Nenhuma chave nos arquivos.
- **Teste de detecção:** cópia de `PROPOSTA/skills` numa pasta temporária e `npx skills@1.7.2 add <pasta> --list` (sem instalar): **21 skills encontradas**, incluindo `design-taste-frontend`, `image-to-code`, `web-design-guidelines`, `frontend-design`, `playwright-cli` e `mcps-para-sites`. **Nenhum "Skipped"**, nenhum erro de YAML.
- **Número de instalações e estrelas:** instalações vêm do catálogo `npx skills find`; estrelas, das páginas do GitHub lidas por ferramenta de leitura de página (podem variar um pouco).
- **Ainda não testado:** nenhum dos 3 MCPs foi instalado; os comandos vêm da documentação oficial e do código lido. No primeiro uso, anotamos o que funcionou.
