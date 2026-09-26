---
name: Butterfly
repoUrl: https://github.com/LinwoodDev/Butterfly
projectType: real-app
category: productivity
stack: flutter
summary: A Linwood-maintained visual-notes app where a `butterfly_api` package owns the document
  format and protocol while the Flutter client layers a Bloc/Cubit state machine, perfect-freehand
  ink rendering, a WebDAV-backed file system, and an optional separately-licensed `api/` server for
  sync and collaboration.
description: Butterfly is a Flutter note-taking and drawing app whose central object is an infinite
  canvas — pages hold freehand ink, text, shapes, images, areas, and waypoints in a custom `.bfly`
  document model, with optional WebDAV sync, OneNote import, and PDF/SVG export.
sourceDescription: 🎨 Powerful, minimalistic, cross-platform, opensource note-taking app
licenses:
  - agpl-3.0
links:
  github: https://github.com/LinwoodDev/Butterfly
tags:
  - android
  - app
  - cross-platform
  - customizable
  - dart
  - dartlang
  - drawing
  - flutter
  - linux
  - note
  - note-taking
  - notes
  - notes-app
  - onenote
  - opensource
  - productivity
  - web
  - windows
  - writing
seo:
  title: Butterfly – Open Source Cross-Platform Note-Taking App
addedAt: 2026-08-11
source:
  type: github-topic
  owner: LinwoodDev
  repo: Butterfly
  url: https://github.com/LinwoodDev/Butterfly
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Butterfly (branded as **Linwood Butterfly**) is a Flutter note-taking app
where the primary artifact is an infinite drawing canvas. Notes are organized
into pages, and each page is a free-form composition of hand-drawn ink,
text, shapes, images, areas, and waypoints. It is positioned as a
cross-platform alternative to OneNote with stylus-first input on Android,
Windows, Linux, and the Web.

## Why it matters

- **Canvas-first note model.** Butterfly is not a Markdown editor with
  a paper background; the canvas *is* the model. A `PersistedDocumentState`
  holds pages, viewports, and tool state, and `perfect_freehand` plus
  `one_dollar_unistroke_recognizer` are first-class dependencies for ink
  smoothing and gesture recognition.
- **Custom document format.** Native files use the `.bfly` extension
  (and `.tbfly` for templates). The format, converters, and sync
  protocol are factored out into a sibling Dart package, `butterfly_api`,
  that the Flutter app consumes via a `path:` dependency. This is a
  well-executed monorepo split: the shared schema, converters (note,
  text, color, Xournal++ `.xopp`, ID helpers), and protocol types live
  next to the app and can be reused by the server.
- **Local-first with optional WebDAV.** A custom `lw_file_system` layer
  treats local storage, IndexedDB on web, and any WebDAV endpoint as
  interchangeable backends. There is no required cloud account; users
  point the app at Nextcloud, ownCloud, or any standards-compliant
  WebDAV server.

## How it works

The Flutter client is organized around a Bloc/Cubit state machine
(`flutter_bloc`, `replay_bloc`, `rxdart`) under `app/lib/bloc/` and
`app/lib/cubits/`. Services under `app/lib/services/` mediate
file I/O, rendering, and imports. The `view_painter.dart` top-level
file plus per-element renderers under `app/lib/renderers/` translate
the document model into paint operations; elements are typed (pen,
text, shape, image, area, waypoint) and editable in place.

The shared `api/lib/src/` package contains four parallel subsystems:
`converter/` (color, note, text, Xournal++, ID), `helpers/`,
`models/` (the document schema), and `protocol/` (network payloads).
A separately versioned `api/` *server* in the repository
(Apache-2.0, distinct from the AGPL-3.0 client) is a thin service
that speaks the same protocol and is the optional backend for
multi-device sync. The deliberate license split keeps the API
service embeddable without dragging the client into AGPL.

Importers and exporters are first-class: OneNote files flow through
`onenote_parser`, Xournal++ via `xopp.dart`, and images/PDFs/SVGs
are handled by `image`, `pdfrx`, and `xml`. The app advertises
`.bfly, .tbfly, .pdf, .jpg, .jpeg, .png, .gif, .bmp, .ico, .md,
.one, .onepkg` as recognized file types, so opening an exported
artifact in another tool (or back into Butterfly) is the documented
round-trip.

## Caveats

- **AGPL-3.0 on the client.** The Flutter app is AGPL-3.0. The
  `api/` server is Apache-2.0, so deploying the server as a hosted
  service is friendlier than the client would suggest.
- **Monorepo git refs.** Several internal packages
  (`settings_leap`, `material_leap`, `networker`, `lw_file_system`,
  `keybinder`) are pulled from `github.com/LinwoodDev/dart_pkgs`
  via Git URLs rather than published versions, which makes
  reproducible builds depend on a moving target until those
  packages are tagged.
- **Pre-1.0 versioning.** `pubspec.yaml` reports `2.6.0-beta.5+193`
  on the `develop` branch, so APIs and the `.bfly` format are still
  in flux between minor versions.

## Deployment notes

The easiest way to run Butterfly is the prebuilt release for Android,
Windows, Linux, or Web. For self-hosted sync, the repo also ships
a `Dockerfile` and `docker-compose.yml` that bring up the Apache-2.0
`api/` server next to whatever WebDAV-compatible store you front it
with. The default client configuration points at local storage; the
WebDAV URL is configured per device in the app settings, not via a
mandatory account.
