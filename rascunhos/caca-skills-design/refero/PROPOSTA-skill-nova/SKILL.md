---
name: estilos-premium
description: "Biblioteca de estilos premium, minimalistas e animados para sites e telas (Apple, Samsung, BMW, Ferrari, Tesla, Nike, Stripe, Linear, Vercel e outros): escolher UMA referência de marca, travar o que copiar e o que não copiar, e escrever o DESIGN.md do projeto (modelo incluído), com fichas de marca prontas, índice de 64 estilos e regras de composição do editor aplicadas a sites. Use quando pedirem um site, landing page ou tela 'no estilo da Apple', 'tipo Samsung', 'parecido com a Tesla', 'premium', 'caro', 'luxo', 'minimalista', 'com animação de agência', quando perguntarem que estilo usar, ou quando for criar, ler ou usar um DESIGN.md."
---

# Estilos premium: biblioteca de referências e DESIGN.md

Esta skill responde a três perguntas:
1. **Em qual visual me inspiro?** Tem 5 arquétipos, 15 fichas de marca e um índice de 64 estilos.
2. **O que pego e o que deixo** dessa referência? É a trava da referência.
3. **Como passo isso para o agente** sem ele inventar? Com o `DESIGN.md` do projeto.

**Divisão com as outras skills:**
- As **regras gerais** de interface premium (escala, contraste, cor, acessibilidade) ficam na `ui-ux-pro-max`.
- A **técnica de animação** fica na `motion-oficial` e na `button-animation`.
- Aqui ficam a **biblioteca**, a **escolha do estilo**, o **DESIGN.md** e os **números medidos por arquétipo**, para consulta.

**De onde veio:**
- Pesquisa de 11/10/2026 no Refero Styles: 64 estilos estudados. **Não guardamos nenhum arquivo do Refero**, porque os termos proíbem republicar. O que fica aqui são o índice com links e o que aprendemos, escrito por nós.
- As 15 fichas de marca vêm da coleção **VoltAgent/awesome-design-md**, com licença MIT.
- Detalhes em `ORIGEM.md`.

## Arquivos

| Arquivo | Quando ler |
|---|---|
| `references/resenha-o-que-aprendemos.md` | **Primeiro, se for a primeira vez:** o que faz um site parecer caro e o que faz parecer feito por IA, por ideia, com números |
| `references/marcas/<marca>-DESIGN.md` | Ao escolher uma marca como referência. São 15 fichas completas (MIT), lidas no `LEIA-ME.md` da pasta |
| `references/indice-estilos.md` | Para procurar mais referências: 64 estilos do Refero, com tipo, resumo nosso e link (abrir no navegador) |
| `references/padroes-premium.md` | Para os números por tema e as paletas iniciais de cada arquétipo (contraste conferido) |
| `references/movimento-sites.md` | Para animar o site: personalidades, durações, curvas, receitas e as trocas exigidas pelas regras do editor |
| `references/modelo-DESIGN.md` | Para criar o `DESIGN.md` do projeto (modelo em branco, em português) |
| `assets/receitas-movimento.tsx` | Código das receitas M1 a M8 (Motion 14 e Tailwind v4), testado no TypeScript estrito |
| `ORIGEM.md` e `LICENSE-refero-skill-MIT.txt` | Fontes, licenças e o que os termos do Refero permitem |
| `APRENDIZADOS.md` | Sempre, logo depois deste arquivo |

## Regras de ouro

1. **Primeiro o `DESIGN.md`, depois a interface.** Sem ele, o agente inventa valores.
2. **Uma referência principal.** Mais 1 ou 2 secundárias, só para detalhes. **Nunca tire a média**: o meio-termo de várias marcas é o visual genérico.
3. **Pegue a linguagem, não a marca.** Proporções, ritmo, papel da cor, peso da fonte e movimento, sim. Logo, nome, fotos, textos, fontes proprietárias e o produto da marca, **nunca**. O resultado precisa passar no teste da identidade: não pode parecer o site da Apple com outro logo.
4. **Todo valor tem um papel.** Toda cor, fonte e raio diz onde usar e onde **nunca** usar. Exemplo: o azul só no botão principal.
5. **Respeite a assinatura da referência.** Se ela usa título fino, raio 0 ou nenhuma cor, mantenha. Não "normalize" para o padrão.
6. **As 4 regras de composição do editor valem no site** (seção abaixo).

## Passo a passo

