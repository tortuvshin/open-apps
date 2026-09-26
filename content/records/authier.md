---
name: Authier
repoUrl: https://github.com/authier-pm/authier
projectType: real-app
category: productivity
stack: react-native
summary: A TypeScript codebase spanning React Native, browser-extension, Astro, and Cloudflare
  Worker clients, built around client-side encrypted vault sync and optional trusted-device
  enrollment approval.
description: Authier is an experimental AGPL password manager monorepo with a React Native client,
  browser extensions, and a web vault for credentials and TOTP codes.
sourceDescription: monorepo for Authier password manager
platforms:
  - ios
  - android
  - web
licenses:
  - agpl-3.0
links:
  github: https://github.com/authier-pm/authier
  website: https://www.authier.pm/
distribution:
  channels:
    - type: website
      platform: web
      label: Web vault and downloads
      url: https://www.authier.pm/download
      verified: true
    - type: other
      platform: web
      label: Chrome Web Store
      url: https://chromewebstore.google.com/detail/authier/padmmdghcflnaellmmckicifafoenfdi
      verified: true
    - type: other
      platform: web
      label: Firefox Add-ons
      url: https://addons.mozilla.org/en-US/firefox/addon/authier/
      verified: true
    - type: other
      platform: web
      label: Microsoft Edge Add-ons
      url: https://microsoftedge.microsoft.com/addons/detail/authier/jahkkkffomngonmmoopccjnhlngjjnll
      verified: true
tags:
  - open-source
  - mobile-app
  - web-app
  - productivity
  - privacy
  - security
  - encryption
  - sync
bestFor:
  - Studying a full-stack TypeScript password manager across React Native, browser extensions, a web
    vault, and an edge-hosted API.
  - Exploring client-side encrypted synchronization, TOTP handling, autofill, and trusted-device
    enrollment workflows in an early-stage codebase.
whyListed:
  - The complete AGPL-licensed application stack is public, actively maintained, documented, and
    available through three browser-extension stores plus a web vault.
  - The monorepo provides a concrete example of sharing password-manager schemas and cryptographic
    workflows across several TypeScript clients.
caveats:
  - Authier is early-stage and has not published an independent third-party security audit; an
    established audited password manager is the safer default for important secrets.
  - The native React Native clients are present in source but are not a current public download
    path; supported downloads are the web vault and browser extensions, including Firefox for
    Android.
  - The repository is inspectable, but the current documentation does not present self-hosting as a
    supported deployment path.
seo:
  title: Authier – Open Source Password Manager with Encrypted Sync
addedAt: 2026-09-01
source:
  type: submit
  provider: github
  owner: authier-pm
  repo: authier
  url: https://github.com/authier-pm/authier
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Authier is an open-source password manager for login credentials and time-based one-time password (TOTP) secrets. Its public user-facing clients are a web vault and extensions for Chrome, Firefox, and Microsoft Edge; the Firefox extension also runs on Firefox for Android.

## What the codebase includes

- A React browser extension with Manifest V2 and Manifest V3 builds, vault management, password autofill, and TOTP support.
- A separate React web vault for viewing and editing credentials, TOTP records, devices, and account settings.
- A React Native mobile client in the monorepo, although native mobile builds are not currently listed as supported public downloads.
- An Elysia API deployed through a Cloudflare Worker adapter, plus shared TypeScript schemas and cryptographic code used across clients.
- An Astro marketing and documentation site that publishes the current security model, download routes, privacy policy, and practical security caveats.

## Security model in the repository

Authier derives the client encryption key from the master password and a per-account salt using PBKDF2 with SHA-512 and 600,000 iterations. Vault items are encrypted with AES-256-GCM and a fresh initialization vector before synchronization, so the API receives encrypted credential and TOTP payloads rather than those secrets in plaintext.

Accounts can be configured to require approval from an existing trusted device before a new client enrolls and begins vault synchronization. TOTP synchronization can also be disabled per device. These controls are useful code to inspect, but they do not remove the need to protect every unlocked client and keep independent recovery options.

## Why it is useful to study

The repository shows how one TypeScript monorepo coordinates browser-extension, web, React Native, API, schema-generation, and encryption concerns for a security-sensitive product. It also exposes the practical edges that simpler examples often omit: multi-step-login autofill, device enrollment, encrypted synchronization, TOTP import/export, and separate Manifest V2 and V3 builds.

The [security architecture](https://www.authier.pm/security) documents the intended cryptographic flow, while the [official download page](https://www.authier.pm/download) identifies the currently supported clients.

## Caveats

Authier is a young, experimental password manager and has not published an independent third-party security audit. Public source makes the implementation inspectable, but it is not a substitute for a professional audit, a long operating history, or broad real-world review. For important secrets, an established audited password manager is the more conservative default.

The native mobile clients remain source code rather than a current supported store release, and the project does not currently document self-hosting as a supported deployment route. Evaluate the repository and its limitations before using it beyond a low-risk test vault.
