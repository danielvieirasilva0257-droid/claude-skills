# 3D round 2: measured feasibility of real 3D phone shots (Remotion R3F and Blender) in a 4-CPU, no-GPU Linux container

**Status:** COMPLETE for the four key questions. Idle re-runs were added at the end (06:57–07:06). Caveats are listed in PENDENTE.

**How to read:**
- **MEASURED** = my own experiment in this container, 2026-10-08 22:04 and 2026-10-09 05:58–07:06 UTC, with exact versions and commands.
- **DOCS/SOURCE** = a claim from an official page or a package's source code, with a link.
- Everything else is marked as an inference.

**Machine:** 4 vCPU, 15 GB RAM, no GPU.
- Chromium headless shell from Playwright build 1194 (Chrome 141).
- Mesa 25.2.8 GLX/llvmpipe and Xvfb are installed. There is **no libEGL** and no lavapipe.
- Node 22, ffmpeg 6.1.

**Stack:**
- `remotion`, `@remotion/cli`, `@remotion/three` and `@remotion/media` 4.0.534.
- React 18.3.1, three 0.170.0, @react-three/fiber 8.18.0, @react-three/drei 9.122.0.
- @react-three/postprocessing 2.19.1, postprocessing 6.39.5.
- Blender **5.2.2 LTS** (Linux x64 tarball).

**Files:** `$S` = `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/3d/`. The session scratchpad may be deleted.
- Remotion test project: `$S/r3f-latest`. Scene: `src/PhoneScene.tsx`. Bundles: `build/` is the original bundle; `build2/` has the two fixes.
- Scripts and logs in `$S/r2/`: `bench3.sh`, `bench4.sh`, `runner.py`, `blank_check.py`, `sync_tiles.sh`, `phone_scene.py` (Blender), `bench3.log`, `blender.log`, `logs/`.
- Outputs: `out/*.mp4` and `stills/`.

**IMPORTANT caveat on timings.** The container restarted at 05:56. From then on, other researchers' jobs shared the 4 CPUs: Chrome renders, TTS/ASR benchmarks such as `piper_bench.py`, `cbx_bench.py` and `asr_check.py`. They used **28–89% of the 4 cores** during my runs, and load average reached 28.
- Every run therefore went through `r2/runner.py`. It records wall time, the CPU-seconds of my own process tree (as child subreaper, via `RUSAGE_CHILDREN`) and the CPU-seconds of all other processes (from `/proc/stat`).
- **CPU-seconds are the robust number.** Contended wall times are pessimistic.
- Clean idle wall times exist for:
  - run A and the first 16 frames of run B, on 2026-10-08 22:04–22:06 before the restart;
  - the **idle re-runs B2, D2, A4, C4 and CY64B on 2026-10-09 06:57–07:06**, when other processes used only 3–4% of the CPUs.
  - The current host was about 15% slower than the pre-restart one (no-post 0.76 against 0.67 s/frame), on an Intel Xeon @ 2.80 GHz vCPU.
- Effective parallelism of Remotion + SwiftShader on the idle machine was **about 2.9–3.1 cores**: A4 164.2 CPU-s / 52.7 s; B2 539.2 / 187.3. CPU-s measured under contention were somewhat lower for the same work (B 486 against B2 539), so they are only a rough proxy for idle cost.
- I could not kill an orphaned render because the auto-mode classifier blocked `kill` on PIDs it could not attribute; it finished on its own.

## 1. Remotion 4.0.534: 60-frame 1080×1920 phone scene WITH vs WITHOUT post-processing (Bloom + DepthOfField + Vignette + ToneMapping), `--concurrency` 1 vs 2, `--gl=swangle`: s/frame and extrapolation to 1,800 frames

### Takeaway
Idle measurements, all in steady state over frames 10→59:
- **Without post:** the R3F phone scene renders at **0.67–0.76 s/frame**, so **1,800 frames take about 20–23 min**. The range is 14–26 min depending on how much of the frame the phone fills.
- **With the 4-effect post chain:** **2.89 s/frame** (B2, 60 frames in 187 s), **about 3.8× the no-post per-frame cost**. **1,800 frames take about 87 min** (about 1.5 h). The pre-restart host was faster and gave 1.8–1.95 s/frame for frames 1→16, which would be about 55–60 min.
- **`--concurrency=2` gave no speed-up**, measured idle and under load, with and without post: 2–6% slower and 1–9% more CPU. Use c1.

**Found and fixed:** an intermittent **blank frame 0**, in 3 of 9 renders, caused by ThreeCanvas 4.0.534 itself.

