#!/usr/bin/env node
// One-off: credit the people who added apps before `submittedBy` existed.
//
// Reads merged pull requests with `gh`, keeps those opened by someone
// other than the maintainer or a bot that touch at most three record
// files, and writes `submittedBy: <login>` into each matching
// `content/records/<slug>.md` that has no `submittedBy` yet. The oldest
// PR wins, so a later metadata fix never takes credit for the addition.
//
//   node scripts/backfill-submitted-by.mjs          # dry run
//   node scripts/backfill-submitted-by.mjs --write
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const REPO = 'tortuvshin/open-apps';
const MAINTAINERS = new Set(['tortuvshin']);
const write = process.argv.includes('--write');

const prs = JSON.parse(
  execFileSync(
    'gh',
    ['pr', 'list', '--repo', REPO, '--state', 'merged', '--limit', '1000', '--json', 'number,author,files,mergedAt'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  ),
);

const credit = new Map();
for (const pr of prs.sort((a, b) => a.mergedAt.localeCompare(b.mergedAt))) {
  const login = pr.author?.login ?? '';
  if (!login || MAINTAINERS.has(login) || /bot|github-actions/i.test(login)) continue;
  const slugs = [
    ...new Set(
      pr.files
        .map((f) => f.path.match(/^(?:content|data)\/records\/([^/]+)\.(?:md|ya?ml)$/)?.[1])
        .filter(Boolean),
    ),
  ];
  if (slugs.length === 0 || slugs.length > 3) continue;
  for (const slug of slugs) if (!credit.has(slug)) credit.set(slug, { login, pr: pr.number });
}

let changed = 0;
for (const [slug, { login, pr }] of credit) {
  const file = `content/records/${slug}.md`;
  if (!existsSync(file)) continue;
  const text = readFileSync(file, 'utf8');
  if (/^submittedBy:/m.test(text)) continue;
  const next = text.replace(/^---\n/, `---\nsubmittedBy: ${login}\n`);
  console.log(`${slug.padEnd(28)} @${login} (#${pr})`);
  changed++;
  if (write) writeFileSync(file, next);
}
console.log(`${changed} record(s) ${write ? 'updated' : 'would be updated'}.`);
