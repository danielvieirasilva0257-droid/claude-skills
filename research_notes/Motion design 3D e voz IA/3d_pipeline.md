# Real 3D for Remotion promo videos (3D phone, camera moves, lighting, DOF, bloom) — feasibility in a 4-CPU / no-GPU Linux container

Research status: PARTIAL. The session was stopped early by the coordinator. The R3F experiments below were run; the Blender timing, the asset/licensing research, Spline and the AI-video alternatives were NOT done (see the final section "PENDENTE / NÃO PESQUISADO").

How to read these notes:
- **MEASURED** = my own experiment in this container (2026-10-08). Code is in `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/3d/r3f/` (session scratchpad, may disappear).
- **DOCS/SOURCE** = claim from an official page or package source, with link.
- Test machine: 4 vCPU, 15 GB RAM, no GPU. Chromium headless shell **141.0.7390.37** (Playwright build 1194). Mesa 25.2.8 `libgl1-mesa-dri` (llvmpipe) is present, there is no Mesa `libEGL`, and the Vulkan loader is present. The headless-shell folder ships ANGLE (`libEGL.so`, `libGLESv2.so`) plus **SwiftShader Vulkan** (`libvk_swiftshader.so`, `vk_swiftshader_icd.json`).
- **Caveat on all timings:** other researchers' processes (yt-dlp, curl, another node process) ran on the same machine at the same time, with load average about 3.7–4.1. Treat every number as noisy and probably pessimistic.

## 1. How @remotion/three works, the `--gl` options, and what works headless without a GPU

### Takeaway
In this container WebGL2 works headless. All six `--gl` values, and passing no flag, resolve to the same software backend: ANGLE → Vulkan → SwiftShader (CPU). So `--gl` does not matter here; `swangle` is the documented choice for no-GPU machines. The serious problem is speed and frame synchronisation in Remotion 4.0.250's `ThreeCanvas`. Current docs say `ThreeCanvas` forces `frameloop='never'` during rendering, but the 4.0.250 source does not. A 60-frame sequence render was much slower than single stills suggest.

