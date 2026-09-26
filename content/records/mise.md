---
name: Mise
repoUrl: https://github.com/devShakib015/mise
projectType: real-app
category: business
stack: flutter
summary: A Flutter macOS client over an embedded PocketBase server, so the whole service runs on the
  restaurant's own hardware with no internet dependency. Bill totals are computed server-side and
  cannot be edited, orders snapshot item names and prices at the time of sale, and receipts print
  over ESC/POS to any network thermal printer.
description: Mise is a self-hosted restaurant system for macOS that runs a till, a kitchen display,
  QR table ordering, and a back office from one machine on the restaurant's own network.
sourceDescription: Free, self-hosted restaurant management. POS, kitchen display, QR table ordering,
  payments and reports.
platforms:
  - macos
licenses:
  - mit
links:
  github: https://github.com/devShakib015/mise
  website: https://devshakib.jumyn.com/apps/mise
distribution:
  channels:
    - type: github-releases
      platform: macos
      label: macOS disk image
      url: https://github.com/devShakib015/mise/releases/latest
      verified: true
tags:
  - open-source
  - desktop-app
  - restaurant
  - point-of-sale
  - offline-first
  - self-hosted
  - pocketbase
  - kitchen-display
bestFor:
  - Studying how a point-of-sale, a kitchen display, and a guest ordering surface share one Flutter
    codebase and a single embedded backend.
  - Running a small restaurant on hardware the owner controls, where service must continue when the
    connection does not.
whyListed:
  - The complete MIT-licensed system is public and documents its integrity rules explicitly,
    including server-computed bill totals and per-order price snapshots.
  - It is a worked example of an offline-first hospitality stack, covering shift floats and drawer
    counts, five staff roles, ESC/POS receipt printing, and CSV reporting.
caveats:
  - macOS is the only packaged target; Windows and Linux build from the same source but are not
    released as binaries.
  - Builds are unsigned, so the first launch needs right-click then Open, and the project states it
    does not pay for an Apple Developer certificate.
  - Guest QR ordering works over the venue's own wi-fi only; public internet ordering is
    deliberately out of scope to preserve the offline guarantee.
seo:
  title: Mise – Open Source Self-Hosted Restaurant POS
addedAt: 2026-09-01
source:
  type: submit
  provider: github
  owner: devShakib015
  repo: mise
  url: https://github.com/devShakib015/mise
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Mise is a restaurant system that runs on a single Mac inside the venue. It covers the till on the floor, a kitchen display on the pass, QR table ordering for guests, and a back office for the menu and the numbers — with no cloud service in the path.

## What the codebase includes

- A Flutter macOS client for the till, the kitchen display, and the back office, sharing one design language and one data model.
- An embedded PocketBase server that owns the data and runs on the same machine, so the network boundary is the restaurant's own wi-fi.
- A guest-facing QR ordering surface that sends orders straight to the kitchen display.
- ESC/POS receipt printing to any network thermal printer, addressed by IP rather than a driver.
- Shift handling with a counted opening float and a counted closing drawer, and reporting broken down by item, by server, and by hour, with CSV export.

## Integrity rules worth reading

The interesting part of the project is what it refuses to do, and those refusals are enforced rather than advisory.

A bill total cannot be edited from a terminal. It is computed on the server from the line items, the configured tax, and the service charge, so a tampered client cannot change what a bill costs. A discount cannot exceed the bill it applies to, and money cannot be taken against a cancelled bill.

Orders snapshot the name and price of every item at the moment of sale, so repricing the menu today leaves yesterday's bills untouched. On the staffing side, the last owner account cannot be deleted or disabled, and a manager cannot reset an owner's PIN.

These are ordinary requirements in commercial point-of-sale software and are rarely visible in an open codebase, which is most of what makes this one useful to study.

## Data and privacy

All data lives in one folder on the machine that runs it. The project states there is no telemetry, no analytics, and no outbound reporting, backups are a folder copy, and uninstalling the app leaves the data in place.

## Caveats

macOS is the only packaged target today. Windows and Linux build from the same source but are not published as binaries.

Builds are unsigned, so the first launch requires right-click then Open. The project is explicit that it does not pay for an Apple Developer certificate, and points to building from source as the alternative.

Guest QR ordering is reachable over the venue's wi-fi only. Public online ordering would mean exposing the machine to the internet, which the project rules out deliberately rather than by omission.
