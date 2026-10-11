#!/bin/bash
# usage: lic.sh owner/repo ...  -> prints repo, branch, license first line
for r in "$@"; do
  b=$(git ls-remote --symref https://github.com/$r HEAD 2>/dev/null | awk '/^ref:/{sub("refs/heads/","",$2);print $2}')
  if [ -z "$b" ]; then echo "$r | NAO ENCONTRADO"; continue; fi
  lic=""
  for f in LICENSE LICENSE.md LICENSE.txt license license.md LICENCE COPYING; do
    t=$(curl -sS -f https://raw.githubusercontent.com/$r/$b/$f 2>/dev/null | grep -v '^\s*$' | head -3 | tr '\n' ' ' | cut -c1-110)
    if [ -n "$t" ]; then lic="$f: $t"; break; fi
  done
  echo "$r | $b | ${lic:-SEM LICENSE NA RAIZ}"
done
