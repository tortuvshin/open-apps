---
name: Voicebox
repoUrl: https://github.com/jamiepine/voicebox
projectType: real-app
category: tools
stack: tauri
summary: A Tauri + FastAPI desktop app that puts the entire voice I/O loop (TTS with cloning,
  dictation, effects, MCP agent voice) on one local machine — open-source alternative to ElevenLabs
  and WisprFlow, with the unusual twist that a single Qwen3 instance powers refinement, dictation
  cleanup, and per-voice personality rewriting.
description: Voicebox is a local-first AI voice studio that bundles seven TTS engines, Whisper STT,
  a Qwen3 LLM for refinement and personality, and a built-in Model Context Protocol server so any
  MCP-aware agent can speak in a cloned voice on a single desktop install.
platforms:
  - macos
  - windows
  - linux
  - desktop
licenses:
  - mit
links:
  github: https://github.com/jamiepine/voicebox
  docs: https://docs.voicebox.sh
  homepage: https://voicebox.sh
  download: https://voicebox.sh/download
  linux_install: https://voicebox.sh/linux-install
tags:
  - tauri
  - rust
  - python
  - fastapi
  - react
  - typescript
  - ai
  - voice
  - tts
  - stt
  - voice-cloning
  - dictation
  - mcp
  - mcp-server
  - desktop-app
  - offline-first
  - self-hosted
  - open-source
  - foss-alternative
  - privacy
  - qwen3
  - whisper
  - kokoro
  - chatterbox
  - luxtts
  - hume
bestFor:
  - Local-first voice cloning with Qwen3-TTS quality without sending audio to ElevenLabs
  - Giving any MCP-aware agent (Claude Code, Cursor, Cline) a voice via a tool call
  - Local dictation with a bundled LLM that runs on-device for refinement
  - Studying how to wrap a Python ML backend inside a Tauri desktop shell
whyListed:
  - The only consumer-facing desktop app that ships the entire voice I/O loop (TTS + cloning +
    dictation + effects + agent voice) on one local machine.
  - Unusually well-engineered Tauri ↔ Python sidecar handshake (parent-PID watchdog + sentinel-file
    fallback) that's reusable beyond this project.
  - Built-in Model Context Protocol server with per-client voice binding is genuinely
    differentiating — no other open-source project exposes local voice I/O as MCP tools.
  - The "one local LLM, multiple roles" pattern (refinement + dictation cleanup + personality
    compose/rewrite) is a substantive prompt-engineering case study for small local models.
  - Maintainer's own PROJECT_STATUS.md is an unusually candid accountability document that openly
    lists 0.5.0 regressions and the 88-PR backlog.
caveats:
  - "0.5.0 shipped with multiple acknowledged regressions: macOS Apple Silicon load crashes,
    30-second capture cutoffs, broken paste, refinement silently translating non-English to
    English."
  - Cross-platform GPU support is genuinely painful — Windows on older GPUs (Pascal/Maxwell) and
    Intel Arc have recurring "GPU Not Available" complaints; Linux has no prebuilt binaries and
    requires build-from-source.
  - Server memory grows unbounded over time on long-running installs (~0.5 GB/day on CUDA); restart
    is the documented workaround.
  - The "23 languages" claim applies to the bundle, not to any single engine — only Chatterbox
    Multilingual actually ships 23; Qwen3-TTS caps at 10 and TADA-1B/Chatterbox Turbo are
    English-only.
  - No authentication on the FastAPI REST surface — the project documents this honestly, but binding
    `--host 0.0.0.0` exposes an open TTS/STT API to the network.
  - The "end-to-end encrypted backup & sync" copy in the UI describes a future product; shipped
    `cloud.py` only stores the bearer key in plaintext SQLite.
  - The `VoiceDesign` ("designed voice") feature is schema-defined but no engine consumes it — a
    designed voice profile returns a dict that no TTS engine accepts.
  - HumeAI TADA is built on Llama 3.2 and inherits the Llama 3.2 Community License's "Built with
    Llama" attribution and 700M MAU clause — anyone shipping TADA-derived audio at scale needs
    Llama's separate grant.
  - Solo-developer project with 646 open issues and 154 open PRs; maintainer responsiveness is thin
    (zero comments on sampled open issues).
  - The `$VOICEBOX` Solana token sparked community controversy about long-term sustainability and
    whether future sync features will become a paywall behind Voicebox Cloud.
relations:
  - type: alternative-to
    to: elevenlabs
    evidence:
      type: self-described
      url: https://github.com/jamiepine/voicebox
      quote: a free and open-source alternative to ElevenLabs and WisprFlow in one app
      checkedAt: 2026-09-22
  - type: alternative-to
    to: wispr-flow
    evidence:
      type: self-described
      url: https://github.com/jamiepine/voicebox
      quote: a free and open-source alternative to ElevenLabs and WisprFlow in one app
      checkedAt: 2026-09-22
