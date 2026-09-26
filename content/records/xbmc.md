---
name: xbmc
repoUrl: https://github.com/xbmc/xbmc
projectType: real-app
category: tools
stack: ios
summary: Kodi (despite the legacy `xbmc` GitHub repo name, this is the post-rebrand media-center
  project, not the original XBMC) is a cross-platform entertainment hub that plays local and
  streamed audio/video, scrapes metadata for a personal library, and exposes a binary addon
  framework plus a JSON-RPC interface for remote control and third-party integrations.
description: Kodi is a free, open-source cross-platform media-center and entertainment-hub
  application written primarily in C++ with a CMake build system, built on FFmpeg for codec support
  and featuring a binary addon framework, hardware-accelerated video playback, and a JSON-RPC
  control surface — running natively on Android, Linux, BSD, macOS, iOS, tvOS, and Windows.
sourceDescription: Kodi is an award-winning free and open source home theater/media center software
  and entertainment hub for digital media. With its beautiful interface and powerful skinning
  engine, it's available for Android, BSD, Linux, macOS, iOS, tvOS and Windows.
platforms:
  - ios
licenses:
  - noassertion
links:
  github: https://github.com/xbmc/xbmc
distribution:
  channels: []
tags:
  - objc
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (20,860 stars on GitHub).
caveats: []
seo:
  title: Kodi – Open Source Home Theater & Media Center
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: xbmc
  repo: xbmc
  url: https://github.com/xbmc/xbmc
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:31:57+08:00
  labels:
    - mature
    - hot
  lenses: []
visibility: keep
---
Kodi is a cross-platform media-center and entertainment-hub application
that plays local and networked audio and video, scrapes online metadata
to build a personal library, and exposes a full addon framework for
third-party extensions. Note: the GitHub repo is still named `xbmc`
from before the 2014 rebrand — this is Kodi, not the legacy XBMC
codebase.

## Why it matters

- **21 years of one-name continuity.** Created in 2003 as the Xbox
  Media Center and rebranded to Kodi in 2014, the project has had
  the same user-facing goal — turn a generic PC or TV box into a
  living-room media player — for more than two decades. That
  longevity is rare for a desktop media app.
- **Broad platform reach from one tree.** A single CMake build
  produces native binaries for Android, Linux, BSD, macOS, iOS,
  tvOS, and Windows. The repository even carries an experimental
  WASM/Emscripten target. Apple-specific code lives under
  `xbmc/platform/darwin/` with separate `ios/`, `tvos/`, and `osx/`
  subdirs; Android and Windows sit alongside as their own platform
  trees under `xbmc/platform/`.
- **Plugin-shaped core.** Almost every user-visible capability —
  metadata scrapers, screensavers, visualizers, audio decoders,
  video decoders, input streams, PVR clients, peripherals, VFS
  backends — is an addon binary loaded at runtime. The 30+ addon
  types visible under `addons/` (e.g. `kodi.binary.instance.vfs`,
  `kodi.binary.instance.videocodec`, `kodi.binary.instance.pvr`)
  define the integration surface.

## How it works

The codebase is dominated by C++ (~32.5M LOC, with another ~1M lines
of C and ~490k of Objective-C++), assembled by a top-level
`CMakeLists.txt` that declares `project(kodi LANGUAGES CXX C ASM)`
and pulls in roughly 30 optional and required dependencies via
`core_find_*` helpers — FFmpeg, libavformat, libbluray, libcdio,
taglib, sqlite3, pcre2, fmt, spdlog, exiv2, lcms2, and a platform-
specific audio backend (PulseAudio, ALSA, Pipewire, or CoreAudio).
The required-deps list lives at the top of `CMakeLists.txt`; each
platform dir under `xbmc/platform/` adds its own extras
(`PLATFORM_REQUIRED_DEPS`, `PLATFORM_OPTIONAL_DEPS_EXCLUDE`).

