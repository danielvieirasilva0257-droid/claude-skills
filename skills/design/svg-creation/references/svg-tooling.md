# SVG Tooling Taxonomy

Read when input is a **bitmap**, output needs **optimization**, or the user asks which tool/library to use. Distilled from awesome-svg categories — local guidance only, no external link farms.

## When to use what

| Job | Tool / approach | Use when |
|-----|-----------------|----------|
| Handcraft static icon | svg-creation `static-craft.md` | ≤48px UI, custom family, `currentColor` |
| Handcraft animation | svg-creation `animation-craft.md` | Self-contained SVG or inline DOM |
| Bitmap → vector | **vtracer** (`--preset photo\|poster\|bw`, `--mode spline`) | PNG/JPG logo, photo trace, pixel art |
| Bitmap → vector (B&W) | **Potrace** | High-contrast scans, single-color output |
| Optimize output | **SVGO** | Strip metadata, merge paths, shrink file size post-generation |
| Line-draw in web app | **vivus** / **lengthy-svg** | JS runtime; SVG must be inline in DOM — not `<img>` |
| Rich web animation | **Motion** (`motion-animation`) / **GSAP** (`gsap-animation`) | React app with inline SVG; sequencing, scroll — not README embeds |
| Programmatic Python SVG | **svg.py** | Build SVG from code/data pipelines — not agent markup authoring |
| Hand-drawn aesthetic | **rough.js** | Sketch/wireframe look; pairs with static craft rules |

## Decision tree

```
Input is raster?  → vtracer/Potrace → hand-cleanup → svg-creation
Need animated README/GitHub SVG?  → SMIL only (svg-creation) — no GSAP
Need animated inline React UI?  → CSS/Motion/GSAP on inline SVG
Icon inside DESIGN.md build?  → design-system svg-craft + svg-creation for motion
File too large?  → SVGO after quality gate passes
```

## Out of scope for this skill

- Wiring Gemini/OpenRouter APIs (SVG-ORA runtime) — use `ai-svg-prompts.md` as review gate only
- Installing or configuring tools — mention command, user runs locally
- Executing untrusted repo code during learning

## vtracer quick reference

```sh
vtracer --input input.png --output output.svg --preset photo --mode spline
```

Post-trace: merge collinear segments, remove speckle, unify stroke width, then svg-creation quality gate.

## vivus (inline line-draw, no React animation lib)

Use when the stack is **vanilla JS or React without GSAP/Motion** and you only need stroke reveal on mount.

- SVG must be **inline in the DOM** — vivus cannot animate `<img src="*.svg">`.
- vivus animates **`<path>` strokes only**. Convert `<line>`, `<polyline>`, `<polygon>`, `<rect>`, `<circle>`, `<ellipse>` to `<path>` first (vivus can do this at init, or hand-convert in `svg-creation` for cleaner output).
- For self-contained README/GitHub SVG with no JS → `animation-craft.md` SMIL, not vivus.
- For React with sequencing, scroll, or `pathLength` → prefer `motion-animation` or `gsap-animation`.

```js
import Vivus from 'vivus';
new Vivus('my-svg-id', { duration: 120, type: 'delayed', animTimingFunction: Vivus.EASE });
```

**vivus prerequisites (from maxwellito/vivus):**
- Every animated shape needs `fill: none` and a visible `stroke` — vivus does not animate fills.
- Remove **hidden** paths before animating; vivus includes them and causes gaps.
- **No `<text>`** — text cannot convert to path; use outlines or skip.
- Mark paths to skip with `data-ignore="true"`.
- Types: `delayed` (default stagger), `sync` (all at once), `oneByOne` (sequential draw).
- On responsive resize, call `vivus.recalc()` (ResizeObserver) when `vector-effect` or scaling changes stroke length.

**scenario / scenario-sync** — hand-tuned draw order without rewriting paths:

```html
<!-- type: 'scenario' — absolute frame times on each path -->
<path data-start="0" data-duration="20" d="..." />
<path data-start="20" data-duration="20" d="..." />

<!-- type: 'scenario-sync' — delay after previous path ends -->
<path data-duration="15" d="..." />
<path data-delay="10" data-async d="..." />
```

```js
new Vivus('logo', { type: 'scenario', duration: 200 });
new Vivus('logo', { type: 'scenario-sync', duration: 200 });
```

**Vivus Instant (CSS-only README export):** For a one-off logo draw with **no JS at view time**, use the Vivus Instant web tool to export CSS `stroke-dashoffset` keyframes baked into the SVG, then ship as self-contained file. Prefer `animation-craft.md` SMIL when hand-authoring in-agent.

Pair with `animation-craft.md` WebKit gotcha if using CSS variables for dash length instead of vivus's built-in stroke animation.

## lengthy-svg (CSS var path length)

Microlibrary that sets `--path-length` on each shape via `getTotalLength()`:

```js
import Lengthy from 'lengthy-svg';
Lengthy('.draw-target'); // adds class "lengthy" + style="--path-length:…"
```

Then animate with CSS — see `animation-craft.md` for WebKit `-webkit-keyframes` workaround. Shapes supported: circle, rect, line, polyline, polygon, path.

## rough.js (hand-drawn aesthetic)

When the brief asks for sketch/wireframe/warm imperfection — not crisp UI icons:

```js
import rough from 'roughjs/bundled/rough.esm.js';
const rc = rough.svg(document.querySelector('svg'));
document.querySelector('svg').appendChild(
  rc.rectangle(10, 10, 180, 80, { roughness: 1.4, stroke: 'currentColor', fill: 'none' })
);
```

Tune `roughness`, `bowing`, `fillStyle` (`hachure`, `solid`, `cross-hatch`). Export static SVG from canvas/svg output; animated rough SVG still needs SMIL/CSS per delivery context.

## svg-terminal (README terminal art)

**Tool, not hand-authoring** — generates GitHub-sandbox-safe animated terminal SVG from YAML (`npx svg-terminal generate`). Use when the user wants profile README terminal blocks, not custom icons. Flags: `--static` for reduced-motion still frame, `--minify` for smaller file.

## SVGO quick reference

```sh
svgo icon.svg -o icon.min.svg --multipass
```

See `static-craft.md` for `prefixIds` and animation-safe SVGO overrides.

## awesome-svg category map

Distilled taxonomy for routing — no external links (list rots). When a job matches a category, use the tool row above or hand-craft via svg-creation.

| Category | Typical tools / approach | agent-loom route |
|----------|--------------------------|------------------|
| **Optimization** | SVGO, svgcleaner | `static-craft.md` SVGO section |
| **Animation (runtime)** | GSAP, Motion, vivus, snap.svg | `gsap-animation`, `motion-animation`, vivus row |
| **Animation (declarative)** | SMIL, CSS keyframes | `animation-craft.md`, `github-safe-smil.md` |
| **Tracing / raster** | vtracer, Potrace, autotrace | vtracer row + hand cleanup |
| **Hand-drawn** | rough.js | rough.js row |
| **Editors / export** | Inkscape, Figma, Illustrator | Export SVG → svg-creation cleanup gate |
| **Filters / effects** | feGaussianBlur, feColorMatrix | `github-safe-smil.md` neon recipe; keep blur modest |
| **Text → paths** | Inkscape object-to-path | Required before vivus; avoid live `<text>` in draw animations |
| **README / profile art** | svg-terminal | svg-terminal CLI row |
| **Framework bindings** | react-svg, svgr | Static markup via svg-creation; motion via Motion skill |
