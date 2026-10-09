---
name: remotion-video
description: Cria vídeos programáticos com Remotion (React renderizado quadro a quadro): promos de app, vídeos explicativos, motion graphics, legendas cinéticas, celular em 3D, narração e música. Use quando o usuário pedir para fazer, editar ou animar um vídeo, motion graphics, abertura/encerramento, vídeo explicativo, Reels, "vídeo com React/Remotion", ou ao trabalhar num projeto que tenha remotion no package.json.
---

# Vídeo com Remotion

O Remotion renderiza vídeos a partir de componentes React. Documentação completa: https://www.remotion.dev/docs/ (consulte sempre que tiver dúvida).
A referência original completa (o CLAUDE.md de Remotion do ThariqS) está em `references/remotion-claude-md-original.md`.
A pesquisa por trás dos números desta skill (out/2026, com fontes) está em `reports/Motion design 3D e voz IA.md` e em `research_notes/Motion design 3D e voz IA/` neste repositório.

## Regras de ouro

1. **Tudo é função do quadro.** Toda animação vem de `useCurrentFrame()`. Nunca use transições CSS, `setTimeout` ou `requestAnimationFrame`.
2. **Determinístico.** Nada de `Math.random()`; use `random('semente-fixa')` do `remotion`. Nada de buscar dados nem de `useEffect`/`useState` para o visual.
3. **Sem interatividade.** Nada de `onClick`, hover etc. Tudo entra como props (`defaultProps` na Composition).
4. Os quadros começam em 0. Dentro de uma `<Sequence>`, `useCurrentFrame()` recomeça do 0.
5. **Versão:** use o Remotion **4.0.534** (out/2026) ou mais novo, e mantenha o `remotion` e todos os pacotes `@remotion/*` na **mesma versão exata** (`npm install --save-exact`). A 4.0.250 não tem a maioria das transições e renderiza cenas de `@remotion/three` cerca de 20 vezes mais devagar.
6. **Skills oficiais:** num projeto novo, rode `npx remotion skills add` para instalar as skills do próprio Remotion (molas, transições, efeitos, 3D). O antigo MCP do Remotion está obsoleto.

## Esqueleto do projeto

O `src/Root.tsx` registra as composições. Padrões: id `MyComp`, 30 fps, 1920×1080 (Reels vertical: 1080×1920).

```tsx
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const Root: React.FC = () => (
	<Composition id="MyComp" component={MyComp} durationInFrames={120}
		width={1920} height={1080} fps={30} defaultProps={{}} />
);
```

Os `defaultProps` precisam ter o formato das props que o componente espera. Pegue fps, tamanho e duração com `useVideoConfig()`.

## Mídia

| Precisa de | Use | Observações |
|---|---|---|
| Vídeo | `<OffthreadVideo>` | `trimBefore`, `trimAfter` (em quadros), `volume` de 0 a 1 |
| Imagem | `<Img>` | |
| GIF animado | `<Gif>` do `@remotion/gif` | instale o pacote |
| Áudio | `<Audio>` | `trimBefore`, `trimAfter`, `volume` (número ou `(f) => número`) |

- `startFrom`/`endAt` ainda funcionam, mas estão obsoletos: foram renomeados para `trimBefore`/`trimAfter` (conferido nos tipos da 4.0.534).
- O pacote `@remotion/media` (mesma versão) traz componentes `<Audio>`/`<Video>` mais novos, que a documentação agora recomenda.
- Arquivos: URL remota, ou arquivo em `public/` via `staticFile('nome.ext')`.

## Layout e tempo

- **Camadas:** `<AbsoluteFill>` (o irmão que vem depois fica por cima).
- **Atrasar um elemento:** `<Sequence from={10} durationInFrames={20}>`. Um `from` negativo começa na hora e corta os N primeiros quadros.
- **Um depois do outro:** `<Series><Series.Sequence durationInFrames={20} offset={-8}>…`. O `offset` desloca o início (negativo = sobreposição); não existe `from`.
- **Com transições:** `TransitionSeries` do `@remotion/transitions`. A `TransitionSeries.Transition` precisa ficar **entre** duas `TransitionSeries.Sequence`, e não tem `offset`.

