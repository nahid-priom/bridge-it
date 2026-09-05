import { CATALOG_ROOTS } from '../config/roots';
import type {
  CatalogCategoryRoot,
  CatalogIndustry,
  CatalogPageMetadata,
  CatalogProductRef,
} from '../types';
import { categoryPath, industryPath, productPath } from '../utils/paths';

const SITE_SUFFIX = 'Bridge IT Park';

function trimDescription(value: string, max = 160): string {
  const cleaned = value.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

export function buildCategoryMetadata(root: CatalogCategoryRoot): CatalogPageMetadata {
  const meta = CATALOG_ROOTS[root];
  return {
    title: `${meta.label} | ${SITE_SUFFIX}`,
    description: trimDescription(meta.description),
    canonicalPath: categoryPath(root),
    h1: meta.label,
  };
}

export function buildIndustryMetadata(
  root: CatalogCategoryRoot,
  industry: CatalogIndustry
): CatalogPageMetadata {
  const rootMeta = CATALOG_ROOTS[root];
  const title =
    industry.seo_title?.trim() ||
    (root === 'software'
      ? `${industry.name} Software & ERP Solutions | ${SITE_SUFFIX}`
      : root === 'websites'
        ? `${industry.name} E-commerce Templates | ${SITE_SUFFIX}`
        : `${industry.name} ${rootMeta.shortLabel} | ${SITE_SUFFIX}`);
  const description = trimDescription(
    industry.seo_description?.trim() ||
      industry.short_description?.trim() ||
      industry.seo_intro?.trim() ||
      (root === 'software'
        ? `${industry.name} software and ERP solutions for Bangladesh businesses.`
        : `${industry.name} solutions from Bridge IT Park.`)
  );
  return {
    title,
    description,
    canonicalPath: industryPath(root, industry.slug),
    h1:
      industry.seo_h1?.trim() ||
      (root === 'software' ? `${industry.name} Software` : industry.name),
  };
}

export function buildProductMetadata(
  root: CatalogCategoryRoot,
  product: CatalogProductRef,
  industry?: Pick<CatalogIndustry, 'name' | 'slug'> | null
): CatalogPageMetadata {
  const rootMeta = CATALOG_ROOTS[root];
  const industryName = industry?.name || product.industry_name || rootMeta.shortLabel;
  const industrySlug = industry?.slug || product.industry_slug || 'general';

  const title =
    product.seo_title?.trim() ||
    (root === 'software'
      ? `${product.title} Software | ${SITE_SUFFIX}`
      : `${product.title} | ${industryName} | ${SITE_SUFFIX}`);

  const description = trimDescription(
    product.seo_description?.trim() ||
      product.short_description?.trim() ||
      (root === 'software'
        ? `${product.title} — ${industryName} ERP and operations software from Bridge IT Park.`
        : `${product.title} — ${industryName} ${rootMeta.shortLabel.toLowerCase()} from Bridge IT Park.`)
  );

  const canonical =
    product.canonical_path?.trim() || productPath(root, industrySlug, product.slug);

  return {
    title,
    description,
    canonicalPath: canonical,
    h1: product.title,
  };
}
