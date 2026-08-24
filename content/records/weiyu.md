# Weiyu

Weiyu is a Windows desktop app for people who receive useful information in WeChat but do not want to lose it in the chat list. It reads supported local message data, stores normalized messages in SQLite, and builds date-based briefings that can be traced back to source messages.

## What it includes

- Searchable daily and weekly archives across readable conversations.
- Rules for filtering by keyword, regular expression, chat, sender, message type, time, and timezone.
- Optional speech-to-text for turning voice messages into searchable text.
- AI-assisted analysis for themes, follow-ups, time windows, and risk prompts, with links back to the source message IDs.
- A Codex plugin for local status checks, message audits, reply previews, and explicitly confirmed test sends.
- A Windows installer and a portable package in the v0.1.4 release.

## Why it is useful

WeChat is good at collecting information and bad at helping you find it later. Weiyu is aimed at the gap between a chat client and a notes app: it keeps the original context, adds a dated archive, and gives you a short briefing without turning the data into an opaque export.

## Data and caveats

The default v0.1.4 workflow is read-only. Messages, task state, and evidence IDs are stored locally. AI analysis uses the provider configured by the user, so the privacy characteristics of that provider still apply. The project targets Windows and currently focuses on supported local WeChat data sources.

MIT-licensed. Downloads are available from the [GitHub Releases page](https://github.com/Sutera-Diffusus/WeChat-daily/releases).
