---
name: OpenDesign
repoUrl: https://github.com/nexu-io/open-design
projectType: real-app
category: developer-tools
summary: "A portable design runtime that decouples model and delivery: the artifact surface (HTML /
  PDF / PPTX / MP4) is repo-shaped, the brand contract is a Markdown file, and the agent layer is
  pluggable across 27 CLI runtimes — the only realistic OSS answer to Claude Design, v0, Lovable,
  Bolt.new, and Figma Make."
description: A local-first Apache-2.0 desktop and web application that turns any of 27 coding-agent
  CLIs into a design engine, producing HTML prototypes, PDFs, PPTX decks, images, and HyperFrames
  MP4 against a portable `DESIGN.md` brand contract, with BYOK across OpenAI / Anthropic / Azure /
  Google / Ollama and an MCP stdio server for agent-native integration.
sourceDescription: The open-source Claude Design alternative — a local-first desktop app that turns
  any coding agent CLI into a design engine.
platforms:
  - macos
  - windows
  - web
licenses:
  - apache-2.0
links:
  github: https://github.com/nexu-io/open-design
  homepage: https://open-design.ai
distribution:
  channels:
    - type: github-releases
      platform: desktop
      label: GitHub Releases
      url: https://github.com/nexu-io/open-design/releases
      verified: true
    - type: website
      platform: web
      label: OpenDesign website
      url: https://open-design.ai/
      verified: true
    - type: website
      platform: web
      label: OpenDesign Cloud pricing
      url: https://open-design.ai/zh/pricing/
      verified: true
tags:
  - open-source
  - foss-alternative
  - self-hosted
  - cross-platform
  - desktop-app
  - web-app
  - design-tools
  - developer-tools
  - ai
  - claude
  - codex
  - mcp
  - mvp
bestFor:
  - Teams that want a portable design contract (`DESIGN.md`) checked into git and applied across
    repos
  - Builders who want one shell for HTML prototypes, PDFs, PPTX decks, images, and HyperFrames MP4
  - Anyone who wants to bring their own model — Claude, GPT, Gemini, DeepSeek, Ollama — without
    per-vendor lock-in
whyListed:
  - The only realistic Apache-2.0 / self-hostable / desktop entry in the AI design-tool shortlist
    (Claude Design, v0, Lovable, Bolt.new, Figma Make)
  - 27-agent CLI breadth + BYOK proxy with SSRF guard at the daemon edge, normalized through
    `RuntimeAgentDef`
  - First-class portable brand contract (`DESIGN.md`); SKILL.md reuse from Claude Code as-is
  - HyperFrames (HTML→MP4 via headless Chrome + FFmpeg) — only realistic-shortlist member that ships
    MP4 from an agent pipeline
  - 14 releases in 30 days; ~33k stars gained in ~10 weeks (June → August 2026)
