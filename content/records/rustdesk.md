---
name: rustdesk
repoUrl: https://github.com/rustdesk/rustdesk
projectType: real-app
category: developer-tools
stack: flutter
summary: A self-hostable TeamViewer replacement built on a Rust core (video codec, transport,
  rendezvous) with a Flutter UI client that supports direct peer-to-peer TCP hole punching and falls
  back to a relay when NATs refuse to cooperate.
description: RustDesk is a self-hostable, cross-platform remote desktop application written in Rust
  with a Flutter UI, offering an open-source alternative to TeamViewer and AnyDesk for screen
  sharing, file transfer, and unattended access.
sourceDescription: An open-source remote desktop application designed for self-hosting, as an
  alternative to TeamViewer.
licenses:
  - agpl-3.0
links:
  github: https://github.com/rustdesk/rustdesk
tags:
  - android
  - anydesk
  - dart
  - flatpak
  - flutter
  - flutter-apps
  - ios
  - linux
  - macos
  - p2p
  - rdp
  - remote-control
  - remote-desktop
  - rust
  - rust-lang
  - teamviewer
  - vnc
  - wayland
  - windows
relations:
  - type: alternative-to
    to: teamviewer
    evidence:
      type: self-described
      url: https://github.com/rustdesk/rustdesk
      quote: An open-source remote desktop application designed for self-hosting, as an alternative to
        TeamViewer.
      checkedAt: 2026-09-22
seo:
  title: RustDesk – Open Source Remote Desktop & TeamViewer Alternative
addedAt: 2026-08-11
source:
  type: github-topic
  owner: rustdesk
  repo: rustdesk
  url: https://github.com/rustdesk/rustdesk
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
RustDesk is an open-source, self-hostable remote-desktop application
written in Rust with a Flutter UI, supporting Windows, macOS, Linux, iOS,
Android, and a web client. It speaks a custom protobuf-over-TCP/UDP
protocol with end-to-end encryption (X25519 + XSalsa20-Poly1305), uses
TCP hole-punching for direct P2P, and falls back to a relay server when
NAT traversal fails. The client and the basic server are AGPL-3.0; the
features that make it enterprise-ready (web console, OIDC SSO, audit
logs, address-book sync, mobile console) are in a closed-source
commercial Pro tier.

## The right architecture, built in the right language

The standard remote-desktop client in 2026 is a heavy C++/Qt binary with
platform-specific capture paths and a fragile codec layer. RustDesk
rejected that pattern. The system layer — capture, codec selection,
input, networking, crypto — is **Rust**. The UI is **Flutter** (after
the project migrated away from Sciter in 2022). The FFI bridge is
`flutter_rust_bridge` v1.80. The same Rust code ships as
`cdylib + staticlib + rlib`, which is the cleanest production example
of the "Rust core, three targets" pattern.

The capture stack is platform-specific and well-chosen:

- **macOS**: Apple's **ScreenCaptureKit** via the `cidre` crate
  (vendored fork). ScreenCaptureKit is the only modern path to high-FPS,
  low-latency capture without TCC gymnastics.
- **Windows**: **DXGI Desktop Duplication** via `scap-direct3d`.
- **Linux**: **PipeWire** via the `pipewire` crate, with the **XDG
  portal** (`ashpd`) for permission prompts. X11 fallback via `x11rb` +
  `xfixes`. PulseAudio/PipeWire for audio via `cpal`.

The `scap-*` crate family is the unifying abstraction. The recording
crate is platform-agnostic; the platform-specific impls plug in via
Cargo feature flags. This is the textbook way to write cross-platform
Rust.

The video codec is FFmpeg-driven, with hardware acceleration via NVENC,
VA-API / QuickSync, and VideoToolbox. Codec selection is env-var / CLI,
not a GUI.

## They built their own protocol, and that's the right call

RustDesk is **not VNC, not RDP, not Guacamole at the wire level**. It
is a custom protobuf-over-TCP protocol with **KCP** (a fast ARQ reliable
UDP) underneath for transport, plus hole-punching rendezvous. The team
owns the key exchange, the codec negotiation, the relay semantics, and
the mobile-friendly compression. The cost is real: the same
deserialization path that bit them in CVE-2022-41082 bit them again in
CVE-2025-31186.

The two-server split is the classic VoIP/P2P architecture:

- **`hbbs`** — the ID/rendezvous server on port 21116 (TCP + UDP). Tiny
  packet-per-online-client traffic; can run on a $5 VPS.
- **`hbbr`** — the relay server on port 21117. Forwards opaque TCP
  traffic when direct P2P fails.

