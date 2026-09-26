---
name: IceCubesApp
repoUrl: https://github.com/Dimillian/IceCubesApp
projectType: real-app
category: social-network
stack: ios
summary: A SwiftUI-native Mastodon client written almost entirely by one maintainer, shipping to
  iPhone, iPad, Mac, and Vision Pro from a single Swift-package workspace with a modern MVVM core.
description: IceCubesApp is a SwiftUI-native, multi-platform Mastodon client for iOS, iPadOS, macOS,
  and visionOS, built and maintained primarily by a single developer (Dimillian).
sourceDescription: A SwiftUI-native Mastodon client with a focus on performance and Material You theming.
platforms:
  - ios
licenses:
  - agpl-3.0
links:
  github: https://github.com/Dimillian/IceCubesApp
distribution:
  channels: []
tags:
  - swift
  - swiftui
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (7,001 stars on GitHub).
caveats: []
seo:
  title: Ice Cubes – Open Source SwiftUI Mastodon Client
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: Dimillian
  repo: IceCubesApp
  url: https://github.com/Dimillian/IceCubesApp
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:31:57+08:00
  labels:
    - mature
    - hot
  lenses: []
visibility: keep
---
IceCubesApp is a SwiftUI-native Mastodon client that ships to iPhone,
iPad, Mac, and Apple Vision Pro from a single Swift-package workspace.
It is built and maintained almost entirely by one developer (Thomas
"Dimillian" Ricouard) and has become a reference SwiftUI codebase for
the fediverse community.

## Why it matters

- **Pure SwiftUI, no UIKit escape hatches.** The whole UI is written in
  declarative SwiftUI using `@Observable`, environment objects,
  `safeAreaBar`, `ToolbarSpacer`, and modern concurrency primitives.
  Reading `TimelineView.swift` is the closest thing the Apple
  ecosystem has to an idiomatic SwiftUI reference implementation, and
  Dimillian regularly publishes teardowns that double as a learning
  resource.
- **One codebase, four Apple platforms.** The same Swift packages
  produce builds for iOS 18+, iPadOS 18+, macOS, and visionOS 1+, with
  a dedicated sidebar UI on iPad and Mac. The multi-platform targets
  share the network, model, and design-system packages verbatim, so
  feature parity is the default rather than a porting exercise.
- **A real single-maintainer story.** With ~7k GitHub stars, ~150
  contributors on paper, but the bulk of recent commits and release
  work going through Dimillian, IceCubesApp is a useful counterpoint
  to the corporate-backed Ivory (Tapestry) and the official
  Mastodon-iOS: it shows what one SwiftUI-native developer can ship
  when the API is small and the platform APIs are coherent.

## How it works

The repository is a multi-target Xcode workspace plus a `Packages/`
directory of local Swift packages. `Models`, `DesignSystem`,
`Env`, `NetworkClient`, `Timeline`, `StatusKit`, `Conversations`,
`Notifications`, `Account`, `Lists`, `Explore`, `MediaUI`, and
`AppAccount` each own a slice of the app, and the main
`IceCubesApp/` target plus extensions (Action, Share, Widgets,
Intents, Notifications) consume them as libraries.

Networking lives in `Packages/NetworkClient`. `MastodonClient` is an
`@Observable` class built on plain `URLSession` — no third-party
HTTP library — with a `JSONDecoder` configured for snake_case
conversion. Endpoints are organized into small, focused files under
`Endpoint/` (Accounts, Statuses, Timelines, Notifications, Streaming,
Oauth, Push, Polls, Tags, etc.), each conforming to an `Endpoint`
protocol that exposes the path, method, and `queryItems`. Auth is
standard Mastodon OAuth via Apple's `WebAuthenticationSession`, with
tokens stored in the Keychain and attached as `Bearer` headers (or as
a WebSocket subprotocol for streaming). Mutable client state is
guarded by `OSAllocatedUnfairLock<Critical>`, which keeps the class
provably `Sendable` under Swift 6's strict concurrency mode.

Timeline rendering goes through `TimelineView` (in `Packages/Timeline`),
which binds to a `TimelineFilter`, drives a `TimelineViewModel`, and
observes a `StreamWatcher` for live updates. Pull-to-refresh fires
haptics and a sound, the streaming toggle opens a long-lived
`URLSessionWebSocketTask`, and a Bodega-backed SQLite cache restores
the last read position across account switches. Media uploads use
multipart `URLSession` tasks with an `UploadProgressDelegate` for
progress callbacks.

## Caveats

- **Single-maintainer bus factor.** Release cadence and issue triage
  are dominated by Dimillian. The monthly commit counts in the
  GitHub sync data show stretches of zero activity — perfectly
  normal for a one-person project, but worth flagging if you intend
  to depend on a specific feature landing.
- **App Store politics.** Third-party Mastodon clients have been
  repeatedly threatened or rejected by Apple's review (Ivory was
  famously removed and reinstated). IceCubesApp has weathered the
  same scrutiny; TestFlight betas come and go, and the shipping App
  Store build can lag behind `main` by weeks when Apple pushes back
  on a release.
- **SwiftUI on visionOS is still rough.** The visionOS target works
  but leans on iOS-style layouts that have not been deeply rethought
  for spatial computing; floating windows, immersive spaces, and
  eye-tracking interactions are not first-class.

## Deployment notes

There is no public TestFlight link at the time of writing — Dimillian
runs closed betas announced on the project's GitHub Discussions and
Mastodon account. The shipping build is on the App Store at
[`apps.apple.com/us/app/ice-cubes-for-mastodon/id6444915884`](https://apps.apple.com/us/app/ice-cubes-for-mastodon/id6444915884).

To build from source you need Xcode 16+ and an Apple Developer
account:

```bash
git clone https://github.com/Dimillian/IceCubesApp.git
cd IceCubesApp
cp IceCubesApp.xcconfig.template IceCubesApp.xcconfig
# fill in DEVELOPMENT_TEAM and BUNDLE_ID_PREFIX
open IceCubesApp.xcodeproj
```

The template xcconfig is the only piece you need to edit; the project
then resolves the local `Packages/` automatically. Sideloading onto
your own device works with a free or paid Apple ID by setting the
target signing team to your personal team and disabling Push
Notifications / App Groups (those require a real Developer Program
enrollment).

**Integration tip:** if you operate a directory or review site that
categorises open-source Apple apps, treat IceCubesApp as the canonical
"SwiftUI-native, multi-platform" reference next to the more
UIKit-flavored Ivory (Tapestry) and the official Mastodon-iOS client.
