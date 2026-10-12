#!/usr/bin/env bash
# Baixa um HDRI de estudio da Poly Haven (licenca CC0: uso comercial livre, sem credito) para os reflexos.
# Padrao: studio_small_09 em 1k (1,6 MB): octaboxes grandes, fundo infinito, contraste medio. Alternativas:
# studio_small_08 (contraste baixo), studio_small_03 (contraste alto). Mais pastas: https://polyhaven.com/hdris/studio
# Uso: baixar_hdri.sh <pasta> [nome=studio_small_09] [res=1k]     Saida: a ultima linha e o caminho do .hdr
set -euo pipefail
DEST="${1:?informe a pasta de destino}"; NOME="${2:-studio_small_09}"; RES="${3:-1k}"
mkdir -p "$DEST"; ARQ="$DEST/${NOME}_${RES}.hdr"
[ -s "$ARQ" ] || curl -fL --retry 4 -o "$ARQ" "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/${RES}/${NOME}_${RES}.hdr"
head -c 10 "$ARQ" | grep -q '^#?RADIANCE' || { echo "arquivo nao e um HDR valido: $ARQ" >&2; exit 1; }
ls -l "$ARQ" >&2; echo "$ARQ"
