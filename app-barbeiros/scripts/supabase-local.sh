#!/usr/bin/env bash
# Local Supabase for the app (needs Docker).
#   bash scripts/supabase-local.sh start      # Postgres + Auth + REST + Kong only
#   bash scripts/supabase-local.sh db reset   # any other supabase command, same registry
#
# `start` skips the services the app does not use yet; add them back
# (e.g. edge-runtime in Phase 3) by removing them from the -x list.
#
# Registry: in the cloud container, public.ecr.aws answers "Data limit
# exceeded", so the same Supabase images come from Docker Hub. Override with
# SUPABASE_IMAGE_REGISTRY=public.ecr.aws if you prefer.
set -euo pipefail
cd "$(dirname "$0")/.."
export SUPABASE_INTERNAL_IMAGE_REGISTRY="${SUPABASE_IMAGE_REGISTRY:-docker.io}"

if [[ "${1:-start}" == "start" ]]; then
  [[ $# -gt 0 ]] && shift
  exec npx supabase start \
    -x studio,imgproxy,mailpit,realtime,storage-api,edge-runtime,logflare,vector,supavisor,postgres-meta "$@"
fi
exec npx supabase "$@"
