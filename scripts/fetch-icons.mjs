#!/usr/bin/env node

// SPDX-License-Identifier: MIT


// scripts/fetch-icons.mjs
//
// Downloads brand icons from the public `xandemon/developer-icons`
// repository (CC0 licensed) and saves them to `public/icons/` so
// Astro can serve them as static assets.
//
// Run automatically before build/dev via the npm "icons" script.
//
// To add a new icon: extend the ICONS map below.

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_BASE = join(ROOT, "public", "icons");

const SOURCE = "https://raw.githubusercontent.com/xandemon/developer-icons/main/icons";

// Map of { file, target, label }
//   file   = filename in the developer-icons repo
//   target = relative path under public/icons/ where we save it
//   label  = friendly name for logging
//   custom = true → do not download, expect the SVG to already be
//            authored by hand under public/icons/<target>.
const ICONS = [
  // ── Tech stacks (developer-icons provides most) ───────────────────
  { file: "flutter.svg",      target: "stacks/flutter.svg",      label: "Flutter" },
  { file: "dart.svg",         target: "stacks/dart.svg",         label: "Dart" },
  { file: "reactjs.svg",      target: "stacks/react.svg",        label: "React" },
  { file: "reactjs.svg",      target: "stacks/react-native.svg", label: "React Native (uses React icon)" },
  { file: "kotlin.svg",       target: "stacks/kotlin.svg",       label: "Kotlin" },
  { file: "swift.svg",        target: "stacks/swift.svg",        label: "Swift" },
  { file: "java.svg",         target: "stacks/java.svg",         label: "Java" },
  { file: "typescript.svg",   target: "stacks/typescript.svg",   label: "TypeScript" },
  { file: "javascript.svg",   target: "stacks/javascript.svg",   label: "JavaScript" },
  { file: "firebase.svg",     target: "stacks/firebase.svg",     label: "Firebase" },
  { file: "nodejs.svg",       target: "stacks/nodejs.svg",       label: "Node.js" },
  { file: "python.svg",       target: "stacks/python.svg",       label: "Python" },
  { file: "mongodb.svg",      target: "stacks/mongodb.svg",      label: "MongoDB" },
  { file: "graphql.svg",      target: "stacks/graphql.svg",      label: "GraphQL" },
  { file: "tensorflow.svg",   target: "stacks/tensorflow.svg",   label: "TensorFlow" },
  { file: "solidity.svg",     target: "stacks/solidity.svg",     label: "Solidity" },
  { file: "rust-light.svg",   target: "stacks/rust.svg",         label: "Rust" },
  {
    file: null,
    target: "stacks/tauri.svg",
    label: "Tauri (Simple Icons, CC0)",
    custom: true,
  },
  // Android as a stack (used by the StackGrid). The platforms/android.svg
  // is the same upstream file, but the StackGrid renders from the stacks
  // category so we keep a separate copy.
  { file: "android.svg",      target: "stacks/android.svg",      label: "Android (stack)" },
  // iOS as a stack uses the same apple variants as the platform iOS chip.
  // The Icon component is theme-aware for `ios` and looks for apple-dark +
  // apple-light in the active category directory.
  { file: "apple-dark.svg",   target: "stacks/apple-dark.svg",   label: "iOS / Apple (dark, stack)" },
  { file: "apple-light.svg",  target: "stacks/apple-light.svg",  label: "iOS / Apple (light, stack)" },
  // Hand-rolled (no upstream equivalent)
  { file: null,               target: "stacks/ionic.svg",        label: "Ionic (custom shield)",        custom: true },
  { file: null,               target: "stacks/capacitor.svg",    label: "Capacitor (hand-rolled brand)", custom: true },

  // ── Platforms (developer-icons has android/apple/linux) ──────────
  { file: "android.svg",      target: "platforms/android.svg",   label: "Android" },
  { file: "apple-dark.svg",   target: "platforms/apple-dark.svg", label: "Apple (dark)" },
  { file: "apple-light.svg",  target: "platforms/apple-light.svg", label: "Apple (light)" },
  { file: "linux.svg",        target: "platforms/linux.svg",     label: "Linux" },
  { file: "chrome.svg",       target: "platforms/chrome.svg",    label: "Chrome / Web" },
  { file: "ubuntu.svg",       target: "platforms/ubuntu.svg",    label: "Ubuntu" },

  // Also alias the apple icons to iOS / macOS / desktop so the
  // Icon.astro component can find them by friendly name.
  { file: "apple-dark.svg",   target: "platforms/ios.svg",       label: "iOS (alias of apple-dark)" },
  { file: "apple-light.svg",  target: "platforms/macos.svg",     label: "macOS (alias of apple-light)" },
];

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function download(url, dest) {
  if (await exists(dest)) return false; // already cached
  const res = await fetch(url, {
    headers: { "user-agent": "open-apps-web/0.1 (https://github.com/tortuvshin/open-apps)" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.ok} ${res.statusText} for ${url}`);
  }
  const body = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, body);
  return true;
}

async function main() {
  console.log("[icons] fetching from xandemon/developer-icons …");
  let downloaded = 0;
  let cached = 0;
  const errors = [];

  // Dedupe by `target` (multiple aliases can share a file). Only fetch
  // each unique target once, but use the first file as the source.
  const seen = new Set();
  const queue = ICONS.filter((it) => {
    if (seen.has(it.target)) return false;
    seen.add(it.target);
    return true;
  });

  for (const it of queue) {
    const dest = join(OUT_BASE, it.target);
    try {
      if (it.custom) {
        // Hand-rolled SVG. Verify it exists, then move on.
        if (!(await exists(dest))) {
          throw new Error(`expected custom SVG at ${dest}`);
        }
        console.log(`  ✎ ${it.label.padEnd(36)} ${it.target}`);
        continue;
      }
      const wasDownloaded = await download(`${SOURCE}/${it.file}`, dest);
      if (wasDownloaded) {
        downloaded++;
        console.log(`  ↓ ${it.label.padEnd(36)} ${it.target}`);
      } else {
        cached++;
      }
    } catch (err) {
      errors.push({ target: it.target, error: err.message });
    }
  }

  console.log(
    `[icons] done — ${downloaded} fetched, ${cached} cached` +
      (errors.length ? `, ${errors.length} errors` : ""),
  );
  if (errors.length) {
    for (const e of errors) console.error(`  ! ${e.target}: ${e.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[icons] fatal:", err);
  process.exit(1);
});
