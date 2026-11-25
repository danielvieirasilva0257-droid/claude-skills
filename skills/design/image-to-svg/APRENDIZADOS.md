# Aprendizados: image-to-svg

Adendos datados. O mais novo fica embaixo. A skill ainda não incorpora nenhum aprendizado (está intacta, como veio da origem).

## 25/11/2026: entrada na base

- **Para que serve:** redesenhar em vetor (SVG) uma imagem que já existe (logo, mascote, ícone, ilustração), parte por parte: recorte de referência de cada parte, medidas por proporção (nada "no olho"), uma ficha de técnica por parte do rosto e do corpo, e o loop renderizar → comparar com o original (diff do ImageMagick) → corrigir.
- **Quando usar:** "vetoriza esse mascote", "redesenha esse logo em 2D", "faz o personagem igual ao da imagem". No El Bravo: redesenhar o rosto do mascote do logo atual, sem a estrela.
- **Atenção, créditos:** o texto original manda abrir **um subagente para cada parte** (olho esquerdo, olho direito, boca…), o que gasta muitos créditos. **Regra nossa:** seguir a mesma ordem das fases, mas fazendo tudo na conversa, sem subagentes, a não ser que o Daniel peça.
- **Ferramentas no container (25/11/2026):** `rsvg-convert` e `xmllint` existem; o ImageMagick existe como `convert` (a skill chama `magick`: use `convert` no lugar). `vtracer` e `svgo` não estão instalados (são opcionais).
- **Por que entrou:** a primeira tentativa de desenhar a cabeça do El Bravo "à mão" em SVG ficou fraca (sem base nem medidas). Esta skill dá o método.
