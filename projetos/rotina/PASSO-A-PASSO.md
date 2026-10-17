# Projeto Rotina: vídeos do app (passo a passo)

Este arquivo guarda só o que foi feito, como foi feito e onde estão as habilidades. Ele não tem cópia de skills nem o código.

## Onde está cada coisa

- **Código do projeto** (Remotion, telas, áudio e vídeos prontos): branch `rotina-video` deste repositório, pasta `rotina-video/`.
  https://github.com/danielvieirasilva0257-droid/claude-skills/tree/rotina-video/rotina-video
  - Para trabalhar nele: `git fetch origin rotina-video && git checkout rotina-video`, depois `cd rotina-video && npm install`.
- **O app** (fonte das telas): artifact "Rotina" em https://claude.ai/artifact/FsKaH7SRjcPc4wRLXSJcFE
  - Abas: Hábitos · Treinos (Treino, Planejar, Progresso, Cardio) · Financeiro (Visão, Transações, Cartões, Rendas, Investimentos, Relatórios) · Ajustes.
  - Visual: fundo `#080808`, vermelho `#CC0000` / `#FF5A5A`, fontes Barlow e Barlow Condensed.

## Habilidades usadas (abra só a que precisar)

| Para quê | Habilidade | Caminho |
|---|---|---|
| Passo a passo completo do tipo de vídeo deste projeto | combo-video-explicativo | `skills/combos/combo-video-explicativo/SKILL.md` |
| Roteiro da narração (copy que convence, sem cara de IA) | combo-copy-humanizada | `skills/combos/combo-copy-humanizada/SKILL.md` |
| Vídeo em Remotion, regras de motion, 3D | remotion-video | `skills/video/remotion-video/SKILL.md` (+ `APRENDIZADOS.md`) |
| Narração pt-BR e legendas sincronizadas | voz-pt-br | `skills/audio/voz-pt-br/SKILL.md` (+ `APRENDIZADOS.md`) |
| Música, efeitos e mixagem | trilha-e-mixagem | `skills/audio/trilha-e-mixagem/SKILL.md` (+ `APRENDIZADOS.md`) |
| Estilo premium em canvas (alternativa ao Remotion) | motion-video | `skills/video/motion-video/.claude/skills/motion-video/SKILL.md` |
| Animações de botões e de UI nas telas | button-animation | `skills/design/button-animation/SKILL.md` |
| Paleta, fontes e estilo | ui-ux-pro-max | `skills/design/ui-ux-pro-max/SKILL.md` |
| Celular 3D no Blender (cena, luz, render, direção de animação) | blender-ia | `skills/video/blender-ia/SKILL.md` (+ `references/direcao-animacao.md`) |
| Método de animação (curvas, molas, coreografia) | motion-oficial | `skills/design/motion-oficial/SKILL.md` |
| Visual premium (trava da referência, curvas "premium com peso") | estilos-premium | `skills/design/estilos-premium/SKILL.md` |
| Revisão de animação (checklist Block/Approve) | review-animations | `skills/design/review-animations/SKILL.md` |
| v3: o que cada uma das 39 skills faz no vídeo | mapa | `research_notes/Rotina v3 2026-10/MAPA-SKILLS.md` |
| v3: skills e combos usados, propostas novas | relatório | `reports/Vídeo Rotina v3, skills e combos usados (2026-10-12).md` |
| Pesquisa completa (o que funciona, números, pendências) | relatório | `reports/Motion design 3D e voz IA.md` |
| Voz Gemini (como chamar a API) | notas | `research_notes/Motion design 3D e voz IA/gemini_tts_teste.md` |
| Vozes locais e legendas sincronizadas | notas | `research_notes/Motion design 3D e voz IA/voice_round2.md` |
| 3D sem GPU (tempos e correções) | notas | `research_notes/Motion design 3D e voz IA/3d_round2.md` |

## O que já foi feito

1. **Teaser de 10 s** (composição `Rotina`, 1080×1920, sem áudio).
   - Logo, 3 telas (Hábitos, Treinos, Financeiro) num celular em CSS 3D e giro rápido de câmera entre as telas.
   - Desfoque de movimento com `CameraMotionBlur`, granulação e vinheta.
   - Saída: `rotina-video/rotina.mp4`.
2. **Explicativo de 60 s** (composição `RotinaExplainer`, 1080×1920, com voz e música).
   - **Roteiro em 13 falas.** Cada fala foi gerada separada com edge-tts (`pt-BR-AntonioNeural`), com o silêncio cortado e a duração medida: `public/vo/NN.wav`.
   - **Linha do tempo montada pelas durações reais:** `src/explainer/timeline.ts`, com `VO`, `wordAt()` e keyframes `kf()`.
   - **Trilha original de 120 BPM**, feita em Python/numpy (`audio/make_music.py`): intro tensa, drop na logo aos 10 s, impactos em 22, 36 e 50 s.
   - **Mixagem com ffmpeg** (`audio/mix.sh`): música abaixando sob a voz, depois −14 LUFS. Resultado: `public/soundtrack.wav`.
   - **Telas recriadas em React:** `src/explainer/screens/`, com planilha, hábitos, métricas, plano semanal, estilos de treino, séries, financeiro, transações e despesas.
   - **Movimento:** celular 3D com frente e verso (giro de 360° entre seções), zoom no que é narrado, toques com ondulação, selos e cartões saltando em 3D, e legendas palavra por palavra.
   - Saída: `rotina-video/rotina-explainer.mp4`.
