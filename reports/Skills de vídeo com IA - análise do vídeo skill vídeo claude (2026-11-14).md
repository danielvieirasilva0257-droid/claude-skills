# Skills de vídeo com IA: análise do vídeo "skill vídeo claude" (14/11/2026)

**Fonte:** vídeo `skill vídeo claude.mp4`, da pasta do Drive do Daniel (7min36s). Assisti com a skill `watch` (96 quadros) e com transcrição local; o prompt e os números li direto na tela. O vídeo foi apagado depois da análise. As anotações brutas estão em `research_notes/Caça de skills 2026-11 (vídeo com IA)/notas-video-skill-video-claude.md`.

**Status (14/11/2026):** o Daniel aprovou e foram instaladas `hyperframes`, `hyperframes-comunidade`, `gsap`, `video-use`, `remotion-oficial`, `ffmpeg` e `watch` (em `skills/video/`). HeyGen e ElevenLabs ficaram como **plataformas** que se usam direto, e não como skills. O mapa de uso é o `skills/combos/combo-video-ia-completo/SKILL.md`. A skill própria de visão computacional foi proposta e aguarda aprovação.

---

## 1. O que o vídeo mostra, em resumo

O vídeo diz que um modelo Claude **criou e editou o vídeo inteiro com um único pedido**: roteiro, narração, animações, cenas em 3D, trilha, efeitos e cortes, sem ninguém abrir um programa de edição. A apresentadora é um **avatar da HeyGen** com **voz clonada no ElevenLabs**.

O caminho que ele ensina:
- o vídeo é escrito em código;
- um navegador invisível desenha quadro por quadro;
- o FFmpeg junta tudo num arquivo.

Ferramentas e técnicas que aparecem:

| Etapa | Ferramenta ou técnica | Selo "feito com" que aparece na cena |
|---|---|---|
| Animação | Motor próprio em Canvas 2D (419 linhas reaproveitadas de um vídeo anterior), keyframes e easing | `CANVAS 2D` (a maioria das cenas) |
| Bibliotecas citadas | Remotion, HyperFrames (HeyGen), GSAP, Three.js | (a mesma frase animada de 4 jeitos) |
| 3D | Cena 3D de verdade (câmera, luz, sombra) com o avatar dentro | `CANVAS 2D · cenas redesenhadas ao vivo` |
| Cortes | Transcrição com o tempo de cada palavra → cortes em cima das palavras → lista de cortes (EDL, "99 decisões") | `edl_narracao.json` |
| Visão computacional | Rosto localizado em cada quadro (nenhum texto passa na frente), recorte da pessoa (título atrás dela, sem tela verde), rastreamento (etiqueta grudada na prancha), OCR (destaque no lugar certo de um print) | `APPLE VISION · recorte de pessoa`, `RECORTE · texto atrás da pessoa` |
| Material | Banco de vídeos Pexels pela API, com ajuste de cor; prints e vídeos como objetos 3D | `VÍDEO REAL · PEXELS` |
| Som | Voz ElevenLabs + avatar HeyGen; efeitos sonoros criados a partir de uma descrição em texto (biblioteca de 40 sons); trilha sob medida para cada capítulo; ducking; volume final no padrão das plataformas | `ELEVENLABS + HEYGEN`, `ELEVENLABS · efeitos por descrição` |
| Revisão | O modelo assistiu ao próprio vídeo: fotos de cada cena, checagem de texto sobre o rosto, transcrição do áudio final comparada palavra por palavra com o roteiro, correção dos erros | `quadros reais deste vídeo`, `erro real, antes e depois` |

**Números reais mostrados:** 1 pedido, 3h48 até ficar pronto, 7.874 linhas de código, 89 arquivos, 91 cenas, 13.671 quadros, 312 deixas de som e 3.196 quadros conferidos.

---

## 2. As skills do GitHub: lista, explicação e análise

Clonei cada repositório em 14/11/2026 e li a pasta de cada skill. A explicação vem do próprio `SKILL.md`; a análise é minha, comparando com o que já temos (`remotion-video`, `motion-video`, `motion-video-director`, `blender-ia`, `voz-pt-br`, `trilha-e-mixagem`).

