---
name: ManaWG
repoUrl: https://github.com/Abuarchiv/manawg
projectType: real-app
category: productivity
stack: react
summary: A free app for shared flats and roommates that keeps expenses, the cleaning rota, the shopping list, a calendar, a notice board and chat in one place. It installs as a PWA, imports CSV from Splitwise, Splid, Tricount and Settle Up, and can be self-hosted with Docker Compose.
description: Self-hostable shared-flat app with expense splitting, a cleaning rota, shopping list, calendar, notice board and chat.
platforms:
  - web
licenses:
  - apache-2.0
links:
  github: https://github.com/Abuarchiv/manawg
  website: https://manawg.com
  docs: https://github.com/Abuarchiv/manawg#readme
distribution:
  channels:
    - type: web-app
      label: Hosted app
      url: https://app.manawg.com
    - type: self-host
      label: Docker Compose (amd64 and arm64)
      url: https://github.com/Abuarchiv/manawg#readme
    - type: website
      label: Try the demo without an account
      url: https://manawg.com/en/demo
tags:
  - self-hosted
  - open-source
  - pwa
  - nextjs
  - postgresql
  - docker-compose
  - foss-alternative
  - web-app
bestFor:
  - Flatmates who want one shared app instead of a split-bill app, a chore app and a group chat
  - Self-hosters who want a Splitwise alternative on a small server
  - Studying a Next.js 16 app with Supabase, Drizzle, next-intl and Tailwind 4 in production
whyListed:
  - Money, chores, shopping, calendar, notice board and chat in one installable PWA
  - Money is kept in whole cents and splits always add up to the total
  - Offline queue, an MCP server (Abuarchiv/manawg-mcp) and about 500 MB of RAM when self-hosted
caveats:
  - Young project (first release November 2026) with a small community and 1 star, listed as an exception to the 50-star guideline because it is a complete production app
  - Phone-first layout only, no desktop layout
  - Built with heavy AI assistance
seo:
  title: "ManaWG – Open Source Shared Flat and Roommate App"
  description: ManaWG is a free open-source app for shared flats with expense splitting, a cleaning rota, shopping list, calendar and chat. Self-host with Docker. Apache-2.0.
addedAt: 2026-11-06
submittedBy: Abuarchiv
---

ManaWG is a complete app for shared flats. It keeps the shared money, the cleaning rota, the shopping list, the calendar, a notice board and the flat chat in one installable web app, so a household does not need a bill-splitting app, a chore app and a group chat side by side. Expenses are stored in whole cents and every split adds up to the total, with CSV import from Splitwise, Splid, Tricount and Settle Up. It runs as a PWA with an offline queue and is available in German, English and Spanish. The code is Apache-2.0, built with Next.js 16, Supabase/Postgres, Drizzle, next-intl, Tailwind 4 and shadcn/ui, and ships as a Docker Compose stack for amd64 and arm64 that needs about 500 MB of RAM. A hosted instance and a no-account demo are available, and a separate MCP server exposes the app API to AI assistants. Reviewed against the repository and release v0.2.0 on 2026-11-09.
