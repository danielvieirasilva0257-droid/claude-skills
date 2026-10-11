#!/usr/bin/env bash
# Gera 60 quadros de teste (RGBA, fundo transparente) de um "aparelho" que gira e cresce.
# Uso: ./gerar-quadros.sh <pasta-saida>
set -euo pipefail
OUT=${1:-frames}; mkdir -p "$OUT"
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "gradients=s=300x600:c0=0xff7a18:c1=0xaf002d:c2=0x6a3df0:n=3:speed=0.02:r=30:d=2" \
  -vf "format=rgba,\
drawbox=x=16:y=16:w=268:h=568:color=0x0b0b14@1:t=fill,\
drawbox=x=115:y=30:w=70:h=14:color=0x2a2a3a@1:t=fill,\
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='%{eif\:n+1\:d\:2}':fontsize=110:fontcolor=white:x=(w-tw)/2:y=(h-th)/2,\
rotate=a='(1-n/59)*1.25*PI':c=black@0:ow=hypot(iw\,ih):oh=ow,\
scale=w='trunc(iw*(0.55+0.4*n/59)/2)*2':h=-2:eval=frame,\
pad=w=1280:h=720:x=(ow-iw)/2:y=(oh-ih)/2:color=0x00000000:eval=frame" \
  -frames:v 60 -c:v libwebp -lossless 0 -quality 80 -compression_level 6 "$OUT/f_%04d.webp"
