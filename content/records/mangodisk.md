# MangoDisk

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
