#!/usr/bin/env bash
# Folha de quadros para revisao (regras do editor): 1 quadro a cada N, sobre uma cor solida
# (a cor deixa ver o alpha). Leitura: da esquerda para a direita, de cima para baixo.
# Uso: folha.sh '<pasta>/<prefixo>' <saida.png> [cada=6] [colunas=6] [cor=808080] [largura=270] [fps=30]
#   ex.: folha.sh /abs/frames/phone_ /abs/folha.png        (usa /abs/frames/phone_*.png)
set -euo pipefail
PREFIXO="$1"; SAIDA="$2"; CADA="${3:-6}"; COLS="${4:-6}"; COR="${5:-808080}"; LARG="${6:-270}"; FPS="${7:-30}"
shopt -s nullglob
ARQS=("$PREFIXO"*.png)
NQ=${#ARQS[@]}
[ "$NQ" -gt 0 ] || { echo "nenhum PNG em ${PREFIXO}*.png" >&2; exit 1; }
IFS=x read -r IW IH < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "${ARQS[0]}")
ALT=$(( (LARG * IH / IW + 1) / 2 * 2 ))
SEL=$(( (NQ + CADA - 1) / CADA )); LINHAS=$(( (SEL + COLS - 1) / COLS ))
ffmpeg -v error -y -f lavfi -i "color=c=0x${COR}:s=${LARG}x${ALT}:r=${FPS}" \
  -framerate "$FPS" -pattern_type glob -i "${PREFIXO}*.png" \
  -filter_complex "[1:v]scale=${LARG}:${ALT}[q];[0:v][q]overlay=shortest=1,select='not(mod(n\,${CADA}))',tile=${COLS}x${LINHAS}" \
  -frames:v 1 "$SAIDA"
echo "folha: $SAIDA ($NQ quadros, 1 a cada $CADA, ${COLS}x${LINHAS})"
