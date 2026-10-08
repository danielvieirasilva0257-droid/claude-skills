# Motion design craft for premium app promos (After Effects techniques → Remotion 4.x code)

Scope: techniques top motion designers use that a "simple" Remotion promo lacks, with concrete numbers (frames @30 fps, easing curves, spring params, stagger offsets, blur amounts) and the matching Remotion APIs. Production target: vertical 1080×1920 @30 fps promo for the "Rotina" app (dark UI, red #CC0000, Barlow Condensed).

Verification baseline used in these notes:
- The user's project (`/home/user/claude-skills/rotina-video`) is pinned to **Remotion 4.0.250** (`remotion`, `@remotion/cli`, `@remotion/motion-blur`, `@remotion/transitions` — all 4.0.250; also installed: `@remotion/paths`, `@remotion/shapes`). API names below were checked against the installed type definitions and source.
- Latest on npm at research time (2026-10-08) is **4.0.534** for `remotion` and all `@remotion/*` packages; newer APIs were checked by downloading 4.0.534 tarballs and reading their `.d.ts`/`package.json` exports. Anything that needs an upgrade is flagged "needs ≥4.0.x".
- Unit conversion used throughout: **1 frame @30 fps = 33.3 ms**; ms → frames = ms × 0.03.

---

## 1. Easing mastery: AE graph editor, curves, cubic-bezier equivalents, springs, design-system motion specs

### Takeaway
"Premium" easing = asymmetric, strongly decelerating curves for entrances (expo/quint-out, M3 "emphasized decelerate"), sharp accelerate curves for exits, and critically/near-critically damped springs (damping ratio ζ≈0.7–0.9) for UI objects — not AE's default 33% Easy Ease or Remotion's default bouncy spring (ζ=0.5, 16% overshoot). Durations in UI systems are 50–1000 ms (1.5–30 frames); hero camera moves in video can run longer, but every move must be eased.

### Cited Findings

**After Effects graph editor / Easy Ease**
- AE's Easy Ease (F9) = speed 0 and **33.33% influence** on both sides; in the Value Graph it is an S-curve, in the Speed Graph a hump rising from 0 and back to 0. Influence = how far the handle reaches toward the neighbouring keyframe (33.33% ≈ one third of the gap). Speed-graph edits change the rate without changing keyed values; the speed graph avoids having to split dimensions (value graph needs Separate Dimensions for position) — [Noble Desktop: Speed graph](https://blog.nobledesktop.com/learn/after-effects/speed-graph); [AEJuice: speed graph](https://aejuice.com/blog/how-to-use-the-speed-graph-in-after-effects); [Adobe Community: math behind speed graphs](https://community.adobe.com/t5/after-effects-discussions/what-s-the-math-behind-speed-graphs/m-p/9597181) (forum/tutorial sources, via search summary)
- A 2015 Adobe-community poster found AE's `ease()` expression matches a cubic-bezier near **(0.33, 0, 0.66, 1)**, but 33%-influence keyframes did *not* exactly match that curve; value-graph eases on simple 1D moves are reproducible as ordinary cubic-beziers — [Adobe Community: ease vs eased keyframes](https://community.adobe.com/t5/after-effects-discussions/ease-vs-eased-keyframes/td-p/7493370) (forum; unverified)
- Exact values are typed in the **Keyframe Velocity** dialog (Alt/Option + double-click a keyframe). One Creative Cow user raises influence to ~**60%** "for a snappier result"; a French AE course notes **100%** influence exaggerates acceleration/deceleration vs the 33% default; a 2005 Creative Cow reply calls 33% just a sensible starting point — [Creative Cow: easy ease softness](https://creativecow.net/forums/thread/easy-ease-adjusting-softness/); [Elephorm AE 2026 course](https://www.elephorm.com/formation/apprendre-after-effects-2026-les-fondamentaux/personnalisation-du-lissage-des-images-cles-dans-after-effects); [Mt. Mograph: How to use the Graph Editor](https://mtmograph.com/blogs/tools/how-to-use-the-graph-editor-in-after-effects)
- Naming trap: in AE a keyframe's *incoming* side is "ease in" and outgoing is "ease out"; the deceleration at the end of a move lives on the **last keyframe's incoming handle**; heavy easing on one key "borrows time" from the rest of the move (the middle gets faster) — [Mt. Mograph graph editor guide](https://mtmograph.com/blogs/tools/how-to-use-the-graph-editor-in-after-effects); [ProVideo Coalition: Ease and Wizz](https://www.provideocoalition.com/ease_and_wizz/) (via search summary)
- No source names 80–90% influence as a standard; it sits at the "strong/exaggerated" end, beyond the 60% "snappier" example — (search synthesis across the sources above; treat as practitioner range, not a spec)
- Mt. Mograph **Motion v4** easing tools: two preset families — blue **Speed presets** (speed-graph shaped) and yellow **Cubic Bezier presets** named by their (x1, y1, x2, y2) values; influence sliders capped 0–100, speed sliders uncapped (Max cycles 500/1000/2000/5000); cubic-bezier presets need exactly two selected keyframes — [Mt. Mograph Motion: Easing tools](https://mtmograph.com/products/motion/tools/easing)

**Canonical cubic-bezier equivalents (easings.net source file)**
- Sine: in (0.12,0,0.39,0) · out (0.61,1,0.88,1) · inOut (0.37,0,0.63,1)
- Quad: in (0.11,0,0.5,0) · out (0.5,1,0.89,1) · inOut (0.45,0,0.55,1)
- Cubic: in (0.32,0,0.67,0) · out (0.33,1,0.68,1) · inOut (0.65,0,0.35,1)
- Quart: in (0.5,0,0.75,0) · out (0.25,1,0.5,1) · inOut (0.76,0,0.24,1)
- Quint: in (0.64,0,0.78,0) · out (0.22,1,0.36,1) · inOut (0.83,0,0.17,1)
- Expo: in (0.7,0,0.84,0) · out **(0.16,1,0.3,1)** · inOut (0.87,0,0.13,1)
- Circ: in (0.55,0,1,0.45) · out (0,0.55,0.45,1) · inOut (0.85,0,0.15,1)
- Back: in (0.36,0,0.66,-0.56) · out **(0.34,1.56,0.64,1)** · inOut (0.68,-0.6,0.32,1.6)
- Elastic and Bounce have no cubic-bezier equivalent (need `Easing.elastic()`/`Easing.bounce` or springs) — [easings.net source (easings.yml)](https://raw.githubusercontent.com/ai/easings.net/master/src/easings.yml); [easings.net](https://easings.net/)
- Note: the user's current curves are exactly easings.net **easeOutExpo (0.16,1,0.3,1)** and **easeInOutCubic (0.65,0,0.35,1)** — same source.

**Material Design 3 (Google's own Compose token source)**
- Easing: Emphasized **(0.2, 0, 0, 1)**; Emphasized Decelerate **(0.05, 0.7, 0.1, 1)**; Emphasized Accelerate **(0.3, 0, 0.8, 0.15)**; Standard (0.2, 0, 0, 1); Standard Decelerate (0, 0, 0, 1); Standard Accelerate (0.3, 0, 1, 1); Legacy (M2) (0.4, 0, 0.2, 1), legacy decelerate (0, 0, 0.2, 1), legacy accelerate (0.4, 0, 1, 1) — [androidx MotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MotionTokens.kt)
- Durations (ms): Short1–4 = 50/100/150/200; Medium1–4 = 250/300/350/400; Long1–4 = 450/500/550/600; ExtraLong1–4 = 700/800/900/1000 → @30 fps: 1.5/3/4.5/6, 7.5/9/10.5/12, 13.5/15/16.5/18, 21/24/27/30 frames — [androidx MotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MotionTokens.kt)
- Caveat: on Android the "emphasized" curve is natively a multi-segment path; the single cubic-bezier (0.2,0,0,1) is the web approximation (third-party token docs, via search) — [Fluid/Liri MotionEasingTokens](https://docs.liri.io/sdk/fluid/develop/structFluid_1_1MotionEasingTokens.html) (unverified detail)
- **M3 Expressive spring tokens (2025 physics system)** — spatial (position/size) vs effects (opacity/colour): Expressive Fast spatial ζ=0.6, k=800; Default spatial ζ=0.8, k=380; Slow spatial ζ=0.8, k=200; Effects ζ=1.0 with k=3800/1600/800 (fast/default/slow) — [androidx ExpressiveMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)
- **M3 Standard scheme springs**: spatial ζ=0.9 with k=1400/700/300 (fast/default/slow); effects ζ=1.0 with k=3800/1600/800 — [androidx StandardMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt)
- Third-party Flutter ports disagree slightly (one lists expressive default spatial damping 0.73 vs 0.8) — [pub.dev motor](https://pub.dev/packages/motor); [pub.dev material_expressive](https://pub.dev/documentation/material_expressive/0.8.0/) — prefer the androidx source above.

**Microsoft Fluent 2 (official token source)**
- Curves: AccelerateMax (0.9,0.1,1,0.2); AccelerateMid (1,0,1,1); AccelerateMin (0.8,0,0.78,1); **DecelerateMax (0.1,0.9,0.2,1)**; DecelerateMid (0,0,0,1); DecelerateMin (0.33,0,0.1,1); EasyEaseMax (0.8,0,0.2,1); **EasyEase (0.33,0,0.67,1)**; Linear — [fluentui tokens curves.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/curves.ts)
- Durations: UltraFast 50 ms, Faster 100, Fast 150, Normal 200, Gentle 250, Slow 300, Slower 400, UltraSlow 500 (→ 1.5/3/4.5/6/7.5/9/12/15 frames) — [fluentui tokens durations.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/durations.ts)
- Windows motion guidance: "Fast Out, Slow In" cubic-bezier(0,0,0,1) for things entering ("arrives fast, brakes hard"), "Slow Out, Fast In" (1,0,1,1) for things leaving; control animations at 167 ms (fast) and 83 ms (faster) — [Microsoft Learn: Timing and easing](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing) (via search summary)

**IBM Carbon (productive vs expressive)**
- Productive: standard (0.2,0,0.38,0.9), entrance (0,0,0.38,0.9), exit (0.2,0,1,0.9). Expressive: standard (0.4,0.14,0.3,1), entrance (0,0,0.3,1), exit (0.4,0.14,1,1). Durations: fast-01 70 ms, fast-02 110, moderate-01 150, moderate-02 240, slow-01 400, slow-02 700. Expressive motion is reserved "for significant moments"; **duration should scale with distance travelled/size change**, on a non-linear scale — [Carbon: Motion overview](https://carbondesignsystem.com/elements/motion/overview/)

**Apple**
- WWDC23 "Animate with springs": Apple's newer spring API takes just **duration + bounce** (bounce −1…1); start from presets **.smooth** (no bounce), **.snappy** (small bounce), **.bouncy** (more bounce); completion uses a *perceptual* duration, not settle time — [WWDC23 session 10158](https://developer.apple.com/videos/play/wwdc2023/10158/); [WWDC Notes 10158](https://wwdcnotes.com/notes/wwdc23/10158)
- SwiftUI's built-in `.default` animation (iOS 17+) is a spring with response 0.55, damping fraction 1.0 (no bounce) — [Apple docs: Animation.default](https://developer.apple.com/documentation/swiftui/animation/default.md) (via search summary)
- UNVERIFIED preset numbers (third-party table): smooth 0.5 s / bounce 0; snappy 0.3 s / 0.15; bouncy 0.5 s / 0.3 — [openskillindex iOS animation skill](https://openskillindex.com/skills/openclaw-skills-ios-animation-implementation); could not be matched to Apple pages.
- Apple HIG Motion page body did not render via fetch — no verified HIG quotes (see Gaps).

**Framer Motion / Motion (web)**
- Source code (motion-dom 14.0.0): `springDefaults` = stiffness **100**, damping **10**, mass **1**, duration 800 ms, bounce 0.3, visualDuration 0.3 s, restSpeed 2 (granular 0.01), restDelta 0.5 (granular 0.005) — [npm motion-dom](https://www.npmjs.com/package/motion-dom) (read from package `dist/es/animation/generators/spring.mjs`)
- Default transitions by value type (same package, `default-transitions.mjs`): transform props (x, y, rotate…) → spring **stiffness 500, damping 25** (under-damped); `scale*` → critically damped spring stiffness 550 (damping 2·√550 ≈ 46.9 when animating to 0, else 30); opacity/colour → tween **0.3 s, ease [0.25, 0.1, 0.35, 1]**; >2 keyframes → 0.8 s — [npm motion-dom](https://www.npmjs.com/package/motion-dom)
- Conflict: the motion.dev docs page, as extracted, listed stiffness "1" and bounce "0.25" as defaults; the shipped source says 100 and 0.3 — [motion.dev transitions docs](https://motion.dev/docs/react-transitions) vs source above (trust the source).

**Spring physics intuition**
- Mass = heft/inertia (heavier → slower, more inertia); tension/stiffness = how tightly wound (higher → snappier, bouncier); friction/damping = environment resistance (more → less bounce; high friction gives "buttery-smooth molasses motion"); "springs are most impactful when it comes to motion; I wouldn't use them for color or opacity changes" — [Josh W. Comeau: A Friendly Introduction to Spring Physics](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)

**Remotion easing/spring primitives (verified)**
- `spring({frame, fps, config, from=0, to=1, durationInFrames, durationRestThreshold, delay, reverse})`; config defaults mass 1, damping 10, stiffness 100, overshootClamping false; `durationInFrames` stretches the curve to an exact length; order of operations: stretch → reverse → delay; docs say "increase damping" to remove bounce; advanced playground at remotion.dev/timing-editor — [Remotion docs: spring()](https://www.remotion.dev/docs/spring); verified in installed 4.0.250 `spring/index.d.ts`, `spring-utils.js`
- Remotion's spring integrates in **seconds** (`t = deltaTime / 1000`), with ζ = c / (2√(k·m)) in source — so stiffness/damping/mass values from Compose/Framer/M3 transfer directly (installed `remotion/dist/cjs/spring/spring-utils.js`, 4.0.250)
- `measureSpring({fps, config, threshold})` returns settle length in frames — installed `measure-spring.d.ts`; `springTiming({config:{damping:200}}).getDurationInFrames({fps:30})` = **23 frames** per docs — [Remotion docs: TransitionSeries](https://www.remotion.dev/docs/transitions/transitionseries)
- `Easing` members (4.0.250): `linear, ease, quad, cubic, poly(n), sin, circle, exp, elastic(bounciness), back(s), bounce, bezier(x1,y1,x2,y2), in(), out(), inOut(), step0, step1` — installed `remotion/dist/cjs/easing.d.ts`
- `interpolate()` options: `extrapolateLeft/Right: 'extend' (default) | 'clamp' | 'wrap' | 'identity'`; `easing` — and newer: **per-segment easing array** (needs ≥4.0.462), `Easing.step1` for strings/booleans (≥4.0.509/4.0.530), **`output: 'perceptual-scale'`** (≥4.0.490: interpolates the *visual area* so scale/zoom looks linear), **`posterize: n`** (≥4.0.470: update every n frames, i.e. animate "on twos/threes"), `outputType` for CSS transform strings (≥4.0.526; transform strings in outputRange ≥4.0.472) — [Remotion docs: interpolate()](https://www.remotion.dev/docs/interpolate); verified in 4.0.534 `interpolate.d.ts`

**Computed spring behaviour in Remotion @30 fps (run locally with the project's remotion 4.0.250 `spring()`/`measureSpring()`; overshoot = peak above target)**

| config (mass 1 unless noted) | ζ | settle (measureSpring) | reaches 90% | peak |
|---|---|---|---|---|
| Remotion default k100 c10 | 0.50 | 28 f | 7 f | **116.3%** (very bouncy) |
| `{damping: 200}` | ≫1 | 23 f | 12 f | 100% (no bounce, slow tail) |
| k200 c20 | 0.71 | 15 f | 6 f | 104.2% |
| k170 c26 (react-spring default values) | 1.0 | 17 f | 9 f | 100% |
| M3 Expressive default spatial (k380, c≈31.2) | 0.8 | 12 f | 5 f | 101.5% |
| M3 Expressive fast spatial (k800, c≈33.9) | 0.6 | 10 f | 3 f | 109.4% |
| M3 Expressive slow spatial (k200, c≈22.6) | 0.8 | 16 f | 7 f | 101.5% |
| M3 Standard default spatial (k700, c≈47.6) | 0.9 | 7 f | 4 f | 100.2% |
| M3 effects default (k1600, c80) | 1.0 | 6 f | 3 f | 100% |
| Motion default transform spring (k500, c25) | 0.56 | 13 f | 4 f | 112.0% |
| k100 c12 mass 0.6 | 0.77 | 17 f | 7 f | 102.1% |

(Conversion used: Remotion damping c = ζ · 2 · √(k · m).)

### Inferences
- The default Remotion spring (16% overshoot, 28-frame wobble) reads "toy-like"; premium UI motion sits at ζ≈0.75–0.9 (1–4% overshoot). Suggested Rotina "house" springs: **UI enter** `{stiffness: 380, damping: 31, mass: 1}` (M3 expressive default, ~12 f); **snappy pop/badge** `{stiffness: 800, damping: 34}` (~9% overshoot, 10 f); **heavy phone/camera** `{stiffness: 200, damping: 23}` or `{mass: 1.5, stiffness: 120, damping: 26}` (slow, ~2% overshoot; verify with measureSpring); **opacity/colour** — no spring, use tween (0.25,0.1,0.35,1) or M3 effects k1600/c80.
- House cubic-beziers: entrance = expo-out (0.16,1,0.3,1) or M3 emphasized-decelerate (0.05,0.7,0.1,1); exit = M3 emphasized-accelerate (0.3,0,0.8,0.15) — exits ~60–70% the duration of entrances; camera repositioning between two holds = quint/expo in-out (0.83,0,0.17,1)/(0.87,0,0.13,1) — stronger than the current (0.65,0,0.35,1), which gives a "flatter" middle; "anticipation/overshoot" = back-out (0.34,1.56,0.64,1) only on small elements.
- Asymmetric curves are the main AE "secret": a long, gentle landing (high incoming influence, ~70–90%) with a quick departure (low outgoing influence, ~15–30%) — e.g. cubic-bezier(0.2, 0, 0, 1) is exactly "0% out / 100% in" shaped. Symmetric in-outs are for camera moves between holds and loops.
- UI-system durations (≤1000 ms) are tuned for users waiting on input; in a promo, element entrances can follow them (6–18 f), but camera moves/hero reveals typically run 20–45 f with expo/quint curves (inference, no single source).
- Use `interpolate(..., {output: 'perceptual-scale'})` (needs ≥4.0.490) for every zoom/dive so a 1→8× push doesn't feel like it "accelerates at the end"; on 4.0.250 emulate with `scale = Math.exp(interpolate(t, [0,1], [Math.log(s0), Math.log(s1)]))` (log-space zoom; note the Remotion option uses area-linear, not log — both remove the "end rush").

### Gaps
- Apple HIG motion page and exact SwiftUI preset numbers (snappy/bouncy durations) not verified from Apple.
- Flow (aescripts) preset library contents not retrieved.
- No authoritative source gives "80–90% influence" as a named standard — it is practitioner lore.

---

## 2. The 12 principles of animation applied to UI / motion graphics (incl. Willenskomer's "UX in Motion")

### Takeaway
Willenskomer's 12 UX-in-Motion principles (Easing, Offset & Delay, Parenting, Transformation, Value Change, Masking, Overlay, Cloning, Obscuration, Parallax, Dimensionality, Dolly & Zoom) are the UI translation of Disney's 12; the ones a "too simple" promo usually lacks are offset & delay (stagger), parenting (linked secondary motion), transformation/cloning (continuity between states), value change (animated numbers) and dimensionality/dolly-zoom (depth).

### Cited Findings
- The 12 UX in Motion principles and categories — Timing: easing, offset & delay; Object relationship: parenting; Object continuity: transformation, value change, masking, overlay, cloning; Temporal hierarchy: parallax; Spatial continuity: obscuration, dimensionality, dolly & zoom — [UX Magazine: The UX in Motion Manifesto](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto)
- **Easing**: "when to use easing? Always." (Disney: slow in/slow out) — same frames/duration with linear vs eased curves looks "bad" vs "good" — [UX Magazine manifesto](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto)
- **Offset & Delay**: staggering tells viewers which elements are related vs separate *before* they consciously read them; example: a FAB splitting into three header buttons offset in time; counter-example: icons moving in grouped rows contradict their separateness; card example — photo & title enter first, button held back so it registers last. Mapped to Disney's "Follow-through & Overlapping Action" — [UX Magazine manifesto](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto); [Uxcel lesson](https://app.uxcel.com/lessons/principles-of-ux-in-motion-959)
- **Parenting**: child properties linked to a parent (direct, delayed, inverse parenting), e.g. a face's y-axis parented to an indicator's x-axis — [UX Magazine manifesto](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto)
- **Transformation**: one object changes form across states (submit button → radial progress → checkmark), chunking moments into one continuous sequence — same source
- **Value Change**: numbers/text animate as they change, signalling live data — same source
- **Masking**: reveal/conceal parts of an object (header image becoming album cover) — same source
- **Overlay / Cloning**: layered objects slide to reveal what's behind; new objects should originate from a "hero" object while attention is on it — plain opacity fades "don't establish a clear origin" — same source
- **Obscuration**: blur + transparency to show a non-primary context behind; example "blurred glass" **blur 25 px, opacity 70%** — same source
- **Parallax**: faster = closer, slower = farther; push non-interactive/background elements back — same source
- **Dimensionality**: Origami (folding/hinged), Floating (3D cards flipping), Object (layers forming true 3D) — same source
- **Dolly & Zoom**: dolly = moving toward/away; zoom = scaling without spatial movement, implying more content inside — same source
- Timing that is too slow ("mushy") or too fast breaks expectations; the manifesto gives no ms values — same source
- In character/motion work generally, staggering when each part moves is what keeps things from looking stiff (shoulder leads, elbow follows, wrist trails); subtle secondary motion should be barely noticeable but its absence makes motion feel off — [UAL student blog (knight walk)](https://ecopeland.myblog.arts.ac.uk/2020/11/24/knight-stylized-walk-corrections/); [Source Filmmaker discussion](https://steamcommunity.com/app/1840/discussions/0/135508489633196572) (practitioner notes, low authority)

### Inferences
Concrete mapping of Disney's 12 → Rotina promo (synthesis; numbers are recommendations, not sourced specs):
1. **Squash & stretch** → tap ripple + checkbox: on tap, button `scale` 1 → 0.94 (3 f, ease-in) → 1.04 → 1 (spring k500/c25); checkmark stroke draws with `evolvePath` over 8 f; never squash text.
2. **Anticipation** → before every big move, a 4–6 f counter-move of 2–4% (phone dips 12–20 px / scales 0.98 before a 360° spin or dive-in; camera pulls back 3% before pushing in).
3. **Staging** → one idea per shot; dim/blur non-hero UI (obscuration: blur 8–25 px, opacity 0.3–0.7) and keep the red accent only on the hero element.
4. **Straight-ahead vs pose-to-pose** → pose-to-pose: define key poses (hold frames) per beat, tween with house curves.
5. **Follow-through & overlapping action** → stagger children 2–4 f behind parents; badges/cards keep moving 3–6 f after the phone stops (spring with 2–5% overshoot).
6. **Slow in/slow out** → expo/quint curves; no linear motion except constant drift/rotation loops.
7. **Arcs** → move the phone along curved paths (x eased with out-curve, y eased with in-out ⇒ natural arc) or animate along an SVG path with `getPointAtLength` from `@remotion/paths`.
8. **Secondary action** → shadows/reflections/glow that react to the primary move (shadow offset & blur scale with phone height; specular sweep across the screen on rotation).
9. **Timing** → contrast: fast snaps (6–10 f) against slow holds/drifts (30–60 f).
10. **Exaggeration** → for small UI elements only: back-out overshoot 5–10%; the phone itself ≤2–3%.
11. **Solid drawing** → consistent perspective/vanishing point: one shared `perspective` for all 3D layers; real phone thickness/edge highlights.
12. **Appeal** → restraint, consistent type, one accent colour (see section 9).

### Gaps
- Adobe's "Redesigning the 12 Principles of Animation for Motion Design" and School of Motion's 12-principles pieces appeared in search but were not opened; no direct quotes from them.

---

## 3. What makes motion feel "premium/fluid" vs "simple"

### Takeaway
Premium = restraint + continuity + layered timing: one idea per shot, nothing moving in unison (2–4 f stagger, parent/child lag), every frame alive (slow drift), real depth cues (parallax, DOF, shadows, light), duration scaled by distance, fast-slow rhythm locked to music, and transitions that are motivated by the motion (match moves) rather than decorative.

### Cited Findings
- Apple-style restraint: **"One shot = one idea"**, room to breathe, no flashy backgrounds/glow/stacked effects; black or white backgrounds with **one** coloured element; "a couple typefaces max"; cuts nearly invisible (one shot slides into the next, no flashy transitions); music locked to the cut and sparse SFX only on key hits, never loud — [YouMind (X post by @leomeethewoo, product-video studio, Sep 2026)](https://youmind.com/landing/x-viral-articles/apple-product-video-design-secrets) (single practitioner's view)
- Duration should scale with distance travelled / size change, on a non-linear scale; expressive motion reserved for significant moments — [Carbon: Motion](https://carbondesignsystem.com/elements/motion/overview/)
- Elements moving together at the same speed are perceived as one group; staggering communicates relationship and hierarchy — [UX Magazine manifesto](https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto)
- "Linear style" (Linear, Raycast…): dark backgrounds + gradient colour, blur, animated streaks and **micro-motion**, glowing colour over dark — [UX Design Bootcamp: The rise of Linear style design](https://bootcamp.uxdesign.cc/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- A Raycast-style motion case study animates UI with "high-frequency easing", attaches an audio cue to each shortcut, and grades teal/orange; 15 s social-first — [Contra: kinetic product motion for Raycast](https://contra.com/p/llNMeeMX-kinetic-product-motion-for-raycast-making-a-ui-feel-alive) (portfolio piece, not an official Raycast film)
- Apple hero reveals are a slow build with light changing as the product enters; camera opens on a close detail then pulls back — [Manfrotto: cinematic tech videos like Apple](https://www.manfrotto.com/global-en/stories/how-to-shoot-cinematic-tech-videos-like-apple/); [DIY Photography: Apple-like product commercials](https://www.diyphotography.net/?p=139467)

### Inferences (recommended "premium" checklist with numbers; synthesis)
- **Stagger/cascade**: list items/cards 2–4 f apart (3 f ≈ 100 ms is a good default); total cascade ≤ 12–15 f regardless of count (for n items, offset = min(3, 15/n)); order = reading order or distance from the tap point (radial stagger: delay = distance_px / 40 frames).
- **Overlap**: next element starts when the previous is ~60–70% done (never wait for full settle).
- **Never-static**: during holds, keep the phone alive — rotateY ±2–4°, rotateX ±1–2°, translateY ±6–12 px over 60–120 f, driven by `noise2D(seed, frame/90, 0)` (amplitude low, frequency ~1 cycle per 3–4 s); background gradient/light slowly orbiting (~1 rotation per 10–20 s).
- **Depth**: 3–5 parallax planes (background glow ×0.2, phone ×1, floating UI cards ×1.3–1.6, foreground particles/bokeh ×2); soft contact shadow under the phone (blur 40–80 px, opacity 0.35–0.5) whose blur grows with height; rim light / specular sweep on rotations.
- **Rhythm contrast**: fast-in (6–10 f) → hold (20–45 f) → fast-out (5–8 f); vary shot lengths (don't cut every 2 s); a "breath" (longer hold) every 3–4 beats.
- **Anticipation + settle** on every hero move (see §2).
- **Continuity**: carry an element across cuts (the red checkmark becomes the next scene's bullet; the phone screen becomes the full-frame background) — match moves instead of fades.
- **Restraint**: one accent colour (#CC0000) on the single focal element per shot; ≤2 simultaneous focal motions; remove effects that don't serve a beat (flash/grain/glow used only on hits).

### Gaps
- No primary Apple/Linear/Stripe statements about their motion specs exist publicly; premium-checklist numbers above are synthesized, not sourced.

---

## 4. Camera language for phone hero shots (push-in, orbit, dolly, rack focus, dive-into-screen, exploded view; 2.5D vs real 3D)

### Takeaway
Pros either fake 3D in AE with 2.5D layers + a 3D camera (layers spaced in Z, camera push with DOF) or render a real 3D phone (Element 3D/C4D/Blender); in Remotion the equivalents are CSS 3D (perspective + translateZ stacks) or `@remotion/three` (`<ThreeCanvas>`, needs `--gl=angle`). The signature moves are: hold → push-in, slow orbit with light sweep, close detail → pull-back reveal, "exploded view" of UI layers, and a perceptual-scale dive through the screen into the next scene.

### Cited Findings
- Hold briefly on the opening view before moving the camera so the viewer can read the screen; push the camera toward the device until it fills the frame; angle the camera slightly so the final shot isn't stiff — [Rotato: monitor-to-phone transition](https://rotato.app/blog/monitor-to-phone-transition)
- "Exploded view" in AE without plugins: one control layer with a slider; an expression scales each layer's Z depth by its index in the stack so layers spread as the slider moves — [3D exploded view (Gumroad, imabyk)](https://imabyk.gumroad.com/l/3d-exploded-view)
- Building a phone in AE's native 3D: stacked layers to fake thickness + reflections and shadows, screen kept as a swappable layer — [Lester Banks: Creating a 3D phone in After Effects](https://lesterbanks.com/2012/06/creating-a-3d-phone-in-after-effects/)
- Commercial templates sell exactly these moves: device-to-device morph transitions; "camera drift, floating devices, swappable UI"; 9 vertical 3D phone camera transitions at 1080×1920 — [johnnybd Responsive template](https://johnnybd.gumroad.com/l/responsive); [Videobolt smartphone promo](https://videobolt.net/author/motionpro/smartphone-app-promo-mockup); [Motion Array vertical 3D phone transitions](https://motionarray.com/stock-motion-graphics/vertical-3d-phone-camera-transitions-4389733/)
- Shape-layer wipes are used to hide the cut after a fly-in — [Noble Desktop: cellphone commercial wipe transitions](https://www.nobledesktop.com/learn/after-effects/cellphone-commercial-wipe-transitions-shape-layer-fun)
- Apple-like lighting: **three backlights outlining the phone's edges** while details stay hidden (mystery opening); fill brought in gradually for the closing shot; signature screen reflection from a light through diffusion scrim trimmed at **45°** with black card; slow motion-control pull-back; phone on a pan-tilt head; a slowly rotating fan behind for background movement — [DIY Photography](https://www.diyphotography.net/?p=139467) (practitioner recreation, not Apple's documented method)
- Format structure: hero reveal → close-up detail work → product in a broader scene — [Manfrotto](https://www.manfrotto.com/global-en/stories/how-to-shoot-cinematic-tech-videos-like-apple/)
- `@remotion/three`: `<ThreeCanvas>` lets you drive R3F scenes with `useCurrentFrame()` (don't use `useFrame()` loops); `<ThreeWebGPUCanvas>` exists; `<Sequence layout="none">` inside the canvas; `useVideoTexture()` / `useOffthreadVideoTexture()` map video onto meshes; rendering requires `Config.setChromiumOpenGlRenderer('angle')` (or `chromiumOptions: {gl: 'angle'}` for SSR/Lambda); official **`remotion-template-three`** ships a 3D phone with a swappable video screen (colour, size, thickness, corner radius adjustable) — [Remotion docs: @remotion/three](https://www.remotion.dev/docs/three)
- Without a GPU, WebGL renders use `--gl=swangle` (default on Lambda) — [Remotion docs: HtmlInCanvas](https://www.remotion.dev/docs/html-in-canvas)
- Zoom/scale should be interpolated perceptually: CSS scale changes linearly but visible area changes with scale², making zooms look non-linear; `output: 'perceptual-scale'` fixes it (≥4.0.490) — [Remotion docs: interpolate()](https://www.remotion.dev/docs/interpolate)

### Inferences (Remotion recipes; synthesis)
- **CSS-3D camera rig**: wrap the scene in a "camera" div with `perspective: 1800–2400px` (lower = more dramatic distortion; 1080-wide frames look natural ~2000px) and animate a child "world" div with `transform: translateZ(z) rotateX(rx) rotateY(ry)` — moving the world = moving the camera. Keep `transform-style: preserve-3d` on every intermediate node (it breaks if any ancestor has `overflow:hidden`, `filter`, or `opacity<1` — CSS spec behaviour; verify).
- **Push-in**: 30–45 f, expo-out; scale 1 → 1.15–1.3 (or translateZ +200–400 px); add 1–2° rotateX change for parallax.
- **Orbit**: rotateY −25° → +25° over 60–90 f, in-out sine/cubic, with a specular gradient overlay on the screen whose x-position is tied to rotateY (light sweep).
- **Dive into screen (match-cut zoom)**: anticipation pull-back 4–6 f (scale −3%) → zoom 1 → 6–12× over 12–18 f with (0.7,0,0.84,0) expo-in or perceptual-scale + CameraMotionBlur; at ~80% the next scene (the app UI full-frame) is already rendered underneath at matching scale, cross-fade 3–4 f; then decelerate the new scene from 1.15 → 1 over 15–20 f (expo-out).
- **Exploded view**: render each UI layer of the phone screen (bg, cards, header, FAB, toast) as separate absolutely-positioned divs inside the 3D phone; animate `translateZ(i * spread)` with spread 0 → 60–140 px and rotateY/rotateX ~ −30°/15° for a 3/4 view; stagger 2–3 f per layer; reverse to collapse.
- **Rack focus** (fake DOF): animate `filter: blur()` on depth planes inversely (foreground 0 → 8–12 px while background 12 → 0 px) over 12–20 f in-out; note blur is costly (see §10).
- **Device rotation reveal**: start edge-on (rotateY 85–90°, only the rim lit), rotate to 0° over 30–40 f with expo-out, screen brightness ramps from 0 → 1 during the last 40%.
- Prefer CSS 3D for UI-heavy phones (crisp text, cheap); use `@remotion/three` only for real geometry (thick bevels, refractions, environment reflections) and accept the `--gl=angle` (GPU) or `swangle` (slow CPU) requirement.

### Gaps
- Element 3D / Cinema 4D / Blender workflows were not researched in depth (another researcher covers programmatic 3D/no-GPU feasibility).
- No authoritative numeric source for camera move durations in app promos; numbers above are synthesized.

---

## 5. Transitions catalog (timing for each) and their Remotion implementations

### Takeaway
Most premium transitions are 6–20 frames, motivated by motion (whip pan, zoom-through, match cut, mask reveal), with blur peaking at the cut. Remotion 4.0.250 ships only `fade/slide/wipe/flip/clockWipe/none`; 4.0.534 adds `iris` plus WebGL/HTML-in-canvas presentations (`blurSlide`, `zoomBlur`, `crossZoom`, `dreamyZoom`, `linearBlur`, `filmBurn`, `dissolve`, `ripple`, `crosswarp`, `swap`, `bookFlip`, `zoomInOut`) and a CSS `pushCut` with built-in flash, and `TransitionSeries.Overlay` for light leaks.

### Cited Findings
- **Whip pan**: most common recipe ≈ **10 frames total, 5 before + 5 after the cut**, offset (Motion Tile) keyed with Easy Ease and directional/box blur keyed 0 → peak at the cut → 0 — [Photofocus: easy whip/swish pan in AE](https://photofocus.com/software/tutorials-software/easy-whip-swish-pan-in-after-effects/); Premiere variant uses a 15-frame window (5 before, 10 after) with Directional Blur 90°, Blur Length 250 — [Tutvid](https://tutvid.com/premiere-pro/whip-pan-blurring-transition-effect-premiere-pro/); PremiumBeat recommends ~10 frames overlap and warns blur darkens the transition (colour-correct it) — [PremiumBeat](https://www.premiumbeat.com/blog/create-whip-pan-using-built-effects-premiere-pro/); a Shotcut user settled on ~7 frames (frame-rate dependent) — [Shotcut forum](https://forum.shotcut.org/t/motion-blur-pan-transition-whip-pan-tutorial-part-one-now-completed/20760/6); blur peaking at the cut, layer extended 5 f either side — [MiraCamp](https://www.miracamp.com/learn/premiere-pro/whip-transition)
- Apple-style: transitions nearly invisible, one shot slides into the next — [YouMind/@leomeethewoo](https://youmind.com/landing/x-viral-articles/apple-product-video-design-secrets)
- **Remotion 4.0.250 (installed)** presentations: `fade({enterStyle, exitStyle, shouldFadeOutExitingScene})`, `slide({direction: 'from-left'|'from-top'|'from-right'|'from-bottom'})`, `wipe({direction: 8 directions incl. diagonals})`, `flip({direction, perspective})`, `clockWipe({width, height})`, `none()`; timings `linearTiming({durationInFrames, easing})`, `springTiming({config, durationInFrames, durationRestThreshold, reverse})` — installed `@remotion/transitions/dist/presentations/*.d.ts`; [npm @remotion/transitions](https://www.npmjs.com/package/@remotion/transitions)
- **Remotion 4.0.534 (latest)** subpath exports: `./fade ./slide ./wipe ./flip ./clock-wipe ./book-flip ./zoom-blur ./dreamy-zoom ./film-burn ./linear-blur ./zoom-in-out ./none ./iris ./dissolve ./ripple ./crosswarp ./cross-zoom ./swap ./push-cut ./blur-slide`. Props: `iris({width, height})`; `crossZoom({strength})`; `zoomBlur({rotation})`; `blurSlide({direction, blur})`; `filmBurn({seed})`; `ripple({amplitude, speed})`; `dissolve({lineWidth, spreadColor, hotColor, pow, intensity})`; `linearBlur({intensity})`; `dreamyZoom({rotation, scale})`; `swap({reflection, perspective, depth})`; `bookFlip({direction})`; **`pushCut({cutProgress, outgoingScale, incomingStartScale, incomingEndScale, transformOrigin, flashColor, flashOpacity, flashFrames, ...})`** — read from the 4.0.534 tarball `.d.ts` files ([npm @remotion/transitions](https://www.npmjs.com/package/@remotion/transitions))
- `blurSlide()` (≥4.0.523): both scenes slide with heavy motion blur "like a fast camera pan"; `blur` = max blur length as a fraction of frame size (default **0.5**); eases in/out so it starts/ends at rest; docs example uses `linearTiming({durationInFrames: 20})`; built on HTML-in-canvas — Chrome only (not Firefox/Safari) — [Remotion docs: blurSlide](https://www.remotion.dev/docs/transitions/presentations/blur-slide)
- HTML-in-canvas: experimental Chrome API ("Chrome may change the API or even remove it"); Studio preview needs Chrome ≥149 with `chrome://flags/#canvas-draw-element`; **rendering needs no flag** (Remotion ships a Chrome build with it) from **v4.0.455**; WebGL shaders need `--gl=angle` (or `swangle` without GPU); `zoomBlur()` is cited as an example — [Remotion docs: HtmlInCanvas](https://www.remotion.dev/docs/html-in-canvas)
- `<TransitionSeries.Overlay>` (≥4.0.415): sits centred on the cut (half before, half after), `durationInFrames` + `offset`, **does not shorten the timeline**; transitions do (total = Σsequences − Σtransitions; e.g. 40 + 60 − 30 = 70); a transition can't be longer than adjacent sequences; transition/overlay can't be adjacent; placing a transition first/last animates a lone scene's entrance/exit — [Remotion docs: TransitionSeries](https://www.remotion.dev/docs/transitions/transitionseries)
- **Light leaks**: `<LightLeak>` from `@remotion/light-leaks` (package first published as 4.0.415 on 2026-02-01, now marked deprecated, to stop publishing at 5.0) → successor `lightLeak({progress, seed, hueShift})` from `@remotion/effects/light-leak` (WebGL2; leak grows in first half, retracts in second; hueShift 0 = yellow-orange, 120 green, 240 blue; doc says available from v4.0.500), used inside a `<TransitionSeries.Overlay>` to hide a cut — [Remotion docs: light leaks](https://www.remotion.dev/docs/light-leaks); [LightLeak component](https://www.remotion.dev/docs/light-leaks/light-leak); [lightLeak effect](https://remotion.dev/docs/effects/light-leak); npm publish dates via `npm view @remotion/light-leaks time`
- Custom presentations are supported (a presentation + a timing = a transition) — [Remotion docs: Presentations](https://www.remotion.dev/docs/transitions/presentations)

### Inferences — catalog with suggested timings @30 fps (synthesis; verify by eye)
| Transition | Frames | Curve / blur | Remotion route |
|---|---|---|---|
| Hard cut on beat | 0 | — | plain `<Series>`; most premium edits are cuts + motion inside shots |
| Whip pan | 8–12 (half each side) | in-out expo; directional blur 0→60–120 px→0 peaking at cut | 4.0.250: custom presentation (translateX ±100% + `filter: blur`) or `CameraMotionBlur` around a slide; ≥4.0.523: `blurSlide({blur: 0.5})` |
| Zoom-through / dive | 12–18 | expo-in into cut, expo-out after; scale ×6–12 perceptual | custom; ≥4.0.534 `crossZoom`/`zoomBlur` (HTML-in-canvas) |
| Push cut + flash | 6–10 | outgoing scale 1→1.1, incoming 1.15→1, white flash 2–3 f | ≥4.0.534 `pushCut({flashColor:'#fff', flashFrames:2})`; on 4.0.250 hand-build |
| Match cut / shared element | 0–6 | element continues its motion across the cut | Series + same element positioned identically at cut frame |
| Mask/shape reveal (circle from tap point, rounded-rect wipe) | 10–18 | expo-out radius | `clip-path: circle(r at x y)` driven by interpolate; `iris()` (≥4.0.534) is centered only |
| Wipe/slide | 12–20 | expo in-out | `wipe()`, `slide()` + `linearTiming({easing: Easing.bezier(0.87,0,0.13,1)})` |
| Split-screen / tile slide | 15–24, 2–3 f stagger per tile | expo-out | N clipped copies of the next scene with staggered translate |
| Liquid/blob morph | 15–25 | in-out | `@remotion/paths` `interpolatePath()` on an SVG mask |
| Glitch | 3–6 | posterized (step) | RGB-split copies with `mix-blend-mode: screen`, `posterize: 2`; ≥ `@remotion/effects` chromatic-aberration/tv-signal-off |
| Light leak / flash | 15–30 overlay (does not shorten) | grows then fades | `<TransitionSeries.Overlay>` + `LightLeak`/`lightLeak()` (≥4.0.415/4.0.500) or a radial-gradient div with `mix-blend-mode: screen` |
| Clock wipe / iris | 15–24 | in-out | `clockWipe()`; `iris()` (latest) |
- Upgrade note: every `@remotion/*` package must be on the **same exact version** as `remotion` (the project pins all at 4.0.250).

### Gaps
- No docs-page timings for the new shader presentations beyond `blurSlide` (20 f example); none were render-tested here.
- Glitch/liquid/grid transition frame counts are synthesized; no authoritative timing source found.

---

## 6. Motion blur best practices (shutter angle, samples, directional vs camera blur, when not to use)

### Takeaway
Use a 180° shutter (AE default; blur = half a frame of travel) for natural blur; raise samples only where fast moves show "ghost copies"; in Remotion, `CameraMotionBlur` literally renders the scene `samples` times (cost × samples, colours slightly degraded), so wrap only the moving layer and only during fast moves; use cheaper directional `filter: blur` for whip pans.

### Cited Findings
- AE comp motion-blur defaults: **shutter angle 180°**, **shutter phase −90°** (centres blur on the frame time; older versions used 0° so blur trailed), **samples per frame 16** (3D layers, shape layers, some effects), **adaptive sample limit 128** (2D layers); max shutter angle **720°** (blur spanning two frames); raise samples when fast 3D/shape motion shows separate copies; both comp and layer motion-blur switches must be on — [ProVideo Coalition: Motion blur](https://www.provideocoalition.com/motion_blur/); [ProVideo Coalition: CMG Hidden Gems ch. 8](https://www.provideocoalition.com/cmg_hidden_gems_chapter_8_motion_blur_and_more/); [Adobe: Composition basics](https://helpx.adobe.com/nl/after-effects/desktop/work-with-compositions/composition-settings/composition-basics.html) (via search summary; 128 default-vs-max not confirmed)
- Remotion `<CameraMotionBlur shutterAngle={180} samples={10}>` (since v3.2.39): shutterAngle default **180** (0° = no light, 360° = all), samples default **10**, docs recommend **5–10**; blur depends on fps; "destructive to colors" — keep samples low; children must be absolutely positioned (`<AbsoluteFill>`); client-side renderer can't do the `mix-blend-mode` it uses — [Remotion docs: CameraMotionBlur](https://www.remotion.dev/docs/motion-blur/camera-motion-blur)
- Implementation (installed 4.0.250 source): renders `samples` copies of the children, each wrapped in `<Freeze frame={currentFrame − shutterFraction·(i/samples) + 1}>`, composited with `mixBlendMode: 'plus-lighter'` and `opacity(1/samples)`; near frame 0 it reduces samples to avoid negative frames ⇒ render cost scales ~linearly with `samples` — `node_modules/@remotion/motion-blur/dist/cjs/CameraMotionBlur.js` ([npm @remotion/motion-blur](https://www.npmjs.com/package/@remotion/motion-blur))
- `<Trail layers lagInFrames trailOpacity>` = echo/trail effect (all three props required) — installed `Trail.d.ts`
- New in latest: `HtmlInCanvasMotionBlur({width, height, shutterAngle, samples, disabled})` — "experimental motion blur that averages separately captured HTML-in-canvas snapshots at fractional frames"; preview needs Chrome with the HTML-in-canvas flag; nested HtmlInCanvas needs Chrome 157+ — 4.0.534 `HtmlInCanvasMotionBlur.d.ts`
- `blurSlide` blur default = 0.5 of frame size at the midpoint — [Remotion docs: blurSlide](https://www.remotion.dev/docs/transitions/presentations/blur-slide)
- PremiumBeat: directional blur darkens the transition; colour-correct — [PremiumBeat](https://www.premiumbeat.com/blog/create-whip-pan-using-built-effects-premiere-pro/)

### Inferences
- Wrap **only** the moving subtree (phone/camera group), not text overlays/captions — blur on captions hurts legibility and multiplies render time.
- Typical settings: hero spins/dives `shutterAngle 180, samples 8–10`; subtle moves `samples 5`; drafts `samples 1` (toggle via an input prop). Avoid >360° except for stylised whips.
- Don't blur during holds (no visual difference, full cost) — conditionally render `<CameraMotionBlur>` only for frame ranges with fast motion, or set `samples={isFast ? 8 : 1}`.
- Nesting `CameraMotionBlur` multiplies (samples × samples) — avoid; the docs' "common mistake with Trail and CameraMotionBlur" page warns about combining them (not opened).
- For whip pans, a directional blur proxy (`filter: blur(Npx)` + horizontal `scaleX(1.05–1.15)` stretch) is far cheaper than temporal supersampling; CSS has no native directional blur (SVG `feGaussianBlur stdDeviation="40 0"` gives one axis — verify perf).

### Gaps
- Remotion's "common mistake with Trail and CameraMotionBlur" page not read.
- Quantitative render-time cost per sample in Remotion not measured.

---

## 7. Kinetic typography, captions, readability, Reels safe zones, font sizes

### Takeaway
Keep captions at ~2–3 words/s (≤20 characters/s), 1–3-word chunks for punchy kinetic text, ≥1.5 s per text block (unless word-by-word karaoke synced to VO), and keep all text inside the central ~950×980 px of 1080×1920 (top 14% ≈ 269 px, bottom 35% ≈ 672 px, sides 6% ≈ 65 px for Reels ads; right-side UI rail even wider).

### Cited Findings
- Netflix English (USA) timed-text: reading speed **up to 20 characters/second** (adult), **17 cps** (children); **42 characters per line** — [Netflix Partner Help: English (USA) Timed Text Style Guide](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide)
- Caption-speed research: a 1998 study of 578 viewers put comfortable caption speed ≈ **145 WPM**, difficulty for most around **170 WPM**; Tyler et al. found deaf students' comprehension worse at 180 WPM than 90/120 WPM — [Macquarie: Effect of caption rate on comprehension](https://researchers.mq.edu.au/en/publications/effect-of-caption-rate-on-the-comprehension-of-educational-televi/); 1998 study surfaced via search (likely Jensema 1998; exact page not opened — UNVERIFIED)
- Practitioner guidance: 2–3 words/s typical reading speed for ad captions; display time = word count ÷ words per second — [Movidmo: 5 tips for captions in video ads](https://movidmo.com/blog/15/5-tips-for-using-captions-in-video-ads); blocks <~1.5 s are too short to read; 3–7 s per block for full-sentence captions — [BlitzCut: best caption style for Shorts](https://blitzcutai.com/blog/best-caption-style-youtube-shorts-2026); hold on-screen text long enough for a 200-WPM reader to read it twice — [SSW Rules](https://www.ssw.com.au/rules/post-production-do-you-give-enough-time-to-read-texts-in-your-videos); average adult 238 WPM but low-vision/dyslexic readers can drop to ~50 WPM — [WSDOT video text duration](https://engage.wsdot.wa.gov/video-text-duration)
- Accessibility floors: **min 48 px text**, **4.5:1 contrast** (WCAG 2.0-based) — [AMI Graphics guidelines (PDF)](https://cp.ami.ca/sites/default/files/forms/AMI%20Graphics.pdf); avoid all-caps paragraphs; content should be graspable in 3–5 s — [OU Digital Screen Accessibility Guidelines](https://www.ou.edu/content/dam/studentaffairs/strategic-initiatives/documents/Digital_Screen_Accessibility_Guidelines_Revised.docx.pdf)
- Short-form style: word-by-word / 2–3-word chunks dominate viral content (vendor claim citing an OpusClip analysis of 13.5 M TikTok clips — not a controlled study) — [BlitzCut: word-by-word vs full-sentence](https://blitzcutai.com/blog/word-by-word-captions-vs-full-sentence-captions); animation style should follow speaking pace (fast speech → short chunks/quick entrances; slow → longer holds) — [OpenClip caption animation guide](https://openclip.app/guides/caption-animation-guide)
- Hook text: keep on-screen text in the hook to **≤5 words** — [Tiger Pistol: vertical video ad best practices](https://tigerpistol.com/vertical-video-ad-best-practices/)
- **Safe zones (Reels ads, attributed to Meta)**: leave **14% top (~269 px), 35% bottom (~672 px), 6% each side (~65 px)** of 1080×1920 → central ≈ 950×979 px; bottom grows to 40% (~768 px) with a disclaimer — [Upload-Post safe-zone checker (Sep 2026)](https://www.upload-post.com/tools/safe-zone-checker/); [Inro Reels safe-zone checker](https://www.inro.social/tools/instagram-reels-safe-zone-checker); [Sirency](https://www.sirency.com/blog/instagram-reels-safe-zone) (third-party; Meta's own page not opened)
- Conflicts: right margin 15% (Poster.ly), ~130 px right rail (Keywords Everywhere), icons over ~rightmost fifth (Hopper); a 1010×1280 box with 220 px top / 420 px bottom (Ignite, July 2025) — [Poster.ly](https://poster.ly/tools/meta-ads-safe-zone-visualizer); [Keywords Everywhere](https://keywordseverywhere.com/tools/instagram-reels-safe-zone-checker/); [Hopper HQ](https://www.hopperhq.com/blog/instagram-reel-size/); [Ignite Social Media](https://www.ignitesocialmedia.com/?p=57511); [House of Marketers](https://houseofmarketers.com/guide-to-safe-zones-tiktok-facebook-instagram-stories-reels/)

### Inferences (kinetic-type recipes, synthesis)
- **Safe box for Rotina**: x 65–950 (use 80–920 to also clear a ~130 px right rail), y 270–1248; captions baseline ≈ y 1100–1200; headline block y 300–700. Build a toggleable `<SafeZoneGuide/>` overlay for Studio.
- **Caption timing**: hold = max(20 f, words / 2.5 × 30 f); for karaoke-style word highlight, each word active from its VO timestamp; chunk 1–3 words; ≤20 cps.
- **Font sizes @1080 wide** (Barlow Condensed is narrow — can go bigger): captions 64–84 px (bold/semibold, ALL CAPS ok for ≤3 words), hero headline 120–180 px, labels ≥48 px; 4.5:1 contrast — on the dark UI use white text, with 0 0 24px rgba(0,0,0,.6) shadow or a #CC0000 highlight box behind the active word.
- **Per-letter/word animators (AE "range selector" analogues)**: split into words/letters, stagger 1–2 f per letter / 2–4 f per word; each unit: opacity 0→1 (6 f), translateY 40%→0 (expo-out, 10–12 f), blur 8→0 px (current), optional tracking animation (`letter-spacing` 0.2em → 0.02em over 20 f, expo-out) for headlines; **mask reveal** = each line inside `overflow:hidden`, text translateY 105%→0 (expo-out 12–16 f) — the cleanest "premium" text entrance; **scale emphasis** = active word scale 1→1.12→1 (spring k500 c25) + colour → #CC0000; **highlight box** = a rect behind the word whose `scaleX` 0→1 from left (8–10 f expo-out) then text colour flips; **value change** = numbers count up with `Math.round(interpolate(...))` + tabular-nums.
- Use `fitText()`/`measureText()` from `@remotion/layout-utils` to auto-size headlines to the safe-box width and to compute highlight-box widths (package not installed in the project; add at the same version).

### Gaps
- Meta's own Reels safe-zone page and Instagram organic-Reels figures not opened (third-party consensus only).
- No authoritative font-size spec for vertical social video beyond the 48 px TV-graphics floor.

---

## 8. Rhythm & editing: cutting on the beat, hit points, pacing, hooks, retention

### Takeaway
Lock the edit to the music grid (frames per beat = 1800 / BPM at 30 fps; 120 BPM = 15 f/beat, 128 BPM ≈ 14.06 f), put hard visual hits (cuts, flashes, pops) on downbeats with SFX, get the core message on screen in the first 3 s, and keep each shot to one idea.

### Cited Findings
- TikTok's official ads guidance: get the core message on screen **within the first 3 seconds**; a hook within the first **6 seconds** (suspense, surprise, emotion); captions/text add context (the summary also said "~5–10 words per second" — implausible, likely mis-extraction; UNVERIFIED) — [TikTok Ads Help: Creative best practices](https://ads.tiktok.com/help/article/creative-best-practices?lang=ro-RO) (via search summary)
- "63% of top ads deliver the key message in 3 s" is circulated by Segwise but not traceable to a TikTok primary source — [Segwise](https://segwise.ai/blog/tiktok-ad-best-practices-improve-performance.md) (UNVERIFIED)
- Meta (via Social Media Today): the opening moments are the keep-or-scroll decision; younger viewers move through content ~3× faster; hook types include a "value-promise" hook — [Social Media Today: Meta tips on Reels hooks](https://socialmediatoday.com/news/meta-shares-tips-on-reels-hooks-creative-diversification-in-ads-and-threa/808182)
- Openers that hold attention begin with motion, a tight face, something unexpected, or a direct statement about the viewer; weave branding into the action rather than opening on a logo card/slow zoom — [Tiger Pistol](https://tigerpistol.com/vertical-video-ad-best-practices/); open with the after-result, a pain-point question, or action in motion; avoid slow film-style intros — [K6 Agency](https://www.k6agency.com/create-ad-creatives/)
- Design for sound-off first, then add captions; or sound-on with tight captions — [Rocketship HQ](https://www.rocketshiphq.com/?p=5227); [Logical Position](https://www.logicalposition.com/blog/supercharge-your-advertising-with-reels)
- Cut a 15–30 s Reels version first, then extend — [Adstellar](https://www.adstellar.ai/blog/vertical-video-ad-best-practices)
- Apple-style: music locked to the cut at the film's tempo; SFX sparse, only on key hits — [YouMind/@leomeethewoo](https://youmind.com/landing/x-viral-articles/apple-product-video-design-secrets); Raycast-style: an audio cue for every UI action — [Contra Raycast case](https://contra.com/p/llNMeeMX-kinetic-product-motion-for-raycast-making-a-ui-feel-alive)

### Inferences
- **BPM → frames @30 fps** (beat = 1800/BPM): 90 → 20 f; 100 → 18 f; 110 → 16.36 f; **120 → 15 f**; 124 → 14.52 f; 128 → 14.06 f; 140 → 12.86 f; 150 → 12 f. One 4/4 bar @120 = 60 f (2 s); 8 bars = 16 s. Pick 120 BPM (or 90/150) to get integer frames; otherwise compute `beatFrame(n) = Math.round(n * 1800 / bpm)` and never accumulate rounding.
- Place: cuts on downbeats (or 1–2 f *before* the beat — visual leads audio slightly; editor lore, unverified); pops/badges land **on** the beat (the spring should reach ~90% at the beat frame — e.g. M3 expressive default reaches 90% at 5 f, so start it 5 f before); camera moves start on the beat and settle by the next bar.
- 30–45 s structure: hook 0–3 s (result/pain + motion, ≤5 words) → problem/promise 3–8 s → 3 feature beats of 6–9 s each (habits / workouts / finance), each with one hero motion and one UI demo → proof/payoff → CTA last 3–4 s inside the safe zone. Shot length 1–3 s in the hook, 2–4 s in features.
- Sound design: whoosh on whips/dives (start 4–6 f before the cut), click/tap on ripples, subtle riser into the hero reveal, impact on flashes.

### Gaps
- Primary Meta (facebook.com/business) Reels creative guidance not opened; retention statistics (e.g. "% who watch past 3 s") not verified.
- Music/sound-design specifics are covered by another researcher.

---

## 9. Reference styles: Apple, Linear, Stripe, Arc, Raycast, Notion, premium templates

### Takeaway
What these share: dark or neutral stages with one accent colour, real light on the device (rim lights, reflections), slow controlled camera with fast UI micro-motion inside it, few typefaces, invisible transitions, music-locked edit, and lots of negative space. Public frame-by-frame breakdowns of Linear/Stripe/Arc/Notion launch films were not found.

### Cited Findings
- Apple: one idea per shot; dark/neutral backdrop + one loud colour; ≤2 typefaces; invisible edits; sound locked to picture, sparse SFX — [YouMind/@leomeethewoo](https://youmind.com/landing/x-viral-articles/apple-product-video-design-secrets); rim/backlights, gradual fill, 45° scrim reflection, slow motion-control pull-back — [DIY Photography](https://www.diyphotography.net/?p=139467); hero reveal → detail → context — [Manfrotto](https://www.manfrotto.com/global-en/stories/how-to-shoot-cinematic-tech-videos-like-apple/); Apple's "Scary Fast" event video shot on iPhone but with a large professional lighting rig — [Prolost](https://prolost.com/blog/scarybts); much Apple product imagery is CGI, so lighting tips are recreations (caveat noted by search synthesis)
- Linear style: dark bg, gradient colour, blur, animated streaks, micro-motion; Raycast among examples — [UX Design Bootcamp](https://bootcamp.uxdesign.cc/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- Raycast-style case study: high-frequency easing on UI, audio cue per shortcut, teal/orange grade, 15 s — [Contra](https://contra.com/p/llNMeeMX-kinetic-product-motion-for-raycast-making-a-ui-feel-alive)
- Stripe: a studio's post says Stripe Brand Studio (late 2024) commissioned R&D on brand motifs "the Wave and the Parallelogram", aiming for depth and dimensionality — [LinkedIn: Anton Nejnev](https://bg.linkedin.com/in/nejnev) (self-description)
- A guide to Apple-style launch videos emphasises restraint, crisp type and product-led reveals — [Motion (motion.so): Apple-style product launch video](https://motion.so/learn/apple-style-product-launch-video)

### Inferences
- For Rotina (dark UI + #CC0000): treat red as the *only* saturated colour, used for the single focal element/word per shot; background near-black with a slow, low-contrast red/burgundy radial glow (opacity 0.15–0.25) behind the phone as "key light"; a thin white rim highlight on the phone edge; restrained grain (opacity 0.04–0.08); white flashes only on 2–3 key hits.

### Gaps
- No official/behind-the-scenes breakdowns of Linear, Stripe, Arc, Notion or Raycast launch films were found; Envato/Motion Array "premium app promo" template conventions not analysed beyond listing names.

---

## 10. Remotion implementation details (APIs, versions, performance)

### Takeaway
Everything above is buildable in Remotion: easing via `Easing.bezier`/`spring`, layered timing via `<Sequence>`/stagger helpers, organic drift via `@remotion/noise`, morphs via `@remotion/paths`, auto-fit text via `@remotion/layout-utils`, transitions via `@remotion/transitions` (+ `Overlay`, light leaks), blur via `@remotion/motion-blur`, and real 3D via `@remotion/three`. Upgrading from 4.0.250 → 4.0.534 unlocks `perceptual-scale`, `posterize`, per-segment easing, `TransitionSeries.Overlay`, ~14 new transitions and `@remotion/effects` (60+ effects), at the cost of GPU/`--gl=angle` needs for WebGL ones.

### Cited Findings
- Core (4.0.250 installed): `interpolate`, `interpolateColors` (present), `spring`, `measureSpring`, `Easing` (members listed in §1), `extrapolate*: 'extend'|'identity'|'clamp'|'wrap'` — installed `remotion` 4.0.250 type defs; [Remotion docs: interpolate](https://www.remotion.dev/docs/interpolate)
- Newer core options (≥4.0.462–4.0.530): per-segment easing arrays, `posterize`, `output: 'perceptual-scale'`, `outputType`, CSS transform strings in `outputRange`, `Easing.step1` for strings/booleans — [Remotion docs: interpolate](https://www.remotion.dev/docs/interpolate)
- `@remotion/transitions`: see §5 (4.0.250 vs 4.0.534 lists; `TransitionSeries.Overlay` ≥4.0.415; `TransitionSeries durationInFrames` ≥4.0.533; `trimBefore` on sequences ≥4.0.497) — [Remotion docs: TransitionSeries](https://www.remotion.dev/docs/transitions/transitionseries)
- `@remotion/motion-blur`: `CameraMotionBlur`, `Trail`, (latest) `HtmlInCanvasMotionBlur` — §6
- `@remotion/paths` exports (4.0.250): `evolvePath, interpolatePath, getLength, getPointAtLength, getTangentAtLength, getBoundingBox, getSubpaths, normalizePath, parsePath, reduceInstructions, resetPath, reversePath, scalePath, translatePath, warpPath, extendViewBox, serializeInstructions, getInstructionIndexAtLength` — installed `@remotion/paths/dist/index.d.ts`; [Remotion docs: paths](https://www.remotion.dev/docs/paths)
- `@remotion/shapes` exports: `Circle, Ellipse, Pie, Polygon, Rect, Star, Triangle` + `make*()` path generators — installed `@remotion/shapes/dist/index.d.ts`; shapes accept `effects` from v4.0.474 — [Remotion docs: Effects](https://www.remotion.dev/docs/effects)
- `@remotion/noise`: `noise2D(seed, x, y)`, `noise3D(seed, x, y, z)`, `noise4D(seed, x, y, z, w)` — 4.0.534 type defs ([npm @remotion/noise](https://www.npmjs.com/package/@remotion/noise))
- `@remotion/layout-utils`: `measureText`, `fitText`, `fitTextOnNLines`, `fillTextBox` — 4.0.534 type defs ([npm @remotion/layout-utils](https://www.npmjs.com/package/@remotion/layout-utils))
- `@remotion/animation-utils`: `makeTransform([...])` with helpers `translate/translateX/Y/Z/translate3d, scale*, rotate/rotateX/Y/Z/rotate3d, skew*, perspective, matrix*`, and `interpolateStyles(input, inputRange, outputStylesRange, options)` — 4.0.534 type defs ([npm @remotion/animation-utils](https://www.npmjs.com/package/@remotion/animation-utils))
- `@remotion/effects` (first published 4.0.455 on 2026-05-01; feature docs say ≥4.0.464): pixel effects via an `effects={[...]}` prop on `<Solid>`, `<HtmlInCanvas>`, `<Video>`, `<Img>`, `<CanvasImage>`, `<AnimatedImage>`, `<Gif>`, `<RemotionRiveCanvas>`, and shapes; custom effects with `createEffect()` (2D canvas, WebGL2, WebGPU) — [Remotion docs: Effects](https://www.remotion.dev/docs/effects). Subpath exports in 4.0.534 include `blur, glow, drop-shadow, chromatic-aberration, vignette, zoom-blur, light-leak, light-trail, linear-progressive-blur, radial-progressive-blur, region-blur, noise, white-noise, shine, starburst, halftone, scanlines, tv-signal-off, pixelate, pixel-dissolve, lut, levels, exposure, contrast, saturation, vibrance, tint, duotone, color-correction, corner-pin, fisheye, wave, waves, mirror, tile, gridlines, dot-grid, paper, burlap…` (names only, from package exports; individual effect docs not read) — 4.0.534 `package.json` exports ([npm @remotion/effects](https://www.npmjs.com/package/@remotion/effects))
- `@remotion/light-leaks`: `LightLeak` component + `lightLeak()`; deprecated in favour of `@remotion/effects/light-leak` — [Remotion docs: light leaks](https://www.remotion.dev/docs/light-leaks)
- `HtmlInCanvas` (≥4.0.455, experimental Chrome API; rendering works out of the box; WebGL needs `--gl=angle`/`swangle`) — [Remotion docs: HtmlInCanvas](https://www.remotion.dev/docs/html-in-canvas)
- `@remotion/three`: `ThreeCanvas`, `ThreeWebGPUCanvas`, `useVideoTexture`, `useOffthreadVideoTexture`; `--gl=angle` required; `remotion-template-three` 3D phone template — [Remotion docs: @remotion/three](https://www.remotion.dev/docs/three)
- `@remotion/lottie` / `@remotion/rive`: packages exist at 4.0.534 on npm ([npm @remotion/lottie](https://www.npmjs.com/package/@remotion/lottie), [npm @remotion/rive](https://www.npmjs.com/package/@remotion/rive)); `<RemotionRiveCanvas>` accepts `effects` — [Remotion docs: Effects](https://www.remotion.dev/docs/effects). The `/docs/lottie` page fetch returned 404 (URL changed) — API details UNVERIFIED here.

### Inferences — code patterns (TypeScript, for 4.0.250 unless noted)
```tsx
// motion/tokens.ts — house curves & springs (values from §1)
import {Easing, SpringConfig} from 'remotion';
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),        // expo-out (entrances, landings)
  outSoft: Easing.bezier(0.05, 0.7, 0.1, 1),  // M3 emphasized-decelerate
  in: Easing.bezier(0.3, 0, 0.8, 0.15),       // M3 emphasized-accelerate (exits)
  inOut: Easing.bezier(0.83, 0, 0.17, 1),     // quint in-out (camera between holds)
  back: Easing.bezier(0.34, 1.56, 0.64, 1),   // small overshoot (badges only)
};
export const SPRING: Record<string, Partial<SpringConfig>> = {
  ui:    {stiffness: 380, damping: 31, mass: 1},  // ζ≈0.8, ~12 f, 1.5% overshoot
  pop:   {stiffness: 800, damping: 34, mass: 1},  // ζ≈0.6, ~10 f, 9% overshoot
  heavy: {stiffness: 200, damping: 23, mass: 1},  // ζ≈0.8, ~16 f (phone/camera)
  fade:  {stiffness: 1600, damping: 80, mass: 1}, // ζ=1, ~6 f (effects)
};
// stagger helper: delay i-th child by `step` frames (cap total cascade)
export const stagger = (i: number, n: number, step = 3, cap = 15) => i * Math.min(step, cap / Math.max(1, n - 1));
```
```tsx
// Always-alive drift (never-static frames) with @remotion/noise (add package at same version)
import {noise2D} from '@remotion/noise';
const t = frame / 90; // ~1 cycle / 3 s
const driftRotY = noise2D('rotY', t, 0) * 3;   // ±3°
const driftRotX = noise2D('rotX', t, 10) * 1.5; // ±1.5°
const driftY    = noise2D('y', t, 20) * 10;     // ±10 px
```
```tsx
// Perceptual zoom without upgrading (log-space); ≥4.0.490 use {output: 'perceptual-scale'}
const p = interpolate(frame, [0, 16], [0, 1], {easing: Easing.bezier(0.7, 0, 0.84, 0), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const scale = Math.exp(Math.log(1) + (Math.log(8) - Math.log(1)) * p);
```
```tsx
// Beat grid
const beat = (n: number, bpm = 120, fps = 30) => Math.round((n * 60 * fps) / bpm); // 120 BPM → 15 f/beat
```
- Performance (inference + source-backed parts): `CameraMotionBlur` ≈ samples× render cost (source); `filter: blur()`, large `box-shadow`, and `backdrop-filter` on full-frame layers are expensive in headless Chrome — keep them on small elements and cache static backgrounds as images (UNVERIFIED in docs this round; see Pendente); WebGL (`@remotion/three`, shader transitions, effects) needs `--gl=angle` with a GPU, else `swangle` (CPU, slow).

### Gaps
- Lottie/Rive API details (props, AE/Bodymovin feature support) not verified this round.
- Remotion's GPU/performance docs page not read; render-time costs not benchmarked.

---

## PENDENTE / NÃO PESQUISADO
- **Remotion performance docs** (which CSS properties are slow without GPU: `filter: blur`, `box-shadow`, gradients, `backdrop-filter`) — next step: fetch remotion.dev/docs/gpu and /docs/performance; optionally benchmark `CameraMotionBlur` samples 1/5/10 on the Rotina comp with `npx remotion benchmark`.
- **@remotion/lottie and @remotion/rive** API + Bodymovin limitations (unsupported AE features, fonts, expressions) — fetch remotion.dev/docs/lottie/lottie, /docs/lottie/getlottiemetadata, /docs/rive, and airbnb lottie "supported features" page.
- **Apple HIG Motion** text (page didn't render) — try the HIG JSON endpoint or a cached copy; confirm SwiftUI `.snappy/.bouncy/.smooth` default durations from Apple docs.
- **Meta official Reels safe-zone page** and Instagram organic numbers — fetch Meta Business Help Center / Ads Guide for Reels.
- **TikTok creative best-practices page** — verify the "words per second" text claim and any official retention stats.
- **Caption reading-speed primary source** (Jensema 1998) — confirm numbers via the paper or DCMP Captioning Key.
- **School of Motion / Ben Marriott / Jake in Motion / ECAbrams / Video Copilot** concrete tips (stagger frames, overshoot %, graph-editor habits) — not opened; would strengthen §2–3 numbers which are currently synthesized.
- **Flow plugin** preset library, AE text-animator (range selector) specifics for kinetic type.
- **Official launch films** (Linear, Stripe Sessions, Arc, Notion, Raycast) — watch/analyse directly; no written breakdowns found.
- **Material motion transition patterns** (container transform, shared axis, fade through) durations — for continuity/match-move guidance.
- **Render-tests** of new shader presentations (`blurSlide`, `zoomBlur`, `crossZoom`, `pushCut`) and `@remotion/effects` after upgrading to 4.0.534 (requires bumping all `@remotion/*` packages together).
