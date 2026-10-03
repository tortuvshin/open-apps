---
name: "IOTA Watch"
repoUrl: https://github.com/molimao/iota
category: tools
stack: react
description: "Read-only dashboard for IOTA Train at Home, xCoin XID / MMM and Quantus QTC, with project-specific activity, reward records and data freshness indicators."
sourceDescription: "Open-source five-language dashboard for IOTA Train at Home, xCoin XID / MMM and Quantus QTC: read-only status, rewards and network visualization."
platforms:
  - web
tags:
  - bittensor
  - dashboard
  - iota-train-at-home
  - miner-monitoring
  - mining-dashboard
  - multilingual
  - open-source
  - quantus
licenses:
  - mit
links:
  website: https://iotahome.site/en
whyListed:
  - "Public miner identifiers let operators inspect project-specific activity without entering wallet keys."
  - "Missing, failed and stale upstream readings are distinguished from observed zero values."
  - "The five-language React and TanStack Start codebase includes localized routes, shared FAQ content, sparse training charts and optional account watchlists."
bestFor:
  - "Operators checking public training or mining records for the three supported projects."
  - "Developers studying multilingual server-rendered React monitoring interfaces."
caveats:
  - "Public upstream services can fail or return partial coverage; timestamps and coverage must be read with each result."
  - "IOTA refers to Macrocosmos Train at Home, not the IOTA Foundation blockchain."
  - "XID readings cover the SuperKnet pool; Quantus indexed rewards are not a wallet balance or a promise of income."
  - "Independent self-hosting requires configuring optional OAuth and database services for account watchlists."
seo:
  title: IOTA Watch – Open Source Training and Mining Monitor
addedAt: 2026-10-03
submittedBy: molimao
---

## Why it is listed

IOTA Watch is a usable browser dashboard for public activity and reward records across three distinct projects. The interface keeps each project’s identifiers, sources and coverage separate, and exposes failed or stale reads instead of substituting invented zero values.

The MIT source includes five localized route sets, shared FAQ data, chart and table views for sparse training series, and optional Supabase account watchlists. Core read-only use can start without a login.

I maintain this project and am submitting it as an open-source app to run or study.
