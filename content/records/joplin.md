---
name: Joplin
repoUrl: https://github.com/laurent22/joplin
projectType: real-app
category: productivity
stack: react-native
summary: An end-to-end encrypted note-taking and to-do application with cross-platform sync via
  Joplin Cloud, Dropbox, OneDrive, WebDAV, or a local filesystem.
description: Joplin is a free, open source note taking and to-do application. The mobile client is
  built with React Native and supports full sync via Nextcloud, Dropbox, OneDrive, WebDAV, and
  Joplin Cloud.
sourceDescription: Joplin is a free, open source note taking and to-do application. The mobile
  client is built with React Native and supports full sync via Nextcloud, Dropbox, OneDrive, WebDAV,
  and Joplin Cloud.
platforms:
  - android
  - ios
licenses:
  - noassertion
links:
  github: https://github.com/laurent22/joplin
distribution:
  channels: []
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: Joplin – Open Source Note-Taking & To-Do App
addedAt: 2026-06-07
source:
  type: import
  provider: github
  owner: laurent22
  repo: joplin
  url: https://github.com/laurent22/joplin
curation:
  reviewed: true
  reviewedAt: 2026-08-11
  labels:
    - mature
    - hot
  lenses: []
  reviewedBy: Open Apps curators
visibility: keep
---
Joplin is a free, open-source, cross-platform note-taking and to-do app
that stores your notes as plain Markdown files, syncs them to a target of
your choice, and supports end-to-end encryption on top of any sync
backend. The desktop client is Electron + React; the mobile apps are
React Native; the self-hostable server is Node.js. The project has been
maintained for nearly a decade by a small lead-contributor team, with a
public warrant canary, a stable plugin API, and a real cross-platform
feature surface.

![Joplin desktop client — Markdown editor with renderer split-pane](/images/joplin/editor.png)

*Joplin's desktop client: a Markdown editor on the left, the rendered preview on the right. The same data renders identically on iOS, Android, and the web client.*

## Plain Markdown is the product

Joplin's most important design decision is also the least visible: a
note is a row in SQLite with a Markdown body and a `body_html` column.
Attachments are separate `Resource` rows on disk. The `.jex` export
format is a tar of the same data, lossless, with geolocation, updated
time, and tags preserved. This is not a quirky data-model choice — it is
the reason the project has survived nine years. Your notes are always
plain text on disk, in a portable container, readable by anything that
can read Markdown. If Joplin disappeared tomorrow, your library would
still be readable in any text editor.

The trade is real. The same plain-Markdown principle means the in-app
editor is a Markdown editor with WYSIWYG sugar, not a Notion-style block
editor. Joplin supports the standard Markdown extensions (KaTeX, Mermaid,
code blocks, footnotes, TOC, deflists, ABC notation, Fountain) and a
small whiteboard fence, but it does not have a database view layer. People
who want AppFlowy-shaped databases should use AppFlowy; people who want
durable Markdown files should use Joplin.

## Sync is genuinely multi-target, and E2EE is genuinely optional

Joplin's sync model is the most flexible in the open-source notes space.
The supported targets are **Joplin Cloud**, **Joplin Server**
(self-hostable), **Nextcloud** (via WebDAV), **WebDAV** (Apache, Nginx,
DriveHQ, Fastmail, HiDrive, InfiniCLOUD, Mailbox.org, OwnCloud, Seafile,
Stack, Synology, WebDAV Nav, Zimbra, Infomaniak kDrive), **Dropbox**,
**OneDrive**, **local filesystem**, and **S3** (AWS, Backblaze, Cloudflare
R2, DigitalOcean Spaces, Linode, Scaleway, UpCloud, Tebi — labeled Beta).
E2EE is available on top of any of them.

E2EE is **opt-in, not default**. A single master key (protected by your
password) encrypts notes, notebooks, tags, and resources. **The password
is unrecoverable** — both the docs and the maintainer are explicit. The
setup must be done sequentially, one device at a time; enabling on
multiple devices in parallel can produce multiple keys. This is the kind
of design that gives end-to-end encryption its teeth, and it is the same
design that produces the most common user complaint: "I forgot my master
password and now my notes are unreadable."

The Joplin Server license is the part of the project that is not what
casual readers assume. The desktop and mobile clients are AGPL-3.0-or-
later. The `packages/server/LICENSE.md` is a **proprietary "Joplin Server
Personal Use License"** that forbids commercial hosting. The commercial
path is **Joplin Server Business** at €30–€40/user/year, which includes
source access, publishing, sharing, and priority support.

