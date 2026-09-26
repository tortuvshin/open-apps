---
name: flutter_server_box
repoUrl: https://github.com/lollipopkit/flutter_server_box
projectType: real-app
category: tools
stack: flutter
summary: ServerBox packages a full SSH workstation into a single Flutter app, turning a phone or
  laptop into a portable console for Linux VPS, NAS, and Raspberry Pi hosts. It pairs an in-app
  terminal and SFTP browser with proactive system telemetry, a watchOS companion, and a small
  server-side agent for background push and home-screen widgets.
description: A Flutter-based, cross-platform client for monitoring and administering remote Linux,
  Unix, and Windows servers over SSH — combining real-time status charts, an embedded xterm
  terminal, SFTP file transfer, and Docker / systemd / S.M.A.R.T. management on iOS, Android, macOS,
  Linux, and Windows.
sourceDescription: ServerBox - server status & toolbox
licenses:
  - agpl-3.0
links:
  github: https://github.com/lollipopkit/flutter_server_box
tags:
  - android
  - dart
  - flutter
  - ios
  - server
  - ssh
  - status
  - vps
seo:
  title: ServerBox – Open Source Server Monitor & SSH Client
addedAt: 2026-08-11
source:
  type: github-topic
  owner: lollipopkit
  repo: flutter_server_box
  url: https://github.com/lollipopkit/flutter_server_box
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Flutter Server Box (package name `server_box`, branded "ServerBox") is
a cross-platform client for monitoring and administering remote
servers. It packages what would normally require a desktop SSH
workstation — a terminal, SFTP browser, live system telemetry, and
container / service management — into a single Flutter codebase that
ships to iOS, Android, macOS, Linux, and Windows. Despite the name it
is not a headless server itself; it is the *console* you keep open
while your Linux VPS, NAS, Raspberry Pi, or shared hosting box does
its work.

## Why it matters

- **Truly cross-platform admin surface.** The same app runs on a
  phone, a tablet, a MacBook, and a Linux desktop, with the
  watchOS companion app providing at-a-glance status from the wrist.
  For an operator who needs to ssh into a flaky VPS from a phone
  while away from a laptop, that is a meaningfully better experience
  than juggling Termux and a separate status app.
- **Real telemetry, not just a terminal.** ServerBox renders live
  charts for CPU, sensors (temperature, fan, voltage via `lm_sensors`),
  GPU (parsed from `nvidia-smi` XML), network, disk, and S.M.A.R.T.
  health, plus a Docker / process / systemd manager. The information
  sources are standard CLI tools on the host, so a vanilla Ubuntu or
  Raspberry Pi OS install is enough — no proprietary agent is
  required for the core features.
- **Optional companion agent unlocks background features.** A small
  standalone binary called
  [ServerBoxMonitor](https://github.com/lollipopkit/server_box_monitor)
  is published separately and installed on the managed host. With it
  in place, the app gains server-push notifications (alerts fired
  server-side rather than on a client poll) and home-screen widgets
  that refresh in the background. Without it, ServerBox is still fully
  functional on demand; with it, the app behaves more like a passive
  monitoring dashboard.

## How it works

The Flutter client holds server credentials locally and talks to each
host over a single SSH session. The SSH layer is `dartssh2` (vendored
in the repo as `packages/dartssh2`), which implements the SSH2
protocol natively in Dart — there is no shell-out to `ssh` or
`paramiko`, so the same code path runs on every platform including
iOS where shelling out would be blocked. The terminal view is a
vendored `xterm` package, and the embedded terminal is the same
xterm.js-derived widget TerminalStudio publishes, fed live bytes from
a `dartssh2` channel.

State management is Riverpod 3 with code generation
(`riverpod_generator`, `riverpod_annotation`), persistence uses
`hive_ce` for local server profiles, and the build pipeline is a
custom Dart script `dart run fl_build -p PLATFORM` (defined in
`fl_build/`) that wraps `flutter build` per platform. i18n runs
through Flutter's standard `intl` + ARB pipeline, with English,
Simplified and Traditional Chinese, German, French, Dutch, Indonesian,
Turkish, and Ukrainian hand-maintained and a long tail of
auto-generated locales. Charts use `fl_chart` for the standard
line/area series and a custom `circle_chart` for the at-a-glance
ring gauges on the server detail screen.

The repo also contains a small `watch_connectivity` package that
bridges to the watchOS app, and a `plain_notification_token` package
that powers home-screen widget refresh on Android without depending
on Firebase.

## Caveats

- **AGPL-3.0.** The license is copyleft: redistributing the app
  binary obliges you to publish your modifications. Acceptable for
  personal and internal use; for a branded commercial fork you will
  either keep the source open or negotiate separately.
- **No built-in web UI.** ServerBox is a native client only. If you
  need a browser-based console for the same fleet, you are looking
  at a different project (e.g. a self-hosted shellhub or apache
  guacamole).
- **Credentials are stored locally.** Server profiles and SSH keys
  live in app-local Hive storage, with optional biometric lock on
  supported devices. There is no central team / shared vault
  primitive — this is a personal sysadmin tool, not an enterprise
  PAM replacement.
- **ServerBoxMonitor is a separate repo.** Treat the optional
  companion agent as a different dependency with its own release
  cadence; the two projects version independently and not every
  release of the Flutter app is tested against every release of the
  monitor.

## Deployment notes

The client ships through the usual consumer channels; there is no
self-hosted "server" to install.

```bash
# Mobile and desktop installers
# iOS / macOS: App Store
# macOS also: brew install --cask server-box
# Android: F-Droid, OpenAPK, GitHub Releases, or the project's CDN
# Linux / Windows: GitHub Releases or CDN (AppImage / portable .zip)

# Build from source (requires Flutter >= 3.11 with Dart >= 3.44)
git clone https://github.com/lollipopkit/flutter_server_box.git
cd flutter_server_box
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run -d <device>           # or:
dart run fl_build -p android      # android / ios / macos / linux / windows
```

On the managed host, the only requirement is a reachable SSH daemon
and the standard CLI tools ServerBox queries (`uptime`, `ps`,
`systemctl`, `docker`, `smartctl`, `nvidia-smi`, `sensors`,
`cat /proc/...`). For the optional background-push and home-widget
features, install
[ServerBoxMonitor](https://github.com/lollipopkit/server_box_monitor)
on the host and point the client at it.

**Integration tip:** if you maintain a directory like this one and
want a working "SSH-based fleet management" example, ServerBox is a
good reference for a Flutter app that wraps a non-HTTP protocol
(`dartssh2` over a Dart socket) and surfaces structured data from
remote shells — the `lib/data/model/server/` + per-status provider
split in `lib/view/page/server/` is a clean pattern for turning
parsed `stdout` into typed Riverpod state on every platform from one
codebase.
