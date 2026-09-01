# Helm

Helm is a macOS toolkit that collects fifteen system tools behind one window and one menu-bar item. It is MIT licensed, built with Flutter, and makes no network calls.

## What the codebase includes

- Monitors for memory, CPU, GPU, sensors, battery, and network, each keeping 24 hours of history as a chart rather than only a live reading.
- A process manager attached to the CPU page, real SMC temperature reading on the sensors page, and battery levels for connected accessories such as AirPods and Magic Keyboards.
- A storage suite: a disk overview that accounts for purgeable space, a disjoint category breakdown, a squarified treemap explorer with breadcrumb drill-down, a junk cleaner, a large-and-old file finder, a byte-for-byte duplicate finder, and APFS snapshot thinning.
- An app uninstaller that removes leftovers, startup-item management, and a privacy tool.
- Clipboard history with a global quick-paste popup handling text, images, and file copies, plus a colour picker, a keep-awake toggle, and quick actions.
- A configurable live menu-bar item, per-metric alert thresholds, and a login-item watchdog that reports when an app adds itself to startup.

## Why it is useful to study

Reading genuine macOS system state from a Flutter app is the substance here. Purgeable disk space, SMC sensor temperatures, APFS snapshots, and accessory battery levels each need platform work that a cross-platform UI framework does not provide, and the repository shows one way to wire that up while keeping a single design language across fifteen surfaces.

The storage tooling is more complete than most open-source equivalents. The category breakdown is built to be disjoint so the totals reconcile with About This Mac instead of contradicting it, junk cleaning pre-selects only the safe categories and leaves the risky ones opt-in, and the duplicate finder compares byte-for-byte and always keeps one copy.

## Safety model

Removal goes to the Trash rather than deleting in place, so anything the app clears can be recovered. Emptying the Trash is the single destructive action and is confirmed explicitly.

## Caveats

macOS 10.15 or later, universal for Apple Silicon and Intel. There is no Windows or Linux target and the app is not portable to one, since most of its value comes from macOS-specific system access.

Depending on SMC sensors and storage internals means the app tracks details that Apple can change between macOS releases, so some readings need maintenance over time.
