// ── LOCALE CLONER: bilingual promos without divergence ──────────────────────
// Pattern: ONE locale is the untouchable MASTER (e.g. src/scenes + your main
// composition). Every other locale is a CLONE (e.g. src/es/scenes + its own
// composition) sharing ONLY the engine (src/lib, src/theme).
// This script re-clones scene files and applies a replacement MAP. Every
// replacement MUST match — if the master changed and a string is gone, the
// script FAILS LOUDLY (the clone can never silently drift out of sync).
// It OVERWRITES the clone dir: locale edits belong in the map, not the files.
//
// Run:  node scripts/clone-locale.mjs locales/es.mjs
// See locales/example.es.mjs for the map format.

import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapPath = process.argv[2];
if (!mapPath) {
  console.error("Usage: node scripts/clone-locale.mjs <locales/xx.mjs>");
  process.exit(1);
}

const { srcDir, dstDir, importRewrite, files } = (
  await import(pathToFileURL(path.resolve(DIR, mapPath)).href)
).default;

const SRC = path.resolve(DIR, srcDir);
const DST = path.resolve(DIR, dstDir);
fs.mkdirSync(DST, { recursive: true });

for (const [file, subs] of Object.entries(files)) {
  let t = fs.readFileSync(path.join(SRC, file), "utf8");
  for (const [a, b] of importRewrite ?? []) t = t.split(a).join(b);
  for (const [a, b] of subs) {
    if (a === b) continue;
    if (!t.includes(a)) throw new Error(file + " :: NOT FOUND: " + a);
    t = t.split(a).join(b);
  }
  fs.writeFileSync(path.join(DST, file), t);
  console.log("✓ " + path.join(dstDir, file));
}
console.log("Locale clone done. Remember: re-generate + re-measure the voice");
console.log("lines for this locale (other languages run longer/shorter) and");
console.log("stretch scene durations in the locale composition accordingly.");
