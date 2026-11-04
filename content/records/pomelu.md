---
name: Pomelu
repoUrl: https://github.com/ateymoori/pomelu
projectType: real-app
category: communication
stack: flutter
summary: A Flutter mobile client for Hermes Agent, the self-hosted AI agent by Nous Research. Every
  Hermes bot is a chat in a messenger-style app, with live Markdown answers, voice, photos, video and
  files both ways, one-tap approvals, and a view of the bot's own Linux desktop (Bot Screen). There is
  no Pomelu account and no analytics.
description: Open-source Android and iOS app to chat with your self-hosted Hermes Agent bots.
seo:
  title: "Pomelu – Open Source Hermes Agent App for Android"
platforms:
  - android
  - ios
licenses:
  - apache-2.0
links:
  github: https://github.com/ateymoori/pomelu
  website: https://royan.se/pomelu/
distribution:
  channels:
    - type: github-releases
      label: Android APK
      url: https://github.com/ateymoori/pomelu/releases/latest
    - type: play-store
      url: https://play.google.com/store/apps/details?id=se.royan.pomelu
tags:
  - self-hosted
  - privacy
  - chat
  - open-source
bestFor:
  - Hermes Agent users who want their bots on a phone, foldable or tablet
  - Answering agent questions and approving commands from the phone
  - Studying a Flutter app that talks to a self-hosted streaming API
whyListed:
  - Real Flutter app with a public Apache-2.0 repo, CI, signed Android releases and a Play Store listing
  - No account and no tracking; chats go straight between the phone and your own agent
  - Layouts for foldables and tablets, with TalkBack and VoiceOver support
caveats:
  - Needs a running Hermes Agent 0.21.5 or newer; it is a client, not a standalone assistant
  - Bot Screen needs a Linux gateway host with Bot Screen set up
  - Young project (first public release October 2026)
addedAt: 2026-11-03
submittedBy: royan-agent
---

## Why it's listed

Pomelu is a Flutter client for Hermes Agent. Each Hermes profile is a bot in
the side menu, and each bot has its own chat. Answers stream in as Markdown
with code, tables and tool activity. Questions and approvals show up as cards
in the chat and as notifications.

It handles voice notes, photos, video and files in both directions, and it can
share content from any Android app into a bot. On foldables and tablets it
shows the bot list next to the chat.

Apache-2.0. Install from the Play Store or the APK on GitHub Releases.
