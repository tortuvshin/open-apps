---
name: Swift-Radio-Pro
repoUrl: https://github.com/analogcode/Swift-Radio-Pro
projectType: real-app
category: media
stack: ios
summary: A long-standing open-source iOS radio app template that demonstrates the end-to-end
  streaming-radio pattern (live stream playback, ICY metadata, iTunes album art, lock-screen and
  CarPlay controls), and is now best treated as a reference / starting point rather than an actively
  shipped product.
description: Swift-Radio-Pro is a Swift iOS streaming-audio reference app that plays live radio from
  a list of stations, surfaces now-playing metadata and album art, and integrates with the lock
  screen and Control Center.
sourceDescription: A professional radio station app for iOS with streaming, favorites, and live metadata.
platforms:
  - ios
licenses:
  - mit
links:
  github: https://github.com/analogcode/Swift-Radio-Pro
distribution:
  channels: []
tags:
  - swift
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (2,927 stars on GitHub).
caveats: []
seo:
  title: Swift Radio Pro – Open Source iOS Radio Station App
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: analogcode
  repo: Swift-Radio-Pro
  url: https://github.com/analogcode/Swift-Radio-Pro
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:31:57+08:00
  labels:
    - mature
    - hot
  lenses:
    - good-to-learn
visibility: keep
---
Swift Radio Pro is a Swift iOS streaming-audio app template that wires up the
complete radio-station experience: a list of stations loaded from JSON,
live-stream playback, now-playing metadata and album art, background audio,
and lock-screen / Control Center / CarPlay controls. It has been forked and
re-skinned into dozens of App Store apps and is widely cited as the
canonical iOS starting point for live-radio apps.

## Why it matters

- **Reference architecture for iOS radio.** The project demonstrates the
  full streaming-radio pattern end-to-end: stations JSON, audio session,
  streaming player, metadata refresh, album art, lock-screen controls,
  and an About screen. For anyone building a music, talk, or radio app
  on iOS, it is the most-cited starting point in the open-source scene.
- **Built on FRadioPlayer.** The streaming layer wraps
  [FRadioPlayer](https://github.com/fethica/FRadioPlayer), a community
  project that handles ICY metadata parsing, iTunes artwork lookups, and
  the AVPlayer wiring in one place. Swift Radio Pro is the showcase app
  for that library and a good place to see it used in anger.
- **Reference, not actively shipped.** The repo has been quiet for years
  and now receives only sporadic maintenance by the original author and
  contributors. Treat it as a starting template: read the code, copy the
  patterns you like, and update the iOS / Swift APIs to current versions
  before shipping.

## How it works

The app boots from `SceneDelegate`, which kicks off
`AudioSetupService.shared` to configure everything before the first
station plays. `setupAudioSession()` activates an `AVAudioSession` with
`.playback` category, `.mixWithOthers`, and `.allowBluetoothHFP` so the
stream keeps going when the device locks, Bluetooth headsets connect,
or another app's audio is already playing. `setupFRadioPlayer()` enables
autoplay and points the player at the `iTunesAPI` artwork provider so album
images get filled in when the stream's own metadata only ships the track
title.

`setupRemoteCommandCenter()` wires up `MPRemoteCommandCenter` for the
lock screen and Control Center: play, pause, stop, toggle play/pause,
next track, and previous track. Stop is only enabled for live streams
(there is nothing to seek back to), and pause is disabled on live
streams for the same reason. `UIApplication.beginReceivingRemoteControlEvents()`
is called so the app receives transport-button events even when it is in
the background.

Stations themselves live in `SwiftRadio/Data/stations.json`, an array of
`name` / `streamURL` / `imageURL` / `desc` / `longDesc` / `website`
entries that ship with the app or are pulled from `Config.stationsURL`
when `Config.useLocalStations = false`. The UI layer is UIKit with a
`StationsViewController` listing, a `NowPlayingViewController` driven by
`LNPopupController` for the bottom popup bar, and a separate CarPlay
scene template in `Info-CarPlay.plist`. Marquee labels scroll long
station and track names, and `NVActivityIndicatorView` provides the
loading state while a stream buffers.

## Caveats

- **iOS APIs have moved on.** The project deploys back to iOS 13 in
  some build configurations and iOS 16 for the main target. Lock-screen
  behavior, `MPRemoteCommandCenter` semantics, and CarPlay scene
  templates have all changed since the original release, so expect to
  audit the audio-session and remote-control code against the latest
  Apple documentation before shipping.
- **HTTP streams, no DRM.** The bundled `stations.json` contains plain
  `http://` stream URLs and the app sets
  `NSAllowsArbitraryLoads = true` in `Info.plist`. There is no DRM, no
  signed-URL handling, and no station-auth flow. Any production fork
  needs to lock that down with ATS exceptions scoped to the actual
  streaming hosts, or move to HTTPS streams.

## Deployment notes

```bash
git clone https://github.com/analogcode/Swift-Radio-Pro.git
open SwiftRadio.xcodeproj
```

Xcode resolves the Swift Package Manager dependencies
(`FRadioPlayer`, `LNPopupController`, `MarqueeLabel`,
`NVActivityIndicatorView`) on first open. Edit
`SwiftRadio/Config/Config.swift` to point `stationsURL` at your own JSON
file (or set `useLocalStations = true` to keep the bundled sample
stations), update the `contact` / `website` / `feedbackURL` strings, and
change the bundle identifier before deploying. The `Info.plist` already
declares `UIBackgroundModes = [audio]` for background playback and
`UIUserInterfaceStyle = Dark` for the locked-in dark theme. Build to a
device to exercise real lock-screen and Bluetooth behavior — the
simulator silently skips much of the audio-session and remote-command
plumbing.

**Integration tip:** treat Swift Radio Pro as a starting template for
new radio or live-streaming iOS apps — copy the audio-session setup,
the `MPRemoteCommandCenter` wiring, and the stations-JSON model, then
replace the FRadioPlayer dependency with a more current streaming
library if your target iOS version has moved past what it supports.