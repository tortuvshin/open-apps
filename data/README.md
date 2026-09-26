# `data/`

The files in this directory are produced and consumed by the Grove
framework. Do not hand-edit any of the following — the next sync
will clobber the changes:

- The `health` and `github` blocks inside each
  `data/records/<slug>.yml` — written by `pnpm exec grove sync github`
  (`status`, `tier`, `cleanupCandidate`, `confidence`, `reasons`).
  PRs that edit them outside the sync commit are almost always wrong.
- `generated/contributors.json` — auto-generated list of human
  contributors to this repository (bots filtered out at the
  framework level). Produced by the `sync-contributors` workflow.
- `generated/recent-pulls.json` — the latest merged pull requests
  from people other than the repository owner, shown as "Recent
  collaboration" on /contributors/. Written by
  `scripts/sync-recent-pulls.mjs` in the same workflow.

Files you CAN hand-edit:

- `data/records/<slug>.yml` — one file per record. Schema lives
  in the framework; `pnpm exec grove validate` enforces it.
- `data/collections/<slug>.yml` — one file per curated list.
  Each must include an auditable `selectionNote`.
- `data/taxonomy/{categories,stacks,topics,licenses}.yml` —
  curated vocabulary. The `licenses` taxonomy uses SPDX ids
  plus a `noassertion` family for the GitHub `NOASSERTION`
  placeholder; the `topics` taxonomy has a `open-source` /
  `foss-alternative` split documented in-file.
