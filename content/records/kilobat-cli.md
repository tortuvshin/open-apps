---
name: Kilobat CLI
repoUrl: https://github.com/seifip/kilobat-cli
projectType: real-app
category: tools
stack: macos
description: A macOS command-line tool for inspecting Wi-Fi, traffic and network connection problems.
platforms:
  - macos
links:
  github: https://github.com/seifip/kilobat-cli
tags:
  - cli
  - network
  - developer-tools
addedAt: 2026-11-02
submittedBy: seifip
whyListed:
  - Provides terminal and JSON output for local network diagnostics, plus a local MCP server.
caveats:
  - The CLI is GPL-3.0-only. The separately distributed desktop app is proprietary.
---

## Why it's listed

I built Kilobat CLI to help people and their agents inspect network conditions and diagnose connection problems on a Mac. Its public Swift source includes an interactive terminal interface and machine-readable output. Some features require macOS permissions or separately installed tools; see the project documentation for prerequisites.

The CLI brings Wi-Fi details, latency and DNS checks into one terminal workflow. Its JSON output can be used in scripts, while the local MCP server exposes network diagnostics to compatible agent clients. The source is written in Swift for macOS and documents the setup and permissions needed to run it.

This is a new project with a small GitHub audience. I suggest it for review because its terminal interface and agent-facing tools offer a concrete way to inspect a Mac connection, and the public source lets developers examine how those diagnostics are implemented. The project is actively maintained; a listing would not imply independent review or adoption.
