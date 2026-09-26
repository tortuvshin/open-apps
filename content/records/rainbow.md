---
name: Rainbow
repoUrl: https://github.com/rainbow-me/rainbow
projectType: real-app
category: finance
stack: react-native
summary: Rainbow is a React Native mobile wallet that combines Ethereum mainnet and L2 support with
  built-in swap routing, an NFT gallery, a dapp browser, and Hyperliquid perpetuals, with the slick
  feel that comes from Reanimated 3 plus FlashList. The project was acquired by OrangeFun in 2024
  and remains actively developed under the rainbow-me organization.
description: Rainbow is a multi-chain Ethereum wallet for iOS and Android, built on React Native
  with Reanimated 3 and Shopify FlashList for fast mobile UX and broad NFT, DeFi, and swap coverage.
sourceDescription: 🌈‒ the Ethereum wallet that lives in your pocket.
platforms:
  - android
  - ios
licenses:
  - gpl-3.0
links:
  github: https://github.com/rainbow-me/rainbow
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/rainbow-me/rainbow/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/rainbow-me/rainbow/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: Rainbow – Open Source Ethereum Wallet in React Native
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: rainbow-me
  repo: rainbow
  url: https://github.com/rainbow-me/rainbow
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
Rainbow is a mobile-first Ethereum wallet for iOS and Android, plus a
browser extension, that covers far more than a plain ETH balance: it
speaks to Ethereum mainnet and a wide set of L2s, surfaces an NFT
gallery and a swap aggregator, hosts an in-app dapp browser, and
includes Hyperliquid perpetuals and a Polymarket integration. It is
also one of the most-cited examples of what a polished React Native
crypto app can feel like in the hand.

## Why it matters

- **Multi-chain by design.** Rainbow treats Ethereum mainnet, Optimism,
  Arbitrum, Base, Polygon, BNB Chain, Zora, and a long tail of L2s as
  first-class destinations, not an afterthought. Chain switching,
  per-chain balances, and per-chain swap routing are wired through the
  same UI rather than buried behind a network dropdown.
- **NFT, DeFi, and swap coverage in one app.** The Discover screen
  surfaces NFT collections, a swap sheet backed by the in-house
  `@rainbow-me/swaps` aggregator, Hyperliquid perpetuals
  (`@nktkas/hyperliquid`), and a Polymarket prediction-market flow
  (`@polymarket/clob-client-v2`). The wallet therefore reads less like
  a key-store and more like a small Web3 home screen.
- **React Native as a UX bet.** Rainbow was one of the first wallets
  to commit fully to React Native for crypto, and it was
  simultaneously one of the first to feel native on iOS. The combo of
  Reanimated 3 worklets, Shopify FlashList for long lists (transactions,
  NFTs, token lists), Skia for chart rendering, and Gorhom's
  bottom-sheet gives the app the snap that other RN wallets struggled
  to match for years.
- **Post-acquisition, still shipping.** The rainbow-me team was
  acquired by OrangeFun in 2024, but the open-source repo on the
  `develop` branch is still active — recent commits land weekly, the
  latest tagged release is v2.0.39, and 70+ contributors have touched
  the codebase. The license is GPL-3.0 and the project remains a
  usable reference implementation, not a tombstone.

## How it works

The codebase is a single React Native 0.81 workspace that ships to
three targets from one tree: iOS, Android, and a browser extension.
State is split across Recoil (per-screen UI), Redux (wallet and
settings), Zustand (newer stores), and `@tanstack/react-query` (RPC
and GraphQL caching). Persistence is handled by `react-native-mmkv`,
which gives the app a sync storage API that does not stall the JS
thread on cold launch.

The chain layer is `viem` 2.x with `ethers` 5.x still pinned for
legacy code paths. WalletConnect v2 is wired through
`@walletconnect/core` plus `@walletconnect/react-native-compat` and
the newer `@reown/walletkit`; dapps connect via a relay, the
in-app browser is `src/screens/DiscoverSheet/`, and approval sheets
live in `src/screens/WalletConnectApprovalSheet.tsx`. Hardware-wallet
support runs through `@ledgerhq/hw-app-eth`, and Coinbase Wallet
hand-off uses `@coinbase/mobile-wallet-protocol-host`.

Name resolution happens in `src/handlers/web3.ts`: `resolveNameOrAddress`
checks whether the input is a hex address, and if not falls through to
Unstoppable Domains (`@unstoppabledomains/resolution`) and then to
ethers' `provider.resolveName` on Ethereum mainnet. Passkeys
(`react-native-passkeys`) sit alongside the seed-phrase flow as a
modern recovery option. Swaps live in `src/__swaps__` for the
Swaps V2 rewrite (feature-flagged, not yet in production) and in the
existing `src/screens/Swap/` and `@rainbow-me/swaps` package for the
shipped flow.

## Caveats

- **Acquired project, unclear long-term direction.** Rainbow was
  acquired by OrangeFun in 2024, and the open-source repo still ships
  releases, but roadmap decisions now sit inside a corporate parent.
  If you are evaluating Rainbow as a base for a new wallet, treat
  upstream as a fast-moving target rather than a stable dependency.
- **No native desktop build.** There is a browser extension, but
  Rainbow has never shipped a first-party macOS or Windows desktop
  wallet. Heavy desktop users will still pair it with a separate
  wallet such as Frame or Rabby.
- **Mobile-wallet limits.** Even with Ledger support via USB or
  Bluetooth, the practical ceiling for any phone-only wallet is
  dapp-browsing ergonomics, signing latency, and the lack of a true
  full-node view. Treat Rainbow as a hot wallet for daily activity,
  not as a cold-storage replacement.

## Deployment notes

```bash
git clone https://github.com/rainbow-me/rainbow.git
cd rainbow
mise install           # pins Xcode, Node, Ruby, JDK
corepack enable
yarn install           # requires gh auth or a GITHUB_TOKEN
yarn setup
yarn start             # Metro
yarn ios               # or open ios/Rainbow.xcworkspace in Xcode
yarn android           # requires JDK 17 (Zulu), not Studio's bundled JDK 21
```

iOS builds need the Xcode version pinned in `.xcode-version` plus
CocoaPods (`yarn install-pods`). Android builds need Azul Zulu 17
exported as `JAVA_HOME`, the Android SDK on `PATH`, and at least
4096 MB of IDE heap — the default 2048 MB makes Gradle sync drag.
External contributors must supply their own `.env` (Etherscan, Infura,
ETH Gas Station, Imgix, plus a `google-services.json` for the Android
Firebase project) since the prod keys live only inside the org.

**Test environments:** Jest is the default unit runner; Detox or
end-to-end flows live under `e2e/` for the screens that talk to
hardware wallets or WalletConnect peers. The internal `develop` branch
is the source of truth — `main` is rarely the latest.

**Integration tip:** if you want to fork the wallet rather than build
from scratch, `@rainbow-me/swaps`, `@rainbow-me/provider`, and
`@rainbow-me/sdk` are published as standalone npm packages and are
the cleanest seams to copy; the Reanimated worklet layer under
`src/worklets/` and the FlashList usage in `src/screens/`
are the cleanest patterns to lift if you only want the feel.
