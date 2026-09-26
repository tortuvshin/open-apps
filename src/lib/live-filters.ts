/**
 * Live-filter logic for the browse page. These are the pieces of
 * behaviour that do not need a DOM: URL building, the history-session
 * decision, the labels the page speaks, a debounce and the focus
 * fallback index.
 *
 * They live here, not inline in the `.astro` scripts, so they can be
 * unit-tested. RefinePanel, FilterDrawer and DirectoryIndexClient
 * import them.
 */

/** The facet groups a scope can fix (core's `DirectoryFilterGroupKey`). */
export type ScopeGroup = 'stacks' | 'platforms' | 'categories' | 'tags' | 'licenses';

/**
 * A fixed slice of the directory that a page browses inside, keyed by
 * facet group: `{ stacks: ['flutter'] }` on `/stacks/flutter/`,
 * `{ categories: ['productivity'] }` on `/categories/productivity/`.
 *
 * A scope is not a filter the visitor chose. It is merged into every
 * query, but it never shows as a chip or a facet, and it never goes in
 * the URL: the page's own path already says it. So clearing filters,
 * the zero-results reset and Back/Forward can never drop it.
 */
export type DirectoryScope = Partial<Record<ScopeGroup, readonly string[]>>;

/** The facet groups a scope fixes. Groups with no values do not count. */
export function scopedGroups(scope: DirectoryScope | null | undefined): ScopeGroup[] {
  if (!scope) return [];
  return (Object.keys(scope) as ScopeGroup[]).filter((key) => (scope[key]?.length ?? 0) > 0);
}

/**
 * Drop the scoped groups from a filter state read off the URL. On
 * `/stacks/flutter/?stack=react` the `stack` parameter is ignored:
 * the page is Flutter, whatever the query says.
 */
export function withoutScope<F extends Partial<Record<ScopeGroup, unknown>>>(
  filters: F,
  scope: DirectoryScope | null | undefined,
): F {
  const groups = scopedGroups(scope);
  if (groups.length === 0) return filters;
  const next = { ...filters };
  for (const group of groups) delete next[group];
  return next;
}

/**
 * The query string with the scoped groups' parameters removed, or
 * `null` when there was nothing to remove. The page uses it to tidy a
 * hand-written URL like `/stacks/flutter/?stack=react&platform=ios`.
 *
 * `paramKeys` maps a group to its URL key. Callers pass core's
 * `DIRECTORY_FILTER_KEYS`, so this file needs no package import.
 */
export function searchWithoutScope(
  search: string,
  scope: DirectoryScope | null | undefined,
  paramKeys: Readonly<Record<ScopeGroup, string>>,
): string | null {
  const groups = scopedGroups(scope);
  const params = new URLSearchParams(search);
  let changed = false;
  for (const group of groups) {
    const key = paramKeys[group];
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  }
  if (!changed) return null;
  const query = params.toString();
  return query ? `?${query}` : '';
}

/**
 * URL for one facet group's new selection. Every other parameter in
 * `search` is kept, so the query, other groups, sort and lens survive.
 * The group's key is rewritten and `page` is dropped, because a
 * different result set starts on page 1.
 *
 * This is the same URL shape the page has always used: a repeated key
 * per value. Existing links keep working.
 */
export function hrefForGroupSelection(
  search: string,
  pathPrefix: string,
  paramKey: string,
  values: readonly string[],
): string {
  const params = new URLSearchParams(search);
  params.delete(paramKey);
  params.delete('page');
  for (const value of values) if (value) params.append(paramKey, value);
  const query = params.toString();
  return query ? `${pathPrefix}?${query}` : pathPrefix;
}

/**
 * Whether the browse page can show `target` in place, or must really
 * navigate to it.
 *
 * A URL with a query is always a client view of the list, so it can
 * be shown in place. A URL with no query is a prerendered document.
 * On page 1 of the same list that is the document already on screen,
 * so clearing the last filter can still happen in place, keeping focus
 * and an open drawer. From `/{slug}/page/2/`, or for a different path,
 * it is a different document and has to load for real. Otherwise page
 * 2's records would sit under the page-1 URL.
 */
