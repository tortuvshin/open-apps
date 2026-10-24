---
name: "AppDuo"
repoUrl: https://github.com/tamia6/AppDuo
category: tools
stack: macos
description: "Native macOS app cloner with separate data directories and custom names and icons for work and personal accounts."
sourceDescription: "Free, open-source macOS app cloner with custom icons, names and separate data. Hard-clone process names support routing with compatible proxy clients."
platforms:
  - macos
tags:
  - app-cloner
  - macos
  - mihomo
  - multi-account
  - open-source
  - productivity
  - swift
  - swiftui
links:
  website: https://tamia6.github.io/AppDuo/
whyListed:
  - "Provides a native SwiftUI workflow for creating and managing separate app instances."
  - "Its Swift engine, CLI and app-specific recipes are useful examples of macOS bundle and process handling."
caveats:
  - "Requires macOS 14 or later."
  - "Compatibility depends on the target app and its version; clone creation does not guarantee every login or notification works."
addedAt: 2026-10-24
submittedBy: tamia6
licenses:
  - gpl-3.0
seo:
  title: "AppDuo – Open Source macOS App Cloner"
  description: "Native macOS app cloner with separate data directories and custom names and icons."
---

## Why it is worth using or studying

AppDuo addresses the practical problem of keeping work and personal accounts in separate macOS app instances. Custom names and icons make the instances easier to distinguish, and clone updates can preserve the associated data and configuration.

For developers, the repository provides a Swift/SwiftUI interface, a Swift cloning engine and CLI, and application-specific recipes. These offer concrete examples of managing app bundles, launch environments and version-dependent compatibility.

It requires macOS 14 or later. Support should be evaluated against the exact target application version; creating a clone is not evidence that every login, notification or isolation behavior works. This is a maintainer submission based on the documented implementation, not an independent compatibility certification.
