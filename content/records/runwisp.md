---
name: RunWisp
repoUrl: https://github.com/runwisp/runwisp
projectType: real-app
category: developer-tools
stack: go
summary: One Go binary that replaces crond and supervisord. Every run keeps its exit code,
  duration and output, and you browse them in a web dashboard or a TUI.
description: crond and supervisord in one binary, with a web dashboard and a TUI.
platforms:
  - linux
  - macos
licenses:
  - gpl-3.0
links:
  github: https://github.com/runwisp/runwisp
  website: https://runwisp.com
distribution:
  channels:
    - type: github-releases
      label: GitHub Releases
      url: https://github.com/runwisp/runwisp/releases
tags:
  - cron
  - process-supervisor
  - scheduler
  - self-hosted
  - tui
bestFor:
  - A VPS or Raspberry Pi with cron jobs that should tell you when they fail.
  - Moving off crontab, supervisord or docker-compose (runwisp import converts them).
whyListed:
  - 11 MB download. Scheduler, supervisor, SQLite, web UI and TUI are all inside, nothing else to
    install.
  - Shows how a Go daemon embeds SQLite and a Svelte web UI into one binary.
caveats:
  - Linux and macOS. Windows only through WSL.
  - Tasks live in runwisp.toml. The web UI can trigger and stop them, never edit them.
seo:
  title: "RunWisp – Open Source Crontab and Supervisord Alternative"
  description: RunWisp runs cron jobs and long-running processes from one Go binary and keeps every
    run's exit code, output and duration. Web UI and TUI, GPL-3.0.
addedAt: 2026-10-29
submittedBy: riki137
---
## Why it's listed

crond runs your job and forgets it ever happened. RunWisp keeps the exit code, duration,
timestamps and output of every run in SQLite, and sends an email, Telegram or webhook ping
when something fails.

Jobs and services go in `runwisp.toml`. `runwisp import` converts an existing crontab,
supervisord config or docker-compose file, so you don't start from zero.

![RunWisp web dashboard](https://raw.githubusercontent.com/runwisp/runwisp/main/apps/docs/src/assets/screenshots/runwisp-demo.webp)

Try it without configuring anything: `bunx runwisp demo`.

I'm the author.