The runtime entry point is `xbmc/application/Application.cpp` —
`CApplication` registers six sub-component listeners (player,
power, skin, volume, stack, action) and walks the GUI through its
main loop. Media playback itself is orchestrated by
`xbmc/cores/VideoPlayer/VideoPlayer.cpp`, where `CVideoPlayer`
filters and prioritizes streams (audio by language/codec, subtitles
by user preference, video by `FLAG_DEFAULT`) and then pipes
demuxed packets from FFmpeg-based `DVDDemuxFFmpeg` into per-stream
players — `CVideoPlayerVideo`, `CVideoPlayerAudio`,
`CVideoPlayerSubtitle` — coordinated by a shared `m_clock` for
A/V sync. Hardware-accelerated decoding (VideoToolbox on Apple,
VAAPI/NVDEC on Linux, MediaCodec on Android, DXVA2 on Windows)
sits in `xbmc/cores/VideoPlayer/DVDCodecs/Video/` and is selected
per codec at stream-open time.

The remote-control surface is the JSON-RPC API
(`xbmc/network/httprequesthandler/`, `WebSockets`) plus a
WebSocket push channel — third-party apps like Kore, Yatse, and
home-automation bridges all drive Kodi over this protocol.

## Caveats

- **Heavy binary footprint.** A full Kodi build pulls in FFmpeg,
  libbluray, libcdio, taglib, exiv2, sqlite3, and a C++ runtime,
  so packaged installs are 100–200 MB on each platform. Embedded
  distros like LibreELEC compensate by trimming to a read-only
  rootfs, but the dependency surface is not going away.
- **Addon ecosystem quality varies.** First-party binary addons
  ship in `addons/` under Team Kodi review, but the public
  repositories host many user-built scrapers, PVR clients, and
  streaming addons that break when upstream providers change APIs
  — common enough that the project ships an "isengard update" /
  add-on-checker path.
- **No first-party mobile companion.** The iOS and Android targets
  are Kodi-as-a-TV-app, not a remote-control client. Officially
  recommended remotes (Kore, Yatse) are separate open-source
  projects.
- **GPLv2 license.** Modifications to the core must be published
  under compatible terms; many bundled third-party libraries
  carry their own permissive licenses.

## Deployment notes

For end users, the easiest paths are the curated distributions
that package Kodi as a turnkey appliance:

```bash
# LibreELEC — minimal Linux distro that auto-launches Kodi
# https://libreelec.tv/downloads/

# OSMC — Debian-based installer for Raspberry Pi, Vero, Apple TV
# https://osmc.tv/download/

# Docker (community images on LinuxServer.io or official tvheadend
# stack); the upstream project does not ship an official image
docker run -d --name kodi \
  -e PUID=$(id -u) -e PGID=$(id -g) \
  -v /path/to/media:/media \
  linuxserver/kodi-headless
```

For native packages, Kodi publishes installers for Windows and
macOS from kodi.tv/download, Android from the Play Store and F-Droid,
and an iOS/tvOS build that requires a paid Apple Developer account
or a sideload tool. Building from source is a multi-hour affair —
run the bootstrap in `tools/depends/` to cross-compile every
internal library before the main CMake build — and is documented
per-platform under `docs/README.md` (Fedora, Ubuntu, openSUSE,
FreeBSD, macOS, iOS, tvOS, Android, Windows, webOS, WASM).

**Minimum:** anything that runs Windows 10, macOS 10.13+, iOS 11+,
tvOS 11+, Android 5.0+, or a Linux distro with GLIBC 2.28+. Hardware
video decode requires a relatively modern iGPU; software decode of
4K HEVC is feasible on a quad-core desktop CPU from the last decade
but is not comfortable.

**Integration tip:** if you curate a directory of media tools, list
Kodi as the canonical "self-hosted local-network media hub" entry —
it predates and still out-scopes most Plex/Jellyfin comparisons for
offline libraries and exotic formats.
