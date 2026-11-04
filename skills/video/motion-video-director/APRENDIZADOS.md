# Aprendizados: motion-video-director

## 04/11/2026: adaptações para usar no repositório do Daniel (ainda não testada num vídeo)
- **Regras de composição do editor valem aqui** (obrigatórias): veja `skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor". Confira cada storyboard e prévia contra as 4 regras antes de pedir aprovação.
- **Fala e entregas em português do Brasil**: a mensagem inicial (§0a), o roteiro de voz e os resumos vão em pt-BR.
- **Voz**: a skill pede MP3 do ElevenLabs gerado pelo usuário. Alternativa já usada aqui: voz Gemini TTS (`skills/audio/`, chave em `/root/.config/rotina/`). Nome de arquivo: `<modelo>_<voz>_<trecho>.mp3`.
- **Acompanhamento**: a skill cria `PROGRESS.md` e `LOG.md` na pasta do projeto. No nosso repositório, o registro oficial é `projetos/<nome>/PASSO-A-PASSO.md` na `main`; o código e as mídias do projeto ficam numa branch do projeto.
- **Chaves de API**: a skill usa `<projeto>/.env` (fica no .gitignore). Nunca fazer commit dele.
- **Container da nuvem**: o Chromium fica em `/opt/pw-browsers/` (não rode `playwright install`); como roda como root, o Chrome precisa de `--no-sandbox` (igual ao kit motion-video). Não há GPU e só 4 CPUs: um render por vez. `analyze_ref.sh` precisa do `montage` (ImageMagick).
- **Skills parecidas no repositório**: `remotion-video` (Remotion/React) e `motion-video` (canvas, motion-studio). Esta é mais um manual de direção e produção completo, incluindo edição de vídeo gravado.

## 04/11/2026: primeiro vídeo real (Rotina v7, 49,6 s, vertical)

- **Funcionou como a skill pede:** `renderFrame(t)` determinístico numa página HTML, `src/render.js` com o contrato `--from --to --fps --scale --out --jpg`, e o `scripts/preview.mjs` da skill sem mudança. Cada folha (5 a 50 quadros, escala 0,25) sai em 10 a 40 s e achou todos os problemas antes do render final: textos pequenos, palavras encostando no celular, textos na zona de baixo e um chip cortado pela borda.
- **App de verdade dentro do celular:** gravar o app real com o Playwright + CDP `Page.startScreencast` (quadros com horário) e mostrar o quadro certo em cada `t`. Os toques ficam num JSON e viram bolinhas de toque no celular. Detalhes e armadilhas (zoom 3x para nitidez, rolagem com zoom, abas escondidas) em `projetos/rotina/PASSO-A-PASSO.md`, item 8.
- **Camadas para as 4 regras do Daniel:** fundo < blocos de cor < **todos os textos e cartões** < celular < fecho. Assim nenhum texto passa por cima do celular. As entradas são `whip` (da borda, com desfoque de movimento direcional por filtro SVG `feGaussianBlur` só em x ou só em y) ou "sair de trás do celular" (começa no centro do celular, atrás dele, e desliza para fora).
- **Velocidade:** 1080×1920 a 30 fps com 3 páginas do Chromium em paralelo: ~1,1 quadro/s (49,6 s de vídeo em ~22 min).
- **Voz pelo ElevenLabs:** o endpoint `with-timestamps` dá o tempo de cada letra; isso substitui o faster-whisper para os tempos das palavras. No plano grátis, só as vozes prontas (premade) funcionam pela API, e a saída máxima é MP3 a 128 kbps.
- **Gosto do Daniel: ele gosta do efeito de glow** (texto neon com brilho, como o "Mágica" da referência). Use em cena escura: `text-shadow` em camadas (branco perto + cor do acento longe), acender piscando nos primeiros 0,45 s e um pulso leve depois, e uma luz radial atrás do celular.

## 04/11/2026: v8 do Rotina, depois do veredito do Daniel sobre a v7

- **O que o Daniel pediu (vale como gosto dele para os próximos vídeos):**
  - o celular **não** fica na tela o tempo todo: alterne cenas com o app de verdade e cenas só com peças grandes do app (cartões, botões, gráficos) desenhadas em código;
  - **wallpaper em degradê desfocado e animado**, nunca parado, com as cores mudando suavemente por cena;
  - **shape layers fluidas** (formas orgânicas que se mexem, faixas onduladas) e **nada de divisão chapada** (bloco reto de cor cortando a tela);
  - **muitos efeitos e ideias novas**, ícones animados e as skills `button-animation` e `motion-oficial` aplicadas.
- **Como foi feito** (`v7/src/v8_body.js`, branch `rotina-video`):
  - wallpaper: 6 círculos com `radial-gradient` (sem `filter: blur`, que pesa) andando em curvas de seno, cores interpoladas entre paletas por cena;
  - formas líquidas: caminho SVG fechado por 9 pontos que oscilam, suavizado com Catmull-Rom → Bézier; entram e saem por fora do quadro;
  - faixas onduladas com gradiente atravessando o quadro atrás do conteúdo nas trocas de cena; ondas de choque (círculos) e faíscas nos impactos;
  - ícones Lucide (os mesmos do app, ISC) baixados de `lucide-static@0.400.0`. **Armadilha:** ao extrair o miolo do SVG, pegue o que está entre a tag `<svg ...>` e `</svg>`, não a partir do primeiro `>` (o comentário de licença tem `>` e o texto seguinte sumia dentro de um `<svg>` aberto);
  - botões (button-animation): toque 0,96 + ondulação, troca de rótulo em sequência (o velho sai, depois o novo entra, com blur 4 px), botão 3D que afunda, destaque deslizante com mola 650/40/0,5, tremor de erro de 6 px, anel de gradiente girando dentro da borda real do botão e brilho passando;
  - **regra 1 na prática:** ícones que se juntam num total não podem passar por cima do número; o número só aparece depois que eles somem.
- **Armadilha de canvas:** `<canvas>` com `inset: 0` não estica (é elemento substituído). A granulação da v7 cobria só um quarto do quadro; precisa de `width` e `height` explícitos.
