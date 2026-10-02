---
name: ItsPaint
repoUrl: https://github.com/joshlin2201/itspaint
category: tools
stack: ios
description: Paint and screenshot-markup app for macOS, built on a UI-free Swift drawing engine that also ships as a package.
platforms:
  - macos
tags:
  - desktop-app
  - design-tools
  - privacy
bestFor:
  - Numbering the steps on a screenshot and covering a password or token with a filled shape before it goes into a bug report
  - Studying how an NSDocument app keeps its drawing engine in a separate SwiftPM package with no AppKit
  - Removing a flat background from a logo, product shot or scan without an ML model
whyListed:
  - The engine, PaintKit, has no UI and no dependencies, so most drawing changes are tested with `swift test` alone, and on main it also builds for iOS 15
  - The app has no network entitlement, so the sandbox blocks network connections, and the README gives three commands to check that on your own copy
  - Every target builds in Swift 6 language mode with strict concurrency, and the good first issues say whether they need Xcode
caveats:
  - Needs macOS 14 Sonoma or later, and the interface is English only
  - Young project, public since July 2026, with one maintainer, and the document format can still change before 1.0
addedAt: 2026-10-02
submittedBy: joshlin2201
---

## Why it's listed

ItsPaint is a paint and markup app for the Mac in the spirit of MS Paint. You
can take or paste a screenshot, drop numbered badges on the steps, cover anything that
should not be in the ticket (pixelate for detail, a filled shape for secrets),
and drag the image straight into a bug report or a chat without saving a file first. It also paints from scratch,
and it opens a PDF page as a canvas and saves it back as a PDF.

The code is worth reading for its split. PaintKit, the drawing engine, is a
SwiftPM library that imports Foundation, CoreGraphics, ImageIO, CoreText and
UniformTypeIdentifiers and nothing else, and the AppKit document app sits on
top of it. Background removal floods from the four corners and makes the union
transparent, and it declines rather than erasing the picture when the flood
would leave no subject behind. The repository also writes up its own mistakes, such as a
guard that was wrong for three releases while its test passed.