3. **Remotion atualizado** de 4.0.250 para **4.0.534**. Testado: tipos OK e quadros iguais aos de antes.
4. **Promo v2 de 30 s** (composição `RotinaV2`, 1080×1920, 900 quadros, visual novo do zero). Saída: `rotina-video/rotina-v2.mp4`.
   - **Roteiro:** versão 2 aprovada (combo `combo-copy-humanizada`), 13 falas, com o fecho "Baixe o Rotina agora. Link na bio.". Texto em `audio/v2/falas-v2.txt`.
   - **Voz:** Gemini `gemini-3.8-flash-tts`, voz **Leda**, o roteiro inteiro num pedido só (52 s em velocidade normal).
     - Acelerada **1,6x** com `atempo` (a 1,5x a fala sozinha passava de 31 s). O `atempo` manteve 97% de acerto na transcrição; o `rubberband` caiu para 93–94%.
     - Pausas apertadas por código (`audio/v2/compose_vo.py`): 0,15–0,26 s entre falas. A voz termina aos 29,3 s.
     - Palavras alinhadas com WhisperX na faixa final: `src/v2/voz.json` (tempo de cada palavra) manda em todo o vídeo.
   - **Trilha original** em código (`audio/v2/trilha_v2.py`, numpy + pedalboard), 120 BPM, travada na grade do vídeo: batidas nos quadros 10 + 15k, virada no quadro 160 ("Com o app Rotina"), seções em 340, 580 e 790, pausa em 820–850 e golpe final em 880. O Lyria não foi usado porque a cota grátis dele é zero.
   - **Efeitos sonoros:** 117 efeitos (`src/v2/sons.ts`), cada um preso a uma palavra ou movimento, sintetizados e mixados por `audio/v2/mixar_v2.py`.
     - Música e efeitos abaixam sob a voz (sidechain). Resultado: −13,9 LUFS e a voz de 12 a 21 dB acima do fundo em todas as falas.
   - **Visual "papel e tinta":** fundo papel claro, tinta preta e o vermelho do app. Fontes Anton, Instrument Serif (itálico) e Inter Tight, todas de licença livre (OFL), em `public/fonts/v2`.
     - **Gancho:** planilha frenética; as células viram a manchete; a planilha é espremida num celular; tudo desmorona em "sob controle?".
     - **Revelação:** o ponto vermelho do "?" abre o vermelho com a marca nova (laço + check) e "você tem.".
     - **Celular 3D de verdade** (React Three Fiber): sai da marca girando. As telas do app aparecem nele, sincronizadas palavra por palavra.
     - **Seções:** Hábitos (papel), Treino (tinta preta, giro rápido do celular) e Financeiro (papel, celular capotando). Cartões saem da tela do celular e as palavras-chave entram no tempo da fala.
     - **Fechamento:** o celular voa para dentro da tela e cai no cartão vermelho final com o botão "BAIXE AGORA" e "LINK NA BIO".
   - **Como foi montado** (camadas, cada uma renderizada à parte):
     1. `V2Tela`: as telas do app em 1080×2340, como sequência JPEG (`public/v2/tela`, cerca de 1,5 min).
     2. `V2Celular`: o celular 3D com fundo transparente, como sequência PNG (`public/v2/celular`, cerca de 1 s por quadro, 11 min).
     3. `RotinaV2`: o 2D por cima e por baixo, mais o áudio final (render completo em cerca de 3 min).
   - O `src/v2/rig.ts` dá a posição do celular em cada quadro, e o 3D e o 2D usam a mesma conta. Assim os cartões saem exatamente da tela do celular.
   - **Conferido:** transcrição automática do áudio final com 97,8% de acerto, e 48 quadros revisados num rascunho em meia resolução antes do render final.
5. **v2.1 (10/10/2026): correções pedidas pelo usuário, que é editor de motion.** Saída: `rotina-video/rotina-v2.1.mp4`.
   - **As 4 regras dele** (detalhes em `skills/video/remotion-video/APRENDIZADOS.md`, adendo de 10/10/2026):
     1. nada de texto sobre texto, nem logo sobre texto;
     2. nenhum recorte (máscara) cortando a animação no meio da tela;
     3. o celular fica por cima do texto, e o texto fica entre o fundo e o celular;
     4. o texto entra de fora do quadro ou de trás do celular.
   - **O que mudou no código** (`src/v2`):
     - `parts.tsx` ganhou `Entra` (da borda para dentro), `Atras` (sai de trás do celular) e `PalavraDividida` (metades do título vindo das duas bordas, sem se cruzar). O antigo `Slam`, revelação por máscara, saiu.
     - Todos os textos e cartões ficam abaixo da camada do celular e param em áreas livres.
     - **Gancho:** em vez de recortar a planilha até o celular, a câmera se afasta. A planilha com os adesivos já era a tela do celular, e a moldura entra pelas bordas do quadro.
     - "TUDO SOB CONTROLE?" sai pela esquerda quando o ponto do "?" vira o fundo vermelho.
     - **Fechamento:** "um app só." sobe de trás do celular.
     - Os efeitos sonoros foram movidos para os quadros de pouso das novas entradas. A voz ficou de 12,7 a 21,5 dB acima do fundo.
   - **Camada 3D:** só os quadros afetados foram renderizados de novo (786–846 pela nova pose final e 474–567 pelo atraso do movimento para Séries).
   - **Revisão:** primeiro com o celular em silhueta, depois dois rascunhos com o 3D. O segundo rascunho ainda achou 5 falhas, todas corrigidas antes do render final:
     - o recorte no gancho;
     - "TUDO SOB CONTROLE?" sumindo de repente;
     - o calendário entrando sobre o título;
     - o DELOAD coberto pelo celular antes de ser lido;
     - um chip que ficava só 3 quadros na tela.

