---
name: Oh My Android
repoUrl: https://github.com/ateymoori/oh-my-android
category: developer-tools
stack: ios
description: Native macOS control panel for the Android Emulator and phones over adb, with a built-in MCP server for AI coding agents.
platforms:
  - macos
tags:
  - android
  - android-emulator
  - adb
  - mcp
  - accessibility
addedAt: 2026-09-29
submittedBy: ateymoori
---

## Why it's listed

Oh My Android is a SwiftUI menu-style panel that replaces common `adb`
commands with one click: dark mode, font scale, RTL and pseudo-locales,
TalkBack, network throttling, GPS mock, screenshots and screen recording.
It works with Android Studio closed and with real phones over adb.

It also has a Layout Inspector that reports sizes in dp for any app, a
TalkBack order audit, and a SharedPreferences / SQLite viewer. A built-in
stdio MCP server lets Claude Code, Codex, Cursor or VS Code see and drive
the emulator.

MIT licensed, signed and notarized. Install with
`brew install --cask ateymoori/tap/oh-my-android` or the DMG on the
releases page. Needs macOS 26 or later.
