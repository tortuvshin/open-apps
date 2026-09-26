---
name: PeopleInSpace
repoUrl: https://github.com/joreilly/PeopleInSpace
projectType: real-app
category: tools
stack: ios
summary: A long-running KMP reference that demonstrates multi-platform architecture across iOS,
  Android, desktop, web, and Wear OS from shared Kotlin code.
description: PeopleInSpace is a Kotlin Multiplatform reference app that shares architecture and data
  code across iOS, Android, desktop, web, and wearable clients.
sourceDescription: Kotlin Multiplatform sample with SwiftUI, Jetpack Compose, Compose for Wear,
  Compose for Desktop, and Compose for Web clients along with Ktor backend.
platforms:
  - ios
licenses:
  - apache-2.0
links:
  github: https://github.com/joreilly/PeopleInSpace
distribution:
  channels: []
tags:
  - kmm
  - kotlin
  - swiftui
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (3,347 stars on GitHub).
caveats: []
seo:
  title: PeopleInSpace – Open Source Kotlin Multiplatform Sample App
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: joreilly
  repo: PeopleInSpace
  url: https://github.com/joreilly/PeopleInSpace
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:31:57+08:00
  labels:
    - mature
    - hot
  lenses:
    - good-to-learn
visibility: keep
---
PeopleInSpace is John O'Reilly's Kotlin Multiplatform reference app for exploring who is currently in space and tracking the International Space Station. Its shared Kotlin code supports native and Compose-based clients while a small Ktor service supplies astronaut and ISS data.

## Why it matters

PeopleInSpace has been evolving since 2019, making it a useful record of how Kotlin Multiplatform architecture has matured rather than a narrowly frozen sample. The project is listed in the official Kotlin Multiplatform documentation and Google Dev Library, and its README connects the implementation to an extensive series of articles about SwiftUI interop, Kotlin Flow, Koin, SQLDelight, async/await, and Compose Multiplatform.

The breadth is unusually practical for a demo: one repository targets iOS with SwiftUI, Android with Jetpack Compose, Wear OS, desktop with Compose for Desktop, and the browser with Kotlin/Wasm. The shared `common` module also supports JVM use, while separate backend and MCP server modules show that the same domain code can extend beyond graphical clients.

## How it works

The Gradle build separates shared concerns from platform entry points. `common` contains KMP domain models, view models, Koin wiring, SQLDelight persistence, Ktor networking, and shared Compose UI. Platform modules include `app`, `wearApp`, `PeopleInSpaceSwiftUI`, `compose-desktop`, and `compose-web`; `backend` hosts a Ktor server, and `mcp-server` exposes shared functionality through the Kotlin MCP SDK.

Clients inject a Ktor `HttpClient` into `PeopleInSpaceApi` and make suspending GET requests to the project's App Engine proxy at `/astros.json` and `/iss-now.json`. Typed bodies are decoded with Kotlinx Serialization. The backend supplies astronaut records and proxies the ISS location request to Open Notify, so platform clients do not contact Open Notify directly.

Coroutines provide the asynchronous model. `PeopleInSpaceRepository` performs its initial refresh in a `MainScope`, exposes completion through `StateFlow`, and converts SQLDelight queries into a `Flow<List<Assignment>>` on `Dispatchers.Default`. ISS position updates use a cold flow that polls every ten seconds, logs transient failures, and continues unless the coroutine is cancelled.

## Caveats

This remains a demonstration and learning project, not a production crew-tracking service. Its repository refresh replaces the local people table wholesale, network errors are logged rather than surfaced comprehensively to the UI, and upstream availability matters; the Open Notify service uses an HTTP endpoint and can be intermittent.

KMP shares networking, storage, state, and some Compose UI effectively, but native presentation still requires platform work. The iOS target is a SwiftUI application opened and maintained in Xcode, while Android, Wear OS, desktop, and web have their own launch modules, packaging, and platform-specific behavior.

## Deployment notes

Use JDK 17 and a recent Android Studio. Run the Android client from the `app` configuration or with `./gradlew :app:installDebug`; Wear OS uses `wearApp` or `./gradlew :wearApp:installDebug`. Shared JVM tests run with `./gradlew :common:jvmTest`.

For iOS, open `PeopleInSpaceSwiftUI` in Xcode and build the selected simulator or device target. Desktop runs with `./gradlew :compose-desktop:run`, while the Wasm browser client uses `./gradlew :compose-web:wasmJsBrowserDevelopmentRun`. The local backend starts with `./gradlew :backend:run` and exposes test data at `http://localhost:9090/astros_local.json`.

**Integration tip:** use the repository as a KMP starting point when you want a working example of shared Ktor, serialization, SQLDelight, coroutines, and dependency injection feeding both native SwiftUI and Compose-based clients.