6. **Promo v3 de 30 s, todo o 3D no Blender** (composição `RotinaV3`, 1080×1920, 900 quadros, 12/10/2026). Saída: `rotina-video/rotina-v3.mp4`.
   - **Pedido do usuário:** um agente faz o roteiro com a copy e passa para o humanizador; depois voz e animações; usar todas as skills; todo o 3D pelo Blender e montado no Remotion; reaproveitar pouco; **o celular sempre reto ou inclinado para cima**.
   - **Mapa das 39 skills** (um agente leu todas): `research_notes/Rotina v3 2026-10/MAPA-SKILLS.md`. Briefing: `research_notes/Rotina v3 2026-10/BRIEFING.md`.
   - **Roteiro** (agente, combo `combo-copy-humanizada`): ângulo "Segunda eu começo", 13 falas, 91 palavras. Arquivos em `research_notes/Rotina v3 2026-10/roteiro/` e `audio/v3/falas-v3.txt`.
   - **Voz:** Gemini, voz Leda, um pedido só (41 s a 1,0x), `atempo` 1,1x, pausas apertadas, 28,3 s. WhisperX alinhou cada palavra: `src/v3/voz.json` manda em todos os tempos.
   - **Visual "palco escuro":** fundo `#080808` com halo que segue o celular, texto `#F5F5F7`, vermelho só na palavra-chave (`#FF5A5A`), Barlow Condensed 600 nos títulos. Grão e vinheta.
   - **Celular (Blender, `premium.py` + `blender/v3_pose.py`):**
     - a coreografia é escrita em código no Remotion (`src/v3/rig.ts`) e exportada para `blender/poses-v3.json`; o exportador **para com erro** se algum quadro ficar inclinado para baixo;
     - a câmera é a mesma nos dois lados (0,62 m, 24°), conferida com 0 px de diferença: os textos saem exatamente de trás do celular;
     - as telas do app (`V3Tela`, 1080×2309) viram a textura da tela no Blender;
     - `--borda` renderiza só a região do celular em cada quadro: de 18 para ~9 s por quadro (Cycles, 8 amostras, motion blur, 4 CPUs).
   - **História na tela do celular:**
     - gancho: tela de bloqueio ("segunda-feira, 06:30"); em "quarta" a data e a hora rolam e caem 3 notificações de 3 apps diferentes (Dieta, Academia, Dinheiro);
     - os 3 selos saem de trás do celular, viram ícones de app, se espalham e fogem pelas bordas em "quarta";
     - revelação em "junta": os ícones voltam para trás do celular, a tela liga em vermelho com a marca e o celular gira (o único plano-herói);
     - Hábitos (4 toques, foguinho +1), Métricas (a quarta vazada, "FUROU"), Planejar (Seg · Peito, Ter · Costas), Séries ("Salvar séries → Salvando… → ✓ Séries salvas", gráfico desenhando), Visão do mês (salário entra, PIX sai, o saldo acompanha), Despesas (seletor "Fixa | Pontual" com mola), volta para Hábitos, "SEGUNDA" riscada, "LINK NA BIO" que afunda.
   - **Trilha original de 100 BPM** (`audio/v3/trilha_v3.py`, adaptada da `trilha-e-mixagem`): virada no quadro 250 ("junta"), seções em 430 e 574, pausa em 772, golpe final em 862.
   - **Efeitos:** 96 efeitos em `src/v3/sons.ts`, nos mesmos quadros da animação (swish 1 quadro antes de cada entrada, impacto no pouso, "plim" nas notificações, toques do app).
   - **Mixagem** (`mixar_com_efeitos.py`): o vídeo final mede −14,0 LUFS e −1,6 dBTP; a voz fica no mínimo 12,8 dB acima do fundo em todas as falas (mediana 17,1 dB).
   - **Revisão** (checklist da `review-animations` adaptado + as 4 regras + a regra do celular):
     1. **Antes do Blender:** 5 folhas com o celular em **silhueta** (prop `silhueta`), a cada 6 quadros. Nenhum texto sobre texto; cartões e selos aumentados.
     2. **Durante o Blender:** rascunho em meia resolução de cada terço pronto (0–299, 300–599, 600–899), com folhas a cada 5 quadros. Achados e corrigidos:
        - o celular apagado no gancho era um retângulo preto: virou tela de bloqueio (o Blender foi reiniciado, perda de ~10 min);
        - a troca de data da tela de bloqueio usava recorte (regra 2): virou cruzamento sem recorte;
        - o "R" de ROTINA aparecia pela esquerda do celular antes de sair de trás dele: o título agora nasce centrado no celular e 20% menor;
        - a metade direita ficava vazia em "Cada dia cumprido": entrou "CUMPRIDO" pela borda direita;
        - o Remotion e o Blender discordavam sobre os quadros sem celular (0–5 contra 0–4): limite alinhado.
     3. **Conferências finais:** −14,0 LUFS; transcrição do áudio final com 95,6% de acerto (a voz sozinha deu 93,4%, então a trilha não cobre a fala; "anotou peso" saiu colado); tremido do reflexo nos quadros parados de 0,4/255 em média (invisível).
   - **Tempo de render:** Blender 2 h 39 min (895 quadros, ~10,7 s por quadro com 4 CPUs, dividindo a máquina com os rascunhos); vídeo final no Remotion 4 min 22 s.

