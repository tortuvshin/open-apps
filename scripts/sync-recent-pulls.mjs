#!/usr/bin/env node
/**
 * Write `data/generated/recent-pulls.json` — the most recently merged
 * pull requests from people other than the repository owner, for the
 * "Recent collaboration" section on /contributors/.
 *
 * Runs in the weekly `sync-contributors` workflow next to
 * `grove sync contributors`. Bots (GitHub App accounts and `[bot]`
 * logins) and the owner's own PRs are left out, so the list shows
 * outside contributions only. The page renders nothing when the file
 * is missing or empty.
 *
 * Usage: GH_TOKEN=… node scripts/sync-recent-pulls.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const LIMIT = 8;
const OUT = 'data/generated/recent-pulls.json';

const repoUrl = JSON.parse(readFileSync('data/generated/repo-stats.json', 'utf8')).repoUrl;
const match = repoUrl?.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
if (!match) throw new Error(`Cannot read owner/repo from ${repoUrl}`);
const [, owner, repo] = match;

const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const isBot = (user) => !user || user.type === 'Bot' || /\[bot\]$/.test(user.login);

const pulls = [];
for (let page = 1; page <= 5 && pulls.length < LIMIT; page++) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=100&page=${page}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
  const batch = await res.json();
  if (batch.length === 0) break;
  for (const pr of batch) {
    if (!pr.merged_at || isBot(pr.user)) continue;
    if (pr.user.login.toLowerCase() === owner.toLowerCase()) continue;
    pulls.push({
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      author: pr.user.login,
      authorUrl: pr.user.html_url,
      avatarUrl: pr.user.avatar_url,
      mergedAt: pr.merged_at,
    });
  }
}

pulls.sort((a, b) => Date.parse(b.mergedAt) - Date.parse(a.mergedAt));
const data = {
  generatedAt: new Date().toISOString(),
  repository: `${owner}/${repo}`,
  pulls: pulls.slice(0, LIMIT),
};
writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`[recent-pulls] ${data.pulls.length} merged pull requests written to ${OUT}`);
