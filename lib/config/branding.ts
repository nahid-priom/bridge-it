/**
 * Central brand configuration — Bridge IT Park.
 */
export const BRANDING = {
  appName: 'Bridge IT Park',
  shortName: 'Bridge IT Park',
  legalName: 'Bridge IT Park',
  tagline: 'Premium Custom E-commerce Websites',
  description:
    'Browse custom e-commerce website designs for Bangladesh businesses. Preview storefronts, compare packages, and request a store built for your brand.',
  primaryColor: '#0f2744',
  accentColor: '#10B981',
  navyColor: '#0f2744',
  blueColor: '#2563eb',
  emeraldColor: '#10B981',
  supportEmail: 'support@bridgeitpark.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.bridgeitpark.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  clientWorkspace: 'Bridge IT Park Client Dashboard',
  adminName: 'Bridge IT Park Admin',
  aiName: 'Bridge IT Park Assistant',
} as const;

export const BRAND_KEYWORDS = [
  'custom e-commerce website',
  'custom ecommerce website Bangladesh',
  'e-commerce website design',
  'ecommerce website development',
  'premium ecommerce website',
  'custom online shop',
  'Bridge IT Park',
] as const;

export const HOME_SEO_TITLE = 'Custom E-commerce Websites for Your Business | Bridge IT Park';

export const HOME_SEO_DESCRIPTION =
  'Choose a custom e-commerce website for your business. Preview ready storefront designs, compare packages from ৳10,000, and request a store built for your brand.';

export function whatsappUrl(message: string) {
  const digits = BRANDING.whatsappNumber.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  if (digits) return `https://wa.me/${digits}?text=${text}`;
  return `https://wa.me/?text=${text}`;
}

export function solutionUrl(slug: string): string {
  return `/solutions/${slug}`;
}

/** @deprecated */
export function sellerCustomUrl(slug: string): string {
  const host = BRANDING.siteUrl.replace(/^https?:\/\//, '');
  return `${host}/solutions/${slug}`;
}
