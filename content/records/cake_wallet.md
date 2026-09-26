---
name: cake_wallet
repoUrl: https://github.com/cake-tech/cake_wallet
projectType: real-app
category: finance
stack: flutter
summary: Open-source non-custodial wallet supporting Monero, Bitcoin, Ethereum, Litecoin, Solana,
  Polygon, Nano, Zano, Decred, and many more chains from a single Flutter app. The architecture
  splits a Dart UI layer over per-chain `cw_*` plugin packages, with the heavy crypto lifting done
  in native C/C++ — the monero_c wrapper around monero-project's wallet2, and
  libsecp256k1/zcash/librustzcash-family libraries for the UTXO and EVM chains.
description: Cake Wallet is an open-source, non-custodial, multi-currency crypto wallet for iOS,
  Android, macOS, Linux, and Windows, built with a Flutter UI over per-chain Dart plugin packages
  that bridge to native C/C++ wallet code (notably the monero_c wrapper around wallet2 for Monero).
sourceDescription: The open source repository for Cake Wallet, a noncustodial multi-currency wallet,
  and Monero.com, a noncustodial Monero-only wallet. Need help? Check out
  https://docs.cakewallet.com
licenses:
  - mit
links:
  github: https://github.com/cake-tech/cake_wallet
tags:
  - android
  - bitcoin
  - bitcoin-cash
  - btc
  - cryptocurrency
  - ethereum
  - haven
  - ios
  - linux
  - litecoin
  - ltc
  - macos
  - monero
  - nano
  - polygon
  - solana
  - wallet
  - xmr
seo:
  title: Cake Wallet – Open Source Monero & Multi-Currency Wallet
addedAt: 2026-08-11
source:
  type: github-topic
  owner: cake-tech
  repo: cake_wallet
  url: https://github.com/cake-tech/cake_wallet
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Cake Wallet is an open-source, non-custodial multi-currency crypto
wallet for iOS, Android, macOS, Linux, and Windows. It is the most
prominent open mobile wallet for Monero and a credible general-purpose
alternative for Bitcoin, Ethereum, Litecoin, and a long tail of
chains — all from one Flutter app.

## Why it matters

- **The Monero reference on mobile.** Cake Wallet is the wallet most
  Monero users install first. It implements subaddresses, multiple
  accounts, restore-height based scanning, view-key-only wallets, and
  batch sends — the features that make XMR usable on a phone. The
  same codebase ships a stripped-down Monero-only app called
  Monero.com under the same repository.
- **One app, many chains.** Beyond Monero the wallet supports Bitcoin,
  Bitcoin Cash, Litecoin (with MWEB), Ethereum and EVM chains
  (Polygon, Arbitrum, Base), Solana, Tron, Nano, Zano, and Decred.
  Each chain gets its own dedicated Dart plugin package — `cw_monero`,
  `cw_bitcoin`, `cw_evm`, `cw_solana`, `cw_tron`, `cw_nano`,
  `cw_zano`, `cw_decred`, `cw_dogecoin`, `cw_wownero`, `cw_zcash`,
  `cw_mweb`, `cw_bitcoin_cash` — so adding a chain is a matter of
  dropping in another package rather than forking the UI.
- **Non-custodial by construction.** Seeds and view keys never leave
  the device. The wallet supports its own exchange flow (built on
  partner providers), buy/sell with fiat on-ramps, Tor-only
  connections, custom node URLs, OpenAlias, Unstoppable Domains,
  Yats, and FIO for human-readable addresses — all without any
  account signup.

## How it works

The repo is a Flutter monorepo. The user-facing app lives in `lib/`
and is a single Flutter target that consumes the `cw_*` packages as
path dependencies. Each `cw_*` package follows the standard Flutter
plugin shape: Dart code in `lib/`, platform glue in `android/`,
`ios/`, `macos/`, `linux/`, and `windows/`. The shared core
(`cw_core`) defines the wallet interface that every chain-specific
package implements, and `cw_shared_external` bundles the native
dependencies — Boost, OpenSSL, libsodium — that the per-chain
plugins link against.

The Monero plugin is the most interesting because Monero's
wallet2 does not run on Dart. `cw_monero` consumes a Dart shim
called `monero` from the mrcyjanek/monero_c repository, which in
turn wraps monero-project's `wallet2_api.h` C interface; the actual
FFI calls go through a platform plugin (`cw_monero_plugin.cc`,
`CMakeLists.txt`) compiled per platform. Subaddress derivation,
key image generation, and transaction construction all happen in
that C/C++ layer; the Dart side just orchestrates scan passes and
balance queries. The Bitcoin-family packages (`cw_bitcoin`,
`cw_litecoin`, `cw_bitcoin_cash`, `cw_dogecoin`, `cw_mweb`,
`cw_zcash`) reuse the `bitcoin_base` / `blockchain_utils` Dart
forks in `pubspec_base.yaml` plus hardware-wallet bindings
(`ledger_flutter_plus`, `trezor_connect`, `bitbox_flutter`) for
air-gapped signing.

State management is MobX; persistence is Hive with a code-generated
adapter layer. Networking is `dio` plus `web_socket_channel` for
chain daemons that push; `socks5_proxy` gives Tor support. The
dependency tree is heavily customised — most crypto primitives pull
from `cake-tech/*` forks (`bech32`, `web3dart`, `nostr_tools`,
`qr_flutter`, `cake_backup`) rather than upstream packages, which
makes the project robust but means `dependency_overrides` in
`pubspec_base.yaml` is long and worth reading before bumping.

## Caveats

- **Heavy fork surface.** Almost every cryptographic package is a
  cake-tech or community fork. The result is a wallet that ships
  the patches it needs but is harder for an outside contributor to
  reason about; bumping a major dependency is non-trivial.
- **Buy/sell/exchange is partner-mediated.** The in-app exchange
  and fiat on-ramp features rely on third-party providers and
  require KYC at their end even though the wallet itself is
  non-custodial. The Monero-only flow can route through Tor; the
  partner-mediated flows cannot.
- **Build complexity.** Compiling Monero's wallet2 across five
  platforms needs Boost, OpenSSL, libsodium, CMake, and per-OS
  toolchains; CI publishes signed APKs, IPAs, MSIX, and AppImage
  artifacts but local builds from `cw_monero/linux/` are not
  turnkey.

## Deployment notes

```bash
# Mobile — install from the official stores
# iOS:     https://apps.apple.com/app/cake-wallet/id1334702548
# Android: https://play.google.com/store/apps/details?id=com.cakewallet.wallet
# APK:     https://github.com/cake-tech/cake_wallet/releases

# Linux (AppImage)
# https://github.com/cake-tech/cake_wallet/releases  (cake_wallet.AppImage)

# Build from source — Flutter 3.x + the native deps above
git clone https://github.com/cake-tech/cake_wallet.git
cd cake_wallet
flutter pub get
flutter run -d linux   # or android, ios, macos
```

**Minimum:** iOS 13+ or Android 6+ for the mobile builds; macOS 11+,
a recent Ubuntu LTS, or Windows 10/11 for the desktop builds. Monero
sync from genesis wants ~50 GB; a `restore_height` cuts that to
roughly the wallet's age.

**Integration tip:** if you are cataloguing open wallets, treat
Cake Wallet as the "more chains" entry next to single-chain peers
like BlueWallet (Bitcoin/Lightning). The `cw_*` package split is
also a useful reference for anyone designing a pluggable,
multi-chain Flutter wallet — the `cw_core` interface is the
contract every chain has to satisfy.