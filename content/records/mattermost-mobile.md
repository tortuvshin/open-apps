---
name: Mattermost Mobile
repoUrl: https://github.com/mattermost/mattermost-mobile
projectType: real-app
category: communication
stack: react-native
summary: The production-grade React Native client for Mattermost, the open-source, self-hostable
  Slack alternative used by dev teams and regulated enterprises.
description: Mattermost Mobile is the official React Native iOS and Android client for the
  self-hostable Mattermost messaging platform, giving enterprise and dev teams on-device access to
  channels, threads, calls, and push notifications backed by the same REST and WebSocket API as the
  web and desktop clients.
sourceDescription: Next generation iOS and Android apps for Mattermost in React Native.
platforms:
  - android
  - ios
licenses:
  - apache-2.0
links:
  github: https://github.com/mattermost/mattermost-mobile
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/mattermost/mattermost-mobile/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/mattermost/mattermost-mobile/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
relations:
  - type: alternative-to
    to: slack
    evidence:
      type: editorial
      checkedAt: 2026-09-22
seo:
  title: Mattermost Mobile – Open Source Slack Alternative App
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: mattermost
  repo: mattermost-mobile
  url: https://github.com/mattermost/mattermost-mobile
curation:
  reviewed: false
  reviewedAt: 2026-06-13T00:29:01+08:00
  labels:
    - mature
    - hot
  lenses:
    - production-like
visibility: keep
---
Mattermost Mobile is the official mobile client for Mattermost, the
open-source, self-hostable Slack alternative trusted by developer teams,
regulated enterprises, and government agencies. It wraps the same
Mattermost server API used by the web and desktop apps in a React Native
shell with native iOS and Android bridges.

## Why it matters

- **Self-hostable Slack alternative.** Mattermost competes directly with
  Slack and Microsoft Teams but ships as a single binary you can install
  on your own infrastructure. The mobile client is the on-the-go surface
  for that same server, so users see the same channels, threads, and
  direct messages on their phone as on their desktop.
- **Enterprise and dev-team audience.** Adopters include security-focused
  orgs that need on-prem control over chat data. The mobile app is
  localized in 21 languages and supports SSO, MFA, Intune enrollment,
  and Mattermost Enterprise Mobility Management (`@mattermost/react-native-emm`)
  out of the box.
- **Production-grade scale.** Around 2,700 stars, 1,600+ forks, monthly
  releases, and 219+ contributors. The project ships on the App Store
  and Google Play Store, with a parallel TestFlight / Play beta track
  via Fastlane.

## How it works

The app is a **React Native 0.83.9** project (Expo 55) with TypeScript as
the dominant language. Native iOS lives under `ios/` (Swift, with a
`NotificationService/` extension target that mutates APNs payloads
before display) and native Android lives under `android/` (Kotlin and
Java). A standalone `share_extension/` target handles the iOS share
sheet. Build automation runs through Fastlane with separate lanes for
`dev`, `beta`, `release`, and `pr` per platform, plus an iOS simulator
lane.

The mobile app talks to a Mattermost server over two channels. REST
requests go through `app/client/rest/`; the live event stream comes in
via a WebSocket managed by `app/managers/websocket_manager.ts`. The
local mirror of server state is a **WatermelonDB** reactive SQLite
database under `app/database/`, with models, schema migrations, and
reactive subscriptions that drive UI in `app/screens/`.

Screens are split per concern: `app/screens/{channel, post, thread}` for
the channel / post / thread model, `home/` for the tabbed root,
`login/sso/mfa/` for auth, and a `products/` tree that ships optional
integrations like **Mattermost Calls** (`react-native-webrtc`) and
Playbooks. Messaging itself uses a `commonmark` renderer with custom
markdown extensions, syntax highlighting, and file attachments. Push
delivery on iOS uses `react-native-notifications` against APNs, and on
Android against FCM, with server-side fan-out from the mattermost-push-proxy.

## Caveats

- **Server version coupling.** Each mobile release targets a minimum
  Mattermost server version — v2.42.2 requires server v10.11.0 ESR or
  newer. Operators on older servers must coordinate upgrades or stay on
  older mobile builds.
- **Self-compiled apps own their push infrastructure.** If you build the
  app from source instead of using the store builds, you must also
  deploy and operate your own `mattermost-push-proxy` instance; the
  app does not fall back to a hosted push relay.
- **Wide native test matrix.** The official support window is iOS 16.0+
  and Android 7.0+, but the build matrix spans four Android ABIs
  (arm64-v8a, armeabi-v7a, x86, x86_64) plus iOS device and simulator.
  Detox drives the E2E suite, so contributors need both Xcode and
  Android Studio set up.

## Deployment notes

Pre-built store binaries are the default path: download Mattermost from
the App Store or Play Store, point it at any Mattermost server URL, and
log in with SSO or email/password. Self-hosters typically pair the
mobile build with a Mattermost server behind NGINX (or another reverse
proxy) that terminates TLS and forwards WebSocket upgrades on the APIv4
path — a misconfigured proxy shows up immediately as a persistent
"Connecting..." bar.

To self-compile, follow the developer setup guide at
`developers.mattermost.com/contribute/mobile/developer-setup/`. The
typical flow is `npm install` (Node 22.11+ or 24.15+), `bundle install`
for the Fastlane / CocoaPods gems, `cd ios && pod install`, then either
`npx react-native run-ios` / `run-android` for development or
`fastlane ios release` / `fastlane android release` for store-ready
artifacts. The `share_extension/` target, iOS Notification Service
Extension, and Android FCM service all build in the same Xcode /
Gradle step.

**Integration tip:** if you maintain a Grove / Astro directory like this
one, list Mattermost Mobile as the canonical example for any app tagged
`self-hosted` and `communication` that targets both iOS and Android —
its server-coupled release model and self-managed push proxy are the
exact pattern most enterprise reviewers want to see.
