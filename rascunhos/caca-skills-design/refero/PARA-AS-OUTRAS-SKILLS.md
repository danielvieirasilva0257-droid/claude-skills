# O que costurar nas outras skills (pesquisa Refero, 11/10/2026)

Itens concretos, separados por skill e tirados dos três relatórios (premium, animação, minimalista).

- **Mudar `SKILL.md` precisa da aprovação do Daniel.** O `APRENDIZADOS.md` pode ser atualizado livremente.
- Os rascunhos novos de `ui-ux-pro-max`, `button-animation` e `motion-oficial` (feitos por outros agentes em `scratchpad/hunter/*/nova/`) foram **lidos, não alterados**. Abaixo aparece **só o que ainda falta** neles.
- **Regra para todas:** nada de arquivo do Refero entra no repositório (os termos proíbem). Entram regras nossas, números agregados e links.

---

## 0. Antes de tudo: dividir o território (há sobreposição)

A nova `ui-ux-pro-max` já cobre muita coisa da pesquisa:
- arquétipos;
- receitas "tipo Apple" e "tipo Samsung";
- trava da referência;
- modelo de DESIGN.md;
- regras de composição para telas;
- durações por camada;
- anti-"cara de IA".

A proposta `estilos-premium` foi ajustada para ser **complementar**. Sugestão de divisão:

| Tema | Fica em | O que fazer |
|---|---|---|
| Regras gerais com números (tipografia, cor, espaço, componentes, acessibilidade, anti-IA, checklist) | `ui-ux-pro-max` | `estilos-premium` só aponta para lá (já está assim) |
| Fluxo com aprovações (briefing → trava → DESIGN.md → tokens → componentes → revisão) | `ui-ux-pro-max` | `estilos-premium` cobre só as etapas "escolher a referência, travar e escrever o DESIGN.md" |
| **Biblioteca:** 15 fichas MIT, índice de 64 estilos com links, resenha didática | `estilos-premium` | `ui-ux-pro-max` aponta para lá na seção "Fontes de referência" |
| Receitas de movimento para **sites**, com código testado (M1 a M8) e trocas exigidas pelas regras do editor | `estilos-premium/references/movimento-sites.md` | `motion-oficial` e `button-animation` apontam |
| **Modelo do DESIGN.md** | **Um só arquivo** (hoje há dois) | Juntar: a versão da `ui-ux-pro-max` (cabeçalho YAML compatível com `npx @google/design.md lint`) + as seções da nossa (Trava da referência, **Movimento** detalhado, **Composição**, **Decisões** com fonte, substituta livre das fontes). Guardar numa skill e a outra aponta |
| Arquétipos com paletas iniciais e "tipo Samsung" | Duplicado: `ui-ux-pro-max/references/estilos-premium.md` e `estilos-premium/references/padroes-premium.md` | Manter **um**. Se ficar na `ui-ux-pro-max`, apagar o `padroes-premium.md` da proposta e levar para lá as **paletas com contraste conferido** (seção 8) |
| As 4 regras do editor traduzidas para tela | Hoje em 3 lugares (`ui-ux-pro-max`, `motion-oficial` nova e `estilos-premium`) | Escolher **um texto canônico** e os outros apontam. Sugestão: o da `ui-ux-pro-max`, mais a tabela "padrões que quebram as regras e a troca" de `movimento-sites.md` |

**Conflito para o Daniel decidir: fichas da VoltAgent.**
- A nova `ui-ux-pro-max` diz para baixar a ficha da marca **só para dentro do projeto, nunca para o `claude-skills`**.
- A proposta `estilos-premium` **inclui 15 fichas**, com a LICENSE MIT, por pedido do coordenador.
- A licença MIT permite as duas formas. A escolha é de organização: ter as fichas offline (cerca de 430 KB) ou baixar quando precisar.

---

## 1. `ui-ux-pro-max` (o que ainda falta no rascunho novo)

**No `SKILL.md`** (com aprovação):

