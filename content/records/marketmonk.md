---
name: MarketMonk
repoUrl: https://github.com/brandonp2412/MarketMonk
projectType: real-app
category: tools
stack: flutter
summary: MarketMonk is a focused desktop-and-mobile investing companion for people who want
  portfolio visibility without handing their trade history to a hosted service. It pairs quick
  ticker lookups with durable local records, broker CSV imports, and practical gain and allocation
  views.
description: A Flutter stock and portfolio tracker that combines Yahoo Finance market data,
  interactive charts, local trade records, and multiple account support.
sourceDescription: Graph stocks on any platform  💹
licenses:
  - mit
links:
  github: https://github.com/brandonp2412/MarketMonk
tags:
  - flutter-app
  - portfolio-tracker
  - stock-portfolio
  - stock-tracker
seo:
  title: MarketMonk – Open Source Stock Portfolio Tracker
addedAt: 2026-08-11
source:
  type: github-topic
  owner: brandonp2412
  repo: marketmonk
  url: https://github.com/brandonp2412/MarketMonk
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
MarketMonk is a Flutter stock and portfolio tracker for following symbols, recording trades, and comparing investment performance across accounts. It uses Yahoo Finance data for prices and candles, while keeping the portfolio ledger in local SQLite storage rather than requiring a hosted account.

## Why it matters

- **A real ledger, not just a watchlist.** The app records opens and closes with quantity, execution price, commission, trade date, and realized profit or loss. It derives positions, average cost, cost basis, current value, gain, and allocation from those trades, so the portfolio view reflects transaction history.
- **Useful market views.** Charts support 5-day through 10-year periods, searchable ticker selection, favorites, refresh, currency display, and a weekend market-closed indicator. Portfolio charts can show multiple accounts as separate lines, while the portfolio page combines holdings into an allocation pie chart and filterable legend.
- **Portable broker data.** Built-in CSV parsers handle Tiger Brokers activity statements and Interactive Brokers Flex Query or activity statements. The import code understands quoted fields, escaped quotes, embedded newlines, BOMs, stock-only rows, and buy/sell direction, making migration from a broker export practical.

## How it works

The `lib/main.dart` entry point initializes Flutter, loads `SettingsState`, and hydrates an `AccountManager` before mounting the app. The home screen is a kept-alive `PageView` with Charts, Portfolio, and Holdings tabs plus a floating bottom navigation control. Material 3 themes can use device dynamic colors or a user-selected seed; pure-black dark mode is also available.

Drift manages a SQLite database containing `Trades` and `Candles`, stored in the platform application-support directory. Each non-default account gets a named database such as `market-monk-<account>.sqlite`; switching accounts closes the current connection, opens the new file, and clears price-sync caches. On refresh or resume, MarketMonk fetches Yahoo Finance candles and latest prices in the background while Drift streams local changes into the UI. The chart layer resamples longer ranges and uses `fl_chart` through the `TickerLine` widget.

## Caveats

- **Market data is an external dependency.** Yahoo Finance requests can be unavailable, delayed, or incomplete, and the repository does not present MarketMonk as a trading or execution platform.
- **Local data needs care.** Account databases live on the device, so users should use the CSV export/share flow for backups or transfers. Renaming and deleting accounts manipulate SQLite files, and the default account cannot be deleted.
- **Importer coverage is deliberately narrow.** The CSV workflow targets the two documented broker formats; other exports may require transformation before import, and Interactive Brokers realized P/L is filled as zero at execution.

## Deployment notes

The repository is a conventional Flutter project with Android, iOS, Linux, macOS, web, and Windows targets, plus Google Play, F-Droid, and Microsoft Store distribution references. For development, install Flutter and follow the Drift migration workflow when changing `lib/tables.dart`: bump `schemaVersion` in `lib/database.dart`, generate migrations with `dart run drift_dev make-migrations`, add the migration step, and run `dart run build_runner build -d`. The project is MIT-licensed.
