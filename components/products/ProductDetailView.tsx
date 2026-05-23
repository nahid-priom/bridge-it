import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Product, ProductReview } from '@/types/product';
import { buildProductsHref } from '@/lib/products/url';
import { DEFAULT_PRODUCT_LISTING_FILTERS } from '@/types/product';
import { ProductDetailHero } from './ProductDetailHero';
import { ProductDetailContent } from './ProductDetailContent';
import { ProductReviews } from './ProductReviews';
import { SimilarServices } from './SimilarServices';

interface ProductDetailViewProps {
  product: Product;
  reviews: ProductReview[];
  similarProducts: Product[];
}

export function ProductDetailView({
  product,
  reviews,
  similarProducts,
}: ProductDetailViewProps) {
  const backHref = buildProductsHref({
    categoryKey: product.categoryKey,
    q: '',
    sort: 'popular',
    filters: { ...DEFAULT_PRODUCT_LISTING_FILTERS },
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <Link
        href={backHref}
        className="hidden lg:inline-flex items-center gap-2 text-sm text-text-muted hover:text-bridge-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to {product.categoryLabel}
      </Link>

      <article>
        <ProductDetailHero product={product} backHref={backHref} />

        <div className="mt-10 md:mt-14 pt-10 md:pt-14 border-t border-border-subtle space-y-10 md:space-y-14">
          <ProductDetailContent product={product} />
          <ProductReviews product={product} reviews={reviews} />
          <SimilarServices products={similarProducts} categoryLabel={product.categoryLabel} />
        </div>
      </article>
    </main>
  );
}