seo:
  title: Voicebox – Open Source Local AI Voice Studio
addedAt: 2026-09-01
curation:
  reviewed: true
  reviewedAt: 2026-08-21
  reviewedBy: Open Apps curators
  labels:
    - hot
    - new
  lenses:
    - good-to-learn
---
Voicebox is the only consumer-facing desktop app that puts the **entire voice I/O loop on a single local machine**: text-to-speech with voice cloning, voice dictation, post-processing effects, a multi-track Stories editor, and — the unusual part — a built-in Model Context Protocol server that lets any agent (Claude Code, Cursor, Cline) speak in your cloned voice. The cloud incumbents own one half of the loop each (ElevenLabs on output, WisprFlow on input); the open-source TTS projects (OpenVoice, F5-TTS, Coqui, Kokoro) ship one engine at a time. Voicebox ships the whole thing on one install.

The architectural choice that makes this possible is more interesting than the feature list. Voicebox is a Tauri (Rust) desktop shell that wraps a FastAPI (Python) ML backend as a sidecar binary, and the way the two halves coordinate is the cleanest "Tauri + ML" build the open-source desktop world has produced.

## The sidecar handshake is the real architecture

The Tauri shell launches a PyInstaller-bundled `voicebox-server` as a Tauri `externalBin` sidecar and passes `--parent-pid=<rust_pid>`. The Python side installs a watchdog thread that polls the parent PID every two seconds with a one-second grace window. When the parent goes away, the watchdog gives the shell one second to send an HTTP `POST /watchdog/disable` — a clean shutdown path. A `.keep-running` sentinel file is the fallback for Windows teardown races, where the cleanup signal can be lost mid-handshake. The result is the rare combination of "Python gets a clean shutdown" plus "a forgotten app never leaves an orphaned 4 GB torch process."

GPU variant discovery is order-sensitive and version-gated. Rust checks for an ROCm build, then a CUDA build, in `data_dir/backends/{rocm,cuda}/`, runs `<exe> --version` against the Tauri app version with a ten-second timeout, and only falls back to the bundled CPU sidecar if no GPU binary is present or its version doesn't match. This is the right answer to the "PyInstaller onedir + per-GPU fat binaries" problem that most desktop ML apps simply ignore.

The seven TTS engines sit behind a `TTSBackend` Protocol in `backend/backends/__init__.py`, but the dispatch is an `if/elif` chain in `get_tts_backend_for_engine()`, not a registry. The Protocol's docstring claims each backend class should define `MODEL_CONFIGS` as a class variable; no backend class actually does. Model metadata is built by hand in module-level functions. This is a missed contribution ergonomics — adding an engine requires editing the dispatch, not registering a class — but it matches the project's velocity-versus-cleanliness trade-off.

The voice cloning pipeline is the application's center of gravity. Audio files (`ProfileSample.audio_path`) flow to `tts_model.create_voice_prompt()`, which calls Qwen3-TTS's `create_voice_clone_prompt(ref_audio, ref_text, x_vector_only_mode=False)` and returns a dict of tensors. The conditioning prompt is cached on disk under `cache/<md5(audio+text)>.prompt` keyed by MD5 of `audio_bytes + reference_text`, reloaded via `torch.load(weights_only=True)`. Multi-sample profiles concatenate via `combine_voice_prompts` (numpy concat + text join) and re-save a combined WAV. The first generation is slow; every subsequent generation with the same voice is instant.

*The architectural lesson anyone building a Tauri + ML desktop app should copy:* the IPC boundary is a parent/child process contract with a watchdog, not a "kill on shutdown" reflex.

## The MCP server is the moat against open-source peers

The same FastAPI app exposes a Model Context Protocol server at `http://127.0.0.1:17493/mcp` via FastMCP, with `compose_lifespan` combining the Voicebox lifespan and FastMCP's session manager (Streamable HTTP requires the ASGI lifespan). Four tools ship with dotted names: `voicebox.speak`, `voicebox.transcribe`, `voicebox.list_captures`, `voicebox.list_profiles`. A `voicebox-mcp` sidecar binary is the stdio shim for MCP clients that don't speak HTTP — a 190-line asyncio loop that proxies JSON-RPC over stdin/stdout to the HTTP endpoint, forwarding `VOICEBOX_CLIENT_ID` as the `X-Voicebox-Client-Id` header.

