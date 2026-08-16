# Open App Scout record schema

Canonical reference for records in `data/records/*.yml`.

**The schema is owned by [`@grove-dev/core`](https://github.com/tortuvshin/grove)**
(currently `0.6.1`), not by this repository. The field list below is generated
from the installed `projectRecordSchema`. To regenerate after a Grove upgrade,
introspect `node_modules/@grove-dev/core/dist/schema.js` rather than editing
this table by hand.

> **Unknown fields are dropped silently.** `projectRecordSchema` is a plain zod
> object, so zod's default *strip* behaviour applies: a field the schema does
> not define passes `grove check` without warning, is removed by
> `build-data.ts` before `data/generated/*.json` is written, and never reaches a
> template. Adding a new field means changing it upstream in Grove first.

## Ownership

| Ownership | Fields | Rule |
| --- | --- | --- |
| Human | identity, taxonomy, editorial | Edit freely in pull requests |
| Automation | `github.*`, `health.*` | Written by `grove sync`; do not hand-edit unless fixing bad automation output |

## Project record fields

`kind: project` is the only kind this directory uses.

### Identity

| Field | Type | Notes |
| --- | --- | --- |
| `kind` | literal `project` | Required |
| `name` | string | Required. Display name |
| `slug` | string | Required. Must match the filename |
| `description` | string | One-sentence summary; defaults to `""` |
| `summary` | string? | Editorial lead paragraph; rendered before `description` |
| `sourceDescription` | string? | Preserved upstream description (README/GitHub) |
| `category` | string | Single ID from `data/taxonomy/categories.yml`; defaults to `uncategorized` |
| `tags` | string[] | Free-form; curate against `data/taxonomy/topics.yml` |
| `projectType` | enum? | `real-app`, `production`, `reference`, `library`, `tool`, `demo`, `template`, `historical` |
| `difficulty` | enum? | `beginner`, `intermediate`, `advanced` |
| `codebaseSize` | enum? | `small`, `medium`, `large`, `huge` |

Use `projectType` honestly. A UI framework is a `library`, a sample app is a
`reference`, a starter is a `template` — even when it is popular.

### Technology and distribution

| Field | Type | Notes |
| --- | --- | --- |
| `stack` | string? | Primary stack from `data/taxonomy/stacks.yml` |
| `stacks` | string[] | Additional stacks |
| `platforms` | string[] | Shipped targets from `data/taxonomy/platforms.yml` |
| `licenses` | string[] | SPDX-ish strings. **Not validated against taxonomy** — `noassertion` means unresolved |
| `repoUrl` | url? | Canonical repository |
| `logoUrl` | url? | |
| `links` | object | `github`, `website`, `docs`, `source`; extra keys allowed if URL-valued |
| `distribution` | object | `channels[]` from `data/taxonomy/distribution-channels.yml` |

### Editorial (human-owned)

| Field | Type | Notes |
| --- | --- | --- |
| `bestFor` | string[] | Concrete audiences/use cases. **Rendered** by Grove's `EditorialSummary` |
| `caveats` | string[] | Concrete limitations. **Rendered** as "Consider before using" |
| `whyListed` | string[] | Inclusion rationale |
| `screenshots` | object[] | `src`, `alt`, optional `source` (provenance), `width`, `height` |
| `content` | string? | Path to a long-form body, e.g. `content/records/<slug>.md` |
| `curation` | object | `reviewed`, `reviewedBy`, `reviewedAt`, `notes`, `labels[]`, `lenses[]` |
| `scores` | object | `activity`, `maturity`, `learning`, `contribution`, `docs`, `overall` (0–100) |

`curation.labels` accepts `new`, `hot`, `mature`, `featured`.

### Visibility

| Field | Type | Notes |
| --- | --- | --- |
| `visibility` | enum | `highlight`, `keep`, `needs_review`, `hide`, `remove`, `historical` |

For **project** records the effective listing signal is `health.visibility`
(`toIndexRecord` reads `r.health?.visibility ?? "keep"`); the top-level
`visibility` is the human-readable curation field. Keep the two consistent.
Only `hide` and `remove` drop a record from the generated index.

### Automation-owned

| Field | Type | Notes |
| --- | --- | --- |
| `github` | object? | Repository, languages, latest release, activity. Written by `grove sync github` |
| `health.status` | enum | `active`, `mature`, `stale`, `inactive`, `archived`, `unknown`, `historical`, `needs_review`, `quiet`, `unavailable` |
| `health.maturity` | enum | `experimental`, `useful`, `mature`, `unknown` |
| `health.tier` | enum | `curated`, `listed`, `experimental`, `hidden` |
| `health.confidence` | enum | `low`, `medium`, `high` |
| `health.visibility` | enum | As above |
| `health.cleanupCandidate` | boolean | |
| `health.staleReason` | string? | |
| `health.reasons` | string[] | |

### `source`

Provenance of the record itself: `type` (`manual`, `github-topic`,
`awesome-list`, `submit`, `import`), plus optional `file`, `url`, `provider`,
`owner`, `repo`.

## Validation

`pnpm exec grove check` validates every record and reports:

- zod parse errors (missing or wrong-typed known fields);
- `unknown_taxonomy_value` for `category`, `stack`, and `platforms`;
- `slug_mismatch` when `slug` differs from the filename.

It does **not** check licenses against `data/taxonomy/licenses.yml`, verify
URLs, or flag unknown fields.

## Known gaps

Tracked for an upstream Grove change; none of these can be expressed today:

- no publication tier (`candidate`/`catalogued`/`reviewed`/`featured`/`retired`);
- no structured `evidence[]` with source URLs and check dates;
- no structured `alternatives[]`;
- no warning when a record carries a field the schema does not define.

Until they land, evidence lives as a table in the record's markdown body — see
[EVIDENCE.md](EVIDENCE.md).