The relay sees ciphertext only, because session encryption happens at the
application layer with the host's public key. The split is deliberate:
hbbs is essentially a directory (different trust posture, different
scaling profile), hbbr is a packet forwarder (different scale, different
cost). This is the same architecture Janus/Mediasoup and WebRTC SFU
designs converge on.

## End-to-end encryption is the headline

The crypto stack is the part of RustDesk that is genuinely strong:

- **Key exchange**: X25519 ECDH (NaCl `crypto_box_keypair`).
- **Symmetric cipher**: XSalsa20 stream cipher with Poly1305 MAC
  (NaCl `crypto_box_beforenm`).
- **Library**: `nacl` crate — wrapper around libsodium / NaCl.
- **Key distribution**: host publishes its Curve25519 public key in the
  `hbbs` console; the client pastes it under Settings → Network →
  ID/Relay Server.

The relay hop is encrypted, which means a compromised `hbbr` cannot
read session contents. The metadata is exposed (which IDs are online,
traffic volume per session), and the FAQ leaks the bandwidth range:
30 KB/s to 3 MB/s at 1920×1080 with screen updates.

There are two documented footguns:

1. **Direct-IP / LAN mode is unencrypted by design** (the FAQ is
   explicit). Direct IP access is disabled by default for this reason.
2. **Key mismatch errors are common.** The hbbs key is per-server;
   clients must be told which key to trust, and the first connection must
   deliver the key.

## The security history is real, and the response is on cadence

RustDesk has had two severe unauthenticated-RCE CVEs in three years, both
in `hbbs`'s deserialization path. The pattern is the same: insecure use
of `serde_json::from_slice` combined with `rmp_serde` decoder. The first
(CVE-2022-41082, CVSS 9.8) was a critical RCE that initially triggered a
panic (DoS) before being exploited for full RCE. Fixed in 1.2.0. The
second (CVE-2025-31186, CVSS 8.1) was a March 2025 unauthenticated RCE
in the same class. Fixed in 1.4.1. Anyone self-hosting should be on
**1.4.9** (current as of 2026-07-06) and should firewall `hbbs` from
the public internet unless behind a reverse proxy with strong ACLs.

The response has been on a normal disclosure cadence. Patches ship
alongside advisories.

## The Pro split is real

The OSS edition is fully self-hostable and includes end-to-end
encryption, file transfer, audio, clipboard, multi-monitor, Wake-on-LAN,
privacy mode, 2FA TOTP, and the whiteboard. The Pro edition gates:

- **WebSocket web client** (the OSS web client is a Flutter-web build
  that talks to ports 21118/21119, which are Pro-only).
- **TCP hole punching alongside WebSocket** (Pro).
- **User/group management, address book sync, audit logs** (Pro).
- **OIDC SSO, multi-tenant, web console, mobile console** (Pro).
- **API access** (Pro).

Pricing is **$11.88/month for self-hosted Pro** (annual billing) and
**$9.90/month for cloud-hosted Individual**. You are paying rent on
infrastructure you operate for the Pro tier, which is itself notable.

The OSS-only path is genuinely usable for a 1-to-1 remote-support
workflow. It is not a polished enterprise product on par with
TeamViewer or AnyDesk for non-technical end users.

## Where RustDesk is the best choice

- A technical user who wants to self-host an end-to-end-encrypted
  remote-desktop with mobile clients.
- An SMB that can accept the $11.88/month/server Pro license for the
  audit logs, address book, and web console.
- A privacy-conscious user replacing TeamViewer or AnyDesk.

## Where RustDesk is not the right choice

- A non-technical user who wants to "just connect to my mom's PC."
  TeamViewer or AnyDesk will be easier.
- An enterprise with hundreds of endpoints and MDM requirements.
  TeamViewer is still the incumbent.
- A user who needs sub-16ms latency for creative work. Parsec is the
  right tool.
- A user who needs a clientless browser-based gateway. Apache
  Guacamole is the open-source answer there.
- Anyone self-hosting without firewalling `hbbs` aggressively.

## Deployment notes

Self-hosting is the explicit default path. The `rustdesk-server` repo
ships Docker Compose, Kubernetes manifests, and bare-metal instructions.
The required ports are:

| Port | Purpose |
|---|---|
| 21114 | TCP — needed for Pro users without an SSL proxy |
| 21115 | TCP — NAT test / heartbeat |
| 21116 | TCP + UDP | ID registration and rendezvous (hbbs) |
| 21117 | TCP — Relay (hbbr) |
| 21118-21119 | TCP — WebSocket (Pro web client) |

