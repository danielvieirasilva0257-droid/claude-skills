#!/usr/bin/env bash
# Sequencia PNG RGBA do Blender -> video com transparencia para o Remotion.
# ProRes 4444 (.mov, grande, para edicao) e WebM VP9 com alpha (.webm, pequeno).
# Uso: png_para_video.sh '<pasta>/<prefixo>' <saida_sem_extensao> [fps=30]
#   ex.: png_para_video.sh /abs/frames/phone_ /abs/phone   -> /abs/phone.mov e /abs/phone.webm
set -euo pipefail
PREFIXO="$1"; SAIDA="$2"; FPS="${3:-30}"
ffmpeg -v error -y -framerate "$FPS" -pattern_type glob -i "${PREFIXO}*.png" \
  -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le "${SAIDA}.mov"
ffmpeg -v error -y -framerate "$FPS" -pattern_type glob -i "${PREFIXO}*.png" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -crf 18 -b:v 0 "${SAIDA}.webm"
ls -l "${SAIDA}.mov" "${SAIDA}.webm"
