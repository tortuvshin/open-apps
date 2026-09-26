---
name: roxum-ide
repoUrl: https://github.com/heckmon/roxum-ide
projectType: real-app
category: developer-tools
stack: flutter
summary: Roxum IDE pairs a Rust-backed editor engine (the code_forge package, using rope and
  sum-tree data structures) with a Flutter UI to turn an Android phone into a full coding workspace
  — file tree, embedded terminal, LSP-driven completions, Git/GitHub auth, and offline GGUF model
  chat.
description: A mobile-first Flutter code editor and mini IDE for Android with LSP, an embedded
  terminal, Git/GitHub tooling, and optional on-device GGUF model chat.
sourceDescription: A minimal and powerful IDE/Code editor for Android
licenses:
  - mit
links:
  github: https://github.com/heckmon/roxum-ide
tags:
  - android-code-editor
  - android-ide
  - code-editor
  - roxum
  - vscode
  - vscode-mobile
seo:
  title: Roxum IDE – Open Source Code Editor for Android
addedAt: 2026-08-11
source:
  type: github-topic
  owner: heckmon
  repo: roxum-ide
  url: https://github.com/heckmon/roxum-ide
curation:
  reviewed: true
  reviewedAt: 2026-08-11
  labels:
    - new
    - hot
  reviewedBy: Open Apps curators
  lenses: []
visibility: keep
---
Roxum IDE is a mobile-first code editor and mini IDE for Android,
built in Flutter. The app pairs a Rust-backed editor engine with an
embedded terminal, Git/GitHub tooling, LSP-driven language services,
and optional on-device AI completion, all in a single APK that runs
without root.

## Why it matters

- **Real editor on a phone.** The editor surface is provided by
  [`code_forge`](https://github.com/heckmon/code_forge), the author's
  own Flutter package that wraps a Rust core using rope and sum-tree
  data structures (the same shape the Zed editor uses). Multi-cursor
  edits and large files stay responsive on mid-range Android hardware.
- **LSP, not regex.** Settings configures Language Server Protocol
  servers for popular languages — proper completions, hover docs,
  go-to-definition, and diagnostics instead of text-based highlighting.
- **Bring-your-own AI.** The model picker covers Gemini, Claude,
  OpenAI, Grok, DeepSeek, Groq, TogetherAI, Perplexity, OpenRouter,
  Fireworks, and a custom endpoint, with selectable agentic protocols
  (OpenAI-compatible, Anthropic Messages, Gemini Function Calling, or
  none). GitHub Copilot is wired in via device-code OAuth.
- **Offline AI.** GGUF models can be downloaded or sideloaded for
  in-app chat and inline completion without a network round trip.
- **Bundled toolchain.** First launch materialises `bin/`, `lib/`,
  and `git-core` directories, symlinks bundled `lib*.so` files onto
  conventional names (`bash`, `sh`, `python`, `kotlinc`, ...), and
  drops a Node binary so the embedded xterm frontend has something to
  talk to.

## How it works

State is split across roughly a dozen BLoCs that `main.dart` wires
together with `MultiBlocProvider` (`ConfigBloc`, `FolderBloc`,
`RepoStatusBloc`, `GithubAuthCubit`, `AIBloc`, `CopilotBloc`, and
more). Each isolates a concern so the 2,500+ line `EditorPage` can
stay focused on tabs, dirty-file tracking, the drawer, and previews.

Git and GitHub support runs on top of `git-core` invoked through the
embedded shell. `RepoStatusBloc` parses `git status`, `git branch`,
`git stash`, and `git log` directly, while `GithubAuthCubit` stores
the OAuth token in `flutter_secure_storage` and caches the user JSON
in `SharedPreferences`. AI chat history is serialised the same way,
and AI-suggested edits are applied through `diff_match_patch` hunks.

`settings.dart` exposes light/dark mode, an editor theme picker,
eight bundled monospaced fonts (Fira Code, Cascadia, Hack, DejaVu
Sans Mono, Inconsolata, JetBrains Mono, Proggy, Source Code Pro),
and per-theme terminal presets rendered in a live `xterm` preview.

## Caveats

- **Android-only.** No iOS build. The start-screen symlink map and
  the Termux integration are all Android-specific.
- **Large download.** Compilers and interpreters live in Git LFS, so
  a fresh clone is light but a release build is not.
- **Termux is the backend.** Heavy workflows depend on Termux having
  its `pkg` packages up to date.
- **Single-maintainer pace.** The repo is owned by a solo author, so
  feature requests and Copilot outages can take time. The MIT licence
  lets the community fork, but there is no organisation behind it.

## Deployment notes

Roxum IDE ships as a Play Store app, with APKs on the GitHub
Releases page for users in regions without Play access.

```bash
git clone https://github.com/heckmon/roxum-ide.git
cd roxum-ide
flutter pub get
git lfs pull
cd android && ./gradlew :app:bundleRelease
# convert AAB to APK with bundletool, then:
bundletool install-apks --apks=app.apks
```

**Minimum device:** Android 8+ (API 26) with ~300 MB free for the
installed toolchain assets. LSP servers and GGUF models add more on
top.

**Integration tip:** if you run a directory site (Astro, Grove,
Next.js), Roxum IDE is a good "see it in action" example for any
app tagged `mobile-ide`, `flutter`, or `developer-tools` — it
shows off what a self-contained Flutter + Rust FFI project looks
like end to end.