```tsx
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';

<TransitionSeries>
	<TransitionSeries.Sequence durationInFrames={60}><CenaA /></TransitionSeries.Sequence>
	<TransitionSeries.Transition timing={springTiming({config: {damping: 200}})} presentation={fade()} />
	<TransitionSeries.Sequence durationInFrames={60}><CenaB /></TransitionSeries.Sequence>
	<TransitionSeries.Transition timing={linearTiming({durationInFrames: 30})} presentation={wipe()} />
	<TransitionSeries.Sequence durationInFrames={60}><CenaC /></TransitionSeries.Sequence>
</TransitionSeries>
```

A transição sobrepõe as cenas vizinhas, então a duração total = soma das cenas − soma das durações das transições.

**Transições disponíveis na 4.0.534** (`@remotion/transitions/<nome>`, conferidas no pacote):
- blur-slide, book-flip, clock-wipe, cross-zoom, crosswarp
- dissolve, dreamy-zoom, fade, film-burn, flip
- iris, linear-blur, push-cut, ripple, slide
- swap, wipe, zoom-blur, zoom-in-out, none

A `TransitionSeries.Overlay` coloca um efeito, como um vazamento de luz, por cima de um corte.

Várias dessas transições, e o pacote `@remotion/effects` (cerca de 70 efeitos: brilho, aberração cromática, vinheta…), usam WebGL. Elas rodam na CPU com `--gl=swangle`, mas mais devagar, então teste uma antes de usar num vídeo de 60 s.

## Animação

```tsx
const frame = useCurrentFrame();
const {fps} = useVideoConfig();

// Mapeamento linear: sempre trave (clamp) os dois lados
const opacidade = interpolate(frame, [0, 30], [0, 1], {
	extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});

// Mola de UI premium: assenta em ~12 quadros com ~1,5% de passagem
const s = spring({fps, frame, config: {stiffness: 380, damping: 31}});
```

Para atrasar uma mola, use `frame: frame - quadrosDeAtraso`.

### Molas (razão de amortecimento ζ = damping / (2·√(stiffness·mass)))

| Uso | config | Sensação |
|---|---|---|
| **Evite como padrão**: o padrão do Remotion, `{stiffness: 100, damping: 10}` | ζ ≈ 0,5 | passa 16% do ponto e treme ~28 quadros: cara de "brinquedo" |
| Chegadas de UI premium (Material 3 Expressive) | `{stiffness: 380, damping: 31}` | ζ ≈ 0,8, ~12 quadros, ~1,5% de passagem |
| Cards e painéis macios | `{stiffness: 80, damping: 14}` | ζ ≈ 0,78, mais lento e sedoso |
| Pops pequenos (selos, checks) | `{stiffness: 200, damping: 15}` | ζ ≈ 0,53, quique visível |
| Sem nenhum quique | `{damping: 200}` | deslize suave |

### Curvas bezier

- O "Easy Ease" do After Effects (33% de influência) = `Easing.bezier(0.33, 0, 0.67, 1)`.
- **Chegadas:** use uma desaceleração de cauda longa, como `Easing.bezier(0.16, 1, 0.3, 1)` (expo out), durando quase até o próximo evento.
- **Curvas in-out:** só para movimentos de câmera curtos e decididos (`Easing.bezier(0.83, 0, 0.17, 1)`). Em chegadas elas "freiam" de forma visível.
- **Saídas:** continuam a direção da deriva e aceleram (ease-in, `Easing.bezier(0.7, 0, 0.84, 0)`), com blur.

## Regras de movimento que separam o "premium" do "simples"

Vêm da pesquisa e do kit `motion-video` deste repositório (`.claude/skills/motion-video`).

1. **Nada parado.**
   - Toda cena tem um empurrão lento de câmera (escala de 1,00 para 1,05–1,12).
   - Elementos que já chegaram continuam derivando: alguns px de posição, ±1° de rotação ou 3–7% de crescimento.
