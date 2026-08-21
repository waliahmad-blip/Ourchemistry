import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/config';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_FILE.test(pathname) || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (hasLocale) return NextResponse.next();

  const accept = request.headers.get('accept-language') || '';
  const preferred = accept.split(',')[0].split('-')[0].toLowerCase();
  const matched = locales.includes(preferred) ? preferred : defaultLocale;

  return NextResponse.redirect(
    new URL(`/${matched}${pathname === '/' ? '' : pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)'],
};
