# Changelog

All notable changes to Open Apps are documented here.

## [Unreleased]

### Changed — Grove 0.6.1 → 0.8.0 (registry-first UI)

Grove v1 removed every UI export from `@grove-dev/astro`; the same components
now ship through a [shadcn registry](https://withgrove.dev/r/) that installs
into this repository. The `.astro` files under `src/` are ours outright, and
`grove update` reconciles upstream changes against our edits instead of a
package upgrade silently changing the site.

Every route survived: all 140 build outputs are byte-for-byte present, and a
page-by-page text diff against the pre-migration build shows nothing lost.
The visible markup changed because this is a real UI version bump.

- **Dependencies:** `@grove-dev/{astro,cli,core}` moved to `0.8.0`.
  `@grove-dev/registry` is deliberately *not* a dependency — the registry is
  served over HTTP and installs source, so there is nothing to install.
- **New project files:** `components.json` (points `@grove` at
  `https://withgrove.dev/r/{name}.json`) and `.grove/registry.lock.json`
  (what `grove update` diffs against).
- **`tsconfig.json`:** added the `@/*` → `src/*` path the registry's aliases
  assume, and `allowImportingTsExtensions` — registry components import
  `../lib/classnames.ts` by full path.
- **Installed into `src/`:** 34 components under `components/grove/`, 6 under
  `components/ui/`, 1 under `components/site/`, 4 layouts, 3 lib modules,
  `styles/system.css`, and 17 page routes.
- **Deleted `src/components/DirectoryBrowse.astro` and `TaxonomyList.astro`.**
  Both were stock template copies, now superseded by the registry's own
  `directory-browse.astro` and `taxonomy-list.astro`. Adopting the registry's
  browse page also brings the curated-views `SmartLensTabs` row.
- **Kept as local forks:** `src/pages/index.astro` (the two-lens homepage,
  derived here because `getHomePageModel`'s star-driven lenses echo each other
  on this directory) and `src/pages/submit.astro` +
  `src/components/SubmissionClient.astro` (store links, `sourceDescription`,
  the notes-file flow, and reporting every validation issue at once — none of
  which upstream covers yet). `grove update` classifies these as locally
  modified and will not overwrite them.
- **Re-applied over the upstream pages:** the 404 copy, the "open-source" in
  the taxonomy ledes, the `withgrove.dev` link on the about page, and
  `noindex={seo.noindex}` on record detail, which the upstream page does not
  forward.
- **`src/styles/global.css` no longer imports Tailwind.** `system.css` already
  does, and Tailwind v4 treats every file that imports it as its own entry
  point — so this emitted a second complete Tailwind build. Dropping it
  removes 36 KB of duplicate CSS from every page, leaving one 68 KB
  stylesheet with every utility still resolved.
- **API drift fixed:** `Hero` takes only `itemsLabel` (the `itemLabel` and
  `stats.originalRepo` props it never read are gone — the layout reads
  `originalRepo` from `site.stats` and `OriginalCollection` from `siteConfig`).

### Changed — Grove 0.5.4 → 0.6.0 port

Adopted the Grove 0.6.0 surface — every page model now exposes a `seo: PageSeo`
block, every page forwards `image`, `imageAlt`, and `jsonLd` to `BaseLayout`,
and the per-page OG image pipeline ships enabled so each record, collection,
and taxonomy page emits its own 1200×630 PNG instead of sharing the static
`/og-image.svg`.

- **Dependencies:** `@grove-dev/{astro,cli,core}` pinned to `0.6.0`.
- **`siteConfig` propagated to model functions.** `getCollectionIndexModel`,
  `getCollectionPageModel`, `getTaxonomyPageModel` now receive the site
  config so they can populate the `seo` block instead of returning a
  stripped-down model that forces the page to hand-roll titles/descriptions.
- **`seoTitle` + `titleCaseFirst` for paginated browse titles.** The browse
  page used to print `Browse apps — page 3 — Open Apps` on every paginated
  route; the new path uses `seoTitle(...)` and `titleCaseFirst(...)` so
  page-2+ titles fit the 65-char cap and pass through one helper that
  already serves the rest of the surface.
- **`getTaxonomyIndexSeo`** replaces the hand-rolled title/description on
  `/categories/` and `/stacks/`; both index pages now emit a `collectionSchema`
  ItemList with each entry as a `ListItem`, so the search-result page link
  graph matches what the visitor sees.
- **`/empty/` noindex.** The audit fixture page was the only static page
  without a `noindex`; now it does, matching `/submit/` and `/404/`.
- **CI parity:** new `audit` script (`pnpm audit`) and
  `.github/workflows/readme.yml` mirror the canonical example so the weekly
  README regen + Lighthouse gate are both wired through Grove's tools
  instead of bespoke shell scripts.
- **OG card generation is enabled by default.** `prepareDirectory` now
  writes `public/og/{home,default}.png`, `og/records/<slug>.png` (76 files),
  `og/collections/<slug>.png` (4 files), and one PNG per category, stack,
  and license from the existing taxonomy. The static `public/og-image.svg`
  is kept as the final fallback when the rasterizer can't load.

UI/UX polish that ships for free with the framework bump (zero consumer
changes):

- **TOC active state.** The pill background on the active TOC item is
  gone; a 2px left-rail accent + text-color emphasis reads as navigation.
- **Search `/` hint.** The shortcut hint now anchors `right-2` to match
  the clear button, and the input reserves `pr-10` so the placeholder
  extends up to the chip without pushing the layout.
- **Card / record-header logo `onerror` fallback** reveals the initials
  for any record whose GitHub owner URL is dead or renamed, instead of
  rendering the browser's broken-image glyph.
- **Disabled pagination contrast** is now WCAG-safe against the dark
  surface.

## Grove rebuild context (PR #212)

The directory was rebuilt as a consumer-owned Astro application powered by
Grove packages (see #212). The lines below record the rebuild so the
canary work in the next subsection can be read in context.

- Migrated 150 app records into the Grove schema under `data/records/` while
  preserving project identity, taxonomy, repository metadata, curation, and
  original added dates.
- Replaced repository-owned generation scripts with Grove CLI and Astro
  integration commands.
- Kept Open Apps pages, copy, analytics, assets, and Cloudflare deployment
  configuration in this repository so the product remains fully customizable.

### Changed — 0.5.0-next.0 canary adoption

- Adopted the Grove `0.5.0-next.0` canary (`@grove-dev/astro`, `cli`, and
  `core`) and rewrote the record detail page on the canary components
  (`RecordHeader`, `EditorialSummary`, `TableOfContents`, `MarkdownBody`,
  `RecordSidebar`). The detail page dropped from 527 lines to 87.
- Added the optional Grove config blocks that ship in `0.5.0`: an `audit`
  page manifest (so `pnpm exec grove audit` has something to hit against
  `127.0.0.1:4321`), a `readme` preamble (so `pnpm exec grove readme
  generate` can fill in the awesome-list section between
  `<!-- grove-readme:start/end -->` markers), and the `licenses` taxonomy
  (`data/taxonomy/licenses.yml`) wired into the `facets` list.
- Added `src/pages/licenses/[name].astro` and `src/pages/empty.astro`,
  plus a shared `src/components/TaxonomyList.astro` body used by all three
  taxonomy pages.
- Enriched 126 records with a top-level `licenses: [<spdx_id>]` field
  sourced from `github.repository.license.spdx_id`. The `licenses`
  facet is now exercised end-to-end: the MIT page lists 48 records,
  AGPL-3.0 lists 12, etc. A `noassertion` family was added to the
  licenses taxonomy so the 14 records whose GitHub license is
  `NOASSERTION` are surfaced under "Unknown / undetected" rather than
  dropping out of the facet.
- Added long-form `MarkdownBody` prose for five flagship records
  (immich, appflowy, joplin, cap, bluewallet) plus the `content:`
  field on each. Each body follows the same four-section structure
  (Why it matters / How it works / Caveats / Deployment notes) so
  the rendered `TableOfContents` and sidebar reading-metrics are
  consistent across records.
- Added the matching `categories/[name].astro` and `stacks/[name].astro`
  taxonomy pages, retargeted to the `apps` vocabulary and reusing the
  shared `TaxonomyList` body.
- Moved the about page prose to `content/pages/about.md` and wired
  the canary `getPageContentHtml("about")` resolver in `about.astro`.
  The hand-written breadcrumb, header, and CTA button row stay; only
  the four prose cards move into markdown.
- First real use of `pnpm exec grove readme generate` against this
  repository. The script injected an awesome-list section (150 records,
  16 categories) between the `<!-- grove-readme:start/end -->` markers
  without touching the hand-written intro or the Security / License
  tail. README grew from 220 to 448 lines.

### Fixed

- Recently added is now a sort across all records instead of a label filter.
- Trending, Established, Production-like, and Good to learn use explicit
  curation signals and no longer collapse the result list unexpectedly.
- Category, primary stack, platforms, and free-form tags remain separate
  discovery dimensions.

### Restored from the Grove rebuild

- Contributor data, repository statistics, the Tauri icon, legal
  documents, security reporting, and legacy collection provenance.

### Deferred

- The 24 records without a synced `github.repository.license` cannot be
  enriched automatically; their `licenses: []` field requires curator
  input (the license is on the README, not on the GitHub API).
- Only 5 of 150 records have a `content: ./content/records/<slug>.md`
  body. The MarkdownBody pipeline is wired and exercised; expanding the
  coverage is content work, not framework work.
- `pnpm exec grove audit` has its `grove.config.ts` manifest in place
  but has not been run against a live build yet — the manifest exists
  as a fixture that the next Lighthouse CI run will validate.

### Notes

- **Canary pin (intentional).** The `@grove-dev/*` dependencies in
  `package.json` are exact-pinned to `0.5.0-next.0` (not `^`). npm
  semver excludes pre-release versions from caret ranges by default,
  so a caret on a canary does not match. When the canary promotes to
  `latest` and ships as `0.5.0`, the follow-up bump is a deliberate
  single-line change. Do not "loosen" the pin in a drive-by edit —
  it is load-bearing for this branch.
- The 92-record stale cut from the 0.5.0-next.0 branch is documented
  in `docs/stale-exclusion-2026-08-11.md` for future sweeps to
  reference.

### Audit follow-up (2026-08-11)

Address every P0 trust-breaking issue and the higher-impact Phase 2-4
findings from the product / UX / SEO audit. Companion work landed in
the `grove` monorepo on the `audit/phase-1-trust-fixes` branch; this
branch (`feat/canary-v0.5-next.0`) consumes those canary changes.

**Phase 1 — Trust fixes:**
- `licenseDisplay(spdxId)` normalizes `NOASSERTION` / `NONE` /
  `OTHER` / `UNLICENSED` to "License not detected" / "Other" in
  every license render path (detail sidebar, browse cards,
  JSON-LD). 15 NOASSERTION records now show readable copy.
- Bot accounts filtered from the contributors sync + page; the
  page header reads "83 human contributors" instead of "85
  community contributors" (was including
  `github-actions[bot]` and `dependabot[bot]`).
- CHANGELOG and `public/og-image.svg` corrected from 149 to
  150; counts now match across every UI surface.
- Each curated collection has an auditable inclusion rule
  printed on the page (`selectionNote` with `Stack`, `Stars`,
  `Exclude`, `License` clauses). New `minStars` / `minForks`
  fields on `CollectionQuery`; the four collections now
  declare 80 / 95 / 80 / 53 records respectively, with real
  thresholds (was 80 / 80 / 80 / 80 before).
- 8 broken Markdown descriptions rewritten with complete
  sentences; `extractDescription` regex hardened so future
  imports do not re-introduce malformed links.
- 45 truncated descriptions (under 40 chars) expanded to
  complete sentences.
- Submit form gates the `Open PR draft` link behind validation:
  category / stack / platforms must come from the taxonomy,
  description must be >= 40 chars, slug must be unique.

**Phase 2 — Detail-page value:**
- New `summary` (Open Apps-written) and `sourceDescription`
  (original GitHub) fields on records; the detail page lead
  paragraph now renders `summary` and the secondary "From the
  project's README" block renders `sourceDescription`.
  Populated on the five flagship records that already had a
  content body.
- Detail pages now show "Also in: ..." with links to every
  curated collection the record belongs to (via
  `findCollectionsFor`).
- Five flagship records marked as curator-reviewed
  (`curation.reviewed: true`, `reviewedBy: "Open Apps curators"`,
  `reviewedAt: "2026-08-11"`).
- New `screenshots[]` field on records + gallery renderer in
  `RecordHeader` (no screenshots added yet — curators populate
  in follow-ups).

**Phase 3 — Discovery architecture:**
- Tag dropdown filtered against a curated
  `data/taxonomy/topics.yml` (36 stable ids). Records still
  carry arbitrary tags on disk; only curated ids contribute to
  the browse dropdown counts. 81 raw unique tags reduced to a
  scannable subset.
- Intersection counts: after selecting Flutter, the Platform
  facet shows Flutter+Platform counts, not the global count.
  `buildFacets(items, { filters })` re-runs each facet's count
  against records that satisfy every OTHER filter.
- Browse page HTML drops from 1.19 MB to 358 KB (-70%) by
  server-paginating the SSR markup (`paginate(sorted, page,
  PAGE_SIZE)` in `getDirectoryIndexModel`).
- Tag chip link on detail pages switches from `?q=` to `?tag=`
  for consistency with the Tag facet.
- Collection pages emit an `ItemList` JSON-LD block listing
  each entry as a `ListItem` whose `item` is a
  `SoftwareApplication`. Capped at 50 per page.
- Browse filter URLs (anything beyond `?page=` and `?sort=`)
  are tagged with `noindex,follow` via a small client-side
  script. Bare `/apps/` and pagination states stay indexable.

**Phase 4 — Visual simplification:**
- Homepage drops one of the three near-identical 6-card lens
  sections (Established) and trims the other two to 3 cards.
  The full contributors grid moves from the homepage to its
  dedicated page; the homepage now shows a single one-line
  link to `/contributors`.
- Header nav adds Collections and Community entries between
  Browse and About.

### Still deferred (after audit follow-up)

- Per-record and per-collection OG images (the audit's D4
  recommendation) — requires a new build-time image
  generator. Documented as the next PR.

## [0.1.0] — 2024

Initial extraction of the Open Source Flutter Apps collection into a
structured Astro directory.
