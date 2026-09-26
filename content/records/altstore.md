---
name: AltStore
repoUrl: https://github.com/altstoreio/AltStore
projectType: real-app
category: tools
stack: ios
summary: A sideloading app store for non-jailbroken iOS that uses a desktop companion to re-sign
  installed apps with the user's own Apple ID and refresh them in the background, so they keep
  working past Apple's 7-day certificate expiration.
description: AltStore is a sideloading app store for non-jailbroken iOS devices that re-signs
  installed apps with a personal Apple developer certificate and refreshes them in the background
  via a desktop companion to bypass Apple's 7-day signing limit.
sourceDescription: AltStore is an alternative app store for non-jailbroken iOS devices.
platforms:
  - ios
licenses:
  - agpl-3.0
links:
  github: https://github.com/altstoreio/AltStore
distribution:
  channels: []
tags:
  - swift
  - nuke
  - keychainaccess
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (13,943 stars on GitHub).
caveats: []
seo:
  title: AltStore – Open Source Alternative App Store for iOS
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: altstoreio
  repo: AltStore
  url: https://github.com/altstoreio/AltStore
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:31:57+08:00
  labels:
    - mature
    - hot
  lenses: []
visibility: keep
---
AltStore is a sideloading app store for non-jailbroken iOS devices. It
ships its own signed IPA you install once, then leans on a small macOS /
Windows / Linux companion called **AltServer** to install and refresh
apps on demand.

## Why it matters

- **Sideloading without jailbreaking.** Apple normally only lets
  apps installed via the App Store, TestFlight, or a paid Developer
  Enterprise Program provisioning profile stay on the device. AltStore
  uses the *personal* Apple developer certificate that comes free with
  any Apple ID to re-sign arbitrary `.ipa` files and install them
  through the same iTunes Wi-Fi sync channel AltServer exposes.
- **The "refresh" trick.** A free personal certificate expires every
  seven days; sideloaded apps would stop launching. AltStore's
  `RefreshAppOperation` reconnects to AltServer whenever the iPhone is
  on the same network, re-signs each app's provisioning profile, and
  reinstalls it before the deadline — so apps survive indefinitely
  without the user noticing. This is the single feature that
  separates AltStore from TestFlight (90-day builds, app-controlled)
  and from the official App Store (App-Review-gated, no third-party
  distribution).
- **Mature iOS reference code.** 14k+ stars, ~2.1M lines of Swift, an
  AGPL-3.0 license, and a clean split between the iOS app, the
  AltKit / AltSign shared frameworks, and the macOS companion.

## How it works

The iOS app target (`AltStore/`) is a vanilla Swift / UIKit project
that uses Storyboards, Auto Layout, Core Data, and Apple's `Network`
framework. Discovery of nearby AltServer instances is done through
Bonjour (`NetServiceBrowser`) over the local network, plus a fallback
USB / XPC connection via `AltXPC` for wired installs. All
communication runs over an encrypted `ServerConnection` carrying
typed requests such as `BeginInstallationRequest` and
`InstallProvisioningProfilesRequest`.

Signing lives in the separate **AltSign** framework (vendored under
`Dependencies/`). It talks to Apple's developer API on behalf of the
user's Apple ID, asks for an `ad-hoc` provisioning profile, and
re-signs the app bundle with that profile. **AltServer** is a thin
macOS shell that forwards these signed bundles to the iPhone over
iTunes Wi-Fi Sync, plus a privileged helper (`STPrivilegedTask`) that
lets it install without user prompts.

The refresh cycle is driven by iOS Background Fetch — `AppDelegate`
runs an hourly background task that reconnects to AltServer and asks
it to re-issue provisioning profiles for every installed app. Logs
flow through `Logger.sideload` (`Logger(subsystem:category:)`) so the
full lifecycle of a refresh is greppable from the device console.

## Caveats

- **Apple policy is fragile.** AltStore depends on Apple's developer
  API continuing to issue free provisioning profiles for free Apple
  IDs. Apple has tightened these limits before (capping active apps
  to three and shortening the signing window); a future policy
  change could break the refresh mechanism.
- **You need a host computer.** A Mac, Windows PC, or Linux box
  running AltServer has to be on the same network for refreshes to
  succeed. Without it, apps stop launching after seven days.
- **Not a replacement for the App Store.** Apps distributed via
  AltStore are not reviewed by Apple, do not have IAP through StoreKit,
  and cannot use most App-Store-only entitlements (push notifications
  through APNs, Sign in with Apple, etc.).

## Deployment notes

1. **Install AltServer** on your Mac, Windows PC, or Linux box from
   <https://altstore.io> and let it install the Mail plug-in so it
   can talk to iTunes / Apple Devices.
2. **Sideload the AltStore app** by opening
   <https://altstore.io> on the iPhone, downloading the `.ipa`, and
   sharing it to AltServer. AltServer signs it with your Apple ID
   and pushes it back over Wi-Fi sync.
3. **Browse and install.** Open AltStore on the phone, add a source
   such as the AltStore marketplace, and tap Install. Background
   fetch keeps every installed app's provisioning profile alive as
   long as AltServer stays reachable on the same network.

**Integration tip:** if you maintain a Grove-style directory like
this one, link AltStore as the canonical example of a non-jailbroken
sideloading workflow whenever you explain how `stack: ios` apps
ship *outside* the App Store.
