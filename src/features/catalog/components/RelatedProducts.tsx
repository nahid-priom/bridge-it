'use client';

import type { CatalogProductRef, CatalogRelatedProduct } from '../types';
import { CATALOG_LISTING_GRID_CLASS } from './explore/types';
import { PortfolioCard, normalizeCatalogProductRef } from './portfolio-card';

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
      <ul className={cnRelatedGrid}>
        {products.slice(0, 4).map((product, index) => (
          <li key={product.id} className="min-w-0 list-none">
            <PortfolioCard
              data={normalizeCatalogProductRef(product)}
              eager={index < 2}
              priority={index === 0}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

const cnRelatedGrid = `mt-4 ${CATALOG_LISTING_GRID_CLASS}`;
