---
name: "LayoutKeeper"
repoUrl: https://github.com/tumingke0/LayoutKeeper
category: tools
stack: macos
description: "macOS menu bar app that saves window layouts per external monitor and restores positions, sizes, and Spaces on reconnect."
platforms:
  - macos
licenses:
  - gpl-3.0
tags:
  - desktop-app
  - open-source
  - productivity
  - window-management
  - multi-monitor
  - swift
  - swiftui
bestFor:
  - Restoring window positions, sizes, and Mission Control Spaces when switching between home and office external monitors on a MacBook.
  - Adjusting external monitor hardware brightness over DDC with the keyboard brightness keys on Apple Silicon.
whyListed:
  - Native Swift 6, SwiftUI, and AppKit codebase showing Accessibility window matching, cross-Space window restoration, and IOAVService DDC brightness control.
  - Handles real-world multi-monitor edge cases including lid-close clamshell sleep, per-port display arrangements, and Chrome profile matching.
caveats:
  - Requires macOS 14 or later; moving windows across Mission Control Spaces requires macOS 26 or later and uses private SkyLight APIs.
  - Supports one external monitor at a time; release builds are self-signed and require right-click > Open on first launch.
addedAt: 2026-10-26
submittedBy: tumingke0
seo:
  title: "LayoutKeeper – Open Source macOS Window Layout Restorer"
  description: "macOS menu bar app that saves window layouts per external monitor and restores positions, sizes, and Spaces on reconnect."
---

## Why it is worth using or studying

Unplugging a MacBook from an external monitor piles every window onto the built-in display and folds the external monitor's Mission Control Spaces into the laptop screen. LayoutKeeper records where each window sits on an external monitor (position, size, and Space index) and puts them back when that monitor reconnects, either automatically or after asking. Each monitor can have its own layout identified by EDID, or different monitors at home and at work can share one layout.

Version 0.6.12 also binds display arrangements (above, right, below, left, or custom coordinates) to physical Thunderbolt/USB-C or HDMI ports on the Mac chassis so plugging a cable into a different port switches the display arrangement automatically, and includes a Keep Awake guard that allows the display to sleep without letting macOS force a clamshell system sleep.

For Swift developers, the repository is a clean, dependency-light Swift Package Manager project (Swift 6, SwiftUI, and AppKit) with unit tests covering window matching, EDID serial parsing, IOKit port detection, and display-reconfiguration debouncing. This is a maintainer submission.
