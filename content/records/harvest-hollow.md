---
name: Harness Hollow
repoUrl: https://github.com/KrasimirKralev/harvest-hollow
projectType: real-app
category: games
stack: javascript
summary: A cozy 3D farming game for two players who share one farm in real time, in the browser on a computer, tablet or phone. One small Node.js server keeps the farm running; play it on the public host with no account, or run your own copy with npm or Docker.
description: Cozy 3D co-op farming game for two in the browser, with a self-hostable Node.js server.
platforms:
  - web
licenses:
  - mit
links:
  github: https://github.com/KrasimirKralev/harvest-hollow
  website: https://krasimirkralev.github.io/harvest-hollow/
  docs: https://github.com/KrasimirKralev/harvest-hollow#readme
distribution:
  channels:
    - type: web-app
      label: Play in the browser, no account
      url: https://harvest-hollow.up.railway.app
    - type: self-host
      label: Node.js 24 or Docker
      url: https://github.com/KrasimirKralev/harvest-hollow#play-it-in-2-minutes
tags:
  - self-hosted
  - open-source
  - web-app
  - multiplayer
  - threejs
  - pwa
bestFor:
  - Two people who want to farm together on one shared farm, each on their own computer or phone
  - Self-hosters who want a small game server on a Raspberry Pi or a mini-PC, or on Railway, Fly.io or Render
  - Studying a Three.js client with no bundler and one rules engine shared by the browser and the server
whyListed:
  - The same JavaScript rules engine runs in the browser to predict each action and on the server to decide it, so play feels instant and the server stays authoritative
  - A complete farming game with 40 levels, 25 crops, 12 kinds of animals, 18 workshops and 136 recipes; prices, timers and rewards come from one economy model with a simulator for pacing and balance
  - Works on phones as well as desktops, in English and Bulgarian, and two farmers can use different languages on the same farm
caveats:
  - Young project (first release 2026-10-12) with 10 stars, listed as an exception to the 50-star guideline because it is a complete, playable app with a public host, install docs and a written design document
  - The code was written by AI coding agents (mostly Claude Code, with OpenAI Codex for second opinions) under the author's direction, and the illustrations come from an AI image model
  - Farms on the public host that nobody visits for 7 days are deleted; the in-game helper Harvey works on self-hosted copies only, for now
seo:
  title: "Harness Hollow – Open Source Co-op Farming Game for Two"
  description: Harness Hollow is a free, open-source 3D farming game for two players in the browser. Play on the public host or self-host the Node.js server. MIT licensed.
addedAt: 2026-11-14
submittedBy: KrasimirKralev
---

Harness Hollow is a co-op farming game for two. Both farmers share one farm in real time: one plants while the other harvests, one runs the bakery while the other feeds the animals, and each sees the other's work the moment it happens. It runs in the browser on computers, tablets and phones, with touch controls and a phone layout, in English and Bulgarian. One Node.js server (Express and ws) keeps the farm going around the clock and saves it as atomic JSON snapshots with rotating backups. The client is Three.js loaded through an import map, with no bundler. The repository includes the full design document, the economy model that sets prices, timers and rewards, a simulator that checks pacing and balance, and an end-to-end test that drives two headless browsers through a co-op session. Self-host it with `npm install && npm start` or the included Dockerfile, or play on the public host without an account. Reviewed against the repository and the V1 release on 2026-11-14.
