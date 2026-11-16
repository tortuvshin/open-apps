---
name: "rfig"
repoUrl: https://github.com/tamia6/rfig
category: developer-tools
stack: rust
description: "Command completion menus and directory-scoped history suggestions for zsh, Bash and Fish on macOS and Linux."
sourceDescription: "Command completion menus and history-based autosuggestions for zsh, Bash and Fish on macOS and Linux"
platforms:
  - macos
  - linux
links:
  website: https://tamia6.github.io/rfig/
whyListed:
  - "Adds progressive completion menus and history suggestions to existing shells without a cloud account."
  - "Its Rust engine and shell adapters are useful examples of interactive terminal integration."
caveats:
  - "Requires Bash 4.4+ or Fish 3.6+ for those integrations."
  - "Completion coverage depends on installed definitions; history suggestions replace the shell or plugin equivalents while enabled."
addedAt: 2026-10-24
submittedBy: tamia6
licenses:
  - mit
seo:
  title: "rfig – Open Source Terminal Autocomplete"
  description: "Command completion menus and directory-scoped history suggestions for zsh, Bash and Fish on macOS and Linux."
---

## Why it is worth using or studying

rfig adds command-completion menus and directory-scoped history suggestions to zsh, Bash and Fish without requiring a cloud service. Its Rust engine and separate shell adapters make it useful to study how interactive completion, candidate ranking and history suggestions fit into existing shells.

## Popularity exception rationale

The project currently has 22 GitHub stars. It is submitted on the strength of a usable implementation, documented Homebrew and binary installation, an MIT license, a demonstration and three shell integrations, rather than established popularity. Acceptance of that exception remains a maintainer decision.

Completion coverage depends on the definitions available in the environment. Bash 4.4+ and Fish 3.6+ are required for those adapters, and enabling history suggestions replaces equivalent shell or plugin functionality. This is a maintainer submission based on the documented behavior.