7. **Promo v4 de 30 s: o celular do Blender do v3 com o visual do v2** (composição `RotinaV4`, 13/10/2026). Saída: `rotina-video/rotina-v4.mp4`.
   - **Pedido do usuário:** o v3 ficou "simples demais". O v2.1 estava muito melhor e usava menos skills. Manter o celular do Blender do jeito que foi feito, mas voltar à dinâmica de fontes, cores, fundo e animação do v2.
   - **Comparação v2.1 × v3** (folhas a cada 15 quadros):
     - o v2.1 muda de fundo por seção (papel com grade → vermelho → tinta com brilho vermelho → papel → vermelho);
     - usa Anton gigante ocupando a largura, com Instrument Serif itálico de acento;
     - tira peças do app do celular em tamanho grande (gráfico da semana, faixa de dias, cartões, seletor, gráfico cruzando o quadro);
     - o v3 tinha um fundo escuro só, títulos pequenos no topo e pílulas cinzas.
   - **Reaproveitado:**
     - do v3: voz, trilha e as poses do celular (os 895 PNG do Blender);
     - do v2: o tema (`src/v2/theme.ts`: cores, fontes e curvas), `Entra`, `PalavraDividida`, `Pill`, `UiCard`, grade, granulação e vinheta.
   - **Novo** (`src/v4/`):
     - fundos por seção, todos formas sólidas: o vermelho nasce de trás do celular na virada da trilha ("junta"), o papel volta a partir do centro do celular, a tinta varre da esquerda quando o celular vai para a direita e o papel varre da direita quando ele volta;
     - `Atras` ligado ao celular do Blender;
     - sombra 2D do celular (polígono do corpo projetado, desfocado), para ele não parecer colado no papel.
   - **Abertura clara do app** (`V4Tela`): a tela vermelha sumia no fundo vermelho. Só 136 quadros do Blender foram refeitos (254–290 e 801–899, ~29 min dividindo a máquina com os rascunhos); o resto lê `public/v3/celular`.
   - **Seções:**
     1. gancho: SEGUNDA dividido + "eu começo." em serifa vermelha; adesivos DIETA, ACADEMIA e DINHEIRO pela borda viram 3 apps coloridos com notificação; DIFERENTE; QUARTA em vermelho + "você já perdeu a conta."; os apps caem para fora do quadro;
     2. revelação: os apps voltam da borda de baixo para trás do celular; ROTINA sobe de trás dele; "no mesmo lugar.";
     3. HÁBITOS: chip CUMPRIDO, cartão da sequência 11 → 12 com +1, gráfico ESTA SEMANA com a quarta marcada, FUROU;
     4. TREINO (tinta): faixa de dias com SEG PEITO e TER COSTAS, cartões 82,5 kg e 10 repetições, gráfico grande cruzando o quadro (área por polígono, sem máscara), +19%;
     5. FINANCEIRO: entrada R$ 4.800, PIX R$ 1.200, saldo do mês contando até R$ 4.240, seletor FIXA|PONTUAL com "de um lado" e "do outro";
     6. "nem precisa esperar" + SEGUNDA riscada;
     7. CTA (vermelho): BAIXE AGORA desce do topo e afunda no "agora"; LINK NA BIO sai de trás do celular.
   - **Áudio:** 127 efeitos (`src/v4/sons.ts`), música −9 dB. Vídeo final: −14,0 LUFS e −1,6 dBTP; a voz fica pelo menos 13,2 dB acima do fundo (mediana 15,4 dB). A transcrição deu 95,6%.
   - **Revisão:** 11 folhas (a cada 6 quadros) do rascunho e 5 do final. Corrigido:
     - os 10 primeiros quadros vazios;
     - os adesivos virando quadrados vazios antes do ícone;
     - a vinheta mudando de uma vez na troca de fundo;
     - os textos do fechamento cruzando o botão do CTA.

