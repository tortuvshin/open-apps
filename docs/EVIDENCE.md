# Evidence standard

Every factual claim that can change, or that could cause harm if wrong, must
point to a direct source URL. An issue number without a link is not evidence.

Until Grove gains a structured `evidence[]` field (see
[SCHEMA.md](SCHEMA.md#known-gaps)), evidence lives as a table at the end of the
record's markdown body in `content/records/<slug>.md`. Grove's markdown
sanitiser allows tables, so it renders with no component work.

## Source priority

1. Repository file permalink pinned to a commit SHA
2. Official documentation or release notes
3. Maintainer issue, pull request, or discussion
4. App-store listing or official pricing page
5. Reputable independent review, for experiential claims
6. Community reports — only when labelled anecdotal and corroborated

Prefer a permalink (`/blob/<sha>/`) over a branch path (`/blob/main/`): branch
paths silently change meaning when the file changes.

## Ledger format

```markdown
## Evidence

| Claim | Source | Type | Checked | By |
| --- | --- | --- | --- | --- |
| Licensed AGPL-3.0 | [LICENSE](https://github.com/owner/repo/blob/<sha>/LICENSE) | repository-file | 2026-08-16 | @handle |
| Self-hosting limited to 1 member, 3 guests | [SELF_HOST_LICENSE](https://github.com/owner/repo/blob/<sha>/SELF_HOST_LICENSE_AGREEMENT.md) | repository-file | 2026-08-16 | @handle |
```

`Type` is one of `repository-file`, `documentation`, `release-notes`,
`maintainer-issue`, `store-listing`, `pricing-page`, `independent-review`,
`community-report`.

`By` is a human handle. Do not record an agent as the checker: an agent may
collect and draft, but a person signs off on what publishes.

## Rules

- State licensing, pricing, self-hosting limits, and security claims only with
  a direct link. These are the claims most likely to be wrong and most likely
  to matter.
- Separate what is verified from what is inferred. Mark inferences as such.
- Do not infer a license from repository topics or marketing copy. Read the
  license file.
- Do not present community allegations as fact.
- Do not turn star counts into quality judgements.
- A broken or stale evidence link fails review — it does not quietly stay
  published.

## Freshness

Re-check a record when its license file changes, the repository is archived or
transferred, official pricing or self-host terms change, an evidence URL
breaks, a major release changes architecture or platforms, or a reader reports
an outdated claim. Otherwise re-check reviewed records at least every 180 days.
