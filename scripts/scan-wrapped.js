/**
 * Scan the project for files corrupted by stray quote-wrapping:
 * the entire file content enclosed in one extra pair of double quotes.
 * Prints WRAPPED: <path> for each hit.
 */
import fs from 'fs';
import path from 'path';

const EXTS = ['.js', '.jsx', '.json', '.mjs', '.css', '.ts'];
const SKIP = new Set(['node_modules', '.git', '.next']);

function isWrapped(t) {
  const s = t.trim();
  return s.length > 2 && s.startsWith('"') && s.endsWith('"');
}

function walk(dir, hits) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p, hits);
    } else if (EXTS.includes(path.extname(entry.name))) {
      const raw = fs.readFileSync(p, 'utf8');
      if (isWrapped(raw)) hits.push(p);
    }
  }
  return hits;
}

const hits = walk('.', []);
if (!hits.length) {
  console.log('No wrapped files found.');
} else {
  hits.forEach((h) => console.log('WRAPPED:', h));
}
