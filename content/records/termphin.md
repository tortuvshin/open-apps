---
name: "Termphin"
repoUrl: https://github.com/Termphin/Termphin
category: developer-tools
stack: flutter
description: "Never lose an SSH session again. A free, open-source SSH client with sessions that survive a dropped connection."
platforms:
  - ios
  - android
tags:
  - android
  - dart
  - devops
  - flutter
  - gplv3
  - homelab
  - ios
  - open-source
licenses:
  - gpl-3.0
links:
  website: https://termphin.dev
whyListed:
  - "Sessions keep running on the server when the phone locks, loses signal or switches networks, and you reattach mid-line with scrollback intact. The terminal is drawn natively in Flutter, not a web view, so htop, vim and other TUIs render properly."
bestFor:
  - "People who manage servers or a homelab over SSH from their phone, or check on long-running jobs and coding agents while away from the desk."
caveats:
  - "Session persistence needs a small open-source helper on the server. Push notifications and end-to-end encrypted sync are part of the paid Pro plan."
addedAt: 2026-11-17
submittedBy: mikolajbadyl
---

Termphin is an SSH client for Android and iOS. A tiny helper on the server holds the shell open, so a dropped connection does not end the session. It includes SFTP file browsing, port forwarding, snippets, autocomplete from your command history and split screen. Keys are encrypted with AES-256-GCM under a key held by the phone's secure hardware, and the phone connects directly to your server.