### Recomendo instalar

#### 1. HyperFrames (HeyGen): `heygen-com/hyperframes`
- **O que é (pela pasta):** vídeo feito com HTML, renderizado quadro a quadro; foi pensado para agentes de IA. Licença Apache-2.0. As skills:
  - `hyperframes`: a skill-mãe, com o contrato de render, o ciclo de trabalho e qual guia ler para cada tipo de vídeo (lançamento, explicativo, música, dados, vertical, 3D, personagem);
  - `hyperframes-cli`: criar, checar, prever e renderizar;
  - `hyperframes-registry`: cerca de 450 blocos prontos e editáveis (transições, títulos, legendas, gráficos, mapas, 3D, câmera);
  - `media-use`: buscar ou criar música, efeitos, imagens, voz, avatar, transcrição, recorte da pessoa e cor, com HeyGen ou com ferramentas locais grátis (voz Kokoro, transcrição local, remoção de fundo);
  - `remotion-to-hyperframes`: converte projetos Remotion;
  - `reverse-any-video`: refaz um vídeo de referência como projeto editável;
  - `style-sampling`: um episódio novo num estilo já provado (explicativo colagem, finanças, ciência, 3D).
- **Por que vale:** é a ferramenta citada no vídeo e cobre o que o nosso Remotion não cobre bem. Tem blocos prontos, revisão automática (`check`, `snapshot --review`), recorte de pessoa e transcrição locais, e "refazer um vídeo de referência".
- **Cuidados:**
  - manda uso (telemetria) por padrão: desligar com `HYPERFRAMES_NO_TELEMETRY=1` e não rodar o "beacon";
  - precisa de Node 22 (o container tem);
  - a parte paga (créditos HeyGen) é opcional.
- **Categoria:** `skills/video/hyperframes/`. Não instalaria a `figma` e a `slideshow`.

#### 2. video-use (Browser Use): `browser-use/video-use`
- **O que é:** editar um vídeo **gravado** conversando. Transcreve palavra por palavra, monta a lista de cortes (EDL), corta nos silêncios e nunca no meio de palavra, corrige cor, faz animações em paralelo (HyperFrames, Remotion, Manim ou PIL), queima legendas e **revisa o próprio resultado** em cada corte antes de mostrar (até 3 passadas). Traz também a skill `manim-video` (animações matemáticas no estilo 3Blue1Brown). Licença MIT, 31 mil estrelas.
- **Por que vale:** é exatamente a parte "editar gravação real" do vídeo, e hoje não temos nada para isso. As regras dela batem com as nossas: legenda por último, fade de 30 ms nos cortes, medir o volume com ebur128.
- **Cuidados:** a transcrição usa o Scribe, do ElevenLabs (pago). Dá para trocar pelo faster-whisper local que já usamos.
- **Categoria:** `skills/video/video-use/`.

#### 3. Skills oficiais do Remotion: `remotion-dev/skills`
- **O que é:** um roteador mais referências oficiais: criar vídeo, regras de markup, legendas, mapas, multimídia (cortar e recortar no navegador), recorte de fundo e "conteúdo atrás da pessoa", interatividade no Studio, render e atualização de versão.
- **Por que vale:** a nossa `remotion-video` continua sendo a principal (tem as regras do editor). A oficial vira referência de API, principalmente para legendas, render e recorte da pessoa.
- **Cuidados:**
  - está na versão 4.0.543 e nós usamos a 4.0.534: atualizar todos os `@remotion/*` juntos ou ler com cuidado;
  - o repositório não tem arquivo de licença (fica só como registro);
  - o Remotion é pago para empresas com mais de 3 pessoas (fato prático).
- **Categoria:** `skills/video/remotion-oficial/`.

