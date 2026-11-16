---
name: Purr
repoUrl: https://github.com/iamarunbrahma/purr
projectType: real-app
category: productivity
stack: macos
summary: A Mac menu bar app for dictation and meeting notes that runs entirely on the computer.
  Hold a key, speak and let go, and the words are typed into whatever app has focus. Its meetings
  mode records the mic and the Mac's audio with no bot in the call, labels who said what and saves
  Markdown notes with an optional summary. Speech runs on Parakeet or Whisper through Core ML, and
  summaries and voice edits run on Gemma or Apple's on-device model.
description: Mac dictation and bot-free meeting notes, with speech recognition and summaries running
  on your own computer.
sourceDescription: "Purr: Hold a key. Speak. Your words type into any text field - 100% local,
  on-device"
platforms:
  - macos
  - desktop
licenses:
  - mit
links:
  github: https://github.com/iamarunbrahma/purr
  website: https://purr.arunbrahma.com
  download: https://github.com/iamarunbrahma/purr/releases/latest
distribution:
  channels:
    - type: github-releases
      platform: macos
      label: GitHub Releases
      url: https://github.com/iamarunbrahma/purr/releases/latest
    - type: website
      platform: macos
      label: purr.arunbrahma.com
      url: https://purr.arunbrahma.com
tags:
  - offline-first
  - privacy
  - desktop-app
  - productivity
  - native
  - swift
  - notes
bestFor:
  - Dictating into any Mac app without audio leaving the machine.
  - Meeting notes with speaker labels when a bot joining the call isn't an option.
  - Rewriting a selected passage by saying what to change.
whyListed:
  - Native Swift app that runs Parakeet and Whisper through Core ML and Gemma through llama.cpp, all on the Mac, with no account and no telemetry.
  - Covers dictation, typing while you speak, a custom vocabulary, voice editing and meeting notes in one free app.
caveats:
  - Mac only. It needs an Apple silicon Mac and macOS 14 or later, plus a model download of about 450 MB on first launch.
  - Young project, public since June 2026.
  - The interface is in English. Dictation covers about 100 languages with Whisper, and meetings cover 28.
seo:
  title: "Purr – Open Source Dictation and Meeting Notes App for Mac"
  description: Purr types what you say into any Mac app and takes meeting notes without a bot, with
    speech recognition and summaries running on the computer. MIT.
addedAt: 2026-11-16
submittedBy: iamarunbrahma
---

## Why it's listed

Purr is a native Swift menu bar app for people who want dictation and meeting notes on a Mac without sending audio to a server. Hold Right Option, speak and let go, and the text is typed into the app you're in; Smart Typing can type while you're still talking. A vocabulary list helps with names and jargon, and Voice Edit rewrites selected text when you say what to change. The meetings mode records the mic and system audio with no bot in the call, labels speakers with an on-device diarizer and saves Markdown notes, with an optional summary. Speech recognition uses NVIDIA's Parakeet or OpenAI's Whisper through Core ML, and summaries use Gemma through llama.cpp or Apple's Foundation Models. Signed, notarized builds are free on GitHub Releases, and updates come through Sparkle.
