---
name: admin-portal
repoUrl: https://github.com/invoiceninja/admin-portal
projectType: real-app
category: finance
stack: flutter
summary: One Flutter/Redux client that brings the full invoicing surface — quotes, invoices,
  recurring, credits, payments, expenses, projects, time tracking, e-invoicing — to six platforms
  including the Microsoft Store, Mac App Store, Snap, Flatpak, and F-Droid, with the most permissive
  self-host open-core line in the comparison set but a non-OSI license that the README is silent on.
description: Flutter (Dart) admin client for the Invoice Ninja v5 invoicing platform, shipping to
  iOS, Android, macOS, Windows, Linux, and web from a single codebase. Uses Redux + built_value over
  a single AppState that carries up to ten UserCompanyState slots, talks to the Laravel backend over
  REST, and ships with a hand-built .foss swap-out that strips the proprietary dependencies for the
  F-Droid, Snap, and Flatpak builds.
sourceDescription: "Invoice Ninja: Desktop/mobile admin portal built with Flutter"
platforms:
  - ios
  - android
  - macos
  - windows
  - linux
  - web
licenses:
  - noassertion
links:
  github: https://github.com/invoiceninja/admin-portal
  backend: https://github.com/invoiceninja/invoiceninja
  website: https://invoiceninja.com
  selfHost: https://www.invoiceninja.org
  fDroid: https://f-droid.org/en/packages/com.invoiceninja.app/
  flutterHub: https://github.com/invoiceninja/flutter
distribution:
  channels:
    - type: app-store
      platform: ios
      label: App Store
      url: https://apps.apple.com/us/app/invoice-ninja/id1503970375
      verified: true
    - type: app-store
      platform: macos
      label: Mac App Store
      url: https://apps.apple.com/us/app/invoice-ninja/id1503970375
      verified: true
    - type: play-store
      platform: android
      label: Google Play
      url: https://play.google.com/store/apps/details?id=com.invoiceninja.app
      verified: true
    - type: fdroid
      platform: android
      label: F-Droid
      url: https://f-droid.org/en/packages/com.invoiceninja.app/
      verified: true
    - type: microsoft-store
      platform: windows
      label: Microsoft Store
      url: https://apps.microsoft.com/store/detail/invoice-ninja/9N3F2BBCFDR6
      verified: true
    - type: snapcraft
      platform: linux
      label: Snap
      url: https://snapcraft.io/invoiceninja
      verified: true
    - type: flathub
      platform: linux
      label: Flathub
      url: https://flathub.org/en/apps/com.invoiceninja.InvoiceNinja
      verified: true
tags:
  - android
  - cross-platform
  - desktop-app
  - flutter
  - invoice
  - ios
  - linux
  - macos
  - mobile-app
  - redux
  - self-hosted
  - web-app
  - windows
bestFor:
  - Self-hosting the full Invoice Ninja v5 feature surface without paying per feature
  - Operating an invoicing business across iOS, Android, Windows, macOS, and Linux from one codebase
  - Managing up to ten companies from a single login (the multi-tenant AppState model)
  - Hosting a custom-branded client portal on your own domain
whyListed:
  - The most permissive self-host open-core line among the eight alternatives surveyed — every
    Pro/Enterprise feature compiles into the self-host binary and only the $40/yr white-label
    branding requires a paid license
  - The only self-hostable invoicing alternative with an officially maintained cross-platform (iOS +
    Android + macOS + Windows + Linux + web) Flutter client under the project's own org
  - A coherent architectural story worth studying as a real example of a 30+ entity
    Redux/built_value app shipping to five platforms off one codebase
