# Grove upgrade status

**Current: `@grove-dev/{astro,cli,core}` 0.8.0 — registry-first UI.**

Grove v1 removed every UI export from `@grove-dev/astro`. The components now
ship through a [shadcn registry](https://withgrove.dev/r/) that installs
source into this repository, so the `.astro` files under `src/` are ours.

## What that changes day to day

| Before (0.6.1) | Now (0.8.0) |
| --- | --- |
| `import ProjectCard from "@grove-dev/astro/components/ProjectCard.astro"` | `import ProjectCard from "../components/grove/project-card.astro"` |
| A package upgrade could change the site's UI | Only `grove update` changes UI, and it never overwrites our edits |
| Customising a component meant forking it into `src/components/` | Every component is already in `src/` |

Business logic is still imported: `@grove-dev/core` and
`@grove-dev/astro/server` (view-model builders) are unchanged and carry the
data pipeline.

## Keeping the UI current

```bash
pnpm exec grove update --check   # what upstream changed; writes nothing
pnpm exec grove update --diff    # the same, with a unified diff per file
pnpm exec grove update           # apply what is safe
```

Files we have edited are reported and preserved, never overwritten. A file
where both sides moved is a **conflict**: `grove update` leaves it alone and
exits `2`, and keeps doing so on every run until someone merges it — the lock
records what we are reconciled to, not what upstream ships.

`.grove/registry.lock.json` is what that diff runs against. It is generated;
do not hand-edit it.

## Deliberate forks

These are classified `locally modified` and will not be overwritten. Re-check
them when the registry's corresponding block changes.

- **`src/pages/index.astro`** — two lens sections (actively developed /
  recently added) derived locally with `applySort`, rather than the upstream
  three (hot / new / mature) whose star-driven lenses largely echo each other
  on this directory. Includes a dedupe pass so a record never renders twice.
- **`src/pages/submit.astro` + `src/components/SubmissionClient.astro`** —
  emits `distribution.channels[]` objects with a required store URL, splits
  `sourceDescription` from the curator description, sets `source.type: submit`,
  offers the long-form notes file flow, and reports every validation issue at
  once. Upstream's submit block covers none of that yet. The goal is to
  upstream these and drop the fork.

## Local choices re-applied over upstream pages

Small, deliberate, and easy to lose on a future `--force`:

- `src/pages/404.astro` — "Not found — Open Apps", short lede.
- `src/pages/{categories,stacks,licenses}/[name].astro` — "Browse
  **open-source** apps…" in the lede.
- `src/pages/about.astro` — links `withgrove.dev`, not the Grove repo.
- `src/pages/[slug]/[recordSlug].astro` — forwards `noindex={seo.noindex}`,
  which the upstream page drops. A hidden record must stay unindexed.

## Adding or restoring one component

`components.json` maps `@grove` to the hosted registry, so the standard
shadcn CLI works:

```bash
npx shadcn@4.19.0 view @grove/home                     # what an item ships
npx shadcn@4.19.0 add @grove/browse                    # install it + its deps
npx shadcn@4.19.0 add @grove/project-card --overwrite  # reset one to upstream
```

Keep `"tsx": true` in `components.json`. With `false`, shadcn runs its
TypeScript→JavaScript transformer over every file and dies on the first
`.astro` with a bare `Unexpected token`.
