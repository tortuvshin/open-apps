---
name: Keybase
repoUrl: https://github.com/keybase/client
projectType: real-app
category: communication
stack: react-native
summary: Keybase ties cryptographic identities to public social-media proofs (Twitter, GitHub,
  Reddit, personal sites) and then layers an end-to-end-encrypted chat protocol and the KBFS
  encrypted filesystem on top of that verified identity — a model no mainstream messenger
  replicates. The consumer product was wound down in 2024 after Zoom's 2020 acquisition, but the Go
  client, chat1 protocol, and KBFS / Stellar libraries remain useful as reference implementations.
description: Keybase Go Library, Client, Service, OS X, iOS, Android, Electron..
sourceDescription: Keybase Go Library, Client, Service, OS X, iOS, Android, Electron..
platforms:
  - android
  - ios
licenses:
  - bsd-3-clause
links:
  github: https://github.com/keybase/client
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/keybase/client/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/keybase/client/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: Keybase – Open Source Encrypted Chat & Identity App
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: keybase
  repo: client
  url: https://github.com/keybase/client
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
Keybase is an open-source, end-to-end-encrypted chat, file-sharing, and
identity-verification platform written primarily in Go. Its distinguishing
feature is not the cryptography itself but the identity-plus-proofs model:
a Keybase user owns a cryptographic identity that they publicly link to
their Twitter, GitHub, Reddit, Hacker News, Bitcoin, Zcash, and personal
website accounts through signed proof statements rather than OAuth.

## Why it matters

- **Identity anchored in proofs.** Every Keybase user has a per-device
  keypair plus an optional paper key for recovery. New devices are added
  by reciprocal signatures that chain back to the original — and to
  social-media proofs — so anyone can verify that `chris` on Keybase is
  the same person as `chris` on Twitter and GitHub. The verification is
  outbound, meaning the recipient does not need a Keybase account to
  receive an encrypted message; if they later sign up and prove control
  of one of those identities, the sender's client "rekeys" the message
  on the fly.
- **Chat and KBFS on the same identity.** Keybase Chat (defined by the
  `protocol/avdl/chat1/` Avro IDL) and the Keybase File System
  (`go/kbfs/libkbfs/`) ride on top of that same identity. KBFS mounts
  at `/keybase/` on macOS and Linux (FUSE) and at `K:\` on Windows
  (Dokan), exposing `/keybase/private/<username>` (end-to-end
  encrypted), `/keybase/public/<username>` (signed, public), and
  `/keybase/team/<teamname>` (encrypted team folders). Each top-level
  folder's mutations are tracked in a Merkle tree
  (`go/merkletree2/`) so any node can be re-verified independently.
- **Post-acquisition status.** Zoom acquired Keybase in May 2020 to
  bootstrap end-to-end encryption for Zoom Meetings; in October 2023
  the team announced end-of-life, and the consumer apps (desktop,
  Android, iOS) and encrypted file-sharing service were discontinued
  on 2024-09-15. The Go client, the chat1 protocol definitions, KBFS,
  and the Stellar wallet integration remain on GitHub under BSD-3
  and are still useful as reference implementations.

## How it works

The repo is structured around a long-running local service written in
Go. `go/keybase` is the CLI front-end; `go/service` is the daemon that
listens on a Unix domain socket (macOS/Linux) or named pipe (Windows).
The daemon holds the unlocked device keys in memory, so a single
device-level login unlocks the CLI, the desktop GUI, and the KBFS
mount simultaneously. React Native (`shared/desktop`, `shared/ios`,
`shared/android`) is the shared UI layer; the native macOS app in
`osx/` is developed in parallel with the Electron desktop client.

Wire formats are defined in `protocol/avdl/` as Avro IDL — `keybase1`
for the core API, `chat1` for messaging (with `chat_ui`, `commands`,
`unfurl`, `notify` submodules), `gregor1` for the push system that
drives out-of-band notifications, and `stellar1` for the wallet
relay protocol. KBFS itself splits into many subpackages under
`go/kbfs/`: `libkbfs` holds the core logic, `kbfscrypto` the
per-block crypto, `kbfsmd` the top-level-folder metadata, and
`libfuse` / `libdokan` the OS-specific mount glue. The Merkle tree
implementation in `go/merkletree2/` is what lets KBFS verify that a
client's view of a folder is current without trusting the server.

## Caveats

- **The hosted service is gone.** No new signups are possible and
  existing keys will not be available forever; anything you build
  today should treat Keybase as a read-only codebase.
- **Security history.** Keybase users were targeted in a 2018 Stellar
  phishing campaign that mimicked legitimate airdrop pages to harvest
  wallet seeds; in 2021 a bug in the Coinbase verification flow
  briefly allowed attackers to bind arbitrary Twitter handles to
  their identities. These were user-side and integration issues, not
  breaks of the underlying crypto, but they remain instructive.
- **Practical audience.** The user base that flocked to Keybase
  during the 2020–2021 E2EE boom has largely moved on to Signal and
  Matrix; chat rooms are mostly dormant.

## Deployment notes

```bash
# CLI client — install from the GitHub release tarball
curl -O https://github.com/keybase/client/releases/download/v6.6.3/keybase-v6.6.3.tar.xz
tar -xJf keybase-v6.6.3.tar.xz
sudo ./keybase_6.6.3/install

# Or build from source (requires Go 1.19+)
git clone https://github.com/keybase/client.git
cd client/go
go install -tags production github.com/keybase/client/go/keybase
keybase

# Desktop / mobile
# Pre-built binaries for macOS, Windows, Linux, iOS, Android lived
# at https://keybase.io/download prior to the 2024-09-15 shutdown.

# KBFS — FUSE on Linux/macOS, Dokan on Windows
sudo /usr/local/bin/keybase mount
ls /keybase/private/<username>
```

**Minimum:** Linux 5.x or macOS 11+ with FUSE installed for KBFS; any
modern desktop OS for the CLI alone. Building from source needs Go 1.19
plus Node 4.x for the Avro IDL tooling.

**Integration tip:** the Go packages under `go/kbfs/libkbfs/`,
`go/chat/`, and `go/merklestore/` are the parts most worth importing.
A chat or file-share project that wants identity-plus-proofs
semantics can model itself on `libkb`'s chain of device and paper
keys, on `merkletree2` for tamper-evident folder history, and on the
Avro definitions in `protocol/avdl/chat1/api.avdl` for a battle-tested
message schema — even if you never ship a Keybase client.
