// scripts/merge-ext.js
// Deep-merges every scripts/ext-*.json into dictionaries/<locale>.json.
// Rules: never deletes existing keys; ext files are the source of truth
// for the keys they define. Run: node scripts/merge-ext.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXT_DIR = path.join(ROOT, 'scripts');
const DICT_DIR = path.join(ROOT, 'dictionaries');

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], val);
    } else {
      target[key] = val; // leaf string — add or overwrite
    }
  }
  return target;
}

const extFiles = fs
  .readdirSync(EXT_DIR)
  .filter((f) => /^ext-.*\.json$/.test(f))
  .sort();

let localeCount = 0;

for (const file of extFiles) {
  const raw = JSON.parse(fs.readFileSync(path.join(EXT_DIR, file), 'utf8'));
  for (const [locale, payload] of Object.entries(raw)) {
    const dictPath = path.join(DICT_DIR, `${locale}.json`);
    if (!fs.existsSync(dictPath)) {
      console.warn(`! skipping ${locale}: no dictionaries/${locale}.json`);
      continue;
    }
    const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    deepMerge(dict, payload);
    fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2) + '\n', 'utf8');
    localeCount++;
    console.log(`ok ${file} -> dictionaries/${locale}.json`);
  }
}

console.log(`merged ${localeCount} locales`);
if (localeCount !== 10) console.warn(`! expected 10 locales, got ${localeCount}`);