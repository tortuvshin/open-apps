# Ingesting a weekly opportunity scan

How a pasted SEO opportunity scan becomes published pages. The scan is a lead
list, not a source: **nothing in it is a fact until it has been re-checked.** The
2026-09-21 scan is the reason for that rule — it gave "Open Tag" 197 stars under
Apache-2.0 when no such repository exists, ranked a 6-star project at 84/100, and
missed that its #1 pick ships an enterprise-licensed `/ee` directory.

## 1. Archive

Save the scan verbatim to `docs/scans/<YYYY-MM-DD>.md` under the "raw input,
unverified" banner (copy it from the previous scan file).

## 2. Triage into the backlog

For each cluster, create or update `data/opportunities/<id>.yml`
(format: `data/opportunities/README.md`):

- append to `history[]` — never overwrite an earlier scan's rank;
- list every checkable claim under the candidate's `unverified[]`;
- check `data/records/` and `data/taxonomy/subjects.yml` for an existing record or
  subject before treating anything as new.

Propose a `status`; the owner decides it (**gate A**).

## 3. Verify — with tools, not memory

For every candidate in an `accepted` cluster:

```sh
gh search repos "<name>" --sort stars --limit 5      # find the canonical repo
gh api repos/<owner>/<repo> --jq '{stars: .stargazers_count, license: .license.spdx_id, pushed: .pushed_at, archived, description}'
gh api repos/<owner>/<repo>/license --jq .content | base64 -d | head -40
gh api repos/<owner>/<repo>/readme  --jq .content | base64 -d | grep -in "alternative"
```

- When GitHub says the licence is `other` / `NOASSERTION`, **read the LICENSE
  file**. Split licences (MIT core + enterprise directory) are common.
- Same name, several repos: pick by the scan's description, record the others.
- Note renames and redirects (`moved to …`) so a known app is not listed twice.
- Confirm the proprietary product exists under that exact name, from the vendor's
  own page, before creating a subject.
- Write results under `verified:` with `checkedAt`. Put every wrong scan claim in
  `scanMismatch[]`.

## 4. Inclusion check (`CONTRIBUTING.md`)

- A usable application — not an SDK, starter, template or demo.
- An OSI-approved licence. FSL / BUSL / SSPL / Commons Clause → `rejected`,
  `reason: license`. Such a project may be named "source-available" in a hub's
  "Not listed and why", nothing more.
- Open-core is eligible when the core is OSI-licensed; the record must say what
  is outside it.
- Under 500 stars or under six months old → maturity caveat first in `caveats`,
  a short record, no deep review. A handful of stars → not a record.

## 5. Write

1. Record: `grove add <github-url>` (until it ships: the `/submit` draft or a
   hand-written YAML). Then the human fields — `seo.title` by the title rules,
   a hand-written `seo.description`, `category`, `stack`, 3–6 tags from
   `data/taxonomy/topics.yml`, `bestFor`, `whyListed`, `caveats`, `content:`.
2. Subject + relation: add the product to `data/taxonomy/subjects.yml`, then
   `relations: [{ type: alternative-to, to: <id>, evidence: … }]` on the record.
   `self-described` evidence needs a verbatim quote of at most 20 words and its
   URL. "{X} Alternative" may appear in `seo.title` only with `self-described` or
   `repo-topic` evidence.
3. Notes: `content/records/<slug>.md` to the record-notes standard — no `# H1`,
   dated verdict, who it is for / not for, a compare table with linked siblings,
   running it, licence in practice, verified sources, at least three internal
   links with trailing slashes.
4. Hub or collection: `data/collections/<slug>.yml` + `content/collections/<slug>.md`,
   a unique verdict `note` per entry, "Not listed and why", `lastReviewedAt`.
5. Add reciprocal links in the sibling records' compare tables.

## 6. Gates

```sh
pnpm exec grove check && pnpm build && pnpm seo:check
```

Every new page needs a globally unique `<title>` and meta description.

## 7. PR

One PR per cluster (subject + its records + its hub). The body lists each
verified fact with its source and each scan claim that was false. Set the
opportunity's `status: published` with the URLs. The owner reviews verdict
paragraphs and any `editorial` relation before merge (**gate B**).

## Never

- copy a number, licence or quote from the scan into a record;
- publish search-volume or traffic claims — scan scores are internal;
- call a non-OSI project "open source";
- edit `github.*` or `health.*` (automation-owned);
- commit to `main`.
