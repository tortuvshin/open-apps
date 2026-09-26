## What this PR does

A short summary of the change. One or two sentences. If it closes an
issue, write "Closes #123" so it auto-links.

## Why

The motivation. Link to any relevant issues or discussions. If this
is a UI change, attach a before/after screenshot.

## How to verify

Steps for a reviewer to follow:

1. `pnpm install`
2. `pnpm exec grove validate`
3. `pnpm grove:dev` and open `…`
4. Confirm that `…`

## Checklist

- [ ] `pnpm exec grove validate` passes
- [ ] `pnpm run build` succeeds locally
- [ ] For record changes: one file per app,
      `content/records/<slug>.md` (frontmatter plus notes), and the file
      name is the slug
- [ ] For new categories / stacks / platforms: the field appears
      sensibly in `Browse by category` and `Browse by stack`
