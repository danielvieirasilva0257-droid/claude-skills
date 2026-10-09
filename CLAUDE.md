# claude-skills: Daniel's knowledge base for Claude

This repository exists for Claude to use and keep improving. It holds Claude skills, research notes and reports, and the video projects for the "Rotina" app.

## Working agreement (set by the user)

- **Skills need approval.** When you find a better version of a skill, or want to change one, show the user the updated skill first and ask before committing it. Skills live in `skills/` and `.claude/skills/`.
  - Write the proposal to the scratchpad, send it with SendUserFile, and summarize what changed.
- **Knowledge can be updated freely.** Research notes, reports and docs can be added and updated without asking, so the knowledge base keeps getting better. These live in `research_notes/`, `reports/` and README files.
- Commit and push work as you go, because the cloud container is ephemeral.
- Talk to the user in Brazilian Portuguese.

## Layout

| Path | What |
|---|---|
| `skills/` | Skills written in this repo: `remotion-video`, `button-animation`, `thumbnail-carousel`, `ui-ux-pro-max` |
| `.claude/skills/motion-video/` + `motion-studio/` | motion-video kit (canvas motion engine, no Remotion), auto-loaded by Claude Code |
| `rotina-video/` | Remotion project for the Rotina app videos: `Rotina` (10 s teaser) and `RotinaExplainer` (60 s with voice and music) |
| `research_notes/<topic>/` | Raw research notes, each with a "PENDENTE / NÃO PESQUISADO" section |
| `reports/` | Final research reports (pt-BR) |

## Environment notes (cloud container, no GPU)

- **Remotion:** version 4.0.534. Keep all `@remotion/*` packages on the same exact version.
  - Render with `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
  - For 3D, add `--gl=swangle`.
- **motion-studio:**
  - Install with `PUPPETEER_SKIP_DOWNLOAD=1 npm install` and a `.venv` with numpy/scipy.
  - Render with `PUPPETEER_EXECUTABLE_PATH` pointing to a wrapper that runs `/opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox "$@"`, because the container runs as root.
- **Proxy:** outbound HTTPS goes through a TLS-intercepting proxy, so Python tools may need the CA at `/root/.ccr/ca-bundle.crt`.
