# 3D round 2: measured feasibility of real 3D phone shots (Remotion R3F + Blender) in a 4-CPU / no-GPU Linux container

Status: IN PROGRESS (this file is updated after each result).

How to read:
- **MEASURED** = my own experiment in this container on 2026-10-08 (round 2), with exact versions and commands.
- **DOCS/SOURCE** = claim from an official page or package source, with a link.
- Machine: 4 vCPU, 15 GB RAM, no GPU, idle at start (load average 0.16). Chromium headless shell 141.0.7390.37 (Playwright build 1194). Node 22, ffmpeg 6.1.
- Scratch root: `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/3d/` (called `$S` below). Remotion project: `$S/r3f-latest`. Round-2 script, logs and outputs: `$S/r2/`.
- Stack: remotion, @remotion/cli, @remotion/three and @remotion/media 4.0.534; react 18.3.1; three 0.170.0; @react-three/fiber 8.18.0; @react-three/drei 9.122.0; @react-three/postprocessing 2.19.1; postprocessing 6.39.5.

(Results are added below as they arrive.)

## Running log of raw results (newest last)
- 2026-10-08 22:04, prep (MEASURED). `npx remotion bundle src/index.ts --out-dir=build` took 10.0 s. Screen composition (1080×2340, 60 frames, now with a big yellow frame-number badge for sync checks):
  - JPEG sequence (`--sequence --image-format=jpeg --jpeg-quality=92`): 5.9 s.
  - h264 MP4: 9.9 s.
  - PNG still: 2.9 s.
- 22:04, run **A** (MEASURED). No post, static PNG screen texture, `--concurrency=1`, 60 frames 1080×1920: **45.2 s wall**. Per-frame steady state from timestamped progress lines:
  - frames 1→10: 0.40 s/frame;
  - frames 10→30: 0.53 s/frame;
  - frames 30→60: 0.77 s/frame.
  - Cost rises as the camera dollies in and the phone (MeshPhysicalMaterial) covers more pixels.
- 22:05, run **B** (MEASURED, partial). Core post (DOF + Bloom + Vignette + AgX ToneMapping, `multisampling=4`), c1. The container restarted at frame 16/60, about 32 s into the log. Per-frame cost was 1.79 s/frame over frames 1→16 (1.95 s for frames 1→10 including warm-up; about 1.5 s for frames 12→16). It is re-run below.

## PENDENTE / NÃO PESQUISADO
- (filled at the end)
