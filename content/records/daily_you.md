---
name: Daily_You
repoUrl: https://github.com/Demizo/Daily_You
projectType: real-app
category: tools
stack: flutter
summary: A Flutter-built daily journal that stores entries, mood ratings, photo memories, and
  Markdown notes in a local SQLite database across six desktop and mobile platforms, with a
  flashback feature that resurfaces past entries on anniversaries.
description: Daily You is a privacy-first, offline-capable journaling app for capturing daily
  entries with text, mood ratings, photo memories, and Markdown notes — all stored locally with no
  accounts, ads, or telemetry.
sourceDescription: Daily diary & journaling app
licenses:
  - gpl-3.0
links:
  github: https://github.com/Demizo/Daily_You
tags: []
seo:
  title: Daily You – Open Source Diary & Journaling App
addedAt: 2026-08-11
source:
  type: github-topic
  owner: demizo
  repo: daily_you
  url: https://github.com/Demizo/Daily_You
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Daily You is a Flutter-built, offline-first daily journal that keeps
every entry on-device — no accounts, no ads, no telemetry. Its tagline,
"Every day is worth remembering," frames the app as a private space
for capturing thoughts, rating mood, attaching photos, and writing
Markdown notes that you fully own. A backup-and-restore flow plus an
"Import From Another App" path make it a credible migration target
for users leaving hosted journal services.

## Why it matters

- **Local-first by design.** Entries, tags, templates, and photo blobs
  live in a SQLite database on the device (with optional external
  storage), so the journal works without a network and stays
  exportable as plain JSON.
- **Cross-platform parity.** A single Flutter codebase targets
  Android, iOS, Linux, macOS, Windows, and Snap, so desktop and
  phone share entries through the standard backup-restore flow.
- **Mood and flashbacks.** Each entry carries an optional mood
  score, and a `flashback_manager` resurfaces "on this day" entries
  from prior years — a private TimeHop whose tone you can tune by
  excluding low-mood days.
- **F-Droid friendly.** A Nix flake, an `AppImageBuilder` config, and
  reproducible Android builds let the app ship on F-Droid,
  IzzyOnDroid, and GitHub Releases without modification.

## How it works

The app is structured around a thin DAO layer over `sqflite`: each
domain entity (entries, tags, tag categories, images, templates) has
its own DAO under `lib/database/`, and `app_database.dart` wires
migrations. A `provider`-based state tree feeds a Material 3 UI with
pages for the home timeline, entries list, edit page, statistics
(backed by `fl_chart`), and a settings page that hosts backup,
restore, import, theme, notification, and calendar options.

The standout piece is `lib/flashback_manager.dart`: given the current
locale and calendar (Gregorian or Jalali, via the `shamsi_date`
dependency), it walks reversed entries and groups past entries by
day, week, month, and year, producing a surfaced "memories" feed on
the home page. Notifications come from `flutter_local_notifications`
plus `android_alarm_manager_plus` for random daily reminders, and
`local_auth` gates the app behind biometrics where supported.

## Caveats

- **No cloud sync.** Daily You does not ship its own sync server; you
  move data between devices manually via backup files, WebDAV, or
  shared external storage.
- **Single user.** There is no concept of multiple journals or
  accounts in the data model — one install, one author.
- **GPL-3.0.** Fine for personal use and community forks, but
  commercial derivative apps must publish their changes.
- **Jalali is opt-in.** Persian-calendar users get full date
  handling, but switching back to Gregorian can leave flashback
  grouping inconsistent until enough entries accrue.

## Deployment notes

For end users, the simplest path is installing from F-Droid or
IzzyOnDroid on Android; iOS, macOS, Windows, and Linux builds live
on the GitHub Releases page.

To build from source:

```bash
git clone https://github.com/Demizo/Daily_You.git
cd Daily_You
nix develop          # or: install Flutter (>=3.0) and `flutter pub get`
flutter run
```

**Minimum:** Any device that runs Flutter 3.0+. Expect ~50–100 MB of
local storage for a year of mixed text-and-photo entries; SQLite
keeps lookup fast well past 10,000 entries.

**Integration tip:** in a directory like this one, pair Daily You
with any privacy- or self-hosting-tagged record. If you already
list `immich` or `joplin`, position Daily You as the "private diary"
counterpart — same GPL-3.0 / no-account philosophy, but for the
short-form reflections that don't belong in a note-taking app.
