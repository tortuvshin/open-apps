# Mise

Mise is a restaurant system that runs on a single Mac inside the venue. It covers the till on the floor, a kitchen display on the pass, QR table ordering for guests, and a back office for the menu and the numbers — with no cloud service in the path.

## What the codebase includes

- A Flutter macOS client for the till, the kitchen display, and the back office, sharing one design language and one data model.
- An embedded PocketBase server that owns the data and runs on the same machine, so the network boundary is the restaurant's own wi-fi.
- A guest-facing QR ordering surface that sends orders straight to the kitchen display.
- ESC/POS receipt printing to any network thermal printer, addressed by IP rather than a driver.
- Shift handling with a counted opening float and a counted closing drawer, and reporting broken down by item, by server, and by hour, with CSV export.

## Integrity rules worth reading

The interesting part of the project is what it refuses to do, and those refusals are enforced rather than advisory.

A bill total cannot be edited from a terminal. It is computed on the server from the line items, the configured tax, and the service charge, so a tampered client cannot change what a bill costs. A discount cannot exceed the bill it applies to, and money cannot be taken against a cancelled bill.

Orders snapshot the name and price of every item at the moment of sale, so repricing the menu today leaves yesterday's bills untouched. On the staffing side, the last owner account cannot be deleted or disabled, and a manager cannot reset an owner's PIN.

These are ordinary requirements in commercial point-of-sale software and are rarely visible in an open codebase, which is most of what makes this one useful to study.

## Data and privacy

All data lives in one folder on the machine that runs it. The project states there is no telemetry, no analytics, and no outbound reporting, backups are a folder copy, and uninstalling the app leaves the data in place.

## Caveats

macOS is the only packaged target today. Windows and Linux build from the same source but are not published as binaries.

Builds are unsigned, so the first launch requires right-click then Open. The project is explicit that it does not pay for an Apple Developer certificate, and points to building from source as the alternative.

Guest QR ordering is reachable over the venue's wi-fi only. Public online ordering would mean exposing the machine to the internet, which the project rules out deliberately rather than by omission.
