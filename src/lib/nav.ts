/**
 * Primary navigation for the header: two menus (Browse, Collections)
 * and two plain links. Grove's `site.nav` is a flat list, so the menu
 * structure lives here; collection entries come from the collection
 * files so a new collection shows up without touching this file.
 */
import { loadCollections } from '@grove-dev/astro/server';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavMenu {
  label: string;
  href: string;
  /** Path prefixes that mark this item as the current section. */
  match: string[];
  items?: NavLink[];
  footer?: NavLink;
}

let cached: NavMenu[] | null = null;

export async function primaryNav(routeSlug = 'apps'): Promise<NavMenu[]> {
  if (cached) return cached;
  const collections = await loadCollections(process.cwd());
  const directory = `/${routeSlug}/`;
  cached = [
    {
      label: 'Browse',
      href: directory,
      match: [directory, '/categories/', '/stacks/', '/licenses/'],
      items: [
        { label: 'All apps', href: directory, description: 'Search and filter the whole directory' },
        { label: 'Recently added', href: `${directory}?sort=recently-added`, description: 'The newest apps first' },
        { label: 'Most starred', href: `${directory}?sort=most-starred`, description: 'Ranked by GitHub stars' },
        { label: 'Categories', href: '/categories/', description: 'Productivity, finance, tools and more' },
        { label: 'Stacks', href: '/stacks/', description: 'Flutter, Swift, React Native, Tauri…' },
      ],
    },
    {
      label: 'Collections',
      href: '/collections/',
      match: ['/collections/'],
      items: collections
        .map((c) => ({
          label: c.title,
          href: `/collections/${c.slug}/`,
          description: c.description,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      footer: { label: 'All collections', href: '/collections/' },
    },
    { label: 'Community', href: '/contributors/', match: ['/contributors/'] },
    { label: 'About', href: '/about/', match: ['/about/'] },
  ];
  return cached;
}

export function isCurrent(menu: NavMenu, pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return menu.match.some((prefix) => path.startsWith(prefix));
}