2. **Os eventos se sobrepõem.** A próxima animação começa 4–12 quadros antes de a anterior terminar.
3. **Intervalo de 2–4 quadros** entre elementos irmãos (letras, itens de lista, cards).
4. **Uma ideia por plano**, uma única cor de destaque e profundidade (camadas de paralaxe, sombras, blur nas camadas do fundo).
5. **As transições nascem de um elemento da cena:**
   - um círculo crescendo a partir de um botão;
   - um whip na direção do movimento;
   - um zoom atravessando a tela do celular.
   - Nada de fade genérico, a não ser que o estilo peça.
6. **Movimento rápido ganha motion blur.** Quadros parados não precisam.
7. **Proíba os padrões.**
   - Evite texto centralizado com tudo entrando em fade, e evite a mola padrão.
   - Escolha a fonte com intenção: os criadores pesquisados dizem que a fonte é o que mais "entrega" um vídeo genérico.

## Componentes de UI para vídeo

Para converter qualquer componente interativo em vídeo, tire os eventos e o estado, troque as transições por `interpolate`/`spring` sobre o quadro e passe todas as variáveis como props.

```tsx
// React normal: onClick + useState  →  Remotion: guiado pelo quadro
const BotaoAnimado = () => {
	const frame = useCurrentFrame();
	const escala = interpolate(frame, [0, 30], [1, 1.2], {extrapolateRight: 'clamp'});
	return <div style={{transform: `scale(${escala})`, background: 'blue', padding: '10px 20px', display: 'inline-block'}}>Clique aqui!</div>;
};
```

## Fluxo de trabalho (o processo vale mais que o prompt)

Os criadores pesquisados (out/2026) atribuem cerca de 10% do resultado ao prompt e 90% ao processo:

1. **Briefing numa mensagem só:** formato, duração, marca (cores, fonte), prints e arquivos reais, roteiro, música e um **vídeo de referência**.
2. **Transforme a referência num guia de estilo escrito e numa lista de planos.** Peça aprovação antes de escrever código.
3. **Áudio primeiro.**
   - Gere as falas da narração e meça a duração delas; cada cena começa e termina na própria fala.
   - Coloque os cortes numa grade de batidas: quadros por batida = 1800 / BPM a 30 fps, então 120 BPM = 15 quadros.
4. Faça um componente por cena e junte com `Series`/`TransitionSeries`.
5. **Storyboard em imagens.**
   - Renderize os quadros-chave com `npx remotion still … --frame=N --scale=0.5` e junte numa imagem com `ffmpeg … hstack`.
   - Revise as imagens e corrija os piores problemas, repetindo até ficarem boas. Só então faça o render completo.
6. Render: `npx remotion render <IdDaComposição> out/video.mp4`.
7. Salve nesta skill o que funcionou.

Projeto novo: `npx create-video@latest`. Pré-visualização: `npx remotion studio`.

## Legendas e zonas seguras do Reels (1080×1920)

Os números vêm de páginas de terceiros; a página oficial da Meta não foi conferida.

- **Zona segura de anúncios em Reels:** deixe o texto fora dos 14% de cima (~269 px), dos 35% de baixo (~672 px) e de 6% de cada lado (~65 px). Sobra uma caixa de texto de ~950×980 px.
- **Velocidade de leitura:** cerca de 2–3 palavras por segundo, no máximo 20 caracteres por segundo. Linhas na tela de 3–5 palavras.
- **Gancho:** a mensagem principal precisa estar na tela nos 3 primeiros segundos.
- **Tempo de cada palavra:**
  - Pegue do próprio gerador de voz (o `/with-timestamps` da ElevenLabs devolve início e fim de cada caractere) ou de um alinhamento forçado (`align()` do WhisperX, ou o Forced Alignment da ElevenLabs).
  - Converta para `Caption[]` do `@remotion/captions` e agrupe com `createTikTokStyleCaptions`.
  - Medido aqui, o WhisperX alinhado ao roteiro erra 17 ms na mediana.
- **Estimar pela posição dos caracteres (`wordAt`)** é só plano B: erra cerca de 0,2 s.

## Acabamento "de After Effects" (aprendido no vídeo do Rotina, veja `rotina-video/` neste repositório)

