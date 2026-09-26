# `data/`

The files in this directory are produced and consumed by the Grove
framework. Do not hand-edit any of the following — the next sync
will clobber the changes:

- `cache/github/<slug>.json` — GitHub metadata and health
  (`status`, `tier`, `cleanupCandidate`, `confidence`, `reasons`) plus
  `lastSuccessAt` and recent `partialFailures`, written by
  `pnpm exec grove sync github`. Records never carry these fields;
  PRs that edit the cache outside the sync commit are almost always wrong.
- `generated/contributors.json` — auto-generated list of human
  contributors to this repository (bots filtered out at the
  framework level). Produced by the `sync-contributors` workflow.
- `generated/recent-pulls.json` — the latest merged pull requests
  from people other than the repository owner, shown as "Recent
  collaboration" on /contributors/. Written by
  `scripts/sync-recent-pulls.mjs` in the same workflow.

Files you CAN hand-edit:

- `content/records/<slug>.md` (outside this directory) — one file
  per app: the record's fields as YAML frontmatter, then the review
  notes. Schema lives in the framework; `pnpm exec grove check`
  enforces it.
- `data/records/<slug>.yml` — the older layout, left for four apps
  (`onionbrowser`, `swiftterm`, `tura`, `utm`) until #287 decides
  their notes files. Do not add new records here.
- `data/collections/<slug>.yml` — one file per curated list.
  Each must include an auditable `selectionNote`.
- `data/taxonomy/{categories,stacks,topics,licenses}.yml` —
  curated vocabulary. The `licenses` taxonomy uses SPDX ids
  plus a `noassertion` family for the GitHub `NOASSERTION`
  placeholder; the `topics` taxonomy has a `open-source` /
  `foss-alternative` split documented in-file.
