# Claude Agent Skills, Claude Code plugins and MCP servers for programmatic video, motion design, 3D and voice/audio (state as of 2026-10-08)

Research date: 2026-10-08. Star counts and last-update dates come from the GitHub search API, queried on 2026-10-08, unless noted otherwise. "pushed" = last push and "updated" = last repo update. Items marked **(via search summary)** were seen only in a web-search synthesis, not in a page I opened. Items marked **UNVERIFIED** could not be confirmed from a primary source. Container = the user's Linux cloud container: 4 CPU, 15 GB RAM, no GPU, Node 22, Python 3.13, ffmpeg 6.1, Chromium headless shell, TLS-intercepting proxy.

---

## Q1. Remotion + AI agents: official skills, MCP, llms.txt, and community Remotion skills

### Takeaway
Remotion's official AI integration is now **Agent Skills, not MCP**. You install `remotion-dev/skills` with `npx remotion skills add` or `npx skills add remotion-dev/skills`. The old Remotion MCP (docs search) is **deprecated**. The community has built very large Remotion skill packs for product promos, explainers and app-store videos. The most relevant one is **video-shotcraft** (10.8k★), which has shot recipe cards, tuned easing/timing TSX, a SFX library and headless-Linux render notes. Several popular ones (onetake, video-talkcraft) are **non-commercial licensed**.

