import { ROUTES } from '@/lib/routes';
import { softwareIndustryForProduct } from '@/src/features/catalog/config/software-industry-map';
import type { CatalogProductRef } from '@/src/features/catalog/types';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';
import { websiteDetailUrl } from '@/src/features/ecommerce-showcase/utils/filters';
import type { CreativeMarketingProjectCard } from '@/src/features/creative-marketing-showcase/types';
import { creativeServiceGroupLabel } from '@/src/features/creative-marketing-showcase/config/constants';
import type { SoftwareProjectCard } from '@/src/features/software-showcase/types';
import { resolvePricingMode } from './format-portfolio-price';
import type { PortfolioCardData, PortfolioContentType } from './types';

function softwareDetailUrl(
  slug: string,
  industrySlug?: string | null,
  canonicalPath?: string | null
): string {
  if (canonicalPath?.trim()) return canonicalPath.trim();
  const industry = industrySlug?.trim() || softwareIndustryForProduct(slug);
  if (industry) return ROUTES.softwareProduct(industry, slug);
  return ROUTES.softwareSolution(slug);
}

function creativeDetailUrl(
  slug: string,
  industrySlug?: string | null,
  canonicalPath?: string | null
): string {
  if (canonicalPath?.trim()) return canonicalPath.trim();
  if (industrySlug?.trim()) return ROUTES.marketingProduct(industrySlug.trim(), slug);
  return ROUTES.marketingIndustry(slug);
}

function cleanRating(
  rating?: number | null,
  reviewCount?: number | null
): { rating?: number | null; reviewCount?: number | null } {
  const avg = rating == null ? null : Number(rating);
  if (avg == null || !Number.isFinite(avg) || avg <= 0) {
    return { rating: null, reviewCount: null };
  }
  const count = reviewCount == null ? null : Number(reviewCount);
  return {
    rating: Math.max(0, Math.min(5, avg)),
    reviewCount: count != null && Number.isFinite(count) && count > 0 ? count : null,
  };
}

export function normalizeWebsiteProject(project: EcommerceProjectCard): PortfolioCardData {
  const raw = Number(project.starting_price ?? 0);
  const price = raw > 0 ? Math.max(raw, 10_000) : 0;
  const { rating, reviewCount } = cleanRating(project.rating_avg, project.review_count);
  return {
    id: project.id,
    slug: project.slug,
    contentType: 'website',
    title: project.title,
    categoryLabel: project.industry_name ?? project.category_name ?? project.industry ?? 'Website',
    categorySlug: project.industry_slug ?? project.category_slug ?? undefined,
    coverImageUrl: project.coverImageUrl,
    coverImageFallbackUrl: project.coverImageFallbackUrl,
    coverImageAlt: `${project.title} website template preview`,
    rating,
    reviewCount,
    pricingMode: resolvePricingMode({ contentType: 'website', price }),
    price: price > 0 ? price : null,
    currency: project.currency ?? 'BDT',
    priceSuffix: '+',
    href: websiteDetailUrl(project.slug, project.industry_slug, project.canonical_path),
    featured: project.featured,
  };
}

export function normalizeSoftwareProject(project: SoftwareProjectCard): PortfolioCardData {
  const raw = Number(project.starting_price ?? 0);
  const price = raw > 0 ? Math.max(raw, 10_000) : 0;
  const { rating, reviewCount } = cleanRating(project.rating_avg, project.review_count);
  return {
    id: project.id,
    slug: project.slug,
    contentType: 'software',
    title: project.title,
    categoryLabel:
      project.industry_name ??
      project.taxonomy_category_name ??
      project.child_category_name ??
      project.category_name ??
      'Software',
    categorySlug:
      project.industry_slug ??
      project.taxonomy_category_slug ??
      project.child_category_slug ??
      project.category_slug ??
      undefined,
    coverImageUrl: project.coverImageUrl,
    coverImageAlt: `${project.title} software preview`,
    rating,
    reviewCount,
    pricingMode: resolvePricingMode({
      contentType: 'software',
      price,
      priceSuffix: project.price_suffix,
    }),
    price: price > 0 ? price : null,
    currency: project.currency ?? 'BDT',
    priceSuffix: project.price_suffix || '+',
    href: softwareDetailUrl(project.slug, project.industry_slug, project.canonical_path),
    featured: project.featured,
  };
}

