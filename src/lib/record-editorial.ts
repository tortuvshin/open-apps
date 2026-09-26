/**
 * Editorial choices for a record's detail page: what the header says in
 * one sentence, which single verdict and caveat it surfaces, when the
 * "Editorially verified" badge applies, and which collections the page
 * leads to next.
 *
 * Nothing here writes copy. Every string comes from the record's own
 * curated fields; this module only chooses among them.
 */

/**
 * Split the curated summary into a one-sentence lead for the header and
 * the remainder, which opens the article instead of being dropped.
 * A sentence ends at `.`, `!` or `?` followed by a space and a capital
 * letter, so "v5.3" and "e.g. the" do not split.
 */
export function splitLead(summary: string): { lead: string; rest: string } {
  const text = summary.trim();
  const match = /[.!?](?=\s+[A-Z])/.exec(text);
  if (!match) return { lead: text, rest: '' };
  const end = match.index + 1;
  return { lead: text.slice(0, end), rest: text.slice(end).trim() };
}

export interface Verdict {
  /** The curator's reason for listing the record: `whyListed[0]`. */
  verdict?: string;
  /** The one caveat a reader should see first: `caveats[0]`. */
  caveat?: string;
}

/**
 * One verdict and one caveat, each the curator's first item. The summary
 * already leads the header, so it is not repeated as a verdict.
 */
export function pickVerdict(whyListed: readonly string[], caveats: readonly string[]): Verdict {
  const verdict = whyListed.find((item) => item.trim());
  const caveat = caveats.find((item) => item.trim());
  return {
    ...(verdict ? { verdict: verdict.trim() } : {}),
    ...(caveat ? { caveat: caveat.trim() } : {}),
  };
}

/**
 * "Editorially verified" is a statement that a person reviewed the
 * record — only `curation.reviewed: true` earns it. A review date on an
 * unreviewed record (an import timestamp) does not.
 */
export function editorialReview(
  curation: { reviewed?: boolean; reviewedAt?: string } | undefined,
): { verified: boolean; reviewedAt?: string; reviewedLabel?: string } {
  if (!curation?.reviewed) return { verified: false };
  const reviewedAt = curation.reviewedAt ? String(curation.reviewedAt) : undefined;
  const date = reviewedAt ? new Date(reviewedAt) : undefined;
  if (!reviewedAt || !date || Number.isNaN(date.getTime())) return { verified: true };
  const reviewedLabel = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return { verified: true, reviewedAt, reviewedLabel };
}

export interface SimilarCollection {
  slug: string;
  title: string;
  url: string;
  description?: string;
}

interface CollectionLike {
  slug: string;
  kind?: string;
  title: string;
  description?: string;
  subject?: string;
  entries?: Array<{ slug: string }>;
}

/**
 * Up to `limit` collections that actually contain the record, most
 * editorial first: the comparison hub for a subject the record relates
 * to, then collections where a curator picked it by hand, then curated
 * queries, then generated lists.
 */
export function similarCollections(
  recordSlug: string,
  membership: ReadonlyArray<{ slug: string; title: string; url: string }>,
  collections: readonly CollectionLike[],
  relatedSubjects: readonly string[],
  limit = 3,
): SimilarCollection[] {
  const bySlug = new Map(collections.map((collection) => [collection.slug, collection]));
  const rank = (slug: string) => {
    const collection = bySlug.get(slug);
    if (!collection) return 4;
    if (collection.subject && relatedSubjects.includes(collection.subject)) return 0;
    if (collection.entries?.some((entry) => entry.slug === recordSlug)) return 1;
    if (collection.kind === 'curated') return 2;
    return 3;
  };
  return membership
    .map((item, index) => ({ item, index, rank: rank(item.slug) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => {
      const description = bySlug.get(item.slug)?.description?.trim();
      return { ...item, ...(description ? { description } : {}) };
    });
}
