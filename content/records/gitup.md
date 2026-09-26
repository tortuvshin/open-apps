---
name: GitUp
repoUrl: https://github.com/git-up/GitUp
projectType: real-app
category: tools
stack: ios
summary: "A native macOS Git GUI whose edge is the underlying GitUpKit framework: a tight
  Objective-C wrapper over a customized libgit2 fork, with a custom rebase engine and an in-process
  observer that streams state, history, status, stashes, and search updates to the UI as the on-disk
  repo changes."
description: GitUp is a native macOS Git GUI built on a bespoke in-process Git toolkit (GitUpKit)
  that wraps a customized libgit2 fork and re-implements everything else — including its own rebase
  engine — to keep operations and the live commit graph fast on large repositories.
sourceDescription: The Git interface you've been missing all your life has finally arrived.
platforms:
  - ios
licenses:
  - gpl-3.0
links:
  github: https://github.com/git-up/GitUp
distribution:
  channels: []
tags:
  - objc
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (12,011 stars on GitHub).
caveats: []
seo:
  title: GitUp – Open Source Git Client for macOS
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: git-up
  repo: GitUp
  url: https://github.com/git-up/GitUp
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
GitUp is a native macOS Git client that treats the commit graph as a
first-class object: a live, interactive map of every ref and every
commit in the repository that you can drag, reorder, squash, split,
fix up, and roll back. It is the front half of a two-layer project;
the back half is **GitUpKit**, an in-house Git toolkit that replaces
the usual libgit2 bindings with a thin, opinionated Objective-C API.

## Why it matters

- **The map is the product.** Where Tower, Sourcetree, and GitKraken
  push you into list views, GitUp renders the full commit DAG
  (`GIGraphView` in `GitUpKit/Interface/`) and lets you edit history
  visually: drag a commit to rebase, split a commit by hunk, run an
  interactive fixup chain, then undo all of it because the same
  operations are wired into `NSUndoManager`.
- **Time Machine-style snapshots.** Every meaningful mutation goes
  through `GCLiveRepository -performOperationWithReason:argument:…`
  which, per the header comment, "automatically updates snapshots and
  registers an undo action with `NSUndoManager`." A snapshot is just a
  reflog entry you can rewind to with one click — a feature that
  exists nowhere in upstream Git or in most GUI clients.
- **Custom rebase engine, not libgit2's.** GitUpKit only uses a
  *minimal* subset of libgit2 (via a customized fork at
  `git-up/libgit2`) and "reimplements everything else on top of it,
  including its own rebase engine." That is why history rewrites stay
  interactive even on multi-thousand-commit repos where other clients
  freeze the UI.
- **Distinct from peers.** Tower and Fork lean on libgit2 end-to-end;
  Sourcetree wraps system Git in a heavyweight UI; GitKraken ships a
  cross-platform Electron shell. GitUp is single-platform, single-process,
  and AppKit-native, which is the trade-off that buys the responsiveness.

## How it works

The codebase is split cleanly in two. `GitUp/` is the macOS app
shell — `AppDelegate.m` boots Sparkle, registers a custom
`DocumentController`, opens repos through
`GCLiveRepository alloc initWithExistingLocalRepository:` and pushes
every document into a Map / Commit / Stashes window mode.
`GitUpKit/` is the reusable framework, itself two sub-layers:
`Core/` (Foundation-only, OS X + iOS compatible) holds the Git
abstractions, and `Interface/`, `Views/`, `Components/`, and
`Utilities/` add the AppKit-specific UI on top.

The performance story comes from `GCLiveRepository`. Rather than
polling the on-disk repo, it exposes a `GCLiveRepositoryDelegate`
protocol with `repositoryDidUpdateState / History / Stashes / Status /
Snapshots / Search` callbacks plus matching `GCLiveRepository…DidUpdateNotification`
posts, and runs the heavy reads on background queues so the main
thread keeps drawing the map. `Document.m` wires those notifications
straight into KVO/toolbar state and re-uses the same `XCTest`-backed
fakes used by GitUpKit's own unit tests. Search is also in-process:
`prepareSearchInBackground:withProgressHandler:completion:` indexes
the working tree off the main thread and exposes
`findCommitsMatching:` for instant results.

Repository access itself is bespoke. `GCRepository` is a wrapper over
the minimal libgit2 surface; `GCRepository+Reset`, `+HEAD`, `+Status`,
`+Reflog`, `+Config`, `+Bare` are Objective-C categories that
implement everything libgit2 does not — and
`GCLiveRepository` adds a *new* `GCRepository` instance inside
`performOperationInBackgroundWithReason:` so a backgrounded clone or
submodule init does not block the foreground observer. The `DEBUG`
preprocessor flag enables extra consistency checks; the README
explicitly warns this "can significantly affect performance," which
is the visible reason Debug builds feel sluggish and Release builds
feel instant.

## Caveats

- **macOS-only.** The UI layer depends on AppKit. There is no iPad or
  iPhone build of GitUp itself; the `iGit` example in `Examples/`
  shows what a port looks like, and the iOS-compatibility stops at
  the Foundation-only Base Layer.
- **GitUpKit is not a published framework.** It is `git submodule`-vendored
  alongside the app and is not packaged for CocoaPods, SwiftPM, or
  Homebrew. The `Examples/` directory (GitDown, GitDiff, GitY, iGit)
  is the only documented way to build against it, and they all need
  the GitUpKit Xcode project open.
- **GPL v3 only.** Any app that links GitUpKit inherits the GPL
  terms, which is why almost every third-party user is a personal
  tool rather than a closed-source commercial client.
- **Unmaintained-looking cadence.** The repo shows 1–13 commits per
  month in 2026 with 369 open issues and only 2 open PRs, so bug
  fixes for new macOS releases can lag.

## Deployment notes

**Install the binary:** download the latest `GitUp.zip` from the
[Releases page](https://github.com/git-up/GitUp/releases) (the
current stable is the v1.5.0 "Tahoe Release") and drag `GitUp.app`
into `/Applications`. A community-maintained Homebrew cask is also
available: `brew install --cask gitup`.

**Build from source:**

```bash
git clone --recursive https://github.com/git-up/GitUp.git
cd GitUp
open GitUp/GitUp.xcodeproj
```

Xcode is required. If you do not have a paid Apple Developer team,
delete the "Code Signing Identity" build setting on the
`Application` target, or drop a `DEVELOPMENT_TEAM.xcconfig` into
`Xcode-Configurations/`. The first launch will offer to install a
`/usr/local/bin/gitup` shim so you can open repos from the terminal
with `gitup .` or `gitup map /path/to/repo`.

**Integration tip:** if you maintain a Grove-style directory like
this one, link GitUp as the canonical example of a single-process
native macOS tool whenever you explain the trade-off between shipping
a cross-platform Electron shell (GitKraken) and squeezing every last
millisecond out of one platform with a custom Git library.
