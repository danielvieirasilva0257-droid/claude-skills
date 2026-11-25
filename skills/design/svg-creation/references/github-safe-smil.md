# GitHub-Safe SMIL Patterns

Read when the deliverable is a **self-contained animated SVG** for GitHub README, profile, or any sandbox that blocks `<script>` and external assets. Distilled from svg-terminal and Ai-Generated-SVG-Examples (SMIL-only AI output catalogs).

## Hard constraints (sandbox)

- **No** `<script>`, event handlers, `foreignObject`, or external `href`/`xlink:href`.
- **No** runtime JS — animation via **SMIL** (`<animate>`, `<animateTransform>`, `<animateMotion>`) and optional embedded `<style>` only when the SVG is inline or embedded as raw markup (not via `<img>`).
- Escape or avoid injecting user-controlled text into SVG text nodes — treat dynamic strings as untrusted (svg-terminal pattern: strict schema + emit-time escape).

## Tiered reduced motion

GitHub-safe assets should respect `prefers-reduced-motion` at two levels:

1. **CSS layer** — disable `@keyframes` / transitions inside `<style>`:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

2. **SMIL layer** — CSS cannot stop SMIL. For full stillness, ship a **static variant** (first keyframe as default, no `<animate>` children) or document that SMIL loops remain unless removed. svg-terminal uses `--static` to emit final frame only — mirror that by duplicating `assets/svg/name-static.svg` when accessibility requires zero motion.

## Recipe: typing dots (staggered SMIL)

Three circles, offset `begin` — works in README embeds:

```svg
<svg viewBox="0 0 60 20" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Loading</title>
  <circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.3">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0s"/>
  </circle>
  <circle cx="30" cy="10" r="4" fill="currentColor" opacity="0.3">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.2s"/>
  </circle>
  <circle cx="50" cy="10" r="4" fill="currentColor" opacity="0.3">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.4s"/>
  </circle>
</svg>
```

## Recipe: heartbeat pulse

Scale via `animateTransform` on a group — keep transform origin at shape center:

```svg
<g transform="translate(50,50)">
  <path d="M0,-8 C0,-14 8,-18 0,-26 C-8,-18 0,-14 0,-8" fill="#e63946">
    <animateTransform attributeName="transform" type="scale"
      values="1;1.15;1" dur="0.8s" repeatCount="indefinite" additive="sum"/>
  </path>
</g>
```

## Recipe: equalizer bars

Four bars — stagger `height` via `values` + offset `begin` (cap at ≤8 bars):

```svg
<svg viewBox="0 0 80 40" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Audio</title>
  <rect x="4" y="20" width="8" height="12" fill="currentColor">
    <animate attributeName="height" values="12;28;12" dur="0.9s" repeatCount="indefinite" begin="0s"/>
    <animate attributeName="y" values="20;4;20" dur="0.9s" repeatCount="indefinite" begin="0s"/>
  </rect>
  <rect x="20" y="16" width="8" height="16" fill="currentColor">
    <animate attributeName="height" values="16;32;16" dur="0.9s" repeatCount="indefinite" begin="0.15s"/>
    <animate attributeName="y" values="16;0;16" dur="0.9s" repeatCount="indefinite" begin="0.15s"/>
  </rect>
  <rect x="36" y="12" width="8" height="20" fill="currentColor">
    <animate attributeName="height" values="20;36;20" dur="0.9s" repeatCount="indefinite" begin="0.3s"/>
    <animate attributeName="y" values="12;-4;12" dur="0.9s" repeatCount="indefinite" begin="0.3s"/>
  </rect>
  <rect x="52" y="18" width="8" height="14" fill="currentColor">
    <animate attributeName="height" values="14;30;14" dur="0.9s" repeatCount="indefinite" begin="0.45s"/>
    <animate attributeName="y" values="18;2;18" dur="0.9s" repeatCount="indefinite" begin="0.45s"/>
  </rect>
</svg>
```

## Recipe: neon glow pulse

Filter + opacity pulse — keep blur radius modest for file size:

```svg
<svg viewBox="0 0 120 60" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Neon</title>
  <defs>
    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <text x="60" y="38" text-anchor="middle" font-size="28" font-family="ui-sans-serif,system-ui"
    fill="#0ff" filter="url(#neon-glow)">
    NEON
    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
  </text>
</svg>
```

Prefix filter `id` when multiple SVGs share a page.

## Recipe: DNA helix (dual strand)

Two sinusoidal strokes — animate `stroke-dashoffset` in opposite directions (SMIL, self-contained):

```svg
<svg viewBox="0 0 100 120" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>DNA</title>
  <path id="a" fill="none" stroke="#e63946" stroke-width="2" pathLength="100"
    stroke-dasharray="8 4" stroke-dashoffset="0"
    d="M25,10 C45,30 5,50 25,70 C45,90 5,110 25,110"/>
  <path id="b" fill="none" stroke="#457b9d" stroke-width="2" pathLength="100"
    stroke-dasharray="8 4" stroke-dashoffset="0"
    d="M75,10 C55,30 95,50 75,70 C55,90 95,110 75,110"/>
  <animate xlink:href="#a" attributeName="stroke-dashoffset" from="0" to="-24"
    dur="2s" repeatCount="indefinite"/>
  <animate xlink:href="#b" attributeName="stroke-dashoffset" from="0" to="24"
    dur="2s" repeatCount="indefinite"/>
</svg>
```

Use `xmlns:xlink` on root if `xlink:href` is required in target embed.

## Recipe: braille frame spinner (svg-terminal pattern)

Cycle frames with opacity — no JS; one glyph visible per keyframe window:

```svg
<svg viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Loading</title>
  <text x="12" y="17" text-anchor="middle" font-family="monospace" font-size="16" fill="currentColor">
    <tspan>⠋</tspan>
    <animate attributeName="opacity" values="1;1;0;0;0;0;0;0" dur="0.8s" repeatCount="indefinite"/>
  </text>
  <text x="12" y="17" text-anchor="middle" font-family="monospace" font-size="16" fill="currentColor" opacity="0">
    <tspan>⠙</tspan>
    <animate attributeName="opacity" values="0;0;1;1;0;0;0;0" dur="0.8s" repeatCount="indefinite"/>
  </text>
  <text x="12" y="17" text-anchor="middle" font-family="monospace" font-size="16" fill="currentColor" opacity="0">
    <tspan>⠹</tspan>
    <animate attributeName="opacity" values="0;0;0;0;1;1;0;0" dur="0.8s" repeatCount="indefinite"/>
  </text>
  <text x="12" y="17" text-anchor="middle" font-family="monospace" font-size="16" fill="currentColor" opacity="0">
    <tspan>⠸</tspan>
    <animate attributeName="opacity" values="0;0;0;0;0;0;1;1" dur="0.8s" repeatCount="indefinite"/>
  </text>
</svg>
```

For `{frames, fps, loop}` authoring at scale → `npx svg-terminal generate` (`svg-tooling.md`).

## Ai-Generated catalog coverage

The BlinkZer0 SMIL-only set (20 examples) maps to svg-creation recipes — full index in `examples.md` § Catalog. Prefer existing recipes before inventing new SMIL.

## When NOT to use this file

- Inline React/Vue DOM animation → `motion-animation` or `gsap-animation`
- Declarative terminal YAML generation → svg-terminal tool (out of scope — mention CLI only in `svg-tooling.md` if user asks)
