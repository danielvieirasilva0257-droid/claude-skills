# Aprendizados: remotion-video

Adendos datados. O mais novo fica embaixo. A skill (`SKILL.md`) já incorpora a pesquisa até 09/10/2026 e as regras de composição do editor (10/10/2026), com aprovação do usuário. Novidades entram aqui primeiro.

## 09/10/2026: atualização para 4.0.534 e rotina de testes

- **Atualização da 4.0.250 para a 4.0.534** no projeto Rotina: foi preciso só trocar as versões de `remotion`, `@remotion/cli`, `@remotion/motion-blur` e `@remotion/transitions`, todas exatas e iguais.
  - Os tipos passaram sem mudança no código.
  - Os quadros de teste saíram idênticos aos de antes.
- **Stills rápidos:** cada `remotion still` leva cerca de 5–6 s, quase tudo para iniciar o navegador. Para revisar vários quadros, gere o bundle uma vez (`npx remotion bundle src/index.ts --out-dir=out/bundle`) e renderize os stills a partir dele, com `--scale=0.5`.
- **Tempo do render completo:** o explicativo de 60 s (1.800 quadros, CameraMotionBlur com 8 amostras, 4 CPUs) levou cerca de 15 min.
- **Renders em paralelo** (por exemplo, o vídeo e testes de 3D ao mesmo tempo) dividem os 4 CPUs e já travaram um render. Rode um por vez.

## 09/10/2026: promo v2 do Rotina (30 s) com celular 3D de verdade em produção

- **Pipeline em camadas** (código na branch `rotina-video`, pasta `src/v2`):
  - **Telas do app:** uma composição 1080×2340 renderizada como sequência JPEG (`--sequence --image-format=jpeg`). Foram 669 quadros em cerca de 1,5 min.
  - **Celular 3D:** uma composição só com o celular, fundo transparente, como sequência PNG (`--sequence --image-format=png --gl=swangle --concurrency=1`).
    - Mediu cerca de 1 s por quadro: 665 quadros em ~11 min, 172 MB.
    - Os arquivos saem como `element-182.png` (3 dígitos para 900 quadros).
  - **Vídeo final 2D:** composição que põe o PNG do quadro com `<Img>` entre as camadas 2D.
    - Rascunho em `--scale=0.5`: 72 s. Final em 1080×1920 com áudio: 182 s (4 CPUs).
- **Um "rig" compartilhado** (`rig.ts`): uma função dá posição e rotação do celular por quadro.
  - O 3D usa essa função; o 2D projeta pontos da tela com a mesma câmera do three.js (`Vector3.project`).
  - Assim cartões, sombras e brilho saem do ponto exato da tela do celular.
- **Troca de tela durante giros:** troque o conteúdo do celular no quadro em que a traseira está virada para a câmera (calcule com a normal da tela). Num giro rápido de 360°, isso dura só 2–3 quadros.
- **Motion blur barato:** um blur direcional em SVG (`feGaussianBlur stdDeviation="X 0"`) na camada do celular, proporcional à velocidade de rotação, no lugar do `CameraMotionBlur`. Não custa render extra.
- **Zoom para dentro da tela:** leve o celular até a câmera (z ~2,75 com câmera em 4,5 e fov 30) até a tela cobrir o quadro. A tela mostra o splash vermelho, e no quadro seguinte entra o cartão final 2D com o mesmo desenho. A emenda fica invisível.
- **Fundo com a mesma cor do conteúdo:** íris (círculo em `clipPath`) a partir de um elemento (o ponto do "?"), wipes diagonais acompanhando a direção do giro.
- **Cuidados:**
  - O `public/` é copiado em cada bundle. Pastas grandes de quadros deixam o bundle lento; deixe essas pastas fora do Git e gere de novo pelo código.
  - Um `pgrep -f "remotion render"` encontra o próprio comando do shell. Confira a contagem de arquivos em vez disso.

## 10/10/2026: regras de composição de um editor de motion (revisão do Daniel no v2)

O Daniel é editor de vídeo profissional (motion). Ele revisou o v2 do Rotina e passou 4 regras. Valem para **qualquer** vídeo, com qualquer ferramenta, e têm prioridade sobre efeitos "bonitos":

1. **Nada de texto sobre texto, nem logo sobre texto.** Duas camadas de letra uma em cima da outra ficam ilegíveis e a animação perde a graça.
   - A frase anterior precisa sair, ou ficar em outra área do quadro, antes da próxima entrar.
   - Vale também durante o movimento: as metades de um título não podem se cruzar no meio do caminho.
