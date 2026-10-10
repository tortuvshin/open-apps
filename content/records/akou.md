---
submittedBy: GeiserX
name: akou
repoUrl: https://github.com/GeiserX/akou
projectType: real-app
category: productivity
stack: javascript
summary: A macOS call and meeting recorder that records the microphone and the call audio on your own
  Mac, transcribes on the device with speaker labels, and lets your own terminal agent (Claude Code,
  Codex or any MCP client) follow and question a call while it runs. The same core runs as a
  self-hosted transcription server in Docker.
description: akou is a GPL-3.0 call recorder for Apple silicon Macs that transcribes on the device,
  with no bot in the meeting and no account, and saves the notes to files you own.
sourceDescription: The open-source alternative to Granola. Records your calls on a Mac, transcribes
  them on your own machine, lets your own AI agent in the terminal (Claude Code, Codex or any other)
  follow and question a call while it runs, and saves the notes to your own tools. Also runs as a
  self-hosted transcription server.
platforms:
  - macos
  - desktop
licenses:
  - gpl-3.0
links:
  github: https://github.com/GeiserX/akou
  website: https://geiserx.github.io/akou/
  docs: https://geiserx.github.io/akou/
  download: https://github.com/GeiserX/akou/releases/latest
distribution:
  channels:
    - type: github-releases
      platform: macos
      label: macOS disk image (Apple silicon)
      url: https://github.com/GeiserX/akou/releases/latest
      verified: true
    - type: other
      platform: macos
      label: Homebrew tap (geiserx/akou/akou)
      url: https://github.com/GeiserX/homebrew-akou
      verified: true
    - type: self-host
      label: Docker transcription server
      url: https://geiserx.github.io/akou/server/
      verified: true
tags:
  - foss-alternative
  - privacy
  - desktop-app
  - productivity
  - self-hosted
bestFor:
  - Recording calls in any app without a bot joining the meeting or a virtual audio driver.
  - Asking your own Claude Code or Codex about a call while it is still running, from the terminal.
  - Running the same transcription engines as a self-hosted server with an OpenAI-compatible endpoint.
whyListed:
  - Live and final transcription run on the Mac (Parakeet and Nemotron through sherpa-onnx), with
    speaker labels after the call.
  - Notes, transcripts and audio land in files you own, with export folders, hooks, a signed webhook
    and an API to hand them on.
caveats:
  - The recorder needs an Apple silicon Mac with macOS 14.4 or later; the Windows and Linux builds are
    the command line only and cannot record.
  - Ask, enhanced notes and the rolling memo use a language model, by default your own Claude Code or
    Codex, which sends the transcript to Anthropic or OpenAI; a local OpenAI-compatible model or no
    provider keeps it on the machine.
  - Young project — first public in September 2026, 1.0.0 in October 2026.
relations:
  - type: alternative-to
    to: granola
    evidence:
      type: self-described
      url: https://github.com/GeiserX/akou
      quote: "The open-source alternative to Granola."
      checkedAt: 2026-10-11
seo:
  title: akou – Open Source Granola Alternative for Mac
  description: akou records calls on your Mac, transcribes them on the device with speaker labels,
    and lets Claude Code or Codex question a call while it runs. GPL-3.0, no bot, no account.
addedAt: 2026-10-11
source:
  type: manual
  provider: github
  owner: GeiserX
  repo: akou
---
akou records calls and meetings on a Mac and transcribes them on the machine, with no bot in the meeting and no account.

## What it does

It records the microphone and the call audio on separate channels, shows a live transcript as people speak, and runs a more accurate pass with speaker labels after the call. A notepad keeps timestamped notes during the call. A terminal agent such as Claude Code or Codex can start, follow, question and annotate a call over a local API or MCP, and finished calls go to your own vault or repository as Markdown, an event log and the audio.

## Platforms

The desktop app is for Apple silicon Macs, signed with a Developer ID and notarized. The `akou` command line also ships for Windows and Linux, where it manages models and drives a remote akou server. The server is a Docker image for amd64 and arm64.

## Verified sources

- Repository and README — <https://github.com/GeiserX/akou> (11 Oct 2026)
- Releases — <https://github.com/GeiserX/akou/releases>
- Documentation — <https://geiserx.github.io/akou/>
- Server mode — <https://geiserx.github.io/akou/server/>
