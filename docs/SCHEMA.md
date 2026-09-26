# Open Apps Record Schema

This document is the canonical reference for the structure and ownership of records in the Open Apps directory (`content/records/*.md`).

## Overview

Each app in the directory is one Markdown file, `content/records/<slug>.md`: the fields below as YAML frontmatter between two `---` lines, then the review notes rendered on the detail page. The file name is the slug. (Four apps, `onionbrowser`, `swiftterm`, `tura` and `utm`, are still `data/records/<slug>.yml` until #287 decides their notes files; the same fields apply.) Fields are grouped by **ownership**:

- **Human-curated** fields are edited directly by contributors and curators in pull requests
- **Automation-owned** fields are written by GitHub Actions (sync workflows) and should never be hand-edited

See the **Ownership** section below for the complete field-by-field breakdown.

## Field Reference

All fields are **optional** unless otherwise noted.

### App Identity
| Field | Type | Ownership | Description |
|-------|------|-----------|-------------|
| `kind` | enum: `project` | derived | Kind of record. Leave it out: Grove fills in `project` from the project-directory blueprint. |
| `name` | string | human | Display name of the app. |
| `slug` | string | derived | URL-safe identifier. Leave it out: it is the file name without `.md`. |
| `description` | string | human | One-sentence curator-written summary of what the app does. |
| `summary` | string | human | **NEW (0.5.0):** Editorial lead paragraph. When set, rendered as the first paragraph on the detail page; otherwise falls back to `description`. Allows curators to write a more expressive introduction distinct from the brief one-liner. |
| `sourceDescription` | string | human | **NEW (0.5.0):** Preserved original description, typically from the project's README or GitHub repository description. When present and distinct from `summary`, rendered as a secondary "From the project's README:" paragraph on the detail page. Mechanically backfilled from `github.repository.description` where available. |
| `seo.title` | string | human | The page's search title, written as `{Name} – Open Source {what it is}` (e.g. `Twenty – Open Source CRM & Salesforce Alternative`). Used verbatim as `<title>`, so keep it under 65 characters and unique. See *Search titles* in `CONTRIBUTING.md`. When missing, the page falls back to `{Name} – Open Source {Category} App Built with {Stack}`. |
| `seo.description` | string | human | Optional meta description override. Only needed when neither `summary` nor `description` reads well as a search snippet. |
| `category` | string | human | Single category ID (e.g., `tools`, `productivity`). Must exist in `data/taxonomy/categories.yml`. |
| `tags` | array of strings | human | Free-form tags/keywords (e.g., `["cross-platform", "offline-first"]`). Tag IDs should be curated against `data/taxonomy/topics.yml` to avoid spam. |
| `projectType` | string | human | Maturity indicator; typically `real-app` or `experiment`. |
| `difficulty` | string | human | Optional; how challenging the codebase is to learn from. |
| `codebaseSize` | string | human | Optional; e.g., `small`, `medium`, `large`. |
| `repoUrl` | string | human | GitHub repository URL (e.g., `https://github.com/immich-app/immich`). Required for GitHub metadata sync. |

### Technology & Distribution
| Field | Type | Ownership | Description |
|-------|------|-----------|-------------|
| `stack` | string | human | Primary development stack/language (e.g., `flutter`, `react-native`, `swiftui`). |
| `platforms` | array of strings | human | Target platforms (e.g., `["ios", "android", "web", "macos", "windows", "linux"]`). Must exist in `data/taxonomy/platforms.yml`. |
| `licenses` | array of strings | human | SPDX license IDs (e.g., `["MIT", "Apache-2.0"]`). Optional; `github` sync can populate from GitHub. |
| `links` | object | human | Additional project links: `{ github, website, docs, source }` (all URLs). |
| `distribution.channels` | array of objects | human | Where users can download/install. Each entry: `{ type (channel ID from data/taxonomy/distribution-channels.yml, e.g. "play-store"), url (required store/download URL), platform?, label?, verified?, notes? }`. |
| `content` | string | derived | Leave it out of a Markdown record: the notes are the file's own body. Only a YAML record uses it, to point at its notes file. |
| `screenshots` | array of objects | human | **NEW (0.5.0):** Curated screenshots for the detail page. Each entry: `{ src (URL), alt (string), source? (URL), width? (number), height? (number) }`. Currently optional/deferred; schema-ready but not yet populated in the catalog. |

### Curation & Context
| Field | Type | Ownership | Description |
|-------|------|-----------|-------------|
| `bestFor` | array of strings | human | What this app is best for (free-form, e.g., `["photo backup", "privacy"]`). |
| `whyListed` | array of strings | human | Why it belongs in this directory (free-form, e.g., `["good codebase", "well-documented"]`). |
| `caveats` | array of strings | human | Known limitations or things to be aware of. |
| `curation.reviewed` | boolean | human | Has a curator reviewed this record? |
| `curation.reviewedAt` | string (date) | human | When the review happened (ISO 8601). |
| `curation.reviewedBy` | string | human | Who reviewed it. |
| `curation.notes` | string | human | Free-form curation notes (internal documentation). |
| `curation.labels` | array of strings | human | Curator-assigned labels: `["hot", "mature", "featured", ...]`. |
| `curation.lenses` | array of strings | human | Lens IDs this app is good for (e.g., `["good-to-learn"]`). |
| `visibility` | string | human | `keep` (default) or `hide` (soft-exclude, e.g., for archived projects to review later). |

### Repository & Metadata (Automation-Owned)
| Field | Type | Ownership | Description |
|-------|------|-----------|-------------|
| `source` | object | human | Source tracking (how the record was created): `{ type, provider, owner, repo, url }`. e.g., `{ type: "import", provider: "github", owner: "immich-app", repo: "immich", url: "https://..." }`. |
| `github.repository` | object | automation | **Do not hand-edit.** Full GitHub API response for the repository. Includes `description`, `stargazers_count`, `forks_count`, `language`, `license`, `pushed_at`, `archived`, `disabled`, etc. Synced daily by `sync-github` GitHub Action. |
| `github.languages` | object | automation | **Do not hand-edit.** Language breakdown from GitHub API (e.g., `{ Dart: 500000, Kotlin: 250000 }`). |
| `github.latestRelease` | object | automation | **Do not hand-edit.** Info about the latest GitHub release (if any). |
| `github.activity` | object | automation | **Do not hand-edit.** Monthly commit counts and other activity metrics. |
| `github.files` | object | automation | **Do not hand-edit.** File existence checks (e.g., `{ "README.md": true, "CONTRIBUTING.md": false }`). |
| `github.labels` | array | automation | **Do not hand-edit.** Topic/label tags from GitHub's topics API. |
| `github.sync` | object | automation | **Do not hand-edit.** Metadata about when the sync happened. |

### Health & Quality
| Field | Type | Ownership | Description |
|-------|------|-----------|-------------|
| `health.status` | string | automation | **Do not hand-edit.** Record-level health status (e.g., `active`, `stale`, `archived`, `orphaned`). Computed from `github.pushed_at` and configured thresholds. |
| `health.maturity` | string | automation | **Do not hand-edit.** Maturity indicator (e.g., `beta`, `production`). |
| `health.tier` | string | automation | **Do not hand-edit.** Tier/category (e.g., `featured`, `learning`, `experimental`). |
| `health.visibility` | string | automation | **Do not hand-edit.** Internal visibility decision (may soft-exclude from some views). |
| `health.cleanupCandidate` | boolean | automation | **Do not hand-edit.** Flagged for potential removal (e.g., if archived/unmaintained). |
| `health.staleReason` | string | automation | **Do not hand-edit.** Why it's considered stale (if applicable). |
| `health.confidence` | number | automation | **Do not hand-edit.** Confidence score (0–1) of the health assessment. |
| `health.reasons` | array | automation | **Do not hand-edit.** Detailed reasons for the health assessment. |
| `scores` | object | human | Optional; curator-assigned quality/learning scores. |

## Ownership Table

### Human-Curated Sections
Edit these fields directly in pull requests:

- **app**: `kind`, `name`, `slug`, `description`, `summary`, `sourceDescription`, `category`, `tags`, `projectType`, `difficulty`, `codebaseSize`, `repoUrl`
- **stack**: `stack`, `platforms`, `licenses`, `links`, `distribution.channels`, `screenshots`
- **curation**: `bestFor`, `whyListed`, `caveats`, `reviewed`, `reviewedAt`, `reviewedBy`, `notes`, `labels`, `lenses`, `visibility`, `scores`
- **source**: Tracking metadata (populated at creation; rarely changed)

### Automation-Owned Sections
**Never hand-edit these** — they're overwritten by GitHub Actions:

- **github**: All sub-fields (`repository`, `languages`, `latestRelease`, `activity`, `files`, `labels`, `sync`)
- **health**: All sub-fields (`status`, `maturity`, `tier`, `visibility`, `cleanupCandidate`, `staleReason`, `confidence`, `reasons`)

## Taxonomy Reference

Tags, platforms, categories, and licenses in records must exist in the corresponding taxonomy files.

A stack or category term can carry its own search copy — `seoTitle` (`<title>`), `heading` (H1) and `description` (lede + meta description). Without them the page uses `Open Source {name} Apps`.

### Categories
Defined in `data/taxonomy/categories.yml`:
- `productivity`, `finance`, `education`, `tools`, `developer-tools`, `communication`, `health-and-fitness`, `business`, `games`, `media`, `entertainment`, `social-network`, `shopping`, `news-and-magazine`

### Stacks
Defined in `data/taxonomy/stacks.yml`:
- `flutter`, `react-native`, `ios`, `android`, `capacitor`, `kmp`, `tauri`, `swiftui`, `jetpack-compose`, and others

### Platforms
Defined in `data/taxonomy/platforms.yml`:
- `ios`, `android`, `web`, `macos`, `windows`, `linux`, `tvos`, `watchos`, and others

### Licenses
Defined in `data/taxonomy/licenses.yml`:
- `mit`, `apache-2.0`, `bsd-3-clause`, `gpl-3.0`, `gpl-2.0`, `lgpl-2.1`, `lgpl-3.0`, `mpl-2.0`, `isc`, `unlicense`, and others

### Topics (Tags)
Defined in `data/taxonomy/topics.yml`:
- Curated, free-form tag vocabulary to guide consistent tagging across records

## Example Record

Here is a real record, `content/records/immich.md` (notes shortened). Everything above the second `---` is human-owned frontmatter; the notes underneath render on the detail page.

```markdown
---
name: Immich
repoUrl: https://github.com/immich-app/immich
projectType: real-app
category: tools
stack: flutter
summary: A self-hosted photo and video backup service with first-class mobile apps and on-device
  machine learning.
description: Self-hosted photo and video backup solution directly from your mobile phone
sourceDescription: Self-hosted photo and video backup solution directly from your mobile phone
platforms:
  - android
  - ios
licenses:
  - agpl-3.0
links:
  github: https://github.com/immich-app/immich
distribution:
  channels: []
tags:
  - cross-platform
bestFor: []
whyListed: []
caveats: []
relations:
  - type: alternative-to
    to: google-photos
    evidence:
      type: repo-topic
      url: https://github.com/immich-app/immich
      quote: google-photos-alternative
      checkedAt: 2026-09-22
seo:
  title: Immich – Open Source Self-Hosted Photo & Video Backup
addedAt: 2026-06-07
source:
  type: import
  provider: github
  owner: immich-app
  repo: immich
  url: https://github.com/immich-app/immich
curation:
  reviewed: true
  reviewedAt: 2026-08-11
  labels:
    - mature
    - hot
  lenses: []
  reviewedBy: Open Apps curators
visibility: keep
---
Immich is a self-hosted photo and video backup service that runs on your own
hardware and ships native iOS and Android apps written in Flutter. …
```

GitHub metadata and health are automation-owned and never appear in the record. `grove sync github` writes them to `data/cache/github/immich.json`, and the build merges them in.

## Contributing Records

When submitting a new app or updating an existing one:

1. **Use the web form** at `/submit` to generate a draft from a GitHub URL, then save it as `content/records/<slug>.md` (see [CONTRIBUTING.md](../CONTRIBUTING.md#one-file-per-app))
2. **Review and refine**: adjust `description`, `bestFor`, `whyListed`, `caveats`, and `tags` as needed
3. **Respect ownership**: only edit human-curated fields (see **Ownership Table** above)
4. **Add evidence**: link issues or examples in `curation.notes` that justify inclusion
5. **Open a pull request**: CI will validate schema, GitHub sync will populate automation fields

For detailed submission guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Synchronization

### GitHub Metadata Sync
The `sync-github` GitHub Action runs daily and:
- Fetches current `repository`, `languages`, `latestRelease`, and `activity` data from the GitHub API
- Writes them to `data/cache/github/<slug>.json`; records are never touched
- Opens a pull request with changes for curator review

**Do not hand-edit `data/cache/github/`** — it is overwritten on the next sync run.

### Incremental Backfills
Certain fields (like `sourceDescription`) are backfilled mechanically from synced data:
- The `scripts/backfill-source-description.mjs` script copies `github.repository.description` to `sourceDescription` where unset
- Safe to re-run any time; skips records already populated

### Health & Cleanup
A separate workflow flags stale, archived, and orphaned projects for curator review. See `docs/stale-exclusion-2026-08-11.md` for the last sweep's notes.

## Schema Version & Changelog

Grove 0.5.0 added:
- `summary` (editorial lead paragraph)
- `sourceDescription` (GitHub README text)
- `screenshots` (gallery; schema-ready, currently deferred)

These fields are all **optional** and **backward-compatible** — records without them render correctly with fallbacks to existing fields.

Earlier versions of this catalog used different structures; see [CHANGELOG.md](../CHANGELOG.md) and the release notes for migration details if updating from older schemas.

---

**Last updated**: 2026-08-16 (Grove 0.5.0)  
**File structure**: `content/records/*.md` (frontmatter plus notes)  
**Validation**: `grove check` / `pnpm exec grove check`  
**For questions**: See [CONTRIBUTING.md](../CONTRIBUTING.md) or [README.md](../README.md)
