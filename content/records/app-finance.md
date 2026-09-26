---
name: app-finance
repoUrl: https://github.com/lyskouski/app-finance
projectType: real-app
category: finance
stack: flutter
summary: An ad-free, inclusive personal finance manager written in Flutter with multi-currency
  accounts, recurring transactions, budget categories, Monte Carlo forecasting, and P2P device sync
  over WebDAV or peer-to-peer channels.
description: Fingrom is a Flutter-built, ad-free, multi-currency personal finance app that ships to
  iOS, Android, macOS, Windows, Linux, and the Web from a single Dart codebase, with P2P device sync
  and end-to-end encryption.
sourceDescription: Fingrom -- open-source platform-agnostic financial accounting application
licenses:
  - noassertion
links:
  github: https://github.com/lyskouski/app-finance
tags:
  - accounting
  - budget-app
  - budget-tracker
  - finance-app
  - finance-application
  - finance-management
  - finance-tracker
  - flutter-app
  - money-manager
  - open-source
  - personal-finances
seo:
  title: Fingrom – Open Source Personal Finance & Accounting App
addedAt: 2026-08-11
source:
  type: github-topic
  owner: lyskouski
  repo: app-finance
  url: https://github.com/lyskouski/app-finance
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Fingrom is an open-source, ad-free personal finance manager built with
Flutter from a single Dart codebase and shipped to iOS, Android, macOS,
Windows, Linux, and the Web. Its aim is to be "intuitive, efficient,
and inclusive" — a privacy-respecting alternative to commercial money
trackers, distributed under CC BY-NC-ND 4.0.

## Why it matters

- **True cross-platform.** One `lib/` directory, eight platform folders
  (`android`, `ios`, `macos`, `linux`, `linux-flatpak`, `linux-appimage`,
  `windows`, `web`). The same widgets, charts, and transaction logic
  run on a phone, a desktop, or a browser tab.
- **Multi-currency and crypto from the ground up.** Accounts can hold
  fiat and cryptocurrency side by side, with frozen balances keyed by
  update date so historical imports don't corrupt running totals.
- **Forecast-grade analytics.** Fingrom ships a Monte Carlo budget
  simulator, OHLC candlestick charts per account, an Income Health
  Radar, YTD expense bars, and a category bar-race visualization that
  turns the year into a one-glance story.
- **P2P sync without a cloud account.** Devices discover each other
  with `peerdart` / WebRTC and reconcile directly, with WebDAV and
  file-based recovery as fallbacks. There is no central server
  required.

## How it works

The app follows a conventional Flutter layered structure: private
`_classes`, `_configs`, `_ext`, and `_mixins` modules form the core,
while `pages/`, `components/`, `design/`, `charts/`, and `l10n/`
make up the presentation layer. State is driven by `provider` and
`solidart`; persistent storage uses `shared_preferences` and
`path_provider`; data import/export runs through `csv` and `excel`.

Transactions are entered with category prediction, can be split
across multiple budget categories, and support recurring rules with
an Android home-screen widget for "what's due today". Budget
categories honor monthly limits expressed either as absolute amounts
or as a fraction of income (0.0–1.0), aggregated on weekly, monthly,
or yearly timelines with configurable start-of-week and
start-of-month days.

Security wraps the whole thing: data is encrypted at rest, gated by
biometric auth (`local_auth`) plus optional TOTP (`simple_totp_auth`)
and recovery codes. Import paths are open — `CSV`, `QIF`, and `OFX`
in; `XLSX` out — so users are not locked in.

## Caveats

- **Non-commercial license.** CC BY-NC-ND 4.0 forbids commercial use
  and derivative works; improvements must flow back upstream.
- **License metadata is `noassertion`.** The repo does not declare a
  single OSI-recognized license, so downstream re-use needs careful
  review of every third-party asset.
- **Wide release surface.** Builds target eight platforms and at
  least four mobile stores plus Linux Snap/Flathub/AppImage, which
  means the test matrix is large and release cadence is uneven.

## Deployment notes

```bash
git clone https://github.com/lyskouski/app-finance.git
cd app-finance
flutter pub get
flutter run -d chrome   # or any other target device
```

**Minimum:** any device that runs a recent Flutter SDK (>=3.0.5,
<4.0.0). No backend required for single-device use; WebDAV or a
second peer is needed only for sync and recovery.

**Integration tip:** if you curate an Astro/Grove directory, Fingrom
is the canonical "self-hosted personal finance" example for any app
tagged `finance-app`, `budget-tracker`, or `money-manager` — its
single-codebase-to-eight-platforms story is also a strong reference
for cross-platform Flutter showcases.
