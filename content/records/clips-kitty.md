---
name: Clips Kitty
repoUrl: https://github.com/ColinGPT9/clips-studio
projectType: real-app
category: media
stack: react
summary: A Windows desktop app that turns long videos and Twitch, Kick or YouTube streams into
  captioned 9:16 clips for Shorts, Reels and TikTok. Transcription with Whisper, highlight picking
  with a local LLM through Ollama, and speaker tracking with YOLO and TalkNet all run on the
  user's own PC; an Electron and React interface drives a Python and FFmpeg engine.
description: Free desktop app that cuts long videos and streams into captioned vertical clips on your own PC.
platforms:
  - windows
  - desktop
licenses:
  - agpl-3.0
links:
  github: https://github.com/ColinGPT9/clips-studio
  website: https://colingpt9.github.io/clips-studio/
distribution:
  channels:
    - type: microsoft-store
      platform: windows
      label: Microsoft Store
      url: https://apps.microsoft.com/detail/9NB6XT7DSQZZ
      verified: true
    - type: website
      platform: windows
      label: Website download
      url: https://colingpt9.github.io/clips-studio/
      verified: true
    - type: other
      platform: windows
      label: winget (ColinGPT9.ClipsKitty)
      url: https://github.com/microsoft/winget-pkgs/tree/master/manifests/c/ColinGPT9/ClipsKitty
      verified: true
tags:
  - foss-alternative
  - local-first
  - privacy
  - desktop-app
  - video-clipping
  - captions
  - whisper
  - electron
  - python
bestFor:
  - Streamers and YouTubers who want Shorts, Reels and TikToks from long VODs without a per-clip fee.
  - Talking-head, podcast, IRL and gym footage where the person speaking has to stay in frame.
  - Studying a desktop app that joins Whisper, a local LLM, YOLO tracking and FFmpeg in one pipeline.
whyListed:
  - Transcription, highlight picking and speaker tracking run locally; cloud AI is optional and billed to the user's own key.
  - Published AGPL-3.0 source, a Microsoft Store and winget release, and weekly commits.
caveats:
  - The desktop app is Windows only; the Python engine has no tested macOS or Linux build.
  - Needs 16 GB of RAM and about 20 GB of disk. An NVIDIA RTX 2060 or better is recommended; without a GPU everything runs on the CPU, more slowly.
  - Clips recorded videos and VODs, not streams that are still live.
seo:
  title: "Clips Kitty – Open Source Opus Clip Alternative"
  description: Clips Kitty turns long videos and streams into captioned 9:16 clips on your own PC, with local Whisper and a local LLM. AGPL-3.0, free on Windows.
addedAt: 2026-11-15
submittedBy: ColinGPT9
---
Clips Kitty takes a long video, or a YouTube, Twitch or Kick link, and gives back a folder of finished vertical clips plus an editor to review and fix them before posting. It describes itself as a free, open-source Opus Clip alternative. Nothing is uploaded unless the user publishes a clip to their own channel. Checked against the repository on 15 November 2026, at release v2.1.0.

## What it does

- **Highlight picking** scores moments from what is said, audio excitement, visual activity and reactions, using a local model through Ollama (cloud models are optional, on the user's own key).
- **Speaker-aware framing** crops to 9:16 around whoever is talking, using YOLO pose detection and TalkNet active-speaker detection, and cuts to a new speaker instead of panning.
- **Word-synced captions** that can be styled and corrected line by line before they are burned in.
- **Titles, descriptions and hashtags** written for each clip, all editable.
- **Modes for other footage:** podcasts with several cameras, vertical livestreams, and soccer and basketball games.
- **Extras:** captions in 19 languages, local text-to-speech dubbing, 16:9 highlight reels with chapter timestamps, and optional publishing to YouTube.
