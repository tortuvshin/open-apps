---
name: Meetily
repoUrl: https://github.com/Zackriya-Solutions/meetily
projectType: real-app
category: productivity
stack: tauri
summary: A Rust and Tauri desktop app that captures meetings, transcribes them in real time with
  local Whisper or Parakeet models, separates speakers and writes summaries through Ollama — the
  community edition processes everything on the machine.
description: Meetily is an MIT-licensed AI meeting assistant for macOS and Windows that transcribes
  live with Whisper or Parakeet and summarises with a local Ollama model, without a cloud service.
sourceDescription: Privacy first, AI meeting assistant with 4x faster Parakeet/Whisper live
  transcription, speaker diarization, and Ollama summarization built on Rust. 100% local processing.
  no cloud required.
platforms:
  - macos
  - windows
  - desktop
licenses:
  - mit
links:
  github: https://github.com/Zackriya-Solutions/meetily
  website: https://meetily.ai
distribution:
  channels:
    - type: github-releases
      label: GitHub Releases
      url: https://github.com/Zackriya-Solutions/meetily/releases/latest
      verified: true
tags:
  - self-hosted
  - offline-first
  - desktop-app
  - privacy
  - notes
bestFor:
  - Regulated or confidential meetings where neither audio nor transcript may leave the machine.
  - Windows users who want live local transcription; installers ship as .exe and .msi alongside the
    macOS .dmg.
  - People already running Ollama who want summaries from the same local models.
whyListed:
  - The most-starred project in the local meeting-notes space, with installers for macOS and Windows
    on every release.
  - Live transcription, speaker diarization and summarisation all run on local models in the
    community edition.
caveats:
  - A paid Meetily PRO tier is promoted in the README for higher accuracy, advanced exports and team
    features; this record covers the MIT community edition.
  - The README lists Linux as supported, but the latest release ships macOS and Windows installers
    only — expect to build from source on Linux.
  - Local transcription and a local LLM together need real hardware; summaries are only as good as
    the Ollama model you can run.
relations:
  - type: alternative-to
    to: granola
    evidence:
      type: editorial
      checkedAt: 2026-09-22
seo:
  title: Meetily – Open Source Local AI Meeting Assistant
  description: Meetily records, transcribes and summarises meetings on your own Mac or Windows PC with
    Whisper, Parakeet and Ollama. MIT-licensed community edition; a paid PRO tier exists.
addedAt: 2026-09-22
source:
  type: manual
  provider: github
  owner: Zackriya-Solutions
  repo: meetily
  url: https://github.com/Zackriya-Solutions/meetily
curation:
  reviewed: true
  reviewedAt: 2026-09-22
  reviewedBy: Open Apps curators
  labels: []
  lenses: []
visibility: keep
---
Meetily is the most widely adopted open-source meeting assistant that keeps the whole pipeline — capture, live transcription, speaker separation, summary — on your own machine. Pick it if you are on Windows or want the local-only guarantee without configuring providers; be aware that the project also sells a PRO tier, and that Linux users should expect to build from source. Verified against the repository on 22 September 2026, at release v0.4.1.

## Everything local in the community edition

The repository description is blunt about the design: "100% local processing. no cloud required." Transcription runs on Whisper or NVIDIA's Parakeet models, speakers are separated with diarization, and summaries come from a model served by Ollama. There is no provider to choose because there is no provider — which is the simplest privacy story of any app in this group, and also the most demanding on hardware.

## Who it is for, and who it is not for

**A good fit**

- Legal, healthcare, defence or client work where neither the audio nor the transcript may reach a third party.
- Windows users. Every release ships `.exe` and `.msi` installers alongside the macOS `.dmg`.
- People who already run Ollama and want meeting summaries from the same models.

**Look elsewhere**

- You want a hosted model to write the summary. [anarlog](/apps/anarlog/) and [Humla](/apps/humla/) let you bring an API key; Meetily's community edition is built around local models.
- You are on Linux and want an installer. The README lists Linux as supported, but v0.4.1 publishes macOS and Windows artefacts only.
- Your machine cannot run a useful local LLM. Summary quality is capped by the Ollama model you can fit.

## How it compares

| | Meetily | [anarlog](/apps/anarlog/) | [Humla](/apps/humla/) |
|---|---|---|---|
| Platforms | macOS, Windows | macOS, Windows, Linux | macOS (Apple Silicon) |
| Transcription | Local Whisper / Parakeet | On-device or a chosen provider | Local Whisper or a provider per language |
| Summaries | Local, through Ollama | Local, your API key, or hosted | OpenAI or a local server |
| Paid tier | Meetily PRO | Hosted AI and sync | Humla Cloud sync |

See all of them side by side in [open-source Granola alternatives](/collections/open-source-granola-alternatives/).

## Licence in practice

The community edition is MIT. The README promotes Meetily PRO for "enhanced accuracy, advanced exports, custom summary workflows, and team-ready features", so treat the repository as the free tier of a commercial product: the code you can read is the code you get, and the PRO features are not in it. More Tauri desktop apps are listed under [Tauri](/stacks/tauri/).

## Verified sources

- Repository and README — <https://github.com/Zackriya-Solutions/meetily> (22 Sep 2026)
- Releases — <https://github.com/Zackriya-Solutions/meetily/releases>
- Project site — <https://meetily.ai>
