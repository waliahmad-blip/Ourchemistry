'use client';
import { useEffect } from 'react';

/**
 * Syncs <html lang> and <html dir> for the active locale.
 * The root layout ships a safe default (en/ltr); this keeps the
 * document element correct for screen readers, fonts and RTL CSS.
 */
export default function LocaleMeta({ locale, rtl }) {
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = rtl ? 'rtl' : 'ltr';
  }, [locale, rtl]);

  return null;
}