export function normalizeMarketingProject(project: CreativeMarketingProjectCard): PortfolioCardData {
  const price = Number(project.starting_price ?? 0);
  return {
    id: project.id,
    slug: project.slug,
    contentType: 'marketing',
    title: project.title,
    categoryLabel:
      project.industry_name ?? creativeServiceGroupLabel(project.service_group) ?? 'Marketing',
    categorySlug: project.industry_slug ?? undefined,
    coverImageUrl: project.coverImageUrl,
    coverImageAlt: `${project.title} marketing preview`,
    rating: null,
    reviewCount: null,
    pricingMode: resolvePricingMode({
      contentType: 'marketing',
      price,
      pricingModel: project.pricing_model,
      priceSuffix: project.price_suffix,
    }),
    price: price > 0 ? price : null,
    currency: project.currency ?? 'BDT',
    priceSuffix: project.price_suffix || '+',
    href: creativeDetailUrl(project.slug, project.industry_slug, project.canonical_path),
    featured: project.featured,
  };
}

export function normalizeCatalogProductRef(product: CatalogProductRef): PortfolioCardData {
  const contentType = product.kind as PortfolioContentType;
  const priceRaw = Number(product.starting_price ?? 0);
  const price =
    contentType === 'software' && priceRaw > 0 ? Math.max(priceRaw, 10_000) : priceRaw;
  const { rating, reviewCount } = cleanRating(product.rating_avg, product.review_count);
  const href =
    product.canonical_path?.trim() ||
    (product.industry_slug
      ? contentType === 'software'
        ? ROUTES.softwareProduct(product.industry_slug, product.slug)
        : contentType === 'marketing'
          ? ROUTES.marketingProduct(product.industry_slug, product.slug)
          : ROUTES.websiteProduct(product.industry_slug, product.slug)
      : `/${contentType === 'website' ? 'websites' : contentType}/${product.slug}`);

  return {
    id: product.id,
    slug: product.slug,
    contentType,
    title: product.title,
    categoryLabel: product.industry_name ?? product.badge ?? contentType,
    categorySlug: product.industry_slug ?? undefined,
    coverImageUrl: product.coverImageUrl ?? product.cover_url,
    coverImageAlt: `${product.title} preview`,
    rating: contentType === 'marketing' ? null : rating,
    reviewCount: contentType === 'marketing' ? null : reviewCount,
    pricingMode: resolvePricingMode({
      contentType,
      price,
      priceSuffix: product.price_suffix,
    }),
    price: price > 0 ? price : null,
    currency: product.currency ?? 'BDT',
    priceSuffix: product.price_suffix || '+',
    href,
    featured: product.featured,
  };
}

/** Generic entry — pick mapper by content type tag when present on raw objects. */
export function normalizePortfolioCardData(
  raw:
    | { contentType: 'website'; project: EcommerceProjectCard }
    | { contentType: 'software'; project: SoftwareProjectCard }
    | { contentType: 'marketing'; project: CreativeMarketingProjectCard }
    | CatalogProductRef
): PortfolioCardData {
  if ('kind' in raw && 'canonical_path' in raw && !('project' in raw)) {
    return normalizeCatalogProductRef(raw);
  }
  if ('contentType' in raw) {
    if (raw.contentType === 'website') return normalizeWebsiteProject(raw.project);
    if (raw.contentType === 'software') return normalizeSoftwareProject(raw.project);
    return normalizeMarketingProject(raw.project);
  }
  throw new Error('Unsupported portfolio card source');
}
