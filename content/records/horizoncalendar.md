---
name: HorizonCalendar
repoUrl: https://github.com/airbnb/HorizonCalendar
projectType: real-app
category: productivity
stack: ios
summary: Airbnb's declarative iOS calendar UI library — a data-driven rendering model where a single
  `CalendarViewContent` value type drives month and week views through provider closures, with a
  custom (non-`UICollectionView`) layout that keeps memory flat at ~100k years of dates — beautiful
  and architecturally influential, but now in maintenance mode after Airbnb scaled back its
  open-source iOS work.
description: HorizonCalendar is Airbnb's declarative, performant iOS calendar UI framework that
  renders month and week views from a single content value type, scaling from simple date pickers up
  to fully featured calendar apps on virtually infinite date ranges.
sourceDescription: A declarative, performant, iOS calendar UI component that supports use cases
  ranging from simple date pickers all the way up to fully-featured calendar apps.
platforms:
  - ios
licenses:
  - apache-2.0
links:
  github: https://github.com/airbnb/HorizonCalendar
distribution:
  channels: []
tags:
  - swift
  - native
bestFor: []
whyListed:
  - Top entry from dkhamsing/open-source-ios-apps curated list (3,136 stars on GitHub).
caveats: []
seo:
  title: HorizonCalendar – Open Source iOS Calendar UI Library
addedAt: 2026-06-13
source:
  type: import
  provider: github
  owner: airbnb
  repo: HorizonCalendar
  url: https://github.com/airbnb/HorizonCalendar
curation:
  reviewed: false
  reviewedAt: 2026-06-13T03:31:57+08:00
  labels:
    - mature
    - hot
  lenses:
    - good-to-learn
visibility: keep
---
HorizonCalendar is Airbnb's declarative iOS calendar UI library — a
`UIView` subclass whose visible state is a pure function of a single
`CalendarViewContent` value type, much like a SwiftUI view is a
function of its state. It renders month and week layouts, supports
single-day and multi-day range selection, and was built to power
every date picker and full-screen calendar inside the Airbnb iOS
app.

## Why it matters

- **Pioneered the declarative calendar pattern on iOS.** Where most
  date pickers of its era were imperative
  (`UICollectionViewDataSource` plus ad-hoc layout code),
  HorizonCalendar inverted the model: you describe *what* the
  calendar should show by composing `CalendarViewContent` and its
  provider closures, and the view diffs and animates to match.
  That same shape — single value type, render-as-pure-function — is
  the same conceptual move SwiftUI made for view trees in general,
  and HorizonCalendar got there first for calendars specifically.
- **Scales to virtually infinite date ranges.** The library is
  documented to cover roughly 100,000 years of dates with constant
  memory and scroll performance. That comes from a custom layout
  engine (not `UICollectionView`) that lays out only what is
  visible, anchors new frames to previously laid-out items, and
  gives its internal `UIScrollView` a very large content size with
  content insets aligned to the boundary month as you approach the
  ends.
- **Airbnb origin, now in maintenance mode.** HorizonCalendar
  shipped out of Airbnb's mobile team and was maintained for years
  by Bryan Keller and Bryn Bodayle. The last meaningful release was
  v2.0.0 in late 2023; commits since then are mostly CI and
  compatibility fixes (iOS 26 hit-testing, accessibility crash
  guard). Airbnb has publicly scaled back its open-source iOS work,
  so adopt cautiously for new production code.

## How it works

The model/view split is the load-bearing idea. `CalendarView` is a
`UIView` subclass (not a `UIViewController` and not built on
`UICollectionView`); its only job is to take a `CalendarViewContent`
and turn it into visible, scrollable months or weeks. You update the
view by calling `setContent(_:)` or the `animated:` variant — there
is no `reloadData`, no data-source protocol.

`CalendarViewContent` is a value type that bundles the date range,
the layout direction (`.vertical` or `.horizontal`), the calendar,
and a set of provider closures:

- `dayItemProvider` returns a `CalendarItem` for each individual day.
- `dayRangeItemProvider` returns a different `CalendarItem` for a
  day that belongs to a selected range.
