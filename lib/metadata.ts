import type { Metadata } from 'next';
import { BRANDING, HOME_SEO_TITLE } from '@/lib/config/branding';
import { BRAND_ASSETS } from '@/lib/config/brand-assets';
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from '@/lib/site';
import { GOOGLE_SITE_VERIFICATION } from '@/lib/seo/config';

const DEFAULT_OG_IMAGE = {
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
  image?: string | null;
  ogType?: 'website' | 'article';
};

function resolveTitle(title: string, path: string): Metadata['title'] {
  if (path === '/') return { absolute: title };
  const suffix = ` | ${SITE_NAME}`;
  if (title.endsWith(suffix) || title.includes(` | ${SITE_NAME}`)) {
    return { absolute: title };
  }
  return title;
}

function toDisplayTitle(title: string, path: string): string {
  if (path === '/') return title;
  const suffix = ` | ${SITE_NAME}`;
  if (title.endsWith(suffix) || title.includes(` | ${SITE_NAME}`)) return title;
  return `${title}${suffix}`;
}

function resolveOgImage(image?: string | null, alt?: string) {
  const imageAlt = alt ?? `${SITE_NAME} — ${BRANDING.tagline}`;
  if (!image?.trim()) return [{ ...DEFAULT_OG_IMAGE, alt: imageAlt }];
  const url = image.startsWith('http') ? image : image.startsWith('/') ? image : `/${image}`;
  return [{ url, width: 1200, height: 630, alt: imageAlt }];
}

function buildRobots(noIndex: boolean): Metadata['robots'] {
  if (noIndex) {
    return { index: false, follow: false, nocache: true };
  }
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  keywords,
  noIndex = false,
  image,
  ogType = 'website',
}: PageMetaInput): Metadata {
  const url = `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const resolvedTitle = resolveTitle(title, path);
  const displayTitle = toDisplayTitle(title, path);
  const ogImages = resolveOgImage(image, displayTitle);

  return {
    title: resolvedTitle,
    description,
    keywords: keywords ?? SITE_KEYWORDS,
    alternates: { canonical: url },
    robots: buildRobots(noIndex),
    category: 'technology',
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      alternateLocale: ['bn_BD'],
      url,
      siteName: SITE_NAME,
      title: displayTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description,
      images: ogImages.map((img) => img.url),
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
  authors: [{ name: BRANDING.appName, url: SITE_URL }],
  creator: BRANDING.appName,
  publisher: BRANDING.legalName,
  referrer: 'origin-when-cross-origin',
  category: 'technology',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: buildRobots(false),
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['bn_BD'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_SEO_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ ...DEFAULT_OG_IMAGE, alt: HOME_SEO_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};
