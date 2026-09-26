---
name: AppFlowy
repoUrl: https://github.com/AppFlowy-IO/AppFlowy
projectType: production
category: productivity
stack: flutter
summary: A local-first collaborative workspace — pages, databases, and AI assistants — with the data
  stored on infrastructure you control.
description: Bring projects, wikis, and teams together with AI. AppFlowy is the AI collaborative
  workspace where you achieve more without losing control of your data. The leading open source
  Notion alternative.
sourceDescription: Bring projects, wikis, and teams together with AI. AppFlowy is the AI
  collaborative workspace where you achieve more without losing control of your data. The leading
  open source Notion alternative.
platforms:
  - ios
  - android
licenses:
  - agpl-3.0
links:
  github: https://github.com/AppFlowy-IO/AppFlowy
distribution:
  channels:
    - type: app-store
      platform: ios
      label: App Store
      url: https://apps.apple.com/us/app/appflowy/id6457261352
      verified: false
    - type: play-store
      platform: android
      label: Play Store
      url: https://play.google.com/store/apps/details?id=io.appflowy.appflowy&pli=1
      verified: false
tags:
  - blog
  - confluence-alternative
  - content-management
  - content-services
  - documentation
  - note-taking
  - notion-alternative
bestFor: []
whyListed: []
caveats: []
relations:
  - type: alternative-to
    to: notion
    evidence:
      type: repo-topic
      url: https://github.com/AppFlowy-IO/AppFlowy
      quote: notion-alternative
      checkedAt: 2026-09-22
  - type: alternative-to
    to: confluence
    evidence:
      type: repo-topic
      url: https://github.com/AppFlowy-IO/AppFlowy
      quote: confluence-alternative
      checkedAt: 2026-09-22
seo:
  title: AppFlowy – Open Source Notion Alternative
addedAt: 2026-07-06
source:
  type: import
  provider: github
  owner: AppFlowy-IO
  repo: AppFlowy
  url: https://github.com/AppFlowy-IO/AppFlowy
curation:
  reviewed: true
  reviewedAt: 2026-08-11
  labels:
    - mature
    - hot
  lenses:
    - production-like
  reviewedBy: Open Apps curators
visibility: keep
---
AppFlowy is a self-hostable, open-source productivity workspace that pairs a
Notion-style block editor with database views (Grid, Board, Calendar),
real-time multi-user collaboration, and an optional AI assistant. The data
plane is Rust with a Yrs CRDT; the UI is a single Flutter codebase covering
macOS, Windows, Linux, iOS, and Android. The product is genuinely
local-first, but the open-core split means that a self-hosted multi-seat
deployment requires a paid commercial license.

![AppFlowy workspace — block editor with a Grid database view](/images/appflowy/workspace.png)

*AppFlowy's Notion-shaped workspace: a block editor on the left, a Grid database view on the right, both running on a local-first Rust+Flutter stack.*

## What AppFlowy is, and what it isn't trying to be

AppFlowy's pitch is straightforward: build a Notion-shaped workspace that
runs on your hardware, with your data in your database, in an open-source
repository you can fork. The interesting engineering decision is that the
maintainers did not try to do this in JavaScript. The data layer is
**Rust** — split across `flowy-core`, `flowy-document`,
`flowy-database2`, `flowy-folder`, `flowy-ai`, `flowy-search`,
`flowy-storage` — and the UI is a single **Flutter** codebase that
produces desktop, mobile, and web builds from one Dart tree. The FFI
bridge between them is Protobuf-serialized, type-generated, and exposes
the data layer as a typed API to the UI.

This is the right architecture for a cross-platform productivity app with
real-time collaboration. Rust gives you SQLite, CRDT, file I/O, and AI
inference without paying JavaScript's memory tax; Flutter gives you a
single UI codebase that produces a real native rendering, not a WebView.
The editor is a first-party `appflowy_editor` Flutter package that
replaced `flutter_quill` in 2022 — owning your editor is the right call
when you need Notion-style block behavior with collaborative cursors,
slash menus, and database views.

## Local-first, but with strings attached

