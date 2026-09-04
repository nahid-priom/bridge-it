import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import {
  CANONICAL_ORIGIN,
  LEGACY_MARKETPLACE_PREFIXES,
  NON_INDEXABLE_PATH_PREFIXES,
  TRANSACTIONAL_PATH_PATTERNS,
} from '@/lib/seo/config';

function canonicalOrigin(): string {
  try {
    const fromEnv = new URL(SITE_URL).origin;
    if (fromEnv.includes('localhost') || fromEnv.includes('127.0.0.1')) {
      return CANONICAL_ORIGIN;
    }
    return fromEnv.replace('://bridgeitpark.com', '://www.bridgeitpark.com');
  } catch {
    return CANONICAL_ORIGIN;
  }
}

const DISALLOW = [
  ...NON_INDEXABLE_PATH_PREFIXES,
  ...TRANSACTIONAL_PATH_PATTERNS,
  ...LEGACY_MARKETPLACE_PREFIXES,
];

export default function robots(): MetadataRoute.Robots {
  const origin = canonicalOrigin();
  const host = origin.replace(/^https?:\/\//, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: DISALLOW,
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: DISALLOW,
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host,
  };
}
