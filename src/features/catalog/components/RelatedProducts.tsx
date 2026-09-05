'use client';

import type { CatalogProductRef, CatalogRelatedProduct } from '../types';
import { ProjectCard } from '@/src/features/ecommerce-showcase/public/ProjectCard';
import type { EcommerceProjectCard } from '@/src/features/ecommerce-showcase/types';
import { SoftwareCard } from '@/src/features/software-showcase/public/SoftwareCard';
import type { SoftwareProjectCard } from '@/src/features/software-showcase/types';
import { CreativeMarketingCard } from '@/src/features/creative-marketing-showcase/public/CreativeMarketingCard';
import type { CreativeMarketingProjectCard } from '@/src/features/creative-marketing-showcase/types';

/** Same density/grid as homepage portfolio sections. */
const RELATED_HOME_GRID_CLASS =
  'mt-4 grid grid-cols-2 gap-2.5 min-w-0 sm:gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4';

function toSoftwareCard(product: CatalogProductRef): SoftwareProjectCard {
  const cover = product.coverImageUrl ?? product.cover_url ?? null;
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    short_description: product.short_description,
    feature_summary: product.short_description,
    category_id: null,
    industry: product.industry_name,
    business_type: product.business_size,
    solution_group: null,
    software_type: null,
    platform_type: null,
    main_category_id: null,
    taxonomy_category_id: null,
    child_category_id: null,
    industry_id: product.industry_id,
    industry_slug: product.industry_slug,
    industry_name: product.industry_name,
    canonical_path: product.canonical_path,
    badge: product.badge,
    cover_card_url: cover,
    cover_detail_url: cover,
    coverImageUrl: cover,
    starting_price: Math.max(Number(product.starting_price ?? 0), 10000),
    price_suffix: product.price_suffix ?? '',
    currency: product.currency ?? 'BDT',
    featured: product.featured,
    popular: product.popular,
    published: product.published,
    sort_order: product.sort_order,
    rating_avg: product.rating_avg ?? undefined,
    review_count: product.review_count ?? undefined,
    created_at: '',
    updated_at: '',
    category_name: product.industry_name,
    category_slug: product.industry_slug,
    taxonomy_category_name: null,
    taxonomy_category_slug: null,
    child_category_name: null,
    child_category_slug: null,
    screen_count: 0,
    primary_features: [],
  };
}

function toWebsiteCard(product: CatalogProductRef): EcommerceProjectCard {
  const cover = product.coverImageUrl ?? product.cover_url ?? null;
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    short_description: product.short_description,
    category_id: null,
    technology_stack: [],
    website_type: null,
    industry: product.industry_name,
    industry_id: product.industry_id,
    industry_slug: product.industry_slug,
    industry_name: product.industry_name,
    canonical_path: product.canonical_path,
    cover_image_url: cover,
    cover_fallback_url: null,
    coverImageUrl: cover,
    coverImageFallbackUrl: null,
    starting_price: Number(product.starting_price ?? 0),
    currency: product.currency ?? 'BDT',
    featured: product.featured,
    published: product.published,
    sort_order: product.sort_order,
    rating_avg: product.rating_avg ?? undefined,
    review_count: product.review_count ?? undefined,
    created_at: '',
    updated_at: '',
    category_name: product.industry_name,
    category_slug: product.industry_slug,
    page_count: 0,
  };
}

function toMarketingCard(product: CatalogProductRef): CreativeMarketingProjectCard {
  const cover = product.coverImageUrl ?? product.cover_url ?? null;
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    short_description: product.short_description,
    outcome_line: product.short_description,
    service_group: 'branding',
    service_type: null,
    service_subcategory: null,
    target_business: null,
    pricing_model: 'one_time',
    industry_id: product.industry_id,
    industry_slug: product.industry_slug,
    industry_name: product.industry_name,
    canonical_path: product.canonical_path,
    cover_card_url: cover,
    cover_detail_url: cover,
    coverImageUrl: cover,
    starting_price: Number(product.starting_price ?? 0),
    price_suffix: product.price_suffix ?? '',
    currency: product.currency ?? 'BDT',
    featured: product.featured,
    popular: product.popular,
    published: product.published,
    sort_order: product.sort_order,
    created_at: '',
    updated_at: '',
    asset_count: 0,
  };
}

export function RelatedProducts({
  items,
  title = 'Related solutions',
}: {
  items: Array<CatalogRelatedProduct | CatalogProductRef>;
  title?: string;
}) {
  const products = items
    .map((item) => ('product' in item ? item.product : item))
    .filter((p): p is CatalogProductRef => Boolean(p));

  if (products.length === 0) return null;

  return (
    <section
      className="mx-auto mt-10 w-full max-w-[1480px] px-4 md:mt-14 sm:px-6 lg:px-8 xl:px-10"
      aria-labelledby="similar-products-heading"
    >
      <h2
        id="similar-products-heading"
        className="font-display text-xl font-black text-text-primary md:text-2xl"
      >
        {title}
      </h2>
      <div className={RELATED_HOME_GRID_CLASS}>
        {products.slice(0, 4).map((product, index) => {
          if (product.kind === 'software') {
            return (
              <SoftwareCard
                key={product.id}
                project={toSoftwareCard(product)}
                variant="home"
                eager={index < 2}
              />
            );
          }
          if (product.kind === 'marketing') {
            return (
              <CreativeMarketingCard
                key={product.id}
                project={toMarketingCard(product)}
                variant="home"
                eager={index < 2}
              />
            );
          }
          return (
            <ProjectCard
              key={product.id}
              project={toWebsiteCard(product)}
              variant="home"
              eager={index < 2}
            />
          );
        })}
      </div>
    </section>
  );
}
