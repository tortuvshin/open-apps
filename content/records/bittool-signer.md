---
name: BitTool Signer
repoUrl: https://github.com/bitbill/bittool-signer-ios
category: finance
stack: ios
description: "Offline transaction signer for a dedicated iPhone. It scans a request, displays it for approval, and returns a signature by QR code."
platforms:
  - ios
tags:
  - qr-code
  - offline-signing
licenses:
  - mit
links:
  website: https://bittool.com/signer/
distribution:
  channels:
    - type: app-store
      platform: ios
      url: https://apps.apple.com/app/id6823781498
      verified: false
whyListed:
  - The SwiftUI interface and bundled JavaScriptCore engine show how to decode a signing request and present it for approval on a phone kept offline.
caveats:
  - A separate online wallet prepares and broadcasts transactions. Public blockchain transactions are visible after broadcast.
  - The project reports no independent security audit. A source review alone cannot establish equivalence with the App Store binary.
seo:
  title: "BitTool Signer – Open Source Offline iPhone Transaction Signer"
addedAt: 2026-11-07
submittedBy: jtomtan
---
