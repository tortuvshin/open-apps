---
submittedBy: imshashank
name: Orbit by Noveum
repoUrl: https://github.com/Noveum/orbit
projectType: real-app
category: productivity
stack: react
description: Orbit is a free, realtime task manager for issues, boards, projects, sprints, docs and
  files, with a hosted MCP endpoint for AI agents.
platforms:
  - web
licenses:
  - apache-2.0
links:
  github: https://github.com/Noveum/orbit
  website: https://orbit.noveum.ai
  docs: https://orbit.noveum.ai/docs
tags:
  - issue-tracker
  - kanban
  - self-hosted
  - mcp-server
bestFor:
  - Teams organizing issues, projects and sprints alongside shared documents.
  - Developers studying a typed Next.js application with centralized authorization and realtime
    updates.
whyListed:
  - Provides a usable hosted task manager and the complete Apache-2.0 application source.
  - Exposes workspace-scoped OAuth MCP tools alongside its browser interface.
caveats:
  - Self-hosting remains in preview; deployment-provider validation is still in progress.
  - Self-hosting requires PostgreSQL, Redis, S3-compatible storage and operational ownership.
  - Hosted MCP access requires sign-in and workspace-scoped OAuth authorization.
seo:
  title: Orbit - Open Source Task and Project Manager
addedAt: 2026-09-24
source:
  type: submit
  provider: github
  owner: Noveum
  repo: orbit
  url: https://github.com/Noveum/orbit
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Orbit is a keyboard-first web application for issues, boards, projects, sprints, documents and files. Teams can use the free hosted application or inspect and run the Apache-2.0 source.

The application combines a Next.js interface with workspace packages for shared policy, realtime updates and MCP tools. It is useful for studying server-enforced permissions, typed application boundaries and collaborative task workflows.

AI clients connect to [the hosted MCP endpoint](https://orbit.noveum.ai/mcp) over Streamable HTTP with workspace-scoped OAuth. The [GitHub repository](https://github.com/Noveum/orbit) contains the complete application; its URL is not an MCP connection target.

Self-hosting is still in preview. The Docker path requires PostgreSQL, Redis and S3-compatible object storage, plus the application services. Operators need to configure public origins, backups and email delivery and validate their chosen provider. See the [documentation](https://orbit.noveum.ai/docs) for setup and current limitations.
