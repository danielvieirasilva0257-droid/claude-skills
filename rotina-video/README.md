# Rotina: vídeos do app (Remotion)

Duas composições, ambas verticais (1080×1920, 30 fps):

| ID | Duração | O que é |
|---|---|---|
| `RotinaExplainer` | 60 s | Vídeo explicativo com narração, trilha original, celular 3D e todas as abas |
| `Rotina` | 10 s | Teaser curto, sem áudio |

Os vídeos prontos estão em `rotina-explainer.mp4` e `rotina.mp4`.

## Roteiro do explicativo

| Tempo | Narração | Na tela |
|---|---|---|
| 0–4 s | "Controle da sua rotina... em planilhas de Excel, no celular?" | Celular em 3D com planilha bagunçada, que dá "glitch" e cai |
| 4–10 s | "Você tem seus treinos montados e sabe quanto faturou. Mas você realmente tem controle disso?" | Cards com ✓ e depois "CONTROLE?" tremendo |
| 10–12 s | "Com o app Rotina, você tem." | Drop: ícone e logo ROTINA |
| 12–21 s | Checklist de hábitos, métricas e evolução | Toques marcando e desmarcando, badge "12 dias", gráficos |
| 22–36 s | Treino diário e semanal, estilo da semana, carga, reps e séries | Giro de 360°, plano semanal, seleção força → hipertrofia → resistência → deload, registro de séries e gráfico |
| 36–50 s | Entradas, saídas, bancos, cartões, despesas fixas ou pontuais, cronograma e categorias | Giro de 360°, cartões saindo do celular, filtro de entradas e saídas, alternância fixa/pontual, gráfico de rosca |
| 50–60 s | "Treino, finanças e hábitos. Tudo em um só lugar. Rotina. Sua vida no controle." | Três celulares em leque, depois a logo final |

## Áudio

- **Voz:** Microsoft Edge neural TTS, voz `pt-BR-AntonioNeural` com velocidade +6%. Os arquivos ficam em `public/vo/NN.wav`, sem os silêncios das pontas. Para trocar por uma voz gravada, substitua os wavs mantendo os nomes.
- **Música:** original, sintetizada por `audio/make_music.py` a 120 BPM: intro tensa, riser, drop em 10 s, e impactos em 22, 36, 50 e 58 s.
- **Mixagem:** `bash audio/mix.sh audio/music.wav` gera `public/soundtrack.wav`. A música abaixa sob a voz (sidechain) e o volume final é normalizado para −14 LUFS.

Se mudar o horário de uma fala, ajuste em dois lugares: `STARTS` em `audio/mix.sh` e `VO` em `src/explainer/timeline.ts`. As legendas e os toques usam `wordAt()` para cair na palavra falada.

## Técnicas

- **Keyframes no estilo After Effects:** `kf()` em `timeline.ts`, com easy ease por segmento. Toda a câmera e o celular estão em `mainPose()` (`src/explainer/Explainer.tsx`).
- **Celular 3D:** frente e verso (`Rig.tsx`) para giros de 360°. Os badges e cartões "saltam" do celular com `translateZ`.
- **Acabamento:**
  - Desfoque de movimento com `CameraMotionBlur` (8 amostras).
  - Legendas palavra a palavra com blur.
  - Toques visíveis com ripple.
  - Flash branco nos impactos, granulação e vinheta.

## Comandos

```bash
npm install
npm run studio                       # pré-visualizar
npm run render:explainer             # out/rotina-explainer.mp4
npm run render                       # teaser de 10 s
```
