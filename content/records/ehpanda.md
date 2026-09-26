---
name: EhPanda
repoUrl: https://github.com/EhPanda-Team/EhPanda
projectType: real-app
category: media
stack: ios
summary: One of the most polished SwiftUI-native apps in open source — a full gallery browser,
  reader, and account client for E-Hentai/ExHentai built with TCA reducers, a Kanna-based HTML
  scraping layer, and Core Data caching, distributed only as a sideloadable IPA.
description: EhPanda is an unofficial iOS and iPadOS client for the E-Hentai and ExHentai galleries,
  written entirely in SwiftUI on top of Point-Free's Composable Architecture, with a Combine/Kanna
  scraping layer and Core Data persistence.
sourceDescription: An unofficial E-Hentai App for iOS built with SwiftUI & TCA.
platforms:
  - ios
licenses:
  - mit
links:
  github: https://github.com/EhPanda-Team/EhPanda
distribution:
  channels: []
tags:
  - swiftui
  - combine
  - adult
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (3,866 stars on GitHub).
caveats: []
seo:
  title: EhPanda – Open Source SwiftUI & TCA Gallery App for iOS
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: EhPanda-Team
  repo: EhPanda
  url: https://github.com/EhPanda-Team/EhPanda
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
EhPanda is an unofficial iOS/iPadOS client for the E-Hentai and
ExHentai gallery sites, built entirely in SwiftUI on top of
Point-Free's Composable Architecture (TCA).

## Why it matters

Most SwiftUI apps that get held up as reference implementations are
todo lists. EhPanda is a real, shipping, 1.1M-line-of-Swift
application — search, paginated lists, a full-screen image reader,
account login, comments, ratings, torrents, archive downloads — and
it is 100% SwiftUI with no UIKit view layer to fall back on. That
makes it one of the most useful large-scale SwiftUI codebases to read.

It is also a rigorous TCA codebase. State, actions, and reducers are
composed from `AppReducer` down through per-screen reducers
(`AppRouteReducer`, `AppLockReducer`, and a reducer per feature
folder), with side effects modelled as publishers rather than
scattered through views. If you want to see whether TCA survives
contact with a real app, this is the sample.

The caveat is unavoidable: the sites it talks to host adult
user-generated manga and doujinshi, much of it of contested legal
status depending on jurisdiction. The README itself disclaims
responsibility for the content and tells users they browse at their
own risk. Read the code for the architecture; understand what the
app is actually for before you install it.

## How it works

The view layer lives in `EhPanda/View/`, split into `Home`,
`Search`, `Detail`, `Reading`, `Favorites`, `Setting`, `TabBar`,
`Support`, and `Migration`. `Home` covers frontpage, popular,
watched, and toplists; `Detail` renders the gallery page with
previews, comments, tags, and torrent/archive actions; `Reading` is
the paged/vertical image reader with gesture handling (the v2.8.1
release notes list a reader gesture fix and Liquid Glass adaptation).

`EhPanda/Network/` is where the scraping happens. There is no API —
E-Hentai serves HTML, so every request conforms to a `Request`
protocol that returns `AnyPublisher<Response, AppError>` and pipes
`URLSession.dataTaskPublisher` → a three-attempt `genericRetry()` →
`Kanna.HTML` → a domain-specific `Parser.parse*` function → error
mapping into `AppError` (`.parseFailed`, `.networkingFailed`). URLs
are centralised in `URLUtil`/`Defaults.URL`. Login and settings
submission are URL-encoded form POSTs; session state rides on
`URLSession`'s shared cookie storage, including the `igneous` cookie
ExHentai requires. `DomainResolver.swift` and the `DF*` files handle
domain-fronting and a custom `URLProtocol` for regions where the
sites are blocked. Nice detail: `GalleryDetailRequest` has a fallback
that strips invalid UTF-8 bytes when the page's encoding is broken.

`EhPanda/Database/` is Core Data (`Model.xcdatamodeld` +
`Persistence.swift`, with `MODefinition/` entities and a versioned
`Migration/` folder) holding gallery metadata, reading state,
history, and appearance settings so re-opening a gallery does not
re-scrape.

## Caveats

The legal grey area is the headline caveat. The upstream galleries
are adult content of varying legality by country, and the app is a
client with no moderation of its own. Bundled tag translators and
category filters help, but the responsibility sits with the user.

Consequently the app is not on the App Store and effectively cannot
be — distribution is a GitHub Releases `.ipa` plus an `AltStore.json`
source manifest. Maintenance has been intermittent: months of zero
commits in early 2026 followed by a burst around the v2.8.1 release
in July. It is MIT-licensed with ~22 known contributors, so the bus
factor is thin.

## Deployment notes

There is no `docker compose up` here. You either download
`EhPanda.ipa` from Releases and sideload it with AltStore/SideStore
(re-signing every seven days on a free Apple ID), add the repo's
`AltStore.json` as a source, or open `EhPanda.xcodeproj` and build to
your own device. The current release targets iOS/iPadOS 26.0+.

Runtime requirements are modest: network access, photo library write
permission for saving images, Face ID/Touch ID if you enable the
app lock, and background download entitlements. ExHentai access
additionally needs a valid E-Hentai account cookie obtained through
the in-app login flow — the app cannot fabricate it.

Content filtering is configured server-side via the E-Hentai profile
and mirrored by `EhSettingRequest`/`SubmitEhSettingChangesRequest`,
so category exclusions set in-app propagate to the account.

**Integration tip:** if you catalogue iOS apps, treat EhPanda as the
canonical "large production SwiftUI + TCA codebase" reference and
tag it `sideload-only` — never assume an App Store link exists.