## Three editor backends over a shared renderer

The most underappreciated piece of Joplin's architecture is the editor
strategy. The desktop wrapper `NoteEditor.tsx` selects one of five
implementations at runtime: **TinyMCE 6.8.5** (the default WYSIWYG),
**CodeMirror 6** (the new Markdown view, with `@lezer/markdown` parser),
**CodeMirror 5** (the legacy Markdown path, kept for users who set
`editor.legacyMarkdown`), **PlainEditor** (the safe-mode fallback), and
**Whiteboard** (a tldraw-style canvas behind a ` ```whiteboard ` fence).
The mobile Rich Text Editor is a separate **ProseMirror** code path,
introduced in Joplin 3.4 (September 2025), explicitly described as
"behaving differently from the desktop Rich Text Editor in many cases."

This is unusual and worth studying. Most apps pick one editor and live
with its limitations. Joplin runs two rich-text editor code paths
(TinyMCE on desktop, ProseMirror on mobile) plus two Markdown paths (CM5
legacy, CM6 new) over a shared `MarkupLanguage` and a shared `renderer`
package. The cost is maintenance; the win is the right editor for each
platform's UX expectations.

## A decade of one-maintainer stewardship

Joplin is functionally maintained by **Laurent Cozic** (`laurent22`) with
a small set of recurring contributors. The repo has 11,670,490 lines of
TypeScript, 619 open issues, and 20 open PRs. A pinned issue from June
2026, **#15625 ("Pull requests from new contributors are temporarily
paused")**, is an open admission of capacity constraints.

The single-maintainer pattern is not inherently bad, but it works only
if there is a clear funding path and a public commitment to succession.
Joplin has the funding: Patreon, GitHub Sponsors, Liberapay, PayPal, IBAN,
plus Joplin Cloud subscriptions and Joplin Server Business. The project
has a public **warrant canary** updated every 60 days, signed with a
published key (current statement date 2026-06-19, valid until 2026-08-18).
The warrant canary is a legal-stance commitment, not a popularity signal,
and it is rare in open-source notes.

## Where Joplin is the best choice

- A user with an existing WebDAV, Nextcloud, or S3 setup who wants their
  notes encrypted on top of storage they already pay for.
- A power user who wants plain-Markdown files they can grep, back up,
  and read in any text editor, with E2EE available when they want it.
- A user who values the warrant canary and the open plugin API more than
  a polished mobile experience.
- An org that wants Joplin Server Business and is willing to pay
  €30–€40/user/year for the multi-user features.

## Where Joplin is not the right choice

- A user with a 50k-note library who lives on mobile. The Android and
  iOS apps are heavy and slow at scale; the maintainer has acknowledged
  this in the issue tracker.
- A team that needs real-time multi-user editing in the way Notion or
  AppFlowy do it. Joplin's conflict resolution is "last write wins" with
  a conflict notebook — functional, not collaborative.
- A user who wants a free, fully open-source self-hostable server. The
  Joplin Server license is proprietary; you can self-host for personal
  use, but commercial hosting requires a paid license.
- A user who needs a database/block view layer. Joplin is a Markdown
  app, not a Notion competitor.

## Deployment notes

The reference install is the `joplin/server:latest` Docker image on port
22300, with **SQLite by default** (PostgreSQL recommended for production).
The `STORAGE_DRIVER` config can put item contents in the database, on the
filesystem, or in S3. Reverse-proxy recipes for Apache and Nginx are in
the server README. The most common production setup is Postgres + S3 +
Nginx + a daily `pg_dump` + an S3 lifecycle policy.

E2EE setup: enable it in one device first, set the master password, wait
for the initial encryption sync to complete (this can be slow on large
libraries — the docs suggest letting it run overnight). Then enable on
the second device, enter the same password, and wait again. Do not
enable on multiple devices in parallel.

## Developer lessons worth borrowing

- **The plain-Markdown data model is the project.** Joplin has survived
  nine years and many corporate competitors because a note is a row with
  a Markdown body. Own the format you depend on.
- **Sync over a file API driver is an anti-corruption layer.** The
  `file-api-driver-*` abstraction (one per sync target) is a textbook
  example of putting the messy real-world providers behind a clean
  interface. Every app that has more than one storage backend has had to
  learn this; Joplin is a good case study.
- **Three editor backends over a shared renderer is allowed.** The cost
  is maintenance, the win is per-platform UX.
- **A warrant canary is a feature.** Updating a signed statement every
  60 days is a legal-stance commitment, not a popularity signal. Few
  open-source projects do it; Joplin does.
- **The single-maintainer pattern works only with a public funding path
  and an honest capacity signal.** Joplin has both; the bus factor is
  real and acknowledged.

## How Joplin compares

The "open notes" market in 2026 splits into two questions: what is the
file format, and who can read your notes. Joplin's answer — plain
Markdown files plus optional E2EE — is the most portable of the lot.

| Project | License | File format | E2EE | Multi-target sync | Editor style | Best for |
|---|---|---|---|---|---|---|
| **Joplin** | AGPL-3.0 (client) + proprietary "Joplin Server Personal Use License" (server) | Plain Markdown + SQLite | Yes (opt-in, master key, irrecoverable) | Joplin Cloud, Joplin Server, Nextcloud, WebDAV, Dropbox, OneDrive, local FS, S3 (Beta) | WYSIWYG (TinyMCE) or Markdown (CodeMirror 5/6) | A user with an existing WebDAV / Nextcloud / S3 setup who wants encrypted notes on top of storage they already pay for |
| **Obsidian** | Source-available (free for personal use) | Plain Markdown | N/A (local) | Local + optional paid Sync | Markdown-based | A single user who wants durable Markdown files and the plugin ecosystem |
| **Logseq** | AGPL-3.0 | Plain Markdown / Org | N/A (local) | Local + optional paid Sync | Outliner + block editor | A knowledge worker who thinks in outliner and queries |
| **Anytype** | Source-available (Any Source Available License 1.0) | Local-first (Anysync) | Yes (peer-to-peer) | Anytype Hub | Block editor | A user who wants E2EE + local-first + a growing collaboration story |
| **Standard Notes** | AGPL-3.0 (server) + proprietary (some clients) | Encrypted backups | Yes (XChaCha20-Poly1305, Argon2id) | Standard Notes Cloud (paid) or self-hosted | Plain markdown, rich text via extensions | A user who wants durable E2EE on a free self-host stack |
| **Notesnook** | AGPL-3.0 + source-available | Encrypted vault (monorepo) | Yes (XChaCha20-Poly1305, Argon2id, Vericrypt) | Notesnook Cloud (paid) or self-hosted | Rich text, markdown | A user who wants externally verifiable E2EE (Vericrypt) more than Markdown durability |
| **Notion** | Closed-source SaaS | Proprietary | No | Notion Cloud | Block editor | A team that wants collaboration, not a personal note archive |

**Pick Joplin** if you already have a sync target (WebDAV, Nextcloud,
S3, Dropbox) and want your notes to be plain Markdown files on disk
that you can still read in 10 years if Joplin disappears.

**Pick Obsidian** if you only need single-device notes and want the
deepest plugin ecosystem. Trade-off: no real sync story without
paying.

**Pick Logseq** if your note-taking is journal-style and you want
outliner + queries. Trade-off: no mobile-first experience.

**Pick Anytype** if E2EE + local-first is the headline feature and you
can accept alpha-quality collaboration.

**Pick Standard Notes** if you want a free self-hostable E2EE notes
server and do not care about Markdown durability.

**Pick Notesnook** if you want to be able to prove your E2EE claim
to a third party (Vericrypt). The trade-off is an encrypted vault
rather than plain Markdown files.

**Pick Notion** if the real need is collaboration, not a personal
note archive.

## Verified sources

- Joplin repository: <https://github.com/laurent22/joplin>
- Joplin Server license — `packages/server/LICENSE.md` (proprietary
  "Joplin Server Personal Use License" prohibiting commercial hosting).
- Joplin Server Pricing — <https://joplinapp.org/plans/> (€30–€40 per
  user per year for Business).
- Joplin warrant canary — <https://joplinapp.org/canary/> (current
  statement date 2026-06-19; valid until 2026-08-18).
- Editor strategy — `NoteEditor.tsx` in the desktop client; mobile
  ProseMirror editor introduced in Joplin 3.4 (September 2025).
- Comparison facts about other projects — drawn from each project's
  own published documentation; not affiliated reviews.
