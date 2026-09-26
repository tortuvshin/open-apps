---
name: sossoldi
repoUrl: https://github.com/RIP-Comm/sossoldi
projectType: real-app
category: finance
stack: flutter
summary: A community-maintained Flutter app that replaces a spreadsheet-based net worth tracker with
  a polished cross-platform client. It uses Riverpod for state, SQLite for fully local storage,
  fl_chart for visualizations, and is published through the App Store, Google Play, and F-Droid.
description: Sossoldi is an MIT-licensed, Flutter-built personal wealth manager that tracks net
  worth, expenses, income, and investments across iOS, Android, macOS, Windows, Linux, and the Web
  from a single Dart codebase.
sourceDescription: "\"Sossoldi\" is a wealth management / personal finance / Net Worth tracking app,
  made with Flutter."
licenses:
  - mit
links:
  github: https://github.com/RIP-Comm/sossoldi
tags:
  - dart
  - flutter
  - personal-finance
  - wealth-management
seo:
  title: Sossoldi – Open Source Net Worth & Personal Finance Tracker
addedAt: 2026-08-11
source:
  type: github-topic
  owner: RIP-Comm
  repo: sossoldi
  url: https://github.com/RIP-Comm/sossoldi
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Sossoldi is a free, MIT-licensed wealth management app built with Flutter
by the RIP-Comm community. It exists to replace a blogger's Google Sheets
net worth tracker with a friendly mobile and desktop client, so
non-technical users can track net worth, expenses, and investments
without touching a spreadsheet. The codebase is a single Dart project
that ships to iOS, Android, macOS, Windows, Linux, and the Web.

## Why it matters

- **Truly cross-platform from one tree.** The repo contains
  `android/`, `ios/`, `macos/`, `windows/`, `linux/`, and `web/`
  folders alongside a shared `lib/`. The same screens, charts, and
  database code run on a phone, a desktop, or a browser tab.
- **Local-first by design.** All financial data is stored on the
  device using `sqflite` (with `sqflite_common_ffi` for desktop and
  `sqlite3_flutter_libs` for the native bindings). There is no
  required backend, so privacy-sensitive totals never leave the
  device unless the user explicitly shares them.
- **Modern Flutter stack.** State is managed with `flutter_riverpod`
  (3.x) plus `riverpod_annotation` and `riverpod_generator`, models
  are built with `freezed` and `json_serializable`, and `fl_chart`
  powers the charts. Code generation runs through `build_runner`,
  and the project is pinned to Flutter 3.10.7 via an `.fvmrc` file.
- **Polished UX foundation.** Assets include a custom NunitoSans
  font family (regular + italic weights from 200 to 900), native
  splash screens, generated launcher icons, and `fl_chart` visual
  reports — all batteries-included in the repo.

## How it works

The `lib/` directory follows a conventional layered layout:
`constants/`, `model/` (domain entities), `providers/` (Riverpod
state), `services/` (persistence and platform plumbing), `pages/`
(screen-level UI), `routes/`, and `ui/` (reusable widgets). The entry
point is `lib/main.dart`, which wires the Riverpod providers into
the route tree.

Persistence is built around SQLite. `sqflite` provides the database
on mobile, while `sqflite_common_ffi` activates the desktop bindings
on macOS, Windows, and Linux. `path_provider` resolves the database
file location, `shared_preferences` stores small settings, and
`flutter_local_notifications` plus `timezone` power recurring
transaction reminders. `local_auth` gates access behind biometrics on
devices that support it.

The Phase 1 feature set covers a Dashboard, a Movements page, basic
Onboarding, and basic Settings, with bank account balances entered
manually (PSD2 Open Banking API integration is on the roadmap).
Visualization uses `fl_chart`; imports and exports flow through the
`csv` and `file_picker` packages; `device_info_plus`, `package_info_plus`,
`url_launcher`, and `permission_handler` fill in the platform-introspection
glue. The test suite runs on `test` with `flutter_lints` enforcing
style, and `dependency_validator` keeps the dependency tree honest.

## Caveats

- **Early-stage roadmap.** The Phase 1 list (expenses, income, basic
  statistics, local-only storage) is still in progress; investment
  tracking, multi-currency, tax, and PSD2 integration are planned but
  not yet shipped.
- **Spreadsheet-first origins.** The data model is designed around a
  single user's net worth tracker, so multi-user or household
  scenarios are not yet supported.
- **Cross-platform data sharing is manual.** Cross-platform sharing
  is listed as a feature, but in the current build users move data
  between devices via import/export rather than sync, so there is no
  automatic cloud reconciliation.

## Deployment notes

```bash
git clone https://github.com/RIP-Comm/sossoldi.git
cd sossoldi
fvm install              # honors .fvmrc (Flutter 3.10.7)
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run              # or: flutter run -d chrome
```

**Distribution:** official builds are published on the
[App Store](https://ios.sossoldi.com),
[Google Play](https://android.sossoldi.com), and
[F-Droid](https://f-droid.org/it/packages/com.ripster.sossoldi/).
Project documentation lives at
<https://rip-comm.github.io/sossoldi/>; community chat is on
Discord (`discord.sossoldi.com`).

**Integration tip:** if you curate an Astro/Grove directory like
this one, Sossoldi is the canonical "local-first Flutter finance"
example for any app tagged `personal-finance` or `wealth-management`
— its single-codebase-to-six-platforms story also makes a strong
reference for cross-platform Flutter showcases.