#### 4. GSAP oficial: `greensock/gsap-skills`
- **O que é:** skills oficiais da biblioteca GSAP: `gsap-core` (to/from, easing, stagger), `gsap-timeline` (sequências e o parâmetro de posição), `gsap-utils`, `gsap-performance` e `gsap-plugins` (SplitText, CustomEase, Flip, SVG). Licença MIT.
- **Por que vale agora:** em outubro descartamos porque era para **interface** (lá usamos o Motion). Mas o HyperFrames **anima com GSAP**, e o vídeo diz que o GSAP "controla o tempo de cada movimento". Para vídeo, ela é a base do HyperFrames.
- **Categoria:** `skills/video/gsap/`. Ficam de fora a `gsap-react`, a `gsap-frameworks` e a `gsap-scrolltrigger`, que são de site.

#### 5. ffmpeg-skill: `kajisho5/ffmpeg-skill`
- **O que é:** 42 ferramentas locais de FFmpeg com contrato claro: cortar, juntar, reenquadrar (9:16), velocidade, legendas, sobreposição, tirar silêncio, sincronizar, volume (loudness), exportar por plataforma e **checar** o arquivo (`check.py --platform`). O `look.py` mostra quadros para revisão. Tem servidor MCP. Licença MIT, 5,5 mil estrelas.
- **Por que vale:** é a etapa final (exportar e conferir) que todo vídeo nosso precisa. O `PRIVACY.md` diz que não manda nada para fora e não pede chave.
- **Categoria:** `skills/video/ffmpeg/`.

#### 6. ElevenLabs oficial (só as de mídia): `elevenlabs/skills`
- **O que é:** skills oficiais da API do ElevenLabs. As úteis para vídeo:
  - `text-to-speech` (voz, 90+ idiomas, clone);
  - `sound-effects` (efeito a partir de descrição, com duração e loop);
  - `music` (trilha por texto ou por um plano de composição com seções);
  - `speech-to-text` (Scribe, tempo por palavra);
  - `voice-isolator` (limpar ruído);
  - `voice-changer`.

  Licença MIT.
- **Por que vale:** é o som do vídeo analisado (voz clonada, os 312 efeitos e a trilha com o tamanho de cada capítulo). Complementa a `voz-pt-br` (Gemini, Kokoro) e a `trilha-e-mixagem` (Lyria).
- **Cuidados:** precisa de chave e é pago. A chave nunca vai para o repositório. Ficam de fora `agents`, `realtime`, `speech-engine`, `dubbing`, `onboarding` e `setup-api-key`, que são de agente de voz e não de vídeo.
- **Categoria:** `skills/audio/elevenlabs/`.

### Opcionais (instalo se você quiser)

#### 7. HeyGen oficial (avatar): `heygen-com/skills`
- **O que é:**
  - `heygen-avatar`: cria um avatar fixo, com rosto e voz, por descrição ou foto;
  - `heygen-video`: vídeo com apresentador pela API v3;
  - `heygen-translate`: tradução com clone de voz e sincronia labial.

  Licença MIT.
- **Por que é opcional:** só vale se você quiser apresentador avatar, como a "Lyria" do vídeo. É pago e precisa de chave. A análise de uso pode ser desligada com `HEYGEN_NO_ANALYTICS`.
- **Categoria:** `skills/video/heygen-avatar/`.

#### 8. Skills da comunidade HyperFrames: `heygen-com/hyperframes-community-skills`
- **O que é:** 8 skills. As que interessam:
  - `camera-3d-captions`: legendas em 3D em volta de quem fala, com a câmera voando entre a pessoa e as palavras e **palavras de destaque escondidas atrás da pessoa**;
  - `vox-explainer`: explicativo de 60 a 90 s em colagem;
  - `p5-paint-animation`: animação com cara de feita à mão.

  Licença Apache-2.0.
- **Por que é opcional:** são estilos prontos. O `camera-3d-captions` é o efeito "título atrás de mim" do vídeo. As outras 5 (duo, x-posting-license, session-story, day-in-my-life, prod-by-claude) são de nicho; não instalaria.

#### 9. watch: `bradautomates/claude-video`
- **O que é:** a skill que usei para assistir aos dois vídeos (quadros + transcrição; com chave do Gemini, o Google assiste pelo link). Licença MIT.
- **Por que é opcional:** serve para a **etapa de revisão** ("o modelo assistiu ao próprio vídeo") e para estudar vídeos de referência. Hoje ela está só no container; guardá-la no repositório evita reinstalar.
- **Categoria:** `skills/video/watch/`.

