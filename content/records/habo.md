---
name: Habo
repoUrl: https://github.com/xpavle00/Habo
projectType: real-app
category: productivity
stack: flutter
summary: Built by a single maintainer as a minimalist alternative to gamified habit apps, Habo
  supports boolean and numeric habits, an Atomic-Habits-style cue/routine/reward model, calendars
  and streaks, and optional zero-knowledge sync that can be pointed at a self-hosted Supabase
  instance. The codebase is a clean ~23k-line Flutter app with a dedicated encryption service, a
  sync manager, and a RevenueCat-backed subscription for the hosted sync tier.
description: Habo is a Flutter-based, privacy-first habit tracker for iOS and Android that keeps
  every habit, note, and streak on-device by default and only syncs through an end-to-end encrypted
  Supabase backend.
sourceDescription: Privacy-first habit tracker for iOS and Android. E2EE sync, self-hostable, built with Flutter.
licenses:
  - gpl-3.0
links:
  github: https://github.com/xpavle00/Habo
tags:
  - android
  - backup
  - e2e-encryption
  - flutter
  - habit-tracker
  - ios
  - minimalistic
  - simple
  - sync
seo:
  title: Habo – Open Source Privacy-First Habit Tracker
addedAt: 2026-08-11
source:
  type: github-topic
  owner: xpavle00
  repo: Habo
  url: https://github.com/xpavle00/Habo
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Habo is a minimalist, privacy-first habit tracker for iOS and Android
built in Flutter by a single maintainer. It stores habits locally in
SQLite by default, requires no account to use, and only reaches the
network when the user opts in to Habo Sync — a zero-knowledge layer
that runs on top of any Supabase project, including one you host
yourself.

## Why it matters

- **Zero-knowledge sync, not just "encrypted in transit."** Habo derives
  a 256-bit key from the user's Master Password using Argon2id (19 MB,
  2 iterations) and encrypts every record with AES-GCM 256 before it
  ever leaves the device; the Supabase backend only ever sees
  ciphertext and metadata. The encryption code lives in a dedicated
  `EncryptionService` that wraps the `cryptography` and
  `flutter_secure_storage` packages and is small enough to audit.
- **A real habit model, not a checklist.** Habits carry
  Atomic-Habits-style fields (`cue`, `routine`, `reward`, `sanction`,
  `accountant`) plus a `twoDayRule` toggle. Day entries are typed
  (`clear`, `check`, `fail`, `skip`, `progress`), so a "skip" can
  break a streak but a "fail" preserves the history — and numeric
  habits track a target, a partial value, and a unit for things like
  "drink 2 L of water."
- **Self-hostable without forking.** The `supabase/` directory ships
  migrations and a `delete-account` edge function; pointing Habo at
  your own Supabase project is a `npx supabase link && npx supabase db
  push && npx supabase functions deploy` away. The hosted sync tier
  uses RevenueCat under the entitlement `Habo Sync`, but flipping the
  self-hosted toggle short-circuits the paywall.
- **Cross-platform polish.** The same Flutter codebase targets iOS,
  Android, macOS, Linux, and a 170×170 home-screen widget that renders
  today's completion progress as a circular painter. Themes ship in
  five flavors — device, light, dark, OLED, and Material You — and
  the app supports biometrics via `local_auth`.

## How it works

The app boots in `main.dart`, which loads `.env` secrets, restores any
custom Supabase URL/anon key from `SharedPreferences`, then hands off
to a `ServiceLocator` that wires the SQLite repositories, the
notification service, and the sync stack. The repository layer is
deliberately split: abstract `HabitRepository`, `EventRepository`,
`CategoryRepository`, and `BackupRepository` interfaces in
`repositories/` are implemented by the corresponding
`sqlite_*_repository.dart` classes, so the persistence backend is
swappable.

The UI is built around a single `HabitsManager` provider. It owns the
in-memory `SplayTreeMap<DateTime, List>` of events per habit and
recomputes streaks on every check-in. The home screen (`habits_screen.dart`)
draws a `table_calendar`-based grid per habit, an inline
`InButton` / `OneDayButton` for logging, and a `SyncStatusIndicator`
that listens to `SyncStatus` enum changes emitted by `SyncManager`.

When sync is enabled, `SyncManager` (a `WidgetsBindingObserver`)
pushes deltas when the app backgrounds and pulls when it foregrounds,
with a debounce timer to coalesce rapid edits. The Master Password
screen, account password screen, delete-account screen, and email
verification view all live under `lib/screens/` and feed into the same
`SyncService`. Translations are generated from the 20+ `.arb` files in
`lib/l10n/` via `flutter_intl`, and the community contributes new
locales through Weblate rather than GitHub PRs.

## Caveats

- **One-person project.** Habo is maintained solo by Peter Pavlenko; a
  broken release or stalled roadmap has no fallback maintainer, so
  self-hosters should track upstream closely.
- **Sync is opt-in but paywalled.** The free app fully works offline; cross-device sync needs either the
  "Habo Sync" subscription (RevenueCat) or the effort to stand up your
  own Supabase project, apply migrations, and deploy the edge
  function. There is no peer-to-peer or LAN-only sync.
- **Mobile-only by design.** Although the `linux/` and `macos/`
  Flutter folders ship, the UX is centered on a phone habit loop —
  no web build, no desktop polish, and no tablet-specific layouts.
- **License is GPL-3.0.** Acceptable for personal use; any commercial
  fork has to publish its modifications.

## Deployment notes

```bash
git clone https://github.com/xpavle00/Habo.git
cd Habo
flutter pub get
flutter run          # mobile / desktop
```

For the self-hosted sync backend:

```bash
cd supabase
npx supabase link --project-ref <your-project-ref>
npx supabase db push
npx supabase functions deploy delete-account
```

Then in the app open **Settings → Server**, paste your Supabase URL
and anon key, and tap **Test Connection & Save**. Pre-built binaries
are available on Google Play, the App Store, and IzzyOnDroid; the F-Droid
listing is community-maintained.

**Integration tip:** if you curate a Grove-style directory like this
one, Habo is the canonical example for any record tagged
`habit-tracker` *or* `e2e-encryption` — the encryption service is
small enough to read in a sitting, and the Supabase migration set is
a clean template for "optional sync" in other self-hostable apps.