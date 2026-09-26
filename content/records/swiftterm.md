---
name: SwiftTerm
repoUrl: https://github.com/migueldeicaza/SwiftTerm
projectType: real-app
category: tools
stack: ios
description: An Xterm/VT100-compatible terminal emulator implemented in Swift for iOS.
sourceDescription: Xterm/VT100 Terminal emulator in Swift
platforms:
  - ios
licenses:
  - mit
links:
  github: https://github.com/migueldeicaza/SwiftTerm
distribution:
  channels: []
tags:
  - swift
  - swiftui
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (1,572 stars on GitHub).
caveats: []
seo:
  title: SwiftTerm – Open Source Terminal Emulator in Swift
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: migueldeicaza
  repo: SwiftTerm
  url: https://github.com/migueldeicaza/SwiftTerm
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
SwiftTerm is an Xterm/VT100-compatible terminal emulator implemented
in Swift for iOS and macOS. It is maintained by Miguel de Icaza
(of GNOME, Xamarin, and .NET MAUI fame) and is the most permissive
terminal engine on the Apple platforms — the project's tagline is
"libraries should be libraries, not spy servers."

## Why it matters

- **It's a real terminal emulator, not a pseudo-terminal UI.** SwiftTerm
  implements the VT100, VT220, VT320, Xterm, and Linux console
  escape sequences. Color, cursor positioning, alternate screen,
  sixel graphics, and the iTerm2 image protocol are all supported.
  The Apple App Store version has sixel and image rendering disabled
  to satisfy review, but the open-source build supports them.
- **Used by SSH, Mosh, and other iOS shell apps.** `ish` (the Linux
  shell on iOS) uses SwiftTerm's rendering layer. Several other
  iOS terminal apps use it as their character-grid engine. The
  library split (`SwiftTerm_iOS`, `SwiftTerm_macOS`, `SwiftTermTV`)
  makes it easy to embed.
- **MIT-licensed and friendly to forks.** The license is permissive,
  the codebase is in pure Swift, and the maintainer actively
  accepts PRs. It is the right primitive to reach for when you
  need a real terminal in your iOS or macOS app.

## How it works

The codebase is a single SwiftPM target per platform. The
`Terminal` class is the renderer; it accepts a `TerminalView`
`NSView`/`UIView` to draw into and an `IO` interface to read
from / write to the spawned process. The escape-sequence parser is
in `Parser/`, with separate tests for each VT mode. The project
also ships a SwiftUI wrapper around the AppKit / UIKit view, which
makes embedding trivial in apps that are otherwise SwiftUI.

## Caveats

- **App Store builds disable sixel and image rendering.** Apple
  App Review has historically treated terminal graphics as a
  sandbox concern. The MIT codebase still supports them; the App
  Store wrapper filters the active feature set.
- **This is a terminal emulator, not a shell host.** You still need
  `ish`, Blink, or a remote SSH login to feed bytes into it.
- **The repo is mid-velocity.** Active commits are sporadic but the
  maintainer is responsive to issues. Plan a fork if you need to
  track a specific iOS release cycle.

## Deployment notes

`https://github.com/migueldeicaza/SwiftTerm` is the canonical source.
Adopters add it via Swift Package Manager:

```swift
.package(url: "https://github.com/migueldeicaza/SwiftTerm", from: "1.2.0")
```

The README has a small "Run the sample" walkthrough; the `TerminalApp`
target is the smallest reference for embedding SwiftTerm inside a
SwiftUI app.

**Integration tip:** SwiftTerm is the right base layer if you want
to ship a terminal-emulator feature in an iOS / macOS app. Pair
it with **ish** for the process-hosting side and the canonical
terminal experience on iOS is roughly `ish + SwiftTerm`.
