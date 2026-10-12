# Resumo para o Daniel: Blender premium (12/10/2026)

## O que você pediu

Que a skill do Blender (`blender-ia`) passasse a fazer animação 3D com cara de comercial: movimento suave e bem dirigido, visual caprichado (luz, material, render) e um celular bem modelado. Foi feito em cima da skill que já existia, sem apagar nada que funcionava.

## O que mudou, em português simples

**1. Movimento (direção de animação)**
- Antes, o brilho do vidro passava rápido demais, em 0,27 segundo. Agora o reflexo leva uns 0,8 segundo para cruzar a tela, e o movimento parece de filme de produto.
- A skill agora diz **quanto tempo** dura cada tipo de plano (revelação do celular 3 a 5 s, câmera se aproximando 3 a 5 s, giro completo 6 a 8 s) e **que curva** usar em cada um.
- Regras novas para o movimento ficar suave: a câmera nunca "passa do ponto" e volta, nunca para no meio do caminho e nunca acelera de forma brusca. O celular pode passar do ponto só um pouquinho (1 a 2%), o suficiente para ter vida.
- A mesma curva de movimento que você usa no Remotion agora funciona igual dentro do Blender (conferido: diferença de 0,00005%).
- Um verificador novo (`verifica_curvas.py`) confere o movimento em 2 segundos, **antes** de gastar tempo renderizando, e avisa se algo está brusco.

**2. Visual premium**
- O fundo deixou de encher o quadro de cor (antes parecia um vinho chapado). Agora é escuro, com um brilho suave só atrás do celular, ou transparente para o Remotion pôr o fundo.
- A luz virou "estúdio de anúncio": uma luz grande e alta, duas faixas finas de luz atrás (que desenham o contorno do aparelho) e um reflexo diagonal discreto na tela.
- As cores do app aparecem fiéis na tela (trocamos o modo de cor do Blender para um feito para fotografia de produto).
- Checklist "cara de comercial" para revisar antes de renderizar.

**3. Modelagem do celular**
- Celular genérico (sem nenhuma marca real) de 8,2 mm de espessura, com borda de metal, vidro encaixado, botões, entrada USB-C, furinhos de alto-falante, linhas de antena e uma ilha de câmera com duas lentes. Parece aparelho de verdade, e não uma caixa fina.
- A tela mostra a **interface do app** com borda preta e furo da câmera frontal (a imagem da tela agora deve ter 1080 × 2309 pixels).

**4. Ferramentas novas na skill**
- `premium.py`: o script principal do plano-herói (celular + luz + movimento + render com fundo transparente + sombra + posição do celular para ancorar textos). Substitui o `produto.py` nos planos-herói; o `produto.py` fica como versão leve.
- `verifica_curvas.py`: confere o movimento.
- `baixar_hdri.sh`: baixa a imagem de estúdio gratuita (Poly Haven, uso comercial liberado).
- `tela_teste.py`: gera uma tela de app de mentira para testes.
- Três arquivos de detalhe em `references/`: direção de animação, visual premium e modelagem.

## Quanto custa (neste container, sem placa de vídeo)

- Rascunho pequeno: cerca de 1,5 segundo por quadro.
- Quadro final em 1080 × 1920 com tudo ligado: **cerca de 24 segundos**. Um plano de 3 segundos (90 quadros) leva **uns 36 minutos**, em segundo plano. Igual ao custo de antes, com resultado bem melhor.

## Imagens para mostrar (pasta `mostrar/`)

1. `1-antes-depois-visual.png`: o antes (fundo vinho e celular chapado), o intermediário e o depois, lado a lado. É a melhor para mostrar a diferença.
2. `2-quadro-final-do-script-novo-540x960.png`: um quadro do script novo, com fundo transparente, a tela do app e o reflexo.
3. `3-movimento-v1-contra-v2.png`: as duas folhas de movimento. À esquerda o reflexo passa rápido demais; à direita, suave e legível. **É aqui que preciso do seu olho** (veja abaixo).
3b. `3b-varredura-do-reflexo-script-novo-4-quadros.png`: quatro momentos do movimento do script novo, com o brilho cruzando a tela.
4. `4-traseira-com-camera-540x960.png`: o verso do celular, com a ilha de câmera e as lentes.
5. `5-cores-da-tela-4-modos.png`: como as cores do app saem em quatro modos de cor do Blender (o escolhido mantém as cores fiéis).

## O que preciso que você decida

- **Os números de duração e velocidade são estimativa nossa**, afinados nos testes. Não achamos uma fonte de 2025–2026 com números de animadores de filmes de produto. Olhe a imagem 3 e diga: o reflexo deveria demorar **mais** (30 ou 40 quadros) ou está bom? E o "passar do ponto" do celular (1%) está bom, ou prefere mais vida (1,5%)?
- O `premium.py` pode virar o padrão para todo plano-herói? (Se sim, o `produto.py` pode ser aposentado depois.)
- Quer a skill salva na `main` (com a `ORIGEM.md` e o `APRENDIZADOS.md` já atualizados) e as pesquisas copiadas para `research_notes/Blender com IA/`? Nada foi enviado ao GitHub.

## O que ainda não foi testado

- O render completo de 90 quadros (só quadros soltos e uma sequência curta).
- A tela real do app Rotina no celular (usamos uma tela genérica de teste).
- Cintilação do removedor de ruído numa sequência longa.
- O Blender com interface no seu computador (MCP), como antes.
- A micro-vibração de câmera "viva" está medida e documentada, mas não está ligada no script.

## Arquivos

Pasta: `scratchpad/hunter/blender-premium/`
- `nova/SKILL.md`, `nova/ORIGEM.md`, `nova/APRENDIZADOS.md`
- `nova/references/direcao-animacao.md`, `visual-premium.md`, `modelagem.md`
- `nova/scripts/premium.py`, `verifica_curvas.py`, `tela_teste.py`, `baixar_hdri.sh` (novos); `produto.py`, `logo_e_celular.py`, `folha.sh`, `png_para_video.sh`, `instalar_blender.sh`, `LICENSE` (mantidos)
- `nova/assets/CamadaBlender.tsx` (mantido)
- `TRANSCRICAO.md`, `RESUMO.md`, `pesquisa-A.md`, `pesquisa-B.md`, `mostrar/`, `teste-A/`, `teste-B/`, `teste-T/`
