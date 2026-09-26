---
name: Cap
repoUrl: https://github.com/CapSoftware/Cap
projectType: real-app
category: tools
stack: tauri
summary: An open-source alternative to Loom — record screen, microphone, and camera simultaneously,
  then share a link that plays in any browser.
description: Open source Loom alternative. Beautiful, shareable screen recordings.
sourceDescription: Open source Loom alternative. Beautiful, shareable screen recordings.
platforms:
  - macos
  - windows
  - linux
  - desktop
licenses:
  - noassertion
links:
  github: https://github.com/CapSoftware/Cap
  website: https://cap.so
tags:
  - app
  - cap
  - coss
  - loom
  - mac
  - nextjs
  - nextjs15
  - open-source
bestFor: []
relations:
  - type: alternative-to
    to: loom
    evidence:
      type: self-described
      url: https://github.com/CapSoftware/Cap
      quote: Open source Loom alternative. Beautiful, shareable screen recordings.
      checkedAt: 2026-09-22
seo:
  title: Cap – Open Source Loom Alternative for Screen Recording
addedAt: 2026-07-24
source:
  type: manual
  owner: CapSoftware
  repo: cap
curation:
  reviewed: true
  labels: []
  lenses: []
  reviewedBy: Open Apps curators
  reviewedAt: 2026-08-11
---
Cap is an open-source screen recorder that pairs three modes in one
Tauri-based desktop binary: Instant (record and get a share link),
Studio (record locally and edit), and Screenshot (capture and beautify).
The recording pipeline is first-party Rust across macOS
(ScreenCaptureKit), Windows (DXGI), and Linux (PipeWire). The web app
and the share viewer are Next.js + React 19 with an Effect-typed HTTP
layer. The recording pipeline, the editor, the web app, and the
self-hosting recipe are in the AGPL-3.0 repo; the paid tiers gate AI,
custom domain, password protection, viewer analytics, and team
workspaces on the cloud.

## Three modes, one binary, first-party capture

![Cap's three-recordings menu — Instant, Studio, and Screenshot modes in one Tauri-based desktop binary](/images/cap/three-modes.png)

*Cap's three-recordings menu in one Tauri-based desktop binary: Instant mode for fast share links, Studio mode for local record-then-edit, and Screenshot mode for capture-and-beautify.*

Cap's product is unusual because it ships three distinct screen-
recording modes in one Tauri-based desktop binary. **Instant Mode**
records screen + camera + microphone, uploads chunked video to
S3-compatible storage while you record, and produces a share link
immediately on stop — the Loom-equivalent flow. **Studio Mode** records
locally to disk, then edits in a built-in editor (backgrounds, padding,
rounded corners, drop shadows, cursor effects, zoom-to-click,
trimming, captions, music, export to MP4/GIF). **Screenshot Mode** is a
hotkey capture with a beautify window.

The capture stack is first-party and platform-specific. There is **no
use of `captrs` or `nokhwa`** — Cap ships its own platform-specific
capture crates prefixed `scap-`:

- **`scap-screencapturekit`** — macOS, wraps Apple's **ScreenCaptureKit**
  via a vendored fork of the `cidre` crate.
- **`scap-direct3d`** — Windows, **DXGI Desktop Duplication**.
- **`scap-ffmpeg`** — cross-platform fallback using FFmpeg's
  `gdpirab` (Windows) / `avfoundation` (macOS) / `x11grab` (Linux).
- **`scap-cpal`** — audio capture wrapper around `cpal`.
- **`scap-targets`** — enumerates displays and windows.

The camera follows the same pattern: `camera-avfoundation`,
`camera-directshow`, `camera-mediafoundation`, `camera-ffmpeg`, plus
`camera-effects` for blurring and backgrounds. The encoding crates are
`enc-avfoundation`, `enc-mediafoundation`, `enc-ffmpeg`, `enc-gif`.

The recording state machine uses the **`kameo` actor framework** — an
unusual pick. Each actor owns its state (RecordingState, camera feed,
mic, capture) and communicates via channels. The muxer is the source
of truth; recording happens to disk first, so a network blip doesn't
drop frames. The `cap-muxer-protocol` crate is the contract for the
chunked upload to S3.

## The open-core split is healthier than most

The paid tiers turn knobs that are mostly cloud conveniences, not
codec or editor features. **Desktop License** ($29/year or $29 lifetime)
enables commercial use of the local Studio features. **Cap Pro**
($12/user/month or $8.16/user/month annual) unlocks unlimited share
links, AI (titles, transcripts, chapters), custom domain, password
protection, viewer analytics, Loom importer, and custom S3 / Google
Drive. **Enterprise** adds SOC 2 / ISO 27001 compliance (confirmed
August 2026), SAML SSO, SCIM, and managed self-hosting.

The recording pipeline, the codecs, the editor, the web app, and the
self-hosting recipe are all in the AGPL-3.0 repo. The open-core gates
are AI, custom domain, password protection, viewer analytics, and team
workspaces. This is a healthier split than most "open core" projects:
the things you might want to fork (codec, editor, web viewer,
self-host) are open; the things you would not want to fork anyway
(cloud storage, AI, identity) are paid.

## The relicense happened, and it matters

The project started under **GPLv3** at the initial commit (e1b6ce9,
November 17, 2023) with no copyright holder assigned. On **January 3,
2024** — six weeks later — commit `522e38c` ("Add Cap Software, Inc")
replaced the LICENSE with the AGPLv3 text and added "Copyright (c)
2023-present Cap Software, Inc." For an end user or downstream
contributor, the practical difference is: under the original GPLv3 you
could run a modified Cap as a network service without publishing your
changes; under AGPLv3 you must publish them. The change is consistent
with the founder's stated commercial strategy (a hosted SaaS competing
with Loom) but **was not publicly announced in a blog post or news
item**. AGPLv3 is the right license for a project with a hosted
commercial strategy; the lack of a public announcement is the part
worth naming.

