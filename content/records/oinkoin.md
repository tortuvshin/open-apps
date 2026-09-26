---
name: oinkoin
repoUrl: https://github.com/emavgl/oinkoin
projectType: real-app
category: finance
stack: flutter
summary: A privacy-first, ad-free personal-finance tracker written in Flutter that stores expenses,
  incomes, transfers, and budgets in a local SQLite database, syncs nothing to the cloud, and
  exposes charts, CSV import, and biometric app-lock out of the box. PRO unlocks encrypted backups,
  recurring patterns, tags, and custom date ranges, and the whole thing ships in 24 locales.
description: Oinkoin is an offline-first Flutter expense tracker that keeps every record in a local
  SQLite database, ships with biometric app-lock and CSV import, and adds wallets, recurring
  records, and tags behind a paid PRO build that doubles as the project's funding model.
sourceDescription: Oinkoin is a flutter app for helping you managing your expenses. No internet required.
licenses:
  - gpl-3.0
links:
  github: https://github.com/emavgl/oinkoin
tags: []
seo:
  title: Oinkoin – Open Source Offline Expense Tracker
addedAt: 2026-08-11
source:
  type: github-topic
  owner: emavgl
  repo: oinkoin
  url: https://github.com/emavgl/oinkoin
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Oinkoin is a privacy-first personal-finance tracker written in Flutter.
Every expense, income, transfer, and recurring pattern lives in a local
SQLite database (`sqflite` on mobile, `sqflite_common_ffi` on desktop) —
the app never makes a network call, never asks for runtime permissions
beyond biometric app-lock, and ships to Android, iOS, Linux, Windows,
and macOS from a single Dart codebase. Android is the actively published
target; iOS and desktop packages live in the tree but are not
distributed.

## Why it matters

- **Offline by structure.** `ServiceConfig` wires up only the local
  SQLite singleton (`SqliteDatabase.instance`, schema version 28),
  `SharedPreferences`, and the file system for backups. There is no
  telemetry endpoint in the runtime, so the privacy claim is
  architectural, not just policy.
- **Real domain model.** `lib/models` carries first-class types for
  `Record`, `Category`, `Wallet`, `Profile`, `RecurrentRecordPattern`,
  and tag associations. Wallet-to-wallet transfers store a separate
  `transferValue` so the same movement updates two wallets without
  double-counting in statistics; categories support emoji icons,
  custom colours, and a soft-archived state.
- **Charts over the same model.** `community_charts_flutter` powers
  the balance and per-category views; the `statistics/` module exposes
  aggregated lists, balance charts, and CSV export built on top of the
  same `Record` type the UI uses.
- **PRO as the funding model.** The free build covers the daily-driver
  workflow; a paid unlock (also free on F-Droid) adds encrypted
  backup/restore (`encrypt` + `crypto`, AES-encrypted JSON written to
  `/storage/emulated/0/Documents/oinkoin`), recurring patterns, tags,
  and custom date ranges. Donations also go via Bitcoin, Monero, and
  Buy Me a Coffee.
- **24 locales.** Translation files in `assets/locales/` cover English,
  Italian, German, French, Spanish, both Portuguese variants, Russian,
  Arabic, Chinese, Turkish, Polish, and more, managed through
  `i18n_extension`.

## How it works

`lib/main.dart` bootstraps timezone data, `local_auth`, package info,
home-screen quick actions (`add_expense` / `add_income`), and a
`talker_flutter` logger before handing off to `lib/shell.dart`. The
shell is a bottom-nav scaffold with four per-tab navigators (Records,
Categories, Wallets, Settings); each tab keeps a `GlobalKey` so quick
actions and deep links can refresh the right state without rebuilding
the tree.

`SqliteDatabase` is a singleton that opens `movements.db` at
`getDatabasesPath()` on mobile and under the application documents
directory on desktop, routing through `SqliteMigrationService` to
bring older installs up to the current schema version. `BackupService`
wraps that database in an AES-encrypted JSON envelope, and
`RecurrentRecordService` materialises patterns into `Record` rows
anchored to the pattern's original IANA timezone so DST shifts do not
drift the recurrence.

Other dependencies that earn their place: `intl` for locale-aware
currency rendering, `share_plus` for backup share sheets,
`emoji_picker_flutter` for category icons, `file_picker` for imports,
`flutter_speed_dial` for the add-record FAB, `month_picker_dialog`
for stat drill-downs, `flutter_colorpicker` for categories,
`auto_size_text` for dense tiles, and `app_review_dialog` for the
gentle rating nudge.

## Caveats

- **Android-first distribution.** Google Play ships the free build
  and the paid PRO build; F-Droid carries PRO for free but lags Play
  by a release or two. iOS, Linux, Windows, and macOS targets are in
  the repo but not published.
- **PRO gates serious workflows.** Backup/restore, recurring records,
  tags, and custom date ranges sit behind the paid unlock; either
  accept those gaps or pull F-Droid's free PRO build.
- **Single-device by design.** There is no cloud sync — backups are
  local JSON files (encrypted in PRO, plain in free).
- **GPL-3.0 license.** Forks must publish source modifications; fine
  for personal use, restrictive for closed-source redistribution.

## Deployment notes

Download the latest APK from the GitHub releases page (built by the
in-repo GitHub Actions workflows), install from Google Play, or grab
PRO from F-Droid. Pairing the GitHub release URL with
[Obtainium](https://github.com/ImranR98/Obtainium) gives self-updating
installs.

```bash
git clone https://github.com/emavgl/oinkoin.git
cd oinkoin
flutter pub get
flutter run -d android      # or ios / linux / macos / windows
```

Schema changes go through `SqliteMigrationService`; if you fork,
bump the static `SqliteDatabase.version` and add a migration step.
The backup envelope is JSON containing categories, wallets, records,
tags, and profile rows, optionally AES-encrypted with a user-supplied
passphrase.
