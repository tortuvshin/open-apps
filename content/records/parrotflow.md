---
name: ParrotFlow
repoUrl: https://github.com/znat/parrotflow
projectType: real-app
category: productivity
stack: macos
summary: A Mac dictation app that transcribes on your device with Parakeet, then shapes the text
  with steps you control. It uses the text on your screen to correct names, and rules and scripts
  in a YAML config to format numbers, dates and links.
description: Scriptable local dictation that uses the text on your screen to fix names, and your
  rules to format numbers, dates, and links.
platforms:
  - macos
  - desktop
licenses:
  - gpl-3.0
links:
  github: https://github.com/znat/parrotflow
  website: https://parrotflow.io
distribution:
  channels:
    - type: github-releases
      platform: macos
      label: GitHub Releases
      url: https://github.com/znat/parrotflow/releases/latest
      verified: false
    - type: other
      platform: macos
      label: Homebrew tap (znat/tap/parrotflow)
      url: https://github.com/znat/homebrew-tap
      verified: false
    - type: website
      platform: macos
      label: parrotflow.io
      url: https://parrotflow.io/download/
      verified: false
tags:
  - offline-first
  - privacy
  - desktop-app
  - developer-tools
bestFor:
  - Dictating prompts into Claude Code, Codex CLI or a terminal, where names and code terms matter.
  - People who want to see and change every step between speech and the text that is pasted.
  - Writing your own text rules or scripts, for example "PR 478" to "#478".
whyListed:
  - Speech is turned into text on the Mac with Parakeet. No account, no telemetry, and a language
    model only if you add one.
  - Reads the window you dictate into, so a name on screen, such as `CaretAnchor`, is spelled
    correctly when you say it.
  - Every step is in a YAML config. A rule is a pattern and a replacement, and a script reads text
    on stdin and writes text on stdout.
caveats:
  - Apple silicon and macOS 15 or later only. It uses about 2 GB of disk for the app and its models.
  - Speech recognition and cleanup cover English and French.
  - Rules and scripts are written in a config file, not in a settings window.
  - A young project, first released in 2026, by one maintainer.
  - "22 stars as of 2026-10-28 (below the 50-star guideline): exception requested. It is actively maintained (v0.18.0 on 2026-10-12, 391 commits since July 2026), GPL-3.0, installs with Homebrew, and takes a distinct approach: names are corrected from the text on screen, and every cleanup step is a rule or script you can read and change."
relations:
  - type: alternative-to
    to: wispr-flow
    evidence:
      type: editorial
      url: https://parrotflow.io/compare/wispr-flow-alternative/
      checkedAt: 2026-10-28
seo:
  title: "ParrotFlow – Open Source Scriptable Dictation for Mac"
  description: ParrotFlow transcribes on your Mac with Parakeet, fixes names from the text on your
    screen, and formats numbers, dates and links with your rules. GPL-3.0.
addedAt: 2026-10-28
submittedBy: znat
---

## What makes it different

Most dictation apps either paste exactly what the speech model heard, or send it to a language
model to be rewritten. ParrotFlow sits between the two. After Parakeet writes the words, a series
of small steps each makes one edit or leaves the text alone: a full stop, a capital, a name, a
filler word, a number. You can read each step in the config and add your own.

Two examples show how it works:

- Claude Code has just printed `CaretAnchor` in the terminal. You say "carrot anchor", and
  ParrotFlow writes `CaretAnchor`, because it read that word on the screen.
- You add a rule, and "PR four seven eight" becomes `#478` in the terminal only.

The repository also ships a skill for coding agents. You describe a rule in plain words, and the
agent writes it into `config.yaml` and checks it with the app's own command line.

## Installing it

`brew install znat/tap/parrotflow`, or the install script in the README. On first launch the app
downloads its models and asks for the Microphone and Accessibility permissions.

## Verified sources

- Repository and README: <https://github.com/znat/parrotflow> (28 Oct 2026)
- Release v0.18.0: <https://github.com/znat/parrotflow/releases/tag/v0.18.0>
- Project site: <https://parrotflow.io>

Submitted by the ParrotFlow author.
