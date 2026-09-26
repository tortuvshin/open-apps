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
 *   - a record, collection, category or stack page whose robots meta
 *     disagrees with the index policy (`seo.*IndexPolicy` in
 *     grove.config.ts, via site-config.json). The expected answer is
 *     derived here from the data — Markdown body, `curation.reviewed`,
 *     `editorial.introduction`, the taxonomy term's `description` —
 *     not read back from the page. A page the policy excludes must say
 *     exactly `noindex,follow`.
 *   - a page without the parameter-URL robots script
 *     (`data-grove-param-robots`), which marks `?q=`, `?sort=` and
 *     facet URLs `noindex,follow` in the browser. The server HTML of a
 *     parameter URL is the base page's, so this is the only place the
 *     variant can be told apart.
 *   - record JSON-LD with a field outside the SoftwareApplication
 *     allowlist (no offers, ratings, reviews or `isAccessibleForFree`),
 *     or a `downloadUrl` that is not a verified distribution channel
 *   - a README entry whose detail page is missing from dist/, or
 *     noindex for a reason the policy does not explain. Indexable and
 *     intentionally-noindex entries are reported.
 *
 * A page the policy excludes stays in the header quick-find: noindex
 * keeps it out of search engines, not away from readers. Any other
 * noindex page in the Pagefind index is an error.
 *
 * Over-long titles and descriptions are warnings: they get truncated in
 * search results, they don't break anything.
 *
 * Usage: `pnpm build && pnpm seo:check`
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { parse as parseYaml } from 'yaml';

const DIST = 'dist';
const TITLE_MAX = 65;
const DESCRIPTION_MAX = 160;
const RETIRED_BRAND = /\bOpen Apps\b/;

const siteConfig = JSON.parse(readFileSync('data/generated/site-config.json', 'utf8'));
const siteUrl = siteConfig.siteUrl?.replace(/\/$/, '');
if (!siteUrl) {
  console.error('check-seo: no siteUrl in data/generated/site-config.json — run `pnpm build` first.');
  process.exit(1);
}

// ── Index policy: what each page type *should* say ─────────────────
// Re-derived from the data with the same rules as Grove's
// `recordIndexable` / `collectionIndexable` / `taxonomyTermIndexable`,
// so a page model and this check can only agree by both being right.
const policy = {
  records: siteConfig.seo?.recordIndexPolicy ?? 'all',
  collections: siteConfig.seo?.collectionIndexPolicy ?? 'all',
  taxonomies: siteConfig.seo?.taxonomyIndexPolicy ?? 'all',
};
const routeSlug = siteConfig.blueprintConfig?.routeSlug ?? 'projects';

