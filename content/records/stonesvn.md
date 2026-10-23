---
name: StoneSVN
repoUrl: https://github.com/firzen/StoneSVN
category: developer-tools
stack: tauri
description: StoneSVN is an MIT-licensed SVN desktop client for reviewing working-copy changes, selecting commits and saving local text-hunk stashes on macOS, Windows and Linux.
platforms:
  - macos
  - windows
  - linux
licenses:
  - mit
tags:
  - svn-client
  - subversion
  - version-control
links:
  website: https://stonesvn.github.io/en/
  github: https://github.com/firzen/StoneSVN
bestFor:
  - Mac users who prefer a separate SVN workspace for reviewing diffs and choosing files to commit.
  - Developers studying a Tauri 2, Rust and Vue 3 desktop client backed by the SVN CLI.
whyListed:
  - Ships Apple Silicon and Intel Mac DMGs as well as Windows and Linux packages.
  - Supports local stashes of selected text hunks and separately stored unversioned files.
  - Documents its external SVN dependency, current limits and OrcaSVN origin.
caveats:
  - Requires a separately installed SVN command-line client.
  - General Merge, Switch and line-by-line Blame interfaces are not available in v1.1.2.
  - macOS builds are ad-hoc signed and not notarized.
  - Local stashes are application data, not SVN commits or interoperable native shelves.
seo:
  title: StoneSVN – Open Source SVN Desktop Client for macOS
addedAt: 2026-10-19
submittedBy: firzen
---

## What it does

StoneSVN provides a separate desktop workspace for existing Subversion working copies. The project sidebar keeps multiple working copies available; users can inspect text diffs and image previews, select files or directories for a commit, browse history and edit properties. The interface includes five languages and light/dark themes.

For a Mac user with unfinished tasks in the same text file, local stashing can set aside selected text hunks while leaving the other edits in the working copy. This is not direct line-level committing. Conflicted versioned files, property-only changes and non-text versioned changes are outside that text-hunk stash flow. Separately stored unversioned content is omitted from text-patch export.

## Why study the code

The Tauri 2 application connects a Vue 3 frontend to Rust commands that invoke the external SVN client. The source includes command construction, process output handling and SVN parsing, plus documented build and release workflows. It is developed from [OrcaSVN](https://github.com/wustites/OrcaSVN), with source attribution retained.

## Installation and limits

The [v1.1.2 release](https://github.com/firzen/StoneSVN/releases/tag/v1.1.2) provides separate aarch64 and x64 DMGs, Windows x64 installers and Linux x86_64 packages. An SVN executable must be installed separately. Mac packages are ad-hoc signed and not notarized; consult the [distribution notes](https://github.com/firzen/StoneSVN/blob/main/docs/macos-distribution.md).

This is a working-copy review and commit tool, not a feature-complete replacement for every SVN client. General Merge, Switch and line-level Blame interfaces are absent in v1.1.2. Local stashes are not shared with teammates or exchanged with another client's shelves.

Project self-submission prepared with AI assistance. These notes describe the repository and release documentation; they do not claim hands-on installation acceptance on every platform or performance superiority over other clients.
