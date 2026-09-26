# Contributing to Open Apps

Thanks for helping maintain a useful directory of real open-source apps.

## Inclusion criteria

A submission should be a usable application, not a library, tutorial,
boilerplate, one-screen demo, or marketing-only page. It needs a public source
repository, a verifiable open-source license, and enough documentation or
project history for another developer to evaluate it.

Popularity is useful context, not an automatic pass. Reviewers consider
product scope, source quality, maintenance, documentation, and learning value.

## One file per app

Every app is one Markdown file, `content/records/<slug>.md`. The file name
is the slug. The record's fields go in the YAML frontmatter between the two
`---` lines, and the review notes go underneath:

```markdown
---
name: Habo
repoUrl: https://github.com/xpavle00/Habo
category: productivity
stack: flutter
description: Privacy-first habit tracker for iOS and Android.
platforms:
  - android
  - ios
tags:
  - habit-tracker
addedAt: 2026-09-26
---

## Why it's listed

The notes shown on the app page.
```

Leave out `slug`, `kind` and `content`: Grove takes them from the file name,
the site and the file itself. A record with no notes stops after the
closing `---`.

## Add an app

1. Open `/submit` on the site and paste the canonical GitHub repository URL.
2. Review the generated YAML draft.
3. Choose category, primary stack, platforms, and free-form tags carefully.
   Categories and stacks come from `data/taxonomy/`; tags do not replace them.
4. Add the draft as `content/records/<slug>.md`: the YAML between `---`
   lines at the top (without `slug`, `kind` or `content`), your notes
   underneath. The form still offers the draft as `data/records/<slug>.yml`
   plus a notes file; that layout is accepted too, and a maintainer can
   convert it.
5. Run `pnpm exec grove check` and `pnpm build`.
6. Open a pull request explaining why the app is useful to run or study.

## Update an app

Edit the app's `content/records/<slug>.md`: the frontmatter for
description, taxonomy, `bestFor`, `whyListed`, `caveats` and curation labels,
the body for the notes. GitHub metadata and health signals live in
`data/cache/github/` and are refreshed by Grove workflows; avoid
hand-editing them unless the change specifically fixes bad automation
output.

Four apps (`onionbrowser`, `swiftterm`, `tura`, `utm`) are still
`data/records/<slug>.yml` while #287 decides what happens to their notes
files; edit those in the YAML.

If a repository moved, verify the canonical replacement before changing its
URL. For removal, open an issue or pull request with the reason. Security,
malware, copyright, and takedown concerns should follow `SECURITY.md`.

## Style

- Keep one app per file and use two-space indentation in the frontmatter.
- Write plain-language descriptions ending with a full stop.
- Do not repeat category or primary stack values as a substitute for useful
  tags.
- Keep generated files and one-off scripts out of the repository.
- Do not add a new taxonomy value for a single synonym; reuse an existing
  controlled value when it describes the project accurately.

## Search titles

Every record carries a `seo.title` — the line people see in search
results. People search for what an app *is* ("open source CRM"), not for
its category, so:

- Write `{Name} – Open Source {what it is}`, under 65 characters:
  `Habo – Open Source Privacy-First Habit Tracker`.
- Use the name people know (`Kodi`, not `xbmc`).
- Say "{X} Alternative" only when the project describes itself that way
  in its own README or repository description.
- Name the stack or platform when that is what makes the app worth
  finding: `Hacki – Open Source Hacker News Client Built with Flutter`.
- One plain phrase. No keyword lists, no "best", no year.

## Local checks

```sh
corepack enable
pnpm install
pnpm exec grove check
pnpm build
pnpm seo:check
```

`seo:check` reads the built site and fails on duplicate or missing titles
and descriptions, wrong canonicals, and pages whose `noindex` disagrees
with the sitemap.

By participating, you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).
