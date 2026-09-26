---
name: medito-app
repoUrl: https://github.com/meditohq/medito-app
projectType: real-app
category: health-and-fitness
stack: flutter
summary: The same Dart codebase targets Android and iOS, with Riverpod driving state, Pigeon
  bridging native sides, and a Mock run mode that intercepts every network call so volunteers can
  build and exercise the full UI without API keys, Firebase, or Stripe. Content is organised into
  Packs (themed collections), Paths (ordered multi-day courses), and standalone Tracks, and an
  in-app Stats screen plus a favorites list turn completed sessions into a private practice log.
description: Medito is a permanently-free Flutter meditation app maintained by the Medito Foundation
  that streams guided sessions, multi-day courses, and themed packs from a CMS-backed catalogue,
  pairing each track with a `just_audio` + `audio_service` foreground player and an optional
  background-sound bed.
sourceDescription: The Medito app is a 100% free meditation app built with flutter. The app is
  available on Android and iOS.
licenses:
  - agpl-3.0
links:
  github: https://github.com/meditohq/medito-app
tags:
  - android
  - flutter
  - ios
  - meditation
  - meditation-app
  - meditation-practice
  - medito-foundation
  - mindfulness
  - wellbeing
seo:
  title: Medito – Open Source Free Meditation App
addedAt: 2026-08-11
source:
  type: github-topic
  owner: meditohq
  repo: medito-app
  url: https://github.com/meditohq/medito-app
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Medito is a 100% free, non-commercial meditation app for Android and iOS,
maintained by the Medito Foundation (a registered Dutch nonprofit) and
shipped from a single Flutter codebase. It targets both first-time
practitioners and people deepening an existing practice, and it makes a
deliberate promise in the README: no ads, no spam, no sign-up, no paywall.

## Why it matters

- **Permanently free, foundation-backed.** There is no Stripe path, no
  in-app purchase, and no ad SDK wiring anything in. The Foundation
  funds development and content licensing, so the product never has to
  optimise for retention metrics the way consumer meditation apps do.
- **Rich, CMS-driven content model.** The app streams its library from
  a backend, not from a baked-in asset bundle. Contributors can add
  Packs (themed collections such as "Sleep" or "Stress"), Paths
  (ordered multi-day courses like the 30-day intro), and individual
  Tracks (single guided sessions) without shipping a new release.
- **Production-grade audio on Flutter.** Playback is built on
  `just_audio` plus `audio_service`, so the player keeps running as a
  foreground notification when the screen is off or the app is
  backgrounded, and the user can hand off to a Bluetooth headset
  without losing position. An optional `background_sound` layer mixes
  rain, white noise, and similar beds under the guided voice.
- **Volunteer-friendly Mock mode.** A third run mode (alongside
  Development and Production) intercepts every network call and serves
  hardcoded sample data, so a new contributor can `flutter run` the
  full UI without provisioning Firebase, Stripe, or CMS credentials.
  This is a striking contrast to most Flutter apps that gate local
  builds on real backend keys.

## How it works

The Flutter app is split into clean layers. `lib/models/` defines the
content domain — Packs, Paths, Tracks, Sessions, and the user-side
models (favorites, local stats, audio-completion events). `lib/repositories/`
and `lib/services/` wrap the REST API and the `audio_service`
notification surface. `lib/providers/` exposes state via `provider`
(Riverpod code generation lives behind `build_runner` in newer
versions), and `lib/views/` is organised by screen: `home`, `explore`,
`pack`, `path`, `track`, `player`, `favorites`, `stats`, `settings`,
`onboarding`, and a small `debug` surface that the Foundation uses
internally.

Playback starts in `PlayerView`, which is fed a Track object and
delegates to a singleton audio handler. The handler exposes a stream
of position and playing-state events so the UI can re-render progress
without polling. Background sounds are a second independent audio
context that can be toggled on top of any Track. Session completion is
detected by listening for the audio handler's `completed` event and
persisted locally with `shared_preferences` and small Hive-style JSON
files, which then feed the `Stats` view.

Build and release tooling is unusually thorough for a volunteer
project: Fastlane for store submissions, Shorebird for OTA Dart
patches, Maestro for UI flows, and a `VERIFY_APK.md` document that
instructs sideload users to confirm APK signatures against the
Foundation's published key — a notable trust measure given the wave
of malicious meditation-app clones on third-party stores.

## Caveats

- **Content license is mixed.** The app code is AGPL-3.0, but the
  in-app content is licensed separately. Some tracks are original
  Creative Commons content, others are aggregated from third parties
  under their own terms; the README is explicit that the Foundation
  cannot police downstream re-use of aggregated content.
- **Backend keys required for real content.** Mock mode lets you build
  the app, but if you want to publish a fork with live content you
  still need API credentials from the Foundation.
- **No web/desktop target.** Despite being Flutter, the project is
  intentionally mobile-only — no `flutter run -d chrome` story and no
  desktop build configuration.
- **Volunteer onboarding is human-paced.** The Foundation asks
  prospective code contributors to email Katie directly with a CV
  and hours-of-week commitment, rather than self-serve via a CLA bot.

## Deployment notes

```bash
git clone https://github.com/meditohq/medito-app.git
cd medito-app
flutter pub get
# Mock mode — no keys required
flutter run --flavor mock
```

The Foundation distributes signed builds through the Play Store, the
App Store, and GitHub Releases (APK). Sideloaders should follow
`VERIFY_APK.md` and confirm the APK signature matches the Foundation's
published certificate before installing.

**Integration tip:** Medito is a useful reference app for any Grove
record tagged `meditation`, `mindfulness`, or `wellbeing`, and its
Mock-mode pattern is worth borrowing for any Flutter project that
wants to lower the contributor bar without leaking staging data.
