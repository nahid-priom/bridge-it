import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import {
  LEGACY_MARKETPLACE_PREFIXES,
  NON_INDEXABLE_PATH_PREFIXES,
  TRANSACTIONAL_PATH_PATTERNS,
} from '@/lib/seo/config';

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
        allow: '/',
        disallow: DISALLOW,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL.replace(/\/$/, '')}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ''),
  };
}