### Não recomendo

- **`amalshehu/pexels-skill`:** busca só **fotos** (não vídeos), tem 29 linhas e nenhuma licença. É melhor um script nosso pequeno para vídeos do Pexels (a API é grátis com chave), ou usar o `media-use` do HyperFrames.
- **Rastreamento, recorte de pessoa e OCR:** não existe skill pública confiável (busquei em 14/11). Mas há caminhos:
  - **recorte da pessoa:** já vem no HyperFrames (`remove-background`) e no Remotion oficial (matting);
  - **rastreamento e OCR:** proponho, depois, uma skill nossa pequena, `video/visao-computacional`, com bibliotecas abertas (OpenCV para rastrear, MediaPipe para rosto e recorte, Tesseract para OCR). Ela também cobriria a regra do editor de **nunca pôr texto sobre o rosto**, conferindo quadro a quadro.

---

## 3. Dicas e insights do vídeo (para aplicar já)

1. **O pedido estruturado com etiquetas** funciona: objetivo em 3 passos (pesquisar → decidir → construir), apresentador, **público** ("leigo, sem pular nenhum conceito"), **técnicas como sugestão e não obrigação**, limite de duração, **gancho** escrito ("abra com uma versão muito mais forte de…") e uma meta ambiciosa. Vou transformar isso num modelo nosso de pedido de vídeo.
2. **Reaproveite o que já existe.** O vídeo partiu de um avatar, uma voz, as contas e **419 linhas do motor do vídeo anterior**. Para nós: cada projeto deixa um "motor" reaproveitável (como o do Rotina).
3. **Corte sempre em cima de uma palavra.** Com a transcrição por palavra, o corte e a entrada das animações caem no instante exato da fala.
4. **A visão computacional faz cumprir as regras do editor:** rosto localizado → nenhum texto na frente; pessoa recortada → título atrás dela, sem máscara no meio da tela. Isso bate com as suas 4 regras de composição.
5. **Som com propósito:** cada efeito nasce de uma descrição e fica ligado a algo visível; a trilha é composta com o tamanho de cada capítulo; ducking automático; volume final medido.
6. **Autorrevisão obrigatória antes de entregar:** foto de cada cena, checagem de texto sobre o rosto, **transcrição do áudio final comparada com o roteiro** e correção. É a etapa que quase ninguém faz.
7. **Retenção ensinando:** um contador "TERMOS 3/12" no canto mostra o progresso do que a pessoa aprendeu, e o fecho é "você aprendeu 12 termos". Os selos "feito com…" em cada cena servem de **prova** (é a "prova" do nosso mapa de arquitetura).
8. **A estrutura do vídeo segue o nosso mapa:**
   - gancho com afirmação e revelação ("este rosto é um avatar");
   - loop aberto ("no final, o prompt e os números reais");
   - blocos com troca de estímulo;
   - pagamento do loop;
   - limites ("a ideia e o gosto continuam humanos");
   - o que você pode fazer hoje;
   - CTA.
9. **O que continua humano:** ter a ideia e ter o gosto. O papel do Daniel é dirigir e aprovar.

---

## 4. Próximo passo (depois da aprovação)

1. Instalar as skills aprovadas em `skills/video/` e `skills/audio/`, cada uma com `SKILL.md` original intacto, `LICENSE`, `ORIGEM.md` e `APRENDIZADOS.md` (com as regras nossas: telemetria desligada, chaves fora do repositório, as 4 regras do editor).
2. Atualizar o `guia/HABILIDADES.txt`.
3. Criar o combo `skills/combos/combo-video-ia-completo/`: o mapa **da ideia ao vídeo pronto**, juntando as skills novas com as que já temos. Ele terá um cronograma por etapa, dizendo qual skill usar em cada uma e onde ficam as aprovações.
4. Criar o modelo de pedido estruturado (item 1 das dicas).
