/**
 * Who submitted each app, read from `submittedBy` in
 * `content/records/<slug>.md`.
 *
 * Grove's record schema drops fields it does not know, so the value
 * never reaches `records.json`; this reads the frontmatter directly at
 * build time. The value is a GitHub login.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const RECORDS_DIR = join(process.cwd(), 'content/records');
const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

let cache: Map<string, string> | null = null;

/** slug → GitHub login, for every record that names a submitter. */
export function submitters(): Map<string, string> {
  if (cache) return cache;
  cache = new Map();
  for (const file of readdirSync(RECORDS_DIR)) {
    if (!file.endsWith('.md')) continue;
    const match = readFileSync(join(RECORDS_DIR, file), 'utf8').match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;
    const login = String((parse(match[1]) as { submittedBy?: unknown })?.submittedBy ?? '').trim().replace(/^@/, '');
    if (LOGIN.test(login)) cache.set(file.slice(0, -3), login);
  }
  return cache;
}

export function submitterOf(slug: string): string | undefined {
  return submitters().get(slug);
}

/** login → slugs of the apps they submitted. */
export function appsBySubmitter(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const [slug, login] of submitters()) {
    const key = login.toLowerCase();
    out.set(key, [...(out.get(key) ?? []), slug]);
  }
  return out;
}
