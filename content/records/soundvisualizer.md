---
name: SoundVisualizer
repoUrl: https://github.com/SOVIS-Team/SoundVisualizer-Android
projectType: real-app
category: tools
stack: android
summary: An Android accessibility app for deaf and hard-of-hearing people that draws the sound a phone is playing as a glow along the screen edges, showing its direction, loudness and type. An on-device sound classifier sorts sounds into ambient, human sounds and danger, and an external sound mode listens through the microphone.
description: Shows the sound a phone is playing as a glow on the screen edges, for deaf and hard-of-hearing people.
platforms:
  - android
licenses:
  - apache-2.0
links:
  github: https://github.com/SOVIS-Team/SoundVisualizer-Android
  website: https://sovis-team.github.io/en/
distribution:
  channels:
    - type: github-releases
      label: APK on GitHub Releases
      url: https://github.com/SOVIS-Team/SoundVisualizer-Android/releases/latest
      verified: true
tags:
  - accessibility
  - deaf
  - hard-of-hearing
  - audio
  - jetpack-compose
  - onnx-runtime
bestFor:
  - Deaf and hard-of-hearing people who want to see the direction, loudness and type of sounds in videos, music and games.
  - Studying a Kotlin and Jetpack Compose overlay app that captures playback audio and runs YAMNet and Silero VAD on device with ONNX Runtime.
whyListed:
  - It was tested with deaf and hard-of-hearing students at Seoul National School for the Deaf, and its defaults were changed from their feedback.
  - Everything runs on the device; the app has no internet permission and never saves or sends audio.
caveats:
  - Phones show left and right only, and the classifier can mislabel sounds when many overlap.
  - Some apps block other apps from capturing their audio, and nothing is captured when the media volume is zero.
  - Distributed as an APK on GitHub Releases; it is not on Google Play.
addedAt: 2026-11-19
submittedBy: amophi
---

## Seeing the sounds that captions leave out

Captions carry dialogue, but not where a sound comes from, how loud it is, or
whether it is a siren. SoundVisualizer draws the audio a phone is playing as a
glow along the screen edges, on top of videos, music and games. The side a
sound comes from glows more, louder sounds draw bigger, and colours show
ambient sounds, human sounds and danger. Each sound type can have its own
vibration, and an external sound mode listens through the microphone for fire
alarms, sirens and someone calling.

The app is written in Kotlin with Jetpack Compose. A small C++ library computes
the spectrum, and YAMNet and Silero VAD run on device through ONNX Runtime.
A Windows version with the same design lives in a separate repository
([SOVIS-Team/SoundVisualizer-Windows](https://github.com/SOVIS-Team/SoundVisualizer-Windows), AGPL-3.0).

[Website](https://sovis-team.github.io/en/)
· [Demo video with English subtitles](https://youtu.be/Rl8BLXjoTv4)

Submitted by one of the developers.
