# Aprendizados: image-to-svg

Adendos datados. O mais novo fica embaixo. A skill ainda não incorpora nenhum aprendizado (está intacta, como veio da origem).

## 25/11/2026: entrada na base

- **Para que serve:** redesenhar em vetor (SVG) uma imagem que já existe (logo, mascote, ícone, ilustração), parte por parte: recorte de referência de cada parte, medidas por proporção (nada "no olho"), uma ficha de técnica por parte do rosto e do corpo, e o loop renderizar → comparar com o original (diff do ImageMagick) → corrigir.
- **Quando usar:** "vetoriza esse mascote", "redesenha esse logo em 2D", "faz o personagem igual ao da imagem". No El Bravo: redesenhar o rosto do mascote do logo atual, sem a estrela.
- **Atenção, créditos:** o texto original manda abrir **um subagente para cada parte** (olho esquerdo, olho direito, boca…), o que gasta muitos créditos. **Regra nossa:** seguir a mesma ordem das fases, mas fazendo tudo na conversa, sem subagentes, a não ser que o Daniel peça.
- **Ferramentas no container (25/11/2026):** `rsvg-convert` e `xmllint` existem; o ImageMagick existe como `convert` (a skill chama `magick`: use `convert` no lugar). `vtracer` e `svgo` não estão instalados (são opcionais).
- **Por que entrou:** a primeira tentativa de desenhar a cabeça do El Bravo "à mão" em SVG ficou fraca (sem base nem medidas). Esta skill dá o método.

## 25/11/2026: primeiro uso (cabeça do mascote El Bravo)

- **Funcionou melhor que desenhar à mão:** em vez de montar cada parte com curvas "no olho", separar as regiões **por cor direto da imagem** (HSV com numpy/scipy), limpar cada máscara (abrir, fechar, tapar furos, alisar com gaussiana) e vetorizar a imagem chapada com a `vtracer` em modo cor + spline. Fica fiel ao desenho original.
- **Iluminação engana a cor:** luz alaranjada sobre o vermelho parece dourado; sombra no dourado parece pele. Solução: manter só o **maior pedaço** de cada cor (isso também apaga enfeites soltos, como a estrela) e, onde a cor não resolve, **medir numa grade** e conferir com amostras de pixel coluna por coluna.
- **Faixa de largura uniforme** (como a moldura da boca): construir a partir de pontos medidos do centro da faixa, com um "pincel" redondo (círculos ao longo da curva). Linha grossa do Pillow deixa dentes nas emendas.
- **Não engordar para alisar:** dilatar as molduras para tirar o serrilhado apagou detalhes do desenho (o V vermelho entre os olhos, o vermelho em volta do nariz). Alisar com fechamento que só aceita "mordidas" pequenas.
- **Contornos internos importam:** cada peça (moldura de cada olho, faixa da boca) precisa do próprio contorno escuro; na união das peças, sem essas linhas, tudo vira um bloco só.
- **Sempre comparar em zoom** com o original, lado a lado: o vetor inteiro pode parecer certo e ter erros de desenho que só aparecem de perto.
- Ferramentas: `pip install --break-system-packages vtracer` (instalado no container em 25/11/2026); `convert` no lugar de `magick`.
