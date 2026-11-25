---
name: "Open POS"
repoUrl: https://github.com/onepiece92/openPOS
category: business
stack: flutter
description: "A free point-of-sale app and cash register for small shops, cafes, food trucks and market stands. It works without internet, with no account, subscription or ads."
sourceDescription: "Free, 100% offline point-of-sale app for shops and cafes. No subscription, no account. Never sends your data anywhere."
platforms:
  - ios
  - android
tags:
  - android
  - ios
  - flutter
  - offline-first
  - point-of-sale
  - pos
  - cash-register
  - privacy
licenses:
  - mit
links:
  github: https://github.com/onepiece92/openPOS
  website: https://onepiece92.github.io/openPOS/
distribution:
  channels:
    - type: play-store
      platform: android
      label: Play Store
      url: https://play.google.com/store/apps/details?id=com.brandbuilder.openpos
      verified: false
    - type: app-store
      platform: ios
      label: App Store
      url: https://apps.apple.com/app/open-pos-offline/id6761003751
      verified: false
whyListed:
  - "Works fully offline; the app's own code makes no network calls"
  - "Free and MIT-licensed, with no account, subscription or ads"
  - "Live on Google Play and the App Store, built with Flutter"
caveats:
  - "One device is one register; there is no sync between devices"
  - "Does not process card payments; card sales taken on your own reader are recorded"
addedAt: 2026-11-25
submittedBy: onepiece92
---
Open POS is a point-of-sale app and cash register for small shops, cafes, food trucks and market
stands. It runs on Android phones and tablets, iPhone and iPad, and works without an internet
connection: the app's own code makes no network calls, and there is no account, subscription or
ads.

## What it covers

- A product grid with search, categories and favorites, and SKUs and bundles loaded by CSV
- Whole-order discounts, cash with change, and card sales recorded from your own card reader
  (the reader needs its own connection; Open POS does not process payments)
- Held tickets and table management
- Customers, order history with voids, and PDF receipts you can save or share, or copy as text
- Tax on or off per product, expense tracking, and reports for today, this week or this month
- An audit log and CSV export

## Who it is for

Owners of a single register who want a free tool that keeps working when the connection drops.
One device is one register: there is no sync between devices, which is the trade-off for keeping
all data on the phone.

## How it is built

One Flutter codebase for Android and iOS, with local storage only. The repository is MIT-licensed.
