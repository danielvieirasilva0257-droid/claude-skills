---
name: visao-computacional
description: Visão computacional para vídeo, local, sem GPU e sem chave. Acha o rosto em cada quadro, recorta a pessoa do fundo (título atrás dela sem tela verde, em .webm com transparência), rastreia um objeto para prender uma etiqueta nele, lê o texto de um print ou de um quadro (OCR) para pôr o destaque no lugar exato, e confere as regras do editor no vídeo pronto (nenhum texto na frente do rosto, nenhum texto sobre outro texto). Use com remotion-video, hyperframes e video-use, e na etapa 10 (autorrevisão) do combo-video-ia-completo.
---

# Visão computacional para vídeo

Tudo roda no container (4 CPUs, sem GPU). Nenhuma imagem sai da máquina; só os modelos são baixados uma vez, do repositório público do MediaPipe (Google) e do OpenCV, para `~/.cache/visao-computacional/`. As saídas são JSON com o número do quadro (`q`) e o tempo (`t`), em pixels do vídeo original, prontas para o Remotion ou o HyperFrames lerem.

## Instalação (uma vez por container)

```bash
apt-get install -y tesseract-ocr tesseract-ocr-por libegl1 libgles2 libgl1
python3 -m venv /caminho/vc && /caminho/vc/bin/pip install -r scripts/requirements.txt
export SSL_CERT_FILE=/root/.ccr/ca-bundle.crt     # neste container, para baixar os modelos
```

Rode sempre com `/caminho/vc/bin/python -I scripts/<script>.py ...`. Todos têm `--help`.

**Vídeo de celular:** grave uma cópia com a taxa de quadros constante e já de pé antes de começar (`ffmpeg -i in.mp4 -vf fps=30,scale=720:-2 -c:v libx264 -crf 18 -c:a aac trabalho.mp4`). Os scripts avisam se a taxa for variável.

## As ferramentas

| Script | O que faz | Exemplo | Tempo medido (720x1280) |
|---|---|---|---|
| `rosto.py` | Caixa do rosto em cada quadro (MediaPipe BlazeFace) | `rosto.py video.mp4 -o rosto.json --folha rosto.jpg` | 6 s para 37 s de vídeo |
| `recorte.py` | Pessoa recortada do fundo, com borda presa ao contorno real (filtro guiado) e sem pisca-pisca (suavização entre quadros) | `recorte.py video.mp4 --webm pessoa.webm --folha recorte.jpg` · trecho: `--de 400 --ate 700` · só a máscara: `--mascara m.mp4` | 93 s para 37 s; 23 s para um trecho de 10 s |
| `rastrear.py` | Segue um objeto marcado; marca "perdido" quando ele some e procura de novo sozinho | 1) achar a caixa: `rastrear.py video.mp4 --de 400 --grade grade.jpg --zoom 540,120,180,160` · 2) `rastrear.py video.mp4 --caixa 604,182,34,32 --de 400 --ate 700 -o rastreio.json --previa rastreio.mp4` | 9 s para 10 s de vídeo |
| `ocr.py` | Lê as palavras de um print ou de um quadro e diz onde cada uma está; `--buscar` acha uma palavra ou frase | `ocr.py print.png --buscar "Maximum length" --folha ocr.jpg` · quadro de vídeo: `ocr.py video.mp4 --tempo 4.0` | 2 a 3 s por imagem |
| `conferir_regras.py` | **Autorrevisão:** acusa texto na frente do rosto e texto sobre texto; sai com código 1 se achar problema | com as caixas exportadas pelo motor: `--textos textos.json` · sem exportar nada: `--auto` | instantâneo com `--textos`; 3 s para 10 s com `--auto` |
| `exemplo_texto_atras.py` | Receita completa sem Remotion: título que entra pela borda e fica **atrás** da pessoa, mais uma etiqueta que segue o objeto rastreado; exporta o `textos.json` | ver "Exemplo testado" abaixo | 10 s para 10 s de vídeo |

### Formatos

