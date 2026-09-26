---
name: Berty
repoUrl: https://github.com/berty/berty
projectType: real-app
category: communication
stack: react-native
summary: An open-source messenger built on the Wesh protocol that runs over libp2p with mDNS, BLE,
  and Tor transports, letting peers exchange messages directly without any central server or trusted
  infrastructure.
description: Berty is a peer-to-peer messenger that runs entirely over the Wesh protocol on top of
  libp2p, so peers connect directly via mDNS, Bluetooth Low Energy, or Tor with no central server in
  the loop.
sourceDescription: Berty is a secure peer-to-peer messaging app that works with or without internet
  access, cellular data or trust in the network.
platforms:
  - android
  - ios
licenses:
  - noassertion
links:
  github: https://github.com/berty/berty
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/berty/berty/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/berty/berty/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: Berty – Open Source Peer-to-Peer Encrypted Messenger
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: berty
  repo: berty
  url: https://github.com/berty/berty
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
Berty is a peer-to-peer messenger that runs entirely over the **Wesh
protocol**, an SDK built directly on **libp2p**. There is no central
server, no account creation, and no phone number requirement — peers
find each other and exchange encrypted messages using whatever
transports are available: mDNS on the LAN, Bluetooth Low Energy
nearby, multipeer connectivity on iOS, Android Nearby, or Tor for
remote anonymous links.

## Why it matters

- **Serverless by design.** Most "private messengers" still depend on
  a hosted relay you have to trust. Berty has no such dependency: it
  treats the network as adversarial and routes around it. In an
  internet shutdown, a protest, or an area with no cellular coverage,
  two Berty users on the same Wi-Fi or within BLE range can still
  talk.
- **Different trust model from Signal / Matrix.** Signal centralizes
  metadata-minimized message routing through trusted servers;
  Matrix federates between independently operated homeservers. Briar
  is the closest philosophical neighbor, but is Tor-only and
  Java-only. Berty is the only mature option that pairs a Go-based
  protocol SDK with first-class native iOS and Android apps and
  multiple local transports.
- **Group messaging without a homeserver.** Groups are CRDT-style
  collections replicated over OrbitDB on top of IPFS. Adding a member
  to a group is a key exchange, not an invitation through someone
  else's server.

## How it works

The **Wesh protocol** lives in `go/pkg/bertyprotocol`. It manages
identities, accounts, multi-device membership, group membership,
encrypted message routing, and an application lifecycle so that
downstream apps can focus on UI. Group messages are stored as
append-only CRDT log entries that are gossiped between members over
whatever libp2p transports are reachable.

The transport stack is configurable per launch: `-p2p.mdns` (default on)
for LAN discovery, `-p2p.ble` for nearby BLE, `-p2p.multipeer-connectivity`
for Apple Continuity-style discovery, `-p2p.nearby` for Android
Nearby, and Tor via the `-anonymity` preset which forces
`-tor.mode=required` and disables the local transports. Reachability
through NAT is handled by autorelay, static relays, or a dedicated
`rdvp` (rendez-vous point) server that you can self-host — note that
the rdvp is a discovery hint only and never sees message contents.

The Go core ships as two CLI binaries, `berty daemon` (a full Wesh
node) and `berty mini` (a CLI messenger), plus a gomobile-generated
framework in `go/framework/bertybridge` that the mobile clients
import. The current mobile app is an Expo/React Native build under
`berty-bridge-expo/` that consumes the native module via gomobile.

## Caveats

- **Pure-P2P overhead.** Each device continuously announces and
  scans on multiple transports. Battery drain is noticeably worse
  than for a centralized messenger, especially on Android where BLE
  scanning is still relatively costly.
- **Slow message delivery when offline.** If both peers are
  unreachable at send time, the message stays in the local outbox
  until at least one of them gets a path through. There is no
  store-and-forward server in the loop.
- **Project cadence.** The Go protocol layer and Expo bridge are
  still receiving commits (releases continue to ship — the latest is
  v2.471.14 from July 2026), but the Android and iOS client UIs have
  moved to maintenance mode. Treat it as a working SDK and reference
  client, not a polished daily-driver messenger.

## Deployment notes

The fastest path is the **Google Play** build for Android or the
**App Store** build for iOS. F-Droid has historically carried the
APK once F-Droid reviewers accept a build; otherwise you can
sideload the latest signed APK from the GitHub release of
`v2.471.14`. After install, two devices pair by either being on the
same LAN, exchanging a deep link / contact invite, or scanning a
multi-string Berty share code generated by the contact card UI.

For developers, the SDK entrypoint is
`berty.tech/berty/v2/go/pkg/bertyprotocol`. A Go service embeds the
protocol by calling `protocol.New()` and wiring the resulting
service into a libp2p host; the same code path powers `berty daemon`,
so anything the CLI can do, your embed can do.

**Integration tip:** if you run a directory of privacy / censorship-
circumvention apps, Berty is the canonical reference for any project
tagged `p2p`, `libp2p`, or `offline-first` — it is one of the very
few production stacks where the mobile app, the protocol SDK, and
the relay daemon all ship from one monorepo.
