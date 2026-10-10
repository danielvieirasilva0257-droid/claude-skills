# Proposta: melhorar 4 skills com o que aprendi no vídeo Rotina v2

Nada disto foi salvo no GitHub ainda. Pela regra do repositório, mudanças em skills precisam da sua aprovação. Você pode aprovar tudo ou só uma parte, pelo número.

Todos os scripts novos foram **testados com os arquivos reais do vídeo v2** e refizeram os mesmos resultados.

## 1. voz-pt-br

**Script corrigido: `scripts/gemini_tts.py`**
- **Não deixa mais arquivo vazio quando dá erro.** Testado: com um modelo inexistente, nenhum arquivo foi criado.
- **Troca de chave sozinha:** se uma chave for recusada ou acabar a cota do dia, passa para a próxima (`gemini.key`, `gemini2.key`...). Testado: a chave 1, que morreu, foi pulada e a chave 2 gerou a fala.
- **Limite por minuto ou "demanda alta":** espera 25 s e tenta de novo uma vez.
- **Opção nova `--juntar`:** gera o roteiro inteiro num pedido só, que é o jeito recomendado por causa da cota de 10 pedidos por dia.

**Scripts novos:**
- `alinhar_roteiro.py`: acha o tempo de cada palavra quando a narração inteira está num arquivo só. Também gera legendas.
- `apertar_pausas.py`: encaixa a voz na duração do vídeo.
  - Primeiro estima a velocidade necessária.
  - Depois aperta as pausas cortando só no silêncio, e gera o `voz.json` que comanda o vídeo.
  - Testado: refez a linha do tempo do v2 com diferença mediana de 0 ms.
- `conferir_voz.py`: transcreve o áudio e compara com o roteiro. É como eu "ouço". Testado no áudio final: 97,8%.

**Texto da skill:**
- As vozes femininas que você avaliou (Leda, Laomedeia, Zephyr) entram na tabela.
- Seção nova "Acelerar e encaixar na duração": usar `atempo` (manteve 97% de clareza) e não `rubberband` (caiu para 93%), mais a conta de quantas palavras cabem em 30 s.
- Seção nova "Conferir sem ouvir".

## 2. trilha-e-mixagem

**Scripts novos:**
- `mixar_com_efeitos.py`: junta voz, trilha e efeitos sonoros, deixa o volume certo para o Instagram e **mede a voz contra o fundo em cada fala**.
  - Testado: refez a mixagem do v2 idêntica, amostra por amostra, em 12 s.
- `exemplo_trilha_v2.py`: o gerador da trilha do v2, para reaproveitar em outros vídeos. Testado: refez a mesma trilha.
- `lyria.py`: para usar o Lyria, se um dia você tiver o plano pago.

**Texto da skill:**
- **Correção:** a skill dizia que a chave grátis já dava acesso ao Lyria. Na prática, o limite grátis é zero.
- **A música nasce da voz:** a virada cai numa palavra-chave.
- **Efeitos sonoros por lista de quadros,** com as regras de tempo.
- **Meta de voz pelo menos 12 dB acima do fundo,** com dois erros de ffmpeg e pedalboard que encontrei e como evitar.

## 3. remotion-video (só o texto)

- **Celular 3D em camadas:**
  - as telas viram imagens;
  - o celular é renderizado com fundo transparente;
  - o 2D vem por cima.
  - Com um "rig" compartilhado, os cartões saem do ponto exato da tela.
  - Mostrou que dá para usar o celular 3D no vídeo inteiro (22 s em ~11 min), e não só em planos curtos.
- **Truques:** trocar a tela durante o giro, "entrar" na tela do celular e motion blur sem custo de render.
- **Rascunho em meia resolução** (72 s) para revisar o vídeo inteiro em folhas de quadros.

## 4. combo-video-explicativo (só o texto)

- **O passo a passo passa a ter:**
  - o roteiro com o `combo-copy-humanizada`;
  - o encaixe da voz na duração;
  - a música a partir da voz;
  - os efeitos pela lista de palavras;
  - a medição da voz contra o fundo;
  - o rascunho para revisão.
- **Avisos novos:**
  - conferir antes se duração e velocidade cabem juntas;
  - tempos medidos de cada etapa;
  - ajudantes em paralelo gastam a mesma cota.
- **Histórico** com o vídeo v2.

## Como responder

- "Pode salvar tudo", ou
- os números que podem entrar (por exemplo, "1 e 2"), ou
- o que você quer mudar antes.

Depois da aprovação, salvo na `main` (PR + merge), atualizo o `HABILIDADES.txt` e registro nos `APRENDIZADOS.md`.
