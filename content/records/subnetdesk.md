---
name: SubnetDesk
repoUrl: https://github.com/zibo-chen/SubnetDesk
projectType: real-app
category: tools
stack: flutter
summary: A Rust and Flutter remote-control app derived from RustDesk that deliberately removes
  public device IDs, rendezvous, relays, cloud accounts, proxies, and public update paths in favor
  of direct connections over an existing private network.
description: SubnetDesk is a cross-platform remote desktop for devices already connected by a LAN,
  routed private network, or VPN, with direct IP or hostname connections and local mDNS discovery.
sourceDescription: LAN-only remote desktop based on RustDesk.
platforms:
  - windows
  - macos
  - linux
  - android
  - desktop
licenses:
  - agpl-3.0
links:
  github: https://github.com/zibo-chen/SubnetDesk
  download: https://github.com/zibo-chen/SubnetDesk/releases/latest
  documentation: https://github.com/zibo-chen/SubnetDesk#readme
distribution:
  channels:
    - type: github-releases
      platform: windows
      label: Windows MSI and portable executable
      url: https://github.com/zibo-chen/SubnetDesk/releases/latest
      verified: true
    - type: github-releases
      platform: macos
      label: macOS disk images for Intel and Apple Silicon
      url: https://github.com/zibo-chen/SubnetDesk/releases/latest
      verified: true
    - type: github-releases
      platform: linux
      label: Linux DEB, RPM, AppImage, Flatpak, and Arch packages
      url: https://github.com/zibo-chen/SubnetDesk/releases/latest
      verified: true
    - type: github-releases
      platform: android
      label: Android APKs
      url: https://github.com/zibo-chen/SubnetDesk/releases/latest
      verified: true
tags:
  - remote-desktop
  - remote-access
  - remote-control
  - lan
  - vpn
  - mdns
  - privacy
  - homelab
  - self-hosted
  - rust
  - flutter
  - desktop-app
  - windows
  - macos
  - linux
  - android
bestFor:
  - Remote control between devices that are already reachable over a LAN or VPN.
  - Home labs, offices, classrooms, and on-site support that do not need Internet rendezvous.
  - Studying a Rust system core paired with a Flutter interface across desktop and mobile targets.
whyListed:
  - It is a complete AGPL-3.0 end-user application with installable releases for Windows, macOS,
    Linux, and Android.
  - "Its LAN/VPN-only scope is a distinct alternative to a typical RustDesk deployment: public
    coordination and relay paths are removed rather than merely made optional."
  - It combines mDNS discovery, direct endpoint connections, Argon2id password storage,
    trust-on-first-use fingerprints, and CIDR source-network allowlists.
caveats:
  - It cannot connect devices across unrelated networks because it has no Internet rendezvous, NAT
    traversal, or relay service; the devices must already be mutually reachable.
  - Remote-control ports should only be exposed to trusted networks, and first-use fingerprints
    should be verified through a separate trusted channel.
seo:
  title: SubnetDesk – Open Source LAN-Only Remote Desktop
addedAt: 2026-09-05
source:
  type: submit
  provider: github
  owner: zibo-chen
  repo: SubnetDesk
  url: https://github.com/zibo-chen/SubnetDesk
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
SubnetDesk is a cross-platform remote desktop application for devices that can already reach each
other through the same LAN, a routed private network, or a VPN. It is derived from RustDesk but
deliberately removes the public device-ID, rendezvous, relay, cloud-account, proxy, and automatic
public-update paths. Users connect directly by IP address or hostname, while mDNS can discover
nearby devices on a local network.

## What makes it different

The project is narrower than a general Internet remote-support service. It assumes that routing is
already handled by the user's LAN or VPN and keeps the connection on that existing path. This makes
it useful for home labs, offices, classrooms, and on-site support where public coordination is
unnecessary or undesirable.

SubnetDesk retains remote control, clipboard, audio, and file transfer. Its access controls include
username/password authentication with Argon2id password hashes, trust-on-first-use endpoint
fingerprints, and CIDR source-network allowlists. The codebase pairs a Rust systems core with a
Flutter interface and ships for Windows, macOS, Linux, and Android.

## Caveats

SubnetDesk does not provide Internet rendezvous, NAT traversal, or a relay service. Both endpoints
must already be mutually reachable through a LAN, private route, or VPN. Its listening port should
only be exposed to trusted networks, and users should verify a new device fingerprint through a
separate trusted channel when possible.

## How to get it

The latest GitHub release provides Windows MSI and portable executable builds, macOS disk images
for Intel and Apple Silicon, Linux DEB, RPM, AppImage, Flatpak, and Arch packages, and Android APKs.

## Verified sources

- Repository: <https://github.com/zibo-chen/SubnetDesk>
- Latest release: <https://github.com/zibo-chen/SubnetDesk/releases/latest>
- Project scope and comparison: <https://github.com/zibo-chen/SubnetDesk#why-subnetdesk>
- Security model: <https://github.com/zibo-chen/SubnetDesk#security-model>
- Build instructions: <https://github.com/zibo-chen/SubnetDesk#build-from-source>