- `rosto.json`: `{"fps","largura","altura","quadros":[{"q","t","rostos":[{"x","y","w","h","conf"}]}]}`
- `rastreio.json`: `{"quadros":[{"q","t","x","y","w","h","cx","cy","conf","perdido"}],"perdas":[{"de","ate"}],"resumo":{...}}`. Use `cx,cy` (centro suavizado) para prender a etiqueta.
- `ocr.json`: `{"palavras":[{"texto","x","y","w","h","conf","linha"}],"busca":{"texto","achados":[{"x","y","w","h","conf","palavras"}]}}`
- `textos.json` (o que o motor do vídeo exporta para a checagem): `[{"id","inicio","fim","x","y","w","h","atras"}]`, em segundos e pixels. `"atras": true` = a camada fica **atrás** da pessoa (o rosto cobre o texto, o que é permitido pela regra 3).
- `regras.json`: `{"problemas":[{"tipo","ids","de","ate","inicio","fim"}],"ok"}`

## Como usar no Remotion

```tsx
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import rastreio from '../public/rastreio.json';   // saída do rastrear.py

export const Etiqueta: React.FC<{de: number}> = ({de}) => {
  const f = useCurrentFrame();
  const r = rastreio.quadros.find((x) => x.q === de + f);
  if (!r || r.perdido) return null;
  return <div style={{position: 'absolute', left: r.cx - 140, top: r.cy - 18}}>INSETO</div>;
};

// Título ATRÁS da pessoa (regra 3): vídeo → título → pessoa recortada por cima
export const Cena = () => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile('trabalho.mp4')} />
    <Titulo />                                            {/* entra pela borda ou de trás da pessoa (regra 4) */}
    <OffthreadVideo src={staticFile('pessoa.webm')} transparent />
    <Etiqueta de={400} />
  </AbsoluteFill>
);
```

O `.webm` sai com transparência (VP9, `yuva420p`). No ffmpeg, para ler a transparência dele, ponha `-c:v libvpx-vp9` **antes** do `-i`.

## Como usar no HyperFrames

O recorte já existe lá (`npx hyperframes remove-background`). Esta skill acrescenta o rastreamento (`rastreio.json` como variável da cena), o OCR (posição do destaque) e a checagem das regras no vídeo renderizado (`conferir_regras.py final.mp4 --auto`).

## Autorrevisão (etapa 10 do combo-video-ia-completo)

1. Se o motor puder exportar as caixas de texto por quadro, gere o `textos.json` e rode `conferir_regras.py final.mp4 --textos textos.json`. É o modo rigoroso: pega qualquer encostada.
2. Se não puder, rode `conferir_regras.py final.mp4 --auto`. O detector de texto (PP-OCR) acha as regiões de texto de qualquer cor sobre a imagem. Só conta quando o texto cobre pelo menos 10% do rosto (`--area-min`), porque ele não sabe se o texto está na frente ou atrás.
3. Abra a folha de quadros (`--folha`) dos problemas, corrija e rode de novo.

## Exemplo testado (14/11/2026, vídeo de teste do Daniel, 720x1280)

```bash
recorte.py trabalho.mp4 --de 400 --ate 700 --mascara demo/mascara.mp4
rastrear.py trabalho.mp4 --caixa 604,182,34,32 --de 400 --ate 700 -o ras/inseto.json
exemplo_texto_atras.py trabalho.mp4 --mascara demo/mascara.mp4 --de 400 --ate 700 \
    --rastreio ras/inseto.json -o demo/demo.mp4 --textos demo/textos.json
rosto.py demo/demo.mp4 -o demo/rosto_demo.json
conferir_regras.py demo/demo.mp4 --textos demo/textos.json --rosto demo/rosto_demo.json   # OK
conferir_regras.py demo/demo.mp4 --auto --rosto demo/rosto_demo.json                      # OK
# a versão --errado (título na frente da boca) foi acusada nos dois modos
```

## Limites conhecidos

- **Rastreamento:** muito bom em objeto pequeno e nítido sobre fundo calmo (o inseto: 100% dos quadros em 10 s). Perde em câmera girando rápido, objeto que muda de forma ou imagem com gráficos por cima (o surfista do teste: perdido depois de 1,8 s). Recomece a cada corte de cena e confira na prévia.
- **Recorte:** mãos em movimento rápido ficam com um leve rastro. Para mãos e cabelo melhores, use `--modelo multiclasse` (umas 7 vezes mais lento).
- **OCR (`ocr.py`)** lê bem prints e telas (texto normal). Para título estilizado e colorido sobre vídeo, ele falha: por isso a checagem `--auto` usa o detector PP-OCR, que acha a região mas não lê as letras.
- **`--auto` não confere texto sobre texto** (um título visto em pedaços pareceria vários textos); para isso, use `--textos`.
