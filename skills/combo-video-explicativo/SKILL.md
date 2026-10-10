---
name: combo-video-explicativo
description: Combo para fazer um vídeo explicativo ou promo de app (Reels 1080×1920, 30–60 s) com narração, música, efeitos sonoros, palavras-chave sincronizadas e motion premium, inclusive com celular 3D de verdade. Junta as skills combo-copy-humanizada (roteiro), voz-pt-br, trilha-e-mixagem e remotion-video, com motion-video, button-animation e ui-ux-pro-max como apoio. Use quando o pedido for "vídeo do meu app", "anúncio animado com voz", "explicativo com narração".
---

# Combo: vídeo explicativo de app (voz + música + motion)

Este combo **não repete** o conteúdo das skills: ele diz qual usar em cada passo e o que já foi aprendido ao juntá-las. Abra cada skill só quando chegar ao passo dela.

## Skills ligadas

| Papel | Skill | Caminho |
|---|---|---|
| Roteiro que convence e não parece de IA | combo-copy-humanizada | `skills/combo-copy-humanizada/SKILL.md` |
| Narração, encaixe na duração e legendas | voz-pt-br | `skills/voz-pt-br/SKILL.md` (+ `APRENDIZADOS.md`) |
| Música, efeitos sonoros e mixagem | trilha-e-mixagem | `skills/trilha-e-mixagem/SKILL.md` (+ `APRENDIZADOS.md`) |
| Animação, celular 3D e render (principal) | remotion-video | `skills/remotion-video/SKILL.md` (+ `APRENDIZADOS.md`) |
| Regras de movimento e sons sintetizados | motion-video | `skills/motion-video/.claude/skills/motion-video/SKILL.md` |
| Botões e micro-interações (toque, anel girando, molas) | button-animation | `skills/button-animation/SKILL.md` |
| Paleta, fonte e estilo | ui-ux-pro-max | `skills/ui-ux-pro-max/SKILL.md` |

Exemplos reais feitos com este combo: `projetos/rotina/PASSO-A-PASSO.md` (explicativo de 60 s e promo v2 de 30 s).

## Passo a passo (com os pontos de aprovação do usuário)

1. **Briefing numa mensagem só:**
   - o que o app faz e as telas reais (prints ou o código das telas);
   - as cores e a fonte da marca;
   - a **duração exata** e, se houver, a velocidade desejada da voz;
   - um vídeo de referência, se houver;
   - a voz preferida.
2. **Roteiro** com o `combo-copy-humanizada`:
   - falas curtas, uma por momento;
   - gancho nos 3 primeiros segundos;
   - chamada para ação no fim (ex.: "Baixe o Rotina agora. Link na bio.").
   - **Tamanho:** para 30 s com voz natural, umas 100 palavras; 139 palavras só couberam a 1,6x. Para 60 s, cerca de 12–13 falas.
   - → **Aprovação do usuário.**
3. **Voz** (`voz-pt-br`, seções 2 a 4):
   1. Gere o roteiro inteiro num pedido só (`--juntar`).
   2. Estime a velocidade com `apertar_pausas.py --estimar`. Se a duração e a velocidade pedidas não couberem juntas, escolha uma e **diga ao usuário qual**.
   3. Acelere com `atempo` e aperte as pausas.
   4. O `voz.json` gerado vira a fonte de **todos** os tempos: animação, música e efeitos.
   5. Confira com `conferir_voz.py`.
   - Não use edge-tts em anúncio.
4. **Grade da música pela voz:**
   - escolha o BPM e a fase para a virada cair numa palavra-chave;
   - ponha as trocas de seção nos compassos perto das pausas entre as falas.
   - Em 120 BPM, a batida = 15 quadros e o compasso = 2 s.
