/**
 * Cross-check 1: dictionary structural integrity.
 * - every dictionary must have the exact same deep key structure
 * - no empty strings, no U+FFFD mojibake
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'dictionaries');

function keyPaths(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...keyPaths(v, p));
    else out.push(p);
  }
  return out.sort();
}

const dicts = {};
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  dicts[path.basename(f, '.json')] = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
}

const reference = keyPaths(dicts.en);
console.log(`en key count: ${reference.length}\n`);

let problems = 0;
for (const [loc, d] of Object.entries(dicts)) {
  const keys = keyPaths(d);
  const missing = reference.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !reference.includes(k));
  if (missing.length || extra.length) {
    problems++;
    console.log(`${loc}: MISMATCH`);
    if (missing.length) console.log('  missing:', missing.join(', '));
    if (extra.length) console.log('  extra:  ', extra.join(', '));
  } else {
    console.log(`${loc}: structure OK`);
  }

  // content quality checks
  const flat = keyPaths(d).reduce((acc, k) => {
    acc[k] = k.split('.').reduce((o, p) => (o == null ? o : o[p]), d);
    return acc;
  }, {});
  const empties = Object.entries(flat).filter(([, v]) => typeof v === 'string' && !v.trim());
  if (empties.length) {
    problems++;
    console.log(`  EMPTY values: ${empties.map(([k]) => k).join(', ')}`);
  }
  const raw = fs.readFileSync(path.join(DIR, `${loc}.json`), 'utf8');
  if (raw.includes('\uFFFD')) {
    problems++;
    console.log('  MOJIBAKE (U+FFFD) detected!');
  }
}

console.log(problems ? `\nFAILED with ${problems} problem(s).` : '\nAll dictionaries structurally identical and clean.');
process.exit(problems ? 1 : 0);