### Cited Findings
- **MEASURED, run table.** All runs: Phone composition, 1080×1920, 30 fps, 60 frames (`--frames=0-59`), `--gl=swangle`, h264, Playwright headless shell unless noted.

| Run | Config | Wall | My CPU | Others' share of 4 cores | Notes |
|---|---|---|---|---|---|
| A (idle, 10-08 22:04) | no post, static PNG screen, c1 | **45.2 s** | n/a | ≈0 (idle) | 0.40 / 0.53 / 0.77 s/frame for frames 1→10 / 10→30 / 30→60 |
| **A4 (idle, 10-09 07:04)** | no post, PNG, c1, `build2` | **52.7 s** | 164.2 s | 3% | **0.46 / 0.64 / 0.85 s/frame**; 10→59: **0.76** |
| **C4 (idle)** | no post, PNG, **c2** | **54.1 s** | 175.8 s | 3% | 10→59: 0.76 s/frame (no gain) |
| **B2 (idle, 06:57)** | **core post**, MSAA 4, PNG, c1, `build2` with frame-0 fix | **187.3 s** | 539.2 s | 3% | **2.78 / 2.79 / 2.96 s/frame**; 10→59: **2.89**; no blank frames |
| **D2 (idle)** | **core post**, MSAA 4, PNG, **c2**, `build2` | **193.2 s** | 566.3 s | 3% | 10→59: 2.92 s/frame (no gain); no blank frames |
| B partial (idle, 22:05) | core post, MSAA 4, c1 | stopped at frame 16 by the restart | n/a | ≈0 | **1.79 s/frame** for frames 1→16 (1.95 for 1→10; about 1.5 for 12→16) |
| A re-run | no post, PNG, c1 | 101.5 s | **150.7 s** | 63% | |
| A3 | no post, PNG, c1, **Remotion's Chrome Headless Shell 157** | 71.8 s | **151.2 s** | 46% | same CPU as the Playwright shell |
| C | no post, PNG, **c2** | 107.4 s | **158.2 s** | 63% | blank frame 0 |
| B re-run | **core post**, MSAA 4, PNG, c1 | 340.3 s | **486.0 s** | 64% | |
| D | **core post**, MSAA 4, PNG, **c2** | 335.7 s | **491.3 s** | 63% | blank frame 0 |
| B, orphaned first re-run | core post, c1 | log span 277.8 s | n/a | heavy | 4.54 s/frame for frames 10→60; blank frame 0 |
| E2 | no post, **JPEG-sequence screen** (fixed), c1, frame-0 fix | 122.3 s | **174.1 s** | 64% | exact sync |
| K | core post + broken sequence texture, c1 | 324.8 s | 498.6 s | 60% | |
| K2 | **core post + JPEG-sequence screen**, **c2**, frame-0 fix | 235.5 s | **545.4 s** | 28% | exact sync, no blank frames |

- **MEASURED, core post chain** (`src/PhoneScene.tsx`):
  - Composer: `<EffectComposer multisampling={4}>` containing `<DepthOfField target={[0,0,0]} focalLength={0.06} bokehScale={3}/>`, `<Bloom mipmapBlur luminanceThreshold={1} intensity={1.1}/>`, `<Vignette offset={0.3} darkness={0.65}/>` and `<ToneMapping mode={ToneMappingMode.AGX}/>`.
  - Canvas: `<ThreeCanvas flat gl={{antialias:false}}>`, so the composer does its own MSAA.
  - Without post: R3F defaults (antialias on, ACES).
- **MEASURED, exact command:**
  - `cd $S/r3f-latest && npx remotion bundle src/index.ts --out-dir=build2`
  - then `npx remotion render build2 Phone out.mp4 --gl=swangle --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --concurrency=1 --frames=0-59 --timeout=120000 --props='{"post":"core","shadows":false,"screen":"seq","msaa":4}'`
  - Each render invocation also pays about 8–12 s of fixed start-up (CLI, browser launch, bundle load, first-frame shader compilation). Round 1 measured 20 frames in 11.96 s.
- **MEASURED, concurrency:**
  - **Idle:** c2 against c1 was 54.1 against 52.7 s without post, and 193.2 against 187.3 s with post.
  - **Under the same contention:** 107.4 against 101.5 s without post, and 335.7 against 340.3 s with post.
  - CPU was 1–9% higher at c2.
  - SwiftShader already uses about 2.9–3.1 of the 4 cores at c1, so there is little headroom for a second tab.
