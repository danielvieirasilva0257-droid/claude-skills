---
name: remotion-video
description: Create programmatic videos with Remotion (React rendered frame by frame). Use when the user asks to make, edit or animate a video, motion graphics, intro/outro, explainer, social clip or any "vídeo com React/Remotion", or when working in a project that has remotion in package.json.
---

# Remotion Video

Remotion renders videos from React components. Full docs: https://www.remotion.dev/docs/ — consult them whenever unsure.
The unabridged original reference (ThariqS' Remotion CLAUDE.md) is in `references/remotion-claude-md-original.md`.

## Golden rules

1. **Everything is a function of the frame.** Drive all animation from `useCurrentFrame()`. Never use CSS transitions, `setTimeout`, `requestAnimationFrame`.
2. **Deterministic.** No `Math.random()` — use `random('static-seed')` from `remotion`. No data fetching or `useEffect`/`useState` for visuals.
3. **No interactivity.** No `onClick`, hover, etc. All inputs come in as props (`defaultProps` on the Composition).
4. Frames start at 0. Inside a `<Sequence>`, `useCurrentFrame()` restarts at 0.

## Project skeleton

`src/Root.tsx` registers compositions. Defaults: id `MyComp`, 30 fps, 1920×1080.

```tsx
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const Root: React.FC = () => (
	<Composition id="MyComp" component={MyComp} durationInFrames={120}
		width={1920} height={1080} fps={30} defaultProps={{}} />
);
```

`defaultProps` must match the props the component expects. Get fps/size/duration with `useVideoConfig()`.

## Media

| Need | Use | Notes |
|---|---|---|
| Video | `<OffthreadVideo>` | `startFrom`, `endAt` (frames), `volume` 0–1 |
| Still image | `<Img>` | |
| Animated GIF | `<Gif>` from `@remotion/gif` | install the package |
| Audio | `<Audio>` | `startFrom`, `endAt`, `volume` |

Assets: remote URL, or a file in `public/` via `staticFile('name.ext')`.

## Layout and timing

- Layers: `<AbsoluteFill>` (later siblings render on top).
- Delay an element: `<Sequence from={10} durationInFrames={20}>`. Negative `from` starts immediately and cuts the first N frames.
- One after another: `<Series><Series.Sequence durationInFrames={20} offset={-8}>…`. `offset` shifts the start (negative = overlap); there is no `from`.
- With transitions: `TransitionSeries` from `@remotion/transitions`. `TransitionSeries.Transition` must sit **between** two `TransitionSeries.Sequence`s; it has no `offset`.

```tsx
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';

<TransitionSeries>
	<TransitionSeries.Sequence durationInFrames={60}><SceneA /></TransitionSeries.Sequence>
	<TransitionSeries.Transition timing={springTiming({config: {damping: 200}})} presentation={fade()} />
	<TransitionSeries.Sequence durationInFrames={60}><SceneB /></TransitionSeries.Sequence>
	<TransitionSeries.Transition timing={linearTiming({durationInFrames: 30})} presentation={wipe()} />
	<TransitionSeries.Sequence durationInFrames={60}><SceneC /></TransitionSeries.Sequence>
</TransitionSeries>
```

A transition overlaps its neighbours, so total duration = sum of sequences − sum of transition durations.

## Animation

```tsx
const frame = useCurrentFrame();
const {fps} = useVideoConfig();

// Linear mapping — always clamp both sides
const opacity = interpolate(frame, [0, 30], [0, 1], {
	extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});

// Physics-based 0→1 — damping 200 = smooth, no bounce
const s = spring({fps, frame, config: {damping: 200}});
```

For a bouncy entrance lower `damping` (e.g. 12–20). Delay a spring with `frame: frame - delayFrames`.

## UI components for video

Convert any interactive component to video by: removing handlers and state, replacing transitions with `interpolate`/`spring` on the frame, and passing every variable as a prop.

```tsx
// Normal React: onClick + useState  →  Remotion: frame-driven
const AnimatedButton = () => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, 30], [1, 1.2], {extrapolateRight: 'clamp'});
	return <div style={{transform: `scale(${scale})`, background: 'blue', padding: '10px 20px', display: 'inline-block'}}>Click me!</div>;
};
```

## Workflow

1. New project: `npx create-video@latest`. Preview: `npx remotion studio`.
2. Plan scenes and durations in frames (seconds × fps).
3. Build one component per scene, compose them with `Series`/`TransitionSeries`, add audio last.
4. Render: `npx remotion render <CompositionId> out/video.mp4` (still: `npx remotion still`).
5. Check a few frames in the Studio before the full render.

## "After Effects" polish (learned on the Rotina video, see `rotina-video/` in this repo)

- **Easing:** `Easing.bezier(0.16, 1, 0.3, 1)` (expo out) for entrances and `Easing.bezier(0.83, 0, 0.17, 1)` for whip pans. Wrap them in one `tween(frame, range, out, easing)` helper that always clamps.
- **Motion blur:** wrap the scene in `<CameraMotionBlur shutterAngle={200} samples={10}>` from `@remotion/motion-blur`. Render time grows with `samples`.
  - Keep static backgrounds **outside** the blur, because stacked samples on dark gradients cause banding.
  - Put film grain on top, outside the blur: an SVG `feTurbulence` with `seed={frame % 12}`, opacity ~0.09, `mix-blend-mode: overlay`.
  - Don't count numbers frame by frame under motion blur, because the digits ghost. Swap the value once and add a spring "pop".
- **Text animator:** per-letter stagger of translateY + `filter: blur()` + opacity. Exit with blur and fade upward.
- **Phone mockup:** design screens at 390pt width and `transform: scale()` them into the device frame. Animate the device with rotateX/rotateY under `perspective`, and add a scale "punch-out" during whips.
- **Screens in a strip:** put the screens side by side and translate the strip for transitions. Start each screen's local animation a few frames before it slides in, so a whip never reveals an empty screen.

## Rendering in a sandbox / offline

- Bundle fonts in `public/fonts` and load them with `FontFace` + `staticFile` + `delayRender`. `@remotion/google-fonts` fails behind a TLS-intercepting proxy.
- Use an existing Chromium: `--browser-executable=/path/to/headless_shell` (Playwright's `chromium_headless_shell`).
- Check stills at key frames (`npx remotion still … --frame=N`) and tile them with `ffmpeg … hstack` before the full render.

## Reusing other skills

- `button-animation` and `thumbnail-carousel` hold UI/animation ideas (springs, scale-in, staggered thumbnails). Their code is interactive React, so port the *motion values* into `interpolate`/`spring`, don't copy the components verbatim.
- `ui-ux-pro-max` helps choose palette, typography and style for the video's visuals.
