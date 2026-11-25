# Projeto El Bravo Hamburgueria: passo a passo

Redesenho da marca da hamburgueria El Bravo em 2D, com mascote, logofolio e conceito completo de marca. Começou em 25/11/2026.

## Onde está cada coisa

- **Trabalho visual:** artifact de Design do Claude (canvas): https://claude.ai/code/artifact/875462b9-6e1e-4bdf-ba13-297f78423d7c
- **Logo antiga (ponto de partida):** imagem enviada pelo Daniel no chat de 25/11/2026 (lutador de lucha libre com máscara vermelha e dourada, estrela na testa, apontando para a frente e segurando um hambúrguer; "EL BRAVO" em letras amarelas gastas e a faixa "HAMBURGUERIA"; estilo ilustração detalhada com sombra e brilho, não 2D).
- **Referências do Daniel:** 19 prints do Behance no Google Drive dele: https://drive.google.com/drive/folders/18Gt48xMml91-mNAo8uz16PBsG8GmKKZT (ler com o conector do Google Drive). Projetos: Korean Tiger (Viktoriia Kolosova), Guksu Café (Veranika Tsiareshchanka), I Scream (Elisa Voronova) e Ornico (Roomspace Creative Lab). Análise completa, print a print: `research_notes/El Bravo 2026-11/referencias.md`.

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
2. **25/11/2026: primeira tentativa REPROVADA e APAGADA.** O Claude fez, sem ver as referências, uma direção, uma paleta, testes de letra e 3 cabeças em SVG. O Daniel não gostou ("tá muito ruim") e pediu para descartar tudo e recomeçar do zero. O canvas foi limpo (só ficou a imagem do logo antigo guardada como arquivo). **Não usar nada dessa tentativa como referência** (nem paleta, nem letras, nem os caminhos A/B/C).

3. **25/11/2026, passo 1 refeito com as referências de verdade (esperando aprovação do Daniel):** no canvas, 3 artboards de trabalho (sem nenhum desenho da marca ainda):
   - **Referências** (`Main.dc.html`): 14 recortes das 4 referências e o que levamos de cada uma.
   - **O que vai no logo** (`Logo-Pecas.dc.html`): tabela peça por peça (ícone, nome, logo completo, selo, frase, cores, extra) das 4 referências e o "kit do logo do El Bravo" em 7 peças, com 2 jeitos de logo completo para testar (A: cabeça entrando pela borda de baixo, como Ornico; B: cabeça + divisória + nome, como Guksu e Korean Tiger).
   - **Aplicações** (`Aplicacoes.dc.html`): 37 aplicações vistas nas referências, em 6 grupos, cada uma com a referência onde aparece e a foto que precisa ser achada para montar.

4. **25/11/2026, briefing do mascote fechado com o Daniel:** a cabeça do mascote mantém o **rosto do logo atual** (mesma máscara, mesmos ângulos, formas e cores), só **sem a estrela da testa**, sem acrescentar nenhum detalhe. Logo 2D com personagem 2D. A foto de comida abraçada pelo mascote e os adesivos foram só comentário (ele gostou), **não são para fazer agora**.
5. **25/11/2026:** as tentativas de desenhar a cabeça à mão em SVG ficaram fracas (sem base). Parado a pedido do Daniel. Entraram 3 skills de desenho (`character-design`, `image-to-svg`, `svg-creation`); pesquisa em `research_notes/El Bravo 2026-11/caca-skills-desenho.md`. O Daniel acha que vamos precisar de um **motor de geração de imagem** para fazer o personagem.

## Aprendizados

- O Behance não abre pela nuvem (o endereço não está liberado para o Claude). Para mostrar referências, mande as imagens no chat ou descreva o que gostou.
- **Regra do Daniel:** se faltar material (referência que não abre, imagem que não chegou), **avisar e pedir antes de começar**. Nunca desenhar "no escuro".
- **Regra do Daniel:** usar como referência **só** as imagens e os conceitos que ele mandou, nunca o que o Claude já fez antes.
- **Ritmo:** uma parte por vez, na ordem do pedido: primeiro o mascote, depois o logo, depois as aplicações.
- As referências ficam no **Google Drive** do Daniel. Para ler, é preciso o conector do Google Drive. Para as fotos das aplicações (mockups), a ideia é usar um banco de imagens (sugerido o conector Unsplash).
- O Daniel aceita o mascote feito em código (vetor), desde que a qualidade chegue no nível das referências que ele mandar.

## Próximo passo

1. **Esperar o Daniel** (ele pediu para não trabalhar ainda): escolher o motor de geração de imagem para o personagem. Já conectados: Higgsfield e OpenArt.
2. Mascote, só a cabeça primeiro: o rosto do logo atual sem a estrela, em 2D, virado para a direita. Usar `image-to-svg` (sem subagentes) e `character-design`. Depois a folha de rostos e as poses.
3. Depois do mascote: o kit do logo. Por último, as aplicações (com as fotos que o Daniel juntar ou do banco de imagens).