caveats:
  - The Flutter admin client and the Laravel backend are both source-available, not OSI-open
    (Attribution Assurance License on the client; Elastic License 2.0 on the backend)
  - The admin-portal README is silent on its license, and the F-Droid build carries a "Non-Free
    Network Services" anti-feature warning
  - The Flutter Linux desktop client has a long-standing memory leak (upstream
    flutter/flutter#73402) that the maintainers defer rather than rewrite; community recommends the
    web client on Linux
  - The self-host Flutter binary ships hard-coded references to sentry2.invoicing.co,
    preview.invoicing.co, and OAuth client IDs — self-hosters with strict data-egress controls must
    fork to remove them
  - Authentication tokens are base64-obscured in SharedPreferences, not encrypted;
    flutter_secure_storage is not in the dependency tree
  - The late-2023 recharacterization of self-hosted "lifetime" licenses as 2-year terms damaged
    long-term self-hoster trust
  - The community-consistent
seo:
  title: Invoice Ninja Admin Portal – Open Source Invoicing Client
addedAt: 2026-08-11
source:
  type: github-topic
  owner: invoiceninja
  repo: admin-portal
  url: https://github.com/invoiceninja/admin-portal
curation:
  reviewed: true
  reviewedAt: 2026-08-17
  reviewedBy: Open Apps curators
  labels:
    - mature
  lenses:
    - good-to-learn
    - self-host-friendly
    - watch-the-license
    - cross-platform-flutter
visibility: keep
---
The admin portal is the operator half of [Invoice Ninja](https://invoiceninja.com): the app a
business owner or bookkeeper opens to raise a quote, convert it to an invoice, chase the payment,
and reconcile it against a bank feed. It is a pure client — all persistence lives in the separate
[`invoiceninja/invoiceninja`](https://github.com/invoiceninja/invoiceninja) Laravel server (v5),
which the portal talks to over REST. A public demo backend (`demo.invoiceninja.com`) is wired
into the login screen so you can drive the whole UI before standing up your own instance.

The thesis the rest of this review will defend: this is the most permissive self-host invoicing
open-core line in the comparison set, wrapped around the only officially maintained
cross-platform Flutter client in the self-host invoicing space — and both of those claims deserve
to be qualified, because the licensing is not what it looks like at first glance and the desktop
quality does not match the marketing.

## The whole money lifecycle, on six platforms

One Flutter codebase ships the admin portal to iOS, Android, macOS, Windows, Linux (Snap and
Flatpak), F-Droid, and web. The Flutter client wraps the full Invoice Ninja v5 surface — quotes,
invoices, recurring invoices, credits, purchase orders, payments (Stripe, PayPal, Square,
GoCardless), expenses, vendors, projects, time tracking, Kanban task boards, e-invoicing in
twenty-plus regional formats (EN16931, PEPPOL, XInvoice, FatturaPA, Facturae, VERIFACTU,
Order-X), recurring billing, custom designs, and a client portal on your own domain. Every
entity gets a directory under `lib/redux/` and a parallel view/edit directory under `lib/ui/`
(client, vendor, product, quote, invoice, recurring invoice, credit, purchase order, payment,
payment term, expense, recurring expense, subscription, tax rate, bank account, bank transaction,
transaction rule, project, task, task status, company gateway, webhook, token, design, schedule,
report, group, user, and more). That repetition is the point: any entity is legible once you
have read one.

The Flutter client is genuinely cross-platform in the way the marketing copy claims, with one
important caveat we will return to.

## The licensing story, which the README is silent on

Two repositories, two non-OSI licenses. The Laravel backend
([`invoiceninja/invoiceninja`](https://github.com/invoiceninja/invoiceninja)) is under the
[Elastic License 2.0](https://www.elastic.co/licensing/elastic-license) — source-available, not
OSI-open, no hosting-as-a-managed-service, no "make a competing SaaS." The Flutter admin client
([`invoiceninja/admin-portal`](https://github.com/invoiceninja/admin-portal)) ships an
`LICENSE.txt` declaring the "Attribution Assurance License (adapted from the original BSD
license)" — copyright 2021 Hillel Coren — which requires prominent runtime attribution and
prohibits trademark use of "Invoice Ninja" without written permission. This is materially
different from the BSD/MIT/Apache the casual reader might assume from "adapted from BSD," and
the project's own README is silent on which license applies. F-Droid lists the build under
"Attribution" with a "Non-Free Network Services" anti-feature warning; the iOS App Store and the
official site describe the app variously as "100% free" or "100% source-available."

In practice, this means you can run your business on Invoice Ninja indefinitely, fork and modify
the code, remove the branding (with the $40/year white-label license), and distribute the binary
to other non-competing users. You cannot offer it as a competing SaaS, and you cannot use the
"Invoice Ninja" trademark on derivative products. Anyone with a strict OSI-only requirement
should not be here; readers who are fine with source-available and not running a competing
hosted service can ignore the legal hair-splitting and run the thing.

## The most permissive self-host open-core line in the comparison set

The single most important reader-facing fact about the self-host story is that the v5 backend
binary ships with **every Pro and Enterprise feature compiled in**. The hosted SaaS tiers gate
those features behind $14/month (Pro) or $18–$300/month (Enterprise) plans, but on self-host
they are all present in the source. The only thing the $40/year white-label license buys is the
removal of the "Created by Invoice Ninja" string from the client portal and the PDF outputs. The
Flutter client uses the same "show-but-allow-with-banner" pattern: a Pro feature is visible in
the UI, but on the free plan an "Upgrade to paid plan" banner is rendered. A
`state.isProPlan` getter on the single `AppState` is the gate; `kAdvancedSettings` in
`lib/constants.dart` is the list.

Compared to the alternatives surveyed at the time of writing, this is uniquely generous.
[Akaunting](https://github.com/akaunting/akaunting) hard-caps its BSL 1.1 free core at two users,
one company, and a thousand invoices, with most useful features sold as separate App Store
add-ons. [EspoCRM](https://github.com/espocrm/espocrm) is AGPL-3.0 (genuinely open) and bundles
invoicing in the free core, but its Advanced Pack extension (Reports, BPM, Workflows) is paid
at US$395 and must be uninstalled if the license lapses. [SolidInvoice](https://github.com/SolidInvoice/SolidInvoice)
is true MIT, but with a narrower feature scope and no mobile app at all. [Crater](https://github.com/crater-invoice-inc/crater)
is AGPL-3.0 and was last released in 2022. [InvoicePlane](https://github.com/InvoicePlane/InvoicePlane)
is MIT but the v2 rewrite has not shipped a release in seven years.

## The five architectural decisions worth studying

**1. A single `AppState` over Redux + `built_value` immutables.** Every domain has a five-file
pattern under `lib/redux/<entity>/`: `*_actions.dart`, `*_middleware.dart`, `*_reducer.dart`,
`*_selectors.dart`, `*_state.dart`. JSON decode happens on a background isolate via `compute()`.
The trade-off: the state size is enormous, and a refactor to feature-sliced reducers would be
significant. The lesson: `built_value` as both wire-format and cache-format eliminates the
domain/DTO boundary — and forces every reader to learn `Built<T, B>` semantics.

**2. Multi-tenancy via `BuiltList<UserCompanyState>`.** A single `AppState` carries up to ten
`UserCompanyState` slots, each with a full Redux substate tree (49 `EntityType` values across
~1,100 lines of `entities.dart`). Switching companies is a single `SelectCompany` action that
triggers `RefreshData`. The trade-off: no synchronization between company slots, and switching
always re-fetches. The lesson: indexing substate by user-tenant via a single enum-like action
is a clean alternative to dynamic dispatch — unusual in this space, where most alternatives are
single-company per install.

**3. No business logic in the client.** Totals, taxes, line-item math, and PDF rendering all
happen on the Laravel backend; the client displays pre-computed fields and POSTs/PUTs raw
entities back. There is no SQLite, no IndexedDB, no offline queue. The trade-off: no offline
support. The lesson: if the backend can do all math, a Flutter client can be a glorified
read-cache — and ship to five platforms off one toolchain.

**4. Plan gating via "show-but-allow-with-banner."** The `state.isProPlan` flag is computed
from `account.plan` returned by the server, and the UI inserts upgrade banners into advanced
settings screens rather than hiding them. The trade-off: heavy string-literal coupling between
`kAdvancedSettings` and route strings. The lesson: if you must show-but-not-allow to drive
conversions, a single computed boolean plus a centralized list of "feature keys" is the
cleanest pattern.

**5. Open-core boundary via a `.foss` file-swap ritual.** The README's "Steps to remove
non-FOSS code" recipe asks the F-Droid, Snap, and Flatpak maintainers to manually copy `.foss`
variants of `oauth.dart`, `app_review.dart`, `upgrade_dialog.dart`, `pinput.dart`,
`AndroidManifest.xml`, and `pubspec.yaml` over the proprietary files. The `.foss` upgrade
dialog is a no-op `Container()`; the `.foss` OAuth helper is a stub that returns `false`. The
trade-off: this is a manual ritual, easy to get wrong, and the `settings.gradle.foss.kts` step
in the README is itself a no-op — the actual Google Mobile Services plugin drop happens via
`build.gradle.dev.kts` versus `build.gradle.prod.kts` at the app level. The lesson: file-swap
open-core is dead-simple but error-prone, useful when the proprietary features are isolated
single dependencies, and it does not scale to deeply embedded features. The README's no-op
entry is itself an interesting editorial signal about how the recipe was authored and never
cleaned up.

## The Linux desktop story, told honestly

The marketing framing is that the Flutter desktop client is a differentiator. The community
reality is that it is unstable on Linux: [the official forum thread](https://forum.invoiceninja.com/t/invoice-ninja-desktop-app-freeze/14451)
documents a reproducible memory leak climbing from ~130 MB to >1.4 GB over twenty hours, with
the maintainer (Hillel Coren) explicitly deferring to upstream
[`flutter/flutter#73402`](https://github.com/flutter/flutter/issues/73402) rather than rewriting
the desktop client. The [Manjaro forum](https://forum.manjaro.org/t/invoiceninja-does-not-start-via-snap-install/125509)
records `BadAlloc` X crashes on launch and GTK theming warnings; the recommendation that
emerges in both threads is to fall back to the web app. The maintainers' position is consistent
across years; the marketing has not caught up.

The desktop client is reasonable on macOS and Windows. It is rough on Linux. Plan accordingly.

## The data-egress story, which a self-hoster needs to know

The Flutter admin-portal binary ships with hard-coded references to `sentry2.invoicing.co`
(Sentry error reporting, gated by `account.reportErrors` but enabled by default on hosted
accounts), `wss://ws.invoicing.co/app/ninja` (a WebSocket endpoint that is currently disabled
in source but whose URL is still shipped), and `https://preview.invoicing.co/api/v1/live_preview`
(PDF preview rendering, which the client always talks to even on a self-hosted install).
Authentication tokens are stored in `SharedPreferences` with a base64-obscured
`TokenEntity.obscureToken` — not encrypted; `flutter_secure_storage` is not in the dependency
tree. On a rooted Android or jailbroken iOS device, the token is recoverable in plaintext. For a
self-hoster with strict data-egress requirements, the path forward is to fork the client and
remove the hard-coded endpoints; for everyone else, the Sentry DSN and the preview URL are
annoyances but not deal-breakers.

A related first-time self-hoster complaint, repeated across the official docs, GitHub issues,
the YunoHost forum, and the TurnKeyLinux tracker, is the `API_SECRET` mismatch: the desktop and
mobile clients will not log in to a self-hosted backend until the secret on the server matches
the one shipped in `lib/.env.dart.example`. Official docs explicitly call this out as the
number-one reason for mobile login failures.

## When to choose this, and when not to

**Choose Invoice Ninja admin-portal when** you want the full v5 invoicing surface self-hosted
without paying per feature, when you actually need cross-platform clients (iOS, Android,
Windows, macOS, Linux, web) from one codebase, when you want a multi-company model with up to
ten companies under one login, or when you want to host a custom-branded client portal on your
own domain and you are fine with the source-available license.

**Choose something else when** you need a true OSI-approved license (use EspoCRM for AGPL-3.0
plus CRM, or SolidInvoice for MIT); when your organization is in a regulated industry and
strict data-egress controls make the hard-coded `invoicing.co` endpoints unacceptable without a
fork; when your business logic really needs offline support (use a local-first ledger like
[BeeCount](https://github.com/TNT-Likely/BeeCount)); when you need a full CRM underneath the
invoicing (use EspoCRM); or when you want hosted-only with zero operational overhead (use
FreshBooks, Wave, or InvoiceBerry and accept the recurring subscription).

The central trade-off is this: **Invoice Ninja gives you the broadest self-host feature surface
across the most platforms, on the condition that you accept a source-available license the
README does not name, a Linux desktop client the maintainers acknowledge is rough, and a binary
that ships hard-coded references to invoicing.co even on self-hosted installs.** The
alternatives that beat Invoice Ninja on any single axis lose on at least one of those three
dimensions.

## Watch this one

- The new `invoiceninja/flutter` repo (27 stars, pushed 2026-08-16) is a candidate successor to
  `admin-portal`. Not yet canonical; worth a re-check in ninety days.
- The late-2023 recharacterization of self-hosted "lifetime" licenses as 2-year terms is the
  most consequential governance event in the project's recent history. Anyone evaluating
  Invoice Ninja in 2026 should weight it.
- The Flutter memory leak is still open against upstream Flutter. If a fix lands, the Linux
  desktop story changes materially.
- The `API_SECRET` first-time-self-hoster pain is consistently the number-one community
  complaint and could be solved by a one-line client change to read the secret from the login
  URL.

For a deeper look at the `.foss` open-core pattern itself, at the security and data-egress
profile of the self-host client, or at a side-by-side comparison of self-host invoicing
licensing on the ELv2 / BSL / MIT / AGPL axis, see the open-apps research archive under
`.grove/research/invoiceninja/`.
