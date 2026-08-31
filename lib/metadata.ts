import type { Metadata } from 'next';
import { BRANDING } from '@/lib/config/branding';
import { BRAND_ASSETS, BRAND_COLORS } from '@/lib/config/brand-assets';
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from '@/lib/site';

const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${BRANDING.tagline}`,
};

type PageMetaInput = {
  title: string;
  description?: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  keywords,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords ?? SITE_KEYWORDS,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: BRANDING.appName }],
  creator: BRANDING.appName,
  publisher: BRANDING.legalName,
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: BRAND_ASSETS.icons.faviconIco },
      { url: BRAND_ASSETS.icons.faviconSvg, type: 'image/svg+xml' },
      { url: BRAND_ASSETS.icons.favicon16, sizes: '16x16', type: 'image/png' },
      { url: BRAND_ASSETS.icons.favicon32, sizes: '32x32', type: 'image/png' },
      { url: BRAND_ASSETS.icons.favicon48, sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: BRAND_ASSETS.icons.appleTouch, sizes: '180x180', type: 'image/png' }],
    shortcut: [BRAND_ASSETS.icons.faviconIco],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.themeColor },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.themeColor },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};