2. **Nada de recorte no meio da tela.** Um pop-up que "nasce" de uma máscara (`overflow: hidden`, `clipPath`, wipe) mostra uma linha de corte quando o recorte fica no meio do quadro, e parece colado por cima.
   - A animação inteira tem de caber na própria camada: nenhuma borda do shape pode ser cortada durante o movimento. No After Effects, isso equivale a deixar a pré-composição maior que o movimento.
   - Blur também corta: use filtro SVG com `filterUnits="userSpaceOnUse"` e uma região bem maior que o quadro.
   - Recorte só é aceitável quando a borda dele é uma borda real da cena, como a tela do celular ou a borda do vídeo.
3. **O elemento principal fica por cima do texto.** Ordem das camadas: fundo (wallpaper), depois textos e cartões, depois o celular. O texto fica **entre** o fundo e o celular, nunca na frente do celular.
4. **O texto entra de um lugar que explique a entrada:**
   - de fora do quadro, da borda para dentro (por exemplo, da esquerda para a direita);
   - ou de trás do celular, saindo naturalmente.
   - Nunca "brotar" do nada no meio da tela, porque aí parece uma composição separada.

**Como ficou no código** (branch `rotina-video`, `src/v2/parts.tsx`):

- **`Entra`:** uma mola traz o elemento de totalmente fora do quadro até a posição final, e a saída leva de volta para fora. O blur direcional acompanha a velocidade.
  - Mola `{stiffness: 300, damping: 26}`: pousa 7 quadros depois do início.
- **`Atras`:** o elemento começa escondido dentro da silhueta do celular (calculada pelo rig, com margem) e desliza para fora pelo lado.
  - Mola `{170, 20}`: pousa em 9 quadros.
- **`PalavraDividida`:** um título com as duas metades vindo das bordas opostas.
  - A mola é criticamente amortecida, `{320, 38}`, sem passar do ponto. Com a mola comum, as metades passaram uma por cima da outra, que é exatamente o erro da regra 1.
- **Posição final fora do celular:** cada texto e cartão para numa área livre, conferida com o rig quadro a quadro, então o celular nunca cobre o que é para ler.
- **Conferência barata:** um rascunho com o celular desenhado como silhueta (prop `silhueta` do `RotinaV2`) e folhas de quadros a cada 10 quadros mostram sobreposições e cortes antes de renderizar o 3D.
- **Afastamento de câmera no lugar de recorte:** para "colocar" uma imagem de tela cheia dentro do celular, trate a imagem como a tela do celular desde o começo e afaste a câmera.
  - Use um zoom em escala logarítmica (`Z = Z0^(1-k)`) com curva suave, para a velocidade parecer constante.
  - A moldura do celular entra pelas bordas do quadro, e o recorte coincide sempre com a borda da tela. Nunca aparece uma linha de corte solta.
- **`Atras` precisa esconder a caixa inteira:** prenda o ponto de partida dentro da silhueta do celular nos dois eixos. Se o celular ainda estiver se movendo, um cartão alto pode começar acima do topo do celular, ou seja, à vista.
- **O celular não pode cobrir um texto antes de ele ser lido.** No v2, o celular subia e cobria o "DELOAD" no quadro em que ele pousava. A correção foi segurar o movimento do celular por 8 quadros e tirar as palavras de cima para baixo.
- **Tempo mínimo de leitura:** confira o quadro de pouso e o de saída de cada texto. Um chip ficava só 3 quadros parado, porque entrava tarde e saía junto com os outros.
- **Sons junto com as entradas:**
  - um swish que começa 1 quadro antes da entrada, para o pico cair na velocidade máxima da mola;
  - o som de impacto no quadro de pouso: +7 para `Entra`, +9 para `Atras`, +8 quando as metades do título se encontram.

## 11/10/2026: proposta aprovada e salva no SKILL.md

- O Daniel aprovou a proposta com os aprendizados do Rotina v2. O `SKILL.md` agora incorpora tudo até 11/10/2026, já com os caminhos das pastas por categoria.
- A `description` do cabeçalho foi posta entre aspas: os dois-pontos no meio quebravam o YAML e o programa `npx skills` não achava a skill.

## 12/10/2026: Rotina v3 (celular do Blender montado no Remotion)

