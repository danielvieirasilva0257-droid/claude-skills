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
- 2026-10-09 06:00, environment note (MEASURED). After a container restart, other researchers' jobs shared the 4 CPUs: `node tools/render.mjs ...` with Chrome, `piper_bench.py`, and a Chrome renderer at about 90% CPU. Load average reached 8.4. Re-running B under this load gave about 3.5–4.9 s/frame, against about 1.5–1.9 s/frame before the restart. From here on every run goes through `r2/runner.py`. It records wall time, the CPU-seconds of my own process tree (as child subreaper, via `RUSAGE_CHILDREN`) and the CPU-seconds used by all other processes during the run (from `/proc/stat`).
- DOCS (online, 2026-10-09):
  - "Using a video as a texture in Three.js" — [Remotion docs](https://www.remotion.dev/docs/videos/as-threejs-texture):
    - The recommended route is `@remotion/media` `<Video headless onVideoFrame>` drawing into an `OffscreenCanvas` → `THREE.CanvasTexture`. It is marked available from 4.0.387.
    - "During rendering, <ThreeCanvas> sets `frameloop='never'`". "Use `advance()` inside `onVideoFrame` to synchronously re-render the scene before the screenshot is taken."
    - "Using `invalidate()` would only schedule an asynchronous re-render, which can lead to stale frames ... especially with concurrency greater than 1."
    - A code comment says the second `advance()` is needed because frame extraction resolves after the canvas has already rendered with the stale texture.
    - `useOffthreadVideoTexture()` and `useVideoTexture()` are both marked "deprecated in favor of using `@remotion/media`". Reasons given for useOffthreadVideoTexture: it needs the whole video downloaded first, does not work in client-side rendering, and "creates a new texture for each frame". For useVideoTexture: it "has all the drawbacks of the <Html5Video> tag".
  - [ThreeCanvas docs](https://www.remotion.dev/docs/three-canvas): "During rendering, `<ThreeCanvas>` overrides the `frameloop` prop to `'never'` regardless of what you pass." For asynchronous texture updates, use `advance(performance.now())` instead of `invalidate()`.
  - The `remotion-dev/template-three` code cloned on 2026-10-08 (`src/Phone.tsx`) still calls **`invalidate()`** in `onVideoFrame`. That is the pattern the docs say "can lead to stale frames", and it is tested below as mode `media`.
  - [Blender requirements](https://www.blender.org/download/requirements/): the minimum GPU is "OpenGL 4.3, Vulkan 1.3" with GL_ARB_shader_draw_parameters and GL_ARB_clip_control. Software GPUs are not mentioned.
  - `blender --help` (5.2.2 LTS, MEASURED): `--gpu-backend` accepts 'opengl' or 'vulkan'.

## PENDENTE / NÃO PESQUISADO
- (filled at the end)
