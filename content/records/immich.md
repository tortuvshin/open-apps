---
name: Immich
repoUrl: https://github.com/immich-app/immich
projectType: real-app
category: tools
stack: flutter
summary: A self-hosted photo and video backup service with first-class mobile apps and on-device
  machine learning.
description: Self-hosted photo and video backup solution directly from your mobile phone
sourceDescription: Self-hosted photo and video backup solution directly from your mobile phone
platforms:
  - android
  - ios
licenses:
  - agpl-3.0
links:
  github: https://github.com/immich-app/immich
distribution:
  channels: []
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
relations:
  - type: alternative-to
    to: google-photos
    evidence:
      type: repo-topic
      url: https://github.com/immich-app/immich
      quote: google-photos-alternative
      checkedAt: 2026-09-22
seo:
  title: Immich – Open Source Self-Hosted Photo & Video Backup
addedAt: 2026-06-07
source:
  type: import
  provider: github
  owner: immich-app
  repo: immich
  url: https://github.com/immich-app/immich
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
Immich is a self-hosted photo and video backup service that runs on your own
hardware and ships native iOS and Android apps written in Flutter. It does
on-device-class machine learning on the server — face recognition, CLIP-based
natural-language search, OCR, duplicate detection — without sending your
library to anyone. The result feels close to Google Photos while keeping your
data on a disk you control, under an AGPL-3.0 license that the maintainers
deliberately cannot relicense more permissively.

![Immich timeline view — grouped photos with date rail](/images/immich/timeline.png)

*Immich's timeline view, the closest implementation of Google Photos' grouped-by-date UX outside of Google itself.*

## From a side project to a Google-Photos-shaped standard

Immich is the rare self-hosted app whose UX compares favorably to its
commercial counterparts. Browse the timeline, the photos you took last summer
are in the right place. Search for "beach," you get the beach photos, not
the ones tagged `#beach` in a folder hierarchy. The reason it feels this way
is the same reason it took seven years to ship: the maintainers built a
system rather than a front end.

The architecture has three moving parts. The server is a **NestJS**
application in TypeScript that owns the REST API, the WebSocket layer, and
the metadata database. The mobile clients are a single **Flutter** codebase
covering iOS, Android, and the F-Droid build. The machine-learning work —
face detection, face embeddings, CLIP search, OCR — lives in a **Python
FastAPI** microservice that talks to the server over HTTP. None of these are
optional: removing the Python service turns Immich into a less interesting
photo sync tool.

What makes the ML split interesting is the **ONNX-only** inference stack.
The team does not depend on PyTorch; they ship the **ONNX Runtime** with
backend flavors for CUDA, ROCm, OpenVINO, ArmNN, and RKNN. Choosing which
hardware accelerator you want is a Docker image tag. A household with an
Intel iGPU and a family with an NVIDIA RTX card run the same code with a
different image name. The Python service caches models in memory, runs ONNX
directly, and exposes a stable HTTP contract.

The **vector search** path is equally deliberate. v3.0 migrated from
`pgvecto.rs` to a custom **Postgres 14 build with VectorChord** baked in.
The trade is operational — you run a forked Postgres image — but the
upside is that vector search is just a column in the same database, not a
separate service to deploy. The philosophy is: one operational database,
not three.

## The license was the point

In February 2024 the project moved from MIT to **AGPL-3.0**. The
accompanying discussion on GitHub is unusual in that the maintainers
explicitly justified *not* adopting a Contributor License Agreement. Their
reasoning: without a CLA, no future acquirer or hostile fork can relicense
the codebase. The community response on Hacker News and r/selfhosted was
overwhelmingly positive — people who self-host care about this more than
they care about a permissive license, and the AGPL's "network use is
distribution" clause is exactly the protection they want.

The decision has a cost. Any company that wants to ship a hosted fork of
Immich must either publish its modifications under AGPL or stay on the last
MIT release (v1.118.x) and lose new features. That's the intended outcome.
The team's commercial path is support contracts and a partnership with
**FUTO** for a managed backup service announced in v2.7.0 — not a SaaS fork
of the open-source code.

## What the architecture is not

Immich has chosen to be a few things well and to admit what it is not.
The `UPLOAD_LOCATION` is a filesystem bind mount; **there is no native S3
backend**. This is a real limitation if you want to back up to Backblaze B2
or Cloudflare R2 — every "Immich on the cloud" thread rehashes it.
**External libraries are single-owner** — a family of four cannot pool
their phone libraries into a single shared library the way Apple Family
Sharing works. Shared albums do not show up in face recognition or
full-text search. There is **no encryption at rest**; the upload directory
is plain files. These are not bugs. They are product decisions the team has
not yet made.

The **ML pipeline is fragile in ways that matter**. An OCR memory leak in
v2.2.0 ballooned the container to 12 GB RAM on certain models; an OpenVINO
regression in v2.5.2 broke Intel hardware acceleration. Both were
eventually fixed, but the pattern is clear: a young ML pipeline shipped
under aggressive release cadence will have rough edges. Running multiple
minor versions behind the latest is a common survival tactic for
self-hosters.

## Security has matured in public

The **GitHub Security tab** for Immich has 10 published advisories in 2026
alone, including a critical one-click XSS-to-account-takeover
(GHSA-8244-8vpr-vp9c, June 2026) and an API key privilege-escalation bug
(GHSA-237r-x578-h5mv, January 2026). The pattern is familiar for a
fast-moving app: access-control and OAuth bugs surface as the codebase
grows. What matters is the response, and the response has been on a normal
disclosure cadence with patches released alongside.

## Where Immich is the best choice

- A family or individual leaving Google Photos, willing to spend $300–$800
  on a mini PC or used enterprise desktop, with at least 2 CPU cores and
  8 GB RAM.