## The instant-share architecture

The instant-share flow is the part of the product that is genuinely
interesting:

1. User clicks record in Cap Desktop.
2. Tauri Rust backend spawns platform capture (ScreenCaptureKit / D3D
   / PipeWire) plus camera + microphone.
3. Frames are encoded to H.264 and written to a muxer (`cap-muxer`)
   that produces chunks suitable for resumable upload.
4. Each chunk is uploaded to S3-compatible storage while the next chunk
   is captured. Presigned URLs are obtained from the cap-web API.
5. On stop, the desktop binary POSTs a "complete" event with the chunk
   manifest.
6. Cap-web marks the video as ready, generates a slug, and returns a
   share URL.
7. The viewer page lazily transcodes / builds HLS or progressive MP4
   via either MediaConvert or the in-house media-server, and the link
   is immediately shareable.

The web app (`apps/web`) is Next.js 16.3, React 19.2, with **Turbopack**
in dev. AWS S3 (with presigned URLs for direct browser-to-S3 upload) and
CloudFront CDN signing are first-class. MySQL via Drizzle ORM +
`@effect/sql-mysql2`. The web API uses the **Effect** framework
(`@effect/platform`, `effect`, RPC) and serves via Hono routing.

## The recent security audit

In July 2026, user **DPS0340** filed **issue #2033** documenting an
audit of `apps/web` that found missing access checks on multiple
endpoints. `getVideoAnalytics` had **no auth at all**, allowing private
video view counts to be read. Four PRs (#2029–#2032) were opened to
fix. **Issue #2039** documented 7 of 13 `RATE_LIMIT_IDS` declared but
never called, with endpoints having no rate limiting. This is a real
and recent disclosure. The project's response (four PRs in quick
succession) is a positive signal, but the audit findings are worth
flagging.

## Where Cap is the best choice

- A user who wants a free, open-source Loom alternative with
  self-hosting and first-party 4K/60fps capability in Studio Mode.
- A team that can pay $12/user/month for AI, custom domain, password
  protection, and team workspaces.
- A user who wants to self-host the web app and the share viewer
  (Docker Compose with `cap-web`, `media-server`, `mysql`, `minio`).

## Where Cap is not the right choice

- A user who needs a mobile app. There is no iOS or Android recorder;
  only the share viewer is mobile-responsive.
- A user who wants a free tier for commercial use. The free tier is
  personal-use only; commercial use requires a $29/year Desktop License.
- A user who needs E2E-encrypted share links. The default is HTTPS
  only; the cap-web server has the S3 keys.
- A user on a strict permissive license. AGPL-3.0 is the strictest of
  the mainstream open-source licenses for network use.
- A user who needs Screen Studio-quality cinematic zoom on macOS. Cap
  has zoom-on-click and zoom-on-text, but Screen Studio's automatic
  "click zoom" is still the better cinematic experience.

## Deployment notes

The self-host stack is `docker compose up -d` from the repo root, which
spins up `cap-web` (Next.js) on port 3000, `media-server` (FFmpeg-based
processor), `mysql` (8.0), `minio` (S3-compatible), plus a `minio-setup`
one-shot bucket creator. Default credentials are public in the repo
(`MYSQL_PASSWORD=cap-local-pwd-123`,
`MINIO_ROOT_PASSWORD=cap-minio-pwd-456`) — the docs explicitly call
this out and require replacement before production. One-click Railway
template and a separate Coolify template are available. Point Cap
Desktop at your own server via Settings → "Cap Server URL". Optional
AI by adding API keys for AssemblyAI (transcription) and Groq / OpenAI
(summaries). Optional OAuth (Google/Apple) and email (Resend).

## Developer lessons worth borrowing

- **The "Rust + Tauri + TypeScript" split is the right one for
  cross-platform system apps in 2026.** Tauri v2 with `tauri-specta`
  typed bindings gives you a smaller binary than Electron; the Rust
  core owns capture, encoding, mux, upload; the TypeScript layer never
  touches raw frames.