caveats:
  - v0.18.1+ forces a mandatory cloud sign-in on launch (#6599, 19+ comments); community fork
    `tony-box/open-design` removes the gate
  - No shipped Linux desktop — README oversells the desktop column; AppImage either doesn't ship or
    fails to boot
  - Plan-included unlimited credits at open-design.ai are explicitly locked to the OpenDesign app
    (cannot be used via MCP/CLI/API); the AMR / Vela Cloud image model is the *default* — BYOK
    alternative exists but must be opted into
  - Always-on safety / reliability telemetry bypasses the consent toggle
    (`apps/daemon/src/analytics.ts:204-220`); disclosed in `PRIVACY.md` but not the README
  - No `Dockerfile`, `docker-compose.yml`, `mise.toml`, or Nix config checked in — self-host
    documentation depends on the published Docker image and the Sealos App Store
  - Dark mode removed in v0.18.0 (PR
  - Two distinct iframe sandbox policies (live preview `sandbox="allow-scripts allow-forms"`, brand
    gallery `sandbox=""`) plus a third "powered preview" using cross-origin isolation — README
    collapses them as "sandboxed iframe"
  - "Plugin support is narrower than the README frames: project-cwd and legacy SKILL.md tiers
    deferred to Phase 2A"
  - p0 BYOK argv-leak disclosure (#2456) fix proposed but not yet merged as of 2026-08-21
  - No `Dockerfile` / docker-compose / mise.toml / Nix in repo; `@types/node` mismatch (20.19.39 vs
    runtime `~24`); bot-driven triage (issue creation restricted to collaborators)
relations:
  - type: alternative-to
    to: claude-design
    evidence:
      type: self-described
      url: https://github.com/nexu-io/open-design
      quote: The open-source Claude Design alternative
      checkedAt: 2026-09-22
  - type: alternative-to
    to: figma
    evidence:
      type: repo-topic
      url: https://github.com/nexu-io/open-design
      quote: figma-alternative
      checkedAt: 2026-09-22
seo:
  title: OpenDesign – Open Source Claude Design Alternative
addedAt: 2026-09-01
source:
  type: github-topic
  owner: nexu-io
  repo: open-design
  url: https://github.com/nexu-io/open-design
curation:
  reviewed: true
  reviewedAt: 2026-08-21
  reviewedBy: Open Apps curators
  labels:
    - hot
    - mature
  lenses:
    - good-to-learn
    - production-like
visibility: keep
---
OpenDesign is a portable design runtime. That framing matters more than the
"open-source Claude Design alternative" line its marketing leads with,
because Claude Design is not the thing it replaces — Claude Design is one
of five realistic shortlist members that all share the same architectural
contract: model and delivery are coupled. OpenDesign is the only entry in
that shortlist that decouples them. The artifact surface (HTML prototype,
PDF, PPTX, MP4) is repo-shaped and version-controllable. The brand
contract (`DESIGN.md`) is a Markdown file you commit. The model layer is
pluggable across 27 coding-agent CLIs plus a BYOK proxy to any
OpenAI-compatible endpoint. Every other realistic option — Claude
Design, v0, Lovable, Bolt.new, Figma Make — picks your model for you.

That decoupling is the load-bearing claim. It is also, in practice, more
constrained than the README frames it. The 27 CLIs are normalized at the
*daemon* level through a `RuntimeAgentDef` registry, but each provider
has a hardcoded wire shape: adding a new BYOK target means a new proxy
route, a new `registerByokToolChatProxy` call, and a new tool catalog
entry. The "agent-agnostic" line is real, but it is real at the level of
"we maintain 27 integrations," not "drop in any model."

## The artifact surface is the part that holds up

The four artifact types — HTML prototype, PDF, PPTX, MP4 — come out of
one shell, against one brand file. That combination is unique in the
shortlist. Claude Design ships PDF + PPTX + HTML. Figma Slides ships
`.pptx`. v0, Lovable, Bolt.new are web-app-only. HyperFrames — agent
HTML/CSS/GSAP rendered into deterministic MP4 via headless Chrome and
FFmpeg (`hyperframes@0.8.1`, bundled as an npm dep) — is OpenDesign-only.

The carve-out documented in `apps/daemon/src/prompts/media-contract.ts`
explains why the renderer runs in the *daemon* process rather than the
spawned agent: macOS `sandbox-exec` wraps Claude Code's Bash tool, and
under it puppeteer's Chrome subprocess hangs partway through frame
capture. The daemon is unsandboxed and renders reliably; the agent only
authors composition HTML. This is a real architectural decision — the
renderer is a daemon subsystem, not an agent tool — and it is the kind
of detail the README does not foreground.

`DESIGN.md` is the other portable piece. It is a Markdown file with
`tokens.css`, a `USAGE.md`, a components manifest, and a rich-file
index. When composing the system prompt the daemon reads the file body —
not a copy, not a `{{ design_system }}` substitution, not a section-
pruned excerpt — and injects it between the craft reference layer and
the skill body. Brand tokens win on conflict. The validator in
`tools-connectors-cli.ts` rejects "thin" design rules under 800 chars
and missing canonical sections. The result is that you can commit one
`DESIGN.md` and apply it across many repos with any of the 27 agents.

## Three preview surfaces, three isolation models

The README calls it a "sandboxed iframe preview." That collapses three
different isolation models that exist in the same repo:

- **Live HTML preview**: served into a `srcdoc` iframe with
  `sandbox="allow-scripts allow-forms"`. Scripts allowed, network not.
- **Brand gallery**: served into an iframe with `sandbox=""`. Fully
  locked down.
- **Powered preview** (for WebGL, Worker, WASM, SharedArrayBuffer
  artifacts): cross-origin isolation instead of sandbox — sets
  `Document-Isolation-Policy: isolate-and-credentialless`, removes CSP.

A reader who believes "sandboxed" is uniform is wrong, and that is a
documentation gap worth knowing before you ship.

## The security model is the strongest part of the OSS build

The BYOK proxy at `/api/proxy/{provider}/stream` enforces SSRF at the
daemon edge: `validateExternalApiBaseUrl` performs DNS resolution and
blocks RFC1918, loopback, link-local, CGNAT, IPv6 ULA/link-local,
metadata IPs, and the multicast block. DNS rebinding is defeated by
pinning validation to the actual connection (`createValidatingLookup`).
`fetch` calls are paired with `redirect: 'error'` to defeat 3xx→private
hops. v0.20.0 closed a DNS-trick bypass for BYOK media downloads
(PR #6072).

The MCP stdio server (`od mcp`) is stateless: it holds no state, never
touches the filesystem, and exits after 30 minutes of inactivity. Every
tool call resolves to `fetch()` against `OD_DAEMON_URL`. Spawned agents
that call back into the daemon get short-lived, endpoint- and operation-
scoped bearer tokens (15-minute TTL) — not the user's `OD_API_TOKEN`.
Browser-extension origins (`chrome-extension://`, `moz-extension://`)
require an explicit pairing flow that mints a long-lived `odlt_…` token
(stored hashed as sha256); without pairing those origins are rejected.

CORS is implemented inline per route, not via middleware. The `/api`
guard enforces strict loopback-only origin validation. Non-browser
clients (no Origin header) are always allowed.

## The open-core line is real, but not where the README draws it

OpenDesign is genuinely Apache-2.0 and genuinely usable with zero plan
credits — the OSS build ships a free tier that supports local CLI and
BYOK. The commercial boundary is not about gating the core; it is about
*convenience*. Paid Cloud tiers (Go $10, Plus $20, Pro $100, Max $200,
Team $63/seat) add hosted model credits and image resolutions.

The real open-core lines are subtler than the README draws them:

1. **Plan credits are locked to the OpenDesign app.** The pricing page
   is explicit: "Plan-included unlimited credits and free generations
   cannot be used via MCP/CLI/API." If you want to use a paid model
   outside the app, you must BYOK.
2. **AMR / Vela Cloud is the default for image generation.**
   `vela/gpt-image-2` is the default model in `apps/daemon/src/media/
   models.ts:43`. The AMR API at `https://amr-api.open-design.ai` has
   no BYOK alternative for `vela/*` models — the wallet endpoint calls
   that API. Even on a "BYOK-only" install, the image path routes
   through the operator's managed cloud unless the user manually changes
   the default.
3. **Always-on safety / reliability telemetry bypasses the consent
   toggle.** `apps/daemon/src/analytics.ts:204-220` calls this out
   explicitly. `PRIVACY.md:13-15` does disclose it ("Safety and
   reliability telemetry is always enabled in builds configured with a
   telemetry destination"), but no README mention of "telemetry opt-out"
   reveals the third channel. A reader who toggles off analytics is *not*
   actually off everything.
4. **v0.18.1+ forces a mandatory cloud sign-in on launch.** Issue #6599
   (19+ comments, no maintainer revert) reports a full-page "Sign in"
   screen with no skip option. The community fork `tony-box/open-design
   v0.18.1` (15 reactions) removes the gate. Maintainer position is
   "identity first, runtime second."

## Where OpenDesign wins, where it loses

**Pick OpenDesign** if you want OSS + self-host + BYOK + agent-agnostic,
your artifact is not a deployable web app (slides, decks, prototypes,
images, MP4), or you need a portable design contract across repos via
`DESIGN.md`.

**Pick Claude Design** if you are already on Claude Pro/Max/Team and
want first-party connectors to Lovable, Replit, Vercel, Canva, Gamma,
Wix, Adobe, Miro. Those handoffs are why a non-Anthropic-locked tool
cannot fully substitute.

**Pick v0** if the deliverable is a deployable Next.js app on Vercel.

**Pick Lovable** if the deliverable is a hosted full-stack app with
managed DB/auth and you do not want per-seat billing.

**Pick Bolt.new** if you want token-metered, dev-shaped chat-to-app with
private NPM and design-system knowledge at the Teams tier.

**Pick Figma Make / Slides** if the deliverable is a Figma file for
designer handoff and you need real collaborative editing.

## Deployment notes

The OSS build is genuinely usable. Install paths: macOS / Windows
desktop installers, Docker compose on port 7456, Vercel preset, Nix
flake + mise, source build via `pnpm tools-dev run web`. Node `~24` and
pnpm `10.33.x` are required for source.

Self-host caveats worth knowing in advance:

- **No first-party `Dockerfile`, `docker-compose.yml`, `mise.toml`, or
  Nix config is checked into the repo.** `QUICKSTART.md` references a
  `deploy/` directory and the Sealos App Store, but reproducible builds
  depend on the published Docker image, not first-party build
  artifacts.
- **No shipped Linux desktop.** ≥9 issues ask for Linux support; the
  AppImage either does not ship or fails to boot; the Flatpak PR
  remains draft.
- **Self-hosting behind an enterprise / VPN-internal model gateway
  requires `OD_ALLOWED_INTERNAL_HOSTS`** — the SSRF guard rejects
  RFC1918 by default.
- **v0.18.1+ users must have network access to even launch the app.**
  Air-gapped users should stay on v0.17.0 or use the community fork
  until #6599 is resolved.

## Verified sources

- Repository and license — <https://github.com/nexu-io/open-design>;
  `LICENSE` (Apache-2.0).
- Architecture and skills protocol — `docs/architecture.md`,
  `docs/skills-protocol.md`, `AGENTS.md` at commit
  `c9eb23027fc252662cd00c03f08562f298dfafec`.
- Releases and security fixes — <https://github.com/nexu-io/open-design/releases>
  (v0.17.0 → v0.20.1, including v0.20.0 SSRF fix PR #6072).
- Cloud pricing and commercial boundary — <https://open-design.ai/zh/pricing/>.
- Forced-login issue and community fork — <https://github.com/nexu-io/open-design/issues/6599>;
  <https://github.com/tony-box/open-design/releases/tag/open-open-design-v0.18.1>.
- Realistic-shortlist comparison facts — each competitor's own
  published pricing and product pages (claude.com, v0.app, lovable.dev,
  bolt.new, figma.com), not affiliated reviews.
