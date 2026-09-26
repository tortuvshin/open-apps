---
name: BlueWallet
repoUrl: https://github.com/BlueWallet/BlueWallet
projectType: real-app
category: finance
stack: react-native
summary: A Bitcoin wallet focused on privacy with on-chain transactions, Lightning Network payments,
  and hardware-wallet integration.
description: Bitcoin wallet for iOS & Android. Built with React Native.
sourceDescription: Bitcoin wallet for iOS & Android. Built with React Native.
platforms:
  - android
  - ios
licenses:
  - mit
links:
  github: https://github.com/BlueWallet/BlueWallet
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/BlueWallet/BlueWallet/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/BlueWallet/BlueWallet/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: BlueWallet – Open Source Bitcoin & Lightning Wallet
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: BlueWallet
  repo: BlueWallet
  url: https://github.com/BlueWallet/BlueWallet
curation:
  reviewed: true
  reviewedAt: 2026-08-11
  labels:
    - mature
    - hot
  lenses:
    - production-like
  reviewedBy: Open Apps curators
visibility: keep
---
BlueWallet is a Bitcoin wallet focused on privacy, with first-class
support for on-chain transactions, Lightning Network payments, and
hardware-wallet integration.

## Why it matters

- **Multi-wallet model.** BlueWallet organises funds into separate
  wallets (Savings, Spending, Trading) so balances are not
  accidentally commingled.
- **Lightning done right.** The Lightning wallet supports
  channel-open, channel-close, MPP, and zero-conf channels through
  the bundled LDK node. There is no custodial intermediary.
- **Hardware wallet integration.** Connect a Coldcard, Ledger, or
  Trezor and sign transactions air-gapped; BlueWallet never holds
  the seed.

## How it works

BlueWallet is a React Native application; the same JavaScript code
ships to iOS and Android. Storage is encrypted with a user-supplied
passphrase using `crypto-js` AES-256; the seed is BIP-39 encoded and
never leaves the device.

Lightning support uses LDK (Lightning Dev Kit) running in-process
via a JSI bridge; channels are persisted to the encrypted storage
layer alongside on-chain wallet metadata. The wallet talks to
electrum and Esplora servers over Tor by default.

## Caveats

- **Onboarding friction.** Setting up a Lightning channel requires
  the user to pick a node operator and fund a channel. First-run
  UX is improving but is not yet "press one button".
- **iOS-only features.** Apple policy blocks some Lightning
  integrations; the iOS build ships with a subset of the Android
  feature set.
- **License is MIT for the wallet code, with portions under various
  permissive upstream licenses** — read each bundled component's
  license before forking.

## Deployment notes

```bash
# Mobile app — install from the App Store or Play Store
# https://bluewallet.io

# For local development:
git clone https://github.com/BlueWallet/BlueWallet.git
cd BlueWallet
npm install
npm run start
```

**Minimum:** an iPhone running iOS 14+ or an Android phone running
Android 8+. Lightning functionality requires either a custodial
compromise or running your own LDK-compatible node.

**Integration tip:** BlueWallet is the rare mobile-first wallet that
takes Lightning seriously; if you are cataloguing wallets for a
Bitcoin-aware directory, prioritise it over the "Lite wallet"
alternatives.
