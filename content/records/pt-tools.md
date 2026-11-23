---
name: pt-tools
repoUrl: https://github.com/sunerpy/pt-tools
category: media
stack: go
description: A self-hosted private tracker manager that downloads from RSS, seeds and cross-seeds, follows shows into the media library and runs daily check-ins, with an Android app.
platforms:
  - web
  - linux
  - windows
  - android
licenses:
  - mit
tags:
  - private-tracker
  - torrent
  - qbittorrent
  - transmission
  - self-hosted
  - media-library
bestFor:
  - Running RSS downloads, freeleech seeding and IYUU cross-seeding for several private trackers from one Docker container.
  - Following TV seasons and movies from TMDB and getting them hard-linked into an Emby, Jellyfin or Plex library with NFO files and artwork.
  - Checking torrents, downloaders and tracker statistics from a phone, QQ, Telegram or Feishu.
whyListed:
  - One Go binary with an embedded Vue web UI and SQLite, managing several qBittorrent and Transmission clients behind one disk-space and seeding-capacity gate.
  - The Flutter app pairs by QR code and reaches the server directly or through a relay, end to end encrypted with Noise; the relay has a Go and a Cloudflare Workers implementation that share one conformance suite.
  - A built-in AI assistant and an MCP endpoint share one set of tools; the assistant asks before every change, and MCP write tools only return a preview unless called with confirm=true.
caveats:
  - The web interface is in Chinese; the documentation is in Chinese and English.
  - Most of the 74 built-in sites are Chinese private trackers, and you need accounts on them.
  - Downloads go through your own qBittorrent or Transmission; pt-tools does not download by itself.
seo:
  title: pt-tools – Open Source Private Tracker Automation
addedAt: 2026-11-24
submittedBy: sunerpy
---
pt-tools manages private tracker accounts and the qBittorrent or Transmission
clients that seed for them. It downloads from RSS feeds with filter rules,
picks freeleech torrents to seed and removes them by seed time, ratio or
speed, cross-seeds through IYUU, checks in daily and warns before an inactive
account is disabled, and records upload, ratio and bonus points per site.

Followed shows are searched when each episode airs on TMDB; a version lock
keeps one release group and resolution for the rest of the season. Finished
downloads are recognised, hard-linked into the library with a naming
template, scraped into NFO files and artwork, and the media server is asked
to scan.

It runs in Docker (amd64 and arm64) or as a Linux or Windows binary.
Documentation: https://firlab.app/pt-tools/en/