5. **Telas e animação** (`remotion-video`):
   - Recrie as telas reais em React, com as cores e a fonte do app. Cada toque fica preso a uma palavra.
   - Aplique as regras premium:
     - molas `{stiffness: 380, damping: 31}`;
     - nada parado;
     - eventos sobrepostos de 4–12 quadros;
     - transições que nascem de um elemento da cena.
   - **Celular 3D de verdade em camadas:** telas em JPEG, depois o celular em PNG transparente, depois o 2D. Use um "rig" compartilhado, para os cartões saírem do ponto exato da tela.
   - Mostre palavras-chave grandes entrando no quadro em que são ditas, e cartões e selos saindo da tela do celular.
6. **Música e efeitos** (`trilha-e-mixagem`):
   - Música: licenciada para anúncio, ou o `exemplo_trilha_v2.py` travado na grade.
   - Lista de efeitos gerada no código do vídeo, com os mesmos tempos de palavra.
   - Mixe com `mixar_com_efeitos.py` e confira a **voz contra o fundo, ≥ 12 dB em todas as falas**.
7. **Legendas:**
   - em fala rápida, só palavras-chave;
   - legendas completas com `alinhar_roteiro.py --legendas`, respeitando a zona segura do Reels.
8. **Rascunho e revisão:**
   - renderize o vídeo inteiro em meia resolução (~1 min);
   - revise em folhas de 12 quadros e corrija.
   - → **Aprovação do usuário**, se ele quiser ver antes do render final.
9. **Render final e conferências:**
   - volume (ebur128);
   - transcrição do áudio final (≥ 95%);
   - alguns quadros em resolução cheia.
10. **Salve o aprendizado:**
    - o `PASSO-A-PASSO.md` do projeto;
    - os `APRENDIZADOS.md` das skills usadas;
    - o histórico deste combo.

## Avisos (aprendidos ao juntar as skills)

- **O tempo da voz manda no vídeo.** Gere e encaixe a voz antes de animar, porque refazer a voz depois desalinha tudo: animação, música e efeitos.
- **Duração × velocidade:** confira as contas antes de gerar o resto. No Rotina v2, "30 s" e "1,5x" não cabiam juntos.
- **A licença da voz e da música** decide se o vídeo pode virar anúncio pago. Confirme antes de produzir. O Lyria só funciona no plano pago da API.
- **Não rode vários renders ao mesmo tempo:** a máquina tem 4 CPUs, e renders em paralelo travam ou ficam lentos.
- **Tempos medidos** (4 CPUs, 30 s de vídeo):
  - telas ~1,5 min;
  - celular 3D ~11 min;
  - rascunho 72 s;
  - render final ~3 min;
  - trilha 17 s;
  - mixagem 12 s.
- **Ajudantes em paralelo** (subagentes) gastam a mesma cota da sessão. Se a cota acabar no meio, o trabalho deles se perde. Peça que salvem arquivos parciais, ou faça no agente principal.
- **Gaste menos créditos:**
  - aprove o roteiro antes;
  - revise com rascunho e folhas de quadros;
  - edite só a cena ou os quadros que mudaram.
- **O Claude não ouve áudio.** Confira a voz e a mixagem com transcrição automática, o volume com ebur128 e a estrutura da música com espectrograma. Peça ao usuário para ouvir a versão final.

## Histórico do combo

- **08–09/10/2026:** criado a partir do vídeo explicativo do Rotina (60 s, voz edge-tts, trilha numpy) e da pesquisa de motion, 3D, voz e som.
- **09–10/10/2026: promo v2 do Rotina (30 s), visual novo do zero.**
  - Voz da Leda (Gemini) a 1,6x, encaixada em 30 s.
  - Trilha original travada na grade da voz.
  - Celular 3D em camadas e 117 efeitos sonoros.
  - Entraram no combo:
    - o roteiro com `combo-copy-humanizada`;
    - o encaixe da voz na duração;
    - a música a partir dos tempos da voz;
    - os efeitos pela mesma lista de palavras;
    - a medição da voz contra o fundo;
    - o rascunho em meia resolução para revisão.