/** Markdown body with more than an opening `# Title` (frontmatter stripped). */
function hasBody(pointer) {
  if (!pointer) return false;
  const path = resolve(pointer);
  if (!existsSync(path)) return false;
  let text = readFileSync(path, 'utf8');
  const fence = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (fence) text = text.slice(fence[0].length);
  return text.replace(/^\s*# .*(\r?\n|$)/, '').trim().length > 0;
}

/** path → { why, expected: 'index' | 'policy-noindex' | 'noindex', verifiedDownloads? } */
const expectations = new Map();

const records = JSON.parse(readFileSync('data/generated/records.full.json', 'utf8')).records ?? [];
for (const record of records) {
  const visibility = record.health?.visibility ?? record.visibility;
  const body = hasBody(record.content);
  const reviewed = record.curation?.reviewed === true;
  const byPolicy =
    policy.records === 'all' ||
    (body && (policy.records === 'editorial' || reviewed));
  const why = visibility === 'hide' || visibility === 'remove'
    ? `hidden (${visibility})`
    : byPolicy
      ? 'meets policy'
      : `${policy.records}: ${body ? 'body' : 'no body'}, ${reviewed ? 'reviewed' : 'not reviewed'}`;
  expectations.set(`/${routeSlug}/${record.slug}/`, {
    type: 'record',
    why,
    expected: why.startsWith('hidden') ? 'noindex' : byPolicy ? 'index' : 'policy-noindex',
    verifiedDownloads: new Set(
      (record.distribution?.channels ?? [])
        .filter((channel) => channel.verified === true)
        .map((channel) => channel.url),
    ),
  });
}

for (const name of readdirSync('data/collections').filter((n) => n.endsWith('.yml'))) {
  const collection = parseYaml(readFileSync(join('data/collections', name), 'utf8'));
  const intro = Boolean(collection.editorial?.introduction?.trim()) || hasBody(collection.content);
  const byPolicy = policy.collections === 'all' || intro;
  expectations.set(`/collections/${collection.slug}/`, {
    type: 'collection',
    why: collection.seo?.index === false
      ? 'seo.index: false'
      : byPolicy
        ? 'meets policy'
        : `${policy.collections}: no introduction`,
    // An empty collection is noindex whatever the policy; the page's
    // own ItemList count tells us (see below).
    expected: collection.seo?.index === false ? 'noindex' : byPolicy ? 'index' : 'policy-noindex',
  });
}

for (const kind of ['categories', 'stacks']) {
  for (const term of siteConfig.taxonomy?.[kind] ?? []) {
    const count = term.count ?? 0;
    const intro = Boolean(term.description?.trim());
    const byPolicy = policy.taxonomies === 'all' || intro;
    expectations.set(`/${kind}/${term.id}/`, {
      type: kind,
      why: count === 0 ? 'empty' : byPolicy ? 'meets policy' : `${policy.taxonomies}: no description`,
      expected: count === 0 ? 'noindex' : byPolicy ? 'index' : 'policy-noindex',
    });
  }
}

/** Every JSON-LD node on a page, flattened. */
function jsonLdNodes(head) {
  return [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(
    (m) => {
      try {
        const parsed = JSON.parse(m[1]);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    },
  );
}

const typesOf = (node) => [node?.['@type']].flat();
// Mirrors Grove's SOFTWARE_APPLICATION_FIELDS. Kept literal so a Grove
// upgrade that widens the list fails here until someone looks at it.
const SOFTWARE_APPLICATION_FIELDS = new Set([
  '@context', '@type', '@id', 'name', 'description', 'url', 'codeRepository', 'sameAs',
  'license', 'operatingSystem', 'applicationCategory', 'downloadUrl', 'programmingLanguage',
  'dateCreated', 'dateModified', 'author', 'keywords',
]);

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
const robotsByPath = new Map();
const policyNoindexPaths = [];
const checked = {};

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
  const expectation = expectations.get(path);
  robotsByPath.set(path, robots);

  // Every page rendered through the Seo layout (i.e. with a canonical);
  // machine surfaces such as /apps/page/cards/ have neither.
  if (canonicals.length > 0 && !/data-grove-param-robots/.test(html)) {
    errors.push(`${path}: no parameter-URL robots script (data-grove-param-robots)`);
  }

  if (expectation) {
    checked[expectation.type] = (checked[expectation.type] ?? 0) + 1;
    // An empty collection renders noindex whatever the policy.
    const itemCount = jsonLdNodes(head).find((n) => typesOf(n).includes('ItemList'))?.numberOfItems;
    const empty = expectation.type === 'collection' && itemCount === 0;
    if (expectation.expected === 'index' && noindex && !empty) {
      errors.push(`${path}: noindex (${robots}), but the policy indexes it (${expectation.why})`);
    } else if (expectation.expected !== 'index' && !noindex) {
      errors.push(`${path}: indexable, but expected noindex (${expectation.why})`);
    } else if (expectation.expected === 'policy-noindex' && robots !== 'noindex,follow') {
      errors.push(`${path}: excluded by policy (${expectation.why}), robots must be "noindex,follow", got "${robots}"`);
    }
  }

  if (expectation?.type === 'record') {
    const app = jsonLdNodes(head).find((n) =>
      typesOf(n).some((t) => t === 'SoftwareApplication' || t === 'SoftwareSourceCode'),
    );
    if (!app) {
      errors.push(`${path}: no SoftwareApplication JSON-LD`);
    } else {
      if (!typesOf(app).includes('SoftwareApplication')) {
        errors.push(`${path}: record JSON-LD is ${typesOf(app).join('+')}, not SoftwareApplication`);
      }
      const extra = Object.keys(app).filter((key) => !SOFTWARE_APPLICATION_FIELDS.has(key));
      if (extra.length) errors.push(`${path}: unverified JSON-LD field(s): ${extra.join(', ')}`);
      for (const url of [app.downloadUrl ?? []].flat()) {
        if (!expectation.verifiedDownloads.has(url)) {
          errors.push(`${path}: JSON-LD downloadUrl ${url} is not a verified channel`);
        }
      }
    }
  }

  if (noindex) {
    noindexCount += 1;
    if (inSitemap(path)) errors.push(`${path}: noindex, but listed in the sitemap`);
    // Policy-excluded pages stay findable on the site itself.
    const policyNoindex = expectation?.expected === 'policy-noindex';
    if (policyNoindex) policyNoindexPaths.push(path);
    else if (/data-pagefind-body/.test(html)) errors.push(`${path}: noindex, but in the search index`);
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

// Every page the policy covers must have been built.
for (const [path, expectation] of expectations) {
  if (expectation.expected !== 'index') continue;
  if (!robotsByPath.has(path)) errors.push(`${path}: indexable by policy, but not in dist/`);
}

// ── README → detail pages ──────────────────────────────────────────
const readmeLinks = [
  ...new Set(
    [...readFileSync('README.md', 'utf8').matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)]
      .map((m) => m[1])
      .filter((url) => url.startsWith(`${siteUrl}/${routeSlug}/`) && url !== `${siteUrl}/${routeSlug}/`),
  ),
];
const readme = { indexable: [], intentional: [] };
for (const url of readmeLinks) {
  const path = new URL(url).pathname.replace(/\/?$/, '/');
  if (!existsSync(join(DIST, path, 'index.html'))) {
    errors.push(`README: ${url} has no page in dist/`);
    continue;
  }
  const robots = robotsByPath.get(path) ?? '';
  if (!/noindex/i.test(robots)) {
    readme.indexable.push(path);
    continue;
  }
  const expectation = expectations.get(path);
  if (expectation && expectation.expected !== 'index') {
    readme.intentional.push(`${path} (${expectation.why})`);
  } else {
    errors.push(`README: ${url} is noindex without a policy reason`);
  }
}

for (const warning of warnings) console.warn(`warn  ${warning}`);
for (const error of errors) console.error(`error ${error}`);
console.log(
  `check-seo: policy records=${policy.records} collections=${policy.collections} taxonomies=${policy.taxonomies}; ` +
    `checked ${Object.entries(checked).map(([type, n]) => `${n} ${type}`).join(', ')}; ` +
    `${policyNoindexPaths.length} noindex by policy.`,
);
console.log(
  `check-seo: README links ${readmeLinks.length} detail page(s): ${readme.indexable.length} indexable, ` +
    `${readme.intentional.length} intentionally noindex.`,
);
if (process.env.CHECK_SEO_VERBOSE) {
  for (const entry of readme.intentional) console.log(`  README noindex  ${entry}`);
}
console.log(
  `check-seo: ${indexable.length} indexable, ${noindexCount} noindex, ${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length > 0 ? 1 : 0);