- **Função de animação:** guarde as curvas numa função `tween(quadro, intervalo, saída, curva)` que sempre trava os extremos.
- **Whip pan:** cerca de 10 quadros (5 antes + 5 depois do corte), com o blur no máximo bem no corte.
- **Motion blur:** `<CameraMotionBlur shutterAngle={180} samples={8–10}>` do `@remotion/motion-blur`.
  - Ele renderiza a cena uma vez por amostra, então 10 amostras ≈ 10 vezes o tempo de render.
  - A 4.0.534 também tem o `<HtmlInCanvasMotionBlur>`, mas ele precisa de um recurso experimental do Chrome. Fique com o `CameraMotionBlur` em renders sem tela, a não ser que teste antes.
  - Deixe fundos parados **fora** do blur: as amostras empilhadas sobre gradientes escuros criam faixas.
  - Coloque a granulação de filme por cima, fora do blur: um SVG `feTurbulence` com `seed={frame % 12}`, opacidade ~0,09 e `mix-blend-mode: overlay`.
  - Não faça números contarem quadro a quadro sob motion blur, porque os dígitos ficam fantasmagóricos. Troque o valor de uma vez e dê um "pop" de mola.
- **Animação de texto:** letras entrando uma a uma com translateY + `filter: blur()` + opacidade. A saída sobe com blur e fade.
- **Celular em CSS:** desenhe as telas com 390 pt de largura e encaixe-as na moldura do aparelho com `transform: scale()`. Anime o aparelho com rotateX/rotateY dentro de `perspective`, e dê um "afastamento" de escala durante os whips.
- **Telas lado a lado:** ponha as telas numa faixa e desloque a faixa nas transições. Comece a animação de cada tela alguns quadros antes de ela entrar, para um whip nunca revelar tela vazia.

## 3D de verdade (`@remotion/three`, React Three Fiber) sem placa de vídeo

Medido neste container (4 CPUs, sem GPU, out/2026):

- **Renderizador:** todo modo `--gl` acaba no SwiftShader (CPU). Use `--gl=swangle`; o WebGL2 funciona.
- **Velocidade:**
  - Na 4.0.534, um celular 3D renderiza a cerca de 0,7 s por quadro em 1080×1920 (`--concurrency=1`). Na 4.0.250 levava mais de 11 s.
  - 60 s de vídeo em 3D levam cerca de 20–23 min.
  - `--concurrency=2` não acelera.
- **Pós-processamento** (bloom, profundidade de campo, vinheta, tone mapping): funciona, mas sobe para cerca de 2,9 s por quadro (~3,8 vezes). Use só em planos-herói curtos.
  - O tone mapping AgX desbota a UI do app; nas cenas com a tela, escolha outro.
- **Quadro 0 em branco:** acontece às vezes. A correção é um `delayRender` no componente DOM mais um último filho dentro do `<ThreeCanvas>` que chama `advance()` e depois `continueRender` (o código está nas notas da pesquisa).
- **Telas do app:**
  - Pré-renderize cada tela como composição própria, numa sequência JPEG, e aplique no celular como textura. Isso dá sincronia exata.
  - A textura provisória precisa ter o mesmo tamanho da tela (1080×2340).
  - Os hooks de vídeo (`useOffthreadVideoTexture`, `useVideoTexture`) falharam e estão obsoletos.
  - A rota documentada (`@remotion/media` `<Video headless onVideoFrame>` + `advance()`) funciona com WebM VP9, porque o Chromium do Playwright não decodifica H.264.
- **Modelo do celular:** faça um **celular genérico procedural** (caixa arredondada). As regras da Apple desencorajam renderizações de produtos Apple em anúncios de terceiros.
- **Iluminação:** um HDRI de estúdio do Poly Haven (CC0, uso livre).
- **Quando usar:** planos-herói curtos (3–5 s), compostos sobre a linha do tempo 2D. O Remotion exporta vídeo com transparência (ProRes 4444 / WebM).
- **Blender:**
  - O Claude escreve scripts `bpy` e roda `blender -b -P script.py` sem interface; o Blender MCP precisa da interface gráfica.
  - O Eevee só roda com `xvfb-run` e não sai mais barato.
  - O Cycles na CPU leva ~20 s por quadro com 16 amostras, então um plano de 3–5 s leva 30–50 min. Use em no máximo 1–2 planos de produto.

## Vídeo explicativo de app com voz e música (veja `rotina-video/src/explainer`)

