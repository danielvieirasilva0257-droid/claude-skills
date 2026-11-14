# Raw notes: "skill vídeo claude" (Drive, 7:36, analyzed 2026-11-14)

Source: Daniel's Drive folder, file `skill vídeo claude.mp4` (1920x1080, 455.7 s). Watched with the `watch` skill (96 scene frames at 1024 px) + faster-whisper small (local) + 1 fps full-res frames for 05:55–06:23 (prompt and numbers screens). Video, audio and frames deleted after analysis.

## What the video claims
- A Claude model wrote and edited the whole video from ONE prompt: script, TTS narration, every animation, 3D scenes, soundtrack, SFX, all cuts. No human opened an editor. Presenter is a HeyGen avatar ("Lyria") lip-synced to an ElevenLabs Pro voice clone.
- Every scene carries a "FEITO COM …" badge (bottom-left) naming the technique: `CANVAS 2D` (most scenes, custom engine), `CANVAS 2D · CÓDIGO REAL`, `CANVAS 2D · RUÍDO PROCEDURAL`, `CANVAS 2D · CENAS REDESENHADAS AO VIVO`, `VÍDEO REAL · PEXELS`, `APPLE VISION · RECORTE DE PESSOA`, `RECORTE · TEXTO ATRÁS DA PESSOA`, `ELEVENLABS + HEYGEN`, `ELEVENLABS · EFEITOS POR DESCRIÇÃO`, `CANVAS 2D · QUADROS REAIS DESTE VÍDEO`, `CANVAS 2D · ERRO REAL, ANTES E DEPOIS`, `CANVAS 2D · O PEDIDO, VERSÃO ESTRUTURADA`, `CANVAS 2D · NÚMEROS MEDIDOS`.
- Top-right HUD: "TERMOS ■■■… n/12" — a progress counter of the 12 editing terms taught (frame, keyframe, easing, render, transcription, EDL, cutout/segmentation, tracking, OCR, API, ducking, loudness…). Ends with "você acabou de aprender 12 termos".

## The original prompt (on screen at ~06:00, "pedido de 10/11/2026 · versão estruturada")
```
<objective>
 1. Research the best resources and state of the art in AI-driven, programmatic video editing.
 2. Decide how to leverage Claude Fable 5.2's most impressive capabilities for this job.
 3. Build it end to end (script, TTS narration, motion graphics, sound design, editing, render):
    one YouTube video that showcases and explains exactly how far AI video editing has come.
</objective>
<presenter>Lyria's horizontal avatar, lip-synced to her ElevenLabs Pro voice clone.</presenter>
<audience>Non-technical: simple to follow, with no key technical concept left out.</audience>
<techniques mode="suggestions, not obligations">
 motion-graphics libraries · Remotion · HyperFrames · JavaScript/Canvas animation · OCR ·
 3D scene rendering (WebGL) · screenshots and reference videos composited into one scene ·
 live-action footage with computer-vision object tracking and tracked graphics ·
 B-roll from stock-footage APIs · AI-generated sound effects and soundtrack
</techniques>
<constraints>Maximum length: 8 minutes. The result must be outstanding.</constraints>
<hook>Open with a far stronger version of: "O Claude Fable 5.2 criou e editou este vídeo com 1 prompt. E você vai entender exatamente como isso foi feito…"</hook>
<goal>The world's #1 AI-edited video on YouTube. Be ambitious; ignore token and time cost.</goal>
```

## Pre-existing inputs ("JÁ EXISTIA")
- Avatar: Lyria's look on HeyGen. Voice: Lyria clone on ElevenLabs. Accounts: ElevenLabs, HeyGen, Pexels.
- Previous code: "419 linhas do motor de ontem" (a Canvas 2D engine, W=1920, H=1080, FPS=30).

## Production numbers (on screen, "NÚMEROS MEDIDOS")
1 prompt · 3 h 48 min until done · 7,874 lines of code · 89 code files · 91 scenes · 13,671 frames · 312 sound cues · 3,196 frames checked. Earlier one-run videos: 12 s (Wireflow, Oct/2026), 15 s (HeyGen, HyperFrames × Remotion test); this one 455 s.

