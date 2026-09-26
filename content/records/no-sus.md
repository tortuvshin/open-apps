---
name: NO SUS
repoUrl: https://github.com/https-shubhamsahu/NON_SUS
projectType: real-app
category: tools
stack: flutter
summary: Built and run by one developer. Go opens your Saved chat (stored in your own Google Drive)
  on a cyber-cafe, print-shop, or college-lab PC after you scan a QR with the phone app, so that PC
  never gets your Google password or token. Burn Notes and Burn Files are encrypted in the browser
  with the key in the URL fragment, and SecureSend stamps each viewer's identity on a shared
  document with view limits, expiry, and revocation. The repository holds the Flutter client (web
  and Android) plus the Supabase migrations and Deno edge functions.
description: NO SUS is a Flutter and Supabase privacy toolkit for students that opens your Saved
  files on a borrowed PC through a phone QR approval, sends self-destructing notes and files, and
  shares watermarked documents.
platforms:
  - web
  - android
licenses:
  - mit
links:
  github: https://github.com/https-shubhamsahu/NON_SUS
  website: https://nosus.foo
tags:
  - privacy
  - encryption
  - burn-after-reading
  - file-sharing
  - watermark
  - supabase
  - students
bestFor:
  - Students who have to use a cyber-cafe, print-shop, or college-lab PC and do not want to sign
    their Google account in there.
  - Sending a one-time note or a file up to 25 MB that expires after 1 hour, 24 hours, or 7 days,
    with no account on either side.
  - Developers studying browser-side AES burn links, an RLS-first Supabase schema, and a
    phone-approved QR session in Flutter.
whyListed:
  - A usable MIT-licensed Flutter app for web and Android with regular releases (v1.2.0 in July 2026
    through v1.4.1 in September 2026).
  - Documents plainly which parts are encrypted client-side (burn links) and which rely on
    access-control policies (shared documents).
caveats:
  - SecureSend and group or vault files are not end-to-end encrypted; they rely on
    row-level-security policies.
  - A burn link that uses the optional 2-digit pairing code keeps its key on the server for up to 20
    minutes.
  - On a borrowed PC, anything you download or print may stay on that machine, and browser
    screenshots cannot be blocked (only deterred with blur and watermarks).
  - Solo early-stage project; the Drop feature shown on the site is marked coming soon and does not
    work yet.
seo:
  title: NO SUS – Open Source Student Privacy Toolkit Built with Flutter
addedAt: 2026-09-24
source:
  type: submit
  provider: github
  owner: https-shubhamsahu
  repo: NON_SUS
  url: https://github.com/https-shubhamsahu/NON_SUS
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
# NO SUS

NO SUS is a privacy toolkit for students, built as a Flutter app (web and Android) on Supabase by one developer.

## What it does

1. **Go (borrowed computers).** Open nosus.foo/go on a cyber-cafe, print-shop, or college-lab PC, scan the QR with the NO SUS phone app, check a 2-digit match code, and approve with fingerprint or face. Your Saved chat opens on that screen. The phone keeps the Google token; the PC never receives your Google password or token and only sees items you approve. A session lasts at most 60 minutes and also ends on tab close, End on the phone, or idle. After the hello, the session uses AES-256-GCM; Supabase relays ciphertext and stores a hash of the session id.
2. **Saved.** A chat with yourself stored in your own Google Drive under a NO SUS/ folder, using the drive.file scope.
3. **Burn Notes and Burn Files.** Encrypted in the browser with 256-bit AES (CTR for notes, CBC for files). No account on either side, files up to 25 MB, expiry of 1 hour, 24 hours, or 7 days, and the link opens once. A normal link keeps the key in the URL fragment. The optional 2-digit pairing code stores the key server-side for up to 20 minutes.
4. **SecureSend.** Watermarks each viewer's identity on a document, with view limits, expiry, a view log, and instant revocation.
5. **Groups and Vault.** Invite-only study groups and a vault for shared documents under access control.

## Architecture and codebase

- **Client:** Flutter (web and Android) with Riverpod, feature-first layout under `lib/features/`.
- **Backend:** Supabase Postgres with row-level security enabled on every table, plus Deno edge functions for sensitive operations.
- **Audit:** a hash-chained audit ledger.

## Caveats

- SecureSend and group or vault files are not end-to-end encrypted; they rely on RLS policies.
- The pairing-code option keeps a key on the server for up to 20 minutes.
- Downloads and prints on a borrowed PC may stay on that PC. Browser screenshot blocking is impossible; on the web, NO SUS uses touch-to-reveal blur and identity watermarks as deterrence and attribution, not a guarantee. Native mobile blocks screenshots and screen recording with OS flags.
- Drop and group drops are coming soon, not shipped.

## Links

- Source: https://github.com/https-shubhamsahu/NON_SUS
- Website: https://nosus.foo
