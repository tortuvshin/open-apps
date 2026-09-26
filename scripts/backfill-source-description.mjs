#!/usr/bin/env node
/**
 * Backfill sourceDescription field from github.repository.description
 * for all records where github metadata exists and sourceDescription is unset.
 *
 * GitHub metadata lives in data/cache/github/<slug>.json (written by
 * `grove sync github`); a legacy inline `github` block is still read.
 *
 * Usage:
 *   node scripts/backfill-source-description.mjs [--check]
 *
 * --check : run in check mode (print what would change, don't modify files)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse, stringify } from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECORDS_DIR = path.resolve(__dirname, '../data/records');
const CACHE_DIR = path.resolve(__dirname, '../data/cache/github');

function cachedGithub(slug) {
  try {
    return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, `${slug}.json`), 'utf-8')).github;
  } catch {
    return undefined;
  }
}
const CHECK_MODE = process.argv.includes('--check');

if (CHECK_MODE) {
  console.log('🔍 Running in CHECK mode (no files will be modified)\n');
}

const files = fs.readdirSync(RECORDS_DIR).filter((f) => f.endsWith('.yml'));
let updated = 0;
let skipped = 0;
let unchanged = 0;

for (const file of files) {
  const filepath = path.join(RECORDS_DIR, file);
  const content = fs.readFileSync(filepath, 'utf-8');
  let record;

  try {
    record = parse(content);
  } catch (err) {
    console.warn(`⚠️  Failed to parse ${file}: ${err.message}`);
    skipped++;
    continue;
  }

  // Check if the record has github metadata with a description
  const github = cachedGithub(path.basename(file, '.yml')) ?? record?.github;
  const githubDescription = github?.repository?.description;
  const sourceDescription = record?.sourceDescription;

  if (!githubDescription) {
    // No GitHub description to backfill from
    unchanged++;
    continue;
  }

  if (sourceDescription) {
    // sourceDescription already set, don't override
    unchanged++;
    continue;
  }

  // Backfill the field
  if (!record.sourceDescription) {
    record.sourceDescription = githubDescription;
  }

  if (!CHECK_MODE) {
    // Preserve YAML formatting: use custom replacer to maintain key order
    const updated_yaml = stringifyRecord(record);
    fs.writeFileSync(filepath, updated_yaml, 'utf-8');
    console.log(`✅ ${file}: added sourceDescription`);
  } else {
    console.log(`📝 ${file}: would add sourceDescription`);
    console.log(`   "${githubDescription.substring(0, 60)}${githubDescription.length > 60 ? '...' : ''}"`);
  }
  updated++;
}

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${updated} updated, ${unchanged} unchanged, ${skipped} skipped`);
console.log('='.repeat(60));

if (CHECK_MODE) {
  console.log('(Run without --check to apply changes)');
}

/**
 * Stringify a record to YAML with preserved key order and formatting.
 * Ensures 'kind', 'name', 'slug', 'description' come first, then new fields.
 */
function stringifyRecord(record) {
  // Reorder keys to keep the most important ones first
  const orderedKeys = [
    'kind',
    'name',
    'slug',
    'description',
    'summary',       // New field — should appear right after description
    'sourceDescription', // New field — should appear next
    'category',
    'tags',
    'stack',
    'platforms',
    'projectType',
    'repoUrl',
    'links',
    'bestFor',
    'whyListed',
    'caveats',
    'difficulty',
    'codebaseSize',
    'distribution',
    'screenshots',   // New field — appear with other media
    'source',
    'curation',
    'visibility',
    'github',
    'health',
    'scores',
  ];

  const ordered = {};
  for (const key of orderedKeys) {
    if (key in record) {
      ordered[key] = record[key];
    }
  }
  // Add any keys not in the explicit list (shouldn't happen, but just in case)
  for (const key in record) {
    if (!(key in ordered)) {
      ordered[key] = record[key];
    }
  }

  return stringify(ordered, { indent: 2, lineWidth: -1 });
}
