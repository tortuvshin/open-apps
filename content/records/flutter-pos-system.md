---
name: flutter-pos-system
repoUrl: https://github.com/evan361425/flutter-pos-system
projectType: real-app
category: developer-tools
stack: flutter
summary: A Flutter point-of-sale app that keeps every byte on the device — ingredients, menus,
  orders, customer demographics, and a Bluetooth receipt printer — wired through Provider state with
  sqflite and sembast for local storage and Google Sheets as the only egress. Apache-2.0 and
  currently shipping on Android with iOS in progress.
description: An offline-first Flutter point-of-sale app for small restaurants and shops that runs
  ingredient inventory, menu management, customer demographics, order taking, Bluetooth receipt
  printing, custom analytics charts, and Google Sheets export entirely on-device with no remote
  backend.
sourceDescription: An open-source Flutter POS system designed for small restaurants and businesses.
licenses:
  - apache-2.0
links:
  github: https://github.com/evan361425/flutter-pos-system
tags:
  - android-app
  - app
  - flutter
  - ios-app
  - possystem
seo:
  title: Flutter POS System – Open Source Restaurant Point of Sale
addedAt: 2026-08-11
source:
  type: github-topic
  owner: evan361425
  repo: flutter-pos-system
  url: https://github.com/evan361425/flutter-pos-system
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Flutter POS System is an offline-first point-of-sale app built in Flutter
for small restaurants, cafes, and shops. The project targets a single
phone or tablet running the counter: an owner sets up ingredients and
menu items, a cashier rings up orders, the system decrements stock
automatically, prints a Bluetooth receipt, and at the end of the day
the data can be exported to Google Sheets for reconciliation — all with
nothing leaving the device unless the operator chooses to push it out.

## Why it matters

- **Offline-first by design, not by retrofit.** Every row lives in
  `sqflite` + `sembast` on the phone; the app needs no internet
  connection at the counter. Connectivity only matters for the
  optional Google Sheets export, Firebase Analytics / Crashlytics
  telemetry, and the Google sign-in that authorises that export.
- **End-to-end POS workflow in one binary.** The app covers the full
  loop a small operator needs and stops there: ingredient → menu →
  order → cash register → Bluetooth receipt → daily balance →
  analytics. There is no ERP feature creep, and the cash-register
  math is purpose-built rather than a generic shopping cart.
- **Customer demographics as a first-class field.** The customer
  model captures age and gender for the analytics dashboard, so a
  single-shop owner can build the demographic charts a chain POS
  would gate behind a SaaS subscription.
- **Built-in analytics.** Charts render with Syncfusion (line + pie,
  plus a custom-axes mode), so the owner can answer "what sold best
  on Wednesday" without exporting anything.

## How it works

The codebase (package name `possystem`, v2.12.x) is organised around
feature folders under `lib/` — `models/`, `services/`, `ui/`,
`helpers/`, `components/`, plus a `settings/` surface — with
`go_router` driving navigation and `provider` for state management.
Each domain (ingredients, menus, orders, customers) is its own folder,
so adding a new entity type is a localised change rather than a
sweeping refactor.

Local storage is layered: `sqflite` for relational entities (orders,
menu items, ingredients), `sembast` for document-style records
(settings, transit exports), and `shared_preferences` for small flags.
Receipt printing goes over Bluetooth through the
`blue_thermal_printer` family against 58mm and 80mm thermal printers.
The "Transit" feature packages orders, menus, and other tables as
JSON or Excel (via a custom `excel` dependency pinned in
`pubspec.yaml`) and pushes them to a Google Sheet through
`googleapis` with `google_sign_in` for OAuth.

Firebase is wired in for telemetry only — `firebase_analytics`,
`firebase_crashlytics`, `firebase_performance`, and
`firebase_in_app_messaging` — and localization runs through Flutter's
standard `intl` + ARB pipeline (English and Chinese hand-maintained).
The responsive layout adapts between phone and tablet widths.

## Caveats

- **Android-first.** The Play Store release is the supported channel;
  iOS is "coming soon" per the README and there is no TestFlight
  build in the repo. Operators who need iOS today are piloting with
  Android tablets or sideloading.
- **Single-device, single-merchant model.** There is no multi-store
  or multi-user server; two cashiers on two devices at once run
  separate stores unless reconciled via the Sheets export. Deliberate
  small-shop scope but worth knowing up front.
- **Custom pinned dependencies.** `pubspec.yaml` references `packages`
  and `excel` from a custom Git repo rather than pub.dev, so
  `flutter pub get` needs that source reachable. Locked-down build
  environments without the Git remote will fail to resolve.
- **Syncfusion license.** Charts are powered by Syncfusion's Flutter
  package, which carries its own community-license terms — above a
  certain revenue threshold a Syncfusion license is required even
  though the app itself is Apache-2.0.

## Deployment notes

```bash
# Android — install from the Play Store
# https://play.google.com/store/apps/details?id=com.evanhoe.possystem

# Local development
git clone https://github.com/evan361425/flutter-pos-system.git
cd flutter-pos-system
flutter pub get
flutter run -d <android-device>      # or ios once available
```

**Minimum:** an Android 6+ phone or tablet, plus a Bluetooth thermal
receipt printer (58mm or 80mm) if you want paper receipts. The app
itself runs on a low-end device — there is no server to provision, no
cloud tenant to pay for, and no account to register before you can
take your first order.

**Integration tip:** if you curate an Open Apps directory like this
one and want a real-world Flutter example that ties together
on-device persistence (`sqflite` + `sembast`), Bluetooth hardware,
an analytics dashboard (Syncfusion), and a Sheets export via Google
APIs — without any of those pieces needing a server — Flutter POS
System is one of the cleanest end-to-end reference implementations
you will find.
