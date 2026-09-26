---
name: AudioKit
repoUrl: https://github.com/AudioKit/AudioKit
projectType: real-app
category: media
stack: ios
summary: A Swift-first audio framework for Apple platforms that pairs an AVFoundation-backed node
  graph with a C++/Objective-C++ DSP engine (AudioKitEX/CAudioKitEX) and a constellation of
  extension packages — SoundpipeAudioKit for oscillators and filters, DunneAudioKit for samplers,
  STKAudioKit for physical models — so apps get a high-level Swift API without losing access to the
  real-time C layer.
description: AudioKit is a Swift audio synthesis, processing, and analysis framework for iOS, macOS,
  tvOS, and visionOS that wraps AVFoundation and a C-backed DSP engine.
sourceDescription: Audio synthesis, processing, & analysis platform for iOS, macOS and tvOS.
platforms:
  - ios
licenses:
  - mit
links:
  github: https://github.com/AudioKit/AudioKit
distribution:
  channels: []
tags:
  - swift
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (11,379 stars on GitHub).
caveats: []
seo:
  title: AudioKit – Open Source Audio Synthesis Framework for iOS
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: AudioKit
  repo: AudioKit
  url: https://github.com/AudioKit/AudioKit
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:31:57+08:00
  labels:
    - mature
    - hot
  lenses: []
visibility: keep
---
AudioKit is an open-source Swift audio framework for Apple platforms that
combines a high-level node graph on top of AVFoundation with a C-backed
DSP engine. It is the default choice for anyone shipping synths,
samplers, guitar-amp sims, or analysis tools to the App Store without
writing a custom audio pipeline.

## Why it matters

- **Two layers, one package.** The Swift module wraps `AVAudioEngine`
  and `AVAudioNode` with a node/connection graph you can reason about
  in Swift, while `AudioKitEX` / `CAudioKitEX` add the real-time DSP
  kernels in Objective-C++ so audio work happens off the main thread
  and away from the garbage-collected heap. You write nodes in Swift;
  the per-sample loops are C++.
- **Compared to lower-level alternatives.** `STK` (Synthesis ToolKit)
  and Maximilian are great C++ DSP libraries, but you bring your own
  host, host-side node graph, MIDI plumbing, and AU wrapper. JUCE
  is the closest peer: cross-platform, C++, with its own IDE and
  licensing model. AudioKit's bet is "Swift on Apple, with the C++
  tucked underneath" — you keep Xcode, SwiftUI, and the App Store,
  but the audio thread is still native code.
- **What ships with it.** A built-in `Mixer` and `MatrixMixer`,
  oscillators (`MorphingOscillator`, `FMOscillator`,
  `PhaseDistortionOscillator`, `DynamicOscillator` from the
  Soundpipe extension), filters (`MoogLadderFilter`,
  `ResonantFilter`, plus standard `BandPass`/`HighPass`/`LowPass`),
  `CostelloReverb`, `Delay`, `Distortion`, `DynamicsProcessor`,
  a `MIDISampler` and `MIDIPlayer`, an `AppleSequencer` that plays
  Standard MIDI Files, and analysis taps for amplitude and FFT.
- **Apps you can build.** Standalone synths, drum machines,
  audio effects AUv3 plug-ins, pitch trackers, tuners, MIDI
  utilities, generative-music playgrounds, and music-education apps.

## How it works

The repo is organized as a monorepo with three layers. The top-level
`Sources/AudioKit` package is the Swift-only shell: it defines the
`Node` protocol (every effect, generator, mixer, and player conforms
to it), an `AudioEngine` that wraps `AVAudioEngine`, MIDI input
handling in `Sources/AudioKit/MIDI`, the `AppleSequencer` in
`Sources/AudioKit/Sequencing`, file I/O helpers, and analysis taps
(`AmplitudeTap`, `FFTTap`, `RawDataTap`, `NodeRecorder`) under
`Sources/AudioKit/Taps`. A small `@Parameter` property wrapper
declares automatable parameters; the engine takes care of routing
control changes through the AU parameter tree.

The DSP engine lives in the companion `AudioKitEX` package, in the
`Sources/CAudioKitEX` Objective-C++ target. A typical node is tiny:
`GainDSP.mm` is roughly twenty lines — a struct derived from
`DSPBase`, a `ParameterRamper` for click-free gain changes, and a
`process(FrameRange)` loop that multiplies each input sample by the
ramped gain. More interesting kernels (oscillators, the Moog ladder
filter, the Costello reverb, the FDN reverb) live in companion
packages: `SoundpipeAudioKit` brings in the bulk of the classic
oscillator and filter catalogue, `DunneAudioKit` adds the sampler
and modulation effects, and `STKAudioKit` ports the Synthesis
ToolKit physical models (clarinet, flute, bowed string, etc.). Each
companion wraps its C/C++ kernel as an `AudioUnit` (`AK_REGISTER_DSP`)
that AudioKit's `AudioEngine` can attach like any other node.

MIDI is first-class. `MIDIInstrument` in the Swift module is an
`open class` that conforms to `Node`, `MIDIListener`, and
`NamedNode`; it owns an `AVAudioNode`, calls
`MIDIDestinationCreateWithBlock` to subscribe to incoming packets,
and translates them into note-on / note-off calls on its subclasses.
`MIDISampler` and `MIDIPlayer` build on top of it, and the
`AppleSequencer` schedules MIDI files against the same clock.

## Caveats

- **API surface is huge and moves between majors.** AudioKit 5 was
  a near-total rewrite from AudioKit 4; the Cookbook repo explicitly
  notes that "most of the examples that were inside of AudioKit are
  now in this single iOS / macOS Catalyst application" and "will
  continue to evolve as AudioKit does." Code from an older version
  rarely ports without manual changes.
- **Audio-thread safety rules apply.** Any Swift work that touches
  DSP parameters must go through `ParameterRamper` or the AU
  parameter address system; allocating, locking, or logging on the
  audio thread is a fast path to glitches. The framework enforces
  most of this, but custom DSP subclasses inherit the responsibility.
- **Test on real hardware.** The Simulator's audio path is not
  representative — sample-accurate scheduling, MIDI latency, and
  AUv3 host behavior only show up on a physical iPhone, iPad, or
  Mac. Headless tests use `engine.startTest()` / `render()` to
  generate buffers offline, but final tuning needs a device.

## Deployment notes

Add the framework via Swift Package Manager (the README points users
at the official Package Collection URL — `File > Add Package
Dependencies… > Add Package Collection…` with
`https://swiftpackageindex.com/AudioKit/collection.json`) so Xcode
can resolve AudioKit, AudioKitEX, and any of the extension packages
together. The collection catalog also exposes AudioKitUI (controls
and visualization), the Cookbook recipes, and the standalone
components like `Keyboard`, `Waveform`, `PianoRoll`, and `Tonic`
(music theory). The legacy CocoaPods badge still appears on the
README for projects that haven't migrated, and Carthage is
documented in older guides, but new installs should use SPM.

For an example app, clone `AudioKit/Cookbook` next to the framework:
each recipe is a single Swift file with a `Conductor` (signal-flow
setup), `Data` (state), and SwiftUI `View`, which is the fastest way
to see a working oscillator, sampler, or MIDI file player.

**Integration tip:** if you build an iOS music or audio utility, pull
in `AudioKit` plus exactly one extension package
(`SoundpipeAudioKit` for oscillators and filters,
`DunneAudioKit` for a sampler, `STKAudioKit` for physical models)
rather than the whole collection — each adds DSP weight and build
time, and most apps only need one family of nodes.
