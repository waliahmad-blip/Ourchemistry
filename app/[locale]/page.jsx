import { notFound } from 'next/navigation';
import { dictionaries } from '../../lib/i18n';
import { isRtl, locales, BRAND, TAGLINE } from '../../lib/config';
import ConstellationStage from '../../components/ConstellationStage';
import LocaleSwitcher from '../../components/LocaleSwitcher';
import Countdown from '../../components/Countdown';
import CatalystOrb from '../../components/CatalystOrb';
import GlobalPulseMap from '../../components/GlobalPulseMap';
import LocaleMeta from '../../components/LocaleMeta';

const OG_LOCALE = {
  en: 'en_US', ur: 'ur_PK', ar: 'ar_AE', fr: 'fr_FR', tr: 'tr_TR',
  id: 'id_ID', ms: 'ms_MY', de: 'de_DE', bn: 'bn_BD', es: 'es_ES',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }) {
  const { locale } = params;
  const dict = dictionaries[locale] || dictionaries.en;
  const title = `${BRAND} — ${dict.hero.title} | ${TAGLINE}`;
  return {
    title,
    description: dict.hero.sub,
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title,
      description: dict.hero.sub,
      locale: OG_LOCALE[locale] || 'en_US',
      url: `/${locale}`,
    },
  };
}

export default function LocalePage({ params }) {
  const { locale } = params;
  if (!locales.includes(locale)) notFound();

  const dict = dictionaries[locale] || dictionaries.en;
  const rtl = isRtl(locale);

  return (
    <main dir={rtl ? 'rtl' : 'ltr'} className="no-scroll">
      <LocaleMeta locale={locale} rtl={rtl} />
      <div className="constellation-bg" aria-hidden="true" />
      <GlobalPulseMap />
      <LocaleSwitcher current={locale} />
      <Countdown locale={locale} dict={dict} />
      <ConstellationStage dict={dict} locale={locale} />
      <CatalystOrb dict={dict} locale={locale} />
    </main>
  );
}
