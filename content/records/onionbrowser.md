---
name: OnionBrowser
repoUrl: https://github.com/OnionBrowser/OnionBrowser
projectType: production
category: productivity
stack: ios
description: An open-source, privacy-enhancing web browser for iOS, utilizing the Tor anonymity network
sourceDescription: An open-source, privacy-enhancing web browser for iOS, utilizing the Tor anonymity network
platforms:
  - ios
licenses:
  - noassertion
links:
  github: https://github.com/OnionBrowser/OnionBrowser
distribution:
  channels:
    - type: app-store
      platform: ios
      label: App Store
      url: https://apps.apple.com/us/app/onion-browser/id519296448
      verified: false
tags:
  - anonymity
  - browser
  - mobile
  - mpl
  - objective-c
  - onion
  - privacy
bestFor: []
whyListed: []
caveats: []
seo:
  title: Onion Browser – Open Source Tor Browser for iOS
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: OnionBrowser
  repo: OnionBrowser
  url: https://github.com/OnionBrowser/OnionBrowser
curation:
  reviewed: false
  reviewedAt: 2026-06-13T02:50:40+08:00
  labels:
    - mature
    - hot
  lenses:
    - production-like
visibility: keep
---
OnionBrowser is the long-standing open-source browser for iOS that
**routes all traffic through the Tor network**. It is maintained by
Mike Tigas, was the first Tor-capable browser on the App Store, and
ships under MPL-2.0. The project is older than the modern iOS
WebKit-era app ecosystem and has stayed alive largely because Apple
has not removed it.

## Why it matters

- **Tor on a stock iPhone without jailbreaking.** OnionBrowser's
  stack is WebKit 2 + Tor's pluggable transport. The web view is
  iOS's stock WKWebView; the network path is a Tor circuit
  bootstrapped at launch and rotated on a configurable interval.
  - Bridges (obfs4, Snowflake, meek-azure) are first-class options
    in settings for users in regimes that block the public Tor
    network.
- **Privacy discipline that has lasted a decade.** OnionBrowser has
  been on the App Store since 2012. The app's privacy policy is
  short, the code is open, and the threat model is documented in
  the README. It does not pretend to be a private browser for
  *everything* — it is honest about what Tor provides and what it
  does not.
- **Different from a VPN.** A VPN trusts the VPN provider with
  traffic. Tor routes traffic through three independent relays.
  OnionBrowser is the iOS option for users who want the latter.

## How it works

The app is a UIWebView / WKWebView wrapper around a Tor daemon
(the project uses `Tor.framework` plus pluggable transports). The
Tor process is started as a launchd-managed local service, the
HTTP and HTTPS proxy settings are pointed at it, and the web view
makes connections through the proxy. The bridge configuration is
exposed in the settings UI. New Identity picks a fresh Tor
circuit; the threat model is documented in the in-app help.

## Caveats

- **Not a magic cloak.** Tor protects against traffic analysis
  between the client and the destination at the network layer. It
  does not protect against browser fingerprinting, cookies, or
  account-level deanonymization. The app's own documentation is
  clear about this.
- **iOS WebKit is the only rendering engine available without
  shipping a separate browser engine.** This is an Apple platform
  constraint, not a project choice.
- **App Store policy risk.** Apple has been clearer about Tor
  than some adjacent categories, but the App Store rule on
  "private APIs" or background networking could still shift.
  Sideloading is not realistic for the average user; the App Store
  distribution is the load-bearing one.

## Deployment notes

Install from the App Store. The project is MPL-2.0, so a fork is
permissible but the App Store connection still requires the
review. Source: <https://github.com/OnionBrowser/OnionBrowser>.

**Integration tip:** in a privacy-focused directory, OnionBrowser
is the iOS counterpart to Brave / Tor Browser on desktop. Pair it
with **Berty** when the conversation is about transport privacy
and with **Notesnook** when the conversation is about content
privacy.
