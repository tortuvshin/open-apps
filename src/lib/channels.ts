/**
 * Install / try links for a record's detail page.
 *
 * Records list where an app can be installed or tried under
 * `distribution.channels`. Only channels a curator marked `verified: true`
 * are published; unverified ones stay in the data as review candidates.
 * The source repository is never presented as an install option, since
 * the page already links to it as "Source code".
 *
 * Channel names come from `data/taxonomy/distribution-channels.yml`; the
 * verbs and aliases below are this site's copy.
 */
import { taxonomyLabel } from '@grove-dev/astro/server';
import { withRef } from './outbound';

export interface RawChannel {
  type: string;
  url: string;
  label?: string;
  platform?: string;
  verified?: boolean;
}

export interface InstallChannel {
  type: string;
  url: string;
  /** Store or channel name, e.g. "App Store", "F-Droid". */
  label: string;
  /** Button copy, e.g. "Get it on F-Droid". */
  action: string;
  platform?: string;
  /** Hostname shown as the external-link hint. */
  host: string;
}

/** Legacy or free-form types mapped onto the taxonomy ids. */
const TYPE_ALIASES: Record<string, string> = {
  snap: 'snapcraft',
  flatpak: 'flathub',
  'docker-compose': 'self-host',
  docker: 'self-host',
  cloud: 'web-app',
  web: 'web-app',
};

/** Store-style channels read "Get it on …". */
const STORE_TYPES = new Set([
  'app-store',
  'play-store',
  'fdroid',
  'flathub',
  'snapcraft',
  'microsoft-store',
  'testflight',
]);

function actionFor(type: string, label: string, host: string): string {
  if (STORE_TYPES.has(type)) return `Get it on ${label}`;
  if (type === 'web-app') return `Try ${label}`;
  if (type === 'github-releases') return 'Download from GitHub Releases';
  if (type === 'apk') return 'Download APK';
  if (type === 'website') return host ? `Download from ${host}` : label;
  return label;
}

/**
 * Ordering for the primary CTA: a store or web app beats a download page,
 * which beats self-hosting instructions or an "other" link. Curator order
 * is kept within each rank.
 */
function rankOf(type: string): number {
  if (STORE_TYPES.has(type) || type === 'web-app') return 0;
  if (type === 'github-releases' || type === 'apk' || type === 'website') return 1;
  if (type === 'self-host') return 2;
  return 3;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** A bare repository URL (github.com/owner/repo) is source code, not an install. */
function isRepositoryUrl(url: string, repoUrl?: string | null): boolean {
  const normalize = (u: string) => u.replace(/\/+$/, '').toLowerCase();
  if (repoUrl && normalize(url) === normalize(repoUrl)) return true;
  try {
    const u = new URL(url);
    return u.hostname === 'github.com' && u.pathname.replace(/\/+$/, '').split('/').length === 3;
  } catch {
    return false;
  }
}

export function normalizeChannelType(type: string): string {
  const t = type.trim().toLowerCase();
  return TYPE_ALIASES[t] ?? t;
}

export function getInstallChannels(
  channels: readonly RawChannel[] | undefined,
  repoUrl?: string | null,
): InstallChannel[] {
  const seen = new Set<string>();
  const out: InstallChannel[] = [];
  for (const channel of channels ?? []) {
    if (!channel?.verified || !channel.url) continue;
    if (isRepositoryUrl(channel.url, repoUrl)) continue;
    const key = `${channel.url}|${channel.platform ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const type = normalizeChannelType(channel.type);
    const label = channel.label?.trim() || taxonomyLabel('distributionChannels', type);
    const host = hostOf(channel.url);
    out.push({
      type,
      url: withRef(channel.url),
      label,
      action: actionFor(type, label, host),
      platform: channel.platform,
      host,
    });
  }
  // Array.prototype.sort is stable, so curator order survives within a rank.
  return out.sort((a, b) => rankOf(a.type) - rankOf(b.type));
}
