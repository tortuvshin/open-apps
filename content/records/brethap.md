---
name: brethap
repoUrl: https://github.com/jithware/brethap
projectType: real-app
category: tools
stack: flutter
summary: A single Flutter codebase ships the breathing-paced meditation timer to Android, the web,
  and a separate Wear OS build, with a central 100 ms `Timer.periodic` loop that synchronises tone
  playback, vibration, and an expanding-and-contracting visual circle to the inhale-hold-inhale /
  exhale-hold-exhale phases. Sessions land in a Hive box and surface through list, calendar, and
  monthly-stats views that double as the practice log.
description: Brethap is a Flutter meditation app that pairs a session timer with configurable
  six-phase breathing patterns, four selectable audio tones, per-phase vibration, and optional
  text-to-speech cues, persisting every completed session in a local Hive store.
sourceDescription: Brethap — a meditation / breathing-pacing app
licenses:
  - gpl-3.0
links:
  github: https://github.com/jithware/brethap
tags: []
seo:
  title: Brethap – Open Source Breathing & Meditation Timer
addedAt: 2026-08-11
source:
  type: github-topic
  owner: jithware
  repo: brethap
  url: https://github.com/jithware/brethap
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
Brethap is a meditation timer built in Flutter that layers a fully
configurable six-phase breathing pattern on top of a stopwatch-style
session. Every completed session is persisted locally, so the same
app doubles as a practice journal surfaced through list, calendar,
and stats views. The maintainer calls it a "yama" — a minimalist,
distraction-free sit.

## Why it matters

- **Breath pacing as a first-class primitive.** Each cycle is broken
  into inhale, inhale-hold, inhale-tail, exhale, exhale-hold, and
  exhale-tail, every phase independently adjustable in 0.1-second
  increments. The six-tenths-of-a-second granularity is unusual for
  a free app and is what makes presets like 4-7-8 or physiological
  sigh feel right rather than approximate.
- **Multi-channel cues stay in sync.** A single `Timer.periodic`
  loop ticks every 100 ms and fires phase transitions that drive
  audio tone playback (`audioplayers`), per-phase vibration
  (`vibration`), optional text-to-speech announcements (`flutter_tts`),
  and an expanding-and-contracting central circle. The visual
  diameter is scaled from the configured inhale/exhale durations so
  the UI breathes in real time with the user.
- **Offline-first practice log.** Sessions are stored in a Hive
  box, viewable as a list or a `table_calendar`-backed monthly
  calendar with weekly filtering and per-month totals. A CSV
  exporter is wired up through the `csv` package for users who
  want to analyse their sits elsewhere.
- **Wear OS build.** A separate, slimmed-down watch app ships
  from the same project, letting a user start a session from the
  wrist without pulling out a phone.

## How it works

The Flutter app is structured around three persisted boxes. A
`Preference` Hive type stores inhale, exhale, audio index, vibration,
TTS, and duration fields; a `Session` type stores completed sit
records with start/end timestamps, breath count, and an optional
description. The home widget loads the active preference on init,
probes device capabilities (`vibration` support, `wakelock_plus`,
`audioplayers` initialisation, optional `watch_connectivity`), and
then drives the cycle counter from the 100 ms periodic timer.

When the user starts a session, the floating action button switches
to a stop icon and the timer loop begins. Phase boundaries are
calculated by summing the configured inhale/exhale array slots in
milliseconds; each transition fires `_onInhale`/`_onExhale` and the
hold variants in parallel. Audio cues are four short tones bundled
in the `audio/` asset directory, picked from per-phase dropdowns and
previewable from the preferences screen. Vibration patterns can be
tuned for session-end feedback and per-breath taps independently.
Text-to-speech optionally announces phase changes and remaining
session time.

On completion, the widget stamps a `Session` record, calls
`addSession` to persist it, fires a final haptic and audio cue, and
disables the wake lock. The preferences screen offers five numbered
preset slots — long-press to save the current configuration, short
press to load — and a menu of built-in patterns that includes 4-7-8,
Box, and physiological sigh. Landscape orientation widens the
sliders for finer adjustments.

The codebase is small and focused: a single `main.dart`, the
`home_widget.dart` driving the live session, plus
`sessions_widget.dart`, `sessions_calendar_widget.dart`,
`preferences_widget.dart`, and a Hive-backed `wear.dart` for the
companion watch face. The project pins its Flutter version via
`.fvmrc`, uses Fastlane + GitHub Actions for CI, and supports
localisation through `l10n.yaml`.

## Caveats

- **No native iOS / macOS release.** The project ships Android, web,
  and Wear OS builds. iOS and macOS users currently have to run the
  reduced-feature web build — there is no official native build for
  Apple platforms.
- **GPL-3.0 license.** All derivative works must remain open source
  under the same terms, which rules out a closed fork or a paid App
  Store port without releasing the source.
- **Single-user, on-device data.** Sessions live in a local Hive
  store with no built-in cloud sync or multi-device migration.
  Exporting to CSV is the only way to move history off-device.
- **TTS quality depends on the platform TTS engine.** The optional
  breath and duration announcements rely on whatever the OS provides,
  which can be inconsistent across devices and locales.

## Deployment notes

```bash
# Build for Android (Google Play / F-Droid release path)
git clone https://github.com/jithware/brethap.git
cd brethap
fvm install            # honours .fvmrc
flutter pub get
flutter build apk --release
flutter build appbundle --release
```

The repository also includes a `fastlane/` directory with the
metadata and signing configuration used for the F-Droid and Play
Store releases, and `.github/workflows` for CI on every push.
Web builds use the standard `flutter build web` flow, and the
companion Wear OS app lives in a separate path inside the same
repo, gated by the same Flutter toolchain.

**Minimum:** Android 6.0+ for the full feature set, including
`vibration` and `wakelock_plus`; the web build runs in any modern
browser but ships without vibration and with a reduced audio
selection. The Wear OS build requires Wear OS 3 or newer.

**Integration tip:** if you are cataloguing mindfulness apps,
Brethap is a strong "configurable pattern" reference — pair it with
a simpler breath-pacer that targets only one or two presets to show
the spectrum from fixed to fully programmable meditation timers.
