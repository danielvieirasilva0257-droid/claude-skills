# Direção, som e 3D profissionalizam o Rotina

O salto de "vídeo simples" para um promo do Rotina com acabamento de After Effects não depende de trocar de ferramenta: depende de processo, som e ativos reais. O motor que você já usa (Remotion, celular em CSS-3D, câmera por keyframes com bezier, `CameraMotionBlur` e legendas cinéticas) é o mesmo dos criadores mais assistidos de 2026. Eles atribuem cerca de 10% do resultado ao prompt e 90% ao "harness": regras da casa que proíbem o visual genérico, referências convertidas em guia de estilo e shot list, grade de batida, efeitos sonoros no frame exato, voz expressiva e um loop de autocrítica sobre frames renderizados. As três mudanças de maior retorno, nesta ordem, são:

1. atualizar o Remotion de 4.0.250 para 4.0.534 e instalar as skills oficiais, mais bibliotecas gratuitas de receitas de câmera e easing;
2. trocar a voz do edge-tts por ElevenLabs v4 ou Gemini, com tempos reais por palavra nas legendas. A voz atual é juridicamente duvidosa para anúncio pago e fica cerca de 290 pontos de Elo abaixo do Eleven v4;
3. licenciar música com cláusula explícita de anúncio pago e desenhar os efeitos sonoros frame a frame.

3D de verdade é viável neste container sem GPU. Um celular em React Three Fiber renderizou a até 0,6 s por frame depois que o loop contínuo do R3F foi desligado, o que basta para um ou dois planos-herói por vídeo. Já os MCPs de After Effects, Cinema 4D e DaVinci Resolve, assim como o Blender MCP, exigem aplicativo desktop e não rodam aqui. A maior incerteza é o pt-BR: nenhum ranking cego testa português do Brasil, então a voz final deve sair de um teste A/B seu com o roteiro real.

## O prompt vale 10%; o "harness" vale o resto

O tema explodiu em duas ondas no YouTube:

- **Janeiro de 2026:** o Remotion lançou Agent Skills oficiais para o Claude Code, e saíram dezenas de tutoriais com 50 mil a 250 mil visualizações.
- **Fim de setembro de 2026:** chegou o Claude Opus 5.5.

