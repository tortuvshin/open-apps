---
name: Relaticle
repoUrl: https://github.com/relaticle/relaticle
projectType: real-app
category: business
stack: php
summary: An open-source CRM for companies, people, opportunities, tasks and notes, with a built-in
  AI assistant and a first-party MCP server. Claude and ChatGPT read and update the same records
  the team works in, and every change the assistant proposes waits for a human to approve it.
description: Open-source CRM with a built-in AI assistant and an MCP server, self-hosted with Docker
  or on Relaticle Cloud.
platforms:
  - web
  - linux
licenses:
  - agpl-3.0
links:
  github: https://github.com/relaticle/relaticle
  website: https://relaticle.com
  docs: https://relaticle.com/developers
distribution:
  channels:
    - type: self-host
      label: Self-host with Docker Compose
      url: https://github.com/relaticle/relaticle/blob/main/compose.yml
      verified: true
    - type: web-app
      label: Relaticle Cloud
      url: https://app.relaticle.com/login
      verified: true
    - type: github-releases
      label: GitHub Releases
      url: https://github.com/relaticle/relaticle/releases
      verified: true
tags:
  - ai
  - crm
  - docker-compose
  - foss-alternative
  - laravel
  - mcp
  - mcp-server
  - open-source
  - php
  - postgresql
  - sales
  - self-hosted
  - web-app
bestFor:
  - Small B2B teams that want their CRM data where their AI tools can reach it
  - Teams replacing HubSpot or Attio with a self-hostable CRM and a flat price per workspace
  - Studying a Laravel, Livewire and Filament codebase in production, with an MCP server in PHP
whyListed:
  - A real open-source CRM in PHP, the other web stack the CRM category runs on next to Twenty's TypeScript
  - The MCP server and the REST API expose the same records as the UI, with the same workspace permissions
  - The assistant's proposal and approval flow is a worked example of keeping a human in the loop for agent writes
caveats:
  - No native mobile app; the web app is responsive
  - Self-hosted installs bring their own OpenAI or Anthropic key for the assistant
  - Email and calendar sync covers Google and Microsoft 365 accounts
  - Smaller community than Twenty or EspoCRM
seo:
  title: "Relaticle – Open Source CRM with an AI Assistant and MCP"
  description: Relaticle is an open-source CRM with a built-in AI assistant and an MCP server for Claude
    and ChatGPT. Self-host with Docker Compose or use Relaticle Cloud. AGPL-3.0.
addedAt: 2026-10-31
submittedBy: ManukMinasyan
---

## Why it's listed

Relaticle is a CRM built for teams that already work with AI assistants. The records
are the usual five: companies, people, opportunities, tasks and notes, each with custom
fields. What is different is how they are reached. A built-in assistant, Rela, answers
questions about the workspace and proposes changes as cards the user approves or rejects.
A first-party MCP server exposes the same records to Claude, ChatGPT and other MCP
clients, with OAuth or personal tokens and the workspace's own permissions. A REST API
covers the rest.

The codebase is Laravel 13 with Livewire and Filament, on PostgreSQL and Redis, under
AGPL-3.0. It is a readable example of a modular monolith: the CRM core in `app/`, and
self-contained packages for the assistant, email and calendar sync, CSV import and the
system admin panel. The MCP server is plain PHP, which is still rare, and the assistant's
proposal flow shows one way to keep agent writes behind a human approval.

Self-hosting is a single `compose.yml`: the app, a Horizon queue worker, the scheduler, Reverb for websockets, PostgreSQL and Redis.
Relaticle Cloud is the hosted version, priced per workspace rather than per seat.

- [Developer docs](https://relaticle.com/developers)
- [Self-hosting guide](https://relaticle.com/developers/self-hosting)
- [Pricing](https://relaticle.com/pricing)

Submitted by the Relaticle maintainer.