export function canAdoptInPlace(
  target: { pathname: string; search: string },
  currentPathname: string,
  routePage: number,
): boolean {
  if (target.search) return true;
  const strip = (path: string) => path.replace(/\/$/, '');
  return strip(target.pathname) === strip(currentPathname) && routePage <= 1;
}

/** What a filter change does to the history stack. */
export type HistoryMode = 'push' | 'replace';

/** Where the history stood when a filter session opened. */
export interface HistorySnapshot {
  url: string;
  scrollY: number;
}

/**
 * The history entries a closing session has to write: put `start` back
 * on the current entry, then push `end`.
 */
export interface HistoryCommit {
  start: HistorySnapshot;
  end: string;
}

/**
 * One "filter session": the time a filter surface (a facet popover or
 * the mobile drawer) is open.
 *
 * While a session is open, each change replaces the current history
 * entry, so ticking five checkboxes does not leave five Back steps.
 * When the last surface closes and the URL has changed, the caller
 * restores the starting URL on the current entry and pushes the final
 * one. That is one pushState per session, and Back goes to the result
 * set from before the session.
 *
 * Surfaces nest: a popover can open inside the drawer. The session
 * only ends when every surface has closed.
 */
export class FilterHistorySession {
  #open = new Set<string>();
  #start: HistorySnapshot | null = null;

  /** True while at least one filter surface is open. */
  get active(): boolean {
    return this.#open.size > 0;
  }

  /** A surface opened. The first one records where history stood. */
  open(surface: string, snapshot: HistorySnapshot): void {
    if (this.#open.size === 0) this.#start = snapshot;
    this.#open.add(surface);
  }

  /** How a filter change made now should write to history. */
  modeForChange(): HistoryMode {
    return this.active ? 'replace' : 'push';
  }

  /**
   * A surface closed. Returns the commit to write when this ended the
   * session and the URL changed during it. Otherwise returns `null`:
   * another surface is still open, the surface was not open, or
   * nothing changed.
   */
  close(surface: string, currentUrl: string): HistoryCommit | null {
    if (!this.#open.delete(surface) || this.#open.size > 0) return null;
    const start = this.#start;
    this.#start = null;
    if (!start || sameUrl(start.url, currentUrl)) return null;
    return { start, end: currentUrl };
  }

  /**
   * Back/Forward moved to another entry while a surface was open. The
   * new entry becomes the session's starting point: later changes
   * replace it, and closing pushes one entry after it. When no session
   * is open this does nothing.
   */
  rebase(snapshot: HistorySnapshot): void {
    if (this.active) this.#start = snapshot;
  }
}

/** Compare two same-origin URLs, ignoring a trailing slash on the path. */
function sameUrl(a: string, b: string): boolean {
  const left = new URL(a, 'https://grove.invalid');
  const right = new URL(b, 'https://grove.invalid');
  const path = (url: URL) => url.pathname.replace(/\/$/, '');
  return path(left) === path(right) && left.search === right.search;
}

/** `1 app`, `12 apps`. */
export function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * What the polite live region says after the results change. It is a
 * whole sentence because a screen reader hears it without the visible
 * heading around it.
 */
export function resultsAnnouncement(count: number, singular: string, plural: string): string {
  if (count === 0) return `No ${plural} match these filters.`;
  return `${countLabel(count, singular, plural)} found.`;
}

/**
 * Label for the mobile drawer's results button. The button shows the
 * results. It does not apply anything, because every change has
 * already applied.
 */
export function showResultsLabel(
  count: number,
  singular: string,
  plural: string,
  pending = false,
): string {
  if (pending) return 'Updating results…';
  if (count === 0) return `No ${plural} match`;
  return `Show ${countLabel(count, singular, plural)}`;
}

/** A trailing-edge debounce that can also be cancelled. */
export interface Debounced<Args extends unknown[]> {
  (...args: Args): void;
  cancel(): void;
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Args) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  return debounced;
}

/**
 * When a list re-renders under a focused item (for example, removing
 * the focused chip), this picks which item gets focus next. The answer
 * is the item that took the old one's place, or the new last item.
 * Returns `-1` when the list is empty and the caller has to fall back
 * to something else.
 */
export function focusIndexAfterRender(previousIndex: number, length: number): number {
  if (length <= 0) return -1;
  return Math.min(Math.max(previousIndex, 0), length - 1);
}