1. **"Fontes de referência":** acrescentar `estilos-premium` como **primeira** fonte. Lá estão as fichas MIT, o índice de 64 estilos e a resenha.
2. **Evidência em números**, para dar peso às regras: "22 de 27 premium têm a interface praticamente cinza" e "23 de 27 sem sombra em card e botão".
3. **`tnum`** (`font-variant-numeric: tabular-nums`) em preço e métrica. Não aparece no rascunho.
4. **Personalidade de movimento:** escolher uma das 4 antes de animar, com números, e registrá-la no DESIGN.md.
   - utilidade quieta;
   - premium com peso;
   - estúdio cinematográfico;
   - lúdico.
5. **Barra fixa:** fundo com ≥ 80% de opacidade **antes** de o conteúdo passar por baixo. Hoje o rascunho diz "opacidade suficiente"; o número ajuda o agente.
6. **Contra-padrão útil:** produtos "de documento" (Granola, Arc, Relate) **proíbem** revelação ao rolar. Em app e ferramenta, a revelação ao rolar é opcional, não padrão.
7. **Aviso sobre a skill oficial do Refero.** Já está no rascunho. Acrescentar que o MCP exige plano **Pro, Team ou Lifetime** (o grátis não tem) e que os termos proíbem robôs no site.

**No `APRENDIZADOS.md`** (livre): um adendo "11/10/2026: pesquisa Refero", com o link para `scratchpad/hunter/refero/TRANSCRICAO.md` (ou para `research_notes/`, se for salva) e os 5 achados principais.

---

## 2. `button-animation` (rascunho novo já tem durações, curvas, estados, shimmer, armadilhas)

**No `SKILL.md`** (com aprovação):

1. **Seção "Botão premium" (hierarquia e medidas):**
   - 1 preenchido por tela, mais 1 contornado ou link "›" ao lado. Nunca 2 preenchidos;
   - altura de 36 a 48 px, padding de 8 a 12 × 16 a 24 px, texto de 14 a 17 px com peso 400 a 500;
   - sem sombra e sem gradiente.
2. **Duas escolas de raio:** pílula (9999 px) **ou** 0 a 6 px. Nunca o "8 px genérico". Os valores vêm do `DESIGN.md` do projeto.
3. **Regra premium: "muda de cor, não de tamanho".**
   - Hover só de `background-color`, `color`, `border-color` e `opacity`, em 150 a 250 ms (`ease` ou `cubic-bezier(.4,0,.2,1)`). **Sem escala no hover** (Dia, Apple, Samsung).
   - A escala de 0,97 fica só no toque, o que o rascunho já tem.
4. **Tailwind v4:** `scale-*` é uma propriedade própria. A lista de transição precisa de `scale`, não de `transform`. Exemplo: `transition-[color,background-color,border-color,opacity,scale]`. O rascunho já usa `scale` numa receita; vale escrever a regra.
5. **Variações premium (receitas curtas):**
   - **contornado que inverte no hover** (B&O, Samsung): contorno de 1 px que vira fundo escuro com texto claro, em 0,2 s;
   - **link "›" da Apple:** sublinhado só no hover; a seta pode andar 2 px;
   - **automotivo** (Ferrari): caixa-alta com +0,08 em, raio 0, cor da marca só no hover e no foco;
   - **tecla Raycast** (escuro): `inset 0 1px 0 rgba(255,255,255,.05)`, anel `rgba(255,255,255,.25)` e `inset 0 -1px 0 rgba(0,0,0,.2)`;
   - **CTA "tipo Samsung":** preto, raio de 20 px, altura de 40 px, foco `2px dotted`.
6. **Texto que rola no hover** (OFF+BRAND), **só dentro de botão com fundo visível**. Cada letra percorre a altura inteira do botão, para a cópia não aparecer em repouso: 0,5 s, `power4.inOut` `[.86,0,.07,1]`, cascata de 30 ms. Código testado: `estilos-premium/assets/receitas-movimento.tsx`, componente `BotaoQueRola`. Num link solto (sem borda visível), viola a regra 2 do editor.
7. **Sublinhado que cresce** da esquerda em 150 ms (Maze), com `after:scale-x-0` → `hover:after:scale-x-100`.
8. **Novas armadilhas para a lista "nunca entregue":**
   - **no hover, não anime `box-shadow` nem fundo de área grande** (regra do GitHub);
   - **mola com overshoot só em visual de marca**, nunca em botão ou menu (Modal: só no cubo 3D);
   - **botão "fantasma"** comunica estado por opacidade, não por cor nova (Active Theory, Unicorn Studio).