8. **Promo v5 de 22 s no estilo de um vídeo-modelo** (composição `RotinaV5`, 1920×1080, 672 quadros, 17/10/2026). Saída: `rotina-video/rotina-v5.mp4`.
   - **Pedido do usuário:** "faz igual, nesse estilo", com um vídeo-modelo (promo de app para motorista, 16:9, 26,7 s, voz feminina). Depois pediu:
     - papel de parede do celular em gradiente;
     - a tipografia, os ícones e as cores do próprio app, como no v2.1.
   - **O que o modelo faz:**
     - fundo quase preto com duas manchas de luz desfocadas;
     - frases montadas palavra por palavra no centro, com um chip de interface no meio e a palavra de acento colorida;
     - lista que rola por seções, com um número no topo que muda a cada seção;
     - cartão-resumo de vidro; cartão que vira o ícone e depois a marca;
     - formulário do app com a câmera passeando e borrão de movimento; resultado contando;
     - frase curta, botão em pílula com cursor clicando, marca no fim.
   - **Adaptado ao Rotina:**
     - manchas vermelha e âmbar (no modelo, verde e laranja);
     - Barlow e Barlow Condensed em caixa alta; ícones lucide do app;
     - a cor de cada categoria: fixas em roxo, cartão em rosa, pontuais em azul, investimentos em verde.
   - **Roteiro (45 palavras):** "Você sabe quanto ganha por mês, mas sabe quanto sobra? / Conta fixa, cartão, gasto pontual, investimento. / Tudo isso sai do mesmo salário. / No Rotina, você anota o que entra e o que sai, e vê quanto sobra no mês. / Treino e hábitos também. / Baixe agora."
     - Voz Leda a 1,0x (o ritmo do modelo), pausas de 0,5 s entre as falas. A voz termina em 17,8 s.
   - **Abertura no Blender** (`src/v5/intro.ts`, quadros 0–72):
     - o celular chega girando e pousa com a tela para cima; a câmera avança até a notificação do salário;
     - a notificação salta para fora em 2D. É o mesmo componente da tela, preso à projeção da tela no quadro em que salta, e cresce cobrindo a original;
     - `blender/v3_pose.py` agora lê `w` e `h` do `poses.json` (renderiza em 16:9). O v3 e o v4 não mudam.
   - **Arquivos** (`rotina-video/src/v5/`):
     - `theme`, `pecas` e `blocos` (peças reaproveitáveis);
     - `Tela5`, `camera`, `intro` e `exportar_poses` (abertura no Blender);
     - `tempo5`, `Cenas5`, `Video5` e `sons` (o vídeo);
     - em `audio/v5/`: o roteiro, a voz, `trilha_v5.py` e `sons.json`.
   - **Áudio:**
     - trilha em código a 100 BPM na grade da voz: intro mais baixa, virada em "No Rotina", silêncio sob "Baixe" e um clique em "agora";
     - 85 efeitos, poucos e baixos, como no modelo.
     - Final: −14,0 LUFS, pico −2,5 dBFS; a voz fica no mínimo 13,3 dB acima do fundo (mediana 20,0 dB). Transcrição do áudio final: 100%.
   - **Revisão:** 4 folhas do rascunho e 1 do final. Corrigido:
     - a notificação subia por cima do relógio. Agora cresce no lugar, cobrindo a original, com fundo sólido;
     - o cartão-resumo aparecia atrás do retângulo que encolhia até virar o ícone;
     - a câmera do formulário entrava fora do ponto em foco;
     - quadros vazios antes de "Treino".
   - **Avisado ao usuário:**
     - o modelo revela as palavras no lugar, no meio do quadro, e a regra 4 pede borda ou trás do celular. Ficou igual ao modelo; listas, cartões e o botão entram pelas bordas;
     - 16:9 como o modelo. Uma versão 9:16 para Reels pode reaproveitar as peças;
     - a notificação é de um banco genérico, para não afirmar que o Rotina tem widget;
     - sem "é grátis", porque o preço não foi confirmado.
   - **Tempo de render:** Blender ~13 min (73 quadros, 10 a 12 s cada, com uma retomada depois de um reinício). Rascunho em meia resolução: 58 s. Final: 1 min 46 s.

## Comandos (dentro de `rotina-video/`)

```bash
npm install
npx remotion studio                                   # pré-visualizar
npx remotion render src/index.ts RotinaExplainer out/rotina-explainer.mp4 --codec=h264 --crf=17 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
bash audio/mix.sh audio/music.wav                     # refazer a mixagem (gere a música antes com make_music.py)
```

**Promo v2 (30 s).** Rode dentro de `rotina-video/`. Use o mesmo `--browser-executable` acima, aqui abreviado como `$BR`. As pastas `public/v2/tela` e `public/v2/celular` não vão para o Git: gere de novo com:

```bash
npx remotion render src/index.ts V2Tela public/v2/tela --sequence --image-format=jpeg --jpeg-quality=90 --frames=182-850 --browser-executable=$BR
npx remotion render src/index.ts V2Celular public/v2/celular --sequence --image-format=png --frames=182-846 --concurrency=1 --gl=swangle --browser-executable=$BR
npx esbuild audio/v2/exportar_sons.ts --bundle --platform=node --outfile=out/exportar_sons.js && node out/exportar_sons.js > audio/v2/sons.json
python -I audio/v2/mixar_v2.py                          # efeitos + voz + trilha -> public/v2/rotina-v2-mix.wav
npx remotion render src/index.ts RotinaV2 out/v2-rascunho.mp4 --scale=0.5 --browser-executable=$BR      # rascunho (~1 min)
npx remotion render src/index.ts RotinaV2 out/rotina-v2.mp4 --crf=17 --audio-codec=aac --audio-bitrate=256k --browser-executable=$BR
```

