---
name: Lotti
repoUrl: https://github.com/matthiasn/lotti
category: productivity
stack: flutter
description: Private logbook for tasks, time tracking, journaling, habits and health data, with end-to-end encrypted sync and optional AI agents.
platforms:
  - android
  - macos
  - linux
tags:
  - time-tracker
  - journaling
  - local-first
  - end-to-end-encryption
addedAt: 2026-09-29
submittedBy: cyberk1ng
---

## Why it's listed

Lotti keeps what you planned (tasks, time blocks) and what actually happened
(tracked time, notes, voice recordings, photos, health measurements) as
separate records in a local database on your own devices. Sync between
devices is end-to-end encrypted, so the relay only ever holds ciphertext.

Optional AI agents read what you record, summarise it and propose changes to
tasks and checklists; every proposed change waits for the user to confirm or
dismiss it. The code is worth studying as a large Flutter desktop and mobile
app: the sync protocol and agent runtime are specified in TLA+ and
model-checked, and the repository carries its architecture notes alongside
the code. It is GPL-3.0 and has been in development since 2016.
