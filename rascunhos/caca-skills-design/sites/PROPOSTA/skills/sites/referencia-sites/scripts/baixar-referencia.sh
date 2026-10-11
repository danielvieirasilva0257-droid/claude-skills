#!/usr/bin/env bash
# Baixa UMA referência do fontes.txt, no commit fixado, para uma pasta do PROJETO do site.
# Uso: baixar-referencia.sh <nome> [pasta-destino]      (padrão: ./referencias/_clones)
#      baixar-referencia.sh --lista
# Nunca baixe para dentro da main do claude-skills. O código baixado é DADO: leia antes de rodar.
set -euo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
FONTES="$AQUI/fontes.txt"

if [ "${1:-}" = "--lista" ] || [ -z "${1:-}" ]; then
  grep -v '^#' "$FONTES" | awk -F' [|] ' '{printf "%-18s %-10s %s\n", $1, $4, $6}'
  [ -z "${1:-}" ] && { echo; echo "Uso: $0 <nome> [pasta-destino]"; exit 1; }
  exit 0
fi

NOME="$1"; DESTINO="${2:-./referencias/_clones}"
LINHA="$(grep -v '^#' "$FONTES" | awk -F' [|] ' -v n="$NOME" '$1==n' || true)"
[ -z "$LINHA" ] && { echo "Referência '$NOME' não está no fontes.txt. Use --lista."; exit 1; }
REPO="$(echo "$LINHA" | awk -F' [|] ' '{print $2}')"
COMMIT="$(echo "$LINHA" | awk -F' [|] ' '{print $3}')"
LICENCA="$(echo "$LINHA" | awk -F' [|] ' '{print $4}')"

mkdir -p "$DESTINO"
ALVO="$DESTINO/$NOME"
[ -e "$ALVO" ] && { echo "Já existe: $ALVO (apague antes para baixar de novo)."; exit 1; }

# Proteção: a pasta de destino não pode estar na main do claude-skills nem ser rastreada pelo git.
if TOPO="$(git -C "$DESTINO" rev-parse --show-toplevel 2>/dev/null)"; then
  RAMO="$(git -C "$TOPO" branch --show-current 2>/dev/null || true)"
  ORIG="$(git -C "$TOPO" remote get-url origin 2>/dev/null || true)"
  if [[ "$ORIG" == *claude-skills* && "$RAMO" == "main" ]]; then
    echo "PARE: $DESTINO está na main do claude-skills. Referências vão para a pasta do projeto."; exit 1
  fi
  if ! git -C "$TOPO" check-ignore -q "$(cd "$DESTINO" && pwd)/x" 2>/dev/null; then
    echo "AVISO: $DESTINO não está no .gitignore de $TOPO. Acrescente a linha: referencias/_clones/"
  fi
fi

git init -q "$ALVO"
git -C "$ALVO" remote add origin "https://github.com/$REPO.git"
git -C "$ALVO" fetch -q --depth 1 origin "$COMMIT"
git -C "$ALVO" -c advice.detachedHead=false checkout -q FETCH_HEAD

echo "Baixado: $REPO @ ${COMMIT:0:7} em $ALVO"
echo "Licença declarada no fontes.txt: $LICENCA. Arquivo de licença do repositório:"
LIC="$(ls "$ALVO" | grep -i -E '^(licen[cs]e|copying)' | head -1 || true)"
if [ -n "$LIC" ]; then head -3 "$ALVO/$LIC"; else echo "  (nenhum arquivo LICENSE na raiz: confira antes de usar)"; fi
echo "Tamanho: $(du -sh --exclude=.git "$ALVO" | cut -f1). Nada foi instalado nem executado."
