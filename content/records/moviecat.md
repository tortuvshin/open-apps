---
name: MovieCat
repoUrl: https://github.com/FredrikBorgstrom/moviecat
projectType: real-app
category: media
stack: flutter
summary: A desktop app that scans folders of movie and TV files, recognises each title from its file name and shows a poster library with IMDb ratings, summaries and your own ratings. It needs no account or API key, runs on macOS, Windows and Linux, and is built with Flutter.
description: Turns folders of movie and TV files into a poster library with ratings; no account needed.
platforms:
  - macos
  - windows
  - linux
  - desktop
licenses:
  - mit
links:
  github: https://github.com/FredrikBorgstrom/moviecat
  website: https://moviecat.org
  docs: https://github.com/FredrikBorgstrom/moviecat#readme
  download: https://github.com/FredrikBorgstrom/moviecat/releases/latest
distribution:
  channels:
    - type: app-store
      platform: macos
      label: Mac App Store
      url: https://apps.apple.com/app/moviecat/id6823929872
    - type: other
      platform: macos
      label: Homebrew cask (fredrikborgstrom/tap/moviecat)
      url: https://github.com/FredrikBorgstrom/homebrew-tap
    - type: other
      platform: windows
      label: Scoop bucket
      url: https://github.com/FredrikBorgstrom/moviecat/blob/main/bucket/moviecat.json
    - type: other
      platform: windows
      label: Chocolatey (choco install moviecat)
      url: https://community.chocolatey.org/packages/moviecat
    - type: snapcraft
      platform: linux
      label: Snap Store
      url: https://snapcraft.io/moviecat
    - type: github-releases
      label: macOS zip, Windows installer, AppImage and tar.gz
      url: https://github.com/FredrikBorgstrom/moviecat/releases/latest
tags:
  - desktop-app
  - cross-platform
  - movie-library
  - tv-shows
  - no-account
bestFor:
  - Browsing a folder or drive full of downloaded or ripped movies and series as a poster library
  - Finding what to watch next by IMDb rating, genre or your own rating, without running a media server
  - Studying a Flutter desktop app that ships to the Mac App Store, Homebrew, Scoop, Chocolatey and Snap from one codebase
whyListed:
  - Recognises messy release names (resolution, codec and group tags, S01E02 and 2x05 episodes, anime-style numbering, foreign titles) and falls back to folder names
  - Works with keyless public sources (IMDb search suggestions, Cinemeta and TVmaze), with an optional free TMDB key for obscure titles
  - A local app with no server to run, unlike Jellyfin, Plex or Kodi libraries; results are cached so rescans are instant
caveats:
  - Young project (first release 2026-10-16) with 1 star, listed as an exception to the 50-star guideline because it is a complete desktop app with releases in several stores and package managers
  - Most of the code, tests and packaging were written with Claude Code under the author's direction, as the README states
  - It catalogues and opens files in your default player; it does not play, stream or download video
  - Woke ratings come from WokeGauge, a site run by the same developer, and are only in release builds
  - The Mac App Store build is sandboxed, so it cannot search drives automatically; you add folders by hand
seo:
  title: "MovieCat – Open Source Movie and TV Library Built with Flutter"
  description: MovieCat is a free, open-source desktop app for macOS, Windows and Linux that turns folders of movie and TV files into a poster library with IMDb ratings. MIT licensed.
addedAt: 2026-11-24
submittedBy: FredrikBorgstrom
---

MovieCat is a desktop app for people who keep movies and TV episodes as files. You point it at one or more folders, or let it search your home folder and external drives, and it scans them recursively for video files. Each title is recognised from its file name: release-style names with resolution, codec and group tags, TV episodes written as S01E02 or 2x05, anime-style numbering, foreign titles and plain folder names. The result is a poster grid with the IMDb rating, year and a short summary, plus filters for movies, TV and unrecognised files, search and sorting. The detail view shows genres, runtime, your own 1–10 rating, the files with play and show-in-folder buttons, and a link to IMDb; Fix match lets you pick the right title when a guess is wrong, and the choice is remembered. Metadata comes from keyless public sources (IMDb search suggestions, Stremio's Cinemeta and TVmaze), so no account or API key is needed; a free TMDB key is optional. Version 1.2.0 also shows woke ratings from WokeGauge, the developer's own sister site. The code is MIT-licensed Flutter for macOS, Windows and Linux, with CI that runs the parser tests and builds signed update feeds for direct downloads. Reviewed against the repository and release v1.2.0 on 2026-11-24.