## Pipeline as described
1. Script + hook → TTS (ElevenLabs clone) → avatar lip-sync (HeyGen).
2. Word-level transcription → every cut lands on a word; for real recordings: remove silences/mistakes → EDL (`edl_narracao.json · 99 decisões`, actions like "respiro +0,83 s").
3. Motion: keyframes + easing (linear vs suave demo); libraries shown: Remotion, HyperFrames (HTML, built for agents), GSAP (timing), Three.js (3D). Same sentence animated 4 ways. Render = headless browser draws frame by frame + FFmpeg muxes.
4. 3D scene with camera/light/shadow/depth, avatar composited inside.
5. Computer vision: face location per frame (no text over the face), person segmentation (Apple Vision mask, "23,5 % é pessoa") → title behind the person without green screen; object tracking on Pexels footage (label glued to surfboard; text pinned to the ground); OCR on a screenshot to place highlights.
6. Stock: Pexels API search by sentence topic, pick, then colour-match. Screenshots/pages/reference videos as 3D objects with perspective, shadow, camera move.
7. Sound: SFX generated from text descriptions (library of 40 sounds: whoosh 0.75 s, impact 0.76 s, sparkle 1.08 s); custom soundtrack with each part sized to a chapter; ducking under voice; final loudness normalized to platform standard.
8. Self-review: model screenshots every scene and checks each; verifies no text covers the face; transcribes final audio and diffs against the script word by word; fixes errors (shows a real before/after error).
9. Why now: writes working code + sees its output + works for hours without stopping.
10. Limits: idea and taste stay human.

## Structure of the video itself (maps to our architecture map)
Hook (claim + "this face is an avatar, this voice a clone") → promise + open loop (prompt and real numbers at the end) → basics (frame) → keyframe/easing → libraries → render → 3D → real footage (transcript/EDL, face, segmentation, tracking, OCR) → material (Pexels, references) → sound (voice, avatar, SFX, music, ducking, loudness) → self-review → why now → payoff (prompt + numbers) → limits (idea, taste) → what you can do today (4 uses) → "you learned 12 terms" → CTA (community) → comment question.

## GitHub candidates checked (cloned --depth 1, 2026-11-14)
| repo | commit | skills | license | notes |
|---|---|---|---|---|
| heygen-com/hyperframes | b5e9bc6 (2026-11-14) | 9 skills + 7 registry blocks | Apache-2.0 | telemetry beacon `npx hyperframes events`; opt-out `HYPERFRAMES_NO_TELEMETRY=1` / `DO_NOT_TRACK=1` / `npx hyperframes telemetry disable`; Node 22+ |
| heygen-com/hyperframes-community-skills | ba7a0bb (2026-09-24) | 8 | Apache-2.0 | camera-3d-captions, vox-explainer, p5-paint-animation useful |
| remotion-dev/skills | 7e541aa (2026-11-11) | 13 (router + refs) | no LICENSE file in repo | version tag 4.0.543 (we pin 4.0.534) |
| browser-use/video-use | 43cfc56 (2026-10-08) | 2 (video-use, manim-video) | MIT | needs ELEVENLABS_API_KEY for Scribe transcription; helpers transcribe/pack/timeline_view/render/grade; no telemetry found |
| elevenlabs/skills | 1d84076 (2026-11-13) | 13 | MIT | needs ELEVENLABS_API_KEY; tts, sfx, music, stt, voice-isolator, voice-changer, dubbing, agents… |
| heygen-com/skills | 1bd5e4d (2026-07-14) | 3 (+1 platform) | MIT | HEYGEN_API_KEY; analytics opt-out `HEYGEN_NO_ANALYTICS` |
| greensock/gsap-skills | aed9cfd (2026-04-21) | 8 | MIT | official; previously discarded for UI (we use Motion there) |
| kajisho5/ffmpeg-skill | 4bad4f6 (2026-11-14) | 1 (42 tools + MCP) | MIT | PRIVACY.md: no telemetry, local only |
| amalshehu/pexels-skill | 536078a (2026-07-19) | 1 (29 lines) | none | photos only, not video |
No credible public skill found for object tracking, person segmentation or OCR in video (searched 2026-11-14).
