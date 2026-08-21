import { locales } from '../lib/config';

export default function sitemap() {
  const base = 'https://ourchemistry.ai';
  return locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${base}/${l}`])
      ),
    },
  }));
}
