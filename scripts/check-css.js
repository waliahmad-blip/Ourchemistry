/**
 * Cross-check 4: design-system class integrity (deterministic).
 * Direction A: every custom design-system class must be DEFINED in globals.css
 * Direction B: every custom design-system class must be USED somewhere in code
 * Also checks Tailwind-extended utilities (shadow-glow, font-*) used in JSX.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSS = fs.readFileSync(path.join(ROOT, 'app', 'globals.css'), 'utf8');
const TW = fs.readFileSync(path.join(ROOT, 'tailwind.config.mjs'), 'utf8');

// Gather all source text to test usage
function readAll(dir, out = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = readAll(p, out);
    else if (/\.(jsx?|js)$/.test(e.name)) out += fs.readFileSync(p, 'utf8') + '\n';
  }
  return out;
}
const CODE = readAll(path.join(ROOT, 'components')) + readAll(path.join(ROOT, 'app'));

// The custom design-system classes we ship
const CUSTOM = [
  'constellation-bg', 'glass', 'glow-text', 'grad-text', 'btn-shine',
  'dock-btn', 'orb-ring', 'wave', 'ecg', 'lex', 'swap', 'pulse-dot',
  'no-scroll', 'bond-range', 'font-display', 'font-mono',
];

let problems = 0;

console.log('Direction A — defined in globals.css:');
for (const cls of CUSTOM) {
  const defined = new RegExp(`\\.${cls.replace(/-/g, '\\-')}\\b`).test(CSS);
  if (!defined) { problems++; console.log(`  MISSING definition: .${cls}`); }
}
console.log('  ' + (problems === 0 ? 'all defined ✓' : ''));

console.log('Direction B — used in code:');
let unused = 0;
for (const cls of CUSTOM) {
  const used = new RegExp(`(^|[\\s"'\`{(])${cls.replace(/-/g, '\\-')}([\\s"'\`)}:]|$)`).test(CODE);
  if (!used) { unused++; console.log(`  UNUSED: .${cls}`); }
}
if (!unused) console.log('  all used ✓');

console.log('Tailwind-extended utilities used in JSX:');
const twUtils = ['shadow-glow', 'shadow-glow-sm', 'font-display', 'font-mono', 'font-body'];
for (const u of twUtils) {
  const used = new RegExp(`(^|[\\s"'{])${u.replace(/-/g, '\\-')}([\\s"'}:]|$)`).test(CODE);
  if (used) {
    // verify it is provided by config or css
    const inTw = new RegExp(`${u.replace(/^shadow-/, '').replace(/^font-/, '')}:`).test(TW);
    const inCss = new RegExp(`\\.${u}\\b`).test(CSS);
    if (!inTw && !inCss) { problems++; console.log(`  USED but not provided: .${u}`); }
  }
}
console.log('  checked ✓');

console.log(problems ? `\nFAILED: ${problems} class problem(s).` : '\nDesign-system classes are consistent.');
process.exit(problems ? 1 : 0);