- **The `scap-*` family is the right capture abstraction.**
  Platform-agnostic interface, platform-specific impls via Cargo
  feature flags. Cap and RustDesk both ship this pattern; both are good
  case studies.
- **The kameo actor model for the recording state machine is unusual
  and worth studying.** "Many input streams, one output muxer" is a
  clean fit for actors. The muxer is the source of truth; recording
  happens to disk first.
- **Chunked upload during recording is the right pattern for "instant
  share."** The muxer chunks frames into uploadable segments; each
  segment is uploaded independently; the server stitches them on
  playback. The desktop binary can survive network blips because the
  recording is on disk first.
- **Open-core gating should be on cloud conveniences, not codecs.**
  Cap's gates are AI, custom domain, password protection, viewer
  analytics, team workspaces. The recording pipeline, the editor, the
  web app, and the self-hosting recipe are all in the AGPL-3.0 repo.
  This is the model to emulate.
- **A public relicense deserves a public announcement.** Cap's
  GPLv3 → AGPLv3 change in the first six weeks was not publicly
  explained. AGPLv3 is the right license for a project with a hosted
  commercial strategy; the lack of a blog post is the part worth
  naming.
- **A security audit is a feature.** DPS0340's July 2026 audit found
  real bugs in `apps/web`; the team's response (four PRs in quick
  succession) is a positive signal. The lesson: welcome external
  audits, treat the findings as a roadmap, ship the fixes publicly.

## How Cap compares

The screen-recording landscape in 2026 is a long spectrum from "free
streaming tool" to "professional post-production". The honest
positioning of Cap is that it is the only Loom-class product that is
also a serious self-host.

| Project | License | Capture engine | Editor | Self-host | Free self-host usable | Best for |
|---|---|---|---|---|---|---|
| **Cap** | AGPL-3.0 (commercial Desktop License required for commercial desktop use) | First-party Rust: ScreenCaptureKit (macOS), DXGI (Windows), PipeWire (Linux) | Built-in Studio editor (zoom, captions, backgrounds, MP4/GIF export) | Yes (Docker Compose with `cap-web`, MySQL, MinIO) | Yes (default credentials must be changed) | A free Loom alternative that you can also self-host, with first-party 4K capture on every desktop OS |
| **Loom** | Closed-source SaaS | Browser/desktop record | Web editor only | No | N/A | A team that wants zero setup and can pay per-seat |
| **Screen Studio** | Closed-source, paid (~$30–50 lifetime) | macOS-only, excellent cursor/zoom effects | Built-in post-production | No | N/A | macOS users who want cinematic, share-quality output and are willing to pay once |
| **OBS Studio** | GPL-2.0 | Cross-platform, scene-based | No built-in editor | N/A (it is a capture tool, not a recorder) | Yes | Live streaming, scene composition, anything that needs to overlay multiple sources |
| **ScreenFlow** | Closed-source, paid | macOS + iOS | Full non-linear editor | No | N/A | macOS users who need non-linear editing and are willing to pay $169 |
| **Camtasia** | Closed-source, paid ($300 perpetual) | Windows + macOS | Full non-linear editor + interactive quizzes | No | N/A | Corporate training content with quizzes and LMS integration |
| **Tella** | Closed-source SaaS | Browser/desktop record | Web editor only | No | N/A | Async team communication without Loom's pricing |
| **Kap** | MIT | Cross-platform (Electron-based) | Crop / export only | No | Yes (per user) | A simple, free, open-source recorder without instant share |
| **Screenity** | MPL-2.0 | Chromium web extension | Browser-based trim | No | Yes (free) | Privacy-first browser-only recording |

**Pick Cap** if you want a real Loom alternative with self-hosting and
first-party capture quality, and you accept the AGPL-3.0 commercial
licensing terms.

**Pick OBS** if your real goal is streaming or composition, not
recording.

**Pick Screen Studio** if you are on macOS and produce share-quality
content professionally — Cinematic zoom-to-click and cursor effects
remain better there than anywhere else.

**Pick ScreenFlow or Camtasia** if you need a non-linear editor for
training content. Cap's Studio editor is a recorder-plus-effects
tool, not a Premiere replacement.

**Pick Kap** if you want a free, open-source recorder for personal use
and do not need instant share links.

## Verified sources

- Cap GitHub repository: <https://github.com/CapSoftware/Cap>
- `cap-muxer`, `cap-muxer-protocol`, `scap-*` crate family — directly
  inspectable in the repo.
- Re-license commit `522e38c` (Cap Software, Inc.), January 3, 2024 —
  `git log -- LICENSE` on the repository.
- Security audit — issue #2033 (DPS0340, July 2026) and follow-up PRs
  #2029–#2032 and #2039.
- AGPL-3.0 vs commercial tier pricing — reproduce by cloning
  `cap-web` and reading the license blocks in `apps/web`.
- Screen Studio vs ScreenFlow vs Camtasia positioning — based on the
  publishers' own feature pages (each is a closed-source product).
