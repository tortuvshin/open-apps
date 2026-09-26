---
name: mhabit
repoUrl: https://github.com/FriesI23/mhabit
projectType: real-app
category: productivity
stack: flutter
summary: A cross-platform Flutter habit tracker with separate scoring models for "do" and "don't"
  habits, growth-curve visualizations, and WebDAV sync via Nextcloud, Koofr, or any self-hosted
  endpoint.
description: mhabit (Table Habit) is a Flutter-based micro-habit tracker that scores daily
  completion against configurable curves, stores everything locally, and syncs across devices
  through any WebDAV endpoint.
sourceDescription: Open-source Flutter habit tracker with smart scoring, WebDAV sync, local-first
  storage, privacy-focused design, and support for Android, iOS, Windows, macOS, and Linux.
licenses:
  - apache-2.0
links:
  github: https://github.com/FriesI23/mhabit
tags:
  - android
  - cross-platform
  - dart
  - flutter
  - goal-tracking
  - habit-tracker
  - habit-tracking
  - ios
  - linux
  - local-first
  - macos
  - material3
  - micro-habit
  - offline-first
  - open-source
  - privacy-focused
  - productivity
  - self-improvement
  - webdav
  - windows
seo:
  title: mhabit – Open Source Habit Tracker with WebDAV Sync
addedAt: 2026-08-11
source:
  type: github-topic
  owner: friesi23
  repo: mhabit
  url: https://github.com/FriesI23/mhabit
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
mhabit, marketed under the name **Table Habit**, is a Flutter-built
micro-habit tracker that treats each habit as a colored row in a
calendar and scores daily completion against a configurable growth
curve. It is local-first, requires no account, and syncs across
devices through any WebDAV endpoint you already control —
Nextcloud, Koofr, or a self-hosted server. The single-author project
ships builds for Android, iOS, macOS, Windows, and Linux via Google
Play, the App Store, F-Droid, Flathub, and the Microsoft Store.

## Why it matters

- **Two scoring models, not just streaks.** "Do" habits track how
  often you completed them and how recently; "don't" habits (e.g.
  "no smoking") track the gap since the last slip. Both render as
  growth-curve charts that smooth out missed days instead of
  resetting to zero.
- **WebDAV sync, no vendor.** Any standards-compliant WebDAV server
  becomes your backend. There is no proprietary relay, no account,
  and no telemetry — the payload is a SQLite snapshot over HTTPS.
- **Material 3 + Dynamic Color.** On Android 12+ the app theme
  derives from your wallpaper; per-habit color overrides and
  `flex_color_picker` give you fine control over the calendar.
- **Loop Habit Tracker migration.** Native JSON export plus a CSV
  importer compatible with Loop Habit Tracker makes mhabit a drop-in
  destination for users leaving a dormant project.
- **Truly global.** 18+ languages on Weblate, full RTL support for
  Arabic, Hebrew, and Persian, and locale-correct date and number
  formatting throughout.

## How it works

The codebase is a Flutter monorepo managed with Melos, with internal
packages like `mhabit_color_builder` and `mhabit_proxy_builder`
isolating UI generation and proxy boilerplate from the app shell.
State uses `provider` and `rxdart`; routing runs through `go_router`;
persistence sits on `sqflite` with `flutter_secure_storage` holding
secrets and `shared_preferences` holding settings.

Habit data renders through two chart engines: `fl_chart` for the
growth-curve detail view and `simple_heatmap_calendar` for the grid
that dominates the home screen. `animated_reorderable_list` keeps
habit-group rearrangement smooth on older Android devices, and
`flutter_local_notifications` handles reminders. The WebDAV sync
flow, built on `simple_webdav_client`, conflict-checks the server's
last-modified timestamp before committing the local snapshot.

## Caveats

- **Single-user assumption.** The data model is one install, one
  author — no multi-user or shared-household mode.
- **WebDAV sync is DIY.** You need an existing WebDAV endpoint (or
  must stand one up); there is no hosted option.
- **No home-screen widgets yet.** Android and iOS widgets are on
  the roadmap but not shipped as of v1.26.
- **Indie release cadence.** Updates are frequent but support rests
  with a single maintainer.
- **License is Apache-2.0.** Permissive enough for commercial
  forks, but adopters should review the trademark posture around
  the "Table Habit" name.

## Deployment notes

For end users, the simplest path is installing from a familiar
store — Google Play, the App Store, F-Droid, Flathub, or the
Microsoft Store. To build from source:

```bash
git clone https://github.com/FriesI23/mhabit.git
cd mhabit
flutter pub get
flutter run
```

**Minimum:** A device capable of running Flutter 3.x. Storage
stays well under 50 MB for typical habit histories, and SQLite
keeps lookups fast well past several years of daily entries.

**Integration tip:** in a directory like this one, pair mhabit with
any `local-first` or `privacy-focused` record — it is the
counterpart to hosted habit apps the way Daily You is the
counterpart to hosted journals, and a clean example of WebDAV as
a sync substrate for indie Flutter projects that want to avoid
running their own backend.
