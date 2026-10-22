---
name: Voltip
repoUrl: https://github.com/sunerpy/voltip
category: productivity
stack: tauri
description: An AGPL-3.0 push-to-talk dictation app for Windows, macOS, Linux and Android that types speech at the cursor, recognised on-device or by a cloud service.
platforms:
  - windows
  - macos
  - linux
  - android
  - desktop
licenses:
  - agpl-3.0
tags:
  - dictation
  - speech-to-text
  - voice-typing
  - cross-platform
bestFor:
  - Dictating into any app on Windows, macOS or Linux with one hotkey, a single key or a mouse button.
  - Chinese and English dictation with on-device Qwen3-ASR, SenseVoice or Paraformer models.
  - Using an Android phone as the computer's microphone and keyboard.
whyListed:
  - On-device recognition runs Qwen3-ASR on Vulkan or Metal GPUs, and SenseVoice and Paraformer through sherpa-onnx; cloud providers are optional.
  - A personal dictionary, replacement rules, per-app scenes and voice edit of selected text are built in.
  - The phone pairs through a Noise XX handshake, and the relay only forwards encrypted traffic.
caveats:
  - Release builds use a built-in cloud service by default; on-device recognition needs a model download.
  - The Windows installer is not code-signed and the macOS app is not notarized.
  - A pure Wayland session has no global hotkey; bind a compositor shortcut to `voltip-desktop --toggle`.
seo:
  title: Voltip – Open Source Voice Typing for Desktop and Android
addedAt: 2026-10-22
submittedBy: sunerpy
---
Voltip records while a hotkey is held, recognises the speech and inserts the
text at the cursor of the focused app. Recognition runs on the computer, with
Qwen3-ASR 0.6B or 1.7B through transcribe.cpp (Vulkan on Windows and Linux,
Metal on macOS, the CPU otherwise) or SenseVoice and Paraformer through
sherpa-onnx, or through a cloud provider such as OpenAI, Groq, SiliconFlow,
Alibaba Cloud Model Studio or any OpenAI-compatible endpoint. Release builds
include a default service that needs no key; builds from source do not.

An optional LLM step cleans the text up with presets, and a personal
dictionary and literal or regex rules fix words the recogniser keeps getting
wrong. Voice edit rewrites selected text from a spoken instruction, and
recordings of up to two hours (microphone, system audio or both) export as
SRT subtitles.

The Android app is built with React Native and shares the Rust core through
UniFFI. It works on its own, or pairs with a computer by QR code and acts as
its microphone and keyboard; the audio is compressed with Opus and end-to-end
encrypted. [Packages for every platform](https://github.com/sunerpy/voltip/releases/latest)
come with SHA256SUMS and build attestations.

Submitted by the project maintainer. These notes describe the documented
features; they do not claim an independent benchmark or a curator's
endorsement.
