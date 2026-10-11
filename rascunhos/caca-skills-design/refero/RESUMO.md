# Resumo: pesquisa no Refero (sites premium, animados e minimalistas)

## O que foi feito

Três pesquisas olharam o site **Refero Styles**, uma biblioteca com 1.342 "fichas de estilo" de sites famosos:
- **marcas premium:** Apple, Tesla, Ferrari, BMW, B&O e outras;
- **sites com animação:** estúdios e produtos;
- **sites minimalistas:** Stripe, Vercel, Notion, Linear e outros.

Ao todo, estudamos **64 estilos**.

## O principal que aprendemos

1. **Caro é tirar, não pôr.** Os sites premium quase não têm cor na interface (22 de 27) e quase não têm sombra (23 de 27). Quem traz cor e emoção é a **foto do produto**.
2. **Uma cor, um trabalho.** Quando há uma cor, ela serve para uma coisa só. Na Apple, o azul fica só no botão de comprar.
3. **Letra grande e fina.** Títulos de 56 a 96 px, pouco negrito, letras apertadas. O texto corrido fica em cerca de 17 px.
4. **Muito espaço.** São cerca de 96 px entre as partes da página.
5. **Movimento discreto.** O botão muda de cor, não de tamanho. As seções chegam "pousando", sem quicar. Há no máximo um movimento contínuo por tela.
6. **Cinco "famílias" de visual premium:**
   - galeria clara (Apple);
   - palco escuro (Ferrari);
   - instrumento de precisão (Stripe, Linear);
   - editorial (revista);
   - estúdio animado (agências).

   Escolha **uma**, sem misturar.
7. **A Samsung não está no Refero.** Montamos uma receita "tipo Samsung" com medidas de outro site: botão preto arredondado e azul só ao passar o mouse.

## Um cuidado importante

- **Os termos de uso do Refero proíbem** copiar as fichas para um repositório e proíbem robôs. Por isso, **nenhuma ficha do Refero vai para o seu repositório**. Guardamos só o que aprendemos, escrito por nós, e os links para você abrir no navegador.
- Antes de os termos serem lidos, os agentes baixaram bastante coisa do site. Uma das pesquisas chegou a ler o começo de todas as 1.342 páginas. Esse material fica só na pasta temporária e **não deve ser repetido nem salvo** no repositório.
- **Fichas que podemos guardar:** 15 fichas de marcas (Apple, BMW, Ferrari, Lamborghini, Bugatti, Tesla, Nike, SpaceX, Linear, Vercel, Stripe, Notion, Superhuman, Raycast e Framer) vieram de outra coleção, a **VoltAgent**, que tem licença livre (MIT). Essas podem ficar.

## A skill nova proposta: `estilos-premium` (precisa da sua aprovação)

É uma **biblioteca de estilos** para quando você pedir um site "no estilo da Apple", "tipo Samsung", "premium" ou "minimalista". Ela traz:
- as 5 famílias de visual e como escolher uma;
- as 15 fichas de marca e um índice com 64 estilos e links;
- uma **resenha fácil de ler**: o que dá cara de caro e o que dá cara de feito por IA;
- um **modelo de DESIGN.md**: um arquivo que diz ao Claude as cores, as letras e os movimentos do seu projeto, para ele não inventar;
- **receitas de animação testadas**, já ajustadas às suas 4 regras de composição. Exemplo: nada de texto "nascendo" de uma máscara no meio da tela;
- como usar a skill oficial do Refero (grátis) e o servidor oficial deles (só nos planos pagos).

**Ela complementa a nova `ui-ux-pro-max`** (que está sendo reescrita com as regras gerais). A divisão sugerida: a `ui-ux-pro-max` tem as regras; a `estilos-premium` tem a biblioteca e o DESIGN.md.

## Para você decidir

1. Aprova a skill nova `estilos-premium`?
2. Prefere guardar as 15 fichas de marca (MIT) dentro do repositório, ou baixar só a da marca escolhida quando precisar?
3. Hoje existem dois modelos de DESIGN.md (um em cada skill). Posso juntar num só?
4. Aprova as mudanças sugeridas nas outras skills? A lista completa está em `PARA-AS-OUTRAS-SKILLS.md`. Um exemplo: o carrossel de fotos precisa de um botão de pausa.
5. Nos sites, um texto que surge com um leve "sobe e aparece" ao rolar a página conta como "brotar do nada" (sua regra 4)? A proposta faz o texto chegar junto com a rolagem, pela borda de baixo da tela. Isso serve?
