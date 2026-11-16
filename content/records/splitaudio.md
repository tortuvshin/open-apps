---
name: SplitAudio
repoUrl: https://github.com/monarchsofchaos004-gif/splitaudio
category: media
stack: android
description: Keeps the music app on Bluetooth and sends every other app to the phone speaker, on Android phones without root.
platforms:
  - android
tags:
  - audio
  - bluetooth
  - shizuku
distribution:
  channels:
    - type: github-releases
      label: Android APK
      url: https://github.com/monarchsofchaos004-gif/splitaudio/releases/latest
bestFor:
  - Keeping music on Bluetooth in the car while video or game sound stays on the phone
  - Android phones without a built-in per-app sound setting
whyListed:
  - Brings per-app audio output to Android phones without root
  - Its compatibility list is built from reports by owners of each phone
  - A small Kotlin codebase that shows how to route app audio through Shizuku
caveats:
  - The F-Droid and GitHub builds need Shizuku
  - Results depend on the phone maker, so check the compatibility list first
addedAt: 2026-11-06
submittedBy: monarchsofchaos004-gif
---

## Why it's listed

Listening to music in the car while a video or game plays on the phone speaker normally needs a feature only some phone makers ship, such as Samsung's Separate app sound. SplitAudio brings that to other Android phones through Shizuku, with no root. It is open source under the MIT license, and its compatibility list is built from reports by owners of each phone.

The app does one job. It watches for Bluetooth plus music playing, then starts a small helper through Shizuku that keeps the music app on Bluetooth and moves everything else to the speaker. Custom mode lets you pick the speaker, Bluetooth or wired headphones for each app.