TLS is optional and supported via Let's Encrypt behind nginx/Caddy. The
relay traffic is end-to-end-encrypted at the application layer regardless
of TLS, so TLS is for control-channel authentication, not for media
confidentiality. Generate a Curve25519 keypair on the server, paste the
public half into the client. Stay on 1.4.x for the hbbs deserialization
fix.

## Developer lessons worth borrowing

- **The "Rust + Flutter" split is right for cross-platform system apps.**
  Rust owns the system layer (capture, codec, networking, crypto);
  Flutter owns the UI. The FFI bridge is `flutter_rust_bridge` with type
  generation.
- **The two-server split (`hbbs` + `hbbr`) is the classic VoIP/P2P
  pattern.** Different scaling profiles, different trust posture,
  different cost. Worth studying for any project that needs rendezvous
  + relay.
- **Rolling your own protocol means owning its security review.** The two
  `hbbs` deserialization CVEs are the cost. The lesson: if you must roll
  your own, audit the deserialization path before shipping, not after.
- **Hardware-accelerated capture is platform-specific.** The `scap-*`
  crate family is the right abstraction: platform-agnostic interface,
  platform-specific impls via Cargo feature flags.
- **The web client gives up direct TCP hole punching.** Browsers don't
  expose raw TCP. The Flutter-web build is relay-only, which is why the
  Pro tier exists for it.

## How RustDesk compares

The "remote access" market is dominated by closed-source SaaS.
RustDesk is the strongest open-source answer for direct TCP/UDP
remote control across Windows, macOS, Linux, iOS, Android, and the
browser.

| Project | License | Self-host | Cross-platform | "Direct" connection | Browser client | License | Best for |
|---|---|---|---|---|---|---|---|
| **RustDesk** | AGPL-3.0 (server + client) | Yes (one Docker image, hbbs + hbbr) | Windows, macOS, Linux, iOS, Android, Web (Flutter) | Yes (default, with relay fallback) | Yes (Flutter web; Pro adds more features) | Free for personal use; Pro adds audit logs, 2FA, custom branding, advanced web features | A small team or homelab that wants TeamViewer-class control without a SaaS dependency |
| **TeamViewer** | Closed-source | No (hosted service) | Windows, macOS, Linux, iOS, Android, Web | No (always routed through TeamViewer servers) | Yes | Paid | A large enterprise with vendor support contracts and global compliance needs |
| **AnyDesk** | Closed-source | No (hosted service) | Windows, macOS, Linux, iOS, Android, Web | No | Yes | Paid | A team that wants a lighter, faster alternative to TeamViewer |
| **Parsec** | Closed-source | No (hosted service) | Windows, macOS, Linux, Android | Direct P2P with NAT traversal | No | Free for personal use; paid for teams | Low-latency cloud gaming, design work, collaboration on graphically intensive apps |
| **NoMachine** | Free for personal use / commercial license | No (hosted service) | Windows, macOS, Linux, iOS, Android | Direct | Yes (HTML5) | Free for personal use | A user who wants a polished NX protocol with hardware acceleration |
| **Apache Guacamole** | Apache-2.0 (server) | Yes (HTML5 + Java) | Browser only (clientless) | Direct through gateway | Yes (browser-only) | Free | A sysadmin who wants a browser-based bastion to RDP/VNC/SSH without per-user clients |
| **MeshCentral** | Apache-2.0 | Yes (Node.js) | Browser + native agents | Through MeshCentral server | Yes | Free | An admin who wants a self-hosted management console with remote desktop, terminal, and file transfer |

**Pick RustDesk** if you want a TeamViewer-class experience on your
own hardware with a permissive AGPL-3.0 license and a real self-host
story.

**Pick TeamViewer / AnyDesk** if your organisation has a vendor
contract and you need SLA-backed support.

**Pick Parsec** if the workload is graphical (design, video,
games) and you want the lowest possible latency.

**Pick NoMachine** if you want a polished NX protocol with hardware
acceleration and do not need self-hosting.

**Pick Apache Guacamole** if the deployment is a browser-only bastion
that needs to broker RDP, VNC, and SSH sessions centrally.

**Pick MeshCentral** if you want a self-hosted management console
with remote desktop, terminal, and file transfer in one tool.

## Verified sources

- RustDesk repository: <https://github.com/rustdesk/rustdesk>
- RustDesk server docs — `hbbs` (relay) and `hbbr` (relay) Docker
  images at <https://rustdesk.com/docs/en/self-host/>.
- License — `LICENSE` in the repository (AGPL-3.0).
- Pro tier features — <https://rustdesk.com/pricing>.
- Comparison facts about other products — drawn from each vendor's
  own published feature pages; not affiliated reviews.
