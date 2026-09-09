/**
 * Cross-check 3: import resolution.
 * - every relative import must resolve to a real file
 * - every bare import must exist in node_modules (or be a Next built-in)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const DIRS = ['app', 'components', 'lib'];
const IMPORT_RE = /(?:import\s[^'"]*?from\s*|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;
const EXTS = ['', '.js', '.jsx', '.mjs', '.json', '.css'];

function collectFiles(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collectFiles(p, out);
    else if (/\.(jsx?|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

function resolveRelative(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const ext of EXTS) {
    if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return true;
  }
  // directory with index
  for (const ext of EXTS.slice(1)) {
    if (fs.existsSync(path.join(base, 'index' + ext))) return true;
  }
  return false;
}

const NODE_BUILTINS = new Set([
  'fs', 'path', 'os', 'util', 'crypto', 'stream', 'events', 'http', 'https',
  'url', 'querystring', 'buffer', 'assert', 'child_process', 'zlib', 'net',
]);

function resolveBare(spec) {
  const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
  if (NODE_BUILTINS.has(pkg) || spec.startsWith('node:')) return true;
  const candidates = [
    path.join(ROOT, 'node_modules', pkg, 'package.json'),
    path.join(ROOT, 'node_modules', '.pnpm'),
  ];
  if (fs.existsSync(candidates[0])) return true;
  // Next built-ins
  if (pkg === 'next' || spec.startsWith('next/')) return true;
  if (pkg === 'react' || pkg === 'react-dom') return true;
  return false;
}

let problems = 0;
const files = DIRS.flatMap((d) => collectFiles(path.join(ROOT, d)));
// include root-level config/middleware modules
for (const rootFile of ['middleware.js', 'next.config.mjs', 'tailwind.config.mjs', 'postcss.config.mjs']) {
  if (fs.existsSync(path.join(ROOT, rootFile))) files.push(path.join(ROOT, rootFile));
}
console.log(`Scanning ${files.length} source files...\n`);

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  let m;
  while ((m = IMPORT_RE.exec(src)) !== null) {
    const spec = m[1];
    if (spec.startsWith('.')) {
      if (!resolveRelative(file, spec)) {
        problems++;
        console.log(`UNRESOLVED relative: ${rel} -> '${spec}'`);
      }
    } else {
      if (!resolveBare(spec)) {
        problems++;
        console.log(`UNRESOLVED package: ${rel} -> '${spec}'`);
      }
    }
  }
}

console.log(problems ? `\nFAILED: ${problems} unresolved import(s).` : 'All imports resolve.');
process.exit(problems ? 1 : 0);