The "local-first" claim is real. Writes go to local SQLite first, then
sync to the server. The Yrs CRDT (the Rust port of Yjs) handles conflict
resolution. But the open-source product is not the same product as the
hosted one. The community-edition `AppFlowy-Cloud` is AGPL-3.0 and freely
self-hostable, **but** the documented self-host tier is **one user seat
plus three guest editors**. Larger seats require a per-server commercial
license (`SELF_HOST_LICENSE_AGREEMENT.md`) at $11.88/month/server with
annual renewal. The desktop and mobile clients remain AGPL-3.0.

This is a real open-core split. The framework maintainers are explicit
about it: the AppFlowy-Cloud README states the project is "adopting an
open-core model" while "AppFlowy Web and AppFlowy Flutter will remain open
source." The self-host pricing page lists tiers per server, not per seat,
which is itself a useful operational simplification if you want one
internal-only deployment for a small team.

## The "end-to-end encryption" claim is marketing

The marketing site says "end-to-end encryption." The self-hosting security
documentation describes TLS in transit and server-side encryption
(encrypted volumes for PostgreSQL, MinIO server-side encryption with KMS,
optional S3 AES256). These are different claims. Server-side encryption
means the cloud operator can read your data; E2EE means they cannot. The
mismatch has been picked up by reviewers; a Reddit thread titled "Let's
address the elephant in the room: end-to-end encryption" exists on
r/AppFlowy. Treat the "E2EE" claim as marketing-grade until proven
otherwise, and do not put regulated data on an AppFlowy Cloud deployment
without confirming the actual encryption boundary.

## The sync and import story is the weak link

The two most damaging criticisms in the AppFlowy community are about sync
reliability and Notion import. The OpenTechHub November 2025 review
called sync "the true killer issue." An iOS App Store review from July
2026 says: "I lost data multiple times both on mobile and desktop app." A
closed issue from October 2025, **#8112** ("Full data loss in case of
migration problems due to data storage in RocksDB"), was a real incident
tied to the local store on a migration path before the project reverted
to SQLite.

