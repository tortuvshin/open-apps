#!/usr/bin/env node
/**
 * Render `grove cleanup`'s report as the body of the standing
 * review-queue issue.
 *
 * `grove cleanup` writes `data/generated/cleanup-report.json`: every
 * record whose health is stale, needs_review, archived, inactive,
 * unavailable or unknown. This joins each candidate with its GitHub
 * sync cache entry (`data/cache/github/<slug>.json`) for when it was
 * last checked and why, and with `data/decisions.yml` so a record a
 * curator has already decided on leaves the queue instead of being
 * listed every month.
 *
 * Usage:
 *   node scripts/render-review-queue.mjs [--out review-queue.md]
 *
 * Prints the number of open findings to stdout and, under GitHub
 * Actions, writes `count=<n>` to $GITHUB_OUTPUT. Zero findings is the
 * signal for the workflow to stay quiet.
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const reportPath = flag('--report', 'data/generated/cleanup-report.json');
const cacheDir = flag('--cache', 'data/cache/github');
const decisionsPath = flag('--decisions', 'data/decisions.yml');
const outPath = flag('--out', 'review-queue.md');
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;

if (!existsSync(reportPath)) {
  console.error(`render-review-queue: ${reportPath} not found — run \`grove cleanup\` first.`);
  process.exit(1);
}
const report = JSON.parse(readFileSync(reportPath, 'utf8'));

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return undefined;
  }
}

function loadDecisions(path) {
  if (!existsSync(path)) return new Map();
  const raw = parseYaml(readFileSync(path, 'utf8'), { schema: 'core' }) ?? [];
  const list = Array.isArray(raw) ? raw : (raw.decisions ?? []);
  return new Map(list.filter((d) => d?.id).map((d) => [d.id, d.decision ?? {}]));
}

const day = (iso) => (iso ? String(iso).slice(0, 10) : '—');
const cell = (text) => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ');

/** The recommended next step for a curator, by why the record is here. */
function recommend(status, staleReason) {
  if (staleReason === 'sync_stale' || status === 'unknown') {
    return 'Re-run **Sync GitHub**; if it keeps failing, check the repo URL';
  }
  switch (status) {
    case 'archived':
      return 'Archived upstream: decide `hide` or `historical` in `data/decisions.yml`';
    case 'unavailable':
      return 'Repo is gone: fix the URL or decide `remove`';
    case 'inactive':
      return 'No push in 24+ months: decide `hide`, `historical` or `keep`';
    case 'needs_review':
      return 'No push in 18+ months: check the project, then decide `keep` or `hide`';
    case 'stale':
      return 'No recent push: check whether it is feature-complete; `keep` if so';
    default:
      return 'Review and record a decision in `data/decisions.yml`';
  }
}

/** Why the record is in the queue: health reasons, the last push, sync failures. */
function evidence(candidate, entry) {
  const parts = [];
  if (candidate.staleReason) parts.push(`\`${candidate.staleReason}\``);
  const reasons = Array.isArray(entry?.health?.reasons) ? entry.health.reasons : [];
  const first = reasons.find((r) => !/license/i.test(r));
  if (first) parts.push(first);
  if (candidate.lastCommitAt) parts.push(`last push ${day(candidate.lastCommitAt)}`);
  const failure = entry?.partialFailures?.at(-1);
  if (failure && (!entry.lastSuccessAt || Date.parse(failure.at) > Date.parse(entry.lastSuccessAt))) {
    parts.push(`sync failed ${day(failure.at)} (${failure.source}: ${failure.reason})`);
  }
  return parts.join('; ') || '—';
}

const decisions = loadDecisions(decisionsPath);
const rows = [];
const decided = [];
for (const candidate of report.candidates ?? []) {
  const entry = readJson(join(cacheDir, `${candidate.slug}.json`));
  const decision = decisions.get(candidate.slug);
  if (decision?.visibility) {
    decided.push({ candidate, decision });
    continue;
  }
  rows.push({
    candidate,
    lastChecked: entry?.lastSuccessAt ?? null,
    evidence: evidence(candidate, entry),
    action: recommend(candidate.status, candidate.staleReason),
  });
}

const ORDER = ['unavailable', 'archived', 'unknown', 'inactive', 'needs_review', 'stale'];
const rank = (status) => {
  const i = ORDER.indexOf(status);
  return i === -1 ? ORDER.length : i;
};
rows.sort(
  (a, b) =>
    rank(a.candidate.status) - rank(b.candidate.status) ||
    (b.candidate.stars ?? 0) - (a.candidate.stars ?? 0),
);

const lines = [
  '<!-- Maintained by .github/workflows/cleanup.yml. Edits to this body are overwritten on the next run. -->',
  '',
  `Records that need a curator's decision, from \`grove cleanup\` run at ${report.generatedAt}.`,
  'A record leaves this list once it has an entry in `data/decisions.yml` or its health recovers.',
  '',
];
if (rows.length === 0) {
  lines.push('Nothing to review.');
} else {
  lines.push(
    '| Record | Status | Last checked | Evidence | Recommended action |',
    '| --- | --- | --- | --- | --- |',
  );
  for (const { candidate, lastChecked, evidence: ev, action } of rows) {
    const name = candidate.url ? `[${candidate.name}](${candidate.url})` : candidate.name;
    lines.push(
      `| ${cell(name)} (\`${candidate.slug}\`, ${candidate.stars ?? 0}★) | ${candidate.status} | ${day(lastChecked)} | ${cell(ev)} | ${cell(action)} |`,
    );
  }
}
if (decided.length > 0) {
  lines.push(
    '',
    '<details><summary>Already decided (' + decided.length + ')</summary>',
    '',
    ...decided.map(
      ({ candidate, decision }) =>
        `- \`${candidate.slug}\` (${candidate.status}): ${decision.visibility}${decision.reason ? ` — ${cell(decision.reason)}` : ''}`,
    ),
    '',
    '</details>',
  );
}
lines.push('', runUrl ? `Last run: ${runUrl}` : 'Rendered locally.');

writeFileSync(outPath, `${lines.join('\n')}\n`);
console.log(rows.length);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `count=${rows.length}\n`);
