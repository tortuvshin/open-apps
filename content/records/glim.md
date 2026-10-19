---
name: Glim
repoUrl: https://github.com/NeoPanic/Glim
category: tools
stack: rust
description: A free macOS file viewer for Markdown, PDFs, images, JSON, CSV and source code in one workspace.
platforms:
  - macos
licenses:
  - mit
tags:
  - file-viewer
  - markdown
  - structured-data
  - gpui
bestFor:
  - Reading project documents and data files in one macOS workspace.
  - Studying a Rust and GPUI Kit desktop application.
whyListed:
  - Combines Markdown rendering, JSON trees, CSV tables and native document previews.
  - Public app, service and core crates document the desktop architecture.
caveats:
  - macOS only, with Apple Silicon and Intel downloads.
  - Current installers are not Apple-notarized.
  - Text editing is basic; PDF, Office and image previews are read-only.
seo:
  title: Glim – Open Source File Viewer for macOS
addedAt: 2026-10-19
submittedBy: NeoPanic
---
Glim keeps related documents, data and visual assets in a file-tree-and-tabs
workspace. Markdown reading includes Mermaid diagrams and LaTeX formulas;
JSON has expandable trees and CSV has a table view with source access.
Ordinary UTF-8 text supports basic editing and automatic saving.

It is built with Rust and GPUI Kit, with native macOS document readers. For
someone studying desktop Rust, the public source separates the application,
services and core crates. It is a viewer with basic text editing, rather
than an IDE or a complete Office suite.

[Apple Silicon and Intel installers](https://github.com/NeoPanic/Glim/releases/latest)
are available. Current DMGs are ad-hoc signed and not Apple-notarized; the
README explains the first launch. PDF, Office and image previews are
read-only, and large/long-line text may use read-only pages. See the
[format support guide](https://github.com/NeoPanic/Glim/blob/main/docs/file-format-support.md)
for reader-specific limitations.

Submitted by the project maintainer. These notes describe the documented
workflow and source structure; they do not claim an independent benchmark
or a curator's endorsement.
