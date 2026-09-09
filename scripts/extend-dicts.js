/**
 * Merge quiz/countdown/rot/nav.quiz keys into every locale dictionary.
 * Idempotent and non-destructive to existing keys.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DICT_DIR = path.join(__dirname, '..', 'dictionaries');
const extA = JSON.parse(fs.readFileSync(path.join(__dirname, 'dict-ext-a.json'), 'utf8'));
const extB = JSON.parse(fs.readFileSync(path.join(__dirname, 'dict-ext-b.json'), 'utf8'));
const EXT = { ...extA, ...extB };

let touched = 0;

for (const [locale, add] of Object.entries(EXT)) {
  const file = path.join(DICT_DIR, `${locale}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`skip (missing): ${file}`);
    continue;
  }
  let dict;
  try {
    dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`INVALID JSON in ${file}: ${err.message}`);
    process.exitCode = 1;
    continue;
  }

  // nav.quiz
  dict.nav = dict.nav || {};
  dict.nav.quiz = add.navQuiz;

  // hero.rot
  dict.hero = dict.hero || {};
  dict.hero.rot = add.rot;

  // countdown + quiz
  dict.countdown = add.countdown;
  dict.quiz = add.quiz;

  fs.writeFileSync(file, JSON.stringify(dict, null, 2) + '\n', 'utf8');
  touched++;
  console.log(`updated ${locale}.json`);
}

console.log(`Done. ${touched} dictionaries updated.`);
