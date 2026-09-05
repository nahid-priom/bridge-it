import 'server-only';

import { cache } from 'react';
import { getServerClient } from '@/lib/services/client';
import { CATALOG_ROOTS } from '../config/roots';
import type {
  CatalogCategoryRoot,
  CatalogProductKind,
  CatalogProductListFilters,
  CatalogProductListResult,
  CatalogProductRef,
} from '../types';
import { getIndustryByPath } from './industries';
import { getPublicAssetUrl } from '../utils/cover';

const DEFAULT_PAGE_SIZE = 12;

const SOFTWARE_PRODUCT_SELECT =
  'id, title, slug, short_description, industry_id, canonical_path, badge, business_size, package_tier, payment_type, cover_card_url, starting_price, price_suffix, currency, featured, popular, published, sort_order, seo_title, seo_description, primary_keyword, secondary_keywords, rating_avg, review_count, deleted_at';

const WEBSITES_PRODUCT_SELECT =
  'id, title, slug, short_description, industry_id, canonical_path, badge, business_size, package_tier, payment_type, cover_image_url, starting_price, currency, featured, published, sort_order, seo_title, seo_description, primary_keyword, secondary_keywords, rating_avg, review_count, deleted_at';

const MARKETING_PRODUCT_SELECT =
  'id, title, slug, short_description, industry_id, canonical_path, badge, business_size, package_tier, payment_type, cover_card_url, starting_price, price_suffix, currency, featured, popular, published, sort_order, seo_title, seo_description, primary_keyword, secondary_keywords, deleted_at';

type ProductTableRow = Record<string, unknown>;

function productSelect(root: CatalogCategoryRoot): string {
  if (root === 'software') return SOFTWARE_PRODUCT_SELECT;
  if (root === 'websites') return WEBSITES_PRODUCT_SELECT;
  return MARKETING_PRODUCT_SELECT;
}

function coverFromRow(root: CatalogCategoryRoot, row: ProductTableRow): string | null {
  if (root === 'websites') {
    return getPublicAssetUrl((row.cover_image_url as string | null) ?? null);
  }
  return getPublicAssetUrl((row.cover_card_url as string | null) ?? null);
}

function mapProductRef(
  root: CatalogCategoryRoot,
  row: ProductTableRow,
  industry?: { id: string; slug: string; name: string } | null
): CatalogProductRef {
  const cover_url = coverFromRow(root, row);
  return {
    kind: root,
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    industry_id: (row.industry_id as string | null) ?? industry?.id ?? null,
    industry_slug: industry?.slug ?? null,
    industry_name: industry?.name ?? null,
    canonical_path: (row.canonical_path as string | null) ?? null,
    short_description: (row.short_description as string | null) ?? null,
    cover_url,
    coverImageUrl: cover_url,
    starting_price: Number(row.starting_price ?? 0),
    price_suffix: String(row.price_suffix ?? ''),
    currency: String(row.currency ?? 'BDT'),
    badge: (row.badge as string | null) ?? null,
    business_size: (row.business_size as string | null) ?? null,
    package_tier: (row.package_tier as string | null) ?? null,
    payment_type: (row.payment_type as string | null) ?? null,
    featured: Boolean(row.featured),
    popular: root === 'websites' ? Boolean(row.featured) : Boolean(row.popular),
    published: Boolean(row.published),
    sort_order: Number(row.sort_order ?? 0),
    seo_title: (row.seo_title as string | null) ?? null,
    seo_description: (row.seo_description as string | null) ?? null,
    primary_keyword: (row.primary_keyword as string | null) ?? null,
    secondary_keywords: Array.isArray(row.secondary_keywords)
      ? (row.secondary_keywords as string[])
      : [],
    rating_avg: row.rating_avg != null ? Number(row.rating_avg) : null,
    review_count: row.review_count != null ? Number(row.review_count) : null,
  };
}

