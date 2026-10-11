# Anti-padrões de "cara de IA"

Lista consolidada, em português, escrita por nós a partir de: `anti-ai-slop.md` da skill oficial do Refero (MIT, © 2026 Refero; adaptado e traduzido), `frontend-design` da Anthropic (Apache-2.0; ideias), taste-skill de Leonxlnx (MIT; paletas e clichês), impeccable de Paul Bakaus (Apache-2.0; ideias). Detalhes de licença em `../ORIGEM.md`.

**Regra geral:** nada aqui é proibido para sempre. É proibido **por padrão**. Para usar, a referência travada e o produto precisam justificar, por escrito no decision ledger.

## Os sinais mais fortes

1. **Índigo e violeta por padrão** (`#6366f1`, `#8b5cf6`, `#7c3aed`). É a média do treino das IAs. Alternativas: azul `#2563eb` (confiança), verde-azulado `#0d9488` (fresco), ou a cor real da marca.
2. **Cards em tudo.** Padrão é **sem card**: use seções, colunas, linhas ou blocos de mídia. Card só quando o contêiner é interativo.
3. **Escuro por padrão.** Sem pedido nem frase de cena que justifique, claro.
4. **Editorial calmo no piloto automático:** creme quente (`#f4f1ea`, `#fbf8f1`, `#efeae0`), serifa grande de alto contraste, **uma palavra em itálico, em outra fonte ou em outra cor**, acento oliva, argila ou terracota (`#d97757`, `#b6553a`), texto café (`#1a1714`). Ótimo para revista, cultura, hotel, moda. Ruim para ferramenta, fintech, dashboard, navegador. Antes de usar, responda: por que o produto precisa de voz editorial? por que serifa? por que tons de terra? quais referências apoiam?
5. **Emoji como ícone.** Use uma família de ícones (Lucide, Phosphor, Heroicons, SF Symbols), símbolos Unicode (→ • ◆) ou SVG.
6. **Faixa colorida na lateral do card** (`border-left: 4px solid`). Só se disser algo (status, prioridade, seleção). Se não dá para dizer em uma palavra o que a cor significa, tire.
7. **Média das referências.** Escuro vira creme; ácido vira argila; sans geométrica vira serifa educada; quina viva vira card arredondado; mídia marcante vira "hero + seções". Escolha uma direção e preserve.
8. **Desvio de papel do token.** Acento de CTA virando fundo de seção; cor de código fora do código; pastel decorativo virando controle. O papel faz parte do token.
9. **Imagem falsa ou colapso para só texto.** Hero que dependia de foto vira só texto e botões; "foto" desenhada com bolhas de CSS; interface de produto falsa feita de `<div>`. Use asset real, gerado, de banco, primitivo simples em código ou placeholder honesto (proporção fixa, `alt`, nota de direção de arte).

## Os cinco visuais típicos de IA (ideia do `frontend-design`, Anthropic)

1. Creme com serifa e acento terracota.
2. Quase preto com **um** acento verde-ácido ou vermelhão.
3. Jornal: linhas finas, raio 0, colunas.
4. "Kit de cards de SaaS": cards iguais, um raio só, sombra `rgba(0,0,0,.1)`, gradientes.
5. Eyebrow em caixa alta espaçada, "A · B · C", "PALAVRA, fragmento", `#0b0b0b` no lugar de preto, mono em rótulos, "→" em todos os botões.

Ou seja: **premium não é receita fixa.** Qualquer um desses, aplicado sem motivo, denuncia.

## Outros sinais

- **Tipo:** a mesma fonte e o mesmo peso em tudo; display e corpo sem diferença; caixa alta sem tracking; fontes "de IA" sem motivo (Playfair, Fraunces, Cormorant, Lora, Syne, Space Grotesk, Space Mono, DM Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans, Inter como display).
- **Cor:** texto em gradiente; glow; vidro como enfeite; distribuição de cor uniforme sem hierarquia; cinzas quentes e frios misturados.
- **Layout:** tudo simétrico e centralizado; "texto à esquerda + imagem à direita" automático; hero → 3 cards → preços → FAQ → CTA automático; três cards iguais lado a lado; a mesma família de layout repetida (máximo 2 zigue-zagues seguidos); bento com célula vazia.
- **Enfeites:** eyebrow em todo título (máximo 1 a cada 3 seções); "01 / 02 / 03" sem sequência real; métrica gigante com rótulo pequeno no hero; indicador de rolagem; pontinhos de status decorativos; faixa de cidade, hora e clima; rótulo de versão no hero; cursor personalizado; marquee em mais de um lugar.
- **Movimento:** fade-up igual em toda seção; hover em todo card; quique em botão; elementos "que nunca aparecem parados".
- **Texto:** "Eleve", "Revolucione", "Desbloqueie", "Sem esforço", "Perfeito"; "João Silva", "Acme", "Lorem"; números perfeitos demais (99,99%); CTA quebrando em duas linhas; dois CTAs com a mesma intenção; travessão usado como enfeite (o uso gramatical normal em português é ok).

## Testes rápidos

- **Card:** tirar borda, sombra, fundo e raio atrapalha? Se não, não é card.
- **Imagem:** a primeira tela funciona igual sem a imagem do hero? Então a imagem está fraca: aumente ou tire.
- **Marca:** escondendo a nav, a marca some? Hierarquia fraca.
- **Texto:** cortar 30% do texto melhora? Continue cortando.
- **Identidade:** a primeira tela poderia ser de outra empresa? Falta o detalhe que só esta marca teria.
- **Cafeteria:** trocando o logo por uma cafeteria, hotel ou revista, o hero ainda convence? Está genérico.

## Detector (antes de entregar)

- [ ] Acento não é índigo/violeta (ou é da marca).
- [ ] Cada card se justifica por interação.
- [ ] Nenhuma faixa lateral decorativa; nenhum emoji como ícone.
- [ ] Claro, a não ser que o briefing ou a cena peçam escuro.
- [ ] Serifa, creme e tons de terra justificados pelo produto (ou ausentes).
- [ ] Nenhuma palavra do título em itálico ou outra cor só "para dar gosto".
- [ ] Traços fortes da referência preservados; papéis dos tokens preservados; papel da mídia preservado.
- [ ] Caixa alta com tracking positivo.
- [ ] Passaria no "teste do print" ao lado de produtos reais.
- [ ] Consigo explicar o **porquê** de cada escolha ("escolhi porque [motivo deste projeto]", nunca "porque todo mundo faz").
- [ ] Existe um detalhe memorável, e um acessório foi tirado.
