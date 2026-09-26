---
name: SwiftHub
repoUrl: https://github.com/khoren93/SwiftHub
projectType: real-app
category: tools
stack: ios
summary: An iOS GitHub client demonstrating a full RxSwift + MVVM-C clean-architecture build — Moya
  REST, Apollo GraphQL, Swinject DI, and coordinator-driven navigation across repositories, issues,
  PRs, and users.
description: SwiftHub is an iOS GitHub client built on RxSwift and MVVM-C clean architecture, wiring
  Moya (REST v3) and Apollo (GraphQL v4) behind a flow-coordinator navigation graph with OAuth2 and
  personal-access-token authentication.
sourceDescription: GitHub iOS client in RxSwift and MVVM-C clean architecture.
platforms:
  - ios
licenses:
  - mit
links:
  github: https://github.com/khoren93/SwiftHub
distribution:
  channels: []
tags:
  - swift
  - rxswift
  - mvvm
  - moya
  - fastlane
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (3,111 stars on GitHub).
caveats: []
seo:
  title: SwiftHub – Open Source GitHub Client for iOS (RxSwift)
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: khoren93
  repo: SwiftHub
  url: https://github.com/khoren93/SwiftHub
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
SwiftHub is a third-party iOS client for GitHub built around RxSwift
and the MVVM-C (Model-View-ViewModel with Coordinators) pattern,
aimed at iOS developers who want a reference for wiring up a real
GitHub API client on top of clean-architecture boundaries.

## Why it matters

- **A full GitHub client, not a sample screen.** SwiftHub covers
  authentication, trending repositories and developers, search, full
  repository and user detail pages, issues, pull requests, commits,
  events, releases, branches, notifications, and source-file
  viewing with syntax highlighting. It is one of the most complete
  open-source GitHub clients available on iOS.
- **MVVM-C + clean architecture done in anger.** The codebase is
  organised around a coordinator-driven navigation graph with feature
  modules in `SwiftHub/Modules/` (Repositories, Repository Details,
  Search, Issues, Pull Requests, User Details, Notifications,
  Settings, Theme, etc.), each with its own ViewModel and
  ViewController. It is a useful study reference for iOS engineers
  learning the coordinator pattern.
- **Largely a reference project today.** Activity has slowed: the
  monthly commit count has been near zero through 2026 outside a
  brief push in February, the last release tag (`v1.10.0`, "RxSwift
  6.x support") shipped in October 2021, and 27 open issues sit
  unanswered. Treat it as a maintained-but-quiet architectural
  reference rather than a living product.

## How it works

The networking layer is split between two protocols sharing a common
`SwiftHubAPI` definition in `SwiftHub/Networking/Api.swift`. The REST
v3 surface is implemented with Moya (`Moya/RxSwift ~> 15.0`) and
`Moya-ObjectMapper/RxSwift` for typed JSON mapping, and the GraphQL
v4 surface — used once a user is authenticated — is built with
Apollo iOS (`0.53.0`). `Application.updateProvider()` upgrades the
`SwiftHubAPI` provider from `RestApi` to `GraphApi(restApi:token:)`
when a valid OAuth2 or personal-access token is present, so unauth
calls stay on REST while authenticated traffic uses the GraphQL
gateway.

Navigation is coordinator-driven. `Application` owns a singleton
`Navigator`, `AuthManager`, and the active provider; on launch it
checks `authManager.token?.isValid` and routes either to a login flow
or to `HomeTabBarViewModel` via `navigator.show(segue: .tabs(...),
transition: .root(in: window))`. Feature modules subscribe to
their own input / output ReactiveSwift-style streams, expose
`ViewModelType` protocols, and the AppDelegate-level coordinator
graph owns the transitions. Dependency injection is handled by
Swinject, registered in `Configs/`.

UI is programmatic: SnapKit for layout, Hero for custom
transitions, RxTheme for light/dark theme switching, MessageKit for
issue and PR conversation threads, Charts for star-history and lines-
of-code counters, Highlightr for source-file syntax highlighting,
and WhatsNewKit for release-note screens. Localization runs through
Localize-Swift (English, Chinese, Russian, Armenian), and FLEX is
swiped in for in-app debugging on debug builds.

## Caveats

- **Maintenance is light.** As of mid-2026 the repo has had no
  GitHub release since `v1.10.0` in October 2021, the monthly commit
  count is essentially zero, and 27 issues are open with no recent
  triage. The codebase compiles against the iOS toolchains in
  Xcode 13+ era but is not actively tracking new SwiftUI or
  Swift Concurrency APIs.
- **GitHub API rate limits apply.** Anonymous REST v3 traffic is
  limited to 60 requests / hour per IP, and authenticated OAuth or
  PAT traffic is capped at 5,000 requests / hour. Trending
  repositories and developers come from a separate `codetabs` /
  GitHub trending proxy, which adds a third-party dependency outside
  GitHub's control.
- **OAuth2 secrets live in the source tree.** The GraphQL flow uses
  a checked-in client ID; for your own builds you need to register a
  GitHub OAuth App and substitute the credentials before the
  authenticated screens will function.

## Deployment notes

SwiftHub builds with the standard Xcode + CocoaPods + Fastlane
toolchain. The repo ships a `Podfile` pinning Moya, Apollo, RxSwift
extensions, Kingfisher, R.swift, SwiftLint, Firebase Analytics /
Crashlytics / AdMob, Mixpanel, and FLEX, plus a `Gemfile` driving
Fastlane lanes for setup, update, and App Store submission. Initial
project setup runs through `bundle exec fastlane setup` after
`bundle install`; list available automation with
`bundle exec fastlane lanes`.

```sh
git clone https://github.com/khoren93/SwiftHub.git
cd SwiftHub
bundle install
bundle exec fastlane setup
open SwiftHub.xcodeproj
```

You will need a GitHub OAuth App client ID and secret in
`Configs/` (or the equivalent Info.plist keys the project reads at
launch) to exercise the OAuth2 login flow; personal access tokens
work without OAuth setup. The Info.plist must declare the
`LSApplicationQueriesSchemes` entries used for in-app repository
cloning via SwiftGit2 and for opening GitHub URLs. Tests live in
`SwiftHubTests/` (Quick + Nimble + RxBlocking) and the UI test
target is `SwiftHubUITests/`.

**Integration tip:** if you operate a directory like this one and
need a reference for wiring a real GitHub-shaped API into a Swift
app, SwiftHub is the cleanest open example — mirror its
`SwiftHub/Modules/<Feature>` per-module MVVM-C layout, its split
between Moya (REST) and Apollo (GraphQL) providers, and its
`Navigator` + coordinator-based root transition before designing
your own client.