9. **Anel de gradiente girando:** acrescentar a regra da ClickUp, **"uma animação contínua por tela"**. Se o anel gira, nada mais gira na tela. Em site minimalista ou premium calmo, não use.

**No `APRENDIZADOS.md`** (livre): "11/10/2026: o que os sites premium fazem com botões" (itens 1, 3 e 8, com as marcas).

---

## 3. `motion-oficial` (rascunho novo já tem curvas, durações, molas, coreografia, regras do editor)

**Nos `references/`** (com aprovação, porque a pasta virou skill nossa):

1. **`molas-e-curvas.md`:** acrescentar o **dicionário de curvas de sites reais**, com nome, uso e quem usa:
   - `(.19,1,.22,1)` expo: monopo, mymind, Linear;
   - `(.22,1,.36,1)` quint: Base44, Antimetal;
   - `(.33,1,.68,1)` cubic: ClickUp;
   - `(.165,.84,.44,1)` quart = `power3.out`: Slack;
   - `(.52,.01,0,1)` "puxada de foco": Vivid+Co;
   - `(.72,0,.12,1)` "encaixe": Retool;
   - `(.625,.05,0,1)` "zoom lento": Sequel;
   - `(.35,0,.36,1)`: Samsung, na borda da busca.

   Acrescentar também a **tabela GSAP → bezier:** `power2.out` `[.215,.61,.355,1]`, `power3.out` `[.165,.84,.44,1]`, `power4.out` `[.23,1,.32,1]`, `expo.out` `[.19,1,.22,1]`. Ela serve para traduzir sites feitos em GSAP para o Motion.
2. **`coreografia.md`:**
   - **Durações de páginas de marketing por camada** (consenso de 35 sites): entrada ao rolar de 600 a 750 ms, frase do hero de 0,8 a 1,5 s, atmosfera de 2 a 9 s, loop de 27 a 80 s.
   - **Cascata:** letras de 30 a 40 ms, linhas de 75 ms, blocos de 100 a 175 ms.
   - **Hero montado pelas bordas** (monopo, adaptado às regras do editor): barra de cima `y: "-100%"`, linhas da esquerda `x: "-100vw"`, CTA da direita, `stagger(0.075, { startDelay: 0.6 })`, `overflow-x: clip` na seção. Código: `estilos-premium/assets/receitas-movimento.tsx`, componente `HeroCoreografado`.
   - **Hero calmo:** o texto fica parado e o produto sobe da borda de baixo da janela. É a opção que sempre cumpre a regra 4.
3. **`receitas.md`:**
   - **View Transitions nativas** para trocar de página (Unicorn Studio): sai em 200 ms, entra em 300 ms, desligadas com movimento reduzido;
   - **acordeão por `grid-template-rows`** 0fr → 1fr em 0,5 a 0,65 s (GitHub, Geniestudio);
   - **marquee** na largura toda, de 45 a 75 s, com pausa no hover e parado com movimento reduzido.
4. **Desempenho:**
   - **pré-teste do aparelho** antes da primeira pintura, com hero mais leve em aparelho fraco (Jitter, classe `.low-performance-device`);
   - **Lenis** com `lerp ≈ 0,1`, só se quiser rolagem suave;
   - o `prefers-reduced-motion` foi encontrado nos sites de estúdio (14islands, OFF+BRAND): até eles respeitam.
5. **Na seção das regras do editor:** acrescentar a tabela "padrões populares que quebram as regras e a troca" (`estilos-premium/references/movimento-sites.md`, seção 6). Ela cobre letras subindo de uma fenda, letras brotando, palavra que troca, overshoot em título, header transparente, blur cortado, marquee em caixa e produto cobrindo o título.

