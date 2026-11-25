# SVG Animation Craft

Read during svg-creation Step 4 after delivery context is chosen.

## Technology picker

| Need | Inline DOM | `<img>` / README |
|------|------------|------------------|
| Line draw | CSS `stroke-dashoffset` + `getTotalLength()` | SMIL `stroke-dashoffset` animate |
| Rotate / scale | CSS `transform` or SMIL `animateTransform` | SMIL `animateTransform` |
| Morph shape | CSS `d` (matching commands) or SMIL `animate attributeName="d"` | SMIL only |
| Color pulse | CSS `fill`/`opacity` | SMIL `animate` on attribute |

## Line drawing (signature effect)

Mechanism: `stroke-dasharray` = path length; `stroke-dashoffset` starts at length; animate to `0`.

**CSS (inline only):**
```css
.draw {
  stroke-dasharray: var(--len);
  stroke-dashoffset: var(--len);
  animation: draw 2s ease forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
```
Set `--len` via JS: `path.getTotalLength()`.

**WebKit / Safari gotcha (lengthy-svg):** Do not rely on animating `stroke-dashoffset` when **only** `stroke-dasharray` is set via a CSS custom property. WebKit often fails to paint the draw. Fix: set **both** `stroke-dasharray` and `stroke-dashoffset` on the element — as SVG presentation attributes, or inline `style` — then animate offset (CSS `@keyframes`, JS, or SMIL). `pathLength` + matching attribute values is the most reliable cross-browser SMIL approach.

**lengthy-svg + CSS vars:** If using `Lengthy()` to inject `--path-length`, Chrome may treat unitless `calc(var())` keyframes as discrete steps. Use separate `-webkit-keyframes` with `calc(1px * var(--path-length))` on `stroke-dashoffset`, and reset with `-moz-animation-name` for Firefox (lengthy-svg pattern). Prefer SMIL or vivus when cross-browser CSS draw is fragile.

**SMIL (self-contained):**
```svg
<path d="..." fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" pathLength="100"
  stroke-dasharray="100" stroke-dashoffset="100">
  <animate attributeName="stroke-dashoffset" to="0" dur="1.5s" fill="freeze"/>
</path>
```
`pathLength="100"` normalizes length when exact measure unavailable — tune `stroke-dasharray` to match.

**Stagger:** `animation-delay: 0.3s` per path (CSS) or `begin="line1.end"` (SMIL).

## Spinner (loop loader)

Combine `animateTransform` rotate + `stroke-dashoffset` oscillation on a partial arc (`stroke-dasharray="90 150"`). See SKILL.md teaser example.

## Morph (hamburger → X)

Rules:
- Same number of path commands on both shapes.
- Same command letters in same order (`M L L` ↔ `M L L`, not `M C Q`).
- Use `fill="freeze"` so final state holds.

```svg
<path d="M 3,6 L 21,6" stroke="currentColor" stroke-width="2">
  <animate attributeName="d" to="M 5,5 L 19,19" dur="0.3s" begin="menu.click" fill="freeze"/>
</path>
```

For mismatched shapes, insert invisible intermediate points — never morph unrelated topologies.

## Motion along path

```svg
<circle r="4" fill="#e63946">
  <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
    <mpath href="#track"/>
  </animateMotion>
</circle>
<path id="track" d="M 10,50 C 50,10 150,90 190,50" fill="none"/>
```

`rotate="auto"` orients tangent to path; `rotate="auto-reverse"` flips 180°.

## Gradient shift (color cycle)

Animate `stop-color` on gradient stops — works in self-contained SMIL SVGs.

```svg
<defs>
  <linearGradient id="shift" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%">
      <animate attributeName="stop-color"
        values="#e63946;#457b9d;#2a9d8f;#e63946" dur="4s" repeatCount="indefinite"/>
    </stop>
    <stop offset="100%">
      <animate attributeName="stop-color"
        values="#457b9d;#2a9d8f;#e63946;#457b9d" dur="4s" repeatCount="indefinite"/>
    </stop>
  </linearGradient>
</defs>
<rect width="200" height="100" fill="url(#shift)" rx="8"/>
```

## Liquid wave

Morph closed wave silhouette — **three** `d` keyframes, matching command count, `calcMode="spline"`:

```svg
<path fill="#457b9d" opacity="0.7">
  <animate attributeName="d" dur="5s" repeatCount="indefinite"
    values="M 0,40 C 30,35 70,45 100,40 L 100,100 L 0,100 Z;
            M 0,40 C 30,50 70,30 100,40 L 100,100 L 0,100 Z;
            M 0,40 C 30,35 70,45 100,40 L 100,100 L 0,100 Z"
    calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
</path>
```

Repaint-heavy — use for hero backgrounds only, not small icons.

## Breathing glow

Pulse `r` + `opacity` on one shape with matched spline easing. See `references/examples.md` Example 4.

## Easing

SMIL: `calcMode="spline"` + `keySplines="0.42 0 0.58 1"` (ease-in-out).
CSS: `animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1)`.

## Performance

- Prefer animating `transform` and `opacity` (compositor-friendly).
- Limit simultaneous `d` morphs on complex paths.
- One choreographed `<g>` transform beats animating many children independently.
- Inline CSS: `will-change: transform` on animated elements helps compositing (remove after animation if one-shot).

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  svg * { animation: none !important; transition: none !important; }
}
```

For SMIL-only assets, ship a static fallback file or first keyframe as default state.

## Accessibility

- `role="img"` + `<title>` on root.
- Looping loaders: `aria-label="Loading"` on host element when inline.
- Do not rely on motion alone to convey state — pair with text or `aria-busy`.
