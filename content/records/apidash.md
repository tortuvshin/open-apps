---
name: apidash
repoUrl: https://github.com/foss42/apidash
projectType: real-app
category: tools
stack: flutter
summary: Open-source API client written in Flutter so one Dart codebase ships to iOS, macOS,
  Windows, and Linux. Its codegen layer is a thin dispatcher over per-language templates (curl, HAR,
  Python/requests, Rust/reqwest, JS fetch/axios, Go net/http, etc.) and its import layer covers
  Postman, cURL, Insomnia, OpenAPI, and HAR — a breadth most paid clients gate behind collaboration
  tiers.
description: API Dash is a Flutter-based cross-platform API client for building, sending, and
  inspecting HTTP, GraphQL, and SSE requests, with code generation for 20+ languages and an optional
  LLM assistant called DashBot that runs locally or against a cloud model.
sourceDescription: API Dash is a beautiful AI-powered open-source cross-platform (Desktop & Mobile)
  API Client built using Flutter which can help you easily create & customize your HTTP & GraphQL
  API requests, visually inspect responses and generate API integration code. A lightweight
  alternative to postman/insomnia.
licenses:
  - apache-2.0
links:
  github: https://github.com/foss42/apidash
tags:
  - api
  - api-client
  - api-testing
  - dart
  - developer-tools
  - flutter
  - flutter-apps
  - flutter-desktop
  - graphql
  - graphql-api
  - graphql-client
  - gssoc
  - hacktoberfest
  - http-client
  - http-requests
  - postman
  - rest-api
  - server-sent-events
  - websocket
relations:
  - type: alternative-to
    to: postman
    evidence:
      type: self-described
      url: https://github.com/foss42/apidash
      quote: alternative to postman/insomnia
      checkedAt: 2026-09-22
  - type: alternative-to
    to: insomnia
    evidence:
      type: self-described
      url: https://github.com/foss42/apidash
      quote: alternative to postman/insomnia
      checkedAt: 2026-09-22
seo:
  title: API Dash – Open Source API Client Built with Flutter
addedAt: 2026-08-11
source:
  type: github-topic
  owner: foss42
  repo: apidash
  url: https://github.com/foss42/apidash
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
API Dash is a cross-platform API client that lives in a single Flutter
codebase and ships to iOS, macOS, Windows, and Linux. It targets the
HTTP-API work that Postman and Insomnia have owned for a decade, but
distributes the app and its codegen as Apache-2.0.

## Why it matters

- **One Flutter app, four platforms.** The mobile UX and the desktop
  UX share the same Dart widgets. The release artefacts in the
  repository cover `.deb`, `.rpm`, Windows installers, and a macOS
  `.dmg`, and the iOS app is shipped as a separate line in the
  changelog (`v0.4.0 — iOS Release`).
- **Codegen breadth that rivals paid clients.** The `lib/codegen/`
  directory holds distinct template subdirectories per language
  family (`c/`, `csharp/`, `dart/`, `go/`, `java/`, `js/`, `julia/`,
  `kotlin/`, `php/`, `python/`, `ruby/`, `rust/`, `swift/`,
  `others/`). Concrete outputs include `curl`, `HAR`, Python
  (`requests`, `http.client`), Rust (`hyper`, `reqwest`, `ureq`,
  `Actix Client`), Go (`net/http`), JavaScript (`fetch`, `axios`,
  node.js variants), Swift (`URLSession`, `Alamofire`), and many
  more — all wired through a single `Codegen.getCode(...)`
  dispatcher in `lib/codegen/codegen.dart`.
- **Imports the formats developers already have.** `packages/curl_parser`,
  `packages/postman`, `packages/insomnia_collection`, `packages/har`,
  and `openapi_spec` are each their own Melos workspace package, and
  `apidash_core`'s `import_export` barrel exposes one entry point
  that fans out to `curl_io`, `postman_io`, `insomnia_io`, and
  `har_io`. HAR is supported in both directions (export and import).
- **Optional AI assistant.** DashBot is a full sub-app living under
  `lib/dashbot/` with its own `prompts/`, `repository/`, `services/`,
  `routes/`, `pages/`, and `widgets/`. It works against a local LLM
  or a cloud provider, so users who don't want cloud calls aren't
  forced into them.

## How it works

The architecture is a textbook Flutter split: `lib/screens/` and
`lib/widgets/` for the UI, `lib/providers/` for state, `lib/services/`
for transport, `lib/models/` for the request/response types, and
`lib/utils/` for helpers. The `lib/codegen/` tree is genuinely thin
— `codegen.dart` is a `switch` over the `CodegenLanguage` enum that
instantiates the right per-language generator and calls its
`getCode()`. Multipart-aware generators (HAR, Java HttpClient,
Python `requests`, Rust `actix`/`ureq`) receive a `boundary`
parameter; node.js variants reuse the browser templates with an
`isNodeJs: true` flag.

The request model is shared via the `apidash_core` package, which is
where the import-export contract lives. Each importer is its own
package so the parser can be tested in isolation and reused outside
the app. OpenAPI support piggybacks on the `openapi_spec` package's
`OpenApi`, `Operation`, and `ParameterHeader` types. Response
preview supports JSON, XML, YAML, HTML, SQL, plus image, PDF, and
audio bodies, and SVG was added in v0.4.0.

## Caveats

- **Still pre-1.0.** v0.5.0 is tagged WIP in the changelog. The
  feature matrix is honest about it: WebSocket, MQTT, and gRPC are
  listed as "issue tracked" alongside the working HTTP, GraphQL,
  SSE/Streaming, and AI surfaces.
- **GSoC codebase velocity.** The repository is actively participating
  in GSoC 2026 with a published ideas list. Expect API churn and
  rough edges around the newer surfaces (workspace persistence,
  environment variables, GraphQL editor) that landed in v0.5.0.
- **DashBot is opt-in plumbing.** The assistant is integrated, but
  wiring it to a working local model still requires bringing your
  own OpenAI-compatible endpoint or local runtime.

## Deployment notes

Pre-built installers are the recommended path and live on the
releases page:

```bash
# Linux (.deb)
sudo dpkg -i apidash-linux-x86_64.deb

# macOS / Windows
# Download the .dmg or .exe from
# https://github.com/foss42/apidash/releases
```

To run from source:

```bash
git clone https://github.com/foss42/apidash.git
cd apidash
flutter pub get
melos bootstrap   # wires the packages/* workspace
flutter run -d linux   # or -d macos / -d windows / -d ios
```

Prerequisites: Flutter 3.x with Dart 3, GNU Make / `gcc` on Linux for
the desktop build, and Xcode for the macOS and iOS targets.

**Integration tip:** if you curate an Open Apps record tagged
`api-client` or `developer-tools`, link API Dash alongside the
Postman and Insomnia entries rather than as a replacement — its real
niche is the codegen breadth and the Apache-2.0 / Flutter portability
story, not workspace sync.
