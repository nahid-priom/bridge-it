'use client';

import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { useStore } from '@/store/useStore';
import { productToService } from '@/lib/products/adapter';

interface SimilarServicesProps {
  products: Product[];
  categoryLabel: string;
}

export function SimilarServices({ products, categoryLabel }: SimilarServicesProps) {
  const addToCart = useStore((s) => s.addToCart);
  const viewMode = useStore((s) => s.viewMode);

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="similar-services-heading" className="scroll-mt-24">
      <h2 id="similar-services-heading" className="text-xl md:text-2xl font-bold font-display text-text-primary">
        Similar Services
      </h2>
      <p className="text-sm text-text-muted mt-1 mb-6">
        Explore more services related to {categoryLabel}.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {products.map((p, index) => (
          <ProductCard
            key={p.id}
            product={p}
            viewMode="grid"
            onAddToCart={(item) => addToCart(productToService(item))}
            priorityImage={index < 2}
          />
        ))}
      </div>
    </section>
  );
}