- **Textura da tela:** quando o celular vem do Blender (`premium.py`), as telas do app são renderizadas em **1080×2309**, não 1080×2340.
- **Camadas:** fundo com halo que segue o celular → textos e cartões → PNG do celular do Blender (`<Img>` do quadro) → grão e vinheta. O Remotion deve pular exatamente os quadros que o Blender não grava (no v3, `y0 > 2000` da caixa projetada).
- **Silhueta com a mesma projeção** do Blender (`camera.ts`) permitiu revisar todo o layout antes de 2 h 40 min de render.
- **Revisão por terços:** rascunho de 10 s em meia resolução (~1 min) assim que cada terço do Blender fica pronto. Achou 3 problemas antes do fim do render.
- **`Atras` com elemento mais largo que o celular:** o título ROTINA (210 px) vazava pela lateral do celular girando. Solução: nascer centrado no celular e 20% menor, crescendo enquanto sobe.
- **Troca de texto dentro da tela do app:** cruzamento com deslocamento e blur, sem `overflow:hidden` (a regra 2 vale também dentro do celular).
- **Vídeo sem som:** cada fala precisa de uma palavra na tela ou de uma ação clara no celular. Um trecho de 1,5 s sem texto, com metade do quadro vazia, foi corrigido com um título entrando pela borda.
- Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 6) e `reports/Vídeo Rotina v3, skills e combos usados (2026-10-12).md`.

## 13/10/2026: Rotina v4 (celular do Blender sobre o papel e tinta do v2)

- **Fundos por seção sem máscara de conteúdo:** formas sólidas crescendo (círculo que nasce de trás do celular, faixa diagonal varrendo no sentido em que o celular se move). A grade e a vinheta acompanham a troca por rampa (nada muda de uma vez).
- **Sombra 2D para o celular do Blender:** polígono do corpo projetado (`bodyQuad`), desfocado (34 px) e deslocado (+30, +58). No papel, opacidade 0,3; no vermelho, um pouco mais e em tom vinho; some na tinta, onde entra o brilho vermelho atrás do celular.
- **Gráfico que se desenha sem máscara:** a área sob a linha é um polígono calculado até a ponta da linha a cada quadro, no lugar do `clipPath`.
- **`Atras` com elemento largo:** se o elemento for mais largo que o celular, ele começa vazando pela lateral. Use `Entra` pela borda do quadro (ex.: o botão do CTA desce do topo).
- **Textos saindo e entrando no mesmo lugar:** confira se o que sai e o que entra não se cruzam no meio do movimento (no v4, o botão do CTA cruzava o texto que saía; resolvido saindo antes). Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 7).

## 17/10/2026: Rotina v5 (promo 16:9 no estilo de um modelo de "UI premium")

- **Câmera passeando numa interface 2D:** lista de focos (quadro, ponto, escala) interpolada com `inOut`; transform `translate(centro) scale(e) translate(-foco)` com `transformOrigin: 0 0`. O borrão de movimento vem da diferença de posição para o quadro anterior (filtro SVG com região grande, que não corta).
- **Frase palavra por palavra que se recentraliza sozinha:** cada palavra entra com desfoque e uma subida curta, e a largura dela entra aos poucos na soma. Um chip de interface pode ser uma "palavra".
- **Morph cartão → ícone sem máscara:** retângulo da cor do cartão cobre o conteúdo, encolhe até o quadrado do ícone (mesmo raio do canto) e muda de cor; o ícone real entra no quadro seguinte.
- **Lista inteira montada que rola por seção:** a seção em foco acesa, a próxima apagada (0,32) e a que sai some por tempo enquanto a coluna rola, para nada passar por cima do topo.
- **Cuidado:** módulos lidos pelo exportador de efeitos (node, sem `document`) não podem medir texto no carregamento. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 8).

## 17/10/2026: Rotina v6 (vertical, celular do Blender alternando foco e mergulho)

- **Lista de trechos da câmera** (P em foco, N mergulho num retângulo da UI): gera a pose do Blender, o desfoque do celular no 2D e o ponto de partida de cada cartão. O cartão nasce na projeção do retângulo da tela no quadro do salto e vai com mola para o lugar dele.
- **A saída do cartão termina antes de o celular voltar ao foco,** com borrão de no máximo ~14 px. Senão o rastro cruza a tela nítida.
- **Celular saindo do quadro:** o `--borda` do Blender não grava PNG quando o celular está todo fora. Teste a caixa projetada antes de pedir a imagem. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 9).