- **MEASURED, per-frame cost depends on the shot.** Without post, cost rose from 0.40 to 0.77 s/frame as the camera dollied in and the phone (MeshPhysicalMaterial, HDRI) covered more pixels.
- **MEASURED + SOURCE, blank frame 0 (race):**
  - Detector `r2/blank_check.py`: mean luma of frames downscaled to 108×192 is below 8.
  - Unfixed bundle: frame 0 was blank in 3 of 9 renders (B 1/2, C 1/1, D 1/1, A 0/2, E/F/G 0/1). It happens with and without post, at c1 and c2. **Blank frames never appeared after frame 0.**
  - In `@remotion/three` 4.0.534 `dist/cjs/ThreeCanvas.js`, the per-frame `delayRender("Waiting for R3F to render frame N")` is skipped when `frame === 0` (`if (!isRendering || frame === 0) return;`). Frame 0 relies on `onCreated` → `state.advance()`, which runs before Suspense content mounts (drei `<Environment files>`, `useLoader` textures).
  - In addition, `@react-three/postprocessing` 2.19.1 `EffectComposer` calls `composer.setSize()` and sets `gl.toneMapping = NoToneMapping` in passive `useEffect`s. These run after ThreeCanvas's own `ManualFrameRenderer` `advance()`, because that renderer is an earlier sibling.
- **MEASURED, fix (no blank frames in E2, K2, I2, H2, I3, A3):**
  ```tsx
  // in the DOM-tree component that renders <ThreeCanvas> (never suspends, so the handle can't leak):
  const [firstHandle] = useState(() => delayRender('first R3F content frame'));
  // ...as the LAST child inside <ThreeCanvas>, after <Scene/> / <EffectComposer>:
  const FirstContentFrame: React.FC<{handle: number}> = ({handle}) => {
    const advance = useThree((s) => s.advance);
    useEffect(() => { advance(performance.now()); continueRender(handle); }, [advance, handle]);
    return null;
  };
  ```
  A first attempt took the `delayRender` inside a `useState` initializer of a component in the suspending subtree. That can leak a handle when React discards a suspended render, so it was replaced.