- `monthHeaderItemProvider`, `dayOfWeekItemProvider`,
  `monthBackgroundItemProvider`, `overlayItemProvider` round out the
  hookable slots.

A `CalendarItem` is a model-and-view pair: it conforms to
`CalendarItemViewRepresentable`, which requires an
`InvariantViewProperties` type (set once per view, e.g. font and
color) and a `Content` type (the per-date payload), plus
`static makeView(withInvariantViewProperties:)` and
`static setContent(_:on:)`. The view pool reuses views by type and
hash of the invariant properties, then calls `setContent` to refresh
the per-day payload. SwiftUI views skip the boilerplate via
`.calendarItemModel`.

Layout is incremental and anchored. On each layout pass,
`VisibleItemsProvider` walks outward from a known visible item
using a `LayoutItemTypeEnumerator` and asks a `FrameProvider` for
each frame, short-circuiting with known offsets (e.g. a day's frame
is the previous day's frame plus its width). `ItemViewReuseManager`
diffs the new `Set<VisibleItem>` against the previous set, decides
which views to reuse, and the view calls `setContent` on each. The
internal scroll view is given a very large content size; when the
first or last month approaches a boundary, content insets are
re-aligned to make those edges feel natural.

Multi-day range selection uses a long-press-then-pan gesture.
`multiDaySelectionLongPressGestureRecognizer` starts the
interaction, `multiDaySelectionPanGestureRecognizer` fires the
`multiDaySelectionDragHandler` callback with each day crossed, and
a `CADisplayLink` auto-scrolls when the drag approaches a viewport
edge so more days can be selected. The library deliberately does
*not* own the selection state — your handler converts the
`DayComponents` into your model, regenerates `CalendarViewContent`
with `dayRangeItemProvider` set for the chosen range, and calls
`setContent` to reflect it visually.

## Caveats

- **Maintenance status.** Last meaningful release was v2.0.0 in
  December 2023; commits since then are sparse compatibility work.
  For a long-lived production app, treat it as a stable-but-frozen
  dependency: pin to a known version, vendor a fork if you need to
  patch iOS 26+ regressions, and budget for the possibility that
  no one will land your PR.
- **API has been stable since v1.0.** The provider-closure model
  has not been broken by the v2 release, so code written against
  the original docs still compiles, but the `UIKit` core is the
  API — there is no first-class SwiftUI `CalendarView` you can
  drop into a SwiftUI hierarchy the way you would a `List`. The
  `CalendarViewRepresentable` shim works but is a thin wrapper.
- **DisplayLink-driven animations break some accessibility tests.**
  The library uses `CADisplayLink` for its auto-scroll-while-dragging
  animation; that path can crash under UI test runners. Set the
  environment variable `HORIZON_CALENDAR_DISABLE_DISPLAY_LINK=true`
  to short-circuit it during automated UI tests.

## Deployment notes

Add the package via Swift Package Manager:

```swift
.package(
  name: "HorizonCalendar",
  url: "https://github.com/airbnb/HorizonCalendar.git",
  from: "1.0.0"
)
```

CocoaPods (`pod 'HorizonCalendar'`) and Carthage
(`github "airbnb/HorizonCalendar"`) are still documented in the
README for projects on those managers, but SPM is the path the
maintainers point new users at. The deployment target is
**iOS 11.0+**, Swift 5+, Xcode 10.2+ — old enough that you can drop
it into a long-supported app without raising your minimum.

For a working playground, clone the repo and open
`Example/HorizonCalendarExample.xcworkspace` (not the
`.xcodeproj`). The example covers single-day selection, day-range
selection, selected-day tooltips, and scroll-to-day-with-animation,
in both vertical and horizontal layouts. The SwiftUI path lives
alongside the UIKit demos in the same workspace.

**Integration tip:** even if you do not ship HorizonCalendar to
production, the repo is one of the cleanest public examples of the
"view is a pure function of a content value type" pattern in UIKit.
Read `Sources/Public/CalendarView.swift` and `Docs/TECHNICAL_DETAILS.md`
before you design your own data-driven UIKit component — the
visible-item / frame-provider / view-reuse split generalizes well
beyond calendars.
