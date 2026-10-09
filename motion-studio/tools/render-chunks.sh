#!/bin/bash
# uso: tools/render-chunks.sh <projeto>   (retoma de onde parou: só renderiza frames que faltam em out/frames)
# [ -f scenes.src.js ] → scenes.js = data.js + scenes.src.js antes de renderizar
# Render em blocos com vigia de memória: se a RAM disponível < 1GB, mata o bloco e recomeça do 1º frame que falta.
cd "$(dirname "$0")/.."
P=projects/$1; [ -f $P/project.js ] || { echo "uso: tools/render-chunks.sh <projeto>"; exit 1; }
N=$(node -e "global.window={};eval(require('fs').readFileSync('$P/project.js','utf8'));console.log(window.PROJECT.frames)"); OUT=$P/out/frames; CH=90; LOG=$P/out/render.log
mkdir -p $OUT; [ -f $P/scenes.src.js ] && cat $P/data.js $P/scenes.src.js > $P/scenes.js
avail() { if command -v vm_stat >/dev/null; then vm_stat | awk '/page size/{ps=$8} /Pages free/{f=$3} /Pages inactive/{i=$3} /Pages speculative/{s=$3} /Pages purgeable/{p=$3} END{printf "%d", (f+i+s+p)*ps/1048576}'; else echo 99999; fi; }   # vigia de RAM só no Mac
source tools/env.sh; start_server 8777
missing() { for ((k=$1;k<=$2;k++)); do [ -s $OUT/$(printf %04d $k).png ] || { echo $k; return; }; done; echo -1; }
for ((a=0; a<N; a+=CH)); do
  b=$((a+CH-1)); [ $b -ge $N ] && b=$((N-1))
  tries=0
  while :; do
    m=$(missing $a $b); [ $m -lt 0 ] && break
    tries=$((tries+1)); [ $tries -gt 12 ] && { echo "$(date +%T) DESISTI bloco $a-$b" >> $LOG; exit 1; }
    while [ $(avail) -lt 1024 ]; do echo "$(date +%T) RAM baixa ($(avail)MB) aguardando antes do bloco $m" >> $LOG; sleep 10; done
    echo "$(date +%T) bloco $m-$b (tentativa $tries, RAM $(avail)MB)" >> $LOG
    FROM=$m TO=$b node tools/render.mjs $P full 8777 >> $LOG 2>&1 &
    pid=$!
    while kill -0 $pid 2>/dev/null; do
      sleep 3
      if [ $(avail) -lt 1024 ]; then
        echo "$(date +%T) RAM $(avail)MB < 1GB → reiniciando bloco" >> $LOG
        pkill -P $pid 2>/dev/null; kill $pid 2>/dev/null; pkill -f "\.cache/puppeteer" 2>/dev/null; sleep 8; break
      fi
    done
    wait $pid 2>/dev/null
  done
done
echo "$(date +%T) FRAMES OK" >> $LOG
ffmpeg -v error -y -framerate 30 -i "$OUT/%04d.png" -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -movflags +faststart "$P/out/video.mp4" >> $LOG 2>&1 \
 && tools/render.sh $1 audio >> $LOG 2>&1 && echo "$(date +%T) TUDO PRONTO" >> $LOG || echo "$(date +%T) ERRO na montagem final" >> $LOG
