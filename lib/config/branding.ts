/**
 * Central brand configuration — Bridge IT Park.
 */
export const BRANDING = {
  appName: 'Bridge IT Park',
  shortName: 'Bridge IT Park',
  legalName: 'Bridge IT Park',
  tagline: 'Premium Custom E-commerce Websites',
  description:
    'Browse custom Next.js, React and Laravel e-commerce website designs. Preview pages, compare packages, and request a store built for your business.',
  primaryColor: '#0f2744',
  accentColor: '#10B981',
  navyColor: '#0f2744',
  blueColor: '#2563eb',
  emeraldColor: '#10B981',
  supportEmail: 'support@bridgeitpark.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bridgeitpark.com',
  clientWorkspace: 'Bridge IT Park Client Dashboard',
  adminName: 'Bridge IT Park Admin',
  aiName: 'Bridge IT Park Assistant',
} as const;

export const BRAND_KEYWORDS = [
  'custom ecommerce website Bangladesh',
  'Next.js ecommerce website',
  'React ecommerce website Bangladesh',
  'Laravel ecommerce website',
  'ecommerce website development',
  'premium ecommerce website',
  'custom online shop',
  'Bridge IT Park',
] as const;

export const HOME_SEO_TITLE =
  'Premium Custom E-commerce Website Designs | Bridge IT Park';

export function solutionUrl(slug: string): string {
  return `/solutions/${slug}`;
}

/** @deprecated */
export function sellerCustomUrl(slug: string): string {
  const host = BRANDING.siteUrl.replace(/^https?:\/\//, '');
  return `${host}/solutions/${slug}`;
}
