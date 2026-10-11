#!/usr/bin/env bash
# Converte um render (sequência PNG RGBA do Blender/Remotion) ou um vídeo (IA, filmagem) nos arquivos do site:
#   <saida>/f_0001.webp ...   conjunto principal (WebP; mantém o alpha do PNG)
#   <saida>/lite/f_0001.webp  metade dos quadros, menor (Save-Data / aparelho fraco)
#   <saida>/poster.webp       o quadro do pôster (reduzir movimento, sem JS, LCP)
#   <saida>/manifest.json     {total, largura, altura, padrao, poster}
# Rode uma vez para o desktop (render 16:9) e outra para o celular (render vertical próprio; nunca recorte).
#
# Uso: bash preparar-quadros.sh <entrada> <saida> [largura=1600] [qualidade=78]
#   <entrada>: padrão de PNG ("png/phone_%04d.png") ou arquivo de vídeo ("ia.mp4").
#   Variáveis opcionais: FPS=24 (só vídeo), POSTER=<n> (número do quadro do pôster; padrão: o último).
# Exemplos:
#   bash preparar-quadros.sh "render/d/phone_%04d.png" public/seq/d 1600
#   bash preparar-quadros.sh "render/m/phone_%04d.png" public/seq/m 900
#   FPS=24 bash preparar-quadros.sh ia.mp4 public/seq/d 1280 75
set -euo pipefail
IN=${1:?entrada}; OUT=${2:?saida}; W=${3:-1600}; Q=${4:-78}
mkdir -p "$OUT/lite"
rm -f "$OUT"/f_*.webp "$OUT"/lite/f_*.webp
F=(-hide_banner -loglevel error -y)
PRE=""; [[ "$IN" == *%* ]] || PRE="fps=${FPS:-24},"   # vídeo: fixa a taxa de quadros
SRC=(-i "$IN")
ffmpeg "${F[@]}" "${SRC[@]}" -an -vf "${PRE}scale=${W}:-2:flags=lanczos" \
  -c:v libwebp -quality "$Q" -compression_level 6 "$OUT/f_%04d.webp"
ffmpeg "${F[@]}" "${SRC[@]}" -an -vf "${PRE}select='not(mod(n\,2))',scale=$((W * 4 / 5 / 2 * 2)):-2:flags=lanczos" \
  -fps_mode vfr -c:v libwebp -quality $((Q - 6)) -compression_level 6 "$OUT/lite/f_%04d.webp"
N=$(ls "$OUT"/f_*.webp | wc -l)
PN=$(printf '%04d' "${POSTER:-$N}")
cp "$OUT/f_$PN.webp" "$OUT/poster.webp"
# (o csv do ffprobe não aceita espaço como separador: use x)
IFS=x read -r LW LH < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$OUT/f_0001.webp")
NL=$(ls "$OUT"/lite/f_*.webp | wc -l)
printf '{"total": %d, "largura": %d, "altura": %d, "padrao": "f_{i}.webp", "poster": "poster.webp", "lite": {"total": %d, "padrao": "lite/f_{i}.webp"}}\n' \
  "$N" "$LW" "$LH" "$NL" > "$OUT/manifest.json"
KB=$(du -sk --exclude=lite "$OUT" | cut -f1); KBL=$(du -sk "$OUT/lite" | cut -f1)
echo "ok: $N quadros (${LW}x${LH}), $((KB)) KB; lite: $NL quadros, $KBL KB; pôster = quadro $PN"