The per-client voice binding is the part that makes the agent integration actually useful. Each MCP client identifies itself via `X-Voicebox-Client-Id`, and the server resolves the voice profile in this precedence: explicit `profile` argument → per-client binding → global default from `capture_settings.default_playback_voice_id` → error. Setting `default_personality: true` in the binding makes the local LLM rewrite the text in the profile's persona before TTS. So Claude Code can speak in "Morgan," Cursor in "Scarlett," and Cline in its own voice — without the agent having to remember which voice to use.

The security boundary is documented but blunt. The `voicebox.transcribe` tool accepts `audio_path` only from loopback callers (parsed via `ipaddress.ip_address(addr).is_loopback`); remote callers must pass `audio_base64`. This is the right call, but the gate uses `request.client.host` directly — there's no `ProxyHeadersMiddleware` and `uvicorn` is launched without `--forwarded-allow-ips`, so a reverse-proxy deployment breaks the loopback check. The rest of the FastAPI REST surface (`POST /generate`, `/speak`, `/transcribe`, `GET /profiles`) has no authentication at all. The project documents this honestly: "Only expose to trusted networks, or put a reverse proxy with auth in front of it." Treat that as a load-bearing instruction.

Crucially, the speaking pill is always visible whenever the agent speaks. The maintainer is explicit about why: "Silent background TTS is a trust hazard — the pill always shows what's coming out of your machine." This is the right product call for a desktop-voice app, and the small detail that distinguishes Voicebox from naive "wire an LLM to a TTS model" integrations.

## One local LLM, three roles

A subtle but interesting design decision: the same Qwen3 instance powers dictation refinement, personality compose, and personality rewrite. There's one local LLM in the app, not three. The prompt engineering is honest about what 0.6B can and can't do. With the default refinement model, examples passed inline in the system prompt caused the model to pattern-match the example verbatim for unrelated inputs — "`Um, thanks for watching, thanks for watching, thanks for watching`" became a recurring output. The fix was to pass the same examples as real chat turns (`examples=`), where the model treats them as prior conversation data and generalizes. The last two slots are reserved for the hardest rules, on a deliberate heuristic that models weight examples closest to the real user turn most heavily. A deterministic pre-LLM pass (`collapse_repetitive_artifacts`) strips Whisper's hallucination loops at a six-identical-token threshold before the LLM sees the input.

*The prompt-engineering lesson for small local LLMs:* chat-turn examples vs. inline system-prompt examples, ordering, and deterministic pre-cleaning matter more than model choice at the 0.6B–4B scale.

## The honest caveat cluster

Three patterns show up repeatedly in the maintainer's own `docs/PROJECT_STATUS.md` and across third-party reviews — and they should be carried into the reader's decision.