- **Roteiro primeiro.** Escreva uma fala por momento, gere cada fala separada, corte os silêncios (`ffmpeg silenceremove` + `areverse`) e meça a duração. Depois monte a linha do tempo com as durações reais.
- **Voz (a licença decide primeiro).**
  - O `edge-tts` (leitura em voz alta do Edge, gratuito) não tem termos que permitam uso comercial; use só em rascunhos.
  - **Para anúncios:**
    - ElevenLabs num plano pago (`eleven_v4`; o plano gratuito nunca é comercial);
    - a camada gratuita do Azure Speech (0,5 milhão de caracteres por mês, as mesmas vozes neurais);
    - Gemini TTS pelo Google AI Studio (precisa de uma chave gratuita).
  - **Grátis e local:** Kokoro (licença Apache), com as vozes `pm_alex`, `pm_santa` e `pf_dora`. Escreva os estrangeirismos como se falam ("Éksel", "ép", "dilôudi").
  - Não existe teste cego de vozes em pt-BR, então faça um A/B do roteiro real entre os fornecedores antes de escolher.
- **Música:**
  - Escolha um BPM em que a batida caia num número inteiro de quadros (120 BPM = 15 quadros).
  - Coloque as trocas de seção nos compassos, com uma subida até o "drop" da logo e um impacto em cada seção.
  - Para anúncio pago na Meta, a licença precisa citar anúncios pagos (ex.: Artlist Pro, Epidemic Pro). A música do Instagram não vale para anúncios.
  - Música por IA: ElevenLabs Music, Google Lyria.
- **Efeitos sonoros no quadro exato:**
  - O whoosh atinge o pico no quadro em que o movimento pousa; o impacto cai no quadro do contato.
  - Som adiantado é percebido antes do que som atrasado, então nunca adiante mais que ~1 quadro.
- **Mixe no ffmpeg, não no Remotion.**
  - Abaixe a música 6–12 dB sob a voz com `sidechaincompress`: ataque de 5–20 ms, release de 300–500 ms.
  - Use `amix` com `normalize=0`.
  - Termine com `loudnorm=I=-14:TP=-1.5`.
  - Toque o resultado com um único `<Audio>`.
- **Câmera:**
  - Escreva keyframes `kf(quadro, [[q, valor, curva?], ...])` para escala, rotação e posição, como os keyframes do AE.
  - Use um giro de 360° (celular com tampa traseira e `backfaceVisibility: hidden`) para trocar de seção, e empurrões laterais dentro da seção.
  - Dê zoom na área que está sendo narrada.
- **Deixe intuitivo:**
  - Mostre um toque com ondulação onde a narração sugere uma ação.
  - Use selos e cards que saltam para fora (`translateZ`) nos números importantes.
  - Legendas curtas, só com palavras-chave (não a transcrição inteira), com cores de destaque.

## Renderizar num container ou offline

- **Fontes:** coloque as fontes em `public/fonts` e carregue com `FontFace` + `staticFile` + `delayRender`. O `@remotion/google-fonts` falha atrás de um proxy que intercepta TLS.
- **Navegador:** use um Chromium já instalado: `--browser-executable=/caminho/do/headless_shell` (o `chromium_headless_shell` do Playwright). Para 3D, acrescente `--gl=swangle`.
- **Antes do render completo:** confira quadros-chave (`npx remotion still … --frame=N`) e junte numa imagem com `ffmpeg … hstack`.

## Reaproveitando outras skills

- **`motion-video`** (`.claude/skills/motion-video`, motor em `motion-studio/`): um motor de motion em canvas, sem Remotion.
  - Traz um iPhone realista, cards de UI em 3D, efeitos sonoros sintetizados e um verificador de elementos parados.
  - As regras de movimento dele valem aqui também.
  - Use-o nos estilos que ele já cobre, ou leve as ideias dele para o Remotion.
- **`button-animation` e `thumbnail-carousel`:** trazem ideias de UI e animação (molas, entrada com escala, miniaturas escalonadas). O código delas é React interativo, então leve os *valores de movimento* para `interpolate`/`spring` em vez de copiar os componentes.
- **`ui-ux-pro-max`:** ajuda a escolher paleta, tipografia e estilo do visual do vídeo.
