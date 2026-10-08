---
submittedBy: conrader
name: Plainsay
repoUrl: https://github.com/conrader/plainsay
projectType: real-app
category: productivity
summary: A native Swift menu-bar dictation app for Apple silicon Macs — hold a key, speak, release —
  that transcribes on the device with Whisper or NVIDIA Parakeet and pastes the text back into the
  window you started in, or leaves it on the clipboard when that cannot be confirmed.
description: Plainsay is an MIT-licensed macOS dictation app that transcribes on-device with Whisper
  large-v3-turbo or Parakeet TDT 0.6B v3. Local mode is free, with no account and no telemetry.
sourceDescription: Native Mac dictation in a 12 MB download. Free Local mode with Whisper + Parakeet,
  reproducible benchmarks, optional Cloud. MIT-licensed client.
platforms:
  - macos
  - desktop
licenses:
  - mit
links:
  github: https://github.com/conrader/plainsay
  website: https://plainsay.app
distribution:
  channels:
    - type: github-releases
      platform: macos
      label: GitHub Releases
      url: https://github.com/conrader/plainsay/releases/latest
      verified: true
    - type: other
      platform: macos
      label: Homebrew tap (conrader/plainsay/plainsay)
      url: https://github.com/conrader/homebrew-plainsay
      verified: true
tags:
  - foss-alternative
  - offline-first
  - privacy
  - desktop-app
  - productivity
bestFor:
  - Private dictation into any Mac app with a single hold-to-talk key.
  - Choosing between two local engines, Whisper and Parakeet, on Apple silicon.
  - Users who want a published, reproducible accuracy and latency benchmark.
whyListed:
  - Both speech engines run locally on Core ML; recognition works offline after the model download.
  - Ships expected model digests in the signed app and refuses downloaded models that do not match.
caveats:
  - Apple silicon and macOS 14 or later only.
  - Dictation only — there is no file or recording import.
  - Optional Plainsay Cloud (hosted transcription and cleanup) is a paid subscription and sends audio
    to the service; Voice Edit and LLM cleanup send text to the provider you configure.
  - Young project — first public in August 2026.
relations:
  - type: alternative-to
    to: wispr-flow
    evidence:
      type: self-described
      url: https://plainsay.app/vs/wispr-flow/
      quote: "Plainsay vs Wispr Flow: Free Mac Dictation Alternative"
      checkedAt: 2026-10-08
seo:
  title: Plainsay – Open Source On-Device Dictation for Mac
  description: Plainsay is a 12 MB native Mac dictation app that transcribes locally with Whisper or
    Parakeet and pastes at your cursor. MIT, free Local mode, no account.
addedAt: 2026-10-08
source:
  type: manual
  provider: github
  owner: conrader
  repo: plainsay
  url: https://github.com/conrader/plainsay
---
Plainsay is a small native Mac dictation app: hold a key (Right Command by default), speak, release, and the transcript is pasted at your cursor. Speech recognition runs on the Mac with Whisper large-v3-turbo through WhisperKit or NVIDIA Parakeet TDT 0.6B v3 through FluidAudio. The client is MIT-licensed; an optional paid Cloud mode sits beside it. Checked against the repository on 8 October 2026, at release v0.2.36.

## What it does

- **Hold-to-talk dictation** into native, Electron and web apps, with the previous clipboard restored afterwards.
- **Safe paste** — it returns to the window you started in, and if that cannot be confirmed the text stays on the clipboard instead of landing somewhere else.
- **Optional Polishing** with your own API key, a compatible local endpoint, or Plainsay Cloud; it falls back to the raw transcript if the provider is slow or fails.
- **Voice Edit** — say "change Tuesday to Thursday" to correct the last dictation, or rewrite selected text.

## Licence in practice

The Mac client, benchmark harness and release scripts are MIT. Local mode needs no account, sends no telemetry and checks for signed updates (which can be turned off). Plainsay Cloud is a separate hosted service at US$4 a month that uploads audio for transcription.

## Verified sources

- Repository and README — <https://github.com/conrader/plainsay> (8 Oct 2026)
- Releases — <https://github.com/conrader/plainsay/releases>
- Benchmark — <https://github.com/conrader/plainsay/blob/main/BENCHMARK.md>
- Wispr Flow comparison — <https://plainsay.app/vs/wispr-flow/>
