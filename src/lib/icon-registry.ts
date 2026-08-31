/**
 * Icon registry resolution — the name → asset lookup shared by
 * `components/Icon.astro` and the icon test suite.
 *
 * Kept out of the component's frontmatter so tests can assert on the
 * exact resolution the component performs instead of reimplementing
 * (and drifting from) the alias and folder rules.
 */

export type IconCategory = 'stack' | 'platform' | 'brand';
export type IconFolder = 'stacks' | 'platforms' | 'brands';

/**
 * Normalize: lowercase + replace spaces/underscores with dashes.
 *
 * Deliberately NOT `@grove-dev/core`'s `slugify`, which also strips
 * dots and other punctuation. Icon names are file names, so they must
 * survive verbatim apart from case and separator normalization.
 */
export function slugifyIconName(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-');
}

/**
 * Built-in id remaps. Stack-only by design: `category="platform"`
 * resolves straight to the file name so a consumer shipping their own
 * `public/icons/platforms/ios.svg` is never silently bypassed.
 */
const defaultAliases: Partial<Record<IconCategory, Record<string, string>>> = {
  stack: {
    ios: 'apple',
    'native-ios': 'apple',
    ipados: 'apple',
    macos: 'apple',
    'objective-c': 'apple',
    spritekit: 'apple',
    swiftui: 'apple',
    kmp: 'kotlin',
    'kotlin-multiplatform': 'kotlin',
    // Names the shipped set covers under a different file.
    'node.js': 'nodejs',
    node: 'nodejs',
    clojurescript: 'clojure',
    svelte: 'sveltekit',
  },
};

/** Stack marks that `category="platform"` should reuse rather than duplicate. */
const platformStackIcons = new Set(['docker']);

/** Platforms with no mark at all — always render the initials chip. */
export const textOnlyPlatforms = new Set(['self-host', 'self-hosted']);

export interface ResolvedIconAsset {
  /** Subfolder under the icon base path. */
  folder: IconFolder;
  /** Alias-resolved, slugified file name (no extension). */
  name: string;
  /** `${folder}/${name}` — the key used by the generated kind map. */
  key: string;
  /** True when this name is text-only and must fall back to initials. */
  textOnly: boolean;
}

/**
 * Resolve a registry id to the asset it points at.
 *
 * Lookup order: `aliases` → the built-in stack aliases → the raw
 * slugified name. Any name not covered by the shipped set simply
 * resolves to `{category-folder}/{slug}`, which is what lets consumers
 * drop their own SVGs in without touching this file.
 */
export function resolveIconAsset(
  name: string,
  category: IconCategory,
  aliases?: Record<string, string>,
): ResolvedIconAsset {
  const resolved = resolveName(name, category, aliases);
  const folder: IconFolder =
    category === 'stack' || (category === 'platform' && platformStackIcons.has(resolved))
      ? 'stacks'
      : category === 'platform'
        ? 'platforms'
        : 'brands';

  return {
    folder,
    name: resolved,
    key: `${folder}/${resolved}`,
    textOnly: category === 'platform' && textOnlyPlatforms.has(resolved),
  };
}

function resolveName(
  raw: string,
  category: IconCategory,
  aliases?: Record<string, string>,
): string {
  if (!raw) return '';
  for (const registry of [aliases, defaultAliases[category]]) {
    if (!registry) continue;
    const lower = raw.toLowerCase();
    for (const [k, v] of Object.entries(registry)) {
      if (k.toLowerCase() === lower) return slugifyIconName(v);
    }
  }
  return slugifyIconName(raw);
}