- **Python:** venv com numpy, scipy, soundfile e pedalboard. Para regenerar a trilha: `python -I audio/v2/trilha_v2.py saida.wav audio/v2/trilha-v2_eventos.json`.
- **Se mudar o `rig.ts`:** renderize de novo só os quadros afetados do `V2Celular` (`--frames=a-b` numa pasta temporária, depois copie para `public/v2/celular`).

**Promo v3 (30 s, Blender).** Rode dentro de `rotina-video/`. `$BR` é o `--browser-executable` acima e `$BLENDER` é o Blender 5.2. As pastas `public/v3/tela` e `public/v3/celular` não vão para o Git: gere de novo.

```bash
# 1) cena base do celular (skill blender-ia), uma vez só, depois de gerar as telas (passo 3)
HDR=$(bash <main>/skills/video/blender-ia/scripts/baixar_hdri.sh "$SCRATCHPAD/hdri")
$BLENDER -b --factory-startup -P <main>/skills/video/blender-ia/scripts/premium.py -- --out $PWD/base_ --anim parado \
  --frames 1-1 --so 1 --pct 10 --spp 1 --tela $PWD/public/v3/tela/element-001.jpeg --tela_seq 1 --hdri $HDR --salvar --fstop 0   # grava base_cena.blend
# 2) poses do celular (para com erro se algum quadro ficar inclinado para baixo)
npx esbuild src/v3/exportar_poses.ts --bundle --platform=node --outfile=out/exportar_poses.js && node out/exportar_poses.js > blender/poses-v3.json
# 3) telas do app (textura do Blender)
npx remotion render src/index.ts V3Tela public/v3/tela --sequence --image-format=jpeg --jpeg-quality=95 --browser-executable=$BR
# 4) celular no Blender (~2h30 em 4 CPUs; rode em segundo plano)
$BLENDER -b base_cena.blend -P blender/v3_pose.py -- --poses $PWD/blender/poses-v3.json --out $PWD/public/v3/celular/c_ \
  --frames 0-899 --pct 100 --spp 8 --mb --borda --tela $PWD/public/v3/tela/element-000.jpeg
# 5) trilha, efeitos e mixagem (venv com numpy, scipy, soundfile, pedalboard)
python -I audio/v3/trilha_v3.py trilha_v3.wav audio/v3/trilha-v3_eventos.json
npx esbuild audio/v3/exportar_sons.ts --bundle --platform=node --outfile=out/exportar_sons_v3.js && node out/exportar_sons_v3.js > audio/v3/sons.json
python -I <main>/skills/audio/trilha-e-mixagem/scripts/mixar_com_efeitos.py --voz public/v3/voz.wav --musica trilha_v3.wav \
  --efeitos audio/v3/sons.json --saida public/v3/rotina-v3-mix.wav --duracao 30 --linha-do-tempo src/v3/voz.json
# 6) conferir o layout antes do Blender (celular em silhueta), rascunho e final
npx remotion render src/index.ts RotinaV3 out/v3-silhueta.mp4 --scale=0.5 --props='{"silhueta":true}' --browser-executable=$BR
npx remotion render src/index.ts RotinaV3 out/v3-rascunho.mp4 --scale=0.5 --browser-executable=$BR
npx remotion render src/index.ts RotinaV3 out/rotina-v3.mp4 --crf=17 --audio-codec=aac --audio-bitrate=256k --browser-executable=$BR
```

- **Se mudar o `rig.ts`:** exporte as poses de novo e renderize no Blender só os quadros afetados (`--frames a-b`).
- **Se mudar uma tela do app:** renderize de novo só aqueles quadros do `V3Tela` e depois os mesmos quadros no Blender.

**Promo v4 (30 s).** Usa as poses, a voz e a trilha do v3. Rode dentro de `rotina-video/`.

```bash
# telas com a abertura clara: copie public/v3/tela para public/v4/tela e renderize por cima só os quadros que mudam
npx remotion render src/index.ts V4Tela /tmp/v4t --sequence --image-format=jpeg --jpeg-quality=95 --frames=254-290 --browser-executable=$BR
npx remotion render src/index.ts V4Tela /tmp/v4t --sequence --image-format=jpeg --jpeg-quality=95 --frames=801-899 --browser-executable=$BR
# Blender só nesses quadros (o resto do celular vem de public/v3/celular)
$BLENDER -b base_cena.blend -P blender/v3_pose.py -- --poses $PWD/blender/poses-v3.json --out $PWD/public/v4/celular/c_ \
  --frames 254-290 --pct 100 --spp 8 --mb --borda --tela $PWD/public/v4/tela/element-000.jpeg    # e de novo com --frames 801-899
npx esbuild audio/v4/exportar_sons.ts --bundle --platform=node --outfile=out/exportar_sons_v4.js && node out/exportar_sons_v4.js > audio/v4/sons.json
python -I <main>/skills/audio/trilha-e-mixagem/scripts/mixar_com_efeitos.py --voz public/v3/voz.wav --musica trilha_v3.wav \
  --efeitos audio/v4/sons.json --saida public/v4/rotina-v4-mix.wav --duracao 30 --musica-db -9 --linha-do-tempo src/v3/voz.json
npx remotion render src/index.ts RotinaV4 out/rotina-v4.mp4 --crf=17 --audio-codec=aac --audio-bitrate=256k --browser-executable=$BR
```

