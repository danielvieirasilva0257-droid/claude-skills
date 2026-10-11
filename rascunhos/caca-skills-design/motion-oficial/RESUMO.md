# Resumo: a nova skill de animação (`motion-oficial`)

## O que mudou, em uma frase
A skill antiga ensinava a **escrever código** com o Motion (o antigo Framer Motion). A nova ensina também a **decidir o movimento**: se algo deve animar, quanto tempo leva, qual curva usar, como fica acessível e como revisar. Tudo em português, num só lugar, com as suas 4 regras de editor dentro.

## Por que mudar
A skill oficial tinha três buracos:
- não dizia **quando não animar**, que é o erro mais comum da IA;
- não tinha **números** (durações, curvas, molas);
- não falava nada de **movimento reduzido** (acessibilidade).

Além disso, a única revisão de desempenho dela era **paga** (Motion+).

## O que entrou de cada fonte
- **Emil Kowalski** (a fonte mais usada do setor, licença MIT): a espinha da skill.
  - A pergunta "deve animar?" pela frequência de uso: o que se usa 100 vezes por dia não anima.
  - As curvas fortes e a tabela de durações. Exemplo: um menu leva de 150 a 250 ms.
  - A lista "nunca entregar" e as receitas prontas de botão, menu, modal, gaveta e toast.
  - Os gestos no estilo Apple: arremessar, elástico na borda.
- **Matthew Blode** (MIT):
  - mais curvas e molas, como a mola "abre com quique, fecha firme";
  - as armadilhas do Motion;
  - um guia de "está lento / robótico / barato / travando: o que fazer".
- **Kyle Zantos** (MIT): a lista do **"movimento com cara de IA"**: pulsos em loop, blur em tudo, zoom no hover de tudo. É o que separa o premium do genérico.
- **ibelick** (MIT): uma **auditoria de desempenho grátis**, que substitui a paga na maioria dos casos.
- **Raphael Salaja** (MIT): os erros comuns de saída de elementos no Motion.
- **Motion Lexicon** (CC BY): como coreografar várias peças. Um ator principal e de 3 a 5 "batidas" por momento. Serve também para **roteiro de vídeo**.
- **Material 3, do Google** (Apache): molas oficiais, convertidas para o Motion.
- **Vercel** (MIT): regras curtas de acessibilidade e de SVG.
- **As suas 4 regras de editor**, adaptadas para interface:
  - nada de texto sobre texto;
  - nenhum recorte no meio;
  - o elemento principal fica por cima;
  - tudo entra de um lugar que explique a entrada.
- Uma ponte para o **Remotion**: o Motion não funciona dentro dos vídeos. A skill explica como levar as curvas e os tempos para lá.

## O que saiu
- Os arquivos em inglês do pacote oficial. O conteúdo deles foi **traduzido e reorganizado** dentro de `references/`. Nada importante se perdeu.
- Os scripts em Python do Blode, que medem uma animação a partir de um vídeo. Eles ainda não foram revisados. Entrou só o método, passo a passo.
- O transitions.dev, porque a licença proíbe copiar. Também ficaram de fora fontes sem licença (Josh Comeau, Rauno e Remotion): delas, só as ideias, escritas com nossas palavras.

## Conflitos entre as fontes (e a decisão tomada)
- **Movimento reduzido:** menos e mais suave, nunca "desligar tudo".
- **Blur:** até 8 px, com teto de 20 px.
- **Duração:** resposta de clique até 200 ms; interface até 300 ms; marketing e vídeo de 500 a 1000 ms.
- **Recorte com máscara:** só quando a borda é real (botão, aba, tela do celular). Isso segue a sua regra 2.

## Pendências
- **Nome:** ficou `motion-oficial` para não quebrar o índice e os combos. Se você quiser, dá para renomear para `animacao-ui`.
- **Testes:** as receitas novas ainda não foram testadas com o TypeScript. Duas sintaxes do Motion estão marcadas para conferir na documentação antes do primeiro uso.
- **Aprovação:** nada foi gravado no repositório. Para instalar, falta a sua aprovação. Depois é só substituir a pasta e atualizar o `guia/HABILIDADES.txt`.