The Notion import story is structurally lossy for a reason that is not
AppFlowy's fault. Notion's official export is Markdown + CSV; **Notion
does not export Notion databases through the export endpoint**. Whatever
AppFlowy imports from a Notion export cannot include the database rows,
properties, or relations that made the original workspace useful. Multiple
open issues (#8937, #8862, #8789, #8744) complain about "Notion import is
broken." The right mental model is "import pages, not workspaces."

## Where AppFlowy is the best choice

- A single user or small team that wants Notion-shaped features with
  local-first writes, can stomach the AGPL-3.0 + commercial self-host
  split, and is willing to back up the SQLite file.
- A developer who wants to fork a Notion-shaped productivity app and is
  willing to maintain a CRDT-based Rust core.

## Where AppFlowy is not the right choice

- A team of 20+ that wants free self-hosting. The commercial self-host
  license is per-server and not cheap at $11.88/month.
- A user with regulated data expecting E2EE. The marketing says yes; the
  docs describe server-side encryption.
- Anyone whose primary use case is "import my Notion workspace." The
  import is lossy by design.
- A mobile-first team. Mobile sync has the most data-loss complaints in
  the community.

## Deployment notes

The reference install is the `AppFlowy-Cloud` Docker Compose stack:
`appflowy_cloud` (the Rust server), `gotrue` (auth), `postgres`, `minio`
(or any S3), `redis`, and a reverse proxy. The maintainers publish a
self-hosting security guide with an automated backup script that covers
PostgreSQL dump, MinIO storage, and `.env` (daily cron @ 02:00, 30-day
retention, optional off-site via AWS S3 sync, rsync, or Restic with 7
daily / 4 weekly retention).

## Developer lessons worth borrowing

- **Own your editor.** The `appflowy_editor` rewrite from `flutter_quill`
  was the difference between "Markdown app" and "Notion competitor."
  The editor is the product, not the chrome around it.
- **Type your FFI boundary.** Protobuf codegen at the FFI seam (Dart and
  Rust both consume the same types) is a friction-killer for
  cross-language refactors. Many "Rust + Flutter" projects get this wrong;
  AppFlowy gets it right.
- **Local-first needs a real backup story.** The official self-host
  backup script is the right answer (PostgreSQL dump + MinIO + `.env`).
  If you self-host, wire that script to your off-site target on day one.
- **Open-core is a deliberate trade.** A per-server commercial self-host
  license at $11.88/month funds the Rust core development. The AGPL-3.0
  client remains free.

## How AppFlowy compares

The "Notion-shaped workspace" market is the most crowded open-source
comparison category, and the honest answer is that the right tool
depends on which Notion feature you actually need.

| Project | License | Storage model | E2EE | Block editor | Database views | Sync target | Best for |
|---|---|---|---|---|---|---|---|
| **AppFlowy** | AGPL-3.0 (client) + commercial self-host license | Local-first SQLite, cloud sync via AppFlowy-Cloud | No (server-side encryption, not E2EE) | First-party block editor (formerly `flutter_quill`) | Grid, Board, Calendar | Self-hosted (per-server commercial fee) or AppFlowy Cloud | A small team that wants a real Notion alternative and is willing to back up the SQLite file |
| **Notion** | Closed-source SaaS | Hosted only | No | Block editor | Grid, Board, Calendar, Gallery, Timeline, List | Notion Cloud | A team that wants zero setup and the broadest feature set, and can accept the price |
| **Obsidian** | Source-available (free for personal use) | Local Markdown files | N/A (data is local) | Markdown-based | Dataview plugin (community) | Local file system + optional paid Sync | A single user who wants durable Markdown files and is willing to invest in plugins |
| **Anytype** | Source-available (Any Source Available License 1.0) | Local-first (Anysync) | Yes (peer-to-peer) | Block editor (some Notion-like features) | Grid, Board, Calendar | Peer-to-peer / self-hosted Anytype Hub | A user who wants E2EE + local-first + block editor, and accepts alpha-quality collaboration |
| **Logseq** | AGPL-3.0 | Local Markdown / Org files | N/A (local) | Outliner + block editor | Queries, advanced | Local file system + optional paid Sync | A knowledge worker who thinks in outliner and queries rather than databases |
| **AFFiNE** | MIT (client) | Local-first (CRDT) | No | Block editor + whiteboard | Grid, Board, List | Local + paid AFFiNE Cloud | A user who wants both Notion's database views and Miro's whiteboard in one tool |
| **Outline** | BSL 1.1 (source-available) | Hosted only | Partial | Block editor | Limited | Outline Cloud / self-hosted | A team that needs a wiki with team permissions, not a personal workspace |

**Pick AppFlowy** if you want Notion-shaped features with local-first
writes, can stomach the AGPL-3.0 client + commercial self-host license,
and do not need a self-hosted free-tier for > 4 users.

**Pick Notion** if the team is small enough to pay for the real product
and you need the broadest feature set. You are paying for the polish,
not the data ownership.

**Pick Obsidian** if you already think in plain Markdown and want the
most durable file format. You give up the database views.

**Pick Anytype** if E2EE is the headline feature. The trade is a
younger collaboration story and the Any Source Available License.

**Pick Logseq** if your work is "thinking on paper" rather than
project management. The block-level reference graph is the strongest
in the category.

**Pick AFFiNE** if you need a whiteboard and a database in the same
canvas. The single-author project is past v1 but the collaboration
story is still maturing.

**Pick Outline** if your real need is a team wiki with permissions, not
a personal workspace.

## Verified sources

- AppFlowy repository: <https://github.com/AppFlowy-Cloud/AppFlowy-Cloud>
- Self-hosting tier and pricing — `SELF_HOST_LICENSE_AGREEMENT.md` in
  the AppFlowy-Cloud repo.
- E2EE Reddit thread — r/AppFlowy, "Let's address the elephant in the
  room: end-to-end encryption". The marketing site claim vs the
  self-hosting security documentation mismatch is in that thread.
- Sync and import issues — AppFlowy GitHub issues #8112, #8937,
  #8862, #8789, #8744 (representative; not exhaustive).
- Notion import scope — Notion's official export documentation;
  confirms that Notion does not export Notion databases through the
  export endpoint.
- Comparison to Obsidian / Logseq / Anytype — these are positioning
  summaries, not affiliated reviews.