**No `APRENDIZADOS.md`** (livre): "11/10/2026: os sites premium medidos animam pouco; 'muda de cor, não de posição'. Só 35 de 1.342 estilos do Refero documentam movimento".

---

## 4. `thumbnail-carousel`

**No `SKILL.md`** (com aprovação):

1. **Acessibilidade:** o carrossel avança sozinho a cada 5 s e **não tem botão de pausa**. Pela WCAG 2.2.2, conteúdo que se move por mais de 5 s precisa de pausa. Acrescentar:
   - um botão de pausa;
   - autoavanço desligado com `useReducedMotion()`;
   - autoavanço pausado quando o mouse ou o foco está no carrossel.
2. **Variante "vitrine premium"** (Apple, Samsung):
   - cards de mídia com raio de **28 px** e sem sombra, sobre #f5f5f7 ou #000; ou tiles com raio 0 e foto de ponta a ponta (Nike, automotivo);
   - título de 24 a 28 px com peso 600 e no máximo 1 pílula de ação;
   - **hover:** foto a `scale(1.05)` em cerca de 0,5 s, dentro da borda do card (borda real), e a linha "comprar" fazendo fade de 0 a 1;
   - **controles:** pontos e pausa agrupados numa pílula translúcida `rgba(210,210,215,.64)` com raio de 36 px;
   - **nada de selos** ou notas sobre o produto (B&O).
3. **Variante "minimal":**
   - raio vindo do `DESIGN.md` (0 no editorial, 28 no estilo Apple);
   - miniatura ativa com **anel neutro de 1 px** (sem a cor da marca), sem sombra;
   - diferença de escala sutil (1,0 × 0,96, no lugar de 0,95 × 0,85);
   - legenda pequena com tracking positivo.
4. **Variante "ticker/marquee"** de logos: 45 a 75 s linear, pausa no hover, parado com movimento reduzido, **sempre na largura toda** (regra 2 do editor). Em Motion: `animate={{ x: ["0%", "-50%"] }}` com `repeat: Infinity, ease: "linear"`.
5. **Variante "fileira de prévias"** (Jitter): rolagem horizontal com snap, cards de raio grande, sombra longa só no hover.
6. **Mola:** a atual (massa 3, rigidez 400, amortecimento 50) é o "pesado tipo carrossel". Documentar a alternativa previsível `{ type: "spring", visualDuration: 0.6, bounce: 0 }`.
7. **Regra 1 do editor:** a legenda do slide que sai some **antes** de a do slide que entra aparecer. Nunca duas legendas sobrepostas.

**No `APRENDIZADOS.md`** (livre): o item 1 (falta de pausa) como pendência conhecida.

---

## 5. Também atualizar (se a `estilos-premium` for aprovada)

- **`guia/HABILIDADES.txt`**, seção 1, nova linha:
  `estilos-premium | site ou tela "no estilo da Apple/Samsung/Tesla", "premium", "minimalista", "com animação de agência"; escolher estilo de referência; criar ou usar DESIGN.md; fichas de marca | skills/design/estilos-premium/SKILL.md`
- **`guia/LEIA-ANTES-DE-USAR.md`:**
  - **3.1 e 3.3:** pôr `estilos-premium` na categoria `design`;
  - **3.4:** atualizar a contagem do `npx skills ... --list`, que passa de 13 para 14 skills.
- **`research_notes/Refero Styles 2026/`:** salvar a `TRANSCRICAO.md` **sem** os arquivos baixados do Refero. A transcrição tem resumos e valores pontuais por marca escritos pelos agentes; é material de estudo interno. Se o Daniel preferir prudência máxima, salve só as seções de padrões e o índice de links.
- **`remotion-video`, `APRENDIZADOS.md`** (livre):
  - curvas de sites → `Easing.bezier(...)`;
  - tabela ms → quadros a 30 fps (150 ms = 4 a 5, 300 ms = 9, 700 ms = 21, 1,2 s = 36);
  - a `easeOutExpo` `(.19,1,.22,1)` é segura para texto (não passa do ponto).
