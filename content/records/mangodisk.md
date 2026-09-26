---
submittedBy: harry0703
name: MangoDisk
repoUrl: https://github.com/harry0703/MangoDisk
projectType: real-app
category: tools
stack: tauri
summary: A cross-platform Tauri desktop app with a Rust core for finding caches, large files, exact
  duplicates, and application leftovers, plus startup management, system optimization, and common
  repair tools. Scans are read-only by default, and cleanup decisions remain visible to the user.
description: MangoDisk is a safety-first disk cleaner and storage analyzer for macOS and Windows
  that scans locally, visualizes disk usage, and lets users review paths and sizes before removal.
sourceDescription: Safety-first disk cleaner and space analyzer for macOS and Windows, with
  duplicate cleanup, app uninstall, startup management, system optimization, and maintenance.
platforms:
  - macos
  - windows
licenses:
  - gpl-3.0
links:
  github: https://github.com/harry0703/MangoDisk
  website: https://mangodisk.app/
distribution:
  channels:
    - type: github-releases
      platform: macos
      label: macOS disk image
      url: https://github.com/harry0703/MangoDisk/releases/latest
      verified: true
    - type: github-releases
      platform: windows
      label: Windows installer and portable build
      url: https://github.com/harry0703/MangoDisk/releases/latest
      verified: true
tags:
  - open-source
  - desktop-app
  - local-first
  - disk-cleaner
  - disk-space-analyzer
  - duplicate-files
  - app-uninstaller
  - startup-manager
  - system-maintenance
  - rust
  - vue
  - macos
  - windows
bestFor:
  - Studying how a Tauri application keeps filesystem-heavy business logic in reusable Rust crates
    while sharing a Vue interface across macOS and Windows.
  - Finding what is consuming storage before deciding whether anything should be removed.
  - Reviewing a local-first cleanup workflow with explicit safety boundaries and operation history.
whyListed:
  - It is a complete GPL-3.0 desktop application with signed public releases for macOS and Windows,
    multilingual documentation, and an actively maintained rule library.
  - The codebase separates scanning, safety rules, cleanup execution, CLI support, and the desktop
    interface, making the implementation useful beyond the finished application.
  - Its storage treemap, content-based duplicate detection, application-leftover review, startup
    management, and repair tools cover a broad real-world system-utility workflow.
caveats:
  - Cleanup, permanent deletion, application uninstall, and system changes may not be reversible;
    users should review selections and keep backups of important data.
  - Some cleanup and maintenance operations require administrator access, and some system changes
    require a restart before they take effect.
  - Linux is not currently a supported packaged target.
seo:
  title: MangoDisk – Open Source Disk Cleaner for macOS & Windows
addedAt: 2026-09-03
source:
  type: submit
  provider: github
  owner: harry0703
  repo: MangoDisk
  url: https://github.com/harry0703/MangoDisk
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
MangoDisk is a local-first disk cleaner and storage analyzer for macOS and Windows. It combines the jobs that often require several utilities—finding large files, inspecting caches, locating exact duplicates, removing application leftovers, managing startup items, and repairing common system problems—while keeping the cleanup decision visible.

## What the codebase includes

- A Tauri 2 desktop shell and Vue 3 interface shared across macOS and Windows.
- A Rust workspace that contains filesystem scanners, platform adapters, cleanup rules, duplicate detection, operation history, and CLI support.
- Read-only scanning by default, with paths, categories, sizes, and estimated reclaimable space shown before cleanup.
- A treemap and list view for drilling into the folders and files consuming the most storage.
- Exact duplicate detection based on file content, with selection logic that keeps at least one copy in each group.
- Application uninstall workflows that distinguish rebuildable leftovers from data that may contain personal files.
- Startup management, system optimization, and maintenance actions with platform-specific safety checks.
- Signed desktop releases, portable and CLI builds, multilingual documentation, and automated release packaging.

## Why it is useful to study

Disk utilities sit close to destructive filesystem operations, so the interesting part is not just how many paths an app can scan. MangoDisk exposes a practical safety boundary: discovery and analysis happen first, removal requires an explicit action, and the result is recorded. Its cleanup rules are public and organized by operating system and software domain, which makes the reasoning behind supported targets auditable.

The repository also demonstrates a cross-platform architecture where the reusable Rust core serves both the desktop interface and command-line client. Platform-specific implementation details remain separated from shared models and scanning logic, while the Vue layer focuses on presenting large result sets and confirmation workflows.

## Caveats

Cleanup, permanent deletion, application uninstall, and system changes can be irreversible. Review selected paths and keep reliable backups of important files. Some actions require administrator privileges or a restart.

MangoDisk currently packages macOS and Windows builds; Linux is not a supported release target. The application changes quickly, so readers evaluating the source should use the current release notes and repository documentation rather than screenshots from third-party articles.

## How to run it

Download the current macOS disk image, Windows installer, or Windows portable build from the project website or GitHub Releases. Homebrew installation is also documented for macOS, and standalone command-line builds are available for both supported operating systems.

## Verified sources

- MangoDisk repository: <https://github.com/harry0703/MangoDisk>
- Project website: <https://mangodisk.app/>
- Latest release: <https://github.com/harry0703/MangoDisk/releases/latest>
- Cleanup rule library: <https://github.com/harry0703/MangoDisk/tree/main/src-tauri/crates/mangodisk-core/rules>
- English documentation: <https://github.com/harry0703/MangoDisk/blob/main/README.md>
- Japanese documentation: <https://github.com/harry0703/MangoDisk/blob/main/README.ja.md>
- Simplified Chinese documentation: <https://github.com/harry0703/MangoDisk/blob/main/README.zh-CN.md>
- Traditional Chinese documentation: <https://github.com/harry0703/MangoDisk/blob/main/README.zh-TW.md>
