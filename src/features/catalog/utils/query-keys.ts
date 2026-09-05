import type { CatalogCategoryRoot, CatalogProductListFilters } from '../types';

export const catalogKeys = {
  all: ['catalog'] as const,
  category: (root: CatalogCategoryRoot) => [...catalogKeys.all, 'category', root] as const,
  industries: (root: CatalogCategoryRoot) => [...catalogKeys.all, 'industries', root] as const,
  industry: (root: CatalogCategoryRoot, industrySlug: string) =>
    [...catalogKeys.all, 'industry', root, industrySlug] as const,
  products: (filters: CatalogProductListFilters) =>
    [...catalogKeys.all, 'products', filters] as const,
  product: (root: CatalogCategoryRoot, industrySlug: string, productSlug: string) =>
    [...catalogKeys.all, 'product', root, industrySlug, productSlug] as const,
  related: (root: CatalogCategoryRoot, productId: string) =>
    [...catalogKeys.all, 'related', root, productId] as const,
  faqs: (scopeKey: string) => [...catalogKeys.all, 'faqs', scopeKey] as const,
  redirect: (fromPath: string) => [...catalogKeys.all, 'redirect', fromPath] as const,
};
