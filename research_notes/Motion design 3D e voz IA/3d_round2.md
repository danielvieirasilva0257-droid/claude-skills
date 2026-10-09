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
- 06:04, orphaned run **B** finished (MEASURED). The killed batch's render could not be stopped: the auto-mode classifier blocked `kill`, so it ran to completion under heavy shared load. **Timing is contaminated**: 60 frames, log span 277.8 s, 4.54 s/frame for frames 10→60.
  - **Bug found: frame 0 of B is blank.** Its mean luma is 6.0 against 44–48 for frames 1+. A blank-frame detector (mean luma < 8 on frames downscaled to 108×192 via ffmpeg + numpy) finds only frame 0. Frames 1–59 are correct: purple bloom on the HDR ring, DOF on the coins, vignette, AgX. Run A (no post) has no blank frames.
  - Cause, read in source:
    - In `@react-three/postprocessing` 2.19.1 (`dist/EffectComposer.js`), `composer.setSize(size.width, size.height)` and `gl.toneMapping = NoToneMapping` both run in passive `useEffect`s.
    - ThreeCanvas 4.0.534 renders its `ManualFrameRenderer` as an earlier sibling of the scene children, so its `useEffect` → `advance()` runs first, before the composer is sized.
    - Frames > 0 are fine because the composer is already sized.
  - Fix written: an `<AdvanceAfterMount/>` placed after `<EffectComposer>`. It takes a `delayRender` in a `useState` initializer, and in `useEffect` calls `advance(performance.now())` and then `continueRender`. Being a later sibling, its effect runs after the composer's. Verification is queued (runs K2/B2).
- 06:06, run **E** (sequence texture, no post, c1), MEASURED. 72.0 s wall, my-tree CPU 150.6 s, other processes 39% of the 4 cores. **The screen stayed black on every frame.** The cause is my own test code, not Remotion: the swap texture was seeded with a 2×2 canvas. On WebGL2, three.js allocates immutable storage with `texStorage2D` on the first upload, so the later 1080×2340 images cannot be uploaded into it. Fix: seed with a placeholder of the same size as the frames (1080×2340 canvas). The re-test is run **E2**.
- 06:08, run **F** (raw `useOffthreadVideoTexture({src: staticFile('screen.mp4')})`, no post, c1, 4.0.534), MEASURED. 121.8 s wall, my-tree CPU 160.6 s, others 40% of 4 cores.
  - **FAILED visually.** Frame 0 shows the null-texture fallback colour. Frames 1–59 show a uniform light-grey screen (about #e6e6e6) with no UI at all; still `r2/stills/F_f30.jpg`, tiles `r2/stills/F-offthread-none-c1_sync.jpg`.
  - This is the same "washed-out grey" symptom round 1 saw on 4.0.250 with post. The hook is deprecated in the docs; I did not debug the root cause.
- 06:11, run **G** (`useOffthreadVideoTexture` + my per-frame hold), MEASURED. A per-frame `delayRender` in `useLayoutEffect([frame])`, then `advance()` + `continueRender` in `useEffect([tex])` once the new texture is committed. 181.0 s wall, my-tree CPU 271.7 s, against 160.6 s for F, because of the extra draw per frame. **Same grey screen as F.** So the problem is the texture content, not the timing. Not debugged further; the hook is deprecated.
- 06:11–06:12, runs **H** (template-three pattern: `@remotion/media` `<Video headless onVideoFrame>` + `invalidate()`) and **I** (same, with `advance()`), MEASURED. Both **crashed at frame 0**.
  - The log shows `[@remotion/media] Cannot decode /public/screen.mp4, falling back to <OffthreadVideo>`, then `Error: R3F: Img is not part of the THREE namespace!`. The `<OffthreadVideo>` fallback renders an `<Img>`, which cannot exist inside the R3F reconciler tree.
  - Interpretation: the Playwright Chromium headless shell (open-source Chromium build 141) cannot decode **H.264** with WebCodecs, probably because proprietary codecs are not included; this is not yet cited.
  - Re-test with a **VP9 WebM** source: `ffmpeg -i screen.mp4 -c:v libvpx-vp9 -b:v 6M -deadline realtime -cpu-used 8 -row-mt 1 screen.webm` took 4.2 s for 60 frames at 1080×2340. These are runs **H2/I2**.
- 06:15, run **J** (`useVideoTexture(ref)` + `<Html5Video ref src=screen.mp4>`), MEASURED. **Failed (timeout):** `A delayRender() "Waiting for texture in useVideoTexture() to be loaded" was called but not cleared after 118000ms`. The `<video>` element never fired `loadeddata`, which fits the missing H.264 decoder. Not re-tested with WebM, since the hook is deprecated.
- 06:12, Blender **EVB**: Eevee with plain `blender -b --factory-startup -P phone_scene.py` (no display), MEASURED. **Aborted (SIGABRT) after 1.7 s** with `Couldn't open libEGL.so.1: libEGL.so.1: cannot open shared object file`. Blender 5.2.2's headless GPU path needs libEGL, which this container does not have (only libGL/libGLX + Mesa GLX). Next tries: Xvfb + GLX (Mesa llvmpipe), and Vulkan via Chromium's SwiftShader ICD.
- Blender smoke test (MEASURED): Cycles, 1 sample, 10% resolution (108×192), no denoise. Scene setup took 12.9 s, `render.render()` 42.6 s, and about 105 s from process start to saved PNG, all under heavy shared load. This is a large fixed overhead per Blender invocation (startup, image loading, BVH, kernel loading).
- 06:16, Blender **CY64** (MEASURED). Cycles CPU, 64 samples + OpenImageDenoise, 1080×1920, 1 frame, `blender -b --factory-startup -P r2/phone_scene.py -- CYCLES 64 <out> 1 1`.
  - `render.render()` took **184.3 s**; process wall time 186.3 s.
  - My CPU: 190.9 CPU-s. Other researchers' processes used **74% of the 4 cores** during the run (load average mean 15.5, max 28.9), so Blender effectively got about 1 core.
  - **Idle-machine estimate (inference, not measured):** about 190 CPU-s ÷ about 3.8 effective cores ≈ **50 s per frame**.
  - Still `r2/stills/blender_cycles64.png`: clean, noise-free, crisp screen texture, realistic chrome edge highlights. The emissive ring has no bloom (Cycles has none without the compositor). Coins fell out of frame because of my Z-up/Y-up cylinder mapping.
  - Blender 5.2 in background mode prints no per-sample progress, so I added a `bpy.app.handlers.render_stats` printer for later runs.
- Citation for the H.264 problem: Remotion's docs say earlier versions downloaded "the free version of Chromium, which would not include codecs for the proprietary H.264 and H.265 codecs", and that it moved to Chrome Headless Shell — [Remotion: Installing Chrome v4.0.247](https://remotion.dev/docs/miscellaneous/thorium-browser). The Playwright `chromium_headless_shell-1194` used here is an open-source Chromium build, which fits the `Cannot decode` result (inference).

## PENDENTE / NÃO PESQUISADO
- (filled at the end)
