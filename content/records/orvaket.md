---
name: Orvaket
repoUrl: https://github.com/Akam1123/orvaket
projectType: real-app
category: business
stack: react
description: A browser-based accounts receivable board that turns CSV invoice exports into a human-reviewed follow-up plan.
platforms:
  - web
licenses:
  - mit
links:
  github: https://github.com/Akam1123/orvaket
  website: https://orvaket.pages.dev/
distribution:
  channels:
    - type: web-app
      label: Orvaket web app
      url: https://orvaket.pages.dev/
      verified: true
tags:
  - accounts-receivable
  - invoice-follow-up
  - local-first
  - csv-import
  - privacy
bestFor:
  - One person tracking overdue B2B service invoices from a flat accounts receivable CSV export.
whyListed:
  - A working MIT-licensed browser app with public source, a live sample workspace, CSV import review, and documented backup and restore flows.
  - Its small, recently published repository merits consideration for the concrete invoice reconciliation workflow and local data model rather than popularity.
caveats:
  - No cloud sync or server-side backup; users must keep their own JSON backups.
  - Imports are manual snapshots and do not verify balances with accounting systems.
  - Email drafts require human review and sending through a separate email client; the app does not collect payments.
seo:
  title: Orvaket – Open Source Accounts Receivable Follow-Up App
addedAt: 2026-09-26
submittedBy: Akam1123
---

Orvaket is a small accounts receivable follow-up workspace for a person managing overdue invoices at a B2B service firm. A visitor can explore fictional sample invoices before importing any customer data. The CSV import preview identifies skipped rows and reconciliation items, then asks for confirmation before changing the workspace. Each invoice can carry a blocker, an owner label, a next action, and a promised payment date. The app prepares a follow-up email draft that the user must check and send through their own email client.

The codebase is worth studying as a browser-local financial workflow: it handles repeat CSV snapshots while retaining follow-up notes, flags invoices missing from a later export, and offers JSON backup and restore. Local browser saves are readable by default; passphrase encryption is optional. There is no account, cloud sync, accounting-system connection, automated email delivery, or payment collection. Users should retain a separate backup and treat their accounting system as the source of truth.