- A user who values face recognition and natural-language search and is
  willing to keep the ML container healthy.
- A tinkerer who wants the same code to run on a Raspberry Pi 5 (slow but
  functional) and on a Synology (recommended, with QuickSync transcoding).

## Where Immich is not the right choice

- A small business with 50 users and admin needs the project has not
  invested in. Use **Ente** if E2EE is the headline feature, **PhotoPrism**
  if you have an existing library and want best-in-class AI, or
  **Nextcloud Memories** if you are already on Nextcloud.
- A user who needs S3-backed storage, encryption at rest, or multi-owner
  external libraries.
- A user unwilling to keep up with monthly migrations. The 0.5.x → v2.0 →
  v3.0 transitions each required manual database steps.

## Deployment notes

The reference install is `docker compose up -d` against the official
`docker/docker-compose.yml`. Five containers: `immich-server` (port 2283),
`immich-machine-learning` (CPU by default; tag-swap for GPU), `redis`
(actually **Valkey**), `database` (the custom VectorChord Postgres), and
`immich-microservices`. Hardware-accelerated transcoding is a separate
`hwaccel.transcoding.yml` override. Maintainers recommend 6 GB RAM minimum,
8 GB recommended, with a recent x86-64-v2 CPU; the ML container can take
another 2–3 GB RAM when the CLIP model is loaded.

Backups are two-part: a `DatabaseBackup` job that writes a `pg_dump` to
`BACKUP_LOCATION`, and a separate backup of the `${UPLOAD_LOCATION}` tree.
Restoring is the reverse: put the upload tree back, restore the SQL dump,
restart. The two halves are independent — the database is metadata, the
tree is the bytes — and you must back up both.

## Developer lessons worth borrowing

- **The HTTP boundary between server and ML service is the right call.**
  It buys you GPU isolation, independent scaling, and a clean
  second-language boundary. For projects that need ML inference alongside
  a web app, this is the architecture to study.
- **ONNX-only inference is a "freedom of hardware" decision.** More work
  than just using PyTorch, but it makes the same code run on CUDA, ROCm,
  OpenVINO, ArmNN, and RKNN.
- **Hexagonal architecture in the server** (`src/repositories/` vs
  `src/services/`) makes swapping storage backends, ML clients, and queue
  implementations a matter of interface changes.
- **Custom Postgres builds are not as scary as they sound.** VectorChord
  was a deliberate "one operational database" choice; the maintenance cost
  is small relative to running a separate vector store.

## How Immich compares

The honest self-hosted photo space in 2026 has four credible answers. Each
makes a different trade-off; none is "better" in the abstract.

| Project | License | E2EE | ML pipeline | Storage backend | Multi-user | Best for |
|---|---|---|---|---|---|---|
| **Immich** | AGPL-3.0 | No (TLS in transit only) | ONNX Runtime; CLIP + face + OCR + duplicates | Filesystem bind mount (no native S3) | Yes (self-hosted multi-user) | The closest Google Photos equivalent for a single user or family that already runs Docker |
| **PhotoPrism** | AGPL-3.0 | No | TensorFlow-based (older, slower path for image classification) | Local filesystem + optional S3 | Yes (Community edition in 2024 altered the license) | A large existing library that needs ingestion and fast browsing; favorites tagging |
| **Ente** | AGPL-3.0 + source-available | **Yes** (XChaCha20-Poly1305, libsodium) | On-device in the mobile client; server-side enrichment is optional | S3-compatible (Ente Cloud or self-host) | Yes (paid plan required for self-host multi-user) | Users who want true E2EE before the bytes leave the phone |
| **Nextcloud Memories** | AGPL-3.0 (Nextcloud) | Whatever Nextcloud provides (server-side encryption with E2EE in Nextcloud 29+) | Optional via the `recognize` app | Nextcloud primary storage | Yes (Nextcloud users) | People already running Nextcloud for files/calendar and who want photos bolted on |
| **Lychee** | MIT | No | None | Local filesystem or S3 | No (single-user) | The simplest possible photo dump — a Slick carousel viewer, no ML, no timeline curation |

**Pick Immich** if face recognition, CLIP search, and a polished timeline
are the headline features and a small Docker compose stack is acceptable.

**Pick PhotoPrism** if you have hundreds of thousands of existing photos
to import, you care about EXIF and favorites, and you do not need E2EE.

**Pick Ente** if the *only* thing that matters is end-to-end encryption
and you are willing to fund either a subscription or a self-host fee.

**Pick Nextcloud Memories** if Nextcloud is already the substrate for
your files. The memories app is feature-light compared to Immich but
inherits Nextcloud's sharing, mobile sync, and admin model.

**Pick Lychee** if you want a photo gallery, not a photo *manager*. No
ML, no multi-user, no maintenance burden; just a clean web UI for a
folder of images.

## Verified sources

- Immich GitHub repository: <https://github.com/immich-app/immich>
- VectorChord / vector search migration tracking (server README,
  servers image).
- Security advisories: Immich GitHub Security tab — 10 published
  advisories in 2026, including GHSA-8244-8vpr-vp9c (XSS-to-account-takeover,
  June 2026) and GHSA-237r-x578-h5mv (API key privilege escalation,
  January 2026).
- License relicensing discussion, February 2024 — GitHub issue thread
  and r/selfhosted / Hacker News follow-ups.
- PhotoPrism community edition license change, January 2024 — see
  PhotoPrism's "Our Journey" blog post.
- Ente architecture and E2EE design — Ente's open-source documentation
  at <https://ente.io/architecture>.
- Nextcloud Memories app — Nextcloud App Store listing.
- Lychee maintainer docs — <https://lycheeorg.dev>.
