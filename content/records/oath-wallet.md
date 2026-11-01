---
name: Oath Wallet
repoUrl: https://github.com/devdasx/oath-wallet
projectType: real-app
category: finance
stack: ios
description: A wallet for iPhone and iPad that displays assets across blockchains and lets users review network fees before sending a transfer.
platforms:
  - ios
licenses:
  - mit
links:
  website: https://oathwallet.org
  github: https://github.com/devdasx/oath-wallet
distribution:
  channels:
    - type: app-store
      platform: ios
      label: App Store
      url: https://apps.apple.com/app/id6780187283
      verified: false
bestFor:
  - Swift developers studying a multichain wallet interface on iPhone and iPad.
whyListed:
  - The Ethereum send package separates fee quoting, transaction planning and signing, with focused tests for each stage.
caveats:
  - Network and signing capabilities depend on the release. Compare the source tag with the version you are evaluating.
seo:
  title: "Oath Wallet: Crypto Wallet for iOS | Open App Scout"
addedAt: 2026-11-02
submittedBy: devdasx
---

## Why it's listed

The SwiftUI screens and Swift packages show how a single transfer interface handles different fee models. For example, a developer can follow an Ethereum transfer from the fee quote to the bytes used for signing. The repository includes release notes describing the scope of each published build and its checks.

A useful starting point is the [Ethereum send package](https://github.com/devdasx/oath-wallet/tree/v4.1.15-build100/Packages/OathAnkr/Sources/OathAnkr). Read the send client beside the transaction plan and signing code to see which values an RPC provider supplies and which values the wallet commits to when it signs. The [test directory](https://github.com/devdasx/oath-wallet/tree/v4.1.15-build100/Packages/OathAnkr/Tests/OathAnkrTests) includes separate cases for pending transfers, RPC regressions and WalletConnect requests. Both links point to the same release tag so that the implementation and examples can be read together.
