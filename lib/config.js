export const LAUNCH_DATE = new Date("2027-02-14T00:00:00");

export const START_COUNT = 12847;

export const BRAND = "ourchemistry";
export const TAGLINE = "The Science of Us";

export const locales = ["en","ur","ar","fr","tr","id","ms","de","bn","es"];
export const rtlLocales = ["ar","ur"];
export const defaultLocale = "en";

export function isRtl(l){ return rtlLocales.includes(l); }
