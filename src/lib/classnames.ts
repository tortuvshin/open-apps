/**
 * Button / chip class builders — the single source for interactive
 * control styling.
 *
 * Plain TS (not an .astro component) on purpose: `DirectoryIndexClient`
 * rebuilds pagination links and active-filter chips in CLIENT-side JS,
 * and those class strings must stay byte-identical with the server
 * render. Both sides import these builders, so they cannot drift.
 *
 * Variant semantics (see styles.css):
 * - `primary`   — the brand action (config `theme.primaryColor`).
 * - `secondary` — default chrome buttons.
 * - `outline` / `ghost` — quieter chrome.
 * - `selected`  — "you are here" state (active filter, current lens,
 *   current page). Neutral inversion via the `selected` tokens —
 *   deliberately NOT the brand primary, so green never doubles as a
 *   selection indicator.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'selected';
/** `bare` emits no size classes — pass custom geometry via `extra`. */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'bare';

const BASE =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius)] border border-transparent font-medium leading-none no-underline outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35';

/**
 * `md`/`lg` guarantee a ≥44px hit target on small viewports
 * (`max-sm:min-h-11`) while keeping the compact desktop height.
 */
const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-3 text-sm max-sm:min-h-11',
  lg: 'h-11 px-4 text-sm',
  bare: '',
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'border-border bg-secondary text-foreground hover:bg-accent',
  outline: 'border-border bg-transparent text-foreground hover:bg-accent',
  ghost: 'text-foreground hover:bg-accent',
  selected: 'bg-selected text-selected-foreground hover:bg-selected/90',
};

export function buttonClass(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'sm',
  extra = '',
): string {
  return [BASE, SIZES[size], VARIANTS[variant], extra].filter(Boolean).join(' ');
}

/**
 * Layout extras for pagination controls — shared by `Pagination.astro`
 * and the client-side pagination rebuild in `DirectoryIndexClient`.
 */
export const PAGINATION_EXTRA = 'min-w-9 px-2 py-1.5 text-2xs';

/**
 * The dead end of a pagination row — "Previous" on page 1.
 *
 * Dimming to `opacity-40` put it at 3.37:1 against the dark surface,
 * which is a contrast failure, not a disabled state. 60% still reads
 * as unavailable and clears 4.5:1.
 */
export const PAGINATION_DISABLED = 'pointer-events-none opacity-60';

/**
 * Facet filter trigger (the "Stack: Any" dropdown buttons). Includes
 * the `grove-filter-trigger` hook class because the client script
 * reassigns the whole className when the active state changes — the
 * hook must survive that reassignment.
 */
export function filterTriggerClass(active: boolean): string {
  return [
    'grove-filter-trigger',
    BASE,
    'h-9 px-3 text-[0.8125rem] max-sm:min-h-11',
    active ? `${VARIANTS.selected} hover:text-selected-foreground` : VARIANTS.secondary,
  ].join(' ');
}

/**
 * Lens tab (the All / Hot / Mature row). Same geometry as the filter
 * trigger; `data-lens-id` targeting keeps its own hook attribute.
 */
export function lensTabClass(active: boolean): string {
  return [
    BASE,
    'h-9 px-3 text-[0.8125rem] max-sm:min-h-11',
    active ? `${VARIANTS.selected} hover:text-selected-foreground` : VARIANTS.secondary,
  ].join(' ');
}

/**
 * Active-filter chip (the removable "Stack: Python ×" pills). One
 * definition for the server render and the client rebuild.
 */
export function chipClass(extra = ''): string {
  return [
    'inline-flex min-h-5 items-center justify-center gap-1 rounded-full border border-transparent bg-secondary px-2 py-0.5 align-middle text-xs font-medium leading-none text-secondary-foreground transition-colors hover:border-ink-400',
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}
