---
name: Hyperconsciousness
repoUrl: https://github.com/louis030195/hyperconsciousness
projectType: real-app
category: developer-tools
stack: rust
description: Hyperconsciousness is a developer-alpha CLI and MCP/HTTP server for encrypted, append-only knowledge storage, device sync, and scoped, expiring agent access.
platforms:
  - macos
  - linux
  - windows
licenses:
  - mit
tags:
  - cli
  - mcp
  - knowledge-management
  - encrypted-storage
  - local-first
bestFor:
  - Developers keeping persistent notes and source records across devices.
  - Agent integrations that need access limited by record kind, tags, sensitivity, and expiry.
whyListed:
  - A runnable Rust CLI and server with documented source installation and an isolated demo-store walkthrough.
  - Signed append-only records and grant-scoped retrieval provide concrete storage and access-control designs to study.
caveats:
  - Developer alpha; APIs and commands may change. No independent security audit is claimed.
  - Grants limit server responses but do not sandbox a process that can access the owner's files or keys.
  - Hosted model providers can see plaintext returned to them through a grant.
  - The optional local dashboard is installed separately. Private Companion and agent orchestration are outside this repository.
links:
  github: https://github.com/louis030195/hyperconsciousness
  docs: https://github.com/louis030195/hyperconsciousness/blob/main/README.md
seo:
  title: Hyperconsciousness - Open Source Encrypted Knowledge Store
addedAt: 2026-10-07
submittedBy: louis030195
source:
  type: submit
  provider: github
  owner: louis030195
  repo: hyperconsciousness
  url: https://github.com/louis030195/hyperconsciousness
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
## What it does

Hyperconsciousness stores signed, encrypted records in append-only logs and synchronizes them between devices. Its CLI lets a user create an isolated store, write notes, and grant an agent access to selected records for a limited time. Compatible MCP clients can search or read those records through the local server.

## What to study

The public repository separates the durable log from rebuildable indexes and transport adapters. The [architecture documentation](https://github.com/louis030195/hyperconsciousness/blob/main/docs/ARCHITECTURE.md) describes those boundaries. The [README](https://github.com/louis030195/hyperconsciousness/blob/main/README.md) includes source-build commands, a synthetic demo store, and a grant-scoped MCP configuration.

## Limits

This is a developer alpha. Read the [constraints and threat model](https://github.com/louis030195/hyperconsciousness/blob/main/docs/CONSTRAINTS.md) before storing important data. Encryption does not hide returned plaintext from its recipient, and grant checks do not isolate another process running under the owner's OS account. The optional dashboard is a separate local inspector; the public repository does not include the private Companion or agent orchestration.
