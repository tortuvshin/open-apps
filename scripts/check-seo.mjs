#!/usr/bin/env node
/**
 * Crawl smoke test over the built site (`dist/`).
 *
 * `grove audit` runs Lighthouse page by page, so it cannot see problems
 * that only exist *across* pages. This reads every built HTML file and
 * fails the build on:
 *
 *   - a missing or empty <title> / meta description
 *   - two indexable pages sharing a <title> or a meta description
 *   - a canonical that is missing, duplicated, or points somewhere
 *     other than the page's own URL on `site.url`
 *   - a `noindex` page that the sitemap still lists, or an indexable
 *     page the sitemap leaves out — the two must agree
 *   - a `noindex` page marked `data-pagefind-body`, which would put it
 *     in the header quick-find
 *   - the retired "Open Apps" brand in <title> or og:site_name
 *
 * Over-long titles and descriptions are warnings: they get truncated in
 * search results, they don't break anything.
 *
 * Usage: `pnpm build && pnpm seo:check`
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const TITLE_MAX = 65;
const DESCRIPTION_MAX = 160;
const RETIRED_BRAND = /\bOpen Apps\b/;

const siteUrl = JSON.parse(
  readFileSync('data/generated/site-config.json', 'utf8'),
).siteUrl?.replace(/\/$/, '');
if (!siteUrl) {
  console.error('check-seo: no siteUrl in data/generated/site-config.json — run `pnpm build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function urlPathOf(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  return `/${rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel}`;
}

// The sitemap is generated from the data, independently of the page
// templates, so it is the second opinion on what should be indexed.
const sitemapFiles = readdirSync(DIST).filter((name) => /^sitemap.*\.xml$/.test(name));
const listed = new Set(
  sitemapFiles.flatMap((name) =>
    [...readFileSync(join(DIST, name), 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) =>
      decode(m[1]).replace(/\/$/, ''),
    ),
  ),
);
const inSitemap = (path) => listed.has(`${siteUrl}${path}`.replace(/\/$/, ''));

const errors = [];
const warnings = [];
let noindexCount = 0;
const titles = new Map();
const descriptions = new Map();
const indexable = [];

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  const head = html.slice(0, html.indexOf('</head>') + 1 || html.length);
  const path = urlPathOf(file);

  // Astro's redirect stubs carry a meta refresh and nothing to index.
  if (/http-equiv="refresh"/i.test(head)) continue;

  const title = decode(head.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '');
  const description = decode(head.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '');
  const canonicals = [...head.matchAll(/<link rel="canonical" href="([^"]*)"/gi)].map((m) => m[1]);
  const robots = head.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? '';
  const siteName = decode(head.match(/<meta property="og:site_name" content="([^"]*)"/i)?.[1] ?? '');
  const noindex = /noindex/i.test(robots);

  if (noindex) {
    noindexCount += 1;
    if (inSitemap(path)) errors.push(`${path}: noindex, but listed in the sitemap`);
    if (/data-pagefind-body/.test(html)) errors.push(`${path}: noindex, but in the search index`);
    continue;
  }

  if (!title) errors.push(`${path}: missing <title>`);
  if (!description) errors.push(`${path}: missing meta description`);
  if (RETIRED_BRAND.test(title)) errors.push(`${path}: retired brand in <title> — "${title}"`);
  if (RETIRED_BRAND.test(siteName)) errors.push(`${path}: retired brand in og:site_name`);

  if (canonicals.length !== 1) {
    errors.push(`${path}: expected 1 canonical, found ${canonicals.length}`);
  } else if (canonicals[0].replace(/\/$/, '') !== `${siteUrl}${path}`.replace(/\/$/, '')) {
    errors.push(`${path}: canonical points to ${canonicals[0]}`);
  }

  if (title.length > TITLE_MAX) warnings.push(`${path}: title is ${title.length} chars — "${title}"`);
  if (description.length > DESCRIPTION_MAX + 1) {
    warnings.push(`${path}: description is ${description.length} chars`);
  }

  indexable.push(path);
  if (title) titles.set(title, [...(titles.get(title) ?? []), path]);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), path]);
}

for (const [title, paths] of titles) {
  if (paths.length > 1) errors.push(`duplicate <title> "${title}": ${paths.join(', ')}`);
}
for (const [description, paths] of descriptions) {
  if (paths.length > 1) {
    errors.push(`duplicate description "${description.slice(0, 60)}…": ${paths.join(', ')}`);
  }
}

if (sitemapFiles.length === 0) errors.push('no sitemap*.xml in dist/');
for (const path of indexable) {
  if (!inSitemap(path)) errors.push(`${path}: indexable but not in the sitemap`);
}

for (const warning of warnings) console.warn(`warn  ${warning}`);
for (const error of errors) console.error(`error ${error}`);
console.log(
  `check-seo: ${indexable.length} indexable, ${noindexCount} noindex, ${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length > 0 ? 1 : 0);
