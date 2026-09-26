---
name: Rockxy
repoUrl: https://github.com/RockxyApp/Rockxy
projectType: real-app
category: developer-tools
stack: ios
description: A native macOS HTTP debugging proxy for inspecting HTTPS, API, WebSocket, and GraphQL traffic.
sourceDescription: Open-source native macOS HTTP debugging proxy — intercept HTTPS, inspect APIs,
  mock responses, debug WebSocket & GraphQL. Community-driven. For developers, by developers.
platforms:
  - macos
licenses:
  - agpl-3.0
links:
  github: https://github.com/RockxyApp/Rockxy
  website: https://rockxy.io
distribution:
  channels:
    - type: github-releases
      label: GitHub Releases
      url: https://github.com/RockxyApp/Rockxy/releases
      verified: false
tags:
  - api-debugging
  - graphql
  - http-proxy
  - https-inspection
  - mock-api
  - network-debugging
  - websocket
bestFor:
  - Debugging HTTP and HTTPS traffic during macOS and iOS development
  - Inspecting API, WebSocket, and GraphQL exchanges
whyListed:
  - Demonstrates a native Swift proxy with traffic interception, inspection, and response mocking.
caveats:
  - HTTPS inspection requires installing and trusting a local root certificate.
  - Source code is AGPL-3.0, while official signed downloads use a separate binary EULA.
relations:
  - type: alternative-to
    to: charles-proxy
    evidence:
      type: repo-topic
      url: https://github.com/RockxyApp/Rockxy
      quote: charles-proxy-alternative
      checkedAt: 2026-09-22
  - type: alternative-to
    to: proxyman
    evidence:
      type: repo-topic
      url: https://github.com/RockxyApp/Rockxy
      quote: proxyman-alternative
      checkedAt: 2026-09-22
seo:
  title: Rockxy – Open Source HTTP Debugging Proxy for macOS
addedAt: 2026-08-27
source:
  type: submit
  provider: github
  owner: RockxyApp
  repo: Rockxy
  url: https://github.com/RockxyApp/Rockxy
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
