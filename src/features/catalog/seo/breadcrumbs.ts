import { CATALOG_ROOTS } from '../config/roots';
import type {
  CatalogBreadcrumbItem,
  CatalogCategoryRoot,
  CatalogIndustry,
  CatalogProductRef,
} from '../types';
import { categoryPath, industryPath, productPath } from '../utils/paths';

export function buildCategoryBreadcrumbs(root: CatalogCategoryRoot): CatalogBreadcrumbItem[] {
  const meta = CATALOG_ROOTS[root];
  return [
    { name: 'Home', path: '/' },
    { name: meta.shortLabel, path: categoryPath(root) },
  ];
}

export function buildIndustryBreadcrumbs(
  root: CatalogCategoryRoot,
  industry: Pick<CatalogIndustry, 'name' | 'slug'>
): CatalogBreadcrumbItem[] {
  return [
    ...buildCategoryBreadcrumbs(root),
    { name: industry.name, path: industryPath(root, industry.slug) },
  ];
}

export function buildProductBreadcrumbs(
  root: CatalogCategoryRoot,
  industry: Pick<CatalogIndustry, 'name' | 'slug'>,
  product: Pick<CatalogProductRef, 'title' | 'slug' | 'canonical_path'>
): CatalogBreadcrumbItem[] {
  const path =
    product.canonical_path?.trim() || productPath(root, industry.slug, product.slug);
  return [
    ...buildIndustryBreadcrumbs(root, industry),
    { name: product.title, path },
  ];
}
