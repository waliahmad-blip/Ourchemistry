/**
 * Unwrap files corrupted by stray quote-wrapping.
 * Handles two variants:
 *   1. Properly stringified: JSON.parse(raw) returns a string -> use it.
 *   2. Naive wrapping: raw starts and ends with a literal quote -> strip them.
 */
import fs from 'fs';
import path from 'path';

const EXTS = ['.js', '.jsx', '.json', '.mjs', '.css', '.ts'];
const SKIP = new Set(['node_modules', '.git', '.next']);

function isWrapped(t) {
  const s = t.trim();
  return s.length > 2 && s.startsWith('"') && s.endsWith('"');
}

function unwrap(raw) {
  const trimmed = raw.trim();
  // Variant 1: valid JSON string wrapping
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'string') return parsed;
  } catch (e) {
    /* fall through to naive stripping */
  }
  // Variant 2: naive outer quotes
  return trimmed.slice(1, -1);
}

function walk(dir, hits) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, hits);
    else if (EXTS.includes(path.extname(entry.name))) {
      if (isWrapped(fs.readFileSync(p, 'utf8'))) hits.push(p);
    }
  }
  return hits;
}

const hits = walk('.', []);
if (!hits.length) {
  console.log('Nothing to unwrap.');
  process.exit(0);
}

for (const p of hits) {
  const raw = fs.readFileSync(p, 'utf8');
  const clean = unwrap(raw);
  if (isWrapped(clean)) {
    console.error(`STILL WRAPPED after unwrap, skipped: ${p}`);
    process.exitCode = 1;
    continue;
  }
  fs.writeFileSync(p, clean.endsWith('\n') ? clean : clean + '\n', 'utf8');
  console.log('unwrapped:', p);
}
console.log('Done.');
