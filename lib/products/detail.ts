import { products, getProductBySlug, getProductsByCategory } from '@/data/products';
import type { Product } from '@/types/product';

export { getProductBySlug, getProductsByCategory };

export function getSimilarProducts(product: Product, limit = 8): Product[] {
  const others = products.filter((p) => p.slug !== product.slug);

  const scored = others.map((p) => {
    let score = 0;
    if (p.categoryKey === product.categoryKey) score += 100;
    const sharedTags = p.tags.filter((t) => product.tags.includes(t)).length;
    score += sharedTags * 12;
    if (p.isPromoted) score += 8;
    if (p.isFeatured) score += 5;
    score += p.rating * 2;
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const picked: Product[] = [];
  const seen = new Set<string>();

  for (const { p } of scored) {
    if (picked.length >= limit) break;
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    picked.push(p);
  }

  return picked;
}

export function truncateDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
