---
name: Karakeep
repoUrl: https://github.com/karakeep-app/karakeep
projectType: real-app
category: productivity
stack: react-native
summary: A self-hostable bookmark-and-content archive — links, notes, images, and PDFs — that turns
  the messy act of hoarding the web into a queryable, AI-tagged personal library with first-class
  mobile apps, browser extensions, a CLI, and an MCP server.
description: Karakeep is a self-hostable bookmark-everything application built on Next.js 16 + Hono
  + tRPC over Drizzle on SQLite with Meilisearch full-text and semantic search, capturing links,
  notes, images, and PDFs into a tagged personal archive with on-demand AI auto-tagging.
sourceDescription: A self-hostable bookmark-everything app (links, notes and images) with AI-based
  automatic tagging and full text search.
platforms:
  - android
  - ios
licenses:
  - agpl-3.0
links:
  github: https://github.com/karakeep-app/karakeep
distribution:
  channels:
    - type: github-releases
      platform: android
      label: GitHub Releases
      url: https://github.com/karakeep-app/karakeep/releases
      verified: false
    - type: github-releases
      platform: ios
      label: GitHub Releases
      url: https://github.com/karakeep-app/karakeep/releases
      verified: false
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
seo:
  title: Karakeep – Open Source Self-Hosted Bookmark Manager with AI
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: karakeep-app
  repo: karakeep
  url: https://github.com/karakeep-app/karakeep
curation:
  reviewed: false
  reviewedAt: 2026-06-13T00:29:01+08:00
  labels:
    - mature
    - hot
  lenses:
    - production-like
visibility: keep
---
Karakeep (formerly Hoarder) is a self-hostable "bookmark-everything"
application that captures links, notes, images, and PDFs into a single
tagged archive and runs AI tagging plus full-text and semantic search
against the pile. It is a self-hosted Pocket/raindrop replacement
purpose-built for power hoarders.

## Why it matters

- **Capture is multi-front.** Karakeep ships a Next.js web client, a
  React Native mobile app on iOS and Android, Chrome and Firefox
  browser extensions, a Safari extension, an RSS auto-hoarder, and a
  browser bookmark importer via floccus. Anything you save ends up in
  the same bucket regardless of where it came from.
- **AI works on demand.** Tagging, summarisation, and full-page
  archiving happen via OpenAI-compatible APIs (Ollama included) and
  run through a worker pipeline, so the on-device path stays simple
  and the heavy lifting lives outside the request thread.
- **Agents and CLIs are first-class.** The repo ships an MCP server
  (`@karakeep/mcp`), a published "Karakeep skill" for agentic tools
  like OpenClaw and Hermes, and a TypeScript CLI (`karakeep`) that
  talks to the server over tRPC. Granular API key scopes keep
  read-only agents from having admin rights.

## How it works

The monorepo (`apps/`, `packages/`, `tooling/`) is a pnpm + Turborepo
workspace. `apps/web` is a Next.js 16 app router frontend that calls
the Hono API in `apps/workers` over tRPC 11; persistence is Drizzle
ORM on `better-sqlite3` (`packages/db`, with 94 migrations), and full-
text plus semantic search is delegated to Meilisearch 1.41. NextAuth
(with the Drizzle adapter) handles sessions and OAuth. Crawling uses
Playwright + Readability, `monolith` for full-page archives, `yt-dlp`
for video, and `tesseract.js` for OCR; everything is orchestrated by
the workers process which talks to a headless Chromium container over
the Chrome DevTools Protocol.

A browser extension (`apps/browser-extension`), a React Native +
Expo mobile app (`apps/mobile`), a CLI (`apps/cli`), and an MCP server
(`apps/mcp`) all consume the same SDK (`packages/sdk`). The OpenAPI
spec is generated from `packages/open-api`, and `packages/e2e_tests`
covers the API surface end to end.

## Caveats

- **Single-binary storage.** Assets and HTML live on the local
  filesystem inside `/data`; there is no native S3 backend, so scaling
  past a single host means mounting a remote volume rather than
  plugging in object storage.
- **Headless Chrome is part of the stack.** The reference Docker
  Compose pulls `gcr.io/zenika-hub/alpine-chrome` for crawling — it
  works but adds memory overhead and the SSRF surface has been the
  source of repeated security advisories (see GHSA-g647-327m-79g9
  and GHSA-7rx4-c5vx-g8w3 in the 0.32.0 release notes).
- **AI quality depends on your provider.** Tagging and summarisation
  are best-effort; on cheap models you will get noisy tags and have
  to bulk-edit. With Ollama locally you avoid the cloud cost but the
  CPU/GPU budget is on you.
- **AGPL-3.0** across the board; commercial forks must publish
  modifications.

## Deployment notes

```bash
git clone https://github.com/karakeep-app/karakeep.git
cd karakeep/docker
cp .env.sample .env
# Set NEXTAUTH_SECRET and MEILI_MASTER_KEY in .env
docker compose up -d
```

The reference stack is three containers: `web` (the Next.js + worker
AIO image on port `3000`), `chrome` (Alpine Chromium on port `9222`
for the crawler), and `meilisearch` (v1.41). For bare-metal Debian or
Ubuntu, the repo's `karakeep-linux.sh` script installs Node 24, pnpm,
Meilisearch, Chromium, and ffmpeg, then lays down systemd units for
`karakeep-web`, `karakeep-workers`, `karakeep-browser`, and
`meilisearch` under `/etc/karakeep/`.

**Minimum:** 2 CPU and 4 GB RAM handle a personal archive comfortably;
budget more for the crawler when you subscribe to many RSS feeds, and
plan storage around the `/data` volume (the script defaults to
`/var/lib/karakeep`).

**Integration tip:** drop the Karakeep MCP server config into an
existing Astro/Grove-style directory's agent runtime — alongside the
web bookmarklet and the `karakeep` CLI you get a write-only capture
path that an AI assistant can call without touching the dashboard.