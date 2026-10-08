#!/usr/bin/env bash
# Mixes the voice lines (public/vo/NN.wav) over the music with ducking -> public/soundtrack.wav
# Usage: bash audio/mix.sh music.wav
# Voice start times must match VO in src/timeline.ts
set -euo pipefail
cd "$(dirname "$0")/.."
MUSIC="$1"
STARTS=(0.30 4.10 10.10 12.40 16.90 22.20 26.00 31.00 36.50 39.60 44.45 50.40 54.50)
args=(); chains=""; labels=""
for i in "${!STARTS[@]}"; do
  n=$(printf "%02d" $((i + 1)))
  args+=(-i "public/vo/$n.wav")
  ms=$(awk "BEGIN{print int(${STARTS[$i]}*1000)}")
  chains+="[$((i + 1)):a]aresample=44100,pan=stereo|c0=c0|c1=c0,adelay=${ms}|${ms}[v$i];"
  labels+="[v$i]"
done
n=${#STARTS[@]}
ffmpeg -loglevel error -y -i "$MUSIC" "${args[@]}" -filter_complex "\
${chains}${labels}amix=inputs=${n}:normalize=0,apad=whole_dur=60,\
highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,volume=1.6,asplit=2[voice][key];\
[0:a]volume=0.55[m];\
[m][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck];\
[duck][voice]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000[out]" \
  -map "[out]" -t 60 public/soundtrack.wav
echo "ok public/soundtrack.wav"
