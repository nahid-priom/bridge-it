import type { CatalogCategoryRoot } from '../types';
import { CATALOG_ROOTS } from '../config/roots';

export function categoryPath(root: CatalogCategoryRoot): string {
  return CATALOG_ROOTS[root].path;
}

export function industryPath(root: CatalogCategoryRoot, industrySlug: string): string {
  return `${CATALOG_ROOTS[root].path}/${industrySlug}`;
}

export function productPath(
  root: CatalogCategoryRoot,
  industrySlug: string,
  productSlug: string
): string {
  return `${CATALOG_ROOTS[root].path}/${industrySlug}/${productSlug}`;
}

/** Normalize paths for redirect lookup (leading slash, no trailing slash except root). */
export function normalizeCatalogPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '/';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (withSlash.length > 1 && withSlash.endsWith('/')) {
    return withSlash.replace(/\/+$/, '');
  }
  return withSlash;
}