async function listProductsUncached(
  filters: CatalogProductListFilters,
  options: { includeDrafts?: boolean } = {}
): Promise<CatalogProductListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, Math.min(filters.pageSize ?? DEFAULT_PAGE_SIZE, 48));
  const offset = (page - 1) * pageSize;
  const empty: CatalogProductListResult = { items: [], total: 0, page, pageSize };

  const supabase = await getServerClient();
  if (!supabase) return empty;

  const root = filters.root;
  const table = CATALOG_ROOTS[root].productTable;
  let industryId = filters.industryId ?? null;
  let industryMeta: { id: string; slug: string; name: string } | null = null;

  if (!industryId && filters.industrySlug) {
    const industry = await getIndustryByPath(root, filters.industrySlug);
    if (!industry) return empty;
    industryId = industry.id;
    industryMeta = { id: industry.id, slug: industry.slug, name: industry.name };
  } else if (industryId) {
    const { data: industryRow } = await supabase
      .from('catalog_industries')
      .select('id, slug, name')
      .eq('id', industryId)
      .eq('category_root', root)
      .is('deleted_at', null)
      .maybeSingle();
    if (industryRow) {
      industryMeta = {
        id: String(industryRow.id),
        slug: String(industryRow.slug),
        name: String(industryRow.name),
      };
    }
  }

  let query = supabase
    .from(table)
    .select(productSelect(root), { count: 'exact' })
    .is('deleted_at', null);

  if (!options.includeDrafts) {
    query = query.eq('published', true);
  }

  if (industryId) {
    query = query.eq('industry_id', industryId);
  }

  if (filters.featured) query = query.eq('featured', true);
  // ecommerce_projects has no popular column — treat featured as popular proxy
  if (filters.popular) {
    if (root === 'websites') query = query.eq('featured', true);
    else query = query.eq('popular', true);
  }
  if (filters.businessSize) query = query.eq('business_size', filters.businessSize);
  if (filters.packageTier) query = query.eq('package_tier', filters.packageTier);

  if (filters.q) {
    const q = filters.q.replace(/,/g, ' ').trim();
    if (q) {
      query = query.or(`title.ilike.%${q}%,short_description.ilike.%${q}%`);
    }
  }

  const { data, count, error } = await query
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error('[catalog] listProducts', error.message);
    return empty;
  }

  // Attach industry meta for rows when listing across industries
  let industryById = new Map<string, { id: string; slug: string; name: string }>();
  if (!industryMeta) {
    const ids = [
      ...new Set(
        (data ?? [])
          .map((row) => (row as unknown as ProductTableRow).industry_id)
          .filter((id): id is string => Boolean(id))
          .map(String)
      ),
    ];
    if (ids.length > 0) {
      const { data: industries } = await supabase
        .from('catalog_industries')
        .select('id, slug, name')
        .in('id', ids)
        .is('deleted_at', null);
      industryById = new Map(
        (industries ?? []).map((row) => [
          String(row.id),
          { id: String(row.id), slug: String(row.slug), name: String(row.name) },
        ])
      );
    }
  }

  const items = (data ?? []).map((row) => {
    const record = row as unknown as ProductTableRow;
    const meta =
      industryMeta ??
      (record.industry_id ? industryById.get(String(record.industry_id)) ?? null : null);
    return mapProductRef(root, record, meta);
  });

  return { items, total: count ?? 0, page, pageSize };
}

const listProductsCached = cache(async (filtersKey: string, includeDrafts: boolean) => {
  const filters = JSON.parse(filtersKey) as CatalogProductListFilters;
  return listProductsUncached(filters, { includeDrafts });
});

export async function listProducts(
  filters: CatalogProductListFilters,
  options: { includeDrafts?: boolean } = {}
): Promise<CatalogProductListResult> {
  const key = JSON.stringify({
    root: filters.root,
    industryId: filters.industryId ?? null,
    industrySlug: filters.industrySlug ?? null,
    q: filters.q ?? null,
    featured: filters.featured ?? null,
    popular: filters.popular ?? null,
    businessSize: filters.businessSize ?? null,
    packageTier: filters.packageTier ?? null,
    page: filters.page ?? null,
    pageSize: filters.pageSize ?? null,
  });
  return listProductsCached(key, Boolean(options.includeDrafts));
}

async function getProductByPathUncached(
  root: CatalogCategoryRoot,
  industrySlug: string,
  productSlug: string,
  includeDrafts: boolean
): Promise<CatalogProductRef | null> {
  const industry = await getIndustryByPath(root, industrySlug, { includeInactive: includeDrafts });
  if (!industry) return null;

  const supabase = await getServerClient();
  if (!supabase) return null;

  const table = CATALOG_ROOTS[root].productTable;
  let query = supabase
    .from(table)
    .select(productSelect(root))
    .eq('slug', productSlug)
    .eq('industry_id', industry.id)
    .is('deleted_at', null);

  if (!includeDrafts) {
    query = query.eq('published', true);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error('[catalog] getProductByPath', error.message);
    return null;
  }
  if (!data) return null;

  return mapProductRef(root, data as unknown as ProductTableRow, {
    id: industry.id,
    slug: industry.slug,
    name: industry.name,
  });
}

const getProductByPathCached = cache(getProductByPathUncached);

export async function getProductByPath(
  root: CatalogCategoryRoot,
  industrySlug: string,
  productSlug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<CatalogProductRef | null> {
  return getProductByPathCached(root, industrySlug, productSlug, Boolean(options.includeDrafts));
}

export async function getProductRefById(
  kind: CatalogProductKind,
  id: string,
  options: { includeDrafts?: boolean } = {}
): Promise<CatalogProductRef | null> {
  const supabase = await getServerClient();
  if (!supabase) return null;

  const table = CATALOG_ROOTS[kind].productTable;
  let query = supabase
    .from(table)
    .select(productSelect(kind))
    .eq('id', id)
    .is('deleted_at', null);

  if (!options.includeDrafts) {
    query = query.eq('published', true);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  const row = data as unknown as ProductTableRow;
  let industryMeta: { id: string; slug: string; name: string } | null = null;
  if (row.industry_id) {
    const { data: industryRow } = await supabase
      .from('catalog_industries')
      .select('id, slug, name')
      .eq('id', String(row.industry_id))
      .is('deleted_at', null)
      .maybeSingle();
    if (industryRow) {
      industryMeta = {
        id: String(industryRow.id),
        slug: String(industryRow.slug),
        name: String(industryRow.name),
      };
    }
  }

  return mapProductRef(kind, row, industryMeta);
}

export { mapProductRef, productSelect };
