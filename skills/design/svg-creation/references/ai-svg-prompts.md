# AI SVG Generation Checklist

Read during svg-creation Step 5 when drafting SVG via LLM before accepting output.

Distilled from SVG-ORA-Studio system prompts + supermemoryai svg-animations. Use as **generation brief + review gate** — not runtime API code.

## Prompt dimensions (set before generating)

| Dimension | Values / guidance |
|-----------|-------------------|
| **style** | `flat`, `outline`, `filled`, `isometric`, `blueprint`, `hand-drawn` — pick one |
| **viewpoint** | `front`, `side`, `top`, `isometric`, `optimized for subject` |
| **mood** | `neutral`, `playful`, `serious`, `tech`, `warm`, `minimal` |
| **complexity** | `minimal` (few paths, abstract) · `medium` (balanced iconography) · `detailed` (texture/shading justified) |
| **stroke** | `uniform 1.5 round` · `hairline` · `bold 2px` · `none` (fill-only) |
| **theme / palette** | `currentColor` (icons) · named harmony (`complementary`, `analogous`, `monochrome`) + 2–4 hex if illustration |
| **ratio / viewBox** | e.g. `0 0 24 24`, `0 0 200 100` — artwork must fill ≥85% |
| **animated** | `yes` → SMIL or `<style>` per delivery context (Step 2) · `no` → static only |
| **negativePrompt** | Elements to forbid: e.g. `gradients`, `text`, `photorealism`, `drop shadows`, `3D effects` |

## System constraints to enforce

1. **Output:** raw `<svg>...</svg>` only in the file artifact — no markdown fences.
2. **viewBox:** matches requested aspect ratio; subject fills frame.
3. **Self-contained:** no external images, fonts, or URLs.
4. **Semantic IDs/classes** when structure has multiple reusable parts — prefix with asset slug (`logo-bg`, not `Path-1`).
5. **Animation toggle:** explicit per delivery context — never CSS animation in README/`<img>` assets.

## Review rubric (reject and re-prompt if fail)

| Check | Pass | Fail |
|-------|------|------|
| Path economy | ≤10 paths for icons | Hundreds of micro-segments |
| Dash animation | `pathLength` or `getTotalLength()` | Magic number `stroke-dasharray: 300` |
| Morph / wave | Matching command structure | Different point counts per keyframe |
| Security | No script/handlers/foreignObject | Any executable or HTML embed |
| IDs | Prefixed, semantic | Generic `grad1`, `Path-1` |
| Motion | Loops smoothly | Pop at loop boundary |
| Style fit | Matches declared style/mood | Generic gradient blob |

## Full re-prompt template

```
You are an SVG craft expert. Return ONLY raw <svg>...</svg>.

Style: [style] | Viewpoint: [viewpoint] | Mood: [mood]
Complexity: [minimal|medium|detailed] | Stroke: [stroke]
Theme: [theme] | Primary color: [hex or currentColor]
viewBox: [ratio] | Animated: [yes|no] | Delivery: [inline|img|readme]
If animated: use [SMIL|CSS] appropriate to delivery.
Avoid: [negativePrompt].
Fill the viewBox. No external resources. Semantic id/class prefixes: [slug]-*
```

## Post-generation pipeline

1. Run static-craft cleanup (metadata strip, simplify paths).
2. Run animation-craft validation if animated.
3. SVGO if file size matters (see `svg-tooling.md`).
4. Save via svg-creation Step 7.
