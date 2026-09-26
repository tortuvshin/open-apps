---
name: UTM
repoUrl: https://github.com/utmapp/UTM
projectType: production
category: productivity
stack: ios
description: Run virtual machines on iOS and macOS — Windows, Linux, and retro operating systems.
sourceDescription: Virtual machines for iOS and macOS
platforms:
  - ios
  - macos
licenses:
  - apache-2.0
links:
  github: https://github.com/utmapp/UTM
distribution:
  channels: []
tags:
  - apple
  - emulation
  - jailbreak
  - qemu
  - utm
  - virtual-machines
bestFor: []
whyListed: []
caveats: []
seo:
  title: UTM – Open Source Virtual Machines for iOS & macOS
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: utmapp
  repo: UTM
  url: https://github.com/utmapp/UTM
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:11:22+08:00
  labels:
    - mature
    - hot
  lenses:
    - production-like
visibility: keep
---
UTM is an iOS and macOS frontend for **QEMU**, the open-source machine
emulator that became the de-facto standard for cross-architecture
virtualization. The same team ships it as a Mac App Store release and
through AltStore, and the project is the rare emulator that has been
explicitly endorsed by Apple after a brief App Store removal in 2024.

## Why it matters

- **QEMU on Apple Silicon, with the iOS sandbox respected.** QEMU is
  ported to macOS already, but doing it from a sandboxed iOS app is a
  different problem. UTM uses a hypervisor-based approach on devices
  that support it and falls back to TCG software emulation on the
  rest. The architecture is `QEMU ↔ UTM hypervisor ↔ iOS app`.
- **Real ARM and x86/x86_64 guests.** ARM Linux, ARM Windows,
  RISC-V, and x86 guests all run. Performance depends on whether
  the device has hardware virtualization (A12 and later) — software
  emulation is interesting, not fast.
- **The Apple dispute settled.** UTM was briefly removed from the
  App Store in 2024 on the basis that JIT could enable malware. The
  team worked with Apple's App Review team and shipped a version
  without JIT, then a separate "UTM SE" with JIT only available via
  AltStore. The episode is now part of the project's documentation.

## How it works

The repo is `utmapp/UTM` and is mostly Swift + Objective-C. The macOS
target uses `Virtualization.framework` (Apple's hypervisor API) on
Apple Silicon; the iOS target uses a custom `hypervisor` entitlement
on newer devices and TCG everywhere else. The QEMU CLI is bundled
into the app, and the UI is a fairly traditional VM manager — list
of VMs, configuration panels for CPU, RAM, drives, networking, and a
SPICE-based viewer for the display.

## Caveats

- **Performance is software-bound on most devices.** A12+ hardware
  virtualization is fast. Older devices run x86 guests slowly enough
  that it's a curiosity, not a tool.
- **JIT and iOS are still in tension.** The App Store build does not
  enable JIT; AltStore / sideload builds do. If you need JIT for a
  specific use case, you need a non-vendor distribution.
- **Apple's App Store policy on emulators is not stable.** The 2024
  removal is documented in the project's blog. Future policy changes
  are a real risk.

## Deployment notes

The App Store download is the easiest path. For the JIT-enabled
UTM SE build, AltStore is the canonical sideload path. The
repository's `docs/` folder has SIP- and entitlement-related notes
for local builds. Building from source requires a paid Apple Developer
account (for the hypervisor entitlement) and a recent Xcode.

**Integration tip:** for a directory entry, this is the strongest
emulator reference on iOS in 2026. Pair it with `ish` (Linux shell)
when the user's question is "what can I actually run on my iPad?"