### Cited Findings
- **DOCS:** `--gl` values are `null`, `angle`, `egl`, `swiftshader`, `vulkan` (from v4.0.41), `angle-egl` (from v4.0.52) and `swangle`. `null` ("lets Chrome decide") is the Remotion 4.0 default. The page says `angle` is the default "in Remotion 5.0". `swangle` is the default on Lambda/Cloud Run. — [Remotion: --gl options](https://www.remotion.dev/docs/gl-options)
- **DOCS:** Recommendations for WebGL/Three.js in 4.0: `angle` on desktop; `angle-egl` on a cloud instance with a GPU; for no GPU, "`swangle` is recommended. Rendering might be slow." — [Remotion: --gl options](https://www.remotion.dev/docs/gl-options)
- **DOCS:** "Memory leaks are a known problem with" `angle`. Split long renders into parts. In 4.0, `angle` renders fail on GitHub Actions because there is no GPU. — [Remotion: --gl options](https://www.remotion.dev/docs/gl-options)
- **DOCS:** `<ThreeCanvas>` lets you use `useCurrentFrame()` inside an R3F canvas. "Animations are now not inside a `useFrame()` hook, but directly rendered into the markup." `<Sequence>` inside the canvas needs `layout="none"`. The page also says "Three.JS does not render with the default OpenGL renderer" and recommends `angle`. With SSR you must pass `chromiumOptions: {gl}` yourself. — [Remotion: @remotion/three](https://www.remotion.dev/docs/three)
- **DOCS (current version):** `<ThreeCanvas>` requires `width` and `height`. "During rendering, the component overrides `frameloop` to `'never'`" and re-renders on demand via `advance()`. For asynchronous texture updates, call `advance(performance.now())` instead of `invalidate()`. Some props are marked "Available from v4.0.528", so the docs describe a version of at least 4.0.528. — [Remotion: ThreeCanvas](https://www.remotion.dev/docs/three-canvas)
- **DOCS:** Newer APIs exist: `<ThreeWebGPUCanvas />` (Three.js `WebGPURenderer` with TSL node materials), and `useVideoTexture()` is now documented with `<Html5Video />`. — [Remotion: @remotion/three](https://www.remotion.dev/docs/three)
- **SOURCE (installed @remotion/three 4.0.250, `node_modules/@remotion/three/dist/cjs/ThreeCanvas.js`):** In 4.0.250, `ThreeCanvas` only wraps R3F `<Canvas>`. It calls `delayRender` until `onCreated`, adds a `Scale` helper, and forwards Remotion contexts. **It does not override `frameloop`**, so R3F's default continuous `'always'` loop runs during renders. Peer dependencies: `@react-three/fiber >=8.0.0`, `three >=0.137.0`, `react >=16.8.0`. — [npm @remotion/three 4.0.250](https://www.npmjs.com/package/@remotion/three/v/4.0.250) (source read locally)
- **MEASURED, install:** `remotion@4.0.250` + `@remotion/three@4.0.250` + `three@0.170.0` + `@react-three/fiber@8.18.0` + `@react-three/drei@9.122.0` + `@react-three/postprocessing@^2` + `postprocessing@6.39.5` install cleanly with React 18.3.1 (27 s `npm install`). This stack is compatible with the user's React 18 project.
- **MEASURED:** `npx remotion gpu --gl=<any> --browser-executable=<headless_shell>` fails with `Error: net::ERR_FAILED at chrome://gpu` for every value. The Playwright headless shell has no `chrome://gpu` page, so a custom probe is needed.
- **MEASURED, custom probe composition (`src/Probe.tsx`):** I tried `--gl=swangle|angle|egl|swiftshader|vulkan|angle-egl` and no flag (Remotion then adds `--enable-unsafe-swiftshader`). Every case produced WebGL2 and WebGL1 contexts with the same renderer: `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`. Details: `MAX_TEXTURE_SIZE` 8192, `EXT_color_buffer_float` = true (WebGL2), `MAX_SAMPLES` = 4. `navigator.gpu` exists (I did not test whether a WebGPU adapter is returned).
- **MEASURED, stills of the R3F phone scene at 1080×1920:** one frame including CLI, bundle and browser start-up; each 3D still renders a single frame, so it also pays first-frame shader compilation.
  - "Basic" (procedural phone, PNG screen texture, HDRI environment, no post, no contact shadows): **10.7 s** wall with fresh bundling, **8.4 s** from a pre-built bundle (that run used the video-texture variant).
  - With post-processing (DepthOfField + Bloom(mipmapBlur) + ChromaticAberration + Noise + Vignette + AgX ToneMapping, MSAA 4): **24.2 s** from a pre-built bundle (PNG texture, no contact shadows).
  - Everything on (post + ContactShadows 512 + `useOffthreadVideoTexture`): **25.1 s** with fresh bundling.
  - Bundling from cache took 2.7 s.
- **MEASURED, 60-frame sequence:** basic scene, 1080×1920, `--gl=swangle --concurrency=1`, Remotion 4.0.250. It **did not finish in about 11.7 min** (12:43:40 → 12:55:20) before I stopped it, so the average was **more than about 11.7 s per frame**. During the run the Chromium GPU process (SwiftShader) used about 3.5 cores continuously: 35 CPU-minutes in about 10.5 wall-minutes. A later attempt at `--concurrency=2` logged "The browser crashed while rendering frame 5" while I was killing processes, so that crash is probably caused by my kill, not by Remotion.
- **MEASURED, baseline DOM render (current approach):** the "app screen" DOM composition at 1080×2340, 60 frames, h264 rendered in **11.7 s wall** including bundling, about 0.2 s per frame.
- **SESSION 2 (resumed 2026-10-08 ~21:45 after a container restart; machine idle, load average < 2 at start). These numbers supersede the session-1 "> 11.7 s/frame" result.**
  - **SOURCE (@remotion/three 4.0.534, the latest on npm; there is no 5.x on npm):** during rendering `ThreeCanvas` passes `frameloop: isRendering ? 'never' : (frameloop ?? 'always')`.
    - A main-tree `useLayoutEffect` creates `delayRender("Waiting for R3F to render frame N")` for every frame except 0.
    - An inner `ManualFrameRenderer` (inside the canvas) runs `useEffect(() => { advance(performance.now()); onRendered(); }, [frame])`, which calls `continueRender`.
    - `onCreated` also calls `state.advance()` once.
    - Source: `node_modules/@remotion/three/dist/cjs/ThreeCanvas.js` in the scratch project `r3f-latest`. The package also contains `webgpu.js` (`ThreeWebGPUCanvas`). — [npm @remotion/three](https://www.npmjs.com/package/@remotion/three)
  - **MEASURED, upgrade path:** `remotion` / `@remotion/cli` / `@remotion/three` **4.0.534** install cleanly next to React 18.3.1 + R3F 8.18.0 + drei 9.122 (37 s `npm install`). The peer dependencies of `@remotion/three@4.0.534` are still `react >=16.8`, `@react-three/fiber >=8.0.0` and `three >=0.137` (`npm view`). Upgrading the user's React 18 project does **not** force React 19 or R3F v9.
  - **MEASURED, L1 (4.0.534):** basic scene (procedural phone, PNG screen texture, HDRI, 5 metal coins, no post), 1080×1920, `--gl=swangle --concurrency=1 --frames=0-19`: **20 frames in 11.96 s wall, including browser launch and h264 encode**, from a pre-built bundle. That is **≤ 0.6 s per frame**, and nearly all of it is fixed start-up cost. Frames 0, 10 and 19 were inspected: each frame is distinct and correct (phone rotation, camera dolly, coin motion).
  - **MEASURED, O1 (4.0.250 + my workaround):** `<ThreeCanvas frameloop="never" onCreated={s => ref.current = s}>`, plus a main-tree `useLayoutEffect` per frame that does `delayRender` → 2× `requestAnimationFrame` → `ref.current.advance(performance.now())` → `continueRender`. Same scene: **20 frames in 11.57 s wall**. So on 4.0.250 the slowness came entirely from R3F's default `frameloop='always'` loop, and it can be fixed without upgrading.
  - **MEASURED, L2 (4.0.534):** the same basic scene at `--concurrency=4`: **20 frames in 14.5 s wall**, which is *slower* than concurrency 1 (12.0 s). For short shots, extra tabs only add start-up cost, and SwiftShader is already multi-threaded. Concurrency scaling for long renders was not measured.
  - **MEASURED, L3 (4.0.534, post-processing chain, concurrency 4):** stopped after about 11 s at the coordinator's wrap-up request. **No result.** Post-processing cost per frame in a sequence is still unmeasured.

### Inferences
- In this container `--gl` makes no practical difference. Every mode falls back to SwiftShader through ANGLE/Vulkan. Use `--gl=swangle` as documented.
- The slow sequence render (more than 11.7 s per frame against about 8–10 s for a whole one-frame CLI run) plus the GPU process pinned at about 350% CPU fits 4.0.250's `ThreeCanvas` leaving `frameloop='always'`. R3F keeps re-rendering 1080×1920 frames in software and competes with frame capture. Current Remotion versions force `frameloop='never'` and `advance()` during rendering. This is a strong reason to **upgrade Remotion before doing real 3D work**, or on 4.0.250 to test `<ThreeCanvas frameloop="demand">` plus manual `invalidate`/`advance`. Neither fix was measured.
- Post-processing is expensive under SwiftShader. In the stills it roughly tripled single-frame cost (about 8 → 24 s). Part of that is one-time shader compilation, and the steady-state per-frame cost was not isolated.

### Gaps
- Steady-state per-frame time for an R3F scene in a 60-frame sequence was not measured. The run did not complete, and the machine was shared.
- I did not find which Remotion 4.0.x release introduced the `frameloop='never'` override, and I did not check whether Remotion 5.0 is released or only planned. Check [the GitHub releases](https://github.com/remotion-dev/remotion/releases).
- Whether `navigator.gpu.requestAdapter()` returns a SwiftShader WebGPU adapter (for `<ThreeWebGPUCanvas>`) was not tested.

## 2. Putting the app screens onto a 3D phone (video texture vs drei `<Html transform>` vs DOM→canvas); the official template-three

### Takeaway
Pre-rendering each app screen as its own Remotion composition and mapping it as a texture works. The PNG/`useLoader` path rendered correctly, including the post-processing chain. `useOffthreadVideoTexture` on 4.0.250 produced a blank screen in the captured still: the texture was still `null` at capture time. The official template-three confirms the "phone with video texture" idea. It builds the phone procedurally and draws video frames into a CanvasTexture.

### Cited Findings
- **DOCS:** `useVideoTexture()` uses a Remotion video element as a texture map. `useOffthreadVideoTexture()` "displays the exact frame as an `Three.ImageTexture` during rendering". — [Remotion: @remotion/three](https://www.remotion.dev/docs/three)
- **SOURCE (4.0.250, `use-offthread-video-texture.js`):** The signature is `useOffthreadVideoTexture({src, playbackRate = 1, transparent = false, toneMapped = true})`. It throws when not rendering: "can only be used during rendering. Use getRemotionEnvironment().isRendering to render it conditionally". So in Studio you need `useVideoTexture` and a branch on `getRemotionEnvironment().isRendering`. Each frame it builds an OffthreadVideo frame URL, loads it with `THREE.TextureLoader` under `delayRender`, and calls `continueRender` right after `setState(texture)`. — [npm @remotion/three 4.0.250](https://www.npmjs.com/package/@remotion/three/v/4.0.250) (source read locally)
- **DOCS:** "the docs page for `useOffthreadVideoTexture`" at `/docs/use-offthread-video-texture` returned HTTP 404 on 2026-10-08. It is linked from [the @remotion/three page](https://www.remotion.dev/docs/three), so the URL may have moved.
- **SOURCE (template-three, cloned 2026-10-08):** The README calls it "A minimal boilerplate for Remotion + React Three Fiber" with a "phone with a screen". Video, size, colour, aspect ratio and corner radius are configurable. — [remotion-dev/template-three](https://github.com/remotion-dev/template-three)
  - The phone is **procedural**, with no GLB. A custom `RoundedBox` is an `extrudeGeometry` of a `roundedRect` shape (bevel 0), and the screen is a `roundedRect` geometry.
  - The screen texture is a `THREE.CanvasTexture` over an `OffscreenCanvas`. `<Video>` from `@remotion/media` calls `onVideoFrame`, which runs `context.drawImage(frame)`, sets `texture.needsUpdate = true` and calls `invalidate()`. UVs are handled with `tex.repeat = 1/screen width|height`.
  - Animation: a `spring()` entrance (scale + translateY) plus `interpolate(frame, [0, duration], [0, 6π])` rotation. The phone layout comes from the video's aspect ratio (mediabunny metadata).
  - Lighting is basic (ambientLight + pointLight, `<ThreeCanvas linear>`), with no environment map or post-processing.
- **SOURCE (template-three `package.json` and `remotion.config.ts`):** `@react-three/fiber 9.2.0`, `react 19.2.3`, `three 0.178.0`, `@remotion/media`, `mediabunny 1.56.1`, `zod 4.5.4`. The config sets `Config.setRspack(true)`, `Config.setChromiumOpenGlRenderer("angle")` and `Config.setVideoImageFormat("jpeg")`. The README says the template content is MIT-licensed, while `package.json` says "UNLICENSED". — [remotion-dev/template-three](https://github.com/remotion-dev/template-three)
- **MEASURED, PNG route (works):** I rendered one frame of the DOM screen composition to `public/screen.png` with `remotion still`. The phone scene loads it with `useLoader(THREE.TextureLoader, staticFile('screen.png'))`; Suspense is handled by ThreeCanvas. The result is crisp and correct on the 3D phone, both without post (still `phone-basic-f30.png`) and with DOF/bloom/AgX (still `B-png-post.png`).
- **MEASURED, `useOffthreadVideoTexture` route (failed on 4.0.250):** Source was `staticFile('screen.mp4')`, 1080×2340 h264, pre-rendered from the DOM composition. In both test stills the screen showed **no UI**: the fallback colour appeared because the texture was `null` at capture time (still `A-video-nopost.png`). With post on, the screen looked uniformly washed-out grey (`phone-full-f30.png`). Rendering the screen composition to mp4 itself worked (60 frames in 11.7 s).
- **MEASURED, UV mapping:** `THREE.ShapeGeometry` of a rounded rectangle has UVs in raw shape coordinates. Remapping them with `uv = ((x + w/2)/w, (y + h/2)/h)` makes the full screen texture fill the rounded screen exactly; this was verified visually. For the phone body, an `ExtrudeGeometry` with bevel gives material group 0 = front/back caps (black glass) and group 1 = sides and bevel (titanium `MeshPhysicalMaterial`, metalness 1, roughness 0.3). This gives an iPhone-like body with no model file.
- **MEASURED (session 2):** the screen composition rendered as a JPEG image sequence (`remotion render build Screen public/seq --sequence --image-format=jpeg --jpeg-quality=92`) gives 60 files named `element-00.jpeg … element-59.jpeg` in **6.5 s wall**. I wrote an image-sequence texture component (`SeqScreen` in `r3f/src/PhoneScene.tsx`). It keeps one stable `THREE.Texture`, and each frame swaps `.image` under `delayRender`, sets `needsUpdate`, calls `advance(performance.now())` and then `continueRender`. Its benchmark run was not reached before the wrap-up, so it is **unverified**.
- **DOCS (drei `<Html>`):** the content "is a DOM element, not drawn inside WebGL". It is placed over the canvas and, in `transform` mode, positioned with CSS `matrix3d`. The page warns transform mode "may appear blurry". `occlude` can hide it behind meshes (`occlude="blending"` "only correctly occludes rectangular HTML elements" by default). Lighting influence and shadows need a custom `material` ("Shadows only work with a custom material"). Post-processing (bloom/DOF) is not covered by the docs. — [drei Html docs](https://drei.docs.pmnd.rs/misc/html)
- **DOCS (Remotion transparent videos), for compositing 3D shots over 2D:**
  - ProRes 4444: `--image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444`.
  - WebM alpha: `--image-format=png --pixel-format=yuva420p --codec=vp8` (or vp9).
  - Playback: `<OffthreadVideo transparent>` ("Without it, no alpha layer is used"; it slightly slows rendering), or `<Video>` from `@remotion/media` (recommended, no prop needed).
  - Caveat: transparent WebM can flicker at Lambda chunk boundaries. — [Remotion: Transparent videos](https://www.remotion.dev/docs/transparent-videos)

### Inferences
- On 4.0.250, the likely cause of the video-texture failure is a race: `continueRender` fires right after `setState(texture)`, before R3F's reconciler commits and draws. The newer `frameloop='never'` + `advance()` design is probably meant to fix this kind of race. Until upgrading, the most reliable path measured here is an **image-sequence texture**. Render each screen composition to PNG/JPEG frames (`remotion render --sequence` or `remotion still` per frame) and load frame N per Remotion frame under `delayRender`. This is not yet tested.
- drei `<Html transform>` keeps the UI as real DOM. It is crisp and costs no texture, but it sits outside WebGL, so it gets no DOF, bloom, scene lighting or reflections, and is not occluded by the phone body. This is a known property of `Html` (it is a CSS overlay), but I did not check the drei docs in this session.

### Gaps
- drei `<Html transform>` / `occlude` and "DOM to canvas texture" options (html2canvas, `drawElement`/`html-in-canvas`) were not researched. drei `Html` was, see above.
- `useOffthreadVideoTexture` was not tested on the latest Remotion, and the template-three approach (`@remotion/media` `<Video onVideoFrame>`) was not tested on 4.0.250. That approach needs `@remotion/media`, which may require a newer Remotion.

## 3. Phone models (GLB/GLTF), procedural phone, UV mapping, Apple trademark/licensing

### Takeaway
Not researched beyond the procedural build. A procedural iPhone-like phone (ExtrudeGeometry + bevel + RoundedBox camera bump + ShapeGeometry screen) was built and rendered convincingly in about 100 lines. That avoids model licensing entirely, and an exact Apple likeness is probably best avoided anyway (needs verification).

### Cited Findings
- **MEASURED:** The procedural phone used these numbers: proportions 71.6 × 146.6 × 8.25 mm scaled so 1 unit = 100 mm, corner radius 0.105, bevel 0.03, a dynamic-island capsule, a 3-lens camera bump from `RoundedBox` + cylinders, and a side button. With a Poly Haven 1k studio HDRI it renders with plausible titanium and glass reflections (`phone-basic-f30.png`).
- **SOURCE:** template-three also builds its phone procedurally (extruded rounded rectangle). — [remotion-dev/template-three](https://github.com/remotion-dev/template-three)
- **DOCS (Apple, Guidelines for Using Apple Trademarks and Copyrights):**
  - "Apple does not support the use of its logos, company names, product names, or images of Apple products". Such use "may create the perception that Apple endorses or sponsors the product".
  - Showing an Apple product to indicate compatibility is allowed only if "The image is an actual photograph of the genuine Apple product and not an artist's rendering". Using Apple-owned photos needs express written permission.
  - Do not use Apple marks in your own product names.
  - — [Apple: guidelines for third parties](https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html)
- **DOCS (Poly Haven):** all assets (HDRIs, textures, models) are "licensed as CC0" ("effectively Public Domain"). "You can use our assets for any purpose", including commercial work, and "You do not need to give credit". — [Poly Haven license](https://polyhaven.com/license)

### Inferences
- For ads, a generic "modern smartphone" (procedural, no Apple logo and no exact iPhone camera layout) reduces trademark and trade-dress risk. This needs a legal source.

### Gaps
- The following were not researched: Sketchfab CC-BY/CC0 phone models, Poly Pizza (Poly Haven and Apple are now answered above), and drei `RoundedBox` limits (I believe radius ≤ depth/2, which prevents separate corner and edge radii, but that is unverified).

## 4. Look development: HDRI, MeshPhysicalMaterial, contact shadows, @react-three/postprocessing under software rendering

### Takeaway
Everything tested runs under SwiftShader WebGL2 (float render targets available): HDRI environment (RGBELoader), MeshPhysicalMaterial clearcoat/metalness, ContactShadows, Bloom (mipmapBlur), DepthOfField, ChromaticAberration, Noise, Vignette and AgX ToneMapping. Post-processing roughly triples single-frame cost.

### Cited Findings
- **MEASURED:** The Poly Haven HDRI `studio_small_09` (1k .hdr, 1.6 MB) downloaded from `https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr`. It loaded via drei `<Environment files={staticFile('studio.hdr')}/>` and gave realistic reflections on the phone.
- **MEASURED (still `B-png-post.png`):** The chain `EffectComposer multisampling={4}` → `DepthOfField(target=[0,0,0], focalLength 0.03, bokehScale 5)` → `Bloom(mipmapBlur, luminanceThreshold 1)` → `ChromaticAberration` → `Noise` → `Vignette` → `ToneMapping(AGX)` renders correctly.
  - HDR emissive objects (`meshBasicMaterial color={[3,1.2,6]} toneMapped={false}`) produce a clean bloom glow.
  - DOF clearly blurs out-of-focus areas. With bokehScale 5 it also blurred half of the screen text on a rotated phone, so it needs tuning or must focus on the screen plane.
  - Single still: 24.2 s, against 8.4 s without post (both including CLI start-up; see section 1).
- **SOURCE:** In @react-three/postprocessing 2.x, `EffectComposer` exposes `enableNormalPass` and `multisampling` (checked in `dist/EffectComposer.d.ts`). — [npm @react-three/postprocessing](https://www.npmjs.com/package/@react-three/postprocessing)
- **MEASURED (problem found):** With `<ThreeCanvas flat>` (NoToneMapping, for the composer), a transparent clearcoat "glass" overlay on the screen (opacity 0.1) visibly lifted the blacks of the screen in B, giving a purple-grey wash. The likely reason is that un-tonemapped HDR reflections exceed 1 before the AgX pass. Drop the overlay or lower `envMapIntensity` on screen glass.

### Inferences
- For a 60-s vertical video, budget post-processing only for hero shots, or bake effects (bloom/DOF) at lower internal resolution. `postprocessing` effects support resolution scaling, but I did not verify that here.
- `Noise` in postprocessing may depend on time and so not be deterministic between renders. This was not checked.

### Gaps
- Cost per effect was not isolated (DOF vs Bloom vs MSAA). Neither was the cost of ContactShadows (`frames={1}` vs per-frame), nor `@react-three/postprocessing` behaviour on Remotion versions with `frameloop='never'`.
- Motion blur in WebGL (CameraMotionBlur over a ThreeCanvas multiplies render cost by the sample count) was not tested.

## 5. 3D icons/objects (dumbbell, coins, checkmarks): sources and formats

### Takeaway
Not researched. In the test scene, simple procedural objects (gold coins as `cylinderGeometry` + metallic MeshStandardMaterial, and a glowing torus) look good with an HDRI and cost little.

### Cited Findings
- **MEASURED:** Five metallic gold coins (`cylinderGeometry(0.11, 0.11, 0.022, 48)`, metalness 1, roughness 0.22) orbit the phone, animated with `useCurrentFrame()`. They render correctly and look plausible; they are visible in all stills.

### Inferences
- GLB is the natural interchange format for R3F (drei `useGLTF`) and for Blender. This is general knowledge; verify the specifics.

### Gaps
- Not researched: Spline exports, 3D icon packs and their licenses, AI 3D generators (Meshy, Tripo, Hunyuan3D, Higgsfield `generate_3d`, which appears to be available as an MCP tool in this workspace) and their output formats and licenses.

## 6. Blender route (headless bpy, Eevee vs Cycles on CPU)

### Takeaway
Blender is easy to get into the container. The Blender **5.2.2** Linux x64 tarball downloaded in 9 s and extracted in 24 s. **No render was timed**, so Eevee (needs an OpenGL/Vulkan context; no GPU and no Mesa EGL here) and Cycles CPU are both unmeasured.

### Cited Findings
- **MEASURED:** `https://download.blender.org/release/` lists Blender4.4 → Blender5.2. `blender-5.2.2-linux-x64.tar.xz` is 383 MB, took 9 s to download through the proxy and 24 s to extract. It is at `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/3d/blender-dl/blender-5.2.2-linux-x64/blender`.
- **MEASURED (environment):** Mesa llvmpipe DRI (`libgl1-mesa-dri` 25.2.8) and `libGL`/`libgbm`/`libvulkan` are installed, but there is no Mesa `libEGL` and no Mesa Vulkan driver (lavapipe). The Chromium folder has a SwiftShader Vulkan ICD (`vk_swiftshader_icd.json`).
- **SOURCE (Blender commit, Aug 2022, "Introduce headless OpenGL rendering on Linux"):** when normal initialisation fails, Blender retries with EGL's surfaceless Mesa platform, which makes `blender -b` work without a display. This applies to Linux only. — [bf-blender-cvs, 2022-08](https://lists.blender.org/pipermail/bf-blender-cvs/2022-August/176810.html); [commit rB3195a38](https://developer.blender.org/rB3195a38)
- **FORUM (older, Blender 2.8 era):** "EEVEE always uses OpenGL". Rendering Eevee via `xvfb-run` + Mesa llvmpipe works "but is super slow". Cycles on CPU does not need OpenGL. — [devtalk.blender.org thread](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436)
- **SOURCE (blender-mcp README):**
  - The add-on "creates a socket server within Blender to receive and execute commands". Blender must be open with the add-on's server running, started automatically or via the **Start MCP Server** button. The Docker option hosts only the MCP server, "which connects out to the Blender addon". Headless mode is not covered.
  - Tools include `execute_blender_code`, `generate_3d` (Tripo, Hunyuan3D, Hyper3D Rodin) and `search_assets`/`import_asset` (Poly Haven, Sketchfab, Poly Pizza).
  - Warning: the socket server "has no authentication or encryption".
  - — [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)

### Inferences
- Cycles runs fully on CPU and should work headless with `blender -b`. Eevee probably needs Xvfb plus Mesa llvmpipe (GLX), or Mesa EGL/lavapipe installed via apt, or a Vulkan backend. All of this is untested.

### Gaps
- None of the following was done: Eevee/Cycles timings at 1080×1920; Blender motion blur and DOF cost; the bpy camera-keyframe script; image-sequence textures from Remotion; the alpha round-trip (PNG / ProRes 4444) into Remotion; and whether this machine's missing Mesa `libEGL` (only `libwayland-egl` is present) breaks the EGL fallback. The blender-mcp GUI question is answered above.

## 7. Spline, mockup tools (Rotato/Previewed), AI video (Higgsfield/Seedance, Runway, Veo, Kling)

### Takeaway
Not researched.

### Cited Findings
- None.

### Inferences
- AI-generated B-roll cannot reproduce the real Rotina UI pixel-perfectly. It is better suited to abstract or ambience shots than to phone-screen shots. This inference was not sourced.

### Gaps
- All of it: Spline deterministic frame rendering inside Remotion (`@splinetool/r3f-spline`, `@splinetool/react-spline`) and its licensing; Rotato and Previewed export with transparent screen areas; and AI video tools' consistency with real UI.

## 8. Feasibility matrix for this environment and recommended pipeline

### Takeaway
**Updated after session 2.** Real 3D with React Three Fiber inside Remotion **is feasible** on this 4-CPU, no-GPU container, provided R3F does not run its default continuous loop. That means Remotion 4.0.534's `ThreeCanvas` (`frameloop='never'` + `advance()` per frame), or my workaround on 4.0.250. A basic phone scene rendered at ≤ 0.6 s per frame, including start-up. 4.0.250 as shipped was more than 11.7 s per frame. Post-processing cost in a sequence and Blender remain unmeasured.

### Cited Findings
- **MEASURED, CSS/DOM:** about 0.2 s per frame (60 frames at 1080×2340 in 11.7 s, including bundling).
- **MEASURED, R3F on 4.0.250 as shipped (`frameloop='always'`):** more than 11.7 s per frame. The 60 frames did not finish in 11.7 min (session 1, shared machine).
- **MEASURED, R3F with the frameloop fix (session 2, idle machine), 1080×1920, 20 frames, including browser start-up and encode:**
  - 4.0.534 at concurrency 1: **11.96 s**.
  - 4.0.250 + workaround at concurrency 1: **11.57 s**.
  - 4.0.534 at concurrency 4: **14.5 s**.
- **MEASURED, R3F single stills (session 1):** post-processing (DOF + Bloom + CA + Noise + Vignette + AgX, MSAA 4) raised a one-frame CLI run from about 8.4 s to about 24.2 s. This includes shader compilation; there is no sequence number yet.
- **MEASURED, Blender:** only the install (Blender 5.2.2: 9 s download, 24 s extract). No render timings.
- **DOCS:** for no GPU, "`swangle` is recommended. Rendering might be slow". `angle` has known memory leaks, so split long renders. — [Remotion: --gl options](https://www.remotion.dev/docs/gl-options)
- **DOCS:** alpha output uses ProRes 4444 or VP8/VP9 with `yuva*` pixel formats, played back with `<OffthreadVideo transparent>`. — [Remotion: Transparent videos](https://www.remotion.dev/docs/transparent-videos)

### Inferences
Recommended pipeline:
1. **Upgrade** the Rotina project to `remotion`/`@remotion/*` **4.0.534**, all on the same version. This was verified to work with React 18 + R3F 8.18 + drei 9.122 + three 0.170. If upgrading is not possible, apply the 4.0.250 workaround: `frameloop="never"`, `onCreated` storing state, and a per-frame `delayRender` → 2×rAF → `advance()` → `continueRender`.
2. **Screens:** keep them as React/DOM compositions. Pre-render them to a PNG still (verified) or a JPEG image sequence (6.5 s per 60 frames, verified). Map them onto a **procedural, generic phone** (ExtrudeGeometry + `ShapeGeometry` UV remap; verified). A generic phone also follows Apple's guidelines, which do not support renderings of Apple products.
3. **Look:** a CC0 Poly Haven studio HDRI, MeshPhysicalMaterial (metal sides, clearcoat glass), and Bloom through emissive `toneMapped={false}` materials. Use light DOF focused on the screen. Avoid transparent "glass" overlays when using `flat` + EffectComposer, because they lift the blacks.
4. **Extrapolation, not measured:** at ≤ 0.6 s per frame, a 60 s video (1800 frames) of basic 3D would take on the order of 10–20 min. Post-processing may multiply that by about 3 (based on stills). Keep 3D to hero shots, or accept longer renders.
5. **Concurrency:** use `--concurrency=1` for short 3D shots (measured faster than 4). Test 2 for long renders.
6. **Compositing:** nest the 3D composition directly in the main Remotion timeline. Alternatively, render ProRes 4444 with alpha and use `<OffthreadVideo transparent>`.
7. **Fallbacks:** improve the CSS-3D look, or use Blender Cycles on CPU for one or two offline hero shots once timed. Eevee depends on headless EGL/llvmpipe and is unverified here. blender-mcp needs the GUI, so headless `blender -b -P script.py` with Claude-written bpy is the realistic route.

### Gaps
- Not yet measured:
  - post-processing per frame in a sequence;
  - whether image-sequence and `useOffthreadVideoTexture` textures work on 4.0.534;
  - a full 1800-frame render;
  - concurrency 2;
  - Blender Eevee and Cycles timings.

## PENDENTE / NÃO PESQUISADO

**Done in session 2:**
- [x] R3F sequence timing with the frameloop fix (4.0.534, and the workaround on 4.0.250).
- [x] Latest Remotion version (4.0.534; no 5.x on npm) and its React 18 compatibility.
- [x] Remotion transparent-video docs.
- [x] drei `Html` docs.
- [x] blender-mcp: needs the GUI.
- [x] Poly Haven license: CC0.
- [x] Apple third-party guidelines.
- [x] Blender headless EGL history.

**Still open, with next steps.** Paths: scratch root `/tmp/claude-0/-home-user-claude-skills/a0fff76b-036f-52aa-aae0-78ee08fe2860/scratchpad/3d/`, projects `r3f` (4.0.250) and `r3f-latest` (4.0.534), and the benchmark script `bench.sh`. In the commands, `BX` is the headless-shell path `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`, `B` is the Blender binary path from section 6, and `<file>` is any test `.blend`.

1. **Post-processing in a sequence (top priority).** Run:
   `cd r3f-latest && npx remotion render build Phone out/L3.mp4 --gl=swangle --browser-executable=$BX --concurrency=1 --frames=0-19 --props='{"post":true,"shadows":false,"screen":"png","msaa":4,"loop":"default"}'`
   Then repeat with `"shadows":true` and MSAA 0 to isolate each cost.
2. **Texture modes on 4.0.534.** Run with `"screen":"seq"` and `"screen":"offthread"`, then inspect frames: `ffmpeg -i out/X.mp4 -vf "select='eq(n\,0)+eq(n\,19)',scale=360:-1,tile=2x1" -frames:v 1 t.jpg`.
3. **Full length.** Render 1800 frames of the basic scene to confirm the 10–20 min extrapolation. Also test `--concurrency=2`.
4. **Blender timings:**
   - Eevee: `$B -b --factory-startup --python-expr "<set engine BLENDER_EEVEE, 1080x1920, render>"`.
   - If it fails, run `apt-get install -y libegl1 libegl-mesa0` (or `xvfb`, then `xvfb-run -a`).
   - Cycles: `CYCLES`, CPU, 32/64/128 samples, OIDN denoise.
   - Docs: https://docs.blender.org/manual/en/latest/advanced/command_line/render.html
5. **Find the Remotion version that added `ManualFrameRenderer`:** `npm pack @remotion/three@4.0.X` and `grep ManualFrameRenderer`, bisecting between 4.0.250 and 4.0.534.
6. **Not researched yet:**
   - Asset licenses: Sketchfab (https://sketchfab.com/licenses), Poly Pizza (https://poly.pizza).
   - 3D icon packs.
   - AI 3D generators (Meshy, Tripo, Hunyuan3D; blender-mcp `generate_3d` supports Tripo, Hunyuan3D and Rodin): output formats and licenses.
   - Spline: deterministic rendering in Remotion and licensing (https://docs.spline.design/, `@splinetool/r3f-spline`).
   - Rotato (https://rotato.app) and Previewed (https://previewed.app).
   - AI video for B-roll (Higgsfield/Seedance, Runway, Veo, Kling).
   - @react-three/postprocessing docs (https://react-postprocessing.docs.pmnd.rs/).
   - The drei `RoundedBox` radius limit.
