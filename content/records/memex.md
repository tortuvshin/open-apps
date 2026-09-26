---
name: Memex
repoUrl: https://github.com/memex-lab/memex
projectType: real-app
category: productivity
stack: flutter
summary: Open-source PKM/journal built on dart_agent_core where every entry is Markdown on disk,
  agents are loadable SKILL.md files that can call fetch() in JS sandboxes, and LLM traffic goes
  phone-to-provider with no Memex-operated server in the middle.
description: Memex is a Flutter-based, local-first AI journal for iOS and Android that captures
  text, photo, and voice fragments, runs them through a multi-agent skill system on a BYO-LLM, and
  weaves them into timeline cards, P.A.R.A.-organized Markdown knowledge, and chart-driven insights.
sourceDescription: An open-source, local-first AI journal for iOS and Android that turns text, photo
  and voice fragments into structured timeline cards and organizes knowledge using the P.A.R.A.
  methodology
platforms:
  - android
  - ios
licenses:
  - gpl-3.0
links:
  github: https://github.com/memex-lab/memex
distribution:
  channels: []
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: Memex – Open Source Local-First AI Journal
addedAt: 2026-06-07
source:
  type: import
  provider: github
  owner: memex-lab
  repo: memex
  url: https://github.com/memex-lab/memex
curation:
  reviewed: false
  reviewedAt: 2026-06-07T01:47:40+08:00
  labels:
    - mature
    - hot
  lenses:
    - good-to-learn
visibility: keep
---
Memex is an open-source, local-first AI journal for iOS and Android. It
captures life in fragments — text snippets, photos, voice memos, shared
files — and routes them through a multi-agent skill system that turns
the noise into a timeline of structured cards, a Markdown knowledge
base filed with the P.A.R.A. methodology, and chart-driven insight
cards. Everything stays on the device, and LLM traffic goes
phone-to-provider with no Memex-operated server in the loop.

## Why it matters

- **Local-first Markdown archive.** Every record is a Markdown file on
  disk plus a SQLite row. Drift backs the database; the file tree is
  the export. One tap and the entire journal is a folder of `.md`
  files you can rsync, version, or hand to another tool.
- **Multi-agent skill system.** `dart_agent_core` is the runtime; each
  capability (timeline card, PKM filing, schedule, knowledge insight,
  companion chat) is a `SKILL.md` file that follows the open
  [Agent Skills](https://agentskills.io) standard. Skills declare
  event triggers, accept per-agent LLM config, and can execute
  JavaScript — including `fetch()` — inside a Flutter JS sandbox.
- **Bring-your-own LLM with zero intermediary.** Memex talks directly
  to OpenAI, Claude, Gemini, AWS Bedrock, DeepSeek, Kimi, Qwen,
  Doubao, Zhipu GLM, Ollama, OpenRouter, and a handful of Chinese
  providers. Prompts never pass through a Memex backend because there
  isn't one.
- **AI companions with persistent memory.** Custom characters with
  SillyTavern V2 JSON + PNG card import, auto-commentary reacting to
  new timeline entries, and 1v1 chats that remember across sessions.
- **On-device ML where it pays off.** Google ML Kit does text
  recognition and image labeling, `sherpa_onnx` plus Silero VAD
  handles voice transcription, and `health` / `pedometer` /
  `geolocator` enrich entries with context the journal then becomes
  the only place that has.

## How it works

The Flutter app is organized as `agent/`, `db/`, `data/`, `domain/`,
`llm_client/`, `ui/`, and `utils/`. User input flows through asset
preparation into the orchestrator agent, which dispatches to
specialist skills — timeline card, PKM filing, schedule update,
knowledge insight. Background tasks handle character comments,
memory curation, and user-authored custom agents. State is
`provider` + MVVM; routing is `go_router`; navigation surfaces
`flutter_map`, `fl_chart`, and a `webview_flutter` Markdown
renderer. A local Android plugin (`agent_background_android`) plus
`workmanager` keep long-running jobs alive outside the foreground.

## Caveats

- **Mobile-only.** No web client, no desktop build — this is a phone
  journal that happens to ship Flutter code, not a Flutter desktop
  app.
- **BYO-LLM cost.** Quality of every AI feature (card extraction,
  entity linking, insight charts, companion chat) tracks the model
  you point it at. Cheap tiers give noisy tags; on-device Ollama
  works but the latency is yours.
- **Android release APK is 260 MB.** Voice models (`silero_vad.onnx`)
  and the Jieba dictionary ship inside the binary, which is the
  price of running everything offline.
- **GPL-3.0** across the project; commercial forks must publish
  modifications.

## Deployment notes

Install Memex v1.0.37 from the App Store, Google Play, or the GitHub
release APK. Build from source with Flutter ≥ 3.6 and either Xcode
(for iOS) or Android Studio:

```bash
git clone https://github.com/memex-lab/memex.git
cd memex
flutter pub get
cd ios && pod install && cd ..
flutter run --flavor globalDev
```

Pick your LLM provider in Settings → AI before the first capture, and
configure an iCloud Drive or local-folder backup target so the
Markdown tree survives a phone swap.
