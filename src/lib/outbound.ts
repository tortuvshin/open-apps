/**
 * Outbound links to an app's own site carry `ref=openappscout.com`, so
 * the maintainer sees Open Apps as the source in Plausible, GA, Umami
 * and similar tools (they read `ref` as the referrer when the browser
 * sends none).
 *
 * Hosts that route or sign their own URLs are left untouched: code
 * forges, app stores and package registries either ignore the parameter
 * or treat the URL as a different listing. Those still see the site in
 * their referrer data because outbound links use `rel="noopener"`, not
 * `noreferrer`.
 */
export const REF_VALUE = 'openappscout.com';

const SKIP_HOSTS = [
  'github.com',
  'gitlab.com',
  'codeberg.org',
  'bitbucket.org',
  'sr.ht',
  'apps.apple.com',
  'itunes.apple.com',
  'testflight.apple.com',
  'play.google.com',
  'f-droid.org',
  'flathub.org',
  'snapcraft.io',
  'apps.microsoft.com',
  'microsoft.com',
  'npmjs.com',
  'pypi.org',
  'crates.io',
  'hub.docker.com',
  'addons.mozilla.org',
  'chromewebstore.google.com',
  'chrome.google.com',
];

function skipped(host: string): boolean {
  const h = host.replace(/^www\./, '').toLowerCase();
  return SKIP_HOSTS.some((s) => h === s || h.endsWith(`.${s}`));
}

/** `url` with `ref=openappscout.com` added, unless the host is skipped or
 *  the URL already names a ref/utm source. Unparseable input comes back unchanged. */
export function withRef(url: string): string;
export function withRef(url: string | null | undefined): string | undefined;
export function withRef(url: string | null | undefined): string | undefined {
  if (!url) return url ?? undefined;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return url;
  if (skipped(u.hostname)) return url;
  if (u.searchParams.has('ref') || u.searchParams.has('utm_source')) return url;
  u.searchParams.set('ref', REF_VALUE);
  return u.toString();
}

/** Grove's Markdown sanitizer hardens external links to
 *  `rel="noopener noreferrer"`; drop `noreferrer` so links in reviews
 *  and collection bodies credit the site like every other outbound link. */
export function keepReferrer(html: string): string;
export function keepReferrer(html: string | null | undefined): string | null | undefined;
export function keepReferrer(html: string | null | undefined): string | null | undefined {
  return html ? html.replaceAll('rel="noopener noreferrer"', 'rel="noopener"') : html;
}
