/**
 * Record index for client-side filtering — `/{slug}/page/records.json`.
 *
 * The browse page used to inline this array in a `<script type=
 * "application/json">`. That put the entire directory into every
 * paginated page's HTML: at 300 records the browse page weighed over
 * 300 kB before a single card was read. Fetched instead, it arrives
 * once, on idle, and the browser caches it across every page of the
 * directory.
 */
import siteConfig from '@grove/generated/site-config.json';
import { getDirectoryIndexModel } from '@grove-dev/astro/server';

export function getStaticPaths() {
  const routeSlug = siteConfig.blueprintConfig?.routeSlug ?? 'projects';
  return [{ params: { slug: routeSlug } }];
}

export function GET() {
  const { clientItemsJson } = getDirectoryIndexModel(new URLSearchParams(), siteConfig);
  return new Response(clientItemsJson, {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