1. **Brief em 3 camadas:**
   - **produto:** o que precisa existir (conteúdo, provas, ações);
   - **referência:** como deve parecer;
   - **restrições:** stack, prazo.

   Se faltar uma, o agente chuta. Fórmula do pedido:
   > "[Tela] para [público] fazer [tarefa]. Use o DESIGN.md para tipografia, papéis de cor e superfícies. Use nosso texto, dados e comportamento reais. Inclua [seções e estados]. Diga o que veio da referência e o que mudou."
2. **Escolha o arquétipo** (tabela abaixo) e **uma marca**. Leia a ficha em `references/marcas/` ou abra o estilo do índice no navegador. Veja também o site real.
3. **Trave a referência** em 6 linhas, antes de codar:
   - **Referência principal:** [nome e link].
   - **Preservar:** [3 a 5 traços que a tornam reconhecível].
   - **Pegar emprestado:** [1 ou 2 detalhes das secundárias].
   - **Papéis:** [qual cor, fonte ou raio serve para quê].
   - **Mídia:** [foto do produto, screenshot, ilustração ou só tipografia].
   - **Rejeitar:** [o que não entra, inclusive tudo que é da marca].
4. **Escreva o `DESIGN.md`** a partir de `references/modelo-DESIGN.md` (seção "DESIGN.md" abaixo). Mostre ao Daniel antes de codar: é um ponto de aprovação.
5. **Registre as decisões** numa tabela com as colunas Decisão, Fonte, Regra ou papel e Por quê. **Decisão grande sem fonte não entra.**
6. **Implemente nesta ordem:** tokens (variáveis CSS ou `@theme` do Tailwind v4), componentes com todos os estados, páginas. Siga a `ui-ux-pro-max` para as regras gerais.
7. **Anime** com a personalidade escolhida (`references/movimento-sites.md`, `motion-oficial`, `button-animation`).
8. **Revise** com a checklist do fim deste arquivo, prints em 1440 px e 390 px, e a folha de quadros das animações.
9. **Entregue** os prints lado a lado com a referência, mais 3 a 5 linhas: o que veio da referência e o que foi decidido para o produto.

## Escolher o estilo: 5 arquétipos

| Arquétipo | Serve para | Fichas (MIT) | Mais no índice | Assinatura |
|---|---|---|---|---|
| **Galeria clara** | Produto físico, app de consumo, loja premium | apple, bmw, nike, tesla | B&O, Dyson, Sonos, Apple España, AirPods | Fundo quase branco alternado com branco; título grande em peso 500 a 600; 1 cor de ação; pílula com cards de 28 px; zero sombra |
| **Palco escuro** | Lançamento, linha "Pro", carro, esporte | ferrari, lamborghini, bugatti, spacex | iPhone 18 Pro, Apple Watch | Preto ou quase preto; foto de cinema em tela cheia; texto quase branco; cor só no produto ou no hover; caixa-alta espaçada no automotivo |
| **Instrumento de precisão** | SaaS, fintech, ferramenta, painel | linear, vercel, stripe, raycast | shadcn/ui, Attio, Cursor | Degraus de cinza; linhas de 0,5 a 1 px; mono nos metadados; raio de 4 a 8 px; 1 cor elétrica numa ação por vista |
| **Editorial** | Conteúdo, revista, cultura, moda, hotelaria | notion, superhuman | Monocle, Medium, Exhibition, Anthropic | Serifa grande com entrelinha de 0,8 a 1,0; raio 0; linhas finas. **Cuidado:** creme com serifa e acento terracota virou o "padrão de IA". Só use se o produto for de conteúdo |
| **Estúdio animado** | Agência, portfólio, lançamento de impacto | framer | monopo, OFF+BRAND, Lusion, Active Theory, Dia | A cena 3D ou o vídeo carrega a cor; interface "fantasma"; hero que se monta em 1 a 2 s |

- **"Tipo Samsung":** não há ficha nem estilo no Refero. Use a Galeria clara com estes ajustes:
  - CTA **preto**, com 20 px de raio e 40 px de altura;
  - título em sans geométrica bold (700);
  - azul só no hover e no foco;
  - botão contornado que inverte no hover;
  - foto do card com zoom de 1,05 no hover.

  Valores em `references/padroes-premium.md`, seção 9.
- **Para o Rotina** (app mostrado no celular): Galeria clara, com o celular como "produto" e a personalidade de movimento "premium com peso".

**As fichas MIT e o Refero podem discordar.** Exemplo: o acento do Linear aparece como lavanda numa e verde-limão na outra, porque foram capturadas em datas diferentes. Confira no site real e anote a data no `DESIGN.md`.

## Números-chave por arquétipo (resumo)

Regras gerais (contraste, escala, acessibilidade): `ui-ux-pro-max`. Números completos e paletas iniciais: `references/padroes-premium.md`.

