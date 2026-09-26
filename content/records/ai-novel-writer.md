---
submittedBy: EthanYoQ
name: AI Novel Writer
repoUrl: https://github.com/EthanYoQ/AI-Novel-Writer
projectType: real-app
category: productivity
summary: An open-source Windows and macOS writing workspace for authors who want structured AI
  assistance without scattering a novel across unrelated chat sessions, with optional Ollama support
  for local models.
description: AI Novel Writer is a local-first desktop workspace that keeps characters,
  worldbuilding, outlines, chapter plans, drafting, review, and revision in one long-form fiction
  project.
sourceDescription: AI-assisted novel-writing desktop app for Windows and macOS, with Ollama and DSH plugin support.
platforms:
  - windows
  - macos
  - desktop
licenses:
  - gpl-3.0
links:
  github: https://github.com/EthanYoQ/AI-Novel-Writer
  website: https://www.orz.md/ai-novel-writer/
  download: https://github.com/EthanYoQ/AI-Novel-Writer/releases/latest
distribution:
  channels:
    - type: github-releases
      platform: windows
      label: Windows installer
      url: https://github.com/EthanYoQ/AI-Novel-Writer/releases/latest
      verified: true
    - type: github-releases
      platform: macos
      label: macOS disk images
      url: https://github.com/EthanYoQ/AI-Novel-Writer/releases/latest
      verified: true
tags:
  - open-source
  - desktop-app
  - cross-platform
  - productivity
  - ai
  - local-first
  - creative-writing
  - novel-writing
  - ollama
bestFor:
  - Planning and drafting long-form fiction while keeping characters, worldbuilding, and chapter
    structure together.
  - Authors who want to review and revise AI-assisted text instead of accepting one-shot generation.
  - Writers who prefer a downloadable desktop app and optional local model access through Ollama.
whyListed:
  - It is a complete GPL-3.0 desktop application with current Windows and macOS release assets.
  - The workflow covers planning, chapter blueprints, drafting, review, and revision rather than
    only generating isolated passages.
  - Its TypeScript and Electron codebase is useful for studying a cross-platform, local-first
    creative application.
caveats:
  - Generated prose and continuity still depend on the selected model, project context, and author
    review.
  - Ollama is optional and must be installed and configured separately when local model use is
    desired.
seo:
  title: AI Novel Writer – Open Source AI Writing App for Authors
addedAt: 2026-09-09
source:
  type: submit
  provider: github
  owner: EthanYoQ
  repo: AI-Novel-Writer
  url: https://github.com/EthanYoQ/AI-Novel-Writer
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
AI Novel Writer is an open-source desktop workspace for planning, drafting, reviewing, and revising long-form fiction.

## What it does

The application keeps a story premise, characters, worldbuilding, outlines, chapter blueprints, drafts, review notes, and revisions inside one project. It is designed for authors who want AI assistance as part of an editable writing process rather than a one-click book generator.

## Why it is useful to study

The repository shows how a TypeScript and Electron desktop application can coordinate structured story data, retrieval-assisted context, model providers, review steps, and cross-platform releases. Authors can connect cloud-compatible providers or use Ollama for an optional local-model workflow.

## Platforms

Current GitHub releases provide a Windows installer and macOS disk images for Apple Silicon and Intel Macs.

## Limits

Writing quality and continuity depend on the chosen model and the context supplied to it. The author still reviews and decides what becomes part of the manuscript.

## Links

- [Source code](https://github.com/EthanYoQ/AI-Novel-Writer)
- [Latest release](https://github.com/EthanYoQ/AI-Novel-Writer/releases/latest)
- [Product page](https://www.orz.md/ai-novel-writer/)