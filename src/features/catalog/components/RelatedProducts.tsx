import Link from 'next/link';
import type { CatalogProductRef, CatalogRelatedProduct } from '../types';
import { productPath } from '../utils/paths';
import { CatalogPrice } from './CatalogPrice';

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
    <section className="mt-10 md:mt-14">
      <h2 className="font-display text-xl font-black text-[#0f2744] dark:text-white md:text-2xl">
        {title}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={relatedHref(product)}
              className="flex h-full flex-col rounded-2xl border border-border-subtle bg-surface p-4 transition-colors hover:border-[#2563eb]/40"
            >
              {product.industry_name ? (
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {product.industry_name}
                </p>
              ) : null}
              <p className="mt-1 font-display font-bold text-text-primary">{product.title}</p>
              <p className="mt-auto pt-2 text-sm font-semibold text-text-secondary">
                <CatalogPrice
                  amount={product.starting_price}
                  suffix={product.price_suffix}
                  currency={product.currency}
                />
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