| Tema | O que os sites premium medidos fazem |
|---|---|
| Título do hero | 56 a 96 px, com peso de 300 a 600 e tracking de −0,015 a −0,06 em (mais negativo quanto maior). Automotivo usa caixa-alta com +0,08 a +0,10 em |
| Corpo | 16 a 18 px (Apple usa 17), entrelinha de 1,47 a 1,6 |
| Cor | 22 de 27 sites premium têm a interface praticamente cinza. Há 1 cor de ação com um único trabalho, e a foto do produto carrega a cor |
| Fundo e texto | Fundo quase branco tingido ou quase preto. Texto quase preto (#1d1d1f) ou, no escuro, #f5f5f7 |
| Espaço | Base de 4 px; 96 px entre seções (de 80 a 160); texto com 540 a 680 px de largura |
| Formas | Pílula com cards de 12 a 28 px, **ou** 0 a 6 px. Até 3 raios. Zero sombra em 23 de 27 sites |
| Botões | 1 preenchido por tela + 1 contornado ou link "›"; altura de 36 a 48 px |
| Movimento | "Muda de cor, não de posição": hover de 150 a 250 ms, seções de 0,5 a 0,75 s, nada de mola em texto, 1 loop por tela no máximo |

## DESIGN.md: como escrever e usar

**O que é:** um arquivo de texto na raiz do projeto, um "README do visual" para o agente. Ele junta duas coisas:
- **tokens:** valores exatos;
- **papéis:** onde usar e onde nunca usar cada valor.

O formato foi popularizado pelo Google Stitch, e as fichas em `references/marcas/` seguem esse padrão.

**Duas formas de começar:**

1. **Pelo modelo em branco** (`references/modelo-DESIGN.md`). É o caminho preferido:
   - preencha com as nossas palavras;
   - troque cada `[colchete]` por uma regra observada ou por uma decisão de propósito;
   - o que não souber vai em "Decisões em aberto".
2. **Por uma ficha MIT** de `references/marcas/`:
   - copie para a raiz como `DESIGN.md` e **mantenha a atribuição** no topo: `<!-- Base: VoltAgent/awesome-design-md (MIT), ficha <marca>. Adaptado para <projeto>. -->`;
   - **troque** o nome da marca, o logo, as fontes proprietárias (use as substitutas que a própria ficha sugere), as fotos e os textos;
   - acrescente as seções que o nosso modelo tem e a ficha não: trava da referência, **Movimento**, **Composição**, **Decisões**.

**Regras do arquivo:**
- **Faça e não faça sempre com valores exatos.** Exemplo: "use #0a5fd1 só no botão primário, 1 por tela".
- A seção **Movimento** é obrigatória. Ela diz:
  - a duração de cada camada;
  - 1 ou 2 curvas de assinatura;
  - o que pode animar e o que nunca anima;
  - qual é o único movimento contínuo.
- **Ao mudar de direção,** mude primeiro o `DESIGN.md`, depois o código.

**Como ligar ao projeto.** No `CLAUDE.md` do projeto:

```markdown
## Visual
Antes de mudar qualquer interface, leia @DESIGN.md.
Use as cores, a tipografia, o espaço e o movimento dele.
Campos, textos, estados e comportamento vêm do projeto, não da referência.
```

**O que não fazer com o Refero:**
- Nunca faça commit de um DESIGN.md baixado do Refero. Os termos proíbem redistribuir e criar "repositório" com o conteúdo.
- Nunca rode robô ou extração automática no site: os termos proíbem, e o `robots.txt` bloqueia robôs de IA.
- Abra as páginas do índice **no navegador, como pessoa**, e anote com as suas palavras. Valores pontuais podem ser anotados, como "a Apple usa 17 px no corpo".
- Se o Daniel baixar um DESIGN.md pelo botão do site, para consulta, guarde numa pasta ignorada pelo git (por exemplo, `referencias-locais/`).

## Regras de composição do editor aplicadas a sites

As 4 regras do Daniel (detalhe em `skills/video/remotion-video/SKILL.md`) também valem em sites e telas:

1. **Nada de texto sobre texto, nem logo sobre texto, nem durante o movimento.**
   - Header fixo transparente ganha fundo (≥ 80% de opacidade, ou sólido) antes de o conteúdo passar por baixo.
   - Texto sobre foto, só em área lisa e com contraste ≥ 4,5:1.
   - Linhas em cascata não se cruzam (`bounce: 0`).
   - Marquee de logos nunca passa atrás de título.
   - Palavra que troca no título: evite. Se o Daniel quiser, use `AnimatePresence mode="wait"` com ≥ 2 s por palavra.
2. **Nenhum recorte no meio da tela.**
   - Nada de texto "subindo de uma fenda" (`overflow: hidden`, `clip-path`) com a borda de corte invisível.
   - Recorte só em borda real: botão com fundo, card, foto, tela do celular ou janela.
   - Blur precisa de espaço em volta.
   - Marquee esfumado, só na largura toda.
3. **O elemento principal fica por cima do texto.**
   - Camadas: fundo (z 0), depois textos e cards (z 10), depois produto, celular ou modal (z 20).
   - Em repouso, o produto não cobre o título. Ao rolar, só cobre depois de o título ter sido lido.
4. **O texto entra de um lugar que explique a entrada:**
   - da borda da janela;
   - de trás do produto;
   - do gatilho que o abriu.

   Ao rolar, dispare a entrada quando o elemento **encosta na borda de baixo**. **Na dúvida, o texto do hero fica parado e quem se move é o produto.**

**Revisão:**
- Capture a animação do hero a cada 100 ms, mais 3 posições de rolagem, em 1440 px e em 390 px (Playwright ou o navegador do Claude).
- Monte a folha de quadros e procure as 4 falhas.
- As receitas prontas e as trocas para os padrões que quebram as regras estão em `references/movimento-sites.md`.

## Checklist antes de entregar

- [ ] **Referência:** há uma principal e a trava está escrita? O print lado a lado mostra a mesma "família", mas com identidade própria (teste da identidade)?
- [ ] **Marca alheia:** nenhum logo, nome, foto, texto ou fonte proprietária da marca de referência no resultado.
- [ ] **DESIGN.md:**
  - tem papel em todo valor;
  - tem Movimento e Composição preenchidos;
  - a tabela de decisões tem fonte em cada linha;
  - o código usa só os tokens dele (procure hex, `text-[13px]` e raios soltos).
- [ ] **Assinatura preservada:** os 3 a 5 traços da trava estão lá, sem virar o meio-termo genérico.
- [ ] **Anti-"cara de IA"** (da skill oficial do Refero, MIT):
  - o acento não é índigo ou violeta por padrão;
  - cards só onde há interação;
  - não é escuro por padrão;
  - nada de emoji como ícone nem faixa colorida na lateral;
  - creme, serifa e itálico só em produto editorial;
  - apagar 30% do texto não melhora a página;
  - há **um** detalhe memorável.
- [ ] **Composição do editor:** folha de quadros revisada, sem nenhuma das 4 falhas.
- [ ] **Regras gerais da `ui-ux-pro-max`** cumpridas (contraste, estados, celular, acessibilidade).

## Caminho oficial do Refero (opcional)

- **Skill oficial `refero-design`** (`referodesign/refero_skill` 1.0.2, licença MIT):
  - é um método de "pesquisar antes de desenhar", com guias de tipografia, cor, movimento, ícones, texto e anti-"cara de IA";
  - funciona **sem conta**.
  - Instalar: `/plugin marketplace add referodesign/refero_skill` e depois `/plugin install refero@refero`. Só a skill: `npx skills add https://github.com/referodesign/refero_skill --skill refero-design`.
  - **Atenção:** a descrição dela se declara a skill "principal" de design e manda preferi-la às outras. Combine com o Daniel antes de instalar aqui.
- **MCP oficial** (pesquisa ao vivo em mais de 150 mil telas e 6 mil fluxos):
  - `claude mcp add --transport http refero https://api.refero.design/mcp`, depois `/mcp` para entrar;
  - precisa de plano **Pro, Team ou Lifetime** e tem limite de 8.000 chamadas por mês;
  - ferramentas principais: `refero_search_styles`, `refero_get_style`, `refero_search_screens` e `refero_search_flows`;
  - o token **nunca** vai para o repositório: fica em `/root/.config/`.
- **Sem plano:** use as fichas MIT e o índice, abrindo as páginas no navegador.

## Junto com as outras skills

| Skill | Papel |
|---|---|
| `ui-ux-pro-max` | Regras gerais de interface premium; busca de paletas e pares de fontes. Use **depois** de escolher a referência aqui |
| `button-animation` | Estados e animação de botões, com os valores do `DESIGN.md` |
| `motion-oficial` | Como animar (Motion 14 e CSS), curvas, molas e revisão |
| `thumbnail-carousel` | Vitrines e galerias. No premium: sem sombra, anel neutro e botão de pausa |
| `copywriting` e `humanizer` | O texto da página |
| `remotion-video` | Vídeo do site ou do app, com as mesmas cores e curvas convertidas em quadros |
