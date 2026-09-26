---
name: OpenPost
repoUrl: https://github.com/getopenpost/openpost
projectType: real-app
category: business
stack: svelte
description: Self-hosted social publishing app for preparing, reviewing, scheduling, and tracking
  posts across several networks.
platforms:
  - web
licenses:
  - agpl-3.0
links:
  github: https://github.com/getopenpost/openpost
  website: https://openpo.st
  docs: https://docs.openpo.st
tags:
  - content-creation
  - docker-compose
  - go
  - mcp-server
  - self-hosted
  - social-media-management
  - sveltekit
bestFor:
  - Running a social publishing workflow on your own server.
  - Studying a SvelteKit app embedded in a Go server with SQLite by default.
whyListed:
  - A usable web app with public releases, self-hosting instructions, and source under the AGPL-3.0
    license.
  - Its Go server embeds the SvelteKit interface and exposes an API, CLI, and MCP server.
caveats:
  - Connecting social accounts requires provider OAuth configuration when self-hosted.
relations:
  - type: alternative-to
    to: buffer
    evidence:
      type: repo-topic
      url: https://github.com/getopenpost/openpost
      quote: buffer-alternative
      checkedAt: 2026-09-22
seo:
  title: OpenPost – Open Source Self-Hosted Social Media Scheduler
addedAt: 2026-09-12
source:
  type: submit
  provider: github
  owner: getopenpost
  repo: openpost
  url: https://github.com/getopenpost/openpost
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
