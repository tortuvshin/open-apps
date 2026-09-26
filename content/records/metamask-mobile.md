---
name: MetaMask Mobile
repoUrl: https://github.com/MetaMask/metamask-mobile
projectType: real-app
category: finance
stack: react-native
summary: The dominant mobile Ethereum wallet in production. React Native on top of native iOS
  (Swift/Obj-C) and Android (Kotlin/Java) modules, with a controller-based architecture
  (KeyringController, TransactionController, AccountsController) and a growing multichain footprint
  (EVM L2s, Solana, Bitcoin, Tron, Stellar).
description: MetaMask Mobile is the official Consensys-maintained mobile wallet for the Ethereum
  ecosystem, shipped as a React Native app with native iOS and Android modules that supports
  multi-chain accounts, a built-in dapp browser, and self-custodial key management.
sourceDescription: Mobile web browser providing access to websites that use the Ethereum blockchain.
platforms:
  - android
  - ios
licenses:
  - noassertion
links:
  github: https://github.com/MetaMask/metamask-mobile
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/MetaMask/metamask-mobile/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/MetaMask/metamask-mobile/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: MetaMask Mobile – Open Source Ethereum Wallet
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: MetaMask
  repo: metamask-mobile
  url: https://github.com/MetaMask/metamask-mobile
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
MetaMask Mobile is the official Consensys-maintained mobile wallet for the
Ethereum ecosystem. It is a self-custodial, multi-chain, dapp-capable wallet
shipped to the App Store and Google Play, and it is the largest production
React Native codebase in the crypto wallet space.

## Why it matters

- **The default mobile wallet for Ethereum.** Tens of millions of users
  reach MetaMask through the iOS and Android apps. Anything that breaks
  here (dapp connectivity, signing, swaps) is felt across the whole
  ecosystem, so the codebase is engineered for defensive change rather
  than novelty.
- **Multi-chain as a first-class concern.** The `app/` tree carries
  dedicated `multichain-accounts/`, `multichain-bitcoin/`,
  `multichain-stellar/`, and `multichain-tron/` modules alongside the
  EVM core, with newer EVM L2s (Linea, Base, Arbitrum, Optimism,
  Polygon, BNB, zkSync) wired through the same accounts UI rather than
  a single Ethereum-only flow.
- **React Native + native modules, not a pure web wrapper.** The
  `ios/` and `android/` trees host real native code (Swift / Obj-C
  on iOS, Kotlin / Java on Android) for biometrics, secure key
  storage, WebView, networking, and the React Native bridge
  (`RCTScreenshotDetect`, `RNTar` / `RnTar.swift`). Native side
  matters whenever you need to touch the secure enclave, Keychain,
  Android Keystore, or the in-app browser.
- **Production-grade surface area.** ~76M lines of TypeScript
  dominated, with mature test infra (Jest, Detox E2E, Storybook),
  Expo Dev Build support, and OTA updates via `ota.config.js`. The
  latest tagged release is 8.3.0 and ~300 contributors have touched
  the tree.

## How it works

The app is a single React Native workspace rooted at `app/`. State
is split across the legacy Redux layer (`actions/`, `reducers/`,
`selectors/`, `store/`) and a newer controller architecture in
`app/core/`, which uses the `messengers/` directory and the
controller-messenger pattern inherited from the MetaMask extension.
The key controllers are the `KeyringController` (HD seed phrase,
hardware wallets via Ledger, Snap-based keys), the
`TransactionController` (gas estimation, retry / speed-up / cancel,
nonce management, security alerts), and the `AccountsController`
(per-chain account discovery, naming, and ordering).

The dapp layer is split across `app/core/RPCMethods/`, the
`BackgroundBridge`, and the `WalletConnect` directory. In-app
dapps run inside a WebView that exposes an EIP-1193 provider,
and external dapps connect via WalletConnect v2 (and legacy v1
relay) plus the deeplink-based universal provider. EIP-1193
requests from the page are routed through `RPCMethods` to the
controller engine, which queues them, runs them against the
keyring, and returns a signed result or an error sheet for user
confirmation. The transaction signing flow is the same one a
dapp calls and a user confirms in-app: `eth_sendTransaction` or
`eth_signTypedData_v4` -> controller engine -> keyring sign -> gas
+ nonce enrichment -> broadcast via Infura (an `MM_INFURA_PROJECT_ID`
is required even for local dev) -> surfaced in the Activity feed.

Native modules cover the parts JS cannot: `RCTScreenshotDetect`
fires when a screenshot is taken so the app can blur sensitive
screens, `RNTar` / `RnTar.swift` extract tarballs used by the
in-app browser, and the iOS / Android shells wrap Keychain and
Keystore access for the seed phrase and private keys. Biometric
unlock flows through `app/core/Authentication/` and a
`LockManagerService` that gates the wallet behind FaceID / Touch
ID / Android BiometricPrompt.

## Caveats

- **Massive, opinionated surface area.** ~2 GB checkout, ~300
  contributors, controllers and screens that have accreted since
  the 2018 fork. Patterns range from modern to legacy within the
  same tree, so a fork is more like inheriting a city than a
  starter repo. Treat the controller-messenger pattern in
  `app/core/` as the cleanest seam; treat the Redux tree as
  read-mostly.
- **Regulatory and compliance load.** MetaMask is a regulated
  product. Onboarding enforces geo-blocking, KYC hand-offs to
  partner ramps, and feature flags for staking / Perps /
  Predict that vary by jurisdiction. A self-hosted fork has to
  make its own call on which flows to enable.
- **Non-custodial at scale is hard.** Keys live on the device,
  recovery is a 12-word phrase, and every signing surface is a
  potential phishing vector. The app surfaces security alerts,
  permission revocation, and Snap sandboxing, but the
  non-custodial model still means there is no rollback button for
  a signed transaction.

## Deployment notes

```bash
git clone https://github.com/MetaMask/metamask-mobile.git
cd metamask-mobile
yarn setup:expo        # recommended; uses Expo Dev Build + @expo/fingerprint
echo "MM_INFURA_PROJECT_ID=..." > .js.env
yarn watch
yarn install:ios:dev   # or: yarn install:android:dev
```

For native-side work, use `yarn setup` then `yarn start:ios` /
`yarn start:android`, and provide base64-encoded Firebase
config in `GOOGLE_SERVICES_B64_IOS` and
`GOOGLE_SERVICES_B64_ANDROID`. iOS builds need the pinned Xcode
plus CocoaPods; Android builds need the SDK on `PATH` and a
JDK 17. CI ships TestFlight, Play internal, and APK / AAB
artifacts through `builds.yml` and the runway release bot.

**Test environments:** Jest for unit and view tests, Detox for
end-to-end on real devices, and a Storybook for the component
library. Staging / production split is gated by remote feature
flags plus per-environment `.js.env` files; Sentry is wired in
for crash reporting and `ota.config.js` handles OTA updates
without re-submitting the binary.

**Integration tip:** if you are studying MetaMask Mobile as a
reference for a non-custodial wallet, the cleanest paths in are
`app/core/KeyringController`, `app/core/TransactionController`,
and `app/core/RPCMethods` for the provider layer; the
`multichain-accounts/` tree is the right starting point if you
are extending chain coverage beyond EVM.
