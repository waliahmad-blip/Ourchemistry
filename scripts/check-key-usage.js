/**
 * Crone shouoss-check 2: static usage analysis.
 * Scans components/ and app/ for `dict.<path>` (and aliased `data.<path>`
 * inside ChemistryQuiz) references and verifies each path resolves in
 * every dictionary.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIRS = ['components', 'app'];
const USAGE_RE = /\b(?:dict|data)\.([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)/g;

function collectFiles(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collectFiles(p, out);
    else if (/\.(jsx?|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

function exists(dict, keyPath) {
  let cur = dict;
  for (const part of keyPath.split('.')) {
    if (cur == null || typeof cur !== 'object' || !(part in cur)) return false;
    cur = cur[part];
  }
  return cur !== undefined;
}

// Load dictionaries
const DICT_DIR = path.join(ROOT, 'dictionaries');
const dicts = {};
for (const f of fs.readdirSync(DICT_DIR).filter((f) => f.endsWith('.json'))) {
  dicts[path.basename(f, '.json')] = JSON.parse(fs.readFileSync(path.join(DICT_DIR, f), 'utf8'));
}

// Collect usages
const used = new Map(); // keyPath -> Set(files)
for (const dir of DIRS) {
  for (const file of collectFiles(path.join(ROOT, dir))) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    if (rel.startsWith('app/api/')) continue; // `data` there is storage, not i18n
    const src = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = USAGE_RE.exec(src)) !== null) {
      // Only in ChemistryQuiz does `data` alias `dict.quiz`;
      // elsewhere (e.g. VoiceDNACapture, api routes) `data` is not i18n.
      let key;
      if (m[0].startsWith('data.')) {
        if (!rel.includes('ChemistryQuiz')) continue;
        key = `quiz.${m[1]}`;
      } else {
        key = m[1];
      }
      if (!used.has(key)) used.set(key, new Set());
      used.get(key).add(rel);
    }
  }
}

console.log(`Found ${used.size} unique dictionary key paths in code.\n`);

let problems = 0;
for (const [key, files] of [...used.entries()].sort()) {
  const missingIn = Object.keys(dicts).filter((loc) => !exists(dicts[loc], key));
  if (missingIn.length) {
    problems++;
    console.log(`MISSING "${key}" in: ${missingIn.join(', ')}  (used by ${[...files].join(', ')})`);
  } else {
    console.log(`ok  ${key}`);
  }
}

console.log(problems ? `\nFAILED: ${problems} key path(s) missing.` : '\nAll referenced keys exist in all 10 locales.');
process.exit(problems ? 1 : 0);
