/**
 * Collection guide — the site's reading of `data/collections/*.yml`
 * for the /collections/ index and the collection detail pages.
 *
 * Everything here is derived from fields the collections and records
 * already carry; nothing adds editorial claims. Two kinds of collection
 * come out of it:
 *
 *   editor's picks  entries carry curator notes (`entries[].note`), so a
 *                   person chose each app and wrote why. Dated by
 *                   `editorial.lastReviewedAt`.
 *   live view       a saved query over the directory, re-sorted from
 *                   the GitHub sync on every build. Dated by the newest
 *                   `github.sync.syncedAt` among its entries.
 *
 * The intent groups and questions are navigation copy: they name what
 * a reader is trying to do, not what the apps are like.
 */
import type { Collection, CollectionEntry } from '@grove-dev/core';
import { getOwnerAndRepoFromRepoUrl, getOwnerAvatarUrl } from '@grove-dev/core';
import { taxonomyLabel } from '@grove-dev/astro/server';

const DAY = 24 * 3600 * 1000;
/** An editor's pick older than this is not featured. */
export const REVIEW_STALE_DAYS = 180;
/** A live view whose data has not synced for this long is not featured. */
export const REFRESH_STALE_DAYS = 30;

export type IntentId = 'replace' | 'learn' | 'build' | 'activity' | 'other';

export const INTENT_GROUPS: ReadonlyArray<{ id: IntentId; title: string; blurb: string }> = [
  {
    id: 'replace',
    title: 'Replace a product',
    blurb: 'Open-source apps set side by side against the product they stand in for.',
  },
  {
    id: 'learn',
    title: 'Learn from production code',
    blurb: 'Widely used apps whose full source you can read.',
  },
  {
    id: 'build',
    title: 'Pick a build target',
    blurb: 'Apps grouped by the stack they ship with.',
  },
  {
    id: 'activity',
    title: 'See what is being worked on',
    blurb: 'Apps ranked by recent releases, pushes and commits.',
  },
  { id: 'other', title: 'More collections', blurb: '' },
];

/** Minimal slice of a synced record this module reads. */
export interface GuideRecord {
  slug: string;
  name?: string;
  logoUrl?: string;
  tags?: string[];
  platforms?: string[];
  bestFor?: string[];
  whyListed?: string[];
  caveats?: string[];
  repoUrl?: string;
  curation?: { reviewed?: boolean; reviewedAt?: string };
  distribution?: {
    channels?: Array<{ type: string; url: string; label?: string; platform?: string; verified?: boolean }>;
  };
  github?: { sync?: { syncedAt?: string } };
}

export function isEditorial(entries: CollectionEntry[]): boolean {
  return entries.some((entry) => Boolean(entry.note));
}

/** First sentence of a paragraph — the one-line takeaway on a tile. */
export function firstSentence(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const trimmed = text.trim().replace(/\s+/g, ' ');
  const match = trimmed.match(/^(.+?[.!?])(?:\s+(?=[A-Z0-9])|$)/);
  return match?.[1] ?? trimmed;
}

function subjectName(collection: Collection, subjects: Array<{ id: string; name: string }>): string | undefined {
  if (!collection.subject) return undefined;
  return subjects.find((s) => s.id === collection.subject)?.name;
}

function stackList(stacks: string[]): string {
  const labels = stacks.map((id) => taxonomyLabel('stacks', id));
  if (labels.length <= 1) return labels[0] ?? '';
  return `${labels.slice(0, -1).join(', ')} or ${labels.at(-1)}`;
}

/** Which reader intent a collection answers, from the shape of its query. */
export function intentOf(collection: Collection): IntentId {
  const stacks = collection.query?.stacks ?? [];
  if (collection.subject || collection.query?.relatedTo) return 'replace';
  if (collection.kind === 'generated' || collection.ranking?.preset === 'active') return 'activity';
  if (stacks.length > 1) return 'build';
  if (typeof collection.query?.minStars === 'number') return 'learn';
  return 'other';
}

/** The question a tile answers — the reason to open it. */
export function questionFor(
  collection: Collection,
  subjects: Array<{ id: string; name: string }>,
): string {
  const stacks = collection.query?.stacks ?? [];
  const intent = intentOf(collection);
  if (intent === 'replace') {
    const name = subjectName(collection, subjects);
    return name ? `What can I use instead of ${name}?` : collection.title;
  }
  if (intent === 'activity') {
    return stacks.length
      ? `Which ${stackList(stacks)} apps are still being worked on?`
      : 'Which open-source apps are being worked on right now?';
  }
  if (intent === 'build') return `What do real apps built with ${stackList(stacks)} look like?`;
  if (intent === 'learn') return `Which ${stackList(stacks)} apps are worth reading the source of?`;
  return collection.title;
}