**Promo v5 (22 s, 16:9).** Rode dentro de `rotina-video/`. As pastas `public/v5/tela` e `public/v5/celular` não vão para o Git: gere de novo.

```bash
# 1) textura da tela de bloqueio (74 JPEG, element-00 a element-73) e poses da abertura
npx remotion render src/index.ts V5Tela public/v5/tela --sequence --image-format=jpeg --jpeg-quality=95 --frames=0-73 --browser-executable=$BR
npx esbuild src/v5/exportar_poses.ts --bundle --platform=node --outfile=out/exportar_poses_v5.js && node out/exportar_poses_v5.js > blender/poses-v5.json
# 2) Blender (só os quadros com o celular)
$BLENDER -b base_cena.blend -P blender/v3_pose.py -- --poses $PWD/blender/poses-v5.json --out $PWD/public/v5/celular/c_ \
  --frames 0-72 --pct 100 --spp 8 --mb --borda --tela $PWD/public/v5/tela/element-00.jpeg
# 3) trilha, efeitos e mixagem
python -I audio/v5/trilha_v5.py trilha_v5.wav audio/v5/trilha-v5_eventos.json
npx esbuild audio/v5/exportar_sons.ts --bundle --platform=node --outfile=out/exportar_sons_v5.js && node out/exportar_sons_v5.js > audio/v5/sons.json
python -I <main>/skills/audio/trilha-e-mixagem/scripts/mixar_com_efeitos.py --voz public/v5/voz.wav --musica trilha_v5.wav \
  --efeitos audio/v5/sons.json --saida public/v5/rotina-v5-mix.wav --duracao 22.4 --linha-do-tempo src/v5/voz.json
# 4) rascunho e final
npx remotion render src/index.ts RotinaV5 out/v5-rascunho.mp4 --scale=0.5 --browser-executable=$BR
npx remotion render src/index.ts RotinaV5 out/rotina-v5.mp4 --props='{"audio":true}' --crf=17 --audio-codec=aac --audio-bitrate=256k --browser-executable=$BR
```

## Aprendizados deste projeto

- **O vídeo ficou "simples" por quatro motivos:**
  - a mola padrão (passa do ponto e treme);
  - elementos parados;
  - transições genéricas;
  - voz sem licença comercial.
- **Os números para corrigir isso** estão na skill `remotion-video`: molas, curvas, as 9 regras de movimento, zonas seguras e legendas.
- **O `wordAt()`** erra cerca de 0,2 s. Para legendas exatas, use o alinhamento com WhisperX (notas de voz), que erra cerca de 17 ms.
- **Licença de voz:** a voz edge-tts não tem licença para anúncio pago. As opções testadas estão na seção seguinte.

### Aprendizados da v2 (09/10/2026)

- **A voz decide a duração.** Com 139 palavras, 30 s só cabem com a voz em ~1,6x e pausas curtas. Para a voz ficar mais calma, o roteiro precisa ter menos palavras: umas 100 para 30 s a 1,3x.
- **O pedido "30 s" e o pedido "1,5x" brigaram.** Foi priorizado o tempo total, porque a velocidade veio com "se puder". Avise o usuário dessas escolhas.
- **Grade da música = grade do vídeo.** Com a música feita em código, a virada, as trocas de seção e o golpe final caem no quadro exato da fala, porque a música é gerada a partir dos tempos da voz.
- **Camadas separadas economizam tempo.** Mudar o 2D não exige renderizar de novo o 3D. Uma mudança no `rig.ts` só exige renderizar de novo os quadros afetados (13 quadros = 20 s).
- **Revisão barata:** um rascunho em meia resolução (72 s) e folhas com 12 quadros cada encontraram 5 problemas antes do render final: texto saindo da tela, sobreposições e um cartão rápido demais.
- **Medir a voz contra o fundo:** a primeira mixagem deixou a chamada final só 3 dB acima da música e dos efeitos. Uma versão só com o fundo (`VOICE_DB=-120`) mostrou isso, e o ajuste levou a 12 dB ou mais em todas as falas.

### Aprendizados da v3 (12/10/2026)

- **Coreografia em código, render no Blender.** Escrever o movimento do celular no `rig.ts` e exportar uma pose por quadro deixou o 2D e o 3D na mesma conta: os textos saem de trás do celular sem ajuste manual. A câmera igual nos dois lados foi conferida com 0 px de diferença.
- **A regra da pose vira teste.** O exportador de poses para com erro se algum quadro ficar inclinado para baixo. Assim, a regra do editor não depende de olho.
- **Silhueta antes do Blender.** Revisar o layout com o celular em silhueta, antes de gastar 2 h 40 min de render, pegou as sobreposições cedo.
- **Revisar por terços enquanto o Blender roda.** Os rascunhos de 10 s em meia resolução (~1 min cada) acharam 3 problemas antes do fim do render, sem esperar o vídeo inteiro.
- **Celular apagado num palco escuro some.** Uma tela emissiva (bloqueio com relógio e notificações) dá forma ao aparelho e já conta a história.
- **Render só da região do celular** (`--borda`): de 18 para ~10 s por quadro, com o PNG ainda no tamanho cheio.
- **Velocidade da Leda:** 91 palavras deram 41 s a 1,0x (2,2 palavras por segundo, mais devagar que a estimativa de 2,67 da v2). Com 1,1x e pausas apertadas, 28,3 s.
- **Vídeo sem som:** a maioria assiste Reels sem som. Toda fala precisa de uma palavra na tela ou de uma ação clara no celular; um trecho de 1,5 s sem texto e com metade do quadro vazia foi corrigido.

