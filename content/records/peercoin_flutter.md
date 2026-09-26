---
name: peercoin_flutter
repoUrl: https://github.com/peercoin/peercoin_flutter
projectType: real-app
category: finance
stack: flutter
summary: A reference open-source Peercoin wallet that pairs BIP-39 mnemonic seed storage with FROST
  threshold-signature support and Flutter's cross-platform UI, covering mainnet and testnet from one
  codebase via ElectrumX. It ships to mobile stores and the Web (wallet.peercoin.net) under
  AGPL-3.0, but does not perform on-chain proof-of-stake minting despite Peercoin being a PoS chain.
description: peercoin_flutter is a self-custodial light wallet for Peercoin and Peercoin Testnet,
  written in Flutter and shipped to Android, iOS, and the Web from a single Dart codebase that talks
  to public ElectrumX servers.
sourceDescription: Light Peercoin wallet written in Flutter, deployable on Android, iOS and Web.
licenses:
  - agpl-3.0
links:
  github: https://github.com/peercoin/peercoin_flutter
tags:
  - android
  - dart
  - electrumx
  - flutter
  - flutter-app
  - ios
  - peercoin
  - proof-of-stake
  - web
  - wallet
seo:
  title: Peercoin Flutter – Open Source Peercoin Wallet
addedAt: 2026-08-11
source:
  type: github-topic
  owner: peercoin
  repo: peercoin_flutter
  url: https://github.com/peercoin/peercoin_flutter
curation:
  reviewed: true
  reviewedAt: 2026-08-11
  labels:
    - mature
  lenses:
    - production-like
  reviewedBy: Open Apps curators
visibility: keep
---
peercoin_flutter is a self-custodial light wallet for Peercoin and
Peercoin Testnet, written in Flutter and shipped to Android, iOS, and
the Web from a single Dart codebase. It is the most actively
maintained open-source wallet for the Peercoin cryptocurrency and
serves as a reference implementation for non-Bitcoin UTXO chains on
Flutter.

## Why it matters

- **Light client over ElectrumX.** The wallet never downloads a
  blockchain. Instead it speaks the ElectrumX protocol (TCP/JSON-RPC
  plus WebSocket subscriptions) to public Peercoin Electrum servers,
  keeping the install size small enough that the same codebase
  rebuilds cleanly for mobile stores and the Web.
- **Crypto stack worth reading.** Seed material follows BIP-39
  (`bip39: ^1.0.6`), with primitives from `crypto: ^3.0.3`, and the
  signing layer pulls in `frosty: ^2.0.0` + `frosty_flutter: ^2.0.2`
  for FROST threshold-signature support. Heavy lifting lives in the
  sibling `coinlib` library, which is consumed via a `dependency_overrides`
  git pin on the `16kb-align` branch.
- **Real mobile-store distribution.** The project ships through F-Droid,
  Google Play, the Apple App Store, and TestFlight for open beta,
  plus a web build deployed at wallet.peercoin.net via the `peanut`
  global tool. CI is a Codemagic pipeline plus GitHub Actions for
  static analysis and unit tests, with `flutter_driver` end-to-end
  coverage under `test_driver/`.
- **Mature Flutter plumbing.** State is `provider: ^6.0.3`,
  persistence is `hive_ce: ^2.10.1` with code-generated adapters,
  secrets live in `flutter_secure_storage: ^9.0.0`, and biometrics
  come from `local_auth`. The UI is fully internationalized through
  Weblate with `intl: ^0.20.2` and ships with `flutter_localizations`.

## How it works

The repository is a conventional Flutter app: `lib/` holds the Dart
source, `protos/` defines a `marisma.proto` compiled via `protoc
--dart_out=grpc:lib/generated`, and platform folders (`android/`,
`ios/`, `web/`) hold the standard per-target glue. Generated code
includes Hive adapters (`dart run build_runner build`), launcher
icons (`dart run flutter_launcher_icons:main`), and the splash
screen (`dart run flutter_native_splash:create`); CI checks these
artifacts in.

Networking splits between `web_socket_channel: ^2.1.0` for the
ElectrumX subscription stream and `http: ^0.13.3` for one-shot RPCs.
Connectivity state is surfaced through `connectivity_plus: ^6.1.3`,
and the app declares both `background_fetch: ^1.7.0` and
`flutter_local_notifications: ^17.0.0` so balance alerts can fire
without the wallet being foregrounded. QR flows use `qr_flutter:
^4.0.0` for receive and `qr_code_scanner_plus: ^2.0.10+1` for the
scanner, and address-book autocomplete runs on `flutter_typeahead:
^5.2.0`.

## Caveats

- **Will not mint.** Despite Peercoin being a proof-of-stake chain,
  the wallet explicitly does not participate in block minting; it is
  a transaction-only client. Users who want staking rewards must run
  a full node or use a separate staking tool.
- **Forked crypto dependencies.** `coinlib_flutter` and `frosty_flutter`
  are pinned via `dependency_overrides` to community forks on the
  `16kb-align` branch. Upstream releases have not yet shipped this
  alignment, so the overrides have to be removed manually once they
  land — and `flutter_logs` is pulled from a personal fork
  (`ced1check/flutter_logs`) with a TODO referencing two open issues.
- **AGPL-3.0.** The license is copyleft: any network-served derivative
  must publish its modifications. Personal and internal use is fine,
  but a branded commercial fork needs to either stay open or
  negotiate separately.
- **"Use at own risk."** The README flags the wallet as in "constant
  development" and explicitly warns users to use at their own risk —
  budget accordingly if you treat this as a primary store of funds.

## Deployment notes

```bash
# Mobile — install from the official stores
# Android: F-Droid or Google Play ("Peercoin")
# iOS:     App Store and TestFlight open beta

# Web build (deployed at wallet.peercoin.net)
flutter pub global activate peanut
flutter pub global run peanut -b production

# Build from source
git clone https://github.com/peercoin/peercoin_flutter.git
cd peercoin_flutter
flutter pub get
dart run build_runner build --delete-conflicting-outputs
dart run flutter_launcher_icons:main
dart run flutter_native_splash:create
flutter run -d chrome        # or -d <android-device>, -d <ios-device>
```

**Minimum:** any device that runs a recent Flutter SDK (Dart
`>=3.2.0 <4.0.0`) plus the `coinlib` library built separately per its
own instructions. No full node is required — only a reachable
ElectrumX server URL, which the user picks in Settings.

**Integration tip:** if you are cataloguing open wallets,
peercoin_flutter is a clean reference for a non-Bitcoin UTXO
Flutter wallet that uses FROST threshold signatures and ships to
mobile + Web from one tree. Pair it with single-chain peers like
BlueWallet or chain-agnostic peers like Cake Wallet to round out a
multi-chain directory.
