#!/usr/bin/env bash
# Instala o Blender oficial (tarball Linux x64) numa pasta, sem sudo, e confere o SHA-256.
# Medido em 11/10/2026: 383 MB, ~9 s de download e ~24 s para extrair.
# Uso: instalar_blender.sh <pasta>    (no container: use o scratchpad, nunca o repositorio)
# Saida: a ultima linha e o caminho do executavel.
set -euo pipefail
VER=5.2.2; SERIE=5.2
SHA=84098912789dc450e95697c4184fb8a90acbe5111c2ba4aede3fecb57806a168   # blender-5.2.2.sha256 oficial
DEST="${1:?informe a pasta de destino}"
TAR="$DEST/blender-$VER-linux-x64.tar.xz"; BIN="$DEST/blender-$VER-linux-x64/blender"
mkdir -p "$DEST"
if [ ! -x "$BIN" ]; then
  [ -f "$TAR" ] || curl -fL --retry 4 -o "$TAR" "https://download.blender.org/release/Blender$SERIE/blender-$VER-linux-x64.tar.xz"
  echo "$SHA  $TAR" | sha256sum -c -
  tar -xJf "$TAR" -C "$DEST"
fi
"$BIN" --version 2>/dev/null | head -1
echo "$BIN"
