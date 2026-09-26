#!/usr/bin/env node
/**
 * Render the "submission review" comment for a pull request that adds or
 * changes app records.
 *
 * Usage: node scripts/review-submission.mjs --out review.md <file>...
 *
 * The workflow copies ONLY the PR's record files into a checkout of main,
 * so everything here runs main's code on the PR's data. For each changed
 * record it reports the facts a reviewer would otherwise open files for:
 * taxonomy, links, duplicate repository, repository status and licence,
 * install-channel reachability, and whether a written review is present.
 *
 * Verdicts:
 * - blocked             — grove check errors, a duplicate, or a missing repository
 * - needs human review  — anything unknown, unreachable or missing
 * - ready               — every automated check passed; a human still decides
 *
 * Anything the script could not check (rate limit, no token, network) is
 * reported as "unknown", never as a pass. Exit status is always 0.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import { loadConfig, loadNormalizedRecords, validateProject } from '@grove-dev/core';
import { parse as parseYaml } from 'yaml';

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const out = outIndex >= 0 ? args[outIndex + 1] : 'review.md';
const files = args.filter((a, i) => a !== '--out' && i !== outIndex + 1 && /\.(md|ya?ml)$/.test(a));
const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;

const PASS = '✅';
const FAIL = '❌';
const UNKNOWN = '❔';
const WARN = '⚠️';

function frontmatterOf(path) {
  const text = readFileSync(path, 'utf8');
  if (path.endsWith('.md')) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { data: null, body: text };
    return { data: parseYaml(match[1]) ?? {}, body: match[2] ?? '' };
  }
  return { data: parseYaml(text) ?? {}, body: '' };
}

async function github(path) {
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.status === 404) return { status: 'missing' };
    if (!res.ok) return { status: 'unknown', reason: `GitHub ${res.status}` };
    return { status: 'ok', data: await res.json() };
  } catch (error) {
    return { status: 'unknown', reason: error.message };
  }
}

async function reachable(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Mozilla/5.0 (submission-review)' },
    });
    if (res.ok) return { mark: PASS, note: `${res.status}` };
    if (res.status === 403 || res.status === 429) return { mark: UNKNOWN, note: `${res.status} (bot-blocked?)` };
    return { mark: FAIL, note: `${res.status}` };
  } catch (error) {
    return { mark: UNKNOWN, note: error.name === 'TimeoutError' ? 'timeout' : 'network error' };
  }
}

const config = await loadConfig();
const validation = await validateProject(config);
const { records: existing } = await loadNormalizedRecords(config, process.cwd());

const sections = [];
let worst = 'ready';
const bump = (verdict) => {
  const order = ['ready', 'needs human review', 'blocked'];
  if (order.indexOf(verdict) > order.indexOf(worst)) worst = verdict;
};

for (const file of files) {
  const slug = basename(file).replace(/\.(md|ya?ml)$/, '');
  if (!existsSync(file)) {
    sections.push(`### \`${slug}\`\n\nRemoved in this PR — a maintainer should confirm the removal.`);
    bump('needs human review');
    continue;
  }
  const { data, body } = frontmatterOf(file);
  if (!data || typeof data !== 'object' || !data.name) {
    // A Markdown file without record frontmatter is a review body for a
    // YAML record, or not a record at all.
    sections.push(`### \`${slug}\`\n\n${WARN} No record frontmatter (\`name\`) — not reviewed as a record.`);
    bump('needs human review');
    continue;
  }

  const rows = [];
  const add = (check, mark, note, verdict) => {
    rows.push(`| ${check} | ${mark} | ${note} |`);
    if (verdict) bump(verdict);
  };

  const issues = [...validation.errors, ...validation.warnings].filter(
    (issue) => issue.record === slug || issue.slug === slug || String(issue.message ?? '').includes(slug),
  );
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity !== 'error');
  add(
    'grove check',
    errors.length ? FAIL : warnings.length ? WARN : PASS,
    errors.length || warnings.length
      ? [...errors, ...warnings].map((i) => `\`${i.code}\` ${i.message}`).join('<br>')
      : 'no errors or warnings',
    errors.length ? 'blocked' : warnings.length ? 'needs human review' : undefined,
  );

  const repoUrl = String(data.repoUrl ?? '');
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  const fullName = match ? `${match[1]}/${match[2].replace(/\.git$/, '')}`.toLowerCase() : '';
  const duplicate = existing.find(
    (record) =>
      record.slug !== slug && String(record.repoUrl ?? '').toLowerCase().includes(`github.com/${fullName}`),
  );
  add(
    'Duplicate',
    !fullName ? UNKNOWN : duplicate ? FAIL : PASS,
    !fullName ? 'repoUrl is not a GitHub repository' : duplicate ? `already listed as \`${duplicate.slug}\`` : 'not listed yet',
    !fullName ? 'needs human review' : duplicate ? 'blocked' : undefined,
  );

  if (fullName) {
    const repo = await github(`/repos/${fullName}`);
    if (repo.status === 'missing') {
      add('Repository', FAIL, 'not found or private', 'blocked');
    } else if (repo.status === 'unknown') {
      add('Repository', UNKNOWN, repo.reason, 'needs human review');
    } else {
      const r = repo.data;
      add('Repository', PASS, `${r.stargazers_count}★ · last push ${String(r.pushed_at).slice(0, 10)}`);
      add('Archived', r.archived ? FAIL : PASS, r.archived ? 'archived' : 'active', r.archived ? 'needs human review' : undefined);
      const spdx = r.license?.spdx_id;
      add(
        'Licence',
        !spdx || spdx === 'NOASSERTION' ? WARN : PASS,
        spdx && spdx !== 'NOASSERTION' ? spdx : 'GitHub could not identify an open-source licence',
        !spdx || spdx === 'NOASSERTION' ? 'needs human review' : undefined,
      );
    }
  }

  add(
    'Taxonomy',
    data.category && data.stack ? PASS : WARN,
    `category \`${data.category ?? '—'}\` · stack \`${data.stack ?? '—'}\` · platforms ${(data.platforms ?? []).join(', ') || '—'}`,
    data.category && data.stack ? undefined : 'needs human review',
  );

  const channels = data.distribution?.channels ?? [];
  if (channels.length === 0) {
    add('Install channels', '—', 'none given (optional)');
  } else {
    for (const channel of channels) {
      const result = channel.url ? await reachable(channel.url) : { mark: FAIL, note: 'no URL' };
      add(
        `Channel: ${channel.label ?? channel.type}`,
        result.mark,
        `${result.note} · ${channel.url ?? ''} · ${channel.verified ? 'marked verified' : 'unverified (reviewer approves)'}`,
        result.mark === PASS ? undefined : 'needs human review',
      );
    }
  }

  const words = body.replace(/<!--[\s\S]*?-->/g, '').split(/\s+/).filter(Boolean).length;
  const todo = /\b(TODO|TBD)\b/.test(body);
  add(
    'Written review',
    words >= 80 && !todo ? PASS : WARN,
    words === 0 ? 'none — the page will show only the frontmatter lines' : `${words} words${todo ? ' · contains TODO/TBD' : ''}`,
    words >= 80 && !todo ? undefined : 'needs human review',
  );
  add(
    'Why listed / caveats',
    (data.whyListed ?? []).length ? PASS : WARN,
    `${(data.whyListed ?? []).length} why-listed · ${(data.bestFor ?? []).length} best-for · ${(data.caveats ?? []).length} caveats`,
    (data.whyListed ?? []).length ? undefined : 'needs human review',
  );

  sections.push(
    [
      `### ${data.name} (\`${slug}\`)`,
      '',
      `${repoUrl}${data.links?.website ? ` · ${data.links.website}` : ''}`,
      '',
      '| Check | | Result |',
      '|---|---|---|',
      ...rows,
    ].join('\n'),
  );
}

const verdictLine = {
  ready: `**Verdict: ready** — every automated check passed. A maintainer still decides.`,
  'needs human review': `**Verdict: needs human review** — see ${WARN} / ${UNKNOWN} rows.`,
  blocked: `**Verdict: blocked** — see ${FAIL} rows.`,
}[worst];

const markdown = [
  '## Submission review',
  '',
  files.length === 0 ? 'No record files changed.' : verdictLine,
  '',
  ...sections.flatMap((s) => [s, '']),
  '<details><summary>Reviewer checklist</summary>',
  '',
  '- [ ] A real, usable app (not a library, template or demo)',
  '- [ ] Category, stack and platforms are right',
  '- [ ] The review says something the GitHub description does not',
  '- [ ] Install channels open the right app (then mark them `verified: true`)',
  '- [ ] Below 50★: an exception reason is recorded',
  '',
  '</details>',
  '',
  `<sub>${UNKNOWN} = could not be checked (rate limit, network, bot blocking) — never counted as a pass. Updated on every push.</sub>`,
].join('\n');

writeFileSync(out, `${markdown}\n`);
console.log(markdown);
