import Link from 'next/link';
import type { CatalogProductRef, CatalogRelatedProduct } from '../types';
import { productPath } from '../utils/paths';
import { CatalogPrice } from './CatalogPrice';
import { CatalogCoverImage } from './CatalogCoverImage';
import { FeaturedBadge } from './FeaturedBadge';
import { StarRating } from './StarRating';
import { fallbackRatingFromSlug } from '../types/reviews';

function relatedHref(product: CatalogProductRef): string {
  if (product.canonical_path?.trim()) return product.canonical_path.trim();
  if (product.industry_slug) {
    return productPath(product.kind, product.industry_slug, product.slug);
  }
  return `/${product.kind}/${product.slug}`;
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
    <section className="mt-10 md:mt-14" aria-labelledby="similar-products-heading">
      <h2
        id="similar-products-heading"
        className="font-display text-xl font-black text-[#0f2744] dark:text-white md:text-2xl"
      >
        {title}
      </h2>
      <ul className="mt-4 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const rating =
            product.rating_avg ?? fallbackRatingFromSlug(product.slug).rating_avg;
          const reviewCount =
            product.review_count ?? fallbackRatingFromSlug(product.slug).review_count;
          return (
            <li key={product.id} className="min-w-[240px] shrink-0 sm:min-w-0">
              <Link
                href={relatedHref(product)}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-colors hover:border-[#2563eb]/40"
              >
                <div className="relative overflow-hidden bg-background-soft">
                  {product.featured ? <FeaturedBadge /> : null}
                  <CatalogCoverImage
                    src={product.coverImageUrl ?? product.cover_url}
                    alt={`${product.title} project preview`}
                    emptyTitle={product.title}
                    fit="cover"
                    sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 70vw"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                  {product.industry_name ? (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2563eb]">
                      {product.industry_name}
                    </p>
                  ) : null}
                  <p className="font-display font-bold leading-snug text-text-primary line-clamp-2">
                    {product.title}
                  </p>
                  <StarRating rating={rating} reviewCount={reviewCount} />
                  <p className="mt-auto pt-1 text-sm font-semibold text-text-secondary">
                    <CatalogPrice
                      amount={product.starting_price}
                      suffix={product.price_suffix}
                      currency={product.currency}
                    />
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
