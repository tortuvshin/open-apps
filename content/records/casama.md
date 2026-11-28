---
name: Casama
repoUrl: https://github.com/casama-ai/casama
projectType: real-app
category: productivity
stack: flutter
summary: AI teammates (bots) that do real work on sandboxed Linux computers of their own. You can watch
  them live and take over, read and edit what they remember, run them on schedules, and approve risky
  steps such as sending, paying or deleting before they happen.
description: AI teammates with their own sandboxed computers, editable memory and approval before risky actions.
platforms:
  - ios
  - android
  - macos
  - windows
  - linux
  - web
licenses:
  - agpl-3.0
  - apache-2.0
links:
  github: https://github.com/casama-ai/casama
  website: https://casama.ai
  docs: https://docs.casama.ai
distribution:
  channels:
    - type: play-store
      label: Google Play
      url: https://play.google.com/store/apps/details?id=ai.casama.app
    - type: microsoft-store
      label: Microsoft Store
      url: https://apps.microsoft.com/detail/9N433Z49THVD
    - type: website
      label: Desktop downloads, including Linux
      url: https://casama.ai/download
    - type: web-app
      label: Casama web app
      url: https://app.casama.ai
    - type: self-host
      label: Self-host with the published engine images
      url: https://casama.ai/self-hosted
tags:
  - self-hosted
  - cross-platform
  - desktop-app
bestFor:
  - Handing browsing, form filling, file work and code to a bot while keeping approval over risky steps.
  - Reading how an agent app's Flutter clients, in-computer agent and safety rules are built.
caveats:
  - Only the apps, computerd, SDKs, CLI, MCP server, safety rules, computer image and network guard are
    open source. The Casama Engine that runs them is closed, including in the self-hosted images.
  - Self-hosting is free for personal use; business use is paid. Casama Cloud has a free plan and paid plans.
  - The public repository is new and receives synced snapshots of the open folders.
addedAt: 2026-11-28
submittedBy: oliverbytes
---

## Why it's listed

Casama ships one Flutter client for iPhone, iPad, Android, macOS, Windows, Linux and the web, with
the code that decides what a bot may do published alongside it: when it must ask first, what it may
never do, what is on its computer and what its network allows. The engine is not open source; see
[LICENSING.md](https://github.com/casama-ai/casama/blob/main/LICENSING.md) for the folder-by-folder map.

Submitted by the maker.
