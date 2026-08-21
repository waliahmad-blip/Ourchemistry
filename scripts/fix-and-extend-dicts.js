/**
 * Repair corrupted dictionaries and merge new keys.
 *
 * Some dictionary files were saved wrapped in stray literal quotes,
 * e.g.  "{ ... }"  which is invalid JSON and breaks `import x from '*.json'`.
 * This script:
 *   1. Detects and unwraps that corruption (idempotent).
 *   2. Validates the JSON.
 *   3. Merges quiz/countdown/rot/nav.quiz keys.
 *   4. Writes clean, pretty-printed UTF-8 JSON.
 */
const fs = require('fs');
const path = require('path');

const DICT_DIR = path.join(__dirname, '..', 'dictionaries');
const extA = JSON.parse(fs.readFileSync(path.join(__dirname, 'dict-ext-a.json'), 'utf8'));
const extB = JSON.parse(fs.readFileSync(path.join(__dirname, 'dict-ext-b.json'), 'utf8'));
const EXT = { ...extA, ...extB };

/** Strip a single layer of stray surrounding quotes if present. */
function unwrap(raw) {
  let s = raw.trim();
  // Remove UTF-8 BOM if any
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  // If it literally starts with "{ and ends with }" -> drop the outer quotes
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }
  return s;
}

let fixed = 0;
let merged = 0;

const files = fs.readdirSync(DICT_DIR).filter((f) => f.endsWith('.json'));

for (const file of files) {
  const full = path.join(DICT_DIR, file);
  const locale = path.basename(file, '.json');
  const raw = fs.readFileSync(full, 'utf8');

  let dict = null;
  let wasCorrupt = false;

  // First try to parse as-is.
  try {
    dict = JSON.parse(raw);
  } catch (e) {
    // Try unwrapping stray quotes.
    const unwrapped = unwrap(raw);
    try {
      dict = JSON.parse(unwrapped);
      wasCorrupt = true;
    } catch (e2) {
      console.error(`STILL BROKEN after unwrap: ${file} -> ${e2.message}`);
      process.exitCode = 1;
      continue;
    }
  }

  if (typeof dict !== 'object' || dict === null) {
    console.error(`Not an object: ${file}`);
    process.exitCode = 1;
    continue;
  }

  // Merge extension keys if available for this locale.
  const add = EXT[locale];
  if (add) {
    dict.nav = dict.nav || {};
    dict.nav.quiz = add.navQuiz;
    dict.hero = dict.hero || {};
    dict.hero.rot = add.rot;
    dict.countdown = add.countdown;
    dict.quiz = add.quiz;
    merged++;
  } else {
    console.warn(`No extension data for ${locale}; left base keys as-is.`);
  }

  fs.writeFileSync(full, JSON.stringify(dict, null, 2) + '\n', 'utf8');
  if (wasCorrupt) fixed++;
  console.log(`${wasCorrupt ? 'repaired' : 'ok      '} ${file}`);
}

console.log(`\nDone. ${fixed} repaired, ${merged} merged with new keys.`);