/** Newest GitHub sync among a collection's entries — when a live view last changed. */
export function refreshedAt(
  entries: CollectionEntry[],
  records: Map<string, GuideRecord>,
): string | undefined {
  let newest = 0;
  for (const entry of entries) {
    const t = Date.parse(records.get(entry.slug)?.github?.sync?.syncedAt ?? '');
    if (Number.isFinite(t) && t > newest) newest = t;
  }
  return newest ? new Date(newest).toISOString() : undefined;
}

export interface Freshness {
  label: 'Reviewed' | 'Refreshed';
  date?: string;
  stale: boolean;
}

export function freshnessOf(
  collection: Collection,
  entries: CollectionEntry[],
  records: Map<string, GuideRecord>,
  now = Date.now(),
): Freshness {
  if (isEditorial(entries)) {
    const date = collection.editorial?.lastReviewedAt;
    const t = Date.parse(date ?? '');
    return {
      label: 'Reviewed',
      date,
      stale: !Number.isFinite(t) || now - t > REVIEW_STALE_DAYS * DAY,
    };
  }
  const date = refreshedAt(entries, records);
  const t = Date.parse(date ?? '');
  return {
    label: 'Refreshed',
    date,
    stale: !Number.isFinite(t) || now - t > REFRESH_STALE_DAYS * DAY,
  };
}

export function formatDate(date: string | undefined): string | undefined {
  if (!date) return undefined;
  const t = Date.parse(date);
  if (!Number.isFinite(t)) return undefined;
  return new Date(t).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * A link into the directory browse page with the collection's stack
 * filter and a matching sort applied. The browse page has no star
 * threshold or status filter, so it shows a superset — the label says so.
 */
export function browseLinkFor(
  collection: Collection,
  routeSlug: string,
): { href: string; label: string } {
  const stacks = collection.query?.stacks ?? [];
  const params = new URLSearchParams();
  for (const stack of stacks) params.append('stack', stack);
  const preset = collection.ranking?.preset;
  const sort = preset === 'active' || preset === 'recency' ? 'recently-updated' : 'most-starred';
  params.set('sort', sort);
  const what = stacks.length ? `${stackList(stacks)} apps` : 'apps';
  const how = sort === 'recently-updated' ? 'recently updated first' : 'most starred first';
  return {
    href: `/${routeSlug}/?${params.toString()}`,
    label: `Browse all ${what} in the directory, ${how}`,
  };
}

/**
 * Split a collection's rendered Markdown body so the section holding a
 * comparison table (and any context before it) can render above the
 * entries, and the rest below. Splits on `<h2` boundaries only.
 */
export function splitBody(html: string | null): {
  lead: string | null;
  rest: string | null;
  /** `id` of the h2 that heads the table's section, for a jump link. */
  tableAnchor?: string;
} {
  if (!html) return { lead: null, rest: null };
  const starts: number[] = [];
  const re = /<h2[\s>]/g;
  for (let m = re.exec(html); m; m = re.exec(html)) starts.push(m.index);
  if (!html.includes('<table')) return { lead: null, rest: html };
  const tableAt = html.lastIndexOf('<table');
  const heading = starts.filter((s) => s < tableAt).at(-1);
  const tableAnchor =
    heading === undefined ? undefined : html.slice(heading).match(/^<h2[^>]*\sid="([^"]+)"/)?.[1];
  const nextSection = starts.find((s) => s > tableAt);
  if (nextSection === undefined) return { lead: html, rest: null, tableAnchor };
  const rest = html.slice(nextSection).trim();
  return { lead: html.slice(0, nextSection).trim(), rest: rest || null, tableAnchor };
}

/** Platform labels, dropping umbrella ids when a specific one is present. */
export function platformLabels(platforms: string[] | undefined): string[] {
  const list = platforms ?? [];
  const umbrella = new Set(['desktop', 'mobile']);
  const specific = list.filter((id) => !umbrella.has(id));
  return (specific.length ? specific : list).map((id) => taxonomyLabel('platforms', id));
}

/** Square avatar for an entry: the record's logo, else the GitHub owner's avatar. */
export function avatarFor(
  record: Pick<GuideRecord, 'logoUrl' | 'repoUrl'> | undefined,
  repoHref: string | undefined,
  size = 64,
): string | undefined {
  if (record?.logoUrl) return record.logoUrl;
  const { owner } = getOwnerAndRepoFromRepoUrl(repoHref ?? record?.repoUrl ?? '');
  return getOwnerAvatarUrl(owner, size) ?? undefined;
}