O vídeo mais visto da segunda onda é de Lukas Margerie (**404 mil visualizações**) e resume o consenso numa frase: "o prompt é só 10% do resultado; os outros 90% são o harness". Segundo ele, o resultado genérico típico é "texto centralizado e um gradiente" ([Lukas Margerie](https://www.youtube.com/watch?v=747ZnEtsRbg)). O harness mostrado vem do curso do criador Movez ([Substack Movez](https://movez.substack.com/p/how-to-build-motion-design-studio)), e tem estas regras:

- **Função do tempo:** todo filme é uma função pura do tempo, sem transições CSS, timers ou `Math.random`.
- **Proibições no `CLAUDE.md`:** título centralizado sobre gradiente, "tudo entra com fade", glow em UI e explosões genéricas de partículas.
- **Identidade visual:** uma fonte display, uma fonte de UI, **uma única cor de destaque** e "algo novo a cada 2 a 4 segundos".
- **UI real:** a interface do produto nunca é redesenhada de imaginação; ela é capturada.
- **Formato:** a versão 9:16 é construída primeiro e nunca recortada de um 16:9.
- **Nomeie o framework:** se o prompt não nomear Remotion ou HyperFrames, o Opus escolhe sozinho uma página HTML única renderizada com Playwright.

Os criadores repetem a mesma sequência: referência → guia → grade → crítica.

- **Referência.** Lukas Margerie e Jason Lee partem de filmes de lançamento reais catalogados em whatships.com. O prompt de Margerie manda baixar o vídeo de referência, extrair um frame a cada meio segundo e escrever dois arquivos. O `style_guide.md` registra paleta, tipografia, duração dos planos, tipos de transição, movimentos de câmera, textura e como o texto entra e sai. O `shotlist.md` lista os planos. A regra é "pegue a gramática da referência, nunca o conteúdo" ([Lukas Margerie](https://www.youtube.com/watch?v=747ZnEtsRbg); [Jason Lee](https://www.youtube.com/watch?v=J4oygRI6mN0)).
- **Grade.** Antes de escrever código, o modelo apresenta a lista de estados sobre a grade de batida para aprovação. Depois mede ou sintetiza a trilha, grava um `beats.json` com batidas, tempos fortes e hits, e retima a animação por ele. O ganho é mensurável: com uma lista de batidas, o canal Code Bear fez cortes que caíram "0 milissegundos fora" nos dois hits principais de um explicativo de 60 s. Três vídeos custaram **cerca de US$ 14 em preço de API** ([Code Bear](https://www.youtube.com/watch?v=wvY1qYkmGmU)).
- **Crítica.** O último elo é o loop de autocrítica ([Movez](https://movez.substack.com/p/how-to-build-motion-design-studio)):
  - contact sheet a 2 fps;
  - tiras de 12 frames em torno das ações rápidas;
  - um "teste do celular" com o vídeo reduzido a cerca de 360 px;
  - notas de 1 a 10 para gancho, legibilidade, qualidade do movimento, variedade, composição, fidelidade à marca e sincronia do som;
  - corrigir os três piores itens e repetir até tudo passar de 8.

Nate Herk chama a verificação de "provavelmente o passo mais importante" ([Nate Herk](https://www.youtube.com/watch?v=7jHXoPGnA4c)). As peças de vitrine não são one-shots: uma delas levou 163 chamadas ao modelo e quase 7 horas ([Lukas Margerie](https://www.youtube.com/watch?v=747ZnEtsRbg)). Movez recomenda esforço `xhigh` para filmes novos, `max` para peças principais e `medium` só para ajustes.

Dois vídeos estão muito próximos do caso do Rotina:

- **Sergei Chyrkov** gera um promo de 30 s "estilo Apple" para o Monlio, um app de finanças. Ele parte de um prompt simples, do site do app e de screenshots, fotos e gravações reais, e usa Remotion para a narrativa e Three.js para a abertura em 3D ([Sergei Chyrkov](https://www.youtube.com/watch?v=3ziCXSiZcTc)).
- **Maxence Tison** mostra o método "por imagens", para quem tem marca a respeitar. As screenshots da App Store de um app real viram um anúncio vertical de 15–30 s em que a voz entra sincronizada com o que aparece na tela. Para a narração, ele evita as vozes padrão, que acha "assez robotiques", e usa o TTS do Google ([Maxence Tison](https://www.youtube.com/watch?v=DBQqB8eqpFI)).

Para o acabamento, há duas referências úteis:

- **MoSidd** publica os valores exatos de um glassmorphism premium: blur de fundo de 12–14 px, filete de luz na borda em 16–17%, face a 58% de opacidade e raio de 22 px nos cards. Ele também renderiza uma esfera de vidro em Three.js numa segunda passada, composta sobre o HTML ([MoSidd](https://www.youtube.com/watch?v=b7KlsXNQobs)).
- **Bart Slodyczka** usa como técnica central um único objeto que se funde continuamente na forma seguinte ([Bart Slodyczka](https://www.youtube.com/watch?v=6Ij9-f2T2Ck)).

Do lado da voz:

- O vídeo oficial da ElevenLabs mostra o Claude reescrevendo o roteiro com audio tags para dar emoção à locução ([ElevenLabs](https://www.youtube.com/watch?v=bw3eA-eSS4o)).
- A Aira Tech dá ao Claude um parágrafo de referência já marcado com tags e pede que ele replique o tom e as marcações no roteiro ([Aira Tech](https://www.youtube.com/watch?v=IbMXdKJ8hJQ)).
- O Build at Scale mostra por que gerar a narração antes e retimar as cenas pela voz: roteiros gerados soltos "não voltam com bons tempos" ([Build at Scale](https://www.youtube.com/watch?v=wi1Ys-6gr48)).

Nenhum desses vídeos testou português do Brasil. As promessas de "grátis e ilimitado" do Fish Audio vêm de segmentos patrocinados.

Em português, os tutoriais mais vistos são estes:

| Criador | Tema | Visualizações |
|---|---|---|
| [Felipe Borges](https://www.youtube.com/watch?v=XTtTBqECLPs) | motion graphics no Claude Design | 178 mil |
| [Rafa Voss](https://www.youtube.com/watch?v=SjlKBdgWrZ4) | cortes e motion no Claude Code | 162 mil |
| [Fernando Valon](https://www.youtube.com/watch?v=ntHLmj-GqF0) | motion graphics com Claude Code e Remotion | 125 mil |
| [Macks Wendhell](https://www.youtube.com/watch?v=0I5AWAuPFj0) | Remotion grátis contra Higgsfield no mesmo vídeo | 72 mil |
| [Fernando Araujo](https://www.youtube.com/watch?v=rfplFJXmIjg) | extrai o design system da marca antes do "prompt definitivo" | 21 mil |

O reel do @ssupernova.studio que motivou esta pesquisa usa "opus 5.5, Remotion e Blender", segundo o próprio autor nos comentários, com "boas referências e direcionamento". O tutorial prometido ainda não estava publicado em 8/10/2026 ([Instagram](https://www.instagram.com/reel/DeKsH6xP0JH/)).

## Seis instalações gratuitas cobrem o salto de motion design

A integração oficial do Remotion com agentes agora é feita por **Agent Skills, não por MCP**. O MCP de documentação foi depreciado, e o servidor hospedado sai do ar a partir de 31/08/2026 ([Remotion: MCP](https://www.remotion.dev/docs/ai/mcp)). As 12 skills oficiais (`npx remotion skills add`) trazem regras que atacam diretamente o "simples":

- tudo é dirigido por `useCurrentFrame()` e `interpolate()`;
- `Easing.bezier` e `spring` substituem o movimento linear;
- `output: 'perceptual-scale'` corrige os zooms.

Elas também documentam o `@remotion/effects` (glow, light leak, shine, zoom blur, aberração cromática, LUT, grão, halftone) e o `<HtmlInCanvasMotionBlur>`, que a própria skill chama de "estado da arte" para desfocar HTML animado ([remotion-markup](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/SKILL.md); [motion-blur.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/motion-blur.md)).

Por cima delas, a comunidade empacotou gramática de movimento:

- **video-shotcraft** (10,8 mil estrelas, Apache-2.0): 157 fichas de planos com easing e timing já ajustados em TSX, câmera 2.5D, cortes na batida, 149 SFX e notas de render headless no Linux. Foi composto em 16:9 e precisa ser recomposto para 1080×1920.
- **motion-video-kit** (MIT): destila 6 regras e 16 mecanismos de 28 filmes de lançamento de SaaS. Traz prompts de crítico independente e uma régua mensurável: tempo congelado, loudness via `ebur128` e contraste.

| Prioridade | Item | Para que serve no Rotina | Instalação | Licença / custo | Roda aqui? |
|---|---|---|---|---|---|
| 1 | [Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills) | regras de markup, legendas, render e docs | `npx remotion skills add` (no projeto) | grátis, sob a licença do Remotion | sim |
| 2 | [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | receitas de câmera, easing, SFX e sincronia com a batida | `npx skills add Vincentwei1021/video-shotcraft` | Apache-2.0 | sim, com `--concurrency=1` |
| 3 | [motion-video-kit](https://github.com/echris6/motion-video-kit), [gsap-skills](https://github.com/greensock/gsap-skills) e o plugin frontend-design | gramática de movimento, crítico e régua de qualidade | copiar `business-motion-film` para `~/.claude/skills`; `/plugin install frontend-design@claude-plugins-official` | MIT | sim |
| 4 | [claude-video-vision](https://github.com/jordanrendric/claude-video-vision) | o Claude "assiste" ao próprio render (frames + áudio) | `/plugin marketplace add https://github.com/jordanrendric/claude-video-vision` | MIT | sim, com Whisper local |
| 5 | [ElevenLabs skills](https://github.com/elevenlabs/skills) | TTS, SFX e música via API | `npx skills add elevenlabs/skills` + `ELEVENLABS_API_KEY` | MIT; API paga | sim, por HTTPS |
| 6 | [Higgsfield MCP](https://higgsfield.ai/mcp) (já conectado) | B-roll de IA, cena 3D, imagem→GLB, reframe para 9:16 | já ativo | assinatura + créditos | sim, via conector |
| opcional | [HyperFrames](https://github.com/heygen-com/hyperframes) | renderizador alternativo HTML + GSAP/Three.js/Lottie | `claude plugin install hyperframes@hyperframes` | Apache-2.0 | sim (Node 22 + FFmpeg) |
| opcional | [appshot](https://github.com/trunghaiy/appshot) | referência de preview vertical de loja (886×1920) | `npx skills add trunghaiy/appshot` | MIT | sim |

Sobre a primeira linha da tabela: o Remotion é "gratuito para indivíduos e pequenas equipes", mas empresas podem precisar de licença paga, então confira os termos para o seu caso ([Remotion LICENSE](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)).

### O que não roda neste container

O "nível After Effects" deste container tem de vir de código. Existem MCPs comunitários para o próprio After Effects: o de referência, Dakkshin/after-effects-mcp, cria composições, câmeras, keyframes e expressões. Todos, porém, exigem o AE 2022+ aberto em Windows ou macOS ([Dakkshin](https://github.com/Dakkshin/after-effects-mcp)). O mesmo vale para:

- Cinema 4D, Houdini e Premiere;
- DaVinci Resolve, que ainda exige o Resolve Studio ([davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp));
- o MCP do Rive, em Early Access e só no Mac;
- o plugin oficial da Adobe, que é só para o Claude desktop e não cobre AE ([adobe/skills](https://github.com/adobe/skills)).

A única rota com "AE no loop" compatível com o container é o MCP da Plainly. Ele renderiza templates de AE na nuvem, é pago e depende de templates montados à mão no AE ([Plainly](https://github.com/plainly-videos/mcp-server)). O MCP for Blender (30 mil estrelas) também exige um Blender aberto, com o add-on rodando um socket; a imagem Docker hospeda só o lado MCP ([mcp-for-blender](https://github.com/ahujasid/mcp-for-blender)).

Atenção às licenças:

- onetake, video-talkcraft e anything2explainer são PolyForm Noncommercial;
- OpenMontage e OpenChatCut são AGPL.

Nenhum deles serve para anúncio do Rotina sem licença comercial ([onetake](https://github.com/feitangyuan/onetake); [video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft)).

Para voz e áudio, o MCP local da ElevenLabs foi arquivado. O MCP hospedado foca em agentes de voz e não oferece SFX nem música ([elevenlabs-mcp](https://github.com/elevenlabs/elevenlabs-mcp); [hosted MCP](https://elevenlabs.io/docs/agents-platform/operate/hosted-mcp)). O caminho atual são as skills oficiais, cujos padrões são:

- `eleven_v4` para fala;
- `music_v2_5` para música;
- `eleven_text_to_sound_v2` com `loop=true` para SFX.

([elevenlabs/skills](https://github.com/elevenlabs/skills))

Testamos os MCPs hospedados da ElevenLabs, Higgsfield, fal, LottieFiles e Kling: todos respondem pelo proxy deste container e todos exigem autenticação. O login OAuth pelo navegador a partir do container não foi testado. O Higgsfield já está conectado e cobra créditos sem teto nativo, então dê ao agente um orçamento explícito ([Creatify sobre o Higgsfield MCP](https://creatify.ai/pt/blog/what-is-higgsfield-mcp-what-it-does-what-it-costs-and-how-to-use-it)). Para descobrir mais, a lista do Agent Skills Hub classifica por segurança 252 repositórios de vídeo ([awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills)).

## Curvas assimétricas e molas quase críticas separam o premium do simples

No After Effects, o Easy Ease (F9) aplica velocidade zero e **33,33% de influência** dos dois lados do keyframe ([Noble Desktop](https://blog.nobledesktop.com/learn/after-effects/speed-graph)). O "segredo" dos motion designers é a assimetria: saída rápida e pouso longo, com a desaceleração no handle de entrada do último keyframe.

As curvas atuais do Rotina são exatamente a easeOutExpo (0.16, 1, 0.3, 1) e a easeInOutCubic (0.65, 0, 0.35, 1) do easings.net ([easings.net](https://raw.githubusercontent.com/ai/easings.net/master/src/easings.yml)). A primeira é ótima para entradas. A segunda tem um meio achatado que deixa moles os movimentos de câmera entre poses. Use em vez disso:

| Uso | Curva | Valores |
|---|---|---|
| câmera entre duas poses | quint in-out ou expo in-out | (0.83, 0, 0.17, 1) ou (0.87, 0, 0.13, 1) |
| entradas | expo-out ou "emphasized decelerate" do Material 3 | (0.16, 1, 0.3, 1) ou (0.05, 0.7, 0.1, 1) |
| saídas | "emphasized accelerate" do Material 3 | (0.3, 0, 0.8, 0.15) |

Faça cada saída durar 60–70% da entrada correspondente ([Material 3 MotionTokens](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MotionTokens.kt)). O IBM Carbon acrescenta uma regra que falta em muito promo: **a duração cresce com a distância percorrida**, em escala não linear ([Carbon](https://carbondesignsystem.com/elements/motion/overview/)).

A mola padrão do Remotion (massa 1, damping 10, stiffness 100) tem razão de amortecimento ζ = 0,5 ([Remotion: spring()](https://www.remotion.dev/docs/spring)). Calculada com o próprio `spring()` do projeto a 30 fps, ela ultrapassa o alvo em **16%** e leva 28 frames para assentar, o que parece brinquedo. Movimento de UI premium fica em ζ ≈ 0,75–0,9, com 1–4% de overshoot. Os tokens de mola do Material 3 Expressive passam direto para o Remotion, que integra a mola em segundos com a mesma fórmula ([Material 3 Expressive](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)). Os números abaixo foram calculados com `spring()` e `measureSpring()` do Remotion 4.0.250 instalado no projeto:

| Configuração | ζ | Assenta em | Pico | Uso no Rotina |
|---|---|---|---|---|
| padrão do Remotion (k100, c10) | 0,50 | 28 f | 116% | evitar |
| M3 Expressive padrão (k380, c31) | 0,8 | 12 f | 101,5% | entrada de UI |
| M3 Expressive rápida (k800, c34) | 0,6 | 10 f | 109% | badges e pops |
| M3 Expressive lenta (k200, c23) | 0,8 | 16 f | 101,5% | celular e câmera |
| efeitos M3 (k1600, c80) | 1,0 | 6 f | 100% | opacidade e cor |

```tsx
// src/motion/tokens.ts: curvas e molas da casa
import {Easing} from 'remotion';
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),       // entradas e pousos (expo-out)
  outSoft: Easing.bezier(0.05, 0.7, 0.1, 1), // M3 emphasized decelerate
  in: Easing.bezier(0.3, 0, 0.8, 0.15),      // saídas (M3 emphasized accelerate)
  inOut: Easing.bezier(0.83, 0, 0.17, 1),    // câmera entre poses (quint in-out)
  back: Easing.bezier(0.34, 1.56, 0.64, 1),  // overshoot só em elementos pequenos
};
export const SPRING = {
  ui:    {stiffness: 380, damping: 31, mass: 1}, // ~12 f, 1,5% de overshoot
  pop:   {stiffness: 800, damping: 34, mass: 1}, // ~10 f, 9% de overshoot
  heavy: {stiffness: 200, damping: 23, mass: 1}, // ~16 f, celular e câmera
};
export const stagger = (i: number, n: number, step = 3, cap = 15) =>
  i * Math.min(step, cap / Math.max(1, n - 1));
```

Os 12 princípios de UX em movimento de Willenskomer adaptam os da Disney para interfaces. Os que um promo "simples" costuma não ter são escalonamento, parentesco, transformação, mudança de valor e dimensionalidade ([UX Magazine](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto)). Elementos que se movem juntos, na mesma velocidade, são lidos como um só grupo. Objetos novos devem nascer de um objeto-herói, porque um fade puro "não estabelece origem".

No Rotina, isso vira números. Eles são síntese da pesquisa, não especificação publicada:

- **Escalonamento:** cards e itens com 2–4 frames de intervalo (3 f ≈ 100 ms), cascata total de no máximo 15 f.
- **Sobreposição:** o próximo elemento começa quando o anterior está 60–70% concluído.
- **Antecipação:** todo movimento-herói começa com 4–6 frames de contramovimento de 2–4%.
- **Continuidade:** badges e cards seguem se movendo por 3–6 frames depois que o celular para.
- **Exagero:** overshoot de 5–10% só em elementos pequenos; no celular, no máximo 2–3%.
- **Vida nas pausas:** celular animado com `noise2D` do `@remotion/noise`: ±2–4° em rotateY e ±6–12 px em Y, um ciclo a cada 3–4 s.
- **Profundidade:** 3–5 planos de paralaxe, com sombra de contato (blur de 40–80 px, opacidade de 0,35–0,5) que cresce com a altura do aparelho.

A contenção da Apple completa o quadro: um plano, uma ideia; fundo escuro ou neutro, com uma só cor saturada; transições quase invisíveis ([YouMind/@leomeethewoo](https://youmind.com/landing/x-viral-articles/apple-product-video-design-secrets)). No Rotina, isso significa usar o #CC0000 só no elemento em foco de cada plano.

## Câmera, transições e desfoque: a gramática do AE reescrita em Remotion

Profissionais simulam 3D no AE com camadas 2.5D e câmera 3D, ou renderizam um celular de verdade. Em Remotion, os equivalentes são o rig de CSS-3D que o Rotina já tem e o `@remotion/three` ([Remotion: @remotion/three](https://www.remotion.dev/docs/three)). Os movimentos-assinatura têm receita. As durações abaixo são síntese de prática, não especificação publicada:

| Movimento | Receita |
|---|---|
| abertura | segurar a pose inicial para o espectador ler a tela antes de mover a câmera ([Rotato](https://rotato.app/blog/monitor-to-phone-transition)) |
| push-in | 30–45 f em expo-out; escala de 1 para 1,15–1,3, com 1–2° de rotateX para dar paralaxe |
| órbita | de −25° a +25° em 60–90 f, com um reflexo especular que acompanha o rotateY |
| revelação | começa de perfil (rotateY 85–90°, só a borda iluminada) e chega a 0° em 30–40 f; o brilho da tela sobe nos últimos 40% |
| vista explodida | camadas da UI em `translateZ(i × 60–140 px)`, com 2–3 f entre camadas |
| mergulho na tela | recuo de 4–6 f, depois zoom de 1 para 6–12× em 12–18 f, com a cena seguinte já posicionada por baixo |

O zoom do mergulho precisa ser perceptual. A escala CSS é linear, mas a área visível cresce com o quadrado da escala. O `output: 'perceptual-scale'` do `interpolate()` (a partir da 4.0.490) corrige essa "corrida no final" ([Remotion: interpolate()](https://www.remotion.dev/docs/interpolate)). Na 4.0.250, o equivalente é interpolar em espaço logarítmico.

| Transição | Frames a 30 fps | Curva / blur | Rota no Remotion |
|---|---|---|---|
| corte seco na batida | 0 | — | `<Series>`; a maioria dos cortes premium é corte + movimento dentro do plano |
| whip pan | 8–12 (metade de cada lado do corte) | blur direcional de 0 ao pico no corte, voltando a 0 | `blurSlide({blur: 0.5})` (≥ 4.0.523) ou apresentação própria |
| push cut + flash | 6–10 | saída 1 → 1,1; entrada 1,15 → 1; flash branco de 2–3 f | `pushCut()` (4.0.534) |
| mergulho / zoom-through | 12–18 | expo-in até o corte, expo-out depois | próprio; `crossZoom` ou `zoomBlur` (4.0.534) |
| máscara a partir do toque | 10–18 | raio em expo-out | `clip-path: circle()` via `interpolate` |
| light leak sobre o corte | 15–30, sem encurtar a timeline | cresce e recolhe | `<TransitionSeries.Overlay>` (≥ 4.0.415) + `lightLeak()` |

A receita mais comum de whip pan usa 10 frames, 5 antes e 5 depois do corte, com o blur atingindo o pico no corte ([Photofocus](https://photofocus.com/software/tutorials-software/easy-whip-swish-pan-in-after-effects/)). O `blurSlide` simula uma panorâmica rápida de câmera ([Remotion: blurSlide](https://www.remotion.dev/docs/transitions/presentations/blur-slide)). O `Overlay` fica centrado no corte sem encurtar a timeline ([Remotion: TransitionSeries](https://www.remotion.dev/docs/transitions/transitionseries)).

### Desfoque de movimento

No AE, o padrão é obturador de 180°, fase de −90° e 16 amostras ([ProVideo Coalition](https://www.provideocoalition.com/motion_blur/)). O `<CameraMotionBlur>` que o Rotina usa com 8 amostras renderiza literalmente a cena várias vezes e mistura as cópias. O custo cresce linearmente com o número de amostras, e a documentação avisa que o componente é "destrutivo para as cores" ([Remotion: CameraMotionBlur](https://www.remotion.dev/docs/motion-blur/camera-motion-blur)). Três ajustes resolvem:

1. envolver só a subárvore que se move (celular ou câmera), nunca as legendas;
2. ligar o blur só nos intervalos de movimento rápido (`samples={rapido ? 8 : 1}`);
3. nos whip pans, usar um desfoque direcional barato no lugar do supersampling.

Na versão mais nova, o `<HtmlInCanvasMotionBlur>` (a partir da 4.0.529) tira a média de capturas em frames fracionários dentro de um canvas, sem o problema de cor. Ele não exige flag para renderizar, só para o preview no Studio ([Remotion: motion blur](https://www.remotion.dev/docs/motion-blur); [Remotion: HtmlInCanvas](https://www.remotion.dev/docs/html-in-canvas)).

### Primeira recomendação técnica: atualizar o Remotion

**Atualize todos os pacotes `@remotion/*` juntos para 4.0.534**, a última versão no npm; todos precisam estar na mesma versão. A atualização destrava:

- `perceptual-scale`, `posterize` (animar "em dois") e easing por segmento;
- cerca de 14 transições novas, entre elas `pushCut`, `blurSlide`, `crossZoom`, `iris` e `filmBurn`;
- o `TransitionSeries.Overlay`;
- os mais de 60 efeitos do `@remotion/effects`;
- a correção do 3D descrita mais adiante.

Num projeto de teste, a 4.0.534 instalou sem atrito ao lado de React 18.3.1 e R3F 8.18, sem forçar React 19. Os efeitos e transições baseados em WebGL ou HTML-in-canvas ainda não foram renderizados neste container, onde rodariam no SwiftShader, que usa a CPU.

## Texto legível dentro de 950×980 px e cortes presos à batida

Para anúncios de Reels, ferramentas de terceiros que citam a Meta reservam **14% no topo (~269 px), 35% embaixo (~672 px) e 6% de cada lado (~65 px)** de um quadro 1080×1920. Sobra uma caixa central de cerca de 950×979 px ([Upload-Post](https://www.upload-post.com/tools/safe-zone-checker/)). A página oficial da Meta não foi lida, e outras fontes pedem até cerca de 130 px à direita por causa da coluna de ícones ([Keywords Everywhere](https://keywordseverywhere.com/tools/instagram-reels-safe-zone-checker/)). Na prática:

- texto entre x 80–920 e y 270–1248;
- legendas com linha de base em y ≈ 1100–1200;
- um `<SafeZoneGuide/>` que pode ser desligado no Studio.

A legibilidade tem limites claros:

- texto com no mínimo 48 px e contraste de 4,5:1 ([AMI](https://cp.ami.ca/sites/default/files/forms/AMI%20Graphics.pdf));
- até 20 caracteres por segundo ([Netflix](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide));
- 2–3 palavras por segundo em legendas de anúncio ([Movidmo](https://movidmo.com/blog/15/5-tips-for-using-captions-in-video-ads));
- no máximo 5 palavras de texto no gancho ([Tiger Pistol](https://tigerpistol.com/vertical-video-ad-best-practices/)).

Como a Barlow Condensed é estreita, legendas de 64–84 px e títulos-herói de 120–180 px cabem.

A entrada de texto mais premium é a revelação por máscara: cada linha fica dentro de um `overflow:hidden`, e o texto sobe de 105% para 0 em expo-out ao longo de 12–16 f. O escalonamento é de 1–2 f por letra ou 2–4 f por palavra. Para dar ênfase à palavra ativa, há duas opções:

- escalar de 1 para 1,12 e de volta a 1 com a mola `pop`, mudando a cor para #CC0000;
- fazer crescer da esquerda uma caixa vermelha atrás dela (`scaleX` de 0 a 1 em 8–10 f) antes de inverter a cor do texto.

Números devem contar com `Math.round(interpolate(...))` e `tabular-nums`, para que os valores pareçam vivos. O `fitText()` do `@remotion/layout-utils` dimensiona títulos para a largura da caixa segura ([npm @remotion/layout-utils](https://www.npmjs.com/package/@remotion/layout-utils)).

O ritmo vem da grade. A 30 fps, **frames por batida = 1800 ÷ BPM**: 120 BPM dá 15 f por batida e compassos de 2 s; 150 BPM dá 12 f. BPMs como 128 geram frações que acumulam erro, então calcule cada posição com `beat(n) = Math.round(n × 1800 / bpm)`, sem somar arredondamentos. As regras de encaixe são:

- cortes caem nos tempos fortes;
- pops atingem cerca de 90% do valor na batida (a mola `ui` chega a 90% em ~5 f, então comece 5 f antes);
- movimentos de câmera começam na batida e assentam até o próximo compasso.

O TikTok orienta a pôr a mensagem central na tela nos **primeiros 3 segundos** ([TikTok Ads](https://ads.tiktok.com/help/article/creative-best-practices?lang=ro-RO)), e a Meta trata os primeiros instantes como a decisão entre ficar e rolar a tela ([Social Media Today](https://socialmediatoday.com/news/meta-shares-tips-on-reels-hooks-creative-diversification-in-ads-and-threa/808182)). Para um vídeo de 30–45 s, uma estrutura coerente com essas fontes é:

| Trecho | Conteúdo |
|---|---|
| 0–3 s | gancho: resultado ou dor, com movimento |
| 3–8 s | problema e promessa |
| três blocos de 6–9 s | hábitos, treinos e finanças, cada um com um movimento-herói e uma demonstração de UI |
| 3–4 s finais | CTA dentro da zona segura |

Edite primeiro a versão de 15–30 s ([Adstellar](https://www.adstellar.ai/blog/vertical-video-ad-best-practices)) e projete para quem assiste sem som, com legendas fortes ([Rocketship HQ](https://www.rocketshiphq.com/?p=5227)).

## 3D de verdade roda sem GPU, desde que o loop contínuo do R3F pare

A equipe mediu o 3D neste próprio container (4 vCPU, 15 GB, sem GPU) em 8/10/2026. O WebGL2 funciona em headless. Todos os modos de `--gl` caem no mesmo backend de software (ANGLE → Vulkan → SwiftShader), então a flag é indiferente aqui. A documentação recomenda `swangle` para máquinas sem GPU e avisa que o render "pode ser lento" ([Remotion: --gl](https://www.remotion.dev/docs/gl-options)).

O gargalo real era outro. Na versão 4.0.250 instalada no Rotina, o `ThreeCanvas` não força `frameloop='never'` durante o render ([npm @remotion/three 4.0.250](https://www.npmjs.com/package/@remotion/three/v/4.0.250)), e o loop contínuo do R3F disputa a CPU com a captura dos frames. Um render de 60 frames passou de 11,7 minutos sem terminar. As versões atuais forçam `'never'` e avançam um frame por vez ([Remotion: ThreeCanvas](https://www.remotion.dev/docs/three-canvas)), e o resultado muda de ordem de grandeza:

| Cenário a 1080×1920 (medições da equipe neste container) | Resultado |
|---|---|
| composição DOM atual (60 frames, com bundling) | ~0,2 s por frame |
| R3F na 4.0.250 sem correção (60 frames) | > 11,7 s por frame; não terminou em 11,7 min |
| R3F na 4.0.534, concorrência 1 (20 frames, com início do navegador e encode) | 11,96 s no total, ≤ 0,6 s por frame |
| R3F na 4.0.250 com `frameloop="never"` + `advance()` manual a cada frame | 11,57 s para 20 frames |
| R3F na 4.0.534, concorrência 4 | 14,5 s, mais lento que com concorrência 1 |
| frame isolado sem pós-processamento vs com DOF + Bloom + AgX | 8,4 s vs 24,2 s (~3×) |

A cena testada é o caminho recomendado. O celular foi construído **proceduralmente**, sem arquivo de modelo, como no `template-three` oficial do Remotion ([template-three](https://github.com/remotion-dev/template-three)): ExtrudeGeometry com bevel, ilha dinâmica, módulo de câmera e tela em `ShapeGeometry` com UV remapeado. Isso também evita risco de marca. A Apple "não apoia o uso de... imagens de produtos Apple" e só aceita fotografia real do produto genuíno, nunca renderização ([Apple](https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html)). Por isso, use um smartphone genérico, sem logo e sem o layout exato da câmera do iPhone.

A iluminação usou um HDRI de estúdio da Poly Haven, licenciado em CC0 e liberado para uso comercial sem crédito ([Poly Haven](https://polyhaven.com/license)), com `MeshPhysicalMaterial` metálico nas laterais e bloom gerado por materiais emissivos. As telas do app continuam sendo composições React. Renderizadas como PNG e aplicadas como textura, ficaram nítidas mesmo com DOF e bloom. Duas alternativas não estão validadas:

- o `useOffthreadVideoTexture` falhou na 4.0.250: a tela saiu vazia no frame capturado;
- a textura por sequência de JPEG (60 frames gerados em 6,5 s) está escrita, mas não foi testada.

Dois cuidados medidos:

- DOF com `bokehScale` 5 borrou metade do texto de uma tela girada; foque o plano da tela;
- uma camada de vidro transparente sobre a tela, com `flat` + EffectComposer, clareou os pretos num tom roxo-acinzentado.

O `<Html transform>` do drei mantém a UI como DOM nítido, mas fica fora do WebGL, sem DOF, bloom nem oclusão ([drei Html](https://drei.docs.pmnd.rs/misc/html)).

Por extrapolação, ainda não medida, 60 s de 3D básico levariam 10–20 minutos de render, e o pós-processamento pode triplicar esse tempo. Por isso, o 3D deve ficar nos planos-herói: abertura, giros de 360° entre seções e logo final. O CSS-3D atual segue nos planos densos de UI, onde o texto precisa de nitidez. A composição 3D pode ser aninhada direto na timeline ou exportada com transparência em ProRes 4444 ou VP8 ([Remotion: vídeos transparentes](https://www.remotion.dev/docs/transparent-videos)). Os criadores confirmam esse padrão:

- o salto de qualidade de Lukas Margerie veio de trocar geometria "low poly" por modelos reais do Sketchfab ([Lukas Margerie](https://www.youtube.com/watch?v=NTfXwQ85suw));
- MoSidd compõe uma passada Three.js sobre a passada HTML ([MoSidd](https://www.youtube.com/watch?v=b7KlsXNQobs)).

O Blender 5.2.2 baixou em 9 s e extraiu em 24 s, mas nenhum render foi cronometrado. O Blender MCP depende da interface gráfica, então a rota realista aqui é `blender -b -P script.py`, com o script bpy escrito pelo Claude e render Cycles na CPU. O Eevee precisa de contexto OpenGL; sem GPU, só funcionaria via EGL/llvmpipe ou Xvfb, o que um fórum antigo descreve como "super lento" ([devtalk Blender](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436)).

Para cenas fotográficas de contexto (academia, carteira, rotina matinal), vídeo de IA via Higgsfield sai mais barato que modelar. A ferramenta exposta neste ambiente gera Seedance 2.5 em 9:16, com 4–30 s, e Jason Lee recomenda fazer rascunhos em 480p antes do 1080p para poupar créditos. Modelos de vídeo, porém, não reproduzem texto de UI com fidelidade, então a interface do Rotina deve continuar renderizada em código ([Jason Lee](https://www.youtube.com/watch?v=J4oygRI6mN0)). Geradores de malha como Meshy, Tripo e o `generate_3d` do Higgsfield podem fornecer objetos em GLB, como halteres ([Meshy](https://docs.meshy.ai/api/ai)). No teste, moedas procedurais já ficaram convincentes.

## A voz é o upgrade mais audível, e o edge-tts não serve para anúncio pago

Não existe teste cego em pt-BR. O único grande placar de preferência cega, o Speech Arena da Artificial Analysis, usa prompts em inglês ([Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard)). Nele, a família "Azure Neural", à qual pertence a voz `pt-BR-AntonioNeural` servida pelo edge-tts, tem Elo 1035, contra 1324 do Eleven v4. Pela fórmula do Elo, o v4 venceria cerca de 84% dos duelos, e o Gemini 3.8 Flash, cerca de 80%. É um forte indício de ganho perceptível, mas não uma prova para o português.

| Modelo | Elo (inglês) | US$ por 1 milhão de caracteres | Situação do pt-BR |
|---|---|---|---|
| Eleven v4 Turbo / Eleven v4 | 1332 / 1324 | 40 / 80 | pt-BR listado explicitamente |
| Qwen-Audio-3.1-TTS-Plus | 1295 | 19,3 | não verificado |
| Cartesia Sonic 3.6 | 1279 | 49 | "pt", sem locale confirmado |
| Gemini 3.8 Flash TTS | 1276 | 16,5 | só "Portuguese", sem locale |
| Azure HD 2.5 | 1131 | 22 | pt-BR via Dragon HD Omni |
| Google Chirp 3 HD | 1056 | 30 | pt-BR disponível (GA), 30 vozes |
| Azure Neural (voz atual) | 1035 | 15 | pt-BR |

Os detalhes do português mudam a leitura do ranking:

- **Eleven v4:** lista "Portuguese, Brazil" e aceita até 10.000 caracteres por pedido ([ElevenLabs: modelos](https://elevenlabs.io/docs/overview/models)). O sotaque, porém, vem da voz escolhida, não do código de idioma: um usuário que queria português europeu recebeu sotaque brasileiro ([Vapi](https://support.vapi.ai/t/29188411/portuguese-accent-from-portugal)). Filtre a Voice Library por sotaque brasileiro.
- **Gemini 3.8 Flash TTS:** cobre mais de 130 idiomas com uma entrada única de "Portuguese" ([Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts)). Já o Gemini-TTS do Cloud TTS (modelos 2.5 e 3.1) tem `pt-BR` disponível (GA) ([Cloud TTS](https://docs.cloud.google.com/text-to-speech/docs/gemini-tts)), e o Chirp 3 HD também ([Chirp 3 HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)).
- **Comparação prática:** no único teste prático encontrado em pt-BR, um blog brasileiro achou o Gemini 3.1 "visivelmente mais fluente" que o ElevenLabs num roteiro de anúncio de 45 s. O autor disse que, num gancho de menos de 30 s, teria dificuldade em distinguir os dois ([NemoVideo](https://nemovideo.com/pt-BR/blog/gemini-3-1-flash-tts-vs-elevenlabs)).
- **Azure:** não pode ser "dirigido" para uma leitura animada em português, porque os estilos das vozes HD só valem para inglês ([Microsoft](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/high-definition-voices)).
- **edge-tts:** só ajusta velocidade, tom e volume ([edge-tts](https://github.com/rany2/edge-tts)).

Boas palavras-teste são "Brasil" (L final) e "tia" (t palatalizado) ([AnySpeech](https://anyspeech.io/pt/portuguese-text-to-speech)), além de "app", "PIX" e "deload".

### Licença decide antes do ouvido

A licença decide antes da qualidade:

- **edge-tts.** Um funcionário da Microsoft respondeu que usar o serviço comercialmente sem assinatura Azure "pode ser uma violação" dos termos ([Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)). O substituto regular e quase gratuito é o Azure Speech, cujo nível F0 dá 0,5 milhão de caracteres neurais por mês ([Azure](https://azure.microsoft.com/en-us/pricing/details/speech/)). Ele oferece a mesma voz Antonio, sob termos explícitos.
- **ElevenLabs.** O plano Free "não pode ser usado para nenhum fim comercial". O que for gerado fora de uma assinatura paga, antes ou depois dela, continua não comercial. Já o que é gerado durante a assinatura vale para sempre, exceto serviços Beta ([ElevenLabs](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform)). Portanto, assine antes de gerar os takes finais.

| Plano ElevenLabs | Preço | Créditos por mês | O que cabe |
|---|---|---|---|
| Starter | US$ 6/mês | 30 mil | plano comercial mais barato |
| **Creator** | **US$ 22/mês** | **121 mil** | MP3 a 192 kbps e 1 clone profissional; cerca de 120 takes de um roteiro de 60 s (~1.000 caracteres) |

O Creator é o plano prático para dirigir 3–5 takes por fala ([ElevenLabs: preços](https://elevenlabs.io/pricing)). Via API, um Reel custa cerca de US$ 0,08 no v4 e US$ 0,014 no Gemini 3.8 Flash, cujo preço dobra em 2027, segundo agregadores ([DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced)).

Outros termos que importam:

- **Gemini, nível gratuito:** o Google pode usar entradas e saídas para melhorar produtos, com revisores humanos. Roteiro de campanha inédito deve ir para um projeto com faturamento ([Gemini API terms](https://ai.google.dev/gemini-api/terms)).
- **OpenAI TTS:** as políticas exigem avisar que a voz é gerada por IA ([OpenAI](https://developers.openai.com/api/docs/guides/text-to-speech)).
- **Modelos abertos:**
  - Kokoro (Apache-2.0) tem pt-BR declaradamente "fraco" ([Kokoro](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)).
  - Chatterbox (MIT) tem um pacote pt-BR de 500M e põe marca d'água inaudível no áudio ([Chatterbox](https://github.com/resemble-ai/chatterbox)).
  - F5-TTS-pt-br, XTTS-v2 e Fish S2 Pro são não comerciais ([F5-TTS-pt-br](https://huggingface.co/firstpixel/F5-TTS-pt-br)).

### Direção da leitura e legendas

Para dirigir a leitura:

- **Eleven v4:** aceita audio tags no meio do texto, como [excited], [warm], [long pause] e [whispers], e dicionários de pronúncia com IPA. O `<break>` do SSML fica desativado ([ElevenLabs v4](https://elevenlabs.io/v4)). A API aceita `previous_text`/`next_text` e IDs de pedidos vizinhos para manter a continuidade entre trechos, além de um `seed` cujo determinismo "não é garantido" ([ElevenLabs API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)).
- **Gemini:** recebe o estilo em linguagem natural, por exemplo "locutor brasileiro de comercial, animado e persuasivo". Ele trata o texto como transcrição literal e lê em voz alta qualquer rubrica que não esteja nos metadados ([Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts)).

As legendas melhoram tanto quanto a voz. O endpoint `/with-timestamps` da ElevenLabs devolve o áudio junto com o início e o fim de **cada caractere** ([ElevenLabs API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)). Isso substitui a estimativa por posição de caractere que o `wordAt()` faz hoje. A documentação não confirma o `eleven_v4` nesse endpoint, então há dois planos B:

- gerar no v4 e alinhar pela API de Forced Alignment, que suporta português do Brasil ([ElevenLabs](https://elevenlabs.io/docs/overview/capabilities/forced-alignment));
- usar o `eleven_multilingual_v2`, que funciona com timestamps.

Gemini, Chirp 3 HD, Polly generativa e OpenAI não devolvem tempos por palavra. Para eles, alinhamento forçado contra o roteiro conhecido é melhor que transcrição, porque preserva a grafia de "Rotina", "PIX" e "deload". As ferramentas disponíveis:

- o WhisperX alinha trechos de texto conhecido com um modelo wav2vec2 de português, na CPU ([WhisperX](https://github.com/m-bain/whisperX));
- o stable-ts foi arquivado em maio de 2026 ([stable-ts](https://github.com/jianfch/stable-ts));
- o modelo padrão do ctc-forced-aligner é não comercial ([ctc-forced-aligner](https://github.com/MahmoudAshraf97/ctc-forced-aligner)).

No Remotion, cada palavra vira um `Caption` `{text, startMs, endMs, timestampMs, confidence}`, com **espaço no início do `text`**. A função `createTikTokStyleCaptions()` agrupa as palavras em páginas: valores baixos de `combineTokensWithinMilliseconds` dão o efeito palavra a palavra, e `pageBreakAfter` (a partir da 4.0.517) impede que uma página atravesse um corte ([Remotion](https://www.remotion.dev/docs/captions/create-tiktok-style-captions)).

Clonagem de voz exige consentimento verificado do dono da voz ([ElevenLabs v4](https://elevenlabs.io/v4)). A análise jurídica brasileira não foi concluída, então, por ora, prefira uma voz da biblioteca.

## Música de anúncio exige licença para "anúncio pago"; SFX exige precisão de frame

A biblioteca de músicas do Instagram não vale para anúncio. As diretrizes da Meta proíbem uso comercial "a menos que você tenha obtido as licenças apropriadas" e avisam que o conteúdo pode ser silenciado ou removido ([Meta](https://www.facebook.com/legal/music_guidelines)). A Sound Collection da Meta é liberada só dentro das plataformas da Meta e não cobre TikTok nem YouTube ([Epidemic](https://www.epidemicsound.com/facebook/music-for-facebook/)). Nas bibliotecas por assinatura, os planos de entrada não cobrem anúncio pago:

| Biblioteca | Plano que cobre anúncio pago | Observação |
|---|---|---|
| Artlist | **Music & SFX Pro, ~US$ 16,58/mês no anual** | o plano Social exclui anúncios ([Artlist](https://artlist.io/page/pricing)) |
| Epidemic Sound | Pro, ~US$ 16,99/mês no anual (segundo rastreadores) | plano seguro para anúncio ([Recurdash](https://recurdash.com/subscription-pricing/epidemic-sound)); o catálogo segue em litígio com a Meta ([Digital Music News](https://www.digitalmusicnews.com/2026/07/13/epidemic-sound-v-meta-lawsuit/)) |
| Soundstripe | plano Business | anúncios e posts impulsionados ficam fora dos planos individuais ([Soundstripe](https://www.soundstripe.com/knowledge/plans-coverage/pricing-faq)) |
| Envato Elements | ~US$ 16,50/mês no anual | cada download fica amarrado a um projeto registrado ([Envato](https://help.elements.envato.com/hc/en-us/articles/360000628966-License-Terms)) |

Parte desses preços vem de rastreadores e há conflitos entre fontes. Confirme por escrito a cobertura de anúncios pagos na Meta e o que acontece com os anúncios já publicados se você cancelar.

### Música gerada por IA

A música gerada por IA mudou de status em 2026:

- **Suno v6:** lançado em 9/09/2026 com modelos licenciados com WMG, BMG e Believe, mas UMG e Sony seguem processando a empresa e não há API pública ([MBW](https://musicbusinessworldwide.com/suno-v6-ai-music-models-launch-in-partnership-with-wmg-bmg-and-believe); [Digital Music News](https://www.digitalmusicnews.com/2026/07/03/suno-is-opening-an-api-partner-program/)).
- **Udio:** desativou os downloads ([PPC Land](https://ppc.land/udio-settles-copyright-lawsuit-partners-with-universal-music-group/)).

As opções automatizáveis com termos comerciais são:

- **Eleven Music** (`music_v2_5`): faixas de 3 s a 5 min, composição por seção, licenciada para "publicidade" nos planos pagos ([ElevenLabs](https://elevenlabs.io/docs/capabilities/music)).
- **Lyria 3.5** pela API do Gemini: cerca de US$ 0,08 por música e US$ 0,04 por clipe de 30 s, com marca d'água SynthID ([Let's Data Science](https://letsdatascience.com/news/google-expands-lyria-35-to-gemini-2a9364bc)).
- **Lyria RealTime:** o único com `bpm` exato (60–200) e variações em stems, como `mute_drums` e `only_bass_and_drums` ([Google](https://ai.google.dev/gemini-api/docs/realtime-music-generation)).

A cobertura de indenização do Google para o Lyria na API do Gemini não foi confirmada. O ACE-Step 1.5 (MIT) permite uso comercial, mas precisa de GPU. Os pesos do MusicGen são não comerciais ([HF](https://huggingface.co/spaces/facebook/MusicGen/discussions/8)).

A trilha atual do Rotina, sintetizada em numpy, é original e juridicamente limpa; o problema é a qualidade musical. Jason Lee resume a experiência dos criadores: música criada pelo próprio Opus "provavelmente não vai ficar boa". Escolha a faixa você mesmo e peça ao Claude para encaixá-la ([Jason Lee](https://www.youtube.com/watch?v=J4oygRI6mN0)). Para qualquer faixa externa, rode detecção de batidas (`beat_track` do librosa) e gere o `beats.json` que dirige a animação ([librosa](https://librosa.org/doc/main/generated/librosa.beat.beat_track.html)). Como direção estética, o "Brazilian phonk" cresceu 62% na Europa entre fevereiro e maio de 2026 ([Billboard Brasil](https://billboard.com.br/brazilian-phonk-crescimento-global-tiktok-funk/)) e combina com o bloco de treino. A 150 BPM, cada batida dura 12 frames.

### Efeitos sonoros

Nos efeitos sonoros, a regra de ouro é física:

- **Whoosh e impacto:** um whoosh que leva a um impacto deve ter o pico no pouso, com o impacto no frame de contato ([Sonilo](https://sonilo.com/ai-music/whoosh-sound-effect-guide)).
- **Sincronia:** o espectador percebe som adiantado (~45 ms) bem antes de som atrasado (~125 ms), então nunca adiante o hit mais de 1 frame a 30 fps ([TV Technology](https://www.tvtechnology.com/opinions/av-synchronization-how-bad-is-bad)).
- **Camadas:** dão corpo ao som. Combine transiente (clique), corpo (thump grave) e cauda (ar ou reverb); "maior significa mais grave e mais lento" ([Krotos](https://www.krotosaudio.com/?p=1006981)).

O mapa de efeitos para o Rotina:

| Momento | Efeito |
|---|---|
| toques e ripples | clique |
| checks de hábito | switch ou ding |
| números de finanças | moedas |
| bloco de treino | peso e apito |
| trocas de seção | whoosh + thump |
| antes do drop | riser terminando exatamente no compasso |
| logo | braam ou sub-drop |

Varie o pitch de efeitos que se repetem. Fontes sem exigência de crédito:

- os SFX incluídos no plano de música pago;
- ZapSplat Gold;
- Freesound filtrado para CC0 ([Cinevva](https://app.cinevva.com/guides/free-sound-effects-music));
- ElevenLabs SFX em plano pago: até 30 s, com loop, WAV a 48 kHz e 40 créditos por segundo quando a duração é explícita ([ElevenLabs](https://elevenlabs.io/docs/capabilities/sound-effects)).

No Remotion, um único arquivo de constantes de timeline deve dirigir a animação, os SFX (`<Sequence from={beat(n)}><Audio/></Sequence>`) e as legendas. Assim, retimar uma animação move o som junto.

### Mixagem

Nem a Meta nem o TikTok publicam especificação de loudness. O alvo usado na prática é **−14 LUFS integrado e −1 dBTP**, com −1,5 dBTP mais seguro para a recompressão em AAC ([OpenClip](https://openclip.app/learn/audio-normalization)). O `mix.sh` atual já faz sidechain e loudnorm. Pela documentação do ffmpeg, faltam três ajustes ([ffmpeg](https://ffmpeg.org/ffmpeg-filters.html)):

1. o `amix` normaliza por padrão e abaixa cada entrada; use `normalize=0`;
2. o `highpass` tem padrão de 3000 Hz; defina sempre `f=80` na voz;
3. faça o `loudnorm` em duas passadas com `linear=true` e confira o resumo, porque ele cai silenciosamente para o modo dinâmico.

Ajustes de partida para cada trilha:

- **Voz:** passa-alta em 80–100 Hz, leve corte em ~250 Hz, presença em ~3 kHz, de-esser e compressão.
- **Música:** um corte fixo em 3–3,5 kHz e ducking de 6–12 dB, com ataque de 5–20 ms e release de 300–500 ms para não "bombear" entre palavras ([Vindral](https://composer-docs.vindral.com/operators/operators-sidechain-ducking.html); [Sage Audio](https://www.sageaudio.com/articles/how-to-make-voice-over-sound-better)).
- **Graves:** celulares perdem quase tudo abaixo de ~500 Hz. Mantenha o grave em mono abaixo de ~120 Hz e sature o baixo para que ele apareça pelos harmônicos ([WA Production](https://blog.waproduction.com/mix-translation-in-2026-make-your-track-hit-on-phone-speakers-cars-and-clubs)).

Renderize vídeo e mixagem separadamente, para poder refazer a mix sem renderizar o vídeo de novo. O Auphonic (2 h grátis por mês, com API) é a alternativa automatizada ([Auphonic](https://auphonic.com/pricing)).

## Recomendações em ordem de retorno por real gasto

A ordem abaixo prioriza o que muda a percepção de qualidade com o menor custo. Os primeiros itens são gratuitos e atacam a causa do "simples". Os seguintes custam pouco e resolvem os dois riscos reais para anúncio pago: a voz e a música. O 3D vem por último porque já é viável, mas consome tempo de render. Para referência de custo do próprio Claude, o Code Bear gastou entre US$ 2 e US$ 8 por vídeo curto em preço de API ([Code Bear](https://www.youtube.com/watch?v=wvY1qYkmGmU)).

| # | Ação | Custo | Por quê |
|---|---|---|---|
| 1 | Adotar o harness: `CLAUDE.md` de proibições, tokens de movimento, referência → guia → shot list na grade, loop de crítica até todas as notas ≥ 8 | grátis (tokens) | maior impacto; ataca o "simples" na raiz |
| 2 | Atualizar todo o `@remotion/*` para 4.0.534 e instalar as skills oficiais, video-shotcraft, motion-video-kit e claude-video-vision | grátis | transições, blur e efeitos de nível AE; 3D viável |
| 3 | Trocar a voz: A/B cego entre ElevenLabs v4 (voz brasileira), Gemini pt-BR e Azure HD Omni; assinar antes do take final; legendas por alinhamento real | US$ 6–22/mês, ou ~US$ 0,01–0,08 por Reel via API | ganho mais audível; elimina o risco jurídico do edge-tts |
| 4 | Licenciar música que cubra "anúncio pago", ou gerar em plano pago; criar o `beats.json` | ~US$ 17/mês no anual | qualidade musical e segurança nos anúncios |
| 5 | Desenhar a camada de SFX no frame e revisar a mix | grátis a US$ 22/mês | "peso" e sensação de AE |
| 6 | 1–2 planos-herói em R3F com celular procedural genérico e HDRI CC0 | grátis; +10–20 min de render | 3D real com reflexo e luz |
| 7 | B-roll de IA no Higgsfield só para cenas de contexto, com orçamento fixo | créditos | variedade sem refazer a UI |
| 8 | Conferir a licença do Remotion para empresas | — | conformidade |

## Plano em doze etapas para o próximo vídeo do Rotina

O plano assume uma versão de 30 s para Reels, editada primeiro, e uma de 60 s derivada dela, ambas em 1080×1920 a 30 fps. Cada etapa tem um critério objetivo de "pronto", para que o Claude trabalhe em portões, como os criadores recomendam. Use esforço `xhigh` nas etapas criativas e cite o Remotion pelo nome em todos os prompts.

| # | Etapa | O que fazer | Pronto quando |
|---|---|---|---|
| 1 | Base técnica | Atualizar `remotion`, `@remotion/cli`, `@remotion/motion-blur` e `@remotion/transitions` para 4.0.534. Adicionar, na mesma versão, `@remotion/noise`, `@remotion/layout-utils`, `@remotion/captions`, `@remotion/effects` e `@remotion/three` (+ `three`, `@react-three/fiber@8`, `@react-three/drei@9`). Renderizar de novo o `RotinaExplainer` | o explicativo atual renderiza igual, sem erros |
| 2 | Harness | No projeto: `npx remotion skills add`; `npx skills add Vincentwei1021/video-shotcraft`; copiar `business-motion-film` (motion-video-kit) para `~/.claude/skills`; instalar o claude-video-vision; `npx skills add elevenlabs/skills` | as skills aparecem no Claude Code |
| 3 | Regras da casa | Criar o `CLAUDE.md` com as proibições (título centralizado em gradiente, tudo com fade, glow em UI, partículas genéricas, tempo morto), Barlow Condensed + 1 fonte de UI + #CC0000 só no foco e "algo novo a cada 2–4 s". Criar o `src/motion/tokens.ts` e trocar a easeInOutCubic da câmera por quint in-out | regras revisadas por você |
| 4 | Referência | Escolher 2–3 filmes de lançamento no whatships.com. Extrair frames com `ffmpeg -i ref.mp4 -vf fps=2 ref/%03d.png`. Pedir `style_guide.md` e `shotlist.md` para 30 s em 9:16, "gramática, nunca conteúdo", com screenshots reais do Rotina | shot list aprovado sobre a grade de batida |
| 5 | Roteiro e voz | Roteiro de 30 s: gancho de até 5 palavras em 0–3 s, números por extenso, pronúncia definida para "app", "PIX" e "deload". A/B cego de 3 vozes. Assinar o plano antes do take final. Gerar o roteiro inteiro numa chamada a `/with-timestamps` (ou v4 + Forced Alignment) | `vo.mp3` + `words.json` com tempos por palavra |
| 6 | Música e grade | Licenciar uma faixa que cubra "anúncio pago" (ou gerar com Eleven Music/Lyria em plano pago) a 120 ou 150 BPM. Rodar `librosa.beat.beat_track` → `beats.json`. Concentrar cenas, batidas, falas e SFX num único `timeline.ts` | `beats.json` pronto + licença arquivada (PDF, ID da faixa, data) |
| 7 | Animatic | Stills de cada plano em baixa resolução e tabela de estados por batida, aprovados antes de animar | contact sheet aprovado |
| 8 | Passe de movimento | Tokens em tudo; escalonamento de 3 f; antecipação de 4–6 f; drift com `noise2D` nas pausas; mergulho com `perceptual-scale`; 2–3 transições motivadas (`pushCut`, `blurSlide`, light leak em `Overlay`); motion blur só na subárvore em movimento; legendas com `createTikTokStyleCaptions` e revelação por máscara | nenhum trecho parado por mais de 2–4 s |
| 9 | Plano 3D herói | 1–2 planos de 2–4 s com celular procedural genérico, HDRI CC0 da Poly Haven e tela em PNG. Renderizar com `--gl=swangle --concurrency=1 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. Usar pós-processamento só se couber no orçamento de render | plano renderizado e aninhado na timeline |
| 10 | SFX e mix | Whoosh com pico no pouso e impacto no frame de contato. Mix com `amix normalize=0`, `highpass f=80` na voz, ducking de 6–12 dB e `loudnorm` em duas passadas (−14 LUFS, −1,5 dBTP). Ouvir em mono e no alto-falante do celular | `ebur128` confirma o alvo |
| 11 | Crítica | `/watch-video` + contact sheet a 2 fps, tiras de 12 frames nas ações rápidas e teste do celular a ~360 px. Dar notas de 1 a 10 (gancho, legibilidade, movimento, variedade, composição, marca, sincronia), corrigir os 3 piores itens e repetir | todas as notas ≥ 8 |
| 12 | Entrega e skill | Render final com `--crf 16`; conferir a zona segura; derivar a versão de 60 s e outros formatos por funções de layout; registrar o que funcionou numa skill "rotina-promo" | MP4 + licenças + skill atualizada |

## Conclusão

A pesquisa muda o diagnóstico. O Rotina não sofre de falta de efeitos: ele já tem flash, grão, vinheta, blur e um 3D em CSS. O que falta é *sistema*. Os três sinais de amadorismo que aparecem em todas as fontes (molas de brinquedo, tudo se movendo junto, som sem relação com a imagem) nascem de decisões tomadas cena a cena, em vez de tokens, grade e constantes compartilhadas. Quando curvas, molas, batidas e tempos de palavra ficam num único lugar, o "nível After Effects" deixa de ser questão de gosto e vira algo que dá para verificar no código. Isso dá ao loop de crítica uma régua objetiva, que é exatamente o que os criadores de maior audiência usam para chegar à quinta ou sexta versão, em vez de entregar a primeira.

A segunda mudança é que o gargalo de qualidade deixou de ser computacional e passou a ser jurídico e de percepção. O 3D que parecia impossível sem GPU dependia de uma única configuração. Já voz, música e efeitos exigem licenças que digam "anúncio pago" e uma escuta em pt-BR que nenhum ranking substitui. O passo seguinte de maior valor é empacotar tudo numa skill própria do Rotina, com regras, tokens, receitas verticais, pipeline de voz com timestamps e mix. Assim, cada vídeo novo começa no nível do anterior, e não do zero.

## O que fica pendente para a próxima sessão

Esta lista consolida as seções "PENDENTE / NÃO PESQUISADO" das seis notas, em ordem de prioridade. Os projetos de teste citados (`r3f`, `r3f-latest`, `bench.sh` e as transcrições em `yt/txt`) estão no scratchpad desta sessão, em `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/`, e podem não sobreviver. Se tiverem sumido, recrie-os a partir dos comandos indicados. Nos comandos, `$BX` é o caminho do headless shell: `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

| Prioridade | Tema | O que falta | Próximo passo concreto |
|---|---|---|---|
| Alta | Voz | Confirmar se `/with-timestamps` aceita `eleven_v4` e se o sotaque sai brasileiro | Com uma chave Starter, chamar `GET /v1/models` e enviar a frase "O app Rotina organiza seu dia: Brasil, tia, PIX, deload." para `/with-timestamps` com `model_id=eleven_v4`; inspecionar `alignment` e ouvir se há sotaque europeu |
| Alta | Voz | Teste cego decisivo em pt-BR | Mesmo roteiro do Rotina em ElevenLabs v4 (voz brasileira), Gemini pt-BR (Cloud TTS), Azure Dragon HD Omni pt-BR e Cartesia; ouvir sem saber a origem |
| Alta | 3D | Custo do pós-processamento numa sequência | `cd r3f-latest && npx remotion render build Phone out/L3.mp4 --gl=swangle --browser-executable=$BX --concurrency=1 --frames=0-19 --props='{"post":true,"shadows":false,"screen":"png","msaa":4,"loop":"default"}'`; repetir com sombras e com MSAA 0 |
| Alta | 3D | Texturas por sequência de imagens e por `useOffthreadVideoTexture` na 4.0.534; render completo de 1800 frames; concorrência 2 | Rodar com `"screen":"seq"` e `"screen":"offthread"` e checar frames com `ffmpeg -i out/X.mp4 -vf "select='eq(n\,0)+eq(n\,19)',scale=360:-1,tile=2x1" -frames:v 1 t.jpg` |
| Alta | Remotion | Renderizar as novas transições e efeitos neste container sem GPU | Depois do upgrade, testar `blurSlide`, `zoomBlur`, `crossZoom`, `pushCut`, `@remotion/effects` e `HtmlInCanvasMotionBlur`; medir `CameraMotionBlur` com 1/5/10 amostras (`npx remotion benchmark`); ler remotion.dev/docs/gpu e /docs/performance |
| Alta | Música | Confirmação por escrito das licenças | Perguntar à Epidemic (Pro), à Artlist (Music & SFX Pro), à Uppbeat (termos após 2/09/2026) e à Envato (registro por variação de anúncio) sobre anúncio pago ou impulsionado na Meta, TikTok e validade após cancelamento |
| Alta | Mix | A cadeia ffmpeg proposta nunca foi executada | Rodá-la no ffmpeg 6.1 com a VO e a música atuais; conferir o JSON do loudnorm (−14 LUFS, TP ≤ −1,5 dBTP); medir Reels de referência com `ffmpeg -af ebur128` |
| Alta | Comunidade | ~39 transcrições baixadas e não analisadas | Ler primeiro 6_rCyryA6hg (anúncio de app de 30 s), rfplFJXmIjg, 0I5AWAuPFj0, 61u9wOT-Cds, OIAWkkSO4WY, mCjJKq2_JJU, 97Y5cz7H8SM, IpyzkbesRz4 e wSY1kHXSap0 |
| Média | Voz | Termos e preços restantes | ElevenLabs: custo em créditos do v4, se o v4 é GA ou Beta, termos das vozes da Voice Library em anúncios. Azure: preços S0, lista de vozes pt-BR, nome `pt-BR-*:DragonHDOmniLatestNeural`, se o SDK passa pelo proxy. Google: página de preços e cotas gratuitas. OpenAI: preço e qualidade em pt-BR |
| Média | Voz | Alinhamento forçado na CPU | Cronometrar o WhisperX num clipe de 60 s; checar a licença de `jonatasgrosman/wav2vec2-large-xlsr-53-portuguese`; avaliar o modelo pt-BR do MFA |
| Média | Voz | Outros fornecedores e modelos abertos | Ler idiomas e APIs de Qwen-Audio-3.1, Inworld TTS-2, Speechify Simba, MiniMax 2.8 (`subtitle_enable`), Hume Octave 2, Murf e Fish S2.1; modelos Piper pt_BR e Qwen3-TTS; testar na CPU o Kokoro (`pf_dora`, `pm_alex`) e o pacote pt-BR do Chatterbox |
| Média | Voz e jurídico | Base legal para clonagem e voz de IA em anúncio | Ler LGPD (dados biométricos e sensíveis), Código Civil art. 20, Constituição art. 5º, situação do PL 2338/2023, orientações da ANPD e do CONAR e a rotulagem de IA da Meta, em planalto.gov.br, camara.leg.br e gov.br/anpd |
| Média | Voz | Cadeia de pós-processamento específica para locução de anúncio | Validar EQ, compressão e de-esser da seção de mixagem num take real e comparar com a voz atual |
| Média | Música | Termos primários das IAs de música | Suno: termos de uso, preços e limites de download. Eleven Music: tabela de direitos por plano, stems via API e parâmetros do `composition_plan`. Lyria: indenização no Gemini API vs Vertex. Stable Audio 2.5: especificações e preço. Ainda não pesquisados: Riffusion/Producer.ai, Soundful, Loudly, APIs de Beatoven, Soundraw e Mubert, licença do AIVA |
| Média | Música | Fontes primárias da Meta e do TikTok | Ler a licença da Sound Collection (facebook.com/sound/collection), o artigo "Add music" do Ads Manager e as regras da Commercial Music Library do TikTok |
| Média | Remotion e áudio | Downbeats automáticos e o novo `<Audio>` | Testar madmom, BeatNet, all-in-one e aubio; ler remotion.dev/docs/media/audio e confirmar o callback de volume |
| Média | Ecossistema | Preços e acesso dos MCPs de IA | Créditos do Higgsfield para Seedance 2.5 em 1080p 9:16, 5–10 s (higgsfield.ai/pricing); ferramentas e preços do MCP do Kling; login OAuth de MCPs hospedados a partir do container; SSE do Replicate pelo proxy (`curl -N https://mcp.replicate.com/sse`) |
| Média | 3D | Blender headless | Eevee: `$B -b --factory-startup --python-expr "<engine BLENDER_EEVEE, 1080x1920, render>"`; se falhar, `apt-get install -y libegl1 libegl-mesa0` ou `xvfb-run -a`. Cycles na CPU com 32/64/128 amostras e OIDN. Ler o README do bpy-dev/blender-mcp; testar o Blender Lab MCP em background |
| Média | 3D | Ativos, licenças e alternativas | Licenças do Sketchfab e do Poly Pizza; packs de ícones 3D; formatos e licenças de Meshy, Tripo e Hunyuan3D; Spline dentro do Remotion; Rotato e Previewed; vídeo de IA para B-roll; docs do @react-three/postprocessing; limite de raio do RoundedBox; versão do Remotion que introduziu o `ManualFrameRenderer` (`npm pack` + `grep`) |
| Baixa | Motion | Fontes primárias de craft | Apple HIG Motion e presets do SwiftUI; página oficial de zonas seguras da Meta; página de boas práticas do TikTok; Jensema (1998); dicas da School of Motion, Ben Marriott e Jake in Motion; plugin Flow; padrões de transição do Material (container transform, shared axis); análise direta dos filmes de lançamento de Linear, Stripe, Arc, Notion e Raycast; APIs de `@remotion/lottie` e `@remotion/rive` |
| Baixa | Ecossistema | Ferramentas não pesquisadas | Editly, Cavalry, Jitter, Pika, MCPs oficiais de Seedance/BytePlus e Hunyuan3D, MCPs de Sketchfab e Poly Haven; atividade de Motion Canvas e Revideo; Motion AI Kit; LottieFiles e Rive; preço da Plainly; licença do remotion-dev/skills; avaliação de segurança no agentskillshub.top; plugins da comunidade (djclaude, easing-wizard, voice-bridge, voxflow, framecraft, videozero, future-video-studio) |
| Baixa | Comunidade | Transcrições não baixadas e páginas não abertas | Baixar PFHVxq1S6F0 (masterclass de 57 min) e as demais com o servidor bgutil de PO token + `player_client=mweb`, no máximo 3 workers; abrir Barty-Bart/motion-graphics, Motion OS, whatships.com, awesome-opus-5-5-videos, note.com/truenorthai e remotion.dev/prompts; pesquisar Reddit, remotion.dev/showcase e o Discord do Remotion |
| Baixa | Comunidade | Tutorial do @ssupernova.studio | Rechecar Instagram (com login), TikTok, YouTube e X nos próximos dias, ou pedir que você encaminhe o link se ele aparecer no seu feed |
| Baixa | Música | Dados de criativos brasileiros | Varrer a Meta Ad Library (Brasil) em busca de anúncios de apps de fitness, hábitos e finanças e anotar os estilos musicais |

### Atualização de 09/10/2026

- **Kit motion-video instalado no repositório.**
  - **O que foi instalado:** a skill `motion-video`, que o Claude Code carrega sozinho ao abrir o repositório, e o motor `motion-studio/`.
  - **O que traz:** nove regras de movimento que combinam com esta pesquisa, um iPhone e cards 3D prontos, sons sincronizados por frame e checagem automática de elementos parados.
  - **Falta:** rodar `bash motion-studio/tools/setup.sh` neste container e comparar o resultado com o projeto Remotion no mesmo roteiro.
  - **Detalhes:** `research_notes/Motion design 3D e voz IA/motion_video_kit_e_dicas.md`.
- **Dica do usuário: Google AI Studio.** Testar a voz Gemini TTS em pt-BR e a música Lyria pelo AI Studio, que é gratuito para testes. A API exige uma chave gratuita criada por você.
- **Rodada 2 interrompida pelo limite de uso.** Os testes medidos de 3D, as vozes locais (Kokoro, Piper e Chatterbox) com amostras e o alinhamento de palavras, e a análise das legendas restantes do YouTube ficaram parciais. Estão em `3d_round2.md`, `voice_round2.md` e `youtube_round2.md`, e devem ser retomados de onde pararam.
