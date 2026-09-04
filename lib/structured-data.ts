import { SITE_BRAND, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import type { Service } from '@/types';
import type { Product, ProductReview } from '@/types/product';
import type { BitpProductDetail } from '@/types/bitp';
import { ROUTES } from '@/lib/routes';

import { BRANDING } from '@/lib/config/branding';
import { SOCIAL_SAME_AS } from '@/lib/config/social-links';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: SITE_BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/bridge-it-park-logo-full.png`,
    description: SITE_DESCRIPTION,
    email: BRANDING.supportEmail,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: BRANDING.supportEmail,
        availableLanguage: ['English', 'Bengali'],
        areaServed: 'BD',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressLocality: 'Dhaka',
    },
    sameAs: [...SOCIAL_SAME_AS],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_BRAND,
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: ['en', 'bn'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}${ROUTES.explore}?type=websites&q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(product: Product, reviews: ProductReview[]) {
  const url = `${SITE_URL}/products/${product.slug}`;
  const aggregateRating =
    reviews.length > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: String(
            reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
          ),
          reviewCount: String(reviews.length),
          bestRating: '5',
          worstRating: '1',
        }
      : {
          '@type': 'AggregateRating',
          ratingValue: String(product.rating),
          reviewCount: String(product.reviews),
          bestRating: '5',
          worstRating: '1',
        };

  const reviewNodes =
    reviews.length > 0
      ? reviews.slice(0, 6).map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.reviewerName },
          datePublished: r.date,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(r.rating),
            bestRating: '5',
          },
          name: r.title,
          reviewBody: r.comment,
        }))
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product.title,
    description: product.description,
    image: product.image,
    url,
    category: product.categoryLabel,
    provider: {
      '@type': 'Organization',
      name: product.sellerName,
    },
    brand: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    aggregateRating,
    ...(reviewNodes ? { review: reviewNodes } : {}),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    },
  };
}

export function serviceJsonLd(service: Service, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: `${SITE_URL}/services/${slug}`,
    provider: {
      '@type': 'Organization',
      name: service.sellerName,
    },
    areaServed: 'Bangladesh',
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: service.currency,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: service.rating,
      reviewCount: service.reviewCount,
    },
  };
}

export function bitpSolutionJsonLd(product: BitpProductDetail) {
  const url = `${SITE_URL}${ROUTES.solution(product.slug)}`;
  const image = product.cover_image ?? product.thumbnail ?? `${SITE_URL}/brand/bridge-it-park-logo-full.png`;
  const price =
    product.pricing_type === 'custom_quote' ? undefined : Number(product.starting_price);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product.name,
    description: product.seo_description ?? product.short_description ?? product.full_description,
    image,
    url,
    category: product.category?.name,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    ...(price !== undefined && Number.isFinite(price)
      ? {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: product.currency || 'BDT',
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };
}

export function bitpSolutionBreadcrumbJsonLd(product: BitpProductDetail) {
  const items = [
    { name: 'Home', url: SITE_URL },
    { name: 'Solutions', url: `${SITE_URL}${ROUTES.solutions}` },
  ];

  if (product.category) {
    items.push({
      name: product.category.name,
      url: `${SITE_URL}${ROUTES.solutions}?category=${product.category.slug}`,
    });
  }

  items.push({
    name: product.name,
    url: `${SITE_URL}${ROUTES.solution(product.slug)}`,
  });

  return breadcrumbJsonLd(items);
}

export function customEcommerceServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Websites, Software & Creative Marketing',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'Custom E-commerce Website',
          serviceType: 'E-commerce website design',
          url: `${SITE_URL}${ROUTES.websites}`,
          provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          areaServed: { '@type': 'Country', name: 'Bangladesh' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: 'Software Solutions',
          serviceType: 'Custom software development',
          url: `${SITE_URL}${ROUTES.softwareShowroom}`,
          provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          areaServed: { '@type': 'Country', name: 'Bangladesh' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: 'Creative & Digital Marketing',
          serviceType: 'Creative design and digital marketing',
          url: `${SITE_URL}${ROUTES.creativeMarketingShowroom}`,
          provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          areaServed: { '@type': 'Country', name: 'Bangladesh' },
        },
      },
    ],
  };
}

export function showcaseTemplateServiceJsonLd(project: {
  title: string;
  slug: string;
  short_description: string | null;
  cover_image_url: string | null;
  cover_fallback_url: string | null;
  currency: string;
  starting_price: number;
  category?: { name: string } | null;
}) {
  const url = `${SITE_URL}${ROUTES.website(project.slug)}`;
  const image = project.cover_image_url || project.cover_fallback_url;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: project.title,
    description: project.short_description,
    image,
    url,
    category: project.category?.name ?? 'Custom e-commerce website',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: project.currency || 'BDT',
      price: 10000,
      availability: 'https://schema.org/InStock',
      url,
    },
  };
}

export function showcaseTemplateBreadcrumbJsonLd(title: string, slug: string) {
  return breadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Websites', url: `${SITE_URL}${ROUTES.websites}` },
    { name: title, url: `${SITE_URL}${ROUTES.website(slug)}` },
  ]);
}

export function softwareShowcaseServiceJsonLd(project: {
  title: string;
  slug: string;
  short_description: string | null;
  cover_card_url: string | null;
  cover_detail_url: string | null;
  og_image_url: string | null;
  currency: string;
  starting_price: number;
  software_type?: string | null;
  solution_group?: string | null;
  category?: { name: string } | null;
}) {
  const url = `${SITE_URL}${ROUTES.softwareSolution(project.slug)}`;
  const image = project.cover_detail_url || project.cover_card_url || project.og_image_url;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.short_description,
    image,
    url,
    applicationCategory:
      project.software_type || project.category?.name || 'BusinessApplication',
    operatingSystem: 'Web',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: project.currency || 'BDT',
      price: project.starting_price || 0,
      availability: 'https://schema.org/InStock',
      url,
    },
  };
}

export function softwareShowcaseBreadcrumbJsonLd(title: string, slug: string) {
  return breadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Software Solutions', url: `${SITE_URL}${ROUTES.softwareShowroom}` },
    { name: title, url: `${SITE_URL}${ROUTES.softwareSolution(slug)}` },
  ]);
}
