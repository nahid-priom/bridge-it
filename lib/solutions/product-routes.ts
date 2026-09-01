import type { BitpProduct } from '@/types/bitp';
import { ROUTES } from '@/lib/routes';

export function getSolutionDetailPath(product: Pick<BitpProduct, 'slug' | 'category' | 'showroom_featured'>): string {
  const cat = product.category?.slug;
  if (cat === 'ecommerce-solutions') return ROUTES.ecommerceSolution(product.slug);
  if (cat === 'software-solutions' && product.showroom_featured) return ROUTES.softwareSolution(product.slug);
  return ROUTES.solution(product.slug);
}

export function getSolutionOrderPath(
  product: Pick<BitpProduct, 'slug' | 'category' | 'showroom_featured' | 'pricing_type'>,
  packageId?: string
): string {
  if (product.pricing_type === 'custom_quote') return ROUTES.solutionQuote(product.slug);
  const cat = product.category?.slug;
  const base =
    cat === 'ecommerce-solutions'
      ? ROUTES.ecommerceSolution(product.slug)
      : cat === 'software-solutions' && product.showroom_featured
        ? ROUTES.softwareSolution(product.slug)
        : ROUTES.solution(product.slug);
  const qs = packageId ? `?package=${packageId}` : '';
  return `${base}/order${qs}`;
}

export function getSolutionDemoPath(product: Pick<BitpProduct, 'internal_demo_slug' | 'demo_url' | 'category'>): string | null {
  if (product.internal_demo_slug) {
    const cat = product.category?.slug;
    if (cat === 'ecommerce-solutions') return ROUTES.ecommerceDemo(product.internal_demo_slug);
    if (cat === 'software-solutions') return ROUTES.softwareDemo(product.internal_demo_slug);
    if (product.demo_url?.startsWith('/demo/')) return product.demo_url;
  }
  return product.demo_url ?? null;
}
