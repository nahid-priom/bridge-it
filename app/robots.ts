import type { MetadataRoute } from 'next';
import {
  LEGACY_MARKETPLACE_PREFIXES,
  NON_INDEXABLE_PATH_PREFIXES,
  TRANSACTIONAL_PATH_PATTERNS,
} from '@/lib/seo/config';

const CANONICAL_ORIGIN = 'https://www.bridgeitpark.com';

const DISALLOW = [
  ...NON_INDEXABLE_PATH_PREFIXES,
  ...TRANSACTIONAL_PATH_PATTERNS,
  ...LEGACY_MARKETPLACE_PREFIXES,
];

export default function robots(): MetadataRoute.Robots {
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
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: 'www.bridgeitpark.com',
  };
}
