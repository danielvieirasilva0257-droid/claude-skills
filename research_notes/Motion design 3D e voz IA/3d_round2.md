# 3D round 2: measured feasibility of real 3D phone shots (Remotion R3F + Blender) in a 4-CPU / no-GPU Linux container

Status: IN PROGRESS (this file is updated after each result).

How to read:
- **MEASURED** = my own experiment in this container on 2026-10-08 (round 2), with exact versions and commands.
- **DOCS/SOURCE** = claim from an official page or package source, with a link.
- Machine: 4 vCPU, 15 GB RAM, no GPU, idle at start (load average 0.16). Chromium headless shell 141.0.7390.37 (Playwright build 1194). Node 22, ffmpeg 6.1.
- Scratch root: `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/3d/` (called `$S` below). Remotion project: `$S/r3f-latest`. Round-2 script, logs and outputs: `$S/r2/`.
- Stack: remotion, @remotion/cli, @remotion/three and @remotion/media 4.0.534; react 18.3.1; three 0.170.0; @react-three/fiber 8.18.0; @react-three/drei 9.122.0; @react-three/postprocessing 2.19.1; postprocessing 6.39.5.

(Results are added below as they arrive.)

## PENDENTE / NÃO PESQUISADO
- (filled at the end)