**The 0.5.0 release shipped with multiple regressions.** macOS Apple Silicon load crashes (#606, #615), 30-second capture cutoffs (#609, #626), broken paste (#762), MCP dotted tool names violating Claude Desktop's allowed pattern regex (#790), refinement silently translating non-English transcripts to English (#603). New bugs keep getting filed against the Capture path. The maintainer's `PROJECT_STATUS.md` is unusually candid about this — it lists the regression cluster by issue number, calls the April–June 2026 window a "review-and-merge backlog, not a build backlog," and frames the funding/sustainability decision openly.

**Cross-platform GPU support is genuinely painful.** Out of 200 sampled issues, ~78 are Windows + GPU. "No kernel image available for execution on GTX 1050 Ti / 1060 / 960M" (Pascal / Maxwell unsupported), Intel Arc A380 / B770 / integrated Lunar Lake not detected, Whisper failing on RTX 4050, "GPU Not Available" on prebuilt .exe forcing source builds. Linux has no prebuilt binaries at all — README and changelog explicitly point users to `voicebox.sh/linux-install` for build-from-source. The AI Toolkit Substack review's headline is "Windows GPU support is broken." The smooth path is Apple Silicon on M-series; everything else is at least partially broken.

**Server memory grows unbounded.** ~0.5 GB/day on CUDA, CPU generations eventually hang in `generating` forever, leaks on Windows + RX 5700 XT. Restart is the documented workaround. This is a stability pattern, not isolated incidents.

A separate cluster of marketing claims doesn't match the code. The "23 languages" counting applies to the bundle, not to any single engine — only Chatterbox Multilingual actually ships 23. The "end-to-end encrypted backup & sync" copy in the UI and `landing/src/app/cloud/page.tsx` describes a future product; shipped `cloud.py` only stores the bearer key in plaintext SQLite with a comment reading "moving it to the OS keychain is a future hardening step." The `VoiceDesign` (designed voice) feature is schema-defined in the database but no engine consumes the dict — creating a designed voice profile returns a payload that no TTS engine accepts.

## Open-source vs. commercial boundaries

The code is MIT. The bundled models are mostly MIT or Apache-2.0: Qwen3-TTS, Qwen3 LLM, Chatterbox Multilingual, Chatterbox Turbo, Kokoro, LuxTTS. The one license landmine is HumeAI TADA, which is built on Llama 3.2 and inherits the Llama 3.2 Community License — "Built with Llama" attribution and a 700M-MAU clause. The codebase contains a tokenizer mirror workaround for the gated `meta-llama/Llama-3.2-1B` repo but not the legal analysis. Anyone shipping TADA-derived audio at scale needs Llama's separate grant.

Voicebox Cloud (`api.voicebox.sh`) is a separate, non-MIT product. Currently opt-in device pairing; the planned $12/year encrypted sync is "free for `$VOICEBOX` holders" per the project's own token post. The local MIT codebase is self-contained today, but multi-device sync will require the bearer credential. The 2026-04 → 2026-06 maintainer gap was funded by the `$VOICEBOX` Solana token (issue #806), and the community raised concerns about pump.fun association and account compromise. The maintainer disclosed buyback/burn of dev supply and committed to renewed cadence; the issue was closed. The community will keep watching.

## When to choose Voicebox — and when not to

The decision is **cloud-everything convenience vs. local-first sovereignty, scope vs. focus**.

**Choose Voicebox when:**

- You want a local-first voice cloning tool that rivals ElevenLabs on Qwen3-TTS quality without sending audio to the cloud. Multiple independent reviewers (How-To Geek, Dave Swift, AI Toolkit Substack, r/DigitalEscapeTools) report canceling $200/yr ElevenLabs+WisprFlow subscriptions.
- You want any MCP-aware agent to speak in a voice you've cloned, with per-client voice binding managed in one place. No other open-source project does this.
- You're on Apple Silicon and want the smooth path. Pinggy, Dave Swift, and How-To Geek all praise the MLX backend's throughput.
- You're studying how to wrap a Python ML backend inside a Tauri desktop shell — the parent-PID watchdog is reusable far beyond this project.

**Choose something else when:**

- You need SLA-backed infrastructure with SOC 2 / HIPAA / ISO 27001 / PCI DSS compliance. ElevenLabs ships those certifications; Voicebox is a solo-dev OSS project.
- You're on Windows with a Pascal / Maxwell GPU or Intel Arc, or you need Linux binaries. The Substack review's headline is the operational reality.
- Your only need is dictation. Superwhisper ($8.49/mo) is a focused, smaller install that lets you point at GPT-5 / Claude Haiku 4.5 / Gemini 3.0 Flash for refinement instead of a bundled 0.6B local Qwen3.
- You need cross-device sync today. Voicebox's planned cloud sync is a paid feature not yet shipped; WisprFlow's sync, notetaker, and per-app style adaptation are shipping today.
- You're shipping TADA-derived audio at >700M MAU. Llama 3.2's community license clause kicks in. Stick to Qwen3-TTS or Kokoro.

**The genuinely contested trade-off:** cloud-managed polish and compliance certification (ElevenLabs, WisprFlow) vs. local-first sovereignty and the unusual MCP server surface (Voicebox). The local-first choice is not free — Whisper Large on CPU is noticeably slower than Wispr's cloud pipeline, and the seven bundled engines plus Whisper plus Qwen3 means Voicebox's install footprint is multi-GB, an order of magnitude larger than Superwhisper. The README frames the install as a "one-click DMG / MSI," and third-party reviews describe it as a "pain." That's the trade the local-first choice demands.

## The 0.5.0 release at a glance

Shipped 2026-04-25, ~50,987 stars on GitHub, 1.3M downloads, MIT-licensed. The Capture release turned Voicebox from a voice-cloning studio into a full voice studio: dictation with global hotkey, an MCP server, personality-driven voice profiles, and a local LLM that doubles as the refinement model. The maintainer's own `docs/PROJECT_STATUS.md` is the most honest piece of project documentation in the open-source voice-tool space — it lists regressions, frames the funding gap, names the PR backlog, and is itself a public accountability document. Seven TTS engines, Whisper STT, Qwen3 LLM, FastAPI backend, Tauri (Rust) shell, React frontend, PyInstaller sidecar binaries. Apple Silicon is the smooth path; Windows and Linux are at least partially broken today.

If Voicebox fixes the 0.5.0 regression cluster and the GPU pain matures, it becomes the only consumer-facing desktop app worth the install for the entire voice I/O loop. Until then, the Apple Silicon path is the safe one — and the architectural lesson in the sidecar handshake is worth studying regardless of platform.
