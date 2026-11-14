# Aprendizados: visao-computacional

Adendos datados; o mais novo fica embaixo. Skill nossa (não é cópia de terceiros): pode ser melhorada com a aprovação do Daniel.

## 14/11/2026: criação e testes

- **Origem:** proposta depois da análise do vídeo "skill vídeo claude" (o vídeo usava rosto, recorte, rastreamento e OCR); aprovada pelo Daniel ("aprovo tudo"). A primeira parte (recorte melhorado e o `rastrear.py`) foi feita por um agente no modelo Fable 5.2; ele foi parado porque os créditos estavam acabando, e o resto foi terminado no Opus 5.5.
- **Teste:** vídeo de teste do Daniel (selfie vertical, 37 s, gravado no celular), mais um trecho de surfe e um print com texto do vídeo analisado. O vídeo e os quadros ficaram só no container (rosto de pessoa real: nunca vão para o repositório).
- **O que funcionou:**
  - `rosto.py`: rosto em 1.124 de 1.124 quadros, em 6 s.
  - `recorte.py`: com filtro guiado, níveis e suavização entre quadros, o cabelo e o contorno ficam limpos; 93 s para o vídeo inteiro.
  - `rastrear.py` (CSRT): o inseto foi seguido em 100% dos quadros, com 97% de semelhança média.
  - `ocr.py`: achou "HyperFrames" e "Remotion" com 92% de confiança. A busca de frase aceita texto grudado (`<constraints>Maximum length:`) e aperta a caixa só nas palavras buscadas.
  - `conferir_regras.py`: aprovou a demonstração certa e acusou a errada (título na frente da boca) nos dois modos.
- **O que falhou e como foi resolvido:**
  - O MediaPipe 1.2 não tem mais o `mp.solutions`: só a API Tasks, com modelos `.tflite` baixados de `storage.googleapis.com` (esse host abre neste container).
  - O MediaPipe precisa de `libEGL.so.1`: `apt-get install libegl1 libgles2 libgl1`.
  - O Tesseract não enxerga título colorido sobre vídeo (o laranja vira um cinza parecido com a pele). A checagem `--auto` passou a usar o detector de regiões de texto PP-OCRv3 (modelo oficial do OpenCV, 2,4 MB, de `media.githubusercontent.com`), que acerta pela forma. Para não acusar os pedaços do título que aparecem ao lado da cabeça, o texto só conta se cobrir 10% do rosto.
  - O primeiro título branco sumia na parede branca: o acento laranja (`#FF5A1F`) lê bem em parede clara e escura. A etiqueta escura com o anel laranja aparece sobre qualquer fundo.
  - O trecho de surfe já vinha com marcações gráficas desenhadas por cima: o rastreio perdeu o surfista em 1,8 s. Teste o rastreamento em imagem limpa.
- **Regra de composição na prática:** título atrás da pessoa = vídeo → título → pessoa recortada por cima (regra 3). O título entra pela borda do quadro, com ease-out (regra 4). A etiqueta desce do alto e fica longe do título e do rosto (regra 1).

### Regras nossas (valem sempre)

- **Fale com o Daniel em português do Brasil**; o código e os comentários podem ficar em inglês.
- **Tudo local:** nenhuma imagem ou vídeo vai para serviço de fora. Os modelos ficam em `~/.cache/visao-computacional/`, fora do repositório.
- **Rosto de pessoa real** (gravações do Daniel ou de clientes) nunca vai para o repositório nem para exemplos públicos.
- **As 4 regras de composição do editor** valem em todo quadro (`skills/video/remotion-video/SKILL.md`), e esta skill existe para conferi-las.
- **Container:** 4 CPUs, sem GPU: um processamento pesado por vez; analise em largura reduzida (640 px) e volte as coordenadas.
- **Mapa de uso:** `skills/combos/combo-video-ia-completo/SKILL.md` (etapas 5 e 10).
