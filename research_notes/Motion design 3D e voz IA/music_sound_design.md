# Music and sound design for short-form vertical promo videos (Reels/TikTok ads for the "Rotina" app) — research notes, October 2026

Scope reminder: ~60 s vertical promos built with Claude Code + Remotion, pt-BR TTS voiceover, currently an original 120 BPM numpy-synthesized track mixed with ffmpeg (sidechaincompress ducking + loudnorm −14 LUFS). Goal: professional music + SFX legally usable in Meta paid ads, plus concrete mix settings and an ffmpeg/Remotion sync workflow.

Status: work in progress — this file is updated incrementally. Many vendor prices below come from third-party price trackers (flagged); always confirm on the live vendor page before buying.

---

## 1. Royalty-free music libraries for commercial social ads (pricing, paid ads on Meta, Content ID, attribution)

### Takeaway
For paid Meta ads you need a tier that explicitly says "paid ads / digital advertising / commercial": entry "creator/social/personal" tiers of Artlist, Soundstripe, Musicbed, Uppbeat (and probably Epidemic Creator) do NOT cover ads. Cheapest clearly-covered options found: Artlist Music & SFX Pro (~US$16.58/mo annual), Epidemic Pro (~US$16.99/mo annual), Uppbeat Pro/Business (~US$14–18/mo), Envato Elements (~US$16.50/mo annual, per-project license registration). Free sources (Pixabay, YouTube Audio Library, Incompetech/Bensound/FMA) carry claim/attribution/ad-coverage risk and are a poor fit for paid ads.

### Cited Findings