### Aprendizados da v4 (13/10/2026)

- **Direção de arte pesa mais que a quantidade de skills.** O v2.1 (menos skills) ganhou do v3 (39 skills lidas) porque tinha um sistema visual forte e variado. O v3 seguiu à risca o "premium contido" (palco escuro, um acento, pouco texto) e ficou simples demais para Reels.
- **O padrão do Daniel para promo de app em Reels é o "papel e tinta" do v2:** fundos que mudam por seção, Anton gigante com serifa itálica de acento, peças do app saindo do celular em tamanho grande e algo acontecendo o tempo todo. Escolha esse sistema primeiro e só depois aplique as outras skills.
- **Camadas separadas pagaram de novo:** o celular do Blender (2 h 40 min) foi reaproveitado inteiro; só a tela de abertura mudou (136 quadros, ~29 min).
- **Celular escuro no papel precisa de sombra.** Uma sombra 2D feita do corpo projetado, desfocada e deslocada para baixo, resolve sem renderizar de novo.
- **Tela vermelha em fundo vermelho some.** Quando o fundo do vídeo é da cor da tela do app, use uma versão clara da tela.

### Aprendizados da v5 (17/10/2026)

- **Copiar um modelo = copiar a gramática, não a marca.** Do modelo vieram a ordem das cenas, o tipo de movimento e o ritmo da voz. Do app vieram a fonte, os ícones e as cores. O Daniel pediu as duas coisas explicitamente ("faz igual, nesse estilo" + "gostei que você usou a tipografia e os ícones do app").
- **Preferências do Daniel registradas:**
  - papel de parede do celular em gradiente;
  - a tipografia (Barlow e Barlow Condensed em caixa alta), os ícones e as cores de categoria do próprio app nos vídeos.
- **Quando o modelo quebra uma regra do editor, avise.** O modelo revela as palavras no meio do quadro (contra a regra 4). Copiar e avisar na entrega deixa a decisão com o Daniel.
- **Elemento que "sai da tela" do celular:** desenhe a cópia 2D colada na projeção da tela do Blender no quadro do salto e só depois solte na mola. Se ela crescer no próprio lugar, cobre a original e não passa por cima de outro texto da tela (o relógio).
- **Morph cartão → ícone sem máscara:** um retângulo da cor do cartão cobre o conteúdo, encolhe até o quadrado do ícone e muda de cor; no último quadro, entra o ícone de verdade com o mesmo canto.
- **Câmera passeando numa interface 2D:** guarde só uma lista de focos (quadro, ponto, escala) e aplique `translate(centro) scale(e) translate(-foco)`; o borrão vem da diferença entre um quadro e o anterior.
- **Módulos lidos pelo exportador de efeitos (node) não podem medir texto ao carregar:** medidas com canvas vão dentro do componente, senão o `exportar_sons` quebra.

## Próximo vídeo: plano

1. **Ouvir e avaliar a v2** (o Claude não ouve). Pontos para o usuário decidir:
   - a velocidade da voz (1,6x);
   - o volume da trilha sob a voz;
   - o estilo da trilha feita em código.
2. **Licença:**
   - a voz Gemini segue os termos do Google (no plano grátis, o Google usa o conteúdo);
   - a trilha e os efeitos são originais, gerados por código, e podem ir para anúncio.
   - Confirme os termos antes de impulsionar.
3. **Música licenciada ou Lyria pago:** se a trilha em código ainda soar "básica", use uma faixa com licença para anúncio pago e mantenha a grade da música nos tempos da voz.
4. **Versões menores:** reaproveitar as camadas para cortes de 15 s (gancho + uma seção + CTA), trocando só o `voz.json` e a lista de seções.
5. **Depois da v3 e da v4 (13/10/2026):**
   - o Daniel assiste ao v4 e dá o veredito de editor (ritmo, giro da revelação, tamanho das telas no celular, volume da trilha);
   - transformar o "papel e tinta" do v2/v4 numa skill de sistema visual (proposta `design-de-video`), para não perder o padrão;
   - decidir as skills e combos novos propostos no relatório `reports/Vídeo Rotina v3, skills e combos usados (2026-10-12).md`;
   - capa do Reels a partir de um quadro do Blender (proposta `capa-e-cortes-reels`).
6. **Depois da v5 (17/10/2026):**
   - o Daniel assiste ao v5 e decide se a revelação das palavras no meio do quadro (do modelo) pode ficar;
   - versão 9:16 do v5 para Reels, reaproveitando as peças de `src/v5/`;
   - continuam abertas as decisões do item 5 (skill de sistema visual, skills e combos propostos, capa do Reels).
