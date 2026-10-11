# Resenha: o que aprendemos estudando 64 estilos premium

Em 11/10/2026, três pesquisas olharam a biblioteca Refero Styles:
- **marcas premium:** Apple, B&O, Tesla, Ferrari, BMW e outras;
- **sites minimalistas:** Stripe, Vercel, Notion, Linear e outros;
- **sites com animação:** estúdios e produtos.

Esta resenha junta o que aprendemos, **por ideia**, com as nossas palavras. As marcas aparecem como observação: "a Apple faz assim". Não é uma cópia dos documentos do Refero.

---

## 1. A grande lição: caro é contenção

Os sites que parecem caros quase nunca **acrescentam** coisas. Eles **tiram**: cor, sombra, gradiente, tipos de botão e estilos de card. O que sobra fica maior e com mais espaço em volta: a foto do produto e o título.

Um jeito simples de lembrar:
> **A interface é a moldura. O produto é o quadro.** Se a moldura chama atenção, o quadro perde.

Em números:
- em **22 de 27** sites premium, a interface é praticamente cinza;
- em **23 de 27**, os cards e botões não têm sombra nenhuma.

---

## 2. Os arquétipos: cinco jeitos de ser premium

Quase todos os estilos estudados caem em uma de cinco famílias. Escolher a família certa resolve metade do trabalho.

1. **Galeria clara.** O site é um museu de paredes brancas e o produto é a escultura.
   - Exemplos: Apple, B&O, Dyson, Sonos, BMW, Tesla, Nike.
   - Fundo quase branco, produto isolado, 1 botão colorido.
2. **Palco escuro.** O site é um teatro com a luz só no produto.
   - Exemplos: as páginas "Pro" da Apple, Ferrari, Lamborghini, SpaceX.
   - Fundo preto, foto de cinema, texto quase branco.
   - A cor da marca aparece pouco. Na Ferrari, o vermelho só aparece **no hover**. Na Lamborghini, o amarelo fica em 1 elemento por tela.
3. **Instrumento de precisão.** O site parece uma ferramenta bem calibrada.
   - Exemplos: Stripe, Linear, Vercel, Raycast.
   - Cinzas em degraus, linhas finíssimas, letra mono nos detalhes técnicos e 1 cor "elétrica".
4. **Editorial.** O site parece uma revista ou um jornal de qualidade.
   - Exemplos: Monocle, Medium, Exhibition, Anthropic.
   - Serifa grande, cantos retos e links sublinhados.
   - **Funciona só quando o produto é conteúdo.**
5. **Estúdio animado.** O site é uma vitrine de movimento.
   - Exemplos: monopo, OFF+BRAND, Lusion, Active Theory.
   - O 3D ou o vídeo carrega toda a cor e todo o drama, e a interface fica quase invisível.

**A lição por trás:** os arquétipos não se misturam bem. Um site "meio galeria, meio editorial, meio estúdio" vira genérico. Escolha um.

---

## 3. Cor: uma cor, um trabalho

- **A interface quase não tem cor.** Os neutros (6 a 10 tons de cinza com papel definido) fazem quase tudo. Nike, BMW, Sonos e SpaceX não têm **nenhuma** cor de interface: quem traz cor é a foto.
- **Quando há uma cor, ela tem um único trabalho.**
  - Apple: azul só no fundo do botão de compra.
  - Tesla: azul só no "Order".
  - ElevenLabs: as cores ficam só nas ilustrações, nunca nos botões.

  Isso ensina o olho: "azul = é aqui que eu clico".
