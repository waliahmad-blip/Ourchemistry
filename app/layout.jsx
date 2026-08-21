import './globals.css';
import { Space_Grotesk, Unbounded, JetBrains_Mono } from 'next/font/google';

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const display = Unbounded({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://ourchemistry.ai';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ourchemistry.ai — The Science of Us | AI-Powered Dating & Matrimony',
    template: '%s — ourchemistry.ai',
  },
  description:
    'The first AI dating & matrimony app built on Voice DNA, not photos. Match on voice, values and resonance. Launching February 14, 2027.',
  keywords: [
    'dating',
    'matrimony',
    'AI dating',
    'voice dating',
    'voice first',
    'muslim matrimony',
    'halal matchmaking',
    'relationship app',
  ],
  applicationName: 'ourchemistry.ai',
  manifest: '/manifest.webmanifest',
  authors: [{ name: 'ourchemistry team' }],
  creator: 'ourchemistry',
  category: 'lifestyle',
  formatDetection: { telephone: false },
  alternates: {
    canonical: '/',
    languages: {
      en: '/en', ur: '/ur', ar: '/ar', fr: '/fr', tr: '/tr',
      id: '/id', ms: '/ms', de: '/de', bn: '/bn', es: '/es',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ourchemistry.ai — The Science of Us',
    description:
      'Voice-first AI dating & matrimony. Mind before face. Hear before you see. No photos — just chemistry.',
    url: SITE_URL,
    siteName: 'ourchemistry',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ourchemistry.ai — The Science of Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ourchemistry.ai — The Science of Us',
    description: 'Voice-first dating & matrimony. No photos. Just chemistry.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport = {
  themeColor: '#04060f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ourchemistry.ai',
    alternateName: 'ourchemistry',
    description:
      'AI-Powered Dating & Matrimony — The Science of Us. Voice-first matching on Voice DNA, values and resonance.',
    url: SITE_URL,
    logo: `${SITE_URL}/icon-192.png`,
    foundingDate: '2027-02-14',
    sameAs: [SITE_URL],
  };

  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