- **MEASURED, look issue:** the fullscreen `ToneMapping(AGX)` pass also tone-maps the phone UI even though the screen material has `toneMapped={false}`. The yellow badge turns beige and white text greys; compare `stills/A-png-none-c1_f30.png` with `stills/B-png-core-c1_f30.png`.
- **DOCS:** "During rendering, `<ThreeCanvas>` overrides the `frameloop` prop to `'never'` regardless of what you pass", and the scene is "only re-rendered on demand via `advance()`". — [Remotion: ThreeCanvas](https://www.remotion.dev/docs/three-canvas)
- **DOCS (from round 1):** for no GPU, "`swangle` is recommended. Rendering might be slow." — [Remotion: --gl options](https://www.remotion.dev/docs/gl-options). Round 1 measured that every `--gl` value ends up on SwiftShader here.

### Inferences
- **Extrapolation to 1,800 frames (60 s at 30 fps), single render at c1, idle machine.** Based on measured steady-state s/frame; add about 10 s start-up per render.
  - **No post:** 0.67–0.76 s/frame × 1,800 ≈ **20–23 min** (range 14–26 min). With the image-sequence screen texture (+about 0.12 s/frame) it is about **24–27 min**.
  - **Core post (DOF + Bloom + Vignette + AgX, MSAA 4):** 2.89 s/frame × 1,800 ≈ **87 min**. With the sequence texture, about 90 min. On the faster pre-restart host it would be about 55–60 min.
  - **`@remotion/media` + `advance()` + post:** about 2× that, ≈ 3 h (M2).
  - **Under contention like today's** (others using about 60% of the CPUs), multiply by about 2 (A: 101.5 s against 45–53 s).
- My earlier CPU-based estimate for post (1.8–2.4 s/frame) was too optimistic. With idle cores, SwiftShader burned more CPU per frame (539 against 486 CPU-s for the same render), so CPU-seconds measured under contention are only a rough proxy.
- Practical budget: render the 3D shots **as separate segments** (a 3–5 s hero shot, 90–150 frames, takes about 4.5–7.5 min with post and about 1–2 min without). Use post only where it pays off, and keep the rest of the 60 s in 2D/DOM (round 1: about 0.2 s/frame).
- Neither `--gl` nor the browser (A3) changes cost; **concurrency should stay at 1**.
- For brand-accurate UI under post, use `ToneMappingMode.NEUTRAL`, drop the tone-mapping pass, or reduce exposure (untested).

### Gaps
- Idle 60-frame runs exist (A/A4/C4/B2/D2), but **no full 1,800-frame render** was attempted, so memory growth and leaks over long renders are unknown. The texture-mode runs (E2, K2, I2, I3, M2) have only contended or CPU-based costs.
- Per-effect cost (DOF vs Bloom vs MSAA 4) and `resolutionScale` / half-resolution effects were not isolated.

## 2. Screen texture on 4.0.534: (a) pre-rendered image sequence (`staticFile` JPEG per frame) vs (b) `useOffthreadVideoTexture` / `useVideoTexture` with an MP4, plus the documented `@remotion/media` route

### Takeaway
**(a) The JPEG image sequence works, with exact frame sync and the lowest cost:** +0.39 CPU-s/frame, single render per frame. It needs two gotchas handled: a full-size placeholder texture, and the frame-0 fix.

**(b) Both hooks failed here and are deprecated in the docs.**
- `useOffthreadVideoTexture` shows a uniform grey screen.
- `useVideoTexture` + `<Html5Video>` timed out because the Playwright Chromium cannot decode H.264.

**The documented `@remotion/media` route works with exact sync**: `<Video headless onVideoFrame>` → `CanvasTexture` + `advance()`. It needs a codec the browser can decode: VP9 WebM, or H.264 with Remotion's own Chrome Headless Shell. It costs about 2× the CPU of the sequence route because of decode plus a second render per frame.

**The template-three pattern, which calls `invalidate()`, gave stale frames** (29 shown at frame 30) and an empty frame 0.

### Cited Findings
- **MEASURED, sync test method:** the Screen composition (1080×2340) shows its own frame number in a big yellow badge. Tiles of output frames 0/1/2/30/59 are cropped around the badge (`r2/sync_tiles.sh`, outputs `stills/<run>_sync.jpg`).
- **MEASURED, asset prep for (a):**
  - `npx remotion render build Screen public/seq --sequence --image-format=jpeg --jpeg-quality=92 --browser-executable=$BX` → 60 files `element-00.jpeg … element-59.jpeg` in **5.9 s**, 5.6 MB (about 93 KB/frame, so about 170 MB for 1,800 frames).
  - The h264 MP4 of the same composition took 9.9 s. VP9 WebM via `ffmpeg -i screen.mp4 -c:v libvpx-vp9 -b:v 6M -deadline realtime -cpu-used 8 -row-mt 1 screen.webm` took 4.2 s.
- **MEASURED, (a) working pattern** (`SeqScreen` in `src/PhoneScene.tsx`, run E2):
  - One stable `THREE.Texture`, created on a **1080×2340 placeholder canvas**.
  - Frames are prefetched 4 ahead with `new Image(); img.src = staticFile('seq/element-NN.jpeg'); img.decode()`.
  - In `useLayoutEffect([idx])`: on a cache hit, set `texture.image = img; texture.needsUpdate = true` synchronously, and ThreeCanvas's own `advance()` draws it (one draw per frame). On a miss, `delayRender` → decode → set image → `advance(performance.now())` → `continueRender`.
  - E2 result: **badges 00/01/02/30/59 exactly** (`stills/E2-seqfix-none-c1_sync.jpg`), 174.1 CPU-s against 150.7 for a static PNG = **+0.39 CPU-s/frame**.
  - With post at c2 (K2): exact sync, +0.9 CPU-s/frame against PNG + post (D).
- **MEASURED, gotcha 1 (run E, first version):** with a 2×2 placeholder the phone screen stayed **black on every frame**. On WebGL2, three.js allocates immutable storage (`texStorage2D`) on the first upload, so the 1080×2340 frames could not be uploaded into it. The placeholder must match the frame size, or call `texture.dispose()` before changing size.
- **MEASURED, gotcha 2:** the frame-0 race described in section 1. Fix: `FirstContentFrame`.
- **MEASURED, (b1) `useOffthreadVideoTexture({src: staticFile('screen.mp4')})`, run F:** frame 0 showed the null-texture colour, and frames 1–59 a **uniform light-grey screen with no UI** (`stills/F_f30.jpg`).
  - Holding each frame until the new texture committed, then calling `advance()` (run G), gave the same grey result at 271.7 against 160.6 CPU-s.
  - Run OD, a DOM-only `<OffthreadVideo src={staticFile('screen.mp4')}/>` still at frame 30, was **correct** (`stills/OD_offthreadvideo_dom_f30.png`). So frame extraction works and the hook's texture path fails. Not debugged further.
- **MEASURED, (b2) `useVideoTexture(ref)` + `<Html5Video ref src=screen.mp4>`, run J:** failed with `A delayRender() "Waiting for texture in useVideoTexture() to be loaded" was called but not cleared after 118000ms`, consistent with H.264 not decodable in the Playwright shell. Not re-tested with WebM.
- **MEASURED, `@remotion/media` route on the Playwright shell + H.264 (runs H, I):** both crashed at frame 0.
  - The log shows `[@remotion/media] Cannot decode /public/screen.mp4, falling back to <OffthreadVideo>`, then `Error: R3F: Img is not part of the THREE namespace!`.
  - The fallback renders an `<Img>` inside the R3F tree.
- **MEASURED, `@remotion/media` + `advance()` with VP9 WebM (run I2):** **exact sync** (00/01/02/30/59), 352.7 CPU-s, **about 2× the sequence route**.
- **MEASURED, the same with H.264 on Remotion's Chrome Headless Shell (run I3):**
  - The shell came from `npx remotion browser ensure`: version `157.0.8080.0-remotion-v3`, 98.9 MB, downloaded in 6 s into `node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell`.
  - Result: **no decode error, exact sync**, 328.7 CPU-s.
- **MEASURED, template-three `invalidate()` pattern with WebM (run H2):**
  - Frame 0's screen was empty, frames 1–2 happened to be correct, and **frames 30 and 59 showed 29 and 58** (`stills/I2_top_H2_bottom_sync.jpg`, I2 on top).
  - 228.3 CPU-s. The I2 − H2 difference of 124 CPU-s, about 2 CPU-s/frame, is the cost of the second render.
- **MEASURED, `@remotion/media` + `advance()` + core post at c2 (run M2), VP9 WebM, almost uncontended (others used 10% of 4 cores):** **385.8 s wall, 1,079.7 CPU-s.**
  - Exact sync (`stills/M2-mediaadv-corefix-c2_sync.jpg`), no blank frames.
  - **That is 2.0× the CPU of the sequence route with the same post and concurrency** (K2: 545.4 CPU-s). The second `advance()` per frame re-runs the whole EffectComposer chain.
  - As wall time on a nearly idle machine, it is about 6.4 s/frame, i.e. about 3.2 h for 1,800 frames.
- **DOCS:**
  - "We recommend that you mount a <Video> tag in headless mode and use the onVideoFrame prop"; it is available from 4.0.387.
  - "Use `advance()` inside `onVideoFrame` to synchronously re-render the scene before the screenshot is taken. Using `invalidate()` would only schedule an asynchronous re-render, which can lead to stale frames ... especially with concurrency greater than 1."
  - `useOffthreadVideoTexture()` and `useVideoTexture()` are both "deprecated in favor of using `@remotion/media`". The former "creates a new texture for each frame" and "requires the whole video to be downloaded to disk first".
  - — [Remotion: Using a video as a texture in Three.js](https://www.remotion.dev/docs/videos/as-threejs-texture)
- **SOURCE:** `remotion-dev/template-three` `src/Phone.tsx`, cloned 2026-10-08, still calls `invalidate()` in `onVideoFrame`. — [remotion-dev/template-three](https://github.com/remotion-dev/template-three)
- **DOCS:** earlier Remotion versions downloaded "the free version of Chromium, which would not include codecs for the proprietary H.264 and H.265 codecs", and Remotion moved to Chrome Headless Shell. — [Remotion: Installing Chrome v4.0.247](https://remotion.dev/docs/miscellaneous/thorium-browser)

### Inferences
- **Recommended for the promo:** keep every app screen as a Remotion composition, render it to a JPEG sequence (about 6 s per 60 frames), and map it with the `SeqScreen` pattern. It is deterministic, single-render, the cheapest option, and browser-independent.
- Use `@remotion/media` `<Video headless onVideoFrame>` + `advance()` only when the source is a real screen recording. It needs VP9/WebM, or Remotion's own Chrome Headless Shell for H.264. With post it renders the expensive chain twice per frame: measured 2.0× the CPU of the sequence route (M2 against K2).
- **Do not use the template-three `invalidate()` code as is.**
- In the real project, run `npx remotion browser ensure` and drop `--browser-executable` pointing at the Playwright shell, so H.264 assets work. A3 showed the same 3D cost on both browsers.

### Gaps
- Root cause of the `useOffthreadVideoTexture` grey screen; `useVideoTexture` with WebM; the prefetch cache hit rate (not logged); PNG sequence against JPEG quality and cost; memory use over 1,800-frame sequences.

## 3. Blender 5.2.2 headless (`blender -b -P script.py`): Eevee without GPU/display; Cycles CPU 64 spp + OIDN; extrapolation to a 3–5 s hero shot

### Takeaway
- **Plain `blender -b` with Eevee fails here** (`Couldn't open libEGL.so.1`, SIGABRT).
- **Eevee works under `xvfb-run` + Mesa llvmpipe (GLX)**, but on CPU it is **not cheaper than Cycles**: 85 CPU-s/frame at 16 samples, 343 at 64.
- The Vulkan backend on Chromium's SwiftShader is rejected for missing features.
- **Cycles CPU + OpenImageDenoise** at 1080×1920:
  - **45.8 s/frame at 64 spp, measured idle** (CY64B);
  - about **20 / 27 s/frame at 16 / 32 spp** (from 73 / 100 CPU-s at about 3.7 effective cores).
- A **3–5 s hero shot (90–150 frames)** therefore takes about **30–50 min at 16 spp, 40–68 min at 32 spp, or 69–115 min at 64 spp**.
- Per frame that is about 7–16× slower than R3F with post (2.9 s/frame) and 26–60× slower than R3F without post.
- Quality: a clean "product render" look. 16 spp + OIDN is nearly indistinguishable from 64 spp in this scene.

### Cited Findings
- **MEASURED, scene:** `$S/r2/phone_scene.py` (bpy, 5.2.2).
  - Extruded rounded-rectangle phone with a 0.03 bevel modifier (angle-limited), titanium Principled sides and black-glass caps, camera bump with 3 lenses.
  - Emission screen with an image texture (`screen.png`, strength 1.5), 5 gold coins, an emissive ring.
  - Poly Haven `studio_small_09` 1k HDRI for lighting and reflections, with a dark #07070b background for camera rays (Light Path mix).
  - Area key light, AgX view transform, camera DOF at f/1.4, 1080×1920.
  - Coordinates match the R3F scene: three.js space under a +90° X root; Euler mode `ZYX` matches three's 'XYZ'.
  - Usage: `blender -b --factory-startup -P phone_scene.py -- <CYCLES|EEVEE> <samples> <out> [frames] [denoise]`.
  - In 5.2.2 the engine enum shows only `BLENDER_EEVEE`; Cycles is an add-on, but `scene.render.engine='CYCLES'` works.
  - Background mode prints no per-sample progress, so the script prints timestamped `bpy.app.handlers.render_stats` stage changes.
- **MEASURED, Blender runs:**

| Run | Engine / settings (1080×1920) | Render time | My CPU | Others' share (contention) | Notes |
|---|---|---|---|---|---|
| EVB | Eevee, plain `blender -b` | abort after 1.7 s | n/a | n/a | `Couldn't open libEGL.so.1: libEGL.so.1: cannot open shared object file` |
| EVX | Eevee 64 samples, `xvfb-run -a -s "-screen 0 1920x1080x24" blender -b ...` | **296.4 s** | **343.1 s** | 71% | **works** (GLX → Mesa llvmpipe) |
| EVX3 | Eevee 16 samples, 3 frames, Xvfb | 56.6 / 69.4 / 64.6 s per frame | **256.4 s (≈85/frame)** | 66% | time before first sample: 11.0 s on frame 1 (shaders), 5.6–7.6 s after |
| EVV | Eevee, `VK_ICD_FILENAMES=.../vk_swiftshader_icd.json blender -b --gpu-backend vulkan` | abort after 1.2 s | n/a | n/a | "SwiftShader Device ... does not meet minimum requirements. Missing features are [geometry shaders, multi viewport, logical operations, dual source blending, shader draw parameters]", then the libEGL abort |
| CY64 | Cycles CPU 64 spp + OIDN, 1 frame | **184.3 s** | **190.9 s** | 74% | `stills/blender_cycles64.png` |
| **CY64B (idle, 07:04)** | Cycles CPU 64 spp + OIDN, 1 frame | **45.8 s** (process 47.6 s) | **174.3 s** | 4% | **clean idle number**; 1.1 s before the first sample; about 3.7 effective cores |
| CYANIM | Cycles CPU 32 spp + OIDN, 4 frames, persistent data | 74.9 / 74.4 / 72.8 / 80.6 s per frame | **402.1 s (≈100/frame)** | 67% | frame 1 setup 2.1 s (light tree), later re-sync about 0.06 s; save 0.4–1 s |
| CY16 | Cycles CPU 16 spp + OIDN, 1 frame | 60.6 s | **78.1 s** | 68% | nearly identical to 64 spp |
| smoke | Cycles 1 spp, 10% resolution, cold start | 42.6 s render, about 105 s process | n/a | heavy | cold-cache start-up is expensive |

- **DOCS:** Blender's minimum GPU requirement is "OpenGL 4.3, Vulkan 1.3", with mandatory GL_ARB_shader_draw_parameters and GL_ARB_clip_control. Software GPUs are not mentioned. — [Blender requirements](https://www.blender.org/download/requirements/)
- **MEASURED (`blender --help`, 5.2.2):** `--gpu-backend` accepts 'opengl' or 'vulkan'. The manual lists `--gpu-backend` under command-line arguments. — [Blender manual: command line arguments](https://docs.blender.org/manual/de/latest/advanced/command_line/arguments.html)
- **SOURCE:** a Blender commit from August 2022, "Introduce headless OpenGL rendering on Linux", makes `-b` retry with EGL's Mesa surfaceless platform. That path needs libEGL, which is missing here. — [bf-blender-cvs 2022-08](https://lists.blender.org/pipermail/bf-blender-cvs/2022-August/176810.html)
- **FORUM (Blender 2.8 era):** Eevee via `xvfb-run` + Mesa llvmpipe works "but is super slow". — [devtalk.blender.org](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436)

### Inferences
- **Idle-machine numbers:**
  - Cycles 64 spp + OIDN is **45.8 s/frame, measured**.
  - Cycles 16 / 32 spp are about 20 / 27 s/frame, scaled from their CPU-s at the measured 3.7 effective cores.
  - Eevee/llvmpipe at 16 / 64 samples is about 23–28 / 94–115 s/frame. This assumes llvmpipe uses 3–3.7 cores; not measured idle.
- **3–5 s hero shot at 30 fps (90–150 frames):**
  - Cycles 16 spp ≈ 30–50 min; 32 spp ≈ 40–68 min; 64 spp ≈ 69–115 min.
  - Eevee 16 ≈ 35–70 min.
  - About 2–4× longer under today's kind of shared load (CY64 took 184 s contended against 46 s idle).
  - For comparison, R3F takes about 4.5–7.5 min for the same shot with post and 1–2 min without.
- Cost model: about 2.3–3 CPU-s per sample-frame plus about 30–35 CPU-s fixed per frame (OIDN at 1080×1920, sync, save).
- Practical Blender route, if used at all: Cycles CPU at 16–32 spp + OIDN, `use_persistent_data`, run in the background for at most 1–2 hero shots, and composite into Remotion.
  - For the composite, use `film_transparent` + PNG sequence, or the screen baked in as here. This is untested.
  - Installing `libegl1 libegl-mesa0` would probably let plain `-b` Eevee use EGL surfaceless (same llvmpipe speed). Untested.
- blender-mcp is GUI-bound (round 1), so headless `blender -b -P script.py` with Claude-written bpy is the workable automation.

### Gaps
- Only Cycles 64 spp was timed on an idle machine (CY64B). Eevee/llvmpipe and Cycles 16/32 spp were timed under 66–74% contention, and their idle numbers are scaled from CPU-s.
- Not tested:
  - Mesa lavapipe (`mesa-vulkan-drivers`) for the Vulkan backend;
  - the libEGL install;
  - Blender motion blur and DOF cost isolation;
  - OIDN temporal flicker across an animated sequence (only 4 frames were rendered);
  - the alpha round-trip into Remotion.

## 4. Visual quality comparison (stills saved in `$S/r2/stills/`)

### Takeaway
At equal framing, **Cycles and Eevee give the most "real product render" look**: physically based reflections, clean edges and accurate screen colours. **R3F without post is crisp but plainly CG.** **R3F with the core post chain looks the most "motion-design"**, with glow, DOF and vignette, but AgX tone mapping washes out the UI colours. For a promo where the app UI must read clearly, R3F, with or without light post, is good enough at a fraction of the cost. Blender is only justified for one or two hero product beauty shots.

### Cited Findings
- **MEASURED, R3F no post, frame 30** (`A-png-none-c1_f30.png`; tiles 0/30/59 in `A_tiles.jpg`):
  - Sharp UI with exact colours (`toneMapped={false}` screen) and a plausible titanium frame from the HDRI.
  - Gold coins; the HDR ring clips to flat white without bloom. A clean but synthetic look.
- **MEASURED, R3F core post, frame 30** (`B-png-core-c1_f30.png`; `B_tiles.jpg`): purple bloom halo on the ring, DOF blur on coins and off-focus screen corners, vignette, an AgX filmic look. The UI is desaturated: yellow badge turns beige, text slightly grey.
- **MEASURED, Cycles 64 spp + OIDN** (`blender_cycles64.png`):
  - Noise-free, soft realistic reflections and chrome-edge highlights; the screen is crisp.
  - The emissive ring shows no bloom (none without the compositor).
  - Coins fell out of frame in the still (Z-up/Y-up mapping in my script); they are visible in `cyanim_0001.png`.
- **MEASURED, Cycles 16 against 64 spp** (`cycles16_vs_64_crop.jpg`): practically identical, apart from slight OIDN blotching in the dark dynamic-island area.
- **MEASURED, Eevee 64 under llvmpipe** (`blender_eevee_xvfb.png`) and **Eevee 16** (`evanim_000{1,2,3}.png`; crop against Cycles 32 in `eevee16_vs_cycles32_f3_crop.jpg`): very close to Cycles. The dynamic-island pill renders light grey instead of black. No visible noise at 16 samples.
- **MEASURED, sync tiles:**
  - Correct: `E2-seqfix-none-c1_sync.jpg`, `K2-seqfix-core-c2_sync.jpg`, `I3-mediaadv-h264-cft-none-c1_sync.jpg`, and `I2_top_H2_bottom_sync.jpg` (top half).
  - Broken: H2 in the bottom half of the same file (stale), and F/G (grey).

### Inferences
- The fidelity gap between R3F and Cycles is mostly lighting realism and highlight rolloff. For a fast vertical promo with motion and UI focus, it is less important than UI legibility and timing.
- A light, UI-safe post (Bloom on emissives only, mild vignette, a neutral or no tone-mapping pass, DOF focused on the screen plane) is the best value. This is untested as a combination.

### Gaps
- No side-by-side at exactly matched camera/animation frames across all engines: the Blender stills use frame 30 of the R3F move, but its coins differ. No motion-blur comparison. No viewer or A/B preference test.

## PENDENTE / NÃO PESQUISADO
- [x] Clean idle timings for R3F no post / post at c1 and c2, and for Cycles 64 spp (B2, D2, A4, C4, CY64B; 06:57–07:06, others ≤ 4%).
- [ ] Still contended or estimated: Eevee/llvmpipe, Cycles 16/32 spp, and the texture-mode runs (E2, K2, I2, I3, M2) as wall times. Their CPU-s and correctness are measured.
- [ ] **Full-length 1,800-frame render** (memory, leaks, stability) of the R3F scene, with and without post; and real per-frame cost for a promo-like shot mix.
- [ ] Per-effect post cost (DOF / Bloom / MSAA 4 / ToneMapping) and effect `resolutionScale`; a UI-safe post preset (NEUTRAL tone mapping or none).
- [ ] Root cause of the `useOffthreadVideoTexture` grey screen; `useVideoTexture` with WebM. Both are deprecated, so this is low priority.
- [ ] Mesa lavapipe (`apt-get install mesa-vulkan-drivers`) for Blender's Vulkan backend, and `libegl1 libegl-mesa0` for plain `-b` Eevee. Both untested; they would not make Eevee faster than llvmpipe.
- [ ] Blender: alpha round-trip into Remotion (`film_transparent` → PNG sequence or ProRes 4444 → `<OffthreadVideo transparent>`); OIDN temporal flicker over a longer sequence; motion blur cost.
- [ ] Still open from round 1: Spline, Rotato/Previewed, AI video B-roll, Sketchfab/Poly Pizza licensing, AI 3D generators, 3D icon packs, Remotion release that introduced `ManualFrameRenderer`.

## Resumo (3 linhas)
1. Remotion 4.0.534 + R3F on CPU (SwiftShader), measured idle: about 0.7–0.76 s/frame without post (≈20–23 min per 1,800 frames) and 2.9 s/frame with Bloom + DOF + Vignette + ToneMapping (≈87 min). `--concurrency=2` gives no gain. Fix the intermittent blank frame 0 with `FirstContentFrame`.
2. App screen on the 3D phone: the JPEG image sequence (`staticFile` per frame, full-size placeholder, prefetch) gives exact sync at +0.39 CPU-s/frame. `@remotion/media` + `advance()` also works (VP9, or H.264 with Remotion's Chrome Headless Shell) at about 2× the cost. The deprecated hooks and template-three's `invalidate()` failed or gave stale frames.
3. Blender 5.2.2 headless: Eevee only via `xvfb-run` + llvmpipe and no cheaper than Cycles. Cycles CPU + OIDN costs about 20/27/46 s/frame at 16/32/64 spp (64 measured idle), so a 3–5 s hero shot takes about 30–115 min against 4.5–7.5 min in R3F with post. Use it for at most 1–2 hero shots.
