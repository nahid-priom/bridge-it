import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import type { Service } from '@/types';
import type { Product, ProductReview } from '@/types/product';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressLocality: 'Dhaka',
    },
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
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
