---
name: Linkwarden
repoUrl: https://github.com/linkwarden/linkwarden
projectType: real-app
category: productivity
stack: react-native
summary: An open-source, self-hosted bookmark and web-archiving platform that pairs collaborative
  collections and a reader view with automated page preservation.
description: Linkwarden is a self-hosted collaborative bookmark manager that captures every saved
  page as a screenshot, PDF, and HTML snapshot to defend against link rot.
sourceDescription: ⚡️⚡️⚡️ Self-hosted collaborative bookmark manager to collect, read, annotate, and
  fully preserve what matters, all in one place.
platforms:
  - android
  - ios
licenses:
  - agpl-3.0
links:
  github: https://github.com/linkwarden/linkwarden
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/linkwarden/linkwarden/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/linkwarden/linkwarden/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: Linkwarden – Open Source Self-Hosted Bookmark Manager
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: linkwarden
  repo: linkwarden
  url: https://github.com/linkwarden/linkwarden
curation:
  reviewed: false
  reviewedAt: 2026-06-13T00:29:01+08:00
  labels:
    - mature
    - hot
  lenses:
    - production-like
    - good-to-learn
visibility: keep
---
Linkwarden is a self-hosted, open-source collaborative bookmark manager
that solves link rot by automatically preserving every saved page as a
screenshot, a PDF, and a single-file HTML copy. It ships with a Next.js
web client, a React Native mobile app, and an asynchronous archiving
worker, all driven by a Postgres + Meilisearch backend.

## Why it matters

- **Defensive archiving baked in.** Unlike Pinboard (which only stores
  the URL) or Raindrop (a commercial SaaS with optional paid
  screenshots), Linkwarden captures three independent renderings of
  every saved page on your own hardware. It also pushes a copy to the
  Wayback Machine when configured, so a bookmark survives even if your
  instance dies.
- **Collaboration, not just solo use.** Linkwarden adds multi-user
  workspaces with per-member permissions, sub-collections, and public
  sharing — closer to a shared research drive than the single-user
  bookmark managers it is often compared to (e.g. linkding, Shaarli).
- **A real reader experience.** Saved pages open in a distraction-free
  reader view with highlighting and annotations; the highlight data is
  stored alongside the link in Postgres and searchable through
  Meilisearch.

## How it works

The repository is a Yarn (v4) workspaces monorepo with three apps:
`apps/web` (Next.js 15.3 on React 19.1 with NextAuth for SSO over ~60
identity providers), `apps/worker` (a long-running Node process
supervised by a `tsx`-based auto-restart loop), and `apps/mobile` (a
React Native client published to the iOS App Store and Google Play).
`apps/web` uses Prisma against PostgreSQL 16 for relational data and
Meilisearch v1.12.8 for full-text search; both run alongside the app
in the published `docker-compose.yml`.

When a user POSTs a link, `postLink` validates the payload with Zod,
runs an SSRF check, deduplicates against existing URLs (with and
without `www.`), enforces subscription link caps, fetches title and
headers, then writes a `Link` row to Postgres. The worker, started by
`worker.ts` via `concurrently`, polls every `ARCHIVE_SCRIPT_INTERVAL`
seconds (default 10) and runs `linkProcessing`, RSS polling, AI
auto-tagging, and `startIndexing`. Archiving uses Playwright
(Chromium), Mozilla Readability, DOMPurify, and the Rust `monolith`
binary bundled in the multi-stage Dockerfile; rendered artifacts land
in the `./data` volume or in S3-compatible storage when `SPACES_*`
variables are set.

## Caveats

- **Resource weight.** Each capture spins up Chromium via Playwright,
  plus a Rust `monolith` build step inside the container image; the
  archive volume grows quickly for active users.
- **License is AGPL-3.0.** Acceptable for personal self-hosting and
  community use; commercial forks must publish their modifications,
  which constrains some enterprise deployments.
- **AI features are optional and external.** Auto-tagging supports
  OpenAI, Anthropic, OpenRouter, Perplexity, Azure, and Ollama, but
  only Ollama runs locally; the other providers send prompt content
  off-host unless you skip tagging.

## Deployment notes

```bash
git clone https://github.com/linkwarden/linkwarden.git
cd linkwarden
cp .env.sample .env       # set NEXTAUTH_URL, NEXTAUTH_SECRET, POSTGRES_PASSWORD
docker compose up -d
```

Three containers come up: `postgres` (port 5432, volume `./pgdata`),
`meilisearch` (no exposed port, volume `./meili_data`), and
`linkwarden` (host port `3000`, volume `./data`). The Dockerfile
healthchecks `/` on `127.0.0.1:3000`. Public images are pulled from
`ghcr.io/linkwarden/linkwarden:latest`.

**Minimum:** 2 CPU, 4 GB RAM, 20 GB for the base install — Chromium and
the archive volume push practical needs closer to 8 GB and 50+ GB for
a heavy user. Reverse-proxy with TLS in front of port 3000; SMTP and
S3-compatible storage are optional but recommended for production.

**Integration tip:** Linkwarden is the rare bookmark tool that bundles
its own preservation pipeline; if you operate a directory of
self-hosted apps, it makes a much stronger reference example than a
plain "save-URL" manager for any entry tagged `archiving` or
`self-hosted`.