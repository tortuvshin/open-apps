---
name: Monekin
repoUrl: https://github.com/enrique-lozano/Monekin
projectType: real-app
category: finance
stack: flutter
summary: An ad-free, offline-first Flutter finance app whose every transaction, budget, and
  investment lives in an on-device SQLite database, with Material You theming, per-account
  multi-currency support, and recurring-transaction automation for Android and Windows.
description: Monekin is an offline-first, open-source Flutter personal finance manager that tracks
  unlimited accounts, transactions, budgets, goals, investments, and debts across 50+ currencies,
  storing every byte on-device in SQLite with no account, no ads, and no internet connection
  required.
sourceDescription: A 100% Open Source app that tries to make personal finances easier. Fast, simple,
  without ads, without the need for an Internet connection and with a groundbreaking design, that's
  Monekin.
licenses:
  - agpl-3.0
links:
  github: https://github.com/enrique-lozano/Monekin
tags:
  - finance-management
  - flutter-app
  - hybrid-app
  - material-design
  - money-manager
  - open-source
  - personal-finances
seo:
  title: Monekin – Open Source Offline Personal Finance App
addedAt: 2026-08-11
source:
  type: github-topic
  owner: enrique-lozano
  repo: Monekin
  url: https://github.com/enrique-lozano/Monekin
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Monekin is an open-source, offline-first personal finance manager
written in Flutter from a single Dart codebase and currently shipping
to Android (Google Play) and Windows (GitHub releases / Microsoft
Store). It targets users who want unlimited accounts, transactions,
budgets, goals, investments, and debts without ever handing their
ledger to a third party — every byte lives in a local SQLite
database, and the app works without an internet connection.

## Why it matters

- **Truly local-first.** No accounts, no cloud sync, no telemetry.
  Storage is a single SQLite file managed through [Drift](https://github.com/simolus3/drift)
  (formerly Moor), with the schema split across
  `lib/core/database/sql/`. Backups export to a local file that can
  be restored on another device.
- **Real feature surface, not a sample.** Monekin ships multi-account
  bookkeeping, recurring-transaction automation for bills and
  subscriptions, budgets with category icons, savings goals,
  net-worth tracking, investment and debt ledgers, 50+ currencies
  with customizable exchange rates, CSV import/export, and an
  `fl_chart`-powered statistics screen.
- **Material You theming.** `dynamic_color` derives a palette from
  the Android 12+ wallpaper, with an AMOLED dark mode and accent
  picker as fallbacks. The layout collapses to an
  `AppNavigationSidebar` on tablet and desktop.
- **Mature, not abandoned.** First released on Google Play in October
  2021 (originally Ionic + Angular), migrated to Flutter in 2023,
  the codebase has over 1,000 commits and is at release
  `9.2.1+920001` with active PRs and a translated UI.

## How it works

The codebase follows a clean three-tier split under `lib/`.
`lib/app/` is feature-organised by domain — `accounts`,
`transactions`, `budgets`, `categories`, `currencies`, `debts`,
`goals`, `home`, `settings`, `stats`, `tags`, `onboarding` — each
with its own pages and widgets. `lib/core/` is the
framework-independent layer: `database/` wraps Drift, `models/`
defines typed records, `services/` exposes `UserSettingService`,
`AppDataService`, and `PrivateModeService` as `.instance` singletons,
`routes/` owns navigation, and `presentation/` collects shared
themes, animations, and widgets.

State management is deliberately lightweight: two global maps
(`appStateSettings`, `appStateData`) hold preferences and app flags,
an `appStateKey` `GlobalKey` exposes `refreshAppState()` so any
widget can trigger a root rebuild, and the root reads from those
maps inside `build()`. Internationalization runs through `slang`,
charting through `fl_chart`, and the desktop frame through
`bitsdojo_window` on Windows.

## Caveats

- **AGPL-3.0 license.** Acceptable for personal use; commercial forks
  must publish their modifications.
- **Limited platform reach today.** Android and Windows are shipping;
  iOS, macOS, Linux, and the Web are not yet first-class targets
  despite the Flutter codebase making them technically reachable.
- **In-app purchase dependency.** `in_app_purchase` is bundled in
  `pubspec.yaml`, so any source build needs to configure billing or
  strip the plugin — the README still markets the app as
  "free, forever".
- **Backup portability.** Backups are local files; there is no
  built-in cross-device sync, so migrating between phones requires
  a manual export/import cycle.

## Deployment notes

```bash
git clone https://github.com/enrique-lozano/Monekin.git
cd Monekin
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run -d android    # or: flutter run -d windows
```

**Minimum:** Flutter 3.44.1, Dart `>=3.10.1 <4.0.0`, plus a recent
Android SDK or Windows 10+ for the desktop target. Drift's
code-generation step (`build_runner`) must run after a fresh clone
and after any schema change in `lib/core/database/`.

**Integration tip:** if you curate an Astro/Grove directory like
this one, Monekin is a clean reference for any record tagged
`offline-first` or `money-manager` — its Drift schema split,
feature-organised `lib/app/` layout, and singleton-service state
model are easy to lift into a similar Flutter project.
