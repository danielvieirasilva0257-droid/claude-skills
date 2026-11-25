# Projeto El Bravo Hamburgueria: passo a passo

Redesenho da marca da hamburgueria El Bravo em 2D, com mascote, logofolio e conceito completo de marca. Começou em 25/11/2026.

## Onde está cada coisa

- **Trabalho visual:** artifact de Design do Claude (canvas): https://claude.ai/code/artifact/875462b9-6e1e-4bdf-ba13-297f78423d7c
- **Logo antiga (ponto de partida):** imagem enviada pelo Daniel no chat de 25/11/2026 (lutador de lucha libre com máscara vermelha e dourada, estrela na testa, apontando para a frente e segurando um hambúrguer; "EL BRAVO" em letras amarelas gastas e a faixa "HAMBURGUERIA"; estilo ilustração detalhada com sombra e brilho, não 2D).
- **Referências do Daniel:** moodboard no Behance: https://www.behance.net/moodboard/225594639/identidade-visual (o Claude não conseguiu abrir o link pela nuvem; ver "Aprendizados").

## Briefing (palavras do Daniel, resumidas)

- **Personagem:** lutador mexicano de MMA (luchador mascarado). **Sem a estrela na testa**, para não ter leitura política ou de ideologia.
- **Estilo:** 2D (flat, vetorial), novas ideias de composição; design doido e descontraído.
- **Cabeça:** meio perfil virado para a **direita**, sorrindo, com expressões diferentes.
- **Referências e o que pegar de cada uma:**
  - **Ornico:** a cabeça do personagem na metade de baixo do saco (ele "espia" da borda da embalagem).
  - **Korean Tiger:** o mascote interagindo com a comida; a cabeça sozinha como adesivo e como peça de composição; poses de corpo inteiro.
  - **Guksu Café:** o jeito de desenhar o personagem.
  - **I Scream:** o clima doido e descontraído e os ângulos fora do padrão do logotipo.
- **Entregas:** mascot folio, logofolio e, no fim, o conceito completo da marca com aplicações: caixa de lanche, saco de delivery, camiseta, pôster conceito, cartão, ticket de desconto e mais.
- **Forma de trabalho:** aos poucos, conversando, uma etapa por vez, sem fazer tudo de uma vez.

## Habilidades usadas

| Etapa | Skill | Caminho |
|---|---|---|
| Estrutura da identidade (logo, versões, cores, fontes, testes) | `brand-identity` | `skills/design/brand-identity/SKILL.md` |
| Plano de design anti-genérico | `frontend-design` | `skills/design/frontend-design/SKILL.md` |
| Pranchas por IA (se o Daniel quiser gerar imagens) | `brandkit` | `skills/design/brandkit/SKILL.md` |
| Pôster conceito em PNG/PDF | `canvas-design` | `skills/design/canvas-design/SKILL.md` |
| Manual e apresentação com as cores e fontes da marca | `theme-factory` | `skills/design/theme-factory/SKILL.md` |
| Skill da marca no fim (`el-bravo-marca`) | molde `tillwell-brand` | `skills/design/tillwell-brand/SKILL.md` |

## Plano de etapas

1. **Direção:** leitura das referências, palavras-chave, rumo do personagem, paleta e fontes iniciais.
2. **Mascote:** rascunhos de direção → escolha → folha do personagem (cabeça em meio perfil com expressões, corpo inteiro interagindo com a comida) = mascot folio.
3. **Logofolio:** logotipo com ângulos fora do padrão; versões (principal, só o nome, só a cabeça/adesivo, monograma, uma cor); testes de tamanho pequeno e de uma cor.
4. **Sistema:** paleta final, fontes, grafismos e padrões, tom de voz.
5. **Aplicações:** caixa de lanche, saco de delivery (cabeça na metade de baixo), camiseta, pôster, cartão, ticket de desconto e outras.
6. **Skill da marca:** `el-bravo-marca`, no molde da `tillwell-brand` (precisa de aprovação do Daniel).

## O que já foi feito

1. **25/11/2026:** 6 skills de marca entraram no repositório (`brand-identity`, `brandkit`, `canvas-design`, `theme-factory`, `brand-guidelines`, `tillwell-brand`). A `frontend-design` pedida já existia, igual à da origem. Projeto criado.
2. **25/11/2026, etapa 1 e exploração 1 da etapa 2 (canvas de Design, esperando a escolha do Daniel):**
   - Artboard **Direção** (`Main.dc.html`): logo atual, o que fica e o que muda, o que levamos de cada referência, regras do personagem e a personalidade proposta "Bravo no ringue, gente boa no balcão".
   - Artboard **Cor e tipografia** (`Cor-e-Tipo.dc.html`): paleta Rojo Bravo #E2321F, Queso #FFC21A, Carbón #1B1512, Pan #F7E9D2, Piel #C98552 (só a pele) e Turquesa #13A89E (acento opcional); 3 climas de letra para o logotipo (Shrikhand, Bungee, Luckiest Guy) e Rubik para os textos.
   - Artboard **Cabeça do mascote, 3 caminhos** (`Cabeca-Caminhos.dc.html`), desenhada em SVG (vetor editável): **A · Pão de gergelim** (topo da máscara é o pão com gergelim), **B · Peso-pesado** (MMA: orelha de lutador, nariz quebrado, dente faltando, curativo, faixa central), **C · Doidão** (cabeça torta, chamas na testa, olho arregalado, piscadinha, língua de fora). Nenhum tem estrela.
   - Regras de contraste anotadas: texto pequeno só em carbón sobre pan ou amarelo; vermelho com amarelo só com contorno carbón no meio.

## Aprendizados

- O Behance não abre pela nuvem (o endereço não está liberado para o Claude). Para mostrar referências, mande as imagens no chat ou descreva o que gostou.

## Próximo passo

O Daniel escolhe (ou mistura) o caminho da cabeça A, B ou C, a paleta e o clima de letra. Depois: refinar a cabeça escolhida e fazer a folha de expressões (cabeça em meio perfil para a direita), e só então o corpo inteiro interagindo com a comida (mascot folio).