**Epidemic Sound**
- 2026 list prices per third-party trackers: Creator US$17.99/mo or US$119.88/yr; Pro US$39.99/mo or US$203.88/yr (≈US$9.99 and US$16.99/mo on annual billing); Enterprise custom. Tracker last verified 31 Jul 2026; official Epidemic pages fetched did not show prices — [Recurdash](https://recurdash.com/subscription-pricing/epidemic-sound); [Epidemic "our plans"](https://www.epidemicsound.com/our-plans/); [Pro plan page](https://epidemicsound.com/our-plans/pro-plan)
- Pro targets freelancers/businesses doing commercial work; excludes cinema, TV shows and TV ads; Creator covers 1 monetized channel per platform, Pro 3; companies over US$10M revenue (publishers over US$5M) are routed to Enterprise — [Epidemic Pro plan](https://epidemicsound.com/our-plans/pro-plan); [Epidemic commercial subscription](https://www.epidemicsound.com/our-plans/commercial-subscription)
- Whether Creator covers digital ads is CONFLICTING across trackers; Pro covers paid ads under either reading → buy Pro for ads (search-summary of trackers; verify in writing) — [Recurdash](https://recurdash.com/subscription-pricing/epidemic-sound); [Photutorial](https://photutorial.com/epidemic-sound-pricing)
- Epidemic's own Facebook page says digital advertising needs a commercial license separate from Meta's free audio, and that Meta Rights Manager can mute/remove videos whose soundtrack isn't cleared — [Epidemic: music for Facebook](https://www.epidemicsound.com/facebook/music-for-facebook/)
- Epidemic vs Meta litigation still unresolved: Epidemic sued Meta in 2022 (US$142M claim, alleging Meta refused a licence); a newer suit (~1,000 works) was dismissed without prejudice on 10 Jul 2026 with leave to amend by 14 Aug 2026 — i.e., Meta does NOT appear to license Epidemic's catalog in its in-app library — [MBW 2022](https://www.musicbusinessworldwide.com/epidemic-sound-hits-meta-with-142m-lawsuit-for-rampant-infringement-of-its-music-on-facebook-and-instagram); [Digital Music News, 13 Jul 2026](https://www.digitalmusicnews.com/2026/07/13/epidemic-sound-v-meta-lawsuit/); [DMN Apr 2026 summary judgment](https://www.digitalmusicnews.com/2026/04/06/epidemic-sound-meta-lawsuit-summary-judgment/)

**Artlist**
- Plans (annual billing, official pricing page as summarized): Music & SFX Social ≈US$9.99/mo (US$14.99 monthly) — 1 channel per platform, NO commercial/client work, NO paid ads; Music & SFX Pro from ≈US$16.58/mo — Pro license covers paid ads; Footage & Templates US$29.99/mo; Artlist Max US$39.99/mo (3 channels/platform, client work, TV, paid ads); Teams from US$28.20/mo (up to 8 seats, paid ads + client work) — [Artlist pricing](https://artlist.io/page/pricing); [Artlist Teams blog](https://artlist.io/blog/artlist-teams/); [Artlist Personal/Social plan launch](https://artlist.io/blog/artlist-personal-plan/)
- Price conflict: a July 2026 tracker lists Music & SFX Pro at US$24.92/mo and US$16.58 for a separate "Music Pro" tier — [Recurdash Artlist](https://recurdash.com/subscription-pricing/artlist)
- Pro tiers scoped to companies up to 50 people; larger → Business — [Artlist pricing](https://artlist.io/page/pricing)
- License text ties publishing to the active subscription term, while the Teams blog says projects using songs downloaded with a paid subscription stay covered "forever" — read the full license for long-running campaigns — [Artlist license](https://artlist.io/help-center/privacy-terms/artlist-license); [Artlist Teams blog](https://artlist.io/blog/artlist-teams/)
- Third-party (Sep 2026): Social only fits organic posts on your own channel; any paid ad / promoted post needs Pro — [DaVinci Resolve 21 blog comparison](https://davinciresolve21.com/blog/artlist-social-vs-pro-for-sponsored-videos)

**Uppbeat**
- Free tier: 3 downloads/month, ~25% of catalog (help center says ~30%), license for individuals; free users must paste an Uppbeat credit in the YouTube description (credit = claim clearance) — [Uppbeat pricing](https://uppbeat.io/pricing); [Uppbeat help center: Premium & Business](https://fastly-f.uppbeat.io/help-center/premium-and-business)
- Paid tiers (monthly): Essentials US$6.99, Creator US$9.99, Pro US$17.99; annual ≈US$5.59–13.99/mo; safelist 1/3/10 YouTube channels. Pricing page says only the top tier ("Extended license: organizations of any scale, digital ads, client content") covers ads; help center calls it "Business — required for companies >5 employees or paid advertising/client work" — [Uppbeat vs Epidemic (Uppbeat blog)](https://uppbeat.io/blog/royalty-free-and-copyright-free-music/uppbeat-vs-epidemic-sound-how-do-they-compare); [Uppbeat vs Artlist (Uppbeat blog)](https://uppbeat.io/blog/royalty-free-and-copyright-free-music/uppbeat-vs-artlist-how-do-they-compare); [Uppbeat pricing](https://uppbeat.io/pricing)
- License terms changed: "legacy" terms apply to paid subscriptions started before 2 Sep 2026; legacy terms define Paid Advertising as "material ... with paid distribution and with the sole function of promoting a product or service" — [Uppbeat legacy license](https://uppbeat.io/uppbeat-legacy-license)

**Soundstripe**
- Prices per a review site (checked 5 Sep 2026): Personal US$19.99/mo (US$9.99/mo annual), Pro US$39.99 (US$19.99 annual), Pro Plus US$69.99 (US$33.99 annual), Business custom — [FrontDeskReview Soundstripe](https://frontdeskreview.com/software/music-licensing/soundstripe/)
- Soundstripe's own FAQ: individual plans are for content that doesn't promote a brand/product/service; advertising, paid posts and boosted posts fall outside → Business plan for companies — [Soundstripe pricing FAQ](https://www.soundstripe.com/knowledge/plans-coverage/pricing-faq)

**Musicbed**
- Individual ≈US$29.99/mo or US$329.89/yr; Business ≈US$99.99/mo (Sep 2026 comparison; Musicbed's own pricing page returned empty); alternative figures US$179/yr personal, US$599/yr business on an affiliate page — CONFLICTING — [FrontDeskReview Musicbed](https://frontdeskreview.com/software/music-licensing/musicbed/); [BityClips](https://bityclips.com/tool/musicbed/pricing)
- Personal tier excludes advertising; per-song commercial licenses ≈US$49–499 per project — [LicenseOrg Musicbed guide](https://licenseorg.com/guide/music-audio/musicbed)

**Envato Elements (music + SFX)**
- ≈US$16.50/mo billed annually (directory listing), ≈US$33 month-to-month (reseller) — verify — [Postmake](https://postmake.io/tools/elements)
- Each download = one commercial license tied to ONE project (register per project); license text revised Dec 2025; finished works made during subscription stay licensed after cancellation; broadcast use of music items is disputed — [Envato Elements License Terms](https://help.elements.envato.com/hc/en-us/articles/360000628966-License-Terms); [Full License Wording](https://help.elements.envato.com/hc/en-us/articles/360000629206-Full-License-Wording)

**Motion Array**
- Everything plan US$24.99/mo annual or US$39.99/mo monthly (ex VAT); teams US$27/member/mo; agencies and companies >50 staff → Business; help center lists "paid ads" as a coverage option to ADD to a Business license → individual-plan coverage of paid ads unclear; after cancellation, downloaded assets can't be used in new work — [Motion Array blog: plans](https://blog.motionarray.com/learn/motion-array/motion-array-plans/); [Motion Array help: plans](https://help.motionarray.com/hc/en-us/articles/22284184989341-Motion-Array-Plans)

**Pixabay Music (free)**
- Free license reportedly allows commercial video use, but "free" ≠ Content ID clearance; claims can appear later when a third party enrolls a track; Pixabay is not wired into Content ID so it can't vouch for a track — [Thematic vs Pixabay](https://hellothematic.com/thematic-vs-pixabay/); [Foximusic royalty-free list](https://www.foximusic.com/blog/best-royalty-free-music-sites-for-creators-2/) (both are vendor/competitor pages)

**YouTube Audio Library (free)**
- Each track is labeled either "YouTube Audio Library License" (no credit) or "Creative Commons Attribution 4.0" (credit required); YouTube's help center mainly addresses use inside YouTube videos; off-platform/ad use of standard-license tracks is not clearly granted — [YouTube Help: Audio Library](https://support.google.com/youtube/answer/3376882); [Creator Essentials glossary](https://www.creatoressentials.com/glossary/youtube-audio-library/); [Lickd guide](https://lickd.co/youtube-audio-library/)

**Incompetech, Bensound, Free Music Archive (free/attribution)**
- Incompetech (Kevin MacLeod): most tracks CC-BY (credit the composer); paid option to waive attribution exists — secondary sources only — [Itechguides](https://www.itechguides.com/?p=356055); [MakeTechEasier](https://maketecheasier.com/?p=260284)
- Bensound: free tier = attribution required and (per one guide) does NOT cover ads/paid promotion; paid license removes credit; reportedly a "NoDerivs" clause (no remixing beyond trimming) — sources conflict — [LicenseOrg Bensound guide](https://licenseorg.com/guide/music-audio/bensound); [G2 Bensound discussion](https://www.g2.com/products/bensound/discuss)
- Free Music Archive: license set per track by each artist (CC-BY, CC-BY-NC, etc.); any NC track is off-limits for ads — [TechYorker](https://techyorker.com/?p=440129)

### Inferences
- For Rotina (small Brazilian company, paid Meta ads): cheapest clean options are Artlist Music & SFX Pro, Epidemic Pro, or Uppbeat's top tier; Envato Elements is attractive because it also bundles SFX/templates but requires per-project registration (each ad variant may count as a project — confirm).
- Get written confirmation of: paid/boosted ads coverage on Meta, post-cancellation status of already-published ads, and whether whitelisting/Content-ID safelisting applies to Instagram (most safelisting is YouTube-only).
- Keep a license log (track ID, download date, plan, license PDF) per ad.

### Gaps
- Official current prices for Epidemic and Musicbed not visible on vendor pages (trackers only).
- Free Music Archive, Incompetech, Bensound: not yet researched (see PENDENTE).

---

## 2. AI music generation (Oct 2026): quality, control, API, commercial terms, legal situation

### Takeaway
(Section in progress.) Legal landscape changed sharply: Suno settled with Warner (Nov 2025) and launched "licensed" v6 models on 9 Sep 2026 (with WMG, BMG, Believe) but UMG and Sony are still suing; Udio settled with UMG/Warner and turned into a walled garden (downloads disabled since Oct 2025). For ad use, the lowest-risk AI options are those with clear commercial terms and API access: ElevenLabs Eleven Music (paid plans, music_v2 API), Google Lyria 3/3.5 (Gemini API ~US$0.04–0.08/track, SynthID watermark), Stable Audio 2.5 (API ~US$0.20/generation; "commercially safe" licensed training data). Open weights: ACE-Step 1.5 (MIT per HF model card) is usable commercially; MusicGen weights are CC-BY-NC (non-commercial).

### Cited Findings

**Suno**
- WMG settled with Suno on 25 Nov 2025 and partnered on licensed models; Suno also acquired Songkick from WMG — [Rolling Stone](https://www.rollingstone.com/music/music-features/suno-warner-music-group-AI-music-settlement-lawsuit-1235472868/); [Music Week](https://www.musicweek.com/public_html/index.php/labels/read/warner-music-group-settles-lawsuit-and-signs-ai-licensing-deal-with-suno/093129)
- Suno v6 launched 9 Sep 2026 "in partnership with WMG, BMG and Believe": three models (v6, v6-wild, v6-mini); free tier gets v6-mini only; older models phased out; partners receive revenue share from launch; watermarking/fingerprinting pledged; UMG and Sony catalogs excluded — [MBW: Suno v6 launch](https://musicbusinessworldwide.com/suno-v6-ai-music-models-launch-in-partnership-with-wmg-bmg-and-believe); [The Rundown](https://www.therundown.ai/news/suno-v6-music-partners-paid-fan-remixes); [ProPakistani 10 Sep 2026](https://propakistani.pk/2026/09/10/suno-launches-licensed-ai-music-models-after-warner-copyright-settlement/)
- UMG and Sony litigation continues (Boston, filed June 2024); reported new filing in Sept 2026 listing ~60k recordings and calling v6 "fruit of the same poisoned tree" (reported via secondary coverage; verify) — [AI Weekly](https://aiweekly.co/alerts/suno-launches-v6-with-warner-music-bmg-and-believe-partnerships-begins-paying); [MBW on settlement terms dispute](https://www.musicbusinessworldwide.com/suno-fights-to-keep-warner-music-settlement-terms-away-from-umg-and-sony/)
- No public Suno developer API: in July 2026 Suno's CPO said it is "exploring a developer API" with an invite-only intake form; no docs/pricing/launch date; third-party "Suno APIs" are unofficial wrappers (ToS risk) — [Digital Music News, 3 Jul 2026](https://www.digitalmusicnews.com/2026/07/03/suno-is-opening-an-api-partner-program/); [MBW](https://musicbusinessworldwide.com/suno-explores-developer-api-seeking-apps-that-unlock-experiences-generative-music-makes-possible-for-the-first-time)
- Commercial terms (secondary sources, Suno ToS not fetched): free plan = personal/non-commercial only; paid Pro/Premier = commercial use; songs made while paid remain usable after cancellation; upgrading does not retroactively license free-plan songs; reported monthly download caps (≈20 Pro / 60 Premier — unverified) — [Aireiter: Suno v6 commercial use](https://aireiter.com/pt/blog/suno-v6-commercial-use-copyright); [Costbench Suno](https://costbench.com/software/ai-music-generators/suno/); [Dubspot 2026 licensing explainer](https://blog.dubspot.com/ai-music-licensing-explained-2026)

**Udio**
- UMG settled with Udio (Oct 2025) and announced a licensed platform for 2026; WMG followed (19 Nov 2025); Kobalt licensed in Apr 2026 — [Digital Music News: UMG–Udio](https://www.digitalmusicnews.com/2025/10/29/umg-udio-deal-everything-we-know/); [WMG press release PDF](https://s206.q4cdn.com/940328283/files/doc_news/WARNER-MUSIC-GROUP-AND-UDIO-COLLABORATE-TO-BUILD-A-NEW-LICENSED-MUSIC-CREATION-SERVICE-2025.pdf); [MBW: Kobalt deal](https://www.musicbusinessworldwide.com/after-universal-warner-and-merlin-deals-now-udio-inks-licensing-agreement-with-kobalt)
- Downloads disabled ~30 Oct 2025 (brief 48-hour export window in Nov 2025); a vendor comparison dated Sep 2026 still lists downloads as off → Udio is NOT usable for exporting ad music as of this research — [PPC Land](https://ppc.land/udio-settles-copyright-lawsuit-partners-with-universal-music-group/); [OrcaRouter Suno v6 vs Udio](https://www.orcarouter.ai/blog/suno-v6-vs-udio)

**ElevenLabs (Eleven Music + Sound Effects)**
- Eleven Music API marketed for broad commercial use, rights vary by plan; API example uses model `music_v2`; film/TV/game rights on enterprise; stems listed as a feature — [Eleven Music API page](https://elevenlabs.io/hi/eleven-music-api); [Music v2 section-level editing (May 2026)](https://mer.vin/2026/05/elevenlabs-music-v2-genre-switching-ai-songs-with-section-level-editing/)
- Free plan has no commercial license; all paid plans include a commercial license (except Beta services); content generated during a paid subscription can be used commercially indefinitely; free-plan content requires attribution ("elevenlabs.io"/"11.ai" in title; "Eleven Music" for music) — [ElevenLabs help: Can I publish the content I generate?](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform)
- Music model-specific terms (for enrollments on/after 21 Nov 2025): free-tier credit "Created in collaboration with ElevenLabs"; Music plans have a separate commercial-rights table (not retrieved) — [Eleven Music model-specific terms](https://elevenlabs.io/eleven-music-model-specific-terms); [Archived v1 terms](https://elevenlabs.io/archived-eleven-music-v1-terms)
- Prices conflict across third-party trackers (Starter US$5 vs US$6 etc.); commercial rights start at Starter — [BigVU 2026 pricing](https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/); [Happyrobot](https://www.happyrobot.ai/hub/elevenlabs-pricing)
- Official Eleven Music capabilities page (Oct 2026): duration 3 s – 5 min; newest model `music_v2_5` (API `model_id="music_v2_5"`), Music v2 still available, v1 in transition (v1 still API default during transition); vocals or instrumental-only; v2 adds section-by-section composition, mid-track genre transitions, section inpainting; output MP3 44.1 kHz 128–192 kbps or WAV; Audio Reference (≤~30 s upload, copyright-screened, paid plans); custom Music Finetunes on your own non-copyrighted tracks (~5–10 min training); Music API for paid subscribers; "licensed for nearly all commercial uses, including film, TV, podcasts, social media, advertising, and gaming" (plan details in music terms) — [ElevenLabs docs: Music](https://elevenlabs.io/docs/capabilities/music)

**Stable Audio 2.5 (Stability AI)**
- Launched Sep 2025 as "first audio model built for enterprise sound production", positioned as commercially safe (trained on licensed data), generates up to ~3 min tracks, audio inpainting — [Stability AI announcement](https://stability.ai/news/stability-ai-introduces-stable-audio-25-the-first-audio-model-built-for-enterprise-sound-production-at-scale)
- API: text-to-audio and audio-to-audio = 20 credits per generation (≈US$0.20 at US$0.01/credit), effective 1 Aug 2025 price table — [Stability API pricing update](https://stability.ai/api-pricing-update-25)
- Stability ToS assigns output rights to the user (subject to compliance); a ToS revision effective 30 Sep 2026 reportedly bars using outputs to train competing models — [Stability ToS](https://stability.ai/terms-of-service); [ConductAtlas change record](https://conductatlas.com/change/2026-09-01-stability-ai-stability-ai-terms-of-service-4757/)
- Web app: commercial projects require Pro tier (~US$11.99/mo per tracker, June 2026) — [Stable Audio FAQ](https://stableaudio.com/faqs); [Costbench Stable Audio](https://costbench.com/software/ai-music-generators/stable-audio/)

**Google Lyria (3 / 3.5 / RealTime)**
- Lyria 3.5 reached the Gemini app and Gemini API on 4 Sep 2026; Gemini API pricing ≈US$0.08 per full song (Lyria 3.5 or Lyria 3 Pro Preview) and US$0.04 per 30 s clip (Lyria 3 Clip Preview); charged per output, not per second; Lyria 3.5 durations ~60 s–3 min — [Let's Data Science](https://letsdatascience.com/news/google-expands-lyria-35-to-gemini-2a9364bc); [InVideo: Lyria explained (Aug 2026)](https://invideo.io/blog/lyria-ai-music-generator/); [AICybr Lyria 3.5 dev guide](https://aicybr.com/blog/google-lyria-3-5-gemini-api-guide)
- Vertex AI Lyria: instrumental music from text prompts; SynthID watermark on every output; artist-name/copyrighted-lyrics prompts refused — [Vertex AI Lyria docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/music/overview)
- Lyria RealTime (official docs): model `models/lyria-realtime-exp` (experimental), streamed over a WebSocket session; weighted text prompts changeable mid-stream; config: `bpm` 60–200, `density` 0–1, `brightness` 0–1, `scale` enum (default SCALE_UNSPECIFIED), `guidance` 0–6 (default 4.0), `temperature` 0–3 (default 1.1), `top_k` 1–1000 (default 40), `seed`, `mute_bass`, `mute_drums`, `only_bass_and_drums` (default False), `music_generation_mode` QUALITY|DIVERSITY|VOCALIZATION; changing `bpm`/`scale` requires `reset_context()` (abrupt); output raw 16-bit PCM 48 kHz stereo; instrumental only; watermarked — useful to generate stems-like variants (drums-only, no-bass) at an exact BPM — [Gemini API: Lyria RealTime](https://ai.google.dev/gemini-api/docs/realtime-music-generation)
- Gemini API music docs (official): `lyria-3-clip-preview` always returns a 30 s MP3 clip (loops/previews); `lyria-3.5` full songs of ~a couple of minutes, length steerable via prompt ("duration" or timestamps), MP3 default or WAV via `response_format`; both 44.1 kHz stereo via the Interactions API; Lyria 3.5 accepts text + up to 10 images; instrumental via prompt ("Instrumental only, no vocals"); custom lyrics with `[Verse]`/`[Chorus]` tags; single-turn (no iterative edit); outputs non-deterministic; SynthID watermark on all audio; page does not address commercial licensing — [Gemini API: music generation](https://ai.google.dev/gemini-api/docs/music-generation)
- Gemini API terms: Google doesn't claim ownership of outputs, may generate similar content for others; IP indemnity reportedly available on Vertex AI but not on Gemini API (unverified) — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)

**Open-weight models**
- ACE-Step 1.5 (released ~28 Jan 2026): HF model card tags MIT license and states generated music can be used commercially; training data described as licensed + royalty-free/public-domain + synthetic MIDI audio; runs on consumer GPUs (AMD blog) — [HF model card](https://huggingface.co/ACE-Step/acestep-v15-base/blob/main/README.md); [AMD blog](https://www.amd.com/en/blogs/2026/commercial-grade-ai-music-generation-on-amd-ryzen-ai-and-radeon-ace-step-1-5.html); [ComfyUI wiki](https://comfyui-wiki.com/en/models/ace-step/ace-step-v1-5) (lists Apache-2.0 — CONFLICT)
- Meta MusicGen/AudioCraft: code MIT, pretrained weights CC-BY-NC 4.0 → no commercial use without separate agreement — [HF MusicGen discussion](https://huggingface.co/spaces/facebook/MusicGen/discussions/8); [InfoQ](https://www.infoq.com/news/2023/08/meta-text-to-music-generative-ai/)

**Template/"functional music" generators**
- Soundraw Creator ≈US$16.99/mo (ads covered per one listing; free tier no downloads); Beatoven Creator ≈US$10/mo or US$100/yr (30 download-minutes); Mubert Creator/Pro/Business US$14/39/199/mo, Render standard licenses prohibit Content ID registration; AIVA Standard €15/mo (€11 annual), Pro €49 (€33 annual) — only Pro transfers copyright and allows commercial projects beyond YouTube/Twitch/TikTok/Instagram monetization — [Costbench AIVA vs Soundraw](https://www.costbench.com/compare/aiva-vs-soundraw/); [Costbench Beatoven](https://costbench.com/software/ai-music-apis/beatoven-ai/); [Jack Righteous: Mubert review](https://jackrighteous.com/es/blogs/music-creation-process-guide/mubert-ai-review-licensing-limits-and-best-uses-for-creators); [Mubert Render subscription agreement](https://mubert.com/render/docs/subscription-agreement); [Costbench AIVA](https://costbench.com/software/ai-music-generators/aiva/)

### Inferences
- (To be completed after remaining searches.)

### Gaps
- (To be completed.)

---

## 3. Sound effects for motion graphics (libraries, AI SFX, which SFX, layering/timing)

### Takeaway
(Section in progress.) Cleanest no-credit SFX sources for ads: SFX bundled in a paid music plan (Artlist Music & SFX Pro, Epidemic, Envato, Motion Array, Uppbeat), ZapSplat Gold, Freesound filtered to CC0, ElevenLabs SFX on a paid plan. Avoid Freesound CC-BY-NC and free ZapSplat without credit.

### Cited Findings
- ZapSplat: two licenses — Standard (free, attribution required) and Gold (paid, no attribution; ≈US$4–5/mo per guides, conflicting); downloads made while Gold stay credit-free after cancelling; no redistribution as standalone SFX; WAV may be Gold-only (contested) — [LicenseOrg ZapSplat guide](https://licenseorg.com/guide/music-audio/zapsplat); [FilmDaft SFX libraries](https://filmdaft.com/royalty-free-sound-effects-online/)
- Freesound: license set per sound (CC0, CC-BY, CC-BY-NC); filter to CC0 to avoid attribution; CC-BY-NC not usable commercially — [Cinevva free SFX guide 2026](https://app.cinevva.com/guides/free-sound-effects-music); [Soundly FAQ on Freesound](https://getsoundly.com/faq/how-can-i-use-the-freesound-library)
- Soundsnap: paid, royalty-free for commercial use, no resale of raw sounds; pricing sources dated/conflicting (historic US$9–149 packs, US$249/yr; deal US$149.99/yr) — [Mix Online](https://www.mixonline.com/the-wire/soundsnap-adds-new-library-professional-sound-effects-media-and-entertainment-production-413604); [OMR Soundsnap pricing](https://omr.com/en/reviews/product/soundsnap/pricing)
- Pixabay Content License summary (applies to music and SFX): free, no attribution required, modification allowed; prohibited: standalone redistribution/sale, use in trademarks/logos, misleading/illegal use; "It is your responsibility to check whether you require the consent of a third party" — summary says nothing about ads or Content ID — [Pixabay license summary](https://pixabay.com/service/license-summary/)
- Whoosh craft: a whoosh should follow the motion's speed, mass, direction, distance and stopping point; for a title/product slamming into place use a whoosh leading INTO an impact (movement and landing are separate jobs); light swoosh for small fast gestures; transition sound when the scene change (not an object) is the event — [Sonilo whoosh guide](https://sonilo.com/ai-music/whoosh-sound-effect-guide)
- Layering: add a low thump under a whoosh for body; "bigger means lower and slower"; vary speed/level across repeats so they don't sound identical — [Krotos: how to create whooshes](https://www.krotosaudio.com/?p=1006981); [Designing Sound: whoosh review](https://designingsound.org/2014/02/25/whoosh-review/)
- Fast whooshes typically have an aggressive attack and last < 0.5 s; whooshes are built from sounds with a fast, smooth frequency change (wind, air, swishes, flangers) — [SmartSound: whooshes and fly-bys](https://cloud.smartsound.com/blog/whooshes-and-flybys/); [Designing Sound](https://designingsound.org/2014/02/25/whoosh-review/)
- Transition sound providers: build/peak planned around the cut; "air pass" whooshes can slide either side of the edit, "rush into a hit" must peak where the hit lands; rising swell when the audience needs several seconds of warning; slide audio to the exact frame — [Morphic transition SFX](https://morphic.com/zh/resources/sounds/transition-sound-effects)
- Motion-design rule of thumb: 2 frames is the minimum duration for something to register; anticipation/action/follow-through ~1/3 each; "mismatched audio" listed as an anti-pattern (Claude skill file, not a primary authority) — [motion-designer skill](https://skills.sh/ncklrs/startup-os-skills/motion-designer)
- ElevenLabs Sound Effects API: parameters `duration_seconds` (0.5–30 s; null = auto), `prompt_influence` (0–1, default 0.3), `loop` (v2 model only); MP3 default, 48 kHz WAV for non-looping — [ElevenLabs SFX skill file (community copy)](https://skills.sh/connorads/dotfiles/sound-effects); [fal.ai ElevenLabs SFX v2](https://fal.ai/models/fal-ai/elevenlabs/sound-effects/v2/api); [Classmethod test](https://dev.classmethod.jp/articles/elevenlabs-sound-effects-web-ui-trial/)
- ElevenLabs SFX licensing: paid plans need no attribution and can be used commercially; free plan requires attribution to elevenlabs.io; "do not sell or license our tools" — [ElevenLabs commercial SFX page](https://elevenlabs.io/sound-effects/commercial)
- Web app billing reported at 40 credits per second when duration is set explicitly (Japanese test) — [Classmethod](https://dev.classmethod.jp/articles/elevenlabs-sound-effects-web-ui-trial/)

### Inferences
### Gaps

---

## 4. Mixing for short-form (loudness, levels, ducking, EQ, voice chain, ffmpeg)

### Takeaway
(Section in progress.) Neither Meta nor TikTok publishes an official loudness spec; the de-facto target used across tools is −14 LUFS integrated, ≤ −1 dBTP true peak.

### Cited Findings
- Common target −14 LUFS integrated, −1 dBTP; some sources suggest −14 to −16 LUFS; one outlier says −10 to −12; none traces to official Meta/TikTok documentation — [OpenClip: normalization targets](https://openclip.app/learn/audio-normalization); [VloggingPro loudness tool](https://vloggingpro.com/tools/audio-loudness/); [Opus Clip](https://opus.pro/blog/best-loudness-normalizers); [video-use project constants](https://instagit.com/browser-use/video-use/social-media-loudness-normalization-targets/)
- ffmpeg `loudnorm`: I (−70…−5, default −24), LRA (1…50, default 7), TP (−9…0, default −2), measured_I/LRA/TP/thresh + offset for 2nd pass, `linear=true` default (falls back to dynamic if conditions not met), `print_format=json` — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- ffmpeg `sidechaincompress`: threshold default 0.125 (range 0.00097563–1, linear), ratio 2 (1–20), attack 20 ms (0.01–2000), release 250 ms (0.01–9000), makeup 1 (1–64), knee 2.82843, link average|maximum, detection rms|peak, level_sc, mix — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- ffmpeg `acompressor`: same parameter set (threshold 0.125, ratio 2, attack 20 ms, release 250 ms, makeup, knee, detection rms) — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- ffmpeg `alimiter`: limit default 1 (linear), attack 5 ms, release 50 ms, `level` auto-leveling enabled by default (disable with level=disabled) — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- ffmpeg `deesser`: i (intensity 0–1, default 0), m (max ducking 0–1, default 0.5), f (frequency 0–1, default 0.5), s (output mode i/o/e) — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- ffmpeg `amix`: inputs 2, duration longest|shortest|first, dropout_transition 2 s, weights, normalize enabled by default (use normalize=0 to keep levels) — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- Other relevant filters: `highpass` (default f=3000, poles 2 — always set f), `equalizer` (f, t, w, g), `treble/highshelf` (default 3000 Hz), `dialoguenhance`, `speechnorm`, `stereotools`, `afade`, `acrossfade`, `adelay` (ms; suffix S for samples) — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- ffmpeg doc's own ducking example: `[1:a]asplit=2[sc][mix];[0:a][sc]sidechaincompress[compr];[compr][mix]amerge` (input 0 = music, input 1 = voice key) — [ffmpeg filters doc](https://ffmpeg.org/ffmpeg-filters.html)
- AES streaming loudness guidance (secondary sources): AES TD1004.1.15-10 (2015) recommends −16 to −20 LUFS with max −1 dBTP; Telos summarizes TD1008 as −16 LUFS for music, −18 LUFS for speech, −17 LUFS as compromise for mixed content; EBU R128 distribution practice suggests −3 dBTP max because lossy codecs overshoot — [Telos Alliance: loudness for streaming](https://docs.telosalliance.com/docs/understanding-loudness-for-streaming-audio); [Production Advice on TD1008](https://productionadvice.co.uk/td1008/); [Production Expert: AES update](https://www.production-expert.com/production-expert-1/aes-update-loudness-recommendations-for-audio-only-streaming)
- Ducking starting points (vendor docs): threshold ≈ −30 dBFS, ratio 4:1, max dip −20 dB default (−6 to −12 dB = gentle), attack 1–10 ms (instant) vs 30–80 ms (soft), release 200 ms default, 250–700 ms suggested, 500–1500 ms to stay down across pauses (less pumping) — [Vindral sidechain ducking docs](https://composer-docs.vindral.com/operators/operators-sidechain-ducking.html); [CapCut ducking guide](https://www.capcut.com/create/audio-ducking-for-clear-dialogue-in-video)
- Voice EQ starting points (tutorial-level sources): high-pass 80–100 Hz (raise to ~125–150 Hz only for boomy close-miked voices — higher thins the voice); small cut ~700 Hz for nasality; clarity boost 1.5–2.5 kHz (presence 1–3 kHz) plus gentle air lift; sibilance sits 2–10 kHz depending on speaker; de-ess ~3–4 dB; chain order: corrective EQ → de-ess → compression (often 2 stages) — [Sage Audio: better voice-over](https://www.sageaudio.com/articles/how-to-make-voice-over-sound-better); [Music Radio Creative: Audacity VO settings](https://producer.musicradiocreative.com/audacity-settings-for-voice-over/); [DVInfo forum](https://www.dvinfo.net/forum/all-things-audio/529841-audio-eq.html)
- Phone-speaker translation: phones lose most content below ~500 Hz and above ~6 kHz (another source: phone-friendly band 800 Hz–4 kHz; 1–4 kHz is reproduced by every device); add harmonics/saturation to the bass (≈100 Hz–1.5 kHz harmonic region, band-limited or parallel) so the bassline is heard via overtones; keep bass mono below ~100–120 Hz (stereo-widened bass cancels in mono); optional 1–2 dB dip at 3–5 kHz against harshness on cheap speakers — [WA Production: mix translation 2026](https://blog.waproduction.com/mix-translation-in-2026-make-your-track-hit-on-phone-speakers-cars-and-clubs); [SoundGirls: Lost in translation](https://soundgirls.org/lost-in-translation/); [Production Expert: small speakers](https://www.production-expert.com/production-expert-1/2018/6/11/8-tips-for-great-sounding-mixes-on-small-speakers)
- Auphonic: credit-based; free 2 h/month; yearly-billed tiers S 9 h US$11, M 21 h US$24, L 45 h US$49, XL 100 h US$99 per month; multitrack (with ducking/leveling) limited to <20 min on free/monthly tiers; loudness targets (LUFS + true peak) on all tiers; REST API + CLI — [Auphonic pricing](https://auphonic.com/pricing); [Tooliverse review](https://tooliverse.ai/tools/auphonic)

### Inferences
### Gaps

---

## 5. Editing music to picture (BPM for 30 fps, bar-accurate cuts, hit points, Remotion APIs, beat detection)

### Takeaway
(Section in progress.)

### Cited Findings
- Remotion: `<Html5Audio>` (previously called `<Audio>`) from `remotion`; Remotion now recommends `<Audio>` from `@remotion/media` for new projects. Props: `volume` (number; callback `(frame)=>number` still supported but no longer recommended — use `useCurrentFrame()` + `interpolate()`), values capped 0–1 unless `useWebAudioApi`; `trimBefore`/`trimAfter` (renamed from `startFrom`/`endAt` in v4.0.319), `durationInFrames` (v4.0.530), `playbackRate`, `loop`, `loopVolumeCurveBehavior` ("repeat"|"extend"), `muted`, `toneFrequency` (0.01–2, render-time only), `audioStreamIndex`, `name`, `showInTimeline` — [Remotion: Html5Audio](https://www.remotion.dev/docs/html5-audio)
- Remotion audio visualization: `@remotion/media-utils` → `useAudioData(src)`, `getAudioData()`, `visualizeAudio({fps, frame, audioData, numberOfSamples})` returns a per-frame spectrum (first bins = low frequencies), `visualizeAudioWaveform()`, `useWindowedAudioData()` (WAV only; for large files) — [Remotion: audio visualization](https://www.remotion.dev/docs/audio/visualization)
- librosa `beat.beat_track`: dynamic-programming beat tracker (onset strength → tempo estimate → peaks consistent with tempo); can take a known `bpm`; returns beats in frames/samples/seconds via `units=` — [librosa docs](https://librosa.org/doc/main/generated/librosa.beat.beat_track.html)
- Essentia `RhythmExtractor2013` (method "multifeature"): returns BPM, beat positions and confidence; uses whole-track statistics (offline only) — [Essentia beat detection tutorial](https://essentia.upf.edu/tutorial_rhythm_beatdetection.html)
- Open-source script exporting librosa/Essentia beats as timestamps or EDL markers for Resolve/Premiere/FCP — [GitHub emjjkk/beat-detection](https://github.com/emjjkk/beat-detection)

### Inferences
- Frame math at 30 fps: frames per beat = 1800 / BPM. Integer values: 90 BPM = 20 f, 100 = 18 f, 112.5 = 16 f, 120 = 15 f, 128.57 = 14 f, 150 = 12 f, 180 = 10 f. 128 BPM = 14.0625 f/beat (drifts 1 frame every 16 beats). At 120 BPM 4/4: beat 15 f, bar 60 f = 2 s; 60 s = 30 bars = 1800 frames (own calculation).

### Gaps

---

## 6. Brazil / Instagram context (trending styles; trending copyrighted audio in paid ads; Meta Sound Collection)

### Takeaway
(Section in progress.) Instagram's in-app licensed music library is for personal/non-commercial use and is restricted for many business accounts; it is not a license for ads. Meta Sound Collection (royalty-free, 14,000+ tracks per Meta help text) is the platform-provided alternative, cleared only for Facebook/Instagram.

### Cited Findings
- Meta's help center frames the licensed in-app catalog as personal, non-commercial; some business profiles/post types lose access; Sound Collection (14k+ royalty-free tracks) is offered as alternative for Reels/Stories — [Instagram Help](https://help.instagram.com/ipad-app/402084904469945); [Soundstripe: Instagram music library](https://www.soundstripe.com/blogs/instagram-music-library)
- Sound Collection clearance applies only to content on Meta platforms (not YouTube/TikTok) — [Epidemic: music for Facebook](https://www.epidemicsound.com/facebook/music-for-facebook/); [Soundstripe](https://www.soundstripe.com/blogs/instagram-music-library)
- Secondary guides describe Sound Collection as ~14,000 royalty-free tracks pre-cleared for commercial use on Facebook/Instagram including ads (non-exclusive, royalty-free), but NOT usable separately from Meta products, and not guaranteed for every ad format/territory/in perpetuity or for edits/remixes; Meta's own license text not retrieved — [Soundstripe: music for Instagram ads](https://www.soundstripe.com/blogs/royalty-free-music-for-instagram-ads); [Third Chair: Sound Collection for licensing teams](https://usethirdchair.com/blog/meta-sound-collection-explained-for-music-licensing-teams); [Deutsche Handwerks Zeitung](https://www.deutsche-handwerks-zeitung.de/?p=273624)
- In Ads Manager the ad-level "Add music" option draws on royalty-free Sound Collection tracks or Advantage+ Creative auto-selection (third-party descriptions; verify in account) — [Foximusic: Music for ads on Instagram 2026](https://www.foximusic.com/blog/?p=587); [Cantech Letter](https://www.cantechletter.com/2025/01/how-to-add-music-to-a-meta-ad-campaign-explained)
- Seeing a track in the in-app picker grants no right to use it in an ad or paid partnership; boosting a post changes its legal context; ads with uncleared music can be muted/blocked — [Sirency: Instagram music for business accounts](https://www.sirency.com/blog/instagram-music-business-account); [Third Chair: Meta Sound Collection explained](https://usethirdchair.com/blog/meta-sound-collection-explained-for-brands-and-rights-holders)
- Brazilian phonk momentum: #brazilianphonk grew 62% in Europe (Feb–May 2026 vs Oct 2025–Jan 2026), #brazilianfunk +34%; used in choreographies, memes, edits, sports scenes (mostly TikTok data) — [Billboard Brasil 2026](https://billboard.com.br/brazilian-phonk-crescimento-global-tiktok-funk/)
- "Brazilian phonk" = phonk (US origin, distorted/futuristic, popular on TikTok since 2022) blended with funk mandelão (heavy, repetitive, electronic); largely created by foreign producers — [Billboard Brasil explainer](https://billboard.com.br/brazilian-phonk-conheca-a-variacao-gringa-do-funk-que-e-viral-no-tik-tok/)
- Workout context: >1 million user playlists in 2025 with "treino" or "academia" in the title (+42% YoY) per Spotify-based report; funk framed as a driver of workout culture — [O Hoje, Dec 2025](https://ohoje.com/2025/12/22/treino-playlists/)
- Funk in advertising: academic study links growing use of funk in TV ads to funk culture's growth and consumer acceptance; GR6 exec says brands focus on funk and trap because of audience — [Unisinos repository](https://repositorio.jesuita.org.br/handle/UNISINOS/11006?show=full); [Propmark](https://propmark.com.br/?p=1945)

### Inferences
### Gaps

---

## PENDENTE / NÃO PESQUISADO
(Updated at the end of the research.)
