import { JsonLd } from '@/components/layout/JsonLd';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/structured-data';
import { breadcrumbItemsToJsonLd, type BreadcrumbItem } from '@/lib/seo/breadcrumbs';
import type { Product, ProductReview } from '@/types/product';

interface ProductJsonLdProps {
  product: Product;
  reviews: ProductReview[];
  breadcrumbItems: BreadcrumbItem[];
}

export function ProductJsonLd({ product, reviews, breadcrumbItems }: ProductJsonLdProps) {
  const crumbs = breadcrumbItemsToJsonLd(breadcrumbItems);
  return (
    <JsonLd
      data={[breadcrumbJsonLd(crumbs), productJsonLd(product, reviews)]}
    />
  );
}
