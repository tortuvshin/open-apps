---
name: Humla
repoUrl: https://github.com/michaelwilhelmsen/humla
projectType: real-app
category: productivity
stack: tauri
summary: A Tauri 2, Rust and Swift app inspired by Granola. It transcribes with local Whisper or a
  provider chosen per language, labels speakers on-device, and answers questions about past meetings
  with cited notes.
description: Humla is an MIT-licensed AI meeting-notes app for Apple Silicon Macs that records mic
  and system audio as two streams, identifies speakers offline and merges your notes with the
  transcript.
sourceDescription: Open-source AI meeting notes for Mac. Records mic + system audio with no bot,
  transcribes on-device or via OpenAI / Deepgram / Groq, identifies speakers offline, and writes
  summaries that fuse your notes with the transcript.
platforms:
  - macos
  - desktop
licenses:
  - mit
links:
  github: https://github.com/michaelwilhelmsen/humla
  website: https://humla.team
distribution:
  channels:
    - type: github-releases
      platform: macos
      label: GitHub Releases
      url: https://github.com/michaelwilhelmsen/humla/releases/latest
      verified: true
tags:
  - foss-alternative
  - offline-first
  - desktop-app
  - privacy
  - notes
bestFor:
  - Meetings in more than one language — the transcription engine can be set per language, including
    a Norwegian-tuned Whisper model.
  - Remote calls where your voice and the other side should stay separate in the transcript.
  - Asking questions across past meetings and seeing which notes the answer came from.
whyListed:
  - Speaker identification runs on the Mac with no audio upload, which most hosted notetakers cannot
    offer.
  - Notes are reachable from Claude Code, Codex and other MCP clients.
caveats:
  - Early-stage — the repository was created in April 2026 and is maintained by one developer as an
    indie project.
  - Apple Silicon only; the release ships a single aarch64 .dmg.
  - Not local-only by default. OpenAI, Deepgram and Groq are first-class transcription options;
    choose local Whisper and a local LLM server to keep a meeting on the device.
  - Sync across devices and shared workspaces are part of a separate paid Humla Cloud.
relations:
  - type: alternative-to
    to: granola
    evidence:
      type: repo-topic
      url: https://github.com/michaelwilhelmsen/humla
      quote: granola-alternative
      checkedAt: 2026-09-22
seo:
  title: Humla – Open Source AI Meeting Notes for Mac
  description: Humla records meetings on an Apple Silicon Mac with no bot, transcribes with local
    Whisper or your own API key, and labels speakers offline. MIT-licensed and early-stage.
addedAt: 2026-09-22
source:
  type: manual
  provider: github
  owner: michaelwilhelmsen
  repo: humla
  url: https://github.com/michaelwilhelmsen/humla
curation:
  reviewed: true
  reviewedAt: 2026-09-22
  reviewedBy: Open Apps curators
  labels:
    - new
  lenses: []
visibility: keep
---
Humla is the most thoughtful of the small Granola-style apps, and the youngest: a one-developer project whose repository was created in April 2026. It is worth running if you are on an Apple Silicon Mac and hold meetings in more than one language. It is not a local-only app out of the box — hosted transcription providers are first-class options — so set it up deliberately if privacy is why you are here. Verified against the repository on 22 September 2026, at release v0.64.0.

## Two audio streams, and a transcription engine per language

Humla records the microphone and the computer's audio at the same time and keeps them as separate streams, so in a remote call your voice is not mixed into the other side's. After the recording stops, speaker identification runs on the Mac with no audio upload, and each label can be renamed across the transcript.

Transcription is where it differs from its peers. You pick a default engine — local Whisper on the Mac's GPU, OpenAI, Deepgram or Groq — and can override it per language. The README's own example is Norwegian through a locally run model tuned by the Norwegian national library, English through Deepgram. The summary step receives your typed notes and the transcript as two labelled inputs, so what you wrote is not overwritten by what was said.

## Who it is for, and who it is not for

**A good fit**

- Bilingual or non-English meetings, where one engine for everything gives poor results.
- People who want to ask questions across past meetings and see which notes the answer cites.
- Claude Code, Codex or other MCP users who want their meeting notes available to an agent.

**Look elsewhere**

- You are not on Apple Silicon. The release is a single aarch64 `.dmg`; [anarlog](/apps/anarlog/) covers Windows and Linux, [Meetily](/apps/meetily/) covers Windows.
- You need a project with a track record. Humla is an indie app a few months old; releases are frequent, which cuts both ways.
- You want sync included. Cross-device sync and shared workspaces belong to a separate paid Humla Cloud.

## Keeping a meeting on the device

Everything can run locally — recording, local Whisper, offline speaker identification, and summaries through Ollama, LM Studio, llama.cpp or vLLM. None of that is the default you get by pasting in an OpenAI key. For a sensitive meeting, choose local Whisper for transcription and a local server for both summary and chat, which are configured separately.

## Licence in practice

MIT, with no enterprise directory and no split. The paid part is the hosted sync service, not the app. Other MIT apps are under [MIT-licensed apps](/licenses/mit/); the full comparison is in [open-source Granola alternatives](/collections/open-source-granola-alternatives/).

## Verified sources

- Repository and README — <https://github.com/michaelwilhelmsen/humla> (22 Sep 2026)
- Releases — <https://github.com/michaelwilhelmsen/humla/releases>
- Project site — <https://humla.team>