- **O fundo nunca é o "branco de Word".** Os claros são brancos levemente tingidos (o cinza-gelo da Apple, o creme da Dyson). Os escuros vão do preto absoluto ao quase preto azulado.
- **O texto nunca é preto puro nem branco puro.** É um quase preto com um leve subtom (#1d1d1f na Apple) e, no escuro, um quase branco (#f5f5f7). Parece detalhe, mas tira a "dureza" de tela.
- **Superfícies em degraus:** fundo, superfície e placa, com 2 a 5% de diferença de luz. A hierarquia vem da luz, não da sombra.
- **Um alerta sobre contraste:** alguns premium deixam o cinza secundário fraco demais (perto de 3:1). Nós não copiamos isso: corpo de texto sempre ≥ 4,5:1.

---

## 4. Tipografia: a voz da marca

- **Título grande, fino e apertado.**
  - Os títulos do hero ficam entre **56 e 96 px**. A Rivian chega a 360 px no monograma.
  - O peso é leve ou médio, de **300 a 600**. O negrito pesado (700 ou mais) quase não aparece.
  - O espaço entre letras fica **mais negativo quanto maior a letra**: perto de −0,01 em em 24 px e até −0,06 em em 64 px ou mais (Vercel).

  É isso que dá o ar "de revista cara".
- **A exceção que confirma a regra:** carros e foguetes (Ferrari, SpaceX, Lamborghini) usam **caixa-alta com letras afastadas** (+0,08 a +0,10 em). É o visual de "placa de instrumento".
- **Corpo calmo:** de 16 a 18 px (a Apple usa 17) e entrelinha perto de 1,5. O contraste entre o título apertado e o corpo arejado cria a hierarquia.
- **Poucas famílias e poucos pesos:** 1 ou 2 famílias, e 2 ou 3 pesos no sistema todo. O Stripe usa só o peso 300 para quase tudo.
- **O peso fino é coragem.** ElevenLabs e Stripe usam o título em peso 300, contra a convenção. Isso passa autoridade por contenção.
- **As fontes das marcas são pagas** (SF Pro, Söhne, fontes próprias dos carros). Aprendemos a sempre anotar a substituta livre: Inter, Inter Tight, Geist, Instrument Serif, Barlow.

---

## 5. Espaço: o luxo de desperdiçar

- **Entre seções, 96 px** é o padrão. A Apple dá até 160 px em volta do hero. O minimalismo extremo passa de 140 px.
- **Base de 4 px.** Todos os espaços são múltiplos dela, o que dá ritmo.
- **O texto é estreito** (de 540 a 680 px), mesmo em telas largas. A foto, ao contrário, vai de ponta a ponta.
- **Uma ideia por seção.** A Apple separa as seções trocando o fundo (branco, cinza-gelo, branco), **sem linhas**. O Stripe usa linha fina e 96 px, sem trocar o fundo. Cada um escolhe **um** recurso.
- **Minimalismo não é página vazia.** Simplificar demais tira as provas, o contexto e a ação, e aí o site falha. O certo é pedir **menos tipos de coisa** (de seção, de card, de botão), não menos conteúdo.

---

## 6. Formas e profundidade: duas escolas e nenhuma sombra

- **Ou tudo redondo, ou tudo reto.** Os premium ficam nos extremos:
  - **escola macia:** botões em pílula e cards de 12 a 28 px (Apple, Nike, Sonos);
  - **escola precisa:** cantos de 0 a 4 px (BMW, Ferrari, Stripe, Tesla, teenage engineering).

  O "8 px em tudo" do meio é o que mais parece template.
- **No máximo 3 raios.** O Linear usa 6, 12 e pílula, e só.
- **Profundidade sem sombra.** Ela vem de degraus de cor e de linhas de 1 px (às vezes 0,5). A Vercel usa um anel duplo finíssimo no lugar da borda. A sombra visível aparece só onde algo realmente flutua: o menu aberto ou a foto do produto "pousada".
- **Gradiente só dentro da imagem** ou como atmosfera do hero. Nunca em botão ou card.

---

## 7. Botões: hierarquia e silêncio

- **Um botão preenchido por tela.** Ao lado dele vai um contornado ou um link com "›". Nunca dois preenchidos lado a lado.
- **Tamanho:** de 36 a 48 px de altura, texto de 14 a 17 px, peso 400 a 500. Sem sombra e sem gradiente.
- **Variações que vimos:**
  - a pílula azul da Apple;
  - o contornado que **inverte** no hover (B&O, Samsung);
  - o automotivo em caixa-alta com raio 0, em que a cor da marca só aparece no hover (Ferrari);
  - a "tecla de teclado" com luz interna (Raycast);
  - o CTA editorial que é só um link grande sublinhado (Exhibition).
- **No hover, o botão muda de cor, não de tamanho.** A escala de 0,97 fica só para o toque.

---

## 8. Imagem: o produto é o herói

- O produto aparece **isolado**, em fundo sem emenda, com luz de estúdio e ângulo de 3/4. Ou aparece em **cinema** de tela cheia (Sonos, Bose, Nike, Ferrari).
- **Sem moldura:** nada de borda, sombra ou padding em volta da foto. Na Apple, o card de mídia tem só o raio de 28 px.
- **Quando falta a foto real,** o certo é um espaço de proporção fixa com uma nota de direção de arte. "Desenhar" um produto falso com CSS barateia tudo.

---

## 9. Movimento: muda a cor, não a posição

- **Nos premium calmos, o movimento quase não aparece.**
  - Cor e opacidade mudam em cerca de 0,2 s.
  - O link ganha sublinhado.
  - A barra de cima vira vidro (blur de 20 px) ao rolar.
  - A foto cresce 5% no hover.

  Sem mola e sem quique.
- **Cada camada tem seu tempo.** Os 35 sites com seção de movimento concordam:

  | Camada | Tempo |
  |---|---|
  | Toque | 100 ms |
  | Hover | 150 a 200 ms |
  | Componente | 250 a 450 ms |
  | Entrada ao rolar | 600 a 750 ms |
  | Frase do hero | 0,8 a 1,5 s |
  | Atmosfera | 2 a 9 s |
  | Loop de fundo | 27 a 80 s |
- **Curvas que "pousam":** quase todos usam curvas que chegam rápido e assentam devagar, sem passar do ponto. Exemplos: a "expo" `(.19,1,.22,1)` e a "puxada de foco" `(.52,.01,0,1)`. O único site com overshoot (Modal) usa isso **só** no cubo 3D da marca, nunca em texto.
- **Um movimento contínuo por tela, no máximo.** Pode ser um marquee de logos, um gradiente girando ou um objeto flutuando. Nunca vários.
- **Nos estúdios, o espetáculo é do 3D e do vídeo.** A interface continua quieta ("fantasma"). Mesmo o site mais animado tem botões calmos.
- **Um aprendizado só nosso:** muitos efeitos populares de texto quebram as 4 regras de composição do Daniel. É o caso das letras subindo de uma "fenda" invisível e do texto que brota no meio da tela. Para cada um, há uma troca que respeita as regras (`movimento-sites.md`).

---

## 10. O que dá "cara de caro" (resumo)

1. Um arquétipo só, seguido até o fim.
2. Interface quase cinza e 1 cor com 1 trabalho.
3. Título grande, fino e apertado; corpo calmo de 17 px.
4. 96 px entre seções; texto estreito; foto de ponta a ponta.
5. Raios todos redondos **ou** todos retos; zero sombra.
6. Um botão preenchido por tela.
7. O produto como herói, sem moldura.
8. Movimento que muda cor, chega "pousando" e nunca disputa com o produto.

## 11. O que dá "cara de IA" (ou de barato)

O guia oficial do Refero lista os vícios que as IAs repetem. Nós concordamos e acrescentamos os nossos:
- **índigo ou violeta** como cor "padrão";
- **cards em todo lugar**, até onde ninguém clica;
- **modo escuro por padrão**, sem motivo;
- **creme com serifa grande, uma palavra em itálico e acento terracota.** É o novo padrão de IA ("editorial no piloto automático"). Só vale para produto editorial de verdade;
- **emoji** no lugar de ícone e **faixa colorida** na lateral do card;
- **tirar a média** de várias referências;
- **usar uma cor fora do papel dela**, como a cor do botão virando fundo de seção;
- **imagem falsa** feita de caixas e gradiente;
- **dois botões coloridos** lado a lado, gradiente em botão e selo colorido em todo card;
- **título em negrito 700**, sombra suave genérica e cinza #ccc de fundo;
- **texto demais:** se apagar 30% melhora, apague;
- **hero que serviria para qualquer empresa.** Teste: troque o logo por o de uma cafeteria. Se ainda funciona, está genérico.

## 12. O que o formato DESIGN.md nos ensinou

- **Papel vale mais que valor.** Um hex sozinho não ajuda o agente. "Este azul é **só** do botão de compra" ajuda.
- **Faça e não faça com números** evitam a "normalização": o agente transformar o título fino da marca num negrito comum.
- **"Decisões em aberto" é uma seção honesta.** A referência não sabe nada do nosso produto (estados vazios, erros, celular), e isso precisa ficar escrito.
- **Movimento quase nunca está documentado.** No Refero, só 35 de 1.342 estilos têm uma seção de movimento. Por isso o nosso modelo a torna obrigatória.

## 13. Surpresas e exceções

- **A Samsung não está no Refero,** nem Google/Pixel, Sony, Porsche, Leica ou Rolex. Para a Samsung, usamos medidas de um site de terceiros: CTA preto de 20 px de raio e 40 px de altura, título bold, azul só no hover.
- **A Bose usa título condensado pesadíssimo (900),** e mesmo assim parece premium. Funciona porque é a identidade dela e é usado com disciplina.
- **A mesma marca muda entre páginas.** A Apple tem cards de 8 px numa captura antiga e de 28 px nas páginas novas. Por isso, sempre anote a data da referência.
- **O Refero interpreta, não mede tudo.** Os textos são "leituras" automáticas dos sites, com erros ocasionais. Na dúvida, o site real manda.

## 14. Limites desta pesquisa

- Vimos 64 estilos de 1.342. É uma amostra boa de premium, minimalista e animado, mas não é tudo.
- O movimento veio de 35 seções escritas pelo Refero e da leitura do código de 10 sites. Não medimos animações rodando.
- Os termos do Refero proíbem coleta automática e republicação. Por isso, guardamos o aprendizado e os links, não os arquivos.
