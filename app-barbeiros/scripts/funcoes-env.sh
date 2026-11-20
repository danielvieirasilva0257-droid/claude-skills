#!/usr/bin/env bash
# Environment for the AI functions running locally (Deno) against the local
# Supabase. LLM_PROVIDER=mock unless you export LLM_PROVIDER=anthropic and a key.
set -euo pipefail
cd "$(dirname "$0")/.."
STATUS=$(bash scripts/supabase-local.sh status -o env 2>/dev/null)
export SUPABASE_URL=$(echo "$STATUS" | sed -n 's/^API_URL="\(.*\)"/\1/p')
export SUPABASE_ANON_KEY=$(echo "$STATUS" | sed -n 's/^ANON_KEY="\(.*\)"/\1/p')
export SUPABASE_SERVICE_ROLE_KEY=$(echo "$STATUS" | sed -n 's/^SERVICE_ROLE_KEY="\(.*\)"/\1/p')
export LLM_PROVIDER="${LLM_PROVIDER:-mock}"
# Local-only value of the RevenueCat webhook header (the real one is a Supabase secret).
export REVENUECAT_WEBHOOK_AUTH="${REVENUECAT_WEBHOOK_AUTH:-teste-local-rc}"
[ -f /root/.ccr/ca-bundle.crt ] && export DENO_CERT=/root/.ccr/ca-bundle.crt
exec "$@"
