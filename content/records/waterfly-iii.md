---
name: waterfly-iii
repoUrl: https://github.com/dreautall/waterfly-iii
projectType: real-app
category: finance
stack: flutter
summary: An unofficial Flutter client for Firefly III that turns the self-hosted finance server into
  a pocket-sized daily driver, with synced accounts, transactions, piggy banks, budgets, and bills
  alongside dynamic color themes and an Android-only notification listener that prefills
  transactions from banking apps.
description: Waterfly III is a Flutter-built Android and iOS client for the self-hosted Firefly III
  personal finance manager, wrapping its REST API into a Material 3 mobile experience with offline
  dashboard charts, notification-driven transaction capture, and biometric app lock.
sourceDescription: Unofficial Android App for Firefly III, a free and open source personal finance manager.
licenses:
  - mit
links:
  github: https://github.com/dreautall/waterfly-iii
tags:
  - android
  - application
  - firefly-iii
  - fireflyiii
  - flutter
  - material-design-3
seo:
  title: Waterfly III – Open Source Firefly III Client for Android
addedAt: 2026-08-11
source:
  type: github-topic
  owner: dreautall
  repo: waterfly-iii
  url: https://github.com/dreautall/waterfly-iii
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Waterfly III is an unofficial Flutter mobile client for the self-hosted
Firefly III personal finance manager. It wraps Firefly III's REST API in
a Material 3 interface aimed at people who already run their own Firefly
server and want a phone-first way to check balances, log transactions,
and watch budgets without opening a browser tab.

## Why it matters

- **The official Firefly III experience is a web app.** Waterfly III is
  the de facto mobile companion for the project, with ~690 stars and
  active releases on Google Play, F-Droid-adjacent GitHub builds, and an
  open beta channel. The README explicitly says the design is inspired
  by Bluecoins and that the app goes beyond a thin REST wrapper.
- **Material 3 first, with dynamic color.** The app pulls a wallpaper
  palette via `dynamic_color` and falls back to a custom Firefly-tinted
  scheme. Light and dark themes are first-class, and the app feels at
  home on Android 12+ devices without bespoke theming effort.
- **Notification-driven transaction capture (Android only).** A
  `notifications_listener_service` integration watches incoming
  notifications from Google Pay, banking apps, and other sources, then
  offers to pre-fill a new transaction with the detected amount and
  description. This is the headline mobile-native feature Firefly III
  itself does not ship.
- **No trackers, lean dependency tree.** The maintainer is explicit
  that the app carries no analytics or telemetry, and the pubspec.yaml
  reflects that intent: HTTP via `chopper` + `cronet_http`, secure
  storage via `flutter_secure_storage`, state via `provider`, charts
  via `syncfusion_flutter_charts` and the `community_charts_flutter`
  fork.

## How it works

The Flutter app is split into a handful of focused modules under `lib/`:

- `pages/` holds the per-screen UI for dashboard, transactions,
  accounts, categories, piggy banks, and bills, each backed by a
  Chopper-generated service that talks to the Firefly III REST API.
- `auth.dart` and `settings.dart` manage the personal access token
  flow: the user supplies a Firefly III URL plus a token, the app
  stores both in `flutter_secure_storage`, and `local_auth` enforces a
  biometric or device-credential unlock on subsequent launches.
- `notificationlistener.dart` registers the Android notification
  listener permission and turns captured notifications into draft
  transactions through the standard add-transaction flow.
- `generated/` contains the Chopper and `swagger_dart_code_generator`
  output against the Firefly III OpenAPI spec, so the surface area
  stays in sync with the server as it evolves.
- `l10n/` carries ARB files; the project is fully translated through
  Crowdin and falls back to English when a locale is missing.

Charts on the dashboard are rendered locally with Syncfusion, the
piggy-bank and bill views are paginated via
`infinite_scroll_pagination`, and quick actions (`quick_actions`) let
the user jump straight to "new transaction" from the launcher icon.

## Caveats

- **Android-leaning feature set.** The notification listener,
  `flutter_sharing_intent`, and quick-actions integrations are
  Android-first. iOS builds work for the core flows but lack the
  automatic capture-from-notifications feature.
- **Depends on a running Firefly III server.** Waterfly III is a
  client, not a standalone finance app. The value is in pairing it
  with a self-hosted Firefly III instance; without one, the app has
  nothing to talk to.
- **Syncfusion licensing.** The charts use Syncfusion's Flutter
  package, which carries a commercial license for some uses. The
  community fork is shipped as a fallback, but downstream repackagers
  should review the Syncfusion license terms.
- **Active but small project.** 4,000+ commits on master and a steady
  open-beta cadence, but the contributor count is low and the project
  explicitly has no fixed release schedule.

## Deployment notes

Waterfly III is distributed as a mobile app, not a server:

- **Stable release:** Google Play Store ("Waterfly III") and signed
  APKs on the GitHub releases page.
- **Open beta:** separate Google Play track for users who want faster
  builds.
- **Source build:** `flutter pub get` followed by `flutter run` against
  a configured Firefly III server. The pubspec pins Dart
  `>=3.10.0 <4.0.0`; older toolchains will not resolve.

**Integration tip:** when documenting a Firefly III install in an
Astro/Grove directory, Waterfly III is the canonical "phone client"
companion to link out from any record tagged `firefly-iii` or
`personal-finance`.