### Cited Findings
**Official Remotion**
- Remotion Agent Skills are published as the repo `remotion-dev/skills`, mirrored from `packages/skills` in the Remotion monorepo. Install: `npx skills add remotion-dev/skills`. The skills are also offered when creating a project with `bun create video`. Remotion says they work with Claude Code, Codex, Kimi Code and Cursor — [Remotion docs: Agent Skills](https://www.remotion.dev/docs/ai/skills); [remotion-dev/skills README](https://github.com/remotion-dev/skills)
- The 12 official skills:
  - `/remotion-best-practices`: umbrella; "encompasses all other skills".
  - `/remotion-create`: new project or composition.
  - `/remotion-markup`: compositions, animations, layout, typography, media, effects, audio, fonts, timing.
  - `/remotion-studio`: launch preview.
  - `/remotion-render`: render a video or still.
  - `/remotion-maps`: Mapbox/MapLibre/GeoJSON/CesiumJS 3D flyovers.
  - `/remotion-captions`.
  - `/remotion-saas`.
  - `/remotion-interactivity`: make code editable in Studio.
  - `/remotion-docs`: search docs and fetch pages as Markdown.
  - `/remotion-upgrade`.
  - `/remotion-multimedia`: Mediabunny metadata.
  - Source: [remotion-dev/skills README](https://github.com/remotion-dev/skills)
- The "Prompting videos with coding agents" page gives these steps: `npx create-video --yes --blank my-video` → `cd my-video` → `npx remotion skills add` → `npm run dev` → start `claude` (or codex/kimi/opencode) in a second terminal. It also links a 5-minute tutorial video (youtube.com/watch?v=5NRAOnKc3c8) — [Remotion docs: coding agents](https://www.remotion.dev/docs/ai/coding-agents)
- The docs are "AI-ready": a copy-as-Markdown button, `.md` suffix URLs (e.g. `remotion.dev/docs/player.md`), and `Accept: text/markdown` content negotiation. Pasting a doc link into Claude Code makes it fetch Markdown automatically — [Remotion docs: AI](https://www.remotion.dev/docs/ai/)
- `remotion.dev/llms.txt` exists as a Markdown index of the docs. Its AI section links `/docs/ai/index.md` and `/docs/ai/coding-agents.md` — [remotion.dev/llms.txt](https://www.remotion.dev/llms.txt)
- **The Remotion MCP is deprecated.** It "duplicates the `/remotion-docs` skill", its data "can be less current", and the hosted MCP shuts down no earlier than Aug 31, 2026. Migration: run `npx remotion skills add`, use `/remotion-docs`, and remove `remotion-documentation` from your MCP config — [Remotion docs: MCP](https://www.remotion.dev/docs/ai/mcp); [GitHub issue #9055](https://github.com/remotion-dev/remotion/issues/9055)
- remotion-dev/skills has ~4.9k★ according to the Agent-Skills-Hub-generated list; the GitHub page also shows "4.9k" stars and 88 commits — [zhuyansen/awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills); [remotion-dev/skills](https://github.com/remotion-dev/skills)
- **Depth of the official skills (resumed research, 2026-10-08; I read the SKILL.md files, version 4.0.534):**
  - **`remotion-best-practices` is a router.** It loads `remotion-create`, `remotion-markup`, `remotion-maps`, `remotion-multimedia`, `remotion-interactivity`, `remotion-studio`, `remotion-render`, `remotion-captions`, `remotion-saas`, `remotion-docs` and `remotion-upgrade` reference files on demand. Agent rules: preserve user edits; open Studio (`npx remotion studio`, or `--no-open` for agents with an in-app browser) instead of rendering by default; render only when the user explicitly asks (`npx remotion render`). It notes "The Studio supports WebMCP tools" — [remotion-best-practices SKILL.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-best-practices/SKILL.md)
  - **`remotion-markup` (17.9 KB), core rules:**
    - drive everything with `useCurrentFrame()` + `interpolate()`; CSS transitions/animations and Tailwind animation classes "will not render correctly";
    - use `Easing.bezier()` / `Easing.spring()`; the example easing is `Easing.bezier(0.16, 1, 0.3, 1)`;
    - `output: 'perceptual-scale'` for scale animations;
    - prefer the CSS `scale`/`translate`/`rotate` properties over `transform`;
    - `premountFor={fps}` on timed components;
    - `Interactive.withSchema` so Studio can edit props.
    - Source: [remotion-markup SKILL.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/SKILL.md)
  - **`remotion-markup` reference files:** `3d.md`, `sfx.md`, `audio.md`, `audio-visualization.md`, `transitions.md`, `motion-blur.md`, `text-highlights.md`, `google-fonts.md`, `timing-props.md`, `effects.md`, `html-in-canvas.md`, `ffmpeg.md`, `silence-detection.md`.
  - **It documents `@remotion/effects`**, built-in GPU-style effects applied via `<HtmlInCanvas effects=…>`:
    - lighting: `glow()`, `lightLeak()`, `shine()`, `starburst()`, `vignette()`, `dropShadow()`;
    - blur: `zoomBlur()`, `lightTrail()`, progressive and region blur;
    - distortion: `chromaticAberration()`, `barrelDistortion()`, `cornerPin()`, `fisheye()`;
    - grading: `lut()`, `levels()`, `colorCorrection()`, `duotone()`;
    - textures: `noise()`, `paper()`, `halftone()`;
    - pixelation transitions;
    - custom `createEffect()`.
    - It also covers `@remotion/rive` (`<RemotionRiveCanvas>`), `@remotion/shapes` and `@remotion/gif` — [remotion-markup SKILL.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/SKILL.md)
  - **Motion blur (`motion-blur.md`):**
    - `<HtmlInCanvasMotionBlur>` (Remotion ≥ 4.0.529) "is the state of the art in Remotion for blurring animated HTML": it captures fractional frames and averages pixels in a canvas; `shutterAngle` default 180 (0–360), `samples` default 8 (1–64).
    - The docs add that `<CameraMotionBlur>` (the user's current approach) uses "layered blending [that] can change colors and opacity", and that HTML-in-canvas must be enabled for *preview*, while "rendering needs no configuration".
    - Sources: [skill motion-blur.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/motion-blur.md); [Remotion docs: Motion blur](https://www.remotion.dev/docs/motion-blur)
  - **Transitions (`transitions.md`):** `<TransitionSeries>` with `.Transition` (crossfade/slide/wipe; shortens the timeline) and `.Overlay` (e.g. a light leak over the cut, without shortening). Install `npx remotion add @remotion/transitions` — [skill transitions.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/transitions.md)
  - **SFX (`sfx.md`):** a small hosted list on `https://remotion.media/` with generic UI sounds (whoosh, whip, switch, mouse-click, shutter, ding, page-turn) and meme sounds. The library is small and **depends on the remotion.media CDN**, which video-shotcraft notes may be blocked in some environments — [skill sfx.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/sfx.md); [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)
  - **3D (`3d.md`):** `npx remotion add @remotion/three`; wrap 3D content in `<ThreeCanvas width height>` with explicit lighting; otherwise follow R3F best practices — [skill 3d.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/3d.md)
- Remotion license: "free for individuals and small teams; companies may need a paid license" (as summarized in a third-party README) — [video-shotcraft README](https://github.com/Vincentwei1021/video-shotcraft); [Remotion LICENSE](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
- Several unrelated community projects also use the name "remotion-mcp": `npx -y remotion-mcp` (export videos/stills/GIFs), mcp-use/remotion-mcp-app (inline player), and a Glama-listed voice-over server (via search summary) — [mcp.so remotion-mcp](https://mcp.so/server/remotion-mcp/Vidhanvyrs); [mcp-use/remotion-mcp-app](https://github.com/mcp-use/remotion-mcp-app)

**Community Remotion skills and toolkits (most relevant first)**

**Vincentwei1021/video-shotcraft** — 10,818★, pushed 2026-10-05, created 2026-07-19 — [repo](https://github.com/Vincentwei1021/video-shotcraft)
- "Agent skill for crafting cinematic product videos" with Remotion. The README counts 157 shot recipe cards, 214 styles and 214 motion previews; the GitHub description says 152/209.
- Includes real page captures, 2.5D camera moves, beat-synced cuts and "film-grade SFX": 149 SFX in 16 categories, plus Mixkit music/SFX under Mixkit's free commercial license.
- Ships the "Ink Press" template (36.2 s, 1920×1080, 30 fps, 10 shots) and a browser "Motion Workbench" timeline editor for post-delivery edits.
- Exports JianYing (CapCut CN) drafts; tested on macOS.
- Install: `npx skills add Vincentwei1021/video-shotcraft`, or symlink the repo into `~/.claude/skills/video-shotcraft`.
- **Headless Linux notes (tested on 2 cores, Node 22):**
  - pass `--concurrency=1`;
  - use a chrome-headless-shell binary, because new Chrome dropped old headless mode;
  - pass `--browser-executable=<path>` if the remotion.media CDN is blocked.
- Targets landscape web/desktop product promos. The repo-level license is not confirmed in my notes.

**Vincentwei1021/video-talkcraft** — 1,420★, pushed 2026-10-01 — [repo](https://github.com/Vincentwei1021/video-talkcraft)
- Voiceover-driven explainers. Word-level timestamps are aligned locally on CPU (FireRedASR2-CTC int8, or faster-whisper), with a median 20–40 ms per character.
- 78–109 motion recipe cards and a "7-layer anti-slideshow" camera system.
- Includes a Fish Audio free-tier TTS script.
- **License: PolyForm Noncommercial 1.0.0** (free only for personal, education and research use).

**Vincentwei1021/anything2explainer** — 2,330★, pushed 2026-09-18
- Topic → narrated black-canvas motion-graphics explainer with TTS, subtitles and a chapter bar — [repo](https://github.com/Vincentwei1021/anything2explainer)

**trunghaiy/appshot** — 46★ per the list — [repo](https://github.com/trunghaiy/appshot)
- Generates **App Store / Google Play preview videos (default 886×1920, 15–30 s)** and store screenshots from your codebase.
- The skill scans the app (React Native/Expo, Flutter, Swift, Kotlin), then writes bespoke `.tsx` scenes using Appshot primitives in a Remotion composition.
- Device frames include iphone-16-pro, iphone-15 and Pixel.
- Install: `npx skills add trunghaiy/appshot`.
- Used in production by the BookStreak App Store listing.
- License not checked.

**digitalsamba/claude-code-video-toolkit** — ~2.2k★ per the list — [repo](https://github.com/digitalsamba/claude-code-video-toolkit)
- Skills: remotion, elevenlabs, ffmpeg, playwright-recording, frontend-design, ideogram4, acestep, and others. Commands `/setup` and `/video`.
- Open models (Qwen3-TTS, FLUX.2, ACE-Step music) are deployed to your own cloud GPU (Modal recommended; RunPod also supported).
- `examples/hello-world` renders without API keys.

**DojoCodingLabs/remotion-superpowers** — 130★, created 2026-02-09 — [repo](https://github.com/DojoCodingLabs/remotion-superpowers)
- Claude Code plugin with "5 MCP servers, 13 commands".
- Services: Suno music and ElevenLabs TTS/SFX (both via KIE), TwelveLabs video analysis/review, Pexels stock, Replicate/KIE image and video generation, Whisper captions.
- Built-in features: `@remotion/transitions`, `@remotion/three` 3D, light-leaks, Lottie.
- Install: `/plugin marketplace add DojoCodingLabs/remotion-superpowers` then `/plugin install remotion-superpowers@remotion-superpowers`.

**resemble-ai/remotion-resemble-skill** — official skill from Resemble AI — [repo](https://github.com/resemble-ai/remotion-resemble-skill)
- Resemble.ai TTS voiceovers in Remotion: sync TTS up to 2,000 characters, streaming TTS, cloned voices.
- Word-synced TikTok-style captions and SRT.
- `npx skills add resemble-ai/remotion-resemble-skill`. MIT.

**calesthio/OpenMontage** — 65,283★, pushed 2026-10-03, **AGPLv3** — [repo](https://github.com/calesthio/OpenMontage)
- "12 production pipelines, 100+ tools, 700+ agent skill files", with Remotion and HyperFrames composers.
- Zero-key mode uses Piper TTS offline. Optional keys: ElevenLabs, OpenAI, Google, Kling and others. A GPU is optional.

**0xsline/OpenChatCut** — 2,187★, pushed 2026-10-07
- Local-first conversational editor with a multi-track timeline, Agent Skills, MCP and Remotion rendering — [repo](https://github.com/0xsline/OpenChatCut)

**Other Remotion skills** (stars from the Agent-Skills-Hub list unless noted; [list](https://github.com/zhuyansen/awesome-claude-video-skills)):
- wshuyi/remotion-video-skill: 391★; created and last pushed 2026-01-25, so possibly stale.
- haidrrrry/claude-remotion-skill: 280★.
- Hainrixz/editor-pro-max: 261★; last push 2026-03-26.
- AgriciDaniel/claude-shorts: 218★.
- jhartquist/claude-remotion-kickstart: 120.
- leosssvip-dot/remotion-ad-video-skill: 110.
- Liamrjohnston/remotion-motion-graphics-skill: 84.
- norahe0304-art/30x-video: 63; Remotion with a "16-law taste codex".
- BayramAnnakov/remotion-video-director: 41.
- Zane-0x5a/remotion-director: 35; plugin with a critic loop.
- gorkem-bwl/onboarding-video-generator: 31.
- AmazingAng/ccvideo: 21.
- memex-lab/product-launch-video-skill: 16.
- smit-vanani/claude-promo-video: 16; beat-locked.
- IskakovDamir/apple-motion: 13; Apple-style kinetic typography "built from frame-accurate measurements of Apple recap videos".
- welingtondesosa/video-motion: 8; a Portuguese-language skill for brand motion graphics with a synthesized soundtrack.
- diko0071/remotion-video-skills: 7.
- AgriciDaniel/claude-gif: 28.

**Bomx/super-video-maker-skill** — 308★
- HeyGen avatars, Seedance b-roll, OpenAI images, Remotion, HyperFrames, FFmpeg captions and QC — [repo](https://github.com/Bomx/super-video-maker-skill)

### Inferences
- For this user, who is already on Remotion 4, the lowest-risk upgrade is to install the official skills (`npx remotion skills add`). Then layer a shot-recipe library (video-shotcraft) on top for camera grammar, easing values, SFX and beat-sync. Shotcraft's templates are 16:9, so they must be re-composed for 1080×1920.
- appshot is the closest match to the "mobile app promo in vertical format" use case. It is useful as a reference for device frames and the store-preview narrative arc, even if not adopted wholesale.
- License hygiene matters. Rotina promos are commercial use, so PolyForm Noncommercial skills (video-talkcraft, onetake) cannot be used as-is. OpenMontage is AGPLv3. Remotion itself may need a company license depending on team size.

### Gaps
- Repo-level licenses not verified: video-shotcraft, appshot, digitalsamba toolkit, remotion-superpowers, motion-video-kit.
- I did not open the individual rule files inside remotion-dev/skills to see their depth (e.g., whether `/remotion-markup` covers spring/bezier easing, 3D or motion blur).
- I did not test the shotcraft headless notes in this specific container (Playwright chromium build 1194).

---

## Q2. Other programmatic-video frameworks and editing MCPs (HyperFrames, Motion Canvas, Revideo, Editly, FFmpeg, Premiere/Resolve/CapCut, Lottie/Rive/Jitter)

### Takeaway
**HyperFrames (HeyGen, Apache-2.0, 58.9k★)** is the big new agent-first framework. It renders HTML/CSS + GSAP/Lottie/Three.js to deterministic MP4 via headless Chrome + FFmpeg. It ships an official Claude Code plugin with 21 skills and is listed in Anthropic's official plugin marketplace. Motion Canvas and Revideo have no meaningful agent ecosystem. Plenty of FFmpeg, DaVinci, Premiere and CapCut-like MCPs exist, but the NLE ones require desktop apps. Lottie has a 5.5k★ text-to-Lottie skill and an official hosted LottieFiles MCP. Rive's MCP is Early Access and desktop-only.

### Cited Findings
**HyperFrames** — 58,911★, created 2026-03-10, topics include mcp/gsap/puppeteer
- "Open-source framework for turning HTML, CSS, media, and seekable animations into deterministic MP4 videos." Requirements: **Node.js 22+ and FFmpeg**. The renderer "seeks each frame in headless Chrome and encodes the result with FFmpeg". License **Apache 2.0** ("no per-render fees") — [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)
- Claude Code install:
  - `claude plugin marketplace add heygen-com/hyperframes`
  - `claude plugin install hyperframes@hyperframes`
  - or standalone `npx skills add heygen-com/hyperframes`
  - or `npx hyperframes skills update` (core set)
  - CLI: `npx hyperframes init|preview|render`
  - Source: [HyperFrames README](https://github.com/heygen-com/hyperframes)
- The 21 skills:
  - Router: `/hyperframes`.
  - Workflows: `/product-launch-video`, `/faceless-explainer`, `/pr-to-video`, `/embedded-captions`, `/talking-head-recut`, `/motion-graphics`, `/music-to-video`, `/slideshow`, `/general-video`, `/remotion-to-hyperframes` (one-way port of Remotion code).
  - Domain skills:
    - `hyperframes-animation`: runtime adapters for GSAP, Lottie, Three.js, Anime.js, CSS, WAAPI and TypeGPU.
    - `hyperframes-keyframes`.
    - `hyperframes-creative`: frame.md/design.md, typography, beat planning.
    - `media-use`: BGM, SFX, voice, LUT; generates via TTS/music/image models.
    - `hyperframes-audio`: "voiceover carve" ducking, EQ/compressor/limiter, automation.
    - `hyperframes-cli`: includes HeyGen cloud render and AWS Lambda.
    - `hyperframes-registry`.
    - `/figma`.
  - A `@hyperframes/shader-transitions` WebGL package is also included.
  - Source: [HyperFrames README](https://github.com/heygen-com/hyperframes)
- HyperFrames is also in Anthropic's official marketplace as plugin `hyperframes`: "Write HTML, render video… captions, voiceovers, audio-reactive visuals" — [anthropics/claude-plugins-official marketplace.json](https://github.com/anthropics/claude-plugins-official)

**HyperFrames-based skills**
- **echris6/motion-video-kit** (~1.0k★) — [repo](https://github.com/echris6/motion-video-kit)
  - "Gauntlet" independent-critic loop with ready critic prompts.
  - Motion grammar (6 rules, 16 mechanisms) distilled from 28 SaaS launch films.
  - Measurable quality bar (frozen time, loudness via ffmpeg ebur128, contrast) and audio rules.
  - Three.js patterns, including "product hero realism": match a real device's motion, monotone cubic, deterministic accumulation motion blur.
  - Renderer-agnostic, but works best with HyperFrames.
  - Install: copy `business-motion-film` into `~/.claude/skills/`.
- Other HyperFrames skills (from [the list](https://github.com/zhuyansen/awesome-claude-video-skills)):
  - geekjourneyx/hyperframes-motion-director: 451.
  - tugrawork-creator/saas-motion-kit: 212.
  - bestagentkits/motion-video-skill: 112; HyperFrames + GSAP + AI voice-over + karaoke captions + SFX.
  - kangarooking/promo-creator-skills: 102.
  - imMamdouhaboammar/motion-graphics-skills: 16.

**Other code-based motion skills (no Remotion)**
- **feitangyuan/onetake** — 1,932★, created 2026-09-26 — [repo](https://github.com/feitangyuan/onetake)
  - "Motion films that never cut to the next slide": one continuous camera.
  - A `probe.py` continuity oracle scores how much carries across beat boundaries. It also fails uniform cadence, no stillness, clipped audio, fast moves without motion blur, and a subject leaving the frame.
  - Real UI is rebuilt in HTML from screenshots. About 38 "measured moves", each a pure function of time.
  - **Motion blur: several captures across a 180° shutter, averaged in linear light.**
  - Requires python3 + playwright(chromium), numpy, scipy, Pillow, matplotlib, ffmpeg and node. Narration uses faster-whisper + Kokoro.
  - **License: PolyForm Noncommercial — commercial use not permitted (paid "onetake Pro").**
- **howseen-ai/claude-motion-design** — 289★
  - HTML + Playwright + ffmpeg, "no After Effects, no Remotion license". Graded **CAUTION** by Agent Skills Hub — [repo](https://github.com/howseen-ai/claude-motion-design); [list](https://github.com/zhuyansen/awesome-claude-video-skills)
- **iart-ai/motion-skills** — 741★, MIT — [repo](https://github.com/iart-ai/motion-skills)
  - 54 skills in 17 packs: tiktok, ad, explainer, web-animation, motion-design, kinetic-typography, webgl, manim, lower-thirds…
  - Each pack is installed separately: `npx skills add iart-ai/<pack>`, or `/plugin marketplace add iart-ai/web-animation-skills`.
  - Includes a "deliver-and-verify loop" (render a frame → screenshot → check).
- Other entries:
  - bangtutorial/bang-motion: 566★.
  - lemomo-ai/lemo-opuscar: 1,395★; 43 film styles, demo films made in code.
  - alexgreensh/anidoodle: 819.
  - nolangz/pixel2motion: 2.4k; raster logo → SVG animation.
  - charlie947/motion-graphics-skills: 77.
  - Mort1d/motion-graphics-skills: 35.
  - Sources: [list](https://github.com/zhuyansen/awesome-claude-video-skills); [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)
- **vibe-motion/skills** — 1,323★
  - README says **"此项目不再维护" (no longer maintained)** and points to motionface.cc — [repo](https://github.com/vibe-motion/skills)

**Motion Canvas / Revideo**
- No significant agent skill or MCP found. A 2026 third-party comparison cites ~8K weekly npm downloads for Motion Canvas core vs ~3K for Revideo core (via search summary). Maintenance status in 2026 is unconfirmed — [PkgPulse comparison](https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026); [Revideo docs](https://docs.re.video/)

**Editly**
- Not researched (see PENDENTE).

**FFmpeg MCPs**
- video-creator/ffmpeg-mcp: 151★, updated 2026-09-28.
- egoist/ffmpeg-mcp: 120★.
- bitscorp-mcp/mcp-ffmpeg: 61★.
- kevinwatt/ffmpeg-mcp-lite: 27★.
- Sources: [video-creator/ffmpeg-mcp](https://github.com/video-creator/ffmpeg-mcp); [egoist/ffmpeg-mcp](https://github.com/egoist/ffmpeg-mcp)

**Video QA**
- **jordanrendric/claude-video-vision** — 1,351★ — [repo](https://github.com/jordanrendric/claude-video-vision)
  - A Claude Code plugin that lets Claude "watch" videos: ffmpeg frame extraction plus audio via the Gemini API, local Whisper or OpenAI. Supports YouTube URLs.
  - Install: `/plugin marketplace add https://github.com/jordanrendric/claude-video-vision` then `/plugin install claude-video-vision`.
  - Commands: `/watch-video path.mp4 "question"`.

**DaVinci Resolve MCPs**
- **samuelgursky/davinci-resolve-mcp** — 3,406★, updated 2026-10-08. Uses the official Scripting API: 37 tools (389 in full mode) plus an "advanced (offline)" Node server. It needs **Resolve Studio** with external scripting set to Local. Per the README, "Resolve 21.1 moved Python scripting to Studio" — [repo](https://github.com/samuelgursky/davinci-resolve-mcp)
- Others:
  - barckley75/resolve-claude-mcp: 379★.
  - hiteshK03/davinci-resolve-mcp: 122★; 44 tools + local Whisper.
  - apvlv/davinci-resolve-mcp: 79★.
  - wassermanproductions/unofficial-davinci-mcp: 35★; Apache-2.0, free-edition FCPXML workflows.
  - flamexnreal/davinci-resolve-ai-bridge-mcp: 30★.
  - Source: GitHub search 2026-10-08, e.g. [barckley75/resolve-claude-mcp](https://github.com/barckley75/resolve-claude-mcp)

**Premiere Pro MCPs**
- hetpatel-11/Adobe_Premiere_Pro_MCP: 666★; CEP/ExtendScript/UXP.
- leancoderkavy/premiere-pro-mcp: 339★; local CEP bridge.
- ayushozha/AdobePremiereProMCP: 119★.
- antipaster/Adobe-Premiere-Pro-MCP: 35★; 170+ tools.
- Sources: [hetpatel-11](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP); [leancoderkavy](https://github.com/leancoderkavy/premiere-pro-mcp)

**CapCut-like editors and CapCut MCPs**
- jub0t/concat: 4,253★; beta; open-source Rust CapCut replacement "supports MCPs".
- pireel/pireel: 1,268★; "drivable by any AI agent over MCP".
- xuliang2024/cutcli-cookbook: 198★; CapCut/JianYing draft CLI.
- mrbuslov/capcut-ai-editor: 117★; exports CapCut projects.
- cartesiancs/cartcut: 791★; "Video Editor for AI agents".
- Sources: [concat](https://github.com/jub0t/concat); [pireel](https://github.com/pireel/pireel); [cutcli-cookbook](https://github.com/xuliang2024/cutcli-cookbook)

**Lottie**
- **diffusionstudio/lottie** — 5,549★, created 2026-06-04 — [repo](https://github.com/diffusionstudio/lottie)
  - A "text-to-lottie" skill: `npx skills add diffusionstudio/lottie`.
  - Includes a live player and prompt guide (ground with SVGs, use motion-design terms, request camera moves, specify FPS and frame count).
  - Output is Lottie JSON, which can also be imported into After Effects.
- **LottieFiles official hosted MCP** (via search summary) — [LottieFiles MCP docs](https://docs.lottiefiles.com/en/platform/mcp); [lottiefiles.com/mcp](https://lottiefiles.com/mcp)
  - `claude mcp add --transport http lottiefiles https://mcp.lottiefiles.com/mcp`, with OAuth in the browser.
  - 4 GraphQL-oriented tools for account/workspace plus a 100k+ free animation library. No extra cost on any plan.
  - The docs page was revised 2026-08-06.
  - A separate local "Lottie Creator MCP" for authoring is mentioned (UNVERIFIED).

**Rive**
- Official MCP integration in the Rive editor, **Early Access, "not ready for production"** (via search summary) — [Rive docs: MCP integration](https://rive.app/docs/editor/mcp/integration); [Rive docs: AI MCP](https://rive.app/docs/editor/ai/mcp)
  - It is Mac desktop first, with Windows "upcoming", and Cursor is the documented client.
  - Coverage: artboards, hierarchy, shapes/layouts, components, state machines.

**Other**
- **Jitter:** no MCP or skill found (see PENDENTE).
- **Jakubantalik/transitions.dev** — 4,580★ — [repo](https://github.com/Jakubantalik/transitions.dev)
  - CSS UI transition library packaged as a skill (`npx skills add Jakubantalik/transitions.dev`) with 18 per-transition references: card resize, number pop-in with blur and stagger, success check with SVG path draw, etc.
  - Some transitions are "Pro" (paid).

### Inferences
- HyperFrames is Apache-licensed and fits the container exactly (Node 22 + FFmpeg + headless Chrome). It is a credible second renderer. Segments could be rendered in HyperFrames (e.g., GSAP-heavy kinetic type) and composited in Remotion as video clips. Switching wholesale is unnecessary because Remotion skills now exist; this is an inference, not tested.
- The NLE MCPs (Resolve, Premiere, CapCut desktop) are irrelevant in a headless Linux container. claude-video-vision, however, is directly useful as an automated QA/critique loop on the user's renders.
- Lottie (diffusionstudio skill + LottieFiles library) is a cheap way to add polished icon and micro-animations to the app UI recreations.

### Gaps
- Editly, Jitter and Cavalry agent integrations were not searched.
- The repos of Motion Canvas and Revideo were not checked for 2026 commit activity.
- I could not confirm whether Rive's MCP left Early Access, or the details of the Lottie Creator MCP.

---

## Q3. After Effects, Cinema 4D, Cavalry and Houdini automation for Claude

### Takeaway
There are many community MCP servers for **After Effects**: Dakkshin's is the reference at 714★, and newer ones add 3D cameras, expressions, rendering and "look at the result". There are also MCPs for **Cinema 4D** and **Houdini**. All of them require the licensed desktop app running on Windows or macOS, so none can work in the user's Linux container. The only container-compatible AE route is **Plainly Videos' official MCP**, which renders pre-made AE templates in the cloud via an API (paid account). Adobe's official skills do not include After Effects.

### Cited Findings
**Dakkshin/after-effects-mcp** — 714★, pushed 2026-04-01, created 2025-04-12 — [repo](https://github.com/Dakkshin/after-effects-mcp)
- ExtendScript-based.
- Can do: create compositions; text, shape, solid/adjustment, camera and null layers; set position/scale/rotation/opacity; toggle 2D/3D; blend modes, track mattes and masks; set keyframes; apply expressions; batch-set properties.
- Requires **After Effects 2022+** and Node 14+.
- Install: clone → `npm install` → `npm run build` → `npm run install-bridge` (copies the panel scripts into AE). The repo includes `.mcp.json` for Claude Code.

**Newer AE MCPs** (GitHub search 2026-10-08)
- kumoproductions/mcp-aftereffects: 98★; TypeScript, Windows and macOS, undo-grouped ops, JSON export/import, single-frame rendering via file IPC.
- JUNKDOGE-JOE/after-effects-mcp: 77★; MCP + CEP plugin, 30 `ae.*` tools.
- ishu86/after-effects-mcp: 38★; 70+ tools including expressions, effects and motion templates.
- Engine-Room-Games/after-effects-mcp: 27★.
- Arman-Luthra/aftr: 23★; "Puppeteer for After Effects".
- a-y-ibrahim/after-effects-mcp: 22★; background rendering, RTL text.
- VolksRat71/after-effects-mcp-vision: 5★; AE + Illustrator, the agent "looks at what it made".
- tzdwindows/after-effects-mcp: 5★; 3D camera moves, text animators, bezier speed curves, screenshots; created 2026-10-06.
- brandkickagency/aftereffects-mcp: 4★; WebSocket CEP panel.
- Sources: [kumoproductions/mcp-aftereffects](https://github.com/kumoproductions/mcp-aftereffects); [JUNKDOGE-JOE/after-effects-mcp](https://github.com/JUNKDOGE-JOE/after-effects-mcp); [ishu86/after-effects-mcp](https://github.com/ishu86/after-effects-mcp); [Arman-Luthra/aftr](https://github.com/Arman-Luthra/aftr)

**plainly-videos/mcp-server** — official Plainly Videos MCP — [repo](https://github.com/plainly-videos/mcp-server)
- "Cloud-based video automation platform that renders Adobe After Effects templates natively in the cloud".
- Tools: `list_renderable_items`, `get_renderable_items_details`, `render_item`, `check_render_status`.
- Requires Node ≥ 18 and a Plainly API key. Can be installed via Smithery: `npx -y @smithery/cli@latest install @plainly-videos/mcp-server --client claude --key …`.

**SFKislev/Flue** — 90★
- Lets "agents control many desktop software directly from the cli… no MCP servers": AE, Illustrator, Audition, Blender, Houdini, 3ds Max, Unity — [repo](https://github.com/SFKislev/Flue)

**Cinema 4D**
- ttiimmaacc/cinema4d-mcp: 128★.
- kumoproductions/mcp-cinema4d: 25★.
- sdimaging/cinema4d-mcp: 16★; "production fork, 93 tools", Scene Nodes, Octane OSL, C4D 2026.
- cuneytozseker/mcp4d: 5★; native C++ plugin for Claude Code.
- Sources: [ttiimmaacc/cinema4d-mcp](https://github.com/ttiimmaacc/cinema4d-mcp); [sdimaging/cinema4d-mcp](https://github.com/sdimaging/cinema4d-mcp)

**Houdini**
- capoomgit/houdini-mcp: 305★.
- healkeiser/fxhoudinimcp: 290★; "most comprehensive MCP server for SideFX Houdini".
- HurtzDonutStudios/ai-forge-mcp: 97★; Blender/Substance/Maya/Houdini/UE5 game-asset pipeline.
- Sources: [capoomgit/houdini-mcp](https://github.com/capoomgit/houdini-mcp); [healkeiser/fxhoudinimcp](https://github.com/healkeiser/fxhoudinimcp)

**Adobe official skills** (adobe/skills)
- The "Adobe for Creativity" plugin is **"for Claude desktop app only"**.
- Skills: batch photo edits, InDesign data merge, social crops of images and video, Adobe Express templates, Adobe Quick Cut highlight reels, resize photos/videos.
- `run-workflow` (Firefly workflows) requires an enterprise Firefly Creative Production entitlement.
- No After Effects or Premiere authoring.
- The plugin is listed in Anthropic's official marketplace as `adobe-for-creativity`.
- Sources: [adobe/skills README](https://github.com/adobe/skills); [claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

**Other**
- **Cavalry:** no MCP found (not specifically searched; see PENDENTE).
- **GUNMIN-KIM/after-effects-codex-agent** (23★): "Codex operating rules and quality references for Adobe After Effects workflows" — a skill-like ruleset — [repo](https://github.com/GUNMIN-KIM/after-effects-codex-agent)

### Inferences
- "After-Effects-grade" output for this user must come from code (Remotion/HyperFrames + motion principles) or from cloud AI video. Driving AE itself would need a Windows/macOS machine with an AE subscription.
- Plainly is the only "AE in the loop" option compatible with the container. It needs AE templates authored by a human in AE first, plus a paid plan (pricing not checked). That is a poor fit for an iterative, code-first workflow.

### Gaps
- Plainly pricing was not checked.
- Cavalry MCP and skills were not searched.
- I did not verify whether any AE MCP supports aerender/headless rendering on Windows without the GUI.

---

## Q4. 3D: Blender MCP (and headless?), Three.js/R3F, Spline, Unity/Unreal/Godot, asset and AI-3D MCPs

### Takeaway
**MCP for Blender** (ahujasid, formerly blender-mcp, 30.2k★) is the de-facto standard. It is an MCP server plus a **Blender add-on running a socket server inside a live Blender (port 9876)**, with Poly Haven, Sketchfab and Poly Pizza assets and Tripo/Rodin/Hunyuan3D generation. Its docs assume the Blender GUI; headless `blender -b` operation is **not documented**. Blender now also has an **official "Blender Lab" MCP** (Blender 5.1+, llama.cpp-documented). For the user's web-based pipeline, Three.js-oriented skills (3dviz-pro-max, motion-video-kit's Three.js patterns, `@remotion/three`) are the realistic 3D route. AI-3D generators (Meshy official MCP, Tripo official MCP, Higgsfield `generate_3d`) can produce GLB assets via API.

### Cited Findings
**ahujasid/mcp-for-blender** — 30,231★, pushed 2026-10-06, created 2025-03-07 — [repo](https://github.com/ahujasid/mcp-for-blender)
- Disclaimer: "third-party integration and not made by Blender". The PyPI package was renamed from `blender-mcp` to `mcp-for-blender`.
- Install:
  - `curl -LsSf https://www.mcp-for-blender.com/install.sh | sh` (sets up clients and add-on), or `uvx mcp-for-blender setup`.
  - Claude Code: `claude mcp add blender uvx mcp-for-blender`.
  - Add-on: `uvx mcp-for-blender install-addon`, then enable it in Blender → Preferences.
- Requires **Blender 3.0+**, Python 3.10+ and uv.
- "The addon starts its server when Blender opens"; otherwise use the N-panel → "Start MCP Server".
- 9 tools:
  - `execute_blender_code`
  - `look`: viewport, camera, multi-angle sheet, animation strip, rendered/wireframe/xray views
  - `get_scene_info`
  - `generate_3d`: Tripo, Hunyuan3D, Hyper3D Rodin; "premium" generators without your own keys
  - `search_assets` / `import_asset`: Poly Haven HDRIs/textures/models, Sketchfab, Poly Pizza
  - `get_addon_status`
  - telemetry controls
- A Docker image exists, but "Blender itself still runs on your machine — the container only hosts the MCP server".
- API keys can be injected via env vars "for headless setups or CI" (`BLENDERMCP_SKETCHFAB_API_KEY`, `BLENDERMCP_HYPER3D_API_KEY`, `BLENDERMCP_HUNYUAN3D_*`, `BLENDERMCP_POLYPIZZA_API_KEY`).
- The socket has no authentication. `BLENDER_MCP_SAFE_MODE=1` validates scripts.
- Poly Pizza's CDN "blocks datacenter, VPN and cloud IPs".
- Telemetry is opt-in.

**Blender Lab official MCP** — [blender.org/lab/mcp-server](https://www.blender.org/lab/mcp-server/)
- "Lightweight MCP server for Blender" that gives natural-language access to Blender's Python API, oriented to documentation and understanding complex setups.
- Requires **Blender 5.1+**. Add-on `mcp-1.0.3.zip` via the Blender Lab extensions repo; MCP server as a `.mcpb` bundle or from source.
- Documented client: llama.cpp.
- Security warning: it executes LLM code without safeguards, so use a VM.
- Source code: projects.blender.org/lab/blender_mcp.
- The page does not address background (`-b`) mode.
- Third-party listings say it uses the same port 9876 as community servers but an incompatible protocol (via search summary, UNVERIFIED) — [a2a-mcp.org entry](https://a2a-mcp.org/entry/blender-lab-mcp-server.md); [GameDev.net Blender Lab Q1 2026 report](https://gamedev.net/news/2955-blender-lab-activity-report-q1-2026/)

**Other Blender MCPs and skills**
- **HoldMyBeer-gg/blenderwright** — 158★, pushed 2026-10-07 — [repo](https://github.com/HoldMyBeer-gg/blenderwright)
  - 191 tools in 28 modules and 12 expert prompts. Also a GUI add-on + TCP server.
  - Fast OpenGL viewport screenshots for self-critique. `uvx blenderwright`.
- bpy-dev/blender-mcp: 98★, created 2026-09-09; "Independent enhanced distribution of Blender Lab MCP: standalone bpy…". This could enable headless use via the `bpy` module, but its README fetch returned empty, so UNVERIFIED — [repo](https://github.com/bpy-dev/blender-mcp)
- arjun988/blender-skills: 277★; 94 Blender skills.
- dhakalnirajan/blender-open-mcp: 119★; open-weights models.
- squall01337/mixamo-llm-mocap: 349★; video → Mixamo rig animation via Blender MCP.
- Stale forks: VxASI/blender-mcp-vxai (300★, last push 2025-03-21) and AIGODLIKE/GenesisCore (138★, last push 2025-04-18).
- Sources: [arjun988/blender-skills](https://github.com/arjun988/blender-skills); [dhakalnirajan/blender-open-mcp](https://github.com/dhakalnirajan/blender-open-mcp)

**Three.js / WebGL skills**
- **viettranx/3dviz-pro-max** — 689★, created 2026-09-10 — [repo](https://github.com/viettranx/3dviz-pro-max)
  - Agent skill and Claude Code/Codex plugin for Three.js/Blender scenes: 223 recipes, 440 knowledge records, 22 kits, 37 style profiles.
  - Its showcase captures were made "on a real GPU".
- agiwhitelist/auteur: 1,033★; web as film, GSAP/Three.js, anti-slop linter.
- AThevon/genjutsu: 425★; GSAP/Motion/Three.js/SwiftUI/Compose motion skills, "interaction thesis" approval.
- camilleroux/genart-skill: 147★.
- Sources: [auteur](https://github.com/agiwhitelist/auteur); [genjutsu](https://github.com/AThevon/genjutsu)
- HyperFrames has a Three.js adapter — [HyperFrames](https://github.com/heygen-com/hyperframes). remotion-superpowers lists `@remotion/three` "Three.js scenes and 3D product showcases" — [remotion-superpowers](https://github.com/DojoCodingLabs/remotion-superpowers). motion-video-kit has `three-js-patterns.md` and `product-hero-realism.md` — [motion-video-kit](https://github.com/echris6/motion-video-kit)

**Remotion's own 3D and GPU guidance (resumed research, 2026-10-08)**
- **`@remotion/three`** (`npm i three @react-three/fiber @remotion/three @types/three`) — [Remotion docs: @remotion/three](https://www.remotion.dev/docs/three)
  - `<ThreeCanvas>` lets R3F scenes use `useCurrentFrame()`.
  - `<ThreeWebGPUCanvas>` uses Three.js `WebGPURenderer` with TSL node materials.
  - `useVideoTexture()` / `useOffthreadVideoTexture()` map a Remotion video onto a 3D surface.
  - The official starter **`remotion-dev/template-three` "features a 3D phone with a video inside which you can effortlessly swap out"**, with editable color, size, thickness and corner radius. This is directly analogous to Rotina's phone mockup — [remotion-dev/template-three](https://github.com/remotion-dev/template-three)
- **GL backends (`--gl`)** — [Remotion docs: --gl flag](https://www.remotion.dev/docs/gl-options); [Remotion docs: Using the GPU](https://www.remotion.dev/docs/gpu)
  - Options: `null` (Remotion 4 default, Chrome decides), `angle` (Remotion 5 default, auto-falls back to SwiftShader), `egl`, `swiftshader`, `vulkan`, `angle-egl`, `swangle` (Lambda/Cloud Run default).
  - "**On a machine with no GPU, `swangle` is recommended. Rendering might be slow.**"
  - In headless mode Chromium disables the GPU, and WebGL (Three.js), `filter: blur()`, gradients, shadows and transforms are listed as GPU-accelerated content that slows down without it.
  - Set it via `--gl=swangle`, `Config.setChromiumOpenGlRenderer("swangle")` or `chromiumOptions.gl`.

**React Three Fiber MCPs** (all tiny)
- nikolas-sapa/ns-ui: 18★.
- glbforge/glbforge: 2★; GLB optimize + R3F viewers, CLI + MCP.
- dev261004/web3d-mcp-server: 1★.
- **yusuftuhh/mockup-studio** (5★, pre-1.0) — [repo](https://github.com/yusuftuhh/mockup-studio)
  - "3D device mockup promo videos" (Rotato-like): R3F + FFmpeg, real device models (iPhone 16 Pro, Pixel 9…), keyframes, and a separate Rust MCP server so Claude Code can create scenes and trigger renders.
  - **macOS Apple Silicon only.**

**Spline**
- aydinfer/spline-mcp-server: 85★; unofficial, uses the Spline API.
- lesleslie/spline-mcp: 4★.
- No official Spline MCP found.
- Sources: [aydinfer/spline-mcp-server](https://github.com/aydinfer/spline-mcp-server)

**Game engines**
- Unity:
  - CoplayDev/unity-mcp: 14,766★.
  - IvanMurzak/Unity-MCP: 4,400★.
  - CoderGamester/mcp-unity: 1,922★.
- Unreal:
  - chongdashu/unreal-mcp: 2,091★.
  - flopperam/unreal-engine-mcp: 1,092★; "now owned by Aura".
  - Natfii/UnrealClaude: 911★; UE 5.7.
  - ChiR24/Unreal_mcp: 909★.
  - prajwalshettydev/UnrealGenAISupport: 654★.
- Godot:
  - Coding-Solo/godot-mcp: 5,976★.
  - hi-godot/godot-ai: 2,858★.
  - yurineko73/Godot-MCP-Native: 836★.
- Sources: [CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp); [chongdashu/unreal-mcp](https://github.com/chongdashu/unreal-mcp); [Coding-Solo/godot-mcp](https://github.com/Coding-Solo/godot-mcp)

**AI-3D generation**
- **Tripo official MCP** (VAST-AI-Research/tripo-mcp) — 210★ — [repo](https://github.com/VAST-AI-Research/tripo-mcp)
  - "Alpha", "supports Tripo Blender Addon integration".
  - Requires Blender + the Tripo add-on. `uvx tripo-mcp`.
- **Meshy official MCP** (via search summary) — [Meshy docs: AI integration](https://docs.meshy.ai/api/ai)
  - `@meshy-ai/meshy-mcp-server` (github.com/meshy-dev/meshy-mcp-server).
  - `npx add-mcp @meshy-ai/meshy-mcp-server --env MESHY_API_KEY=msy_…`.
  - Tools `meshy_text_to_3d`, `meshy_text_to_3d_refine`, `meshy_image_to_3d`, `meshy_multi_image_to_3d`.
  - Also a no-MCP "meshy-3d-agent" skill pack.
- mordor-forge/trident-mcp: 5★; Tripo/Meshy/Rodin — [repo](https://github.com/mordor-forge/trident-mcp)
- Hyper3D Rodin and Hunyuan3D are available through MCP for Blender's `generate_3d` — [mcp-for-blender](https://github.com/ahujasid/mcp-for-blender)
- scenario-labs/skills: 918★; "images, video, audio, and 3D from any AI agent… through the Scenario MCP" — [repo](https://github.com/scenario-labs/skills)
- Higgsfield `generate_3d` (image → GLB mesh), observed in this session's Higgsfield connector instructions. No public URL; see Q6.

### Inferences
- **Container feasibility of Blender MCP:** it needs a running Blender process hosting the add-on's socket server. In a no-GPU Linux container this means installing Blender for Linux and running it under Xvfb (or attempting background mode, which is undocumented). Cycles CPU renders would be slow on 4 cores. This is feasible in principle but untested and heavy. The bpy-dev "standalone bpy" variant may be a headless path, but that is UNVERIFIED.
- For a phone-mockup promo, Three.js inside Remotion (`@remotion/three`) with a GLB phone model is the most pipeline-compatible "true 3D" upgrade over CSS-3D. The GLB could come from Sketchfab or Poly Haven via Blender, or from Meshy/Tripo/Higgsfield. CPU WebGL performance in headless Chromium (SwiftShader) is unverified.
- Unity, Unreal, Godot, Spline-app and C4D/Houdini are out of scope for this container and use case.

### Gaps
- No test of `blender -b` with the MCP add-on, or of Blender Lab MCP in background mode.
- No measurement of WebGL/Three.js render speed in this headless Chromium without a GPU.
- Hunyuan3D official Tencent MCP and Sketchfab/Poly Haven standalone MCPs were not searched separately.

---

## Q5. Voice / audio: ElevenLabs MCP and skills, other TTS MCPs, music and SFX MCPs

### Takeaway
ElevenLabs' **local MCP (`elevenlabs-mcp`) is deprecated and archived**. Its **hosted MCP** (`https://api.elevenlabs.io/v1/mcp`, OAuth) is focused on managing Agents Platform voice agents, plus a basic "generate speech" tool. For media production the right path is now the official **`elevenlabs/skills`** (TTS, sound effects, music, voice changer, isolator, dubbing, STT) used with an API key over plain HTTPS. This works in the container. Other options:
- Official MCPs from MiniMax (TTS, voice clone/design, Hailuo video), Cartesia (small), and Google's GenMedia MCP servers (Gemini TTS, Chirp 3 HD, Lyria music, Veo).
- The Resemble Remotion skill.
- A local Kokoro MCP.
- Local music/SFX generation (Stable Audio 3 via agent-audio) is too heavy for 15 GB RAM.

### Cited Findings
**ElevenLabs**
- **elevenlabs/elevenlabs-mcp** — 1,536★, **archived** — [repo](https://github.com/elevenlabs/elevenlabs-mcp)
  - README: "This local MCP server is deprecated in favor of the ElevenLabs hosted MCP server… no longer actively maintained."
  - It was run with `uvx elevenlabs-mcp` + `ELEVENLABS_API_KEY`. Tools covered TTS, voice design and cloning, speech-to-speech, STT, audio isolation, `video_to_music` and music inpainting.
  - The README mentions "a free tier with 10k credits per month".
- **Hosted MCP**: `https://api.elevenlabs.io/v1/mcp`, with EU/IN/SG residency URLs and OAuth ("no API keys are copied into the client") — [ElevenLabs hosted MCP docs](https://elevenlabs.io/docs/agents-platform/operate/hosted-mcp)
  - Capabilities: create/update agents, prompts, voices, tests, branches, knowledge base…, plus "generate speech audio from text, returned as a short-lived download link".
  - Sound effects, music, voice design/cloning and STT are **not listed**.
  - No Claude Code command is given (Claude Desktop → Settings → Connectors).
- **elevenlabs/skills (official Agent Skills)** — MIT — [repo](https://github.com/elevenlabs/skills)
  - `npx skills add elevenlabs/skills`.
  - Skills: `text-to-speech`, `speech-to-text`, `speech-engine`, `agents`, `sound-effects`, `music`, `voice-changer`, `voice-isolator`, `dubbing`, `setup-api-key`.
  - Requires `ELEVENLABS_API_KEY`. SDKs: Python `elevenlabs`, JS `@elevenlabs/elevenlabs-js` (warns against the outdated `elevenlabs` npm package), CLI `@elevenlabs/cli`.
- **Models used by the official ElevenLabs skills (read 2026-10-08):**
  - `text-to-speech/SKILL.md` (MIT) — [elevenlabs/skills text-to-speech](https://github.com/elevenlabs/skills/blob/main/text-to-speech/SKILL.md):
    - Covers "90+ languages". Examples "default to **`eleven_v4`**, the latest and highest-quality model" ("highest quality, emotional range, audio tags, voice cloning accuracy").
    - `eleven_v4_turbo`: ~100 ms, real-time via a Text-to-Dialogue WebSocket.
    - `eleven_flash_v2_5`: 32 languages, ~75 ms, lowest cost.
    - `eleven_multilingual_v2`: 29 languages, "most stable on very long-form".
    - `eleven_v3`: 70+ languages, "previous generation expressive model".
    - `language_code` enforces pronunciation and normalization on supporting models.
  - `music/SKILL.md` — [elevenlabs/skills music](https://github.com/elevenlabs/skills/blob/main/music/SKILL.md):
    - Default model **`music_v2_5`** ("most advanced"); `music_v2`/`music_v1` only on request.
    - APIs: `music.compose`, `composition_plan.create` (fine-grained section control), `compose_detailed` (+ `store_for_inpainting`), `compose_detailed_stream` (SSE with optional word timestamps), `music.upload` for inpainting.
    - A video-to-music API combines videos in order with an optional description.
  - `sound-effects/SKILL.md` — [elevenlabs/skills sound-effects](https://github.com/elevenlabs/skills/blob/main/sound-effects/SKILL.md):
    - Model `eleven_text_to_sound_v2`; `duration_seconds` 0.5–30; `prompt_influence` 0–1 (default 0.3); **`loop=true`** for seamless loops; outputs `mp3_44100_128` (default) up to `pcm_44100`.
- Third-party alternative: wynandw87/claude-code-elevenlabs-mcp (0★); 8 tools including TTS, SFX, music, cloning, isolation — [repo](https://github.com/wynandw87/claude-code-elevenlabs-mcp)
- **Fish Audio:** no official MCP found (GitHub search 2026-10-08). Community options:
  - da-okazaki/mcp-fish-audio-server: 14★, updated 2026-09-17.
  - AceDataCloud/FishMCP: 1★, via AceDataCloud.
  - kevinten-ai/mcp-voice-clone: 0★; Fish Audio + ElevenLabs.
  - Sources: [da-okazaki/mcp-fish-audio-server](https://github.com/da-okazaki/mcp-fish-audio-server); [AceDataCloud/FishMCP](https://github.com/AceDataCloud/FishMCP)
- **Azure Speech** (via search summary) — [Microsoft Learn: Azure Speech in Foundry Tools for agents](https://learn.microsoft.com/en-my/Azure/foundry/agents/how-to/tools/azure-ai-speech)
  - Microsoft offers an "Azure Speech MCP Server" as a **remote MCP tool for agents in Microsoft Foundry Agent Service** (public preview). It requires a Foundry resource, an API key, a storage container SAS URL for audio output, and the Agent Service Enterprise tier for MCP tools. This is aimed at Foundry agents, not Claude Code.
  - The separate **Azure MCP Server** also has a speech toolset (TTS/STT via natural language). I saw it only on a mirror of the Learn docs: azure/developer/azure-mcp-server/tools/ai-services-speech (UNVERIFIED official URL).
- **OpenAI TTS:** no official OpenAI audio MCP found. Community: blacktop/mcp-tts and openrouter-mcp-multimodal (above). Azure/OpenAI TTS community MCPs found on GitHub are tiny (≤1★).
- **MiniMax music:** the READMEs of MiniMax-MCP, MiniMax-MCP-JS and MiniMax `cli` contain no "music" mentions (grep, 2026-10-08), so music generation is **not exposed** via MiniMax's MCP as far as documented — [MiniMax-MCP-JS](https://github.com/MiniMax-AI/MiniMax-MCP-JS); [MiniMax cli](https://github.com/MiniMax-AI/cli)

**Other TTS / voice MCPs**
- **MiniMax official MCP** (MiniMax-AI/MiniMax-MCP) — [repo](https://github.com/MiniMax-AI/MiniMax-MCP)
  - Tools: `text_to_audio`, `list_voices`, `voice_clone`, `voice_design`, `generate_video` (MiniMax-Hailuo-02, 6 s/10 s, 768P/1080P), `query_video_generation`, `text_to_image`.
  - Transports: stdio and SSE. The API host must match the key's region (api.minimax.io vs api.minimaxi.com).
  - MiniMax recommends its `mmx-cli` as an agent skill. A music-generation tool was not confirmed in the README.
- **Cartesia official MCP** (cartesia-ai/cartesia-mcp): 15★, updated 2026-09-30 — [repo](https://github.com/cartesia-ai/cartesia-mcp)
- **Google GenMedia MCP servers** — [mcp-genmedia README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia); [GenMedia Creative Studio README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio)
  - Location: GoogleCloudPlatform/vertex-ai-creative-studio → `experiments/mcp-genmedia`. The installer URL references the repo name `genmedia-creative-studio`, so the repo may have been renamed.
  - Go binaries: Gemini Image (Nano Banana), Imagen (deprecated), **Gemini TTS, Chirp 3 HD**, Gemini Transcribe, **Veo 3/3.1**, Gemini Omni, **Lyria** music, AVTool (audio/video compositing).
  - Agent skills: `genmedia-voice-director`, `story-generator`, `install-mcp-genmedia`.
  - Installer: `curl -sL …/mcp-genmedia-go/install-online.sh | bash`.
  - "Not an officially supported Google product". Requires a Google Cloud project with Vertex AI.
- **resemble-ai/remotion-resemble-skill**: see Q1 — [repo](https://github.com/resemble-ai/remotion-resemble-skill)
- **mberg/kokoro-tts-mcp** — 82★, updated 2026-09-17 — [repo](https://github.com/mberg/kokoro-tts-mcp)
  - Local Kokoro ONNX weights, mp3 via ffmpeg, optional S3 upload.
  - Defaults: `TTS_VOICE=af_heart`, `TTS_LANGUAGE=en-us`.
- blacktop/mcp-tts: 72★; macOS say, ElevenLabs, Google, OpenAI TTS.
- AllVoiceLab official MCP: 62★.
- stabgan/openrouter-mcp-multimodal: 96★; speech, music and video generation via OpenRouter.
- zth0828/mmx-mcp-server: 31★; MiniMax CLI wrapper.
- Sources: [blacktop/mcp-tts](https://github.com/blacktop/mcp-tts); [AllVoiceLab-MCP](https://github.com/allvoicelab/AllVoiceLab-MCP); [openrouter-mcp-multimodal](https://github.com/stabgan/openrouter-mcp-multimodal)
- **Fish Audio:** used via a script in video-talkcraft ("Fish Audio free tier"). No official Fish Audio MCP verified — [video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft)

**Music / SFX**
- ElevenLabs `music` and `sound-effects` skills — [elevenlabs/skills](https://github.com/elevenlabs/skills)
- Google Lyria via GenMedia MCP — [mcp-genmedia](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- Suno (via KIE) and ElevenLabs SFX in remotion-superpowers — [repo](https://github.com/DojoCodingLabs/remotion-superpowers)
- ACE-Step music on your own cloud GPU in claude-code-video-toolkit — [repo](https://github.com/digitalsamba/claude-code-video-toolkit)
- HyperFrames `media-use` and `hyperframes-audio` (voiceover ducking "carve", EQ/comp/limiter) — [HyperFrames](https://github.com/heygen-com/hyperframes)
- **AIEGOBOT/agent-audio** — 35★, "early preview v0.1" — [repo](https://github.com/AIEGOBOT/agent-audio)
  - Local Stable Audio 3 Medium MCP + skill.
  - Planning guidance for a Windows CPU setup: "25 GB or more free disk… 32 GB-class RAM system recommended", with ~7.36 GB of models.
- video-shotcraft bundles 149 Mixkit SFX; motion-video-kit has SFX softening and gain-solving scripts — [shotcraft](https://github.com/Vincentwei1021/video-shotcraft); [motion-video-kit](https://github.com/echris6/motion-video-kit)

### Inferences
- For "high-quality voice" in this container, call the ElevenLabs REST API through the official skills (needs a paid or free-tier key), or Google Chirp 3 HD / Gemini TTS via GenMedia (needs a GCP project). Both are plain HTTPS. OAuth-based hosted MCPs may be awkward in a headless container, and ElevenLabs' hosted MCP doesn't expose SFX or music anyway.
- pt-BR voice quality per vendor was **not evaluated here**; that belongs to the voice researcher.
- Local generative music/SFX models (Stable Audio 3, ACE-Step) are impractical on 4 CPU / 15 GB / no GPU. Use API services, curated libraries (Mixkit via shotcraft), or the user's existing numpy synth.

### Gaps
- Not verified:
  - official MCPs from OpenAI (audio), Azure Speech or Fish Audio;
  - Replicate's official MCP for audio models;
  - whether MiniMax MCP includes music generation.
- ElevenLabs' current models, pt-BR voices and pricing were not checked.
- I did not test whether OAuth hosted MCPs (ElevenLabs, LottieFiles, fal, Higgsfield) complete their auth flow from this cloud container.

---

## Q6. AI video-generation MCPs for cinematic B-roll / 3D shots (Higgsfield, Runway, Luma, Kling, Veo, Seedance, Pika)

### Takeaway
The user already has the **Higgsfield** connector, a hosted MCP at `https://mcp.higgsfield.ai/mcp` that needs a paid subscription and draws credits. It exposes image, video and audio generation, voice creation, image → 3D (GLB), a 3D scene builder, upscale and reframe. Its models reportedly include Seedance, Kling, Veo and Sora. Alternatives:
- **Runway's official skills** (in Anthropic's official marketplace as `runway-api`). Runway's old MCP repo is archived.
- **fal's official hosted MCP** (1,000+ models).
- A reportedly official **Kling MCP** (UNVERIFIED).
- **Google GenMedia MCP** (Veo).
- **MiniMax MCP** (Hailuo).
- **VibeFrame** (multi-provider CLI + MCP with a hard cost cap).

No official Luma video MCP or Pika MCP was found.

### Cited Findings
**Higgsfield**
- Hosted MCP endpoint `https://mcp.higgsfield.ai/mcp`, added as a custom connector in Claude (OAuth login) (via search summary) — [Higgsfield help center: connect to Claude](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-claude) (returned 404 when fetched directly on 2026-10-08); [creatify.ai explainer](https://creatify.ai/pt/blog/what-is-higgsfield-mcp-what-it-does-what-it-costs-and-how-to-use-it); [miracamp guide](https://www.miracamp.com/learn/content-creation/claude-x-higgsfield-mcp-connector)
  - Requires a **paid Higgsfield subscription**.
  - Generations deduct credits "at standard rates"; unlimited/free benefits apply only on higgsfield.ai.
  - "No native credit cap".
  - For Claude Code, Higgsfield pairs it with its CLI. A third-party guide shows `claude mcp add higgsfield https://mcp.higgsfield.ai/mcp`.
  - Third-party guides claim 30+ models including Veo, Sora, Kling, Seedance, Soul and Cinema Studio.
- **Observed directly in this session's Higgsfield connector server instructions (2026-10-08; no public URL):**
  - tools/workflows `generate_image`, `generate_video`, `generate_audio`, `create_voice`, `generate_3d` ("turn an image into a 3D GLB mesh");
  - a 3D scene / location-angles preset `/3d-jutsu`, plus the tool `scene_builder_3d_generate_video` exposed to this session;
  - `motion_control`, `upscale_image/video`, `outpaint_image`, `reframe`, `remove_background`, `relight_image`, `virality_predictor`;
  - Marketing Studio presets (product shots, UGC/ads), "Genjutsu" motion transfer/object replacement, AI Influencer character sheets, and a website-builder workflow;
  - `models_explore(action:'recommend')` for choosing a model.
- **Official Higgsfield MCP page (fetched 2026-10-08)** — [higgsfield.ai/mcp](https://higgsfield.ai/mcp)
  - Endpoint `https://mcp.higgsfield.ai/mcp`. Clients named: Claude, Claude Code (tabs "Claude / Claude Code / CLI / Other"), a ChatGPT plugin, OpenClaw, Hermes Agent, NemoClaw. "No API key is required."
  - Models named: Nano Banana Pro, Google Omni Flash, Seedance 2.5, Seedream 5.0 Lite, Seedance 2.0, Kling 3, GPT Image 2, Soul 2.0; "30+ models" claimed. Veo and Sora are not named on this page.
  - Skill bundles:
    - "Paid Ads": localization, recreation, resizing, hooks/headlines.
    - **"Motion Design" — After Effects workflows** (illustration animation, paper collage, presentations, SaaS, whiteboard).
    - **"Production"** — Blender (destruction, exploded views, scene building, cartoon shaders), Premiere Pro, After Effects VFX, Illustrator, Photoshop, TouchDesigner, DaVinci Resolve. The page notes these "need local software installed".
    - Faceless/UGC formats.
  - The page states no plan, credit or rate-limit details.
- **Tool schema actually exposed in this session (via ToolSearch, 2026-10-08):**
  - `scene_builder_3d_generate_video`: "Generate a **paid Seedance 2.5** video in a 3D Jutsu project".
    - Modes: t2v, omni_reference (image/start_image/end_image/video/audio references), video_edit, video_extension.
    - **It can use "a published Blender render as start_image"** (operationId/artifactId).
    - aspectRatio includes **9:16**; duration 4–30 s; resolution 480p/720p/1080p; `draft` (480p) then `draftJobId` 1080p finalization; `generateAudio` default true.
    - Up to 30 images / 10 videos / 10 audio refs; requestId-based idempotent retries.
  - `show_katana_result`: displays a finished "Katana" video export.
  - The broader tool set described in the connector's server instructions (Q6 bullet above) was not individually loadable as deferred tools here. (Primary observation, no public URL.)
- Higgsfield prompt-engineering skills (community):
  - OSideMedia/higgsfield-ai-prompt-skill: 703★; Seedance 2.5/2.0, Cinema Studio, Kling 3.0 Motion Control.
  - beshuaxian/higgsfield-seedance2-jineng: 937★.
  - rediumvex/ai-video-generator-claude: 406★.
  - AKCodez/higgsfield-claude-skills: 405★; uses **Playwright browser automation**, a possible ToS risk (inference).
  - Sources: [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill); [beshuaxian](https://github.com/beshuaxian/higgsfield-seedance2-jineng); [AKCodez](https://github.com/AKCodez/higgsfield-claude-skills)

**Runway**
- runwayml/runway-api-mcp-server is **archived** (23★) — [repo](https://github.com/runwayml/runway-api-mcp-server)
- The official **runwayml/skills** — [runwayml/skills README](https://github.com/runwayml/skills); [claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
  - Pitch: "Generate videos, images, and audio with Runway's API". Models: seedance2, gen4.5, veo3, Nano Banana Pro.
  - Install: `claude plugin marketplace add anthropics/claude-plugins-community` + `claude plugin install runway-api-skills@claude-community`, or `npx skills add runwayml/skills`.
  - Prerequisites: a Runway developer account with **prepaid credits ($10 minimum)**, uv, and `RUNWAYML_API_SECRET`.
  - Listed in Anthropic's official marketplace as plugin `runway-api`.

**fal**
- Official hosted MCP (via search summary) — [fal docs: Claude Code](https://fal.ai/docs/documentation/setting-up/mcp/claude-code); [fal docs: MCP](https://fal.ai/docs/documentation/setting-up/mcp); [fal blog](https://blog.fal.ai/connect-your-ai-to-1-000-models-with-the-fal-mcp-server)
  - Current command: `claude mcp add --transport http --scope user fal https://mcp.fal.ai/mcp-relay`, with browser auth via `/mcp`.
  - Older variant: `https://mcp.fal.ai/mcp` with `Authorization: Bearer <FAL_KEY>`.
  - Capabilities: model discovery, schema lookup, inference and uploads; "1,000+ models".
  - Docs-only MCP at docs.fal.ai/mcp.

**Kling**
- Reportedly an official hosted MCP at `https://kling.ai/mcp` with ~16 tools (`text_to_video`, `image_to_video`, `text_to_image`, `image_to_image`, `motion_control`…) and login-based auth. A Kuaishou financial report mentions "officially launched Kling MCP and Kling CLI". **UNVERIFIED (secondary sources only)** — [aituber.app guide](https://aituber.app/blog/kling-ai-mcp-server/); [yespress Kling profile](https://yespress.io/products/kling-ai.md); [LongPort news](https://longportapp.cn/news/296359117)

**Replicate (resumed research, 2026-10-08; via search summary)**
- Replicate runs an **official hosted MCP** to "find, compare, and run" models through its HTTP API.
- Claude Code: `claude mcp add replicate https://mcp.replicate.com/sse --transport sse --scope user`, then `/mcp` for browser auth; requires a Replicate API token.
- The older community `deepfates/mcp-replicate` is no longer developed.
- Sources: [Replicate docs: MCP](https://replicate.com/docs/reference/mcp); [mcp.replicate.com](https://mcp.replicate.com/)

**Luma**
- No official Luma Labs video MCP found. There are community servers (bobtista/luma-ai-mcp-server: 5 s/9 s clips, Luma API key; and AceDataCloud hosted).
- Name clash: `mcp.luma.com` is Luma's *events* product.
- Sources (via search summary): [mcp.so Luma AI MCP](https://mcp.so/servers/luma-ai-mcp-server?tab=config); [Luma (events) MCP help](https://help.luma.com/p/mcp)

**Google, MiniMax and multi-provider**
- **Google Veo**: via the GenMedia MCP servers (Q5). molkex/mcp-flow-google (8★) drives Google Flow (Veo + Nano Banana) on your own Google account — [mcp-genmedia](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia); [list](https://github.com/zhuyansen/awesome-claude-video-skills)
- **MiniMax Hailuo-02**: via MiniMax MCP (Q5).
- **vericontext/vibeframe** — 174★ — [repo](https://github.com/vericontext/vibeframe)
  - CLI + MCP for Seedance, Runway, Veo, Kling and Gemini Omni on your own keys.
  - `--dry-run` prices the build; `--max-cost` is a hard ceiling. Wraps Remotion and HyperFrames.

**Other**
- **Pika**: no MCP found.
- **Self-hosted**: patraxo/ltx2-vidgen-skill runs LTX-2.3 on your Modal GPU (~$0.02/clip claimed) — [list](https://github.com/zhuyansen/awesome-claude-video-skills)

### Inferences
- For Rotina, AI video is best used for short **B-roll / establishing shots** (gym, wallet, morning routine) or **image-to-video of rendered phone frames**, composited inside Remotion. AI video models are unreliable at rendering exact app UI text, so the UI itself should stay code-rendered.
- Higgsfield is already connected, so it is the zero-setup option. Costs are per-credit with no cap, so give the agent an explicit budget.
- Runway skills and fal MCP are good pay-as-you-go alternatives. VibeFrame's cost ceiling is attractive for agent loops.

### Gaps
- The official Higgsfield tool list and pricing could not be confirmed from a public page (the help URL returned 404). Only this session's connector instructions show the tools.
- The Kling MCP endpoint was not verified.
- Replicate's official MCP was not checked.
- Seedance's official BytePlus MCP was not searched.

---

## Q7. Design-taste / motion-principles skills

### Takeaway
The useful "taste" layer now comes from official library skills (**GSAP official skills**, 16k★; **Motion AI Kit** with MCP; **Remotion skills**) plus Anthropic's own **frontend-design** skill and plugin. On top of those sit community skills that encode motion grammar and quality bars, e.g. motion-video-kit (28 launch films, critic loop), onetake (continuity oracle, measured moves, shutter motion blur), auteur and genjutsu (anti-slop) and transitions.dev.

### Cited Findings
**Anthropic**
- **anthropics/skills**: `/plugin marketplace add anthropics/skills`, then `/plugin install example-skills@anthropic-agent-skills` (or `document-skills`) — [anthropics/skills README](https://github.com/anthropics/skills); [marketplace.json](https://github.com/anthropics/skills/blob/main/.claude-plugin/marketplace.json)
  - example-skills = algorithmic-art, brand-guidelines, canvas-design, doc-coauthoring, **frontend-design**, internal-comms, mcp-builder, skill-creator, **slack-gif-creator**, theme-factory, web-artifacts-builder, webapp-testing.
- **frontend-design** is also an Anthropic plugin in the official marketplace: "Create distinctive, production-grade frontend interfaces… avoids generic AI aesthetics". Install with `/plugin install frontend-design@claude-plugins-official` — [claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

**GSAP**
- **greensock/gsap-skills (official)** — 16,027★, created 2026-03-04 — [repo](https://github.com/greensock/gsap-skills)
  - Skills: gsap-core (easing, stagger), gsap-timeline, gsap-scrolltrigger, gsap-plugins (Flip, SplitText, MorphSVG, CustomEase, MotionPath…), gsap-utils, gsap-react, gsap-performance, gsap-frameworks.
  - Install: `npx skills add https://github.com/greensock/gsap-skills`, or `/plugin marketplace add greensock/gsap-skills`.
  - GSAP is now "100% free… including every plugin… commercial use" after Webflow's acquisition.

**Motion (motion.dev) AI Kit** (via search summary) — [Motion AI Kit install](https://motion.dev/docs/ai-kit-install)
- MCP: search Motion docs and saved transitions; CSS spring generation is in the free tier.
- Skills include `/css-spring`.
- Motion+ token unlocks the source of 370+ examples.
- The installer targets Claude Code, Cursor, Windsurf and VS Code.

**Community taste and motion skills**
- echris6/motion-video-kit (motion grammar, quality bar, critic prompts) and feitangyuan/onetake (carry-score continuity oracle, ~38 measured moves, linear-light 180° shutter blur, **non-commercial**) — see Q2 — [motion-video-kit](https://github.com/echris6/motion-video-kit); [onetake](https://github.com/feitangyuan/onetake)
- iart-ai/motion-design-skills: 48★; "timing, typography, color, composition, After Effects, Re[motion]…" — [list](https://github.com/zhuyansen/awesome-claude-video-skills)
- agiwhitelist/auteur: executable anti-slop linter. AThevon/genjutsu: "interaction thesis" before code. Jakubantalik/transitions.dev: UI transitions. norahe0304-art/30x-video: "16-law taste codex". IskakovDamir/apple-motion: measured Apple recap typography.
- Sources: [auteur](https://github.com/agiwhitelist/auteur); [genjutsu](https://github.com/AThevon/genjutsu); [transitions.dev](https://github.com/Jakubantalik/transitions.dev); [list](https://github.com/zhuyansen/awesome-claude-video-skills)
- HyperFrames' `frame.md` turns a brand design.md into camera-ready tokens. `hyperframes-creative` covers typography and beat planning — [HyperFrames](https://github.com/heygen-com/hyperframes)

### Inferences
- The user's "too simple" problem is largely a **motion-grammar and continuity problem**: scenes replacing each other, uniform cadence, no rests, no motion blur on fast moves. The cheapest high-impact step is to load principle-encoding skills (Remotion best practices + shotcraft recipes + motion-video-kit quality bar) and adopt a render → watch → critique loop (claude-video-vision + critic prompts). onetake's ideas (carry every beat, measured moves, shutter-accumulated blur) are worth studying, but its code cannot be used commercially without a license.

### Gaps
- The Motion AI Kit page itself was not opened (only a search summary).
- No dedicated "easing/animation principles" skill from Anthropic was found beyond frontend-design and slack-gif-creator. I did not open their SKILL.md files to check motion content.

---

## Q8. Where to discover skills, plugins and MCPs

### Takeaway
The main sources are:
- **Anthropic's two official marketplaces**: `anthropics/skills` and `anthropics/claude-plugins-official` (315 plugins counted on 2026-10-08), plus `anthropics/claude-plugins-community`.
- The **official MCP Registry**.
- **skills.sh** (Vercel, `npx skills`).
- **Video-specific curated list**: zhuyansen/awesome-claude-video-skills (security-graded).
- General awesome lists.

### Cited Findings
- **claude-plugins-official**: install with `/plugin install {plugin-name}@claude-plugins-official` or browse `/plugin > Discover`. The README warns "Make sure you trust a plugin before installing". My parse of marketplace.json on 2026-10-08 counted **315 plugins** — [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
  - Media/design-relevant entries: `hyperframes`, `runway-api`, `frontend-design`, `adobe-for-creativity`, `canva`, `figma`, `cloudinary`, `togetherai-skills` (audio/video/images), `save-to-spotify` (TTS episodes), `playground`, `superdesign`, `amd-skills`.
  - No ElevenLabs, Remotion or Blender entries matched my keyword filter.
- **anthropics/claude-plugins-community** (marketplace name `claude-community`): my parse of its marketplace.json on 2026-10-08 counted **2,284 plugins**. Install pattern: `claude plugin marketplace add anthropics/claude-plugins-community` → `claude plugin install <name>@claude-community` — [anthropics/claude-plugins-community marketplace.json](https://github.com/anthropics/claude-plugins-community/blob/main/.claude-plugin/marketplace.json); [runwayml/skills](https://github.com/runwayml/skills). Media and motion entries found (names and descriptions are as listed in the marketplace; I did not open the individual repos):
  - Remotion and motion:
    - `remotion-skills-marketplace` (pasie15): "packaging the official Remotion skills… one comprehensive skill with 39 rule files covering Animation & Timing, Audio…". Likely an older single-skill repackaging; prefer the official `npx remotion skills add`.
    - `hyperframes-by-heygen`.
    - `easing-wizard` (roydigerhund): "Generate professional CSS easing curves, audit animations, and get expert motion design advice".
    - `animation-helper`: CSS/Framer Motion.
    - `videozero`: 2D animations, kinetic typography, explainer videos.
    - `framecraft` (vaddisrinivas): demo videos from one prompt — story structure, visual design, narration, orchestrating Playwright and FFmpeg.
    - `narrateai-demomaker`: record and narrate demo videos of a running web app.
    - `notes-to-video`: 3Blue1Brown-style.
    - `golpo` / `golpo-video`: AI explainer videos.
    - `eversince`: creative agent across video, image, audio and motion graphics.
    - `future-video-studio`: hosted "FVS MCP" cinematic AI video.
    - `muapi-marketing-video`.
    - `nemovideo-ai-video-tools`.
    - `inference-sh`: 150+ models incl. Veo.
    - `cellcog`: any-to-any incl. music and 3D models.
    - `together-ai-skills`.
    - `runway-api-skills`.
  - Audio and voice:
    - `djclaude` (kevdogg102396-afk): "AI music generation for Claude Code using Google Lyria 3. Generate 30-second clips or full 2-3 minute songs… genre, mood, BPM".
    - `voice-bridge` (Tomorrow-You): multi-engine TTS with "edge-tts, ElevenLabs, Kokoro, macOS say, espeak-ng".
    - `voxflow` (VoxFlowStudio): "200+ voices across 40+ languages", podcast/transcribe/video skills.
    - `slidecast`: HTML slides → voiced MP4 via ElevenLabs, bring your own key.
    - `audiorective`: Web Audio toolkit with React/three.js bindings.
  - Video watching and QA: `claude-video-vision`, `watch-video`, `peepshow`, `letmewatch`, `heimdall`, `video-to-code-skill`, `twelvelabs`.
  - No ElevenLabs-official, Blender, Lottie or Higgsfield plugin matched my keyword filter in either Anthropic marketplace.
- **zhuyansen/awesome-claude-video-skills** — 480★, created 2026-09-27 — [repo](https://github.com/zhuyansen/awesome-claude-video-skills)
  - Covers 252 repos, each "read and security-graded by Agent Skills Hub" (the GitHub description says 180 repos — a discrepancy).
  - Live filterable page: agentskillshub.top/best/claude-video-skills, refreshed every 8 h.
  - Categories: Frameworks, Promo & demos, Explainers, Editing, Shorts, Avatars, Stories, Motion graphics, Scripts, Music videos.
  - Related collections: opusvideo/awesome-claude-video and TripoGrowthLab/awesome-opus-5-5-prompts.
- General lists (stars on 2026-10-08):
  - ComposioHQ/awesome-claude-skills: 76,699.
  - hesreallyhim/awesome-claude-code: 55,240.
  - VoltAgent/awesome-agent-skills: 35,365; "1000+ agent skills".
  - travisvn/awesome-claude-skills: 15,314.
  - BehiSecc/awesome-claude-skills: 10,222.
  - Sources: [ComposioHQ](https://github.com/ComposioHQ/awesome-claude-skills); [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code); [VoltAgent](https://github.com/VoltAgent/awesome-agent-skills)
- **Official MCP Registry** (registry.modelcontextprotocol.io): preview launched Sept 2025, with namespace-verified `server.json` publishing — [MCP Registry preview announcement](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/). ElevenLabs' README carries the registry name `io.github.elevenlabs/elevenlabs-mcp` — [elevenlabs-mcp](https://github.com/elevenlabs/elevenlabs-mcp)
- **skills.sh** (Vercel; the `npx skills add` CLI used by Remotion, GSAP, ElevenLabs, HyperFrames, Runway…): ~1.37M skills indexed, ranked by installs, no vetting. **SkillsMP** is another third-party skill directory (via search summary) — [agenticskills.io directory comparison](https://agenticskills.io/ai-skills-directories); [vercel-labs/skills (referenced by GSAP)](https://github.com/vercel-labs/skills)
- **MCP directories** seen in results: Smithery (Plainly's install path), Glama, mcp.so, LobeHub, mcpservers.org — [Plainly README](https://github.com/plainly-videos/mcp-server); [glama.ai](https://glama.ai/mcp/servers/brkz25fqda)
- **agentskills.io** hosts the Agent Skills specification that Anthropic, Remotion, ElevenLabs and others follow — [anthropics/skills](https://github.com/anthropics/skills); [elevenlabs/skills](https://github.com/elevenlabs/skills)

### Inferences
- For this user, the fastest discovery path is the agentskillshub "claude-video-skills" page (security-graded) plus `/plugin > Discover` in Claude Code. Treat skills.sh popularity as unvetted, and inspect any skill's scripts before running them.

### Gaps
- The claude-plugins-community catalog was not analyzed.
- The Glama/Smithery/mcp.so listings for media MCPs were not systematically browsed.

---

## Q9. Container feasibility and ranked shortlist for Rotina (vertical 1080×1920 promos, Remotion 4, no GPU)

### Takeaway
Best value in this container:
1. Official Remotion skills.
2. Shot-recipe and motion-grammar skills (video-shotcraft, motion-video-kit, GSAP/frontend-design taste).
3. An automated watch-and-critique loop (claude-video-vision).
4. ElevenLabs official skills for voice, SFX and music (paid API key, plain HTTPS).
5. Higgsfield, already connected, for paid AI B-roll and 3D shots.

Desktop-bound MCPs (AE, C4D, Houdini, Premiere, Resolve, Unity, Unreal, Rive) and local GPU models are not viable here. Blender MCP is possible only with an untested Blender-under-Xvfb setup.

### Cited Findings (feasibility evidence)
- **Skills are instruction folders** (`SKILL.md` + references/scripts) and need no runtime beyond what their scripts use — [anthropics/skills README](https://github.com/anthropics/skills); [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills)
- HyperFrames needs Node 22+ + FFmpeg and renders via headless Chrome, which matches the container — [HyperFrames](https://github.com/heygen-com/hyperframes)
- Remotion on a low-core headless Linux box: use `--concurrency=1`, chrome-headless-shell, and `--browser-executable` if the CDN is blocked — [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)
- Blender MCP requires a live Blender with the add-on socket server; the Docker image only hosts the MCP side — [mcp-for-blender](https://github.com/ahujasid/mcp-for-blender)
- After Effects MCPs require AE 2022+ desktop — [Dakkshin/after-effects-mcp](https://github.com/Dakkshin/after-effects-mcp). Resolve MCP requires Resolve Studio scripting — [davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp). Rive MCP is Mac Early Access — [Rive docs](https://rive.app/docs/editor/mcp/integration). mockup-studio is macOS Apple Silicon only — [mockup-studio](https://github.com/yusuftuhh/mockup-studio)
- Local Stable Audio 3 recommends 32 GB-class RAM — [agent-audio](https://github.com/AIEGOBOT/agent-audio). claude-code-video-toolkit's open models run on a rented cloud GPU — [toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)
- ElevenLabs skills use REST/SDK with `ELEVENLABS_API_KEY` — [elevenlabs/skills](https://github.com/elevenlabs/skills)
- **License check (resumed research, 2026-10-08).** I read each repo's LICENSE file via raw.githubusercontent.com:
  - **Apache-2.0:** video-shotcraft, mberg/kokoro-tts-mcp. HyperFrames is Apache-2.0 per its README.
  - **MIT:** appshot, echris6/motion-video-kit, diffusionstudio/lottie (MIT-style "Permission is hereby granted", © 2026 Diffusion Studio Inc.), 3dviz-pro-max, remotion-superpowers, claude-code-video-toolkit, claude-video-vision, greensock/gsap-skills, mcp-for-blender, blenderwright, runwayml/skills, MiniMax-MCP, Dakkshin/after-effects-mcp, davinci-resolve-mcp, vibeframe, genjutsu, auteur, 30x-video, apple-motion, Liamrjohnston/remotion-motion-graphics-skill, welingtondesosa/video-motion, smit-vanani/claude-promo-video, bang-motion, lemo-opuscar.
  - **Custom (Transitions.dev):** commercial use is allowed — "use them in unlimited personal and commercial projects… The tooling is MIT" — but you may not redistribute the library as a competing pack.
  - **Restrictive:** Vincentwei1021/anything2explainer is PolyForm Noncommercial. 0xsline/OpenChatCut is AGPL-3.0. (onetake and video-talkcraft are PolyForm Noncommercial per their READMEs.)
  - **remotion-dev/skills:** no LICENSE file at the repo root. It is generated from the Remotion monorepo, so presumably covered by the Remotion license (UNVERIFIED).
  - Sources: [video-shotcraft LICENSE](https://github.com/Vincentwei1021/video-shotcraft/blob/main/LICENSE); [appshot LICENSE](https://github.com/trunghaiy/appshot/blob/main/LICENSE); [motion-video-kit LICENSE](https://github.com/echris6/motion-video-kit/blob/main/LICENSE); [transitions.dev LICENSE](https://github.com/Jakubantalik/transitions.dev/blob/main/LICENSE); [anything2explainer LICENSE](https://github.com/Vincentwei1021/anything2explainer/blob/main/LICENSE); [OpenChatCut LICENSE](https://github.com/0xsline/OpenChatCut/blob/main/LICENSE)
- **Hosted MCP reachability through the container's TLS proxy (tested 2026-10-08).** I sent a JSON-RPC `initialize` POST from this container to each endpoint:
  - `https://api.elevenlabs.io/v1/mcp` → 401 "OAuth bearer token required for the hosted MCP."
  - `https://mcp.higgsfield.ai/mcp` → 401.
  - `https://mcp.fal.ai/mcp-relay` and `https://mcp.fal.ai/mcp` → 401 "Authentication required".
  - `https://mcp.lottiefiles.com/mcp` → 401 "Missing or invalid MCP bearer token".
  - `https://kling.ai/mcp` → 401 (empty body).
  - `https://docs.fal.ai/mcp` → 308 redirect to `https://fal.ai/docs/mcp`.
  - So the endpoints are **reachable over plain HTTPS through the proxy, and all require auth**. The OAuth browser flow from a headless container was **not** tested. Higgsfield already works here because it is attached as a claude.ai connector.

### Ranked shortlist (inference, based on the findings above)
Columns: feasibility in the container (✅ works / ⚠️ needs testing or paid / ❌ not feasible) and cost.

| # | Item | Why for Rotina | Install | Container | Cost |
|---|---|---|---|---|---|
| 1 | **Remotion Agent Skills** (official) | Keeps the existing Remotion 4 stack. Gives best practices for markup, captions, render and docs. Replaces the deprecated Remotion MCP. | `npx remotion skills add` (inside the project) or `npx skills add remotion-dev/skills` | ✅ | Free (Remotion license terms apply) |
| 2 | **video-shotcraft** | 150+ shot recipe cards with tuned easing/timing TSX, 2.5D camera, beat-sync, 149-SFX library, QA methodology and headless notes. Must be re-composed from 16:9 to 9:16. | `npx skills add Vincentwei1021/video-shotcraft` | ✅ (needs `--concurrency=1`) | Free; **Apache-2.0** (bundled Mixkit audio under Mixkit license) |
| 3 | **Motion taste layer:** echris6/motion-video-kit + greensock/gsap-skills + Anthropic frontend-design (+ optional transitions.dev, diffusionstudio/lottie) | Motion grammar from 28 launch films, critic loop, loudness/frozen-time checks, product-hero realism (3D device motion, motion blur). GSAP/Lottie for micro-motion. | cp `business-motion-film` to `~/.claude/skills`; `npx skills add https://github.com/greensock/gsap-skills`; `/plugin install frontend-design@claude-plugins-official`; `npx skills add diffusionstudio/lottie` | ✅ | Free; motion-video-kit, gsap-skills and lottie are **MIT** |
| 4 | **claude-video-vision** plugin | Lets Claude *watch* its own render (frames + audio transcript) to close the critique loop. | `/plugin marketplace add https://github.com/jordanrendric/claude-video-vision` → `/plugin install claude-video-vision` | ✅ (local Whisper CPU, or Gemini key) | Free / Gemini free tier |
| 5 | **ElevenLabs official skills** | High-quality TTS (pt-BR to be validated), sound effects and music generation via API. The local MCP is archived; the hosted MCP is agent-centric. | `npx skills add elevenlabs/skills` + `ELEVENLABS_API_KEY` | ✅ (HTTPS) | Paid / free credits tier |
| 6 | **Higgsfield MCP** (already connected) | Cinematic B-roll (Seedance/Kling/Veo), 3D scene builder video, image → GLB, upscale/reframe to 9:16. | Already attached; `https://mcp.higgsfield.ai/mcp` | ⚠️ works via connector; credits | Paid subscription + credits |
| 7 | **HyperFrames** plugin (Apache-2.0) | Alternative or companion renderer with GSAP/Three.js/Lottie adapters, an audio-mixing skill and product-launch workflow. Segments can be rendered and composited into Remotion. | `claude plugin marketplace add heygen-com/hyperframes` + `claude plugin install hyperframes@hyperframes` | ✅ | Free |
| 8 | **appshot** | App-store-preview-style vertical scenes (886×1920 default) with iPhone/Pixel frames, auto-scanning the app codebase. A good reference for the Rotina format. | `npx skills add trunghaiy/appshot` | ✅ | Free; **MIT** |
| 9 | **3D upgrade path:** `@remotion/three` + GLB phone model (3dviz-pro-max / motion-video-kit Three.js patterns; Meshy MCP or Higgsfield `generate_3d` for assets) | True 3D phone with real lighting instead of CSS-3D. | `npx skills add …` / `npx add-mcp @meshy-ai/meshy-mcp-server --env MESHY_API_KEY=…` | ⚠️ CPU WebGL speed untested | Free / Meshy paid |
| 10 | **Runway skills or fal MCP** (alternatives to Higgsfield) | Pay-as-you-go video, image and audio models; Runway is in the official marketplace. | `npx skills add runwayml/skills` / `claude mcp add --transport http --scope user fal https://mcp.fal.ai/mcp-relay` | ✅/⚠️ (OAuth flow) | Runway $10 min prepaid; fal per use |
| 11 | **MCP for Blender** | Asset pipeline (Poly Haven, Sketchfab, Rodin/Hunyuan3D) and Cycles renders. | `claude mcp add blender uvx mcp-for-blender` + Blender + add-on | ⚠️ needs Blender under Xvfb; heavy; untested | Free (generators paid) |
| — | **Not recommended here** | AE/C4D/Houdini/Premiere/Resolve MCPs (desktop + license, Win/macOS); Unity/Unreal/Godot; Rive (Mac EA); mockup-studio (macOS); local audio/video models (no GPU, 15 GB RAM); onetake & video-talkcraft (PolyForm **Noncommercial**); vibe-motion/skills (unmaintained); OpenMontage (AGPLv3, very large) | — | ❌ | — |

### Inferences
- Combining items 1–4 should address "too simple" mostly through better motion grammar, continuity, motion blur, SFX and QA, at zero cost. Items 5–6 address voice quality and cinematic inserts at a cost. Item 9 is the path to genuine 3D.

### Gaps
- The shortlist ranking is my synthesis. None of the items were installed or test-rendered in the user's container.

---

## PENDENTE / NÃO PESQUISADO

Research was stopped early on the coordinator's instruction (2026-10-08), resumed, then stopped again because session credits ran low. Items marked DONE / PARTIALLY DONE were addressed in the resumed pass; everything else is still open. The following were not finished. Concrete next steps are given for each.

1. ~~**Repo licenses**~~ — **DONE (2026-10-08):** see Q9 "License check". Most are MIT/Apache. Restrictive: onetake, video-talkcraft and anything2explainer (PolyForm NC); OpenChatCut and OpenMontage (AGPL). Still open: remotion-dev/skills has no root LICENSE (presumably the Remotion license).
2. ~~**Anthropic community marketplace**~~ — **DONE (2026-10-08):** 2,284 plugins; relevant entries are listed in Q8. Still open: the community plugins (djclaude, easing-wizard, voice-bridge, voxflow, framecraft, videozero, future-video-studio) were not opened or vetted.
3. **Higgsfield official docs** — **MOSTLY DONE (2026-10-08):** the official page https://higgsfield.ai/mcp and the in-session tool schema are summarized in Q6. Still open: per-generation credit prices (e.g., Seedance 2.5 at 1080p, 9:16, 5–10 s) and plan requirements. Neither appears on the MCP page; check https://higgsfield.ai/pricing.
4. **Kling official MCP** — **PARTIALLY DONE (2026-10-08):** `https://kling.ai/mcp` exists and answers 401 (auth required) through the proxy. A web search found no primary Kling documentation page. Still open: the official tool list and pricing (check the Kling developer docs or app.klingai.com).
5. **Blender headless feasibility:**
   - test `blender -b` with mcp-for-blender's add-on server;
   - test Blender under `xvfb-run`;
   - check the bpy-dev/blender-mcp README ("standalone bpy"; my fetch returned only 14 bytes);
   - check whether Blender Lab MCP works in background mode;
   - measure Cycles CPU render time for a 1080×1920 frame on 4 cores.
6. **CPU WebGL in headless Chromium** — **PARTIALLY DONE (2026-10-08):** Remotion's docs recommend `--gl=swangle` on machines without a GPU ("Rendering might be slow"). There is an official `template-three` with a 3D phone plus a video texture (see Q4). Still open: an actual render benchmark at 1080×1920/30 fps in this container. This overlaps with the coordinator's separate "3D programático e viabilidade sem GPU" task.
7. **Hosted-MCP auth through the TLS proxy** — **PARTIALLY DONE (2026-10-08):** all endpoints answer 401 (auth required) through the proxy, so they are reachable (see Q9). Still open: whether the OAuth browser flow of `claude mcp add --transport http …` completes from the cloud container. I did not run it, because it changes the user's MCP config.
8. **Voice vendors** — **MOSTLY DONE (2026-10-08):** see Q5. ElevenLabs skills default to `eleven_v4`, `music_v2_5` and `eleven_text_to_sound_v2`. There is no official Fish Audio or OpenAI audio MCP; Azure's Speech MCP is Foundry-agent-only (preview); Replicate has an official hosted MCP (SSE); MiniMax's MCP does not expose music. Still open: pt-BR voice quality and pricing per vendor (hand off to the voice researcher), and whether Replicate's SSE transport works through the proxy (`curl -N https://mcp.replicate.com/sse`).
9. **Not searched at all:**
   - Editly (`"editly" mcp OR skill`);
   - Cavalry (`cavalry mcp`, `scenegroup cavalry ai`);
   - Jitter (`jitter.video mcp OR api`);
   - Pika MCP;
   - Seedance official BytePlus MCP;
   - Hunyuan3D official Tencent MCP;
   - Sketchfab and Poly Haven standalone MCPs.
10. **Motion Canvas / Revideo activity:** check the last commits on github.com/motion-canvas/motion-canvas and github.com/redotvideo/revideo, plus npm publish dates.
11. **Motion AI Kit:** open https://motion.dev/docs/ai-kit-install directly to confirm the MCP URL, install command and which parts are free (only a search summary so far).
12. **LottieFiles and Rive:** open https://docs.lottiefiles.com/en/platform/mcp and https://rive.app/docs/editor/mcp/integration to confirm details (search summaries only so far).
13. ~~**Remotion skill depth**~~ — **DONE (2026-10-08):** see Q1 "Depth of the official skills". It covers easing/spring, perceptual scale, `@remotion/effects`, `<HtmlInCanvasMotionBlur>`, TransitionSeries overlays, 3D via `@remotion/three` and a small remotion.media SFX list. Still open: whether `<HtmlInCanvas>`/`<HtmlInCanvasMotionBlur>` and `@remotion/effects` render in this container's Chromium headless shell (build 1194) without a GPU, `remotion.media` IS reachable through the proxy (whoosh.wav → HTTP 200, 2026-10-08).
14. **Plainly Videos pricing,** and whether it supports 1080×1920 AE templates.
15. **Security vetting:** check Agent Skills Hub grades for each shortlisted repo at agentskillshub.top. howseen-ai/claude-motion-design is graded CAUTION.
