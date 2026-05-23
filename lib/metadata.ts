import type { Metadata } from 'next';
import { BRANDING } from '@/lib/config/branding';
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from '@/lib/site';

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
      images: [
        {
          url: 'https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [
        'https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
      ],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: BRANDING.appName }],
  creator: BRANDING.appName,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: 'https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      'https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
    ],
  },
};
