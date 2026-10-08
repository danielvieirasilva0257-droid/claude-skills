# High-quality pt-BR TTS for ~60 s promo Reels ("Rotina" app, Claude Code + Remotion) — research notes as of 2026-10-08

> STATUS: PARTIAL. The coordinator stopped this research early (about 14 tool calls). Everything below has a source link. Items marked **[UNVERIFIED]** come from search-engine summaries, third-party aggregators or vendor marketing, not from a primary page I read. Items marked **[INFERENCE]** are my own reasoning. Anything not researched at all is listed in the final section "PENDENTE / NÃO PESQUISADO".
>
> Current setup being replaced: edge-tts (Microsoft Edge "Read Aloud") voice `pt-BR-AntonioNeural`, rate +6%, generated line by line, with captions timed by estimating word positions from character offsets.

---

## Q1. Which systems sound most natural in Brazilian Portuguese today? (quality evidence)

### Takeaway
No pt-BR-specific blind test or leaderboard turned up. The only large blind-preference board, the Artificial Analysis Speech Arena, uses English prompts and offers only US/UK accent filters. As of early October 2026 its top models are ElevenLabs **Eleven v4 / v4 Turbo** (released 2026-09-28), Alibaba **Qwen-Audio-3.1-TTS-Plus**, **Cartesia Sonic 3.6** and **Google Gemini 3.8 Flash TTS**. The "Azure Neural" family, which is what the user's current edge-tts voice belongs to, sits far below them. Of the top models, only ElevenLabs v4 explicitly lists "Portuguese, Brazil". Before buying, pt-BR quality has to be checked with a listening test on the real script.

### Cited Findings
**Artificial Analysis Speech Arena (blind pairwise votes, Elo).** The page shows no "as of" date. Its newest model release dates are from September 2026, and I fetched it on 2026-10-08. [AA leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard)

| Elo | Model (provider) | Listed price per 1M chars | Open weights |
|---|---|---|---|
| 1332 | Eleven v4 Turbo (ElevenLabs) | $40 | no |
| 1324 | Eleven v4 (ElevenLabs) | $80 | no |
| 1295 | Qwen-Audio-3.1-TTS-Plus (Alibaba) | $19.3 | no |
| 1279 | Sonic 3.6 (Cartesia) | $49 | no |
| 1276 | Gemini 3.8 Flash TTS (Google) | $16.5 | no |
| 1252 | Realtime TTS-2 (Inworld) | $20.8 | no |
| 1243 | Gemini 3.8 Flash-Lite TTS (Google) | $11 | no |
| 1241 | Simba 3.2 (Speechify) | $6.6 | no |
| 1219 | Breeze TTS 2 (BreezeBlue) | $34 | yes (non-commercial, see Q2) |
| 1210 | Gemini 3.1 Flash TTS (Google) | $18.3 | no |
| 1205 | v3 Conversational (ElevenLabs) | $50 | no |
| 1174 | Eleven v3 (ElevenLabs) | $100 | no |
| 1173 | Speech 2.8 HD (MiniMax) | $100 | no |
| 1154 | Falcon 2 (Murf AI) | $10 | no |
| 1140 | Fish Audio S2.1 Pro | $15 | no |
| 1131 | Azure HD 2.5 (Microsoft) | $22 | no |
| 1117 | Fish Audio S2 Pro | $15 | yes |
| 1103 | TTS-1 HD (OpenAI) | $30 | no |
| 1101 | Chatterbox HD (Resemble AI) | $40 | no |
| 1097 | Multilingual v2 / Turbo v2.5 (ElevenLabs) | $100 / $50 | no |
| 1083 | Voxtral TTS (Mistral) | $16 | yes |
| 1079 | Flash v2.5 (ElevenLabs) | $50 | no |
| 1078 | GPT-Realtime-2 (OpenAI) | $191.6 | no |
| 1066 | Magpie-Multilingual 357M (NVIDIA) | n/a | yes |
| 1065 | Polly Generative (Amazon) | $30 | no |
| 1064 | Kokoro 82M v1.0 | $0.7 | yes |
| 1056 | Chirp 3: HD (Google) | $30 | no |
| 1051 | Octave 2 (Hume AI) | $87.5 | no |
| 1037 | Higgs Audio V3 (Boson AI) | $15 | yes |
| **1035** | **Azure Neural (Microsoft)** | $15 | no |
| 1025 | Chatterbox (Resemble AI) | $25 | yes |
| 1000 | Zonos-v0.1 (Zyphra) | $20 | yes |
| 958 | VibeVoice 1.5B (Microsoft) | n/a | yes |
| 943 / 932 | Qwen3 TTS Flash / Qwen3 TTS (Alibaba) | $11 / $13.8 | no (API rows) |
| 916 | XTTS v2 (Coqui) | $40.4 | yes |
| 895 | StyleTTS 2 | $2.8 | yes |
| 894 | Polly Neural / Google Neural2 | $16 | no |

