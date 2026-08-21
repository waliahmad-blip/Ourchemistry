import en from '../dictionaries/en.json';
import ur from '../dictionaries/ur.json';
import ar from '../dictionaries/ar.json';
import fr from '../dictionaries/fr.json';
import tr from '../dictionaries/tr.json';
import id from '../dictionaries/id.json';
import ms from '../dictionaries/ms.json';
import de from '../dictionaries/de.json';
import bn from '../dictionaries/bn.json';
import es from '../dictionaries/es.json';
export const dictionaries = { en, ur, ar, fr, tr, id, ms, de, bn, es };
export function t(locale, key){ const d = dictionaries[locale] || dictionaries.en; return d[key] || dictionaries.en[key] || key; }