- The board's only filters are Accent (All, US, UK) and Category. It has no language filter and no multilingual board. — [AA leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard)
- A September 2026 roundup read the same board on 2026-09-25: Sonic 3.6 was first at 1279 ± 17, ahead of Gemini 3.8 Flash TTS at 1265 and Qwen-Audio-3.0-TTS-Plus at 1259. After the v4 launch, Eleven v4 entered first at 1319 ± 19 (update dated Sept 28). In a separate "Voice Arena" (US English, prompts from real production calls), Gemini 3.8 Flash-Lite TTS was first. The roundup left out the Hugging Face TTS Arena as "out of date". It gives vendor language counts (Gemini 3.8 Flash TTS 130, Flash-Lite 101, Fish Audio 83) but does not test Portuguese. — [DigitalApplied, Sept 24–28 2026](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced)
- The top of the board has changed several times in 2026. Speechify Simba 3.2 and Qwen-Audio-3.0 both held first place during July. **[UNVERIFIED, news/vendor]** — [Qatar Tribune on Simba 3.2](https://www.qatar-tribune.com/article/244541/business/speechifys-simba-32-reaches-number-one-on-global-ai-voice-leaderboard); [CryptoBriefing on Qwen-Audio](https://cryptobriefing.com/alibaba-qwen-audio-tts-speech-arena/)
- **ElevenLabs Eleven v4** (`eleven_v4`) supports 90+ languages, "including Portuguese, Brazil (`por`)", with up to 10,000 characters per request. `eleven_v4_turbo` has about 100 ms median inference latency. Eleven v3 is now labelled "previous generation" (70+ languages, Portuguese listed without a variant, 5,000-character limit). Multilingual v2 lists "Portuguese (Brazil, Portugal)" and is described as "most stable on long-form generations" and better at normalizing numbers than Flash v2.5. Turbo v2.5 is deprecated in favour of Flash v2.5. — [ElevenLabs models docs](https://elevenlabs.io/docs/overview/models)
- ElevenLabs marketing says v4 Turbo speaks "Japanese, Spanish, and Portuguese with a native accent" (vendor claim). Launch coverage dates v4 to 2026-09-28. — [ElevenLabs v4 page](https://elevenlabs.io/v4); [TestingCatalog](https://testingcatalog.com/elevenlabs-launches-eleven-v4-and-v4-turbo-voice-models); [DataNorth](https://datanorth.ai/news/elevenlabs-releases-eleven-v4-and-eleven-v4-turbo)
- **Google Gemini 3.8 Flash TTS** (`gemini-3.8-flash-tts`, last updated September 2026) covers "over 130 languages" with automatic detection. Portuguese is a **single "Portuguese" entry with no pt-BR locale**. — [Gemini 3.8 Flash TTS model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts). An earlier Gemini 3.1 Flash TTS listing reportedly separated pt-BR from pt-PT. **[UNVERIFIED, search summary]**
- **Google Chirp 3 HD** supports pt-BR at GA, with 30 voices; the docs page was updated 2026-10-07. — [Chirp 3 HD docs](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)
- **Azure**: the fine-tuned "DragonHD" voice list has **no pt-BR voice** (only de, en-US, es-ES, fr, ja, zh). pt-BR is reachable through **Dragon HD Omni**, which covers 700+ voices including "all released voices", is multilingual, and uses names like `de-DE-Conrad:DragonHDOmniLatestNeural`. — [Azure HD voices docs (updated 2026-09-24)](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/high-definition-voices)
- **Amazon Polly Generative** has exactly one pt-BR voice, **Camila (female)**. — [Polly generative voices](https://docs.aws.amazon.com/polly/latest/dg/generative-voices.html)
- **OpenAI**: I found no successor to `gpt-4o-mini-tts`. A dated snapshot `gpt-4o-mini-tts-2025-12-15` is listed by aggregators. The GPT-Realtime-2 family (May 2026) targets voice agents. OpenAI voices are said to be "tuned mainly for English". **[UNVERIFIED, third party]** — [Bifrost listing](https://www.getmaxim.ai/bifrost/llm-cost-calculator/provider/openai/model/gpt-4o-mini-tts-2025-12-15.md); [TNW on GPT-Realtime-2](https://thenextweb.com/news/openai-gpt-realtime-2-voice-models); [SignalWire OpenAI TTS guide](https://signalwire.com/docs/platform/voice/tts/openai)
- **Cartesia**: Sonic-3 covers 42 languages including `pt` (Cartesia docs, via search). Sonic 3.6 is described as 44 languages / 61 locales with locale-tuned date and number pronunciation **[UNVERIFIED, third-party summary of the launch post]**. Cartesia has a Latin America marketing page. — [Cartesia TTS models](https://docs.cartesia.ai/build-with-cartesia/tts-models/latest); [Plushcap summary of Sonic 3.6 post](https://www.plushcap.com/content/cartesia/blog/cartesia-introducing-sonic-36); [Cartesia LatAm](https://cartesia.ai/regions/latin-america)
- **Brazilian community and blog opinions** (not independent tests): ElevenLabs is named most often as the best for PT-BR (an accountant-focused blog calls it "o melhor TTS do mercado em PT-BR"). Others recommend Hume Octave for emotion control and Murf for ease of use. — [Roberto Dias Duarte](https://www.robertodiasduarte.com.br/ferramentas-de-ia-para-contadores/elevenlabs/); [SimilarLabs PT](https://similarlabs.com/pt/blog/best-ai-voice-generators-2026); [NarrationBox](https://narrationbox.com/blog/top-ai-voices-for-portuguese-content-in-2025)
- **Known pt-BR pitfalls named by a vendor**: the final "L" in "Brasil" and the palatalized "t" in "tia". These are useful test words. — [AnySpeech PT (vendor page)](https://anyspeech.io/pt/portuguese-text-to-speech)

### Inferences
- **[INFERENCE]** edge-tts serves the same neural voices Azure sells; a Hugging Face discussion says the same voices are sold through Azure ([HF thread](https://huggingface.co/spaces/innoai/Edge-TTS-Text-to-Speech/discussions/22)). If so, `pt-BR-AntonioNeural` belongs to the "Azure Neural" row (Elo 1035). Eleven v4 at 1324 is about 290 Elo higher, which under the Elo formula means it would win about 84% of English pairwise votes. Gemini 3.8 Flash (1276) would win about 80%. That suggests a large perceptual upgrade, but it is not proven for pt-BR.
- **[INFERENCE]** Realistic pt-BR shortlist to A/B test with one Rotina script:
  1. ElevenLabs v4, plus Multilingual v2 as a stable fallback
  2. Gemini 3.8 Flash TTS
  3. Cartesia Sonic 3.6
  4. Azure Dragon HD Omni pt-BR voices (the cheapest upgrade from the current voice)
  5. Optionally Qwen-Audio-3.1, Inworld TTS-2 and Speechify Simba 3.2, whose pt-BR support is unverified
- **[INFERENCE]** Models that list plain "Portuguese" without a locale (Gemini 3.8, Eleven v3, Fish) risk drifting toward a European Portuguese accent. Pick a voice that is natively Brazilian (from a voice library, or a Brazilian reference clip) and test "Brasil", "tia", "app", "PIX" and "deload".

### Gaps
- No pt-BR MOS score, pt-BR blind arena, or independent pt-BR comparison was found. I did not check Reddit or Brazilian YouTube.
- The Hugging Face TTS Arena's current state was not checked (DigitalApplied calls it outdated).
- pt-BR support was not verified for Qwen-Audio-3.x, Inworld TTS-2, Speechify Simba, MiniMax 2.8, Hume Octave 2, Murf Falcon 2, Resemble, PlayHT, LOVO, Fish S2.1 or Mistral Voxtral.
- No Brazil-specific TTS vendor was found. The only hit, NeoSpeech's "Rafael/Helena" voices, appears old. — [The Brasilians](https://new.thebrasilians.com/?p=32436)

---

## Q2. Pricing, free tiers and commercial-use rights (incl. edge-tts terms and open-source licenses)

### Takeaway
- **ElevenLabs Starter** (about $6/mo, or $5/mo billed annually) is the cheapest commercially licensed plan. The Free plan does not allow commercial use.
- **API per-minute costs are tiny at this volume.** Gemini 3.8 Flash is about $0.0135/min until 2026-12-31. OpenAI gpt-4o-mini-tts is about $0.015/min. Eleven v4 API is about $0.06–0.08/min at list price.
- **Using edge-tts for paid ads is legally grey.** Microsoft staff said commercial use of its services without an Azure subscription "could be a violation". Azure Speech is the compliant route.
- **Several top open-weight models are non-commercial**: Fish S2 Pro, Voxtral, Breeze TTS 2, F5-TTS (and its pt-BR fine-tune) and XTTS-v2. Commercially usable ones include Kokoro (Apache-2.0), Chatterbox (MIT) and Qwen3-TTS (Apache-2.0).

### Cited Findings
**ElevenLabs plans** (pricing page fetched 2026-10-08) — [elevenlabs.io/pricing](https://elevenlabs.io/pricing)

| Plan | Price | Credits/mo | ~TTS minutes | Commercial license | Notes |
|---|---|---|---|---|---|
| Free | $0 | 10k | ~10 | not listed | 128 kbps |
| Starter | $6/mo (page also showed a "first month $1" promo until Oct 18) | 30k | ~30 | yes | 10 IVC slots, 128 kbps |
| Creator | $22/mo (first month $11) | 121k | ~121 | yes | 30 IVC, 1 PVC, 192 kbps |
| Pro | $99 | 600k | ~600 | yes | 44.1 kHz PCM via API |
| Scale | $299 | 1.8M | — | yes | — |
| Business | $990 | 6M | — | yes | — |

- Annual billing is "pay 10 months for 12" (Starter $5/mo, Creator $18.33/mo, Pro $82.50/mo). Extra minutes cost about $0.17–0.20. Promotions on the page: v4 2x credits for two weeks on Creator+, and a 3x-credits banner until Oct 12. — [elevenlabs.io/pricing](https://elevenlabs.io/pricing)
- Credit costs: 1 credit per character on Multilingual v2; 0.5–1 credit per character on Flash/Turbo v2.5. The page does not state the v3/v4 credit rate. — [elevenlabs.io/pricing](https://elevenlabs.io/pricing)
- Free-plan output "can't be used to earn money, and publishers have to attribute ElevenLabs". **[UNVERIFIED, secondary blog; ElevenLabs terms page not read]** — [BIGVU 2026](https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/)
- Older figures still circulate (Starter $5, Creator 100k credits, Business $1,320). One tracker claimed a price increase in April 2026, but newer guides contradict it. — [Fora Soft, May 2026](https://www.forasoft.com/learn/ai-for-video-engineering/articles-ai/elevenlabs-pricing-voice-cloning-no-fakes-act); [Costbench](https://costbench.com/changelog/elevenlabs-price-increase-2026-04/)
- Eleven v4 "is available on the free tier" (but Free has no commercial rights). — [ElevenLabs v4 page](https://elevenlabs.io/v4)
- ElevenLabs API list prices: v4 $0.08 per 1K chars (launch price $0.022 until 2026-10-12); v4 Turbo $0.04 per 1K ($0.011 at launch); v3 $0.10 per 1K; v3 Conversational $0.05 per 1K. — [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced)
- ElevenLabs output-format gating: 192 kbps MP3 needs Creator or above; 44.1 kHz PCM/WAV needs Pro or above. — [ElevenLabs with-timestamps API ref](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)

**Other vendors**

| Vendor / model | Price | Source |
|---|---|---|
| Google Gemini 3.8 Flash TTS | $0.50/M text tokens in + $9.00/M audio tokens out until 2026-12-31 (~$0.0135/min); doubles to $1.00/$18.00 from 2027-01-01. Free tier via AI Studio. **[UNVERIFIED on Google's own page]** | [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced); [eesel](https://www.eesel.ai/blog/gemini-3-8-flash-tts); [eesel PT](https://www.eesel.ai/pt/blog/precos-gemini-3-8-flash-tts) |
| Google Gemini 3.8 Flash-Lite TTS | $0.50 / $6.00 per M tokens | [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced) |
| Google Chirp 3 HD | $30 per 1M chars | [AA](https://artificialanalysis.ai/text-to-speech/leaderboard) |
| Azure Neural | $15 per 1M chars | [AA](https://artificialanalysis.ai/text-to-speech/leaderboard) |
| Azure HD 2.5 | $22 per 1M chars | [AA](https://artificialanalysis.ai/text-to-speech/leaderboard) |
| Microsoft MAI-Voice-2 | "starts at $22 USD per 1M characters" | [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced) |
| Amazon Polly | Generative $30, Long-Form $100, Neural $16 per 1M chars | [AA](https://artificialanalysis.ai/text-to-speech/leaderboard) |
| OpenAI gpt-4o-mini-tts | $0.60/M text in + $12/M audio out (~$0.015/min). Some aggregators show different input prices. **[conflicting]** | [OpenAI community](https://community.openai.com/t/understanding-gpt-4o-mini-tts-pricing-input-characters-cost/1151816); [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced) |
| Cartesia | Pro $5 / 100K credits; AA lists $49 per 1M | [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced) |
| Inworld Realtime TTS-2 / Flash | $25 / $15 per M chars | DigitalApplied |
| Fish Audio S2.1 Pro | $15 per 1M UTF-8 bytes | DigitalApplied |
| MiniMax Speech 2.8 HD / Turbo | $100 / $60 per M | DigitalApplied |
| Hume Octave 2 | overage $0.15 falling to $0.05 per 1K | DigitalApplied |
| Mistral Voxtral TTS | $0.016 per 1K | DigitalApplied |
| Speechify Simba 3.2 | $6.6 per 1M | [AA](https://artificialanalysis.ai/text-to-speech/leaderboard) |
| Murf Falcon 2 | $10 per 1M | [AA](https://artificialanalysis.ai/text-to-speech/leaderboard) |

The Google Cloud TTS pricing page fetch came back truncated: [Google Cloud TTS pricing](https://cloud.google.com/text-to-speech/pricing).

**edge-tts / Microsoft terms**
- **Microsoft Q&A, accepted answer by Microsoft External Staff (Oct 2024).** The GPL-3.0 license covers the edge-tts code. However, "if these repositories rely on Microsoft's proprietary services, such as Azure Cognitive Services' Text-to-Speech, commercial use without a valid Azure subscription could be a violation of our terms of service." The answer recommends Azure AI Speech, explicitly disclaims legal advice, and does not cite a specific clause. — [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)
- **edge-tts README.** It lets you "Use Microsoft Edge's online text-to-speech service ... WITHOUT needing Microsoft Edge or Windows or an API key." Custom SSML was removed "because Microsoft prevents the use of any SSML". The repo includes a GPL-3.0 license file. The README says nothing about terms of use. — [rany2/edge-tts](https://github.com/rany2/edge-tts)
- **Community reports [secondary].** The endpoint is the Read Aloud WebSocket. Heavy use triggers 403s. Microsoft restricted access from China after misuse that included commercial dubbing resale. A browser-port README calls it "free for personal use" and points commercial users to Azure. — [WikiDocs (KO)](https://wikidocs.net/blog/@jaehong/9554/); [pyVideoTrans](https://en.pyvideotrans.com/edgetts-api); [edge-tts-browser README](https://cdn.jsdelivr.net/npm/edge-tts-browser@1.0.1/README.md)

**Open-weight licenses**

| Model | License / commercial status | Source |
|---|---|---|
| Kokoro-82M | Apache-2.0 | [HF Kokoro VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) |
| Chatterbox (all variants) | MIT | [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox) |
| Qwen3-TTS (0.6B/1.7B) | Apache-2.0 **[secondary sources]** | [NYU Shanghai RITS](https://rits.shanghai.nyu.edu/ai/%F0%9F%93%A2-qwen3%E2%80%91tts-open%E2%80%91source-text%E2%80%91to%E2%80%91speech-tts-family/); [tts.ai](https://tts.ai/voices/qwen3-tts/); [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced) |
| Fish Audio S2 Pro | "Fish Audio Research License": free for research and non-commercial use; commercial use requires a paid license (business@fish.audio). Fish's German S2 page calls it "fully open source", which conflicts. S2.1 Pro weights are not released (API only). | [HF fishaudio/s2-pro](https://huggingface.co/fishaudio/s2-pro); [Soniqo guide](https://soniqo.audio/guides/fish-audio); [fish.audio/s2](https://fish.audio/s2/); [ExplainX](https://explainx.ai/blog/fish-audio-52m-seed-s2-1-pro-july-2026) |
| Mistral Voxtral 4B TTS | CC BY-NC 4.0 (non-commercial) | [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced) |
| Breeze TTS 2 | research / non-commercial | DigitalApplied |
| Microsoft VibeVoice 1.5B | MIT on HF, but AA marks it non-commercial (**conflicting**) | DigitalApplied |
| NVIDIA Magpie-Multilingual 357M | "Other", commercial use yes | DigitalApplied |
| Orpheus 3B, Sesame CSM-1B | Apache-2.0 | DigitalApplied |
| F5-TTS-pt-br (firstpixel) | CC-BY-NC-4.0 (non-commercial), inherited from the original F5-TTS license | [HF firstpixel/F5-TTS-pt-br](https://huggingface.co/firstpixel/F5-TTS-pt-br) |
| XTTS-v2 | Coqui Public Model License (non-commercial) | [acidente/fala_pb_checkpoints](https://huggingface.co/acidente/fala_pb_checkpoints) |

- Every Chatterbox output carries an inaudible "Perth" neural watermark. — [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)

### Inferences
- **[INFERENCE] Characters per Reel.** A 60 s pt-BR read is roughly 750–1,000 characters (DigitalApplied normalises with 750–1,000 chars/min).
- **[INFERENCE] Cost per Reel.** About 1,000 credits on ElevenLabs Multilingual v2, so Starter (30k) covers about 30 full takes a month and Creator (121k) about 121. With 3–5 takes per line while directing, **Creator** is the practical plan; it also unlocks 192 kbps and Professional Voice Cloning. At API list prices one Reel costs about $0.08 on v4, $0.014 on Gemini 3.8 Flash, $0.015–0.022 on Azure, and $0.04–0.05 on Cartesia.
- **[INFERENCE] Compliant drop-in.** Moving from edge-tts to the paid Azure Speech service with the same AntonioNeural voice, or a Dragon HD Omni pt-BR voice, removes the terms-of-service ambiguity at almost no cost.
- **[INFERENCE] What to avoid for ads.** For commercial ads, skip F5-TTS-pt-br, XTTS-v2, Fish S2 Pro, Voxtral and Breeze unless a commercial license is bought.

### Gaps
- ElevenLabs Terms of Service (free-tier attribution wording, ownership of output) were not read.
- The v4 credit multiplier on subscription plans is unknown.
- Azure free tier (F0) quota and current Azure HD pricing for pt-BR were not verified.
- Google's official pricing page (fetch truncated) and Gemini API terms for commercial use of free-tier output were not checked.
- OpenAI's official pricing page was not fetched.
- The specific Microsoft Services Agreement clause that would cover the Edge Read Aloud endpoint was not identified.

---

## Q3. Expressiveness controls and pronunciation (energetic "ad" read)

### Takeaway
- **ElevenLabs v4** offers the richest directable controls: inline audio tags ([excited], [whispers], [long pause]...), voice-setting sliders, and IPA pronunciation dictionaries. SSML `<break>` is disabled on v4.
- **Gemini 3.8** accepts natural-language style prompts plus a few inline vocal-event tags.
- **Azure HD styles apply only to English content**, so Azure cannot be "directed" into an excited ad read in pt-BR.
- **edge-tts** only allows rate, pitch and volume.

### Cited Findings
- **ElevenLabs v4.** Audio tags go in square brackets, e.g. [warm], [long pause], [whispers], [laughs], [excited], [sighs], [nervous laugh]. v4 "follows tag sequences more reliably than v3". Context stitching keeps pacing consistent across long scripts. Pronunciation dictionaries and Voice Design support IPA. "SSML `<break>` tags are disabled, so use inline audio tags instead." — [ElevenLabs v4 page](https://elevenlabs.io/v4)
- **ElevenLabs request controls** (TTS and with-timestamps endpoints):
  - `voice_settings`: `stability` (default 0.5), `similarity_boost` (0.75), `style` (0), `speed` (1), `use_speaker_boost`.
  - `pronunciation_dictionary_locators`: up to 3.
  - `previous_text` / `next_text` and `previous_request_ids` / `next_request_ids`: continuity between separately generated chunks.
  - `seed`: determinism "is not guaranteed".
  - `apply_text_normalization`: auto / on / off.
  — [ElevenLabs API ref](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
- Flash v2.5 does not normalise numbers by default (text normalisation is Enterprise-only), so numbers should be written out before sending. — [ElevenLabs models docs](https://elevenlabs.io/docs/overview/models)
- **Gemini 3.8 Flash TTS.** Delivery style goes in `speech_metadata.style`. Inline tags include `<laugh>`, `<sigh>`, `<cough>`, `<breath>`, `<short pause>`. Multi-speaker is supported. Input is treated as a verbatim transcript, so stage directions like "Speaker 1:" get read aloud and belong in metadata instead. — [Gemini 3.8 Flash TTS page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts)
- **Chirp 3 HD.** Supports an SSML subset for synchronous requests (Preview; not available when streaming), markup pauses `[pause short]` / `[pause long]` / `[pause]` (the model "might occasionally disregard" them), pace 0.25–2.0, and IPA / X-SAMPA custom pronunciations. — [Chirp 3 HD docs](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)
- **Azure HD.**
  - Styles (excited, confident, encouraging, urgent...) work via `mstts:express-as` or `[excited]` tags, but "Styles are available on all English content". Paralinguistics (laughter, breathing...) work "on all voices with all languages" on Dragon HD Omni.
  - Dragon HD Omni does **not** support `<prosody>`, `<emphasis>`, `<break>`, `<bookmark>` or `<phoneme>`. `<lexicon>` is alias-only.
  - Tuning parameters: `temperature`, `top_p`, `top_k`, and `cfg_scale` (a higher `cfg_scale` gives faster speech). `enhancePronunciation=true` improves acronyms and proper nouns.
  — [Azure HD voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/high-definition-voices)
- **edge-tts** exposes only `--rate`, `--volume`, `--pitch`; custom SSML is blocked by Microsoft. — [rany2/edge-tts](https://github.com/rany2/edge-tts)
- **Polly Generative** supports only a subset of SSML and has no Newscaster style. — [Polly generative voices](https://docs.aws.amazon.com/polly/latest/dg/generative-voices.html)
- **Chatterbox** has `exaggeration` and `cfg_weight` (both default 0.5). For expressive speech, use cfg_weight ≈ 0.3 and exaggeration ≈ 0.7+ ("Higher exaggeration tends to speed up speech"). Paralinguistic tags [laugh] / [cough] / [chuckle] are native only to the English Turbo and Nano models. — [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)

### Inferences
- **[INFERENCE] Getting an energetic, persuasive pt-BR read.** Pick an energetic Brazilian voice from the ElevenLabs library and add `[excited]` / `[confident]`-style tags plus a moderate `style` setting. Alternatively, give Gemini 3.8 a prompt such as "locutor brasileiro de comercial, animado e persuasivo, ritmo rápido".
- **[INFERENCE] Loanwords.** "app", "PIX" and "deload" should go in a pronunciation dictionary (ElevenLabs IPA or alias, Chirp IPA) or be respelled phonetically in the script, then checked by ear.

### Gaps
- OpenAI `instructions` (tone prompting) for gpt-4o-mini-tts was not verified this session.
- Cartesia emotion and speed controls were not checked.
- No evidence was found on how well ElevenLabs or Gemini tags work in pt-BR.

---

## Q4. Word-level timestamps and forced alignment (kinetic captions in Remotion)

### Takeaway
- **ElevenLabs** has a plain-HTTPS endpoint that returns per-character start and end times alongside the audio. This directly replaces the user's character-position estimate.
- **Azure** gives word boundaries (on Dragon HD Omni via the Speech SDK; on non-HD voices via the batch REST API).
- **Cartesia** returns word timestamps over SSE.
- **Gemini, Chirp 3 HD, Polly Generative and (as far as I know) OpenAI** do not return word timings. Their audio needs forced alignment against the known script.

### Cited Findings
- **ElevenLabs with-timestamps endpoint.** `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps` returns `audio_base64` plus `alignment` {`characters`, `character_start_times_seconds`, `character_end_times_seconds`} and `normalized_alignment`. The default model is `eleven_multilingual_v2`. Docs don't name `eleven_v3` or `eleven_v4` as supported; they only say the model must have `can_do_text_to_speech` (check via `GET /v1/models`). — [ElevenLabs API ref](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
- The SDK also has `streamWithTimestamps`. One integration doc says the with-timestamps route is non-streaming only. — [Bifrost docs](https://docs.getbifrost.ai/providers/supported-providers/elevenlabs)
- Third-party hosts advertise word-level timing for Eleven v3. **[UNVERIFIED]** — [fal.ai Eleven v3](https://fal.ai/models/fal-ai/elevenlabs/tts/eleven-v3); [WaveSpeed "Eleven V3 Timing"](https://wavespeed.ai/ru/models/elevenlabs/eleven-v3/timing)
- **ElevenLabs Forced Alignment API** takes an audio file plus its transcript and returns word or character timing. Its language list includes Portuguese (Brazil, Portugal). **[from search snippet of the official page]** — [ElevenLabs Forced Alignment](https://elevenlabs.io/docs/overview/capabilities/forced-alignment)
- **Azure.**
  - Dragon HD Omni fires word boundary events: word `Text`, `AudioOffset` and `TextOffset`, shown with the Speech SDK `synthesis_word_boundary` callback.
  - HD voices are "Real-time only", so no batch synthesis.
  — [Azure HD voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/high-definition-voices)
  - For non-HD voices, the Batch Synthesis REST API with `"wordBoundaryEnabled": true` writes a `[nnnn].word.json` file with `AudioOffset` / `Duration` in ms. **[search summary of MS docs and Q&A]**
  - Reported issues: a missing word.json; duplicated words around `<break/>`; duplicate word-boundary entries listed in Microsoft's known issues.
  - The Long Audio API retires on 31 Mar or 1 Apr 2027 (sources differ).
  — [Batch synthesis properties](https://learn.microsoft.com/en-my/Azure/ai-services/speech-service/batch-synthesis-properties); [MS Q&A word.json](https://learn.microsoft.com/en-us/answers/questions/2118922/(nnnn)-word-json-file-not-found-in-results-wordbou); [Foundry known issues](https://learn.microsoft.com/en-us/azure/foundry/reference/foundry-known-issues); [Long Audio retirement](https://azure.microsoft.com/updates/long-audio-api-will-be-retired-on-31-march-2027-migrate-to-the-new-batch-synthesis-api/)
- **edge-tts** can write SRT subtitles (`--write-subtitles hello.srt`). The README fetch did not cover word-vs-sentence boundary options. — [rany2/edge-tts](https://github.com/rany2/edge-tts)
- **Cartesia.** The SSE endpoint with `add_timestamps=True` emits timestamp events with word, start and end arrays (the official example uses `sonic-3.5`). The WebSocket also offers phoneme timestamps. Every example is in English, so Portuguese timestamps are unconfirmed. — [Cartesia SSE timestamps example](https://docs.cartesia.ai/examples/tts-sse-with-timestamps); [Cartesia WebSocket ref](https://docs.cartesia.ai/api-reference/tts/websocket)
- **Polly Generative**: "Support for generating speech marks is currently not available." — [Polly generative voices](https://docs.aws.amazon.com/polly/latest/dg/generative-voices.html)
- **Gemini 3.8 Flash TTS and Chirp 3 HD** docs do not mention timepoints or word timestamps. — [Gemini 3.8 page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts); [Chirp 3 HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)
- **Open aligner**: `mms-300m-1130` forced aligner, said to cover 1,100+ languages. **[UNVERIFIED comparison-site claim]** — [AI Indigo](https://aiindigo.com/compare/distil-whisper-large-v3-ptbr-vs-mms-300m-1130-forced-aligner)

### Inferences
- **[INFERENCE] Turning ElevenLabs output into word timings.** Split `alignment.characters` on whitespace. Each word starts at its first character's start time and ends at its last character's end time. Convert to ms for Remotion. Use the original-text `alignment`, not `normalized_alignment`, so captions show the script exactly as written.
- **[INFERENCE] If `with-timestamps` rejects `eleven_v4`:** (a) generate on Multilingual v2 with timestamps; (b) generate on v4 and send the audio plus script to ElevenLabs Forced Alignment (same vendor, HTTPS); or (c) run a local aligner.
- **[INFERENCE] Vendors with no timestamps (Gemini, OpenAI, Chirp).** Forced alignment against the known script is more accurate than ASR word timestamps, because the text is known and spelling in captions stays exact.

### Gaps
- None of the Remotion caption tooling was verified this session: `@remotion/captions` (`Caption` type, `createTikTokStyleCaptions`), `@remotion/install-whisper-cpp` (`transcribe`, `toCaptions`), `@remotion/openai-whisper`.
- Local aligners were not verified for pt-BR or for CPU speed: WhisperX (wav2vec2 pt model), stable-ts `align()`, whisper-timestamped, whisper.cpp word timestamps, Montreal Forced Aligner pt-BR model, ctc-forced-aligner (MMS), aeneas.
- Not confirmed: Cartesia pt timestamps, ElevenLabs v3/v4 timestamp support, edge-tts WordBoundary mode.

---

## Q5. Voice cloning (requirements, pt-BR quality, consent/legal)

### Takeaway
- Short-sample cloning is now standard (about 3–10 s for some vendors and models). Professional-grade cloning needs paid tiers.
- Major vendors require verified consent from the voice owner (ElevenLabs) or recorded verbal consent (Google).
- Brazilian legal analysis (LGPD, personality rights, the AI bill) was not completed.

### Cited Findings
- **ElevenLabs.**
  - Instant clones need about "ten seconds of audio" according to the v4 page; v4 docs reportedly suggest 1–2 minutes as typical **[UNVERIFIED, launch coverage summary]**.
  - Professional Voice Clones are paid features (Creator includes 1 PVC; Starter has 10 IVC slots).
  - "Every clone requires verified consent from the voice owner."
  — [ElevenLabs v4 page](https://elevenlabs.io/v4); [elevenlabs.io/pricing](https://elevenlabs.io/pricing); [DataNorth](https://datanorth.ai/news/elevenlabs-releases-eleven-v4-and-eleven-v4-turbo)
- **Google** voice replication requires recorded verbal consent and marks outputs with SynthID and C2PA. The same roundup cites the EU AI Act Art. 50 FAQ (updated 2026-07-24) and the FCC ruling of 2024-02-08 on AI voices. — [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced)
- **Chatterbox** clones from a short reference clip (sample file named `your_10s_ref_clip.wav`). If the reference language differs from the target, output "may inherit the accent of the reference clip's language"; the suggested fix is `cfg_weight=0`. There is a dedicated Brazilian Portuguese 500M fine-tune in the "Single Language Pack". — [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)
- **Qwen3-TTS** Base reportedly clones from about 3 s of audio; another site says it doesn't support reference cloning (**conflicting**, may refer to different variants). — [NYU Shanghai RITS](https://rits.shanghai.nyu.edu/ai/%F0%9F%93%A2-qwen3%E2%80%91tts-open%E2%80%91source-text%E2%80%91to%E2%80%91speech-tts-family/); [tts.ai](https://tts.ai/voices/qwen3-tts/)
- **F5-TTS-pt-br** clones from a reference clip with emotional variation and was trained on about 330 h (including about 3,500 Common Voice speakers), but it is CC-BY-NC. **[third-party directory]** — [PromptLayer](https://www.promptlayer.com/models/f5-tts-pt-br)
- **Brazilian opinion source**: record the voice owner's consent; the blog treats voice as sensitive personal data under the LGPD. This is a blog opinion, not legal analysis. — [Roberto Dias Duarte](https://www.robertodiasduarte.com.br/ferramentas-de-ia-para-contadores/elevenlabs/)

### Inferences
- **[INFERENCE]** For the Rotina app, the safest route is a stock library voice. If the brand wants a unique voice, clone the founder's own voice, or a hired voice actor's with a signed written release covering AI cloning and ad use, and keep the consent record.

### Gaps
- Not verified: LGPD articles on biometric/sensitive data; Civil Code art. 20 (image/voice); Constitution art. 5 (protection of "reprodução da imagem e voz humanas"); the current status of PL 2338/2023 (Brazilian AI bill); ANPD guidance; Meta/Instagram AI-content labelling policy.
- pt-BR clone quality per vendor was not evaluated.

---

## Q6. Feasibility in the environment (4 CPU, no GPU, TLS-intercepting proxy, WebSocket risk)

### Takeaway
- **Commercial APIs are the easiest fit.** ElevenLabs (REST JSON), Gemini (REST), Cartesia (SSE over HTTPS) and the Azure batch REST API are all plain HTTPS. Azure word boundaries for HD voices need the Speech SDK.
- **Local CPU options are limited.** Kokoro (82M) is the most CPU-friendly commercially licensed model but has thin pt-BR support. Chatterbox Nano reaches about 3x realtime on 8 cores but is English-only. Multilingual 500M-class models (Chatterbox Multilingual / pt-BR pack, Qwen3-TTS) have no CPU benchmarks I could find.

### Cited Findings
- **Kokoro** pt-BR voices: `pf_dora` (F), `pm_alex` (M), `pm_santa` (M), with `lang_code='p'` and espeak-ng `pt-br` G2P fallback (so espeak-ng must be installed). No quality grades are given for them. The VOICES page warns that non-English support "may be absent or thin due to weak G2P and/or lack of training data". — [Kokoro VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)
- Kokoro's hosted price is about $0.65–0.7 per 1M chars, the cheapest on the board. — [AA](https://artificialanalysis.ai/text-to-speech/leaderboard)
- **Chatterbox.**
  - Nano (110M, English) "targets on-device and CPU inference" at about 3x realtime on 8 CPU cores.
  - Multilingual V3 is about 500M parameters and covers 23+ languages including Portuguese; dedicated Brazilian Portuguese and Portugal Portuguese 500M packs exist.
  - The code supports a `cpu` device. It was tested on Python 3.11, while the user's environment is Python 3.13, a possible compatibility risk.
  — [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)
- **Community pt-BR fine-tunes**: Chatterbox-TTS-Portuguese (license not seen); "fala_pb" Paraíba-accent checkpoints from a 2026 UFCG dissertation covering F5-TTS, XTTS v2, Qwen3-TTS, Fish Speech and Orpheus (each keeps its base model's license; about 21–37 GB per family). — [HF gorack/Chatterbox-TTS-Portuguese](https://huggingface.co/gorack/Chatterbox-TTS-Portuguese); [HF acidente/fala_pb_checkpoints](https://huggingface.co/acidente/fala_pb_checkpoints)
- **Meta MMS-TTS Portuguese** (`por`, VITS) is generic Portuguese, not specifically pt-BR; its license is likely CC-BY-NC **[UNVERIFIED]**. — [HF BeyondWordsAI/mms-tts-por](https://huggingface.co/BeyondWordsAI/mms-tts-por)
- **Jeff 1.0** dataset: about 1.5 h of scripted pt-BR speech from one male speaker, CC0, released 2025-12-06 by the Open Home Foundation (likely a Piper voice source). — [Mozilla Data Collective](https://prod.datacollective.mozillafoundation.org/datasets/cmiupaf3e01i0mf07qkqxbzzx)
- **Transport per vendor**:
  - edge-tts reuses the WebSocket behind Edge Read Aloud. — [WikiDocs](https://wikidocs.net/blog/@jaehong/9554/)
  - ElevenLabs with-timestamps is a plain JSON POST. — [ElevenLabs API ref](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
  - Cartesia timestamps are available over SSE as well as WebSocket. — [Cartesia SSE example](https://docs.cartesia.ai/examples/tts-sse-with-timestamps)

### Inferences
- **[INFERENCE]** The SSE and REST routes should work through the TLS-intercepting proxy, the same way the user's other HTTPS calls do. The Azure Speech SDK's real-time synthesis, needed for HD Omni word boundaries, may use WebSocket and should be tested. If it is blocked, use Azure REST synthesis plus forced alignment, or non-HD voices through batch synthesis with `wordBoundaryEnabled`.
- **[INFERENCE]** For a 60 s clip, even a model running at 0.3–0.5x realtime on CPU would finish in 2–3 minutes. Speed is less critical than pt-BR quality and license, but none of this was measured.

### Gaps
- No measured CPU real-time factors on 4 cores were found for Kokoro, Piper, Chatterbox Multilingual, Qwen3-TTS or XTTS-v2.
- Piper pt_BR voices (names, licenses, piper1-gpl status) were not researched.
- pt-BR support was not checked for StyleTTS2, Higgs Audio V3, Dia, Zonos, IndexTTS, CosyVoice, MaskGCT, Spark-TTS, Kyutai TTS, NeuTTS, Orpheus multilingual, Sesame CSM, VibeVoice or Magpie-Multilingual.

---

## Q7. Post-processing for a "radio/ad" voice (EQ, compression, de-essing, loudness)

### Takeaway
Not researched before the stop. No sourced findings.

### Cited Findings
- (none)

### Inferences
- (none sourced; see PENDENTE)

### Gaps
- EQ, compression and de-essing settings, ffmpeg filter recipes (`loudnorm`, `acompressor`, `deesser`, `highpass`, `equalizer`) and the Instagram Reels loudness target (commonly said to be about -14 LUFS integrated, -1 dBTP) are all unverified and not sourced.

---

## Q8. Preliminary recommendations and pipeline (synthesis of the above — mostly [INFERENCE])

### Takeaway
- **Best paid: ElevenLabs on the Creator plan.** Use Eleven v4, or Multilingual v2 if v4's pt-BR is unstable or its timestamps aren't supported, with a Brazilian library voice. Generate the whole script in one call to `/with-timestamps` and build word-level captions from the returned character alignment.
- **Cheapest high-quality alternative: Gemini 3.8 Flash TTS**, plus forced alignment.
- **Compliant free/cheap baseline: Azure Speech** (same Antonio voice or a Dragon HD Omni pt-BR voice) in place of edge-tts.
- **Local/open source with commercial rights: Chatterbox Multilingual / Brazilian Portuguese pack (MIT)** or **Kokoro (Apache-2.0)**. Both need listening tests; Kokoro's pt-BR is known to be thin.

### Cited Findings (supporting facts, already sourced above)
- Eleven v4 has the top Elo, explicitly lists Portuguese (Brazil), has audio tags and IPA dictionaries, and is available from $6/mo with commercial rights. — [AA](https://artificialanalysis.ai/text-to-speech/leaderboard); [ElevenLabs models](https://elevenlabs.io/docs/overview/models); [v4 page](https://elevenlabs.io/v4); [pricing](https://elevenlabs.io/pricing)
- The ElevenLabs with-timestamps endpoint returns character start and end times. — [API ref](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
- Gemini 3.8 Flash TTS: Elo 1276 at about $0.0135/min until end-2026, but no timestamp output documented and Portuguese not split by locale. — [AA](https://artificialanalysis.ai/text-to-speech/leaderboard); [Gemini page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts); [DigitalApplied](https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced)
- Microsoft points commercial users to Azure rather than the Edge endpoint. — [MS Q&A](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)

### Inferences — proposed pipeline (to validate)
1. **Script prep.** Write the whole ~60 s narration as one text, with blank lines between scenes. Spell out numbers and respell loanwords, or register them in an ElevenLabs pronunciation dictionary (IPA or alias for "app", "PIX", "deload"). Add sparse audio tags, e.g. `[excited]` on the hook and the CTA.
2. **Generate once.** `POST /v1/text-to-speech/{voice_id}/with-timestamps` with `model_id` set to `eleven_v4`, falling back to `eleven_multilingual_v2`. Use `output_format=mp3_44100_192` (Creator), a fixed `seed`, and tuned `voice_settings`. If scenes must be generated separately, pass `previous_text` / `next_text` or `previous_request_ids` for continuity, instead of today's isolated line-by-line takes.
3. **Words from characters.** Build `[{text, startMs, endMs}]` by grouping `alignment.characters` between spaces, then save as JSON next to the MP3.
4. **Scene timing.** Derive each scene's start and end from the first and last word of each scene. This removes the need for silence-trimming per line; insert pauses with tags or post-edits instead.
5. **Remotion.** Load the JSON and map it to `@remotion/captions` `Caption` objects (shape to verify: `{text, startMs, endMs, timestampMs, confidence}`). Page them with `createTikTokStyleCaptions` (to verify) for kinetic word highlighting.
6. **Fallback alignment** for Gemini, OpenAI or other audio. Use ElevenLabs Forced Alignment (HTTPS) or a local aligner (WhisperX, stable-ts or ctc-forced-aligner; to verify) against the known script.
7. **Mastering.** Light EQ, compression and de-essing, then loudness-normalise. Settings are to verify; see PENDENTE.

### Gaps
- None of the pipeline steps were executed or tested in the user's container.
- The `eleven_v4` + `with-timestamps` combination and pt-BR alignment accuracy are unconfirmed.

---

## PENDENTE / NÃO PESQUISADO

What I did not finish, with concrete next steps:

1. **ElevenLabs v4 × timestamps × pt-BR.** Not confirmed. *Next:* with a Starter key, call `GET /v1/models` and check `eleven_v4` capabilities. POST a pt-BR test sentence ("O app Rotina organiza seu dia: Brasil, tia, PIX, deload.") to `/with-timestamps` with `model_id=eleven_v4`, then inspect the `alignment` arrays and listen for European-Portuguese drift.
2. **ElevenLabs Terms of Service.** Free-plan attribution and no-commercial-use wording, output ownership, and v4 credit cost per character on plans. *Next:* read elevenlabs.io/terms and the help-center article on commercial use and credit multipliers.
3. **Remotion caption tooling** (not researched). *Next:* read remotion.dev/docs/captions, /docs/captions/caption, /docs/captions/create-tiktok-style-captions, /docs/install-whisper-cpp (transcribe with `tokenLevelTimestamps`, `toCaptions`), and /docs/openai-whisper (`openAiWhisperApiToCaptions`). Confirm the `Caption` type fields.
4. **Forced alignment for pt-BR on CPU** (not researched). *Next:* check the WhisperX README (pt default align model, CPU int8), stable-ts `model.align(audio, text, language='pt')`, ctc-forced-aligner (MMS, `--language por`), the MFA `portuguese_brazil_mfa` acoustic model and dictionary, and whisper.cpp `-ml 1` / DTW word timestamps. Measure speed on a 60 s clip with 4 cores.
5. **Azure details.** Not verified: F0 free quota (I believe 0.5M chars/month, unconfirmed), current Neural and HD prices, the full pt-BR voice list (Antonio, Francisca, Thalita/Macerio Multilingual...), whether the `pt-BR-*:DragonHDOmniLatestNeural` naming works, and whether Speech SDK word-boundary events pass the TLS proxy (WebSocket). *Next:* read the Azure language-support page and pricing page, then run a test.
6. **Google.** The official pricing page fetch was truncated. *Next:* confirm Gemini 3.8 Flash TTS and Chirp 3 HD prices and free tiers; whether a pt-BR accent can be forced (language code or prompt); whether any timepoints exist (Cloud TTS v1beta1 `enableTimePointing` with SSML `<mark>`, which may not apply to Chirp 3 HD or Gemini); and Gemini API terms for commercial use of free-tier output.
7. **OpenAI.** *Next:* confirm on platform.openai.com the current TTS models and prices, the `instructions` parameter, the absence of timestamps, and pt-BR quality.
8. **Other commercial vendors** not checked for pt-BR or timestamps: Qwen-Audio-3.1 TTS (Alibaba Model Studio), Inworld Realtime TTS-2 (timestamps), Speechify Simba 3.2, MiniMax Speech 2.8 (`subtitle_enable`), Hume Octave 2 (timestamps), Murf Falcon 2, Fish Audio S2.1 Pro API, Resemble, PlayHT (status), LOVO, xAI Grok TTS, Mistral Voxtral API, and Brazilian providers. *Next:* read each vendor's languages page and API reference.
9. **Open-source models not covered**: Piper pt_BR voices (faber, cadu, jeff, edresson? and their licenses; piper1-gpl), StyleTTS2, Higgs Audio V3, Dia, Zonos, IndexTTS, CosyVoice 3, MaskGCT, Spark-TTS, Kyutai TTS, NeuTTS, Orpheus multilingual, Sesame CSM, VibeVoice, NVIDIA Magpie-Multilingual (language list), Qwen3-TTS (official HF card: languages, 0.6B pt support, CPU feasibility). *Next:* read the HF model cards for language lists and licenses, and test Kokoro `pf_dora` / `pm_alex` plus the Chatterbox pt-BR pack on CPU.
10. **Community pt-BR quality evidence**: Reddit (r/ElevenLabs, r/TextToSpeech, r/LocalLLaMA, r/brdev) and Brazilian YouTube comparisons ("melhor voz IA português brasileiro 2026"). Known issues to look for: European-Portuguese drift and English loanwords.
11. **Brazilian legal framework for voice cloning and AI ads**: LGPD (biometric/sensitive data, consent), Civil Code art. 20, Constitution art. 5 (image and voice), PL 2338/2023 status in the Câmara, ANPD guidance, CONAR guidance on AI in advertising, and Meta's AI-content labelling. *Next:* search official planalto.gov.br / camara.leg.br / gov.br/anpd pages.
12. **Post-processing chain for an ad voice** (not researched). *Next:* source ffmpeg filter docs (`highpass`, `equalizer`, `acompressor`, `deesser`, `aecho` / `afir` for light room, `loudnorm` two-pass) and a credible Reels/Instagram loudness reference. Commonly cited targets are about -14 LUFS integrated and -1 dBTP; this is unverified.
13. **Microsoft terms for the Edge Read Aloud endpoint.** *Next:* read the Microsoft Services Agreement and Edge terms for clauses on automated access and commercial use, and check any edge-tts GitHub issues where the maintainer discusses terms.
